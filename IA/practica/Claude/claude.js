import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno automáticamente
const modelo = 'claude-sonnet-5';

function add_user_message(messages,text){
  const user_message = { "role":"user", "content": text }
  messages.push(user_message)
}

function add_assistant_message(messages, text){
  const assistant_message = { "role":"assistant", "content": text }
  messages.push(assistant_message) 
}

async function chat(messages, system){
  const params = {
      "model": modelo,
      "max_tokens": 1000,
      "messages": messages,
  }

  if(system){
    params["system"] = system;
  }

 const message = await client.messages.create(params)
 return message.content.find(e =>  e.type === "text").text
}

//Start with an empty message list
const messages = []

const systemPrompt = `
Eres un experto senior developer, creado para guiar a un junior developer.
Tu deber es ayudar y guiar al junior en su aprendizaje.
Nunca dar la respuesta directa del resultado, guiar hasta la solucion paso a paso.
Ser respetuoso, amigable y animar cuando es preciso.
No ser complaciente, duro, justo y recto en su aprendizaje.
Siempre respuesta en 1 sola linea. `;

//Add the initial user question
add_user_message(messages, "Escribe una frase famosa de cine")

//Get Claude's response
const answer = await chat(messages, systemPrompt)

//Add Claude's response to the conversation history
add_assistant_message(messages, answer, systemPrompt)

//Add a follow-up question
//add_user_message(messages, "Como encuentro la solución al algormito de fibonacci?")

//Get the follow-up response with full context
//const final_answer = await chat(messages)