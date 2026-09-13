# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

---

## Estado tras el domingo 13/09

**Curso de API de Claude — "Uso de herramientas con Claude" rehecho desde 0** (ejercicio completo redone paso a paso, sin copiar de la teoría) y **bloque nuevo "RAG y búsqueda agencial" abierto y avanzado**. Detalle completo en el [registro del domingo 13](/waytoCode/2026/09/semana-2/2026-09-13/).

De RAG están cerrados y documentados: segmentación de texto (3 estrategias — párrafo, tamaño con solapamiento, frase), búsqueda léxica por palabras clave, embeddings con VoyageAI, similitud/distancia coseno, la clase `VectorIndex` (guardar + buscar top-k), y el flujo RAG completo respondiendo con Claude. Documentación nueva en `docs/ia/claude/02-claude-api/11-rag-y-busqueda-agencial/`.

**Quedan 2 bloques del curso sin tocar:** búsqueda léxica **BM25** y **canalización RAG de índice múltiple** (`Retriever` combinando `VectorIndex` + `BM25Index` con *reciprocal rank fusion*). Revisados en detalle (contenido de la lección ya leído), pero no implementados — implican refactorizar el interfaz de `VectorIndex` para compartir métodos con la futura `BM25Index`.

Sin fecha fija para la próxima sesión — descanso tras 36h de estudio en 3 días; retoma trabajo el lunes o martes.

---

## 📅 Plan — próxima sesión

**Curso de API de Claude** — cerrar los 2 bloques pendientes de RAG: BM25 y canalización de índice múltiple (`Retriever`).

**JS (pendiente, prioridad):**

- Repaso de **`fetch`** y **DOM**.

**Symfony:** seguir avanzando con el temario (próximo bloque a confirmar contra el plan real, no fijar de antemano).

**Octubre:** React fuerte, con el bloque JS ya cerrado.

**Deferred, no empezar sin pedirlo explícito:** Flujo Landing Pages, Flujo SaaS con IA.

---

## ⚠️ Normas vigentes

- **Todo ejercicio cierra con fase de maquetación responsive en Tailwind**, sea del track que sea. Se describe cómo debe verse, nunca las clases.
- **Enunciados autocontenidos:** paso a paso, sin dar nada por sentado, sin tecnicismos sin definir, sin referencias a ejercicios anteriores.
- **Teoría en `docs/` antes de cualquier ejercicio** — salvo excepción puntual pedida explícitamente (ej. bloque RAG del 13/09: ejercicio primero, docs después).
- **Un concepto nuevo por ejercicio.**
- **Tono:** concepto en palabras llanas primero, una idea por frase; respuestas cortas, sin enrollarse.
- **Disciplina — media corrección:** arreglar una parte y decir «¿así?» sin releer es el fallo que más pesa. Releer el bloque entero antes de dar algo por hecho.
- **Daily log:** solo fallos conceptuales con su 🧠 corto (una frase, sin párrafos largos); sin fallos van en cuadrícula de totales. Nada de notas meta sobre cómo se escribió el log.
- **Registro el mismo día:** daily log + esta página se actualizan al cierre de cada sesión, no al día siguiente.

---

## ⏳ Pendiente de escribir en docs

- **«Un voter no filtra listados»** en [Voters](/symfony/02-seguridad/05-voters/) — está la dirección contraria, no ésta.
- **Cola, worker, handler y qué significa asíncrono** — el vocabulario del componente, no solo el patrón.
