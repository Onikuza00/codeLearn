# Datos estructurados { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js.

---

## El problema { .topic-title }

Al pedirle a Claude datos estructurados (JSON, código, listas), suele envolver la respuesta en explicaciones y bloques de código Markdown — útil para una conversación, un estorbo cuando lo que necesitas es copiar el dato limpio y usarlo directo (por ejemplo, en una web que genera JSON para que el usuario lo pegue en otro sitio).

## La solución: prellenar el mensaje del asistente + secuencia de parada { .topic-title }

```js
const messages = [];
addUserMessage(messages, 'Genera una regla muy corta de EventBridge en JSON');
addAssistantMessage(messages, '```json');

const texto = await chat(messages, null, ['```']);
```

Cómo funciona, paso a paso:

1. El mensaje de usuario le dice a Claude qué generar.
2. El mensaje de ASISTENTE prellenado (`` ```json ``) le hace creer que él mismo ya empezó un bloque de código — Claude sigue desde ahí, sin repetir la apertura.
3. Claude escribe solo el contenido, sin explicación previa (ya "está" dentro del bloque).
4. En cuanto Claude intenta cerrar el bloque con `` ``` ``, la secuencia de parada corta la generación ahí mismo — ese cierre nunca llega a imprimirse.

Resultado: el JSON solo, sin Markdown ni texto alrededor.

!!! danger "Sonnet 5 no soporta el prellenado de mensajes de asistente"
    `claude-sonnet-5` devuelve `400 Bad Request` con un mensaje de rol `assistant` al final de la conversación — el truco de arriba no funciona con este modelo, aunque el curso lo enseñe así.

    Alternativa que sí funciona: pedir en el propio mensaje de usuario que responda con el JSON crudo, **sin bloque de código, sin backticks**:
    ```js
    addUserMessage(messages, 'Genera una regla muy corta de EventBridge en JSON. Responde SOLO con el JSON crudo, sin bloque de código, sin backticks, sin explicación ni texto alrededor.');

    const texto = await chat(messages);
    const datosLimpios = JSON.parse(texto.trim());
    ```

!!! tip "`stop_sequences` sigue siendo útil, aparte de este caso"
    `chat()` puede aceptar un parámetro extra `stopSequences`, que se agrega a `params` igual que `system` (solo si se pasa un valor). Sirve para cualquier situación donde sepas de antemano en qué texto exacto tiene que cortar la respuesta — no solo para el patrón de prellenado de arriba, que en Sonnet 5 no aplica.
    ```js
    if (stopSequences) {
      params.stop_sequences = stopSequences;
    }
    ```

## Procesar el resultado { .topic-title }

Puede quedar algún salto de línea de más alrededor del contenido — se limpia con `.trim()` antes de parsear:

```js
const datosLimpios = JSON.parse(texto.trim());
```

## Más allá de JSON { .topic-title }

La misma técnica sirve para cualquier contenido que Claude envuelva de forma predecible: fragmentos de código, listas con viñetas, CSV. La clave es identificar CÓMO lo envuelve normalmente (el bloque de código Markdown, un marcador de lista...) y usar ese mismo patrón como prellenado y como secuencia de parada.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Stop sequences** | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prefill-claudes-response |
