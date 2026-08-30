# Voters { .section-fundamentos }

> Los roles responden a "¿qué tipo de usuario eres?". Un *voter* responde a "¿puedes hacer **esto** con **este** objeto?". Es la pieza que permite que el autor de una publicación la edite sin ser administrador.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:voter
    ```

Genera el esqueleto en `src/Security/` con los dos métodos obligatorios y lo registra automáticamente como servicio.

---

## El problema que resuelven {: .topic-title }

Con roles puedes expresar "los editores pueden editar publicaciones". Lo que no puedes expresar es "cada autor puede editar **las suyas**".

El impulso natural es resolverlo con un `if` en el controlador:

```php
public function editar(Post $post): Response
{
    if ($post->getAutor() !== $this->getUser() && !$this->isGranted('ROLE_ADMIN')) {
        throw $this->createAccessDeniedException();
    }
    // ...
}
```

Funciona. El problema aparece cuando esa misma regla hace falta en la plantilla —para decidir si se muestra el botón—, en el controlador de borrado, en la API y en un comando de consola. Cuatro copias de la misma condición, que hay que cambiar a la vez el día que la regla evolucione.

Un voter la escribe **una vez** y la deja disponible en todas partes con la misma sintaxis que un rol.

!!! info "Esto es control de acceso basado en atributos"
    Los roles son control basado en roles (RBAC): el permiso depende solo de quién eres. Los voters permiten control basado en atributos (ABAC): el permiso depende de quién eres **y** de las propiedades del objeto sobre el que actúas.

    Es el modelo que usan los sistemas donde los permisos no se pueden reducir a una lista de roles: un gestor documental, un ERP, cualquier aplicación con datos que pertenecen a alguien.

---

## Anatomía {: .topic-title }

Un voter extiende `Voter` e implementa dos métodos.

```php
namespace App\Security;

use App\Entity\Post;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class PostVoter extends Voter
{
    public const EDITAR = 'POST_EDITAR';
    public const BORRAR = 'POST_BORRAR';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDITAR, self::BORRAR], true)
            && $subject instanceof Post;
    }

    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token
    ): bool {
        $usuario = $token->getUser();

        if (!$usuario instanceof UserInterface) {
            return false;                 // anónimo: nunca edita ni borra
        }

        /** @var Post $subject */
        return match ($attribute) {
            self::EDITAR => $this->puedeEditar($subject, $usuario),
            self::BORRAR => $this->puedeBorrar($subject, $usuario),
            default => false,
        };
    }

    private function puedeEditar(Post $post, UserInterface $usuario): bool
    {
        return $post->getAutor() === $usuario;
    }

    private function puedeBorrar(Post $post, UserInterface $usuario): bool
    {
        return $post->getAutor() === $usuario && !$post->estaPublicado();
    }
}
```

### `supports()`

Decide si este voter tiene algo que decir. Se ejecuta en **cada** comprobación de permisos de la aplicación, así que debe ser rápido y no consultar la base de datos.

Devolver `false` significa "esto no va conmigo", no "denegado".

### `voteOnAttribute()`

Solo se llama si `supports()` devolvió `true`. Aquí sí va la lógica real, con acceso al objeto y al usuario.

!!! danger "Devolver `false` en `supports()` no deniega nada"
    Es la confusión más frecuente. Los dos métodos parecen decir lo mismo pero significan cosas opuestas:

    - `supports()` → `false`: **me abstengo**, que decida otro.
    - `voteOnAttribute()` → `false`: **deniego**.

    Si el `supports()` está mal escrito —por ejemplo, comprueba `$subject instanceof Post` cuando le pasas un `id`—, el voter se abstiene siempre. Y si ningún voter vota, la estrategia por defecto **deniega**, así que el síntoma es un 403 permanente sin que ningún voter llegue a ejecutarse.

    Cuando un voter "no funciona", pon un `dump()` en `supports()` antes de tocar la lógica.

---

## Registrarlo {: .topic-title }

Con la configuración por defecto de `services.yaml`, el registro es automático: cualquier clase de `src/` que extienda `Voter` se etiqueta sola.

Si el proyecto no usa autoconfiguración, hay que declararlo:

```yaml
# config/services.yaml
services:
    App\Security\PostVoter:
        tags: ['security.voter']
```

---

## Usarlo {: .topic-title }

La gracia es que se usa **exactamente igual que un rol**, pasando el objeto como segundo argumento.

En el controlador:

```php
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/posts/{id}/editar', name: 'post_editar')]
#[IsGranted('POST_EDITAR', 'post')]
public function editar(Post $post): Response
{
    // si llegamos aquí, el voter ha dicho que sí
}
```

El segundo argumento de `#[IsGranted]` es el **nombre del parámetro** del método, no el objeto: Symfony lo resuelve solo.

De forma imperativa:

```php
$this->denyAccessUnlessGranted('POST_EDITAR', $post);
```

En la plantilla:

```twig
{% if is_granted('POST_EDITAR', post) %}
    <a href="{{ path('post_editar', {id: post.id}) }}">Editar</a>
{% endif %}
```

En un servicio:

```php
if ($this->security->isGranted('POST_BORRAR', $post)) {
    // ...
}
```

!!! tip "Una sola regla, cuatro sitios, cero duplicación"
    Este es el argumento de fondo. El día que la regla cambie —"también pueden editar los moderadores del tema"—, se toca el voter y los cuatro sitios quedan actualizados.

    Con `if` repartidos, actualizas los que recuerdes.

---

## Convenciones {: .topic-title }

**Constantes, no cadenas sueltas.** `PostVoter::EDITAR` en lugar de `'POST_EDITAR'` por el proyecto: una errata en la cadena hace que ningún voter la soporte, y el resultado es un 403 mudo.

**Prefijo con la entidad.** `POST_EDITAR` y `COMENTARIO_EDITAR` en vez de un `EDITAR` genérico, para que `supports()` no tenga que desempatar.

**Sin prefijo `ROLE_`.** Un atributo de voter no es un rol; usar el mismo prefijo los confunde.

!!! warning "Cuidado con comparar entidades con `===`"
    ```php
    return $post->getAutor() === $usuario;
    ```
    Funciona porque Doctrine devuelve la **misma instancia** para una entidad ya cargada en memoria. Pero si el usuario viene de otro sitio —deserializado, o de una consulta distinta—, son objetos diferentes y la comparación falla.

    Comparar por identificador es más robusto:

    ```php
    return $post->getAutor()?->getId() === $usuario->getId();
    ```

---

## Los administradores {: .topic-title }

Un voter que solo mira al autor deja fuera a los administradores. Se resuelve dentro del propio voter, con una salida anticipada:

```php
public function __construct(private Security $security) { }

protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
{
    if ($this->security->isGranted('ROLE_ADMIN')) {
        return true;                      // early return
    }

    // ... el resto de la lógica
}
```

Ponerlo dentro mantiene una sola fuente de verdad: quien consulte el voter obtiene la respuesta completa, sin tener que acordarse de añadir "o es administrador" en cada llamada.

---

## Cómo se combinan varios voters {: .topic-title }

Cuando varios voters opinan sobre la misma comprobación, una **estrategia de decisión** resuelve el conjunto:

| Estrategia | Concede el acceso si... |
|---|---|
| `affirmative` | **al menos uno** vota a favor — es la opción por defecto |
| `consensus` | hay más votos a favor que en contra |
| `unanimous` | ninguno vota en contra |
| `priority` | decide el primero que no se abstiene |

```yaml
security:
    access_decision_manager:
        strategy: unanimous
```

!!! info "Con `affirmative`, un solo voter permisivo abre la puerta"
    Es lo razonable en la mayoría de aplicaciones, y por eso es el valor por defecto. Pero si escribes varios voters que opinan sobre lo mismo, basta con que uno diga que sí.

    En sistemas donde una denegación debe pesar más que un permiso —datos sensibles, permisos por departamento—, `unanimous` es la elección correcta.

Si ningún voter se pronuncia, se deniega. Ese comportamiento se puede invertir con `allow_if_all_abstain: true`, pero rara vez es lo que quieres: convierte un error de configuración en un acceso concedido.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Un voter cuando el permiso depende del objeto | Inventar roles del tipo `ROLE_EDITOR_POST_7` |
| `supports()` rápido, sin consultas a base de datos | Cargar entidades en el método que corre en cada comprobación |
| Constantes públicas para los atributos | Cadenas sueltas repetidas por el proyecto |
| Prefijar el atributo con la entidad | Un `EDITAR` genérico que colisiona entre voters |
| Comparar entidades por identificador | `===` sobre objetos que pueden venir de orígenes distintos |
| Meter la excepción de administrador dentro del voter | Añadir "o es admin" en cada sitio que lo llama |
| `dump()` en `supports()` cuando el voter no responde | Buscar el fallo en la lógica sin comprobar que llega a ejecutarse |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — Access Control (Authorization)** | https://symfony.com/doc/current/security.html#access-control-authorization |
| 🐘 **Symfony — Security Voters** | https://symfony.com/doc/current/security/voters.html |
