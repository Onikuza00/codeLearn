# Ingeniería de prompts { .bloque-ia }

> Curso oficial de Anthropic Academy en Skilljar — el curso lo enseña en Python, aquí va adaptado a JavaScript/Node.js. Cómo coger un prompt que ya escribiste y mejorarlo de forma sistemática, midiendo cada cambio en vez de decidir "a ojo".

---

## El ciclo iterativo { .topic-title }

La ingeniería de prompts no es acertar el prompt perfecto a la primera. Es un bucle que repites hasta quedar satisfecho:

1. **Fija un objetivo** — qué tiene que conseguir el prompt.
2. **Escribe un prompt inicial** — un primer intento básico, aunque sea malo.
3. **Evalúalo** — pásalo por el flujo de [evaluación de prompts](../08-evaluacion-prompts/index.md) (dataset + calificador) y saca la media.
4. **Aplica una técnica** — ser claro y directo, ser específico, etiquetas XML, ejemplos… (los temas siguientes de este bloque).
5. **Vuelve a evaluar** — comprueba que la media **sube** de verdad.

Los pasos 4 y 5 se repiten. Cada iteración debería mostrar una mejora medible en la puntuación.

!!! tip "Un cambio cada vez"
    Aplica una sola técnica por iteración y vuelve a evaluar. Si metes tres cambios juntos y la nota sube, no sabes cuál ayudó — ni si alguno empeoró y otro lo tapó. El objetivo es entender qué técnica aporta valor **en tu caso concreto**.

## Montar el pipeline de evaluación { .topic-title }

El ejemplo del curso: un prompt que genera un plan de comidas de un día para un atleta, a partir de su altura, peso, objetivo y restricciones dietéticas.

El curso envuelve el flujo de la sección anterior en una clase `PromptEvaluator`. En tu montaje son las funciones que ya tienes (`runEval`, `gradeByModel`, `generateDataset`). Tres cosas que cambian respecto a los calificadores:

**1. Concurrencia.** El evaluador puede lanzar varios casos en paralelo. Empieza bajo (unas 3 tareas a la vez) para no chocar con los límites de tasa de la API; súbelo si tu cuota lo permite.

**2. Inputs con nombre, no un solo `task`.** Cada caso del dataset deja de ser `{ task }` y pasa a tener campos nombrados. Se declara qué inputs necesita el prompt:

```js
const spec = {
  height: 'Altura del atleta en cm',
  weight: 'Peso del atleta en kg',
  goal: 'Objetivo del atleta',
  restrictions: 'Restricciones dietéticas del atleta',
};
// generateDataset(taskDescription, spec, 'dataset.json', 3)
```

**3. Criterios extra para el calificador.** Al evaluar, se le pasan al modelo calificador los requisitos concretos que importan para tu caso — se concatenan al prompt de `gradeByModel`:

```text
La salida debe incluir:
- Total calórico diario
- Desglose de macronutrientes
- Comidas con alimentos exactos, porciones y horario
```

## El prompt inicial: deliberadamente malo { .topic-title }

Se empieza con la versión más ingenua posible, para tener una **línea base** contra la que medir:

```js
async function runPrompt(promptInputs) {
  const prompt = `¿Qué debería comer esta persona?

- Altura: ${promptInputs.height}
- Peso: ${promptInputs.weight}
- Objetivo: ${promptInputs.goal}
- Restricciones dietéticas: ${promptInputs.restrictions}`;

  const messages = [];
  addUserMessage(messages, prompt);
  return await chat(messages);
}
```

Este prompt va a dar resultados pobres — y ese es el punto. Es el `0` desde el que se mide la mejora.

## Leer los resultados { .topic-title }

Al ejecutar la evaluación obtienes una **puntuación numérica** y un **informe** detallado (en el curso, un HTML) que muestra cómo fue cada caso, con el razonamiento del calificador para cada nota. Ese detalle es lo que te dice **dónde** falla el prompt y qué hay que arreglar en la siguiente iteración.

!!! tip "No te desanimes con la nota inicial"
    Un 2,3 sobre 10 en el primer intento es lo normal. La nota absoluta no dice nada por sí sola — lo que importa es que **suba de forma consistente** a medida que aplicas técnicas.

!!! tip "Pocos casos mientras iteras"
    2-3 casos de prueba durante el desarrollo. Cada evaluación son varias llamadas a la API (una por caso, para generar la respuesta y otra para calificarla), y quieres el ciclo rápido. Sube a más casos solo para la validación final.

## Temario { .topic-title }

Técnicas que se aplican sobre el prompt base, una por lección (se irán enlazando a medida que avance el curso):

- Ser claro y directo
- Ser específico
- Estructurar con etiquetas XML
- Proporcionar ejemplos

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📓 Notebooks del curso | `001_prompting.ipynb` · `002_prompting_completed.ipynb` |
