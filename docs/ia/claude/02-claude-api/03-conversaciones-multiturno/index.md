# Conversaciones multiturno { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js. La diferencia clave respecto al resto del bloque: en JS, `chat()` tiene que ser `async` porque `client.messages.create()` devuelve una `Promise`.

---

## Claude no recuerda nada — cada solicitud es independiente {: .topic-title }

La API de Anthropic no guarda tu historial de conversación. Cada llamada a `client.messages.create()` es un evento aislado, sin memoria de solicitudes anteriores.

Mantener el hilo de una conversación es responsabilidad de tu código, no de la API.

## Cómo funciona una conversación multiturno {: .topic-title }

Para que Claude "recuerde" el contexto, hacen falta dos cosas:

1. Mantener manualmente una lista con todos los mensajes de la conversación.
2. Enviar esa lista completa en cada nueva solicitud, no solo el mensaje nuevo.

El flujo, paso a paso:

<div class="grid cards" markdown>

-   **1. Mensaje inicial**

    Se envía el mensaje inicial del usuario.

-   **2. Respuesta del asistente**

    La respuesta de Claude se añade a la lista como mensaje de rol `"assistant"`.

-   **3. Siguiente pregunta**

    La siguiente pregunta se añade a la lista como mensaje de rol `"user"`.

-   **4. Solicitud completa**

    Se envía la lista **completa** (los cuatro mensajes) en la nueva solicitud.

</div>

## Funciones auxiliares {: .topic-title }

Tres funciones cubren todo el patrón: dos para construir la lista de mensajes, una para hacer la llamada a la API.

```js
function addUserMessage(messages, text) {
  messages.push({ role: 'user', content: text });
}

function addAssistantMessage(messages, text) {
  messages.push({ role: 'assistant', content: text });
}

async function chat(messages) {
  const message = await client.messages.create({
    model,
    max_tokens: 1000,
    messages,
  });
  return message.content[0].text;
}
```

## Ejemplo completo {: .topic-title }

```js
const messages = [];

addUserMessage(messages, 'Define la computación cuántica en una frase');

const respuesta = await chat(messages);
addAssistantMessage(messages, respuesta);

addUserMessage(messages, 'Escribe otra frase');

const respuestaFinal = await chat(messages);
```

En la segunda llamada a `chat()`, `messages` ya trae los tres mensajes anteriores (usuario, asistente, usuario) — por eso Claude entiende que "Escribe otra frase" sigue hablando de computación cuántica.

!!! tip "Los roles tienen que alternarse"
    La API espera la secuencia `user` → `assistant` → `user` → `assistant`... empezando siempre por `user`. Si se envían dos mensajes seguidos del mismo rol (por ejemplo, olvidar añadir la respuesta de Claude antes del siguiente `addUserMessage`), la API responde con un error de validación — el array `messages` no es una lista libre, tiene que respetar ese turno estricto.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Messages API** | https://docs.claude.com/en/api/messages |
