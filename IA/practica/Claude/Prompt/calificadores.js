import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';

const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno automáticamente
const modelo = 'claude-sonnet-5';

function addUserMessage(messages, text) {
  messages.push({ role: 'user', content: text });
}

async function chat(messages, system) {
  const params = {
    model: modelo,
    max_tokens: 1000,
    messages,
  };

  if (system) {
    params.system = system;
  }

  const message = await client.messages.create(params);
  return message.content.find((e) => e.type === 'text').text;
}

// --- Ejecutar el prompt candidato ------------------------------------------

async function runPrompt(testCase) {
  const tipo = testCase.format === 'json' ? 'JSON' : 'una expresión regular en texto plano';

  const prompt = `Resuelve la siguiente tarea.

${testCase.task}

* Responde solo con ${tipo}
* No añadas comentarios, texto adicional ni explicación
* No uses bloques de código ni backticks`;

  const messages = [];
  addUserMessage(messages, prompt);
  return await chat(messages);
}

// --- Calificador de modelo -----------------------------------------------------

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

  const messages = [];
  addUserMessage(messages, evalPrompt);

  const texto = await chat(messages);
  return JSON.parse(texto.trim());
}

// --- Calificador de código ------------------------------------------------

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

function gradeSyntax(output, testCase) {
  switch (testCase.format) {
    case 'json':
      return validateJson(output);
    case 'regex':
      return validateRegex(output);
    default:
      return 0; // formato desconocido: no se puede validar
  }
}

// --- Flujo de evaluación -----------------------------------------------------

async function runTestCase(testCase) {
  const output = await runPrompt(testCase);

  const modelGrade = await gradeByModel(testCase, output);
  const modelScore = modelGrade.score;
  const syntaxScore = gradeSyntax(output, testCase);
  const score = (modelScore + syntaxScore) / 2;

  return { output, testCase, score, reasoning: modelGrade.reasoning };
}

async function runEval(datasetEval) {
  const results = [];
  for (const testCase of datasetEval) {
    results.push(await runTestCase(testCase));
  }

  const averageScore = results.reduce((suma, r) => suma + r.score, 0) / results.length;
  console.log(`Puntuación media: ${averageScore}`);

  return results;
}

// --- Ejecución --------------------------------------------------------------

const datasetPath = new URL('../dataset.json', import.meta.url);
const dataset = JSON.parse(readFileSync(datasetPath, 'utf-8'));

const results = await runEval(dataset);
console.log(JSON.stringify(results, null, 2));
