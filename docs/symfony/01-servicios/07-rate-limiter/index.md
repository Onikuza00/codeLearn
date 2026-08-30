# Limitar peticiones (Rate Limiter) { .section-fundamentos }

> Un *rate limiter* controla cuántas veces se puede hacer algo en una ventana de tiempo: 5 intentos de login por minuto, 100 llamadas a la API por hora y usuario. Symfony lo expone como un servicio que consultas antes de dejar pasar la acción.

---

## Instalar {: .topic-title }

!!! example "💻 Comando"
    ```bash
    composer require symfony/rate-limiter
    ```

## Definir un límite {: .topic-title }

Cada límite se declara en `config/packages/rate_limiter.yaml` con un nombre y una política:

```yaml
framework:
    rate_limiter:
        login:
            policy: 'sliding_window'   # ventana deslizante: los últimos 60 s reales
            limit: 5                   # 5 intentos
            interval: '1 minute'

        api:
            policy: 'token_bucket'     # cubo de fichas: permite ráfagas y se rellena solo
            limit: 100                 # capacidad del cubo
            rate: { interval: '1 minute', amount: 20 }   # +20 fichas por minuto
```

| Política | Cómo se comporta |
|---|---|
| `fixed_window` | Cuenta por bloques fijos (minuto :00–:59). Simple, pero permite el doble en el borde entre bloques |
| `sliding_window` | Cuenta los últimos *N* segundos reales en cada momento. Lo habitual para login |
| `token_bucket` | Un cubo de fichas que se rellena a ritmo constante; tolera ráfagas cortas. Bueno para APIs |

## Consumir el límite {: .topic-title }

Symfony crea un *factory* por cada límite, inyectable por nombre: `login` → `$loginLimiter` (con el sufijo `Limiter`).

```php
// src/Controller/SecurityController.php
use Symfony\Component\HttpFoundation\RateLimiter\RateLimiterFactory;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

#[Route('/login', name: 'login', methods: ['POST'])]
public function login(Request $request, RateLimiterFactory $loginLimiter): Response
{
    // una "cuota" por IP — o por email, o por usuario
    $limiter = $loginLimiter->create($request->getClientIp());

    $limit = $limiter->consume(1);   // intenta gastar 1

    if (!$limit->isAccepted()) {
        throw new TooManyRequestsHttpException(
            $limit->getRetryAfter()->getTimestamp() - time(),
            'Demasiados intentos. Espera un momento.',
        );
    }

    // ... seguir con la comprobación de credenciales
}
```

| Llamada | Qué devuelve |
|---|---|
| `->create($clave)` | El limitador para *esa* clave concreta (una IP, un id de usuario). Cada clave lleva su propia cuenta |
| `->consume(1)` | Un objeto `RateLimit`: intenta gastar 1 unidad |
| `->isAccepted()` | `true` si quedaba cuota; `false` si se pasó |
| `->getRetryAfter()` | Un `\DateTimeImmutable`: cuándo se podrá volver a intentar |

`TooManyRequestsHttpException` produce una respuesta **429** con la cabecera `Retry-After`, que es justo lo que un cliente de API espera para saber cuánto esperar.

## Por qué en un servicio y no suelto {: .topic-title }

Si el mismo límite se aplica en varios sitios (el login normal y el login por API), envuélvelo:

```php
// src/Service/LoginThrottler.php
namespace App\Service;

use Symfony\Component\HttpFoundation\RateLimiter\RateLimiterFactory;

class LoginThrottler
{
    public function __construct(
        private RateLimiterFactory $loginLimiter,
    ) {
    }

    public function assertNotBlocked(string $key): void
    {
        if (!$this->loginLimiter->create($key)->consume(1)->isAccepted()) {
            throw new \RuntimeException('Bloqueado por demasiados intentos.');
        }
    }
}
```

Así la política vive en un sitio y los controladores solo dicen "comprueba".

!!! tip "Elige bien la clave del `create()`"
    Limitar por IP frena a un atacante suelto, pero también agrupa a todos los usuarios detrás del mismo NAT o proxy. Limitar por email/usuario es más justo, pero un atacante puede rotar emails. Lo habitual en login: **las dos** — un límite por IP más ancho y otro por email más estrecho.

!!! warning "El almacén tiene que ser compartido"
    Con varias instancias de la aplicación (o varios workers), el contador del rate limiter debe estar en algo común (Redis, base de datos). Si cada proceso lleva su cuenta en memoria local, el límite real es *N* veces el que configuraste. Se ajusta con la opción `storage` / `cache_pool` del límite.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📘 **Symfony — Rate Limiter** | [symfony.com/doc/current/rate_limiter.html](https://symfony.com/doc/current/rate_limiter.html) |
| 📘 **Symfony — Login Throttling** | [symfony.com/doc/current/security.html#limiting-login-attempts](https://symfony.com/doc/current/security.html#limiting-login-attempts) |
