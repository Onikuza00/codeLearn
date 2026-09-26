# Proyecto y herramientas MCP { .bloque-ia }

> Un chatbot de línea de comandos con un cliente y un servidor MCP propios, y cómo definir las herramientas del servidor con el SDK oficial de Python.

---

## Qué se va a construir { .topic-title }

Para entender cómo interactúan un cliente y un servidor MCP, se construye un **chatbot de línea de comandos** con el que el usuario consulta una colección de documentos. Tiene dos componentes:

- Un **cliente MCP**, que gestiona las interacciones del usuario.
- Un **servidor MCP propio**, que gestiona las operaciones con los documentos.

El servidor ofrece **dos herramientas**: una para **leer** el contenido de un documento y otra para **editarlo**. Para simplificar, los documentos se guardan **en memoria**, sin base de datos.

!!! info "En un proyecto real casi nunca se hacen los dos"
    Lo normal es implementar **un cliente o un servidor**, no ambos. Un servidor MCP sirve para exponer tu servicio a otros desarrolladores. Un cliente MCP sirve para conectarte a servidores que ya existen. Aquí se construyen los dos con fines educativos, para ver cómo se comunican.

## Preparar el proyecto { .topic-title }

El curso proporciona el proyecto como un archivo `cli_project.zip`. Se descarga desde la lección y se extrae en la carpeta de desarrollo que prefieras. Su archivo README trae las instrucciones completas; los pasos son:

1. **Añadir la clave de la API de Anthropic** al archivo `.env`.
2. **Instalar las dependencias** con UV (recomendado) o con pip.
3. **Ejecutar la aplicación** para comprobar que todo funciona.

Los archivos principales del proyecto son `main.py`, `mcp_client.py` y `mcp_server.py`.

```bash
# Con UV (recomendado)
uv run main.py

# Con Python estándar
python main.py
```

Al arrancar aparece una ventana de chat. Se prueba con una pregunta sencilla, como «¿cuánto es 1+1?», y Claude debería responder enseguida. Con eso, el proyecto está listo para implementar las funciones de MCP.

## Crear el servidor MCP { .topic-title }

Con el **SDK oficial de Python**, crear un servidor MCP es mucho más sencillo. En lugar de escribir a mano esquemas JSON complejos para cada herramienta, el SDK se encarga de generarlos a partir de **decoradores** y **anotaciones de tipo**.

Un **decorador** es una función que se escribe encima de otra (con `@`) para añadirle comportamiento. Una **anotación de tipo** indica el tipo de un parámetro (`doc_id: str`).

Un servidor completo se inicializa con una sola línea:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("DocumentMCP", log_level="ERROR")
```

Los documentos se guardan en un diccionario simple de Python: las claves son los identificadores y los valores son el contenido.

```python
docs = {
    "deposition.md": "This deposition covers the testimony of Angela Smith, P.E.",
    "report.pdf": "The report details the state of a 20m condenser tower.",
    "financials.docx": "These financials outline the project's budget and expenditure",
    "outlook.pdf": "This document presents the projected future performance of the",
    "plan.md": "The plan outlines the steps for the project's implementation.",
    "spec.txt": "These specifications define the technical requirements for the equipment",
}
```

## Definir las herramientas con decoradores { .topic-title }

### Herramienta para leer un documento

La primera herramienta permite a Claude leer cualquier documento a partir de su ID:

```python
from pydantic import Field

@mcp.tool(
    name="read_doc_contents",
    description="Read the contents of a document and return it as a string."
)
def read_document(
    doc_id: str = Field(description="Id of the document to read")
):
    if doc_id not in docs:
        raise ValueError(f"Doc with id {doc_id} not found")

    return docs[doc_id]
```

El decorador `@mcp.tool` **genera automáticamente el esquema JSON** que Claude necesita. La clase `Field` de Pydantic añade la descripción de cada parámetro, para que Claude entienda qué espera cada argumento.

### Herramienta para editar un documento

La segunda hace una operación sencilla de buscar y reemplazar dentro de un documento:

```python
@mcp.tool(
    name="edit_document",
    description="Edit a document by replacing a string in the documents content with a new string."
)
def edit_document(
    doc_id: str = Field(description="Id of the document that will be edited"),
    old_str: str = Field(description="The text to replace. Must match exactly, including whitespace."),
    new_str: str = Field(description="The new text to insert in place of the old text.")
):
    if doc_id not in docs:
        raise ValueError(f"Doc with id {doc_id} not found")

    docs[doc_id] = docs[doc_id].replace(old_str, new_str)
```

Necesita tres parámetros: el ID del documento, el texto que se busca y el texto de reemplazo. Para simplificar, usa el método `replace()` que ya trae Python para las cadenas.

### Manejo de errores

Las dos herramientas gestionan el caso en que Claude pide un documento que no existe. Con un ID no válido lanzan una excepción `ValueError` con un mensaje descriptivo, que Claude puede entender y con el que puede actuar.

## Ventajas del SDK { .topic-title }

- **Genera el esquema JSON automáticamente** a partir de las anotaciones de tipo de Python.
- **Código limpio y legible**, fácil de mantener.
- **Valida los parámetros** gracias a Pydantic.
- **Menos código repetitivo** que escribir los esquemas a mano.
- **Seguridad de tipos** y soporte del editor durante el desarrollo.

Tú te centras en la lógica del negocio y el SDK se ocupa de los detalles del protocolo.

!!! tip "Existe un SDK también para JavaScript"
    El curso usa el SDK de Python, pero MCP también tiene un SDK oficial para TypeScript y JavaScript. La idea es la misma: se definen las herramientas y el SDK genera los esquemas. Las instrucciones están en el [sitio oficial de MCP](https://modelcontextprotocol.io).

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Model Context Protocol — sitio oficial** | https://modelcontextprotocol.io |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
