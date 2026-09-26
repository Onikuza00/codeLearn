# Citations { .bloque-ia }

> Hacer que Claude indique de qué parte exacta de tus documentos sale cada dato de su respuesta, para que el usuario pueda comprobarlo.

---

## Por qué importan { .topic-title }

Cuando Claude responde a partir de un documento que le das, el usuario puede pensar que la respuesta sale simplemente de lo que Claude ya sabe de su entrenamiento. Sin más información, no tiene forma de comprobar el dato ni de saber que Claude se ha basado en ese documento concreto.

Las **citas** (*citations*) resuelven ese problema de transparencia: Claude señala el fragmento exacto del documento que respalda cada afirmación. Así queda un rastro claro desde la respuesta hasta la fuente.

## Cómo se activan { .topic-title }

Se añaden dos campos al bloque `document` del mensaje:

```js
{
  type: 'document',
  source: {
    type: 'base64',
    media_type: 'application/pdf',
    data: archivoBase64,
  },
  title: 'tierra.pdf',
  citations: { enabled: true },
}
```

| Campo | Para qué sirve |
|---|---|
| `title` | Da un nombre legible al documento. Es el que aparecerá en cada cita. |
| `citations: { enabled: true }` | Le dice a Claude que registre de dónde saca cada dato. |

## Estructura de una cita { .topic-title }

Con las citas activadas, la respuesta de Claude deja de ser un texto simple. Pasa a ser un dato estructurado que, para cada afirmación, incluye la información de su cita.

```json
{
  "type": "text",
  "text": "La atmósfera terrestre se formó por desgasificación volcánica.",
  "citations": [
    {
      "type": "page_location",
      "cited_text": "La atmósfera primitiva se originó a partir de gases liberados por los volcanes...",
      "document_index": 0,
      "document_title": "tierra.pdf",
      "start_page_number": 3,
      "end_page_number": 4
    }
  ]
}
```

Cada cita contiene:

| Campo | Qué es |
|---|---|
| `cited_text` | El texto **exacto** del documento que respalda lo que dice Claude. |
| `document_index` | Qué documento cita, por su posición. Útil cuando envías varios. |
| `document_title` | El título que le diste al documento. |
| `start_page_number` | Página donde empieza el texto citado. |
| `end_page_number` | Página donde termina el texto citado. |

## Interfaces con citas { .topic-title }

El valor real de las citas aparece al construir una interfaz que haga accesible esa información. Por ejemplo, marcadores en el texto que, al pasar el ratón por encima, muestren de dónde sale cada dato.

Con eso, el usuario puede:

- Ver que las respuestas de Claude se apoyan en material real.
- Comprobar el dato consultando el documento original.
- Entender el contexto que rodea cada dato citado.

## Citas con texto plano { .topic-title }

Las citas no se limitan a los PDF. También funcionan con fuentes de texto plano, cambiando la estructura del documento:

```js
{
  type: 'document',
  source: {
    type: 'text',
    media_type: 'text/plain',
    data: textoArticulo,
  },
  title: 'articulo_tierra',
  citations: { enabled: true },
}
```

!!! tip "Páginas en un PDF, posiciones en un texto"
    Un PDF tiene páginas, así que las citas indican **números de página**. Un texto plano no las tiene, así que las citas indican **posiciones de caracteres**: en qué punto del texto empieza y termina el fragmento citado.

## Cuándo usarlas { .topic-title }

Las citas son especialmente útiles cuando:

- Los usuarios necesitan **verificar la exactitud** de la información.
- Trabajas con **documentos de referencia** que los usuarios deben poder consultar.
- La **transparencia sobre las fuentes** es crítica para tu aplicación.
- Los usuarios pueden querer **explorar el contexto** que rodea un dato.

Con citas, Claude deja de ser una caja negra que da respuestas y se convierte en un asistente de investigación que enseña de dónde sale cada una. Eso genera confianza y permite al usuario profundizar en tus documentos cuando lo necesite.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Citations — documentación oficial** | https://docs.anthropic.com/en/docs/build-with-claude/citations |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
