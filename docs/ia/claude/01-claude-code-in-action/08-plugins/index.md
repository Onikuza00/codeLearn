# Plugins { .bloque-ia }

> Un plugin empaqueta configuración, comandos y skills de Claude Code en algo instalable — la forma de reutilizar un flujo de trabajo entre proyectos, o de compartirlo con otras personas, en vez de copiar y pegar configuración a mano cada vez.

---

## Qué resuelve {: .topic-title }

Sin plugins, cada mejora que haces a tu flujo de trabajo (un hook útil, un comando slash, unas instrucciones de skill) vive en un solo proyecto — copiarla a otro es manual y se desactualiza. Un plugin la empaqueta una vez y la instalas donde haga falta.

---

## Qué puede incluir un plugin {: .topic-title }

| Componente | Qué aporta |
|---|---|
| **Comandos slash** | Atajos tipo `/deploy`, `/review` con un flujo predefinido |
| **Skills** | Instrucciones especializadas que se cargan solo cuando hacen falta (ver más abajo) |
| **Hooks** | Automatizaciones (formateo, bloqueo de comandos peligrosos) ya configuradas |
| **Configuración de MCP** | Conexión a servidores externos (bases de datos, APIs, herramientas) |

---

## Instalar y gestionar plugins {: .topic-title }

```bash
# Ver plugins disponibles / instalados (el comando exacto depende de la versión del CLI)
claude plugin list

# Instalar un plugin desde un marketplace o repositorio
claude plugin install nombre-del-plugin
```

!!! info "Los plugins se gestionan por proyecto o globalmente"
    Igual que `CLAUDE.md` tiene versión de proyecto y personal, los plugins se pueden instalar para un proyecto concreto o para todas tus sesiones — según si el flujo que empaquetan es específico de ese repo o algo que quieres siempre disponible.

---

## Plugins vs Skills vs MCP — no son lo mismo {: .topic-title }

Es fácil confundir estos tres conceptos porque se solapan en propósito (todos "extienden" Claude Code), pero resuelven cosas distintas:

| | Qué es | Cuándo se activa |
|---|---|---|
| **Skill** | Instrucciones especializadas para una tarea concreta (ej. "cómo hacer code review en este equipo") | Cuando la tarea coincide con lo que la skill describe |
| **MCP server** | Conexión a una herramienta o fuente de datos externa (una base de datos, una API) | Cuando Claude necesita esa herramienta específica |
| **Plugin** | Un paquete que puede incluir skills, comandos, hooks y configuración de MCP juntos | Se instala una vez, queda disponible según cómo lo configures |

!!! tip "Un plugin es el empaquetado, no una capacidad nueva en sí misma"
    Si ya usas skills, hooks o MCP servers en un proyecto y quieres reutilizarlos en otro (o compartirlos con tu equipo), esa es la señal de que conviene empaquetarlos como plugin — no es una funcionalidad distinta, es la forma de distribuir lo que ya funciona.

---

## Cuándo te conviene crear uno {: .topic-title }

- Repetís la misma configuración de hooks/skills en varios proyectos propios.
- Tu equipo necesita un flujo de trabajo consistente (convenciones, comandos, verificaciones) entre repos distintos.
- Quieres compartir con la comunidad un flujo que armaste y que le sirve a más gente que a ti.

Si es algo que solo usas en un proyecto y no piensas reutilizar, no hace falta empaquetarlo — la configuración directa en ese `CLAUDE.md`/`settings.json` alcanza.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Plugins** | https://anthropic.skilljar.com/claude-code-in-action/486901 |
| 📘 **Documentación oficial de Claude Code — Plugins** | https://docs.claude.com/claude-code |
