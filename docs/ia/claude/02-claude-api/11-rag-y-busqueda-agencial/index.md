# RAG y búsqueda agencial { .bloque-ia }

> Cuando el documento no cabe en el prompt: en vez de mandarle a Claude todo el texto, se parte en fragmentos y se le manda solo el fragmento relevante para cada pregunta.

---

## La solución: segmentar y recuperar (RAG) { .topic-title }

**RAG** (*Retrieval-Augmented Generation*, generación aumentada por recuperación) separa el problema en dos fases:

1. **Preprocesado** — el documento grande se corta en fragmentos más pequeños ("chunks") una sola vez, antes de que llegue ninguna pregunta.
2. **Por cada pregunta** — se busca qué fragmento (o fragmentos) son relevantes para esa pregunta concreta, y solo esos se mandan a Claude — nunca el documento entero.

!!! tip "Por qué \"aumentada\": Claude no memoriza tus datos"
    Claude no aprende tu documento. En cada pregunta le pasas el fragmento relevante como contexto extra dentro del prompt — es aumentar la pregunta con datos externos, no entrenar al modelo con ellos.

## Beneficios { .topic-title }

- Claude se concentra solo en lo relevante, sin distraerse con el resto del documento.
- Escala a documentos grandes o a colecciones enteras, no solo a un texto que quepa en un prompt.
- Prompts más baratos y más rápidos, al mandar menos texto por llamada.

## Desafíos { .topic-title }

- Hace falta una estrategia de segmentación — partir mal el texto (a mitad de una idea) rompe el contexto.
- Hace falta un mecanismo de búsqueda que decida qué fragmento es relevante para cada pregunta.
- Un fragmento aislado puede perder contexto que solo tenía sentido junto al resto del documento.
- Existen muchas formas de segmentar (tamaño fijo, por estructura...) — no hay una única "correcta", depende del documento.

## Cuándo usarlo { .topic-title }

Vale la pena la complejidad extra cuando el documento (o la colección de documentos) es demasiado grande para caber en un prompt, o cuando el coste/latencia de mandarlo entero en cada pregunta no compensa.

## Temario { .topic-title }

| Lección | Qué cubre |
|---|---|
| [Segmentación y búsqueda de texto](01-segmentacion-de-texto/index.md) | Partir un documento en párrafos y encontrar el más relevante para una pregunta, por coincidencia de palabras — sin embeddings todavía |
| [Embeddings](02-embeddings/index.md) | Convertir texto en números para buscar por significado con similitud coseno, y cerrar el flujo RAG mandándole a Claude el chunk relevante junto con la pregunta |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
