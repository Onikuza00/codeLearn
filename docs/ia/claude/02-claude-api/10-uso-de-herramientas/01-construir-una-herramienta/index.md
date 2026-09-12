# Construir una herramienta { .bloque-ia }

> De la función a la primera llamada con herramientas: escribirla, describirla con un esquema JSON, entender los bloques `tool_use` que trae la respuesta, y devolverle el resultado a Claude.

---

## Funciones de herramienta { .topic-title }

Una **función de herramienta** es una función normal de tu código que se ejecuta automáticamente cuando Claude necesita un dato extra para ayudar al usuario. Si alguien pregunta "¿qué hora es?", Claude llamaría a tu función de fecha y hora para conseguir la hora actual — vos escribís esa función como cualquier otra, no hay nada especial de "IA" en ella.

**Buenas prácticas al escribirlas:**

- **Nombres descriptivos** — el nombre de la función y el de sus parámetros tienen que decir claramente para qué sirven.
- **Validar las entradas** — comprobar que los parámetros obligatorios no vengan vacíos o inválidos, y lanzar un error cuando pase.
- **Mensajes de error útiles** — Claude puede ver el mensaje de error, y si es claro, puede volver a intentar la llamada con parámetros corregidos. Un error como *"la ubicación no puede estar vacía"* le da a Claude la pista exacta de qué corregir.

Ejemplo — una función que devuelve la fecha y hora actuales en distintos formatos:

```js
function getCurrentDatetime(format = 'full') {
  if (!format) {
    throw new Error('format no puede estar vacío');
  }

  const now = new Date();

  if (format === 'time') return now.toLocaleTimeString('es-ES');
  if (format === 'date') return now.toLocaleDateString('es-ES');
  return now.toLocaleString('es-ES'); // 'full'
}

getCurrentDatetime();        // "15/1/2026, 14:30:25"
getCurrentDatetime('time');  // "14:30:25"
getCurrentDatetime('');      // lanza Error: "format no puede estar vacío"
```

La función por sí sola no le sirve de nada a Claude todavía — el siguiente paso es describírsela mediante un esquema JSON, para que sepa que existe y cómo llamarla.

## Esquemas de herramientas { .topic-title }

Después de escribir la función, el paso siguiente es un esquema JSON que le dice a Claude qué espera esa función y cómo llamarla. Es la documentación que Claude consulta para decidir cuándo y cómo usar cada herramienta.

**JSON Schema no es cosa de IA** — es una especificación de validación de datos que existe desde hace años; la comunidad de IA la adoptó porque ya resolvía bien el problema de describir parámetros de una función.

Toda especificación de herramienta tiene 3 partes:

- **`name`** — nombre claro y descriptivo (`"get_current_datetime"`, no `"tool1"`).
- **`description`** — qué hace, cuándo usarla, qué devuelve.
- **`input_schema`** — el JSON Schema real que describe los argumentos.

**Cómo escribir una buena `description`:**

- 3-4 frases — ni una palabra suelta, ni un párrafo largo.
- Qué hace la herramienta.
- Cuándo debería usarla Claude.
- Qué tipo de dato devuelve.
- Una descripción por cada argumento, dentro del propio esquema.

Ejemplo, para la función `getCurrentDatetime` de arriba:

```js
const getCurrentDatetimeSchema = {
  name: 'get_current_datetime',
  description: 'Devuelve la fecha y hora actuales. Úsala cuando el usuario pregunte qué hora o qué día es. Devuelve un string legible en el formato pedido.',
  input_schema: {
    type: 'object',
    properties: {
      format: {
        type: 'string',
        description: 'Modo de formato: "full" (fecha y hora), "time" (solo hora) o "date" (solo fecha).',
        default: 'full',
      },
    },
    required: [],
  },
};
```

**Patrón de nombres:** la función `getCurrentDatetime` y su esquema `getCurrentDatetimeSchema` — el sufijo `Schema` deja clara la relación entre las dos, sin tener que ir a buscarla.

!!! tip "No lo escribas a mano — pídeselo a Claude"
    En vez de escribir el `input_schema` a mano, pásale a Claude el código de tu función junto con la documentación oficial de tool use, y pídele: *"Escribe una especificación de esquema JSON válida para que esta función se pueda llamar como herramienta, siguiendo las buenas prácticas de la documentación adjunta."* Claude conoce el formato de memoria y acierta la estructura a la primera — es más rápido que escribirlo a mano y menos propenso a errores de sintaxis.

!!! tip "El tipado extra es cosa de TypeScript"
    El SDK expone un tipo `Tool` para validar la forma del esquema en tiempo de compilación. Esto solo aporta algo en un proyecto con TypeScript — en JavaScript puro, como este, no hay tipado que comprobar, así que este paso se puede saltar sin perder nada.

## Manejo de bloques de mensajes { .topic-title }

Hasta ahora, cada respuesta de Claude era un único bloque de texto. En cuanto Claude tiene herramientas disponibles, sus respuestas pueden traer varios bloques en el mismo mensaje — no solo texto.

**Activar las herramientas en la llamada:** se añade el parámetro `tools`, con la lista de esquemas que armaste en la lección anterior:

```js
const messages = [];
addUserMessage(messages, '¿Qué hora es exactamente, en formato HH:MM:SS?');

const response = await client.messages.create({
  model: modelo,
  max_tokens: 1000,
  messages,
  tools: [getCurrentDatetimeSchema],
});
```

**Qué trae una respuesta con herramientas.** `response.content` deja de ser "un bloque de texto" y pasa a ser un array que puede traer varios bloques:

- **Bloque de texto** — lo que Claude dice antes de usar la herramienta (por ejemplo, "Voy a consultar la hora actual").
- **Bloque `tool_use`** — la instrucción para tu código: qué función llamar y con qué parámetros. Trae:
    - un `id` para identificar esa llamada concreta,
    - el `name` de la herramienta (`"get_current_datetime"`),
    - el `input` con los parámetros, ya como objeto,
    - `type: "tool_use"`.

**Guardar la respuesta en el historial — completa, no solo el texto.** Como Claude no recuerda nada entre llamadas ([conversaciones multiturno](../../03-conversaciones-multiturno/index.md)), hay que reenviar el historial en cada request. Con herramientas de por medio, eso significa guardar `response.content` **tal cual**, con todos sus bloques — no solo el texto extraído:

```js
messages.push({ role: 'assistant', content: response.content });
```

Si solo se guarda el texto (como hacía `addAssistantMessage` hasta ahora) se pierde el bloque `tool_use`, y Claude ya no tiene forma de saber qué herramienta pidió ni con qué parámetros.

!!! tip "Los helpers de siempre ya no alcanzan"
    `addUserMessage`/`addAssistantMessage`, tal como se escribieron hasta ahora, asumen que `content` siempre es un string (`{ role, content: text }`). Eso se rompe en cuanto `content` es un array de bloques. Hace falta una versión que acepte también un array — o directamente hacer el `messages.push(...)` a mano para el mensaje del asistente con herramientas, sin pasar por el helper de texto plano.

**Flujo completo, en 5 pasos:**

1. Se manda el mensaje del usuario + el esquema de la herramienta.
2. Se recibe un mensaje del asistente con bloque de texto + bloque `tool_use`.
3. Se extraen los datos del bloque `tool_use` y se ejecuta la función real correspondiente.
4. Se le devuelve el resultado a Claude, junto con el historial completo de la conversación.
5. Se recibe la respuesta final de Claude.

Cada paso depende de que la estructura del mensaje esté completa — un bloque que falte es contexto que Claude pierde.

## Enviando resultados de la herramienta { .topic-title }

**Ejecutar la función real.** El bloque `tool_use` trae los parámetros ya en `input`, como objeto — no hay que parsear nada:

```js
const toolBlock = response.content.find((block) => block.type === 'tool_use');
const result = getCurrentDatetime(toolBlock.input.format);
```

Como la función solo tiene un parámetro con nombre, se accede directo a `toolBlock.input.format`. Con funciones de más parámetros, la salida depende de cómo esté escrita la función: pasar el objeto completo si la función recibe un único objeto de opciones, o desestructurar campo por campo si recibe parámetros sueltos.

**El bloque `tool_result`.** El resultado se manda de vuelta dentro de un mensaje de usuario, con tres propiedades:

- `tool_use_id` — tiene que coincidir con el `id` del bloque `tool_use` que se está respondiendo.
- `content` — la salida de la función, como string.
- `is_error` — `true` si la función lanzó un error.

```js
messages.push({
  role: 'user',
  content: [{
    type: 'tool_result',
    tool_use_id: toolBlock.id,
    content: result,
    is_error: false,
  }],
});
```

**Varias llamadas a la vez.** Si la pregunta del usuario dispara más de una herramienta a la vez ("¿cuánto es 10+10 y cuánto es 30+30?"), Claude puede devolver varios bloques `tool_use` en la misma respuesta, cada uno con su propio `id`. Los resultados se emparejan por ese `id`, no por el orden en que llegan — así Claude sabe qué resultado corresponde a qué llamada aunque el orden no coincida.

**La solicitud de seguimiento.** Se manda con el historial completo — el mensaje original, la respuesta del asistente con el `tool_use`, y ahora el `tool_result` — y de nuevo con el mismo `tools` en la llamada, aunque no se espere que Claude vuelva a usar la herramienta: sin el esquema, Claude no tiene cómo interpretar las referencias a la herramienta que ya están en el historial.

```js
const finalResponse = await client.messages.create({
  model: modelo,
  max_tokens: 1000,
  messages,
  tools: [getCurrentDatetimeSchema],
});
```

Con la respuesta final, el ciclo de uso de herramientas está completo: Claude devuelve ya una respuesta natural que incorpora el dato que pidió.

!!! tip "El error también es información útil"
    Cuando la función lanza un error (la validación que se vio en [Funciones de herramienta](#funciones-de-herramienta)), no hay que ocultarlo: se manda igual como `tool_result`, con `is_error: true` y el mensaje de error como `content`. Claude puede leer ese mensaje y, si tiene sentido, volver a intentar la llamada con parámetros corregidos.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Tool use** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview |
