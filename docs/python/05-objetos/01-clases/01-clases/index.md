# Clases { .section-python .bloque-python }

> Una clase es un molde que agrupa datos y las funciones que trabajan con ellos. Aquí aprendes `__init__`, `self`, los métodos, cómo se imprime un objeto, las propiedades y la diferencia entre método de instancia, de clase y estático.

---

## class, __init__ y self {: .topic-title }

Hasta ahora has agrupado datos en diccionarios y tuplas, y la lógica en funciones sueltas. Una **clase** junta las dos cosas: define qué **datos** tiene algo y qué se puede **hacer** con él. Cada «cosa» creada a partir de una clase es un **objeto** (o **instancia**).

Los apuntes de la escuela dicen que «en Python todo es un objeto» y no profundizan: el curso no incluye clases. Esto es lo que falta.

**1. El script**

```python
# basic.py
class Message:
    def __init__(self, role, content):
        self.role = role
        self.content = content

    def word_count(self):
        return len(self.content.split())

    def __repr__(self):
        return f"Message(role={self.role!r}, content={self.content!r})"

    def __str__(self):
        return f"[{self.role}] {self.content}"


message = Message("user", "¿Qué es un token?")
print(message.role, message.word_count())
print(message)
print(repr(message))
print([message])
print(type(message), isinstance(message, Message))
message.role = "assistant"
print(message)
print(message.__dict__)
other = Message("user", "Hola")
print(other == Message("user", "Hola"), other is other)
```

**2. Cómo se ejecuta**

```bash
python basic.py
```

**3. Qué pasa por dentro.**

- `class Message:` define el molde. Por convención, el nombre va en `CamelCase`.
- `Message("user", "¿Qué es un token?")` **crea** un objeto: Python hace uno vacío y llama a `__init__` con él como primer argumento, más los valores.
- **`self`** es ese objeto. Es el primer parámetro de todo método de instancia; Python lo pasa solo al llamar `message.word_count()`. Dentro, `self.role = role` guarda un dato **en el objeto**: un **atributo**.
- **`word_count`** es un **método**: una función dentro de la clase, que trabaja con los atributos del objeto.
- `__repr__` y `__str__` son «métodos especiales» (los que llevan guiones bajos dobles) que Python llama en situaciones concretas.

**4. La salida**

```text
user 4
[user] ¿Qué es un token?
Message(role='user', content='¿Qué es un token?')
[Message(role='user', content='¿Qué es un token?')]
<class '__main__.Message'> True
[assistant] ¿Qué es un token?
{'role': 'assistant', 'content': '¿Qué es un token?'}
False True
```

- **`__str__`** es lo que muestra `print(objeto)`: una versión legible para personas.
- **`__repr__`** es la versión «técnica», idealmente la que permitiría recrear el objeto. La usa el REPL, la depuración y el contenido de una lista (`[message]` muestra el `repr`).
- Los atributos viven en `message.__dict__` (un diccionario, que de hecho es lo que son por debajo) y se pueden cambiar.
- `other == Message("user", "Hola")` es `False`: por defecto dos objetos son iguales solo si son **el mismo**. Hacer que se comparen por valor es justo lo que resuelve [dataclass](../../02-dataclass/01-dataclasses/index.md).

!!! warning "Sin `__repr__`, el objeto se imprime como una dirección"
    ```python
    # no_repr.py
    class Plain:
        def __init__(self, value):
            self.value = value

    print(Plain(3))
    ```

    ```text
    <__main__.Plain object at 0x...>
    ```

    Inservible para depurar. Define siempre un `__repr__` (o usa `dataclass`, que lo crea solo).

!!! warning "TypeError: say() takes 1 positional argument but 2 were given"
    Olvidar `self` en un método. Python pasa el objeto como primer argumento sin avisar, así que la función recibe uno más de los que declaraste:

    ```python
    # self_forgot.py
    class Broken:
        def say(text):
            return text

    Broken().say("hola")
    ```

    ```text
    Broken.say() takes 1 positional argument but 2 were given
    ```

---

## Atributos de clase y de instancia {: .topic-title }

Los atributos que se asignan con `self.` en `__init__` son **de instancia**: cada objeto tiene los suyos. Los que se escriben directamente dentro de la clase son **de clase**: los comparten todos.

```python
# class_vs_instance.py
class Conversation:
    total_created = 0
    default_model = "modelo-demo"

    def __init__(self, title):
        self.title = title
        self.messages = []
        Conversation.total_created += 1

    def add(self, role, content):
        self.messages.append((role, content))
        return self


first = Conversation("uno")
second = Conversation("dos")
first.add("user", "Hola").add("assistant", "Buenas")
print(len(first.messages), len(second.messages))
print(Conversation.total_created, first.total_created, first.default_model)
first.default_model = "otro"
print(first.default_model, second.default_model, Conversation.default_model)
print(first.add)
```

```text
2 0
2 2 modelo-demo
otro modelo-demo modelo-demo
<bound method Conversation.add of <__main__.Conversation object at 0x...>>
```

- Cada conversación tiene su lista `messages` propia (2 y 0).
- `total_created` es de clase: un contador compartido, leíble desde la clase o desde cualquier instancia.
- Asignar `first.default_model = "otro"` crea un atributo **de instancia** que oculta al de clase, solo en `first`. Las demás siguen viendo el de clase.
- `add` devuelve `self`, lo que permite encadenar: `first.add(...).add(...)`.
- `first.add` es un **método enlazado** (*bound method*): una función con el objeto ya pegado como `self`.

!!! warning "Una lista en el cuerpo de la clase se comparte"
    Es la misma trampa que el [default mutable](../../../03-funciones/01-funciones-basicas/02-parametros/index.md#la-trampa-del-default-mutable):

    ```python
    # mutable_class.py
    class Bad:
        messages = []

        def add(self, text):
            self.messages.append(text)


    a, b = Bad(), Bad()
    a.add("hola")
    print(b.messages)

    class Good:
        def __init__(self):
            self.messages = []

        def add(self, text):
            self.messages.append(text)

    c, d = Good(), Good()
    c.add("hola")
    print(d.messages)
    ```

    ```text
    ['hola']
    []
    ```

    En `Bad`, la lista es de clase y `b` ve lo que añadió `a`. Las listas y diccionarios propios de cada objeto se crean en `__init__`.

---

## property {: .topic-title }

Un atributo normal acepta cualquier valor. Si quieres **validar** al asignar, o calcular un valor al leerlo, usa **`@property`**: se lee como un atributo, pero detrás hay una función.

```python
# prop.py
class Settings:
    def __init__(self, temperature=0.7):
        self.temperature = temperature

    @property
    def temperature(self):
        return self._temperature

    @temperature.setter
    def temperature(self, value):
        if not 0 <= value <= 2:
            raise ValueError(f"temperatura fuera de rango: {value}")
        self._temperature = value

    @property
    def is_creative(self):
        return self._temperature > 1


settings = Settings()
print(settings.temperature, settings.is_creative)
settings.temperature = 1.5
print(settings.temperature, settings.is_creative)
try:
    settings.temperature = 9
except ValueError as error:
    print(error)
try:
    settings.is_creative = True
except AttributeError as error:
    print("AttributeError:", error)
```

```text
0.7 False
1.5 True
temperatura fuera de rango: 9
AttributeError: property 'is_creative' of 'Settings' object has no setter
```

- `@property` sobre `temperature` define cómo **leer**; `@temperature.setter` define cómo **asignar**, con validación.
- El dato real se guarda en `self._temperature`. El guion bajo inicial es una **convención** que significa «uso interno, no lo toques desde fuera»; Python no lo impide.
- `is_creative` solo tiene lectura: es un valor calculado. Intentar asignarlo da `AttributeError`.
- Desde fuera se usa como un atributo normal (`settings.temperature`), sin paréntesis.

---

## Métodos de clase y estáticos {: .topic-title }

Además de los métodos de instancia (con `self`), hay dos tipos más:

```python
# class_static.py
class Message:
    VALID_ROLES = ("system", "user", "assistant")

    def __init__(self, role, content):
        self.role = role
        self.content = content

    @classmethod
    def from_dict(cls, data):
        return cls(data["role"], data["content"])

    @classmethod
    def user(cls, content):
        return cls("user", content)

    @staticmethod
    def is_valid_role(role):
        return role in Message.VALID_ROLES

    def to_dict(self):
        return {"role": self.role, "content": self.content}


message = Message.from_dict({"role": "assistant", "content": "Hola"})
print(message.to_dict(), Message.user("¿Qué tal?").to_dict())
print(Message.is_valid_role("user"), Message.is_valid_role("robot"))
```

```text
{'role': 'assistant', 'content': 'Hola'} {'role': 'user', 'content': '¿Qué tal?'}
True False
```

| Tipo | Recibe | Para qué |
|---|---|---|
| Método de instancia | `self` (el objeto) | Trabajar con los datos de un objeto |
| `@classmethod` | `cls` (la clase) | Fabricar objetos de otras maneras (**constructores alternativos**) |
| `@staticmethod` | Nada especial | Una función relacionada con la clase, que no necesita ni objeto ni clase |

- `from_dict` y `user` crean un `Message` desde otros datos. Usan `cls(...)` en lugar de `Message(...)` para que funcionen también en clases hijas.
- `is_valid_role` es una función suelta que vive en la clase por orden.

---

## Python en IA {: .topic-title }

Las clases son la forma de representar los conceptos de un sistema con modelos:

- **`Message`**, **`Conversation`**, **`Prompt`**: datos con comportamiento (contar palabras, convertir a diccionario para la API).
- **Un cliente** (`PromptClient`) que guarda la configuración (`model`, `temperature`) y expone `send(...)`: los SDK de los proveedores son clases.
- **Constructores alternativos** (`Message.from_dict`) para convertir lo que llega de una API a objetos.

!!! tip "`to_dict` y `from_dict` como puente con JSON"
    Las APIs trabajan con diccionarios y JSON. Un método que convierte tu objeto a diccionario (y otro que lo reconstruye) es la frontera entre tu código y el exterior.

!!! warning "No hace falta una clase para todo"
    Un diccionario y un par de funciones resuelven muchos casos. Una clase merece la pena cuando hay **datos con reglas** (validar la temperatura) o **estado que cambia** (una conversación que crece).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `class Message { constructor(role) { this.role = role } }` | `class Message:` + `def __init__(self, role): self.role = role` |
| `this` (implícito) | `self` (explícito, primer parámetro) |
| `new Message(...)` | `Message(...)` (sin `new`) |
| `toString()` | `__str__` (y `__repr__` para depurar) |
| `get temperature() { }` / `set temperature(v) { }` | `@property` / `@temperature.setter` |
| `static from(data) { }` | `@classmethod` o `@staticmethod` |
| Campos privados con `#campo` | Convención `_campo` (no se impide el acceso) |
| `obj.hasOwnProperty` | `obj.__dict__` / `hasattr(obj, "x")` |

!!! tip "Consejos"
    - **`__repr__` siempre**, aunque sea sencillo.
    - **Las listas y diccionarios propios, en `__init__`.**
    - **`@property` para validar o calcular**, no por costumbre.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye clases ni programación orientada a objetos (solo menciona que en Python «todo es un objeto») | — |
| Introducció (mención de «tot són objectes») | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_000/#una-mica-dhistoria> |
| **Documentación oficial** | |
| Tutorial — Un primer vistazo a las clases | <https://docs.python.org/3/tutorial/classes.html#a-first-look-at-classes> |
| Tutorial — Objetos de instancia | <https://docs.python.org/3/tutorial/classes.html#instance-objects> |
| Tutorial — Variables de clase y de instancia | <https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables> |
| Referencia — `object.__repr__` | <https://docs.python.org/3/reference/datamodel.html#object.__repr__> |
| Referencia — `object.__str__` | <https://docs.python.org/3/reference/datamodel.html#object.__str__> |
| `property` | <https://docs.python.org/3/library/functions.html#property> |
| `classmethod` | <https://docs.python.org/3/library/functions.html#classmethod> |
| `staticmethod` | <https://docs.python.org/3/library/functions.html#staticmethod> |
