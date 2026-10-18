# Comprensiones de dict y set, y generadores { .section-python .bloque-python }

> La misma idea de la comprensión de lista, aplicada a diccionarios y sets. Y su versión «perezosa»: la expresión generadora, que produce los valores de uno en uno sin construir la lista.

---

## Comprensión de diccionario {: .topic-title }

Cambia los corchetes por llaves y pon `clave: valor` delante del `for`: sale un **diccionario**. Para estos ejemplos, `from data import offers` trae la lista de ofertas definida en [Comprensiones de lista](../01-comprensiones-de-lista/index.md#el-bucle-que-construye-una-lista).

**1. El script**

```python
# dict_comp.py
from data import offers

salary_by_title = {offer["title"]: offer["salary"] for offer in offers}
print(salary_by_title)

well_paid = {t: s for t, s in salary_by_title.items() if s >= 35000}
print(well_paid)

in_thousands = {t: s / 1000 for t, s in salary_by_title.items()}
print(in_thousands)

by_city = {offer["city"]: offer["title"] for offer in offers}
print(by_city)

print({word: len(word) for word in ["python", "sql", "css"]})
inverted = {value: key for key, value in {"a": 1, "b": 2}.items()}
print(inverted)
print({n: n * n for n in range(4)})
```

**2. Cómo se ejecuta**

```bash
python dict_comp.py
```

**3. Qué pasa por dentro.** Python recorre `offers` y, por cada oferta, evalúa la clave (`offer["title"]`) y el valor (`offer["salary"]`) y los guarda en el diccionario nuevo. Con `.items()` recorres un diccionario existente y desempaquetas cada par (`t, s`) para filtrarlo o transformarlo.

**4. La salida**

```text
{'Frontend Developer': 32000, 'Backend Developer': 41000, 'Data Analyst': 38000, 'QA Engineer': 30000}
{'Backend Developer': 41000, 'Data Analyst': 38000}
{'Frontend Developer': 32.0, 'Backend Developer': 41.0, 'Data Analyst': 38.0, 'QA Engineer': 30.0}
{'Madrid': 'Data Analyst', 'Barcelona': 'Backend Developer', 'Girona': 'QA Engineer'}
{'python': 6, 'sql': 3, 'css': 3}
{1: 'a', 2: 'b'}
{0: 0, 1: 1, 2: 4, 3: 9}
```

Patrones útiles:

- **Indexar una lista por un campo:** `{offer["title"]: offer for offer in offers}` convierte una lista de diccionarios en un diccionario de consulta rápida.
- **Filtrar un diccionario:** `{k: v for k, v in d.items() if ...}`.
- **Invertir** claves y valores: `{v: k for k, v in d.items()}`.

!!! warning "Claves repetidas: gana la última"
    `by_city` tiene una entrada por ciudad, pero hay **dos** ofertas en Madrid. El diccionario conserva solo la última (`'Data Analyst'`). Una comprensión de diccionario no agrupa: sobrescribe. Para agrupar usa `setdefault` ([Diccionarios](../../02-diccionarios/01-diccionarios/index.md#setdefault)).

!!! warning "Al invertir, los valores deben ser hashables y únicos"
    Si dos claves tienen el mismo valor, al invertir se pierde una. Y si un valor es una lista, no puede ser clave.

---

## Comprensión de set {: .topic-title }

Con llaves y **sin** `clave: valor`, sale un **set**: valores únicos y sin orden ([Sets](../../03-sets/01-sets/index.md)).

```python
# set_comp.py
from data import offers

cities = {offer["city"] for offer in offers}
print(sorted(cities))

all_tags = {tag for offer in offers for tag in offer["tags"]}
print(sorted(all_tags))

print(sorted({len(offer["title"]) for offer in offers}))
print(type({}), type({x for x in []}))
```

```text
['Barcelona', 'Girona', 'Madrid']
['css', 'pandas', 'python', 'react', 'sql', 'testing']
[11, 12, 17, 18]
<class 'dict'> <class 'set'>
```

- `{offer["city"] for offer in offers}` da las ciudades distintas, sin repetir Madrid.
- `{tag for offer in offers for tag in offer["tags"]}` junta **todos los tags de todas las ofertas, sin repetidos**: aplanar y deduplicar en una línea.

!!! tip "Cómo distinguir las tres de un vistazo"
    - `[x for ...]` → lista
    - `{x for ...}` → set
    - `{k: v for ...}` → diccionario

    Ojo: unas llaves vacías `{}` son un diccionario, no un set. En cambio `{x for x in []}` sí es un set, aunque salga vacío.

---

## Expresiones generadoras {: .topic-title }

Si cambias los corchetes por **paréntesis**, no obtienes una tupla: obtienes una **expresión generadora**. No construye la colección entera; produce los valores **uno a uno, cuando se los pides**.

```python
# generator.py
from data import offers

total = sum(offer["salary"] for offer in offers)
print(total)
print(max(offer["salary"] for offer in offers))
print(any(offer["city"] == "Girona" for offer in offers))
print(all(offer["salary"] > 31000 for offer in offers))
print(", ".join(offer["title"] for offer in offers))

squares = (n * n for n in range(5))
print(squares)
print(next(squares), next(squares))
print(list(squares))
print(list(squares))
print(sum([n for n in range(5)]), sum(n for n in range(5)))
first = next((o["title"] for o in offers if o["salary"] > 40000), "ninguna")
none = next((o["title"] for o in offers if o["salary"] > 99000), "ninguna")
print(first, none)
```

```text
141000
41000
True
False
Frontend Developer, Backend Developer, Data Analyst, QA Engineer
<generator object <genexpr> at 0x000001C0612EA740>
0 1
[4, 9, 16]
[]
10 10
Backend Developer ninguna
```

(La dirección de memoria `0x...` de la línea del generador cambia en cada ejecución.)

Qué enseña:

- **`sum(x for ...)`**: cuando la expresión generadora es el **único argumento** de una función, no hacen falta paréntesis extra. Es lo habitual con `sum`, `max`, `min`, `any`, `all` y `"".join`.
- `any(...)` dice si **alguno** cumple y `all(...)` si **todos**. Se detienen en cuanto lo saben.
- Un generador es un objeto aparte (`<generator object ...>`); para ver los valores hay que pedirlos con `next()` o recorrerlo con un `for` o `list()`.
- Un generador **se gasta**: después de pedir `0` y `1`, `list(squares)` entrega lo que queda (`4, 9, 16`) y una segunda `list` sale vacía. Igual que `enumerate` y `zip`.
- `next(generador, valor_por_defecto)` entrega el primero que cumpla, o el valor por defecto si no hay ninguno (`'ninguna'`). Es una forma de decir «el primero que...», sin construir la lista de todos.

La ventaja es la memoria. Un generador no guarda los elementos:

```python
# memory.py
import sys
as_list = [n for n in range(1_000_000)]
as_generator = (n for n in range(1_000_000))
print(sys.getsizeof(as_list) > 1_000_000, sys.getsizeof(as_generator) < 300)
print(sum(as_generator))
```

```text
True True
499999500000
```

La lista de un millón de elementos ocupa más de un megabyte; el generador, unos pocos cientos de bytes, sin importar cuánto vaya a producir.

!!! warning "Un generador solo se recorre una vez"
    Si lo guardas en una variable y lo recorres dos veces, la segunda sale vacía. Si necesitas reutilizar los datos, usa una lista.

!!! tip "Lista si reutilizas, generador si solo pasas una vez"
    Para `sum`, `max`, `any`... sobre muchos datos, el generador es más ligero. Para algo que vas a mirar o recorrer varias veces, una lista.

---

## Python en IA {: .topic-title }

Las expresiones generadoras brillan cuando los datos son grandes:

- **Leer documentos grandes** de uno en uno en lugar de cargarlos todos en memoria.
- **Contar sin construir:** `sum(len(doc.split()) for doc in documents)` cuenta palabras de toda una colección.
- **Buscar el primero** que cumpla una condición (`next(...)`) sin recorrerlo todo.

Y las comprensiones de diccionario y set limpian metadatos: indexar documentos por identificador, o sacar el conjunto de fuentes distintas.

!!! tip "Indexa por id para buscar rápido"
    `{doc["id"]: doc for doc in docs}` convierte la lista de documentos en un diccionario: buscar uno por id pasa de recorrer la lista a un acceso directo.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `Object.fromEntries(arr.map(x => [k, v]))` | `{k: v for x in arr}` |
| `new Set(arr.map(f))` | `{f(x) for x in arr}` |
| `arr.reduce((a, b) => a + b, 0)` | `sum(x for x in arr)` |
| `arr.some(f)` / `arr.every(f)` | `any(f(x) for x in arr)` / `all(...)` |
| `arr.find(f)` | `next((x for x in arr if f(x)), None)` |
| Generadores con `function*` | Expresión generadora `(x for ...)` |

!!! tip "Consejos"
    - **`{}` vacío siempre es un diccionario.**
    - **Un solo argumento, sin paréntesis extra:** `sum(x for x in datos)`.
    - **`next(gen, None)`** como «dame el primero o `None`».

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye comprensiones ni generadores | — |
| **Documentación oficial** | |
| Tutorial — Diccionarios (comprensiones de dict) | <https://docs.python.org/3/tutorial/datastructures.html#dictionaries> |
| Tutorial — Sets (comprensiones de set) | <https://docs.python.org/3/tutorial/datastructures.html#sets> |
| Referencia — Expresiones generadoras | <https://docs.python.org/3/reference/expressions.html#generator-expressions> |
| Referencia — Expresiones *display* de diccionario | <https://docs.python.org/3/reference/expressions.html#dictionary-displays> |
| Referencia — Expresiones *display* de set | <https://docs.python.org/3/reference/expressions.html#set-displays> |
| Glosario — «generator expression» | <https://docs.python.org/3/glossary.html#term-generator-expression> |
| `sum()` | <https://docs.python.org/3/library/functions.html#sum> |
| `any()` | <https://docs.python.org/3/library/functions.html#any> |
| `all()` | <https://docs.python.org/3/library/functions.html#all> |
