# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

---

## Estado tras el domingo 06/09

Segundo día del bloque de **[Arquitectura](/backend/02-arquitectura/)**, con dos partes.

- **[Caso 4 · Asistente de IA](/backend/02-arquitectura/04-asistente-ia/) completo.** Los dos caminos (datos del cliente vs. conocimiento), cómo funciona RAG, el punto crítico de los permisos, cinco escenarios de fallo y las cuatro preguntas típicas. A mitad se paró a leer teoría, y de ahí salió una profundización larga en índices vectoriales: pgvector vs. Qdrant, qué hay en una fila, metadatos y filtro, caché de preguntas frecuentes.
- **Simulacro completo del [Caso 2](/backend/02-arquitectura/02-integracion-externa/) en voz alta**, de principio a fin. Fondo sólido: cinco preguntas de apertura, la clasificación de cada dato por cómo cambia (réplica / caché / cola), timeout en el adaptador, cortocircuito, y el pedido con cola, identificador único e idempotencia razonada.
- **[Caso 5](/backend/02-arquitectura/05-importacion-masiva/):** leído, sin simulacro ni chuleta.

**Material nuevo:** [chuleta del asistente de IA](/waytoCode/repaso-urgente-asistente-ia/) y el **🧭 guion universal de pizarra** al principio de la [chuleta de arquitectura](/waytoCode/repaso-urgente-arquitectura/).

**Fallos recurrentes detectados:** arrastrar el concepto estrella de un caso al siguiente (tres veces); responder a una pregunta más fácil que la formulada (cinco o seis veces); agarrar un mecanismo genérico —«gestor de estados»— al atascarse; vocabulario aproximado en los términos que puntúan (réplica ≠ copia de seguridad, estados ≠ «medidores de fase»).

---

## 📅 Lunes 07/09 — sesión corta de tarde (3-4 h máximo)

Prioridad: **entrega, no contenido nuevo**. El fondo está; lo que resta puntos es la forma.

1. **Simulacro del [Caso 3](/backend/02-arquitectura/03-portal-cliente/) en voz alta** (~45 min), aplicando el guion de principio a fin.
2. **Lectura seguida de las cuatro chuletas** de repaso urgente (~30 min). Refresco, no aprendizaje nuevo.
3. **Guion universal**, hasta tenerlo de memoria (~20 min). Es lo único que sostiene un caso que no se haya visto nunca.
4. Si sobra tiempo: chuleta del Caso 5.

**Cero horas** en Docker y Open WebUI: para un caso de flujo y arquitectura no se evalúan. Basta una frase de cada uno.

!!! tip "El arreglo que más pesa"
    **Repetir la pregunta en voz alta antes de responder.** Es mecánico, cuesta dos segundos y corta de raíz el fallo más caro: contestar a una pregunta más fácil que la que te han hecho.

---

## 🎯 Objetivos generales de septiembre (sin cambios)

| Frente | Objetivo del mes |
|---|---|
| **Backend — Symfony** | Cerrar el repaso (D5 con teoría, D6, bloque E) → **[Seguridad](/symfony/02-seguridad/)** → **[Pruebas Unitarias](/symfony/00-fundamentos/07-pruebas-unitarias/)**. Messenger y RAG, más adelante. |
| **Frontend — JS** | **[Asincronía](/js/05-asincronia/)** (promesas → `fetch` → `async`/`await`), luego **[Módulos](/js/07-modulos/)** y **[Almacenamiento](/js/06-almacenamiento/)**. Drilling de fondo con los patrones 🔴 de [`repaso-urgente-js.md`](/waytoCode/repaso-urgente-js/). |
| **IA** | Cerrar el **curso de Claude API** (retomar en `gradeByModel()`). |

---

## ⚠️ Normas vigentes

- **Teoría antes de ejercicio, siempre** (01/09) y **un concepto nuevo por ejercicio** (01/09).
- **Tono:** explicaciones y correcciones académicas, concepto en palabras llanas primero, una idea por frase.
- **Tailwind en ejercicios:** describir la intención visual con palabras, NUNCA pasar clases.
- **Daily log:** solo fallos **conceptuales** con su 🧠. Typo/naming/imports/media-corrección no se documentan (excepción: typos de clases CSS/Tailwind que cambian el resultado).
- **Disciplina:** media corrección (arreglar una parte y dejar el resto), decir «así?/listo» sin releer, y responder de lado a la pregunta hecha. Antídoto: releer antes de responder.
- **Documentar antes de pedir:** si la card pide una API/patrón que no está en los docs, documentarlo primero.

---

## ⏳ En pausa (se retoma tras cerrar el bloque de Arquitectura)

- **Symfony Bloque D:** `ByDueDateSorter` (D6, mismo patrón `usort()`/`<=>` que `ByPrioritySorter`).
- **Tailwind / Bloque E:** migrar el CDN de Tailwind al bundle `symfonycasts/tailwind-bundle`; `padding-top` de compensación bajo el header fijo; **E2** (dashboard con tarjetas de estadística), **E3** (lista en grid responsive), **E4** (*empty state*), **E5** (formulario), **E6** (contacto).
- **Drilling DOM:** patrones 🔴 de [`repaso-urgente-js.md`](/waytoCode/repaso-urgente-js/) (`setCustomValidity()`, De Morgan, los tres `contains()`) — pendiente desde el 30/08.
- **Fallos DOM acumulados:** `GOTCHAS.md` (Fallos 37-67).
