# Formularios y validación { .section-fundamentos }

> Aquí es donde PHP toca el mundo exterior. Todo lo que llega por estas variables lo ha escrito alguien que no eres tú, y puede contener cualquier cosa. La regla que ordena el tema entero: **validar al entrar, escapar al salir**.

---

## Las superglobales { .topic-title }

Están disponibles en cualquier ámbito, sin `global` y sin pasarlas como argumento. Son la excepción a la regla de ámbito de las funciones.

| Variable | Contiene |
|---|---|
| `$_GET` | Parámetros de la URL (`?pagina=2`) |
| `$_POST` | Cuerpo de un formulario enviado por POST |
| `$_FILES` | Ficheros subidos |
| `$_SERVER` | Datos de la petición y del servidor (`REQUEST_METHOD`, `REMOTE_ADDR`, cabeceras) |
| `$_SESSION` | Datos de sesión del usuario |
| `$_COOKIE` | Cookies enviadas por el navegador |
| `$_ENV` | Variables de entorno |
| `$_REQUEST` | Mezcla de `$_GET`, `$_POST` y `$_COOKIE` |

!!! danger "No uses `$_REQUEST`"
    Mezcla tres orígenes con prioridades configurables. Un parámetro que esperas del formulario puede llegar por la URL, y eso permite manipular una petición desde un enlace. Usa siempre la fuente concreta.

!!! warning "`$_SERVER` también es entrada del usuario"
    Parece «del servidor», pero muchos de sus valores vienen de cabeceras que envía el cliente y son falsificables: `HTTP_USER_AGENT`, `HTTP_REFERER`, `HTTP_X_FORWARDED_FOR`. Solo `REQUEST_METHOD`, `SCRIPT_NAME` y similares son fiables.

## Leer datos de entrada { .topic-title }

```php
$pagina = $_GET['pagina'] ?? 1;
$email  = $_POST['email'] ?? '';
```

Siempre con `??`. Acceder directo a una clave que no existe lanza un aviso y, en un formulario, la clave **puede no llegar**.

!!! tip "Una casilla sin marcar no se envía"
    Un `<input type="checkbox" name="acepto">` desmarcado **no aparece en `$_POST`**, no llega como `false` ni como cadena vacía: simplemente no está. Por eso se lee así:

    ```php
    $acepto = isset($_POST['acepto']);
    ```

    Lo mismo con los radios sin seleccionar. Y para recibir varios valores, el `name` lleva corchetes: `name="colores[]"` llega como array.

## Validar: en el servidor, siempre { .topic-title }

```php
$errores = [];

$email = trim($_POST['email'] ?? '');
if ($email === '') {
    $errores['email'] = 'El correo es obligatorio';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores['email'] = 'El correo no tiene un formato válido';
}

$edad = filter_var($_POST['edad'] ?? '', FILTER_VALIDATE_INT);
if ($edad === false) {
    $errores['edad'] = 'La edad debe ser un número entero';
}
```

`filter_var()` cubre los casos habituales: `FILTER_VALIDATE_EMAIL`, `_INT`, `_FLOAT`, `_URL`, `_IP`, `_BOOLEAN`. Devuelve el valor convertido o `false`.

!!! danger "La validación del navegador no es seguridad"
    `required`, `type="email"`, `pattern` y `maxlength` son **experiencia de usuario**: evitan un viaje al servidor. Se saltan desactivando JavaScript, editando el HTML en el inspector, o mandando la petición con `curl` sin pasar por el formulario.

    Toda validación se repite en el servidor. Sin excepción.

!!! warning "Cuidado con `FILTER_VALIDATE_BOOLEAN`"
    Devuelve `false` tanto para `'false'` como para un valor inválido. Para distinguirlos hace falta `FILTER_NULL_ON_FAILURE`, que devuelve `null` cuando no es booleano.

## Escapar: al salir, no al entrar { .topic-title }

```php
<p>Hola, <?= htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8') ?></p>
```

`htmlspecialchars()` convierte `<`, `>`, `&`, `"` y `'` en entidades HTML. Sin eso, un nombre que contenga `<script>alert(1)</script>` **se ejecuta en el navegador de quien vea la página**: eso es un **XSS**.

!!! danger "Escapar al guardar es un error clásico"
    Es tentador aplicar `htmlspecialchars()` antes de meter el dato en la base de datos, y está mal por dos motivos: guardas basura (`&amp;` en lugar de `&`) y el escape correcto **depende del destino**. Lo que sirve para HTML no sirve para JSON, ni para una URL, ni para un correo en texto plano.

    El dato se guarda **crudo** y se escapa **en el momento de imprimirlo**, según dónde se imprima. Twig lo hace solo; PHP puro, no.

| Destino | Función |
|---|---|
| HTML | `htmlspecialchars()` |
| Atributo HTML | `htmlspecialchars()` con `ENT_QUOTES` |
| URL | `urlencode()` / `rawurlencode()` |
| JSON | `json_encode()` |
| SQL | **Ninguna: consultas preparadas** |

## Base de datos: consultas preparadas, nunca concatenación { .topic-title }

```php
// ❌ inyección SQL
$sql = "SELECT * FROM usuarios WHERE email = '$email'";

// ✅ consulta preparada
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = :email');
$stmt->execute(['email' => $email]);
```

En una consulta preparada, el motor recibe **la estructura y los datos por separado**. Un valor no puede convertirse en instrucción, por muchas comillas que lleve. No es «escapar mejor»: es que el dato nunca llega a interpretarse como SQL.

!!! warning "Los nombres de tabla y de columna no se pueden parametrizar"
    Un marcador solo vale para **valores**. Si el nombre de la columna por la que ordenas viene del usuario (`?orden=precio`), hay que compararlo contra una **lista blanca** de columnas permitidas antes de meterlo en la consulta.

## Subida de ficheros { .topic-title }

```php
$fichero = $_FILES['documento'] ?? null;

if ($fichero === null || $fichero['error'] !== UPLOAD_ERR_OK) {
    $errores[] = 'No se ha podido subir el fichero';
}

$mime = mime_content_type($fichero['tmp_name']);   // el tipo REAL
if (!in_array($mime, ['application/pdf', 'image/jpeg'], true)) {
    $errores[] = 'Formato no permitido';
}

move_uploaded_file($fichero['tmp_name'], $destino);
```

!!! danger "Tres reglas de la subida de ficheros"
    1. **La extensión y el `type` que manda el navegador son mentira.** Los pone el cliente. El tipo real se comprueba en el servidor con `mime_content_type()` o `finfo`.
    2. **Nunca guardes con el nombre original.** Genera uno propio. Un `../../` en el nombre puede escribir donde no debe, y un `.php` subido a una carpeta servida se ejecuta.
    3. **Guarda fuera de `public/`.** Un fichero en carpeta pública lo entrega el servidor web directamente, sin pasar por tu código, así que ninguna comprobación de permisos llega a ejecutarse. Se sirve desde un controlador.

## Enviar y redirigir: el patrón PRG { .topic-title }

```php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $errores === []) {
    $this->guardar($datos);
    header('Location: /pedidos/confirmado', true, 303);
    exit;
}
```

Tras procesar un POST correcto se **redirige** en vez de imprimir la respuesta. Si no, al recargar la página el navegador reenvía el formulario y se duplica el pedido.

!!! warning "`header()` falla si ya se ha enviado algo"
    `Cannot modify header information — headers already sent`. Basta con un espacio antes de `<?php`, un `echo` de depuración, o un salto de línea después de `?>` al final del fichero. Por eso los ficheros que solo contienen PHP **no llevan `?>` de cierre**.

    Y el `exit` después de `header('Location: ...')` no es opcional: sin él, el código sigue ejecutándose.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Variables superglobales** | [php.net/manual/es/language.variables.superglobals.php](https://www.php.net/manual/es/language.variables.superglobals.php) |
| 📘 **Manual oficial — `filter_var`** | [php.net/manual/es/function.filter-var.php](https://www.php.net/manual/es/function.filter-var.php) |
| 🛡️ **OWASP — Hoja de trucos de XSS** | [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
