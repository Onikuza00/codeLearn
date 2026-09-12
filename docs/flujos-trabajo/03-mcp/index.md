# MCP

> Model Context Protocol: el estándar abierto que conecta un agente de IA con herramientas y datos externos — bases de código, memoria, navegadores, APIs. No es un invento de Claude Code, lo usan también Cursor, Codex, Gemini CLI y el resto.

---

## Qué es un MCP

Un servidor MCP expone un conjunto de herramientas (o datos) que el agente puede llamar, con un protocolo común — el agente no necesita saber cómo habla cada herramienta por dentro, solo habla MCP. Cualquier programa serio puede exponer uno: una base de datos, un navegador, un índice de código, un sistema de memoria.

## MCP activos hoy

Verificado con `claude mcp list` — no por memoria ni por lo que aparece instalado en `~/.claude/skills/`, que es un sistema distinto.

| MCP | Para qué sirve | Alcance |
|---|---|---|
| `codegraph` | Grafo de símbolos, llamadas y dependencias del código — para preguntas de arquitectura sin leer todo el repo a mano | Por proyecto — cada worktree necesita su propio `.codegraph/` |
| `engram` | Memoria persistente entre sesiones — ver [Engram](../02-engram/index.md) | Global, detecta el proyecto solo por `cwd` |

!!! note "`claude-in-chrome` no es un MCP que se decida instalar"
    Es un puente nativo de Claude Code hacia el navegador (extensión), no algo que se añada con `claude mcp add` ni que compita por espacio con los MCP de esta lista.

### `codegraph` en detalle

!!! note "Para quién sirve"
    Es una herramienta para EL AGENTE, no para ti directamente — no lo invocas a mano. En vez de leer y grepear archivo por archivo para entender cómo se conecta el código, una sola consulta devuelve el código exacto, los caminos de llamada entre símbolos y qué se rompe si tocas algo. El beneficio te llega indirecto: respuestas de arquitectura más rápidas y fiables.

!!! tip "Cómo se instala — dos capas distintas"
    El binario/servidor en sí se instala una vez, a mano (no automático) — verificar con `codegraph --version`, y si falta, instalarlo desde su repo oficial. El índice de CADA proyecto (`.codegraph/`) sí es automático: en cuanto el binario está disponible y falta el índice, el agente lo crea solo, sin preguntar.

!!! example "Cómo se configura"
    Nada que tocar a mano salvo el registro inicial del servidor MCP (`claude mcp add codegraph -s user -- codegraph serve --mcp`, ya arriba). El índice por proyecto NUNCA se comparte entre worktrees — cada uno necesita el suyo, aunque sea el mismo repo.

!!! danger "Comandos que no se ejecutan por rutina"
    `codegraph uninit`, `install`, `uninstall`, `upgrade` son de ciclo de vida, nunca se lanzan sin que tú lo pidas explícitamente. `codegraph index` solo si el índice se corrompe, no como paso normal.

## Cómo se instala y dónde vive la config

??? example "Verificar y añadir"
    ```powershell
    claude mcp list                                 # ver qué hay activo y si conecta
    claude mcp add codegraph -s user -- codegraph serve --mcp
    claude mcp add engram -s user -- engram mcp --tools=agent
    ```

| Ámbito | Dónde vive |
|---|---|
| Config global de usuario | `~/.claude/mcp/*.json` y el bloque `mcpServers` de `~/.claude.json` |
| Config de un proyecto concreto | `.mcp.json` en la raíz del repo (si existe) |

!!! tip "Verificar antes de instalar"
    `claude mcp list` dice qué hay y si de verdad conecta. No reinstalar lo que ya funciona — solo si el comando de verificación falla o la versión está rota.

## Candidatos a evaluar

Mismo criterio que en [Skills](../01-flujo-global/04-skills/index.md): verificar antes de creer, evitar solapamiento y ruido.

### Context7

!!! danger "Ya se probó y se quitó — no es un candidato nuevo"
    Instalado y eliminado el 29/08/2026: tardaba ~10 s en arrancar en Windows (`npx -y --package=@upstash/context7-mcp`) y ni siquiera llegaba a aparecer conectado en `claude mcp list` — retrasaba el arranque de sesión sin llegar a funcionar.

!!! note "Cuándo sí reconsiderarlo"
    La decisión de entonces dejó la puerta abierta para cuando React arranque en serio — ahí un MCP de documentación actualizada tiene sentido real, porque esa API cambia rápido. Hoy no toca: sigue siendo backend Symfony + vanilla JS.

!!! example "Si se reañade en el futuro"
    ```powershell
    claude mcp add context7 -s user -- npx -y --package=@upstash/context7-mcp -- context7-mcp
    ```
    Probar primero si sigue siendo lento en Windows — el problema puede seguir sin resolver en versiones nuevas del paquete.

### Playwright

!!! note "MCP completo vs. CLI + skill — casos de uso distintos, no una cuestión de rendimiento"
    El MCP de Playwright (mantenido por Microsoft) da interacción visual en vivo — muy parecido a lo que ya hace `claude-in-chrome` en esta misma sesión. Sumar el MCP completo sería duplicar una capacidad que ya tienes.

!!! tip "Dónde sí aporta algo distinto: tests automatizados repetibles"
    Un skill que invoque `npx playwright test` por línea de comandos, sin MCP de por medio, sirve para suites de e2e que se repiten (comprobar que una landing sigue renderizando bien tras un cambio) — devuelve solo texto (pass/fail, diff del error), no capturas en cada paso. Más barato en contexto, y encaja mejor con automatizar landings en serie.

!!! example "Recomendación"
    Descartar el MCP de Playwright — redundante con `claude-in-chrome`. Si hace falta testear en serie, CLI + skill, y solo cuando haya landings reales que lo justifiquen — mismo criterio de repetición que en Skills.

---

## Checklist

- [ ] `claude mcp list` responde y marca ✔ Connected antes de dar un MCP por activo
- [ ] Ningún MCP nuevo se añade sin comprobar antes que no lo cubre ya otro
- [ ] La config no se edita a mano salvo necesidad real — usar `claude mcp add`
