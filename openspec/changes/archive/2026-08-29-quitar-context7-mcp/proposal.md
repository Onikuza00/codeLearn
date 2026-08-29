# Proposal: quitar-context7-mcp

## Intent

El arranque de cada sesión de Claude Code en codeLearn se quedaba minutos en "Cerebrating…" antes de la primera respuesta. Diagnóstico medido:

- Hooks (`SessionStart`, `UserPromptSubmit`, statusline): todos por debajo de 0,4 s — descartados.
- El bloqueo estaba en la inicialización de servidores MCP. `context7` (declarado en `~/.claude/settings.json` → `mcpServers`) se lanza con `npx -y --package=@upstash/context7-mcp@2.2.5`: medido en **~10 s en caliente**, y `npx` en Windows vuelve a resolver el paquete en cada arranque (peor en frío). Además `claude mcp list` no lo mostraba conectado — coste sin servicio.

`context7` sirve documentación actualizada de librerías al vuelo (útil con frameworks que cambian rápido, p. ej. React 19 / Tailwind 4). No se usó en ninguna sesión reciente: el trabajo actual es JS/CSS vanilla, DOM y Symfony por temario cerrado.

## Scope

### In Scope
- `~/.claude/settings.json`: eliminar la clave `mcpServers` completa (solo contenía `context7`)
- Persistencia en openspec (este cambio)

### Out of Scope
- `codegraph` y `engram` (definidos en `~/.claude.json`, no tocados — siguen conectados)
- El conector integrado `claude-in-chrome` — siguiente sospechoso si la lentitud persiste, se trata aparte
- Cualquier hook del proyecto — verificados y correctos

## Approach

Quitar el único servidor MCP no usado y de arranque caro. Es config de entorno global de Claude Code, no del repo, pero se registra aquí porque afecta al flujo de trabajo diario en codeLearn. Si en el futuro se arranca React en serio, se vuelve a añadir con `claude mcp add context7 -s user -- npx -y --package=@upstash/context7-mcp -- context7-mcp`.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `~/.claude/settings.json` | Modified | Clave `mcpServers` (con `context7`) eliminada |

## Rollback Plan

Volver a añadir el bloque `mcpServers.context7` en `~/.claude/settings.json`, o `claude mcp add`.

## Success Criteria

- [x] `settings.json` sigue siendo JSON válido
- [x] `claude mcp list` muestra `codegraph` y `engram` conectados, sin `context7`
- [ ] El próximo arranque de sesión llega a la primera respuesta sin la espera de minutos (a confirmar por Pau)
