# Conversaciones con herramientas { .bloque-ia }

> Encadenar varias llamadas a herramientas en un bucle automático, hasta que Claude tenga todo lo que necesita para responder.

---

## Por qué hace falta un bucle { .topic-title }

En el tema anterior, la herramienta se llamaba una sola vez: pregunta del usuario → Claude pide la herramienta → se ejecuta → se le devuelve el resultado → respuesta final. Alcanza cuando la pregunta necesita un solo dato.

Pero a veces Claude necesita **varias herramientas en cadena** para responder: pide una, mira el resultado, se da cuenta de que todavía le falta información, pide otra, y así hasta que tiene lo que hace falta para contestar. Manejar esto a mano, llamada por llamada, no escala — hace falta un **bucle** que siga preguntándole a Claude hasta que deje de pedir herramientas.

!!! tip "`stop_reason` — la señal directa de por qué Claude paró"
    Hasta ahora, para saber si Claude pedía una herramienta, había que buscar a mano un bloque `tool_use` dentro de `response.content`. Hay una forma más directa: la respuesta completa trae un campo `stop_reason` que dice por qué Claude dejó de generar texto.

    Sus valores posibles son `"end_turn"`, `"max_tokens"`, `"stop_sequence"` y `"tool_use"`. Si vale exactamente `"tool_use"`, Claude se detuvo para pedir una herramienta. Cualquier otro valor significa que ya terminó — esa es su respuesta final.

    Un detalle importante: `stop_reason` vive en el objeto de mensaje completo, al lado de `content`, no dentro de `content`. Por eso hace falta que la función que llama a la API devuelva el mensaje entero (`message`), no solo `message.content` — si solo devuelve `content`, el dato de `stop_reason` no llega.

## `chat()` devuelve el mensaje completo { .topic-title }

Por el motivo del tip de arriba, `chat()` cambia: en vez de `return message.content`, ahora es `return message`. Las herramientas activas se siguen indicando con `tools`, igual que en el tema anterior:

```js
async function chat(messages) {
  const message = await client.messages.create({
    model: modelo,
    max_tokens: 1000,
    tools: [getCurrentDatetimeSchema],
    messages,
  });

  return message; // antes: return message.content
}
```

## Guardar la respuesta de Claude en el historial { .topic-title }

Cada vuelta del bucle necesita guardar la respuesta de Claude en `messages`, para no perder el hilo de la conversación. Para eso sirve `addAssistantMessage` — la contraparte de `addUserMessage`, pero para el lado del asistente:

```js
function addAssistantMessage(messages, message) {
  messages.push({ role: 'assistant', content: message.content });
}
```

!!! tip "El error 400 que avisa cuando falta desenvolver `.content`"
    Si en vez de `message.content` se guarda el `message` completo (`content: message`), la próxima llamada a la API falla con un error 400: `"content: Input should be a valid array"`. La razón: la API espera que `content` sea siempre un string o un array de bloques — nunca el objeto de respuesta completo, con sus metadatos (`id`, `stop_reason`, `usage`...) de por medio. Esos metadatos son información *sobre* la respuesta, no parte de lo que Claude dijo, y no se reenvían.

!!! tip "Por qué `addUserMessage` no necesita este mismo ajuste"
    `addUserMessage` mete lo que se le pasa, tal cual: `messages.push({ role: 'user', content: text })`. Funciona sin distinguir casos porque siempre se la llama con el tipo correcto ya armado — un string (la pregunta del usuario) o un array (los bloques `tool_result`) — nunca con el objeto de respuesta completo de la API. Desenvolver `.content` hace falta únicamente en `addAssistantMessage`, porque ahí sí se le pasa la respuesta cruda de `chat()`.

## El bucle: `runConversation` { .topic-title }

```js
async function runConversation(messages) {
  while (true) {
    const response = await chat(messages);
    addAssistantMessage(messages, response);

    if (response.stop_reason !== 'tool_use') break;

    const toolResultBlocks = await runTools(response);
    addUserMessage(messages, toolResultBlocks);
  }

  return messages;
}
```

!!! tip "`while (true)` es infinito a propósito"
    El `while` no lleva ninguna condición — no dice "mientras queden herramientas". La condición de corte real está *adentro*, con el `break`: en cada vuelta se le pregunta a Claude, se mira `stop_reason` de la respuesta que acaba de llegar, y si no vale `"tool_use"`, se corta ahí. No hay una lista de herramientas pendientes que se va vaciando — Claude decide en cada vuelta, mirando el historial acumulado, si necesita otra herramienta o ya puede contestar. Por eso no se sabe de antemano cuántas vueltas van a hacer falta, y el bucle tiene que poder repetirse indefinidamente hasta que Claude mismo decida parar.

`runConversation` devuelve el array `messages` completo — la pregunta original, cada `tool_use`/`tool_result` intermedio, y la respuesta final. El último elemento del array es siempre esa respuesta final, porque es lo último que el bucle guarda antes de cortar con el `break`.

## Ejecutar la herramienta que Claude pide: `runTool` { .topic-title }

Es la función que traduce "Claude pidió la herramienta X" en "ejecutá la función real que le corresponde". Compara el `name` del bloque `tool_use` contra un `switch`:

```js
async function runTool(toolName, toolInput) {
  switch (toolName) {
    case 'hora_actual':
      return getCurrentDatetime(toolInput.format);
    default:
      throw new Error(`Herramienta desconocida: ${toolName}`);
  }
}
```

!!! tip "Por qué un `switch` y no una cadena de `if`"
    Sumar una herramienta nueva es agregar un `case` más — nunca hay que tocar el resto del flujo (`runTools`, `runConversation`). El `default` que lanza error no es decorativo: si Claude pidiera una herramienta que no está en el `switch` (por ejemplo, porque el esquema no coincide con lo que se implementó), el error cae directo en el `try`/`catch` de `runTools`, y Claude se entera del problema en vez de que la función devuelva `undefined` en silencio.

## Recorrer todos los pedidos: `runTools` { .topic-title }

Claude puede pedir más de una herramienta en la misma respuesta, así que hay que recorrer **todos** los bloques `tool_use` del mensaje (con `filter`, no `find`), ejecutar cada uno, y devolver un `tool_result` por cada uno:

```js
async function runTools(message) {
  const toolRequests = message.content.filter((block) => block.type === 'tool_use');
  const toolResultBlocks = [];

  for (const toolRequest of toolRequests) {
    let toolResultBlock;

    try {
      const toolOutput = await runTool(toolRequest.name, toolRequest.input);
      const content = typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput);

      toolResultBlock = {
        type: 'tool_result',
        tool_use_id: toolRequest.id,
        content,
        is_error: false,
      };
    } catch (error) {
      toolResultBlock = {
        type: 'tool_result',
        tool_use_id: toolRequest.id,
        content: `Error: ${error.message}`,
        is_error: true,
      };
    }

    toolResultBlocks.push(toolResultBlock);
  }

  return toolResultBlocks;
}
```

!!! tip "El `try`/`catch` va DENTRO del `for`, no alrededor"
    Tiene que envolver la ejecución de **cada** `toolRequest`, no el `for` entero. Si el `try`/`catch` rodea todo el bucle, un solo error corta el procesamiento de las herramientas restantes, y ninguna de ellas llega a tener su `tool_result`. Puesto dentro del `for`, un fallo puntual solo afecta a esa vuelta — las demás siguen. Tampoco es opcional: sin capturar el error, se corta toda la conversación con una excepción sin manejar; capturándolo, Claude recibe igual un `tool_result` (con `is_error: true`) y puede decidir qué hacer con eso.

!!! tip "`let toolResultBlock` va ANTES del `try`, no adentro"
    `try { }` y `catch { }` son dos bloques distintos, cada uno con su propio scope — una variable declarada con `let` dentro de `try` no existe dentro de `catch`. Si la herramienta lanza un error, la línea del `catch` que intenta usar `toolResultBlock` revienta con `ReferenceError: toolResultBlock is not defined`. La declaración tiene que quedar en el scope del `for`, un nivel arriba del `try`/`catch`, para que ambos bloques la vean y puedan asignarle un valor.

!!! tip "Solo convertir a string cuando hace falta"
    El `content` de un `tool_result` tiene que ser un string. Si la función ya devuelve un string (como `getCurrentDatetime`), se usa tal cual; si devolviera otra cosa (un objeto, un número), hay que convertirlo con `JSON.stringify`. Aplicar `JSON.stringify` siempre, sin distinguir, envuelve los strings entre comillas de más (`"14:30:25"` en vez de `14:30:25`) — funciona, pero es ruido innecesario que Claude tiene que ignorar.

## Probar el flujo completo { .topic-title }

```js
const messages = [];
addUserMessage(messages, '¿Qué hora es?');

const historial = await runConversation(messages);
const ultimoMensaje = historial[historial.length - 1];

console.log(ultimoMensaje.content.find((block) => block.type === 'text').text);
```

## Sumar una herramienta nueva { .topic-title }

Con el bucle y el router ya escritos, agregar una herramienta más es mecánico — siempre los mismos cuatro pasos:

!!! tip "El patrón para sumar cualquier herramienta nueva"
    1. Escribir la función de la herramienta.
    2. Escribir su esquema.
    3. Agregarla al array `tools` de `chat()`.
    4. Agregar un `case` nuevo en `runTool`.

    El resto del sistema —el bucle, el manejo de bloques, el manejo de errores— ya está escrito y no cambia.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Tool use** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview |
