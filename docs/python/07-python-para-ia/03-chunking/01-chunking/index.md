# Chunking { .section-python .bloque-python }

> Antes de buscar en un documento hay que partirlo en trozos (chunks). El tamaño, el solape y el criterio de corte (caracteres, párrafos, frases) cambian lo que encuentra la búsqueda. Aquí tienes las tres estrategias con código, cómo añadir metadatos y una comparación honesta con datos de juguete.

---

## Por qué trocear {: .topic-title }

Un modelo de lenguaje tiene un límite de contexto y cada token cuesta, así que no se le pasa todo el documento: se le pasan **solo los fragmentos relevantes**. Para poder recuperar fragmentos hay que **partir** los documentos antes de indexarlos. A cada trozo se le llama **chunk**.

Elegir cómo partir es un equilibrio:

| Trozo | Ventaja | Problema |
|---|---|---|
| Muy pequeño | Preciso: encuentra justo la frase | Pierde contexto («esto» ¿de qué habla?) |
| Muy grande | Conserva contexto | Mezcla varios temas; el embedding se «diluye» y gasta más tokens |

No hay un tamaño universal: depende de los documentos y de las preguntas. Se decide **midiendo** ([Evals](../../05-evals/01-evals/index.md)).

El código de estos ejemplos (el módulo `chunking.py`) está completo en el [capítulo final del pilar](../../06-python-en-ia/01-rag-de-documentos-propios/index.md). Sus trozos son objetos `Chunk` (una dataclass inmutable) con `id`, `doc_id`, `title`, `text` y `metadata`.

---

## Tres estrategias {: .topic-title }

**1. El script**

```python
# chunk_demo.py
from ragofertas.chunking import chunk_by_paragraph, chunk_by_sentences, chunk_fixed
from ragofertas.corpus import DOCUMENTS

document = DOCUMENTS[1]
print(len(document["text"]), "caracteres")

pieces = chunk_fixed(document["text"], size=120)
print(len(pieces), [len(piece) for piece in pieces])
print(repr(pieces[0]))
print(repr(pieces[1][:40]))

overlapped = chunk_fixed(document["text"], size=120, overlap=30)
print(len(overlapped))
print(repr(pieces[0][-30:]))
print(repr(overlapped[1][:30]))

for chunk in chunk_by_paragraph(document):
    print(chunk.id, chunk.metadata, len(chunk.text), "|", chunk.text[:45])

print("--- por frases (máx. 160 caracteres, 1 frase de solape)")
for chunk in chunk_by_sentences(document, max_chars=160, overlap_sentences=1):
    print(chunk.id, chunk.metadata, "|", chunk.text[:70], "...")

for size, overlap in [(0, 0), (50, 50)]:
    try:
        chunk_fixed("texto", size=size, overlap=overlap)
    except ValueError as error:
        print("ValueError:", error)
```

**2. Cómo se ejecuta**

```bash
python chunk_demo.py
```

**3. Qué pasa por dentro.** Se parte la misma oferta (282 caracteres) de tres maneras:

- **`chunk_fixed(texto, size, overlap)`**: cortes de tamaño fijo en caracteres. Es lo más simple y lo más «tonto»: corta donde toque, aunque sea a mitad de palabra.
- **`chunk_by_paragraph`**: un trozo por párrafo (separados por línea en blanco). Respeta la estructura que ya puso quien escribió.
- **`chunk_by_sentences`**: agrupa frases enteras hasta un máximo de caracteres, repitiendo la última frase de cada trozo en el siguiente (el solape).

**4. La salida**

```text
282 caracteres
3 [120, 120, 42]
'Data Corp ofrece un puesto de Backend Developer en Barcelona con un salario de 41000 euros anuales.\n\nSe trabaja con Pyth'
'on, SQL y APIs REST. El puesto es presen'
3
' anuales.\n\nSe trabaja con Pyth'
' anuales.\n\nSe trabaja con Pyth'
backend#1 {'paragraph': 1} 99 | Data Corp ofrece un puesto de Backend Develop
backend#2 {'paragraph': 2} 91 | Se trabaja con Python, SQL y APIs REST. El pu
backend#3 {'paragraph': 3} 88 | Se pide experiencia diseñando bases de datos 
--- por frases (máx. 160 caracteres, 1 frase de solape)
backend#1 {'sentences': 2} | Data Corp ofrece un puesto de Backend Developer en Barcelona con un sa ...
backend#2 {'sentences': 2} | Se trabaja con Python, SQL y APIs REST. El puesto es presencial en la  ...
backend#3 {'sentences': 2} | El puesto es presencial en la oficina de Barcelona. Se pide experienci ...
ValueError: size debe ser mayor que 0
ValueError: overlap debe estar entre 0 y size - 1
```

Lo que enseña:

- **Corte por caracteres**: el primer trozo termina en `Pyth` y el segundo empieza en `on`. Un corte a mitad de palabra rompe el significado y el embedding.
- **Solape (`overlap`)**: con 30 caracteres de solape, el segundo trozo **repite** el final del primero (`' anuales.\n\nSe trabaja con Pyth'`). Así, una idea que cae en la frontera aparece entera en al menos un trozo. El coste: más trozos y texto repetido.
- **Párrafos**: trozos limpios y autocontenidos, de unos 90 caracteres, con metadato `paragraph`.
- **Frases con solape de una frase**: cada trozo repite la frase final del anterior, por lo que cada uno tiene 2 frases.
- Se valida la entrada: tamaño positivo y solape menor que el tamaño.

---

## Metadatos {: .topic-title }

Cada trozo lleva **metadatos**: de qué documento viene (`doc_id`), su título y su posición (`paragraph`, `sentences`). Son imprescindibles para:

- **Citar fuentes**: «según *Oferta Backend Developer*, párrafo 1».
- **Filtrar** (solo ofertas, solo un documento, solo un rango de fechas).
- **Reconstruir contexto**: traer también el párrafo anterior o siguiente de un trozo encontrado.
- **Depurar**: saber de dónde salió un resultado extraño.

El `id` (`backend#1`) combina el documento y el número de trozo, y sirve de identificador estable (lo usan las evaluaciones del [pilar siguiente](../../05-evals/01-evals/index.md)).

!!! tip "Pon el título del documento en el texto que se indexa"
    Un fragmento como «El salario es de 41000 euros» no dice de qué puesto habla. Antepón el título al texto del trozo antes de calcular el embedding (o inclúyelo en el contexto del prompt, como hace el proyecto con `[1] (Oferta Backend Developer) ...`).

---

## Comparar estrategias con datos reales {: .topic-title }

Una comparación mínima: las 6 notas del corpus, partidas de tres maneras, y 4 preguntas con el documento que debería encontrarse. Se mide si el resultado número 1 pertenece al documento esperado.

```python
# chunk_compare.py
from ragofertas.chunking import Chunk, chunk_by_paragraph, chunk_by_sentences
from ragofertas.corpus import DOCUMENTS
from ragofertas.embeddings import TfidfEmbedder
from ragofertas.store import InMemoryStore

QUESTIONS = {
    "¿Cuánto se paga en el puesto de backend en Barcelona?": "backend",
    "¿Qué oferta es totalmente remota?": "ml",
    "¿Dónde se necesita experiencia con pytest?": "backend",
    "¿Qué herramientas usa el analista de datos?": "analyst",
}

whole = [Chunk(id=d["id"], doc_id=d["id"], title=d["title"], text=d["text"]) for d in DOCUMENTS]
by_paragraph = [c for d in DOCUMENTS for c in chunk_by_paragraph(d)]
by_sentences = [c for d in DOCUMENTS for c in chunk_by_sentences(d, max_chars=100, overlap_sentences=0)]

for name, chunks in [("documento entero", whole), ("párrafos", by_paragraph), ("frases", by_sentences)]:
    store = InMemoryStore(TfidfEmbedder())
    store.index(chunks)
    found = 0
    first_scores = []
    for question, expected_doc in QUESTIONS.items():
        hits = store.search(question, k=1)
        found += hits[0].chunk.doc_id == expected_doc
        first_scores.append(hits[0].score)
    average_length = sum(len(c.text) for c in chunks) / len(chunks)
    print(f"{name:17} {len(chunks):3} fragmentos | {average_length:5.0f} car. de media | acierta {found}/{len(QUESTIONS)} | puntuación media {sum(first_scores) / len(first_scores):.2f}")
```

```text
documento entero    6 fragmentos |   263 car. de media | acierta 3/4 | puntuación media 0.30
párrafos           18 fragmentos |    86 car. de media | acierta 4/4 | puntuación media 0.38
frases             19 fragmentos |    82 car. de media | acierta 4/4 | puntuación media 0.38
```

Con documentos enteros se falla una pregunta (el texto grande mezcla temas) y la puntuación media baja; con párrafos o frases se acierta todo y la coincidencia es más nítida.

!!! warning "Esto es un juguete, no una conclusión"
    Son 6 documentos, 4 preguntas y un buscador léxico. Sirve para ver el mecanismo, no para concluir que «los párrafos son mejores». Con tus documentos y preguntas, el resultado puede ser otro: **mídelo** con un conjunto de evaluación mayor.

---

## Criterios para elegir {: .topic-title }

| Si tus documentos son... | Prueba primero... |
|---|---|
| Texto con párrafos bien separados | Por párrafo |
| Texto corrido, sin estructura | Por frases agrupadas, con solape |
| Código | Por función o por clase (no por caracteres) |
| Tablas, listas de datos | Un trozo por fila o por grupo de filas |
| Páginas largas de documentación | Por secciones (títulos), con el título en los metadatos |

Y recuerda estos puntos:

- **Mide el tamaño en tokens, no en caracteres**, si lo que te importa es el límite del contexto. Una estimación aproximada es dividir los caracteres entre 4 en inglés (en español suele haber más tokens por texto), y la medida exacta la da un contador de tokens del modelo (la API de Claude ofrece un endpoint para contar tokens).
- **Solape pequeño** (10-20 % del tamaño) suele bastar; mucho solape multiplica el índice sin ganar nada.
- **Los trozos deben poder entenderse solos**: si empiezan con «Esto» o «Además», pierden sentido.

---

## Python en IA {: .topic-title }

El chunking es la decisión de diseño que más afecta a la calidad de un RAG, y la que más se ignora. Un mal troceado produce respuestas flojas aunque el modelo sea excelente: si el dato que necesitas no está entero en ningún trozo, no hay modelo que lo arregle.

!!! tip "Guarda el chunking como parámetros, no como código"
    `size`, `overlap`, `max_chars` y la estrategia deben ser configuración (`Settings`). Así puedes probar combinaciones en las evaluaciones sin cambiar código.

!!! info "Qué es criterio propio y no está en la documentación"
    Todo el capítulo es criterio propio sobre una práctica habitual de RAG: la tabla de criterios, la comparación (de juguete) y los consejos. No hay una fuente oficial que fije tamaños recomendados; la documentación de Anthropic sobre embeddings y contexto es un apoyo general. La estimación «caracteres entre 4» es una regla del pulgar sin fuente.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `text.slice(i, i + size)` en un bucle | `text[i:i + size]` ([slicing](../../../02-estructuras-de-datos/01-listas-y-tuplas/01-listas/index.md#slicing)) |
| `text.split(/\n\s*\n/)` | `re.split(r"\n\s*\n", text)` |
| `LangChain` / librerías de splitters | A mano (50 líneas) o librerías específicas |
| `{ id, text, metadata }` (objeto) | `Chunk` (dataclass inmutable) |

!!! tip "Consejos"
    - **Corta por la estructura del texto** (párrafos, frases, secciones) antes que por caracteres.
    - **Metadatos desde el principio**: `doc_id`, título y posición.
    - **Prueba 2-3 estrategias y mídelas**.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye expresiones regulares ni procesamiento de documentos | — |
| **Documentación oficial** | |
| Python — `re.split` | <https://docs.python.org/3/library/re.html#re.split> |
| Python — Tutorial: cadenas y *slicing* | <https://docs.python.org/3/tutorial/introduction.html#text> |
| Anthropic — Contar tokens | <https://platform.claude.com/docs/en/build-with-claude/token-counting> |
| Anthropic — Embeddings | <https://platform.claude.com/docs/en/build-with-claude/embeddings> |
