# Proposal: cuadricula-totales-sin-fallos

## Intent

El formato vigente para "ejercicios sin fallos" en el daily log era una tabla de 2 columnas con una fila por ejercicio (`Ejercicio | Resultado`). Pau pidió explícitamente reemplazarlo por una cuadrícula de totales (cuántos salieron bien, cuántos con fallos), sin listar cada ejercicio sin fallos por su nombre — esa información ya vive en la propia página de ejercicios (`conceptos-basicos.html` y equivalentes), donde cada uno tiene su badge de estado. El daily log no necesita repetirla ejercicio por ejercicio.

## Scope

### In Scope
- `rules/ejercicios-resultados.md`: regla de "Ejercicios SIN fallos" reescrita — cuadrícula de totales en vez de tabla por ejercicio
- `docs/waytoCode/2026/08/semana-2/2026-08-16.md`: registro de hoy actualizado al nuevo formato

### Out of Scope
- Cambiar el formato de "ejercicios CON fallos" (sección completa con código) — no se tocó, sigue igual
- Retrocompletar daily logs anteriores al nuevo formato — quedan como estaban, el cambio aplica desde hoy en adelante

## Approach

Tabla Markdown de 2 celdas con los totales (`✅ Sin fallos` / `❌ Con fallos`), sin fila por ejercicio. Decisión directa de Pau, sin alternativas evaluadas — no aplica `design.md`.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `rules/ejercicios-resultados.md` | Modified | Regla de sin-fallos reescrita a cuadrícula de totales |
| `docs/waytoCode/2026/08/semana-2/2026-08-16.md` | Modified | Tabla de 8 ejercicios reemplazada por el total (8 sin fallos / 4 con fallos) |

## Rollback Plan

Revertir la fila de la regla en `rules/ejercicios-resultados.md` a la tabla por ejercicio; no afecta a nada fuera de la documentación de convención.

## Success Criteria

- [x] `rules/ejercicios-resultados.md` refleja la cuadrícula de totales como formato vigente
- [x] Daily log de hoy (16/08) usa el nuevo formato
