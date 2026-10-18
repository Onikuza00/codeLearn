# Listas { .section-python .bloque-python }

> Una lista guarda varios valores en orden y se puede cambiar. Aquí aprendes a crearla, cortarla, modificarla y a no confundir copiar una lista con repartir etiquetas sobre la misma.

---

## Crear una lista y leerla {: .topic-title }

Una **lista** (`list`) es una colección ordenada de valores entre corchetes y separados por comas. Admite cualquier tipo, también mezclados, y puede estar vacía.

El flujo completo, con los datos de unas ofertas de empleo:

**1. El script**

```python
# create.py
titles = ["Frontend Developer", "Backend Developer", "Data Analyst"]
salaries = [32000, 41000, 38000]
mixed = ["Madrid", 2026, True, None]
empty = []

print(titles)
print(len(titles), len(empty))
print(titles[0], "|", titles[-1])
print(type(titles))
print(list("IA"), list(range(3)))
print("Data Analyst" in titles, "DevOps" in titles)
```

**2. Cómo se ejecuta**

```bash
python create.py
```

**3. Qué pasa por dentro.** Python crea un objeto lista con los valores en el orden en que los escribes y pega el nombre `titles` a ese objeto. `titles[0]` pide el elemento de la posición 0 (se cuenta desde 0) y `titles[-1]` el último. `list(...)` convierte en lista cualquier cosa que se pueda recorrer. `in` pregunta si un valor está dentro.

**4. La salida**

```text
['Frontend Developer', 'Backend Developer', 'Data Analyst']
3 0
Frontend Developer | Data Analyst
<class 'list'>
['I', 'A'] [0, 1, 2]
True False
```

`len`, el índice negativo y `in` ya los conoces de los textos en [Strings y f-strings](../../../01-fundamentos/02-datos-basicos/02-strings-y-f-strings/index.md). Las listas funcionan igual.

!!! warning "IndexError: list index out of range"
    Un índice suelto tiene que existir. Con tres elementos, `titles[3]` falla. Un último elemento seguro es `titles[-1]`, salvo que la lista esté vacía: ahí también falla.

---

## Slicing {: .topic-title }

Cortar una lista con `[inicio:fin:paso]` funciona igual que con un texto: el inicio entra, el fin no.

```python
# slicing.py
titles = ["Frontend", "Backend", "Data", "DevOps", "QA"]

print(titles[1:3])
print(titles[:2])
print(titles[2:])
print(titles[-2:])
print(titles[::2])
print(titles[::-1])
print(titles[10:20])
print(titles[:])
```

```text
['Backend', 'Data']
['Frontend', 'Backend']
['Data', 'DevOps', 'QA']
['DevOps', 'QA']
['Frontend', 'Data', 'QA']
['QA', 'DevOps', 'Data', 'Backend', 'Frontend']
[]
['Frontend', 'Backend', 'Data', 'DevOps', 'QA']
```

Dos cosas que importan:

- Un slice **no da error** si te pasas: `titles[10:20]` devuelve una lista vacía.
- Un slice **devuelve una lista nueva**. `titles[:]` es una copia (superficial, ver más abajo).

---

## Añadir y quitar {: .topic-title }

Las listas son **mutables**: se cambian en el sitio, sin crear otra ([Variables y tipos](../../../01-fundamentos/02-datos-basicos/01-variables-y-tipos/index.md#dos-nombres-un-mismo-valor) lo introduce). Estos son los métodos que más vas a usar:

```python
# methods.py
tags = ["react", "css"]

tags.append("html")
print(tags)
tags.extend(["git", "sql"])
print(tags)
tags.insert(0, "python")
print(tags)
last = tags.pop()
print(last, tags)
first = tags.pop(0)
print(first, tags)
tags.remove("css")
print(tags)
del tags[0]
print(tags)
print(tags.index("git"), tags.count("git"))
tags.append(["a", "b"])
print(tags, len(tags))
print(tags.append("x"))
```

```text
['react', 'css', 'html']
['react', 'css', 'html', 'git', 'sql']
['python', 'react', 'css', 'html', 'git', 'sql']
sql ['python', 'react', 'css', 'html', 'git']
python ['react', 'css', 'html', 'git']
['react', 'html', 'git']
['html', 'git']
1 1
['html', 'git', ['a', 'b']] 3
None
```

| Método | Qué hace |
|---|---|
| `append(x)` | Añade **un** elemento al final |
| `extend(otra)` | Añade **todos** los elementos de otra colección |
| `insert(i, x)` | Mete `x` en la posición `i` y desplaza el resto |
| `pop()` / `pop(i)` | Quita y **devuelve** el último / el de la posición `i` |
| `remove(x)` | Quita la primera aparición del **valor** `x` |
| `del lista[i]` | Quita por posición (es una instrucción, no un método) |
| `index(x)` / `count(x)` | Posición de `x` / cuántas veces aparece |

La diferencia que más se confunde: `append(["a", "b"])` mete la lista **entera como un único elemento** (por eso `len` sale 3), mientras que `extend(["a", "b"])` mete los dos.

!!! warning "Los métodos que cambian la lista devuelven `None`"
    La última línea lo enseña: `tags.append("x")` hace su trabajo y devuelve `None`. Si escribes `tags = tags.append("x")`, pierdes la lista. Es un patrón de Python: lo que modifica en el sitio no devuelve nada.

!!! warning "IndexError y ValueError al quitar"
    Si el elemento o la posición no existe, falla (los apuntes de la escuela avisan de que hay que comprobarlo):

    ```python
    # errors.py
    tags = ["react", "css"]
    for action in ["tags[5]", "tags.remove('python')", "tags.index('python')", "[].pop()"]:
        try:
            eval(action)
        except (IndexError, ValueError) as error:
            print(f"{type(error).__name__}: {error}")
    ```

    ```text
    IndexError: list index out of range
    ValueError: list.remove(x): x not in list
    ValueError: 'python' is not in list
    IndexError: pop from empty list
    ```

    Antes de `remove` o `index`, pregunta con `in`: `if "python" in tags:`.

---

## sort y sorted {: .topic-title }

Hay dos formas de ordenar y la diferencia es la misma de siempre: una **cambia la lista** y otra **crea una nueva**.

```python
# sorting.py
salaries = [41000, 32000, 38000]

ordered = sorted(salaries)
print(ordered, salaries)

result = salaries.sort()
print(result, salaries)

salaries.sort(reverse=True)
print(salaries)
```

```text
[32000, 38000, 41000] [41000, 32000, 38000]
None [32000, 38000, 41000]
[41000, 38000, 32000]
```

- `sorted(lista)` es una función: devuelve una lista ordenada y deja la original como estaba. Sirve con cualquier colección, no solo listas.
- `lista.sort()` es un método: ordena la propia lista y devuelve `None`.
- `reverse=True` ordena de mayor a menor.

Con `key=` decides **por qué criterio** se ordena. Recibe una función que se aplica a cada elemento:

```python
# sort_key.py
titles = ["beta", "Alpha", "apple", "Zed"]
print(sorted(titles))
print(sorted(titles, key=str.lower))
print(sorted(titles, key=len))
```

```text
['Alpha', 'Zed', 'apple', 'beta']
['Alpha', 'apple', 'beta', 'Zed']
['Zed', 'beta', 'Alpha', 'apple']
```

Por defecto las mayúsculas van antes que las minúsculas. Con `key=str.lower` se compara en minúsculas, y con `key=len` por longitud. El orden es **estable**: si dos elementos empatan, conservan su orden original.

!!! tip "`key` recibe la función, sin paréntesis"
    `key=str.lower` pasa la función. `key=str.lower()` la ejecutaría ya, y fallaría. Las funciones propias llegan en el pilar de funciones.

---

## Copiar o repartir etiquetas {: .topic-title }

Aquí está la trampa principal de las listas. Asignar una lista a otro nombre **no copia**: pega otra etiqueta al mismo objeto.

```python
# reference.py
original = ["react", "css"]
alias = original
shallow = original.copy()
another = original[:]
alias.append("html")
print(original)
print(shallow, another)
print(alias is original, shallow is original, shallow == ["react", "css"])

nested = [["react", "css"], ["python"]]
copied = nested.copy()
copied[0].append("html")
print(nested)
copied.append(["sql"])
print(nested, copied)
```

```text
['react', 'css', 'html']
['react', 'css'] ['react', 'css']
True False True
[['react', 'css', 'html'], ['python']]
[['react', 'css', 'html'], ['python']] [['react', 'css', 'html'], ['python'], ['sql']]
```

Paso a paso:

- `alias = original` no copia. `alias.append(...)` modifica el único objeto que existe y `original` lo ve.
- `original.copy()` y `original[:]` crean una **lista nueva** con los mismos elementos. Es una **copia superficial**.
- En una lista de listas, la copia superficial crea la lista de fuera nueva, pero las listas de dentro **siguen siendo las mismas**. Por eso `copied[0].append("html")` cambia también `nested`.
- Añadir una lista nueva a `copied` (`copied.append(["sql"])`) solo afecta a `copied`.

Para copiar también lo de dentro existe `copy.deepcopy`; lo verás en [Diccionarios anidados y JSON](../../02-diccionarios/02-diccionarios-anidados-y-json/index.md).

!!! warning "Modificar una lista mientras la recorres"
    Quitar elementos de una lista dentro de un `for` sobre ella se salta elementos:

    ```python
    # mutating_loop.py
    numbers = [2, 4, 6, 1]
    for number in numbers:
        if number % 2 == 0:
            numbers.remove(number)
    print(numbers)

    numbers = [2, 4, 6, 1]
    for number in numbers.copy():
        if number % 2 == 0:
            numbers.remove(number)
    print(numbers)
    ```

    ```text
    [4, 1]
    [1]
    ```

    El primer bucle deja el `4` porque, al borrar el `2`, los elementos se desplazan y el `for` salta uno. Recorre una copia (`numbers.copy()`) o crea una lista nueva con una [comprensión](../../04-comprensiones/01-comprensiones-de-lista/index.md).

!!! warning "`[[0] * 2] * 2` repite la misma lista"
    Multiplicar una lista de listas repite la **referencia**, no crea filas nuevas:

    ```python
    # default.py
    rows = [[0] * 2] * 2
    rows[0][0] = 9
    print(rows)
    rows = [[0] * 2 for _ in range(2)]
    rows[0][0] = 9
    print(rows)
    ```

    ```text
    [[9, 0], [9, 0]]
    [[9, 0], [0, 0]]
    ```

    `[0] * 3` sí es seguro porque los números son inmutables. Para filas independientes, usa una comprensión.

---

## Python en IA {: .topic-title }

La lista es la estructura con la que más vas a trabajar en IA, porque casi todo es «una secuencia de algo»:

- **Mensajes de una conversación:** una lista de mensajes que va creciendo con `append`.
- **Fragmentos de texto** (chunks) que se meten en un prompt.
- **Resultados** de una búsqueda ordenados por relevancia (`sorted(..., key=..., reverse=True)`).
- **Embeddings:** un vector es una lista de números `float`.

El error de la referencia aparece mucho: si guardas el mismo objeto en dos sitios y luego lo modificas, cambias los dos. Con historiales de conversación, esto puede hacer que dos conversaciones compartan sin querer los mismos mensajes.

!!! tip "Copia antes de modificar lo que no es tuyo"
    Si una parte del código recibe una lista y va a cambiarla, haz `lista.copy()` antes, salvo que quieras explícitamente que el cambio llegue al original.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `const a = [1, 2]` | `a = [1, 2]` |
| `a.push(3)` | `a.append(3)` |
| `a.push(...otra)` | `a.extend(otra)` |
| `a.splice(1, 0, x)` | `a.insert(1, x)` |
| `a.pop()` | `a.pop()` |
| `a.slice(1, 3)` | `a[1:3]` |
| `a.at(-1)` | `a[-1]` |
| `a.includes(x)` | `x in a` |
| `a.sort()` (cambia el original y ordena como texto) | `a.sort()` (cambia el original) o `sorted(a)` (devuelve otra) |
| `[...a]` (copia superficial) | `a.copy()` o `a[:]` |

!!! tip "Consejos"
    - **Elige entre `append` y `extend`** preguntándote: ¿añado un valor o varios?
    - **`sorted()` cuando necesites conservar el original**, `.sort()` cuando no.
    - **Una lista para cosas del mismo tipo** (muchos títulos, muchos salarios). Para datos distintos sobre una cosa, mira [Tuplas](../02-tuplas/index.md) y [Diccionarios](../../02-diccionarios/01-diccionarios/index.md).

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Llistes i Tuples — «Les llistes (mutables)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_101/#1-les-llistes-mutables-modificables> |
| Llistes i Tuples — «Com accedim als elements? (l'índex)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_101/#com-accedim-als-elements-lindex> |
| Llistes i Tuples — «Modificar i afegir elements» (`append`, `remove`, `del`, `len`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_101/#modificar-i-afegir-elements> |
| **Documentación oficial** | |
| Tutorial — Más sobre listas (métodos) | <https://docs.python.org/3/tutorial/datastructures.html#more-on-lists> |
| Tutorial — La sentencia `del` | <https://docs.python.org/3/tutorial/datastructures.html#the-del-statement> |
| Biblioteca — Tipos de secuencia mutables | <https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types> |
| Biblioteca — `list.sort` | <https://docs.python.org/3/library/stdtypes.html#list.sort> |
| `sorted()` | <https://docs.python.org/3/library/functions.html#sorted> |
| Guía — Ordenar (HOWTO) | <https://docs.python.org/3/howto/sorting.html> |
| Biblioteca — Operaciones comunes de secuencias (slicing) | <https://docs.python.org/3/library/stdtypes.html#common-sequence-operations> |
| Módulo `copy` — `copy.copy` | <https://docs.python.org/3/library/copy.html#copy.copy> |
