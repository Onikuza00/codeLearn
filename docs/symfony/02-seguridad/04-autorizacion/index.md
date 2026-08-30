# Autorización { .section-fundamentos }

> Una vez sabemos quién es el usuario, hay que decidir qué puede hacer. Symfony ofrece cuatro sitios donde comprobarlo, y elegir el correcto es lo que separa una aplicación segura de una con agujeros.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console debug:security:role-hierarchy   # muestra la jerarquía resuelta
    ```

Útil cuando la jerarquía crece y ya no es evidente qué roles hereda cada uno.

---

## Roles {: .topic-title }

Un rol es una etiqueta de texto asociada al usuario. No tiene significado propio: lo adquiere al comprobarse.

```php
public function getRoles(): array
{
    $roles = $this->roles;
    $roles[] = 'ROLE_USER';

    return array_unique($roles);
}
```

!!! warning "Todos los roles empiezan por `ROLE_`"
    Es una regla del componente. Un valor como `admin` no se reconoce como rol, y la comprobación devuelve `false` sin avisar de que el nombre está mal formado.

Symfony reserva algunos con significado propio:

| Rol o atributo | Qué significa |
|---|---|
| `ROLE_USER` | Usuario identificado |
| `ROLE_ADMIN` | Convención habitual para administración |
| `ROLE_ALLOWED_TO_SWITCH` | Permite suplantar a otro usuario |
| `PUBLIC_ACCESS` | Acceso libre, sin autenticación |
| `IS_AUTHENTICATED` | Identificado, sin importar cómo |
| `IS_AUTHENTICATED_FULLY` | Ha escrito la contraseña **en esta sesión** |
| `IS_AUTHENTICATED_REMEMBERED` | Vuelve por la cookie de "recordarme" |
| `IS_IMPERSONATOR` | Está suplantando a otro usuario |

!!! danger "`IS_AUTHENTICATED_FULLY` es lo que protege las acciones sensibles"
    Un usuario con la cookie de "recordarme" cumple `IS_AUTHENTICATED`, pero **no ha demostrado hoy que sabe la contraseña**. Cualquiera con acceso a su ordenador pasa esa comprobación.

    Cambiar la contraseña, ver datos de pago o entrar en administración debe exigir `IS_AUTHENTICATED_FULLY`, que fuerza a escribirla de nuevo:

    ```yaml
    access_control:
        - { path: ^/cuenta/contrasena, roles: IS_AUTHENTICATED_FULLY }
    ```

---

## Jerarquía de roles {: .topic-title }

Evita tener que asignar diez roles a cada administrador:

```yaml
# config/packages/security.yaml
security:
    role_hierarchy:
        ROLE_ADMIN: ROLE_USER
        ROLE_SUPER_ADMIN: [ROLE_ADMIN, ROLE_ALLOWED_TO_SWITCH]
```

Quien tiene `ROLE_ADMIN` pasa cualquier comprobación de `ROLE_USER` aunque solo tenga el primero guardado. La herencia es transitiva: `ROLE_SUPER_ADMIN` alcanza también `ROLE_USER`.

!!! info "La jerarquía se resuelve al comprobar, no al guardar"
    En la base de datos, ese usuario sigue teniendo solo `["ROLE_SUPER_ADMIN"]`. La expansión ocurre en cada comprobación.

    Eso tiene una consecuencia práctica: cambiar `role_hierarchy` afecta **de inmediato** a todos los usuarios, sin migraciones ni actualizaciones de datos.

Consultarla desde el código:

```php
use Symfony\Component\Security\Core\Role\RoleHierarchyInterface;

public function __construct(private RoleHierarchyInterface $roleHierarchy) { }

public function rolesEfectivos(array $roles): array
{
    return $this->roleHierarchy->getReachableRoleNames($roles);
    // ['ROLE_ADMIN'] devuelve ['ROLE_ADMIN', 'ROLE_USER']
}
```

---

## `access_control`: proteger por URL {: .topic-title }

Es la primera barrera, y actúa antes de que la petición llegue al controlador.

```yaml
security:
    access_control:
        - { path: ^/login, roles: PUBLIC_ACCESS }
        - { path: ^/admin/usuarios, roles: ROLE_SUPER_ADMIN }
        - { path: ^/admin, roles: ROLE_ADMIN }
        - { path: ^/api/(post|comment)/\d+$, roles: ROLE_USER }
        - { path: ^/api, roles: ROLE_ADMIN, methods: [POST, PUT, DELETE] }
        - { path: ^/intranet, roles: ROLE_USER, ips: 192.168.1.0/24 }
        - { path: ^/cuenta, roles: ROLE_USER, requires_channel: https }
```

Opciones disponibles:

| Opción | Qué filtra |
|---|---|
| `path` | Expresión regular sobre la ruta |
| `roles` | Roles o atributos exigidos |
| `methods` | Verbos HTTP a los que aplica |
| `ips` | Direcciones o rangos permitidos |
| `requires_channel` | Fuerza `https` |

!!! danger "Gana la PRIMERA regla que coincide, no la más específica"
    Symfony recorre la lista en orden y se detiene en la primera coincidencia. Lo específico va **antes** que lo general:

    ```yaml
    # ❌ /admin/usuarios exige solo ROLE_ADMIN: la segunda regla nunca se evalúa
    - { path: ^/admin, roles: ROLE_ADMIN }
    - { path: ^/admin/usuarios, roles: ROLE_SUPER_ADMIN }

    # ✅
    - { path: ^/admin/usuarios, roles: ROLE_SUPER_ADMIN }
    - { path: ^/admin, roles: ROLE_ADMIN }
    ```
    Es el mismo principio que el orden de las rutas y el de los cortafuegos. Este fallo no da error: simplemente deja la zona menos protegida de lo que crees.

!!! warning "`path` no está anclado al final"
    `^/admin` coincide con `/admin`, `/administracion` y `/admin-publico`. Si necesitas exactitud, ánclalo: `^/admin$` o `^/admin/`.

---

## En el controlador {: .topic-title }

`access_control` protege por URL, pero muchas comprobaciones dependen de la acción, no de la ruta. Para eso está el atributo `#[IsGranted]`:

```php
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    #[Route('/admin/usuarios', name: 'admin_usuarios')]
    #[IsGranted('ROLE_SUPER_ADMIN', message: 'Solo el administrador principal')]
    public function usuarios(): Response
    {
        // ...
    }
}
```

Puesto sobre la clase aplica a todas sus acciones; sobre un método, solo a ese. Admite además restringir por verbo y cambiar el código de estado:

```php
#[IsGranted('ROLE_ADMIN', methods: ['POST', 'DELETE'])]
#[IsGranted('ROLE_ADMIN', statusCode: 404)]
```

!!! tip "`statusCode: 404` esconde la existencia del recurso"
    Un 403 confirma que la URL existe pero no tienes permiso. En una zona cuya existencia no debería revelarse —el panel de un cliente concreto—, devolver 404 no da esa información.

La forma imperativa, cuando la comprobación depende de algo calculado:

```php
$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Mensaje para el registro');
```

---

## En un servicio {: .topic-title }

Los servicios no heredan de `AbstractController`, así que inyectan `Security`:

```php
use Symfony\Bundle\SecurityBundle\Security;

class GeneradorDeInformes
{
    public function __construct(private Security $security) { }

    public function generar(): array
    {
        $datos = $this->datosPublicos();

        if ($this->security->isGranted('ROLE_ADMIN')) {
            $datos['confidencial'] = $this->datosInternos();
        }

        return $datos;
    }
}
```

!!! info "Comprobar los permisos de otro usuario"
    `isGranted()` siempre pregunta por el usuario actual. Para comprobar los de otro —por ejemplo, al mostrar qué podría hacer un compañero de equipo— existe `isGrantedForUser()`:

    ```php
    $this->security->isGrantedForUser($otroUsuario, 'ROLE_ADMIN');
    ```

    Y cuando necesitas saber **por qué** se ha denegado, `getAccessDecision()` devuelve la decisión con su motivo:

    ```php
    $decision = $this->security->getAccessDecision('editar', $post);
    if (!$decision->isGranted) {
        $this->logger->info($decision->message);
    }
    ```

---

## En la plantilla {: .topic-title }

```twig
{% if is_granted('ROLE_ADMIN') %}
    <a href="{{ path('admin_panel') }}">Panel</a>
{% endif %}

{% if is_granted('IS_AUTHENTICATED') %}
    <p>Sesión iniciada como {{ app.user.email }}</p>
{% endif %}
```

!!! danger "Ocultar un botón NO es proteger la acción"
    El `{% if %}` de Twig es cosmético: evita mostrar un enlace que va a fallar. **No impide nada.** Cualquiera puede escribir la URL a mano, o enviar la petición desde la terminal.

    Todo lo que se oculta en la plantilla tiene que estar protegido también en el servidor, con `access_control` o `#[IsGranted]`. La plantilla mejora la experiencia; la seguridad está detrás.

---

## Qué usar en cada caso {: .topic-title }

| Necesidad | Herramienta |
|---|---|
| Toda una sección del sitio | `access_control` |
| Un controlador o una acción concreta | `#[IsGranted]` |
| Lógica dentro de un servicio | `Security::isGranted()` |
| Mostrar u ocultar un elemento | `is_granted()` en Twig |
| El permiso depende del **dato**, no solo del rol | Un [voter](../05-voters/index.md) |

Esa última fila es la frontera importante. "Puede editar publicaciones" es un rol. "Puede editar **esta** publicación porque la escribió él" no cabe en un rol: depende del objeto, y para eso están los *voters*.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Lo específico antes que lo general en `access_control` | Poner `^/admin` antes que `^/admin/usuarios` |
| Anclar el `path` cuando importa la exactitud | Confiar en que `^/admin` no coincide con `/administracion` |
| `IS_AUTHENTICATED_FULLY` en acciones sensibles | Tratar igual al recordado que al recién identificado |
| Proteger en el servidor **y** ocultar en la plantilla | Ocultar el botón y dar la acción por protegida |
| `role_hierarchy` en vez de repetir roles | Guardar cinco roles a cada administrador |
| Un voter cuando el permiso depende del objeto | Inventar `ROLE_EDITOR_DEL_POST_7` |
| `#[IsGranted]` con mensaje para el registro | Denegar sin dejar rastro de por qué |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — Access Control (Authorization)** | https://symfony.com/doc/current/security.html#access-control-authorization |
| 📙 **Institut Montilivi — Seguretat** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/seguretat/ |
