# Búsqueda léxica BM25 { .bloque-ia }

> La búsqueda semántica no siempre devuelve lo mejor: cuando hace falta una coincidencia exacta (un ID, un código, un término técnico), se combina con una búsqueda léxica.

---

## El problema de la búsqueda semántica sola { .topic-title }

La búsqueda semántica destaca entendiendo contexto y significado, pero eso mismo la hace fallar con términos exactos. Si buscas un identificador concreto como `INC-2023-Q4-011`, puede devolver secciones que se parecen en el tema pero que **no contienen** ese identificador.

Un ejemplo típico: la sección de ciberseguridad (que sí menciona el incidente) aparece junto a una sección de análisis financiero que no lo menciona en ningún sitio. La búsqueda semántica mide parecido conceptual, no presencia de un término.

## Estrategia híbrida { .topic-title }

La solución es lanzar las dos búsquedas en paralelo y fusionar los resultados:

| Búsqueda | Qué encuentra | Cómo |
|---|---|---|
| **Semántica** | Contenido relacionado en significado | Embeddings |
| **Léxica** | Coincidencias exactas de términos | Búsqueda de texto clásica |
| **Fusionada** | Lo mejor de las dos | Combinar ambos rankings |

Cada una cubre el punto ciego de la otra: la semántica entiende la intención de la pregunta y la léxica asegura que no se pierda un término exacto.

## Cómo funciona BM25 { .topic-title }

**BM25** (*Best Match 25*) es el algoritmo de búsqueda léxica más usado en sistemas RAG. Procesa una consulta en cuatro pasos:

1. **Tokenizar la consulta.** Se parte la pregunta en términos sueltos. `"a INC-2023-Q4-011"` se convierte en `["a", "INC-2023-Q4-011"]`.
2. **Contar la frecuencia de cada término** en todos los documentos. Una palabra común como `"a"` puede aparecer decenas de veces; `"INC-2023-Q4-011"`, una sola.
3. **Ponderar por importancia.** Cuanto menos aparece un término en la colección, más puntúa. `"a"` pesa poco por ser común; `"INC-2023-Q4-011"` pesa mucho por ser raro.
4. **Elegir las mejores coincidencias.** Se devuelven los documentos que contienen más ocurrencias de los términos de mayor peso.

!!! tip "Por qué las palabras comunes no cuentan"
    Un simple recuento de coincidencias trata igual a `"el"` que a un identificador único. BM25 corrige justo eso: el peso de un término baja cuanto más se repite en la colección, así que las palabras vacías apenas influyen y las raras deciden el resultado.

## Usar un índice BM25 { .topic-title }

El uso replica el de `VectorIndex`: se crea el índice, se añaden los documentos y se busca con la pregunta y el número de resultados que se quieren.

```js
// 1. Segmentar el texto por secciones
const chunks = chunkBySection(texto);

// 2. Crear el índice BM25 y añadir los documentos
const store = new BM25Index();
for (const chunk of chunks) {
  store.addDocument({ content: chunk });
}

// 3. Buscar
const resultados = store.search('¿Qué pasó con INC-2023-Q4-011?', 3);

for (const [doc, distancia] of resultados) {
  console.log(distancia, '\n', doc.content.slice(0, 200), '\n----\n');
}
```

Con esta búsqueda, las secciones que de verdad contienen el identificador (por ejemplo la de ingeniería de software y la de ciberseguridad) quedan por delante de las que solo se le parecen en el tema.

## Por qué funciona mejor aquí { .topic-title }

BM25 acierta con las coincidencias exactas porque:

- Da más peso a los términos raros y específicos.
- Ignora las palabras comunes, que no aportan valor a la búsqueda.
- Se basa en la frecuencia de los términos, no en el significado.
- Va especialmente bien con términos técnicos, identificadores y frases concretas.

!!! warning "Ninguna de las dos basta sola"
    BM25 no entiende sinónimos: «coche» no encuentra «automóvil». La búsqueda semántica sí, pero falla con los términos exactos. Por eso se combinan: la léxica no se pierde un término exacto y la semántica no se pierde el significado. La fusión de los dos resultados es el siguiente paso, en la [`Retriever`](../04-canalizacion-indice-multiple/index.md).

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
