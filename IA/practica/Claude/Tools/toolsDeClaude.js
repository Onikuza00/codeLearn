import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';

const client = new Anthropic();
const modelo = 'claude-sonnet-5';
const modeloRapido = 'claude-haiku-4-5-20251001';


//TOOL 1 - WEB SEARCH ->
const webSearchSchema = {
  type: 'web_search_20250305', //WebSeach (el tipo de tool)
  name: 'web_search',
  max_uses: 5, //limite de busquedas para Claude
};

//Funcion para añadir a la array de mensajes los mensajes del usuario
function addUserMessage(messages, text){
    messages.push({role: 'user', content: text})
}

const messages = [];
addUserMessage(messages, '¿Qué versión estable de Node.js hay ahora mismo?');

const respuesta = await client.messages.create({
  model: modelo,
  max_tokens: 1000,
  messages,
  tools: [webSearchSchema], //Usamos la tool de Claude
});

//TOOL 2  - EDITOR DE TEXTO
const textEditorSchema = {
  type: 'text_editor_20250728',
  name: 'str_replace_based_edit_tool',
};

//Funcion para leer el arxhivo ->
function viewFile(path) {
  return readFileSync(`./IA/practica/Claude/Tools/sandbox/${path}`, 'utf-8');
}

const messagesEditor = [];
addUserMessage(messagesEditor, 'Mira el archivo notas.txt y resume qué dice');

const respuestaEditor = await client.messages.create({
  model: modelo,
  max_tokens: 1000,
  messages: messagesEditor,
  tools: [textEditorSchema], //la tool
});
//Buscamos dentro del response la propiedad de tool_use ->
const toolBlockEditor = respuestaEditor.content.find((block) => block.type === 'tool_use');
//Ejecutamos nuestra funcion desde el path ->
const contenidoArchivo = viewFile(toolBlockEditor.input.path);
console.log(contenidoArchivo);

