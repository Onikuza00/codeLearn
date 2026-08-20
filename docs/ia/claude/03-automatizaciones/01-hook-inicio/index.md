# Hook de inicio { .bloque-ia }

> Guía de uso del hook que se dispara al iniciar sesión en codeLearn: qué hace, cómo se dispara y dónde está su configuración. No es teoría — es la referencia para saber qué pasa solo y qué hay que seguir pidiendo a mano.

---

## Qué hace

Al **iniciar cualquier sesión** de Claude Code con directorio de trabajo `codeLearn`:

1. **Levanta `mkdocs serve`** si no está corriendo ya en `http://127.0.0.1:8000`.
2. Si la sesión es **nueva de verdad** (`source: startup`, no una reanudación), le indica a Claude que:
   - recupere el último contexto guardado en engram para el proyecto `codelearn`,
   - compruebe si ya existe el registro diario de hoy en `docs/waytoCode/` y, si no, lo cree y lo añada a la nav de `mkdocs.yml` en el mismo paso,
   - y le adjunta el contenido completo de `openspec/changes/archive/CHANGELOG.md` — el historial de toda la evolución del proyecto, de un vistazo, sin que Claude tenga que ir a buscarlo.
3. Si la sesión se **reanuda** (`resume`/`clear`/`compact`), solo recuerda a Claude que recupere contexto de engram si hace falta retomar algo — el changelog ya se inyectó al arrancar de verdad, no hace falta repetirlo.

## Cómo se dispara

Es un hook de `SessionStart`: corre **una sola vez, al arrancar la sesión**, sin depender de lo que se escriba en el primer prompt. Está acotado al proyecto codeLearn comparando el `cwd` que manda Claude Code contra la ruta del proyecto — en el resto de proyectos no hace nada (`exit 0` inmediato).

## Dónde está configurado

| Qué | Ruta |
|---|---|
| Script del hook | `~/.claude/hooks/codelearn-sessionstart.sh` |
| Registro en settings | `~/.claude/settings.json` → `hooks.SessionStart` |
| Historial que se inyecta en sesión nueva | `openspec/changes/archive/CHANGELOG.md` (dentro del propio proyecto) |

## El código

```bash title="~/.claude/hooks/codelearn-sessionstart.sh"
#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"                                              # (1)

is_codelearn="$(node -e '
  const d = JSON.parse(require("fs").readFileSync(0, "utf8"));
  const norm = s => (s || "").toLowerCase().replace(/\\/g, "/").replace(/\/+$/, "");
  const cwd = norm(d.cwd);
  const project = "c:/xampp/htdocs/codelearn";
  process.stdout.write(cwd === project || cwd.startsWith(project + "/") ? "1" : "0");
' <<< "$payload")"

[ "$is_codelearn" = "1" ] || exit 0                            # (2)

source_type="$(node -e '
  const d = JSON.parse(require("fs").readFileSync(0, "utf8"));
  process.stdout.write(d.source ?? "");
' <<< "$payload")"

PROJECT_DIR="/c/xampp/htdocs/codeLearn"

if ! curl -s -o /dev/null -m 1 "http://127.0.0.1:8000"; then   # (3)
  ( cd "$PROJECT_DIR" && nohup mkdocs serve > /tmp/mkdocs_codelearn.log 2>&1 & disown )
fi

CHANGELOG_FILE="$PROJECT_DIR/openspec/changes/archive/CHANGELOG.md"  # (4)
CHANGELOG_CONTENT=""
[ -f "$CHANGELOG_FILE" ] && CHANGELOG_CONTENT="$(cat "$CHANGELOG_FILE")"

if [ "$source_type" = "startup" ]; then                        # (5)
  CTX="... recuperar engram + crear registro diario + nav ...

--- Full project evolution log ---
${CHANGELOG_CONTENT}"
else
  CTX="... recuperar engram si hace falta ..."
fi

node -e '                                                       # (6)
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: process.argv[1]
    }
  }));
' "$CTX"
```

1. **Lee el payload.** Claude Code manda un JSON por stdin con `cwd`, `session_id` y `source`, entre otros campos. Se usa `node` para parsearlo (no `jq`, no está instalado en esta máquina) — mismo patrón que ya usa `git-guard.sh`.
2. **Filtro de ámbito.** Normaliza el `cwd` (minúsculas, `\` → `/`, sin barra final) y lo compara contra la ruta del proyecto. Si no coincide, el script corta ahí (`exit 0`) — así puede quedar activo en `settings.json` de usuario sin afectar a otros proyectos.
3. **Arranca mkdocs si hace falta.** `curl` comprueba si el puerto 8000 ya responde; si no, lanza `mkdocs serve` en background (`nohup ... & disown` para que sobreviva al cierre del hook).
4. **Lee el changelog completo.** `cat` sobre `CHANGELOG.md` — es texto plano, sin ningún criterio de por medio, por eso sí puede hacerlo el propio hook.
5. **Distingue sesión nueva de reanudada** vía el campo `source` que manda el propio evento `SessionStart` (`startup` vs `resume`/`clear`/`compact`) — ya no hace falta un fichero-marca con el `session_id`, el hook solo se dispara una vez por sesión de por sí.
6. **Devuelve el resultado como JSON.** `hookSpecificOutput.additionalContext` es el campo que Claude Code inyecta en el contexto del modelo antes de procesar el turno — es lo único que puede "decirle" algo a Claude, el script no ejecuta la parte de recuperar engram ni de escribir el registro diario.

## Cómo comprobar que funcionó

- Si mkdocs no arrancó: revisar `/tmp/mkdocs_codelearn.log` y comprobar que el puerto 8000 esté libre.
- Si el hook no parece dispararse: abrir `/hooks` una vez para forzar la recarga de `settings.json`.

!!! tip "Solo avisa, no ejecuta la parte de criterio"
    El hook nunca llama él mismo a engram ni escribe el `.md` del día — eso lo sigue haciendo Claude, en la respuesta, aplicando las convenciones de `GOTCHAS.md`/`CLAUDE.md`. El hook garantiza que esa comprobación pase siempre, sin depender de que te acuerdes de pedirla.

!!! note "Límites conocidos"
    - Puerto (8000) y ruta del proyecto están fijos en el script — si `codeLearn` cambia de puerto o de carpeta, hay que editar el hook a mano.
    - Antes de crear el registro diario, Claude debe comprobar si el `.md` de hoy ya existe — el hook no lo comprueba, solo avisa.
    - El changelog se inyecta entero: es texto barato hoy (pocas líneas), pero si algún día crece mucho, convendría recortarlo a las últimas N entradas en vez de mandarlo completo.
