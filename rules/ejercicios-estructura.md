# Crear un ejercicio — normas de estructura

> Normas para montar páginas de ejercicios nuevas bajo `docs/assessment/js/ejercicios/` (HTML + JS). No aplica a documentar teoría (`rules/documentacion.md`) ni a documentar resultados en el daily log (`rules/ejercicios-resultados.md`).

---

## Regla definitiva: una página por track/día, nunca archivos nuevos por tanda

- UN solo HTML por track/día con TODAS las cards de ejercicios de ese track.
- Los ejercicios nuevos SIEMPRE se añaden como card nueva en ese MISMO HTML.
- Las funciones/definiciones se añaden a los MISMOS dos JS ya existentes: `{tema}-soluciones.js` (stubs/soluciones) y `{tema}-runner.js` (definiciones/tests) — NUNCA crear un HTML separado ni un JS nuevo por tanda.
- Estructura de archivos: `{tema}.html` + `{tema}-soluciones.js` + `{tema}-runner.js`.

## Estructura de la card de ejercicio

- Cards plegadas por defecto (sin `is-open`).
- Cada ejercicio: enunciado + explicación SIEMPRE visibles; solución OCULTA tras un botón toggle ("Ver solución" / "Ocultar solución").
- Panel de resultados con tests ✅/❌ visible tras ejecutar.
- Clases de referencia (clonar de `conceptos-basicos.html`): `.ex` / `.ex-head` / `.ex-num` / `.ex-status` / `.ex-samples` / `.ex-solution-btn` / `.ex-code` / `.ex-result`.
- Botón de solución con fondo visible — decisión explícita: un botón, no un `<details>`/`<summary>` genérico.
- Sintaxis coloreada en el código de ejemplo: spans `.kw` / `.fn` / `.str` / `.num` / `.cmt`; escapar `<` como `&lt;`.
- Nav + megamenú del sitio de assessment se mantienen; `toggleExercise()` / `toggleSolution()` como funciones JS del patrón ya establecido.

## Runner — reglas técnicas

- Con MÚLTIPLES cards en la misma página: contadores por card vía `data-count-done/review/pending` ESCOPEADOS a cada `.exercise-card` (nunca ids globales) — `querySelectorAll('.exercise-card').forEach(card => card.querySelector('[data-count-...]'))`.
- Los `.ex-result` se ubican por `data-fn` único (no colisionan entre cards).
- Lookup de la función a testear: `window[fn]` (sin `eval`).
- Comparación de resultados: `deepEqual` vía `JSON.stringify`.
- Badges de estado: `data-done` (✅ Completado) / `data-review` (🔁 Repasar) / `data-pending` (⏳ Pendiente).
- Orden de scripts: `soluciones.js` SIEMPRE antes que `runner.js`.

## Prohibido

- Revelar en el enunciado o en comentarios qué método/patrón usar (nunca "usá `map`", nunca "objeto-contador") — Pau decide el enfoque, no se le da la pista.

## Verificación antes de dar por terminado

- `node --check` sobre los JS nuevos/modificados.
- Confirmar HTTP 200 en `mkdocs serve` (`localhost:8000/assessment/js/ejercicios/...`).

---

*Consolidado el 15/08/2026 desde engram `pattern` #190 (regla definitiva "será siempre así"), #146 (diseño card colapsable), #189/#192/#193/#218 (aplicaciones consistentes del patrón).*
