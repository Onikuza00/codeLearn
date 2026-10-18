# Desempaquetado { .section-python .bloque-python }

> Desempaquetar es repartir los elementos de una colección en varias variables de una sola vez. Con `*` y `**` también sirve para recoger sobrantes, juntar colecciones y pasar datos a una llamada.

---

## Repartir en variables {: .topic-title }

Ya lo has visto de pasada con las tuplas y con `for clave, valor in d.items()`. Se llama **desempaquetado** (*unpacking*): en lugar de acceder por índice, repartes los elementos en variables.

**1. El script**

```python
# basic.py
offer = ("Backend Developer", "Data Corp", "Barcelona", 41000)
title, company, city, salary = offer
print(title, company, city, salary)

x, y = [10, 20]
print(x, y)
first, second = "ab"
print(first, second)

a = 1
b = 2
a, b = b, a
print(a, b)

try:
    one, two = (1, 2, 3)
except ValueError as error:
    print(error)

try:
    one, two, three = (1, 2)
except ValueError as error:
    print(error)

_, company_only, *_ = offer
print(company_only)
```

**2. Cómo se ejecuta**

```bash
python basic.py
```

**3. Qué pasa por dentro.** A la izquierda del `=` hay varios nombres separados por comas; a la derecha, algo recorrible. Python reparte los elementos **por orden**: el primero al primer nombre, el segundo al segundo, y así. Funciona con tuplas, listas, textos y cualquier cosa que se pueda recorrer. Para que funcione, el número de nombres debe coincidir con el de elementos.

**4. La salida**

```text
Backend Developer Data Corp Barcelona 41000
10 20
a b
2 1
too many values to unpack (expected 2)
not enough values to unpack (expected 3, got 2)
Data Corp
```

Lo importante:

- **Intercambio:** `a, b = b, a` intercambia dos variables sin una tercera. A la derecha Python crea una tupla `(2, 1)`, y luego la desempaqueta.
- **Si no cuadra la cantidad**, hay `ValueError`: `too many values to unpack` o `not enough values to unpack`.
- **Guion bajo `_`:** nombre habitual para lo que no te interesa.

!!! warning "ValueError: too many values to unpack"
    Es el error de este capítulo. Mira cuántos elementos hay a cada lado del `=`. Si no sabes cuántos habrá, usa el `*` de la siguiente sección.

!!! warning "Desempaquetar un diccionario da las claves"
    `a, b = {"x": 1, "y": 2}` reparte `"x"` y `"y"`, no los valores. Para los valores: `a, b = d.values()`. Para pares, `d.items()`.

---

## Recoger el resto con * {: .topic-title }

Un nombre con `*` delante recoge **todos los elementos que sobran**, y siempre los entrega en una **lista**.

```python
# star.py
tags = ["python", "sql", "pandas", "docker"]

main, *others = tags
print(main, others)

*beginning, last = tags
print(beginning, last)

first, *middle, last = tags
print(first, middle, last)

head, *tail = ["solo"]
print(head, tail)

try:
    first, *middle, last = ["uno"]
except ValueError as error:
    print(error)

a, b, *rest = range(5)
print(a, b, rest)
```

```text
python ['sql', 'pandas', 'docker']
['python', 'sql', 'pandas'] docker
python ['sql', 'pandas'] docker
solo []
not enough values to unpack (expected at least 2, got 1)
0 1 [2, 3, 4]
```

- `main, *others = tags`: el primero y «todo lo demás».
- `*beginning, last = tags`: «todo menos el último» y el último.
- `first, *middle, last = tags`: primero, último y lo de en medio.
- Si no sobra nada, el `*` recoge una lista vacía (`tail` es `[]`).
- Solo puede haber **un** `*` por lado, y los otros nombres necesitan elementos (por eso `["uno"]` no alcanza para dos nombres).

---

## En bucles for {: .topic-title }

El `for` desempaqueta cada elemento antes de ejecutar el bloque. Por eso funcionan las construcciones que ya conoces:

```python
# loops.py
from data import offers

salaries = {offer["title"]: offer["salary"] for offer in offers}
for title, salary in salaries.items():
    print(f"{title}: {salary}")

for number, offer in enumerate(offers, start=1):
    print(number, offer["title"])

pairs = [("python", 3), ("sql", 2)]
for tag, count in pairs:
    print(tag, count)

for number, (title, salary) in enumerate(salaries.items(), start=1):
    print(number, title, salary)

for title, city in zip([o["title"] for o in offers], [o["city"] for o in offers]):
    print(title, "->", city)

for first, *rest in [("a", 1, 2), ("b", 3)]:
    print(first, rest)
```

(`from data import offers` es la lista definida en [Comprensiones de lista](../../04-comprensiones/01-comprensiones-de-lista/index.md#el-bucle-que-construye-una-lista).)

```text
Frontend Developer: 32000
Backend Developer: 41000
Data Analyst: 38000
QA Engineer: 30000
1 Frontend Developer
2 Backend Developer
3 Data Analyst
4 QA Engineer
python 3
sql 2
1 Frontend Developer 32000
2 Backend Developer 41000
3 Data Analyst 38000
4 QA Engineer 30000
Frontend Developer -> Madrid
Backend Developer -> Barcelona
Data Analyst -> Madrid
QA Engineer -> Girona
a [1, 2]
b [3]
```

Qué hay detrás de cada una:

- `.items()` entrega pares `(clave, valor)`, y `title, salary` los desempaqueta ([Diccionarios](../../02-diccionarios/01-diccionarios/index.md#recorrer-un-diccionario)).
- `enumerate` entrega pares `(número, elemento)` ([enumerate y zip](../../../01-fundamentos/04-bucles/03-enumerate-y-zip/index.md)).
- `zip` entrega tuplas con un elemento de cada colección.
- Se puede **anidar**: `number, (title, salary)` desempaqueta el par de `enumerate` y, dentro, el par que viene de `items()`. Los paréntesis son necesarios para agrupar la parte anidada.
- Con `*` también funciona dentro del `for`, cuando los elementos tienen longitud variable.

---

## * y ** para esparcir {: .topic-title }

Fuera de las asignaciones, `*` y `**` hacen el camino inverso: **esparcen** una colección dentro de otra cosa.

```python
# spread.py
parts = ["python", "sql", "pandas"]
print(*parts)
print(*parts, sep=" | ")

more = [*parts, "docker"]
print(more)
combined = [*parts, *("git", "css")]
print(combined)
print((*parts, "x"))

defaults = {"model": "modelo-demo", "temperature": 0.7}
custom = {"temperature": 0.2}
merged = {**defaults, **custom, "stream": True}
print(merged)

options = {"reverse": True}
print(sorted([3, 1, 2], **options))
print(dict(**defaults, max_tokens=256))
numbers = [3, 9, 4]
print(max(*numbers), max(numbers))
```

```text
python sql pandas
python | sql | pandas
['python', 'sql', 'pandas', 'docker']
['python', 'sql', 'pandas', 'git', 'css']
('python', 'sql', 'pandas', 'x')
{'model': 'modelo-demo', 'temperature': 0.2, 'stream': True}
[3, 2, 1]
{'model': 'modelo-demo', 'temperature': 0.7, 'max_tokens': 256}
9 9
```

| Forma | Dónde | Qué hace |
|---|---|---|
| `*lista` | En una **llamada** | Pasa cada elemento como argumento posicional: `print(*parts)` equivale a `print("python", "sql", "pandas")` |
| `**diccionario` | En una **llamada** | Pasa cada par como argumento con nombre: `sorted(lista, **options)` equivale a `sorted(lista, reverse=True)` |
| `[*a, *b]` | En un **literal** de lista (o tupla, o set) | Junta colecciones y valores sueltos |
| `{**a, **b}` | En un **literal** de diccionario | Mezcla diccionarios; en las claves repetidas gana el último |

El truco de `{**defaults, **custom}` es la versión antigua de `defaults | custom` ([Diccionarios anidados y JSON](../../02-diccionarios/02-diccionarios-anidados-y-json/index.md#combinar-diccionarios)); sigue siendo muy común, porque permite añadir claves sueltas (`"stream": True`) en el mismo paso.

!!! warning "TypeError al esparcir lo que no toca"
    `**` necesita un diccionario con claves de texto, y `*` algo recorrible. Si pasas otra cosa, falla con mensajes como `keywords must be strings` o `'list' object is not a mapping`.

---

## Python en IA {: .topic-title }

El `**` es la forma habitual de configurar una llamada a un modelo: tienes los parámetros en un diccionario y los pasas todos de golpe, en lugar de escribirlos uno a uno. Y el `*` sirve para montar la lista de mensajes que se envía.

```python
# build_messages.py
system_message = {"role": "system", "content": "Eres un asistente breve."}
history = [
    {"role": "user", "content": "Hola"},
    {"role": "assistant", "content": "¡Hola!"},
]
new_message = {"role": "user", "content": "¿Qué es un token?"}

messages = [system_message, *history, new_message]
print(len(messages), len(history))
for number, message in enumerate(messages, start=1):
    print(number, message["role"], "->", message["content"])

settings = {"model": "modelo-demo", "temperature": 0.2}
request = dict(**settings, messages=messages)
print(list(request))
```

```text
4 2
1 system -> Eres un asistente breve.
2 user -> Hola
3 assistant -> ¡Hola!
4 user -> ¿Qué es un token?
['model', 'temperature', 'messages']
```

- `[system_message, *history, new_message]` pone el mensaje de sistema delante, **esparce** el historial en medio y deja el mensaje nuevo al final, todo en una lista nueva. `history` sigue teniendo 2 mensajes.
- `dict(**settings, messages=messages)` construye la petición con los parámetros y los mensajes. Con una función propia (pilar de funciones) se usa igual: `llamar(**settings, messages=messages)`.

!!! tip "Una lista nueva en lugar de modificar el historial"
    `messages = [*history, new_message]` crea una lista aparte y deja `history` intacta. Es una forma limpia de preparar lo que vas a enviar sin cambiar lo que guardas.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `const [a, b] = lista` | `a, b = lista` |
| `const [a, ...resto] = lista` | `a, *resto = lista` |
| `[a, b] = [b, a]` | `a, b = b, a` |
| `const { x, y } = obj` | No existe para diccionarios; se usa `x, y = d["x"], d["y"]` |
| `f(...lista)` | `f(*lista)` |
| `{ ...a, ...b }` | `{**a, **b}` |
| `[...a, ...b]` | `[*a, *b]` |
| `for (const [k, v] of Object.entries(o))` | `for k, v in d.items():` |

!!! tip "Consejos"
    - **Nombres con significado al desempaquetar:** `title, company, city, salary = offer`, no `a, b, c, d`.
    - **Usa `_`** para lo que no necesitas, y `*_` para «todo lo demás, no me importa».
    - **Si empiezas a desempaquetar muchos campos**, probablemente querías un diccionario con nombres.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Barregem *args i **kwargs (bloque antiguo del curso) — `*` y `**` en la llamada y `primer, *resta = numeros` | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_022/#barregem-args-i-kwargs> |
| Diccionaris (dict) — `for clau, valor in servidor.items()` (desempaquetado implícito) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#3-recorregut-per-un-diccionari-for> |
| **Documentación oficial** | |
| Tutorial — Tuplas y secuencias (desempaquetado de secuencias) | <https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences> |
| Tutorial — Desempaquetar listas de argumentos | <https://docs.python.org/3/tutorial/controlflow.html#unpacking-argument-lists> |
| Referencia — Sentencias de asignación | <https://docs.python.org/3/reference/simple_stmts.html#assignment-statements> |
| Referencia — Llamadas (`*` y `**` en argumentos) | <https://docs.python.org/3/reference/expressions.html#calls> |
| Referencia — *Display* de diccionario (`**`) | <https://docs.python.org/3/reference/expressions.html#dictionary-displays> |
