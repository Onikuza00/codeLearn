# Inspector y cliente { .bloque-ia }

> Probar un servidor MCP sin conectarlo a una aplicación completa, y escribir el cliente que permite a tu aplicación usar sus herramientas.

---

## El inspector del servidor { .topic-title }

Al crear un servidor MCP hace falta una forma de **probarlo sin montar la aplicación entera**. El SDK de Python incluye un **inspector** integrado, que se abre en el navegador y permite depurar el servidor en tiempo real.

### Arrancarlo

Primero hay que tener **activado el entorno de Python** del proyecto (el README indica el comando exacto). Después:

```bash
mcp dev mcp_server.py
```

Esto inicia un servidor de desarrollo en el puerto `6277` y muestra una **URL local** para abrir en el navegador, donde aparece el panel del MCP Inspector.

!!! info "La interfaz puede cambiar"
    El inspector está en desarrollo activo, así que su aspecto puede diferir de lo que ves en la documentación. La funcionalidad principal (probar herramientas, recursos y prompts) se mantiene parecida.

### Conectar y probar herramientas

1. Pulsa **Connect** (conectar), a la izquierda, para arrancar el servidor. Aparece una barra de navegación con las secciones de **Resources**, **Prompts**, **Tools** y otras.
2. Entra en la sección **Tools**.
3. Pulsa **List Tools** para ver todas las herramientas disponibles.
4. Elige una herramienta: se abre su panel de pruebas.
5. Rellena los **parámetros** requeridos.
6. Pulsa **Run Tool** para ejecutarla y ver el resultado.

Por ejemplo, para probar la herramienta de lectura de documentos, introduces el ID del documento (como `deposition.md`) y la ejecutas. El inspector muestra el contenido devuelto y el mensaje de éxito.

Puedes **encadenar operaciones** para verificar el funcionamiento. Tras editar un documento reemplazando un texto, ejecutas enseguida la herramienta de lectura para comprobar que el cambio se aplicó.

### Ciclo de desarrollo

El inspector da un ciclo de trabajo eficiente:

1. Cambias el código del servidor MCP.
2. Pruebas cada herramienta por separado en el inspector.
3. Compruebas los resultados sin configurar la aplicación completa.

Se vuelve imprescindible a medida que los servidores se complican, porque **permite depurar de forma aislada**, sin conectar el servidor a Claude ni a otra aplicación solo para comprobar lo básico.

## Implementar el cliente { .topic-title }

Con el servidor funcionando, toca el **cliente**: lo que permite que tu aplicación se comunique con el servidor MCP y use su funcionalidad.

### Dos piezas

En la mayoría de los proyectos reales se implementa un cliente **o** un servidor MCP, no los dos. Aquí se hacen ambos para ver cómo trabajan juntos. El cliente tiene dos componentes:

| Componente | Qué es |
|---|---|
| **Cliente MCP** (`MCPClient`) | Una clase propia que se crea para facilitar el uso de la sesión. |
| **Sesión del cliente** (`ClientSession`) | La conexión real con el servidor. Forma parte del SDK de Python. |

La sesión necesita **liberar sus recursos** correctamente cuando termina (cerrar la conexión, por ejemplo). Por eso se envuelve en la clase `MCPClient`, que se encarga de esa limpieza automáticamente.

### Qué necesita la aplicación

El código de la aplicación necesita hacer **dos cosas** con el servidor MCP:

1. **Obtener la lista de herramientas** disponibles, para enviarla a Claude.
2. **Ejecutar una herramienta** cuando Claude la pida.

El cliente ofrece las dos como métodos sencillos: `list_tools()` y `call_tool()`.

### `list_tools()`

Obtiene todas las herramientas del servidor:

```python
async def list_tools(self) -> list[types.Tool]:
    result = await self.session().list_tools()
    return result.tools
```

Accede a la sesión (la conexión con el servidor), llama a su método `list_tools()` y devuelve las herramientas del resultado.

### `call_tool()`

Ejecuta una herramienta concreta en el servidor:

```python
async def call_tool(
    self, tool_name: str, tool_input: dict
) -> types.CallToolResult | None:
    return await self.session().call_tool(tool_name, tool_input)
```

Envía al servidor el nombre de la herramienta y sus argumentos (que ha decidido Claude) y devuelve el resultado.

### Probar el cliente

El archivo incluye un pequeño entorno de prueba que se conecta al servidor y llama a los métodos:

```python
async with MCPClient(
    command="uv", args=["run", "mcp_server.py"]
) as client:
    result = await client.list_tools()
    print(result)
```

Al ejecutarlo se imprimen las definiciones de las herramientas, incluidas `read_doc_contents` y `edit_document`.

### El flujo completo

Con el cliente listo, la aplicación funciona así cuando preguntas por un documento:

1. El código usa el cliente para **obtener las herramientas** disponibles.
2. Las herramientas se **envían a Claude** junto con la pregunta del usuario.
3. Claude decide usar `read_doc_contents`.
4. El código usa el cliente para **ejecutar esa herramienta**.
5. El resultado se envía de vuelta a Claude, que responde al usuario.

Por ejemplo, «¿Cuál es el contenido del documento `report.pdf`?» hace que Claude use la herramienta de lectura y obtenga el texto del informe sobre la torre condensadora.

!!! tip "El cliente como puente"
    El cliente conecta la lógica de tu aplicación con el servidor MCP, y te permite usar su funcionalidad sin preocuparte de los detalles de la conexión.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
