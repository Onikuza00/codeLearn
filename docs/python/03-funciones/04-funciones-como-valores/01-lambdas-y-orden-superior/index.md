# Lambdas y orden superior { .section-python .bloque-python }

> En Python las funciones son valores: se guardan en variables, se pasan como argumentos y se devuelven. Aquí ves la `lambda` para funciones de una línea, `key=`, `map` y `filter` frente a las comprensiones, y `functools.partial`.

---

## Una función es un valor {: .topic-title }

Ya viste que `def` crea un objeto función y le pega un nombre. Como cualquier otro valor, ese objeto se puede **pasar a otra función**. Una función que recibe o devuelve funciones se llama de **orden superior**.

**1. El script**

```python
# hof.py
def apply_all(texts, transform):
    return [transform(text) for text in texts]


print(apply_all(["  hola ", " adiós"], str.strip))
print(apply_all(["a", "b"], lambda text: text * 3))

def make_multiplier(factor):
    return lambda value: value * factor

triple = make_multiplier(3)
print(triple(5))
print(callable(triple), callable("x"))
```

**2. Cómo se ejecuta**

```bash
python hof.py
```

**3. Qué pasa por dentro.** `apply_all` recibe `transform` como cualquier parámetro, y la **llama** con paréntesis. Al pasar `str.strip` **sin paréntesis** se entrega la función misma; con paréntesis (`str.strip()`) se ejecutaría. `make_multiplier` devuelve una función nueva que recuerda `factor` (un closure, de [Scope y closures](../../01-funciones-basicas/03-scope-y-closures/index.md)).

**4. La salida**

```text
['hola', 'adiós']
['aaa', 'bbb']
15
True False
```

`callable(x)` dice si algo se puede llamar como función.

---

## lambda {: .topic-title }

Una **lambda** es una función pequeña, sin nombre, escrita en una sola expresión: `lambda parámetros: expresión`. El resultado de la expresión es lo que devuelve (no se escribe `return`).

```python
# lambda_basic.py
double = lambda value: value * 2
print(double(4), double.__name__)

def double_def(value):
    return value * 2

offers = [("QA", 30000), ("Data", 38000), ("Dev", 32000)]
print(sorted(offers, key=lambda offer: offer[1]))
print(max(offers, key=lambda offer: offer[1]))
print(sorted(offers, key=lambda offer: -offer[1])[0])
words = ["beta", "Alpha", "apple"]
print(sorted(words, key=lambda word: word.lower()))
print(sorted(words, key=str.lower))
```

```text
8 <lambda>
[('QA', 30000), ('Dev', 32000), ('Data', 38000)]
('Data', 38000)
('Data', 38000)
['Alpha', 'apple', 'beta']
['Alpha', 'apple', 'beta']
```

- `key=` (de `sorted`, `max`, `min`, `sort`) recibe una función que se aplica a cada elemento para decidir **por qué se compara**. Con `lambda offer: offer[1]` se ordena por el segundo campo, el salario.
- Cuando ya existe una función que sirve (`str.lower`), no hace falta la lambda.
- Una lambda solo admite **una expresión**: sin `if/else` de varias líneas, sin bucles, sin asignaciones.

!!! tip "Si le pones nombre, usa `def`"
    `double = lambda ...` funciona, pero se llama `<lambda>` en los errores y no se puede documentar. Una función con nombre se escribe con `def`. La lambda se queda para el caso «pequeña y de usar y tirar» en un `key=` o un argumento.

Para ordenar diccionarios por un campo hay una opción más legible que la lambda: `operator.itemgetter`.

```python
# itemgetter_demo.py
from operator import itemgetter

offers = [{"title": "QA", "salary": 30000}, {"title": "Dev", "salary": 32000}]
print(sorted(offers, key=itemgetter("salary"), reverse=True))
```

```text
[{'title': 'Dev', 'salary': 32000}, {'title': 'QA', 'salary': 30000}]
```

---

## map y filter frente a comprensiones {: .topic-title }

`map(función, colección)` aplica la función a cada elemento y `filter(función, colección)` se queda con los que devuelven un valor verdadero. Los dos devuelven un **iterador perezoso**, no una lista.

```python
# map_filter.py
salaries = [32000, 41000, 38000, 30000]

doubled = map(lambda salary: salary / 1000, salaries)
print(doubled)
print(list(doubled))
print(list(doubled))

high = filter(lambda salary: salary > 35000, salaries)
print(list(high))

print([salary / 1000 for salary in salaries])
print([salary for salary in salaries if salary > 35000])
print(list(map(str.upper, ["a", "b"])))
print(list(map(len, ["uno", "tres"])))
print(list(filter(None, [0, 1, "", "x", None])))
```

```text
<map object at 0x0000019E11510CA0>
[32.0, 41.0, 38.0, 30.0]
[]
[41000, 38000]
[32.0, 41.0, 38.0, 30.0]
[41000, 38000]
['A', 'B']
[3, 4]
[1, 'x']
```

(La dirección `0x...` cambia en cada ejecución.)

- Un `map` se gasta al recorrerlo: la segunda `list` sale vacía, igual que los generadores de [Comprensiones](../../../02-estructuras-de-datos/04-comprensiones/02-comprensiones-dict-set-generadores/index.md).
- Las dos líneas de comprensiones dan **lo mismo** que `map(lambda ...)` y `filter(lambda ...)`, y se leen mejor.
- `map(str.upper, ...)` o `map(len, ...)` con una función que ya existe es limpio y corto.
- `filter(None, lista)` quita los valores «falsos».

La regla práctica: **con una lambda, usa una comprensión; con una función ya hecha, `map`/`filter` van bien.**

---

## functools.partial {: .topic-title }

`partial` crea una función nueva **fijando algunos argumentos** de otra. Es una forma de «precargar» la configuración.

```python
# partial_demo.py
from functools import partial, reduce


def build_request(model, temperature, prompt):
    return f"{model} T={temperature}: {prompt}"


fast = partial(build_request, "modelo-demo", 0.0)
print(fast("Hola"))
creative = partial(build_request, "modelo-demo", temperature=1.2)
print(creative(prompt="Hola"))
print(fast.func.__name__, fast.args)

print(reduce(lambda total, number: total + number, [1, 2, 3, 4]))
print(reduce(lambda total, number: total + number, [1, 2, 3, 4], 100))
print(sum([1, 2, 3, 4]))
```

```text
modelo-demo T=0.0: Hola
modelo-demo T=1.2: Hola
build_request ('modelo-demo', 0.0)
10
110
10
```

- `fast` es `build_request` con el modelo y la temperatura ya puestos; solo falta el prompt.
- Se puede fijar por posición o por nombre.
- `reduce(función, colección, inicial)` va **acumulando**: coge los dos primeros elementos, aplica la función, usa el resultado con el tercero, y así. Aquí suma. Para sumar, `sum()` es mucho más claro; `reduce` solo merece la pena cuando no existe una función ya hecha, y se importa de `functools`.

Es el mismo efecto que un closure (`make_multiplier`), pero sin escribir la función interior a mano.

---

## El error del bucle {: .topic-title }

Una trampa clásica de los closures aparece al crear funciones en un bucle. Cada lambda recuerda la **variable** `number`, no su valor en aquel momento:

```python
# loop_error.py
functions = [lambda: number for number in range(3)]
print([f() for f in functions])

fixed = [lambda number=number: number for number in range(3)]
print([f() for f in fixed])
```

```text
[2, 2, 2]
[0, 1, 2]
```

Las tres lambdas se ejecutan **después** del bucle, cuando `number` ya vale `2`. La solución es fijar el valor en el momento de crearlas con un parámetro por defecto (`number=number`), o usar `partial`.

!!! warning "Closures y variables que cambian"
    Si una función creada en un bucle usa la variable del bucle, todas verán su último valor. Fija el valor con un default o con `partial`.

---

## Python en IA {: .topic-title }

Pasar funciones como valores es el patrón de los **callbacks** y las **estrategias**:

- **Elegir cómo transformar:** una función que prepara texto recibe la limpieza (`str.strip`, una función que elimina HTML...) como parámetro.
- **Ordenar resultados** de una búsqueda con `key=` por puntuación.
- **Configurar un cliente**: `partial(send, model="modelo-demo", temperature=0.2)` da un «enviar con esta configuración».
- **Herramientas (tool use)** de un agente: un diccionario `{"search": search_function, "calc": calc_function}` mapea nombres a funciones que el programa ejecuta según lo que pida el modelo.

!!! tip "Un diccionario de funciones en lugar de un `if` largo"
    `handlers = {"search": search, "calc": calc}` y `handlers[name](**args)` sustituyen una cadena de `elif`. Añadir una herramienta es añadir una línea.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `x => x * 2` (función flecha) | `lambda x: x * 2` |
| Las flechas pueden tener cuerpo con varias líneas | Una lambda es **una sola expresión** |
| `arr.sort((a, b) => a.salary - b.salary)` | `sorted(arr, key=lambda a: a["salary"])` |
| `arr.map(f)` devuelve un array | `map(f, arr)` devuelve un iterador |
| `arr.filter(f)` | `filter(f, arr)` o comprensión |
| `arr.reduce(f, init)` (muy usado) | `reduce(f, arr, init)` (poco usado; mejor `sum`, `max`, comprensión) |
| `f.bind(null, a)` | `partial(f, a)` |

!!! tip "Consejos"
    - **`key=` con una lambda o `itemgetter`** es el uso más común de la lambda.
    - **Comprensión antes que `map`/`filter` con lambda.**
    - **Sin paréntesis para pasar la función**, con paréntesis para ejecutarla.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye lambdas, `map`/`filter`, `partial` ni funciones como valores | — |
| **Documentación oficial** | |
| Tutorial — Expresiones lambda | <https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions> |
| Referencia — `lambda` | <https://docs.python.org/3/reference/expressions.html#lambda> |
| Glosario — «lambda» | <https://docs.python.org/3/glossary.html#term-lambda> |
| `map()` | <https://docs.python.org/3/library/functions.html#map> |
| `filter()` | <https://docs.python.org/3/library/functions.html#filter> |
| `sorted()` | <https://docs.python.org/3/library/functions.html#sorted> |
| `functools.partial` | <https://docs.python.org/3/library/functools.html#functools.partial> |
| `functools.reduce` | <https://docs.python.org/3/library/functools.html#functools.reduce> |
