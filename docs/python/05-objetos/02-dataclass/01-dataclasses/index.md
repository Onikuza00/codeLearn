# dataclass { .section-python .bloque-python }

> Una dataclass es una clase pensada para guardar datos: Python escribe por ti el `__init__`, el `__repr__` y la comparación a partir de los campos anotados. Aquí ves `field`, `frozen`, `__post_init__` y la ordenación.

---

## Una clase de datos sin código repetido {: .topic-title }

En [Clases](../../01-clases/01-clases/index.md) escribiste `__init__`, `__repr__` y asignaste cada atributo a mano. Para una clase que solo guarda datos, es mucho texto repetido. El decorador **`@dataclass`** lo genera a partir de los **campos**: las variables anotadas con su tipo.

**1. El script**

```python
# basic.py
from dataclasses import dataclass


@dataclass
class Message:
    role: str
    content: str
    tokens: int = 0

    def word_count(self) -> int:
        return len(self.content.split())


message = Message("user", "¿Qué es un token?")
print(message)
print(message == Message("user", "¿Qué es un token?"))
print(message.word_count(), message.tokens)
message.tokens = 5
print(message)
print(Message(role="assistant", content="Hola", tokens=2))

try:
    Message("user")
except TypeError as error:
    print(error)
```

**2. Cómo se ejecuta**

```bash
python basic.py
```

**3. Qué pasa por dentro.** `@dataclass` mira las anotaciones de la clase (`role: str`, `content: str`, `tokens: int = 0`) y genera, en este orden: un `__init__` con esos parámetros (los que tienen valor son opcionales), un `__repr__` con todos los campos y un `__eq__` que compara campo a campo. Los métodos normales (`word_count`) se escriben como siempre.

**4. La salida**

```text
Message(role='user', content='¿Qué es un token?', tokens=0)
True
4 0
Message(role='user', content='¿Qué es un token?', tokens=5)
Message(role='assistant', content='Hola', tokens=2)
Message.__init__() missing 1 required positional argument: 'content'
```

- El `repr` sale solo y es útil.
- Dos mensajes con los mismos campos son **iguales** (`True`); antes, no.
- Los campos sin valor son obligatorios; los que tienen valor por defecto van **después**.
- Es como si hubieras escrito la clase a mano, con la mitad de líneas.

!!! warning "Las anotaciones definen los campos, pero no se comprueban"
    `Message("user", 123)` se ejecuta sin queja. Solo `mypy` (o el editor) avisa:

    ```text
    mypy_check.py:11: error: Argument 2 to "Message" has incompatible type "int"; expected "str"  [arg-type]
    mypy_check.py:12: error: Missing positional argument "content" in call to "Message"  [call-arg]
    ```

    Si necesitas validar en ejecución, mira [Pydantic](../../05-pydantic/01-pydantic/index.md).

---

## field, default_factory y utilidades {: .topic-title }

Para controlar un campo se usa **`field(...)`**. El caso más importante: una lista o diccionario como valor por defecto.

```python
# fields.py
from dataclasses import dataclass, field, asdict, replace


@dataclass
class Conversation:
    title: str
    messages: list[str] = field(default_factory=list)
    model: str = "modelo-demo"
    _id: int = field(default=0, repr=False)


a = Conversation("uno")
b = Conversation("dos")
a.messages.append("hola")
print(a, b)
print(asdict(a))
c = replace(a, title="copia", model="otro")
print(c)
print(c.messages is a.messages)
```

```text
Conversation(title='uno', messages=['hola'], model='modelo-demo') Conversation(title='dos', messages=[], model='modelo-demo')
{'title': 'uno', 'messages': ['hola'], 'model': 'modelo-demo', '_id': 0}
Conversation(title='copia', messages=['hola'], model='otro')
True
```

- `field(default_factory=list)` crea una lista **nueva** por cada objeto. `a` y `b` no comparten mensajes.
- `field(repr=False)` oculta el campo del `repr` (`_id` no aparece en la primera línea).
- `asdict(obj)` convierte la dataclass a diccionario (recursivamente): puente directo hacia JSON.
- `replace(obj, campo=valor)` crea una **copia** con algún campo cambiado. Es una copia superficial: `c.messages` sigue siendo la misma lista que `a.messages`.

Python protege de la trampa del default mutable:

```python
# mutable_default.py
from dataclasses import dataclass

try:
    @dataclass
    class Bad:
        items: list = []
except ValueError as error:
    print("ValueError:", error)
```

```text
ValueError: mutable default <class 'list'> for field items is not allowed: use default_factory
```

---

## frozen y __post_init__ {: .topic-title }

Una dataclass `frozen=True` es **inmutable**: no se pueden reasignar sus campos, y por eso se puede usar como clave de diccionario (es hashable).

```python
# frozen.py
from dataclasses import dataclass, FrozenInstanceError


@dataclass(frozen=True)
class Settings:
    model: str
    temperature: float = 0.7


settings = Settings("modelo-demo")
try:
    settings.temperature = 1.0
except FrozenInstanceError as error:
    print("FrozenInstanceError:", error)
print(hash(settings) == hash(Settings("modelo-demo")))
cache = {settings: "respuesta guardada"}
print(cache[Settings("modelo-demo")])
```

```text
FrozenInstanceError: cannot assign to field 'temperature'
True
True
respuesta guardada
```

Es el equivalente de la tupla ([Tuplas](../../../02-estructuras-de-datos/01-listas-y-tuplas/02-tuplas/index.md)), con nombres. Útil para configuraciones que no deben cambiar a mitad de ejecución.

Para validar o calcular campos al crear el objeto, se usa **`__post_init__`**, que se ejecuta justo después del `__init__` generado:

```python
# post_init.py
from dataclasses import dataclass, field


@dataclass
class Settings:
    model: str
    temperature: float = 0.7
    label: str = field(init=False)

    def __post_init__(self):
        if not 0 <= self.temperature <= 2:
            raise ValueError(f"temperatura fuera de rango: {self.temperature}")
        self.label = f"{self.model}@{self.temperature}"


print(Settings("modelo-demo", 0.2))
try:
    Settings("modelo-demo", 5)
except ValueError as error:
    print(error)
```

```text
Settings(model='modelo-demo', temperature=0.2, label='modelo-demo@0.2')
temperatura fuera de rango: 5
```

`field(init=False)` dice que `label` no es un parámetro: se calcula dentro.

---

## Ordenación {: .topic-title }

Con `order=True`, Python genera las comparaciones (`<`, `>`...), que comparan los campos **en el orden en que se declaran**, como una tupla:

```python
# order.py
from dataclasses import dataclass


@dataclass(order=True)
class Offer:
    salary: int
    title: str = ""


offers = [Offer(41000, "Backend"), Offer(30000, "QA"), Offer(38000, "Data")]
print(sorted(offers))
print(max(offers))
print(Offer(1, "a") < Offer(2, "a"))
print(sorted(offers, key=lambda offer: offer.title))
```

```text
[Offer(salary=30000, title='QA'), Offer(salary=38000, title='Data'), Offer(salary=41000, title='Backend')]
Offer(salary=41000, title='Backend')
True
[Offer(salary=41000, title='Backend'), Offer(salary=38000, title='Data'), Offer(salary=30000, title='QA')]
```

- El orden de los campos importa: aquí `salary` va primero, y es por lo que se ordena.
- Para otro criterio, `key=` como siempre ([Lambdas](../../../03-funciones/04-funciones-como-valores/01-lambdas-y-orden-superior/index.md)).

!!! tip "Cuándo `dataclass` y cuándo una clase normal"
    Dataclass si la clase es sobre todo **datos**. Clase normal si tiene mucha lógica propia, estado interno o un `__init__` que hace cosas que no encajan con «campos».

---

## Python en IA {: .topic-title }

Las dataclasses son la forma limpia de representar los datos de un sistema con modelos:

- **`Message(role, content)`**, **`Usage(input_tokens, output_tokens)`**, **`Settings(model, temperature, max_tokens)`**.
- **`frozen=True` para la configuración**: no se cambia por error a mitad de una conversación.
- **`asdict`** para convertir a diccionario y enviarlo como JSON.
- **`replace`** para variar una configuración (misma `Settings` con otra temperatura).

!!! tip "Una dataclass es el sustituto de `TypedDict` cuando necesitas comportamiento"
    `TypedDict` describe la forma de un diccionario sin añadir nada. Una dataclass añade métodos, validación en `__post_init__` y comparación. Si solo necesitas la forma, `TypedDict`; si necesitas un objeto, dataclass.

---

## Comparación con JavaScript {: .topic-title }

| En JS / TypeScript | En Python |
|---|---|
| `interface Message { role: string }` + `class` con constructor | `@dataclass class Message: role: str` |
| `{ ...obj, model: "otro" }` | `replace(obj, model="otro")` |
| `Object.freeze(obj)` | `@dataclass(frozen=True)` |
| `JSON.stringify(obj)` | `json.dumps(asdict(obj))` |
| `record` en otros lenguajes (Java) | `dataclass` |
| Igualdad por referencia | Igualdad por campos (con `@dataclass`) |

!!! tip "Consejos"
    - **`default_factory` para listas y diccionarios.**
    - **`frozen=True`** para configuraciones y valores que sirven de clave.
    - **`asdict` para JSON**, sin escribir `to_dict` a mano.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye clases ni dataclasses | — |
| **Documentación oficial** | |
| Módulo `dataclasses` | <https://docs.python.org/3/library/dataclasses.html> |
| `dataclasses.dataclass` | <https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass> |
| `dataclasses.field` | <https://docs.python.org/3/library/dataclasses.html#dataclasses.field> |
| Instancias inmutables (`frozen`) | <https://docs.python.org/3/library/dataclasses.html#frozen-instances> |
| Procesado posterior a la inicialización | <https://docs.python.org/3/library/dataclasses.html#post-init-processing> |
| Valores por defecto mutables | <https://docs.python.org/3/library/dataclasses.html#mutable-default-values> |
| `dataclasses.asdict` | <https://docs.python.org/3/library/dataclasses.html#dataclasses.asdict> |
| `dataclasses.replace` | <https://docs.python.org/3/library/dataclasses.html#dataclasses.replace> |
