# Proposal: planes-a-waytoCode

## Intent

El nav tenía un bloque `🗺️ Planes` separado de `🗺️ Way to Code`, con dos páginas: el roadmap mensual (`planning/index.md`) y una página "Próxima Sesión" (`planning/aprendizaje.md`) que llevaba desde ~27/07 sin actualizarse — quedó completamente desactualizada (carencias, pendientes y hasta el día de la semana referenciados eran de hace tres semanas). Pau pidió (1) fusionar Planes dentro de Way to Code, ya que son la misma línea temporal de trabajo, y (2) convertir la página "Próxima sesión" en una disciplina activa: se sobreescribe al final de CADA sesión con el plan de la siguiente y los fallos más relevantes a vigilar — no un documento que se escribe una vez y se abandona.

Nota de proceso: cambio de configuración/estructura del propio proyecto, se implementa y archiva en la misma sesión — no pasa por el ciclo completo de spec/tasks/verify.

## Scope

### In Scope
- Eliminar el bloque `🗺️ Planes` del nav (`mkdocs.yml`)
- Mover `planning/index.md` → `waytoCode/plan.md` (contenido sin cambios, solo ubicación)
- Reescribir `planning/aprendizaje.md` (stale, ~27/07) → `waytoCode/proxima-sesion.md`, con el plan real vigente (sábado 22/08) y los fallos recientes relevantes (Fallos 37-40 de `GOTCHAS.md`)
- Nueva entrada en el nav bajo `🗺️ Way to Code`: `📋 Plan de aprendizaje` y `🎯 Próxima sesión`
- Establecer como práctica recurrente: actualizar `waytoCode/proxima-sesion.md` al final de cada sesión con el plan de la siguiente y los fallos a tener en cuenta

### Out of Scope
- Cambiar el contenido del roadmap mensual en sí (solo se movió de ubicación)
- Automatizar la actualización de `proxima-sesion.md` vía hook — requiere criterio (qué está pendiente, qué fallos priorizar), igual que la creación del registro diario

## Capabilities

### Modified Capabilities
- `tooling-automation`: la disciplina de "página que se sobreescribe con el estado vigente" ya existía para `waytoCode/ejercicio.md` (ejercicio activo) — se extiende el mismo patrón a la planificación de sesión

## Approach

Movimiento de archivos + reescritura de contenido, sin lógica nueva. La práctica de "actualizar al final de cada sesión" no es automatizable por hook (requiere criterio sobre qué priorizar) — queda como convención del agente, reforzada en memoria persistente.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `docs/planning/` | Removed | Carpeta eliminada tras mover su contenido |
| `docs/waytoCode/plan.md` | New | Roadmap mensual, movido sin cambios de contenido |
| `docs/waytoCode/proxima-sesion.md` | New | Reemplaza a `planning/aprendizaje.md`, contenido reescrito y vigente |
| `mkdocs.yml` | Modified | Bloque `Planes` eliminado; dos entradas nuevas bajo `Way to Code` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Que `proxima-sesion.md` vuelva a quedar stale si no se actualiza cada sesión | Medium | Reforzado en memoria persistente (`feedback`) para que el agente lo recuerde sin que Pau tenga que pedirlo |

## Rollback Plan

Recrear `docs/planning/index.md` y `docs/planning/aprendizaje.md` desde este commit, restaurar el bloque `Planes` en `mkdocs.yml`, eliminar los dos archivos nuevos de `waytoCode/`.

## Success Criteria

- [x] `mkdocs build --strict` no introduce warnings nuevos (verificado, mismos 4 preexistentes de `sdd/index.md`)
- [x] Contenido del roadmap preservado íntegro en la nueva ubicación
- [x] `proxima-sesion.md` reescrito con el plan real vigente, no el stale de 27/07
- [x] Nav actualizado y navegable
