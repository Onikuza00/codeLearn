# Almacenamiento { .bloque-js }

> Todo lo que guarda una página en memoria desaparece al recargar. Para que un dato sobreviva —una preferencia, un carrito, una sesión— hay que escribirlo en algún sitio del navegador. Estas son las tres opciones y cuándo usa cada una.

---

## Las tres opciones {: .topic-title }

| | `localStorage` | `sessionStorage` | Cookies | IndexedDB |
|---|---|---|---|---|
| Tamaño | ~5 MB | ~5 MB | ~4 KB por dominio | Cientos de MB |
| Duración | Indefinida, hasta borrarla | Hasta cerrar la pestaña | La fecha que le pongas | Indefinida |
| Alcance | Todas las pestañas del dominio | **Solo esa pestaña** | Todas las pestañas del dominio | Todas las pestañas |
| Se envía al servidor | No | No | **Sí, en cada petición** | No |
| Qué guarda | Solo texto | Solo texto | Solo texto | Objetos, ficheros, binario |
| API | Sencilla y síncrona | Sencilla y síncrona | Incómoda | Compleja y asíncrona |

De esa tabla salen las dos decisiones que importan:

**El tamaño.** Las cookies son mil veces más pequeñas. Guardar en una cookie algo que no necesita el servidor es desperdiciar espacio y ancho de banda.

**El envío automático.** Es la diferencia de fondo. Una cookie viaja al servidor en **cada** petición del dominio, incluidas las imágenes y las hojas de estilo. Web Storage no sale nunca del navegador.

!!! tip "La regla para elegir"
    Pregúntate: **¿el servidor necesita este dato?**

    - Sí (sesión, autenticación, idioma que decide la plantilla) → **cookie**.
    - No (tema claro/oscuro, borrador de un formulario, filtros de una tabla) → **`localStorage`**.
    - No, y además solo vale para esta pestaña (un asistente de varios pasos, un carrito temporal) → **`sessionStorage`**.
    - No, pero son muchos datos o no son texto → **IndexedDB**.

### Cuando `localStorage` se queda corto

**IndexedDB** es una base de datos dentro del navegador. Guarda objetos y ficheros tal cual, sin convertirlos a texto, admite índices y búsquedas, y su límite es de cientos de megabytes en vez de cinco.

El precio es una API bastante más complicada, basada en transacciones y peticiones asíncronas. Casi nadie la usa directamente: se emplean envoltorios como `idb` o `Dexie`, que la exponen con promesas.

Los casos que la justifican son concretos: una aplicación que funciona sin conexión, una caché grande de respuestas, ficheros que el usuario sube y hay que conservar, un catálogo de miles de registros que se consulta en el cliente.

!!! warning "No la uses por defecto"
    Para guardar una preferencia o un borrador, `localStorage` son dos líneas e IndexedDB son treinta. La complejidad solo compensa cuando el volumen o el tipo de dato la obligan.

---

## Qué NO se guarda en el navegador {: .topic-title }

!!! danger "Nada sensible, en ninguna de las tres"
    Todo lo que guarda el navegador es **legible por el usuario** desde las herramientas de desarrollo, y por cualquier script que se ejecute en la página. No hay cifrado.

    Nunca guardes ahí contraseñas, números de tarjeta, datos personales de terceros ni claves de API.

    Los *tokens* de sesión son un caso especial: si un atacante consigue inyectar JavaScript en tu página (ataque XSS), puede leer todo el `localStorage` y llevarse el token. Por eso la forma segura de guardar sesiones es una cookie marcada como `HttpOnly`, que JavaScript directamente no puede leer.

---

## Todo se guarda como texto {: .topic-title }

Es la limitación compartida por las tres opciones, y la fuente del fallo más repetido: **solo se pueden guardar cadenas de texto**.

```js
const usuario = { nombre: "Ana", edad: 30 };
localStorage.setItem("datos", usuario);
localStorage.getItem("datos");   // "[object Object]" — el objeto se perdió
```

No hay error ni aviso. JavaScript convierte el objeto a texto usando su representación por defecto, que es la cadena inútil `"[object Object]"`.

La solución es serializar: convertir el objeto a texto JSON antes de guardarlo, y volverlo a interpretar al leerlo.

```js
localStorage.setItem("datos", JSON.stringify(usuario));

const recuperado = JSON.parse(localStorage.getItem("datos"));
console.log(recuperado.nombre);   // "Ana"
```

Es el mismo par de funciones que ya usas al enviar un `body` con `fetch` y al recibir mensajes por WebSocket. Guárdalo como pareja fija: **`stringify` al escribir, `parse` al leer**.

---

## Datos dentro del propio HTML {: .topic-title }

Hay un cuarto sitio donde guardar información, aunque no sobreviva a la recarga: los **atributos `data-*`** del HTML. Sirven para colgar datos de un elemento concreto de la página.

```html
<article id="articulo" data-referencia="ABCD" data-codigo-articulo="1234">
    Artículo 1
</article>
```

Se leen desde JavaScript con la propiedad `dataset`, que convierte el nombre a *camelCase*:

```js
const elemento = document.querySelector("#articulo");

elemento.dataset.referencia;      // "ABCD"
elemento.dataset.codigoArticulo;  // "1234"   (data-codigo-articulo)
```

También se escriben, y el atributo del HTML se actualiza al momento:

```js
elemento.dataset.referencia = "WXYZ";   // el HTML pasa a data-referencia="WXYZ"
```

!!! tip "`data-*` es el sitio natural del identificador en la delegación de eventos"
    Cuando escuchas los clics en un contenedor y necesitas saber sobre qué fila se ha hecho clic, el `data-id` del elemento es la respuesta:

    ```js
    tabla.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-id]");
        if (!boton) return;                 // early return
        borrarElemento(boton.dataset.id);
    });
    ```
    Todo lo que sale de `dataset` es **texto**, siempre. Un `data-cantidad="5"` se lee como `"5"`, no como `5`. Conviértelo con `Number()` si vas a operar.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [Web Storage](01-web-storage/index.md) | `localStorage`, `sessionStorage`, `setItem`/`getItem`/`removeItem`, JSON, evento `storage` |
| [Cookies](02-cookies/index.md) | `document.cookie`, `expires`/`max-age`, `path`, `Secure`, `HttpOnly`, `SameSite` |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Almacenamiento local** | https://apunts.institutmontilivi.cat/DAW-M0612/storage.html |
| 📙 **Institut Montilivi — Cookies** | https://apunts.institutmontilivi.cat/DAW-M0612/cookies.html |
| 📘 **MDN — Web Storage API** | https://developer.mozilla.org/es/docs/Web/API/Web_Storage_API |
