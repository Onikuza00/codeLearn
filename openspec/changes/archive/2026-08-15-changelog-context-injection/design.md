# Design: changelog-context-injection

## Technical Approach

Ampliación del hook existente `codelearn-session.sh`, no un mecanismo nuevo. Se añade una lectura de archivo (`cat`) antes de construir el `additionalContext`, y se concatena su contenido solo en la rama de "sesión nueva".

## Architecture Decisions

### Decision: índice corto vs. historial completo en cada sesión

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Inyectar el contenido íntegro de cada `proposal.md`/`design.md` archivado | Contexto realmente completo, pero crece sin límite y se vuelve caro en pocos meses | Rechazado |
| Índice de una línea por cambio (`CHANGELOG.md`) | Barato, cargable siempre; el detalle completo queda a un `Read` de distancia si hace falta | **Elegido** |
| No inyectar nada, confiar en que se lea `openspec/` bajo demanda | Es lo que había antes — mismo problema que motivó esta conversación | Rechazado |

**Rationale**: Pau pidió "pleno contexto de todos los cambios y evolución" en cada sesión. Un índice resuelve el 90% del caso de uso (saber qué cambió y cuándo, de un vistazo) sin el costo de cargar todo el detalle. El 10% restante (el porqué completo de un cambio puntual) sigue disponible, solo que bajo demanda — coherente con cómo ya funciona `mem_context` de engram (resumen reciente, no el histórico completo).

### Decision: quién actualiza el changelog

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Automático — `sdd-archive` o un hook lo actualiza solo al archivar | Más robusto, pero "detectar que se archivó un cambio" y redactar el resumen de una línea requiere criterio (igual que decidir contenido de un registro diario) | Rechazado por ahora |
| Regla escrita — se añade a mano en el mismo paso de archivar | Depende de seguir la instrucción, no está forzado por código | **Elegido** — mismo patrón que la regla de nav en `mkdocs.yml`, ya probada en el proyecto |

**Rationale**: redactar el resumen de una línea de "qué cambió y por qué" es exactamente el tipo de tarea que no se puede mecanizar a ciegas (visto ya con el hook original: generar contenido sin criterio es peor que no generarlo). Se deja como regla escrita, no como automatización de código.

## File Changes

| File | Action | Description |
|------|--------|--------------|
| `openspec/changes/archive/CHANGELOG.md` | Create | Índice, con las 2 entradas previas más esta misma |
| `~/.claude/hooks/codelearn-session.sh` | Modify | Nuevas líneas: lectura de `CHANGELOG_FILE` y concatenación en `CTX` de la rama "sesión nueva" |
| `RULES.md` | Modify | Fila de "cambio arquitectónico" ampliada con la obligación de actualizar el changelog |
| `CLAUDE.md` | Modify | Misma obligación añadida a la sección de regla de cambios arquitectónicos |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Inyección en sesión nueva | El `additionalContext` incluye el changelog completo | Pipe-test con `session_id` nuevo, extraer y comparar contra el contenido real de `CHANGELOG.md` |
| No repetición en misma sesión | El `additionalContext` NO incluye el changelog | Pipe-test con el mismo `session_id` dos veces |
| Robustez si falta el archivo | El hook no rompe si `CHANGELOG.md` no existe | `CHANGELOG_CONTENT=""` por defecto, guard `[ -f ... ] &&` |

## Migration / Rollout

Sin migración. Activo en cuanto se guarda el script (ya recargado por el watcher de `settings.json`, sin cambios en `settings.json` en este caso — la ruta del hook no cambió). Rollback: revertir el diff del script y borrar `CHANGELOG.md`.
