# Un cliente de prompts reutilizable { .section-python .bloque-python }

> Un pequeño cliente que une todo el pilar: funciones tipadas que construyen mensajes, configuración con `**params`, un reintento y un cronómetro como decoradores, y un generador que simula el streaming. No llama a ninguna API real: la respuesta es simulada.

---

## Qué vamos a construir {: .topic-title }

Un módulo con las piezas de un cliente de modelos de lenguaje, cada una en su función:

1. `make_message` y `build_messages`: construyen la lista de mensajes (`role` / `content`).
2. `send`: «envía» la petición. Aquí falla dos veces a propósito y responde a la tercera.
3. `@retry` y `@timer`: reintentan y miden, sin tocar el cuerpo de `send`.
4. `stream`: entrega la respuesta trozo a trozo.

| Pieza | Capítulo |
|---|---|
| Funciones con retorno y docstring | [Funciones y retorno](../../01-funciones-basicas/01-funciones-y-retorno/index.md) |
| `/` y `*` en la firma | [Parámetros](../../01-funciones-basicas/02-parametros/index.md) |
| `**params` | [\*args y \*\*kwargs](../../02-args-y-kwargs/01-args-y-kwargs/index.md) |
| `Message`, `list[Message]`, `Iterator[str]` | [Type hints](../../03-type-hints/01-type-hints/index.md) |
| `@timer`, `@retry` | [Decoradores](../../05-decoradores/01-decoradores/index.md) |
| `stream` | [Generadores](../../06-generadores/01-generadores/index.md) |

---

## El script completo {: .topic-title }

**1. El script**

```python
# prompt_client.py
import time
from collections.abc import Iterator
from functools import wraps
from typing import TypedDict


class Message(TypedDict):
    role: str
    content: str


def timer(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return function(*args, **kwargs)
        finally:
            elapsed = time.perf_counter() - start
            print(f"[TIEMPO] {function.__name__}: {elapsed:.1f} s")
    return wrapper


def retry(max_attempts: int = 3, base_delay: float = 0.1):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return function(*args, **kwargs)
                except ConnectionError as error:
                    if attempt == max_attempts:
                        raise
                    print(f"[RETRY] intento {attempt} fallido ({error})")
                    time.sleep(base_delay * 2 ** (attempt - 1))
        return wrapper
    return decorator


def make_message(role: str, content: str) -> Message:
    return {"role": role, "content": content}


def build_messages(system_prompt: str, history: list[Message], question: str) -> list[Message]:
    return [make_message("system", system_prompt), *history, make_message("user", question)]


FAILURES_LEFT = {"count": 2}


@timer
@retry(max_attempts=4)
def send(messages: list[Message], /, *, model: str = "modelo-demo", **params: float) -> str:
    if FAILURES_LEFT["count"] > 0:
        FAILURES_LEFT["count"] -= 1
        raise ConnectionError("servidor ocupado")
    question = messages[-1]["content"]
    return f"({model}, {params}) Un token es un trozo de texto. Pregunta: {question}"


def stream(text: str, delay: float = 0.0) -> Iterator[str]:
    for word in text.split():
        time.sleep(delay)
        yield word + " "


settings = {"temperature": 0.2, "top_p": 0.9}
history: list[Message] = []
messages = build_messages("Eres breve.", history, "¿Qué es un token?")
print(len(messages), [message["role"] for message in messages])

reply = send(messages, model="modelo-demo", **settings)
print(reply)

chunks = []
for chunk in stream(reply):
    chunks.append(chunk)
print(len(chunks), "trozos")

history += [messages[-1], make_message("assistant", "".join(chunks).strip())]
print(len(history), history[-1]["role"])
```

**2. Cómo se ejecuta**

```bash
python prompt_client.py
```

**3. Qué pasa por dentro**, de arriba abajo:

- **`Message(TypedDict)`** describe la forma de un mensaje. En ejecución es un diccionario normal; el tipo es para el editor y para `mypy`.
- **`timer`** y **`retry`** son decoradores (con `@wraps`). `retry` tiene argumentos, así que lleva la capa extra `retry(...)` → `decorator` → `wrapper`.
- **`make_message`** y **`build_messages`** devuelven datos; no imprimen. `[make_message("system", ...), *history, make_message("user", ...)]` pone el sistema delante, esparce el historial y deja la pregunta al final, en una lista nueva.
- **`send`** tiene dos decoradores apilados. Se aplican de abajo arriba: primero `@retry` envuelve a `send`, luego `@timer` envuelve ese resultado. Por eso el cronómetro mide **el conjunto**, reintentos incluidos. Su firma usa `messages` solo posicional (`/`), `model` con nombre (`*`) y `**params` para el resto de opciones.
- **`FAILURES_LEFT`** simula un servidor que falla las dos primeras veces. Es un diccionario (mutable) para poder cambiarlo sin `global`.
- **`stream`** es un generador que entrega la respuesta palabra a palabra.
- El bloque final **usa** todo: construye los mensajes, llama a `send` pasando la configuración con `**settings`, recorre el generador y actualiza el historial.

**4. La salida**

```text
2 ['system', 'user']
[RETRY] intento 1 fallido (servidor ocupado)
[RETRY] intento 2 fallido (servidor ocupado)
[TIEMPO] send: 0.3 s
(modelo-demo, {'temperature': 0.2, 'top_p': 0.9}) Un token es un trozo de texto. Pregunta: ¿Qué es un token?
17 trozos
2 assistant
```

Se ven los dos reintentos, el tiempo total (0,1 s + 0,2 s de espera) y la respuesta. Al pasar `mypy prompt_client.py` el resultado es `Success: no issues found in 1 source file`.

!!! warning "TypeError al llamar con posicionales de más"
    `send(messages, "modelo-demo")` falla: `model` está después del `*`, así que solo se puede pasar por nombre (`model="modelo-demo"`). Es la protección que buscábamos.

!!! warning "Decoradores en el orden equivocado"
    Con `@timer` abajo y `@retry` arriba, el cronómetro mediría cada intento por separado y `retry` envolvería a `timer`. Piensa siempre «lo de abajo se aplica primero».

---

## Python en IA {: .topic-title }

Esto es, en pequeño, la forma que tiene un cliente real:

| En el script | En un cliente real |
|---|---|
| `send(...)` con respuesta simulada | La llamada HTTP o al SDK del proveedor |
| `ConnectionError` simulado | Errores de red y de límite de uso |
| `**params` | Temperatura, máximo de tokens, etc., desde configuración |
| `stream(...)` | El flujo de trozos de la respuesta |
| `history` | La conversación, que se reenvía entera en cada petición |
| `mypy` limpio | Los tipos del SDK ayudan a detectar errores antes de gastar peticiones |

Para pasar a un cliente real solo habría que sustituir el cuerpo de `send` por la llamada de verdad. Los decoradores, los tipos y la construcción de mensajes se quedan igual. Esa llamada real se ve en el [pilar 07](../../../07-python-para-ia/index.md).

!!! tip "Pruébalo antes de conectarlo"
    Una función de envío simulada que falla de forma controlada te deja probar el reintento sin esperar a que falle un servidor de verdad.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `async function send(...)` con `fetch` | `def send(...)` (la versión asíncrona está en el [pilar 06](../../../06-ecosistema/index.md)) |
| `withRetry(withTimer(send))` | `@timer` + `@retry` apilados |
| `async function*` para streaming | `def` con `yield` |
| `interface Message { role: string }` | `class Message(TypedDict)` |
| `{ ...settings }` en las opciones | `**settings` |

!!! tip "Consejos"
    - **Separa construir, enviar y consumir:** tres funciones pequeñas se prueban mejor que una grande.
    - **Los decoradores con la lógica «de fuera»** (tiempo, reintento, registro) y la función con la lógica «de dentro».
    - **Pasa `mypy`** antes de añadir una función nueva al cliente.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Funcions i Modularitat (def) — «Retornem valors amb return» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_500/#3-retornem-valors-amb-return> |
| Decoradors (@) en Python — «Creem el nostre primer decorador» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_902/#3-creem-el-nostre-primer-decorador> |
| Barregem *args i **kwargs (bloque antiguo) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_022/#barregem-args-i-kwargs> |
| **Documentación oficial** | |
| Tutorial — Más sobre definir funciones | <https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions> |
| `typing.TypedDict` | <https://docs.python.org/3/library/typing.html#typing.TypedDict> |
| `functools.wraps` | <https://docs.python.org/3/library/functools.html#functools.wraps> |
| Tutorial — Generadores | <https://docs.python.org/3/tutorial/classes.html#generators> |
| `time.perf_counter` | <https://docs.python.org/3/library/time.html#time.perf_counter> |
