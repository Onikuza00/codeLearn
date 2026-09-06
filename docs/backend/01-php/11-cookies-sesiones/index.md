# Cookies y sesiones { .section-fundamentos }

> HTTP no recuerda nada: cada petición llega sin saber quién eres. Las cookies y las sesiones son el parche que construye la ilusión de continuidad, y entender cómo funcionan por debajo explica casi todo lo que un framework hace por ti al gestionar el login.

---

## El problema: HTTP no tiene memoria { .topic-title }

Cada petición es independiente. El servidor atiende, responde y olvida. Sin un mecanismo añadido, no hay forma de saber que la petición que pide `/mi-cuenta` viene de quien inició sesión hace dos minutos.

La solución tiene dos piezas:

- **Cookie** — un dato pequeño que el servidor pide al navegador que guarde, y que el navegador **reenvía en cada petición** a ese dominio.
- **Sesión** — los datos se guardan **en el servidor**, y la cookie solo lleva un identificador que los localiza.

## Cookies { .topic-title }

```php
setcookie('idioma', 'es', [
    'expires'  => time() + 60 * 60 * 24 * 30,   // 30 días
    'path'     => '/',
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax',
]);

$idioma = $_COOKIE['idioma'] ?? 'es';
```

Los atributos no son opcionales en la práctica:

| Atributo | Qué hace |
|---|---|
| `expires` | Cuándo caduca. Sin él, muere al cerrar el navegador |
| `path` | En qué rutas se envía |
| `domain` | A qué dominio pertenece |
| **`secure`** | Solo viaja por HTTPS |
| **`httponly`** | **JavaScript no puede leerla** |
| **`samesite`** | Si viaja en peticiones desde otros sitios |

!!! danger "`httponly` es lo que salva la sesión de un XSS"
    Sin `httponly`, cualquier script inyectado en la página puede leer `document.cookie` y enviarse la cookie de sesión a otro servidor. Con `httponly`, el navegador **oculta la cookie a JavaScript** y solo la manda en las peticiones HTTP.

    No arregla el XSS, pero convierte «roban la sesión de todos los usuarios» en «hacen algo molesto en la página».

!!! tip "`SameSite`: qué significa cada valor"
    | Valor | La cookie viaja… |
    |---|---|
    | `Strict` | Solo si la petición nace en tu propio sitio |
    | `Lax` | Igual, salvo al navegar por un enlace normal. **Es el valor por defecto hoy** |
    | `None` | Siempre. **Obliga a `Secure`** |

    `Lax` corta la mayoría de ataques **CSRF**, en los que otra web envía una petición al tuyo aprovechando que el navegador adjunta la cookie sola.

    Ojo: `SameSite` es un atributo de **cookie**, y no tiene nada que ver con **CORS**, que es una cabecera de respuesta de tu API diciendo qué orígenes acepta. Son dos capas distintas que se confunden a menudo.

!!! warning "Una cookie es del cliente: nunca guardes nada sensible ni de confianza"
    El usuario puede leerla y modificarla. No van ahí ni contraseñas, ni el rol, ni un `es_admin=1`. Solo preferencias sin consecuencias —idioma, tema— o un identificador firmado que el servidor verifique.

    Y son pequeñas: unos 4 KB, y viajan en **cada** petición al dominio.

## Sesiones { .topic-title }

```php
session_start();                       // antes de imprimir NADA

$_SESSION['usuario_id'] = 42;
$_SESSION['nombre'] = 'Pau';

echo $_SESSION['nombre'] ?? 'invitado';
```

`session_start()` hace dos cosas: si el navegador manda una cookie de sesión (`PHPSESSID` por defecto), carga los datos asociados; si no, crea una sesión nueva y manda la cookie.

Los datos viven **en el servidor** —en ficheros, o en Redis en proyectos serios—. Por la red solo viaja el identificador. Por eso en `$_SESSION` sí se puede guardar el rol: el usuario no puede tocarlo.

!!! danger "`session_start()` va antes de cualquier salida"
    Manda una cabecera `Set-Cookie`, y las cabeceras se envían antes que el cuerpo. Un espacio antes de `<?php`, un `echo` de depuración o un salto de línea tras un `?>` de cierre disparan el `Cannot modify header information — headers already sent`.

    Por eso los ficheros que solo contienen PHP no llevan `?>` final.

## Login y logout { .topic-title }

```php
// LOGIN
if (password_verify($contrasena, $usuario->getHash())) {
    session_regenerate_id(true);              // ← imprescindible
    $_SESSION['usuario_id'] = $usuario->getId();
    header('Location: /panel', true, 303);
    exit;
}
```

```php
// LOGOUT
$_SESSION = [];
setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => '/']);
session_destroy();
header('Location: /', true, 303);
exit;
```

!!! danger "`session_regenerate_id(true)` al iniciar sesión: fijación de sesión"
    Sin esa línea existe un ataque real. El atacante visita tu web, recibe un identificador de sesión, y consigue que la víctima navegue con **ese mismo identificador** (por un enlace preparado, por ejemplo). Cuando la víctima inicia sesión, el identificador **no cambia** — y el atacante, que lo conocía desde el principio, queda dentro de la cuenta.

    Regenerar el identificador en el momento del login rompe el ataque: el que conocía el atacante deja de valer. El `true` borra además los datos de la sesión antigua.

    Se hace igual en **cualquier cambio de privilegio**, no solo en el login.

!!! warning "Vaciar `$_SESSION` no basta para cerrar sesión"
    Hacen falta las tres cosas: vaciar el array, **borrar la cookie del navegador** y destruir los datos del servidor. Si solo vacías el array, la cookie sigue viva y el identificador se puede reutilizar.

## Contraseñas { .topic-title }

```php
$hash = password_hash($contrasena, PASSWORD_DEFAULT);   // al registrarse
password_verify($contrasena, $hash);                     // al iniciar sesión
```

`password_hash()` genera la sal sola y la guarda dentro del propio hash. No hace falta una columna aparte.

!!! danger "Ni `md5`, ni `sha1`, ni comparar con `===`"
    `md5` y `sha1` están diseñados para ser **rápidos**, que es justo lo contrario de lo que quieres: una tarjeta gráfica prueba miles de millones por segundo. `password_hash()` usa un algoritmo lento a propósito y con coste configurable.

    Y la comparación se hace **siempre** con `password_verify()`, nunca con `===`: esa función compara en tiempo constante, sin filtrar información por cuánto tarda en responder.

    Recuerda además que hashear no es cifrar: es irreversible a propósito. Nadie —tú tampoco— debería poder recuperar la contraseña original.

## Qué hace Symfony con todo esto { .topic-title }

Nada de lo anterior desaparece: el framework lo envuelve. `session_start()` lo hace el `RequestStack`, la regeneración del identificador la dispara el sistema de seguridad al autenticar, el hasheo lo hace el `UserPasswordHasher`, y los atributos de la cookie se declaran en `framework.yaml`.

Conocer la mecánica de debajo es lo que permite depurar cuando algo no cuadra —una sesión que se pierde entre subdominios, una cookie que no llega por falta de `Secure`— en lugar de mirar la configuración a ciegas.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Sesiones** | [php.net/manual/es/book.session.php](https://www.php.net/manual/es/book.session.php) |
| 📘 **Manual oficial — `setcookie`** | [php.net/manual/es/function.setcookie.php](https://www.php.net/manual/es/function.setcookie.php) |
| 🛡️ **OWASP — Gestión de sesiones** | [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) |
