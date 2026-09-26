# PDF support { .bloque-ia }

> Enviar un PDF a Claude para que lo lea y lo analice directamente: resúmenes, extracción de datos o consultas sobre su contenido.

---

## Qué es { .topic-title }

Claude puede leer y analizar archivos **PDF** directamente, sin que tengas que extraer el texto antes. Funciona casi igual que el envío de imágenes: se añade un bloque al mensaje del usuario, junto con el texto de la pregunta. Las diferencias están en el tipo de archivo y en cómo se nombra cada dato.

## Cómo se envía un PDF { .topic-title }

Se codifica el archivo en base64 y se envía dentro de un bloque de tipo `document`. Igual que con las imágenes, se hace porque la petición es JSON, que solo admite texto, y un PDF es un archivo binario. El motivo completo está en [Por qué se usa base64](../02-image-support/index.md#por-que-se-usa-base64).

```js
import { readFileSync } from 'node:fs';

const archivoBase64 = readFileSync('tierra.pdf').toString('base64');

const messages = [
  {
    role: 'user',
    content: [
      // Bloque de documento
      {
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: archivoBase64,
        },
      },
      // Bloque de texto
      {
        type: 'text',
        text: 'Resume el documento en una frase',
      },
    ],
  },
];
```

## Qué cambia respecto a las imágenes { .topic-title }

Al adaptar el código de imágenes para un PDF hay cuatro cambios:

| Elemento | Imagen | PDF |
|---|---|---|
| Archivo | `imagen.png` | `documento.pdf` |
| Nombre de la variable | `imagenBase64` | `archivoBase64` (más general, sirve para cualquier archivo) |
| `type` del bloque | `'image'` | `'document'` |
| `media_type` | `'image/png'` | `'application/pdf'` |

El resto de la estructura es idéntico: un array de bloques en `content`, con el bloque del archivo y el bloque de texto.

## Qué puede extraer Claude { .topic-title }

El procesamiento de PDFs va más allá de extraer texto. Claude puede analizar y entender:

- El **texto** de todo el documento.
- Las **imágenes y gráficos** incrustados en el PDF.
- Las **tablas** y las relaciones entre sus datos.
- La **estructura y el formato** del documento.

Por eso sirve como solución única para sacar cualquier tipo de información de un PDF: un resumen, un análisis de datos o la extracción de un contenido concreto.

!!! tip "Sin paso previo de extracción"
    Con otras herramientas habría que convertir el PDF a texto y perder las tablas, los gráficos y el formato por el camino. Aquí se envía el PDF tal cual y Claude trabaja con todo lo que contiene.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **PDF support — documentación oficial** | https://docs.anthropic.com/en/docs/build-with-claude/pdf-support |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
