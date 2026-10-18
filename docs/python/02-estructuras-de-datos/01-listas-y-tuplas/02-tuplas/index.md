# Tuplas { .section-python .bloque-python }

> Una tupla es como una lista que no se puede cambiar. Se usa para agrupar valores que van juntos, como los campos de un registro. Aquí ves cómo se crea, por qué es inmutable y la trampa de la tupla de un elemento.

---

## Una lista que no cambia {: .topic-title }

Una **tupla** (`tuple`) es una colección ordenada de valores, escrita entre paréntesis, que **no se puede modificar** una vez creada. Se lee igual que una lista: índices, slicing, `len`, `in`.

El flujo completo:

**1. El script**

```python
# basics.py
offer = ("Frontend Developer", "Tech Solutions", "Madrid", 32000)

print(offer)
print(offer[0], offer[-1])
print(offer[1:3])
print(len(offer), type(offer))
print("Madrid" in offer)
print(offer.index("Madrid"), offer.count("Madrid"))

try:
    offer[3] = 35000
except TypeError as error:
    print(error)

try:
    offer.append("remoto")
except AttributeError as error:
    print(error)
```

**2. Cómo se ejecuta**

```bash
python basics.py
```

**3. Qué pasa por dentro.** Python crea el objeto tupla y le pega el nombre `offer`. Leer funciona como en una lista. Pero escribir en una posición, o llamar a un método que modifica, falla: la tupla no tiene `append`, ni `remove`, ni `sort`. Solo le quedan dos métodos de consulta, `index` y `count`.

**4. La salida**

```text
('Frontend Developer', 'Tech Solutions', 'Madrid', 32000)
Frontend Developer 32000
('Tech Solutions', 'Madrid')
4 <class 'tuple'>
True
2 1
'tuple' object does not support item assignment
'tuple' object has no attribute 'append'
```

La tupla es **inmutable**, igual que un `str` o un `int` (lo viste en [Variables y tipos](../../../01-fundamentos/02-datos-basicos/01-variables-y-tipos/index.md)). Para «cambiarla» creas otra: `offer = offer[:3] + (35000,)`.

!!! warning "TypeError: 'tuple' object does not support item assignment"
    Es el error que verás si intentas `offer[3] = 35000`. Los apuntes de la escuela lo usan como ejemplo, pero con una variable `config_base` que nunca llegan a definir; aquí `offer` está creada arriba.

---

## La tupla de un elemento {: .topic-title }

Lo que construye una tupla es la **coma**, no los paréntesis. Los paréntesis solo agrupan. Por eso hay una trampa con un único elemento:

```python
# one_item.py
not_a_tuple = ("Madrid")
a_tuple = ("Madrid",)
no_parens = "Madrid",
empty = ()

print(type(not_a_tuple), type(a_tuple), type(no_parens), type(empty))
print(a_tuple, len(a_tuple), no_parens == a_tuple)
print(tuple([1, 2]), tuple("ab"), list((1, 2)))
```

```text
<class 'str'> <class 'tuple'> <class 'tuple'> <class 'tuple'>
('Madrid',) 1 True
(1, 2) ('a', 'b') [1, 2]
```

- `("Madrid")` es solo un texto entre paréntesis.
- `("Madrid",)` y `"Madrid",` son tuplas de un elemento. Sin la coma, no hay tupla.
- La tupla vacía es `()`.
- `tuple(...)` y `list(...)` convierten de una a otra.

!!! warning "Una coma de más crea una tupla sin querer"
    `price = 32000,` (con coma al final) guarda `(32000,)`, no un número. Si ves una tupla donde esperabas un valor, busca una coma sobrante.

---

## Tuplas como registros {: .topic-title }

El uso natural de una tupla es agrupar valores **de distinta naturaleza** que describen una sola cosa. Por ejemplo, una oferta: título, empresa, ciudad y salario. Cada posición tiene un significado fijo.

```python
# records.py
offer = ("Backend Developer", "Data Corp", "Barcelona", 41000)
title, company, city, salary = offer
print(f"{title} en {company} ({city}): {salary} euros")

coordinates = (40.4168, -3.7038)
latitude, longitude = coordinates
print(latitude, longitude)

result = divmod(125, 60)
print(result, type(result))
hours, minutes = result
print(hours, minutes)
```

```text
Backend Developer en Data Corp (Barcelona): 41000 euros
40.4168 -3.7038
(2, 5) <class 'tuple'>
2 5
```

- `title, company, city, salary = offer` **desempaqueta** la tupla en cuatro variables de una vez. Se explica a fondo en [Desempaquetado](../../05-desempaquetado/01-desempaquetado/index.md).
- `divmod(125, 60)` devuelve la división entera y el resto **a la vez**, en una tupla. Así devuelven varios valores muchas funciones de Python.

La regla de uso: **lista** para muchas cosas parecidas (muchos salarios), **tupla** para pocas cosas distintas con posición fija (una oferta). Cuando los campos necesitan nombre en lugar de posición, el siguiente paso es un diccionario: [Diccionarios](../../02-diccionarios/01-diccionarios/index.md).

---

## Inmutable no es «todo congelado» {: .topic-title }

La tupla es inmutable, pero lo que **contiene** puede no serlo. La tupla guarda referencias; si una referencia apunta a una lista, esa lista sigue siendo mutable:

```python
# shared_mutable.py
offer = ("Data Analyst", ["sql", "python"])
offer[1].append("pandas")
print(offer)

try:
    offer[1] = ["otra"]
except TypeError as error:
    print(error)
```

```text
('Data Analyst', ['sql', 'python', 'pandas'])
'tuple' object does not support item assignment
```

No puedes **cambiar qué hay en la posición 1** (sigue apuntando a la misma lista), pero sí puedes modificar esa lista por dentro.

Esto tiene una consecuencia práctica: una tupla solo puede ser **hashable** (usable como clave de diccionario o elemento de un set) si todo lo que contiene también lo es:

```python
# hashable.py
print(hash((1, 2)) == hash((1, 2)))
try:
    hash((1, [2]))
except TypeError as error:
    print(error)
```

```text
True
unhashable type: 'list'
```

Qué significa «hashable» lo ves en [Diccionarios](../../02-diccionarios/01-diccionarios/index.md#claves-hashables).

!!! warning "Los apuntes exageran con el rendimiento"
    Los apuntes dicen que las tuplas se gestionan «de manera mucho más rápida a la memoria». Es exagerado. Ocupan algo menos (en esta versión, 64 bytes frente a 88 para tres elementos, con `sys.getsizeof`) y se crean un poco más rápido, pero no es la razón para elegirlas. La razón es **comunicar** que el dato no va a cambiar.

---

## Comparar y combinar {: .topic-title }

Las tuplas se comparan elemento a elemento, de izquierda a derecha, como se ordenan las palabras:

```python
# compare.py
print((1, 2) < (1, 3), (2, 0) > (1, 99), (1, 2) == (1, 2))
offers = [("QA", 30000), ("Data", 38000), ("Dev", 32000)]
print(sorted(offers))
print((1, 2) + (3,), (0,) * 3)
```

```text
True True True
[('Data', 38000), ('Dev', 32000), ('QA', 30000)]
(1, 2, 3) (0, 0, 0)
```

`sorted` sobre una lista de tuplas ordena por el primer elemento y, si empatan, por el segundo. `+` y `*` crean tuplas nuevas.

---

## Python en IA {: .topic-title }

Las tuplas aparecen sin avisar en el código de IA:

- **Formas de datos:** la dimensión de un array (por ejemplo, `(1000, 768)`) es una tupla.
- **Pares fijos:** `(rol, contenido)` o `(documento, puntuación)` como resultados de una búsqueda.
- **Varios valores devueltos** por una función: el uso de tuplas más habitual.
- **Claves compuestas:** como son hashables, `("Madrid", "React")` puede ser la clave de un diccionario.

!!! tip "Un mensaje como tupla, un mensaje como diccionario"
    `("user", "Hola")` funciona dentro de tu código. Pero las APIs de modelos esperan diccionarios con nombres de campo (`{"role": "user", "content": "Hola"}`), porque viajan como JSON. Lo verás en [Diccionarios anidados y JSON](../../02-diccionarios/02-diccionarios-anidados-y-json/index.md).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| No existe la tupla; se usa un array | `tuple` con `( )` |
| `Object.freeze([1, 2])` (congela, a medias) | Inmutable de serie |
| `const [a, b] = lista` | `a, b = tupla` |
| `return [a, b]` | `return a, b` (devuelve una tupla) |
| Un array de un elemento: `["a"]` | Un elemento: `("a",)` con coma |
| `[1, 2] === [1, 2]` es `false` (referencias) | `(1, 2) == (1, 2)` es `True` (valores) |

!!! tip "Consejos"
    - **Lista si va a crecer o cambiar, tupla si es un registro fijo.**
    - **Con un solo elemento, no olvides la coma:** `("a",)`.
    - **Para registros con muchos campos**, un diccionario se lee mejor que recordar posiciones.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Llistes i Tuples — «Les tuples (immutables)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_101/#2-les-tuples-immutables-no-es-poden-canviar> |
| Llistes i Tuples — «Resum de diferències ràpid» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_101/#3-resum-de-diferencies-rapid> |
| **Documentación oficial** | |
| Tutorial — Tuplas y secuencias | <https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences> |
| Biblioteca — Tuplas | <https://docs.python.org/3/library/stdtypes.html#tuples> |
| Biblioteca — Tipos de secuencia inmutables | <https://docs.python.org/3/library/stdtypes.html#immutable-sequence-types> |
| Glosario — «hashable» | <https://docs.python.org/3/glossary.html#term-hashable> |
| `divmod()` | <https://docs.python.org/3/library/functions.html#divmod> |
