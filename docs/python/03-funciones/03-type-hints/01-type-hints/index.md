# Type hints { .section-python .bloque-python }

> Los type hints son anotaciones que dicen qué tipo espera y devuelve cada función. Python no las comprueba al ejecutar: son para ti, para tu editor y para herramientas como mypy. Aquí ves la sintaxis, `TypedDict` y por qué importan con los SDK de IA.

---

## Anotar parámetros y retorno {: .topic-title }

Un **type hint** (*sugerencia de tipo*) se escribe con `:` detrás de un parámetro y con `->` antes de los dos puntos de la función, para el valor devuelto. Los apuntes de la escuela lo presentan en una página muy breve («metadades») y dicen que se hace «con la función annotation». No es una función: es **sintaxis**, y no cambia lo que hace el código.

**1. El script**

```python
# hints.py
def build_prompt(system_prompt: str, question: str, max_words: int = 50) -> str:
    return f"{system_prompt}\n\nPregunta: {question[:max_words]}"


print(build_prompt("Eres breve.", "¿Qué es un token?"))
print(build_prompt.__annotations__)
print(build_prompt(system_prompt=123, question=456))
```

**2. Cómo se ejecuta**

```bash
python hints.py
```

**3. Qué pasa por dentro.** Python guarda las anotaciones en `__annotations__` y **no hace nada más con ellas**. La tercera llamada rompe el tipo a propósito: se ejecuta igualmente, y el error que aparece no viene de la anotación, sino de que el código intenta `456[:50]`.

**4. La salida**

```text
Eres breve.

Pregunta: ¿Qué es un token?
{'system_prompt': <class 'str'>, 'question': <class 'str'>, 'max_words': <class 'int'>, 'return': <class 'str'>}
Traceback (most recent call last):
  ...
TypeError: 'int' object is not subscriptable
```

!!! warning "Los type hints NO se comprueban al ejecutar"
    Es la aclaración que faltaba en los apuntes. `system_prompt: str` no impide pasar un entero. Si el código llega a funcionar con ese entero, funcionará; si no, fallará por otra razón. Quien comprueba los tipos son las **herramientas externas** (mypy, pyright) y tu editor, antes de ejecutar.

---

## Tipos de colecciones y opcionales {: .topic-title }

Para colecciones se indica también el tipo de lo que contienen, entre corchetes. Con `X | None` se dice «o este tipo, o `None`».

```python
# generics.py
def count_by_role(messages: list[dict[str, str]]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for message in messages:
        role = message["role"]
        counts[role] = counts.get(role, 0) + 1
    return counts


def find_title(titles: list[str], word: str) -> str | None:
    for title in titles:
        if word in title:
            return title
    return None


def pair(city: str, salary: int) -> tuple[str, int]:
    return city, salary


messages = [{"role": "user", "content": "a"}, {"role": "assistant", "content": "b"}, {"role": "user", "content": "c"}]
print(count_by_role(messages))
print(find_title(["Frontend", "Backend"], "end"), find_title([], "x"))
print(pair("Madrid", 32000))
print(find_title.__annotations__)
```

```text
{'user': 2, 'assistant': 1}
Frontend None
('Madrid', 32000)
{'titles': list[str], 'word': <class 'str'>, 'return': str | None}
```

| Anotación | Significa |
|---|---|
| `list[str]` | Lista de textos |
| `dict[str, int]` | Diccionario con claves texto y valores enteros |
| `tuple[str, int]` | Tupla de exactamente dos elementos: texto y entero |
| `set[str]` | Set de textos |
| <code>str &#124; None</code> | Un texto o `None` (antes se escribía `Optional[str]`) |
| `counts: dict[str, int] = {}` | Se puede anotar también una variable |

La forma `list[str]` y `str | None` es la actual (Python 3.10 o superior). En código antiguo verás `List[str]` y `Optional[str]` importados de `typing`: significan lo mismo.

!!! tip "`-> str | None` es una promesa honesta"
    Si tu función puede devolver `None` (no encontró nada), dilo en el tipo. Quien la use sabrá que tiene que comprobarlo antes de usar el resultado.

---

## TypedDict {: .topic-title }

Un diccionario como `{"role": "user", "content": "Hola"}` tiene una **forma fija** que `dict[str, str]` no expresa. **`TypedDict`** describe qué claves tiene y de qué tipo es cada una.

```python
# typed_dict.py
from typing import TypedDict


class Message(TypedDict):
    role: str
    content: str


def make_message(role: str, content: str) -> Message:
    return {"role": role, "content": content}


message = make_message("user", "Hola")
print(message, type(message))
print(Message.__annotations__)
bad: Message = {"role": "user"}
print(bad)
```

```text
{'role': 'user', 'content': 'Hola'} <class 'dict'>
{'role': <class 'str'>, 'content': <class 'str'>}
{'role': 'user'}
```

- Un `Message` **sigue siendo un diccionario normal** (`type(message)` es `dict`). `TypedDict` solo añade información para las herramientas.
- La última asignación está mal (falta `content`) y **se ejecuta sin queja**. Otra vez: Python no comprueba.
- La sintaxis `class Message(TypedDict):` usa una clase como molde. Las clases se ven en el pilar de objetos; aquí basta con copiar la forma.

---

## Quién comprueba los tipos {: .topic-title }

Un **comprobador de tipos** lee tu código sin ejecutarlo y avisa de incoherencias. Los más usados son **mypy** y **pyright** (este último es el que alimenta a muchos editores). Se instalan con `pip` en el entorno del proyecto.

```python
# mistakes.py
def double(value: int) -> int:
    return value * 2


reveal = double("ab")
print(reveal)
count: int = "no es un entero"
print(count)


def find(titles: list[str], word: str) -> str:
    for title in titles:
        if word in title:
            return title


print(find(["a"], "z"))
```

Si lo ejecutas con Python, funciona (`abab`, el texto y `None`). Si lo revisas con mypy:

```bash
mypy hints.py typed_dict.py mistakes.py
```

```text
hints.py:8: error: Argument "system_prompt" to "build_prompt" has incompatible type "int"; expected "str"  [arg-type]
hints.py:8: error: Argument "question" to "build_prompt" has incompatible type "int"; expected "str"  [arg-type]
typed_dict.py:17: error: Missing key "content" for TypedDict "Message"  [typeddict-item]
mistakes.py:6: error: Argument 1 to "double" has incompatible type "str"; expected "int"  [arg-type]
mistakes.py:8: error: Incompatible types in assignment (expression has type "str", variable has type "int")  [assignment]
mistakes.py:12: error: Missing return statement  [return]
Found 6 errors in 3 files (checked 3 source files)
```

Mypy encuentra los 6 problemas **sin ejecutar nada**, incluido uno que no habías visto: `find` promete devolver `str` pero, si no encuentra nada, no devuelve nada (es decir, `None`). Habría que anotar `-> str | None`.

!!! warning "Anotar mal es peor que no anotar"
    Un hint que no coincide con lo que la función hace engaña a quien lee y al editor. Si dudas del tipo, deja la anotación fuera hasta tenerlo claro.

!!! tip "Empieza por las firmas"
    Anota los parámetros y el retorno de las funciones (la «frontera» del código) y deja que Python infiera las variables locales. Es donde más se gana con menos esfuerzo.

---

## Python en IA {: .topic-title }

Los SDK de los proveedores de modelos suelen venir **completamente tipados**: los mensajes, los parámetros y las respuestas son tipos que tu editor conoce. Se puede comprobar: el paquete del SDK de Anthropic instalado incluye el archivo marcador `py.typed`, y su tipo para un mensaje de entrada, `MessageParam`, es precisamente un `TypedDict` (como el `Message` de arriba).

Eso te da dos ventajas:

- **Autocompletado y avisos en el editor:** al escribir `role=`, el editor ofrece los valores válidos y marca una errata antes de ejecutar y gastar una petición.
- **Respuestas con forma conocida:** al leer una respuesta, sabes qué campos existen y de qué tipo son.

Y en tu propio código, anotar con `TypedDict` los mensajes y las configuraciones evita pasar un diccionario con una clave mal escrita.

!!! tip "Mypy en tu flujo de trabajo"
    Ejecutar `mypy` antes de probar (o a menudo, en un test o en integración continua) cuesta segundos y detecta de golpe los errores de tipos en las llamadas al modelo, que de otro modo solo verías al gastar una petición.

---

## Comparación con JavaScript {: .topic-title }

| En JS / TypeScript | En Python |
|---|---|
| JavaScript no tiene tipos | Los hints son opcionales y no se comprueban al ejecutar |
| TypeScript: `function f(a: string): number` | `def f(a: str) -> int:` |
| `string[]` | `list[str]` |
| `Record<string, number>` | `dict[str, int]` |
| <code>string &#124; null</code> | <code>str &#124; None</code> |
| `interface Message { role: string }` | `class Message(TypedDict): role: str` |
| `tsc` comprueba al compilar | `mypy` / `pyright` comprueban por separado |
| Los tipos desaparecen al compilar | Las anotaciones **sí** existen en ejecución (`__annotations__`) |

!!! tip "Consejos"
    - **Los hints son documentación comprobable**, no validación en tiempo de ejecución.
    - **Para validar datos de verdad en ejecución** (por ejemplo, la respuesta de un modelo), hace falta una librería de validación, como se ve en el pilar de objetos.
    - **`help(funcion)`** muestra las anotaciones junto al docstring.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Metadades (bloque antiguo) — «Afegint metadades» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_023/#afegint-metadades> |
| **Documentación oficial** | |
| Tutorial — Anotaciones de funciones | <https://docs.python.org/3/tutorial/controlflow.html#function-annotations> |
| Módulo `typing` | <https://docs.python.org/3/library/typing.html> |
| `typing.TypedDict` | <https://docs.python.org/3/library/typing.html#typing.TypedDict> |
| Cómo trabajar con anotaciones (HOWTO) | <https://docs.python.org/3/howto/annotations.html> |
| Glosario — «annotation» | <https://docs.python.org/3/glossary.html#term-annotation> |
| PEP 484 — Type hints | <https://peps.python.org/pep-0484/> |
| PEP 589 — TypedDict | <https://peps.python.org/pep-0589/> |
| Documentación de mypy | <https://mypy.readthedocs.io/en/stable/> |
| Documentación de pyright | <https://microsoft.github.io/pyright/> |
