# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

---

## Estado tras el domingo 30/08

Repaso final de Symfony desde 0 (`Backend/assessment/Ex-Symfony/gestor-tareas/`): **A, B, C completos; D1–D4 hechos**. Sesión cortada a las ~9 h por acumulación (12 h el sábado). Ver [daily del 30/08](/waytoCode/2026/08/semana-4/2026-08-30/).

**Contexto que condiciona septiembre:** las mañanas dejan de estar libres a partir de la primera semana. Tiempo de estudio real: ~3-4 h por las tardes, 2-3 días/semana. Los dos primeros findes, 12 h sábado + domingo y luego libre.

---

## 🎯 Objetivos generales de septiembre (por ahora)

No es un calendario cerrado — solo la dirección. El semana a semana se fija cada semana con las horas reales.

**Decisión 30/08:** aparcar React. Consolidar JS y seguir con Symfony. Cerrar el certificado de Claude API.

| Frente | Objetivo del mes |
|---|---|
| **Backend — Symfony** | Cerrar el repaso (D5, D6, bloque E) → **Seguridad** (auth, roles, voters ≈ ABAC, `#[IsGranted]`, login/JWT) → **Testing** (PHPUnit, tests funcionales, fixtures). Messenger + RAG entran solo cuando el jefe empuje el RAG de verdad. |
| **Frontend — JS** | **Async**: Promises → `fetch` → `async`/`await` → `try/catch` con `await`. Luego **módulos** (`import`/`export`) y **storage** (`localStorage`/`sessionStorage`/cookies + `JSON`). React aparcado. **Drilling de DOM de fondo**: cada sesión, un ejercicio de los patrones 🔴 de [`repaso-urgente-js.md`](/waytoCode/repaso-urgente-js/) antes de lo demás. |
| **IA** | Cerrar el **curso de Claude API** (retomar en `gradeByModel()`, `docs/ia/claude/02-claude-api/08-evaluacion-prompts/`). Capturar en `docs/ia/` los patrones que salgan de la práctica real (prompts, evals, tool use, RAG). |

---

## 📅 Próxima semana

Solo objetivos, sin repartir por días.

**Symfony:**

- Terminar los ejercicios pendientes de **Servicios**: D5 (`DateHumanizer` + Twig Extension `fecha_relativa`, empezar por el servicio), D6 (`TaskSorter` con dos implementaciones + `#[Autowire(service: ...)]`), y lo que quede de la card S1–S12.
- Empezar **y cerrar Seguridad**: autenticación con **JWT**, `User` provider, roles, permisos (voters, `#[IsGranted]`).

**JS:**

- **Dominar** los ejercicios de DOM pendientes (patrones 🔴 de [`repaso-urgente-js.md`](/waytoCode/repaso-urgente-js/)).
- Cerrar el **bloque asíncrono**: Promises → `fetch` → `async`/`await` → `try/catch` con `await`. Si da tiempo, entero.

**Curso de Claude API:**

- Apretar fuerte, sobre todo el fin de semana. Retomar en `gradeByModel()` (`docs/ia/claude/02-claude-api/08-evaluacion-prompts/`).

No entra esta semana: bloque E (maquetación Tailwind del SaaS) — queda para después.

---

## ⚠️ Normas vigentes

- **Tono:** explicaciones y correcciones más académicas, menos jerga densa. Concepto en palabras llanas primero, una idea por frase, definir el término. (`feedback_tono_academico`)
- **Tailwind en ejercicios:** describir la intención visual con palabras, NUNCA pasar clases. (`feedback_tailwind_no_pasar_clases`)
- **Daily log:** solo fallos **conceptuales** con su 🧠. Typo/naming/imports/media-corrección no se documentan.
- **Disciplina de Pau:** media corrección (arreglar una parte y dejar el resto), decir "así?/listo" sin releer. Antídoto: enunciado línea a línea, tachando cada requisito. Reincidió en D1, D4.
- **Documentar antes de pedir:** si la card pide una API/patrón que no está en los docs, documentarlo primero. (Pasó con Mailer/Logger en D4 → se creó [Servicios → utilidades](/symfony/01-servicios/), 7 subsecciones.)

---

## ⏳ Pendiente de fondo

- **Fallos DOM acumulados:** `GOTCHAS.md` (Fallos 37-67) y `repaso-urgente-js.md`. Se ataca con el drilling de fondo, no con una sesión aparte.
