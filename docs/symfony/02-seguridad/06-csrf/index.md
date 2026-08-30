# CSRF { .section-fundamentos }

> Un ataque CSRF aprovecha que el navegador envía tus cookies **automáticamente**. Otra web puede provocar una petición a la tuya, y tu servidor la verá como legítima porque llega con tu sesión.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/security-csrf
    ```

```yaml
# config/packages/framework.yaml
framework:
    csrf_protection: true
```

---

## El ataque {: .topic-title }

**CSRF** significa *Cross-Site Request Forgery*, falsificación de petición entre sitios.

Supón que has iniciado sesión en tu banco y no has cerrado la pestaña. Visitas otra web que contiene esto:

```html
<form action="https://tubanco.com/transferir" method="POST">
    <input type="hidden" name="destino" value="cuenta-del-atacante">
    <input type="hidden" name="importe" value="1000">
</form>
<script>document.forms[0].submit();</script>
```

El formulario se envía solo. Y como el navegador adjunta las cookies de `tubanco.com` a **cualquier** petición dirigida a ese dominio, el servidor recibe una transferencia perfectamente autenticada.

!!! info "El fallo no es que el atacante robe tu sesión"
    No la roba: ni siquiera puede leerla. Lo que hace es **usarla desde fuera**, aprovechando que el navegador la adjunta sola.

    Por eso la defensa no puede basarse en la cookie —que llega igual—, sino en exigir algo que la otra web no puede conocer: un token que solo aparece en tus propias páginas.

---

## Cómo lo resuelve el token {: .topic-title }

El servidor añade a cada formulario un valor impredecible y ligado a la sesión. Al recibir la petición comprueba que ese valor coincide.

La web atacante puede provocar la petición, pero no puede leer el contenido de tus páginas —la política del navegador se lo impide—, así que no sabe qué token poner. La petición falsificada llega sin él y se rechaza.

---

## En los formularios de Symfony {: .topic-title }

!!! tip "Ya está activado: no hay que hacer nada"
    Todo formulario construido con el componente Form incluye un campo `_token` oculto y lo valida en `handleRequest()`. Si el token falta o no coincide, `isValid()` devuelve `false`.

    Este es un motivo de peso para usar el componente Form en vez de leer `$request->request->get(...)` a mano: la protección viene incluida.

Se configura por formulario en `configureOptions()`:

```php
public function configureOptions(OptionsResolver $resolver): void
{
    $resolver->setDefaults([
        'data_class' => Tarea::class,
        'csrf_protection' => true,
        'csrf_field_name' => '_token',
        'csrf_token_id' => 'tarea_item',
    ]);
}
```

`csrf_token_id` distingue los tokens entre formularios: uno generado para el formulario de tareas no sirve para el de usuarios.

!!! warning "Los formularios GET no llevan token, y es correcto"
    La protección CSRF cubre operaciones que **cambian estado**, que por definición no deben hacerse con `GET`. Un formulario de búsqueda o de filtrado no necesita token.

    ```php
    $resolver->setDefaults([
        'method' => 'GET',
        'csrf_protection' => false,
    ]);
    ```
    De hecho, un formulario declarado con `method => 'GET'` desactiva el token por su cuenta. Si un formulario de búsqueda deja de funcionar al pasarlo a GET, comprueba que no estás esperando un token que ya no se envía.

---

## Fuera del componente Form {: .topic-title }

El caso típico es un botón de borrado, que no es un formulario completo pero sí cambia el estado.

```twig
<form action="{{ path('post_borrar', {id: post.id}) }}" method="post">
    <input type="hidden" name="token" value="{{ csrf_token('borrar-post-' ~ post.id) }}">
    <button type="submit">Borrar</button>
</form>
```

Y en el controlador, la validación:

```php
public function borrar(Request $request, Post $post): Response
{
    $tokenEnviado = $request->getPayload()->get('token');

    if (!$this->isCsrfTokenValid('borrar-post-' . $post->getId(), $tokenEnviado)) {
        throw $this->createAccessDeniedException('Token no válido');
    }

    // ... borrar
}
```

!!! danger "El identificador del token debe coincidir exactamente en los dos lados"
    Si la plantilla genera `'borrar-post-7'` y el controlador valida `'borrar-item'`, la comprobación falla siempre. Y como la mayoría del código escribe la cadena a mano en dos ficheros distintos, es un fallo muy fácil de introducir al renombrar.

    Incluir el identificador del objeto —`'borrar-post-' ~ post.id`— añade una garantía extra: un token generado para borrar la publicación 7 no sirve para borrar la 8.

### Con atributo

Symfony 7.1 introdujo `#[IsCsrfTokenValid]`, que quita el `if` del cuerpo:

```php
use Symfony\Component\Security\Http\Attribute\IsCsrfTokenValid;

#[IsCsrfTokenValid('borrar-post', tokenKey: 'token')]
public function borrar(Post $post): Response
{
    // ... si llegamos aquí, el token es válido
}
```

Con identificador dinámico, usando una expresión:

```php
use Symfony\Component\ExpressionLanguage\Expression;

#[IsCsrfTokenValid(
    new Expression('"borrar-post-" ~ args["post"].getId()'),
    tokenKey: 'token'
)]
public function borrar(Post $post): Response { }
```

Y restringido a ciertos verbos:

```php
#[IsCsrfTokenValid('borrar-post', tokenKey: 'token', methods: ['DELETE'])]
```

---

## En el acceso y el cierre de sesión {: .topic-title }

El formulario de acceso también necesita protección, porque existe un ataque de "acceso forzado": el atacante te hace iniciar sesión **con su cuenta** sin que te des cuenta, y a partir de ahí ve lo que hagas.

```yaml
firewalls:
    main:
        form_login:
            enable_csrf: true
```

```twig
<input type="hidden" name="_csrf_token" value="{{ csrf_token('authenticate') }}">
```

El identificador `authenticate` es el que espera el autenticador por defecto.

---

## Tokens sin estado {: .topic-title }

Los tokens se guardan en la sesión, lo que obliga a iniciarla y hace que la página no se pueda cachear. Los **tokens sin estado** evitan ese coste:

```yaml
# config/packages/csrf.yaml
framework:
    csrf_protection:
        stateless_token_ids: ['submit', 'authenticate', 'logout']
```

En vez de comparar contra la sesión, se validan comprobando las cabeceras `Origin` y `Referer` de la petición: si el origen coincide con el dominio de la aplicación, el token se acepta.

!!! warning "Detrás de un proxy inverso, hay que configurar los proxies de confianza"
    La validación depende de cabeceras que un proxy mal configurado puede reescribir o perder. Si Symfony no sabe que está detrás de un proxy, verá un origen incorrecto y rechazará peticiones legítimas.

---

## APIs sin estado {: .topic-title }

!!! info "Una API con token en cabecera no necesita protección CSRF"
    El ataque funciona porque el navegador adjunta las **cookies** solo. Una cabecera `Authorization: Bearer ...` no se adjunta sola: tiene que ponerla el código, y el código de otra web no puede leer tu token.

    Por eso un cortafuegos con `stateless: true` y autenticación por token no lleva tokens CSRF. Lo que sí sigue haciendo falta es **CORS** bien configurado, que es un problema distinto.

    Si tu API autentica con cookies de sesión, entonces sí es vulnerable y necesita CSRF o cookies con `SameSite=Strict`.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usar el componente Form y heredar la protección | Leer los datos de `$request` a mano y saltártela |
| Token en cualquier acción que cambie estado | Un botón de borrado por `GET` sin token |
| Incluir el identificador del objeto en el token | Un token genérico que sirve para cualquier registro |
| Mismo identificador en plantilla y controlador | Renombrarlo en un sitio y no en el otro |
| `enable_csrf: true` en el formulario de acceso | Dejar el acceso sin protección |
| Desactivarlo en formularios `GET` de búsqueda | Exigir token donde no cambia nada |
| Configurar los proxies de confianza con tokens sin estado | Activarlos detrás de un proxy sin configurarlo |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — CSRF Protection** | https://symfony.com/doc/current/security/csrf.html |
| 🐘 **Symfony — Security** | https://symfony.com/doc/current/security.html |
