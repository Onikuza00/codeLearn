# Funciones y retorno { .section-python .bloque-python }

> Una función es un bloque de código con nombre que se escribe una vez y se usa muchas. Aquí aprendes a definirla, a devolver valores, a documentarla y a entender qué devuelve cuando no devuelve nada.

---

## Definir y llamar {: .topic-title }

Una **función** es un bloque de código al que le pones nombre para poder ejecutarlo cuando quieras. Se define con `def` y se **llama** escribiendo su nombre con paréntesis. Hasta que no la llamas, no se ejecuta.

Este pilar construye, capítulo a capítulo, un pequeño cliente de prompts. Empieza con una función que arma un prompt.

**1. El script**

```python
# basic.py
def build_prompt(system_prompt, question):
    return f"{system_prompt}\n\nPregunta: {question}"


prompt = build_prompt("Eres un asistente breve.", "¿Qué es un token?")
print(prompt)
print(type(build_prompt), build_prompt.__name__)
```

**2. Cómo se ejecuta**

```bash
python basic.py
```

**3. Qué pasa por dentro.** Al llegar a `def`, Python crea un objeto función y le pega el nombre `build_prompt`. El cuerpo **no se ejecuta todavía**. Al llegar a `build_prompt(...)`, Python asigna los argumentos a los parámetros (`system_prompt`, `question`), ejecuta el cuerpo y, cuando encuentra `return`, sale de la función y entrega ese valor a quien llamó. Aquí lo recoge la variable `prompt`.

**4. La salida**

```text
Eres un asistente breve.

Pregunta: ¿Qué es un token?
<class 'function'> build_prompt
```

Como el nombre es solo una etiqueta pegada a un objeto ([Variables y tipos](../../../01-fundamentos/02-datos-basicos/01-variables-y-tipos/index.md)), una función es un valor más: tiene tipo (`function`) y nombre (`__name__`). Eso será clave en [Funciones como valores](../../04-funciones-como-valores/01-lambdas-y-orden-superior/index.md).

La estructura:

| Pieza | Qué es |
|---|---|
| `def build_prompt(...)` | La definición: nombre y parámetros |
| `system_prompt`, `question` | **Parámetros**: los nombres con los que la función ve los datos |
| `"Eres...", "¿Qué...?"` | **Argumentos**: los valores concretos de cada llamada |
| `return ...` | El valor que devuelve la función |

!!! warning "Python lee de arriba abajo: define antes de llamar"
    Si llamas a una función antes de que el `def` se haya ejecutado, falla:

    ```text
    NameError: name 'late' is not defined
    ```

    Cuando todo el código está en un archivo, pon las definiciones arriba.

!!! tip "Dos líneas en blanco antes y después"
    La guía de estilo (PEP 8) pide dos líneas en blanco alrededor de una función de primer nivel. No cambia el resultado, pero es lo que verás en casi todo el código.

---

## return, print y el None implícito {: .topic-title }

`print` **muestra** algo en la terminal. `return` **entrega** un valor al código que llamó. Los apuntes de la escuela lo dicen bien: con `print` el dato se pierde; con `return` lo puedes guardar, comparar o seguir usando.

```python
# returns.py
def show_prompt(prompt):
    print(f"[PROMPT] {prompt}")


def count_words(text):
    return len(text.split())


result = show_prompt("Hola")
print(result)
print(count_words("Explica qué es un token"))

def check(text):
    if not text:
        return
    return text.upper()

print(check(""), check("ok"))
```

```text
[PROMPT] Hola
None
5
None OK
```

- `show_prompt` no tiene `return`, y `result` vale **`None`**. Toda función devuelve algo; si no escribes `return`, Python devuelve `None`.
- `return` sin valor también devuelve `None`. Sale de la función en ese punto (es el early return que ya conoces de las decisiones).
- `return` **termina** la función. Lo que haya debajo no se ejecuta.

Los apuntes del bloque antiguo del curso distinguen «funciones» (con `return`) de «procedimientos» (sin `return`). En Python esa distinción no existe: solo hay funciones, y las «sin return» devuelven `None`. Es útil como idea (esta función hace algo, esta calcula algo), pero el lenguaje no la reconoce.

!!! warning "Un método de texto que olvidas devolver"
    ```python
    # pitfalls.py
    def forgot(text):
        text.strip()

    print(forgot("  hola "))
    ```

    ```text
    None
    ```

    `text.strip()` calcula el texto limpio y lo tira. Falta `return text.strip()`.

!!! warning "Los apuntes dicen que son «métodos de la clase principal»"
    No es cierto. Una función definida con `def` en un archivo es una función del módulo, sin clase. Un **método** es una función dentro de una clase, y Python lo distingue:

    ```python
    # method_check.py
    import types

    def build_prompt(question):
        return question

    class Client:
        def send(self, text):
            return text

    print(type(build_prompt), isinstance(build_prompt, types.FunctionType))
    print(type(Client().send))
    print(type(Client.send))
    ```

    ```text
    <class 'function'> True
    <class 'method'>
    <class 'function'>
    ```

    Las clases se ven en el pilar de objetos. Por ahora basta con que `def` crea funciones sueltas.

---

## Devolver varios valores {: .topic-title }

Una función puede devolver varios valores separados por comas. Python los empaqueta en una **tupla** y tú los desempaquetas al recibirlos ([Tuplas](../../../02-estructuras-de-datos/01-listas-y-tuplas/02-tuplas/index.md), [Desempaquetado](../../../02-estructuras-de-datos/05-desempaquetado/01-desempaquetado/index.md)).

```python
# multi.py
def summarize(text):
    words = text.split()
    return len(words), len(text)


result = summarize("Explica qué es un token")
print(result, type(result))
word_count, char_count = summarize("Hola mundo")
print(word_count, char_count)
```

```text
(5, 23) <class 'tuple'>
2 10
```

La función no devuelve «dos cosas»: devuelve **una** tupla de dos elementos.

### El ejemplo de los apuntes con entrada vacía

Los apuntes tienen una función `minim_maxim` que devuelve el menor y el mayor. Traducida:

```python
# min_max_school.py
def min_max(*numbers):
    if len(numbers) > 0:
        minimum = numbers[0]
        maximum = minimum
    for i in range(1, len(numbers)):
        if numbers[i] < minimum:
            minimum = numbers[i]
        elif numbers[i] > maximum:
            maximum = numbers[i]
    return minimum, maximum


print(min_max(21, 34, 6, 78))
print(min_max())
```

```text
(6, 78)
UnboundLocalError: cannot access local variable 'minimum' where it is not associated with a value
```

Con datos funciona. Con la lista vacía falla: el `if len(numbers) > 0` solo protege la **inicialización**; el `for` y el `return` se ejecutan igualmente y `minimum` nunca se creó. Además, Python ya tiene `min` y `max`. Versión corregida:

```python
# min_max_fixed.py
def min_max(*numbers):
    if not numbers:
        return None, None
    return min(numbers), max(numbers)


print(min_max(21, 34, 6, 78))
print(min_max())
low, high = min_max()
print(low, high)
```

```text
(6, 78)
(None, None)
None None
```

Ahora el caso vacío tiene salida definida (`(None, None)`), y es un early return: se valida primero y se calcula después. Qué hace el `*numbers` está en [\*args y \*\*kwargs](../../02-args-y-kwargs/01-args-y-kwargs/index.md).

!!! warning "UnboundLocalError: cannot access local variable"
    Pasa cuando usas una variable dentro de una función antes de que se le haya dado valor en ese camino. Revisa que todos los caminos (con `if`) la creen.

---

## Docstrings {: .topic-title }

Un **docstring** es un texto entre tres comillas dobles que va justo debajo del `def`. Documenta qué hace la función. Python lo guarda y lo muestra con `help()`:

```python
# docstring.py
def count_words(text):
    """Cuenta las palabras de un texto separadas por espacios."""
    return len(text.split())


print(count_words.__doc__)
help(count_words)
```

```text
Cuenta las palabras de un texto separadas por espacios.
Help on function count_words in module __main__:

count_words(text)
    Cuenta las palabras de un texto separadas por espacios.

```

Para una función simple basta una línea. Si necesita más, la primera línea es un resumen, una línea en blanco y el detalle debajo.

!!! tip "El comentario cuenta cómo; el docstring cuenta qué"
    Un `#` explica un paso concreto del código. El docstring explica para qué sirve la función y qué recibe y devuelve, para quien la use sin leer el cuerpo.

---

## Python en IA {: .topic-title }

Las funciones son la unidad de reutilización de cualquier código con modelos: una función que construye el prompt, otra que cuenta el tamaño, otra que envía la petición. Al aislar cada tarea:

- Pruebas la construcción del prompt **sin llamar al modelo** (el [pilar 06](../../../06-ecosistema/index.md) lo aplica con tests).
- Cambias de modelo tocando una sola función.
- Devuelves `None` o una tupla `(texto, error)` cuando algo falla, en vez de romper todo.

!!! tip "Devuelve datos, no imprimas dentro"
    Una función que construye un prompt debe **devolver** el texto, no hacer `print`. Así la puedes probar, reutilizar y encadenar con otras. El `print` va fuera, en quien llama.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `function build(a, b) { return ...; }` | `def build(a, b):` y `return ...` |
| `const build = (a, b) => ...` | `build = lambda a, b: ...` (limitado, ver [Lambdas](../../04-funciones-como-valores/01-lambdas-y-orden-superior/index.md)) |
| Sin `return`, devuelve `undefined` | Sin `return`, devuelve `None` |
| `return [a, b]` y `const [x, y] = f()` | `return a, b` y `x, y = f()` |
| Las declaraciones `function` suben (hoisting) | `def` se ejecuta en su línea; hay que definir antes de llamar |
| Comentarios JSDoc `/** ... */` | Docstring `"""..."""` |

!!! tip "Consejos"
    - **Una función, una tarea**, con un nombre que sea un verbo (`build_prompt`, `count_words`).
    - **Valida primero y devuelve pronto** (early return).
    - **No uses `;` al final del `return`:** es válido, pero no es estilo de Python.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Funcions i Modularitat (def) — «Definim i cridem una funció bàsica» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_500/#1-definim-i-cridem-una-funcio-basica> |
| Funcions i Modularitat (def) — «Retornem valors amb return» (y diferencia `print`/`return`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_500/#3-retornem-valors-amb-return> |
| Procediments (bloque antiguo) — «Funcions i procediments» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_020/#funcions-i-procediments> |
| Funcions (bloque antiguo) — retorno múltiple (`minim_maxim`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_021/#funcions> |
| **Documentación oficial** | |
| Tutorial — Definir funciones | <https://docs.python.org/3/tutorial/controlflow.html#defining-functions> |
| Tutorial — Cadenas de documentación | <https://docs.python.org/3/tutorial/controlflow.html#documentation-strings> |
| Referencia — Definiciones de funciones | <https://docs.python.org/3/reference/compound_stmts.html#function-definitions> |
| Referencia — La sentencia `return` | <https://docs.python.org/3/reference/simple_stmts.html#the-return-statement> |
| PEP 257 — Convenciones de docstrings | <https://peps.python.org/pep-0257/> |
