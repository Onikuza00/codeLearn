# Design: hook-sessionstart-codelearn

## Technical Approach

Mismo patrón de parseo que el hook anterior (`node -e` sobre stdin, sin `jq`). La diferencia es el evento (`SessionStart` en vez de `UserPromptSubmit`) y las dos señales que ese evento aporta y que sustituyen a las que usaba el hook viejo: `cwd` reemplaza el filtro por palabra clave, `source` reemplaza el fichero-marca de sesión.

## Architecture Decisions

### Decision: mantener el hook de `UserPromptSubmit` como fallback, o reemplazarlo entero

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Mantener ambos (keyword + `SessionStart`) | Cubre el caso raro de mencionar "codeLearn" trabajando desde otro `cwd` | Rechazado — nadie pidió ese caso, y mantenerlo duplicaría el arranque de `mkdocs` y la inyección de contexto en la misma sesión, generando ruido |
| Reemplazar entero por `SessionStart` | Un solo punto de disparo, sin duplicación | **Elegido** — resuelve exactamente el problema reportado (el hook no se disparaba de forma fiable al empezar el día) sin añadir superficie extra |

### Decision: cómo acotar el hook al proyecto sin `prompt`

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Sin filtro, correr siempre | Simple, pero un hook global de usuario tocaría cualquier proyecto que Pau abra | Rechazado |
| Comparar `cwd` del payload contra la ruta de codeLearn | El evento `SessionStart` sí trae `cwd`; requiere normalizar mayúsculas/separadores de Windows | **Elegido** |

### Decision: detección de sesión nueva

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Fichero-marca con `session_id` (heredado del hook anterior) | Ya no aporta nada — `SessionStart` se dispara exactamente una vez por sesión, el fichero sería redundante | Rechazado |
| Campo `source` del propio evento (`startup` vs `resume`/`clear`/`compact`) | Nativo del evento, sin estado en disco que mantener | **Elegido** |

## File Changes

| File | Action | Description |
|------|--------|--------------|
| `~/.claude/hooks/codelearn-sessionstart.sh` | Create | Script del hook nuevo |
| `~/.claude/hooks/codelearn-session.sh` | Delete | Hook viejo, ya sin entrada en `settings.json` |
| `~/.claude/settings.json` | Modify | `hooks.SessionStart` nuevo, entrada de codeLearn eliminada de `hooks.UserPromptSubmit` |
| `docs/ia/claude/03-automatizaciones/01-hook-inicio/index.md` | Modify | Documentación actualizada |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Filtro de ámbito | `cwd` fuera de codeLearn no produce efectos | Pipe-test con payload sintético (`cwd` de otro proyecto), verificar exit 0 sin output |
| Normalización de rutas Windows | `cwd` con `\` (formato real de Windows) matchea igual que con `/` | Pipe-test con `cwd` en ambos formatos |
| Sesión nueva vs reanudada | `source: startup` dispara el contexto largo (con changelog); `resume` dispara solo el recordatorio corto | Pipe-test con ambos valores de `source` |
| Validez JSON | `settings.json` sigue siendo válido tras la edición | `node -e 'JSON.parse(...)'` sobre el archivo completo |

Todos los casos se probaron manualmente en la sesión (ver conversación) antes de dar el hook por activo.

## Migration / Rollout

Sin migración de datos. El hook queda activo en cuanto `settings.json` se recarga (requiere abrir `/hooks` una vez o reiniciar la sesión, ya que el watcher de configuración no vigila cambios hechos fuera de una sesión activa con el archivo ya cargado). Rollback: ver `proposal.md`.
