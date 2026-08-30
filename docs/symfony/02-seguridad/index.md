# Seguridad { .section-fundamentos }

> El componente Security responde a dos preguntas distintas: **quién eres** (autenticación) y **qué puedes hacer** (autorización). Confundirlas es el origen de la mayoría de los errores de configuración.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/security-bundle
    ```

Con Symfony Flex, la instalación crea `config/packages/security.yaml` con una configuración mínima ya funcional.

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:user               # crea la entidad User y configura el provider
    symfony console make:security:form-login # crea SecurityController + plantilla de login
    symfony console security:hash-password   # calcula el hash de una contraseña a mano
    symfony console debug:security:role-hierarchy  # muestra la jerarquía de roles resuelta
    ```

`make:user` hace tres cosas a la vez: genera la entidad, la deja implementando las interfaces correctas y **escribe el proveedor de usuarios en `security.yaml`**. Por eso conviene ejecutarlo antes de tocar la configuración a mano.

---

## Autenticación y autorización {: .topic-title }

Son dos etapas consecutivas, y cada una tiene su sitio en la configuración.

**Autenticación** es establecer la identidad. El sistema comprueba unas credenciales y, si son correctas, deja constancia de que quien hace la petición es un usuario concreto.

**Autorización** es decidir permisos. Una vez se sabe quién es, se comprueba si tiene derecho a hacer lo que pide.

!!! info "Un usuario autenticado no es un usuario autorizado"
    Estar identificado no da acceso a nada por sí solo. Son dos comprobaciones separadas, y ese orden explica los dos errores HTTP que verás:

    - **401 Unauthorized** — no sé quién eres. Falta la autenticación.
    - **403 Forbidden** — sé quién eres, pero no puedes. Falta la autorización.

    Cuando una aplicación devuelve un 403 y esperabas entrar, el problema está en los roles. Cuando devuelve un 401, el problema está en el cortafuegos o en las credenciales.

---

## Las tres piezas {: .topic-title }

Toda la configuración gira en torno a tres claves de `security.yaml`, y cada una responde a una pregunta:

| Clave | Pregunta que responde | Qué contiene |
|---|---|---|
| `providers` | ¿De dónde saco los usuarios? | Base de datos, LDAP, memoria |
| `firewalls` | ¿Cómo se autentica quien entra? | Formulario, JSON, HTTP básico, cierre de sesión |
| `access_control` | ¿Quién puede acceder a qué URL? | Patrones de ruta con sus roles |

```yaml
# config/packages/security.yaml
security:
    password_hashers:
        Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface: 'auto'

    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email

    firewalls:
        dev:
            pattern: ^/(_profiler|_wdt|assets|build)/
            security: false
        main:
            lazy: true
            provider: app_user_provider
            form_login:
                login_path: app_login
                check_path: app_login
            logout:
                path: /logout
                target: app_homepage

    access_control:
        - { path: ^/login, roles: PUBLIC_ACCESS }
        - { path: ^/admin, roles: ROLE_ADMIN }
        - { path: ^/perfil, roles: ROLE_USER }
```

---

## El recorrido de una petición {: .topic-title }

Entender este orden ahorra mucho tiempo de depuración:

1. Llega una petición a una ruta protegida.
2. El **cortafuegos** que coincide con la URL la intercepta y mira si hay una sesión iniciada.
3. Si no la hay, redirige al formulario de acceso (o responde 401 en una API).
4. El usuario envía sus credenciales al autenticador configurado.
5. El **proveedor** carga el usuario desde su almacén.
6. Se comprueba la contraseña contra el hash guardado.
7. El usuario queda autenticado y sus **roles** entran en juego.
8. Se evalúa `access_control` y las comprobaciones del código.
9. Se concede o se deniega el acceso.

---

## El usuario autenticado {: .topic-title }

En un controlador:

```php
public function perfil(): Response
{
    $user = $this->getUser();

    if (!$user) {
        throw $this->createAccessDeniedException();
    }

    return $this->render('perfil.html.twig', ['usuario' => $user]);
}
```

En una plantilla Twig:

```twig
{% if app.user %}
    <p>Bienvenido, {{ app.user.email }}</p>
    <a href="{{ path('app_logout') }}">Cerrar sesión</a>
{% else %}
    <a href="{{ path('app_login') }}">Iniciar sesión</a>
{% endif %}
```

!!! tip "Declara el tipo con `#[CurrentUser]` en vez de usar `getUser()`"
    `$this->getUser()` devuelve `?UserInterface`, así que tu editor no conoce los métodos propios de tu entidad. Inyectándolo como argumento, sí:

    ```php
    use Symfony\Component\Security\Http\Attribute\CurrentUser;

    public function perfil(#[CurrentUser] User $usuario): Response
    {
        // $usuario es tu App\Entity\User, con autocompletado
    }
    ```
    Además deja explícito en la firma que la acción necesita un usuario, algo que `getUser()` esconde dentro del cuerpo.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [01 - El usuario y los proveedores](01-usuario-y-providers/index.md) | `UserInterface`, entidad `User`, `getUserIdentifier`, `getRoles`, tipos de proveedor |
| [02 - Contraseñas](02-contrasenas/index.md) | `password_hashers`, `auto`/`bcrypt`/`sodium`, hashear, verificar, migrar |
| [03 - Cortafuegos](03-firewalls/index.md) | Orden, `lazy`, `form_login`, `json_login`, `http_basic`, `logout`, `stateless` |
| [04 - Autorización](04-autorizacion/index.md) | Roles, `role_hierarchy`, `access_control`, `#[IsGranted]`, `is_granted` |
| [05 - Voters](05-voters/index.md) | Permisos según el dato, `supports`, `voteOnAttribute`, control por propietario |
| [06 - CSRF](06-csrf/index.md) | Qué es el ataque, tokens en formularios, `#[IsCsrfTokenValid]`, tokens sin estado |
| [07 - LDAP](07-ldap/index.md) | Directorio corporativo, cliente `Ldap`, proveedor `ldap`, `form_login_ldap` |
| [08 - JWT](08-jwt/index.md) | Tokens para APIs, *claims*, Lexik, refresco, CORS, diagnóstico |

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Seguretat en Symfony** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/seguretat/ |
| 🐘 **Symfony — Security** | https://symfony.com/doc/current/security.html |
