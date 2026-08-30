# Llamar a una API externa { .section-fundamentos }

> `HttpClientInterface` es el cliente HTTP de Symfony para hablar con APIs de terceros. Se inyecta en un servicio, y ese servicio es el único sitio de tu código que sabe la URL, la clave y el formato de esa API — el resto de la aplicación llama a un método tuyo con nombres de tu dominio.

---

## Instalar {: .topic-title }

!!! example "💻 Comando"
    ```bash
    composer require symfony/http-client
    ```

## Una petición GET {: .topic-title }

```php
// src/Service/WeatherClient.php
namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class WeatherClient
{
    public function __construct(
        private HttpClientInterface $http,
        #[Autowire('%env(WEATHER_API_KEY)%')]
        private string $apiKey,
    ) {
    }

    public function current(string $city): array
    {
        $response = $this->http->request('GET', 'https://api.example.com/v1/weather', [
            'query' => [
                'city' => $city,
                'key' => $this->apiKey,
            ],
        ]);

        return $response->toArray();   // decodifica el JSON a array asociativo
    }
}
```

| Parte | Qué hace |
|---|---|
| `request('GET', $url, [...])` | Prepara la petición. **No la lanza todavía** — Symfony la envía de forma perezosa |
| `'query' => [...]` | Parámetros que van en la URL: `?city=Girona&key=...` |
| `$response->toArray()` | Lanza la petición si no se había lanzado, y devuelve el cuerpo JSON como array |

Otras opciones del tercer argumento:

```php
$this->http->request('POST', $url, [
    'json' => ['name' => 'Pau', 'active' => true],   // cuerpo JSON + Content-Type automático
    'headers' => ['Authorization' => 'Bearer ' . $token],
    'timeout' => 5,        // segundos hasta cortar si no responde
]);
```

## Manejar errores {: .topic-title }

`toArray()` y `getContent()` **lanzan una excepción** si la respuesta no es 2xx. No hace falta comprobar el código a mano, pero sí capturar:

```php
use Symfony\Contracts\HttpClient\Exception\HttpExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

public function current(string $city): ?array
{
    try {
        return $this->http
            ->request('GET', 'https://api.example.com/v1/weather', [
                'query' => ['city' => $city, 'key' => $this->apiKey],
            ])
            ->toArray();
    } catch (HttpExceptionInterface $e) {
        // respondió, pero con 4xx o 5xx
        $this->logger->warning('API del tiempo devolvió error', [
            'status' => $e->getResponse()->getStatusCode(),
        ]);
        return null;
    } catch (TransportExceptionInterface $e) {
        // ni siquiera respondió (DNS, timeout, red caída)
        $this->logger->error('No se pudo contactar con la API del tiempo');
        return null;
    }
}
```

| Excepción | Qué significó |
|---|---|
| `HttpExceptionInterface` | La API respondió con 4xx/5xx. `$e->getResponse()` te da el cuerpo del error |
| `TransportExceptionInterface` | La petición no llegó a completarse: timeout, DNS, sin conexión |

!!! tip "Pasar el status crudo al usuario es filtrar detalles internos"
    Si la API de terceros devuelve un 500, tu endpoint no debería devolver también un 500 con su mensaje. Decide qué significa para tu aplicación: quizá es un `null` y una tarjeta vacía, quizá un 503 tuyo con "servicio no disponible, inténtalo luego". El servicio traduce el fallo externo al lenguaje de tu dominio.

## Cliente con base y cabeceras fijas {: .topic-title }

Si siempre hablas con la misma API, en vez de repetir la URL y el token en cada `request()` se define un **scoped client** en `config/packages/framework.yaml`:

```yaml
framework:
    http_client:
        scoped_clients:
            weather.client:
                base_uri: 'https://api.example.com/v1/'
                headers:
                    Authorization: 'Bearer %env(WEATHER_API_KEY)%'
```

Y se inyecta por nombre:

```php
public function __construct(
    #[Autowire(service: 'weather.client')]
    private HttpClientInterface $http,
) {
}

// ahora las rutas son relativas a base_uri
$this->http->request('GET', 'weather', ['query' => ['city' => $city]]);
```

## Reintentar cuando falla {: .topic-title }

Para fallos transitorios (un 503 puntual, un timeout suelto) Symfony trae un decorador de reintentos con espera creciente:

```yaml
framework:
    http_client:
        default_options:
            retry_failed:
                max_retries: 3
                delay: 1000        # ms antes del primer reintento (se duplica cada vez)
```

No reintentes peticiones que **cambian datos** (POST que crea algo) salvo que la API sea idempotente — podrías crear el recurso dos veces.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📘 **Symfony — HTTP Client** | [symfony.com/doc/current/http_client.html](https://symfony.com/doc/current/http_client.html) |
| 📘 **Symfony — HTTP Client: Handling Exceptions** | [symfony.com/doc/current/http_client.html#handling-exceptions](https://symfony.com/doc/current/http_client.html#handling-exceptions) |
| 🎥 **SymfonyCasts — HTTP Client** | [symfonycasts.com/screencast/last-stack/http-client](https://symfonycasts.com/screencast/last-stack/http-client) |
