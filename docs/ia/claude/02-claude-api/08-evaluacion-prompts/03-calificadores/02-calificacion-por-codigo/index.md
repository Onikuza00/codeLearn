# Calificación basada en código { .bloque-ia }

> El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js.

---

## Qué valida el evaluador de código { .topic-title }

Cuando el prompt genera **código** (Python, JSON o una regex), comprobar solo si la respuesta "tiene sentido" no basta. El evaluador de código valida dos cosas que son mecánicas:

- **Formato** — la respuesta devuelve **solo** el tipo de código pedido, sin explicaciones ni texto alrededor.
- **Sintaxis válida** — ese código parsea correctamente como el lenguaje esperado.

El tercer criterio —**si la respuesta resuelve de verdad la tarea**— no lo toca el evaluador de código: eso es trabajo del [evaluador de modelo](../01-calificacion-por-modelo/index.md), porque hace falta criterio, no una regla fija. Los dos juntos dan una evaluación completa.

## Las funciones de validación de sintaxis { .topic-title }

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

## El dispatcher según el `format` { .topic-title }

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

## Mejorar la claridad del prompt { .topic-title }

Si el evaluador de código va a penalizar las explicaciones y el texto de más, el prompt tiene que pedir con precisión que no los haya:

```text
* Responde solo con Python, JSON o una regex en texto plano
* No añadas comentarios, texto adicional ni explicación
```

El curso además usa un prefill de asistente para esto; con Sonnet 5 no funciona, así que todo va en el prompt del usuario — [ver Datos estructurados](../../../07-datos-estructurados/index.md).

## Combinar las dos notas { .topic-title }

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

## Integrarlo en `runTestCase` { .topic-title }

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
