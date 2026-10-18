# JSON { .section-python .bloque-python }

> JSON es el formato en el que hablan las APIs y en el que se guardan casi todas las conversaciones con modelos. Ya conoces `dumps` y `loads`; aquí añades `dump` y `load` para archivos, los errores típicos y el formato JSON Lines.

---

## Guardar y cargar un archivo {: .topic-title }

En [Diccionarios anidados y JSON](../../../02-estructuras-de-datos/02-diccionarios/02-diccionarios-anidados-y-json/index.md#diccionarios-y-json) usaste `dumps` y `loads`, que trabajan con **textos** (la `s` es de *string*). Sus hermanas **`dump`** y **`load`** trabajan con **archivos**.

**1. El script**

```python
# dump_load.py
import json

conversation = {
    "model": "modelo-demo",
    "messages": [
        {"role": "user", "content": "¿Qué es un token?"},
        {"role": "assistant", "content": "Un trozo de texto."},
    ],
    "usage": {"tokens": 12},
}

with open("data/conversation.json", "w", encoding="utf-8") as file:
    json.dump(conversation, file, ensure_ascii=False, indent=2)

print(open("data/conversation.json", encoding="utf-8").read())

with open("data/conversation.json", encoding="utf-8") as file:
    loaded = json.load(file)

print(loaded == conversation)
print(loaded["messages"][0]["content"])
```

**2. Cómo se ejecuta**

```bash
python dump_load.py
```

**3. Qué pasa por dentro.** `json.dump(dato, archivo)` convierte el dato a JSON y lo **escribe en el archivo** abierto. `json.load(archivo)` **lee** el archivo y devuelve el dato de Python. El archivo se abre como texto con `encoding="utf-8"`, igual que en [open y with](../../01-rutas-y-ficheros/02-open-y-with/index.md).

**4. La salida**

```text
{
  "model": "modelo-demo",
  "messages": [
    {
      "role": "user",
      "content": "¿Qué es un token?"
    },
    {
      "role": "assistant",
      "content": "Un trozo de texto."
    }
  ],
  "usage": {
    "tokens": 12
  }
}
True
¿Qué es un token?
```

Al volver a cargar, el dato es **igual** al original (`True`).

| Función | Trabaja con | Hace |
|---|---|---|
| `json.dumps(dato)` | Un `str` | Dato → texto JSON |
| `json.loads(texto)` | Un `str` | Texto JSON → dato |
| `json.dump(dato, archivo)` | Un archivo | Dato → escribe JSON en el archivo |
| `json.load(archivo)` | Un archivo | Lee el archivo → dato |

---

## Opciones que importan {: .topic-title }

```python
# ascii_trap.py
import json

data = {"city": "Málaga"}
print(json.dumps(data))
print(json.dumps(data, ensure_ascii=False))
print(json.loads('{"city": "M\\u00e1laga"}'))
print(json.dumps({"a": 1, "b": [1, 2]}, indent=None, separators=(",", ":")))
print(json.dumps({"b": 1, "a": 2}, sort_keys=True))
```

```text
{"city": "M\u00e1laga"}
{"city": "Málaga"}
{'city': 'Málaga'}
{"a":1,"b":[1,2]}
{"a": 2, "b": 1}
```

- **`ensure_ascii=False`**: sin él, `dump` y `dumps` escapan todo lo que no es ASCII (`á` → `\u00e1`). El JSON sigue siendo válido, pero ilegible para una persona. Los apuntes no lo mencionan y con acentos catalanes o españoles es lo primero que notarás.
- **`indent=2`**: formatea con sangría, para leer. Sin indent sale en una línea.
- **`separators=(",", ":")`**: formato compacto, sin espacios.
- **`sort_keys=True`**: ordena las claves alfabéticamente (útil para comparar archivos).

---

## Lo que puede salir mal {: .topic-title }

```python
# errors.py
import json
from datetime import datetime

for text in ['{"a": 1,}', "{'a': 1}", "", '{"a": 1}']:
    try:
        print(json.loads(text))
    except json.JSONDecodeError as error:
        print(f"JSONDecodeError: {error.msg} (línea {error.lineno}, columna {error.colno})")

event = {"when": datetime(2026, 10, 17)}
try:
    json.dumps(event)
except TypeError as error:
    print(error)
print(json.dumps(event, default=str))

try:
    with open("data/missing.json", encoding="utf-8") as file:
        json.load(file)
except FileNotFoundError:
    print("FileNotFoundError")
```

```text
JSONDecodeError: Illegal trailing comma before end of object (línea 1, columna 8)
JSONDecodeError: Expecting property name enclosed in double quotes (línea 1, columna 2)
JSONDecodeError: Expecting value (línea 1, columna 1)
{'a': 1}
Object of type datetime is not JSON serializable
{"when": "2026-10-17 00:00:00"}
FileNotFoundError
```

- **`JSONDecodeError`** (un tipo de `ValueError`): el texto no es JSON válido. El mensaje dice qué falla y dónde. Las causas típicas: una coma de más, **comillas simples** (JSON solo admite dobles) o un texto vacío.
- **`TypeError: not JSON serializable`**: JSON solo conoce texto, números, booleanos, `null`, listas y objetos. Una fecha, un set o un objeto propio no se convierten solos. Con `default=str` conviertes lo desconocido a texto.
- **`FileNotFoundError`** si el archivo no existe.

El tipo de error que usan los apuntes (`json.JSONDecodeError`) es el correcto. Dos cosas que JSON **no** conserva en un ciclo ida y vuelta:

```python
# roundtrip.py
import json

original = {"tags": ("a", "b"), 1: "uno", "none": None}
copy = json.loads(json.dumps(original))
print(copy)
print(copy == original)
```

```text
{'tags': ['a', 'b'], '1': 'uno', 'none': None}
False
```

Las tuplas vuelven como listas y las claves numéricas, como texto. El resultado ya no es igual al original.

!!! warning "Un JSON roto detiene el programa"
    Si cargas un archivo escrito por otra persona (o por un modelo) sin `try/except`, un solo carácter mal puesto lo detiene todo. Lo verás con calma en [Excepciones](../../04-errores/01-excepciones/index.md).

---

## JSON Lines {: .topic-title }

Un archivo JSON normal es **un** documento: para añadir un mensaje hay que cargarlo entero y reescribirlo. Para registros que crecen (un historial, un log) se usa **JSON Lines**: **un objeto JSON por línea**. Así se añade con el modo `"a"` y se lee línea a línea.

```python
# jsonl.py
import json

messages = [
    {"role": "user", "content": "Hola"},
    {"role": "assistant", "content": "¡Hola!"},
]

with open("data/chat.jsonl", "w", encoding="utf-8") as file:
    for message in messages:
        file.write(json.dumps(message, ensure_ascii=False) + "\n")

print(open("data/chat.jsonl", encoding="utf-8").read())

with open("data/chat.jsonl", encoding="utf-8") as file:
    restored = [json.loads(line) for line in file]
print(restored == messages)

with open("data/chat.jsonl", "a", encoding="utf-8") as file:
    file.write(json.dumps({"role": "user", "content": "Otro"}) + "\n")
with open("data/chat.jsonl", encoding="utf-8") as file:
    print(sum(1 for _ in file))
```

```text
{"role": "user", "content": "Hola"}
{"role": "assistant", "content": "¡Hola!"}

True
3
```

- Cada línea es un `dumps` sin `indent` (una línea = un mensaje).
- `[json.loads(line) for line in file]` recupera la lista.
- Añadir un mensaje es abrir en `"a"` y escribir una línea más: **no se reescribe nada**.

Es un formato muy habitual para datasets y registros en IA.

---

## Python en IA {: .topic-title }

JSON está en todos lados:

- **Peticiones y respuestas** de las APIs de modelos (cuerpo en JSON).
- **Historiales de conversación** guardados entre sesiones.
- **Datasets** de ejemplos o de evaluación (JSON o JSON Lines).
- **Salidas estructuradas** de un modelo: se le pide que responda con JSON y se carga con `json.loads`.

!!! warning "Un modelo puede devolver un JSON inválido"
    Si pides a un modelo que responda en JSON, a veces añade texto delante o detrás, o se deja una coma. Carga siempre con `try/except json.JSONDecodeError` y valida la forma del resultado. Validar de verdad (con tipos) es el tema de [Pydantic](../../../05-objetos/index.md) en el pilar de objetos.

!!! tip "Guarda la conversación completa, no solo el texto"
    Guarda los mensajes con su `role`, la fecha y el modelo. Con solo el texto, luego no podrás reconstruir la petición exacta.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `JSON.stringify(obj)` | `json.dumps(d)` |
| `JSON.parse(text)` | `json.loads(text)` |
| `fs.writeFileSync(p, JSON.stringify(o))` | `json.dump(d, file)` |
| `JSON.parse(fs.readFileSync(p))` | `json.load(file)` |
| `JSON.stringify(o, null, 2)` | `json.dumps(d, indent=2)` |
| Las letras con tilde se escriben tal cual | Hay que pedirlo: `ensure_ascii=False` |
| `undefined` se omite | No existe; `None` pasa a `null` |

!!! tip "Consejos"
    - **`ensure_ascii=False`, `indent=2` y `encoding="utf-8"`** juntos al guardar para leer.
    - **JSON Lines para registros que crecen.**
    - **Atrapa `JSONDecodeError`** en cualquier JSON que no hayas escrito tú.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Fitxers JSON i XML — «El format JSON (import json)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_602/#1-el-format-json-import-json> |
| Fitxers JSON i XML — «Lectura i escriptura de fitxers JSON» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_602/#lectura-i-escriptura-de-fitxers-json> |
| **Documentación oficial** | |
| Módulo `json` | <https://docs.python.org/3/library/json.html> |
| `json.dump` | <https://docs.python.org/3/library/json.html#json.dump> |
| `json.load` | <https://docs.python.org/3/library/json.html#json.load> |
| `json.dumps` | <https://docs.python.org/3/library/json.html#json.dumps> |
| `json.loads` | <https://docs.python.org/3/library/json.html#json.loads> |
| Tutorial — Guardar datos estructurados con JSON | <https://docs.python.org/3/tutorial/inputoutput.html#saving-structured-data-with-json> |
