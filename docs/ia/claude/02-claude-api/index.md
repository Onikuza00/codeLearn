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
| Evaluating Prompts | [Generación de conjuntos de datos de prueba](08-evaluacion-prompts/01-generacion-datasets/index.md) | Crear el dataset de evaluación automáticamente con Claude, en vez de a mano |
| Evaluating Prompts | [Ejecutar la evaluación](08-evaluacion-prompts/02-ejecutar-evaluacion/index.md) | Las tres funciones que procesan el dataset y devuelven resultados estructurados |
| Evaluating Prompts | [Calificadores](08-evaluacion-prompts/03-calificadores/index.md) | Calificación basada en modelo y basada en código, para reemplazar la nota fija |
| Prompt Engineering | [Ingeniería de prompts](09-prompt-engineering/index.md) | El ciclo iterativo de mejorar un prompt, midiendo cada cambio contra la evaluación |
| Prompt Engineering | [Técnicas de prompt](09-prompt-engineering/01-tecnicas-de-prompt/index.md) | Ser claro y directo, ser específico, etiquetas XML y ejemplos |
| Uso de herramientas | [Uso de herramientas](10-uso-de-herramientas/index.md) | Cómo Claude pide datos externos (APIs, bases de datos) en vez de improvisarlos |
| Uso de herramientas | [Construir una herramienta](10-uso-de-herramientas/01-construir-una-herramienta/index.md) | Función → esquema JSON → bloques de mensajes → enviar el resultado |
| Uso de herramientas | [Conversaciones con herramientas](10-uso-de-herramientas/02-conversaciones-con-herramientas/index.md) | El bucle que encadena varias llamadas automáticamente, con manejo de errores |
| Uso de herramientas | [Streaming con herramientas](10-uso-de-herramientas/03-streaming-de-herramientas/index.md) | Cómo llegan los argumentos de una herramienta fragmento a fragmento |
| Uso de herramientas | [Herramientas integradas](10-uso-de-herramientas/04-herramientas-integradas/index.md) | Editor de texto y búsqueda web — herramientas que Claude ya trae hechas |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial de la API** | https://docs.claude.com/en/api |
