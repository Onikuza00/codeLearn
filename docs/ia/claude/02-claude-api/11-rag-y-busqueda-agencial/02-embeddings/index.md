# Embeddings { .bloque-ia }

> Convertir texto en números que representan su significado, para poder comparar la pregunta del usuario contra cada chunk por parecido semántico, no solo por coincidencia de palabras.

---

## Qué es una incrustación (embedding) { .topic-title }

Una **incrustación** (*embedding*) es la representación numérica del significado de un texto: un array largo de números, cada uno entre -1 y 1. Lo genera un modelo de incrustaciones — le das el texto, te devuelve el array.

!!! tip "No se sabe qué representa cada número"
    Cada número es una especie de "puntuación" de alguna cualidad del texto, pero el significado exacto de cada posición lo aprende el modelo durante su entrenamiento y no es interpretable directamente por una persona. Lo que sí importa: dos textos parecidos en significado producen arrays de números parecidos entre sí — y eso es lo que se puede medir.

Esto es lo que permite la **búsqueda semántica**: en vez de buscar coincidencias exactas de palabras, comparas el *significado* de la pregunta contra el de cada chunk.

## Generar embeddings con VoyageAI { .topic-title }

Anthropic no genera incrustaciones — el proveedor recomendado es **VoyageAI**, que requiere cuenta y clave API propias (variable de entorno `VOYAGE_API_KEY`).

!!! warning "Sin SDK oficial de Node — se llama por REST"
    VoyageAI solo tiene paquete oficial de Python. Desde JavaScript se llama directamente a su API REST con `fetch`.

El campo `input` de la API acepta un string suelto **o** un array de strings — por eso conviene escribir la función pensando siempre en un array, aunque se le pase uno solo: así una sola llamada sirve tanto para un texto como para varios de golpe (procesamiento por lotes).

```js
async function generateEmbeddingsBatch(textos, inputType = 'document') {
  const respuesta = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'voyage-4-large',
      input: textos,
      input_type: inputType,
    }),
  });

  const datos = await respuesta.json();
  return datos.data.map((item) => item.embedding);
}
```

`data` es siempre un array en la respuesta de la API (uno por cada texto de `input`), con el embedding dentro de cada `item.embedding`. `.map((item) => item.embedding)` se queda solo con esos arrays de números, uno por texto, en el mismo orden en que se mandaron.

!!! tip "`input_type`: `'query'` o `'document'`"
    Le dice al modelo si el texto que le pasas es una pregunta de búsqueda o un documento que se va a buscar — el modelo ajusta la incrustación según el rol del texto, aunque el texto sea el mismo.

## Comparar embeddings: similitud coseno { .topic-title }

Con dos embeddings ya generados, hace falta un número que diga cuánto se parecen. Eso es la **similitud coseno**: compara la dirección de dos vectores, sin que importe su tamaño.

```js
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
```

Recibe dos embeddings y devuelve un número entre -1 y 1: cuanto más cerca de 1, más parecidos en significado.

!!! tip "Lo que hace falta saber para usarla, sin álgebra lineal"
    Es una fórmula matemática fija y estándar — no cambia según el proyecto, y no hace falta derivarla ni memorizarla, igual que no se reinventa `Math.sqrt()` cada vez. Lo único necesario para usarla: qué recibe (dos arrays del mismo tamaño), qué devuelve (un número de -1 a 1, más alto = más parecidos) y para qué sirve (comparar la pregunta contra cada chunk y quedarte con el de número más alto).

## Guardar y buscar: la clase `VectorIndex` { .topic-title }

Con los embeddings ya generados, hace falta un sitio donde guardarlos junto a su texto original, y una forma de buscar entre ellos. Una clase encapsula ambas cosas: sus propios datos (`this.vectores`) y sus propios métodos para manejarlos.

!!! tip "Esta es la opción a usar en producción"
    La búsqueda por [palabras clave](../01-segmentacion-de-texto/index.md#buscar-el-chunk-relevante) sirvió para entender el problema con el mínimo código, pero la búsqueda semántica con embeddings es la que realmente se usa: entiende significado, no solo coincidencias exactas de texto.

```js
class VectorIndex {
  constructor() {
    this.vectores = [];
  }

  addVector(embedding, metadata) {
    this.vectores.push({ embedding, metadata });
  }

  search(queryEmbedding, k) {
    const puntuados = this.vectores.map(({ embedding, metadata }) => ({
      metadata,
      distancia: 1 - cosineSimilarity(queryEmbedding, embedding),
    }));

    const ordenados = puntuados.sort((a, b) => a.distancia - b.distancia);
    return ordenados.slice(0, k);
  }
}
```

- **`constructor()`** — se ejecuta al hacer `new VectorIndex()`, inicializa `this.vectores` como un array vacío propio de esa instancia.
- **`addVector(embedding, metadata)`** — guarda un embedding junto a cualquier dato asociado (`metadata`, normalmente el texto del chunk) — sin el texto, tener solo los números del embedding no sirve de nada al buscar.
- **`search(queryEmbedding, k)`** — compara el embedding de la pregunta contra todos los vectores guardados y devuelve los `k` más parecidos, no solo el mejor.

!!! tip "Distancia, no similitud — y el orden se invierte"
    `search` usa `1 - cosineSimilarity(...)` para convertir similitud en **distancia coseno**: con distancia, 0 significa "idénticos" y valores más altos significan menos parecido — la escala opuesta a la similitud, donde 1 es lo más parecido. Por eso el `sort` también se invierte: `(a, b) => a.distancia - b.distancia` (ascendente, menor primero), al revés que cuando se ordenaba por similitud descendente.

!!! tip "Usar el índice: generar embeddings en lote y cargarlos"
    ```js
    const store = new VectorIndex();

    const chunkEmbeddings = await generateEmbeddingsBatch(chunks, 'document');
    chunks.forEach((chunk, i) => {
      store.addVector(chunkEmbeddings[i], chunk);
    });
    ```
    Los embeddings de todos los chunks se generan una sola vez, en lote, y se cargan en el índice antes de cualquier búsqueda — ese trabajo es preprocesado, no se repite en cada pregunta.

## Límites de la cuenta gratuita { .topic-title }

!!! warning "3 peticiones por minuto sin método de pago"
    Sin tarjeta añadida en el dashboard de VoyageAI, la cuenta gratuita limita a 3 peticiones por minuto (3 RPM). Con `generateEmbeddingsBatch`, cargar el índice y responder una pregunta son solo **2 peticiones** en total (una en lote para todos los chunks, una para la pregunta), muy por debajo del límite — el problema real aparecía antes, cuando se hacía una petición por chunk sin agrupar.

## El flujo RAG completo { .topic-title }

Cerrando el ciclo: buscar en `store` el chunk más relevante y pasárselo a Claude junto con la pregunta, dentro de un prompt normal.

```js
async function answerQuestion(query) {
  const [queryEmbedding] = await generateEmbeddingsBatch([query], 'query');
  const [mejorResultado] = store.search(queryEmbedding, 1);
  const chunkRelevante = mejorResultado.metadata;

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
    messages: [{ role: 'user', content: prompt }],
  });

  return respuesta.content.find((block) => block.type === 'text').text;
}
```

En una frase: recibe la pregunta, busca en el índice ya construido el chunk más parecido por significado, se lo pasa a Claude dentro de un prompt, y devuelve la respuesta final generada usando ese contexto.

!!! tip "`store.search(queryEmbedding, 1)` con `k=1`"
    Aquí solo interesa el mejor resultado, así que se pide `k=1` — `store.search` siempre devuelve un array (aunque sea de un elemento), por eso `[mejorResultado]` hace destructuring del primero, y `.metadata` es el texto del chunk guardado con `addVector` — el embedding en sí ya no hace falta una vez encontrado el resultado.

!!! tip "Nada de embeddings ni similitud actúa ya en esta llamada"
    Para cuando llega `client.messages.create`, la búsqueda semántica ya terminó — pasó antes, en las líneas de `queryEmbedding` y `store.search`. Claude no ve embeddings ni números aquí: ve texto plano, con el documento ya pegado dentro del `prompt`.

!!! tip "Las etiquetas XML no son sintaxis especial"
    `<user_question>` y `<document>` son texto normal, no algo que Claude "ejecute" — ayudan a que distinga claramente qué parte del prompt es la pregunta y cuál es el contexto, en vez de mezclarlo todo en un párrafo ambiguo. Es la misma técnica de las [técnicas de prompt](../../09-prompt-engineering/01-tecnicas-de-prompt/index.md).

!!! tip "Es la llamada a Claude más simple de todo el flujo"
    Sin `tools`, sin historial de mensajes acumulado (`messages` es un array literal de un solo mensaje) — porque no hace falta que Claude pida nada: todo el contexto ya se decidió y se incrustó en el prompt antes de llamar a la API.

## Qué se simplificó respecto a un sistema real { .topic-title }

- **Base de datos vectorial real** — `VectorIndex` es una versión simplificada, en memoria: los vectores se pierden al terminar el proceso. Una base de datos vectorial real persiste los datos en disco y está optimizada para comparar millones de vectores rápido, algo que `this.vectores.map(...)` no podría hacer a esa escala.
- **Normalización** — las APIs de embeddings suelen normalizar cada vector para que tenga magnitud 1.0 antes de devolverlo. No cambia el cálculo de similitud coseno, solo asegura que los resultados sean consistentes entre sí.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — VoyageAI Embeddings** | https://docs.voyageai.com/reference/embeddings-api |
