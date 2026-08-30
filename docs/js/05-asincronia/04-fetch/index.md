# Fetch API { .bloque-js }

> `fetch()` es la función del navegador para hacer peticiones HTTP. Devuelve una promesa, así que todo lo aprendido sobre promesas se aplica directamente. Es la forma estándar de hablar con un servidor desde JavaScript.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/FJ-w0tf3d_w" title="Cómo consumir una API REST con JavaScript y Fetch — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Qué es {: .topic-title }

`fetch()` está integrado en el navegador: no hay que instalar nada ni cargar ninguna librería. También existe en Node.js desde la versión 18.

Sirve para lo que antes se hacía con librerías externas: pedir datos a una API, enviar un formulario, descargar un fichero, actualizar parte de la página sin recargarla.

!!! note "AJAX, XMLHttpRequest y `fetch`"
    Verás mucho el término **AJAX** (*Asynchronous JavaScript And XML*). Es el nombre histórico de la técnica de pedir datos al servidor sin recargar la página, y sigue usándose como término general.

    La implementación original de AJAX era el objeto `XMLHttpRequest`, de 2006. Hoy no se escribe: `fetch` hace lo mismo con promesas y mucha menos ceremonia. Si te encuentras `XMLHttpRequest` en un proyecto, es código heredado.

---

## Sintaxis básica {: .topic-title }

```js
fetch(url, opciones)
    .then(response => response.json())
    .then(datos => console.log(datos))
    .catch(error => console.error("Error de red:", error));
```

El segundo parámetro (`opciones`) es opcional. Si no lo pasas, `fetch` hace una petición **GET**.

Fíjate en que hacen falta **dos** `.then()`. Es la parte que más confunde al principio, y tiene una razón concreta: la primera promesa se cumple cuando llegan las **cabeceras** de la respuesta, no el cuerpo. Leer el cuerpo es una segunda operación asíncrona, porque puede ser un fichero de 500 MB que llegue a trozos.

---

## El objeto `Response` {: .topic-title }

Lo que recibe el primer `.then()` no son los datos: es un objeto `Response`, que describe la respuesta. Siguiendo la comparación del paquete: primero miras el exterior de la caja (remitente, estado, etiquetas) y solo después la abres.

| Propiedad | Qué contiene |
|---|---|
| `status` | El código HTTP numérico (`200`, `404`, `500`...) |
| `ok` | `true` si `status` está entre 200 y 299 |
| `url` | La URL final, después de posibles redirecciones |
| `headers` | Las cabeceras de la respuesta |

Para abrir la caja y sacar el contenido hay un método por tipo de dato:

| Método | Devuelve | Cuándo se usa |
|---|---|---|
| `.json()` | Objeto JavaScript | APIs REST — el caso normal |
| `.text()` | Cadena de texto | HTML, CSS, texto plano, CSV |
| `.blob()` | Blob (binario) | Imágenes, vídeos, ficheros para descargar |
| `.arrayBuffer()` | Buffer binario crudo | Manipulación de bytes a bajo nivel |
| `.formData()` | Objeto `FormData` | Respuestas con formato de formulario |

!!! danger "El cuerpo solo se puede leer UNA vez"
    La respuesta llega como un flujo de datos (*stream*). Cuando llamas a `.json()`, el flujo se consume y ya no queda nada dentro.

    ```js
    const response = await fetch(url);
    const datos = await response.json();
    const texto = await response.text();   // ❌ TypeError: body stream already read
    ```

    Si necesitas el mismo cuerpo dos veces, guárdalo en una variable, o duplica la respuesta antes de leerla con `response.clone()`.

---

## `response.ok`: el error que todo el mundo comete {: .topic-title }

Esta es la trampa más importante de `fetch`, y aparece en prácticamente todas las entrevistas.

**`fetch` NO rechaza la promesa cuando el servidor responde con un error.** Un `404` o un `500` son respuestas HTTP perfectamente válidas: el servidor te contestó. Desde el punto de vista de `fetch`, la operación fue un éxito.

```js
// ❌ Este código NO detecta un 404
fetch("/api/usuario/999")
    .then(response => response.json())
    .then(datos => pintar(datos))       // recibe el JSON de error del servidor
    .catch(error => console.log(error));   // esto no se ejecuta
```

`fetch` solo rechaza cuando la petición **no llega a completarse**: no hay red, el dominio no existe, CORS la bloquea o la petición se cancela.

La comprobación es responsabilidad tuya, con la propiedad `ok`:

```js
async function pedirUsuario(id) {
    const response = await fetch(`/api/usuarios/${id}`);

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
}
```

!!! tip "Escribe el `if (!response.ok)` en el mismo momento que el `fetch`"
    No lo dejes para después: es la línea que más se olvida, y su síntoma es confuso —la aplicación no rompe, simplemente pinta datos que no son los que esperabas—.

    Cuando distintos códigos requieren distinta reacción, agrúpalos:

    ```js
    if (!response.ok) {
        if (response.status === 401) return redirigirALogin();
        if (response.status === 404) return mostrarNoEncontrado();
        throw new Error(`Error del servidor: ${response.status}`);
    }
    ```

---

## Verbos HTTP {: .topic-title }

El **verbo** (o método) HTTP indica qué quieres hacer con el recurso. Se elige con la propiedad `method` de las opciones.

| Verbo | Intención | Envía cuerpo |
|---|---|---|
| `GET` | Leer un recurso | No |
| `POST` | Crear un recurso nuevo | Sí |
| `PUT` | Reemplazar un recurso **entero** | Sí |
| `PATCH` | Modificar **parte** de un recurso | Sí |
| `DELETE` | Borrar un recurso | Normalmente no |

La diferencia entre `PUT` y `PATCH` es la que más se confunde: `PUT` sustituye el objeto completo (lo que no mandes se pierde), `PATCH` solo toca los campos que envías.

### GET

Es el comportamiento por defecto, no hace falta declararlo:

```js
const response = await fetch("https://jsonplaceholder.typicode.com/posts");
const posts = await response.json();
```

Los parámetros de consulta van en la URL. Constrúyelos con `URLSearchParams` en vez de concatenar texto, porque escapa correctamente los caracteres especiales:

```js
const parametros = new URLSearchParams({ pagina: 2, buscar: "café con leche" });
const response = await fetch(`/api/productos?${parametros}`);
// /api/productos?pagina=2&buscar=caf%C3%A9+con+leche
```

### POST

Necesita tres cosas: el verbo, la cabecera que declara el formato y el cuerpo convertido a texto.

```js
const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        titulo: "Mi primer post",
        contenido: "Texto del cuerpo"
    })
});
```

!!! danger "`body` solo acepta texto — el `JSON.stringify` es obligatorio"
    ```js
    body: { titulo: "Hola" }                    // ❌ se convierte en "[object Object]"
    body: JSON.stringify({ titulo: "Hola" })    // ✅
    ```
    Es el mismo problema que aparece al guardar objetos en `localStorage`: un objeto pasado donde se espera texto no da error, se convierte silenciosamente en la cadena `"[object Object]"`. El servidor recibe basura y responde con un `400` que cuesta rastrear.

    Y sin la cabecera `Content-Type: application/json`, muchos servidores no intentarán siquiera interpretar el cuerpo.

### PUT, PATCH y DELETE

Siguen exactamente la misma forma, cambiando el verbo:

```js
// Reemplazar el recurso entero
await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Nuevo", contenido: "Todo nuevo" })
});

// Cambiar solo un campo
await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Solo cambio el título" })
});

// Borrar
await fetch(`/api/posts/${id}`, { method: "DELETE" });
```

---

## Autenticación {: .topic-title }

Casi toda API real exige identificarse. Hay dos mecanismos, y la diferencia no es de estilo: cambia dónde se guarda la credencial y qué ataques te preocupan.

### Token en la cabecera `Authorization`

El servidor devuelve un *token* al iniciar sesión, y el cliente lo envía en cada petición dentro de una cabecera.

```js
const response = await fetch("/api/tareas", {
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
});
```

`Bearer` es el esquema estándar para tokens de tipo JWT. La palabra va delante, separada por un espacio, y es literal.

!!! danger "Un token en `localStorage` es legible por cualquier script de la página"
    Es el punto que hay que tener claro antes de elegir. Si alguien consigue inyectar JavaScript en tu web —un ataque XSS, por ejemplo a través de una librería de terceros comprometida—, ese código puede leer todo el `localStorage` y llevarse el token.

    Con la sesión en una cookie marcada `HttpOnly`, JavaScript no puede leerla, así que ese robo no es posible.

    Ninguna de las dos opciones es "la correcta" siempre. Está desarrollado en la página de [almacenamiento](../../06-almacenamiento/index.md).

### Cookie de sesión

Si el servidor autentica con cookies, no hay que enviar ninguna cabecera: el navegador las adjunta solo. Pero con una condición importante.

```js
// Mismo origen: la cookie viaja automáticamente
await fetch("/api/perfil");

// Origen distinto: hay que pedirlo explícitamente
await fetch("https://api.ejemplo.com/perfil", {
    credentials: "include"
});
```

!!! warning "`credentials: \"include\"` exige que el servidor colabore"
    No basta con ponerlo en el cliente. El servidor tiene que responder con `Access-Control-Allow-Credentials: true` y, además, con un `Access-Control-Allow-Origin` que indique **un origen concreto**: el comodín `*` no es válido cuando se envían credenciales.

    Si el frontend y la API están en dominios distintos y la sesión no se mantiene, esta es la causa casi segura.

    La cookie necesita también `SameSite=None; Secure` para viajar entre sitios distintos.

| | Token en cabecera | Cookie de sesión |
|---|---|---|
| Lo envía | Tu código, en cada petición | El navegador, automáticamente |
| Vulnerable a XSS | Sí, si se guarda en `localStorage` | No, con `HttpOnly` |
| Vulnerable a CSRF | No | Sí, salvo `SameSite` |
| Entre dominios | Sencillo | Requiere configurar CORS con cuidado |
| Encaja bien con | Aplicaciones de página única, móviles | Aplicaciones servidas por el propio backend |

---

## Enviar formularios y ficheros {: .topic-title }

Cuando envías ficheros no se usa JSON, sino `FormData`. El navegador construye la petición en el formato adecuado.

```js
const formulario = document.querySelector("#mi-formulario");
const datos = new FormData(formulario);
datos.append("origen", "web");

await fetch("/api/subir", {
    method: "POST",
    body: datos          // sin Content-Type: lo pone el navegador
});
```

!!! warning "Con `FormData` NO pongas la cabecera `Content-Type`"
    El formato multipart necesita un separador aleatorio (*boundary*) que el navegador genera y añade a la cabecera. Si escribes tú el `Content-Type`, ese separador no se incluye y el servidor no sabe dónde empieza cada campo. La petición falla con un error difícil de leer.

---

## Cancelar una petición {: .topic-title }

`AbortController` es el mecanismo estándar para cortar una petición en curso. Se crea un controlador, se le pasa su `signal` al `fetch`, y se llama a `abort()` cuando ya no interesa.

```js
const controlador = new AbortController();

// Cancelar automáticamente a los 5 segundos
setTimeout(() => controlador.abort(), 5000);

try {
    const response = await fetch("/api/lento", { signal: controlador.signal });
    const datos = await response.json();
} catch (error) {
    if (error.name === "AbortError") {
        console.log("Petición cancelada");
        return;
    }
    throw error;      // cualquier otro error sí es real
}
```

El caso de uso típico es un buscador con sugerencias: cada vez que el usuario escribe una letra, cancelas la búsqueda anterior antes de lanzar la nueva. Sin eso, las respuestas pueden llegar desordenadas y pintar resultados de una consulta antigua.

!!! tip "Distingue siempre `AbortError` del resto de errores"
    Una cancelación provocada por ti no es un fallo y no debe mostrarse al usuario como tal. Comprueba `error.name === "AbortError"` antes de tratar el error como un problema real.

---

## CORS {: .topic-title }

**CORS** (*Cross-Origin Resource Sharing*, compartición de recursos entre orígenes) es una política de seguridad del navegador. Por defecto, una página no puede leer respuestas de un dominio distinto al suyo.

El permiso lo da el **servidor**, no el cliente: debe incluir en su respuesta la cabecera `Access-Control-Allow-Origin` indicando qué orígenes acepta.

Cuando falla, el error aparece en consola y el `fetch` se rechaza con un mensaje genérico de red, sin detalles del código de estado —esa opacidad es intencionada—.

!!! danger "Un error de CORS no se arregla desde el frontend"
    No hay opción de `fetch` que lo desactive, y las extensiones del navegador que "lo saltan" solo funcionan en tu máquina: en producción seguirá fallando. La solución es configurar el servidor, o pasar la petición por un intermediario propio (*proxy*) del mismo origen.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Comprobar `if (!response.ok)` en toda petición | Asumir que llegar al `.then()` significa que fue bien |
| `JSON.stringify()` en el `body` de POST/PUT/PATCH | Pasar el objeto directamente al `body` |
| Poner `Content-Type: application/json` al enviar JSON | Ponerlo cuando el cuerpo es un `FormData` |
| Construir la query con `URLSearchParams` | Concatenar valores sin escapar en la URL |
| `AbortController` en búsquedas mientras se escribe | Dejar peticiones obsoletas compitiendo por pintar |
| Centralizar la petición en una función propia | Repetir cabeceras y comprobaciones en cada llamada |
| Leer el cuerpo una sola vez | Llamar a `.json()` y luego a `.text()` sobre la misma respuesta |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Fetch API** | https://www.aprendejavascript.dev/clase/programacion-asincrona/fetch |
| 📘 **MDN — Usando Fetch** | https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch |
| 📙 **Institut Montilivi — AJAX** | https://apunts.institutmontilivi.cat/DAW-M0612/ajax.html |
| 📗 **web.dev — JavaScript** | https://web.dev/javascript?hl=es-419 |
