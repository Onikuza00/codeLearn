# Retriever { .bloque-ia }

> Combinar la búsqueda semántica y la léxica en una sola canalización: un `Retriever` que consulta los dos índices y fusiona sus rankings con *reciprocal rank fusion*.

---

## La arquitectura de índice múltiple { .topic-title }

`VectorIndex` (búsqueda semántica con embeddings) y `BM25Index` (búsqueda léxica) comparten casi la misma interfaz: los dos tienen un método para añadir documentos y otro para buscar. Esa coherencia permite envolverlos en una clase nueva, el **`Retriever`**.

El `Retriever` actúa de coordinador:

1. Reenvía la pregunta del usuario a **todos** los índices.
2. Recoge los resultados de cada uno.
3. Los fusiona en un único ranking con *reciprocal rank fusion*.

## Reciprocal rank fusion (RRF) { .topic-title }

Fusionar resultados de métodos distintos no es concatenar listas: cada método puntúa con su propia escala (una distancia coseno y una puntuación BM25 no son comparables). RRF resuelve esto ignorando la puntuación y usando solo la **posición** de cada documento en cada ranking.

```text
RRF_score(d) = Σ  1 / (k + rank_i(d))
```

- `d` es el documento (el chunk).
- `rank_i(d)` es la posición de `d` en el ranking del índice `i` (1 = el primero).
- `k` es una constante. Lo habitual es 60; en el ejemplo se usa 1 para que los números se vean más claros.

### Ejemplo con dos índices

Se busca `INC-2023-Q4-011` y cada índice devuelve su ranking:

| Índice | 1.º | 2.º | 3.º |
|---|---|---|---|
| `VectorIndex` | Sección 2 | Sección 7 | Sección 6 |
| `BM25Index` | Sección 6 | Sección 2 | Sección 7 |

Con `k = 1`, cada sección suma `1 / (1 + posición)` por cada índice:

| Sección | Posición en `VectorIndex` | Posición en `BM25Index` | Cálculo | Puntuación RRF |
|---|:---:|:---:|---|:---:|
| Sección 2 | 1 | 2 | 1/(1+1) + 1/(1+2) | **0,833** |
| Sección 6 | 3 | 1 | 1/(1+3) + 1/(1+1) | **0,75** |
| Sección 7 | 2 | 3 | 1/(1+2) + 1/(1+3) | **0,583** |

El ranking final es Sección 2, Sección 6 y Sección 7. Tiene sentido: la Sección 2 quedó bien colocada en los dos índices, así que sube a lo más alto.

!!! tip "Por qué RRF usa la posición y no la puntuación"
    Cada índice usa una escala distinta, y normalizarlas a mano es frágil. Con RRF solo importa **en qué lugar** quedó cada documento: un documento que aparece arriba en varios rankings acumula más puntuación, sin necesidad de comparar números de escalas distintas.

## El `Retriever` { .topic-title }

El `Retriever` envuelve varios índices y ofrece una interfaz única. El esquema, en JS:

```js
class Retriever {
  constructor(...indexes) {
    if (indexes.length === 0) {
      throw new Error('Hace falta al menos un índice');
    }
    this.indexes = indexes;
  }

  addDocument(document) {
    for (const index of this.indexes) {
      index.addDocument(document);
    }
  }

  search(queryText, k = 1, kRrf = 60) {
    // 1. Pedir resultados a cada índice: un array de rankings, uno por índice
    // 2. Recorrer cada ranking y, por cada documento, anotar su posición (rank)
    // 3. Sumar 1 / (kRrf + rank) por cada índice en el que aparece
    // 4. Ordenar los documentos por puntuación, de mayor a menor, y devolver los k primeros
  }
}
```

!!! warning "Primero recoger, después fusionar"
    El orden importa: hay que **pedir los resultados a todos los índices antes** de recorrerlos para fusionarlos. Recorrer una lista de resultados que todavía está vacía no fusiona nada.

!!! tip "Cualquier índice que cumpla la interfaz vale"
    Como todos los índices tienen `addDocument()` y `search()`, se pueden añadir métodos nuevos sin tocar el `Retriever`: un índice por palabras clave, uno basado en grafos, uno especializado en un dominio... Basta con que implementen la misma interfaz y el `Retriever` los incorpora a la fusión. Cada búsqueda queda enfocada y fácil de probar, y la combinación no acopla unas con otras.

## Probar el enfoque híbrido { .topic-title }

Con la búsqueda solo vectorial, la pregunta «¿qué pasó con INC-2023-Q4-011?» devolvía primero la sección de ciberseguridad, pero en segundo lugar una sección de análisis financiero que no menciona el incidente. Con el `Retriever` híbrido el resultado mejora: primero la sección de ciberseguridad, después la de ingeniería de software (que sí menciona el incidente) y en tercer lugar la sección legal.

Así, combinar búsqueda semántica y léxica supera los límites de usar cualquiera de las dos por separado.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
