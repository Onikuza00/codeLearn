# Code execution y Files API { .bloque-ia }

> Dos funciones de la API que funcionan muy bien juntas: subir archivos por adelantado y dejar que Claude ejecute código sobre ellos.

---

## Files API { .topic-title }

La **Files API** es una forma alternativa de enviar archivos. En lugar de codificar una imagen o un PDF en [base64](../02-image-support/index.md#por-que-se-usa-base64) dentro de cada mensaje, subes el archivo **una vez, por adelantado**, y después lo referencias.

El proceso tiene tres pasos:

1. **Subes** el archivo (imagen, PDF, texto...) con una llamada aparte a la API.
2. Recibes un **objeto de metadatos** que incluye un **ID único** del archivo.
3. En los mensajes siguientes, **usas ese ID** en lugar de incluir los datos del archivo.

Es especialmente útil cuando quieres usar **el mismo archivo varias veces**, o cuando trabajas con archivos grandes que resultarían incómodos de incluir en cada petición.

## La herramienta de ejecución de código { .topic-title }

La **code execution tool** (herramienta de ejecución de código) es una herramienta **de servidor**: no tienes que escribir su implementación. Solo incluyes su esquema, que ya viene definido, en la petición, y Claude puede **ejecutar código Python** cuando lo considere necesario.

Ese código se ejecuta en un **contenedor Docker aislado**. Un contenedor es un entorno cerrado donde el código corre separado del resto del sistema. Características de este entorno:

- Está **aislado**: cada ejecución ocurre en su propio contenedor.
- **No tiene acceso a red**: el código no puede llamar a APIs externas.
- Claude puede **ejecutar código varias veces** durante una misma conversación.
- Claude recoge los resultados y los **interpreta** para escribir la respuesta final.

## Combinarlas { .topic-title }

El verdadero valor aparece al usar las dos a la vez. Como el contenedor **no tiene red**, la Files API pasa a ser la vía principal para **meter y sacar datos** del entorno de ejecución.

Un flujo típico:

1. **Subes** el archivo de datos (por ejemplo un CSV) con la Files API.
2. Incluyes en el mensaje un bloque `container_upload` con el ID del archivo.
3. Le pides a Claude que **analice** los datos.
4. Claude **escribe y ejecuta código** para procesar el archivo.
5. Claude puede **generar archivos** (por ejemplo gráficos) que luego descargas.

## Ejemplo: por qué se dan de baja los usuarios { .topic-title }

El CSV de ejemplo contiene datos de usuarios de un servicio de vídeo en streaming: su plan de suscripción, sus hábitos de visionado y si se han dado de baja (*churn*, abandono de clientes).

Primero se sube el archivo con una función auxiliar:

```js
const metadatos = await subirArchivo('streaming.csv');
```

Después se crea un mensaje que lleva a la vez el archivo subido y la petición de análisis, y se activa la herramienta:

```js
const messages = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: `Haz un análisis detallado para determinar los principales motivos de baja.
Tu resultado final debe incluir al menos un gráfico detallado que resuma tus conclusiones.`,
      },
      { type: 'container_upload', file_id: metadatos.id },
    ],
  },
];

const respuesta = await chat(messages, {
  tools: [{ type: 'code_execution_20250522', name: 'code_execution' }],
});
```

!!! warning "El identificador de la herramienta lleva una fecha"
    `code_execution_20250522` incluye la fecha de su versión, y las versiones nuevas cambian el identificador. Además, según la versión, estas funciones pueden requerir activarse con una cabecera *beta*. Comprueba el valor vigente en la [documentación oficial](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool).

## Qué devuelve la respuesta { .topic-title }

Cuando Claude usa la ejecución de código, la respuesta trae **varios tipos de bloque**:

| Bloque | Qué contiene |
|---|---|
| Bloque de **texto** | El análisis y las explicaciones de Claude. |
| Bloque de **uso de herramienta de servidor** (`server_tool_use`) | El código que Claude decidió ejecutar. |
| Bloque de **resultado de la ejecución** (`code_execution_tool_result`) | La salida de ejecutar ese código. |

Claude puede ejecutar código **varias veces** en una misma respuesta, construyendo el análisis poco a poco. Cada ciclo incluye el código y su resultado.

## Descargar los archivos generados { .topic-title }

Claude también puede **generar archivos** (gráficos, informes...) y dejarlos disponibles para descargar. Cuando crea una visualización, queda guardada en el contenedor y se descarga con la Files API.

Se buscan en la respuesta los bloques de tipo `code_execution_output`, que contienen los **ID de archivo** de lo generado, y se descargan con esos ID:

```js
await descargarArchivo('id_de_archivo_de_la_respuesta');
```

El resultado es un análisis completo con visualizaciones profesionales, que habría costado mucho código manual.

!!! tip "`subirArchivo` y `descargarArchivo` son funciones auxiliares"
    En el ejemplo, `subirArchivo` y `descargarArchivo` son funciones propias que envuelven las llamadas del SDK a la Files API. Su implementación exacta depende de la versión del SDK: consúltala en la [documentación de la Files API](https://docs.anthropic.com/en/docs/build-with-claude/files).

## Más allá del análisis de datos { .topic-title }

El análisis de datos es el caso más natural, pero combinar la Files API con la ejecución de código permite mucho más:

- **Procesar y modificar imágenes.**
- **Analizar y transformar documentos.**
- **Cálculos matemáticos y modelos.**
- **Generar informes** con formato personalizado.

La idea clave: puedes **delegar tareas computacionales complejas** en Claude y, al mismo tiempo, **controlar las entradas y las salidas** mediante la Files API. Claude se convierte en un asistente de programación que además **ejecuta el código y lo va corrigiendo** hasta llegar a una solución.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Code execution tool — documentación oficial** | https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool |
| 📘 **Files API — documentación oficial** | https://docs.anthropic.com/en/docs/build-with-claude/files |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
