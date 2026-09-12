# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

---

## Estado tras el sábado 12/09

**Symfony `gestor-tareas` cerrado entero**: Servicios (D1-D7) y Maquetación Tailwind (E1-E6), detalle en el [registro del sábado 12](/waytoCode/2026/09/semana-2/2026-09-12/). Repaso final desde 0 completo.

**Curso de API de Claude — sección "Uso de herramientas con Claude" CERRADA entera** (mismo día, misma sesión). Documentación nueva en `docs/ia/claude/02-claude-api/`: Técnicas de prompt (4 técnicas) y Uso de herramientas (4 subsecciones: construir una herramienta, conversaciones con herramientas, streaming con herramientas, herramientas integradas). Ejercicio guiado `IA/practica/Claude/Prompt/promptEngineer.js` (conexión base + `runPrompt`) completado, 6 fallos reales — ver el [registro del sábado 12](/waytoCode/2026/09/semana-2/2026-09-12/).

---

## 📅 Plan — próxima sesión

**Curso de API de Claude** — siguiente sección: **RAG y búsqueda agencial** (segmentación de texto, embeddings, flujo RAG completo, BM25, índice múltiple).

**JS (en paralelo, poco a poco):**

- Cards de ejercicios de **asincronía / módulos / almacenamiento** (hay temario, no hay card).
- Drilling de los 🔴 que reinciden: `setCustomValidity()`, los tres `contains()`, De Morgan, fuga global, off-by-one.

**Octubre:** React fuerte, con el bloque JS ya cerrado.

**Deferred, no empezar sin pedirlo explícito:** Flujo Landing Pages, Flujo SaaS con IA.

---

## ⚠️ Normas vigentes

- **Todo ejercicio cierra con fase de maquetación responsive en Tailwind**, sea del track que sea. Se describe cómo debe verse, nunca las clases.
- **Enunciados autocontenidos:** paso a paso, sin dar nada por sentado, sin tecnicismos sin definir, sin referencias a ejercicios anteriores.
- **Teoría en `docs/` antes de cualquier ejercicio.** Si falta, escribirla primero.
- **Un concepto nuevo por ejercicio.**
- **Tono:** concepto en palabras llanas primero, una idea por frase.
- **Disciplina — media corrección:** arreglar una parte y decir «¿así?» sin releer es el fallo que más pesa. Releer el bloque entero antes de dar algo por hecho.
- **Daily log:** solo fallos conceptuales con su 🧠 corto (una frase, sin párrafos largos); sin fallos van en cuadrícula de totales. Nada de notas meta sobre cómo se escribió el log.
- **Registro el mismo día:** daily log + esta página se actualizan al cierre de cada sesión, no al día siguiente.

---

## ⏳ Pendiente de escribir en docs

- **«Un voter no filtra listados»** en [Voters](/symfony/02-seguridad/05-voters/) — está la dirección contraria, no ésta.
- **Cola, worker, handler y qué significa asíncrono** — el vocabulario del componente, no solo el patrón.
