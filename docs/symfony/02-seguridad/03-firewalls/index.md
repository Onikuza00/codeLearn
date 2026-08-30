# Cortafuegos { .section-fundamentos }

> El cortafuegos (*firewall*) es la pieza central de la seguridad: decide qué zonas de la aplicación están protegidas y **cómo** se identifica quien entra. Es la sección de `security.yaml` que más errores produce.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:security:form-login
    ```

Genera el `SecurityController` con las rutas `/login` y `/logout`, la plantilla de acceso, y añade la configuración `form_login` al cortafuegos.

---

## Qué es un cortafuegos {: .topic-title }

No es un filtro que bloquea peticiones. Es un **contexto de autenticación**: una zona de la aplicación con sus propias reglas sobre cómo se identifican los usuarios.

```yaml
security:
    firewalls:
        dev:
            pattern: ^/(_profiler|_wdt|assets|build)/
            security: false
        main:
            lazy: true
            provider: app_user_provider
```

!!! danger "Solo se activa UN cortafuegos por petición"
    Symfony recorre la lista **en orden** y se queda con el primero cuyo `pattern` coincida. El resto ni se miran.

    De ahí dos consecuencias que explican casi todos los problemas de configuración:

    1. **El orden importa.** Un cortafuegos sin `pattern` coincide con todo, así que va siempre el último.
    2. **No se combinan.** No puedes tener un cortafuegos que aporte el acceso por formulario y otro que aporte el acceso por token para la misma URL: hay que declarar los dos autenticadores dentro del mismo.

### El cortafuegos `dev`

```yaml
dev:
    pattern: ^/(_profiler|_wdt|assets|build)/
    security: false
```

Desactiva la seguridad para las herramientas de desarrollo. Sin él, en cuanto proteges la aplicación entera, el perfilador y la barra de depuración dejan de cargar y pierdes justo la herramienta que necesitas para averiguar por qué.

No lo borres. En producción esas rutas no existen, así que no supone ningún riesgo.

### `lazy: true`

Evita que se arranque la sesión si nadie pregunta por el usuario. Importa porque una petición con sesión iniciada **no se puede cachear**: mientras nadie consulte `app.user` ni haya una comprobación de permisos, la página sigue siendo cacheable.

---

## Autenticadores {: .topic-title }

Dentro del cortafuegos se declara **cómo** se autentica. Cada clave es un autenticador distinto, y pueden convivir varios.

| Autenticador | Para qué |
|---|---|
| `form_login` | Formulario de acceso clásico, con sesión |
| `json_login` | API que recibe credenciales en JSON |
| `http_basic` | Usuario y contraseña en la cabecera; herramientas internas |
| `login_link` | Enlace de un solo uso enviado por correo, sin contraseña |
| `remember_me` | Cookie de larga duración que sobrevive al cierre del navegador |

### `form_login`

```yaml
firewalls:
    main:
        lazy: true
        provider: app_user_provider
        form_login:
            login_path: app_login
            check_path: app_login
            enable_csrf: true
        logout:
            path: /logout
            target: app_homepage
```

El controlador que genera el maker no comprueba credenciales: solo muestra el formulario y los errores del intento anterior.

```php
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    #[Route('/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        return $this->render('security/login.html.twig', [
            'last_username' => $authenticationUtils->getLastUsername(),
            'error' => $authenticationUtils->getLastAuthenticationError(),
        ]);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('El cortafuegos intercepta esta ruta.');
    }
}
```

La plantilla tiene tres campos con nombres obligatorios:

```twig
<form action="{{ path('app_login') }}" method="post">
    <input type="text" name="_username" value="{{ last_username }}" required>
    <input type="password" name="_password" required>
    <input type="hidden" name="_csrf_token" value="{{ csrf_token('authenticate') }}">

    <button type="submit">Entrar</button>
</form>
```

!!! danger "Los nombres `_username`, `_password` y `_csrf_token` no son opcionales"
    El autenticador los busca literalmente. Si el campo se llama `email` en vez de `_username`, el acceso falla siempre con "credenciales no válidas" aunque sean correctas, y el mensaje no da ninguna pista de por qué.

    Se pueden cambiar, pero hay que declararlo:

    ```yaml
    form_login:
        username_parameter: email
        password_parameter: clave
    ```

!!! warning "El método `logout()` está vacío a propósito"
    El cortafuegos intercepta esa ruta antes de que llegue al controlador. La excepción del cuerpo es un aviso para quien lea el código, y solo se lanza si la configuración de `logout` falta o el `path` no coincide.

    Si al pulsar "cerrar sesión" ves esa excepción, el problema es que `logout.path` no apunta a esa ruta.

### `json_login`

Para una API que recibe credenciales en el cuerpo de la petición:

```yaml
firewalls:
    api_login:
        pattern: ^/api/login
        stateless: true
        json_login:
            check_path: api_login
```

```php
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/login', name: 'api_login', methods: ['POST'])]
public function login(#[CurrentUser] ?User $user): Response
{
    if (null === $user) {
        return $this->json(['message' => 'Faltan credenciales'], Response::HTTP_UNAUTHORIZED);
    }

    return $this->json([
        'user' => $user->getUserIdentifier(),
        'token' => $this->generarToken($user),
    ]);
}
```

El cliente envía:

```json
{ "username": "ana@ejemplo.com", "password": "secreto" }
```

!!! info "Aquí es donde encajan los tokens JWT"
    Symfony autentica al usuario y te deja generar lo que quieras como token. Los paquetes de JWT se enganchan en este punto: el controlador de acceso devuelve el token firmado, y otro cortafuegos —el de las rutas `^/api`— lo valida en cada petición posterior.

    La pieza que Symfony aporta es la autenticación; el formato del token lo eliges tú.

### `stateless: true`

Una API con tokens no debe crear sesión: cada petición se autentica sola con lo que trae. `stateless: true` desactiva la sesión para ese cortafuegos.

!!! warning "Sin `stateless: true` tu API crea una sesión por petición"
    Y con ella una cookie y un fichero de sesión en el servidor. Con tráfico real eso llena el disco de sesiones que nadie va a reutilizar, y hace que la API deje de ser cacheable.

    Regla: cortafuegos de navegador con sesión, cortafuegos de API sin ella.

---

## Varios cortafuegos {: .topic-title }

El caso habitual: una aplicación web con sesión y una API con tokens en el mismo proyecto.

```yaml
security:
    firewalls:
        dev:
            pattern: ^/(_profiler|_wdt|assets|build)/
            security: false

        api_login:
            pattern: ^/api/login
            stateless: true
            json_login:
                check_path: api_login

        api:
            pattern: ^/api
            stateless: true
            # aquí el autenticador que valida el token

        main:
            lazy: true
            provider: app_user_provider
            form_login:
                login_path: app_login
                check_path: app_login
            logout:
                path: /logout
```

Fíjate en el orden: `^/api/login` va **antes** que `^/api`, porque si no el segundo capturaría también la ruta de acceso y pediría un token para poder pedir un token. Es el mismo principio que el orden de rutas: lo específico antes que lo general.

---

## Recordar la sesión {: .topic-title }

```yaml
firewalls:
    main:
        remember_me:
            secret: '%kernel.secret%'
            lifetime: 604800        # una semana
            path: /
```

Y en la plantilla, una casilla con nombre obligatorio:

```twig
<input type="checkbox" name="_remember_me"> Recordarme
```

!!! warning "Recordado no es lo mismo que autenticado"
    Un usuario que vuelve por la cookie está autenticado, pero **no ha demostrado hoy que sabe la contraseña**. Alguien con acceso a su ordenador entra igual.

    Por eso existe la distinción entre `IS_AUTHENTICATED_REMEMBERED` e `IS_AUTHENTICATED_FULLY`. Las zonas sensibles —cambiar la contraseña, datos de pago, administración— deben exigir la segunda, lo que fuerza a volver a escribir la contraseña.

    Está desarrollado en [autorización](../04-autorizacion/index.md).

---

## Limitar los intentos {: .topic-title }

```yaml
firewalls:
    main:
        login_throttling:
            max_attempts: 5
            interval: '15 minutes'
```

Bloquea la combinación de identificador y dirección IP tras varios intentos fallidos. Es la defensa mínima contra el descubrimiento de contraseñas por fuerza bruta, y son dos líneas.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Mantener el cortafuegos `dev` | Borrarlo y quedarte sin perfilador |
| El cortafuegos sin `pattern`, el último | Ponerlo arriba y que capture todo |
| Lo específico antes que lo general (`^/api/login` antes de `^/api`) | Pedir un token para poder pedir un token |
| `stateless: true` en los cortafuegos de API | Crear una sesión por cada petición de la API |
| Respetar `_username`, `_password`, `_csrf_token` | Renombrar los campos sin declararlo en el YAML |
| `login_throttling` desde el primer día | Dejar el acceso abierto a intentos ilimitados |
| Exigir `IS_AUTHENTICATED_FULLY` en zonas sensibles | Tratar igual al recordado que al recién identificado |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — The Firewall** | https://symfony.com/doc/current/security.html#the-firewall |
| 📙 **Institut Montilivi — Seguretat** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/seguretat/ |
