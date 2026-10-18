# Diccionarios { .section-python .bloque-python }

> Un diccionario guarda pares clave-valor y se consulta por el nombre de la clave, no por la posición. Aquí lo creas, lo lees con seguridad, lo recorres y entiendes qué puede ser una clave.

---

## Crear y modificar {: .topic-title }

Un **diccionario** (`dict`) es una colección de pares **clave: valor**. Piensa en una ficha: en lugar de «el elemento 3», pides «el salario». Se escribe entre llaves, con `:` entre clave y valor.

El flujo completo, con una oferta de empleo:

**1. El script**

```python
# create.py
offer = {
    "title": "Frontend Developer",
    "company": "Tech Solutions",
    "city": "Madrid",
    "salary": 32000,
    "remote": False,
}

print(offer)
print(offer["title"], offer["salary"])
print(len(offer), type(offer))

offer["salary"] = 35000
offer["level"] = "junior"
del offer["remote"]
print(offer)

print(dict(title="QA", city="Girona"))
print(dict([("a", 1), ("b", 2)]), {})
```

**2. Cómo se ejecuta**

```bash
python create.py
```

**3. Qué pasa por dentro.** Python crea un objeto diccionario que relaciona cada clave con su valor. `offer["title"]` busca esa clave y devuelve su valor. Asignar a una clave que ya existe **cambia** el valor (`salary`); asignar a una que no existe **la crea** (`level`). `del` borra el par.

**4. La salida**

```text
{'title': 'Frontend Developer', 'company': 'Tech Solutions', 'city': 'Madrid', 'salary': 32000, 'remote': False}
Frontend Developer 32000
5 <class 'dict'>
{'title': 'Frontend Developer', 'company': 'Tech Solutions', 'city': 'Madrid', 'salary': 35000, 'level': 'junior'}
{'title': 'QA', 'city': 'Girona'}
{'a': 1, 'b': 2} {}
```

Las claves son únicas y los valores pueden ser de cualquier tipo: números, textos, booleanos, listas y otros diccionarios. `{}` es un diccionario vacío. `dict(...)` también construye uno desde argumentos con nombre o desde una lista de pares.

!!! tip "La coma final es válida"
    Verás `"remote": False,` con coma al final. Python lo permite y facilita añadir líneas sin romper nada.

---

## Leer con seguridad {: .topic-title }

Con corchetes, si la clave no existe, hay error. Hay herramientas para evitarlo.

```python
# access.py
offer = {"title": "Frontend Developer", "city": "Madrid"}

print(offer.get("city"))
print(offer.get("salary"))
print(offer.get("salary", "No indicado"))
print("city" in offer, "salary" in offer, "Madrid" in offer)

try:
    print(offer["salary"])
except KeyError as error:
    print(f"KeyError: {error}")

print(offer.pop("city"))
print(offer.pop("city", "ya no estaba"))
print(offer)
```

```text
Madrid
None
No indicado
True False False
KeyError: 'salary'
Madrid
ya no estaba
{'title': 'Frontend Developer'}
```

| Forma | Qué hace |
|---|---|
| `offer["salary"]` | Devuelve el valor o lanza `KeyError` si falta |
| `offer.get("salary")` | Devuelve el valor o `None` si falta |
| `offer.get("salary", "No indicado")` | Devuelve el valor o el que tú pongas |
| `"salary" in offer` | ¿Existe la **clave**? (no mira los valores) |
| `offer.pop("city")` | Quita la clave y devuelve su valor |
| `offer.pop("city", defecto)` | Igual, pero sin error si falta |

El `in` pregunta por claves: `"Madrid" in offer` da `False` porque `"Madrid"` es un valor, no una clave.

!!! warning "KeyError: 'salary'"
    Es el error de los diccionarios. Aparece con `offer["salary"]` cuando falta la clave. Si la ausencia es normal, usa `.get(...)`. Si no debería faltar nunca, déjalo con corchetes: el error te avisa de un dato que no está.

!!! warning "`get` con valor `None` no distingue «falta» de «es None»"
    `offer.get("level")` da `None` tanto si la clave no existe como si existe con valor `None`. Si necesitas diferenciarlo, usa `in`.

---

## setdefault {: .topic-title }

`setdefault(clave, valor)` hace dos cosas: si la clave **existe**, devuelve su valor; si **no existe**, la crea con ese valor y lo devuelve. Es útil para agrupar.

```python
# setdefault.py
offer = {"title": "QA"}
print(offer.setdefault("city", "Girona"))
print(offer.setdefault("city", "Madrid"))
print(offer)

by_city = {}
for name, city in [("Ana", "Madrid"), ("Luis", "Girona"), ("Eva", "Madrid")]:
    by_city.setdefault(city, []).append(name)
print(by_city)
```

```text
Girona
Girona
{'title': 'QA', 'city': 'Girona'}
{'Madrid': ['Ana', 'Eva'], 'Girona': ['Luis']}
```

La primera llamada crea `city`. La segunda no la cambia (sigue `"Girona"`), porque ya existía. En el bucle, `setdefault(city, [])` crea una lista vacía la primera vez que aparece una ciudad y devuelve esa lista; el `.append(name)` la rellena. Es el patrón **agrupar por clave**: una clave, una lista de elementos.

(Ese bucle desempaqueta cada par `name, city` en el `for`; se explica en [Desempaquetado](../../05-desempaquetado/01-desempaquetado/index.md).)

!!! warning "`get` no crea la clave"
    `offer.get("level")` solo mira. `setdefault` sí **modifica** el diccionario. No los confundas.

---

## Recorrer un diccionario {: .topic-title }

Hay tres vistas: claves, valores y pares.

```python
# iterate.py
offer = {"title": "Frontend Developer", "city": "Madrid", "salary": 32000}

for key in offer:
    print("clave:", key)
print(offer.keys())
print(offer.values())
print(offer.items())
for key, value in offer.items():
    print(f"{key.upper()}: {value}")
print(list(offer), list(offer.values()))
print(sum({"a": 1, "b": 2}.values()))
```

```text
clave: title
clave: city
clave: salary
dict_keys(['title', 'city', 'salary'])
dict_values(['Frontend Developer', 'Madrid', 32000])
dict_items([('title', 'Frontend Developer'), ('city', 'Madrid'), ('salary', 32000)])
TITLE: Frontend Developer
CITY: Madrid
SALARY: 32000
['title', 'city', 'salary'] ['Frontend Developer', 'Madrid', 32000]
3
```

- Un `for` directo sobre el diccionario recorre las **claves**.
- `.values()` recorre los valores.
- `.items()` entrega **pares** `(clave, valor)`, y el `for` los desempaqueta. Es la forma más habitual y la más clara.
- `.keys()`, `.values()` e `.items()` devuelven **vistas**: se actualizan si el diccionario cambia. Con `list(...)` las conviertes en lista normal.

!!! warning "RuntimeError: dictionary changed size during iteration"
    No añadas ni quites claves mientras recorres el diccionario:

    ```python
    # changing.py
    offer = {"a": 1, "b": 2}
    try:
        for key in offer:
            offer[key + "x"] = 0
    except RuntimeError as error:
        print(error)

    offer = {"a": 1, "b": 2}
    for key in list(offer):
        offer[key + "x"] = 0
    print(offer)
    ```

    ```text
    dictionary changed size during iteration
    {'a': 1, 'b': 2, 'ax': 0, 'bx': 0}
    ```

    Recorre una copia de las claves (`list(offer)`). Cambiar el **valor** de una clave existente sí es seguro.

---

## Orden de inserción {: .topic-title }

Desde Python 3.7, un diccionario **recuerda el orden en que se insertaron las claves**. No es un orden alfabético: es el orden de llegada.

```python
# order.py
data = {}
data["b"] = 1
data["a"] = 2
data["c"] = 3
print(data)
data["b"] = 99
print(data)
del data["b"]
data["b"] = 5
print(data)
print({"x": 1, "y": 2} == {"y": 2, "x": 1})
```

```text
{'b': 1, 'a': 2, 'c': 3}
{'b': 99, 'a': 2, 'c': 3}
{'a': 2, 'c': 3, 'b': 5}
True
```

Cambiar el valor no cambia la posición. Borrar una clave y volver a crearla la manda **al final**. Y al **comparar** dos diccionarios el orden no importa: tienen los mismos pares, son iguales.

---

## Claves hashables {: .topic-title }

Los apuntes dicen que las claves «acostumbran a ser texto». En realidad el requisito es otro: la clave debe ser **hashable**. Un valor es hashable si Python puede calcularle una huella (*hash*) estable, y eso solo es posible si **no cambia**. Por eso valen textos, números, `True`/`False`, `None` y tuplas de valores hashables. No valen listas, diccionarios ni sets.

```python
# keys.py
by_pair = {("Madrid", "React"): 3, ("Girona", "Python"): 1}
print(by_pair[("Madrid", "React")])

mixed = {1: "uno", 1.0: "uno float", True: "verdadero", "1": "texto"}
print(mixed)

try:
    bad = {["a"]: 1}
except TypeError as error:
    print(error)

duplicated = {"a": 1, "a": 2}
print(duplicated)
```

```text
3
{1: 'verdadero', '1': 'texto'}
unhashable type: 'list'
{'a': 2}
```

- Una tupla `("Madrid", "React")` es una clave válida: sirve para guardar un dato por pareja de valores.
- `1`, `1.0` y `True` valen lo mismo para Python, así que son **la misma clave**: queda la primera clave y el último valor. Pasa pocas veces, pero confunde mucho.
- Una lista como clave da `TypeError: unhashable type: 'list'`.
- Si repites una clave en el literal, no hay error: gana la última (`{'a': 2}`).

---

## Python en IA {: .topic-title }

Un diccionario es la forma de describir cualquier «cosa con campos», y los modelos y sus APIs hablan en ese formato:

- **Un mensaje:** `{"role": "user", "content": "Hola"}`.
- **Los parámetros de una petición:** `{"model": ..., "temperature": 0.7, "max_tokens": 256}`.
- **Los metadatos de un documento:** título, fuente, fecha.
- **Contadores:** cuántas veces aparece cada palabra.

!!! tip "`.get()` con datos que vienen de fuera"
    Las respuestas de una API pueden traer campos ausentes. Con `["campo"]` el programa se detiene con `KeyError`; con `.get("campo", valor)` sigues con un valor razonable. Elige según lo grave que sea que falte.

!!! warning "Cuidado con un único diccionario compartido"
    Si usas el mismo diccionario como plantilla para varios mensajes y lo modificas, cambias todos. Cada mensaje debe ser un diccionario propio (más en [Diccionarios anidados y JSON](../02-diccionarios-anidados-y-json/index.md)).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `{ title: "QA" }` (clave sin comillas) | `{"title": "QA"}` (la clave es un valor: lleva comillas) |
| `obj.title` o `obj["title"]` | Solo `d["title"]` |
| `obj.title ?? "defecto"` | `d.get("title", "defecto")` |
| `"title" in obj` | `"title" in d` |
| `Object.keys(obj)` | `d.keys()` o `list(d)` |
| `Object.entries(obj)` | `d.items()` |
| `delete obj.title` | `del d["title"]` |
| Las claves son texto (o symbol) | Las claves pueden ser cualquier valor hashable |
| `Map` (claves de cualquier tipo) | `dict` ya lo permite |

!!! tip "Consejos"
    - **`for clave, valor in d.items()`** es la forma más legible de recorrer.
    - **Nombra bien las claves** (`salary`, no `s`): son la documentación del dato.
    - **Para agrupar**, `setdefault(clave, [])` es la receta; hay también `collections.defaultdict` en el pilar de ecosistema.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Diccionaris (dict) — «Creació d'un diccionari» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#1-creacio-dun-diccionari> |
| Diccionaris (dict) — «Lectura i modificació de dades» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#2-lectura-i-modificacio-de-dades> |
| Diccionaris (dict) — «Accés segur amb .get()» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#acces-segur-amb-get> |
| Diccionaris (dict) — «Recorregut per un diccionari (for)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#3-recorregut-per-un-diccionari-for> |
| **Documentación oficial** | |
| Tutorial — Diccionarios | <https://docs.python.org/3/tutorial/datastructures.html#dictionaries> |
| Tutorial — Técnicas de bucle | <https://docs.python.org/3/tutorial/datastructures.html#looping-techniques> |
| Biblioteca — Tipo `dict` (mapeos) | <https://docs.python.org/3/library/stdtypes.html#typesmapping> |
| Biblioteca — `dict.get` | <https://docs.python.org/3/library/stdtypes.html#dict.get> |
| Biblioteca — `dict.setdefault` | <https://docs.python.org/3/library/stdtypes.html#dict.setdefault> |
| Biblioteca — Vistas de diccionario | <https://docs.python.org/3/library/stdtypes.html#dict-views> |
| Glosario — «hashable» | <https://docs.python.org/3/glossary.html#term-hashable> |
