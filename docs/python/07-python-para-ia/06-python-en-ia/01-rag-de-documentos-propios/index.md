# RAG de documentos propios { .section-python .bloque-python }

> El proyecto completo del pilar: un RAG sobre notas de ofertas de empleo que trocea, indexa, recupera, construye el prompt con fuentes citadas, genera con un LLM intercambiable (simulado o Claude real) y se evalúa con pytest. Todo es reproducible sin clave de API.

!!! warning "Qué se ha ejecutado y qué no"
    - **Ejecutado de verdad:** el trocedo, los embeddings, la recuperación, el prompt, el CLI, las evaluaciones y los 29 tests, con el LLM **simulado** (`ExtractiveFakeLLM`).
    - **Validado con un servidor simulado:** `ClaudeLLM` (la integración con el SDK oficial) se prueba contra un servidor local con el formato de la Messages API (`tests/fake_anthropic.py`). Comprueba que la petición se construye bien y que las respuestas y los errores se tratan bien.
    - **No ejecutado:** `python -m ragofertas "..." --claude` contra la API real. No había `ANTHROPIC_API_KEY` en el entorno de escritura. Por eso no se muestra ninguna respuesta real de Claude.

---

## Qué vamos a construir {: .topic-title }

```text
ragofertas/
├── pyproject.toml
├── eval_cases.json
├── src/ragofertas/
│   ├── corpus.py        (los documentos)
│   ├── chunking.py      (trocear)
│   ├── embeddings.py    (TF-IDF + similitud coseno)
│   ├── store.py         (almacén de vectores en memoria)
│   ├── rag.py           (prompt, pipeline, LLM simulado)
│   ├── claude_llm.py    (LLM real con el SDK de Anthropic)
│   ├── evals.py         (métricas y runner)
│   ├── cli.py
│   └── __main__.py
└── tests/
    ├── fake_anthropic.py
    ├── test_units.py
    ├── test_claude_llm.py
    └── test_evals.py
```

| Pieza | Capítulo |
|---|---|
| Llamar a Claude con el SDK | [Llamar a la API de Claude](../../01-api-de-claude/01-llamar-a-claude/index.md) |
| Vectores y similitud | [Embeddings y similitud](../../02-embeddings/01-embeddings-y-similitud/index.md) |
| Trocear con metadatos | [Chunking](../../03-chunking/01-chunking/index.md) |
| Recuperar, prompt, citas | [Mini-RAG](../../04-mini-rag/01-mini-rag/index.md) |
| Métricas, puertas, varianza | [Evals](../../05-evals/01-evals/index.md) |
| Proyecto, `pyproject.toml`, tests, CLI | [Pilar 6](../../../06-ecosistema/index.md) |
| `dataclass`, `Protocol` | [Pilar 5](../../../05-objetos/index.md) |

---

## El código {: .topic-title }

Cada archivo, desplegable. La mayoría ya los viste por partes en los capítulos anteriores.

??? note "pyproject.toml"
    ```toml
    [build-system]
    requires = ["setuptools>=68"]
    build-backend = "setuptools.build_meta"

    [project]
    name = "ragofertas"
    version = "0.1.0"
    description = "RAG de ejemplo sobre notas de ofertas de empleo"
    requires-python = ">=3.11"
    dependencies = [
        "numpy>=2",
        "anthropic>=1",
    ]

    [project.optional-dependencies]
    dev = ["pytest>=8"]

    [tool.setuptools.packages.find]
    where = ["src"]

    [tool.pytest.ini_options]
    testpaths = ["tests"]
    pythonpath = ["src", "tests"]
    ```

??? note "src/ragofertas/corpus.py (los documentos)"
    ```python
    # src/ragofertas/corpus.py
    """Documentos del hilo del curso: notas sobre ofertas de empleo."""

    DOCUMENTS = [
        {
            "id": "frontend",
            "title": "Oferta Frontend Developer",
            "text": (
                "Tech Solutions busca un Frontend Developer en Madrid. El salario es de 32000 euros anuales.\n\n"
                "Las tecnologías principales son React, CSS y TypeScript. El equipo trabaja de forma híbrida: "
                "tres días en la oficina de Madrid y dos días en remoto.\n\n"
                "Se valora experiencia con tests de interfaz y accesibilidad web."
            ),
        },
        {
            "id": "backend",
            "title": "Oferta Backend Developer",
            "text": (
                "Data Corp ofrece un puesto de Backend Developer en Barcelona con un salario de 41000 euros anuales.\n\n"
                "Se trabaja con Python, SQL y APIs REST. El puesto es presencial en la oficina de Barcelona.\n\n"
                "Se pide experiencia diseñando bases de datos y escribiendo tests automáticos con pytest."
            ),
        },
        {
            "id": "analyst",
            "title": "Oferta Data Analyst",
            "text": (
                "Data Corp busca un Data Analyst en Madrid. El salario es de 38000 euros anuales.\n\n"
                "Las herramientas son Python, SQL y pandas. Se trabaja en remoto dos días por semana.\n\n"
                "Se valora saber comunicar resultados con gráficos claros."
            ),
        },
        {
            "id": "qa",
            "title": "Oferta QA Engineer",
            "text": (
                "Test Lab necesita un QA Engineer en Girona con un salario de 30000 euros anuales.\n\n"
                "Se automatizan pruebas con Selenium y pytest. El trabajo es presencial en Girona.\n\n"
                "Se valora experiencia previa con integración continua."
            ),
        },
        {
            "id": "ml",
            "title": "Oferta ML Engineer",
            "text": (
                "Neural SL contrata un ML Engineer en Madrid. El salario es de 52000 euros anuales.\n\n"
                "Se trabaja con Python, PyTorch y modelos de lenguaje. El puesto es totalmente remoto.\n\n"
                "Se valora experiencia evaluando modelos y construyendo sistemas de recuperación de documentos."
            ),
        },
        {
            "id": "tips",
            "title": "Consejos para entrevistas",
            "text": (
                "Antes de una entrevista técnica conviene repasar los fundamentos del lenguaje y practicar con ejercicios pequeños.\n\n"
                "Prepara ejemplos de proyectos propios y explica las decisiones que tomaste.\n\n"
                "Pregunta por el equipo, por el proceso de revisión de código y por la forma de trabajo."
            ),
        },
    ]
    ```

??? note "src/ragofertas/chunking.py"
    ```python
    # src/ragofertas/chunking.py
    import re
    from dataclasses import dataclass, field


    @dataclass(frozen=True)
    class Chunk:
        id: str
        doc_id: str
        title: str
        text: str
        metadata: dict = field(default_factory=dict)


    def split_paragraphs(text: str) -> list[str]:
        return [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]


    def split_sentences(text: str) -> list[str]:
        return [part.strip() for part in re.split(r"(?<=[.!?])\s+", text) if part.strip()]


    def chunk_fixed(text: str, size: int, overlap: int = 0) -> list[str]:
        if size <= 0:
            raise ValueError("size debe ser mayor que 0")
        if not 0 <= overlap < size:
            raise ValueError("overlap debe estar entre 0 y size - 1")
        step = size - overlap
        return [text[start:start + size] for start in range(0, max(len(text) - overlap, 1), step)]


    def chunk_by_paragraph(document: dict) -> list[Chunk]:
        return [
            Chunk(
                id=f"{document['id']}#{number}",
                doc_id=document["id"],
                title=document["title"],
                text=paragraph,
                metadata={"paragraph": number},
            )
            for number, paragraph in enumerate(split_paragraphs(document["text"]), start=1)
        ]


    def chunk_by_sentences(document: dict, max_chars: int = 200, overlap_sentences: int = 1) -> list[Chunk]:
        sentences = split_sentences(document["text"].replace("\n\n", " "))
        groups, current = [], []
        for sentence in sentences:
            if current and len(" ".join(current + [sentence])) > max_chars:
                groups.append(current)
                current = current[-overlap_sentences:] if overlap_sentences else []
            current.append(sentence)
        if current:
            groups.append(current)
        return [
            Chunk(
                id=f"{document['id']}#{number}",
                doc_id=document["id"],
                title=document["title"],
                text=" ".join(group),
                metadata={"sentences": len(group)},
            )
            for number, group in enumerate(groups, start=1)
        ]
    ```

??? note "src/ragofertas/embeddings.py"
    ```python
    # src/ragofertas/embeddings.py
    import math
    import re
    import unicodedata
    from collections import Counter

    import numpy as np

    STOPWORDS = {
        "a", "al", "con", "de", "del", "el", "en", "es", "la", "las", "lo", "los", "me", "o", "para", "por",
        "que", "se", "su", "un", "una", "y", "hay", "como", "mas", "ha", "son", "si", "no", "cual", "cuanto",
    }


    def tokenize(text: str) -> list[str]:
        plain = unicodedata.normalize("NFKD", text.lower())
        plain = "".join(char for char in plain if not unicodedata.combining(char))
        return [word for word in re.findall(r"[a-z0-9]+", plain) if word not in STOPWORDS]


    class TfidfEmbedder:
        """Embedding léxico (TF-IDF): vectores que miden palabras compartidas, no significado."""

        def __init__(self) -> None:
            self.vocabulary: dict[str, int] = {}
            self.idf: np.ndarray = np.zeros(0)

        def fit(self, texts: list[str]) -> "TfidfEmbedder":
            tokenized = [set(tokenize(text)) for text in texts]
            words = sorted(set().union(*tokenized))
            self.vocabulary = {word: index for index, word in enumerate(words)}
            document_frequency = np.zeros(len(words))
            for tokens in tokenized:
                for word in tokens:
                    document_frequency[self.vocabulary[word]] += 1
            self.idf = np.log((1 + len(texts)) / (1 + document_frequency)) + 1
            return self

        def embed(self, texts: list[str]) -> np.ndarray:
            matrix = np.zeros((len(texts), len(self.vocabulary)))
            for row, text in enumerate(texts):
                for word, count in Counter(tokenize(text)).items():
                    if word in self.vocabulary:
                        matrix[row, self.vocabulary[word]] = 1 + math.log(count)
            matrix *= self.idf
            norms = np.linalg.norm(matrix, axis=1, keepdims=True)
            norms[norms == 0] = 1
            return matrix / norms


    def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        denominator = np.linalg.norm(a) * np.linalg.norm(b)
        if denominator == 0:
            return 0.0
        return float(np.dot(a, b) / denominator)
    ```

??? note "src/ragofertas/store.py"
    ```python
    # src/ragofertas/store.py
    from dataclasses import dataclass

    import numpy as np

    from ragofertas.chunking import Chunk


    @dataclass(frozen=True)
    class Hit:
        chunk: Chunk
        score: float


    class InMemoryStore:
        def __init__(self, embedder) -> None:
            self.embedder = embedder
            self.chunks: list[Chunk] = []
            self.vectors = np.zeros((0, 0))

        def index(self, chunks: list[Chunk]) -> None:
            self.embedder.fit([chunk.text for chunk in chunks])
            self.chunks = list(chunks)
            self.vectors = self.embedder.embed([chunk.text for chunk in chunks])

        def search(self, query: str, k: int = 3, min_score: float = 0.0) -> list[Hit]:
            query_vector = self.embedder.embed([query])[0]
            scores = self.vectors @ query_vector
            best = np.argsort(scores)[::-1][:k]
            return [Hit(self.chunks[i], float(scores[i])) for i in best if scores[i] > min_score]
    ```

??? note "src/ragofertas/rag.py"
    ```python
    # src/ragofertas/rag.py
    import re
    from dataclasses import dataclass
    from typing import Protocol

    from ragofertas.store import Hit, InMemoryStore

    SYSTEM_PROMPT = (
        "Responde solo con la información de los fragmentos. Cita cada dato con su número entre corchetes, "
        "por ejemplo [1]. Si los fragmentos no contienen la respuesta, di exactamente: No lo sé."
    )


    class LLM(Protocol):
        def complete(self, system: str, user: str) -> str: ...


    @dataclass(frozen=True)
    class Answer:
        text: str
        sources: list[Hit]


    def build_context(hits: list[Hit]) -> str:
        return "\n\n".join(f"[{number}] ({hit.chunk.title}) {hit.chunk.text}" for number, hit in enumerate(hits, start=1))


    def build_user_message(question: str, hits: list[Hit]) -> str:
        return f"Fragmentos:\n{build_context(hits)}\n\nPregunta: {question}"


    def cited_numbers(text: str) -> set[int]:
        return {int(number) for number in re.findall(r"\[(\d+)\]", text)}


    class RagPipeline:
        def __init__(self, store: InMemoryStore, llm: LLM, k: int = 3, min_score: float = 0.05) -> None:
            self.store = store
            self.llm = llm
            self.k = k
            self.min_score = min_score

        def ask(self, question: str) -> Answer:
            hits = self.store.search(question, k=self.k, min_score=self.min_score)
            if not hits:
                return Answer("No lo sé", [])
            text = self.llm.complete(SYSTEM_PROMPT, build_user_message(question, hits))
            return Answer(text, hits)


    class ExtractiveFakeLLM:
        """LLM simulado y determinista: responde con la primera frase del fragmento [1] y la cita."""

        def complete(self, system: str, user: str) -> str:
            first = re.search(r"\[1\] \([^)]*\) (.+?)(?:\n|$)", user)
            sentence = first.group(1).split(". ")[0].rstrip(".") if first else "No lo sé"
            return f"{sentence} [1]."
    ```

??? note "src/ragofertas/claude_llm.py"
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

??? note "src/ragofertas/evals.py"
    ```python
    # src/ragofertas/evals.py
    import json
    import statistics
    from dataclasses import dataclass
    from pathlib import Path

    from ragofertas.rag import Answer, RagPipeline, cited_numbers
    from ragofertas.store import InMemoryStore


    @dataclass(frozen=True)
    class EvalCase:
        id: str
        question: str
        expected_doc: str | None
        expected_text: str | None = None


    def load_cases(path: Path) -> list[EvalCase]:
        with open(path, encoding="utf-8") as file:
            return [EvalCase(**item) for item in json.load(file)]


    def recall_at_k(store: InMemoryStore, cases: list[EvalCase], k: int) -> float:
        """Fracción de preguntas con respuesta en el corpus cuyo documento esperado aparece entre los k primeros."""
        answerable = [case for case in cases if case.expected_doc is not None]
        found = 0
        for case in answerable:
            docs = [hit.chunk.doc_id for hit in store.search(case.question, k=k, min_score=0.05)]
            found += case.expected_doc in docs
        return found / len(answerable)


    def reciprocal_rank(store: InMemoryStore, case: EvalCase, k: int = 5) -> float:
        docs = [hit.chunk.doc_id for hit in store.search(case.question, k=k, min_score=0.05)]
        if case.expected_doc in docs:
            return 1 / (docs.index(case.expected_doc) + 1)
        return 0.0


    def citations_are_valid(answer: Answer) -> bool:
        """Todas las citas [n] apuntan a un fragmento que realmente se entregó."""
        return all(1 <= number <= len(answer.sources) for number in cited_numbers(answer.text))


    def faithful(answer: Answer, case: EvalCase) -> bool:
        """Comprobación determinista de fidelidad: la respuesta cita al menos una fuente y la cita es del documento esperado."""
        numbers = cited_numbers(answer.text)
        if not numbers or not citations_are_valid(answer):
            return False
        return any(answer.sources[n - 1].chunk.doc_id == case.expected_doc for n in numbers)


    def run_eval(pipeline: RagPipeline, cases: list[EvalCase]) -> dict:
        rows = []
        for case in cases:
            answer = pipeline.ask(case.question)
            if case.expected_doc is None:
                passed = answer.text.strip().lower().startswith("no lo sé")
            else:
                contains = case.expected_text is None or case.expected_text in answer.text
                passed = faithful(answer, case) and contains
            rows.append({"id": case.id, "passed": passed, "answer": answer.text})
        return {"score": sum(row["passed"] for row in rows) / len(rows), "rows": rows}


    def repeat_eval(make_pipeline, cases: list[EvalCase], runs: int) -> dict:
        scores = [run_eval(make_pipeline(seed), cases)["score"] for seed in range(runs)]
        return {"scores": scores, "mean": statistics.mean(scores), "stdev": statistics.pstdev(scores), "worst": min(scores)}
    ```

??? note "src/ragofertas/cli.py"
    ```python
    # src/ragofertas/cli.py
    import argparse
    import os
    import sys
    from pathlib import Path

    from ragofertas.chunking import chunk_by_paragraph
    from ragofertas.corpus import DOCUMENTS
    from ragofertas.embeddings import TfidfEmbedder
    from ragofertas.evals import load_cases, recall_at_k, run_eval
    from ragofertas.rag import ExtractiveFakeLLM, RagPipeline
    from ragofertas.store import InMemoryStore

    CASES_PATH = Path(__file__).resolve().parents[2] / "eval_cases.json"


    def build_store() -> InMemoryStore:
        store = InMemoryStore(TfidfEmbedder())
        store.index([chunk for document in DOCUMENTS for chunk in chunk_by_paragraph(document)])
        return store


    def choose_llm(use_claude: bool):
        if not use_claude:
            return ExtractiveFakeLLM(), "LLM simulado (sin API)"
        if not os.getenv("ANTHROPIC_API_KEY"):
            raise SystemExit("error: falta ANTHROPIC_API_KEY para usar --claude")
        from ragofertas.claude_llm import ClaudeLLM

        llm = ClaudeLLM()
        return llm, f"Claude ({llm.model})"


    def main(argv: list[str] | None = None) -> int:
        parser = argparse.ArgumentParser(prog="ragofertas", description="RAG sobre notas de ofertas de empleo")
        parser.add_argument("question", nargs="?", help="pregunta; si falta, se ejecuta --eval")
        parser.add_argument("--claude", action="store_true", help="usa la API real de Claude (requiere ANTHROPIC_API_KEY)")
        parser.add_argument("-k", type=int, default=3, help="fragmentos a recuperar")
        parser.add_argument("--eval", action="store_true", help="ejecuta las evaluaciones")
        args = parser.parse_args(argv)

        store = build_store()
        llm, llm_name = choose_llm(args.claude)

        if args.eval or not args.question:
            cases = load_cases(CASES_PATH)
            report = run_eval(RagPipeline(store, llm, k=args.k), cases)
            print(f"{llm_name} | recall@{args.k} = {recall_at_k(store, cases, args.k):.2f} | extremo a extremo = {report['score']:.2f}")
            return 0

        answer = RagPipeline(store, llm, k=args.k).ask(args.question)
        print(answer.text)
        for number, hit in enumerate(answer.sources, start=1):
            print(f"  [{number}] {hit.chunk.title} ({hit.chunk.id}, puntuación {hit.score:.2f})")
        return 0


    if __name__ == "__main__":
        sys.exit(main())
    ```

??? note "eval_cases.json"
    ```json
    [
      {"id": "q01", "question": "¿Cuánto se paga en el puesto de backend en Barcelona?", "expected_doc": "backend", "expected_text": "41000"},
      {"id": "q02", "question": "¿Qué oferta es totalmente remota?", "expected_doc": "ml", "expected_text": "remoto"},
      {"id": "q03", "question": "¿Dónde se necesita experiencia con pytest?", "expected_doc": "backend"},
      {"id": "q04", "question": "¿Qué herramientas usa el analista de datos?", "expected_doc": "analyst", "expected_text": "pandas"},
      {"id": "q05", "question": "¿Cuál es el salario del Frontend Developer en Madrid?", "expected_doc": "frontend", "expected_text": "32000"},
      {"id": "q06", "question": "¿Quién busca un QA Engineer en Girona?", "expected_doc": "qa", "expected_text": "Test Lab"},
      {"id": "q07", "question": "¿Qué conviene preparar antes de una entrevista técnica?", "expected_doc": "tips"},
      {"id": "q08", "question": "¿Qué puestos permiten teletrabajo?", "expected_doc": "ml"},
      {"id": "q09", "question": "¿Cuál es la capital de Francia?", "expected_doc": null},
      {"id": "q10", "question": "¿Cuántas vacaciones da Neural SL?", "expected_doc": null}
    ]
    ```

Un par de decisiones de diseño que se ven al leer el código:

- **`LLM` es un `Protocol`** con un solo método: `complete(system, user) -> str`. `RagPipeline` no sabe si habla con el simulado o con Claude.
- **Si no hay fragmentos suficientemente parecidos, no se llama al modelo** y se responde `No lo sé`.
- **`choose_llm` solo importa `claude_llm` cuando se pide `--claude`**, y exige la variable de entorno `ANTHROPIC_API_KEY`: sin clave, falla con un mensaje claro en lugar de intentar la llamada.
- **El modelo, el esfuerzo y `max_tokens`** son parámetros de `ClaudeLLM`; no hay `temperature` (ya no existe en el SDK).

---

## Ejecutarlo {: .topic-title }

Con las dependencias instaladas en un entorno virtual (`python -m pip install -e ".[dev]"`), desde la carpeta del proyecto:

```bash
python -m ragofertas "¿Cuánto se paga en el puesto de backend en Barcelona?"
python -m ragofertas "¿Qué ofertas hay en Madrid?" -k 2
python -m ragofertas --eval
python -m ragofertas "x" --claude
```

Salida (LLM simulado):

```text
Data Corp ofrece un puesto de Backend Developer en Barcelona con un salario de 41000 euros anuales [1].
  [1] Oferta Backend Developer (backend#1, puntuación 0.55)
  [2] Oferta Backend Developer (backend#2, puntuación 0.34)
  [3] Oferta ML Engineer (ml#2, puntuación 0.16)
Tech Solutions busca un Frontend Developer en Madrid [1].
  [1] Oferta Frontend Developer (frontend#1, puntuación 0.26)
  [2] Oferta Data Analyst (analyst#1, puntuación 0.26)
LLM simulado (sin API) | recall@3 = 0.88 | extremo a extremo = 0.60
error: falta ANTHROPIC_API_KEY para usar --claude
```

(La última orden termina con código de salida 1.)

- La primera respuesta cita `[1]` y el programa muestra de dónde sale cada fuente, con su puntuación.
- La segunda pregunta («¿Qué ofertas hay en Madrid?») recupera dos fragmentos con la misma puntuación (0.26) y el LLM simulado se limita a repetir la primera frase del primero: **no resume** las dos ofertas. Con un modelo real, que lee ambos fragmentos, la respuesta sería otra. Es una limitación del simulado y un buen ejemplo de para qué sirve probar con el modelo real.
- `--eval` ejecuta el conjunto de preguntas y resume: la misma puntuación que viste en [Evals](../../05-evals/01-evals/index.md).
- Con `--claude` y sin clave, el programa se niega con un mensaje claro.

**Con una clave real** (no se ha ejecutado aquí), el flujo sería:

```bash
export ANTHROPIC_API_KEY="..."      # en PowerShell: $env:ANTHROPIC_API_KEY="..."
python -m ragofertas "¿Qué ofertas hay en Madrid?" -k 3 --claude
```

La respuesta cambiaría: la daría Claude leyendo los fragmentos, con el system prompt de `rag.py`. El resto (recuperación, fuentes, puntuaciones) sería idéntico.

---

## Los tests {: .topic-title }

```bash
python -m pytest -q
```

```text
......x..x..x.x..............                                            [100%]
25 passed, 4 xfailed in 5.18s
```

Lo que cubren:

| Archivo | Qué prueba |
|---|---|
| `test_units.py` | Trocear (tamaño, solape, metadatos, validación), tokenizar, coseno, normalización de vectores, orden de resultados, umbral, abstención, citas y formato del prompt |
| `test_claude_llm.py` | La petición que construye `ClaudeLLM` (modelo, `system`, mensajes, `effort`; sin `temperature`), el error por `max_tokens` y que los errores del SDK se propagan |
| `test_evals.py` | Las puertas de recall y de puntuación, y cada caso, con los fallos conocidos como `xfail(strict=True)` |

Son 25 tests que pasan y 4 fallos conocidos documentados. El servidor simulado de `test_claude_llm.py` es este (imita el formato de la Messages API: mensajes, `usage`, streaming con eventos SSE, errores 401/429/529 y el caso `tool_use`):

??? note "tests/fake_anthropic.py"
    ```python
    # fake_anthropic.py
    """Servidor local que imita el formato de la Messages API. Solo para validar el código del SDK sin clave ni red."""
    import json
    import threading
    import time
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

    STATE = {"calls": 0, "mode": "ok"}


    def message(content, stop_reason="end_turn", input_tokens=25, output_tokens=12):
        return {
            "id": "msg_simulado_001",
            "type": "message",
            "role": "assistant",
            "model": "claude-sonnet-5-5",
            "content": content,
            "stop_reason": stop_reason,
            "stop_sequence": None,
            "usage": {"input_tokens": input_tokens, "output_tokens": output_tokens},
        }


    def sse(event, data):
        return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n".encode("utf-8")


    class Handler(BaseHTTPRequestHandler):
        def log_message(self, format, *args):
            pass

        def handle(self):
            try:
                super().handle()
            except ConnectionError:
                pass

        def _json(self, status, payload, headers=None):
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("request-id", "req_simulado_001")
            for name, value in (headers or {}).items():
                self.send_header(name, value)
            self.end_headers()
            self.wfile.write(body)

        def do_POST(self):
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            STATE["calls"] += 1
            STATE["last_request"] = body
            mode = STATE["mode"]
            if mode == "rate_limit":
                self._json(429, {"type": "error", "error": {"type": "rate_limit_error", "message": "Rate limit exceeded"}}, {"retry-after": "0"})
                return
            if mode == "overloaded_then_ok" and STATE["calls"] <= 2:
                self._json(529, {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}})
                return
            if mode == "bad_key":
                self._json(401, {"type": "error", "error": {"type": "authentication_error", "message": "invalid x-api-key"}})
                return
            if "temperature" in body and mode == "strict_sampling":
                self._json(400, {"type": "error", "error": {"type": "invalid_request_error", "message": "temperature: non-default values are not supported for this model"}})
                return
            if body.get("stream"):
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream")
                self.end_headers()
                question = body["messages"][-1]["content"]
                text = f"Respuesta simulada a: {question}"
                self.wfile.write(sse("message_start", {"type": "message_start", "message": {**message([], None), "usage": {"input_tokens": 25, "output_tokens": 1}}}))
                self.wfile.write(sse("content_block_start", {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}))
                for word in text.split():
                    self.wfile.write(sse("content_block_delta", {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": word + " "}}))
                    self.wfile.flush()
                    time.sleep(0.02)
                self.wfile.write(sse("content_block_stop", {"type": "content_block_stop", "index": 0}))
                self.wfile.write(sse("message_delta", {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": None}, "usage": {"output_tokens": len(text.split())}}))
                self.wfile.write(sse("message_stop", {"type": "message_stop"}))
                return
            last = body["messages"][-1]
            if mode == "tool" and isinstance(last["content"], str):
                self._json(200, message([
                    {"type": "text", "text": "Voy a consultar las ofertas."},
                    {"type": "tool_use", "id": "toolu_simulado_001", "name": "search_offers", "input": {"city": "Madrid"}},
                ], "tool_use"))
                return
            if mode == "tool":
                self._json(200, message([{"type": "text", "text": "En Madrid hay 2 ofertas: Frontend Developer y Data Analyst."}]))
                return
            if mode == "max_tokens":
                self._json(200, message([{"type": "text", "text": "La respuesta se corta aq"}], "max_tokens", output_tokens=20))
                return
            system = body.get("system", "")
            question = last["content"] if isinstance(last["content"], str) else "..."
            self._json(200, message([{"type": "text", "text": f"Respuesta simulada a: {question}"}]))


    def start():
        STATE.update(calls=0, mode="ok")
        server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        return server, f"http://127.0.0.1:{server.server_address[1]}"


    def stop(server):
        server.shutdown()
        server.server_close()
    ```

??? note "tests/test_units.py"
    ```python
    # tests/test_units.py
    import numpy as np
    import pytest

    from ragofertas.chunking import chunk_by_paragraph, chunk_by_sentences, chunk_fixed
    from ragofertas.corpus import DOCUMENTS
    from ragofertas.embeddings import TfidfEmbedder, cosine_similarity, tokenize
    from ragofertas.rag import ExtractiveFakeLLM, RagPipeline, build_user_message, cited_numbers
    from ragofertas.store import InMemoryStore


    @pytest.fixture(scope="module")
    def store():
        store = InMemoryStore(TfidfEmbedder())
        store.index([chunk for document in DOCUMENTS for chunk in chunk_by_paragraph(document)])
        return store


    # --- chunking
    def test_fixed_chunks_overlap():
        pieces = chunk_fixed("abcdefghij", size=4, overlap=2)
        assert pieces == ["abcd", "cdef", "efgh", "ghij"]


    @pytest.mark.parametrize("size, overlap", [(0, 0), (-1, 0), (5, 5), (5, -1)])
    def test_fixed_chunks_validate_arguments(size, overlap):
        with pytest.raises(ValueError):
            chunk_fixed("texto", size=size, overlap=overlap)


    def test_paragraph_chunks_keep_metadata():
        chunks = chunk_by_paragraph(DOCUMENTS[1])
        assert [chunk.id for chunk in chunks] == ["backend#1", "backend#2", "backend#3"]
        assert all(chunk.doc_id == "backend" and "paragraph" in chunk.metadata for chunk in chunks)


    def test_sentence_chunks_respect_max_chars():
        chunks = chunk_by_sentences(DOCUMENTS[1], max_chars=100, overlap_sentences=0)
        assert all(len(chunk.text) <= 140 for chunk in chunks)
        assert len(chunks) > 1


    # --- embeddings
    def test_tokenize_removes_accents_and_stopwords():
        assert tokenize("¿Qué ofertas hay en Málaga?") == ["ofertas", "malaga"]


    def test_cosine_ignores_length_and_handles_zero():
        vector = np.array([1.0, 2.0, 3.0])
        assert cosine_similarity(vector, vector * 5) == pytest.approx(1.0)
        assert cosine_similarity(vector, np.zeros(3)) == 0.0


    def test_embedded_vectors_are_normalized(store):
        norms = np.linalg.norm(store.vectors, axis=1)
        assert norms == pytest.approx(np.ones(len(norms)))


    # --- store y rag
    def test_search_returns_best_chunk_first(store):
        hits = store.search("¿Cuánto se paga en el puesto de backend en Barcelona?", k=3)
        assert hits[0].chunk.id == "backend#1"
        assert hits[0].score >= hits[1].score >= hits[2].score


    def test_min_score_filters_unrelated_questions(store):
        assert store.search("capital de Francia", k=3, min_score=0.05) == []


    def test_pipeline_abstains_without_sources_and_cites_with_them(store):
        pipeline = RagPipeline(store, ExtractiveFakeLLM(), k=3)
        assert pipeline.ask("¿Cuál es la capital de Francia?").text == "No lo sé"
        answer = pipeline.ask("¿Cuánto se paga en el puesto de backend en Barcelona?")
        assert cited_numbers(answer.text) == {1}
        assert answer.sources[0].chunk.id == "backend#1"


    def test_user_message_numbers_the_fragments(store):
        hits = store.search("backend Barcelona", k=2)
        message = build_user_message("¿Dónde?", hits)
        assert message.startswith("Fragmentos:\n[1] (Oferta Backend Developer)")
        assert "[2]" in message and message.endswith("Pregunta: ¿Dónde?")
    ```

??? note "tests/test_claude_llm.py"
    ```python
    # tests/test_claude_llm.py
    import anthropic
    import pytest

    import fake_anthropic
    from ragofertas.claude_llm import ClaudeLLM


    @pytest.fixture
    def client():
        server, base_url = fake_anthropic.start()
        yield anthropic.Anthropic(api_key="clave-falsa-de-prueba", base_url=base_url, max_retries=0)
        fake_anthropic.stop(server)


    def test_complete_builds_the_request_and_returns_text(client):
        text = ClaudeLLM(client=client).complete("Eres breve.", "Hola")
        sent = fake_anthropic.STATE["last_request"]
        assert sent["model"] == "claude-sonnet-5-5"
        assert sent["system"] == "Eres breve."
        assert sent["messages"] == [{"role": "user", "content": "Hola"}]
        assert sent["output_config"] == {"effort": "low"}
        assert "temperature" not in sent
        assert text.startswith("Respuesta simulada a: Hola")


    def test_truncated_answer_is_an_error(client):
        fake_anthropic.STATE["mode"] = "max_tokens"
        with pytest.raises(RuntimeError, match="max_tokens"):
            ClaudeLLM(client=client).complete("Eres breve.", "Hola")


    def test_api_errors_propagate(client):
        fake_anthropic.STATE["mode"] = "bad_key"
        with pytest.raises(anthropic.AuthenticationError):
            ClaudeLLM(client=client).complete("Eres breve.", "Hola")
    ```

`tests/test_evals.py` es el que ya viste en [Evals](../../05-evals/01-evals/index.md).

!!! warning "El servidor simulado valida tu código, no al modelo"
    Si el formato de la API cambia, este servidor seguirá devolviendo lo de siempre y los tests no lo notarán. Las pruebas con la API real (pocas, con una clave de desarrollo) siguen haciendo falta antes de poner nada en producción.

---

## Python en IA {: .topic-title }

Mira lo que hay aquí de todo el curso:

| Pilar | Qué aparece |
|---|---|
| 1 Fundamentos | Variables, f-strings (el prompt), bucles, `match`, entrada y conversión (CLI) |
| 2 Estructuras de datos | Diccionarios y listas (metadatos, trozos), sets, comprensiones (indexar), desempaquetado |
| 3 Funciones | Tipos, `Protocol`, funciones puras (`build_context`), generadores |
| 4 Ficheros y errores | `json.load`, `pathlib`, excepciones, `logging` |
| 5 Objetos | `dataclass` (`Chunk`, `Hit`, `Answer`, `EvalCase`), `Protocol`, `Enum` |
| 6 Ecosistema | `src/`, `pyproject.toml`, `argparse`, `pytest`, `monkeypatch`-style fakes |
| 7 Python para IA | SDK de Anthropic, embeddings, chunking, RAG, evals |

Para convertir esto en un producto faltarían, entre otras cosas: embeddings semánticos (Voyage AI u otro), una base de vectores persistente, `AsyncAnthropic` y `asyncio` si hay muchos usuarios, registro con `logging` de cada llamada (modelo, tokens, tiempo, `_request_id`), y una eval más grande ejecutada con el modelo real y repetida para medir la varianza.

!!! tip "Cambiar una pieza sin tocar las demás"
    El diseño por interfaces (`LLM`, `embedder.fit/embed`, `store.index/search`) es lo que permite cambiar el embedding, el almacén o el modelo, con tests que dicen si algo se rompe y evals que dicen si algo mejora.

!!! info "Qué es criterio propio y no está en la documentación"
    La arquitectura del proyecto, los módulos, el corpus, el conjunto de evaluación y el servidor simulado son diseño propio. Lo que viene de fuentes oficiales: el uso del SDK de Anthropic, los identificadores de modelo, `output_config.effort`, la retirada de `temperature`, que Anthropic no ofrece embeddings propios (Voyage AI como ejemplo), y las herramientas de Python y pytest.

---

## Comparación con JavaScript {: .topic-title }

| En JS / TypeScript | En este proyecto de Python |
|---|---|
| `package.json` + `npm run` | `pyproject.toml` + `python -m ragofertas` |
| `interface LLM { complete(...) }` | `class LLM(Protocol)` |
| Zod / validación de la respuesta | Pydantic ([Pilar 5](../../../05-objetos/05-pydantic/01-pydantic/index.md)) cuando la salida es JSON |
| Vitest + mocks | pytest + servidor simulado |
| `@anthropic-ai/sdk` | `anthropic` |

!!! tip "Consejos"
    - **Un LLM simulado para desarrollar y para los tests** y el real para las pruebas de integración.
    - **Cualquier número de una eval necesita una frase sobre qué mide y con qué modelo.**
    - **La clave, siempre por entorno.**

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye RAG, SDK de modelos ni proyectos empaquetados | — |
| **Documentación oficial** | |
| Anthropic — Empezar | <https://platform.claude.com/docs/en/get-started> |
| Anthropic — Modelos | <https://platform.claude.com/docs/en/about-claude/models/overview> |
| Anthropic — Embeddings | <https://platform.claude.com/docs/en/build-with-claude/embeddings> |
| Anthropic — Citas | <https://platform.claude.com/docs/en/build-with-claude/citations> |
| Anthropic — Definir criterios de éxito y evaluaciones | <https://platform.claude.com/docs/en/build-with-claude/define-success> |
| SDK de Python de Anthropic | <https://github.com/anthropics/anthropic-sdk-python> |
| pytest — Primeros pasos | <https://docs.pytest.org/en/stable/getting-started.html> |
| Guía de empaquetado — `pyproject.toml` | <https://packaging.python.org/en/latest/guides/writing-pyproject-toml/> |
