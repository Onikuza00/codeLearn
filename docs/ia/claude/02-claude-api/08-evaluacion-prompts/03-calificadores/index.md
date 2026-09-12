# Calificadores { .bloque-ia }

> Cómo reemplazar la nota fija (`score = 10`) del flujo de evaluación por una calificación real: calificador basado en modelo y calificador basado en código.

---

## Tres tipos de calificador { .topic-title }

| Tipo | Cómo funciona | Bueno para |
|---|---|---|
| **Evaluador de código** | Lógica programática propia | Longitud, presencia/ausencia de palabras, sintaxis válida (JSON/Python/regex), legibilidad |
| **Evaluador de modelo** | Otra llamada a la API evalúa la respuesta | Calidad de la respuesta, si sigue la instrucción, exhaustividad, utilidad, seguridad |
| **Evaluador humano** | Una persona revisa y califica a mano | Calidad general, profundidad, concisión, pertinencia — el más flexible, también el más lento |

El único requisito común: la salida tiene que ser una señal usable, normalmente un número del 1 al 10.

## Definir criterios antes de calificar { .topic-title }

Para un prompt que genera código, tres criterios típicos:

- **Formato** — devuelve SOLO Python/JSON/regex, sin explicación.
- **Sintaxis válida** — el código generado compila/parsea.
- **Sigue la tarea** — la respuesta resuelve de verdad lo que pidió el usuario.

Los dos primeros encajan mejor con un evaluador de CÓDIGO (son comprobaciones mecánicas). El tercero encaja mejor con un evaluador de MODELO — hace falta criterio, no una regla fija.

---

## Calificador basado en modelo { .topic-title }

### La función que califica

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
    El curso arma esto con `add_assistant_message(messages, "\`\`\`json")` + `stop_sequences`. Con Sonnet 5 falla (ver [Datos estructurados](../../07-datos-estructurados/index.md)) — se pide directo en el prompt que responda sin backticks, igual que en el resto de esta serie de lecciones.

### Integrarlo en el flujo

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

## Calificador basado en código { .topic-title }

### Qué valida

Cuando el prompt genera **código** (Python, JSON o una regex), comprobar solo si la respuesta "tiene sentido" no basta. El evaluador de código valida dos cosas que son mecánicas:

- **Formato** — la respuesta devuelve **solo** el tipo de código pedido, sin explicaciones ni texto alrededor.
- **Sintaxis válida** — ese código parsea correctamente como el lenguaje esperado.

El tercer criterio —**si la respuesta resuelve de verdad la tarea**— no lo toca el evaluador de código: eso es trabajo del [evaluador de modelo](#calificador-basado-en-modelo), porque hace falta criterio, no una regla fija. Los dos juntos dan una evaluación completa.

### Las funciones de validación de sintaxis

La idea es la misma para los tres formatos: **intentar parsear** la salida. Si parsea, `10`; si lanza, `0`.

```js
function validateJson(text) {
  try {
    JSON.parse(text.trim());
    return 10;
  } catch {
    return 0;
  }
}

function validateRegex(text) {
  try {
    new RegExp(text.trim());
    return 10;
  } catch {
    return 0;
  }
}
```

!!! tip "10 o 0, sin medias tintas"
    La sintaxis es binaria: un texto **es** JSON válido o **no lo es**. No existe "medio válido". Por eso estas funciones no devuelven una escala — devuelven la nota máxima o la mínima, y luego se promedian con la del evaluador de modelo (que sí es gradual).

!!! info "Validar Python desde Node"
    JavaScript trae parser de JSON (`JSON.parse`) y de regex (`new RegExp`), pero **no** de Python. Para `validatePython` hay que salir a un proceso externo:

    ```js
    import { execFileSync } from 'node:child_process';

    function validatePython(text) {
      try {
        execFileSync('python3', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], {
          input: text.trim(),
        });
        return 10;
      } catch {
        return 0;
      }
    }
    ```

    Necesita `python3` en el `PATH`. Si el proyecto es solo Node y no quieres esa dependencia, limita el dataset a `json` y `regex`.

!!! tip "`JSON.parse` es más estricto de lo que parece"
    Rechaza comillas simples, comas finales, comentarios y claves sin comillas. Si el modelo devuelve "casi JSON", el validador da `0` — y es correcto: no era JSON válido. Esa señal es justo lo que quieres medir.

### El dispatcher según el `format`

Para que el evaluador sepa qué validador usar, cada caso de prueba declara su formato de salida:

```json
{
  "task": "Crear una función Python que valide un nombre de usuario de AWS IAM",
  "format": "python"
}
```

Y una función elige el validador según ese campo:

```js
function gradeSyntax(output, testCase) {
  switch (testCase.format) {
    case 'json':   return validateJson(output);
    case 'python': return validatePython(output);
    case 'regex':  return validateRegex(output);
    default:       return 0; // formato desconocido: no se puede validar
  }
}
```

Para que el dataset lleve ese campo sin ponerlo a mano, se añade `"format"` a la estructura de ejemplo del prompt de generación (el de `generateDataset`).

### Mejorar la claridad del prompt

Si el evaluador de código va a penalizar las explicaciones y el texto de más, el prompt tiene que pedir con precisión que no los haya:

```text
* Responde solo con Python, JSON o una regex en texto plano
* No añadas comentarios, texto adicional ni explicación
```

El curso además usa un prefill de asistente para esto; con Sonnet 5 no funciona, así que todo va en el prompt del usuario — [ver Datos estructurados](../../07-datos-estructurados/index.md).

### Combinar las dos notas

El paso final: juntar la nota del evaluador de modelo con la del evaluador de código. El enfoque simple es la media:

```js
const modelGrade = await gradeByModel(testCase, output);
const modelScore = modelGrade.score;
const syntaxScore = gradeSyntax(output, testCase);

const score = (modelScore + syntaxScore) / 2;
```

!!! tip "La media es un punto de partida, no dogma"
    `(model + syntax) / 2` da el mismo peso al contenido y a la corrección técnica. Si tu caso valora más una de las dos, pondéralo: `modelScore * 0.7 + syntaxScore * 0.3`. Lo importante es que la fórmula sea **la misma** entre versiones del prompt, para que las notas se puedan comparar.

!!! tip "`new RegExp` valida la sintaxis, no la utilidad"
    `new RegExp('(')` lanza (sintaxis mala → `0`), pero `new RegExp('.*')` pasa aunque esa regex no haga nada de lo que pedía la tarea. Que la regex sea **correcta para el problema** lo juzga el evaluador de modelo, no `validateRegex`.

### Integrarlo en `runTestCase`

```js hl_lines="4 5 6 7"
async function runTestCase(testCase) {
  const output = await runPrompt(testCase);

  const modelGrade = await gradeByModel(testCase, output);
  const modelScore = modelGrade.score;
  const syntaxScore = gradeSyntax(output, testCase);
  const score = (modelScore + syntaxScore) / 2;

  return { output, testCase, score, reasoning: modelGrade.reasoning };
}
```

Con la calificación de código montada, se ejecuta la evaluación para tener una **puntuación de referencia**. Esa nota no es "buena" ni "mala" en sí — lo que importa es si consigues **subirla** afinando el prompt. Es la forma cuantitativa de medir el progreso en ingeniería de prompts, en vez de fiarte de una impresión subjetiva.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
