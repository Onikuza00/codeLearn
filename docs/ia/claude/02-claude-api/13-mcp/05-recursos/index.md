# Recursos { .bloque-ia }

> Cómo un servidor MCP expone datos a los clientes, y cómo el cliente los lee para meterlos directamente en la petición a Claude.

---

## Qué es un recurso { .topic-title }

Los **recursos** de un servidor MCP permiten **exponer datos** a los clientes. Funcionan de forma parecida a los manejadores de peticiones `GET` de un servidor HTTP. Son ideales cuando hay que **obtener información**, no realizar una acción.

!!! tip "Recursos frente a herramientas"
    Los recursos **exponen datos**; las herramientas **realizan acciones**. Con un recurso, el contenido se puede incluir directamente en la petición, sin que Claude tenga que hacer una llamada a una herramienta para conseguirlo.

## Un ejemplo: mencionar documentos { .topic-title }

Imagina una función para mencionar documentos: el usuario escribe `@nombre_documento` para hacer referencia a un archivo. Hacen falta dos operaciones:

1. **Obtener la lista de todos los documentos** disponibles, para el autocompletado.
2. **Obtener el contenido de un documento concreto**, cuando se menciona.

Al escribir `@`, se muestran los documentos disponibles. Al enviar un mensaje con una mención, se inserta automáticamente el contenido de ese documento en el mensaje que llega a Claude.

## Cómo funcionan { .topic-title }

Los recursos siguen un patrón de **petición y respuesta**. El cliente envía una `ReadResourceRequest` con una **URI**, y el servidor MCP responde con los datos. Una **URI** es una dirección que identifica el recurso al que se quiere acceder.

### Dos tipos de recurso

| Tipo | Qué es | Ejemplo de URI |
|---|---|---|
| **Directo** | Una URI estática, que no cambia | `docs://documents` |
| **Con plantilla** | Una URI con parámetros | `docs://documents/{doc_id}` |

En los recursos con plantilla, el SDK de Python **extrae automáticamente los parámetros** de la URI y los pasa como argumentos con nombre a tu función. Los nombres de los parámetros de la URI se convierten en los argumentos de la función.

## Definir recursos en el servidor { .topic-title }

Se definen con el decorador `@mcp.resource()`.

### Recurso directo: la lista de documentos

```python
@mcp.resource(
    "docs://documents",
    mime_type="application/json"
)
def list_docs() -> list[str]:
    return list(docs.keys())
```

### Recurso con plantilla: un documento

```python
@mcp.resource(
    "docs://documents/{doc_id}",
    mime_type="text/plain"
)
def fetch_doc(doc_id: str) -> str:
    if doc_id not in docs:
        raise ValueError(f"Doc with id {doc_id} not found")
    return docs[doc_id]
```

### Tipos MIME

Un recurso puede devolver cualquier tipo de dato: cadenas, JSON, binarios... El parámetro `mime_type` le da al cliente una **pista** sobre qué tipo de dato recibe. Los más habituales:

- `application/json`: datos JSON estructurados.
- `text/plain`: texto plano.
- Cualquier otro tipo MIME válido para otros formatos.

El SDK **serializa automáticamente** los valores de retorno: no hace falta convertirlos a mano en cadenas JSON.

### Probarlos en el inspector

Arranca el servidor con el inspector:

```bash
uv run mcp dev mcp_server.py
```

Al conectar, el inspector muestra:

- **Resources:** los recursos directos (estáticos).
- **Resource Templates:** los recursos con plantilla, que aceptan parámetros.

Haz clic en cualquiera para probarlo y ver la **estructura exacta** de la respuesta que recibiría tu cliente.

## Leer recursos desde el cliente { .topic-title }

Una vez definidos, el cliente necesita una forma de pedirlos y usarlos. El cliente actúa como puente entre la aplicación y el servidor: gestiona la comunicación y el análisis de los datos.

Cuando el usuario quiere referirse a un documento (por ejemplo, escribiendo `@report.pdf`), la aplicación usa el cliente MCP para **obtener ese recurso** e **incluir su contenido directamente** en el mensaje que se envía a Claude.

### El método `read_resource`

Recibe una URI que identifica el recurso que se quiere leer:

```python
import json
from typing import Any

from mcp import types
from pydantic import AnyUrl

async def read_resource(self, uri: str) -> Any:
    result = await self.session().read_resource(AnyUrl(uri))
    resource = result.contents[0]

    if isinstance(resource, types.TextResourceContents):
        if resource.mimeType == "application/json":
            return json.loads(resource.text)

        return resource.text
```

Qué hace, paso a paso:

1. Llama a `read_resource` de la sesión con la URI.
2. La respuesta trae una lista `contents`. Normalmente solo hace falta el **primer elemento**, que contiene los datos y metadatos como el tipo MIME.
3. Según el **tipo MIME**, decide cómo interpretar el contenido: si es `application/json`, lo convierte en un objeto de Python con `json.loads`; si es texto plano, lo devuelve como cadena.

### Las importaciones

| Importación | Para qué sirve |
|---|---|
| `json` | Analizar las respuestas JSON. |
| `AnyUrl` (de `pydantic`) | Asegurar el tipo correcto del parámetro URI. |

### Probarlo en la aplicación

Si escribes algo como «¿Qué hay en el documento `@report.pdf`?», el sistema debería:

1. Mostrar los recursos disponibles en una **lista de autocompletado**.
2. Dejarte **seleccionar** uno.
3. **Obtener el contenido** del recurso automáticamente.
4. **Incluir ese contenido** en la petición a Claude.

La ventaja principal es que Claude recibe el contenido del documento directamente en la petición, sin necesidad de usar una herramienta para acceder a él. Las interacciones son más rápidas y eficientes.

!!! tip "Cada parte hace lo suyo"
    El cliente MCP se encarga de la comunicación con el servidor; la lógica de la aplicación se centra en cómo usar esos datos. `read_resource` es una pieza que el resto de la aplicación reutiliza para leer documentos, listar recursos disponibles o meter datos de recursos en las peticiones.

## Puntos clave { .topic-title }

- Los recursos **exponen datos**; las herramientas **realizan acciones**.
- Recursos **directos** para datos estáticos; recursos **con plantilla** para consultas con parámetros.
- Los **tipos MIME** ayudan al cliente a entender el formato de la respuesta.
- El SDK **serializa automáticamente**.
- Los nombres de los parámetros de una URI con plantilla se convierten en **argumentos de la función**.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
