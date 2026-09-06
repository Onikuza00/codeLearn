# IA local { .bloque-ia }

> Ejecutar un modelo de lenguaje en tu propia máquina o en el servidor de la empresa, en lugar de llamar a la API de un tercero. Cambia el reparto de las cuatro variables que importan: qué datos salen, cuánto cuesta, qué calidad obtienes y de quién dependes.

---

## Por qué ejecutar un modelo en local {: .topic-title }

| | Local | Servicio externo |
|---|---|---|
| **Datos** | No salen de la organización | Salen a un tercero |
| **Coste** | Hardware fijo, uso ilimitado | Por cada llamada |
| **Calidad** | Menor con el mismo tamaño de modelo | Mayor |
| **Control** | Total: versión, disponibilidad, privacidad | Dependes de su servicio |
| **Latencia** | Sin red, pero limitada por tu hardware | Red, pero servidores potentes |

El eje que decide casi siempre es el primero. En cuanto entran datos personales de clientes, facturas o documentación interna, «no salen de aquí» pesa más que la diferencia de calidad — y esa diferencia hay que asumirla y decirla en voz alta, no esconderla.

## Temario {: .topic-title }

| Lección | Qué cubre |
|---|---|
| [Conceptos de modelos](01-conceptos/index.md) | Parámetros, cuantización, ventana de contexto, qué hardware hace falta, familias de modelos |
| [Ollama](02-ollama/index.md) | Instalar, descargar modelos, comandos, `Modelfile`, la API HTTP |
| [Open WebUI](03-open-webui/index.md) | Interfaz web sobre Ollama, usuarios, documentos y RAG integrado |
| [Configuración](04-configuracion/index.md) | Elegir modelo según hardware, parámetros de generación, servir en red, seguridad |

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 🦙 **Ollama** | [ollama.com](https://ollama.com/) · [github.com/ollama/ollama](https://github.com/ollama/ollama) |
| 🌐 **Open WebUI** | [docs.openwebui.com](https://docs.openwebui.com/) |
| 🤗 **Hugging Face** | [huggingface.co/models](https://huggingface.co/models) |
