# Ejecutar la evaluación { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js.

---

## Tres funciones, tres responsabilidades { .topic-title }

**`runPrompt`** — combina un caso de prueba con la plantilla del prompt y llama a Claude:

```js
async function runPrompt(testCase) {
  const prompt = `Por favor resuelve la siguiente tarea:\n\n${testCase.task}`;
  const messages = [];
  addUserMessage(messages, prompt);
  return await chat(messages);
}
```

Sin instrucciones de formato todavía a propósito — Claude va a devolver respuestas más largas de lo necesario. Eso se ajusta más adelante, al mejorar el prompt.

**`runTestCase`** — ejecuta un caso y lo califica:

```js
async function runTestCase(testCase) {
  const output = await runPrompt(testCase);

  // TODO — calificación real
  const score = 10;

  return { output, testCase, score };
}
```

Por ahora la nota es fija (`10`) — un placeholder para poder probar el flujo completo antes de construir el calificador de verdad.

**`runEval`** — recorre todo el dataset:

```js
async function runEval(dataset) {
  const results = [];
  for (const testCase of dataset) {
    results.push(await runTestCase(testCase));
  }
  return results;
}
```

## Ejecutarla { .topic-title }

```js
import { readFileSync } from 'node:fs';

const dataset = JSON.parse(readFileSync('dataset.json', 'utf-8'));
const results = await runEval(dataset);
console.log(JSON.stringify(results, null, 2));
```

!!! tip "La primera corrida tarda"
    Incluso con Haiku, procesar el dataset completo puede tardar unos 30 segundos — cada caso es una llamada real a la API, una tras otra. Más adelante se ven técnicas para acelerarlo.

## Qué trae cada resultado { .topic-title }

Cada elemento del array `results` tiene tres datos:

| Campo | Qué es |
|---|---|
| `output` | La respuesta completa de Claude |
| `testCase` | El caso de prueba original que se procesó |
| `score` | La nota de esa respuesta (por ahora, siempre `10`) |

## Lo que falta { .topic-title }

El flujo completo ya funciona — dataset → prompt → Claude → resultado estructurado. La pieza que falta es real: sustituir la nota fija por un calificador que evalúe la respuesta de verdad. Eso es lo que sigue.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
