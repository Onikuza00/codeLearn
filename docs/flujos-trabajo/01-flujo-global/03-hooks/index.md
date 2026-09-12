# Hooks

> Automatizan lo que ya declaraste en los pasos 1 y 2 — no crean reglas nuevas, disparan las que ya existen sin que tengas que pedirlas cada vez.

---

## Qué es un hook

Un hook es código que se ejecuta automáticamente cuando ocurre un evento del ciclo de vida de una sesión con un agente: al arrancar, antes o después de que se use una herramienta, antes de perder contexto, al cerrar. No es exclusivo de Claude Code — cualquier herramienta agente seria tiene su propio mecanismo equivalente, aunque cada una le ponga un nombre distinto y un formato de configuración propio.

Lo que sigue usa la mecánica de Claude Code como ejemplo concreto (verificado contra su documentación oficial), pero el concepto de cada hook es trasladable a cualquier otra herramienta.

## Los 4 hooks

| Hook | Evento (Claude Code) | Qué resuelve |
|---|---|---|
| Arranque de sesión | `SessionStart` | Recuperar contexto de Engram/OpenSpec al empezar |
| Diseño bajo demanda | `UserPromptSubmit` | Inyectar las normas de diseño cuando se pide explícitamente |
| Lint/formato automático | `PostToolUse` (`Write`\|`Edit`) | Comprobar sintaxis y estilo justo después de cada edición |
| Cierre de sesión | `PreCompact` + `SessionEnd` | Intentar guardar contexto antes de perderlo — red de seguridad, no garantía |

---

## 1. Arranque de sesión

Al empezar a trabajar, el agente no sabe nada de lo que pasó ayer. Este hook recupera el contexto de memoria persistente (Engram) y del estado de cambios abiertos (OpenSpec) automáticamente, sin que tengas que pedirlo cada vez.

??? example "Ejemplo de configuración (Claude Code, `settings.json`)"
    ```json
    {
      "hooks": {
        "SessionStart": [
          {
            "hooks": [
              { "type": "command", "command": "bash ~/.claude/hooks/arranque-sesion.sh" }
            ]
          }
        ]
      }
    }
    ```

??? example "Ejemplo de script (`arranque-sesion.sh`)"
    ```bash
    #!/usr/bin/env bash
    set -euo pipefail

    payload="$(cat)"                                    # JSON por stdin: cwd, session_id, source...
    source_type="$(echo "$payload" | jq -r '.source')"

    if [ "$source_type" = "startup" ]; then
      ctx="Sesión nueva: recupera el contexto guardado en tu memoria
    persistente para este proyecto antes de responder al primer mensaje."
    else
      ctx="Sesión reanudada: recupera contexto de memoria solo si hace
    falta retomar algo — no hace falta repetirlo todo."
    fi

    jq -n --arg ctx "$ctx" '{
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: $ctx
      }
    }'
    ```
    El script no llama él mismo a la memoria persistente — solo devuelve texto en `additionalContext`, y es Claude quien, al leerlo, decide recuperar el contexto de verdad. El hook garantiza que el aviso llegue siempre; la acción la sigue haciendo el agente.

## 2. Diseño bajo demanda

Cuando toca interpretar un diseño (una imagen de referencia, un mockup) y convertirlo en esqueleto de página, conviene que el agente tenga a mano tus normas de diseño sin que se las repitas cada vez.

!!! warning "No se puede disparar por 'pegar una imagen'"
    Verificado contra la documentación oficial: el hook de prompt (`UserPromptSubmit`) solo recibe texto — no hay forma de detectar que se ha pegado o adjuntado una imagen. La versión que sí funciona es disparar por un **comando explícito** en el prompt (ej. `/diseño`), no por el tipo de contenido adjunto. La imagen en sí no necesita ningún hook — Claude ya la interpreta de forma nativa en cuanto la pegas en el chat.

??? example "Ejemplo de configuración (Claude Code, `settings.json`)"
    ```json
    {
      "hooks": {
        "UserPromptSubmit": [
          {
            "matcher": "",
            "hooks": [
              { "type": "command", "command": "bash ~/.claude/hooks/normas-diseno.sh" }
            ]
          }
        ]
      }
    }
    ```
    El script comprueba si el prompt contiene el comando acordado (ej. `/diseño`) y, solo entonces, imprime las normas de diseño — eso se añade al contexto de esa respuesta. Si el prompt no lleva el comando, el script no hace nada.

??? example "Ejemplo de script (`normas-diseno.sh`)"
    ```bash
    #!/usr/bin/env bash
    set -euo pipefail

    payload="$(cat)"
    prompt="$(echo "$payload" | jq -r '.prompt')"     # campo real verificado: "prompt"

    if [[ "$prompt" == *"/diseño"* ]]; then
      cwd="$(echo "$payload" | jq -r '.cwd')"
      norms_file="$cwd/docs/design-system.md"          # tu archivo real, no texto quemado en el script

      if [ -f "$norms_file" ]; then
        norms="$(cat "$norms_file")"
      else
        norms="No hay normas de diseño definidas todavía en $norms_file."
      fi

      jq -n --arg ctx "$norms" '{
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          additionalContext: $ctx
        }
      }'
    else
      exit 0
    fi
    ```
    El script no lleva tus normas escritas dentro — las LEE de un archivo del propio repo. Así solo las mantienes en un sitio, y el hook simplemente las relaya cuando pides el comando. Si el archivo no existe, avisa en vez de fallar en silencio.

## 3. Lint/formato automático

Verificado: el payload de `PostToolUse` sobre `Write`/`Edit` sí incluye la ruta exacta del archivo tocado. Eso permite correr el formateador correcto según la extensión, automáticamente, justo después de cada edición — sin esperar a que tú lo pidas ni a que llegue el commit.

??? example "Ejemplo de configuración (Claude Code, `settings.json`)"
    ```json
    {
      "hooks": {
        "PostToolUse": [
          {
            "matcher": "Write|Edit",
            "hooks": [
              { "type": "command", "command": "bash ~/.claude/hooks/lint-tras-editar.sh" }
            ]
          }
        ]
      }
    }
    ```
    El script lee la ruta del archivo del payload y decide el formateador por extensión: ESLint/Prettier para `.js`, PHP-CS-Fixer para `.php`, Stylelint para `.css`.

??? example "Ejemplo de script (`lint-tras-editar.sh`)"
    ```bash
    #!/usr/bin/env bash
    set -euo pipefail

    payload="$(cat)"
    file_path="$(echo "$payload" | jq -r '.tool_input.file_path')"  # campo real verificado
    cwd="$(echo "$payload" | jq -r '.cwd')"

    cd "$cwd"   # imprescindible si el hook vive en tu config global:
                # cada repo tiene su propio .eslintrc/.stylelintrc, y el
                # linter solo los encuentra si corre desde esa carpeta

    # Paso 1 — sintaxis, casi gratis: detecta llaves sin cerrar y
    # errores de parseo antes de gastar tiempo en reglas de estilo.
    case "$file_path" in
      *.js) node --check "$file_path" || exit 2 ;;
      *.php) php -l "$file_path" || exit 2 ;;
    esac

    # Paso 2 — estilo, un poco más lento pero sigue siendo por archivo,
    # no por todo el proyecto.
    case "$file_path" in
      *.js)  npx eslint "$file_path" ;;
      *.php) php-cs-fixer fix "$file_path" --dry-run ;;
      *.css) npx stylelint "$file_path" ;;
      *)     exit 0 ;;
    esac

    # exit 2 bloquea y obliga a corregir antes de seguir; exit 1 avisa sin bloquear.
    ```
    A diferencia del hook de diseño, aquí no hace falta "conectar" nada a mano: ESLint, Stylelint y PHP-CS-Fixer ya saben leer su propia configuración del repo (`.eslintrc`, `.stylelintrc`, `.php-cs-fixer.php`) en cuanto corren desde la carpeta correcta. Lo único que aporta el `cd "$cwd"` es garantizar que encuentren la configuración del proyecto que tocas, no la de otro.

!!! tip "Sintaxis primero, estilo después"
    `node --check`/`php -l` solo comprueban que el archivo parsea — nada de reglas, por eso son casi instantáneos. Es justo lo que detecta una llave sin cerrar. El lint de estilo completo (ESLint, Stylelint) es un paso aparte, algo más lento pero sigue operando sobre un único archivo, no sobre todo el proyecto — el coste real de correr esto en cada edición es insignificante frente al tiempo que se pierde arrastrando un error de sintaxis varias ediciones más.

!!! tip "Falla solo en errores reales, no en avisos de estilo menores"
    Si el hook bloquea (`exit 2`) por cualquier aviso, incluidos los triviales, vas a acabar deshabilitándolo por pura fricción. Resérvalo para errores de sintaxis o reglas realmente importantes; para el resto, `exit 1` avisa sin frenar el trabajo.

## 4. Cierre de sesión

Antes de compactar el contexto o de cerrar la sesión, conviene intentar guardar lo importante. Los eventos existen (`PreCompact`, `SessionEnd`) y se disparan en el momento correcto, pero hay un límite real que no conviene ignorar.

!!! danger "SessionEnd no puede pedirle nada a Claude — solo actuar por su cuenta"
    Verificado contra la documentación oficial: `additionalContext` (el mecanismo que usan los hooks 1 y 2 para "hablarle" a Claude) **no está disponible en `SessionEnd`**. En ese punto ya no hay un turno del agente al que inyectar nada — el script solo puede ejecutar su propia lógica externa (escribir un log, llamar a una API), nunca decirle a Claude "guarda esto antes de cerrar". `PreCompact` tampoco tiene esto documentado con claridad.

    Por eso esto es una red de seguridad, no una garantía: no se puede depender de estos hooks como forma de no perder contexto. La mitigación real no es técnica, es de disciplina — guardar de forma **proactiva** durante la sesión (cada decisión, cada bloque de trabajo cerrado), no esperar al cierre para intentarlo todo de golpe.

??? example "Ejemplo de configuración (Claude Code, `settings.json`)"
    ```json
    {
      "hooks": {
        "PreCompact": [
          {
            "hooks": [
              { "type": "command", "command": "bash ~/.claude/hooks/antes-de-compactar.sh" }
            ]
          }
        ],
        "SessionEnd": [
          {
            "hooks": [
              { "type": "command", "command": "bash ~/.claude/hooks/fin-de-sesion.sh" }
            ]
          }
        ]
      }
    }
    ```

??? example "Ejemplo de scripts (`antes-de-compactar.sh` / `fin-de-sesion.sh`)"
    ```bash
    # antes-de-compactar.sh — PreCompact
    #!/usr/bin/env bash
    set -euo pipefail
    payload="$(cat)"
    # Sin campo documentado para pedirle algo a Claude aquí con certeza.
    # Lo único fiable es dejar constancia por fuera del propio agente:
    echo "$(date -Iseconds) — compactación disparada" >> ~/.claude/logs/codelearn-compact.log
    ```

    ```bash
    # fin-de-sesion.sh — SessionEnd
    #!/usr/bin/env bash
    set -euo pipefail
    payload="$(cat)"
    # additionalContext NO existe en SessionEnd: no hay forma de
    # decirle a Claude "guarda esto" en este punto. Solo queda
    # registrar el cierre por tu cuenta, fuera del propio agente.
    echo "$(date -Iseconds) — sesión cerrada" >> ~/.claude/logs/codelearn-cierres.log
    ```

---

## Checklist

- [ ] El hook de arranque de sesión recupera contexto sin que tengas que pedirlo
- [ ] El hook de diseño se dispara por un comando explícito, no por intentar detectar una imagen
- [ ] El hook de lint/formato corre justo tras cada edición, y solo bloquea por errores reales
- [ ] `PreCompact`/`SessionEnd` están puestos, pero el guardado importante ya se hizo de forma proactiva durante la sesión, no depende solo de ellos
- [ ] Cada hook da alguna señal visible al correr — nunca falla en silencio
