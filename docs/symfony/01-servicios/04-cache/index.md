# Cachear resultados costosos { .section-fundamentos }

> Si un cálculo o una llamada externa da siempre el mismo resultado durante un rato, no tiene sentido repetirlo en cada petición. `CacheInterface` guarda el resultado la primera vez y lo devuelve ya hecho las siguientes, hasta que caduca.

---

## Instalar {: .topic-title }

El componente de caché viene en `symfony/framework-bundle`, así que en un proyecto `--webapp` ya lo tienes. Si no:

!!! example "💻 Comando"
    ```bash
    composer require symfony/cache
    ```

## El patrón `get()` con callback {: .topic-title }

La forma recomendada es una sola llamada: le pides un valor por su **clave**; si no está en caché, ejecuta la función que le pasas, guarda lo que devuelve y te lo da.

```php
// src/Service/ExchangeRates.php
namespace App\Service;

use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExchangeRates
{
    public function __construct(
        private CacheInterface $cache,
        private HttpClientInterface $http,
    ) {
    }

    public function eurTo(string $currency): float
    {
        return $this->cache->get(
            'exchange_rate_' . $currency,          // 1. la clave
            function (ItemInterface $item) use ($currency): float {
                $item->expiresAfter(3600);         // 3. cuánto vive: 1 hora

                $data = $this->http                // 2. cómo se calcula si falta
                    ->request('GET', "https://api.example.com/rates/$currency")
                    ->toArray();

                return (float) $data['rate'];
            }
        );
    }
}
```

Qué pasa en cada petición:

| Situación | Qué hace `get()` |
|---|---|
| La clave **no está** (primera vez, o caducó) | Ejecuta el callback, guarda el resultado con la caducidad que pusiste, y lo devuelve |
| La clave **está** y no ha caducado | Devuelve el valor guardado. El callback **no se ejecuta** — ni la llamada HTTP ni el cálculo |

## Elegir la caducidad {: .topic-title }

```php
$item->expiresAfter(3600);                          // segundos
$item->expiresAfter(\DateInterval::createFromDateString('1 day'));
$item->expiresAt(new \DateTimeImmutable('tomorrow 03:00'));
```

Piensa en cuánto puede estar "desactualizado" el dato sin que importe: un tipo de cambio, minutos u horas; el menú de navegación que sale de la BD, hasta que alguien lo edite.

## Borrar una entrada a mano {: .topic-title }

Cuando el dato de origen cambia (el usuario edita algo que estaba cacheado), se invalida la clave para que la próxima lectura lo recalcule:

```php
$this->cache->delete('exchange_rate_USD');
```

Para eso `CacheInterface` no basta; se inyecta `Psr\Cache\CacheItemPoolInterface` o `Symfony\Contracts\Cache\TagAwareCacheInterface` si quieres borrar por **etiquetas** (varias claves relacionadas de una vez).

## Dónde se guarda {: .topic-title }

Lo decide `config/packages/cache.yaml`. En desarrollo, archivos en `var/cache/`. En producción se apunta a algo compartido y rápido:

```yaml
framework:
    cache:
        app: cache.adapter.redis
        default_redis_provider: '%env(REDIS_URL)%'
```

!!! tip "La clave es un identificador, no una frase"
    Las claves solo admiten letras, números y `._-`. Nada de espacios, `/`, `{}`, `@` ni `:` (algunos adaptadores los reservan). Si la clave depende de varios datos, únelos tú: `"user_stats_{$userId}_{$mes}"`. Y que sea **estable**: si metes un `time()` o un `uniqid()` en la clave, nunca habrá acierto de caché.

!!! warning "No caches lo que depende del usuario en una clave compartida"
    Cachear "el dashboard" con la clave `dashboard` sirve el del primer usuario a todos. Si el resultado varía por usuario, la clave tiene que incluir su id — o directamente no se cachea ahí.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📘 **Symfony — Cache** | [symfony.com/doc/current/cache.html](https://symfony.com/doc/current/cache.html) |
| 📘 **Symfony — Cache: The Cache Contracts** | [symfony.com/doc/current/cache.html#cache-contracts](https://symfony.com/doc/current/cache.html#cache-contracts) |
