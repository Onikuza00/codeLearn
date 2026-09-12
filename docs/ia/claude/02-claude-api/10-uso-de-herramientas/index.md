# Uso de herramientas { .bloque-ia }

> Cómo darle a Claude acceso a información que no tiene: datos en tiempo real, tus propias bases de datos, o cualquier sistema externo.

---

## El problema sin herramientas { .topic-title }

Por defecto, Claude solo conoce lo que había en sus datos de entrenamiento — no tiene acceso a eventos actuales, datos en tiempo real, ni a ningún sistema externo. Si le preguntas "¿qué tiempo hace hoy en Barcelona?", la única respuesta honesta que puede dar es que no tiene esa información.

Las **herramientas** (*tools*) resuelven esto: son un mecanismo estructurado para que Claude pida datos externos durante la conversación, en vez de quedarse solo con lo que ya sabe.

## Cómo funciona el flujo { .topic-title }

El uso de herramientas es un ida y vuelta entre tu aplicación y Claude, en cuatro pasos:

1. **Solicitud inicial** — le mandas a Claude la pregunta del usuario, junto con la definición de qué herramientas tiene disponibles y cómo usarlas.
2. **Solicitud de herramienta** — Claude analiza la pregunta, decide que necesita datos externos, y responde pidiendo usar una herramienta concreta con unos parámetros concretos, en vez de contestar directamente.
3. **Recuperación de datos** — tu propio código ejecuta la llamada real (una API, una base de datos, lo que sea). Claude nunca ejecuta nada por sí mismo, solo la pide.
4. **Respuesta final** — le devuelves a Claude el resultado de esa consulta, y recién ahí genera la respuesta final combinando la pregunta original con el dato nuevo.

Ejemplo con el clima: preguntas por el tiempo en una ciudad → Claude pide usar la herramienta del clima con esa ciudad → tu servidor llama a la API meteorológica real → le devuelves el resultado a Claude → Claude contesta ya con el dato actualizado.

!!! tip "Claude nunca toca el mundo exterior directamente"
    Esto es clave: Claude no tiene ningún acceso a internet ni a tus sistemas. Solo puede *pedir* que se ejecute algo — la ejecución real (la llamada HTTP, la consulta a la base de datos) la hace siempre tu código. Eso significa que controlas por completo qué puede pedir y qué datos le llegan de vuelta.

## Por qué importa { .topic-title }

- **Datos en tiempo real** — todo lo que cambia después del entrenamiento: clima, cotizaciones, noticias, stock.
- **Conectar sistemas propios** — tu base de datos, tu API interna, cualquier servicio al que Claude no tendría acceso de otra forma.
- **Interacción estructurada** — Claude no improvisa cómo pedir el dato: sabe qué herramienta existe, qué parámetros necesita y cuándo usarla.

Esto es lo que convierte a Claude de una base de conocimiento estática (fija en la fecha de su entrenamiento) en un asistente que puede trabajar con información actual — y es el paso previo necesario para RAG: antes de que Claude pueda consultar tus propios documentos o tu base de datos, primero necesita saber pedir esa consulta como una herramienta.

## Temario { .topic-title }

| Lección | Qué cubre |
|---|---|
| [Construir una herramienta](01-construir-una-herramienta/index.md) | Función → esquema JSON → bloques de mensajes → enviar el resultado, una llamada de punta a punta |
| [Conversaciones con herramientas](02-conversaciones-con-herramientas/index.md) | El bucle que encadena varias llamadas automáticamente, con manejo de errores y varias herramientas |
| [Streaming con herramientas](03-streaming-de-herramientas/index.md) | Cómo llegan los argumentos de una herramienta fragmento a fragmento, y por qué a veces con retraso |
| [Herramientas integradas](04-herramientas-integradas/index.md) | El editor de texto y la búsqueda web — herramientas que Claude ya trae hechas |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Tool use** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview |
