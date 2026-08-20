# Proposal: hook-codelearn-session

## Intent

Pau tenía que pedir explícitamente en cada sesión que se recuperase el contexto de engram del proyecto codeLearn ("recupera contexto de codeLearn"). La regla existente ("recuperar contexto cuando se detecta referencia a trabajo pasado") depende del criterio del modelo en ese turno concreto — en la misma sesión donde se detectó el problema, un primer mensaje ambiguo no disparó la recuperación de contexto y hubo que pedirla aparte. Se decidió automatizar la parte mecánica (arrancar `mkdocs serve`, detectar sesión nueva) y garantizar que la parte que requiere criterio (recuperar engram, crear el registro diario) se le recuerde siempre a Claude, sin depender de que se pida cada vez.

Nota de proceso: este cambio se implementó y archivó retroactivamente en la misma sesión — es de tipo "cambio de configuración/tooling", no una feature planificada, así que no pasa por el ciclo completo de spec/tasks/verify.

## Scope

### In Scope
- Hook de `UserPromptSubmit` (`~/.claude/hooks/codelearn-session.sh`) que dispara al detectar "codeLearn" en el prompt
- Autoarranque de `mkdocs serve` si no está corriendo (puerto 8000)
- Detección de sesión nueva vía `session_id` y fichero-marca
- Inyección de instrucción (`additionalContext`) para que Claude recupere contexto de engram y, si es sesión nueva, cree el registro diario + nav

### Out of Scope
- Generar el contenido del registro diario o editar `mkdocs.yml` desde el propio hook (requiere criterio, no es mecanizable)
- Llamar a la tool MCP `mem_context` directamente desde el script (los hooks de tipo `command` no tienen acceso a tools MCP)

## Capabilities

### New Capabilities
- `tooling-automation`: hooks de Claude Code que automatizan pasos repetitivos del arranque de sesión en codeLearn

### Modified Capabilities
- None

## Approach

Hook `command` de `UserPromptSubmit`, ámbito de usuario (`~/.claude/settings.json`), que corta inmediatamente (`exit 0`) si el prompt no contiene "codeLearn". Usa `node` para parsear/emitir JSON (no hay `jq` instalado en la máquina), siguiendo el mismo patrón que el hook existente `git-guard.sh`. Ver detalle completo en `design.md`.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `~/.claude/hooks/codelearn-session.sh` | New | Script del hook |
| `~/.claude/settings.json` | Modified | Nueva entrada en `hooks.UserPromptSubmit` |
| `~/.claude/state/codelearn-last-session` | New | Fichero-marca de la última sesión vista (generado en runtime) |
| `docs/ia/claude/03-automatizaciones/` | New | Documentación de uso para Pau |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Puerto/ruta del proyecto hardcodeados en el script | Low | Documentado como límite conocido; editar el script a mano si cambia |
| El agente ignora la instrucción inyectada (`additionalContext` no es ejecución forzada) | Low | Es texto explícito en el contexto del turno, alta probabilidad de seguimiento; no sustituye una barrera de código |
| Detección de "sesión nueva" por `session_id`, no por día calendario — dos sesiones el mismo día disparan dos veces la instrucción de crear el registro diario | Medium | Claude debe comprobar si el `.md` de hoy ya existe antes de crearlo, no crearlo a ciegas |

## Rollback Plan

Eliminar la entrada de `hooks.UserPromptSubmit` en `~/.claude/settings.json` y borrar `~/.claude/hooks/codelearn-session.sh`. No afecta a ningún otro proyecto ni funcionalidad — es aditivo y con salida temprana si no matchea "codeLearn".

## Dependencies

- `node` disponible en el PATH (ya lo usa `git-guard.sh`)
- `curl` disponible en el PATH

## Success Criteria

- [x] El hook no hace nada si el prompt no contiene "codeLearn" (probado)
- [x] `mkdocs serve` se autoarranca si el puerto 8000 no responde (probado)
- [x] Detecta sesión nueva vs. misma sesión vía `session_id` (probado con 3 casos)
- [x] `settings.json` sigue siendo JSON válido tras la edición (validado)
- [x] Documentado en `docs/ia/claude/03-automatizaciones/`
