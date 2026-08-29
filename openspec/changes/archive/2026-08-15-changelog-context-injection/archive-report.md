# Archive Report: changelog-context-injection

**Date:** 2026-08-15
**Verdict:** PASS
**Mode:** cambio de configuración/tooling (proposal + design únicamente)

## Files Changed

| File | Action |
|------|--------|
| `openspec/changes/archive/CHANGELOG.md` | Created |
| `~/.claude/hooks/codelearn-session.sh` | Modified — inyecta el changelog en sesión nueva |
| `RULES.md` | Modified — obligación de actualizar el changelog al archivar |
| `CLAUDE.md` | Modified — misma obligación en la regla de cambios arquitectónicos |
| `docs/ia/claude/03-automatizaciones/01-hook-inicio/index.md` | Modified |
| `docs/ia/claude/03-automatizaciones/02-openspec/index.md` | Modified |

## Archive Contents

- proposal.md ✅
- design.md ✅
- archive-report.md ✅ (este archivo)

## Lessons Learned

1. **"Pleno contexto" no significa "cargar todo"** — un índice barato y siempre presente cubre la mayoría del caso de uso; el detalle completo puede quedar bajo demanda sin perder cobertura real.
2. **Lo mecánico y lo que requiere criterio conviven en el mismo hook** — arrancar mkdocs, comparar `session_id` y hacer `cat` de un archivo son mecánicos; decidir qué escribir en un registro diario o redactar el resumen de un changelog no lo es. La solución no es "todo hook" ni "todo agente", es separar cada pieza según corresponda.
3. **Las reglas de proceso se acumulan** — esta es la tercera regla escrita en `RULES.md`/`CLAUDE.md` en la misma sesión (nav, cambios arquitectónicos, changelog). Vale la pena revisarlas juntas de vez en cuando para que no queden dispersas ni contradictorias.

## Source of Truth Updated

- `openspec/changes/archive/CHANGELOG.md` — nueva fuente de verdad para la evolución del proyecto de un vistazo
- `RULES.md` / `CLAUDE.md` — regla ampliada

## Ciclo completo

Cambio de tipo configuración/tooling, documentado en la misma sesión en la que se implementó y probó.
