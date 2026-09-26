# Extended thinking { .bloque-ia }

> Darle a Claude tiempo para razonar un problema complejo antes de contestar, y poder ver ese razonamiento.

---

## Qué es { .topic-title }

**Extended thinking** (pensamiento extendido) es una función que permite a Claude razonar paso a paso antes de escribir su respuesta final. Es como darle una hoja de borrador: primero trabaja el problema y después responde.

Ese borrador no queda oculto. La API lo devuelve junto con la respuesta, así que puedes ver cómo llegó Claude a ella.

!!! warning "No es compatible con todo"
    Con extended thinking activado no se pueden usar el **pre-relleno del mensaje del asistente** (empezar tú la respuesta de Claude) ni cambiar la **temperatura**. La lista completa de restricciones está en la [documentación oficial](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking#feature-compatibility).

## Cómo cambia la respuesta { .topic-title }

Sin extended thinking, la respuesta de Claude es un único bloque de texto. Con extended thinking, la respuesta pasa a tener **dos bloques** dentro de `content`:

1. Un bloque de tipo `thinking`, con el razonamiento.
2. Un bloque de tipo `text`, con la respuesta final.

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Primero hay que ver qué pide el enunciado...",
      "signature": "EqQBCkYIBRgCIkD..."
    },
    {
      "type": "text",
      "text": "La respuesta es 42."
    }
  ]
}
```

!!! tip "No asumas que el texto es el primer bloque"
    Sin extended thinking, el texto suele estar en `content[0]`. Con extended thinking, en `content[0]` está el razonamiento. Para leer la respuesta, busca el bloque por su tipo (`type === 'text'`), no por su posición.

## Ventajas y costes { .topic-title }

| Ventajas | Costes |
|---|---|
| Razona mejor en tareas complejas | Cuesta más: los tokens de razonamiento también se pagan |
| Es más preciso en problemas difíciles | Es más lento: pensar lleva tiempo |
| Ves cómo llega Claude a la respuesta | El código que lee la respuesta se complica (hay más tipos de bloque) |

Un **token** es la unidad en la que Claude cuenta el texto (más o menos, un trozo de palabra), y es lo que se factura.

## Cuándo usarlo { .topic-title }

La regla es simple: **usa tus evaluaciones de prompts**.

1. Prueba primero tu prompt sin extended thinking.
2. Si, tras optimizarlo bien, la precisión sigue sin alcanzar lo que necesitas, entonces activa extended thinking.

Es una herramienta para cuando el prompt bien escrito no basta, no una opción por defecto.

## Firma y bloques redactados { .topic-title }

### La firma (`signature`)

Cada bloque `thinking` trae una **firma**: un código criptográfico que garantiza que el texto del razonamiento no se ha modificado. Sirve para que nadie pueda alterar el razonamiento de Claude y llevar al modelo hacia respuestas inseguras.

### Razonamiento redactado (`redacted_thinking`)

A veces, en lugar de un bloque `thinking` legible, llega un bloque `redacted_thinking`:

```json
{
  "type": "redacted_thinking",
  "data": "EmwKAhgBEgy3va3pzix..."
}
```

Ocurre cuando los sistemas de seguridad de Claude marcan su razonamiento. El contenido sigue ahí, pero **cifrado**. Como la API necesita el razonamiento completo para conservar el contexto, hay que devolver ese bloque tal cual en los mensajes siguientes, sin modificarlo.

!!! tip "Probar los bloques redactados"
    Para comprobar que tu aplicación no falla al recibir un bloque redactado, Anthropic documenta una cadena especial que fuerza a Claude a devolverlo. La cadena exacta está en la [documentación oficial](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking).

## Cómo se activa { .topic-title }

Se añade el parámetro `thinking` a la llamada, con dos datos:

- `type: 'enabled'`, que lo activa.
- `budget_tokens`, el **presupuesto**: el máximo de tokens que Claude puede gastar en razonar.

```js
const respuesta = await client.messages.create({
  model: modelo,
  max_tokens: 4000,
  thinking: { type: 'enabled', budget_tokens: 1024 },
  messages: [{ role: 'user', content: mensaje }],
});

for (const bloque of respuesta.content) {
  if (bloque.type === 'thinking') console.log('Razonamiento:', bloque.thinking);
  if (bloque.type === 'text') console.log('Respuesta:', bloque.text);
}
```

!!! warning "Dos reglas sobre el presupuesto"
    - El mínimo de `budget_tokens` es **1024**.
    - `max_tokens` tiene que ser **mayor** que `budget_tokens`: el presupuesto de razonamiento sale de ese máximo, y tiene que quedar sitio para la respuesta.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Extended thinking — documentación oficial** | https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
