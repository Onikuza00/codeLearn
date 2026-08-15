# Normas de documentación automáticas { .bloque-ia }

> Guía de uso del hook que inyecta las normas correctas según qué archivo de `docs/` estás tocando. No es teoría — es la referencia de qué pasa solo y dónde viven esas normas.

---

## Qué hace

Al escribir o editar cualquier archivo con `Write`/`Edit`:

1. Si la ruta no está bajo `docs/` del proyecto codeLearn, no hace nada.
2. Si sí lo está, decide **qué archivo de normas corresponde** según la ruta tocada y lo inyecta completo en el contexto justo después de la escritura — así las normas quedan frescas para autorrevisar en el mismo turno.

## Cómo decide qué normas aplican

| Archivo tocado | Normas que se inyectan |
|---|---|
| `docs/waytoCode/**/*.md` | `rules/ejercicios-resultados.md` — cómo documentar el resultado del día |
| `docs/assessment/js/ejercicios/**/*.{html,js}` | `rules/ejercicios-estructura.md` — cómo montar un ejercicio nuevo |
| Cualquier otro `docs/**/*.md` | `rules/documentacion.md` — cómo documentar teoría |
| Cualquier otra cosa (código, config, otro proyecto) | Nada |

!!! note "Los archivos `rules/*.md` no forman parte del sitio de docs"
    Viven en la raíz del proyecto, fuera de `docs/` — por eso no son enlaces clicables aquí, se abren directamente en el editor.

## Dónde está configurado

| Qué | Ruta |
|---|---|
| Script del hook | `~/.claude/hooks/codelearn-docs-norms.sh` |
| Registro en settings | `~/.claude/settings.json` → `hooks.PostToolUse`, matcher `Write\|Edit` |
| Archivos de normas | `rules/documentacion.md`, `rules/ejercicios-estructura.md`, `rules/ejercicios-resultados.md` (raíz del proyecto) |

## El código

```bash title="~/.claude/hooks/codelearn-docs-norms.sh"
#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"

file_path="$(node -e '
  const d = JSON.parse(require("fs").readFileSync(0, "utf8"));
  process.stdout.write(d.tool_input?.file_path ?? "");
' <<< "$payload")"                                          # (1)

[ -n "$file_path" ] || exit 0

path_lower="$(printf '%s' "$file_path" | tr '[:upper:]' '[:lower:]' | tr '\\' '/')"  # (2)

PROJECT_DIR="/c/xampp/htdocs/codeLearn"
RULES_FILE=""

case "$path_lower" in                                        # (3)
  *codelearn/docs/waytocode/*.md)
    RULES_FILE="$PROJECT_DIR/rules/ejercicios-resultados.md"
    ;;
  *codelearn/docs/assessment/js/ejercicios/*.html|*codelearn/docs/assessment/js/ejercicios/*.js)
    RULES_FILE="$PROJECT_DIR/rules/ejercicios-estructura.md"
    ;;
  *codelearn/docs/*.md)
    RULES_FILE="$PROJECT_DIR/rules/documentacion.md"
    ;;
  *)
    exit 0
    ;;
esac

[ -f "$RULES_FILE" ] || exit 0

CONTENT="$(cat "$RULES_FILE")"                                # (4)

node -e '                                                      # (5)
  const ctx = process.argv[1];
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: ctx } }));
' "$CONTENT"
```

1. **Lee la ruta del archivo tocado.** `PostToolUse` manda `tool_input.file_path` en el payload — se extrae con `node`, igual que en el otro hook.
2. **Normaliza la ruta.** Minúsculas + backslash a forward-slash, porque Claude Code manda rutas estilo Windows (`C:\xampp\...`) y comparar con `case` es más simple en un solo formato.
3. **Decide el archivo de normas por patrón de ruta**, en orden de más específico a más genérico: primero `waytoCode`, después `assessment/js/ejercicios`, por último cualquier otro `.md` de `docs/`. Si no matchea nada, `exit 0` — no hace nada.
4. **Lee el archivo de normas completo.** `cat` simple, sin criterio — por eso puede hacerlo el hook y no depende de que yo lo recuerde.
5. **Devuelve el contenido como `additionalContext`** de `PostToolUse` — se inyecta en mi contexto justo después de haber escrito el archivo.

## Cómo se mantienen actualizadas las normas

Cuando surge una norma nueva de documentación, el flujo es:

1. Identificar a cuál de los tres archivos corresponde.
2. Editarlo directamente, en la sección que aplique.
3. Guardar en engram (`mem_save`, tipo `pattern`) el qué y el porqué — registro histórico, no funcional.
4. Si es una decisión estructural real (no una norma simple de una línea) → además, entrada en `openspec/changes/archive/` + fila en `CHANGELOG.md`.
5. Ya queda viva — el hook no depende de `RULES.md` ni de nada más, lee directo del archivo de `rules/`.

## Cómo comprobar que funcionó

- Si el hook no parece dispararse: abrir `/hooks` una vez para forzar la recarga de `settings.json`.
- Los tres archivos de normas son legibles directamente: `rules/documentacion.md`, `rules/ejercicios-estructura.md`, `rules/ejercicios-resultados.md`.

!!! tip "Un solo hook, tres archivos — no tres hooks"
    No hace falta un hook por dominio. El script decide con un `case` sobre la ruta, así que agregar un cuarto dominio en el futuro es tan simple como sumar un patrón más al `case` y su archivo de normas correspondiente.

!!! note "Límite conocido"
    Las rutas y el proyecto (`codelearn`) están hardcodeados en el `case` — si el proyecto cambia de nombre de carpeta, hay que editar el hook a mano.
