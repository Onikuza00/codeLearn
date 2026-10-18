# Evals { .section-python .bloque-python }

> Una evaluación (eval) es un conjunto de preguntas con la respuesta esperada y un código que puntúa tu sistema. Es lo que te dice si un cambio mejora o empeora un RAG. Aquí mides la recuperación (recall@k), la fidelidad de las respuestas, lo que ocurre cuando el modelo no es determinista y por qué un LLM como juez necesita cuidado.

---

## Por qué evaluar {: .topic-title }

Con un sistema que usa un modelo de lenguaje, «parece que funciona» no basta. Cambias el tamaño de los trozos, el prompt o el modelo, y no sabes si has mejorado algo o has roto otra cosa. Una **eval** convierte esa duda en un número que se puede comparar.

En un RAG se miden **dos cosas distintas**, porque pueden fallar por separado:

| Parte | Pregunta | Métricas típicas |
|---|---|---|
| **Recuperación** | ¿Los fragmentos correctos están entre los que se entregan al modelo? | recall@k, MRR |
| **Generación** | ¿La respuesta es correcta, se apoya en las fuentes y cita bien? | Fidelidad (*groundedness*), relevancia, corrección |
| **Abstención** | ¿Dice «No lo sé» cuando no hay respuesta en los documentos? | Porcentaje de abstenciones correctas |

Si la recuperación falla, el mejor modelo del mundo no puede responder; si la generación falla, buenos fragmentos se desperdician. Saber **cuál** de las dos falla te dice dónde arreglar.

---

## El conjunto de preguntas {: .topic-title }

Cada caso: una pregunta, el documento donde está la respuesta (`expected_doc`, o `null` si **no** está en el corpus) y, opcionalmente, un texto que la respuesta debería contener.

```json
[
  {"id": "q01", "question": "¿Cuánto se paga en el puesto de backend en Barcelona?", "expected_doc": "backend", "expected_text": "41000"},
  {"id": "q08", "question": "¿Qué puestos permiten teletrabajo?", "expected_doc": "ml"},
  {"id": "q09", "question": "¿Cuál es la capital de Francia?", "expected_doc": null},
  {"id": "q10", "question": "¿Cuántas vacaciones da Neural SL?", "expected_doc": null}
]
```

(Son 4 de los 10 casos de `eval_cases.json`.) Reglas para construir uno bueno:

- **Preguntas reales** (o parecidas a las que harán los usuarios), no las que sabes que tu sistema acierta.
- **Incluye casos sin respuesta** (`null`): es la única forma de medir que el sistema se abstiene.
- **Casos difíciles**: sinónimos (`teletrabajo`), preguntas que mezclan documentos, respuestas con cifras.
- **Pocos pero revisados** vale más que muchos sin revisar. Empieza con 20-50 y crece con los fallos reales.
- **Guárdalo en un archivo** (JSON o CSV, [Formatos](../../../04-ficheros-y-errores/02-formatos/02-json/index.md)) y en el repositorio.

---

## Medir la recuperación y de extremo a extremo {: .topic-title }

El código de las métricas (`evals.py`, completo en el [capítulo final](../../06-python-en-ia/01-rag-de-documentos-propios/index.md)):

- **recall@k**: de las preguntas que **sí** tienen respuesta en el corpus, ¿en qué fracción aparece el documento esperado entre los *k* primeros resultados?
- **MRR** (*mean reciprocal rank*): promedio de `1 / posición` del primer resultado correcto (1.0 si siempre es el primero).
- **Puntuación de extremo a extremo**: un caso «pasa» si la respuesta cita una fuente válida del documento esperado y contiene el texto esperado; los casos `null` pasan si responde `No lo sé`.

**1. El script**

```python
# run_evals.py
from pathlib import Path

from ragofertas.chunking import chunk_by_paragraph
from ragofertas.corpus import DOCUMENTS
from ragofertas.embeddings import TfidfEmbedder
from ragofertas.evals import load_cases, recall_at_k, reciprocal_rank, run_eval
from ragofertas.rag import ExtractiveFakeLLM, RagPipeline
from ragofertas.store import InMemoryStore

cases = load_cases(Path("eval_cases.json"))
store = InMemoryStore(TfidfEmbedder())
store.index([chunk for document in DOCUMENTS for chunk in chunk_by_paragraph(document)])

print(len(cases), "casos,", sum(case.expected_doc is None for case in cases), "fuera del corpus")
for k in (1, 3, 5):
    print(f"recall@{k} = {recall_at_k(store, cases, k):.2f}")

answerable = [case for case in cases if case.expected_doc]
mrr = sum(reciprocal_rank(store, case) for case in answerable) / len(answerable)
print(f"MRR = {mrr:.2f}")

report = run_eval(RagPipeline(store, ExtractiveFakeLLM(), k=3), cases)
print(f"puntuación de extremo a extremo = {report['score']:.2f}")
for row in report["rows"]:
    print(f"{row['id']} {'OK  ' if row['passed'] else 'FALLA'} {row['answer'][:70]}")
```

**2. Cómo se ejecuta**

```bash
python run_evals.py
```

**3. Qué pasa por dentro.** Se indexa el corpus como en [Mini-RAG](../../04-mini-rag/01-mini-rag/index.md), se calculan las métricas de recuperación para tres valores de *k* y se ejecuta el pipeline completo (con el LLM simulado) sobre cada caso.

**4. La salida**

```text
10 casos, 2 fuera del corpus
recall@1 = 0.88
recall@3 = 0.88
recall@5 = 0.88
MRR = 0.88
puntuación de extremo a extremo = 0.60
q01 OK   Data Corp ofrece un puesto de Backend Developer en Barcelona con un sa
q02 FALLA Se trabaja con Python, PyTorch y modelos de lenguaje [1].
q03 OK   Se pide experiencia diseñando bases de datos y escribiendo tests autom
q04 OK   Las herramientas son Python, SQL y pandas [1].
q05 FALLA Tech Solutions busca un Frontend Developer en Madrid [1].
q06 OK   Test Lab necesita un QA Engineer en Girona con un salario de 30000 eur
q07 OK   Antes de una entrevista técnica conviene repasar los fundamentos del l
q08 FALLA No lo sé
q09 OK   No lo sé
q10 FALLA Neural SL contrata un ML Engineer en Madrid [1].
```

Cómo leer los números:

- **recall@k = 0.88** (7 de 8 preguntas con respuesta): la recuperación casi siempre encuentra el documento correcto, y no mejora con *k* mayor: el fallo que queda (`q08`, «teletrabajo») es de un tipo que más resultados no arregla, porque la palabra no comparte vocabulario con el texto.
- **Puntuación de extremo a extremo = 0.60**: peor que la recuperación. La diferencia está en la **generación**.
- Los cuatro fallos son de **tres causas distintas**:
    - `q08`: **recuperación** (el embedding léxico no entiende «teletrabajo»).
    - `q02` y `q05`: **generación** (el LLM simulado extrae la frase equivocada; los fragmentos correctos sí llegaron).
    - `q10`: **abstención** (el corpus menciona a Neural SL, así que se recuperan fragmentos, pero no hablan de vacaciones; el LLM simulado no sabe decir «No lo sé»; un modelo real, con la instrucción del prompt, debería abstenerse, y es justo lo que esta eval comprobaría).

!!! warning "Un LLM simulado solo evalúa tu código, no a Claude"
    Estos números evalúan la **recuperación** y el **andamiaje** (prompt, citas, umbrales). La calidad de las respuestas de un modelo real solo se mide ejecutando la eval con ese modelo (con el coste y la variabilidad que implica). Aquí no se ha hecho: no hay clave en el entorno.

---

## Como tests: puertas y fallos conocidos {: .topic-title }

Una eval útil se ejecuta sola. Con pytest ([Tests con pytest](../../../06-ecosistema/05-tests/01-pytest/index.md)) se convierte en una **puerta** (*gate*): si el número baja del umbral, el test falla.

```python
# tests/test_evals.py
from pathlib import Path

import pytest

from ragofertas.chunking import chunk_by_paragraph
from ragofertas.corpus import DOCUMENTS
from ragofertas.embeddings import TfidfEmbedder
from ragofertas.evals import load_cases, recall_at_k, run_eval
from ragofertas.rag import ExtractiveFakeLLM, RagPipeline
from ragofertas.store import InMemoryStore

CASES = load_cases(Path(__file__).parent.parent / "eval_cases.json")

# Casos que hoy fallan por límites conocidos (embedding léxico, LLM simulado).
# strict=True: si alguno empieza a pasar, el test avisa para quitarlo de la lista.
KNOWN_FAILURES = {
    "q02": "el LLM simulado cita la frase equivocada",
    "q05": "el LLM simulado no incluye el salario",
    "q08": "el embedding léxico no entiende 'teletrabajo'",
    "q10": "el LLM simulado no sabe abstenerse",
}


@pytest.fixture(scope="module")
def store():
    store = InMemoryStore(TfidfEmbedder())
    store.index([chunk for document in DOCUMENTS for chunk in chunk_by_paragraph(document)])
    return store


@pytest.fixture(scope="module")
def pipeline(store):
    return RagPipeline(store, ExtractiveFakeLLM(), k=3)


def test_retrieval_recall_gate(store):
    assert recall_at_k(store, CASES, k=3) >= 0.85


def test_end_to_end_score_does_not_regress(pipeline):
    assert run_eval(pipeline, CASES)["score"] >= 0.60


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.id)
def test_case(pipeline, case, request):
    if case.id in KNOWN_FAILURES:
        request.applymarker(pytest.mark.xfail(reason=KNOWN_FAILURES[case.id], strict=True))
    report = run_eval(pipeline, [case])
    assert report["rows"][0]["passed"], report["rows"][0]["answer"]
```

```bash
python -m pytest tests/test_evals.py -v -rx
```

```text
tests/test_evals.py::test_retrieval_recall_gate PASSED                   [  8%]
tests/test_evals.py::test_end_to_end_score_does_not_regress PASSED       [ 16%]
tests/test_evals.py::test_case[q01] PASSED                               [ 25%]
tests/test_evals.py::test_case[q02] XFAIL (el LLM simulado cita la f...) [ 33%]
tests/test_evals.py::test_case[q03] PASSED                               [ 41%]
tests/test_evals.py::test_case[q04] PASSED                               [ 50%]
tests/test_evals.py::test_case[q05] XFAIL (el LLM simulado no incluy...) [ 58%]
tests/test_evals.py::test_case[q06] PASSED                               [ 66%]
tests/test_evals.py::test_case[q07] PASSED                               [ 75%]
tests/test_evals.py::test_case[q08] XFAIL (el embedding léxico no en...) [ 83%]
tests/test_evals.py::test_case[q09] PASSED                               [ 91%]
tests/test_evals.py::test_case[q10] XFAIL (el LLM simulado no sabe a...) [100%]

=========================== short test summary info ===========================
XFAIL tests/test_evals.py::test_case[q02] - el LLM simulado cita la frase equivocada
XFAIL tests/test_evals.py::test_case[q05] - el LLM simulado no incluye el salario
XFAIL tests/test_evals.py::test_case[q08] - el embedding léxico no entiende 'teletrabajo'
XFAIL tests/test_evals.py::test_case[q10] - el LLM simulado no sabe abstenerse
======================== 8 passed, 4 xfailed in 0.41s =========================
```

(Salida de pytest sin las líneas de cabecera.)

- Las dos primeras pruebas son **puertas**: si cambias algo y la recuperación baja de 0.85, o la puntuación global de 0.60, el test falla y lo notas **antes** de publicar.
- Cada caso es un test aparte (`parametrize`), con el identificador `q01`... para localizar el fallo.
- Los fallos **conocidos** se marcan `xfail(strict=True)`: no rompen la suite, pero quedan documentados con su motivo, y **si alguno empieza a pasar**, el test falla con «XPASS(strict)» para recordarte quitarlo de la lista. Es una forma honesta de convivir con un sistema imperfecto.

!!! tip "Umbral = lo que hoy se consigue, menos un margen"
    No pongas el umbral en 1.00. Fija el actual (o un poco menos) para que **detecte regresiones**, y súbelo cuando mejores. Una puerta imposible de cumplir se desactiva «temporalmente» y nunca vuelve.

---

## Modelos no deterministas: repetir y mirar la varianza {: .topic-title }

Un modelo real puede dar respuestas distintas a la misma pregunta. Una sola ejecución de la eval puede salir bien o mal por azar. La solución: **repetir** la eval varias veces y mirar el conjunto: la **media**, la **desviación** y el **peor caso**.

Para verlo sin gastar, un LLM simulado «inestable» (con semilla, así que es reproducible) que a veces olvida citar o se abstiene sin motivo:

```python
# variance_demo.py (fragmento: la clase FlakyLLM y las llamadas)
class FlakyLLM:
    """Simula un modelo no determinista: a veces olvida citar y a veces se abstiene sin motivo."""

    def __init__(self, seed: int) -> None:
        self.random = random.Random(seed)
        self.inner = ExtractiveFakeLLM()

    def complete(self, system: str, user: str) -> str:
        roll = self.random.random()
        text = self.inner.complete(system, user)
        if roll < 0.15:
            return "No lo sé"
        if roll < 0.35:
            return text.replace(" [1].", ".")
        return text


stable = repeat_eval(lambda seed: RagPipeline(store, ExtractiveFakeLLM(), k=3), cases, runs=5)
flaky = repeat_eval(lambda seed: RagPipeline(store, FlakyLLM(seed), k=3), cases, runs=10)

print("determinista:", [round(score, 2) for score in stable["scores"]])
print("no determinista:", [round(score, 2) for score in flaky["scores"]])
print(f"media={flaky['mean']:.2f} desviación={flaky['stdev']:.2f} peor={flaky['worst']:.2f}")
print("pasa la puerta de media >= 0.50:", flaky["mean"] >= 0.50)
print("pasa la puerta del peor caso >= 0.50:", flaky["worst"] >= 0.50)
```

```text
determinista: [0.6, 0.6, 0.6, 0.6, 0.6]
no determinista: [0.5, 0.4, 0.4, 0.3, 0.4, 0.5, 0.5, 0.3, 0.3, 0.6]
media=0.42 desviación=0.10 peor=0.30
pasa la puerta de media >= 0.50: False
pasa la puerta del peor caso >= 0.50: False
```

- El sistema determinista da **0.60 siempre**: una ejecución basta.
- El inestable oscila entre 0.30 y 0.60: **una sola ejecución podría haber dicho 0.60** y haber tapado un sistema que de media rinde 0.42.
- Las puertas razonables miran la **media** (¿rinde bien en general?) y también el **peor caso** o un percentil (¿qué tal es el peor día?). Aquí ninguna pasa.
- Cuántas repeticiones hacen falta depende de la variabilidad y del coste: con un modelo real, cada repetición cuesta dinero, así que se reserva para cambios importantes.

---

## LLM como juez y sus riesgos {: .topic-title }

Algunas propiedades (¿la respuesta es fiel a los fragmentos?, ¿es útil?) son difíciles de comprobar con código determinista. Entonces se usa otro modelo como **juez**: se le da una *rúbrica*, la pregunta, los fragmentos y la respuesta, y devuelve un veredicto. El prompt del juez, y un juez simulado para ver el mecanismo (no es un modelo; solo comprueba que las cifras de la respuesta estén en los fragmentos):

```python
# judge_demo.py (fragmento)
JUDGE_SYSTEM = (
    "Eres un evaluador estricto. Recibes una pregunta, unos fragmentos y una respuesta. "
    "Responde SOLO con un JSON: {\"grounded\": true|false, \"reason\": \"...\"}. "
    "grounded es true únicamente si TODA afirmación de la respuesta está respaldada por los fragmentos."
)

class KeywordJudge:
    def verdict(self, fragments: list[str], answer: str) -> bool:
        numbers = [word for word in answer.replace(".", " ").split() if word.isdigit()]
        return all(any(number in fragment for fragment in fragments) for number in numbers)

labeled = [
    ("El salario es de 41000 euros [1].", True),
    ("El salario es de 45000 euros [1].", False),
    ("Se paga muy bien [1].", False),
    ("El salario es de 41000 euros y hay 25 días de vacaciones [1].", False),
    ("El puesto es en Madrid [1].", False),
]
```

El mensaje que recibiría un juez real (el que construye `judge_prompt`) tiene esta forma:

```text
Pregunta: ¿Cuánto se paga?

Fragmentos:
[1] Data Corp ofrece un puesto de Backend Developer en Barcelona con un salario de 41000 euros anuales.

Respuesta a evaluar:
El salario es de 41000 euros [1].
```

Y los veredictos del juez simulado frente a las etiquetas humanas:

```text
humano=True  juez=True  El salario es de 41000 euros [1].
humano=False juez=False El salario es de 45000 euros [1].
humano=False juez=True  Se paga muy bien [1].
humano=False juez=False El salario es de 41000 euros y hay 25 días de vacaciones [1].
humano=False juez=True  El puesto es en Madrid [1].
acuerdo juez-humano: 3/5
```

El juez simulado detecta las cifras inventadas (45000, 25 días) pero **da por buenas** las afirmaciones vagas o falsas sin cifras («se paga muy bien», «está en Madrid»). Un juez real hace menos de estas tonterías, pero tiene sus propios fallos. Lo que enseña la tabla es el **procedimiento** que debes aplicar a cualquier juez:

!!! warning "Un juez LLM es otro modelo que puede equivocarse"
    Riesgos conocidos: **sesgo hacia respuestas largas**, **sesgo de posición** (favorecer la primera opción), **preferir respuestas del mismo modelo** que el juez, **no determinismo**, y **coste**. Mitigaciones:

    - **Rúbricas con criterios binarios y concretos** («¿toda cifra aparece en los fragmentos?»), no «puntúa del 1 al 10».
    - **Calibra el juez con etiquetas humanas**: etiqueta a mano 30-50 casos y mide el **acuerdo** (como en la tabla de arriba, pero con muchos más casos). Si el acuerdo es bajo, no te fíes del juez.
    - **Usa un modelo distinto** al evaluado, si puedes, y repite varias veces (varianza, apartado anterior).
    - **Prefiere comprobaciones deterministas** cuando existan (¿la cita existe?, ¿aparece la cifra?) y deja al juez lo que no se puede automatizar.
    - Un juez **no sustituye** a una persona revisando los fallos.

Esta parte no se ha ejecutado con un modelo real; el juez de la tabla es un simulador.

---

## Evals como puerta en un flujo de trabajo {: .topic-title }

Un flujo con especificaciones y verificación (especificar → tareas → implementar → verificar) está pensado para comprobar que el código hace lo que dice la especificación. Para una función que usa un modelo, esa comprobación necesita tres piezas que un test normal no tiene:

- **Rúbrica derivada de la especificación**: cada requisito se convierte en un criterio medible (el «debe citar la fuente» de la especificación es el `citations_are_valid` de este capítulo).
- **Puerta en la fase de verificación**: la eval se ejecuta como un test más y su umbral decide si la tarea se da por buena.
- **Varias ejecuciones**: porque el modelo no es determinista, la puerta se evalúa sobre la media y el peor caso, no sobre una ejecución.

Se buscó en la documentación del repositorio `sdd-vora` y **no se encontró ningún apartado de evaluaciones** de funciones con modelos: ahí está el hueco. Este capítulo describe cómo cubrirlo con las mismas herramientas que ya usas (pytest, un conjunto de casos en JSON, umbrales y repeticiones), sin necesitar infraestructura adicional.

!!! info "Qué es criterio propio y no está en la documentación"
    Las métricas (recall@k, MRR), la estructura de la eval, el umbral con margen, el uso de `xfail(strict=True)`, el procedimiento de calibrar un juez y la propuesta de puerta en un flujo SDD son criterio propio basado en prácticas habituales. La documentación de Anthropic ofrece una guía general sobre cómo definir criterios de éxito y construir evaluaciones (ver recursos), sin fijar estos umbrales. Todos los números de este capítulo salen de datos de juguete (6 documentos, 10 preguntas) y de modelos simulados.

---

## Python en IA {: .topic-title }

Las evaluaciones son lo que separa un prototipo que «parece bien» de un sistema que puedes mejorar con confianza. En el día a día:

- **Antes de cambiar nada**, ejecuta la eval y apunta la puntuación.
- **Cada cambio** (tamaño de trozo, prompt, modelo, `k`) se compara con esa línea base.
- **Cada fallo real** de un usuario se convierte en un caso nuevo del conjunto.
- **Registra los resultados** con la versión del prompt y del modelo, para poder compararlos con el tiempo.

!!! tip "Empieza con 20 casos y ya"
    Una eval pequeña que se ejecuta de verdad vale más que una enorme que nunca se termina de construir.

---

## Comparación con JavaScript {: .topic-title }

| En JS / TypeScript | En Python |
|---|---|
| Jest / Vitest para la suite | pytest |
| `test.each(cases)` | `@pytest.mark.parametrize` |
| `test.failing` / `it.fails` | `pytest.mark.xfail(strict=True)` |
| Promptfoo, evalite y otras herramientas de evaluación | Hay librerías de evaluación; también vale lo hecho a mano |
| `JSON.parse(fs.readFileSync(...))` | `json.load(open(...))` |

!!! tip "Consejos"
    - **Separa recuperación, generación y abstención** en las métricas.
    - **Casos sin respuesta** siempre.
    - **Repite y mira la varianza** con modelos reales.
    - **Calibra los jueces** con etiquetas humanas.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye evaluaciones de sistemas con modelos | — |
| **Documentación oficial** | |
| Anthropic — Definir criterios de éxito y construir evaluaciones | <https://platform.claude.com/docs/en/build-with-claude/define-success> |
| pytest — Marcar tests como `xfail` y parametrizar | <https://docs.pytest.org/en/stable/how-to/parametrize.html> |
| pytest — Fixtures | <https://docs.pytest.org/en/stable/how-to/fixtures.html> |
| Python — `statistics` (media y desviación) | <https://docs.python.org/3/library/statistics.html> |
| Python — `random.Random` (simulación reproducible con semilla) | <https://docs.python.org/3/library/random.html#random.Random> |
