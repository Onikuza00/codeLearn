# Embeddings y similitud { .section-python .bloque-python }

> Un embedding convierte un texto en una lista de números de modo que los textos parecidos queden «cerca». Aquí construyes la similitud coseno desde cero con NumPy, buscas con una multiplicación de matrices y ves la diferencia entre un embedding de palabras compartidas y uno que entiende el significado.

---

## Qué es un embedding {: .topic-title }

Un **embedding** es un **vector** (una lista de números, de longitud fija) que representa un texto. La idea clave: un modelo de embeddings está entrenado para que **textos con significado parecido den vectores cercanos**. Con eso, buscar «lo más parecido a esta pregunta» se reduce a **medir distancias** entre vectores.

Un embedding real tiene cientos o miles de dimensiones. Para verlo, aquí van vectores de 3 dimensiones inventados.

!!! info "Anthropic no ofrece un modelo de embeddings propio"
    La documentación oficial lo dice así: «Anthropic no ofrece su propio modelo de embeddings», y recomienda como ejemplo de proveedor a **Voyage AI**, aunque anima a evaluar varios. Con Claude se **genera** texto; los embeddings vienen de otro modelo (Voyage AI, un modelo local con `sentence-transformers`, u otro proveedor).

---

## Similitud coseno desde cero {: .topic-title }

Para comparar dos vectores se usa el **coseno** del ángulo entre ellos. Da `1` si apuntan en la misma dirección (muy parecidos), `0` si son perpendiculares (sin relación) y `-1` si son opuestos. Es el producto escalar dividido por el producto de las longitudes:

**1. El script**

```python
# cosine.py
import numpy as np

# Vectores de juguete de 3 dimensiones (un embedding real tiene cientos o miles)
python_job = np.array([0.9, 0.1, 0.2])
python_job_2 = np.array([0.8, 0.2, 0.1])
cooking = np.array([0.1, 0.9, 0.3])


def cosine_similarity(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


print(round(cosine_similarity(python_job, python_job_2), 3))
print(round(cosine_similarity(python_job, cooking), 3))
print(round(cosine_similarity(python_job, python_job * 10), 3))
print(round(cosine_similarity(python_job, -python_job), 3))

# Con vectores normalizados (longitud 1), el producto escalar ya es la similitud coseno
unit = lambda vector: vector / np.linalg.norm(vector)
print(round(float(np.dot(unit(python_job), unit(python_job_2))), 3))

# Muchos documentos a la vez: una multiplicación de matrices
documents = np.array([python_job_2, cooking, python_job * 3])
documents = documents / np.linalg.norm(documents, axis=1, keepdims=True)
scores = documents @ unit(python_job)
print(np.round(scores, 3))
print(np.argsort(scores)[::-1])
print(np.round(np.linalg.norm(python_job - python_job * 10), 2))

with np.errstate(invalid="ignore"):
    print(cosine_similarity(python_job, np.zeros(3)))
```

**2. Cómo se ejecuta** (en un entorno con NumPy: `python -m pip install numpy`)

```bash
python cosine.py
```

**3. Qué pasa por dentro.** `np.dot(a, b)` multiplica los vectores elemento a elemento y suma. `np.linalg.norm(a)` es la longitud del vector. El cociente es el coseno. NumPy hace estas operaciones sobre todo el array de golpe, sin bucles de Python.

**4. La salida**

```text
0.987
0.271
1.0
-1.0
0.987
[0.987 0.271 1.   ]
[2 0 1]
8.35
nan
```

- `0.987`: dos textos sobre el mismo tema. `0.271`: trabajo frente a cocina.
- `1.0` con `python_job * 10`: el coseno **ignora la longitud**; solo importa la dirección. Un texto largo y uno corto sobre lo mismo pueden ser muy parecidos. La distancia normal (`norm(a - b)`, 8.35) sí se ve afectada por la longitud.
- `-1.0`: vectores opuestos.
- **Normalizar** (dividir por la longitud) deja vectores de longitud 1, y entonces la similitud coseno es **solo el producto escalar**. Por eso las bases de vectores guardan los vectores normalizados.
- **`documents @ vector`** calcula la similitud con **todos** los documentos de una vez (multiplicación de matriz por vector) y devuelve un array de puntuaciones.
- **`np.argsort(scores)[::-1]`** da los índices ordenados de mayor a menor: el primero es el documento más parecido (el índice 2, con puntuación 1).
- Con un vector de ceros, la división es `0/0` y da `nan`. Hay que protegerse (en el código del capítulo de RAG la función devuelve `0.0`).

!!! warning "Coseno no es probabilidad"
    `0.987` no significa «98,7 % seguro». Solo se puede comparar contra otras puntuaciones del mismo modelo de embeddings. Cada modelo tiene su propia escala.

---

## Un embedding léxico (y sus límites) {: .topic-title }

Para practicar sin descargar nada, el proyecto del pilar usa un **embedding léxico**: TF-IDF. Cada dimensión es una palabra del vocabulario y el valor mide cuánto aparece y lo rara que es en el conjunto (las palabras comunes pesan poco). Es un embedding «de palabras compartidas»: **no entiende el significado**. Sirve para ver todo el mecanismo con una herramienta transparente.

```python
# lexical.py
from ragofertas.embeddings import TfidfEmbedder, cosine_similarity, tokenize

sentences = [
    "Busco un puesto de Backend Developer en Barcelona",
    "Oferta de Backend Developer en la oficina de Barcelona",
    "Quiero cocinar paella para la cena",
    "Se ofrece teletrabajo total",
    "El trabajo es totalmente remoto",
]

print(tokenize(sentences[0]))

embedder = TfidfEmbedder().fit(sentences)
vectors = embedder.embed(sentences)
print(vectors.shape)
print(round(float(vectors[0] @ vectors[1]), 2), "backend con backend")
print(round(float(vectors[0] @ vectors[2]), 2), "backend con paella")
print(round(float(vectors[3] @ vectors[4]), 2), "teletrabajo con remoto (mismo significado)")
print(round(cosine_similarity(vectors[0], vectors[1]), 2))
```

```text
['busco', 'puesto', 'backend', 'developer', 'barcelona']
(5, 17)
0.49 backend con backend
0.0 backend con paella
0.0 teletrabajo con remoto (mismo significado)
0.49
```

(La clase `TfidfEmbedder`, con `tokenize`, está en el [capítulo final del pilar](../../06-python-en-ia/01-rag-de-documentos-propios/index.md).)

- `tokenize` pasa a minúsculas, quita tildes y signos y descarta palabras vacías: `['busco', 'puesto', 'backend', 'developer', 'barcelona']`.
- La matriz es de `5 × 17`: 5 frases, 17 palabras distintas en el vocabulario.
- Frases que comparten palabras (`backend`, `barcelona`) salen parecidas (`0.49`); las que no comparten nada, no (`0.0`).
- **El límite:** «teletrabajo» y «remoto» significan lo mismo, pero no comparten ninguna palabra: la similitud es `0.0`. Un embedding **semántico** sí los acercaría.

!!! warning "Un embedding léxico falla con sinónimos y paráfrasis"
    Si la pregunta usa palabras distintas a las del documento («teletrabajo» frente a «remoto», «sueldo» frente a «salario»), un buscador léxico no lo encontrará. Es la razón de usar embeddings semánticos.

---

## Embeddings de verdad {: .topic-title }

Un modelo semántico entra por la misma puerta: recibe textos y devuelve vectores. Dos opciones:

**Un modelo local con `sentence-transformers`** (gratis, pero instala PyTorch, que ocupa varios gigas; **no se ha instalado ni ejecutado en este curso**, así que lo siguiente es un esbozo sin salida verificada):

```python
# NO EJECUTADO AQUÍ: esbozo de uso
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
vectors = model.encode(["Se ofrece teletrabajo total", "El trabajo es totalmente remoto"], normalize_embeddings=True)
print(vectors.shape)  # (2, dimensión del modelo)
```

**Un servicio**, como los modelos de Voyage AI que recomienda la documentación de Anthropic: envías los textos por HTTP o con su SDK y recibes los vectores.

Lo importante para tu código: ambos cumplen el mismo contrato que `TfidfEmbedder`, **una función `embed(textos) -> matriz`**. Si tu almacén solo depende de esa interfaz, cambiar de embedding es cambiar una clase.

Cosas que tener en cuenta con embeddings reales:

- **Todos los vectores (documentos y preguntas) deben venir del mismo modelo.** Mezclar modelos no tiene sentido.
- **La dimensión** (por ejemplo 384, 1024) y el **límite de longitud** del texto dependen del modelo.
- Cambiar de modelo obliga a **reindexar** todo.
- El embedding de la pregunta y el de los documentos son distintos tipos de texto: algunos modelos tienen modo «consulta» y modo «documento».

---

## Python en IA {: .topic-title }

Los embeddings son la base de:

- **Búsqueda semántica**: encontrar fragmentos por significado.
- **RAG**: recuperar los fragmentos relevantes para el prompt (siguientes capítulos).
- **Deduplicar** textos casi iguales, **agrupar** documentos, **recomendar**.

!!! tip "Calcula los embeddings de los documentos una vez"
    Indexar cuesta (tiempo y, con un servicio, dinero). Calcula los vectores de los documentos al indexar y **guárdalos** (en disco o en una base de datos de vectores); solo la pregunta se calcula en cada consulta.

!!! info "Qué es criterio propio y no está en la documentación"
    La explicación del coseno, el uso de TF-IDF como embedding didáctico y los consejos de indexación son criterio propio (la matemática es estándar). Lo que sí está en la documentación oficial de Anthropic: que no ofrece su propio modelo de embeddings y que recomienda evaluar proveedores como Voyage AI. El ejemplo de `sentence-transformers` es un esbozo no ejecutado.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| Arrays normales o `Float32Array` | `numpy.ndarray` (operaciones vectorizadas) |
| Bucle `for` para el producto escalar | `np.dot(a, b)` / `a @ b` |
| `Math.sqrt(a.reduce(...))` | `np.linalg.norm(a)` |
| Ordenar índices con `sort` y un comparador | `np.argsort(scores)[::-1]` |
| Librerías externas para vectores | NumPy es el estándar |

!!! tip "Consejos"
    - **Normaliza los vectores al indexar** y la similitud será un simple producto escalar.
    - **Mismo modelo para documentos y consultas.**
    - **NumPy en lugar de bucles**: es mucho más rápido y más corto.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye NumPy ni embeddings | — |
| **Documentación oficial** | |
| Anthropic — Embeddings (no ofrece modelo propio; Voyage AI como ejemplo) | <https://platform.claude.com/docs/en/build-with-claude/embeddings> |
| Voyage AI — Documentación de embeddings | <https://docs.voyageai.com/docs/embeddings> |
| NumPy en PyPI (la documentación de funciones, en numpy.org, no ha sido accesible para verificar enlaces exactos) | <https://pypi.org/project/numpy/> |
| sentence-transformers en PyPI | <https://pypi.org/project/sentence-transformers/> |
