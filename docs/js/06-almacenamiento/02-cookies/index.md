# Cookies { .bloque-js }

> Una cookie es un dato pequeño que el navegador guarda asociado a un dominio y **reenvía al servidor en cada petición**. Ese envío automático es toda su razón de ser: es el mecanismo con el que un servidor sin memoria reconoce a un visitante.

---

## Para qué sirven {: .topic-title }

HTTP no recuerda nada. Cada petición llega al servidor como si fuera la primera vez: no hay forma de saber que dos peticiones vienen del mismo navegador.

La cookie resuelve exactamente eso. El servidor envía un dato, el navegador lo guarda y lo devuelve en todas las peticiones siguientes al mismo dominio. El servidor lo lee y sabe con quién habla.

Usos habituales:

- **Sesión y autenticación** — el caso principal, con diferencia.
- **Preferencias que el servidor necesita** — idioma con el que generar la plantilla.
- **Consentimiento** — recordar la respuesta al aviso de cookies.
- **Analítica y seguimiento** — el uso que motiva la normativa de consentimiento.

Sus límites son estrictos: alrededor de **4096 bytes por dominio**, y unos 1024 bytes por cookie, contando nombre, valor y metadatos.

!!! warning "Cada cookie viaja en TODAS las peticiones del dominio"
    Y eso incluye las imágenes, las hojas de estilo y los scripts. Cuatro kilobytes de cookies multiplicados por cincuenta recursos de la página son doscientos kilobytes de subida que no aportan nada.

    Regla práctica: **si el servidor no necesita el dato, no va en una cookie.** Va en `localStorage`.

---

## Leer y escribir desde JavaScript {: .topic-title }

La API nativa es `document.cookie`, y es de las más incómodas del lenguaje. Conviene entenderla, aunque en un proyecto real se envuelva en funciones propias.

### Escribir

```js
document.cookie = "usuario=Ana";
```

Aunque parece una asignación normal, **no reemplaza las cookies existentes**: añade o actualiza esa única cookie. Es una propiedad con comportamiento especial.

### Leer

```js
document.cookie;   // "usuario=Ana; tema=oscuro; idioma=es"
```

Al leer devuelve **todas** las cookies en una sola cadena, separadas por `; `, y **solo con nombre y valor**: la fecha de caducidad, el `path` y las banderas de seguridad no se pueden consultar desde JavaScript.

Para sacar una concreta hay que trocear la cadena:

```js
function leerCookie(nombre) {
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
        const [clave, valor] = cookie.split("=");
        if (clave === nombre) return decodeURIComponent(valor);
    }

    return null;
}
```

!!! tip "La API moderna: `cookieStore`"
    Los navegadores basados en Chromium ofrecen `cookieStore`, una API con promesas mucho más razonable:

    ```js
    await cookieStore.set({ name: "tema", value: "oscuro", maxAge: 86400 });
    const cookie = await cookieStore.get("tema");
    ```
    Todavía no está en todos los navegadores —Safari y Firefox van por detrás—, así que `document.cookie` sigue siendo lo que se escribe cuando hace falta compatibilidad total.

---

## Duración {: .topic-title }

Sin indicar nada, la cookie es **de sesión**: desaparece al cerrar el navegador.

Para que dure, hay dos atributos:

```js
// max-age: segundos desde ahora — más legible y recomendado
document.cookie = "tema=oscuro; max-age=2592000";   // 30 días

// expires: una fecha absoluta en formato UTC
const caducidad = new Date();
caducidad.setDate(caducidad.getDate() + 30);
document.cookie = `tema=oscuro; expires=${caducidad.toUTCString()}`;
```

**Prefiere `max-age`.** `expires` depende de una fecha absoluta, y el reloj del ordenador del usuario puede estar mal, lo que hace que la cookie caduque antes de tiempo o no caduque nunca.

### Borrar

No hay método de borrado: se le pone una fecha de caducidad ya pasada, o `max-age=0`.

```js
document.cookie = "tema=; max-age=0; path=/";
```

!!! danger "Para borrar hay que repetir el `path` y el `domain` originales"
    Una cookie se identifica por la terna **nombre + path + domain**. Si la creaste con `path=/` y la intentas borrar sin indicar `path`, el navegador cree que hablas de otra cookie distinta y la original sigue viva.

    Este es el motivo número uno de "he borrado la cookie y sigue ahí".

---

## Alcance: `path` y `domain` {: .topic-title }

| Atributo | Qué controla | Ejemplo |
|---|---|---|
| `path` | En qué rutas se envía la cookie | `path=/` → toda la web; `path=/admin` → solo esa sección |
| `domain` | Qué dominios la reciben | `domain=ejemplo.com` → también `blog.ejemplo.com` |

Sin `path`, el valor por defecto es la ruta de la página actual, lo que suele ser un error: la cookie no se envía desde el resto del sitio. **Pon `path=/` salvo que tengas una razón concreta para limitarla.**

---

## Seguridad {: .topic-title }

Tres atributos que separan una cookie correcta de un agujero de seguridad.

### `Secure`

La cookie solo se envía por HTTPS. Sin este atributo viaja en claro por HTTP y cualquiera en la misma red puede leerla.

```js
document.cookie = "token=abc123; Secure; path=/";
```

### `HttpOnly`

JavaScript **no puede leer** la cookie: no aparece en `document.cookie`. Solo la ve el servidor.

Es la defensa contra los ataques XSS: si alguien consigue inyectar un script en tu página, no puede robar el identificador de sesión porque no tiene forma de leerlo.

!!! danger "`HttpOnly` solo lo puede poner el servidor"
    Y es intencionado. Una cookie `HttpOnly` creada desde JavaScript sería una contradicción: el propio código que la crea podría leerla.

    De aquí sale la regla más importante del tema: **las cookies de sesión y autenticación las crea el servidor con `HttpOnly`, `Secure` y `SameSite`; nunca JavaScript.** Desde el navegador solo escribes cookies de cosas sin valor: un tema, un aviso ya cerrado.

### `SameSite`

Controla si la cookie viaja cuando la petición la origina **otro** sitio web. Es la defensa contra los ataques CSRF, en los que una página maliciosa hace que tu navegador envíe una petición a un sitio donde tienes sesión abierta.

| Valor | Comportamiento |
|---|---|
| `Strict` | Nunca se envía desde otro sitio, ni siquiera al seguir un enlace |
| `Lax` | Se envía al navegar por enlaces, no en peticiones en segundo plano — **el valor por defecto hoy** |
| `None` | Se envía siempre; **obliga a añadir `Secure`** |

```js
document.cookie = "preferencia=azul; path=/; max-age=2592000; SameSite=Lax";
```

---

## Escribir cookies correctamente {: .topic-title }

Dos detalles fáciles de olvidar.

**Los valores hay que codificarlos.** Un punto y coma, un espacio o una coma dentro del valor rompen el formato de la cadena.

```js
const valor = "Ana Pérez; administradora";

document.cookie = `usuario=${valor}`;                       // ❌ se corta en el ;
document.cookie = `usuario=${encodeURIComponent(valor)}`;   // ✅
```

Y al leer, la operación inversa: `decodeURIComponent(valor)`.

**Los atributos se separan con `;` en la misma asignación**, en una sola línea:

```js
document.cookie = "tema=oscuro; max-age=2592000; path=/; SameSite=Lax; Secure";
```

!!! warning "Las cookies no funcionan abriendo el fichero con doble clic"
    Con una URL `file://` el navegador no permite crear cookies, por seguridad. Si estás probando y no se guarda ninguna, comprueba que la página se sirve por `http://` o `https://` — con un servidor local, no abriendo el HTML directamente.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Cookie solo si el **servidor** necesita el dato | Guardar preferencias del cliente en cookies |
| `max-age` en segundos | `expires` con fecha absoluta, sensible al reloj del usuario |
| `path=/` salvo motivo concreto | Dejar el `path` por defecto y luego no encontrar la cookie |
| Repetir `path` y `domain` al borrar | Asignar `max-age=0` sin los atributos originales |
| `Secure` + `HttpOnly` + `SameSite` en sesión, **desde el servidor** | Crear cookies de sesión desde JavaScript |
| `encodeURIComponent` en el valor | Meter texto con `;`, espacios o acentos sin codificar |
| Envolver la lectura y escritura en funciones propias | Trocear `document.cookie` a mano en cada sitio |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Cookies** | https://apunts.institutmontilivi.cat/DAW-M0612/cookies.html |
| 📘 **MDN — Document.cookie** | https://developer.mozilla.org/es/docs/Web/API/Document/cookie |
| 📘 **MDN — Cookies HTTP** | https://developer.mozilla.org/es/docs/Web/HTTP/Cookies |
