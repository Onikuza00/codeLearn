# Design: hook-codelearn-session

## Technical Approach

Hook `command` de `UserPromptSubmit` en `settings.json` de usuario. Recibe el payload JSON completo por stdin (incluye `prompt` y `session_id`), lo parsea con `node -e` (no `jq`, no está instalado en esta máquina — mismo patrón que `git-guard.sh`), y responde con `hookSpecificOutput.additionalContext` cuando corresponde.

## Architecture Decisions

### Decision: qué parte de la petición puede ser un hook puro

Pau pidió tres cosas en una sola instrucción: recuperar contexto de engram, levantar `mkdocs serve`, y (si es sesión nueva) crear el registro diario + nav. No las tres son mecanizables de la misma forma.

| Parte pedida | Viable como hook puro | Por qué |
|---|---|---|
| Levantar `mkdocs serve` si no corre | **Sí** | Shell puro: comprobar puerto 8000 con `curl`, lanzar el proceso si hace falta |
| Detectar si es sesión nueva | **Sí** | El hook recibe `session_id` en el payload; comparar contra un fichero-marca es shell puro |
| Recuperar contexto de engram (`mem_context`) | **No** | Es una tool MCP — solo el agente puede invocarla, un script de shell no tiene ese acceso |
| Generar el registro diario y decidir `semana-N`/carpeta | **No** | Requiere criterio (qué pasó hoy, convenciones de `GOTCHAS.md`) |
| Editar la nav de `mkdocs.yml` con el registro nuevo | **No** | Edición de YAML con criterio, no una plantilla fija |

**Decisión**: el hook ejecuta directamente las dos partes mecánicas y, para las tres que requieren criterio, inyecta una instrucción explícita (`additionalContext`) para que el agente las resuelva en su respuesta, en vez de intentar generarlas él mismo a ciegas.

**Rationale**: un hook que generase el `.md` del día o tocase el `mkdocs.yml` sin pasar por el agente produciría contenido sin criterio (fecha mal calculada, semana equivocada, plantilla vacía) — el mismo tipo de resultado que se busca evitar en todo el proyecto ("vib coding invisible"). `additionalContext` no es ejecución forzada — es una nota en el contexto del modelo, con alta probabilidad de seguimiento pero sin garantía de código, a diferencia de un `PreToolUse` que sí puede bloquear.

### Decision: parseo de JSON — `node` vs `jq`

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `jq` | Sintaxis más corta, estándar para hooks de shell | Rechazado — no está instalado en esta máquina |
| `node -e` | Ya disponible, mismo patrón que `git-guard.sh` (hook existente) | **Elegido** — consistencia con el hook ya presente en el proyecto |

### Decision: cómo detectar "sesión nueva"

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Fichero-marca con el último `session_id` visto | Simple, no requiere estado externo; falso positivo si se abren dos sesiones el mismo día | **Elegido** |
| Comparar contra la fecha calendario | Evita el falso positivo de dos sesiones el mismo día | Rechazado — el hook no tiene forma fiable de saber si el registro diario ya se creó sin leer el filesystem del proyecto, y eso complicaría el script sin necesidad; se delega esa comprobación final al agente |

## File Changes

| File | Action | Description |
|------|--------|--------------|
| `~/.claude/hooks/codelearn-session.sh` | Create | Script del hook |
| `~/.claude/settings.json` | Modify | Nueva entrada en `hooks.UserPromptSubmit`, añadida sin reemplazar las existentes (`codegraph prompt-hook`, `gentle-ai skill-registry refresh`) |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Filtro de salida | Prompt sin "codeLearn" no produce efectos | Pipe-test con payload sintético, verificar exit 0 sin output |
| Sesión nueva | `session_id` distinto al marcado dispara el `additionalContext` largo | Pipe-test con 2 `session_id` distintos |
| Misma sesión | `session_id` repetido dispara solo el recordatorio corto | Pipe-test con el mismo `session_id` dos veces |
| Validez JSON | `settings.json` sigue siendo válido tras la edición | `node -e 'JSON.parse(...)'` sobre el archivo completo |

Todos los casos se probaron manualmente en la sesión (ver conversación) antes de dar el hook por activo.

## Migration / Rollout

Sin migración. El hook queda activo en cuanto `settings.json` se recarga (automático si el watcher ya vigilaba el archivo desde el inicio de la sesión; si no, requiere abrir `/hooks` una vez). Rollback: revertir la entrada en `settings.json` y borrar el script.
