# Sets { .section-python .bloque-python }

> Un set es una colección sin orden y sin repetidos. Sirve para quitar duplicados, para saber si algo está dentro a toda velocidad y para comparar grupos con operaciones de conjuntos.

---

## Qué es un set {: .topic-title }

Un **set** (conjunto) es una colección de valores **únicos** y **sin orden**. Si metes un valor repetido, solo queda uno. Se escribe con llaves, pero sin pares `clave: valor`.

El flujo completo:

**1. El script**

```python
# create.py
tags = {"python", "sql", "python", "pandas", "sql"}
print(sorted(tags), len(tags))
print(type({}), type(set()), type({1, 2}))
print(set("hello") == {"h", "e", "l", "o"})
print(set([3, 1, 3, 2]) == {1, 2, 3})
print(set())
```

**2. Cómo se ejecuta**

```bash
python create.py
```

**3. Qué pasa por dentro.** Al crear el set, Python descarta los repetidos. `set(...)` convierte en set cualquier cosa que se pueda recorrer (una lista, un texto). Como no hay orden, no hay índices; para enseñarlo ordenado se usa `sorted(...)`, que devuelve una lista.

**4. La salida**

```text
['pandas', 'python', 'sql'] 3
<class 'dict'> <class 'set'> <class 'set'>
True
True
set()
```

!!! warning "`{}` vacío es un diccionario, no un set"
    La salida lo enseña: `type({})` es `dict`. Para un set vacío, usa **`set()`**. Es una rareza histórica: las llaves vacías se reservaron para los diccionarios. `{1, 2}` con elementos sí es un set.

!!! warning "No esperes un orden concreto"
    Si imprimes un set, el orden en que salen los elementos no es fiable. Si necesitas orden, ordénalo con `sorted(mi_set)`.

---

## Quitar duplicados {: .topic-title }

El uso más común: tienes una lista con repetidos y quieres los valores distintos.

```python
# dedupe.py
cities = ["Madrid", "Barcelona", "Madrid", "Girona", "Barcelona"]
unique = set(cities)
print(len(cities), len(unique))
print(sorted(unique))
print(list(dict.fromkeys(cities)))

tags = {"python"}
tags.add("sql")
tags.add("python")
print(sorted(tags))
tags.discard("css")
tags.remove("sql")
print(tags)
try:
    tags.remove("css")
except KeyError as error:
    print(f"KeyError: {error}")
print(tags.pop(), tags)
```

```text
5 3
['Barcelona', 'Girona', 'Madrid']
['Madrid', 'Barcelona', 'Girona']
['python', 'sql']
{'python'}
KeyError: 'css'
python set()
```

- `set(cities)` deja 3 valores. Pero **pierde el orden original**.
- Si necesitas quitar repetidos **conservando el orden**, usa `list(dict.fromkeys(cities))`: las claves de un diccionario son únicas y recuerdan el orden de inserción ([Diccionarios](../../02-diccionarios/01-diccionarios/index.md#orden-de-insercion)).
- `add(x)` añade (si ya está, no pasa nada).
- `discard(x)` quita sin quejarse si no está; `remove(x)` lanza `KeyError` si no está.
- `pop()` quita y devuelve un elemento cualquiera.

!!! warning "Un set no guarda cualquier cosa"
    Sus elementos tienen que ser **hashables**, igual que las claves de un diccionario. Una lista dentro de un set no vale:

    ```python
    # limits.py
    try:
        {[1, 2], 3}
    except TypeError as error:
        print(error)
    ```

    ```text
    unhashable type: 'list'
    ```

---

## Operaciones de conjuntos {: .topic-title }

Lo potente de los sets es que se pueden combinar como los círculos de un diagrama de Venn. Dos personas y las tecnologías que dominan:

```python
# operations.py
ana = {"python", "sql", "react"}
luis = {"python", "css", "react", "git"}

print(sorted(ana | luis))
print(sorted(ana & luis))
print(sorted(ana - luis))
print(sorted(luis - ana))
print(sorted(ana ^ luis))
print(ana.union(luis) == ana | luis)
print(ana.intersection(["python", "go"]))
print({"python"} <= ana, ana >= {"python"}, ana.isdisjoint({"go"}))
print({1, 2} == {2, 1})

required = {"python", "sql"}
offer_tags = {"python", "sql", "pandas"}
print(required <= offer_tags)
print(sorted(required - offer_tags), sorted(offer_tags - required))
```

```text
['css', 'git', 'python', 'react', 'sql']
['python', 'react']
['sql']
['css', 'git']
['css', 'git', 'sql']
True
{'python'}
True True True
True
True
[] ['pandas']
```

| Operador | Método | Resultado |
|---|---|---|
| <code>a &#124; b</code> | `a.union(b)` | Todo lo que está en `a` **o** en `b` |
| `a & b` | `a.intersection(b)` | Lo que está en **los dos** |
| `a - b` | `a.difference(b)` | Lo que está en `a` y **no** en `b` |
| `a ^ b` | `a.symmetric_difference(b)` | Lo que está en uno **solo** de los dos |
| `a <= b` | `a.issubset(b)` | Todo `a` está dentro de `b` |
| `a >= b` | `a.issuperset(b)` | Todo `b` está dentro de `a` |
| — | `a.isdisjoint(b)` | No tienen nada en común |

Los operadores exigen sets a los dos lados. Los métodos aceptan cualquier colección recorrible (por eso `ana.intersection(["python", "go"])` funciona con una lista).

La última parte del ejemplo es un caso real: ¿una oferta pide **solo cosas** que tengo? `required <= offer_tags` pregunta si todos los requisitos están cubiertos, y `required - offer_tags` te dice cuáles faltan.

---

## Pertenencia rápida {: .topic-title }

`x in coleccion` funciona con listas y con sets, pero no cuesta lo mismo. En una lista, Python mira los elementos **uno por uno** hasta encontrar el valor. En un set, calcula la huella (*hash*) del valor y va **directo** al sitio: tarda lo mismo con 10 elementos que con 10 millones. Se dice que es de coste constante (O(1)) frente al coste lineal (O(n)) de la lista.

Se puede medir:

```python
# membership.py
import time

big_list = list(range(2_000_000))
big_set = set(big_list)
target = 1_999_999

start = time.perf_counter()
for _ in range(50):
    target in big_list
list_time = time.perf_counter() - start

start = time.perf_counter()
for _ in range(50):
    target in big_set
set_time = time.perf_counter() - start

print(f"lista: {list_time:.4f} s")
print(f"set:   {set_time:.6f} s")
print(list_time > set_time * 100)
```

```text
lista: 0.8100 s
set:   0.000007 s
True
```

Los tiempos cambian en cada equipo, pero la diferencia es de órdenes de magnitud: 50 búsquedas del último elemento tardan casi un segundo en la lista y microsegundos en el set. (Un guion bajo en `2_000_000` es solo un separador de miles para que se lea mejor.)

!!! tip "Con pocos datos, da igual"
    Para 10 o 100 elementos no notarás nada. El set merece la pena cuando preguntas muchas veces si algo está dentro de una colección grande. Si además solo necesitas «¿está?» y no el orden ni los repetidos, es la estructura adecuada.

---

## frozenset {: .topic-title }

Un **frozenset** es un set inmutable. No se le puede añadir ni quitar nada, y por eso es hashable: puede ser elemento de otro set o clave de diccionario.

```python
# frozen.py
frozen = frozenset({"python", "sql"})
print(frozen, type(frozen))
try:
    frozen.add("x")
except AttributeError as error:
    print(error)
by_skill = {frozenset({"python", "sql"}): "analista"}
print(by_skill[frozenset({"sql", "python"})])
print(frozen | {"css"})
```

```text
frozenset({'python', 'sql'}) <class 'frozenset'>
'frozenset' object has no attribute 'add'
analista
frozenset({'css', 'python', 'sql'})
```

Al imprimir, el orden de los elementos puede cambiar de una ejecución a otra. Como el orden no importa, `frozenset({"sql", "python"})` encuentra la clave creada con `{"python", "sql"}`. Es el equivalente en sets de lo que la tupla es para las listas ([Tuplas](../../01-listas-y-tuplas/02-tuplas/index.md)).

!!! warning "TypeError: 'set' object is not subscriptable"
    Un set no tiene posiciones, así que `mi_set[0]` falla. Si necesitas «el primero», lo que quieres es una lista: `sorted(mi_set)[0]`.

!!! warning "`1`, `1.0` y `True` son el mismo elemento"
    `{1, 1.0, True}` da `{1}`: para Python valen lo mismo. Es la misma regla que en las claves de un diccionario.

---

## Python en IA {: .topic-title }

Los sets aparecen en tareas de limpieza y de comparación de textos:

- **Deduplicar documentos** o frases antes de pasarlos a un modelo, para no gastar tokens en repetidos.
- **Vocabulario:** el conjunto de palabras distintas de un texto es `set(texto.split())`.
- **Comparar textos** por solapamiento de palabras (intersección entre unión). Es una medida de similitud muy básica.
- **Filtros de pertenencia:** una lista de palabras prohibidas o de identificadores ya procesados en un set se consulta en tiempo constante.

!!! tip "Quitar repetidos de documentos antes de enviar"
    Si recuperas fragmentos de varias búsquedas, es habitual que se repitan. Deduplicar con un set (o con `dict.fromkeys` para conservar el orden) ahorra tokens y evita que el modelo vea lo mismo dos veces.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `new Set([1, 2, 2])` | `{1, 2, 2}` o `set([1, 2, 2])` |
| `new Set()` | `set()` (no `{}`) |
| `s.add(x)` | `s.add(x)` |
| `s.has(x)` | `x in s` |
| `s.delete(x)` | `s.discard(x)` o `s.remove(x)` |
| `[...new Set(lista)]` | `list(set(lista))` |
| Métodos de conjuntos solo en versiones recientes del lenguaje | <code>&#124;</code>, `&`, `-`, `^` y los métodos |
| Mantiene el orden de inserción | No garantiza ningún orden |

!!! tip "Consejos"
    - **Para preguntas «¿está?»** sobre colecciones grandes, set antes que lista.
    - **Conserva el orden con `dict.fromkeys`**, si hace falta.
    - **Un set vacío es `set()`**, siempre.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye sets | — |
| **Documentación oficial** | |
| Tutorial — Sets | <https://docs.python.org/3/tutorial/datastructures.html#sets> |
| Biblioteca — Tipos `set` y `frozenset` | <https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset> |
| Biblioteca — `set` (clase) | <https://docs.python.org/3/library/stdtypes.html#set> |
| Glosario — «hashable» | <https://docs.python.org/3/glossary.html#term-hashable> |
| Complejidad temporal de las operaciones (wiki de Python) | <https://wiki.python.org/moin/TimeComplexity> |
