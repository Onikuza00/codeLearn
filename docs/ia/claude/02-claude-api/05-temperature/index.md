# Temperatura { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js.

---

## Cómo elige Claude el siguiente token {: .topic-title }

En la etapa de generación (ver [Acceso a la API](../01-acceso-api/index.md)), Claude no elige directamente la siguiente palabra — calcula una probabilidad para cada token posible. Por ejemplo, tras "¿Qué opinas...", podría asignar 30% a "sobre", 20% a "acerca", 10% a "de"... La **temperatura** es el parámetro que decide cómo se elige un token a partir de esas probabilidades.

## Qué hace la temperatura {: .topic-title }

Es un decimal entre `0` y `1`:

- **Cerca de 0** — Claude es determinista: casi siempre elige el token con mayor probabilidad. Respuestas consistentes, poco variadas.
- **Cerca de 1** — la probabilidad se reparte de forma más uniforme entre los tokens candidatos. Respuestas más variadas, menos previsibles.

!!! warning "No es una escala, es un trade-off"
    Precisión y variedad no suben juntas con la temperatura — van en sentidos **opuestos**. Subir la temperatura no da "más precisión y más variedad" a la vez: se gana variedad y se **pierde** precisión. Bajarla es al revés: se gana precisión y se pierde variedad. Por eso la tabla de abajo separa casos de uso según cuál de las dos necesita cada tarea, no según "cuánta calidad" se busca.

## Qué temperatura elegir {: .topic-title }

| Rango | Casos de uso |
|---|---|
| **0.0 – 0.3** (baja) | Respuestas basadas en hechos, asistencia de código, extracción de datos, moderación de contenido |
| **0.4 – 0.7** (media) | Resúmenes, contenido educativo, resolución de problemas, escritura creativa con restricciones |
| **0.8 – 1.0** (alta) | Brainstorming, escritura creativa, contenido de marketing, generación de chistes |

La temperatura no garantiza resultados distintos entre sí, solo cambia la probabilidad de obtenerlos — incluso a temperatura alta, Claude puede repetir respuestas parecidas alguna vez.

## Implementación en JS {: .topic-title }

Se añade como un parámetro más, con valor por defecto:

```js
async function chat(messages, system, temperature = 1.0) {
  const params = {
    model,
    max_tokens: 1000,
    messages,
    temperature,
    ...(system && { system }),
  };

  const message = await client.messages.create(params);
  return message.content[0].text;
}
```

```js
// Temperatura baja - más predecible
const answer = await chat(messages, undefined, 0.0);

// Temperatura alta - más creativa
const answer = await chat(messages, undefined, 1.0);
```

!!! danger "Deprecado en modelos con adaptive thinking siempre activo"
    Confirmado en la práctica: enviar `temperature` a Sonnet 5 devuelve `400 invalid_request_error: 'temperature' is deprecated for this model`. Los modelos con adaptive thinking permanente (Sonnet 5, Opus 5...) gestionan su propio nivel de razonamiento automáticamente — el control manual clásico de `temperature` ya no aplica para esta generación. Antes de usar `temperature` en un modelo nuevo, comprobar primero si lo soporta.

!!! warning "Python tiene argumentos con nombre, JS no (por defecto)"
    En Python, `chat(messages, temperature=0.0)` salta directo al parámetro que te interesa, sin tocar `system`. En JS, los parámetros de una función normal son **posicionales** — para llegar a `temperature` (el tercero) hay que pasar `undefined` explícito en el lugar de `system` (el segundo), aunque no quieras usarlo. Si una función va a tener varios parámetros opcionales que se combinan de formas distintas, conviene diseñarla recibiendo un único objeto de opciones (`{ system, temperature }`) en vez de parámetros sueltos — así cada llamada solo nombra lo que necesita, como en Python.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Messages API (parámetro `temperature`)** | https://docs.claude.com/en/api/messages |
