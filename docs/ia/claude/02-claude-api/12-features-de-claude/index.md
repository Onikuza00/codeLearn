# Features de Claude { .bloque-ia }

> Capacidades adicionales de Claude que se activan desde la API con un parámetro o un tipo de contenido nuevo, sin cambiar la forma básica de la llamada.

---

## Qué son { .topic-title }

Una llamada básica a la API envía mensajes y recibe texto. Las *features* (características) son funciones extra que Claude ofrece por encima de esa llamada básica. Cada una resuelve un problema concreto y tiene su propio coste, así que se activan solo cuando compensan.

## Temario { .topic-title }

| Lección | Qué cubre |
|---|---|
| [Extended thinking](01-extended-thinking/index.md) | Darle a Claude tiempo para razonar antes de responder: cómo se activa, cómo cambia la respuesta y cuándo compensa su coste |
| [Image support](02-image-support/index.md) | Enviar imágenes a Claude junto con el texto: límites, formato del bloque de imagen y cómo redactar el prompt para que el análisis sea fiable |
| [PDF support](03-pdf-support/index.md) | Enviar un PDF a Claude: el bloque `document`, qué cambia respecto a las imágenes y qué puede extraer (texto, tablas, gráficos) |
| [Citations](04-citations/index.md) | Hacer que Claude indique de qué parte exacta del documento sale cada dato: cómo se activan y qué contiene cada cita |
| [Prompt caching](05-prompt-caching/index.md) | Reutilizar el procesamiento de un texto entre peticiones: cómo funciona, los puntos de corte (`cache_control`) y cómo aplicarlo a herramientas y prompts de sistema |
| [Code execution y Files API](06-code-execution-y-files-api/index.md) | Subir archivos por adelantado y dejar que Claude ejecute código Python sobre ellos en un contenedor aislado, y descargar lo que genere |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
