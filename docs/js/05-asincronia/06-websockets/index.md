# WebSockets { .bloque-js }

> `fetch` sirve para preguntar. Los WebSockets sirven para **conversar**: abren un canal permanente entre navegador y servidor por el que los dos pueden enviar mensajes en cualquier momento, sin que nadie tenga que preguntar primero.

---

## El problema {: .topic-title }

HTTP funciona por turnos: el cliente pregunta, el servidor responde, la conexión se cierra. El servidor **no puede empezar la conversación**. Si aparece un mensaje nuevo en un chat, el servidor no tiene forma de avisar.

La solución antigua era el *polling*: preguntar cada pocos segundos "¿hay algo nuevo?". Funciona, pero es un desperdicio. La mayoría de las respuestas son "no hay nada", y cada una lleva sus cabeceras, su handshake y su latencia.

Un WebSocket cambia el modelo: se abre **una** conexión y se mantiene abierta. Los dos extremos escriben cuando tienen algo que decir.

| Aspecto | HTTP | WebSocket |
|---|---|---|
| Conexión | Nueva en cada petición | Una sola, persistente |
| Dirección | El cliente pregunta, el servidor responde | Los dos hablan cuando quieren |
| Latencia | Alta (handshake + cabeceras cada vez) | Muy baja |
| Uso típico | Páginas, APIs REST, formularios | Chats, juegos, cotizaciones, notificaciones, edición colaborativa |

Aplicaciones que lo usan a diario: Slack, Discord y Telegram Web para mensajería; Binance y TradingView para precios en tiempo real; Figma y Miro para edición colaborativa; los chats de Twitch y YouTube Live.

!!! warning "Un WebSocket no sustituye a `fetch`"
    Son herramientas distintas para problemas distintos. Para cargar una lista de productos, guardar un formulario o pedir un usuario, `fetch` es lo correcto: más simple, cacheable y sin conexión que mantener.

    El WebSocket solo compensa cuando **el servidor necesita hablar primero** y con frecuencia. Abrir uno para una aplicación que hace tres peticiones en toda su vida es complicarse sin ganar nada.

---

## Cómo se establece {: .topic-title }

La conexión empieza siendo HTTP. El cliente pide "promocionar" esa conexión al protocolo WebSocket; si el servidor lo acepta, el canal queda abierto. A ese intercambio inicial se le llama *handshake*.

Como arranca sobre HTTP, hereda su autenticación y su cifrado.

Las direcciones usan su propio esquema:

| Esquema | Equivale a | Cuándo |
|---|---|---|
| `ws://` | `http://` | Desarrollo local |
| `wss://` | `https://` | **Siempre en producción** |

!!! danger "En producción, `wss://` no es opcional"
    `ws://` viaja sin cifrar: cualquiera en la misma red puede leer los mensajes. Además, una página servida por HTTPS **bloquea** las conexiones `ws://` por contenido mixto, así que ni siquiera llegará a abrirse.

---

## La API del cliente {: .topic-title }

El navegador trae el objeto `WebSocket` incorporado. Se crea pasándole la dirección, y la conexión empieza a establecerse al momento.

```js
const socket = new WebSocket("wss://servidor.ejemplo.com/chat");
```

### Estado de la conexión

La propiedad `readyState` dice en qué punto está:

| Valor | Constante | Significado |
|---|---|---|
| `0` | `WebSocket.CONNECTING` | Estableciendo la conexión |
| `1` | `WebSocket.OPEN` | Abierta y lista para enviar |
| `2` | `WebSocket.CLOSING` | Cerrándose |
| `3` | `WebSocket.CLOSED` | Cerrada o nunca llegó a abrirse |

### Los cuatro eventos

Como cualquier otra API del DOM, se escucha con `addEventListener`.

```js
const socket = new WebSocket("wss://servidor.ejemplo.com/chat");

socket.addEventListener("open", () => {
    console.log("Conexión establecida");
    socket.send(JSON.stringify({ tipo: "hola", usuario: "Ana" }));
});

socket.addEventListener("message", evento => {
    const mensaje = JSON.parse(evento.data);
    pintarMensaje(mensaje);
});

socket.addEventListener("error", () => {
    console.error("Error en la conexión");
});

socket.addEventListener("close", evento => {
    console.log(`Cerrada con código ${evento.code}`);

    if (!evento.wasClean) {
        console.warn("Cierre inesperado: habrá que reconectar");
    }
});
```

| Evento | Cuándo se dispara |
|---|---|
| `open` | La conexión queda establecida |
| `message` | Llega un mensaje; el contenido está en `evento.data` |
| `error` | Algo falló en la conexión |
| `close` | La conexión se cierra; `evento.code` y `evento.wasClean` explican por qué |

### Enviar y cerrar

```js
socket.send("texto plano");
socket.send(JSON.stringify({ tipo: "mensaje", texto: "Hola" }));

socket.close(1000, "Cierre normal");
```

El código `1000` significa cierre correcto. Es buena costumbre cerrar explícitamente cuando el usuario abandona la vista, en vez de dejar la conexión colgando.

!!! danger "No envíes nada antes del evento `open`"
    ```js
    const socket = new WebSocket(url);
    socket.send("hola");   // ❌ InvalidStateError: still in CONNECTING state
    ```
    Crear el objeto **no** abre la conexión al instante: eso lleva un viaje de ida y vuelta a la red. El primer `send` va siempre dentro del manejador de `open`, o comprobando `socket.readyState === WebSocket.OPEN`.

---

## Los datos siempre son texto {: .topic-title }

`evento.data` llega como una cadena, igual que `send()` envía una cadena. Si quieres mandar objetos, el patrón es el mismo que en `fetch` y en `localStorage`:

```js
socket.send(JSON.stringify(objeto));            // al enviar
const objeto = JSON.parse(evento.data);         // al recibir
```

!!! warning "Envuelve el `JSON.parse` en un `try`/`catch`"
    Un mensaje mal formado —o un `ping` en texto plano que envía el servidor— hace que `JSON.parse` lance una excepción dentro del manejador de eventos. Si no la capturas, rompe el flujo de mensajes.

    ```js
    socket.addEventListener("message", evento => {
        try {
            const mensaje = JSON.parse(evento.data);
            procesar(mensaje);
        } catch {
            console.warn("Mensaje no interpretable:", evento.data);
        }
    });
    ```

Una convención muy extendida es que todos los mensajes lleven un campo `tipo`, para poder repartirlos:

```js
socket.addEventListener("message", evento => {
    const mensaje = JSON.parse(evento.data);

    if (mensaje.tipo === "chat") return pintarChat(mensaje);
    if (mensaje.tipo === "usuarioEntra") return anadirUsuario(mensaje);
    if (mensaje.tipo === "error") return mostrarError(mensaje);
});
```

---

## Reconexión {: .topic-title }

Las conexiones se caen: se pierde la wifi, el servidor se reinicia, un intermediario corta la conexión por inactividad. **Un cliente de WebSocket serio siempre implementa reconexión**, porque la API nativa no la trae.

La técnica correcta es la *espera exponencial* (*exponential backoff*): reintentar esperando cada vez un poco más, hasta un tope. Reintentar cada segundo indefinidamente machaca a un servidor que ya está teniendo problemas.

```js
let intentos = 0;

function conectar() {
    const socket = new WebSocket("wss://servidor.ejemplo.com/chat");

    socket.addEventListener("open", () => {
        intentos = 0;                      // reinicio del contador al conectar
    });

    socket.addEventListener("close", evento => {
        if (evento.wasClean) return;       // cierre intencionado: no reconectar

        const espera = Math.min(1000 * 2 ** intentos, 30000);   // tope de 30 s
        intentos++;
        setTimeout(conectar, espera);
    });

    return socket;
}
```

!!! tip "Distingue el cierre intencionado del inesperado"
    `evento.wasClean` es `true` cuando el cierre siguió el protocolo (alguien llamó a `close()`). Si reconectas también en ese caso, el usuario que sale de la pantalla vuelve a entrar solo. Comprueba siempre `wasClean` antes de reintentar.

---

## El lado del servidor {: .topic-title }

Un WebSocket necesita un servidor que hable ese protocolo; no basta con un servidor HTTP normal. En Node.js la librería habitual es `ws`.

```js
import { WebSocketServer } from "ws";

const servidor = new WebSocketServer({ port: 8080 });

servidor.on("connection", cliente => {
    console.log("Nuevo cliente conectado");

    cliente.on("message", datosCrudos => {
        const mensaje = JSON.parse(datosCrudos);

        // Reenviar a todos los clientes conectados (broadcast)
        servidor.clients.forEach(destinatario => {
            if (destinatario.readyState === WebSocket.OPEN) {
                destinatario.send(JSON.stringify(mensaje));
            }
        });
    });

    cliente.on("close", () => console.log("Cliente desconectado"));
});
```

El patrón de reenviar un mensaje a todos los conectados se llama *broadcast*, y es la base de cualquier chat. Fíjate en la comprobación de `readyState`: enviar a un cliente que ya se fue lanza un error.

!!! warning "El WebSocket no controla el ritmo de los mensajes"
    A diferencia de HTTP, la API no incluye control de flujo. Si el servidor envía mensajes más deprisa de lo que el cliente puede procesarlos, se acumulan en memoria hasta agotarla.

    En aplicaciones con mucho tráfico —cotizaciones, telemetría— se agrupan los cambios y se envía un resumen cada X milisegundos en vez de un mensaje por cambio.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `wss://` en cualquier entorno que no sea local | `ws://` en producción o desde una página HTTPS |
| Enviar el primer mensaje dentro del evento `open` | Llamar a `send()` justo después de crear el socket |
| `JSON.parse` dentro de un `try`/`catch` | Confiar en que todo lo que llega es JSON válido |
| Reconectar con espera exponencial y tope | Reintentar cada segundo sin límite |
| Comprobar `wasClean` antes de reconectar | Reconectar también cuando el cierre fue intencionado |
| `close()` al abandonar la vista | Dejar conexiones abiertas que ya no escucha nadie |
| Usar `fetch` para lo que es petición-respuesta | Abrir un WebSocket para cargar datos una sola vez |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — WebSockets** | https://apunts.institutmontilivi.cat/DAW-M0612/websockets.html |
| 📘 **MDN — API WebSockets** | https://developer.mozilla.org/es/docs/Web/API/WebSockets_API |
| 📘 **MDN — WebSocket** | https://developer.mozilla.org/es/docs/Web/API/WebSocket |
