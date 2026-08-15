# Hook de inicio { .bloque-ia }

> Guía de uso del hook que se dispara al escribir "codeLearn": qué hace, cómo se dispara y dónde está su configuración. No es teoría — es la referencia para saber qué pasa solo y qué hay que seguir pidiendo a mano.

---

## Qué hace

Al escribir **"codeLearn"** (sin distinguir mayúsculas) en cualquier prompt:

1. **Levanta `mkdocs serve`** si no está corriendo ya en `http://127.0.0.1:8000`.
2. Si es la **primera vez** que se ve esta sesión, le indica a Claude que:
   - recupere el último contexto guardado en engram para el proyecto `codelearn`,
   - compruebe si ya existe el registro diario de hoy en `docs/waytoCode/` y, si no, lo cree y lo añada a la nav de `mkdocs.yml` en el mismo paso,
   - y le adjunta el contenido completo de `openspec/changes/archive/CHANGELOG.md` — el historial de toda la evolución del proyecto, de un vistazo, sin que Claude tenga que ir a buscarlo.
3. Si ya es la misma sesión de antes, solo recuerda a Claude que recupere contexto de engram si hace falta retomar algo (el changelog ya se inyectó al principio de la sesión, no hace falta repetirlo).

## Cómo se dispara

Es un hook de `UserPromptSubmit`: corre en cada mensaje que envías, pero **no hace nada** si el texto no contiene "codeLearn" — en el resto de proyectos o conversaciones no interfiere.

La detección de "sesión nueva" es por `session_id`, no por día calendario: si abrís dos sesiones distintas el mismo día, la segunda también dispara el paso 2.

## Dónde está configurado

| Qué | Ruta |
|---|---|
| Script del hook | `~/.claude/hooks/codelearn-session.sh` |
| Registro en settings | `~/.claude/settings.json` → `hooks.UserPromptSubmit` |
| Marca de última sesión vista | `~/.claude/state/codelearn-last-session` |
| Historial que se inyecta en sesión nueva | `openspec/changes/archive/CHANGELOG.md` (dentro del propio proyecto) |

## El código

```bash title="~/.claude/hooks/codelearn-session.sh"
#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"                                            # (1)
prompt="$(node -e '
  const d = JSON.parse(require("fs").readFileSync(0, "utf8"));
  process.stdout.write(d.prompt ?? "");
' <<< "$payload")"
session_id="$(node -e '
  const d = JSON.parse(require("fs").readFileSync(0, "utf8"));
  process.stdout.write(d.session_id ?? "");
' <<< "$payload")"

echo "$prompt" | grep -qi 'codelearn' || exit 0            # (2)

PROJECT_DIR="/c/xampp/htdocs/codeLearn"

if ! curl -s -o /dev/null -m 1 "http://127.0.0.1:8000"; then  # (3)
  ( cd "$PROJECT_DIR" && nohup mkdocs serve > /tmp/mkdocs_codelearn.log 2>&1 & disown )
fi

MARKER="$HOME/.claude/state/codelearn-last-session"          # (4)
mkdir -p "$(dirname "$MARKER")"
LAST_SESSION=""
[ -f "$MARKER" ] && LAST_SESSION="$(cat "$MARKER")"

CHANGELOG_FILE="$PROJECT_DIR/openspec/changes/archive/CHANGELOG.md"  # (5)
CHANGELOG_CONTENT=""
[ -f "$CHANGELOG_FILE" ] && CHANGELOG_CONTENT="$(cat "$CHANGELOG_FILE")"

if [ "$LAST_SESSION" != "$session_id" ]; then                # (6)
  printf '%s' "$session_id" > "$MARKER"
  CTX="... recuperar engram + crear registro diario + nav ...

--- Full project evolution log ---
${CHANGELOG_CONTENT}"
else
  CTX='... recuperar engram si hace falta ...'
fi

node -e '                                                     # (7)
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: process.argv[1]
    }
  }));
' "$CTX"
```

1. **Lee el payload.** Claude Code manda un JSON por stdin con `prompt` y `session_id`, entre otros campos. Se usa `node` para parsearlo (no `jq`, no está instalado en esta máquina) — mismo patrón que ya usa `git-guard.sh`.
2. **Filtro de salida temprana.** Si el prompt no contiene "codeLearn", el script corta ahí (`exit 0`) y no toca nada más — así se puede dejar activo en `settings.json` de usuario sin que afecte a otros proyectos.
3. **Arranca mkdocs si hace falta.** `curl` comprueba si el puerto 8000 ya responde; si no, lanza `mkdocs serve` en background (`nohup ... & disown` para que sobreviva al cierre del hook).
4. **Lee la marca de la última sesión vista**, si existe.
5. **Lee el changelog completo.** `cat` sobre `CHANGELOG.md` — es texto plano, sin ningún criterio de por medio, por eso sí puede hacerlo el propio hook (a diferencia de decidir qué escribir en un registro diario nuevo).
6. **Compara `session_id` contra la marca.** Si es distinto (sesión nueva), la actualiza, prepara el mensaje completo (engram + registro diario + nav) y le pega debajo el changelog entero. Si es el mismo, prepara solo el recordatorio corto de engram — el changelog ya se mandó al principio de la sesión.
7. **Devuelve el resultado como JSON.** `hookSpecificOutput.additionalContext` es el campo que Claude Code inyecta en el contexto del modelo antes de procesar el prompt — es lo único que puede "decirle" algo a Claude, el script no ejecuta la parte de recuperar engram ni de escribir el registro diario.

## Cómo comprobar que funcionó

- Si mkdocs no arrancó: revisar `/tmp/mkdocs_codelearn.log` y comprobar que el puerto 8000 esté libre.
- Si el hook no parece dispararse: abrir `/hooks` una vez para forzar la recarga de `settings.json`.

!!! tip "Solo avisa, no ejecuta la parte de criterio"
    El hook nunca llama él mismo a engram ni escribe el `.md` del día — eso lo sigue haciendo Claude, en la respuesta, aplicando las convenciones de `GOTCHAS.md`/`CLAUDE.md`. El hook garantiza que esa comprobación pase siempre, sin depender de que te acuerdes de pedirla.

!!! note "Límites conocidos"
    - Puerto (8000) y ruta del proyecto están fijos en el script — si `codeLearn` cambia de puerto o de carpeta, hay que editar el hook a mano.
    - Antes de crear el registro diario, Claude debe comprobar si el `.md` de hoy ya existe — el hook no lo comprueba, solo avisa.
    - El changelog se inyecta entero: es texto barato hoy (pocas líneas), pero si algún día crece mucho, convendría recortarlo a las últimas N entradas en vez de mandarlo completo.
