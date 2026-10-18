# Mini-RAG { .section-python .bloque-python }

> RAG (generación aumentada con recuperación) consiste en buscar primero los fragmentos relevantes de tus documentos y dárselos al modelo dentro del prompt, para que responda con ellos y los cite. Aquí construyes el ciclo completo con un almacén de vectores en memoria hecho a mano.

---

## Qué es RAG {: .topic-title }

Un modelo de lenguaje no conoce tus documentos privados ni lo que pasó ayer. **RAG** (*Retrieval-Augmented Generation*) lo resuelve en cuatro pasos:

1. **Indexar** (una vez): trocear los documentos y guardar el vector de cada trozo ([Chunking](../../03-chunking/01-chunking/index.md), [Embeddings](../../02-embeddings/01-embeddings-y-similitud/index.md)).
2. **Recuperar** (por pregunta): buscar los *k* trozos más parecidos a la pregunta.
3. **Construir el prompt**: meter esos trozos, numerados, junto a la pregunta.
4. **Generar y citar**: el modelo responde usando solo ese contexto y señala de qué fragmentos sale cada dato.

El modelo no «aprende» nada: **lee lo que le das en cada petición**. Por eso se parece más a un examen con apuntes que a una memoria.

---

## El ciclo completo {: .topic-title }

Los módulos (`corpus`, `chunking`, `embeddings`, `store`, `rag`) están en el [capítulo final del pilar](../../06-python-en-ia/01-rag-de-documentos-propios/index.md). El script que los une:

**1. El script**

```python
# mini_rag.py
from ragofertas.chunking import chunk_by_paragraph
from ragofertas.corpus import DOCUMENTS
from ragofertas.embeddings import TfidfEmbedder
from ragofertas.rag import ExtractiveFakeLLM, RagPipeline, build_user_message, cited_numbers
from ragofertas.store import InMemoryStore

# 1. Indexar: trocear, calcular vectores y guardarlos
chunks = [chunk for document in DOCUMENTS for chunk in chunk_by_paragraph(document)]
store = InMemoryStore(TfidfEmbedder())
store.index(chunks)
print(len(chunks), "fragmentos,", store.vectors.shape, "matriz de vectores")

# 2. Recuperar: los k fragmentos más parecidos a la pregunta
question = "¿Cuánto se paga en el puesto de backend en Barcelona?"
hits = store.search(question, k=3, min_score=0.05)
for hit in hits:
    print(f"{hit.score:.2f}  {hit.chunk.id:10} {hit.chunk.text[:60]}")

# 3. Construir el prompt con el contexto numerado
print("-----")
print(build_user_message(question, hits[:2]))
print("-----")

# 4. Generar y citar
pipeline = RagPipeline(store, ExtractiveFakeLLM(), k=3)
answer = pipeline.ask(question)
print(answer.text)
print(cited_numbers(answer.text), [hit.chunk.id for hit in answer.sources])
for number in sorted(cited_numbers(answer.text)):
    source = answer.sources[number - 1].chunk
    print(f"[{number}] {source.title}, párrafo {source.metadata['paragraph']}")

# 5. Preguntas fuera del corpus
print(pipeline.ask("¿Cuál es la capital de Francia?").text)
print(pipeline.ask("¿Qué puestos permiten teletrabajo?").text)
```

**2. Cómo se ejecuta** (con NumPy instalado)

```bash
python mini_rag.py
```

**3. Qué pasa por dentro:**

- `InMemoryStore` es un almacén de vectores **desde cero**: guarda los trozos y una matriz NumPy (una fila por trozo, normalizada). `search` multiplica esa matriz por el vector de la pregunta (los productos escalares son similitudes coseno) y devuelve los *k* mejores con su puntuación.
- `min_score` descarta resultados con puntuación demasiado baja.
- `build_user_message` numera los fragmentos `[1]`, `[2]`... con su título y los junta con la pregunta.
- `RagPipeline.ask` encadena recuperar, construir el prompt y llamar al LLM.
- Aquí el LLM es un **simulado determinista** (`ExtractiveFakeLLM`): responde con la primera frase del fragmento `[1]` y la cita. No es un modelo; permite ejecutar el ciclo sin API ni coste y probarlo.

**4. La salida**

```text
18 fragmentos, (18, 107) matriz de vectores
0.55  backend#1  Data Corp ofrece un puesto de Backend Developer en Barcelona
0.34  backend#2  Se trabaja con Python, SQL y APIs REST. El puesto es presenc
0.16  ml#2       Se trabaja con Python, PyTorch y modelos de lenguaje. El pue
-----
Fragmentos:
[1] (Oferta Backend Developer) Data Corp ofrece un puesto de Backend Developer en Barcelona con un salario de 41000 euros anuales.

[2] (Oferta Backend Developer) Se trabaja con Python, SQL y APIs REST. El puesto es presencial en la oficina de Barcelona.

Pregunta: ¿Cuánto se paga en el puesto de backend en Barcelona?
-----
Data Corp ofrece un puesto de Backend Developer en Barcelona con un salario de 41000 euros anuales [1].
{1} ['backend#1', 'backend#2', 'ml#2']
[1] Oferta Backend Developer, párrafo 1
No lo sé
No lo sé
```

- La recuperación encuentra primero el párrafo correcto (`backend#1`, 0.55).
- El prompt lleva los fragmentos **numerados y con su título**: es lo que permite citar.
- La respuesta cita `[1]`, y con `cited_numbers` y los metadatos se convierte la cita en una fuente legible: «Oferta Backend Developer, párrafo 1».
- Una pregunta **fuera del corpus** (la capital de Francia) no recupera nada por encima del umbral y responde `No lo sé` **sin llamar al modelo**: se ahorra una petición.
- La última pregunta, «¿Qué puestos permiten **teletrabajo**?», también da `No lo sé`, aunque el corpus sí habla de puestos «remotos». Es el límite del embedding léxico visto en [Embeddings](../../02-embeddings/01-embeddings-y-similitud/index.md): no hay palabras compartidas. Con un embedding semántico se encontraría.

---

## El prompt con contexto {: .topic-title }

El corazón de RAG es el texto que se envía. Las instrucciones del sistema del proyecto:

```text
Responde solo con la información de los fragmentos. Cita cada dato con su número entre corchetes, por ejemplo [1]. Si los fragmentos no contienen la respuesta, di exactamente: No lo sé.
```

Y el mensaje de usuario es el bloque `Fragmentos:` de arriba más la pregunta. Tres decisiones:

- **«Responde solo con los fragmentos»**: reduce las invenciones (alucinaciones), aunque no las elimina.
- **«Cita con [n]»**: permite comprobar de dónde sale cada dato.
- **«Si no está, di No lo sé»**: da una salida segura. Sin esta instrucción, el modelo tiende a rellenar con lo que «sabe».

!!! warning "El contexto recuperado es texto no confiable"
    Un documento puede contener instrucciones («ignora lo anterior y...»). El modelo las lee igual que tu prompt. Trata los fragmentos como **datos**, sepáralos claramente del prompt (aquí, bajo `Fragmentos:`) y no des al modelo herramientas peligrosas que dependan de lo que ponga un documento.

---

## Con Claude de verdad {: .topic-title }

La conexión con el modelo es una clase con **un método**, `complete(system, user) -> str`, que cumple el `Protocol` `LLM` ([Herencia y protocolos](../../../05-objetos/03-herencia-y-protocolos/01-herencia-y-protocolos/index.md)). La implementación real usa el SDK de Anthropic ([Llamar a la API de Claude](../../01-api-de-claude/01-llamar-a-claude/index.md)):

```python
# src/ragofertas/claude_llm.py
import anthropic

DEFAULT_MODEL = "claude-sonnet-5-5"


class ClaudeLLM:
    """Implementación real del Protocol LLM con el SDK oficial de Anthropic."""

    def __init__(self, client: anthropic.Anthropic | None = None, model: str = DEFAULT_MODEL, max_tokens: int = 1024) -> None:
        self.client = client or anthropic.Anthropic()
        self.model = model
        self.max_tokens = max_tokens

    def complete(self, system: str, user: str) -> str:
        response = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=system,
            messages=[{"role": "user", "content": user}],
            output_config={"effort": "low"},
        )
        if response.stop_reason == "max_tokens":
            raise RuntimeError("respuesta cortada por max_tokens")
        return "".join(block.text for block in response.content if block.type == "text")
```

Como en [Llamar a la API de Claude](../../01-api-de-claude/01-llamar-a-claude/index.md), **no se ha ejecutado contra la API real** (no hay clave en el entorno de escritura). Se ha validado con el SDK oficial apuntando a un servidor local con el formato de la API (`base_url`):

```python
# claude_check.py
client = anthropic.Anthropic(api_key="clave-falsa-de-prueba", base_url=base_url)
pipeline = RagPipeline(store, ClaudeLLM(client=client), k=2)
answer = pipeline.ask("¿Cuánto se paga en el puesto de backend en Barcelona?")
sent = fake_anthropic.STATE["last_request"]   # lo que recibió el servidor
print(sent["model"], sent["max_tokens"], sent["output_config"])
print(sent["system"][:60], "...")
print(sent["messages"][0]["content"].splitlines()[0])
print(answer.text[:40], "...")
```

```text
claude-sonnet-5-5 1024 {'effort': 'low'}
Responde solo con la información de los fragmentos. Cita cad ...
Fragmentos:
Respuesta simulada a: Fragmentos:
[1] (O ...
```

La petición se construyó con el modelo, el límite de tokens, el esfuerzo, el system prompt y el mensaje con los fragmentos. (La última línea es el eco del servidor simulado, **no** una respuesta de Claude.) La clase `ClaudeLLM` se prueba así sin red.

---

## Límites y siguiente nivel {: .topic-title }

Este RAG es mínimo a propósito. Lo que le falta para producción:

| Límite | Qué se hace en la práctica |
|---|---|
| El embedding léxico no entiende sinónimos | Embeddings semánticos (Voyage AI, `sentence-transformers`...) |
| El almacén vive en memoria y se pierde al cerrar | Guardar los vectores (`numpy.save`, SQLite) o una base de vectores |
| La búsqueda compara con **todos** los vectores | Índices aproximados (FAISS) cuando hay millones |
| Solo busca por parecido de texto | Filtros por metadatos, búsqueda híbrida, reordenación (*reranking*) |
| Los fragmentos largos gastan tokens | Limitar el contexto (`k`, presupuesto de tokens) |
| Se confía en lo que cita el modelo | Verificar las citas (en [Evals](../../05-evals/01-evals/index.md)) |

Bases de vectores habituales, a las que se llega con la misma interfaz `index`/`search`: **Chroma**, la extensión **pgvector** de PostgreSQL y la librería **FAISS**. Conviene entender primero el almacén a mano, como aquí; las demás cambian el almacenamiento y la búsqueda, no la idea.

!!! tip "Pocos fragmentos, bien elegidos"
    Más contexto no es mejor: cada fragmento cuesta tokens y puede distraer al modelo. Empieza con `k = 3` y ajusta midiendo.

!!! info "Qué es criterio propio y no está en la documentación"
    La arquitectura de este mini-RAG, el `InMemoryStore`, el umbral `min_score`, el prompt de ejemplo y la tabla de límites son criterio propio sobre la práctica habitual de RAG. La documentación oficial de Anthropic aporta el uso del SDK, los modelos y las citas con documentos (ver recursos). Los nombres Chroma, pgvector y FAISS se citan como referencia, sin haberlos ejecutado aquí.

---

## Python en IA {: .topic-title }

RAG es probablemente el patrón más habitual con modelos de lenguaje, y se apoya en casi todo el curso: diccionarios y listas (los trozos), comprensiones (indexar), NumPy (similitud), clases y `Protocol` (el LLM intercambiable), dataclasses (`Chunk`, `Hit`), funciones (`build_context`), tipos, tests y evaluaciones.

!!! warning "Un RAG sin evaluar es un RAG que no sabes si funciona"
    El siguiente capítulo mide si la recuperación encuentra lo que debe y si las respuestas se apoyan en las fuentes.

---

## Comparación con JavaScript {: .topic-title }

| En JS / TypeScript | En Python |
|---|---|
| LangChain.js, LlamaIndex.TS | LangChain, LlamaIndex (o a mano, como aquí) |
| `Float32Array` y bucles | NumPy: `matriz @ vector` |
| `interface LLM { complete(...) }` | `class LLM(Protocol)` |
| `pgvector` desde Node | `pgvector` desde Python |
| Chroma (cliente JS) | Chroma (cliente Python) |

!!! tip "Consejos"
    - **Separa recuperar, construir el prompt y generar**: cada paso se prueba solo.
    - **Devuelve las fuentes** junto a la respuesta, siempre.
    - **Un LLM simulado** para desarrollar y testear sin gastar.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye RAG, embeddings ni modelos de lenguaje | — |
| **Documentación oficial** | |
| Anthropic — Citas (citar documentos en las respuestas) | <https://platform.claude.com/docs/en/build-with-claude/citations> |
| Anthropic — Embeddings | <https://platform.claude.com/docs/en/build-with-claude/embeddings> |
| Anthropic — Empezar (Messages API) | <https://platform.claude.com/docs/en/get-started> |
| Chroma (documentación) | <https://docs.trychroma.com/> |
| pgvector (repositorio) | <https://github.com/pgvector/pgvector> |
| FAISS (repositorio) | <https://github.com/facebookresearch/faiss> |
| Python — `typing.Protocol` | <https://docs.python.org/3/library/typing.html#typing.Protocol> |
