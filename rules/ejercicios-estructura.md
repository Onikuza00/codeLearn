# Crear un ejercicio — normas de estructura

> Normas para montar páginas de ejercicios nuevas bajo `docs/assessment/js/ejercicios/` (HTML + JS). No aplica a documentar teoría (`rules/documentacion.md`) ni a documentar resultados en el daily log (`rules/ejercicios-resultados.md`).

---

## Regla definitiva: una página por track, nunca archivos nuevos por tanda

- UN solo HTML por track con TODAS las cards de ejercicios de ese track, sin importar cuántos días distintos aporten ejercicios.
- Las funciones/definiciones se añaden a los MISMOS dos JS ya existentes: `{tema}-soluciones.js` (stubs/soluciones) y `{tema}-runner.js` (definiciones/tests) — NUNCA crear un HTML separado ni un JS nuevo por tanda.
- Estructura de archivos: `{tema}.html` + `{tema}-soluciones.js` + `{tema}-runner.js`.

### Antes de crear: comprobar el nav del header (norma de Pau, 22/08/2026)

`docs/assessment/nav.js` (inyectado en cada página vía `<div id="site-nav"></div>` + `<script src="../../nav.js">`) es la fuente única de qué tracks existen y a qué HTML apunta cada uno. Antes de montar un ejercicio nuevo:

1. **Comprobar si su track ya tiene sección en el nav.** Si SÍ existe (ej. "🌐 DOM" ya apunta a `dia-19-dom.html`) → el ejercicio nuevo NO crea un HTML separado, aunque combine el track con otro tema (ej. DOM + Tailwind sigue siendo el track DOM). Se añade como `.exercise-card` nueva dentro del MISMO HTML que ya representa ese track, colocada PRIMERO — antes de las cards existentes — con su propio título de fecha para separarla del resto (mismo patrón ya usado entre 19/08 y 20/08 en `dia-19-dom.html`).
2. **Si el track es genuinamente nuevo** (ninguna sección del nav lo cubre) → sí se crea el HTML nuevo, pero hay que enlazarlo en `nav.js` (nueva `section(...)` dentro del dropdown que corresponda) en el MISMO paso — sin esto, la página no es alcanzable desde ningún sitio de `assessment/index.html` ni del resto del nav.

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
