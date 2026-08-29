# Streaming { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js.

---

## El problema de esperar la respuesta completa {: .topic-title }

Una respuesta de Claude puede tardar entre 10 y 30 segundos en generarse por completo. Sin streaming, el servidor espera el mensaje entero antes de mandar nada al cliente — el usuario se queda mirando un indicador de carga sin ninguna señal de que algo está pasando.

## Cómo funciona el streaming {: .topic-title }

Con `stream: true`, Claude no manda la respuesta de una sola vez — manda una serie de **eventos**, cada uno con un fragmento pequeño de la respuesta completa, todos parte de la misma solicitud. El servidor reenvía esos fragmentos al cliente a medida que llegan, así el usuario ve el texto aparecer palabra por palabra.

## Tipos de eventos {: .topic-title }

| Evento | Qué indica |
|---|---|
| `message_start` | Empieza un mensaje nuevo |
| `content_block_start` | Empieza un bloque de contenido (texto, uso de herramienta...) |
| `content_block_delta` | Fragmento de contenido generado — acá está el texto que se quiere mostrar |
| `content_block_stop` | Ese bloque de contenido terminó |
| `message_delta` | Cambios a nivel del mensaje completo |
| `message_stop` | Fin del mensaje |

## Eventos crudos {: .topic-title }

```js
const messages = [];
addUserMessage(messages, 'Escribe la descripción de una base de datos ficticia en una frase');

const stream = client.messages.stream({
  model,
  max_tokens: 1000,
  messages,
});

for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    process.stdout.write(event.delta.text);
  }
}
```

`client.messages.stream()` devuelve un objeto que se puede recorrer directamente con `for await...of` — cada `event` es uno de los tipos de la tabla de arriba. Solo los eventos `content_block_delta` con `delta.type === 'text_delta'` traen texto para mostrar.

## Forma simplificada — solo el texto {: .topic-title }

Filtrar eventos a mano no siempre hace falta. El mismo objeto que devuelve `client.messages.stream()` expone `.on('text', ...)`, que ya entrega solo el texto generado:

```js
await client.messages
  .stream({
    model,
    max_tokens: 1000,
    messages,
  })
  .on('text', (text) => {
    process.stdout.write(text);
  });
```

## Recuperar el mensaje completo {: .topic-title }

El streaming es ideal para mostrarle texto al usuario en tiempo real, pero a veces también hace falta el objeto `Message` completo — por ejemplo para guardarlo en la base de datos o añadirlo al historial de la conversación:

```js
const stream = client.messages.stream({
  model,
  max_tokens: 1000,
  messages,
});

stream.on('text', (text) => {
  // reenviar cada fragmento al cliente
});

const message = await stream.finalMessage();
const textBlock = message.content.find((block) => block.type === 'text');
```

!!! tip "El mismo `.find()` de siempre"
    `finalMessage()` devuelve un `Message` idéntico al de una llamada sin streaming — así que aplica la misma regla que ya vimos en [Creando la conexión](../02-creando-conexion/index.md): no asumir `content[0]`, buscar el bloque `type === "text"`.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Streaming Messages** | https://platform.claude.com/docs/en/build-with-claude/streaming |
