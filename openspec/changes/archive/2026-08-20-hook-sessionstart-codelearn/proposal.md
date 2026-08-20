# Proposal: hook-sessionstart-codelearn

## Intent

El hook de arranque de sesión (`hook-codelearn-session`, 15/08/2026) dependía de que el primer prompt de la sesión contuviese literalmente la palabra "codeLearn" — era un hook de `UserPromptSubmit` con filtro por texto, no un hook de "inicio de sesión" real. Pau esperaba que se disparase siempre al empezar a trabajar cada día en el proyecto, y detectó que eso no estaba garantizado si el primer mensaje no mencionaba la palabra clave.

Nota de proceso: cambio de configuración/tooling, se implementa y archiva en la misma sesión — no pasa por el ciclo completo de spec/tasks/verify.

## Scope

### In Scope
- Reemplazar el hook de `UserPromptSubmit` por uno de `SessionStart` (`~/.claude/hooks/codelearn-sessionstart.sh`)
- Ámbito acotado al proyecto vía comparación del `cwd` del payload contra la ruta del proyecto, en vez de buscar una palabra clave en el prompt
- Detección de sesión nueva vs. reanudada vía el campo `source` del propio evento (`startup` vs `resume`/`clear`/`compact`), sin fichero-marca
- Autoarranque de `mkdocs serve` si no está corriendo (puerto 8000) — sin cambios de comportamiento
- Actualizar `docs/ia/claude/03-automatizaciones/01-hook-inicio/index.md` con el nuevo mecanismo

### Out of Scope
- Cambiar el puerto o la ruta hardcodeada del proyecto en el script
- Generar el contenido del registro diario o editar `mkdocs.yml` desde el propio hook (sigue requiriendo criterio del agente)

## Capabilities

### Modified Capabilities
- `tooling-automation`: el hook de arranque de sesión pasa de disparo por palabra clave (`UserPromptSubmit`) a disparo por evento de ciclo de vida (`SessionStart`)

## Approach

Hook `command` de `SessionStart`, ámbito de usuario (`~/.claude/settings.json`). El payload de `SessionStart` no trae `prompt`, pero sí `cwd` y `source` — eso permite acotar el hook al proyecto sin depender de texto, y detectar sesión nueva sin fichero-marca (el hook ya se dispara una única vez por sesión). Ver alternativas evaluadas en `design.md`.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `~/.claude/hooks/codelearn-sessionstart.sh` | New | Script del hook nuevo |
| `~/.claude/hooks/codelearn-session.sh` | Removed | Script del hook viejo (`UserPromptSubmit`), sin código muerto |
| `~/.claude/settings.json` | Modified | `hooks.UserPromptSubmit` pierde la entrada de codeLearn, `hooks.SessionStart` nueva |
| `~/.claude/state/codelearn-last-session` | Removed (no usado) | Ya no hace falta fichero-marca de sesión |
| `docs/ia/claude/03-automatizaciones/01-hook-inicio/index.md` | Modified | Documentación actualizada al nuevo mecanismo |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| El `cwd` que manda Claude Code en Windows puede llegar con `\` o `/`, mayúsculas variables de la unidad | Medium | El script normaliza (minúsculas + `\`→`/` + sin barra final) antes de comparar |
| Puerto/ruta del proyecto siguen hardcodeados en el script | Low | Mismo límite conocido que el hook anterior, documentado |
| El agente ignora la instrucción inyectada (`additionalContext` no es ejecución forzada) | Low | Mismo riesgo aceptado que el hook anterior |

## Rollback Plan

Revertir la entrada de `hooks.SessionStart` en `~/.claude/settings.json`, borrar `~/.claude/hooks/codelearn-sessionstart.sh`. El hook anterior (`codelearn-session.sh` + entrada `UserPromptSubmit`) puede recrearse desde `openspec/changes/archive/2026-08-15-hook-codelearn-session/` si hiciera falta.

## Dependencies

- `node` disponible en el PATH
- `curl` disponible en el PATH

## Success Criteria

- [x] El hook no hace nada si el `cwd` no es codeLearn (probado con payload sintético)
- [x] `mkdocs serve` se autoarranca si el puerto 8000 no responde (comportamiento heredado, sin cambios)
- [x] Distingue `source: startup` (contexto completo) de `resume`/otros (recordatorio corto), probado con payloads sintéticos
- [x] Funciona con rutas Windows de barra invertida (`C:\xampp\htdocs\codeLearn`), probado
- [x] `settings.json` sigue siendo JSON válido tras la edición (validado)
- [x] Documentado en `docs/ia/claude/03-automatizaciones/`
