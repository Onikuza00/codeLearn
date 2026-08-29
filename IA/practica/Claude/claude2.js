import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, readFileSync } from 'node:fs';

const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno automáticamente
const modelo = 'claude-haiku-4-5-20251001';
//claude-haiku-4-5-20251001 ____ claude-sonnet-5

function addUserMessage(messages,text){
  const user_message = { "role":"user", "content": text }
  messages.push(user_message)
}

function addAssistantMessage(messages, text){
  const assistant_message = { "role":"assistant", "content": text }
  messages.push(assistant_message) 
}

async function chat(messages, system, temperature = 1.0, stopSequences = [], modelOverride){
  const params = {
      "model": modelOverride ?? modelo,
      "max_tokens": 1000,
      "messages": messages,
      "temperature": temperature,
  }

  if(system){
    params["system"] = system;
  }

  if(stopSequences.length){
    params["stop_sequences"] = stopSequences;
  }

 const message = await client.messages.create(params)
 return message.content.find(e =>  e.type === "text").text
}

// STREAM ----->
/*
const messages = [];
addUserMessage(messages, "Escribe una frase famosa de cine")
 const stream = client.messages.stream({
  model: modelo,
  max_tokens: 1000,
  messages,
});

stream.on('text', (text) => {
 process.stdout.write(text)// reenviar cada fragmento al cliente
});

const message = await stream.finalMessage();
const textBlock = message.content.find((block) => block.type === 'text');*/





// ESTRUCTURAS DE DATOS ->
/*const messages = [];
addUserMessage(messages, 'Genera una regla muy corta de EventBridge en JSON. Responde SOLO con el JSON crudo, sin bloque de código, sin backticks, sin explicación ni texto alrededor.');

const texto = await chat(messages);
const datosLimpios = JSON.parse(texto.trim());
console.log(datosLimpios)
*/



// EVALUACIÓN DE PROMPTS — generación de dataset de prueba ->
/*async function generateDataset() {
  const prompt = `Genera un dataset de evaluación de prompts. El dataset se usará para evaluar prompts que generan código Python, JSON o expresiones regulares específicamente para tareas relacionadas con AWS. Genera un array de objetos JSON, cada uno representando una tarea que requiere Python, JSON o una regex para resolverse.

Ejemplo de salida:
[
  { "task": "Descripción de la tarea" },
  ...más objetos
]

* Enfócate en tareas que se resuelvan con una sola función de Python, un solo objeto JSON, o una sola regex
* Enfócate en tareas que no requieran escribir mucho código
* Responde SOLO con el array JSON crudo, sin bloque de código, sin backticks, sin explicación

Genera 3 objetos.`;

  const messagesDataset = [];
  addUserMessage(messagesDataset, prompt);

  const textoDataset = await chat(messagesDataset, null, 1.0, [], 'claude-haiku-4-5-20251001');
  return JSON.parse(textoDataset.trim());
}

const dataset = await generateDataset();
console.log(dataset);
writeFileSync('dataset.json', JSON.stringify(dataset, null, 2));
*/


// EVALUACIÓN DE PROMPTS — ejecutar la evaluación ->
async function runPrompt(testCase) {
  const prompt = `Por favor resuelve la siguiente tarea:\n\n${testCase.task}`;
  const messagesPrompt = [];
  addUserMessage(messagesPrompt, prompt);
  return await chat(messagesPrompt);
}

async function runTestCase(testCase) {
  const output = await runPrompt(testCase);

  // TODO — calificación real
  const score = 10;

  return { output, testCase, score };
}

async function runEval(datasetEval) {
  const results = [];
  for (const testCase of datasetEval) {
    results.push(await runTestCase(testCase));
  }
  return results;
}

const datasetCargado = JSON.parse(readFileSync('dataset.json', 'utf-8'));
const results = await runEval(datasetCargado);
console.log(JSON.stringify(results, null, 2));