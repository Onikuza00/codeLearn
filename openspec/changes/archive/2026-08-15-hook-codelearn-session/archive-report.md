# Archive Report: hook-codelearn-session

**Date:** 2026-08-15
**Verdict:** PASS
**Mode:** cambio de configuración/tooling (proposal + design únicamente, sin ciclo completo de spec/tasks/verify)

## Files Changed

| File | Action |
|------|--------|
| `~/.claude/hooks/codelearn-session.sh` | Created |
| `~/.claude/settings.json` | Modified — nueva entrada en `hooks.UserPromptSubmit` |
| `RULES.md` | Modified — fila ampliada en "Reglas de guardado" para cambios arquitectónicos/de configuración |
| `CLAUDE.md` | Modified — nueva sección "Regla de cambios arquitectónicos y de configuración (obligatoria)" |
| `docs/ia/claude/03-automatizaciones/` | Created — documentación de uso |

## Archive Contents

- proposal.md ✅
- design.md ✅
- archive-report.md ✅ (este archivo)

## Lessons Learned

1. **Un hook no reemplaza el criterio del agente** — solo puede ejecutar lo mecánico (arrancar un proceso, comparar un `session_id`) e inyectar una instrucción para lo que requiere juicio. `additionalContext` es una nota en el contexto, no una ejecución garantizada.
2. **`jq` no está instalado en esta máquina** — usar `node -e` para parsear/emitir JSON en hooks de shell, siguiendo el patrón ya establecido por `git-guard.sh`.
3. **Las reglas de proceso deben quedar escritas, no solo en engram** — este mismo cambio nació de detectar que convenciones de documentación ya decididas (`pattern` en engram) nunca se habían promovido a `RULES.md`. Ver la nueva fila de la tabla "Reglas de guardado" y la sección nueva en `CLAUDE.md`.

## Source of Truth Updated

- `RULES.md` — tabla "Reglas de guardado" ampliada
- `CLAUDE.md` — nueva regla obligatoria de registro en openspec para cambios arquitectónicos/de configuración

## Ciclo completo

Cambio de tipo configuración/tooling, documentado retroactivamente en la misma sesión en la que se implementó y probó — no requiere fases de spec/tasks/verify separadas.
