# Enums { .section-python .bloque-python }

> Un enum es un conjunto cerrado de valores con nombre: los roles de un mensaje, los niveles de un log, los estados de una tarea. Evita las erratas en textos sueltos y deja que el editor te avise.

---

## Un conjunto cerrado de valores {: .topic-title }

Cuando una variable solo puede valer unas pocas cosas conocidas (`"system"`, `"user"` o `"assistant"`), usar textos sueltos invita a erratas: `"usre"` pasa sin que nadie se queje. Un **enum** (enumeración) da nombre a cada opción y rechaza el resto.

**1. El script**

```python
# basic.py
from enum import Enum


class Role(Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


print(Role.USER, Role.USER.name, Role.USER.value)
print(Role("assistant"), Role["SYSTEM"])
print(Role.USER == Role.USER, Role.USER is Role("user"), Role.USER == "user")
print(list(Role))
print([role.value for role in Role])
print(isinstance(Role.USER, Role), type(Role.USER))

try:
    Role("robot")
except ValueError as error:
    print("ValueError:", error)
try:
    Role.ROBOT
except AttributeError as error:
    print("AttributeError:", error)
try:
    Role.USER = "otro"
except AttributeError as error:
    print("AttributeError:", error)
```

**2. Cómo se ejecuta**

```bash
python basic.py
```

**3. Qué pasa por dentro.** `class Role(Enum)` define tres **miembros**. Cada uno tiene un `name` (`"USER"`, el nombre de la constante) y un `value` (`"user"`, el valor asociado). Se accede por nombre (`Role.USER`), por valor (`Role("user")`) o por nombre-texto (`Role["USER"]`). Cada miembro existe **una sola vez**: `Role.USER is Role("user")` es `True`.

**4. La salida**

```text
Role.USER USER user
Role.ASSISTANT Role.SYSTEM
True True False
[<Role.SYSTEM: 'system'>, <Role.USER: 'user'>, <Role.ASSISTANT: 'assistant'>]
['system', 'user', 'assistant']
True <enum 'Role'>
ValueError: 'robot' is not a valid Role
AttributeError: type object 'Role' has no attribute 'ROBOT'
AttributeError: cannot reassign member 'USER'
```

- Un enum es **iterable**: `list(Role)` da todos los miembros, en orden.
- `Role("robot")` falla con `ValueError`: es la validación gratis. Perfecto para convertir un texto que llega de fuera.
- `Role.ROBOT` falla con `AttributeError`, y los miembros no se pueden reasignar.
- **`Role.USER == "user"` es `False`**: un miembro del `Enum` normal no es igual a su valor. Esto se arregla con `StrEnum`.

---

## StrEnum {: .topic-title }

Con **`StrEnum`** (Python 3.11 o superior), cada miembro **es** un texto, además de ser un miembro del enum. Se compara y se imprime como un `str`, y se serializa a JSON sin trucos. Es la opción para roles y estados que viajan como texto.

```python
# str_enum.py
import json
from enum import StrEnum, auto


class Role(StrEnum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


print(Role.USER, repr(Role.USER))
print(Role.USER == "user", "user" == Role.USER)
print(f"rol: {Role.ASSISTANT}")
print(json.dumps({"role": Role.USER, "content": "Hola"}))
print(Role.USER.upper(), len(Role.USER))


class Level(StrEnum):
    LOW = auto()
    HIGH = auto()

print(list(Level), Level.HIGH.value)
```

```text
user <Role.USER: 'user'>
True True
rol: assistant
{"role": "user", "content": "Hola"}
USER 4
[<Level.LOW: 'low'>, <Level.HIGH: 'high'>] high
```

- `print` y las f-strings muestran el valor (`user`), no `Role.USER`.
- Se compara con textos en las dos direcciones.
- `json.dumps` lo convierte sin problema; con el `Enum` normal habría que usar `.value`:

```python
# plain_enum_json.py
import json
from enum import Enum


class Role(Enum):
    USER = "user"

try:
    json.dumps({"role": Role.USER})
except TypeError as error:
    print("TypeError:", error)
print(json.dumps({"role": Role.USER.value}))
```

```text
TypeError: Object of type Role is not JSON serializable
{"role": "user"}
```

- Tiene todos los métodos de `str` (`upper`, `len`...).
- `auto()` genera el valor solo: en un `StrEnum`, el nombre en minúsculas (`LOW` → `"low"`).

!!! warning "`IntEnum` y valores repetidos"
    `IntEnum` se comporta como un entero (comparable y ordenable). Y si dos nombres tienen el **mismo valor**, el segundo es solo un **alias** del primero: `CRIMSON = 1` después de `RED = 1` no crea un miembro nuevo.

---

## Enums con match y tipos {: .topic-title }

Los enums y [`match`](../../../01-fundamentos/03-decisiones/02-match-case/index.md) se complementan. Recuerda que en un `case`, un nombre suelto **captura**; los miembros de un enum llevan un punto (`Role.SYSTEM`), así que se comparan como constantes.

```python
# use_match.py
from enum import StrEnum


class Role(StrEnum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


def label(role: Role) -> str:
    match role:
        case Role.SYSTEM:
            return "Instrucciones"
        case Role.USER:
            return "Persona"
        case Role.ASSISTANT:
            return "Modelo"


for raw in ["user", "assistant", "robot"]:
    try:
        print(raw, "->", label(Role(raw)))
    except ValueError:
        print(raw, "-> rol desconocido")
```

```text
user -> Persona
assistant -> Modelo
robot -> rol desconocido
```

- `Role(raw)` convierte el texto de fuera en miembro **o falla**, y el `except ValueError` atrapa el rol desconocido.
- Con la anotación `role: Role` y `mypy`, si luego añades un cuarto rol y olvidas un `case`, el comprobador lo señala (mypy dice «Success» aquí porque están los tres).

Y la diferencia con las cadenas sueltas:

```python
# compare_typo.py
role = "usre"
print(role == "user")

from enum import StrEnum
class Role(StrEnum):
    USER = "user"

try:
    Role.USRE
except AttributeError as error:
    print("AttributeError:", error)
```

```text
False
AttributeError: type object 'Role' has no attribute 'USRE'
```

Con una cadena, una errata es un `False` silencioso. Con un enum, es un error inmediato (y el editor lo marca antes de ejecutar).

---

## Python en IA {: .topic-title }

- **Roles de mensaje:** `system`, `user`, `assistant` (y otros según el proveedor). Es el enum por excelencia.
- **Motivos de parada** de una respuesta (terminó, llegó al máximo de tokens...), **estados de una tarea**, **tipos de contenido** de un mensaje.
- **Niveles de creatividad** o de coste: `LOW`, `HIGH`.

!!! tip "`StrEnum` para lo que viaja como JSON"
    Con `StrEnum`, el valor se serializa y se compara como texto, que es lo que esperan las APIs; y tú trabajas con nombres comprobables.

!!! warning "No te fíes de una cadena que viene de fuera"
    La respuesta de una API o de un modelo puede traer un valor inesperado. `Role(raw)` lo valida; y Pydantic lo hace automáticamente ([Pydantic](../../05-pydantic/01-pydantic/index.md)).

---

## Comparación con JavaScript {: .topic-title }

| En JS / TypeScript | En Python |
|---|---|
| `enum Role { User = "user" }` (TypeScript) | `class Role(StrEnum): USER = "user"` |
| `const Role = Object.freeze({ USER: "user" })` | `Enum` (inmutable de serie) |
| <code>type Role = "system" &#124; "user"</code> (unión de literales) | `Literal["system", "user"]` o un `Enum` |
| `Object.values(Role)` | `list(Role)` / `[r.value for r in Role]` |
| Comparar con cadenas sueltas | Comparar con miembros |

!!! tip "Consejos"
    - **Un enum por conjunto cerrado** de valores que usas en varios sitios.
    - **`StrEnum`** para valores de texto.
    - **`Role(valor)` para validar** lo que llega de fuera.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye enumeraciones | — |
| **Documentación oficial** | |
| Módulo `enum` | <https://docs.python.org/3/library/enum.html> |
| `enum.Enum` | <https://docs.python.org/3/library/enum.html#enum.Enum> |
| `enum.StrEnum` | <https://docs.python.org/3/library/enum.html#enum.StrEnum> |
| `enum.IntEnum` | <https://docs.python.org/3/library/enum.html#enum.IntEnum> |
| `enum.auto` | <https://docs.python.org/3/library/enum.html#enum.auto> |
