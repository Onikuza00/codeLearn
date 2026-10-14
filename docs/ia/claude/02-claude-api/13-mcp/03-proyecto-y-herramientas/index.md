# Proyecto y herramientas MCP { .bloque-ia }

> Un chatbot de línea de comandos con un cliente y un servidor MCP propios, y cómo definir las herramientas del servidor con el SDK oficial de JavaScript.

---

## Qué se va a construir { .topic-title }

Para entender cómo interactúan un cliente y un servidor MCP, se construye un **chatbot de línea de comandos** con el que el usuario consulta una colección de documentos. Tiene dos componentes:

- Un **cliente MCP**, que gestiona las interacciones del usuario.
- Un **servidor MCP propio**, que gestiona las operaciones con los documentos.

El servidor ofrece **dos herramientas**: una para **leer** el contenido de un documento y otra para **editarlo**. Para simplificar, los documentos se guardan **en memoria**, sin base de datos.

!!! info "En un proyecto real casi nunca se hacen los dos"
    Lo normal es implementar **un cliente o un servidor**, no ambos. Un servidor MCP sirve para exponer tu servicio a otros desarrolladores. Un cliente MCP sirve para conectarte a servidores que ya existen. Aquí se construyen los dos con fines educativos, para ver cómo se comunican.

## Crear el servidor MCP { .topic-title }

Con el **SDK oficial de JavaScript** (`@modelcontextprotocol/sdk`), crear un servidor MCP es mucho más sencillo. En lugar de escribir a mano esquemas JSON complejos para cada herramienta, el SDK se encarga de generarlos a partir de un **esquema de zod**.

Instalar el SDK y `zod` (la librería de validación que describe la forma de cada parámetro):

```bash
pnpm add @modelcontextprotocol/sdk zod
```

Un servidor completo se inicializa con una sola llamada a `McpServer`:

```js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "document-mcp",
  version: "1.0.0"
});
```

Los documentos se guardan en un objeto simple de JS: las claves son los identificadores y los valores son el contenido.

```js
const docs = {
  "deposition.md": "Esta declaración recoge el testimonio de Angela Smith, P.E.",
  "report.pdf": "El informe detalla el estado de una torre condensadora de 20 m.",
  "financials.docx": "Estas cuentas resumen el presupuesto y los gastos del proyecto",
  "outlook.pdf": "Este documento presenta el rendimiento futuro previsto de la",
  "plan.md": "El plan describe los pasos para la implementación del proyecto.",
  "spec.txt": "Estas especificaciones definen los requisitos técnicos del equipo"
};
```

## Definir las herramientas con `registerTool` { .topic-title }

### Herramienta para leer un documento

La primera herramienta permite a Claude leer cualquier documento a partir de su ID:

```js
import { z } from "zod";

server.registerTool(
  "read_doc_contents",
  {
    title: "Leer documento",
    description: "Lee el contenido de un documento y lo devuelve como una cadena de texto.",
    inputSchema: {
      docId: z.string().describe("ID del documento que se quiere leer")
    }
  },
  async ({ docId }) => {
    if (!(docId in docs)) {
      throw new Error(`No se encontró ningún documento con el id ${docId}`);
    }

    return {
      content: [{ type: "text", text: docs[docId] }]
    };
  }
);
```

`registerTool()` **genera automáticamente el esquema JSON** que Claude necesita a partir del esquema de zod. El método `.describe()` de cada campo añade la descripción de ese parámetro, para que Claude entienda qué espera cada argumento.

### Herramienta para editar un documento

La segunda hace una operación sencilla de buscar y reemplazar dentro de un documento:

```js
server.registerTool(
  "edit_document",
  {
    title: "Editar documento",
    description: "Edita un documento reemplazando una cadena de texto en su contenido por otra nueva.",
    inputSchema: {
      docId: z.string().describe("ID del documento que se va a editar"),
      oldStr: z.string().describe("El texto que se quiere reemplazar. Debe coincidir exactamente, incluidos los espacios en blanco."),
      newStr: z.string().describe("El texto nuevo que se insertará en lugar del anterior.")
    }
  },
  async ({ docId, oldStr, newStr }) => {
    if (!(docId in docs)) {
      throw new Error(`No se encontró ningún documento con el id ${docId}`);
    }

    docs[docId] = docs[docId].replace(oldStr, newStr);

    return {
      content: [{ type: "text", text: `Documento ${docId} actualizado.` }]
    };
  }
);
```

Necesita tres parámetros: el ID del documento, el texto que se busca y el texto de reemplazo. Para simplificar, usa el método `replace()` que ya trae JS para las cadenas.

### Manejo de errores

Las dos herramientas gestionan el caso en que Claude pide un documento que no existe. Con un ID no válido lanzan una excepción `Error` con un mensaje descriptivo; el SDK la captura y se la devuelve a Claude como resultado con `isError`, para que pueda entenderla y actuar.

## Ventajas del SDK { .topic-title }

- **Genera el esquema JSON automáticamente** a partir del esquema de zod.
- **Código limpio y legible**, fácil de mantener.
- **Valida los parámetros** gracias a zod.
- **Menos código repetitivo** que escribir los esquemas a mano.
- **Seguridad de tipos** y soporte del editor durante el desarrollo.

Tú te centras en la lógica del negocio y el SDK se ocupa de los detalles del protocolo.

!!! tip "Existe un SDK también para Python"
    El curso usa el SDK de JavaScript, pero MCP también tiene un SDK oficial para Python. La idea es la misma: se definen las herramientas y el SDK genera los esquemas. Las instrucciones están en el [sitio oficial de MCP](https://modelcontextprotocol.io).

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Model Context Protocol — sitio oficial** | https://modelcontextprotocol.io |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
