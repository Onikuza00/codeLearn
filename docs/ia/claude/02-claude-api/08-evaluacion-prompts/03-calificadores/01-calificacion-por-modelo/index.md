# Calificación basada en modelos { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js.

---

## La función que califica { .topic-title }

```js
async function gradeByModel(testCase, output) {
  const evalPrompt = `Eres un revisor de código experto. Evalúa esta solución generada por IA.

Tarea: ${testCase.task}
Solución: ${output}

Devuelve tu evaluación como un objeto JSON con:
- "strengths": un array de 1-3 puntos fuertes
- "weaknesses": un array de 1-3 áreas de mejora
- "reasoning": una explicación concisa de tu valoración
- "score": un número entre 1 y 10

Responde SOLO con el objeto JSON crudo, sin bloque de código, sin backticks, sin explicación.`;

  const messagesEval = [];
  addUserMessage(messagesEval, evalPrompt);

  const evalTexto = await chat(messagesEval);
  return JSON.parse(evalTexto.trim());
}
```

!!! tip "Pedir fuerzas y debilidades, no solo el número"
    La idea clave: pedirle al calificador que justifique con puntos fuertes, débiles y razonamiento, además de la nota. Sin ese contexto, los modelos tienden a quedarse en notas mediocres alrededor del 6 — obligarlo a razonar produce notas más discriminadas y confiables.

!!! danger "Otra vez sin prellenado — mismo motivo que siempre"
    El curso arma esto con `add_assistant_message(messages, "\`\`\`json")` + `stop_sequences`. Con Sonnet 5 falla (ver [Datos estructurados](../../../07-datos-estructurados/index.md)) — se pide directo en el prompt que responda sin backticks, igual que en el resto de esta serie de lecciones.

## Integrarlo en el flujo { .topic-title }

`runTestCase` ahora llama al calificador en vez de usar la nota fija:

```js
async function runTestCase(testCase) {
  const output = await runPrompt(testCase);

  const modelGrade = await gradeByModel(testCase, output);
  const score = modelGrade.score;
  const reasoning = modelGrade.reasoning;

  return { output, testCase, score, reasoning };
}
```

Y `runEval` calcula el promedio al final:

```js
async function runEval(datasetEval) {
  const results = [];
  for (const testCase of datasetEval) {
    results.push(await runTestCase(testCase));
  }

  const averageScore = results.reduce((suma, r) => suma + r.score, 0) / results.length;
  console.log(`Puntuación media: ${averageScore}`);

  return results;
}
```

Ese promedio es la métrica objetiva que se sigue de versión en versión del prompt. Los calificadores de modelo pueden ser algo caprichosos de una corrida a otra, pero dan una base consistente para medir si un cambio realmente mejora las cosas.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
