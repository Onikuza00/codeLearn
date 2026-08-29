// Ejercicio de ingeniería de prompts (Anthropic Academy).
//
// El pipeline de evaluación aplicado al ejemplo del curso: un prompt que genera
// un plan de comidas de 1 día para un atleta.
//
// LO QUE SE PRACTICA: mejorar `runPrompt` aplicando una técnica cada vez
// (ser claro y directo, ser específico, etiquetas XML, ejemplos), volver a
// ejecutar, y comprobar que la puntuación media SUBE.

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'node:fs';

const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno automáticamente
const modelo = 'claude-sonnet-5';
const modeloRapido = 'claude-haiku-4-5-20251001'; // para generar el dataset

function addUserMessage(messages, text) {
  messages.push({ role: 'user', content: text });
}

async function chat(messages, modelOverride) {
  const message = await client.messages.create({
    model: modelOverride ?? modelo,
    max_tokens: 2000,
    messages,
  });
  return message.content.find((e) => e.type === 'text').text;
}

// --- Generación del dataset (modelo rápido) --------------------------------
// Se ejecuta una vez para crear dataset-comidas.json; después se deja comentado.

async function generateDataset(taskDescription, spec, numCases) {
  const campos = Object.entries(spec)
    .map(([clave, descripcion]) => `  "${clave}": "${descripcion}"`)
    .join(',\n');

  const prompt = `Genera un dataset de evaluación de prompts para esta tarea:

${taskDescription}

Cada caso es un objeto JSON con estos campos:
{
${campos}
}

* Casos variados y realistas
* Responde SOLO con el array JSON crudo, sin backticks, sin explicación

Genera ${numCases} casos.`;

  const messages = [];
  addUserMessage(messages, prompt);
  const texto = await chat(messages, modeloRapido);
  return JSON.parse(texto.trim());
}

// --- El prompt que se está mejorando -----------------------------------------
// Versión inicial deliberadamente ingenua: es la línea base. ESTO es lo que iteras.

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

// --- Calificador de modelo, con criterios extra ---------------------------

const extraCriteria = `La salida debe incluir:
- Total calórico diario
- Desglose de macronutrientes (proteínas, carbohidratos, grasas)
- Comidas con alimentos exactos, porciones y horario`;

async function gradeByModel(promptInputs, output) {
  const evalPrompt = `Eres un nutricionista deportivo revisando un plan de comidas generado por IA.

Datos del atleta: ${JSON.stringify(promptInputs)}
Plan generado:
${output}

${extraCriteria}

Devuelve tu evaluación como un objeto JSON con:
- "strengths": array de 1-3 puntos fuertes
- "weaknesses": array de 1-3 áreas de mejora
- "reasoning": explicación concisa
- "score": número entre 1 y 10

Responde SOLO con el objeto JSON crudo, sin bloque de código, sin backticks, sin explicación.`;

  const messages = [];
  addUserMessage(messages, evalPrompt);
  const texto = await chat(messages);
  return JSON.parse(texto.trim());
}

// --- Flujo de evaluación ----------------------------------------------------

async function runTestCase(promptInputs) {
  const output = await runPrompt(promptInputs);
  const grade = await gradeByModel(promptInputs, output);
  return { promptInputs, output, score: grade.score, reasoning: grade.reasoning };
}

async function runEval(dataset) {
  const results = [];
  for (const promptInputs of dataset) {
    results.push(await runTestCase(promptInputs));
  }

  const media = results.reduce((suma, r) => suma + r.score, 0) / results.length;
  console.log(`\nPuntuación media: ${media.toFixed(2)}\n`);

  return results;
}

// --- Ejecución --------------------------------------------------------------

// Para regenerar el dataset (una vez):
// const nuevo = await generateDataset(
//   'Plan de comidas compacto de 1 día para un atleta',
//   {
//     height: 'Altura del atleta en cm',
//     weight: 'Peso del atleta en kg',
//     goal: 'Objetivo del atleta',
//     restrictions: 'Restricciones dietéticas del atleta',
//   },
//   3,
// );
// writeFileSync(new URL('./dataset-comidas.json', import.meta.url), JSON.stringify(nuevo, null, 2));

const datasetPath = new URL('./dataset-comidas.json', import.meta.url);
const dataset = JSON.parse(readFileSync(datasetPath, 'utf-8'));

const results = await runEval(dataset);
for (const r of results) {
  console.log(`[${r.score}/10] ${r.promptInputs.goal} — ${r.reasoning}`);
}
