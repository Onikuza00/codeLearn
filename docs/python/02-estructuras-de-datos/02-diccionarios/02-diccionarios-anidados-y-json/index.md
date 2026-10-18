# Diccionarios anidados y JSON { .section-python .bloque-python }

> Los datos reales son listas de diccionarios que contienen otras listas y diccionarios. Aquí aprendes a recorrerlos, a leerlos sin que salten errores, a copiarlos bien, a combinarlos y a verlos como JSON.

---

## Una lista de diccionarios {: .topic-title }

Una tabla de una base de datos, o la respuesta de una API, es casi siempre una **lista de diccionarios**: cada elemento de la lista es una fila y cada clave es una columna. Los apuntes de la escuela lo llaman «estructura niuada» (anidada).

Este es el conjunto de datos que usaremos en todo el pilar: unas ofertas de empleo.

**1. El script**

```python
# offers.py
offers = [
    {"title": "Frontend Developer", "company": "Tech Solutions", "city": "Madrid", "salary": 32000, "tags": ["react", "css"]},
    {"title": "Backend Developer", "company": "Data Corp", "city": "Barcelona", "salary": 41000, "tags": ["python", "sql"]},
    {"title": "Data Analyst", "company": "Data Corp", "city": "Madrid", "salary": 38000, "tags": ["python", "sql", "pandas"]},
]

print(len(offers))
print(offers[1]["company"])
print(offers[0]["tags"][0])
print(offers[2]["tags"][-1].upper())

for offer in offers:
    print(f"{offer['title']} - {offer['company']} ({offer['city']})")

for number, offer in enumerate(offers, start=1):
    print(number, offer["title"], len(offer["tags"]), "tags")
```

**2. Cómo se ejecuta**

```bash
python offers.py
```

**3. Qué pasa por dentro.** `offers` es una lista de tres diccionarios. Para llegar a un dato encadenas accesos, de fuera hacia dentro: `offers[1]` (la segunda oferta, un diccionario), luego `["company"]` (su valor). `offers[0]["tags"][0]` es el primer tag de la primera oferta: lista, clave, posición. En el `for`, `offer` es cada diccionario por turnos.

**4. La salida**

```text
3
Data Corp
react
PANDAS
Frontend Developer - Tech Solutions (Madrid)
Backend Developer - Data Corp (Barcelona)
Data Analyst - Data Corp (Madrid)
1 Frontend Developer 2 tags
2 Backend Developer 2 tags
3 Data Analyst 3 tags
```

Dentro de una f-string, si las comillas externas son dobles, las claves van con comillas simples (`offer['title']`). Si no, Python se confunde sobre dónde acaba el texto.

!!! tip "Lee los accesos de izquierda a derecha"
    `offers[2]["tags"][-1].upper()` se lee como una frase: de las ofertas, la tercera; su `tags`; el último; en mayúsculas. Si un acceso largo se te hace pesado, guarda un tramo en una variable con nombre: `tags = offers[2]["tags"]`.

---

## Acceso seguro a datos anidados {: .topic-title }

Cuanto más profundo es el acceso, más sitios donde puede faltar algo. Un diccionario dentro de otro:

```python
# nested.py
offer = {
    "title": "Backend Developer",
    "company": {"name": "Data Corp", "size": 120},
    "location": {"city": "Barcelona", "country": "ES"},
    "salary": {"min": 38000, "max": 44000},
}

print(offer["company"]["name"])
print(offer["salary"]["max"] - offer["salary"]["min"])

try:
    print(offer["benefits"]["health"])
except KeyError as error:
    print(f"KeyError: {error}")

print(offer.get("benefits", {}).get("health", "sin datos"))
print(offer.get("company", {}).get("name", "sin datos"))
```

```text
Data Corp
6000
KeyError: 'benefits'
sin datos
Data Corp
```

El truco es `.get("clave", {})`: si la clave falta, devuelve un **diccionario vacío**, y sobre ese vacío el siguiente `.get` ya no falla. Así encadenas sin romper nada y el último `.get` pone el valor por defecto.

Hay un caso donde el truco no basta: cuando la clave **existe pero vale `None`**.

```python
# nested_none.py
offer = {"benefits": None}
try:
    print(offer.get("benefits", {}).get("health"))
except AttributeError as error:
    print(f"AttributeError: {error}")
print((offer.get("benefits") or {}).get("health", "sin datos"))
```

```text
AttributeError: 'NoneType' object has no attribute 'get'
sin datos
```

`get("benefits", {})` solo usa el `{}` si la clave **no existe**. Aquí existe, con valor `None`, y `None.get` no existe. La solución: `(offer.get("benefits") or {})`. El `or` cambia cualquier valor falso (`None`, `{}`, `""`) por un diccionario vacío ([if / elif / else](../../../01-fundamentos/03-decisiones/01-if-elif-else/index.md#verdadero-y-falso) lo explica).

!!! warning "KeyError y AttributeError en cadena"
    Dos errores típicos al leer datos anidados: `KeyError` si falta una clave y `AttributeError: 'NoneType' object has no attribute 'get'` si en medio hay un `None`. En las respuestas de una API pasan los dos.

---

## Copiar un diccionario {: .topic-title }

Igual que con las listas, asignar no copia. `copy()` hace una copia **superficial** y `copy.deepcopy()` una **profunda**, que copia también todo lo de dentro.

```python
# copy_demo.py
import copy

offer = {"title": "QA", "tags": ["testing"]}
alias = offer
shallow = offer.copy()
deep = copy.deepcopy(offer)

offer["tags"].append("selenium")
offer["title"] = "QA Senior"

print(alias)
print(shallow)
print(deep)
print(shallow["tags"] is offer["tags"], deep["tags"] is offer["tags"])
```

```text
{'title': 'QA Senior', 'tags': ['testing', 'selenium']}
{'title': 'QA', 'tags': ['testing', 'selenium']}
{'title': 'QA', 'tags': ['testing']}
True False
```

- `alias` es el mismo objeto: ve los dos cambios.
- `shallow` tiene su propio `title` (el cambio de texto no le llega), pero comparte la **lista** `tags` con el original: ve el `"selenium"`.
- `deep` es independiente de todo.

Misma idea que en [Listas](../../01-listas-y-tuplas/01-listas/index.md#copiar-o-repartir-etiquetas): la copia superficial duplica el contenedor, no lo que hay dentro. Usa `deepcopy` cuando haya estructuras anidadas que vayas a modificar.

---

## Combinar diccionarios {: .topic-title }

Para mezclar dos diccionarios, la clave que está en los dos se queda con el valor del **último**.

```python
# merge.py
defaults = {"model": "modelo-demo", "temperature": 0.7, "max_tokens": 256}
custom = {"temperature": 0.2, "stream": True}

merged = defaults | custom
print(merged)
print(defaults)

defaults.update(custom)
print(defaults)

defaults |= {"max_tokens": 512}
print(defaults)

print({**{"a": 1, "b": 2}, **{"b": 3}})
print({"a": 1} | {"a": 2})
```

```text
{'model': 'modelo-demo', 'temperature': 0.2, 'max_tokens': 256, 'stream': True}
{'model': 'modelo-demo', 'temperature': 0.7, 'max_tokens': 256}
{'model': 'modelo-demo', 'temperature': 0.2, 'max_tokens': 256, 'stream': True}
{'model': 'modelo-demo', 'temperature': 0.2, 'max_tokens': 512, 'stream': True}
{'a': 1, 'b': 3}
{'a': 2}
```

| Forma | Efecto |
|---|---|
| <code>a &#124; b</code> (Python 3.9+) | Crea un diccionario **nuevo**; los originales no cambian |
| `a.update(b)` | **Modifica** `a` en el sitio |
| <code>a &#124;= b</code> | Igual que `update`, con operador |
| `{**a, **b}` | Crea uno nuevo desempaquetando los dos ([Desempaquetado](../../05-desempaquetado/01-desempaquetado/index.md)) |

El patrón de «valores por defecto + valores personalizados» se escribe `defaults | custom`: lo que pone el usuario gana.

!!! warning "Es una fusión superficial"
    Si un valor es otro diccionario, `|` **reemplaza** el diccionario entero, no lo mezcla por dentro. Para mezclar niveles anidados hay que recorrerlos a mano.

---

## Diccionarios y JSON {: .topic-title }

**JSON** es un formato de texto para intercambiar datos entre programas, y la forma habitual en que hablan las APIs web. Se parece muchísimo a un diccionario de Python, y eso no es casualidad. La conversión se hace con el módulo `json`:

- `json.dumps(dato)` convierte un dato de Python en un **texto** JSON.
- `json.loads(texto)` convierte un texto JSON en un dato de Python.

```python
# json_intro.py
import json

offer = {"title": "Frontend Developer", "salary": 32000, "remote": False, "level": None, "tags": ["react", "css"], "city": "Zaragoza"}

text = json.dumps(offer)
print(text)
print(type(text))
print(json.dumps(offer, indent=2, ensure_ascii=False))

back = json.loads(text)
print(back == offer, type(back))
print(back["remote"], back["level"])

answer = '{"role": "assistant", "content": "Hola", "usage": {"tokens": 12}}'
data = json.loads(answer)
print(data["usage"]["tokens"])
print(json.dumps({"ciudad": "Málaga"}), json.dumps({"ciudad": "Málaga"}, ensure_ascii=False))

try:
    json.dumps({"a": {1, 2}})
except TypeError as error:
    print(error)
print(json.dumps({1: "uno"}), json.dumps((1, 2)))
```

```text
{"title": "Frontend Developer", "salary": 32000, "remote": false, "level": null, "tags": ["react", "css"], "city": "Zaragoza"}
<class 'str'>
{
  "title": "Frontend Developer",
  "salary": 32000,
  "remote": false,
  "level": null,
  "tags": [
    "react",
    "css"
  ],
  "city": "Zaragoza"
}
True <class 'dict'>
False None
12
{"ciudad": "M\u00e1laga"} {"ciudad": "Málaga"}
Object of type set is not JSON serializable
{"1": "uno"} [1, 2]
```

La correspondencia entre los dos mundos:

| JSON | Python |
|---|---|
| objeto `{ }` | `dict` |
| array `[ ]` | `list` |
| texto | `str` |
| número | `int` o `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

Cosas a vigilar:

- Dentro de Python, el resultado de `dumps` es un `str`: JSON es **texto**.
- `indent=2` lo formatea para leerlo.
- Por defecto, `dumps` escapa las letras no ASCII (`á` se convierte en `\u00e1`). Para dejar los acentos como están, `ensure_ascii=False`.
- Los tipos que JSON no tiene no se pueden convertir: un `set` da `TypeError`. Una tupla sale como array y una clave numérica se convierte en texto (`"1"`).

Aquí solo se introduce. Cómo guardar JSON en un archivo y leerlo (`json.dump` / `json.load`) está en el pilar de ficheros y errores.

!!! warning "`json.loads` falla si el texto no es JSON válido"
    Con comillas simples, una coma de más o un `None` escrito a mano, lanza `json.JSONDecodeError`. Es un tipo de `ValueError`, que ya conoces de [Entrada y conversión](../../../01-fundamentos/02-datos-basicos/03-entrada-y-conversion/index.md).

---

## Python en IA {: .topic-title }

Todo lo de este capítulo es lo que vas a hacer a diario con una API de modelos:

- **La petición** es un diccionario (modelo, parámetros, lista de mensajes) que se convierte a JSON para enviarla.
- **La respuesta** llega como JSON; al cargarla tienes un diccionario con varios niveles (mensaje, contenido, uso de tokens...).
- **Los mensajes** son una lista de diccionarios: `[{"role": "user", "content": "..."}]`.

Un acceso como `data["usage"]["tokens"]` es el mismo patrón que `offers[1]["company"]`.

!!! tip "Defaults y overrides con `|`"
    Mantén los parámetros por defecto de tus peticiones en un diccionario y mezcla encima lo que quieras cambiar: `settings = defaults | overrides`. No mutas los defaults y se ve clarísimo qué has cambiado.

!!! warning "Los datos de fuera no son de fiar"
    Los campos de una respuesta pueden faltar, venir a `None` o cambiar de tipo. Usa el acceso seguro de este capítulo para lo opcional y deja los corchetes para lo que sí es obligatorio.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `JSON.stringify(obj)` | `json.dumps(d)` |
| `JSON.parse(text)` | `json.loads(text)` |
| `JSON.stringify(obj, null, 2)` | `json.dumps(d, indent=2)` |
| `data?.usage?.tokens` | `d.get("usage", {}).get("tokens")` |
| `{ ...a, ...b }` | <code>a &#124; b</code> o `{**a, **b}` |
| `Object.assign(a, b)` | `a.update(b)` |
| `structuredClone(obj)` (copia profunda) | `copy.deepcopy(d)` |
| `{ ...obj }` (copia superficial) | `d.copy()` |
| `null` | `None` |

!!! tip "Consejos"
    - **Datos obligatorios con `[...]`, opcionales con `.get(...)`.**
    - **`deepcopy` antes de modificar** una estructura anidada que no es tuya.
    - **Mira el JSON bonito** con `print(json.dumps(d, indent=2, ensure_ascii=False))` para entender una estructura grande.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Diccionaris (dict) — «Estructures niuades (llistes de diccionaris)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#4-estructures-niuades-llistes-de-diccionaris> |
| Diccionaris (dict) — introducción (relación con JSON) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#diccionaris-dict> |
| **Documentación oficial** | |
| Módulo `copy` — `copy.deepcopy` | <https://docs.python.org/3/library/copy.html#copy.deepcopy> |
| Biblioteca — `dict.update` | <https://docs.python.org/3/library/stdtypes.html#dict.update> |
| PEP 584 — Operadores de unión para diccionarios | <https://peps.python.org/pep-0584/> |
| Módulo `json` — `json.dumps` | <https://docs.python.org/3/library/json.html#json.dumps> |
| Módulo `json` — `json.loads` | <https://docs.python.org/3/library/json.html#json.loads> |
| Biblioteca — Tipo `dict` (mapeos) | <https://docs.python.org/3/library/stdtypes.html#typesmapping> |
