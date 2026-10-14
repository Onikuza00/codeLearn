# Mejoras con servidores MCP { .bloque-ia }

> Claude Code trae un cliente MCP integrado: conectar un servidor MCP amplía sus capacidades más allá de lo que trae de fábrica, con herramientas, recursos o integraciones a medida del flujo de trabajo de desarrollo.

---

## Cómo MCP extiende a Claude Code { .topic-title }

El Model Context Protocol permite que Claude Code se conecte a servicios y herramientas externas a través de servidores MCP. En vez de quedarse solo con las capacidades integradas, puede sumar funcionalidad conectando servidores que expongan herramientas, recursos o integraciones concretas.

Cada servidor MCP puede exponer distintos tipos de funcionalidad a través de tres componentes: **herramientas** (para realizar acciones), **prompts** (plantillas reutilizables) y **recursos** (para acceder a datos).

## Configurar un servidor MCP { .topic-title }

Añadir un servidor MCP a Claude Code es tan simple como registrarlo por línea de comandos:

```bash
claude mcp add [nombre-del-servidor] [comando-para-arrancar-el-servidor]
```

Por ejemplo, con un servidor de procesamiento de documentos que arranca con `node mcp-server.js`:

```bash
claude mcp add documents node mcp-server.js
```

Una vez registrado, Claude Code se conecta automáticamente a ese servidor en cuanto arranca.

## Ejemplo: procesamiento de documentos { .topic-title }

Un caso práctico es una herramienta que permita a Claude leer documentos PDF y Word. Con un servidor MCP que exponga una tool `document_path_to_markdown`, basta con pedirle a Claude que convierta el contenido de un documento a Markdown.

Al pedir algo como «convierte el archivo `tests/fixtures/mcp_docs.docx` a Markdown», Claude usa automáticamente esa herramienta personalizada para leer el documento y devolver el contenido ya convertido.

## Integraciones populares { .topic-title }

El ecosistema MCP ya trae servidores para herramientas y servicios de desarrollo habituales:

| Servidor | Qué aporta |
|---|---|
| `sentry-mcp` | Descubre y ayuda a corregir errores registrados en Sentry |
| `playwright-mcp` | Automatización de navegador para pruebas y depuración |
| `figma-context-mcp` | Expone diseños de Figma a Claude |
| `mcp-atlassian` | Acceso a Confluence y Jira |
| `firecrawl-mcp-server` | Web scraping |
| `slack-mcp` | Publicar mensajes o responder hilos concretos en Slack |

!!! tip "Verificar antes de sumar un MCP nuevo"
    Mismo criterio que con cualquier otro MCP: comprobar con `claude mcp list` que conecta de verdad, y no añadir uno que ya solape con algo instalado.

## Construir un flujo de trabajo propio { .topic-title }

El verdadero potencial está en combinar varios servidores MCP a la vez, adaptados al proceso de desarrollo real. Por ejemplo:

- Un servidor de Sentry para traer detalles de errores de producción.
- Un servidor de Jira para leer los requisitos de un ticket.
- Un servidor de Slack para avisar al equipo cuando el trabajo esté listo.
- Servidores propios para herramientas y APIs internas.

Combinados, Claude puede trabajar con todas las herramientas y servicios que ya se usan a diario, sin salir del flujo de la terminal.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Model Context Protocol — sitio oficial** | https://modelcontextprotocol.io |
| 📘 **Documentación oficial de Claude Code** | https://docs.claude.com/claude-code |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
