import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const modelo = 'claude-sonnet-5';
const modeloRapido = 'claude-haiku-4-5-20251001';

//El schema, con las instrucciones de la herramienta, el tipo, el formato, sus propiedades y opciones por defecto
const getCurrentDatetimeSchema = {
  name: 'hora_actual',
  description: 'Devuelve la fecha y hora actuales. Úsala cuando el usuario pregunte qué hora o qué día es. Devuelve un string legible en el formato pedido.',
  input_schema: {
    type: 'object',
    properties: {
      format: {
        type: 'string',
        description: 'Modo de formato: "full" (fecha y hora), "time" (solo hora) o "date" (solo fecha).',
        default: 'full',
      },
    },
    required: [],
  },
};

//Funcion para añadir a la array de mensajes los mensajes del usuario
function addUserMessage(messages, text){
    messages.push({role: 'user', content: text})
}

function addAssistantMessage(messages, text){
    messages.push({role: 'assistant', content: text.content}) //Devolvemos la propiedad de metadatos [content]
}

//Funcion asincrona, que establece la conexion con Claude,
async function chat(messages){
    const message = await client.messages.create({
        model: modelo,
        max_tokens: 1000,
        tools: [getCurrentDatetimeSchema], //Indicamos que herramientas usamos
        messages
    });
    //Ya no devolvemos solo texto, sino un array, con lo que nos devuleve las harrimentas y el texto:
    //Las propiedades de dentro son: .content y .stop_reason
    return message;
}

//Nuestra función personalizada que nos devuelve la hora actual, en función de 3 valores: "full" - "time" y "date"
function getCurrentDatetime(format = 'full') {
  if (!format) {
    throw new Error('format no puede estar vacío');
  }

  const now = new Date();

  if (format === 'time') return now.toLocaleTimeString('es-ES');
  if (format === 'date') return now.toLocaleDateString('es-ES');
  return now.toLocaleString('es-ES');
}

//Bucle infinito que nos asegura que se usen todas las tools, sale solo del bucle con el break
async function runConversation(messages) {
  while (true) {
    const response = await chat(messages);
    addAssistantMessage(messages, response);

    if (response.stop_reason !== 'tool_use') break;

    const toolResultBlocks = await runTools(response);
    addUserMessage(messages, toolResultBlocks);
  }

  return messages;
}

//Lo usamos con un switch pq es más escalable, en caso de tener más tools
async function runTool(toolName, toolInput) {
  switch (toolName) {
    case 'hora_actual': //el nombre que le hemos puesto a nuestro schema
      return getCurrentDatetime(toolInput.format);
    default:
      throw new Error(`Herramienta desconocida: ${toolName}`);
  }
}

async function runTools(message){
    //Extraemos de message las harramientas('tool_use') que tenemos ->
    const toolRequests = message.content.filter((block) => block.type === 'tool_use');
    const toolResultBlocks = [];

    for (const toolRequest of toolRequests){
        let toolResultBlock; // <- ahora vive en el scope del for, visible para try Y catch

        try{
            //Ejecutamos nuestra función para usar la tool ->
            const toolOutput = await runTool(toolRequest.name, toolRequest.input);
            //Nos aseguramos de pasarlo como string ->
            const content = typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput);

            //Recibimos la informacón y las propiedades de cada herramienta ->
            toolResultBlock = {
                type: 'tool_result',
                tool_use_id: toolRequest.id,
                content,
                is_error: false,
            };
        } catch (error) {
            toolResultBlock = {
                type: 'tool_result',
                tool_use_id: toolRequest.id,
                content: `Error: ${error.message}`,
                is_error: true,
            };
        }

        toolResultBlocks.push(toolResultBlock); //Guardamos en la array, el resultado de cada herramienta
    }

    return toolResultBlocks;
}

const messages = [];
addUserMessage(messages, '¿Qué hora es?');

//Historial completo con el uso de herramientas detallado ->
const historial = await runConversation(messages);
//El ultimo mensaje siempre es la respuesta final de Claude ->
const ultimoMensaje = historial[historial.length - 1];
//Lo devolvemos como string ->
//console.log(ultimoMensaje.content.find((block) => block.type === 'text').text);


/////USO DE STREAM ->
const streamMessages = [];
addUserMessage(streamMessages, '¿Qué hora es, en formato time?');

//Devuelve un emisor de eventos, en ese caso capturaremos el evento de 'inputJson" ->
const stream = client.messages.stream({
  model: modelo,
  max_tokens: 1000,
  messages: streamMessages,
  tools: [getCurrentDatetimeSchema],
});

//El evento inputJson, nos devuelve siempre dos parametros: fragmentoNuevo y Acumulado
stream.on('inputJson', (nuevo, acumulado) => {
  console.log('Fragmento:', nuevo);
  console.log('Acumulado:', acumulado);
});






