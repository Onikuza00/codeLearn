# Tests con pytest { .section-python .bloque-python }

> Un test es código que comprueba que otro código hace lo que dice. Con `pytest` se escriben como funciones con `assert`. Aquí ves cómo se escriben, qué hacen las fixtures y `parametrize`, y cómo `monkeypatch` evita llamar a APIs reales.

---

## Tu primer test {: .topic-title }

Probar a mano («lo ejecuto y miro») no escala. Un **test automático** guarda esa comprobación para repetirla en un segundo cada vez que cambias algo. **pytest** es la herramienta estándar: **no es de la biblioteca estándar**, se instala con `pip` (idealmente como dependencia de desarrollo en el `pyproject.toml`, [Proyecto y configuración](../../02-proyecto-y-configuracion/01-proyecto-y-configuracion/index.md)):

```bash
python -m pip install pytest
```

**1. El código a probar**

```python
# prompts.py
def build_prompt(system_prompt, question):
    if not question.strip():
        raise ValueError("la pregunta está vacía")
    return f"{system_prompt}\n\nPregunta: {question.strip()}"


def count_words(text):
    return len(text.split())
```

**2. Los tests**, en un archivo que empieza por `test_`:

```python
# test_prompts.py
import pytest

from prompts import build_prompt, count_words


def test_build_prompt_joins_system_and_question():
    prompt = build_prompt("Eres breve.", "  ¿Qué es un token?  ")
    assert prompt == "Eres breve.\n\nPregunta: ¿Qué es un token?"


def test_empty_question_raises():
    with pytest.raises(ValueError, match="vacía"):
        build_prompt("Eres breve.", "   ")


@pytest.mark.parametrize(
    "text, expected",
    [
        ("", 0),
        ("hola", 1),
        ("Explica qué es un token", 5),
        ("  espacios   de   más  ", 3),
    ],
)
def test_count_words(text, expected):
    assert count_words(text) == expected
```

**3. Cómo se ejecuta**

```bash
python -m pytest
```

**4. Qué pasa por dentro.** pytest busca archivos `test_*.py`, y dentro funciones que empiecen por `test_`. Ejecuta cada una. Si termina sin error, pasa; si un `assert` es falso o salta una excepción, falla. No hay clases ni métodos especiales: **una función y un `assert`**.

- **`assert condición`**: la comprobación. pytest reescribe el `assert` para explicar qué falló.
- **`pytest.raises(Tipo, match=...)`**: comprueba que algo **lanza** el error esperado (`match` es un texto o patrón del mensaje).
- **`@pytest.mark.parametrize`**: ejecuta la misma función con varios datos. Cada fila es un test independiente.

Si añades un test que falla a propósito (`assert count_words("uno dos tres") == 4`):

```text
......F                                                                  [100%]
================================== FAILURES ===================================
_____________________________ test_this_one_fails _____________________________

    def test_this_one_fails():
>       assert count_words("uno dos tres") == 4
E       AssertionError: assert 3 == 4
E        +  where 3 = count_words('uno dos tres')

test_prompts.py:31: AssertionError
=========================== short test summary info ===========================
FAILED test_prompts.py::test_this_one_fails - AssertionError: assert 3 == 4
1 failed, 6 passed in 0.16s
```

El informe dice **qué línea**, **qué valor** salió (`3`) y **de qué llamada** (`count_words('uno dos tres')`). Es la gran ventaja del `assert` simple.

!!! warning "Un test en el que no compruebas nada"
    Un test que ejecuta código pero no tiene `assert` ni `raises` pasa siempre. Cada test debe afirmar algo concreto.

!!! tip "Un nombre que diga lo que garantiza"
    `test_empty_question_raises` se lee como una especificación. Cuando falla, el nombre ya te dice qué se rompió.

---

## Fixtures {: .topic-title }

Una **fixture** es una función que **prepara** algo que los tests necesitan (datos, archivos, objetos) y se les entrega pidiéndola **por nombre como parámetro**.

```python
# test_fixtures.py
import json

import pytest


@pytest.fixture
def conversation():
    return {"messages": [{"role": "user", "content": "Hola"}]}


@pytest.fixture
def conversation_file(tmp_path, conversation):
    path = tmp_path / "conversation.json"
    path.write_text(json.dumps(conversation), encoding="utf-8")
    return path


def test_fixture_data_is_fresh_each_time(conversation):
    conversation["messages"].append({"role": "assistant", "content": "x"})
    assert len(conversation["messages"]) == 2


def test_another_test_gets_a_new_copy(conversation):
    assert len(conversation["messages"]) == 1


def test_file_written_in_temp_dir(conversation_file):
    data = json.loads(conversation_file.read_text(encoding="utf-8"))
    assert data["messages"][0]["content"] == "Hola"
    assert conversation_file.exists()
```

- Cada test que pide `conversation` recibe **una copia nueva**: el primero la modifica, el segundo la ve intacta. Los tests no deben depender entre sí.
- Las fixtures pueden **pedir otras fixtures** (`conversation_file` usa `conversation`).
- **`tmp_path`** es una fixture de pytest: una carpeta temporal única para ese test, que se borra después. Ideal para probar código que escribe archivos ([Rutas y ficheros](../../../04-ficheros-y-errores/01-rutas-y-ficheros/01-pathlib/index.md)).
- Las fixtures compartidas por varios archivos van en un `conftest.py` junto a los tests.

---

## monkeypatch y capsys {: .topic-title }

Un test no debería llamar a una API real: es lento, cuesta dinero y puede fallar por motivos ajenos. **`monkeypatch`** cambia cosas **durante ese test** y lo deja todo como estaba al terminar. **`capsys`** captura lo que el código imprime.

```python
# test_monkey.py
import os
import time


def read_model():
    return os.getenv("CHAT_MODEL", "modelo-demo")


def slow_operation():
    time.sleep(5)
    return "hecho"


def test_env_var(monkeypatch):
    monkeypatch.setenv("CHAT_MODEL", "de-prueba")
    assert read_model() == "de-prueba"


def test_env_var_restored():
    assert read_model() == "modelo-demo"


def test_replace_a_function(monkeypatch):
    monkeypatch.setattr(time, "sleep", lambda seconds: None)
    assert slow_operation() == "hecho"


def test_output(capsys):
    print("hola desde la función")
    assert capsys.readouterr().out == "hola desde la función\n"
```

```text
test_fixtures.py::test_fixture_data_is_fresh_each_time PASSED            [ 14%]
test_fixtures.py::test_another_test_gets_a_new_copy PASSED               [ 28%]
test_fixtures.py::test_file_written_in_temp_dir PASSED                   [ 42%]
test_monkey.py::test_env_var PASSED                                      [ 57%]
test_monkey.py::test_env_var_restored PASSED                             [ 71%]
test_monkey.py::test_replace_a_function PASSED                           [ 85%]
test_monkey.py::test_output PASSED                                       [100%]
============================== 7 passed in 0.10s ==============================
```

(Salida de `python -m pytest test_fixtures.py test_monkey.py -v`, sin las cabeceras.)

- `monkeypatch.setenv` define una variable de entorno **solo durante el test**; el siguiente test (`test_env_var_restored`) ve el valor original.
- `monkeypatch.setattr(time, "sleep", ...)` sustituye `time.sleep` por una función que no hace nada: la operación de 5 segundos acaba al instante. Se restaura al terminar.
- `capsys.readouterr()` devuelve lo que se imprimió (`out`) y lo que fue a la salida de errores (`err`).

Para elegir qué tests correr: `pytest -k "count_words or empty"` filtra por nombre; `pytest test_prompts.py::test_count_words` apunta a uno.

!!! warning "Sustituir lo que se *usa*, no lo que se *define*"
    `monkeypatch.setattr(cli, "ChatClient", FakeClient)` cambia el nombre `ChatClient` **dentro del módulo `cli`**, que es donde se busca. Si lo cambias en el módulo donde se definió, pero `cli` ya lo importó, no surte efecto.

---

## No llamar a APIs: el patrón {: .topic-title }

Hay tres formas de aislar el código de la red:

| Técnica | Cómo | Cuándo |
|---|---|---|
| **Transporte falso** | `httpx.MockTransport(handler)`: el cliente real devuelve respuestas que tú decides | Probar el cliente HTTP entero (cabeceras, reintentos, errores) |
| **Cliente falso** | `monkeypatch.setattr(cli, "ChatClient", FakeClient)` | Probar la capa de arriba (CLI) sin tocar HTTP |
| **Servidor local** | Un servidor simulado en un hilo | Pruebas de integración más realistas |

Los tres aparecen en el [CLI de chat testeado](../../07-python-en-ia/01-cli-de-chat-testeado/index.md), con 22 tests. La estrategia: los tests **rápidos y deterministas** (sin red) son la base; solo unos pocos de integración tocan un servidor local.

!!! tip "Testeable por diseño"
    Si una función hace «preparar, llamar a la API, interpretar», sepáralas: preparar e interpretar se prueban sin red. Recibir el cliente o el transporte como parámetro (en vez de crearlo dentro) lo hace sustituible.

---

## Python en IA {: .topic-title }

Probar código con modelos tiene dos mitades:

- **Lo determinista** (construcción de prompts, parseo y validación de respuestas, reintentos, configuración): se prueba con tests normales, rápidos y sin red. Aquí está el valor.
- **Lo no determinista** (la calidad de la respuesta del modelo): no se comprueba con `assert ==`. Son las **evaluaciones** (*evals*), con conjuntos de preguntas, métricas y umbrales ([pilar 07](../../../07-python-para-ia/index.md)).

!!! warning "Un test no debe gastar dinero"
    Si un test llama a un modelo de verdad, cada ejecución cuesta, tarda y puede dar resultados distintos. Mantén las llamadas reales fuera de la suite normal.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python (pytest) |
|---|---|
| Jest / Vitest | pytest |
| `test("...", () => { })` | `def test_...():` |
| `expect(a).toBe(b)` | `assert a == b` |
| `expect(fn).toThrow(...)` | `with pytest.raises(...)` |
| `test.each([...])` | `@pytest.mark.parametrize` |
| `beforeEach` | Fixtures |
| `jest.mock` / `vi.stubEnv` | `monkeypatch` |

!!! tip "Consejos"
    - **Un test, una idea.** Si falla, sabes qué se rompió.
    - **Tests independientes**: no pueden depender del orden.
    - **`pytest -x`** para en el primer fallo; **`pytest -q`** para salida corta.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye tests automáticos | — |
| **Documentación oficial** | |
| pytest — Primeros pasos | <https://docs.pytest.org/en/stable/getting-started.html> |
| pytest — Escribir aserciones | <https://docs.pytest.org/en/stable/how-to/assert.html> |
| pytest — Fixtures | <https://docs.pytest.org/en/stable/how-to/fixtures.html> |
| pytest — Parametrizar | <https://docs.pytest.org/en/stable/how-to/parametrize.html> |
| pytest — `monkeypatch` | <https://docs.pytest.org/en/stable/how-to/monkeypatch.html> |
| pytest — `tmp_path` | <https://docs.pytest.org/en/stable/how-to/tmp_path.html> |
| pytest — Capturar salida | <https://docs.pytest.org/en/stable/how-to/capture-stdout-stderr.html> |
| httpx — Transportes (`MockTransport`) | <https://www.python-httpx.org/advanced/transports/> |
