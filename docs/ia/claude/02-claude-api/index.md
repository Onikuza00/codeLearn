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
| RAG | [RAG](11-rag-y-busqueda-agencial/index.md) | Por qué no basta con pegar el documento entero en el prompt, y qué resuelve segmentarlo |
| RAG | [Segmentación de texto](11-rag-y-busqueda-agencial/01-segmentacion-de-texto/index.md) | Partir un documento en fragmentos: por estructura, por frase, por tamaño con solapamiento y semántica |
| RAG | [Embeddings](11-rag-y-busqueda-agencial/02-embeddings/index.md) | Convertir texto en números para buscar por significado con similitud coseno, y cerrar el flujo RAG mandándole a Claude el chunk relevante junto con la pregunta |
| RAG | [Búsqueda léxica BM25](11-rag-y-busqueda-agencial/03-busqueda-lexica-bm25/index.md) | Encontrar coincidencias exactas de términos raros (IDs, códigos) y por qué se combina con la búsqueda semántica |
| RAG | [Retriever](11-rag-y-busqueda-agencial/04-canalizacion-indice-multiple/index.md) | Un `Retriever` que consulta varios índices y fusiona sus rankings con *reciprocal rank fusion* |
| Features of Claude | [Features de Claude](12-features-de-claude/index.md) | Capacidades extra de Claude que se activan desde la API con un parámetro o un tipo de contenido nuevo |
| Features of Claude | [Extended thinking](12-features-de-claude/01-extended-thinking/index.md) | Darle a Claude tiempo para razonar antes de responder, cómo cambia la respuesta y cuándo compensa el coste |
| Features of Claude | [Image support](12-features-de-claude/02-image-support/index.md) | Enviar imágenes junto con el texto: límites, bloque de imagen y prompts estructurados para análisis fiables |
| Features of Claude | [PDF support](12-features-de-claude/03-pdf-support/index.md) | Enviar un PDF con el bloque `document` y qué puede extraer Claude: texto, tablas y gráficos |
| Features of Claude | [Citations](12-features-de-claude/04-citations/index.md) | Que Claude señale el fragmento exacto del documento que respalda cada afirmación |
| Features of Claude | [Prompt caching](12-features-de-claude/05-prompt-caching/index.md) | Guardar el procesamiento de un prompt para reutilizarlo: puntos de corte, herramientas, prompt de sistema y cómo leer el uso de la caché |
| Features of Claude | [Code execution y Files API](12-features-de-claude/06-code-execution-y-files-api/index.md) | Subir archivos con la Files API y analizarlos con la herramienta de ejecución de código, descargando los resultados |
| Model Context Protocol | [MCP](13-mcp/index.md) | Una forma estándar de darle a Claude herramientas y contexto sin escribir tú toda la integración |
| Model Context Protocol | [Presentando MCP](13-mcp/01-presentando-mcp/index.md) | Qué es MCP, qué problema resuelve y en qué se diferencia del uso de herramientas |
| Model Context Protocol | [Clientes MCP](13-mcp/02-clientes-mcp/index.md) | El cliente como puente hacia los servidores MCP y el flujo completo de una consulta |
| Model Context Protocol | [Proyecto y herramientas MCP](13-mcp/03-proyecto-y-herramientas/index.md) | Preparar el proyecto de práctica y definir herramientas de un servidor MCP con el SDK de Python |
| Model Context Protocol | [Inspector y cliente](13-mcp/04-inspector-y-cliente/index.md) | Probar el servidor con el inspector e implementar el cliente MCP |
| Model Context Protocol | [Recursos](13-mcp/05-recursos/index.md) | Exponer datos desde el servidor y leerlos desde el cliente |
| Model Context Protocol | [Prompts](13-mcp/06-prompts/index.md) | Prompts predefinidos en el servidor y cómo pedirlos desde el cliente |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial de la API** | https://docs.claude.com/en/api |
