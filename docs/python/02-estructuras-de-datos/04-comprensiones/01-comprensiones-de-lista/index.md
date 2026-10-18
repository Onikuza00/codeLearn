# Comprensiones de lista { .section-python .bloque-python }

> Una comprensión crea una lista nueva a partir de otra colección en una sola línea: transformar, filtrar o las dos cosas. Aquí ves cómo se lee, cuándo ganan al bucle y cuándo conviene dejarlas.

---

## El bucle que construye una lista {: .topic-title }

Mucho código repite el mismo patrón: crear una lista vacía, recorrer algo y hacer `append`. Para no escribirlo cada vez, Python tiene la **comprensión de lista** (*list comprehension*).

Los datos son las ofertas del pilar, en un archivo aparte para no repetirlos:

```python
# data.py
offers = [
    {"title": "Frontend Developer", "company": "Tech Solutions", "city": "Madrid", "salary": 32000, "tags": ["react", "css"]},
    {"title": "Backend Developer", "company": "Data Corp", "city": "Barcelona", "salary": 41000, "tags": ["python", "sql"]},
    {"title": "Data Analyst", "company": "Data Corp", "city": "Madrid", "salary": 38000, "tags": ["python", "sql", "pandas"]},
    {"title": "QA Engineer", "company": "Test Lab", "city": "Girona", "salary": 30000, "tags": ["testing"]},
]
```

En los ejemplos siguientes, `from data import offers` trae esa lista desde `data.py` (cómo funcionan los módulos se ve en el pilar del ecosistema; aquí basta saber que `offers` es esa lista).

**1. El script**

```python
# basic.py
from data import offers

titles_loop = []
for offer in offers:
    titles_loop.append(offer["title"])
print(titles_loop)

titles = [offer["title"] for offer in offers]
print(titles == titles_loop)

salaries_k = [offer["salary"] / 1000 for offer in offers]
print(salaries_k)

lengths = [len(title) for title in titles]
print(lengths)
print([x * x for x in range(5)])
print([letter.upper() for letter in "ia"])
```

**2. Cómo se ejecuta**

```bash
python basic.py
```

**3. Qué pasa por dentro.** Una comprensión se lee así: `[offer["title"] for offer in offers]` es «para cada `offer` en `offers`, toma `offer["title"]`». Tiene tres partes:

| Parte | Ejemplo | Qué es |
|---|---|---|
| Expresión | `offer["title"]` | Qué valor va a la lista nueva |
| `for` | `for offer in offers` | De dónde salen los elementos |
| Condición (opcional) | `if offer["salary"] > 35000` | Qué elementos pasan |

Es lo mismo que el bucle de arriba, comprimido: crea la lista vacía, recorre, añade. El resultado es una lista **nueva**; la original no se toca.

**4. La salida**

```text
['Frontend Developer', 'Backend Developer', 'Data Analyst', 'QA Engineer']
True
[32.0, 41.0, 38.0, 30.0]
[18, 17, 12, 11]
[0, 1, 4, 9, 16]
['I', 'A']
```

!!! tip "Cómo leerla en voz alta"
    «Una lista con el título de cada oferta, para cada oferta en ofertas.» Si te cuesta, escríbela primero como bucle y luego pásala a comprensión.

---

## Filtrar con if {: .topic-title }

Una condición al final deja pasar solo los elementos que la cumplen. Un `if ... else` **antes** del `for` no filtra: elige entre dos valores.

```python
# condition.py
from data import offers

madrid = [offer["title"] for offer in offers if offer["city"] == "Madrid"]
print(madrid)

well_paid = [offer["title"] for offer in offers if offer["salary"] >= 35000]
print(well_paid)

labels = ["alto" if offer["salary"] >= 35000 else "bajo" for offer in offers]
print(labels)

python_jobs = [o["title"] for o in offers if "python" in o["tags"] and o["salary"] > 40000]
print(python_jobs)
print([x for x in range(10) if x % 2 == 0])
print([x for x in [3, 0, 4, None, 5] if x])
```

```text
['Frontend Developer', 'Data Analyst']
['Backend Developer', 'Data Analyst']
['bajo', 'alto', 'alto', 'bajo']
['Backend Developer']
[0, 2, 4, 6, 8]
[3, 4, 5]
```

- **`if` al final** = filtro. La lista resultante puede ser más corta.
- **`valor_a if condición else valor_b` al principio** = elección. La lista resultante tiene **tantos elementos como la original**. Es el condicional de una línea de [if / elif / else](../../../01-fundamentos/03-decisiones/01-if-elif-else/index.md#el-condicional-en-una-linea).
- `if x` filtra valores «falsos» (`0`, `None`, vacío), como vimos en [Verdadero y falso](../../../01-fundamentos/03-decisiones/01-if-elif-else/index.md#verdadero-y-falso).
- Se pueden usar `and`, `or` y `in` en la condición como en cualquier `if`.

!!! warning "SyntaxError al poner el else en el sitio equivocado"
    `[x for x in lista if x > 0 else 0]` es un error de sintaxis. Si hay `else`, la expresión condicional va delante del `for`: `[x if x > 0 else 0 for x in lista]`.

---

## Bucles anidados {: .topic-title }

Una comprensión admite varios `for`. Se escriben en el **mismo orden** que los bucles anidados normales: el de fuera primero.

```python
# nested.py
from data import offers

all_tags = [tag for offer in offers for tag in offer["tags"]]
print(all_tags)

matrix = [[1, 2], [3, 4], [5]]
flat = [number for row in matrix for number in row]
print(flat)

pairs = [(a, b) for a in "ab" for b in (1, 2)]
print(pairs)

table = [[row * col for col in range(1, 4)] for row in range(1, 4)]
print(table)
```

```text
['react', 'css', 'python', 'sql', 'python', 'sql', 'pandas', 'testing']
[1, 2, 3, 4, 5]
[('a', 1), ('a', 2), ('b', 1), ('b', 2)]
[[1, 2, 3], [2, 4, 6], [3, 6, 9]]
```

- `[tag for offer in offers for tag in offer["tags"]]` equivale a:

  ```python
  all_tags = []
  for offer in offers:
      for tag in offer["tags"]:
          all_tags.append(tag)
  ```

  Aplana (*flatten*) las listas de tags en una sola lista. Los repetidos siguen ahí (`python` dos veces); para quitarlos, un [set](../../03-sets/01-sets/index.md).
- La tabla de multiplicar es una comprensión **dentro de otra**: la de dentro genera una fila, la de fuera junta las filas. Una lista de listas.

!!! warning "Dos `for` ya es el límite"
    Con tres o más niveles, o con condiciones en cada uno, la línea se vuelve ilegible. Pasa a bucles normales.

---

## Cuándo NO usarlas {: .topic-title }

Una comprensión sirve para **crear una lista**. Si no la necesitas o la lógica es complicada, usa un bucle.

**Cuando la línea es demasiado densa:**

```python
# when_not.py
from data import offers

# demasiado denso
dense = [(o["title"], o["salary"] * 1.21) for o in offers if o["city"] in ("Madrid", "Girona") and o["salary"] > 29000 and "python" not in o["tags"]]
print(dense)

# mismo resultado en un bucle legible
result = []
for offer in offers:
    in_city = offer["city"] in ("Madrid", "Girona")
    well_paid = offer["salary"] > 29000
    no_python = "python" not in offer["tags"]
    if in_city and well_paid and no_python:
        result.append((offer["title"], offer["salary"] * 1.21))
print(result == dense)
```

```text
[('Frontend Developer', 38720.0), ('QA Engineer', 36300.0)]
True
```

El segundo da exactamente lo mismo y se lee de arriba abajo, con nombres que explican cada condición.

**Cuando solo quieres efectos** (imprimir, guardar):

```python
# scope.py
numbers = [1, 2, 3]
squares = [number * number for number in numbers]
try:
    print(number)
except NameError as error:
    print(error)

result = [print(n) for n in range(2)]
print(result)
```

```text
name 'number' is not defined
0
1
[None, None]
```

- La variable de una comprensión (`number`) **no escapa**: existe solo dentro de ella. En un `for` normal sí sobrevivía ([for y range](../../../01-fundamentos/04-bucles/01-for-y-range/index.md#acumular-y-la-variable-que-sobrevive)).
- `[print(n) for n in ...]` funciona pero construye una lista inútil de `None`. Para recorrer y hacer algo, un `for`.

!!! tip "La regla de decisión"
    ¿Quiero una **lista nueva** y se lee en una línea? Comprensión. ¿Quiero **hacer** algo con cada elemento, o hay lógica con varios pasos? Bucle.

Y una comprensión es la forma limpia de «quitar elementos» de una lista sin los problemas de [modificarla mientras la recorres](../../01-listas-y-tuplas/01-listas/index.md#copiar-o-repartir-etiquetas):

```python
# copy_filter.py
numbers = [2, 4, 6, 1]
numbers = [n for n in numbers if n % 2 != 0]
print(numbers)
```

```text
[1]
```

---

## Python en IA {: .topic-title }

Casi todo el preparado de datos para un modelo cabe en comprensiones de una línea:

- **Limpiar textos:** `[line.strip() for line in lines if line.strip()]` quita espacios y descarta líneas vacías.
- **Filtrar resultados** por puntuación mínima.
- **Extraer un campo** de una lista de diccionarios: `[doc["text"] for doc in docs]`.
- **Aplanar** listas de fragmentos recuperados desde varias búsquedas.

!!! tip "Una comprensión por paso"
    En lugar de una línea que filtra, transforma y aplana, encadena varias comprensiones con nombres intermedios (`clean = [...]`, `useful = [...]`). Cada paso se puede imprimir y depurar.

!!! warning "Listas grandes en memoria"
    Una comprensión crea la lista entera. Con millones de elementos puede gastar mucha memoria. Para esos casos existen las **expresiones generadoras**, el siguiente capítulo: [Comprensiones de dict y set, y generadores](../02-comprensiones-dict-set-generadores/index.md).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `offers.map(o => o.title)` | `[o["title"] for o in offers]` |
| `offers.filter(o => o.salary > 35000)` | `[o for o in offers if o["salary"] > 35000]` |
| `offers.filter(...).map(...)` | `[expr for o in offers if cond]` |
| `lists.flat()` | `[x for row in lists for x in row]` |
| `a ? b : c` dentro del `map` | `b if a else c` delante del `for` |
| Encadenar métodos | Una sola expresión |

!!! tip "Consejos"
    - **Primero el bucle, luego la comprensión**, cuando la lógica no sea evidente.
    - **Nombres claros en la variable** (`offer`, no `o`) en cuanto haya condiciones.
    - **No uses una comprensión para efectos** (`print`, `append` a otra lista).

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye comprensiones | — |
| **Documentación oficial** | |
| Tutorial — Comprensiones de lista | <https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions> |
| Tutorial — Comprensiones de lista anidadas | <https://docs.python.org/3/tutorial/datastructures.html#nested-list-comprehensions> |
| Referencia — Expresiones *display* de lista | <https://docs.python.org/3/reference/expressions.html#list-displays> |
| Glosario — «list comprehension» | <https://docs.python.org/3/glossary.html#term-list-comprehension> |
