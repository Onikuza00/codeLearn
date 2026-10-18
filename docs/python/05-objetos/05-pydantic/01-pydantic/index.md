# Pydantic { .section-python .bloque-python }

> Pydantic valida y convierte datos en ejecución a partir de clases con tipos. Es la herramienta para comprobar lo que llega de fuera, y sobre todo lo que devuelve un modelo de lenguaje, antes de usarlo. No viene con Python: se instala con `pip`.

---

## Instalarlo y primer modelo {: .topic-title }

Los `dataclass` y los type hints **no comprueban** nada al ejecutar. **Pydantic** sí: define el modelo con anotaciones y, al crear el objeto, **valida** cada campo y lo **convierte** al tipo pedido si puede.

A diferencia de todo lo anterior de este pilar, **no es de la biblioteca estándar**: es un paquete de terceros. Se instala con `pip` dentro del entorno virtual del proyecto, como viste en [Entorno: venv y pip](../../../01-fundamentos/01-inicio/02-entorno-venv-pip/index.md):

```bash
python -m pip install pydantic
```

**1. El script**

```python
# basic.py
from pydantic import BaseModel


class Offer(BaseModel):
    title: str
    salary: int
    remote: bool = False
    tags: list[str] = []


offer = Offer(title="Backend Developer", salary=41000, tags=["python", "sql"])
print(offer)
print(offer.title, offer.salary, offer.remote)
print(offer.model_dump())
print(offer.model_dump_json())

coerced = Offer(title="QA", salary="30000", remote="true")
print(coerced, type(coerced.salary))
print(Offer(title="x", salary=1, extra_field="ignorado"))
```

**2. Cómo se ejecuta** (con el entorno activo, versión 2.14.1 en esta ejecución):

```bash
python basic.py
```

**3. Qué pasa por dentro.** `class Offer(BaseModel)` declara los campos con anotaciones, como una dataclass. Al llamar a `Offer(...)`, Pydantic recorre cada campo: comprueba el tipo, **convierte** si es razonable (el texto `"30000"` pasa a `30000`, `"true"` a `True`) y, si algo no encaja, lanza un error. Los campos con valor por defecto son opcionales. Los campos de más se **ignoran**.

**4. La salida**

```text
title='Backend Developer' salary=41000 remote=False tags=['python', 'sql']
Backend Developer 41000 False
{'title': 'Backend Developer', 'salary': 41000, 'remote': False, 'tags': ['python', 'sql']}
{"title":"Backend Developer","salary":41000,"remote":false,"tags":["python","sql"]}
title='QA' salary=30000 remote=True tags=[] <class 'int'>
title='x' salary=1 remote=False tags=[]
```

- `model_dump()` devuelve un diccionario; `model_dump_json()`, un texto JSON. Es el equivalente de `asdict` y `json.dumps` de golpe.
- `salary="30000"` se convirtió en el entero `30000`. Es cómodo con datos de formularios o de archivos, pero acuérdate de que convierte sin avisar.
- `tags: list[str] = []` es seguro aquí: Pydantic copia el valor por defecto en cada objeto, a diferencia de lo que ocurre en una clase normal.

---

## Errores de validación {: .topic-title }

Cuando los datos no valen, se lanza `ValidationError` con **todos** los problemas, no solo el primero.

```python
# errors.py
from pydantic import BaseModel, ValidationError


class Offer(BaseModel):
    title: str
    salary: int
    tags: list[str] = []


try:
    Offer(title="QA", salary="mucho", tags="python")
except ValidationError as error:
    print(error)
    print(error.error_count(), "errores")
    for item in error.errors():
        print(item["loc"], item["type"], "|", item["msg"])

try:
    Offer(title="QA")
except ValidationError as error:
    print(error.errors()[0]["type"], error.errors()[0]["loc"])
```

```text
2 validation errors for Offer
salary
  Input should be a valid integer, unable to parse string as an integer [type=int_parsing, input_value='mucho', input_type=str]
    For further information visit https://errors.pydantic.dev/2.14/v/int_parsing
tags
  Input should be a valid list [type=list_type, input_value='python', input_type=str]
    For further information visit https://errors.pydantic.dev/2.14/v/list_type
2 errores
('salary',) int_parsing | Input should be a valid integer, unable to parse string as an integer
('tags',) list_type | Input should be a valid list
missing ('salary',)
```

- El mensaje impreso dice **qué campo**, **qué valor** llegó y **qué se esperaba**.
- `error.errors()` da la misma información en estructura: `loc` (dónde), `type` (código estable) y `msg` (texto). Con `loc` y `type` puedes decidir qué hacer sin interpretar frases.
- `ValidationError` es un tipo de `ValueError`, así que un `except ValueError` general también lo captura.

---

## Restricciones y validadores {: .topic-title }

`Field(...)` añade reglas a un campo, y `@field_validator` permite escribir una propia.

```python
# constraints.py
from enum import StrEnum

from pydantic import BaseModel, Field, ValidationError, field_validator


class Role(StrEnum):
    USER = "user"
    ASSISTANT = "assistant"


class Message(BaseModel):
    role: Role
    content: str = Field(min_length=1)

    @field_validator("content")
    @classmethod
    def strip_content(cls, value: str) -> str:
        return value.strip()


class Settings(BaseModel):
    model: str
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=256, gt=0)


print(Message(role="user", content="  Hola  "))
print(Settings(model="modelo-demo"))
for bad in [
    lambda: Message(role="robot", content="x"),
    lambda: Message(role="user", content=""),
    lambda: Settings(model="m", temperature=5),
]:
    try:
        bad()
    except ValidationError as error:
        item = error.errors()[0]
        print(item["loc"], "->", item["msg"])
```

```text
role=<Role.USER: 'user'> content='Hola'
model='modelo-demo' temperature=0.7 max_tokens=256
('role',) -> Input should be 'user' or 'assistant'
('content',) -> String should have at least 1 character
('temperature',) -> Input should be less than or equal to 2
```

- `Role` es un [`StrEnum`](../../04-enums/01-enums/index.md): Pydantic convierte `"user"` en `Role.USER` y rechaza `"robot"`.
- `Field(ge=0, le=2)` limita el rango (*greater or equal*, *less or equal*); `gt` es *greater than*; `min_length` pide longitud mínima.
- `@field_validator("content")` limpia el texto: `"  Hola  "` se guarda como `"Hola"`.

Es lo que hacías con un `__post_init__` o una `@property` en [dataclass](../../02-dataclass/01-dataclasses/index.md) y [Clases](../../01-clases/01-clases/index.md), pero declarativo.

---

## Validar la salida de un modelo {: .topic-title }

Aquí está el uso estrella. Cuando pides a un modelo que responda en JSON, **no tienes garantía** de que lo haga bien: puede cambiar un tipo, dejar un campo, añadir texto alrededor o responder algo distinto. Con Pydantic, `model_validate_json` hace dos cosas en un paso: **parsea** el JSON y **valida** la forma.

```python
# llm_output.py
from pydantic import BaseModel, ValidationError


class Answer(BaseModel):
    answer: str
    confidence: float
    sources: list[str] = []


replies = [
    '{"answer": "Un token es un trozo de texto.", "confidence": 0.9, "sources": ["doc1"]}',
    '{"answer": "Un token...", "confidence": "alta"}',
    'Claro, aquí tienes el JSON: {"answer": "x", "confidence": 1}',
    '{"answer": "ok", "confidence": 1, "extra": true}',
]

for reply in replies:
    try:
        answer = Answer.model_validate_json(reply)
        print("OK     ", answer)
    except ValidationError as error:
        first = error.errors()[0]
        print("FALLO  ", first["type"], first["loc"])
```

```text
OK      answer='Un token es un trozo de texto.' confidence=0.9 sources=['doc1']
FALLO   float_parsing ('confidence',)
FALLO   json_invalid ()
OK      answer='ok' confidence=1.0 sources=[]
```

Las cuatro respuestas simuladas son cuatro tipos de problema real:

1. La buena: pasa.
2. `"confidence": "alta"`: el tipo es incorrecto. Se rechaza (`float_parsing`).
3. Texto delante del JSON: no es JSON válido (`json_invalid`).
4. Un campo de más: se ignora y el resto vale.

Para JSON anidado, se declaran modelos dentro de modelos:

```python
# nested.py
from pydantic import BaseModel


class Usage(BaseModel):
    input_tokens: int
    output_tokens: int


class Reply(BaseModel):
    text: str
    usage: Usage


data = {"text": "Hola", "usage": {"input_tokens": 12, "output_tokens": 3}}
reply = Reply.model_validate(data)
print(reply.usage.input_tokens + reply.usage.output_tokens)
print(type(reply.usage).__name__)
print(Reply.model_json_schema()["required"])
```

```text
15
Usage
['text', 'usage']
```

`model_validate(dict)` valida un diccionario ya cargado (frente a `model_validate_json`, que parte del texto). `usage` se convierte en un objeto `Usage`, con atributos. Y `model_json_schema()` genera la descripción **JSON Schema** del modelo, que es justo el formato que muchas APIs aceptan para pedir una salida estructurada.

!!! warning "Validar la forma no es validar la verdad"
    Pydantic asegura que `confidence` es un número. No asegura que la respuesta sea correcta, ni que `confidence` sea honesta. Es la primera barrera (la forma), no la última (el contenido, ver [Evals](../../../07-python-para-ia/index.md)).

!!! warning "La conversión silenciosa"
    `salary="30000"` pasa como `30000`. Si necesitas que no convierta (que un texto sea rechazado donde se espera un número), existe el modo estricto (`strict=True`).

---

## Python en IA {: .topic-title }

- **Validar la respuesta del modelo** antes de usarla: si no cumple, la reintentas (con un mensaje que le explique el fallo) o la descartas.
- **Describir la salida que quieres**: el modelo `Answer` se convierte en JSON Schema para pedirla.
- **Validar la configuración** (`Settings`) al arrancar: un `temperature=5` falla en el inicio, no en la petición número 300.
- **Validar lo que viene del usuario o de archivos** antes de montar un prompt con ello.

!!! tip "Valida en la frontera, confía dentro"
    Convierte los datos externos a modelos Pydantic en cuanto entran (respuesta de la API, archivo, formulario). A partir de ahí, el resto del código maneja objetos con tipos garantizados.

---

## Comparación con JavaScript {: .topic-title }

| En JS / TypeScript | En Python |
|---|---|
| Zod: `z.object({ title: z.string() })` | `class Offer(BaseModel): title: str` |
| `schema.parse(data)` | `Offer.model_validate(data)` |
| `schema.parse(JSON.parse(text))` | `Offer.model_validate_json(text)` |
| `ZodError` | `ValidationError` |
| `z.infer<typeof schema>` | La propia clase es el tipo |
| `z.coerce.number()` | Conversión por defecto (salvo `strict`) |

!!! tip "Consejos"
    - **`pip install pydantic` dentro del entorno virtual** y añade la dependencia a `requirements.txt`.
    - **`loc` y `type` del error** para decidir; el `msg` para mostrar.
    - **Un modelo por forma de dato**, con nombres que reflejen el dominio.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye Pydantic ni paquetes de terceros | — |
| **Documentación oficial** | |
| Pydantic — Instalación | <https://docs.pydantic.dev/latest/install/> |
| Pydantic — Modelos | <https://docs.pydantic.dev/latest/concepts/models/> |
| Pydantic — Validar datos | <https://docs.pydantic.dev/latest/concepts/models/#validating-data> |
| Pydantic — Campos y restricciones | <https://docs.pydantic.dev/latest/concepts/fields/> |
| Pydantic — Validadores | <https://docs.pydantic.dev/latest/concepts/validators/> |
| Pydantic — Errores de validación | <https://docs.pydantic.dev/latest/errors/validation_errors/> |
| Pydantic — JSON | <https://docs.pydantic.dev/latest/concepts/json/> |
| Pydantic en PyPI | <https://pypi.org/project/pydantic/> |
