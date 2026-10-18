# Modelar una conversación { .section-python .bloque-python }

> Los datos de una conversación con un modelo, modelados con lo que has visto en el pilar: un `Enum` para los roles, `dataclass` para los mensajes y la conversación, y Pydantic para validar la respuesta de un modelo simulado. No se llama a ninguna API.

---

## Qué vamos a construir {: .topic-title }

Tres capas, cada una con la herramienta que le corresponde:

| Capa | Herramienta | Por qué |
|---|---|---|
| Roles (`system`, `user`, `assistant`) | [`StrEnum`](../../04-enums/01-enums/index.md) | Conjunto cerrado, se serializa como texto |
| `Message` y `Conversation` | [`dataclass`](../../02-dataclass/01-dataclasses/index.md) | Datos propios, que controlas; con validación sencilla en `__post_init__` |
| Respuesta del modelo | [Pydantic](../../05-pydantic/01-pydantic/index.md) | Datos de **fuera**: hay que validarlos de verdad |

La regla de fondo: lo que **produces tú** se modela con dataclass; lo que **llega de fuera** se valida con Pydantic.

---

## El script completo {: .topic-title }

**1. El script**

```python
# conversation_model.py
import json
from dataclasses import asdict, dataclass, field
from enum import StrEnum

from pydantic import BaseModel, Field, ValidationError


class Role(StrEnum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


@dataclass(frozen=True)
class Message:
    role: Role
    content: str

    def __post_init__(self):
        if not self.content.strip():
            raise ValueError("el contenido del mensaje no puede estar vacío")


@dataclass
class Conversation:
    system_prompt: str
    messages: list[Message] = field(default_factory=list)

    def add(self, role: Role, content: str) -> None:
        self.messages.append(Message(role, content))

    def to_api(self) -> list[dict[str, str]]:
        payload = [{"role": Role.SYSTEM, "content": self.system_prompt}]
        payload += [{"role": message.role, "content": message.content} for message in self.messages]
        return payload

    def word_count(self) -> int:
        return sum(len(message.content.split()) for message in self.messages)


class ModelReply(BaseModel):
    answer: str = Field(min_length=1)
    confidence: float = Field(ge=0, le=1)
    sources: list[str] = []


def fake_model(messages: list[dict[str, str]], mode: str) -> str:
    question = messages[-1]["content"]
    if mode == "ok":
        return json.dumps({"answer": f"Respuesta a: {question}", "confidence": 0.8, "sources": ["doc1"]})
    if mode == "wrong_type":
        return json.dumps({"answer": "x", "confidence": "alta"})
    if mode == "out_of_range":
        return json.dumps({"answer": "x", "confidence": 7})
    return "Lo siento, no puedo responder en JSON."


conversation = Conversation("Eres un asistente. Responde en JSON.")
conversation.add(Role.USER, "¿Qué es un token?")
print(conversation.messages[0])
print(json.dumps(conversation.to_api(), ensure_ascii=False))
print(conversation.word_count(), asdict(conversation.messages[0]))

try:
    conversation.add(Role.USER, "   ")
except ValueError as error:
    print("ValueError:", error)

for mode in ["ok", "wrong_type", "out_of_range", "plain_text"]:
    raw = fake_model(conversation.to_api(), mode)
    try:
        reply = ModelReply.model_validate_json(raw)
    except ValidationError as error:
        problem = error.errors()[0]
        print(f"{mode:13} -> rechazada: {problem['type']} {problem['loc']}")
        continue
    conversation.add(Role.ASSISTANT, reply.answer)
    print(f"{mode:13} -> aceptada: {reply.answer!r} (confianza {reply.confidence})")

print(len(conversation.messages), [message.role.value for message in conversation.messages])
```

**2. Cómo se ejecuta**, con el entorno virtual activo y `pydantic` instalado (`python -m pip install pydantic`):

```bash
python conversation_model.py
```

**3. Qué pasa por dentro:**

- **`Role(StrEnum)`** define los tres roles. Al ser un `StrEnum`, `json.dumps` los convierte a texto sin ayuda.
- **`Message`** es una dataclass `frozen=True`: un mensaje no se modifica una vez creado. Su `__post_init__` rechaza el contenido vacío.
- **`Conversation`** guarda el `system_prompt` y la lista de mensajes (con `default_factory=list`). `add` crea el `Message` (y por tanto lo valida), `to_api` construye la lista de diccionarios `role` / `content` que esperan las APIs, y `word_count` usa una expresión generadora.
- **`ModelReply`** es el modelo Pydantic de lo que **debería** devolver el modelo: respuesta no vacía, confianza entre 0 y 1, fuentes opcionales.
- **`fake_model`** simula cuatro respuestas: correcta, con un tipo erróneo, con un valor fuera de rango y con texto que no es JSON.
- El bucle final valida cada respuesta con `model_validate_json`. Las válidas se añaden a la conversación como mensaje del `assistant`; las inválidas se descartan y se informa del tipo de problema.

**4. La salida**

```text
Message(role=<Role.USER: 'user'>, content='¿Qué es un token?')
[{"role": "system", "content": "Eres un asistente. Responde en JSON."}, {"role": "user", "content": "¿Qué es un token?"}]
4 {'role': <Role.USER: 'user'>, 'content': '¿Qué es un token?'}
ValueError: el contenido del mensaje no puede estar vacío
ok            -> aceptada: 'Respuesta a: ¿Qué es un token?' (confianza 0.8)
wrong_type    -> rechazada: float_parsing ('confidence',)
out_of_range  -> rechazada: less_than_equal ('confidence',)
plain_text    -> rechazada: json_invalid ()
2 ['user', 'assistant']
```

Al pasar `mypy conversation_model.py` el resultado es `Success: no issues found in 1 source file`.

La conversación termina con 2 mensajes: la pregunta y la **única** respuesta válida. Las tres respuestas defectuosas no han contaminado el historial.

!!! warning "Una respuesta inválida no debe entrar en el historial"
    Si guardas lo que el modelo devuelve sin validar, el siguiente turno enviará ese error de vuelta al modelo. Valida **antes** de añadir.

!!! warning "`asdict` deja los miembros del enum como están"
    `asdict(conversation.messages[0])` conserva `<Role.USER: 'user'>` (no el texto). Para JSON eso no importa con `StrEnum`; con un `Enum` normal habría que usar `.value`.

---

## Python en IA {: .topic-title }

Este es el diseño que se repite en aplicaciones reales:

| En el script | En una aplicación real |
|---|---|
| `Conversation.to_api()` | El cuerpo que se envía al SDK del proveedor |
| `fake_model(...)` | La llamada real al modelo |
| `ModelReply.model_validate_json` | Validación de la salida estructurada |
| Respuesta rechazada | Reintento con un mensaje que explique el fallo, o error claro al usuario |
| `Message` inmutable | Un registro auditable de qué se dijo |

Cuando una respuesta no pasa la validación, hay dos salidas habituales: **reintentar** (con el decorador de [Decoradores](../../../03-funciones/05-decoradores/01-decoradores/index.md), añadiendo al prompt qué falló) o **fallar de forma explícita**. Lo que no se hace es seguir adelante con datos dudosos.

!!! tip "Modela el dominio una vez, usa los modelos en todo el programa"
    `Role`, `Message` y `Conversation` los reutilizarás en el cliente, en los tests, en el almacenamiento ([Guardar conversaciones](../../../04-ficheros-y-errores/05-python-en-ia/01-guardar-conversaciones/index.md)) y en el CLI del pilar siguiente.

---

## Comparación con JavaScript {: .topic-title }

| En TypeScript / JS | En Python |
|---|---|
| <code>type Role = "system" &#124; "user" &#124; "assistant"</code> | `class Role(StrEnum)` |
| `interface Message { role: Role; content: string }` | `@dataclass(frozen=True) class Message` |
| Zod para validar la respuesta | `BaseModel` de Pydantic |
| `JSON.parse` + `schema.parse` | `model_validate_json` (las dos cosas) |
| `messages.map(m => ({ role: m.role, content: m.content }))` | Comprensión de lista en `to_api` |

!!! tip "Consejos"
    - **Dataclass para lo tuyo, Pydantic para lo de fuera.**
    - **Valida antes de guardar** en el historial.
    - **Pasa `mypy`**: los tipos de los modelos hacen que el comprobador te ayude de verdad.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye programación orientada a objetos | — |
| Diccionaris (dict) — «Estructures niuades (llistes de diccionaris)» (la forma de los mensajes) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#4-estructures-niuades-llistes-de-diccionaris> |
| **Documentación oficial** | |
| `dataclasses.dataclass` | <https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass> |
| `enum.StrEnum` | <https://docs.python.org/3/library/enum.html#enum.StrEnum> |
| Pydantic — Modelos | <https://docs.pydantic.dev/latest/concepts/models/> |
| Pydantic — Validar datos | <https://docs.pydantic.dev/latest/concepts/models/#validating-data> |
| Pydantic — JSON | <https://docs.pydantic.dev/latest/concepts/json/> |
