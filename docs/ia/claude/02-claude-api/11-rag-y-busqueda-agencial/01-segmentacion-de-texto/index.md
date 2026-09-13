# Segmentación y búsqueda de texto { .bloque-ia }

> Tres formas de partir un documento en fragmentos (por estructura, por tamaño y por frase), y cómo encontrar el más relevante para una pregunta por coincidencia de palabras — la versión más simple de búsqueda léxica, sin embeddings todavía.

---

## Segmentar por estructura (párrafo) { .topic-title }

Cortar el texto donde ya hay una separación natural. Si el documento usa una línea en blanco entre temas, `\n\n` es el separador correcto.

```js
function chunkByParagraph(texto) {
  return texto.split('\n\n').filter((chunk) => chunk.trim() !== '');
}
```

!!! tip "Por qué el `filter`"
    `split('\n\n')` puede dejar algún elemento vacío — por ejemplo si el archivo termina con una línea en blanco. El `filter` descarta esos huecos, para no procesar chunks vacíos más adelante.

Funciona muy bien cuando el documento tiene un formato conocido y consistente (Markdown con encabezados, texto con párrafos claros). El problema: en cuanto el documento es texto plano sin esa estructura, no hay separador natural que usar.

## Segmentar por tamaño, con solapamiento { .topic-title }

La alternativa que funciona con cualquier documento, sin depender de su formato: partirlo en trozos de un tamaño fijo de caracteres.

```js
function chunkBySize(texto, chunkSize = 150, overlap = 20) {
  let chunks = [];
  let start = 0;

  while (start < texto.length) {
    let end = Math.min(start + chunkSize, texto.length);
    chunks.push(texto.slice(start, end));

    start = end < texto.length ? end - overlap : texto.length;
  }

  return chunks;
}
```

El problema de partir por tamaño fijo a secas: corta palabras e ideas a mitad de frase, sin respetar dónde termina un pensamiento. El **solapamiento** (`overlap`) mitiga esto: cada chunk nuevo no empieza justo donde terminó el anterior, sino `overlap` caracteres *antes* — esa franja del borde queda repetida en ambos chunks, para no perder una idea que cae justo en el corte.

!!! tip "`end - overlap`, no un hueco entre chunks"
    El nombre puede confundir: `overlap` no es un espacio vacío entre chunks, es lo contrario — la cantidad de texto que se **repite** entre un chunk y el siguiente. Con `chunkSize=10` y `overlap=3`: el primer chunk cubre `[0, 10)`, el siguiente empieza en `start = 10 - 3 = 7`, así que los caracteres 7-9 aparecen en los dos chunks.

!!! tip "Por qué el `else` fuerza `start = texto.length`"
    Sin ese caso, en el último chunk `end` se queda fijo en `texto.length` (topado por el `Math.min`) y `start = end - overlap` daría siempre el mismo valor, vuelta tras vuelta — el bucle nunca cumpliría `start < texto.length` como falso y **no terminaría nunca**. El `else` corta eso a mano: en cuanto el chunk actual ya llega al final, fuerza `start` al valor exacto de `texto.length`, para que la siguiente comprobación del `while` sea falsa y el bucle pare.

## Segmentar por frase { .topic-title }

Un punto intermedio: en vez de cortar por caracteres (que parte palabras) ni por estructura (que no siempre existe), se parte el texto en frases completas y se agrupan de N en N.

```js
function chunkBySentence(texto, maxSentencesPerChunk = 5, overlapSentences = 1) {
  const sentences = texto.split(/(?<=[.!?])\s+/);
  let chunks = [];
  let start = 0;

  while (start < sentences.length) {
    let end = Math.min(start + maxSentencesPerChunk, sentences.length);
    chunks.push(sentences.slice(start, end).join(' '));
    start += maxSentencesPerChunk - overlapSentences;
  }

  return chunks;
}
```

!!! tip "La regex `/(?<=[.!?])\s+/`"
    `(?<=[.!?])` es un *lookbehind*: comprueba que el carácter anterior sea `.`, `!` o `?`, sin consumirlo (no forma parte del corte). `\s+` es lo que realmente se corta — uno o más espacios. Junto: "parte el texto en cada tramo de espacios que venga justo después de un signo de puntuación de cierre de frase" — el punto se queda pegado a la frase anterior en vez de perderse.

!!! warning "El incremento fijo del `start` puede quedarse en bucle infinito"
    A diferencia de `chunkBySize` (que recalcula `start` a partir de `end`), aquí `start` avanza un número fijo cada vuelta: `maxSentencesPerChunk - overlapSentences`. Si `overlapSentences` es mayor o igual que `maxSentencesPerChunk`, ese incremento sale 0 o negativo, y el bucle no avanza nunca.

## Elegir estrategia { .topic-title }

| Estrategia | Cuándo conviene |
|---|---|
| Por estructura | El documento tiene un formato consistente y conocido (Markdown, informes con secciones fijas) |
| Por frase | Punto intermedio razonable para texto plano sin estructura clara |
| Por tamaño, con solapamiento | La más robusta: funciona con cualquier contenido, incluido código — la opción por defecto más habitual en producción |

!!! tip "Existe una cuarta: segmentación semántica"
    Divide el texto en frases y usa procesamiento de lenguaje natural para agrupar solo las que están relacionadas en significado. Da los fragmentos más coherentes, pero con un coste computacional alto y una implementación bastante más compleja que las tres anteriores — no hay una única estrategia "correcta", la elección depende del documento y de cuánta complejidad vale la pena asumir.

## Buscar el chunk relevante { .topic-title }

Sin usar embeddings ni ningún modelo: el enfoque léxico más simple es contar cuántas palabras de la pregunta aparecen en cada chunk, y quedarse con el que más tenga.

```js
function findRelevantChunk(chunks, query) {
  let palabras = query.toLowerCase().split(' ');

  let puntuados = chunks.map((chunk) => {
    let contador = palabras.filter((p) => chunk.toLowerCase().includes(p)).length;
    return { chunk, contador };
  });

  let ordenados = puntuados.sort((a, b) => b.contador - a.contador);
  return ordenados[0].chunk;
}
```

!!! tip "Minúsculas antes de partir, no al revés"
    `query.toLowerCase().split(' ')` — primero se pasa a minúsculas el string completo, y recién después se parte en palabras. Al revés (`query.split(' ').toLowerCase()`) falla: `split()` ya devuelve un array, y `.toLowerCase()` es un método de string, no de array.

!!! tip "`filter` + `length`, sin bucle"
    `palabras.filter((p) => chunk.includes(p))` no cuenta nada por sí solo — devuelve un array con las palabras que sí aparecen en el chunk. `.length` es lo que convierte "cuáles coinciden" en "cuántas coinciden", sin necesidad de un `for` que sume una por una.

!!! tip "Por qué el `.map()` necesita cuerpo con `{ }`"
    Una arrow de una sola expresión (`(chunk) => ({ chunk, contador })`) no admite declarar variables antes del `return` — no tiene cuerpo, solo una expresión implícita. Para calcular `contador` primero y devolverlo después hace falta el cuerpo completo con llaves: `(chunk) => { let contador = ...; return { chunk, contador }; }`.

!!! tip "La lógica del comparador de `sort()`"
    `.sort()` compara elementos de dos en dos y decide el orden según el número que devuelve la función que le pasas:

    - Negativo → el primer elemento (`a`) va antes.
    - Positivo → el segundo elemento (`b`) va antes.
    - Cero → no cambia el orden.

    Con `b.contador - a.contador`: si `b` tiene más contador que `a`, el resultado es positivo, y `b` pasa a ir primero. Repetido para todos los pares, el array queda de mayor a menor contador — el chunk más relevante en la posición `[0]`. Con la resta al revés (`a.contador - b.contador`) el orden sería ascendente, y el más relevante quedaría al final.

## Probar el flujo completo { .topic-title }

```js
const documento = readFileSync('./documento.txt', 'utf-8');
const chunks = chunkByParagraph(documento);

const chunkRelevante = findRelevantChunk(chunks, '¿cuántas horas duerme un gato?');
console.log(chunkRelevante);
```

Con un documento de varios párrafos temáticos (gatos, perros, café, té), esa pregunta devuelve el párrafo de los gatos — es el único que contiene palabras como "gato" y "duerme".

!!! warning "Punto de partida, no la opción de producción"
    Contar palabras exactas es frágil: si la pregunta usa un sinónimo o una forma distinta de la palabra (plural, conjugada), no hay coincidencia aunque el chunk sea relevante. `findRelevantChunk` sirve para entender el problema de la búsqueda de relevancia con el mínimo código posible — la opción real a usar es la búsqueda semántica con [embeddings](../02-embeddings/index.md), que sí entiende significado y no solo texto exacto.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
