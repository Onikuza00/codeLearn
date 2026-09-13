import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';

const client = new Anthropic();
const modelo = 'claude-sonnet-5';
const modeloRapido = 'claude-haiku-4-5-20251001';

//Separamos cada parrafo ->
function chunkByParagraph(texto){
    return texto.split('\n\n').filter((e) => e.trim() !== "");
}

//Leemos el archivo
const documento = readFileSync('./IA/practica/Claude/RAG/documento.txt', 'utf-8');
//Ejecutamos nuestra funcion
const rag = chunkByParagraph(documento)

function findRelevantChunk(chunks, query){
//quitamos espacios y convertimos en minusculas
let palabras = query.toLowerCase().split(' ');

let puntuados = chunks.map((e) => {
  //Guardaremos la cantidad de palabras(.length) que aparecen en este párrafo[e]
  let contador = palabras.filter((p) => e.toLowerCase().includes(p)).length;
  //Devolvemos cada parrafo y cantidad de cuántas palabras distintas de la pregunta coincidieron
  return { e, contador };
});
//Ordenamos de manera descendente
let ordenados = puntuados.sort((a, b) =>  b.contador - a.contador);

//devolvemos el parrafo y no su contador ->
return ordenados[0].e;
}

let pregunta = findRelevantChunk(rag, '¿cuántas horas duerme un gato?')
//console.log(pregunta);

//ESTRATEGIAS DE SEGMENTACION
//Segmentación por tamaño
function chunkBySize(texto, chunkSize = 150, limite = 20) {
  let chunks = [];
  let start = 0;

  //Nos aseguramos de recorrer cada palabra
  while (start < texto.length) {
    //Actualizamos la posicion de corte
    let end = Math.min(start + chunkSize, texto.length);

    //Vamos subiendo cada fragmento a nuestro array de Chunks
    chunks.push(texto.slice(start, end));

    //Comprpbamos si el chunk no llegó al final del texto, si es así, marcamos elm start (nuevo corte) un poco antes
    //por si perdemos contexto de la frase) si no cumple la condicion marcamos la salida del bucle del while
    start = end < texto.length ? end - limite : texto.length;
  }

  return chunks;
}
//Fragmentacion por frases
function chunkBySentence(texto, maxFrasesChunk = 5, limite = 1) {
  //regex: Parte el texto en frases individuales, cortando espacios despues de: .!?
  const sentences = texto.split(/(?<=[.!?])\s+/);
  let chunks = [];
  let start = 0;

  while (start < sentences.length) {
    //La actualización del corte
    let end = Math.min(start + maxFrasesChunk, sentences.length);
    //Añade cada frase separada por un espacio en un solo string y lo sube a chunks
    chunks.push(sentences.slice(start, end).join(' '));
    //Actualizamos el corte descontanto el limite para no perder el contexto
    start += maxFrasesChunk - limite;
  }
  return chunks;
}

//const result =  chunkBySize(documento);
const result =  chunkBySentence(documento);
//console.log(result)

//EMBEEDINGS ->>
//Espera un array de textos y devuelve array de embeedings
async function generateEmbeddingsBatch(textos, inputType = 'document') {
  const respuesta = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'voyage-4-large',
      input: textos, //array completa
      input_type: inputType,
    }),
  });

  const datos = await respuesta.json();
 // console.log(datos)
  return datos.data.map((item) => item.embedding);
}

//Recibimos dos embeedings, nos devuelve el grado de similtud entre ellos
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] ** 2;
    magnitudeB += b[i] ** 2;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

//Result es un array asi que seleccionamos el primer elemento para probar ->
//const embeeding = await generateEmbedding(result[0]);
//console.log(embeeding)

//CERRAMOS EL CICLO ->

//Recibe la query, encuentra el chunk más relevante por significado y se lo pasa a Claude y devuelve la respuesta
async function answerQuestion(query) {
    //Nos devuelve el chunk mas relevante
   const [queryEmbedding] = await generateEmbeddingsBatch([query], 'query');
   const [mejorResultado] = store.search(queryEmbedding, 1);
   const chunkRelevante = mejorResultado.metadata;

  //El prompt, añadimos tags XML para ayudar en entender como debe proceder en la respuesta ->
  const prompt = `Responde a la pregunta del usuario usando el siguiente documento.

<user_question>
${query}
</user_question>

<document>
${chunkRelevante}
</document>`;

  const respuesta = await client.messages.create({
    model: modelo,
    max_tokens: 1000,
    //messages lo escribimos directo ->
    messages: [{ role: 'user', content: prompt }],
  });
  //Devolvemos solo el bloque de texto ->
  return respuesta.content.find((block) => block.type === 'text').text;
}

//REFACTOR ->
//Esta vez guardaremos en vectores los resultados de los embeedings en una clase
class VectorIndex {
  constructor() {
    this.vectores = [];
  }

  //Añade el embeeding con sus metadatos en nustra array
  addVector(embedding, metadata) {
    this.vectores.push({ embedding, metadata });
  }

  //Recorre todas los vectores que tenemos y calcula su distancia respecto a la query
  search(queryEmbedding, k) {
    const puntuados = this.vectores.map(({ embedding, metadata }) => ({
      metadata,
      distancia: 1 - cosineSimilarity(queryEmbedding, embedding),
    }));
    //Guardamos los resultados en orden ascendente
    const ordenados = puntuados.sort((a, b) => a.distancia - b.distancia);
    return ordenados.slice(0, k);
  }
}
//instanciamos la nueva clase
const store = new VectorIndex();
//Generemos los vectores de todo el documento
const chunkEmbeddingsStore = await generateEmbeddingsBatch(result, 'document');
//Los añadimos todos a nuestra array de clase
result.forEach((chunk, i) => {
  store.addVector(chunkEmbeddingsStore[i], chunk);
});

//Buscamos con los vectores la query
const [queryEmbeddingStore] = await generateEmbeddingsBatch(['¿cuántas horas duerme un gato?'], 'query');

//Mostramos el resultado
const resultadosBusqueda = store.search(queryEmbeddingStore, 2);
console.log(resultadosBusqueda);

//Probamos el flujo completo ya usando la clase VectorIndex
const respuestaFinal = await answerQuestion('¿cuántas horas duerme un gato?');
console.log(respuestaFinal);



