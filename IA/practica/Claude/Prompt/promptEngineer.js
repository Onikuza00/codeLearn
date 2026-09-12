import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';

const client = new Anthropic();
const modelo = 'claude-sonnet-5';
const modeloRapido = 'claude-haiku-4-5-20251001';

function addUserMessage(messages, text){
    messages.push({role: 'user', content: text})
}

async function chat(messages){
    const message = await client.messages.create({
        model: modelo,
        max_tokens: 1000,
        messages
    });
    return message.content.find((e) => e.type === 'text').text;
}

async function runPrompt(promptInputs){
    const messages = [];
    const prompt = `Genera un plan de comidas de un día para un atleta que cumpla sus restricciones dietéticas:
    1. Incluir el total calórico diario exacto
    2. Mostrar proteínas, grasas e hidratos de carbono
    3. Especificar el horario de cada comida
    4. Usar solo alimentos que cumplan las restricciones
    5. Listar todas las porciones en gramos
    6. Mantenerlo económico si se menciona un presupuesto

    - Altura: ${promptInputs.height}
    - Peso: ${promptInputs.weight}
    - Objetivo: ${promptInputs.goal}
    - Restricciones: ${promptInputs.restrictions}`
    addUserMessage(messages, prompt)

    return await chat(messages)
}

const datasetPath = new URL('./dataset-comidas.json', import.meta.url);
const dataset = JSON.parse(readFileSync(datasetPath, 'utf-8'));

const resultado = await runPrompt(dataset[0]);
console.log(resultado);