# Glosario { .bloque-ia }

> Referencia rápida de Claude Code: comandos de barra, atajos de teclado, prefijos de la línea de entrada, ficheros de configuración y los hábitos que más diferencia marcan. Para consultar, no para leer de seguido.

---

## Los cuatro prefijos de la entrada {: .topic-title }

Lo primero que hay que interiorizar, porque cambia el comportamiento entero de lo que escribes:

| Prefijo | Qué hace |
|---|---|
| `/` | **Comando** de Claude Code (`/clear`, `/model`…) |
| `!` | Ejecuta el resto como **comando de shell** y mete la salida en la conversación |
| `@` | **Referencia a un fichero o carpeta**, con autocompletado |
| `#` | Guarda lo que escribas en la **memoria** (`CLAUDE.md`) |

!!! tip "`!` es el atajo más infrautilizado"
    `! git log --oneline -10` ejecuta el comando y su salida queda en el contexto, sin que Claude tenga que pedir permiso ni decidir nada. Es la vía rápida para darle un dato concreto —una rama, un log, la salida de un test— en lugar de describírselo.

    También es la forma de hacer tú una operación interactiva que Claude no puede (un `login`, un comando que pide confirmación por teclado).

## Comandos de barra {: .topic-title }

**Sesión y contexto**

| Comando | Qué hace |
|---|---|
| `/clear` | Vacía la conversación. **El más importante** |
| `/compact` | Resume la conversación para liberar contexto y seguir |
| `/context` | Cuánto contexto se está usando y en qué |
| `/rewind` | Volver a un punto anterior de la conversación |
| `/resume` | Retomar una sesión anterior |
| `/export` | Exportar la conversación |
| `/todos` | Ver la lista de tareas en curso |

**Configuración**

| Comando | Qué hace |
|---|---|
| `/init` | Genera un `CLAUDE.md` inicial analizando el proyecto |
| `/memory` | Editar los ficheros de memoria |
| `/config` | Ajustes generales |
| `/model` | Cambiar de modelo |
| `/output-style` | Cambiar el estilo de respuesta |
| `/statusline` | Configurar la línea de estado |
| `/permissions` | Ver y editar los permisos de herramientas |
| `/hooks` | Configurar hooks |
| `/agents` | Gestionar subagentes |
| `/mcp` | Estado de los servidores MCP |
| `/add-dir` | Añadir otra carpeta al alcance de la sesión |

**Diagnóstico y cuenta**

| Comando | Qué hace |
|---|---|
| `/doctor` | Comprueba la instalación |
| `/status` | Estado de la sesión y la cuenta |
| `/cost` · `/usage` | Consumo |
| `/login` · `/logout` | Cuenta |
| `/bug` | Reportar un problema |
| `/help` | Ayuda |

**Trabajo con código**

| Comando | Qué hace |
|---|---|
| `/review` | Revisar un *pull request* |
| `/code-review` | Revisar el diff actual buscando errores y simplificaciones |
| `/security-review` | Revisión de seguridad de los cambios pendientes |
| `/pr-comments` | Leer los comentarios de un PR |

!!! danger "`/clear` entre tareas distintas, siempre"
    Es el hábito que más mejora los resultados y el que más cuesta adquirir. Arrastrar una conversación de dos horas a una tarea nueva mete ruido: Claude sigue viendo decisiones, ficheros y errores que ya no vienen a cuento, y responde peor.

    Tarea terminada → `/clear` → tarea nueva. Si necesitas conservar algo entre las dos, eso es justo lo que debería estar escrito en `CLAUDE.md` o en un fichero del proyecto, no vivir en el historial.

## Atajos de teclado {: .topic-title }

| Atajo | Qué hace |
|---|---|
| **`Esc`** | **Interrumpir** lo que Claude esté haciendo |
| `Esc` `Esc` | Editar un mensaje anterior y rehacer desde ahí |
| **`Shift+Tab`** | **Rotar el modo de permisos**, incluido el modo plan |
| `Ctrl+C` | Cancelar la entrada actual; dos veces, salir |
| `Ctrl+D` | Salir |
| `Ctrl+L` | Limpiar la pantalla (no el contexto) |
| `Ctrl+R` | Buscar en el historial de comandos |
| `Ctrl+V` | Pegar una imagen desde el portapapeles |
| `↑` / `↓` | Historial de mensajes |
| `Ctrl+B` | Mandar a segundo plano un comando en ejecución |

!!! tip "`Esc` no es `Ctrl+C`"
    `Esc` **interrumpe la tarea pero conserva la conversación**: puedes corregir el rumbo y seguir. `Ctrl+C` cancela la entrada y, repetido, cierra la sesión entera.

    Cuando ves que va por mal camino, `Esc` y redirige. No hace falta dejar que termine.

## Modos de permisos {: .topic-title }

Se rotan con `Shift+Tab`:

| Modo | Comportamiento |
|---|---|
| **default** | Pide permiso para cada acción con efectos |
| **acceptEdits** | Acepta ediciones de fichero automáticamente |
| **plan** | **Solo lee y planifica. No modifica nada** |
| **bypassPermissions** | No pide nada |

!!! tip "El modo plan antes de cualquier cambio grande"
    En modo plan, Claude explora el código y propone un plan **sin tocar un solo fichero**. Lo revisas, corriges lo que no encaja, y solo entonces se ejecuta.

    Para un cambio que toca varios ficheros, esos dos minutos de revisión ahorran deshacer media hora de trabajo mal enfocado. Es la diferencia entre dirigir y esperar a ver qué sale.

!!! danger "`bypassPermissions` solo en entorno aislado"
    Sin confirmaciones, un comando destructivo se ejecuta sin que lo veas venir. Tiene sentido en un contenedor desechable o en integración continua; en tu máquina de trabajo, no.

## La línea de comandos {: .topic-title }

| Comando | Qué hace |
|---|---|
| `claude` | Sesión interactiva |
| `claude "arregla el test que falla"` | Arranca con un prompt inicial |
| `claude -p "resume los cambios"` | **Modo impresión**: responde y sale. Para guiones |
| `claude -c` | Continuar la última conversación |
| `claude -r` | Elegir una conversación anterior |
| `claude --model <modelo>` | Fijar el modelo |
| `claude --add-dir ../otra-carpeta` | Ampliar el alcance |
| `claude mcp list` · `claude mcp add` | Servidores MCP |
| `claude update` | Actualizar |
| `claude doctor` | Diagnóstico |

!!! tip "`claude -p` encadena con el resto de tu terminal"
    ```bash
    git diff | claude -p "resume estos cambios en una línea de commit"
    ```

    En modo impresión responde y termina, así que se puede meter en un guion, en un hook de git o en integración continua como una herramienta más.

## Ficheros de configuración {: .topic-title }

| Fichero | Para qué |
|---|---|
| `CLAUDE.md` | Convenciones del proyecto. Se lee en cada sesión |
| `~/.claude/CLAUDE.md` | Tus preferencias, para todos los proyectos |
| `.claude/settings.json` | Configuración del proyecto, se versiona |
| `.claude/settings.local.json` | Tuya y de esta máquina. No se versiona |
| `~/.claude/settings.json` | Configuración global |
| `.mcp.json` | Servidores MCP del proyecto |
| `.claude/commands/*.md` | **Comandos de barra propios** |
| `.claude/agents/*.md` | Subagentes propios |
| `.claude/skills/` | Habilidades propias |

!!! tip "Un `CLAUDE.md` corto se cumple; uno largo se diluye"
    Ahí van las **convenciones que no se deducen del código**: cómo se lanzan los tests, qué gestor de paquetes usa el proyecto, qué no se toca nunca, el formato de los commits.

    Lo que ya está escrito en el código o en el `package.json` sobra. Cuanto más largo, menos peso tiene cada línea.

## Hooks {: .topic-title }

Guiones que el sistema ejecuta en momentos concretos, definidos en `settings.json`:

| Evento | Cuándo |
|---|---|
| `PreToolUse` | Antes de usar una herramienta. Puede **bloquearla** |
| `PostToolUse` | Después. Ideal para formatear o inyectar normas |
| `UserPromptSubmit` | Al enviar un mensaje |
| `SessionStart` | Al empezar la sesión |
| `SessionEnd` | Al terminarla |
| `Stop` | Cuando Claude acaba de responder |
| `PreCompact` | Antes de comprimir el contexto |

!!! tip "La diferencia entre pedirlo y automatizarlo"
    «Ejecuta el formateador después de editar» escrito en `CLAUDE.md` se cumple casi siempre. Un hook `PostToolUse` que lo lance **se cumple siempre**, porque no depende de que el modelo se acuerde.

    Todo lo que sea «cada vez que pase X, haz Y» es un hook, no una instrucción.

## Hábitos que marcan la diferencia {: .topic-title }

<div class="pros-cons" markdown>

| ✅ Haz | ❌ No hagas |
|---|---|
| `/clear` entre tareas distintas | Arrastrar una conversación de horas |
| Modo plan antes de cambios grandes | Dejar que edite y ver qué sale |
| `@` para señalar los ficheros exactos | Describir el fichero con palabras |
| `Esc` en cuanto va por mal camino | Esperar a que termine para corregir |
| Pedirle que **verifique** lo que hizo | Dar por bueno lo que dice que funciona |
| Convenciones fijas en `CLAUDE.md` | Repetirlas en cada mensaje |
| Automatizar lo repetitivo con hooks | Pedir lo mismo cada sesión |
| Aportar el error completo, pegado | «Da un error» |

</div>

!!! danger "El resultado hay que verificarlo, no creérselo"
    «He arreglado el bug» no es prueba de nada: la prueba es el test pasando o la salida del comando. Pedir siempre que ejecute la verificación y enseñe el resultado.

    Es lo mismo que revisar el PR de un compañero. La herramienta acelera el trabajo; la responsabilidad de que el código esté bien no se delega.

!!! tip "Un contexto concreto vale más que un prompt largo"
    «El test `TaskSorterTest::testOrdenaPorPrioridad` falla con este error: *[pegas el error entero]*» produce mejores resultados que tres párrafos explicando la arquitectura.

    Datos concretos y ficheros señalados con `@`, en lugar de descripciones.

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Documentación de Claude Code** | [docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code) |
| 📘 **Referencia de comandos** | [docs.claude.com/en/docs/claude-code/slash-commands](https://docs.claude.com/en/docs/claude-code/slash-commands) |
| 📘 **Hooks** | [docs.claude.com/en/docs/claude-code/hooks](https://docs.claude.com/en/docs/claude-code/hooks) |

!!! info "Los comandos disponibles dependen de la versión y de los plugins"
    Claude Code se actualiza a menudo y algunos comandos llegan con plugins o con la configuración del equipo. La lista real de la instalación que tengas delante sale siempre de `/help`.
