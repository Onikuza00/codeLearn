# Clientes MCP { .bloque-ia }

> El cliente MCP es el puente entre tu servidor y los servidores MCP: se encarga de todo el intercambio de mensajes para que tú solo pidas herramientas y las ejecutes.

---

## Qué hace un cliente MCP { .topic-title }

El **cliente MCP** es el puente de comunicación entre tu servidor y los servidores MCP. Es tu punto de acceso a todas las herramientas que ofrece un servidor MCP. Cuando necesitas usar herramientas o servicios externos, el cliente se ocupa del intercambio de mensajes y de los detalles del protocolo.

## Comunicación independiente del transporte { .topic-title }

Una de las grandes ventajas de MCP es que **no depende del medio de transporte**: el cliente y el servidor pueden comunicarse con distintos métodos. Un **transporte** es simplemente el canal por el que viajan los mensajes.

La configuración más común es ejecutar el cliente y el servidor MCP **en la misma máquina**, comunicándose por **entrada y salida estándar** (`stdin` y `stdout`, los mismos canales con los que un programa lee y escribe en la terminal).

Pero no es la única opción. También pueden conectarse mediante:

- **HTTP**
- **WebSockets**
- Otros protocolos de red

## Tipos de mensajes { .topic-title }

Una vez conectados, cliente y servidor intercambian mensajes de tipos concretos, definidos en la especificación de MCP. Los dos principales son:

| Mensaje | Qué ocurre |
|---|---|
| `ListToolsRequest` / `ListToolsResult` | El cliente pregunta al servidor «¿qué herramientas ofreces?» y recibe la lista de herramientas disponibles. |
| `CallToolRequest` / `CallToolResult` | El cliente pide al servidor que ejecute una herramienta concreta con unos argumentos, y recibe el resultado. |

## Ejemplo del flujo completo { .topic-title }

Veamos cómo encajan todas las piezas. Un usuario pregunta: «¿Qué repositorios tengo?». Este es el recorrido completo:

1. El usuario envía una consulta a **tu servidor**. Tu servidor sabe que, antes de llamar a Claude, tiene que darle la lista de herramientas disponibles.
2. Tu servidor pide las herramientas al **cliente MCP**, que envía un `ListToolsRequest` al servidor MCP y recibe un `ListToolsResult`.
3. Ahora tu servidor tiene todo lo necesario para la primera petición a Claude: la pregunta del usuario y las herramientas disponibles.
4. **Claude** examina las herramientas y decide que necesita llamar a una para responder. Contesta con una solicitud de uso de herramienta.
5. Tu servidor pide al cliente MCP que ejecute la herramienta solicitada. El cliente envía un `CallToolRequest` al servidor MCP, que hace la llamada real a **GitHub**.
6. GitHub devuelve los datos de los repositorios. Vuelven por el servidor MCP como un `CallToolResult`, luego al cliente MCP y por último a tu servidor.
7. Tu servidor envía el resultado de la herramienta a Claude en un mensaje de seguimiento. Claude ya tiene la información para responder.
8. Claude responde con el texto final y tu servidor lo devuelve al usuario.

Son muchos pasos, pero cada componente tiene una función clara.

!!! tip "Qué te ahorra el cliente"
    El cliente MCP **abstrae la complejidad** de comunicarse con el servidor MCP. Así puedes concentrarte en la lógica de tu aplicación en vez de en los detalles del protocolo.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Model Context Protocol — sitio oficial** | https://modelcontextprotocol.io |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
