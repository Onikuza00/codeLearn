# Prompts { .bloque-ia }

> Instrucciones predefinidas y bien probadas que un servidor MCP ofrece a los clientes, en lugar de que cada usuario escriba las suyas desde cero.

---

## Qué es un prompt de servidor MCP { .topic-title }

En un servidor MCP, un **prompt** (indicación) es una instrucción **predefinida y de alta calidad** que los clientes pueden usar en lugar de redactar la suya. Piénsalo como una plantilla cuidada que da mejores resultados que los que un usuario conseguiría por su cuenta.

Un prompt define un conjunto de **mensajes de usuario y de asistente** que el cliente puede enviar directamente a Claude.

## Por qué usarlos { .topic-title }

Supón que quieres que Claude convierta un documento a formato Markdown. Un usuario podría escribir «convierte `informe.pdf` a Markdown» y funcionaría. Pero con un prompt **bien probado**, que detalle el formato, la estructura y los requisitos de salida, el resultado suele ser mejor.

La idea es que los usuarios *podrían* hacerlo por sí mismos, pero obtienen resultados **más consistentes y de mayor calidad** con los prompts que los autores del servidor han desarrollado y probado a fondo.

## Cómo funcionan { .topic-title }

Cuando un cliente pide un prompt, el servidor le devuelve una **lista de mensajes** que se pueden enviar tal cual a Claude. La estructura básica es:

1. Se define el prompt con el decorador `@mcp.prompt()`.
2. Se le da un **nombre** y una **descripción**.
3. Se devuelve una **lista de mensajes** que forma la petición completa.

## Definir un prompt de formato { .topic-title }

Primero se importan los tipos de mensaje base:

```python
from mcp.server.fastmcp import base
```

Después se define la función del prompt:

```python
@mcp.prompt(
    name="format",
    description="Rewrites the contents of the document in Markdown format."
)
def format_document(
    doc_id: str = Field(description="Id of the document to format")
) -> list[base.Message]:
    prompt = f"""
Your goal is to reformat a document to be written with markdown syntax.

The id of the document you need to reformat is:
<document_id>
{doc_id}
</document_id>

Add in headers, bullet points, tables, etc as necessary. Feel free to add in extra formatting.
Use the 'edit_document' tool to edit the document. After the document has been reformatted...
"""

    return [
        base.UserMessage(prompt)
    ]
```

La función acepta parámetros (aquí `doc_id`), que se **interpolan** dentro del texto del prompt para insertar contenido dinámico.

### Probarlo en el inspector

En el inspector, entra en la sección **Prompts**, elige el que quieras e introduce los parámetros necesarios. El inspector muestra los **mensajes generados** que se enviarían a Claude.

Así compruebas que el prompt interpola bien las variables y produce la estructura de mensajes esperada antes de usarlo en una aplicación real.

## Usar prompts desde el cliente { .topic-title }

### Listar los prompts

El cliente necesita un método `list_prompts` para recuperar todos los prompts disponibles en el servidor:

```python
async def list_prompts(self) -> list[types.Prompt]:
    result = await self.session().list_prompts()
    return result.prompts
```

Llama al método de la sesión y devuelve el array de prompts del resultado.

### Obtener un prompt concreto

El método `get_prompt` recupera un prompt con sus argumentos ya interpolados:

```python
async def get_prompt(self, prompt_name, args: dict[str, str]):
    result = await self.session().get_prompt(prompt_name, args)
    return result.messages
```

Devuelve los mensajes del resultado, que forman una conversación lista para pasarla a Claude.

### Cómo llegan los argumentos

La función del prompt en el servidor puede aceptar parámetros; por ejemplo, el de formato espera un `doc_id`:

```python
def format_document(doc_id: str):
    # El doc_id se interpola en el prompt
    ...
```

Al llamar a `get_prompt`, el diccionario de argumentos tiene que contener **las claves que la función espera**. El servidor MCP las pasa como **argumentos con nombre** a la función, y así se inserta contenido dinámico en la plantilla.

### Probarlo en la línea de comandos

Al escribir una barra (`/`), los prompts disponibles aparecen como comandos. El flujo es:

1. El usuario **elige un comando** (por ejemplo, `format`).
2. El sistema **pide los argumentos** necesarios (por ejemplo, qué documento formatear), con las opciones disponibles.
3. El prompt completo, con los valores interpolados, **se envía a Claude**.
4. Claude puede usar herramientas para obtener más datos y completar la tarea.

## Buenas prácticas { .topic-title }

Al crear prompts para un servidor MCP:

- **Céntralos en el propósito del servidor:** tareas fundamentales para lo que hace.
- **Escribe instrucciones detalladas y específicas**, no peticiones vagas.
- **Pruébalos a fondo** con distintas entradas, antes de desplegarlos.
- **Incluye descripciones claras**, para que los usuarios entiendan qué hace cada uno.
- **Piensa cómo funcionan junto con las herramientas y los recursos** del servidor.
- **Decide qué argumentos** tendrá que aportar el usuario.

!!! tip "Lo que aportan los prompts"
    Los prompts están pensados para dar un valor que los usuarios no conseguirían fácilmente por su cuenta: reflejan la experiencia en el ámbito del servidor. Unen la funcionalidad predefinida con las necesidades dinámicas del usuario, dándole a Claude puntos de partida estructurados para tareas complejas y manteniendo la flexibilidad con la parametrización.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
