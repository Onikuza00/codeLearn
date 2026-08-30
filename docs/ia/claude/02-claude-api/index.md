# Claude API { .bloque-ia }

> Curso oficial de Anthropic Academy en Skilljar. Cómo llamar a la API de Claude desde tu propio backend (Messages API, tool use) — la pieza que falta para integrar Claude en Symfony (RAG). Estos apuntes se documentan a medida que avanza el curso.

---

## Temario {: .topic-title }

| Sección del curso | Temario | Qué cubre |
|---|---|---|
| Accessing the API | [Acceso a la API](01-acceso-api/index.md) | El flujo completo de una solicitud, los campos que lleva y qué hace Claude internamente con el texto |
| Accessing the API | [Creando la conexión](02-creando-conexion/index.md) | Primera llamada real al SDK — instalación, cliente, `messages.create()` (adaptado a JavaScript/Node.js) |
| Making Basic Requests | [Conversaciones multiturno](03-conversaciones-multiturno/index.md) | Mantener el historial de mensajes entre turnos de usuario y asistente |
| Making Basic Requests | [Prompting](04-system-prompts/index.md) | El parámetro `system`, para fijar el rol y las reglas de comportamiento de Claude |
| Making Basic Requests | [Temperatura](05-temperature/index.md) | Controlar cuánta variación tienen las respuestas |
| Making Basic Requests | [Streaming](06-streaming/index.md) | Recibir la respuesta en fragmentos a medida que se genera, en vez de esperar el mensaje completo |
| Making Basic Requests | [Datos estructurados](07-datos-estructurados/index.md) | Prellenar el mensaje del asistente + secuencias de parada, para obtener JSON/código/listas sin texto envolvente |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial de la API** | https://docs.claude.com/en/api |
