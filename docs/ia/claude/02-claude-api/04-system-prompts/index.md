# Prompting { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js. La diferencia clave: donde Python construye el diccionario de parámetros con un `if`, JS lo resuelve con un spread condicional sobre el objeto.

---

## Por qué importan {: .topic-title }

Una indicación del sistema (`system`) personaliza cómo responde Claude — tono, estilo, enfoque — para un caso de uso concreto, en vez de dejar que responda de forma genérica.

Ejemplo: un chatbot tutor de matemáticas. Si un estudiante pregunta "¿Cómo resuelvo 5x + 2 = 3 para x?", un buen tutor no da la solución de inmediato — guía.

| Debe hacer | No debe hacer |
|---|---|
| Ofrecer pistas antes que la solución completa | Dar la respuesta directa de inmediato |
| Guiar paso a paso con paciencia | Decirle al estudiante que use una calculadora |
| Mostrar ejemplos de problemas similares | |

## Cómo funcionan {: .topic-title }

`system` se pasa como un string más dentro del objeto de parámetros de `client.messages.create()` — no es un mensaje dentro de `messages`, es un campo aparte:

```js
const systemPrompt = `
Eres un tutor de matemáticas paciente.
No respondas directamente las preguntas del estudiante.
Guíalo hacia la solución paso a paso.
`;

await client.messages.create({
  model,
  messages,
  max_tokens: 1000,
  system: systemPrompt,
});
```

Efecto: Claude intenta responder como alguien en el rol indicado, y se mantiene enfocado en esa tarea durante toda la conversación.

## Función de chat con `system` opcional {: .topic-title }

El problema: la API no acepta `system` con valor vacío — si no hay indicación del sistema, ese campo no debe enviarse en absoluto. En JS esto se resuelve con un **spread condicional**:

```js
async function chat(messages, system) {
  const params = {
    model,
    max_tokens: 1000,
    messages,
    ...(system && { system }),
  };

  const message = await client.messages.create(params);
  return message.content[0].text;
}
```

`...(system && { system })` se lee así: si `system` es un valor truthy, se expande el objeto `{ system }` dentro de `params`; si `system` es `undefined` (no se pasó nada), la expresión completa vale `undefined`, y hacer spread de `undefined` no añade nada. El campo `system` termina existiendo en `params` solo cuando de verdad hay uno que enviar — es el equivalente en JS al `if system: params["system"] = system` de Python.

Uso:

```js
// Sin system prompt
const answer = await chat(messages);

// Con system prompt
const systemPrompt = `
Eres un tutor de matemáticas paciente.
No respondas directamente las preguntas del estudiante.
Guíalo hacia la solución paso a paso.
`;
const answerTutored = await chat(messages, systemPrompt);
```

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — System prompts** | https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/system-prompts |
