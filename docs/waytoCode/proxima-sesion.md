# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

---

## Estado tras el lunes 21/09

**Repaso urgente de DOM.** Teoría de DOM releída (selección, manipulación, eventos, formularios, operadores) y cuatro ejercicios de `dia-19-dom` rehechos desde cero: `validarRangoNumerico`, `validarCodigoPostal`, `validarConfirmacionEmail` y `activarDropdownConCierre`. Detalle en el [registro del lunes 21](/waytoCode/2026/09/semana-3/2026-09-21/).

Lo que más se repitió: la **media corrección** (arreglar una mitad y dar el ejercicio por bueno sin releerlo entero) en tres de los cuatro. Los tests de los cuatro están revisados línea a línea, pero sin confirmar en el navegador.

La página [Repaso urgente — JS / DOM](/waytoCode/repaso-urgente-js/) ya recoge los patrones nuevos de hoy (nº 17 y ampliaciones de los nº 1 y 10).

---

## 📅 Plan — miércoles 23/09

**Ritmo:** 3 días a la semana, de 3 a 4 horas cada uno, sin días fijos. Entre semana, en casa: JS.

**Desde octubre:** sábado y domingo (12 h cada día) para sacar el certificado del curso de API de Claude (48 de 84 sesiones hechas, quedan 36); entre semana sigue JS.

**Objetivo único:** cerrar lo que queda de JS para empezar React cuanto antes.

**Continuar el repaso urgente de DOM:**

- `filtrarPorNombreOCategoria` (card 🔁 Bloque 2 — Repaso, nº 8): `includes` frente a `contains` y acumulador dentro del bucle. Es el que quedó sin hacer de los cinco 🔴.
- Si sobra tiempo: `activarFiltroCategorias` y `activarStepperConLimite` (Bloque 2 — Repaso), y la card 🔁 Refuerzo 2 — Reincidencias (`validarPrecioEnRango`, `validarTelefonoExacto`).
- Confirmar en el navegador los tests de los cuatro ejercicios del lunes.

**JS después:** repaso de **`fetch`** y `async/await` (sin tocar el lunes). Confirmar qué más queda del bloque JS, contra lo ya cerrado.

**React:** empieza en cuanto el bloque JS esté cerrado, sin esperar a octubre.

**Sin prioridad esta semana:** BM25 y `Retriever` de índice múltiple del curso de API de Claude; Symfony (próximo bloque a confirmar contra el plan real).

**Deferred, no empezar sin pedirlo explícito:** Flujo Landing Pages, Flujo SaaS con IA.

---

## ⚠️ Normas vigentes

- **Todo ejercicio cierra con fase de maquetación responsive en Tailwind**, sea del track que sea. Se describe cómo debe verse, nunca las clases.
- **Enunciados autocontenidos:** paso a paso, sin dar nada por sentado, sin tecnicismos sin definir, sin referencias a ejercicios anteriores.
- **Teoría en `docs/` antes de cualquier ejercicio** — salvo excepción puntual pedida explícitamente.
- **Un concepto nuevo por ejercicio.**
- **Tono:** concepto en palabras llanas primero, una idea por frase; respuestas cortas, sin enrollarse.
- **Disciplina — media corrección:** arreglar una parte y decir «¿así?» sin releer es el fallo que más pesa. Releer el bloque entero antes de dar algo por hecho.
- **Daily log:** solo fallos conceptuales con su 🧠 corto (una frase, sin párrafos largos); sin fallos van en cuadrícula de totales. Nada de typos ni de notas meta sobre cómo se escribió el log. En cada ejercicio va primero el ✅ código corregido y debajo el ❌ código de Pau.
- **Registro el mismo día:** daily log + esta página se actualizan al cierre de cada sesión, no al día siguiente.

---

## ⏳ Pendiente de escribir en docs

- **«Un voter no filtra listados»** en [Voters](/symfony/02-seguridad/05-voters/) — está la dirección contraria, no ésta.
- **Cola, worker, handler y qué significa asíncrono** — el vocabulario del componente, no solo el patrón.
- **Orden ✅ antes de ❌** en `rules/ejercicios-resultados.md` y en las páginas de repaso urgente: hoy solo lo sigue el daily del 21/09. Cambiarlo en la norma exige su entrada en `openspec/changes/archive/`.
