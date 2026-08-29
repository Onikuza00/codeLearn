# Generación de conjuntos de datos de prueba { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js.

---

## El objetivo del ejemplo { .topic-title }

Un prompt que ayude a escribir tres tipos de resultado para tareas de AWS: código Python, archivos de configuración JSON, o expresiones regulares. El requisito: devolver SOLO el resultado, sin explicaciones ni encabezados.

```js
const prompt = `Please provide a solution to the following task:\n${task}`;
```

## El dataset de evaluación { .topic-title }

Un array de objetos JSON, cada uno con una propiedad `task` describiendo qué tiene que resolver Claude. Se puede armar a mano, o generarlo automáticamente con el propio Claude.

!!! tip "Para generar datos de prueba, usa el modelo más rápido/económico"
    Generar el DATASET no es la tarea que estás evaluando — no hace falta el modelo completo para eso. Un modelo más ligero (Haiku, `claude-haiku-4-5-20251001`) es más rápido y barato, y alcanza de sobra para este paso. Para poder elegir el modelo por llamada, `chat()` necesita un parámetro más:
    ```js
    async function chat(messages, system, temperature = 1.0, stopSequences = [], modelOverride) {
      const params = {
        model: modelOverride ?? modelo,
        max_tokens: 1000,
        messages,
        temperature,
      };
      if (system) params.system = system;
      if (stopSequences.length) params.stop_sequences = stopSequences;

      const message = await client.messages.create(params);
      return message.content.find(b => b.type === 'text').text;
    }
    ```

## Generar el dataset por código { .topic-title }

```js
async function generateDataset() {
  const prompt = `Generate an evaluation dataset for a prompt evaluation. The dataset will be used to evaluate prompts that generate Python, JSON, or Regex specifically for AWS-related tasks. Generate an array of JSON objects, each representing a task that requires Python, JSON, or a Regex to complete.

Example output:
[
  { "task": "Description of task" },
  ...additional
]

* Focus on tasks that can be solved by writing a single Python function, a single JSON object, or a single regex
* Focus on tasks that do not require writing much code
* Responde SOLO con el array JSON crudo, sin bloque de código, sin backticks, sin explicación

Please generate 3 objects.`;

  const messages = [];
  addUserMessage(messages, prompt);

  const texto = await chat(messages, null, 1.0, [], 'claude-haiku-4-5-20251001');
  return JSON.parse(texto.trim());
}
```

!!! danger "Sin prellenado de asistente, otra vez"
    El curso arma esto con `add_assistant_message(messages, "\`\`\`json")` + `stop_sequences`, igual que en [Datos estructurados](../../07-datos-estructurados/index.md) — y falla con Sonnet 5 por el mismo motivo ya comprobado ahí. Se pide directo en el prompt que responda sin backticks, sin necesitar prellenado ni secuencia de parada.

## Probar y guardar el resultado { .topic-title }

```js
const dataset = await generateDataset();
console.log(dataset);

import { writeFileSync } from 'node:fs';
writeFileSync('dataset.json', JSON.stringify(dataset, null, 2));
```

Con el dataset guardado en un archivo, queda listo para cargarlo en cada corrida de evaluación sin tener que regenerarlo cada vez.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
