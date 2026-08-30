# Server-Sent Events { .bloque-js }

> A veces el servidor necesita avisar al cliente, pero el cliente no necesita responder: notificaciones, el progreso de una tarea larga, la respuesta de un modelo de lenguaje llegando palabra a palabra. Para eso hay algo más sencillo que un WebSocket.

---

## Qué son {: .topic-title }

Los **Server-Sent Events** (SSE, *eventos enviados por el servidor*) son una conexión HTTP que el servidor deja abierta y por la que va enviando mensajes cuando tiene algo que decir.

La diferencia con un WebSocket es que el canal es **de un solo sentido**: del servidor al cliente. Y esa limitación es justamente lo que los hace más simples.

| | Server-Sent Events | WebSocket |
|---|---|---|
| Dirección | Solo servidor → cliente | Los dos sentidos |
| Protocolo | HTTP normal | Protocolo propio, tras una promoción |
| Formato | Solo texto | Texto y binario |
| Reconexión | **Automática**, la hace el navegador | Manual, hay que programarla |
| En el servidor | Una respuesta HTTP que no se cierra | Un servidor específico de WebSocket |
| Atraviesa intermediarios | Sí, es HTTP | A veces bloqueado por cortafuegos |

!!! tip "La pregunta que decide entre los dos"
    **¿El cliente necesita enviar mensajes por el mismo canal?**

    - No → **SSE**. Notificaciones, progreso de una tarea, un panel que se actualiza solo, texto generado que llega poco a poco.
    - Sí → **WebSocket**. Chat, juegos, edición colaborativa.

    Y ojo: con SSE el cliente sigue pudiendo hablar con el servidor, solo que por peticiones `fetch` normales. Eso cubre la mayoría de los casos sin la complejidad de un canal bidireccional.

Es una decisión de arquitectura, y elegir un WebSocket para algo que solo baja información es sobredimensionar el problema.

---

## El cliente {: .topic-title }

El navegador trae el objeto `EventSource`. La conexión se abre sola al crearlo.

```js
const fuente = new EventSource("/api/notificaciones");

fuente.addEventListener("message", evento => {
    const datos = JSON.parse(evento.data);
    mostrarNotificacion(datos);
});

fuente.addEventListener("error", () => {
    // El navegador reintentará por su cuenta
    console.warn("Conexión interrumpida");
});

// Cerrar cuando ya no interese
fuente.close();
```

`fuente.readyState` funciona igual que en un WebSocket: `0` conectando, `1` abierta, `2` cerrada.

### Eventos con nombre

El servidor puede etiquetar cada mensaje con un tipo, y el cliente escuchar solo los que le interesan. Es más limpio que meter un campo `tipo` dentro del JSON y repartir a mano.

```js
fuente.addEventListener("tarea-completada", evento => {
    marcarComoHecha(JSON.parse(evento.data));
});

fuente.addEventListener("progreso", evento => {
    actualizarBarra(Number(evento.data));
});
```

El evento `message` solo recibe los mensajes **sin** nombre. Si el servidor los etiqueta todos y tú escuchas `message`, no llega nada. Es la confusión más habitual al empezar.

---

## El formato de los mensajes {: .topic-title }

El servidor responde con el tipo de contenido `text/event-stream` y va escribiendo bloques de texto con una estructura muy sencilla:

```
event: progreso
data: 42

event: tarea-completada
data: {"id": 7, "titulo": "Revisar informe"}

data: mensaje sin nombre, llega como "message"

```

Las reglas son tres:

1. Cada campo es `clave: valor` en su propia línea.
2. **Un bloque termina con una línea en blanco.** Sin ella, el mensaje no se entrega.
3. Los campos válidos son `event`, `data`, `id` y `retry`.

!!! danger "La línea en blanco final es obligatoria"
    Es el error número uno al implementar el servidor. Sin el doble salto de línea (`\n\n`), el navegador se queda esperando el resto del mensaje y no dispara ningún evento.

    El síntoma es desconcertante: el servidor está claramente enviando datos, la pestaña de red los muestra llegando, y en el cliente no pasa nada.

Si el valor ocupa varias líneas, se repite el campo `data` y el navegador las une con saltos de línea.

---

## Reconexión automática {: .topic-title }

Esta es la ventaja práctica más grande sobre los WebSockets. Si la conexión se cae, **el navegador vuelve a conectar solo**, sin que escribas una línea.

El servidor puede ajustar cuánto espera antes de reintentar:

```
retry: 5000
```

Y puede numerar los mensajes para no perder ninguno:

```
id: 42
data: {"mensaje": "algo pasó"}

```

Cuando el navegador reconecta, envía la cabecera `Last-Event-ID` con el último identificador que recibió. El servidor puede leerla y reenviar solo lo que se perdió durante el corte.

!!! info "Compara esto con lo que cuesta en un WebSocket"
    En un WebSocket, la reconexión con espera exponencial y la recuperación de mensajes perdidos son código que escribes y mantienes tú. En SSE viene resuelto por el navegador y el protocolo.

    Cuando el caso de uso encaja, es bastante ventaja.

---

## El servidor {: .topic-title }

En Symfony no hace falta ningún componente especial: es una respuesta HTTP que no se cierra.

```php
#[Route('/api/notificaciones', name: 'api_notificaciones')]
public function stream(): StreamedResponse
{
    $response = new StreamedResponse(function () {
        while (true) {
            $evento = $this->cola->siguiente();

            if ($evento !== null) {
                echo "event: notificacion\n";
                echo "data: " . json_encode($evento) . "\n\n";
                ob_flush();
                flush();
            }

            sleep(1);
        }
    });

    $response->headers->set('Content-Type', 'text/event-stream');
    $response->headers->set('Cache-Control', 'no-cache');
    $response->headers->set('X-Accel-Buffering', 'no');

    return $response;
}
```

Las tres cabeceras hacen falta las tres:

- `Content-Type: text/event-stream` es lo que el navegador necesita para tratar la respuesta como un flujo de eventos.
- `Cache-Control: no-cache` evita que un intermediario guarde y reutilice la respuesta.
- `X-Accel-Buffering: no` le dice a Nginx que **no acumule** la salida antes de enviarla.

!!! danger "Sin `X-Accel-Buffering: no`, Nginx retiene los mensajes"
    Por defecto Nginx agrupa la respuesta de PHP-FPM en un búfer y la manda cuando se llena o cuando termina. Como un flujo de eventos no termina nunca, los mensajes se quedan atascados.

    Y aquí está lo traicionero: **en desarrollo funciona** (sin Nginx delante, o con el servidor integrado de PHP) y en producción no. Ese salto es exactamente el que describe la página del [stack de Symfony](../../../devops/01-docker/07-stack-symfony/index.md).

!!! warning "Cada conexión ocupa un proceso de PHP-FPM entero"
    Es la limitación seria en un backend de PHP. PHP-FPM tiene un número fijo de procesos; si cada usuario conectado retiene uno de forma indefinida, con unas pocas decenas de usuarios el servidor deja de atender peticiones normales.

    Alternativas cuando eso es un problema: Mercure —el componente que Symfony recomienda precisamente para esto, con un servidor propio escrito en Go—, o mover el flujo a un proceso aparte en Node.

---

## Límite de conexiones {: .topic-title }

!!! warning "Seis conexiones por dominio en HTTP/1.1"
    El navegador limita a seis las conexiones simultáneas por dominio. Como una conexión SSE queda abierta para siempre, **seis pestañas del mismo sitio agotan el cupo** y la séptima se queda esperando, junto con cualquier otra petición al mismo dominio.

    Con HTTP/2 el límite sube a unos cien, porque todo viaja multiplexado sobre una sola conexión. Si vas a usar SSE en producción, HTTP/2 no es opcional.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| SSE cuando el flujo es solo de bajada | WebSocket para algo que nunca sube información |
| Terminar cada mensaje con una línea en blanco | Enviar `data:` sin el doble salto de línea |
| Nombrar los eventos con `event:` | Meter el tipo dentro del JSON y repartir a mano |
| Escuchar el nombre correcto | Escuchar `message` cuando el servidor nombra los eventos |
| `X-Accel-Buffering: no` detrás de Nginx | Probar solo en local y dar por hecho que funciona |
| `id:` para recuperar lo perdido tras un corte | Asumir que no se pierde nada al reconectar |
| `close()` al abandonar la vista | Dejar conexiones abiertas consumiendo procesos |
| HTTP/2 en producción | Ignorar el límite de seis conexiones por dominio |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Server-Sent Events** | https://developer.mozilla.org/es/docs/Web/API/Server-sent_events |
| 📘 **MDN — EventSource** | https://developer.mozilla.org/es/docs/Web/API/EventSource |
| 🐘 **Symfony — Mercure** | https://symfony.com/doc/current/mercure.html |
