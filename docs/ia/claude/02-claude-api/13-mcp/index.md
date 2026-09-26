# MCP { .bloque-ia }

> El Protocolo de Contexto de Modelo (*Model Context Protocol*): una forma estándar de darle a Claude herramientas y contexto sin escribir tú todo el código de integración.

---

## Qué es { .topic-title }

**MCP** (*Model Context Protocol*, Protocolo de Contexto de Modelo) es una capa de comunicación entre tu aplicación y los servicios externos con los que quieres que Claude trabaje. En lugar de programar tú cada integración, te conectas a **servidores MCP** que ya la traen hecha.

## Temario { .topic-title }

| Lección | Qué cubre |
|---|---|
| [Presentando MCP](01-presentando-mcp/index.md) | Qué es MCP, qué problema resuelve y en qué se diferencia del uso de herramientas y de las llamadas directas a una API |
| [Clientes MCP](02-clientes-mcp/index.md) | El cliente como puente hacia los servidores MCP, los transportes, los mensajes `ListTools` y `CallTool` y el flujo completo de una consulta |
| [Proyecto y herramientas MCP](03-proyecto-y-herramientas/index.md) | Preparar un chatbot de línea de comandos con cliente y servidor MCP, y definir las herramientas del servidor con el SDK de Python |
| [Inspector y cliente](04-inspector-y-cliente/index.md) | Probar el servidor con el inspector del navegador e implementar el cliente con `list_tools()` y `call_tool()` |
| [Recursos](05-recursos/index.md) | Exponer datos con `@mcp.resource()` (directos y con plantilla) y leerlos desde el cliente con `read_resource` |
| [Prompts](06-prompts/index.md) | Ofrecer prompts predefinidos con `@mcp.prompt()` y usarlos desde el cliente con `list_prompts` y `get_prompt` |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Model Context Protocol — sitio oficial** | https://modelcontextprotocol.io |
