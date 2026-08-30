# JWT { .section-fundamentos }

> Una API no puede usar sesiones: cada petición llega sola, sin memoria de la anterior. Un **JSON Web Token** resuelve eso llevando la identidad del usuario dentro de la propia petición, firmada por el servidor.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require lexik/jwt-authentication-bundle
    ```

Requisitos: Symfony 6.4 o superior y la extensión `openssl` de PHP.

## Generar las claves {: .topic-title }

!!! example "💻 Comandos — claves"
    ```bash
    symfony console lexik:jwt:generate-keypair
    symfony console lexik:jwt:generate-keypair --skip-if-exists   # útil en despliegues
    ```

Crea el par de claves en `config/jwt/private.pem` y `config/jwt/public.pem`.

---

## Qué es un JWT {: .topic-title }

Un JWT es una cadena de texto con tres partes separadas por puntos:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0MzQ3Mjc1MzYsInVzZXJuYW1lIjoiYW5hIn0.nh0L_wuJy6ZK...
└──────── cabecera ────────┘ └──────── contenido ────────┘ └──── firma ────┘
```

- **Cabecera** — qué algoritmo firma el token.
- **Contenido** (*payload*) — quién es el usuario, sus roles y cuándo caduca.
- **Firma** — el resultado de firmar las dos partes anteriores con la clave privada del servidor.

El servidor no necesita guardar nada: cuando recibe un token, comprueba la firma con la clave pública. Si cuadra, sabe que ese token lo emitió él y que nadie lo ha tocado.

!!! danger "Un JWT va FIRMADO, no cifrado"
    Las dos primeras partes son simplemente texto codificado en base64. Cualquiera que tenga el token puede leer su contenido pegándolo en [jwt.io](https://jwt.io) o con un `atob()` en la consola del navegador.

    La firma garantiza que **nadie lo ha modificado**, no que nadie pueda leerlo.

    Consecuencia práctica: en el contenido de un token nunca van datos sensibles. Ni la contraseña, ni el DNI, ni información privada. Solo lo imprescindible para identificar al usuario.

### Firmado o cifrado: JWS y JWE

El estándar define dos formas de proteger un token, y conviene distinguirlas porque el nombre "JWT" se usa para las dos:

| Formato | Qué garantiza | Se puede leer |
|---|---|---|
| **JWS** (*JSON Web Signature*) | Que nadie lo ha modificado | **Sí**, por cualquiera |
| **JWE** (*JSON Web Encryption*) | Que nadie lo ha modificado **ni leído** | No, solo el destinatario |

Lo que emite el paquete de Symfony por defecto es un **JWS**: firmado, legible. Es lo habitual, porque el contenido de un token de autenticación no suele ser secreto —un identificador y unos roles— y el cifrado añade coste sin aportar nada.

### Los *claims* estándar

Las afirmaciones que van dentro del contenido se llaman *claims*. El estándar reserva siete nombres con significado fijo:

| Claim | Significa | Para qué sirve |
|---|---|---|
| `iss` | *issuer* — quién lo emitió | Distinguir el origen cuando hay varios emisores |
| `sub` | *subject* — de quién habla | El identificador del usuario |
| `aud` | *audience* — para quién es | Un token emitido para otra aplicación se rechaza |
| `exp` | *expiration* — hasta cuándo vale | La caducidad; es lo que hace que `token_ttl` funcione |
| `nbf` | *not before* — desde cuándo vale | Tokens que se emiten con antelación |
| `iat` | *issued at* — cuándo se emitió | Saber la edad del token |
| `jti` | *JWT ID* — identificador único | Detectar reenvíos del mismo token |

El paquete rellena `iat` y `exp` por su cuenta, y añade el identificador y los roles del usuario. El resto se configuran si el caso lo pide.

!!! tip "Validar `aud` importa cuando hay más de una aplicación"
    Si dos servicios comparten el mismo emisor y ninguno comprueba `aud`, un token emitido para el primero sirve también en el segundo. El usuario entra en un sitio para el que nadie le dio permiso.

    Con un único backend no es un problema. En cuanto aparece un segundo servicio, sí.

!!! warning "Un JWT emitido no se puede revocar"
    No hay ninguna lista en el servidor: mientras la firma sea válida y no haya caducado, el token vale. Si echas a un usuario o le cambias los permisos, su token sigue funcionando hasta que expire.

    De ahí las dos medidas que van siempre juntas: **caducidad corta** (una hora, no un mes) y **token de refresco** para renovar sin volver a pedir credenciales.

---

## Configuración {: .topic-title }

El paquete deja estas variables en el `.env`:

```bash
# .env
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=la-frase-que-protege-la-clave-privada
```

```yaml
# config/packages/lexik_jwt_authentication.yaml
lexik_jwt_authentication:
    secret_key: '%env(resolve:JWT_SECRET_KEY)%'
    public_key: '%env(resolve:JWT_PUBLIC_KEY)%'
    pass_phrase: '%env(JWT_PASSPHRASE)%'
    token_ttl: 3600        # segundos; una hora
```

!!! danger "`config/jwt/` y la frase de paso NO van al repositorio"
    La clave privada firma tokens. Quien la tenga puede fabricar un token válido para cualquier usuario, con cualquier rol, sin conocer ninguna contraseña.

    Comprueba que `.gitignore` incluye `/config/jwt/`, y guarda `JWT_PASSPHRASE` en `.env.local` o en las variables de entorno del servidor, nunca en `.env`.

    En cada entorno se generan sus propias claves. Las de tu portátil no viajan a producción.

---

## El cortafuegos {: .topic-title }

Hacen falta **dos** cortafuegos: uno que reparte tokens y otro que los valida.

```yaml
# config/packages/security.yaml
security:
    firewalls:
        login:
            pattern: ^/api/login
            stateless: true
            json_login:
                check_path: /api/login_check
                success_handler: lexik_jwt_authentication.handler.authentication_success
                failure_handler: lexik_jwt_authentication.handler.authentication_failure

        api:
            pattern: ^/api
            stateless: true
            jwt: ~

        main:
            lazy: true
            provider: app_user_provider

    access_control:
        - { path: ^/api/login, roles: PUBLIC_ACCESS }
        - { path: ^/api,       roles: IS_AUTHENTICATED_FULLY }
```

```yaml
# config/routes.yaml
api_login_check:
    path: /api/login_check
```

!!! danger "El orden de los cortafuegos aquí no es negociable"
    `login` va **antes** que `api`, y `main` **después**. Si `^/api` se declara primero, captura también `/api/login` y exige un token para poder pedir un token: la API queda inaccesible y el error no explica por qué.

    Es el mismo principio que ya viste en [cortafuegos](../03-firewalls/index.md): solo se activa uno, y gana el primero que coincide.

!!! info "La ruta existe pero no tiene controlador"
    `api_login_check` se declara en `routes.yaml` sin apuntar a ningún método. Es intencionado: el cortafuegos intercepta la petición antes de que llegue a ningún sitio, valida las credenciales y responde con el token.

    Si te sale un error de "no hay controlador para esta ruta", es que el `check_path` del cortafuegos no coincide con la ruta declarada.

Cuando el identificador no se llama `username`, hay que decirlo:

```yaml
json_login:
    check_path: /api/login_check
    username_path: email
    password_path: password
```

---

## Usarlo {: .topic-title }

Primero se pide el token:

```bash
curl -X POST -H "Content-Type: application/json" \
     https://localhost:8000/api/login_check \
     -d '{"username":"ana@ejemplo.com","password":"secreto"}'
```

```json
{ "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

Y después se envía en cada petición:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \
     https://localhost:8000/api/tareas
```

Desde el navegador es exactamente lo que se explica en la [capa de API](../../../js/05-asincronia/07-capa-de-api/index.md) del bloque de JavaScript:

```js
const response = await fetch("/api/tareas", {
    headers: { "Authorization": `Bearer ${token}` }
});
```

Dentro del controlador, el usuario está disponible como en cualquier otra parte:

```php
#[Route('/api/perfil', methods: ['GET'])]
public function perfil(#[CurrentUser] User $usuario): JsonResponse
{
    return $this->json([
        'id' => $usuario->getId(),
        'email' => $usuario->getEmail(),
        'roles' => $usuario->getRoles(),
    ]);
}
```

---

## Tokens de refresco {: .topic-title }

Un token que dura una hora obliga a volver a escribir la contraseña cada hora. Un token que dura un mes es un riesgo, porque no se puede revocar.

La solución son **dos tokens**: el JWT corto para trabajar, y un token de refresco largo que solo sirve para pedir uno nuevo. Ese sí se guarda en base de datos, así que **sí se puede revocar**.

```bash
composer require gesdinet/jwt-refresh-token-bundle
```

```yaml
# config/packages/gesdinet_jwt_refresh_token.yaml
gesdinet_jwt_refresh_token:
    ttl: 2592000                 # 30 días
    user_identity_field: email
    entity:
        class: App\Entity\RefreshToken
    path: /api/token/refresh
```

Ahora el acceso devuelve los dos:

```json
{
    "token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "a1b2c3d4e5f6g7h8i9j0..."
}
```

Cuando el JWT caduca, el cliente pide otro contra `/api/token/refresh` enviando el de refresco, sin molestar al usuario.

!!! info "Dos paquetes con el mismo propósito"
    El paquete se instala como `gesdinet/jwt-refresh-token-bundle`, que es el que usan los apuntes. La documentación de Lexik enlaza al repositorio de `markitosgv/JWTRefreshTokenBundle`, que es donde se mantiene hoy.

    Comprueba cuál está vivo antes de empezar un proyecto nuevo; el nombre del paquete de Composer es el que manda.

!!! tip "El token de refresco es lo que hace revocable el sistema"
    Sin él, "cerrar la sesión" en una API con JWT es una ilusión: borras el token del cliente, pero el que ya estaba emitido sigue siendo válido.

    Con tokens de refresco guardados en base de datos, cerrar sesión es borrar la fila. El JWT en curso caduca en una hora como mucho, y no se puede renovar.

---

## CORS {: .topic-title }

Si el frontend está en otro dominio —lo normal cuando la API y la interfaz son proyectos separados—, el navegador bloqueará las peticiones salvo que el servidor lo autorice.

```bash
composer require nelmio/cors-bundle
```

```yaml
# config/packages/nelmio_cors.yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['%env(CORS_ALLOW_ORIGIN)%']
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
        allow_headers: ['Content-Type', 'Authorization']
        max_age: 3600
    paths:
        '^/api/': ~
```

```bash
# .env
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
```

!!! danger "`Authorization` tiene que estar en `allow_headers`"
    Es el fallo más repetido al montar una API con JWT. Si esa cabecera no está autorizada, el navegador ni siquiera envía la petición real: hace primero una consulta previa (`OPTIONS`), ve que la cabecera no está permitida y aborta.

    El síntoma engaña: en `curl` funciona perfectamente y desde el navegador falla siempre, porque `curl` no aplica la política de CORS.

!!! warning "`allow_origin: ['*']` no sirve con credenciales, y no debe usarse en producción"
    Un comodín acepta peticiones de cualquier web del mundo. En desarrollo pasa; en producción se pone la lista concreta de dominios que deben poder llamar a tu API.

---

## Diagnóstico {: .topic-title }

| Síntoma | Causa habitual |
|---|---|
| `401` en todas las peticiones tras desplegar | Las claves no se han generado en el servidor |
| `401` solo en producción | `JWT_PASSPHRASE` distinta de la que firmó las claves |
| Funciona con `curl` y falla en el navegador | CORS: falta `Authorization` en `allow_headers` |
| `401` con un token que parece correcto | El servidor web se está comiendo la cabecera |
| "No hay controlador para esta ruta" | El `check_path` no coincide con la ruta declarada |
| `500` sin mensaje | Permisos de `var/`, o caché sin limpiar en producción |

!!! danger "Apache borra la cabecera `Authorization`"
    Apache descarta esa cabecera si no tiene el formato de autenticación HTTP básica. El token se envía, pero nunca llega a PHP.

    ```apache
    SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
    ```
    Va en la configuración del *VirtualHost* o en el `.htaccess`. Es un fallo clásico de "en local funciona y en el servidor no", porque el servidor de desarrollo de Symfony no lo hace.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `config/jwt/` en el `.gitignore` | Subir la clave privada al repositorio |
| Generar claves propias en cada entorno | Copiar las de desarrollo a producción |
| `token_ttl` corto más token de refresco | Un JWT de treinta días para evitar renovar |
| Cortafuegos `login` antes que `api` | Pedir un token para poder pedir un token |
| `stateless: true` en los dos | Crear sesiones en una API con tokens |
| Solo identificador y roles en el contenido | Meter datos personales en un token legible |
| `Authorization` en `allow_headers` de CORS | Probar solo con `curl` y darlo por bueno |
| Lista concreta de orígenes en producción | `allow_origin: ['*']` en el servidor real |
| `SetEnvIf` si el servidor es Apache | Buscar el fallo en el código cuando es del servidor |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **LexikJWTAuthenticationBundle** | https://symfony.com/bundles/LexikJWTAuthenticationBundle/current/index.html |
| 📙 **Institut Montilivi — API REST amb Symfony** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/webservice/ |
| 📄 **RFC 7519 — JSON Web Token** | https://datatracker.ietf.org/doc/html/rfc7519 |
