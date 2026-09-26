# Proposal: live-reload-ejercicios

## Intent

Cada cambio en `dia-19-dom-soluciones.js` obligaba a recargar toda la página de ejercicios (perdiendo scroll y cards abiertas) para ver los tests actualizados.

## Scope

### In Scope
- `js/ejercicios/live-reload.js`: consulta el archivo de soluciones cada segundo; si cambia, lo re-evalúa y vuelve a correr los tests sin recargar la página.
- `dia-19-dom-runner.js`: el cuerpo de `DOMContentLoaded` pasa a la función global `ejecutarTodo()`, reutilizable.
- `dia-19-dom.html`: carga `live-reload.js` tras el runner. `assessment/style.css`: estilo del indicador `.live-status`.

### Out of Scope
- Otras páginas de ejercicios (se activa añadiendo el mismo `<script>` si el runner expone `ejecutarTodo()`).

## Approach

- Eval indirecto `(0, eval)(source)`: las `function` quedan globales (`window[ej.fn]` las encuentra) y los `const/let` no chocan con la carga anterior.
- Las soluciones registran listeners en `document`/`window` al ejecutarse; se interceptan `addEventListener` para quitarlos antes de cada re-ejecución (si no, se duplican y los tests fallan por doble toggle).
- Error de sintaxis a mitad de edición: se muestra en el indicador y se conservan las funciones anteriores.
- `mkdocs serve` inyecta su propio live reload (`location.reload()` al guardar cualquier archivo de `docs/`), que anulaba este mecanismo y cerraba las cards. Se neutralizan sus peticiones `/livereload/` desde `live-reload.js`; coste: editar el HTML o el runner exige F5.
