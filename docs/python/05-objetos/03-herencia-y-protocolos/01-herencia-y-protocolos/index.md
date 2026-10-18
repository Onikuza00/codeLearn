# Herencia y protocolos { .section-python .bloque-python }

> La herencia reutiliza una clase ampliándola; la composición, usando objetos dentro de otros. Python añade el duck typing, los protocolos y las clases abstractas para decir «este objeto sabe hacer esto» sin obligar a heredar de nada.

---

## Herencia y super() {: .topic-title }

Una clase puede **heredar** de otra: recibe todo lo suyo y añade o cambia lo que necesite. La clase de la que se hereda es la **madre** (o base); la que hereda, la **hija**.

**1. El script**

```python
# inherit.py
class Provider:
    def __init__(self, name):
        self.name = name

    def send(self, prompt):
        return f"[{self.name}] {prompt}"

    def describe(self):
        return f"Proveedor {self.name}"


class LoggingProvider(Provider):
    def __init__(self, name, log):
        super().__init__(name)
        self.log = log

    def send(self, prompt):
        self.log.append(prompt)
        return super().send(prompt)


log = []
provider = LoggingProvider("demo", log)
print(provider.send("Hola"))
print(provider.describe())
print(log)
print(isinstance(provider, Provider), issubclass(LoggingProvider, Provider))
print([cls.__name__ for cls in LoggingProvider.__mro__])
```

**2. Cómo se ejecuta**

```bash
python inherit.py
```

**3. Qué pasa por dentro.** `class LoggingProvider(Provider)` declara la herencia. La hija tiene `describe` sin escribirlo. **Sobrescribe** `send` con su propia versión. **`super()`** da acceso a la clase madre: `super().__init__(name)` ejecuta el constructor de `Provider`, y `super().send(prompt)` llama al `send` original dentro del nuevo. Python busca cada método en un orden fijo: el **MRO** (*method resolution order*): primero la hija, luego la madre, luego `object` (la base de todo).

**4. La salida**

```text
[demo] Hola
Proveedor demo
['Hola']
True True
['LoggingProvider', 'Provider', 'object']
```

- Un `LoggingProvider` **es un** `Provider` (`isinstance` → `True`).
- Una excepción propia hereda igual: `class PromptError(Exception)` ya la usaste en [Excepciones](../../../04-ficheros-y-errores/04-errores/01-excepciones/index.md).

!!! warning "Olvidar `super().__init__()`"
    Si la hija define su `__init__` y no llama al de la madre, los atributos de la madre (`self.name`) nunca se crean, y fallará más tarde con `AttributeError`.

---

## Composición mejor que herencia {: .topic-title }

La herencia expresa «**es un**» (un `LoggingProvider` es un `Provider`). La composición expresa «**tiene un**» (un `Client` tiene un proveedor y una caché). Para **combinar comportamientos**, la composición suele ser más flexible: la herencia te ata a una jerarquía.

```python
# composition.py
class Cache:
    def __init__(self):
        self.store = {}

    def get(self, key):
        return self.store.get(key)

    def put(self, key, value):
        self.store[key] = value


class Client:
    def __init__(self, provider, cache):
        self.provider = provider
        self.cache = cache

    def ask(self, prompt):
        cached = self.cache.get(prompt)
        if cached is not None:
            return f"(caché) {cached}"
        answer = self.provider.send(prompt)
        self.cache.put(prompt, answer)
        return answer


class Echo:
    def send(self, prompt):
        return f"eco: {prompt}"


client = Client(Echo(), Cache())
print(client.ask("Hola"))
print(client.ask("Hola"))
```

```text
eco: Hola
(caché) eco: Hola
```

- `Client` **recibe** sus piezas (proveedor y caché) en el constructor y las usa. No hereda de ninguna.
- Puedes cambiar `Echo` por otro proveedor, o la caché por otra, sin tocar `Client`.
- Hacerlo con herencia habría exigido una clase `CachedLoggingProvider`, y otra para cada combinación.

!!! tip "Regla práctica"
    Hereda cuando de verdad hay una relación «es un» y quieres reutilizar y especializar. Compón (pasa objetos al constructor) cuando quieras juntar capacidades distintas o poder cambiarlas.

---

## Duck typing {: .topic-title }

Python no exige que un objeto sea de una clase concreta: basta con que **tenga lo que se necesita**. «Si camina como un pato y hace cuac como un pato, es un pato.»

```python
# duck.py
class OpenProvider:
    def send(self, prompt):
        return f"abierto: {prompt}"


class OfflineProvider:
    def send(self, prompt):
        return "sin conexión (respuesta de prueba)"


class NotAProvider:
    pass


def ask(provider, prompt):
    return provider.send(prompt)


for provider in [OpenProvider(), OfflineProvider()]:
    print(ask(provider, "Hola"))
try:
    ask(NotAProvider(), "Hola")
except AttributeError as error:
    print("AttributeError:", error)
```

```text
abierto: Hola
sin conexión (respuesta de prueba)
AttributeError: 'NotAProvider' object has no attribute 'send'
```

`ask` funciona con **cualquier** objeto que tenga un método `send`, sin importar de qué clase venga. Las dos clases no heredan de nada común. El defecto: si falta el método, el error aparece **al ejecutar** y no antes.

---

## Protocol: duck typing comprobable {: .topic-title }

Un **`Protocol`** describe la forma que debe tener un objeto (qué métodos y con qué firmas), sin obligar a heredar. Los comprobadores de tipos (`mypy`, editor) lo verifican **antes de ejecutar**.

```python
# protocol.py
from typing import Protocol


class Provider(Protocol):
    def send(self, prompt: str) -> str: ...


class Echo:
    def send(self, prompt: str) -> str:
        return f"eco: {prompt}"


class Broken:
    def send(self, prompt: int) -> str:
        return "x"


def ask(provider: Provider, prompt: str) -> str:
    return provider.send(prompt)


print(ask(Echo(), "Hola"))
print(ask(Broken(), "Hola"))
```

Ejecutado con Python, funciona sin quejarse (los protocolos tampoco se comprueban en ejecución):

```text
eco: Hola
x
```

Con mypy:

```text
protocol.py:24: error: Argument 1 to "ask" has incompatible type "Broken"; expected "Provider"  [arg-type]
protocol.py:24: note: Following member(s) of "Broken" have conflicts:
protocol.py:24: note:     Expected:
protocol.py:24: note:         def send(self, prompt: str) -> str
protocol.py:24: note:     Got:
protocol.py:24: note:         def send(self, prompt: int) -> str
Found 1 error in 1 file (checked 1 source file)
```

`Echo` cumple el protocolo sin heredar de `Provider`; `Broken` no, porque su `send` espera un `int`. Mypy lo detecta.

---

## Clases abstractas: ABC {: .topic-title }

Una **clase abstracta** (`ABC`) obliga a las hijas a implementar ciertos métodos. Se **comprueba en ejecución**: no puedes crear un objeto si falta alguno.

```python
# abc_demo.py
from abc import ABC, abstractmethod


class BaseProvider(ABC):
    @abstractmethod
    def send(self, prompt: str) -> str:
        """Cada proveedor debe implementar send."""

    def describe(self) -> str:
        return f"proveedor {type(self).__name__}"


class Echo(BaseProvider):
    def send(self, prompt: str) -> str:
        return f"eco: {prompt}"


class Incomplete(BaseProvider):
    pass


print(Echo().send("Hola"), Echo().describe())
try:
    BaseProvider()
except TypeError as error:
    print(error)
try:
    Incomplete()
except TypeError as error:
    print(error)
```

```text
eco: Hola proveedor Echo
Can't instantiate abstract class BaseProvider without an implementation for abstract method 'send'
Can't instantiate abstract class Incomplete without an implementation for abstract method 'send'
```

| Herramienta | Cuándo se comprueba | Obliga a heredar |
|---|---|---|
| Duck typing | Al ejecutar (si falta algo, `AttributeError`) | No |
| `Protocol` | Antes, con `mypy`/editor | No |
| `ABC` + `@abstractmethod` | Al crear el objeto (`TypeError`) | Sí |

Protocol si quieres flexibilidad y comprobación estática; ABC si quieres una base común con código compartido (`describe`) y un fallo claro en ejecución.

---

## Python en IA {: .topic-title }

Los clientes de IA piden esta flexibilidad:

- **Varios proveedores** (uno real, uno de pruebas, uno que registra): con un `Protocol` `Provider`, tu cliente funciona con cualquiera.
- **Tests sin red:** pasas un proveedor falso que devuelve una respuesta fija; el cliente no lo distingue.
- **Composición de capacidades:** caché, reintentos, registro como piezas que se combinan.

!!! tip "El proveedor de pruebas es el mejor amigo del test"
    Si tu cliente depende de un `Protocol` en lugar de una clase concreta, probar la lógica (construir prompts, reintentar, guardar) es trivial: le das un `Echo` y compruebas el resultado ([Tests](../../../06-ecosistema/index.md)).

---

## Comparación con JavaScript {: .topic-title }

| En JS / TypeScript | En Python |
|---|---|
| `class B extends A` | `class B(A)` |
| `super(name)` en el constructor | `super().__init__(name)` |
| `super.send(x)` | `super().send(x)` |
| `interface Provider { send(p: string): string }` | `class Provider(Protocol): def send(...)` |
| Clase abstracta (TypeScript) | `ABC` + `@abstractmethod` |
| Herencia simple | Herencia múltiple permitida (`class C(A, B)`) |
| Duck typing de serie | Duck typing de serie |

!!! tip "Consejos"
    - **Composición antes que herencia** para combinar capacidades.
    - **`super().__init__()` siempre** en el constructor de la hija.
    - **`Protocol` para describir qué necesita tu código** de otro objeto.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye herencia ni POO | — |
| **Documentación oficial** | |
| Tutorial — Herencia | <https://docs.python.org/3/tutorial/classes.html#inheritance> |
| `super()` | <https://docs.python.org/3/library/functions.html#super> |
| Glosario — «duck-typing» | <https://docs.python.org/3/glossary.html#term-duck-typing> |
| `typing.Protocol` | <https://docs.python.org/3/library/typing.html#typing.Protocol> |
| Módulo `abc` | <https://docs.python.org/3/library/abc.html> |
| `abc.abstractmethod` | <https://docs.python.org/3/library/abc.html#abc.abstractmethod> |
