# Hooks { .bloque-ia }

> Un hook es código que se ejecuta automáticamente en un momento concreto del ciclo de trabajo de Claude Code — antes de usar una herramienta, después, al recibir un prompt tuyo. Es la forma de garantizar algo con código, en vez de confiar en que el prompt lo recuerde.

---

## Por qué no alcanza con pedirlo en el prompt {: .topic-title }

```
❌ "Y acuérdate de formatear el código con prettier después de cada cambio"
```

Pedirlo en el prompt es una instrucción más entre muchas — puede perderse, puede olvidarse en una sesión larga. Un hook no se "olvida": se ejecuta siempre que ocurre el evento que lo dispara, esté o no en el contexto de la conversación.

---

## Cómo funcionan {: .topic-title }

Se configuran en el archivo de settings de Claude Code (`settings.json`, a nivel de usuario o de proyecto), asociando un **evento** a un **comando de shell**:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npx prettier --write $CLAUDE_FILE_PATH" }
        ]
      }
    ]
  }
}
```

Este ejemplo corre `prettier` automáticamente cada vez que Claude edita o escribe un archivo — sin que nadie tenga que pedirlo en cada prompt.

---

## Eventos disponibles {: .topic-title }

| Evento | Cuándo dispara |
|---|---|
| `PreToolUse` | Justo ANTES de que Claude use una herramienta — puede incluso bloquear la acción |
| `PostToolUse` | Justo DESPUÉS de que una herramienta terminó |
| `UserPromptSubmit` | Cuando envías un mensaje, antes de que Claude lo procese |
| `Notification` | Cuando Claude Code muestra una notificación (por ejemplo, esperando tu confirmación) |
| `Stop` | Cuando Claude termina de responder |

!!! tip "PreToolUse puede bloquear, no solo observar"
    Un hook en `PreToolUse` puede devolver un código de salida que le dice a Claude Code "no ejecutes esta acción". Es la forma de poner una barrera dura — por ejemplo, bloquear cualquier comando que contenga `rm -rf` o `git push --force`, sin depender de que Claude decida no hacerlo por su cuenta.

---

## Casos de uso reales {: .topic-title }

- **Formateo automático** — correr el formatter del proyecto después de cada edición.
- **Bloquear comandos peligrosos** — impedir `rm -rf`, pushes forzados, o comandos fuera de una lista permitida.
- **Notificaciones propias** — mandarte un aviso (Slack, sonido, notificación del sistema) cuando Claude necesita tu confirmación o terminó una tarea larga.
- **Logging/auditoría** — guardar un registro de qué comandos se ejecutaron, para revisar después qué pasó en una sesión larga.
- **Validación de commits** — correr linter/tests antes de permitir que Claude haga un commit.

---

## Hooks vs CLAUDE.md vs permisos {: .topic-title }

| Mecanismo | Qué garantiza | Se puede saltar |
|---|---|---|
| `CLAUDE.md` | Una instrucción que Claude debería seguir | Sí — es una instrucción, no una barrera |
| Modos de permiso | Que te pregunten antes de una acción | Depende del modo configurado |
| Hooks | Que un código se ejecute SIEMPRE en ese evento | No — es código, no una petición |

!!! danger "Para reglas que no pueden fallar, usa hooks, no instrucciones"
    Si algo es realmente crítico (nunca tocar producción, nunca hacer push a `main` sin revisión), no confíes solo en que esté escrito en `CLAUDE.md` — ponlo como un hook de `PreToolUse` que bloquee la acción con código.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Hooks** | https://anthropic.skilljar.com/claude-code-in-action/486901 |
| 📘 **Documentación oficial de Claude Code — Hooks** | https://docs.claude.com/claude-code |
