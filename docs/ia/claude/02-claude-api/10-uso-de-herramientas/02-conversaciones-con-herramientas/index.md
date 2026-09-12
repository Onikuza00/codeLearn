# Conversaciones con herramientas { .bloque-ia }

> Encadenar varias llamadas a herramientas en un bucle automático, hasta que Claude tenga todo lo que necesita para responder.

---

## Conversaciones de varios turnos con herramientas { .topic-title }

Cuando una pregunta necesita más de una herramienta para responderse (por ejemplo, "¿qué día será dentro de 103 días?" — primero hay que saber qué día es hoy, y después sumarle 103), Claude no lo resuelve en una sola ida y vuelta: pide una herramienta, la usa, se da cuenta de que necesita otra, la pide, y así hasta que tiene lo que hace falta para contestar.

**El patrón, paso a paso:**

1. El usuario pregunta "¿qué día será dentro de 103 días?".
2. Claude pide usar `getCurrentDatetime`.
3. El servidor ejecuta la función y devuelve el resultado.
4. Claude ve que todavía le falta información y pide `addDurationToDatetime`.
5. El servidor ejecuta esa segunda función y devuelve el resultado.
6. Recién ahí Claude tiene lo que necesita para dar la respuesta final.

Manejar esto a mano, llamada por llamada, no escala. Hace falta un **bucle** que siga preguntándole a Claude hasta que deje de pedir herramientas:

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

**`stop_reason`, la señal directa de por qué Claude paró.** En vez de recorrer `response.content` buscando bloques `tool_use`, el propio objeto de respuesta ya trae un campo `stop_reason` que dice por qué Claude dejó de generar — sus valores posibles incluyen `"end_turn"`, `"max_tokens"`, `"stop_sequence"` y `"tool_use"`. Cuando vale exactamente `"tool_use"`, Claude se detuvo específicamente para pedir una herramienta; cualquier otro valor significa que ya terminó y esa es su respuesta final.

!!! tip "`while (true)` es infinito a propósito"
    El `while` no lleva ninguna condición — no dice "mientras queden herramientas". La condición de corte real está *adentro*, con el `break`: en cada vuelta se le pregunta a Claude, se mira `stop_reason` de la respuesta que acaba de llegar, y si no vale `"tool_use"`, se corta ahí. No hay una lista de herramientas pendientes que se va vaciando — Claude decide en cada vuelta, mirando el historial acumulado, si necesita otra herramienta o ya puede contestar. Por eso no se sabe de antemano cuántas vueltas van a hacer falta, y el bucle tiene que poder repetirse indefinidamente hasta que Claude mismo decida parar.

Antes de escribir ese bucle, hay que actualizar los helpers: hasta ahora asumían que siempre se trabaja con texto plano, y eso ya no alcanza.

**`addUserMessage` (y `addAssistantMessage`) más flexibles.** Tienen que aceptar tres formas de entrada: un string suelto, un array de bloques (como el `tool_result` de la lección anterior), o un objeto de mensaje completo (la respuesta cruda que devuelve `client.messages.create()`):

```js
function addUserMessage(messages, message) {
  const isFullMessage = message && typeof message === 'object' && message.type === 'message';
  messages.push({
    role: 'user',
    content: isFullMessage ? message.content : message,
  });
}
```

!!! tip "El campo `type` como discriminador"
    `Message` es un tipo de TypeScript, no una clase — no existe en tiempo de ejecución, así que no se puede usar `instanceof` para distinguirlo. La respuesta real que llega de la API sí trae un campo `type: "message"` en el propio objeto, y ese campo es el que sirve para reconocerla.

**`chat()` acepta herramientas y devuelve el mensaje completo, no solo el texto:**

```js
async function chat(messages, system, temperature = 1.0, stopSequences = [], tools) {
  const params = {
    model: modelo,
    max_tokens: 1000,
    messages,
    temperature,
  };

  if (system) params.system = system;
  if (stopSequences.length) params.stop_sequences = stopSequences;
  if (tools) params.tools = tools;

  return await client.messages.create(params);
}
```

Antes, `chat()` devolvía directamente el texto (`message.content.find(...).text`); ahora hace falta el mensaje completo, con todos sus bloques, para poder detectar si hay un `tool_use` y para poder guardarlo entero en el historial.

**Sacar el texto cuando hace falta.** Como `chat()` ya no devuelve un string, hace falta una función aparte para cuando sí interesa mostrarle texto legible al usuario:

```js
function textFromMessage(message) {
  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}
```

Junta todos los bloques de texto del mensaje (puede haber más de uno) en un solo string.

Con estos cambios —helpers flexibles, `chat()` con soporte de `tools` devolviendo el mensaje completo, y `textFromMessage()` para cuando hace falta texto legible— ya está la base lista para el bucle de conversación de varias vueltas.

## Implementar múltiples giros { .topic-title }

Al `runConversation` de la lección anterior le falta una pieza: qué hace exactamente `runTools`. Claude puede pedir más de una herramienta en la misma respuesta, así que hay que recorrer todos los bloques `tool_use` del mensaje, ejecutar cada uno, y devolver un `tool_result` por cada uno:

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

!!! tip "Solo serializar cuando hace falta"
    El `content` de un `tool_result` tiene que ser un string. Si la función ya devuelve un string (como `getCurrentDatetime`), usarlo tal cual; si devuelve otra cosa (un objeto, un número, un array), hay que convertirlo con `JSON.stringify`. Aplicar `JSON.stringify` siempre, sin distinguir, envuelve los strings entre comillas de más (`"14:30:25"` en vez de `14:30:25`) — funciona, pero es ruido innecesario que Claude tiene que ignorar.

**El `try`/`catch` no es opcional.** Si una herramienta lanza un error y no se captura, se corta toda la conversación con una excepción sin manejar. Capturándolo, Claude recibe igual un `tool_result` — con `is_error: true` y el mensaje de error como `content` — y puede decidir qué hacer con eso (reintentar con otros parámetros, o avisarle al usuario).

**Enrutar por nombre, no con un `if` gigante que crece para siempre.** `runTool` es la única función que sabe qué nombre de herramienta corresponde a qué función real — agregar una herramienta nueva significa sumar un `case` acá, sin tocar `runTools` ni `runConversation`:

```js
async function runTool(toolName, toolInput) {
  switch (toolName) {
    case 'get_current_datetime':
      return getCurrentDatetime(toolInput.format);
    // más herramientas, a medida que se agreguen
    default:
      throw new Error(`Herramienta desconocida: ${toolName}`);
  }
}
```

El `default` que lanza un error no es decorativo: si Claude alguna vez pide una herramienta que no está en el `switch` (por ejemplo, porque el esquema que le pasaste no coincide con lo que implementaste), ese error cae directo en el `try`/`catch` de `runTools` de arriba, y Claude se entera del problema en vez de que la función devuelva `undefined` en silencio.

## Utilizar múltiples herramientas { .topic-title }

Con el bucle y el router ya funcionando, sumar una herramienta nueva es mecánico. Para un sistema de recordatorios con tres herramientas —`getCurrentDatetime`, `addDurationToDatetime` (Claude no es fiable haciendo aritmética de fechas a mano, mejor delegarlo a una función) y `setReminder`— el cambio es de dos puntos.

**1. Sumar los esquemas al array de `tools`:**

```js
const response = await chat(messages, undefined, 1.0, [], [
  getCurrentDatetimeSchema,
  addDurationToDatetimeSchema,
  setReminderSchema,
]);
```

**2. Sumar un `case` por herramienta en el router:**

```js
async function runTool(toolName, toolInput) {
  switch (toolName) {
    case 'get_current_datetime':
      return getCurrentDatetime(toolInput.format);
    case 'add_duration_to_datetime':
      return addDurationToDatetime(toolInput);
    case 'set_reminder':
      return setReminder(toolInput);
    default:
      throw new Error(`Herramienta desconocida: ${toolName}`);
  }
}
```

Nada más cambia — ni `runConversation` ni `runTools` necesitan tocarse. Ese es el punto de haber centralizado el enrutamiento en una sola función: agregar una herramienta es agregar un `case`, no reescribir el flujo.

**Prueba real:** una pregunta como *"Configura un recordatorio para mi cita con el médico. Faltan 177 días para el 1 de enero de 2050"* obliga a Claude a encadenar dos herramientas en la misma conversación: primero `addDurationToDatetime` para calcular la fecha exacta, después `setReminder` con esa fecha ya calculada. Claude explica en texto lo que va a hacer y después ejecuta las dos llamadas en secuencia, todo dentro del mismo `runConversation`, sin cambiar una línea del bucle. El historial de esa conversación queda así:

1. Mensaje del usuario con la pregunta.
2. Mensaje del asistente con bloque de texto + `tool_use` (`add_duration_to_datetime`).
3. Mensaje de usuario con el `tool_result` de esa fecha.
4. Mensaje del asistente con bloque de texto + `tool_use` (`set_reminder`).
5. Mensaje de usuario con el `tool_result` del recordatorio.
6. Respuesta final del asistente, en texto.

!!! tip "El patrón para sumar cualquier herramienta nueva"
    1. Escribir la función de la herramienta.
    2. Escribir su esquema.
    3. Agregarla al array de `tools` de la llamada.
    4. Agregar un `case` en `runTool`.

    Siempre los mismos cuatro pasos — el resto del sistema (el bucle, el manejo de bloques, el manejo de errores) ya está escrito y no cambia.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Tool use** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview |
