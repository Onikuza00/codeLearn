# Excepciones { .section-python .bloque-python }

> Una excepción es la forma que tiene Python de decir que algo ha ido mal. Aquí controlas qué pasa cuando falla un archivo o un JSON, lanzas tus propios errores, aprendes la filosofía de «pedir perdón» y entiendes qué hace `with` por debajo.

---

## try, except, else y finally {: .topic-title }

Una **excepción** es un aviso de error que sube por el código hasta que alguien la captura. Si nadie lo hace, el programa se detiene y muestra el traceback. Con `try/except` la capturas y decides qué hacer. Ya usaste la forma básica en [Entrada y conversión](../../../01-fundamentos/02-datos-basicos/03-entrada-y-conversion/index.md). Aquí está completa.

**1. El script**

```python
# flow.py
import json


def load(path):
    try:
        with open(path, encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"[{path}] no existe")
        return None
    except (PermissionError, IsADirectoryError):
        print(f"[{path}] no se puede leer (permisos o es una carpeta)")
        return None
    except json.JSONDecodeError as error:
        print(f"[{path}] JSON roto: {error.msg}")
        return None
    else:
        print(f"[{path}] cargado")
        return data
    finally:
        print(f"[{path}] fin del intento")


with open("data/ok.json", "w", encoding="utf-8") as file:
    json.dump({"model": "modelo-demo"}, file)

for path in ["data/ok.json", "data/nope.json", "data/folder", "data/bad.json"]:
    print(load(path))
```

**2. Cómo se ejecuta**

```bash
python flow.py
```

(Antes se prepararon un archivo `data/bad.json` con `{"a": }` y una carpeta `data/folder`.)

**3. Qué pasa por dentro.** El bloque `try` se ejecuta. Si una línea lanza una excepción, Python salta al primer `except` cuyo tipo encaja y salta el resto del `try`. Si **no** hay excepción, se ejecuta el `else`. El `finally` se ejecuta **siempre**: haya error, haya `return` o no.

**4. La salida**

```text
[data/ok.json] cargado
[data/ok.json] fin del intento
{'model': 'modelo-demo'}
[data/nope.json] no existe
[data/nope.json] fin del intento
None
[data/folder] no se puede leer (permisos o es una carpeta)
[data/folder] fin del intento
None
[data/bad.json] JSON roto: Expecting value
[data/bad.json] fin del intento
None
```

| Bloque | Se ejecuta |
|---|---|
| `try` | Siempre, hasta que algo falle |
| `except Tipo` | Solo si el `try` lanzó ese tipo de excepción |
| `else` | Solo si el `try` **no** lanzó nada |
| `finally` | **Siempre**, incluso si hay `return` o un error sin capturar |

El `finally` se ejecuta aunque la función ya haya hecho `return`. Sirve para limpiar. Con `with` casi nunca lo necesitas, porque `with` ya limpia: es lo que hace innecesario el ejemplo de los apuntes que abría el archivo a mano y lo cerraba en el `else`.

!!! warning "Orden de los `except`: lo concreto, antes que lo general"
    Python usa el **primero** que encaja. Si pones `except Exception` arriba, se tragará todo y los demás no se ejecutarán:

    ```python
    # order.py
    try:
        int("x")
    except Exception as error:
        print("Exception (genérico):", type(error).__name__)
    except ValueError:
        print("nunca llega aquí")
    ```

    ```text
    Exception (genérico): ValueError
    ```

---

## Los tipos de excepción {: .topic-title }

Las excepciones forman una **jerarquía**: unas son casos particulares de otras. Capturar la general captura también las particulares.

```python
# order.py (parte 2)
try:
    {}["a"]
except (KeyError, IndexError) as error:
    print(type(error).__name__, error, repr(error))

print(issubclass(FileNotFoundError, OSError), issubclass(KeyError, LookupError), issubclass(ValueError, Exception))
print([cls.__name__ for cls in FileNotFoundError.__mro__])
```

```text
KeyError 'a' KeyError('a')
True True True
['FileNotFoundError', 'OSError', 'Exception', 'BaseException', 'object']
```

- `except (KeyError, IndexError)` captura **varios tipos** a la vez, con una tupla.
- `as error` guarda la excepción en una variable: `error.args`, `str(error)`, `repr(error)`...
- `FileNotFoundError` es un caso de `OSError`, que es un caso de `Exception`.

Los que más verás: `ValueError` (valor inadecuado), `TypeError` (tipo inadecuado), `KeyError` / `IndexError` (clave o posición inexistente), `FileNotFoundError`, `PermissionError`, `ZeroDivisionError`, `ConnectionError`.

!!! warning "`except:` a secas y `except Exception` por costumbre"
    Un `except:` sin tipo captura **todo**, incluso `KeyboardInterrupt` (el `Ctrl + C`): no podrías parar el programa. Un `except Exception` esconde errores de programación. Captura los tipos que sabes manejar y deja el resto subir:

    ```python
    # bare.py
    import time

    try:
        while True:
            time.sleep(0.05)
            raise KeyboardInterrupt
    except KeyboardInterrupt:
        print("interrumpido con Ctrl+C")

    try:
        raise KeyboardInterrupt
    except Exception:
        print("no lo ve Exception")
    ```

    ```text
    interrumpido con Ctrl+C
    Traceback (most recent call last):
      ...
    KeyboardInterrupt
    ```

    `KeyboardInterrupt` **no** es una `Exception`: `except Exception` no lo captura.

---

## Lanzar excepciones: raise {: .topic-title }

Tú también puedes lanzar errores, con `raise`, cuando una función recibe algo inválido. Es mejor que devolver un valor raro.

```python
# raising.py
def set_temperature(value):
    if not isinstance(value, (int, float)):
        raise TypeError(f"la temperatura debe ser un número, no {type(value).__name__}")
    if not 0 <= value <= 2:
        raise ValueError(f"temperatura fuera de rango: {value}")
    return value


for candidate in [0.7, 5, "alta"]:
    try:
        print(set_temperature(candidate))
    except (TypeError, ValueError) as error:
        print(f"{type(error).__name__}: {error}")

try:
    try:
        set_temperature(9)
    except ValueError:
        print("lo registro y lo vuelvo a lanzar")
        raise
except ValueError as error:
    print("capturado arriba:", error)
```

```text
0.7
ValueError: temperatura fuera de rango: 5
TypeError: la temperatura debe ser un número, no str
lo registro y lo vuelvo a lanzar
capturado arriba: temperatura fuera de rango: 9
```

- `raise TipoDeError("mensaje")` detiene la función en ese punto.
- Un `raise` **solo** (sin nada), dentro de un `except`, **relanza** la misma excepción: útil para registrarla y dejar que siga subiendo.
- Elige el tipo que describa el problema: `TypeError` si el tipo es malo, `ValueError` si el tipo es bueno pero el valor no.

---

## Excepciones propias y encadenadas {: .topic-title }

Para los errores de tu aplicación, crea tu propia excepción heredando de `Exception`. Así quien use tu código puede capturar *tus* errores sin tragarse los demás.

```python
# custom.py
class PromptError(Exception):
    """Error base de nuestro cliente."""


class PromptTooLongError(PromptError):
    def __init__(self, length, limit):
        super().__init__(f"el prompt tiene {length} caracteres y el límite es {limit}")
        self.length = length
        self.limit = limit


def check_prompt(text, limit=20):
    if len(text) > limit:
        raise PromptTooLongError(len(text), limit)
    return text


try:
    check_prompt("Este prompt es demasiado largo para el límite")
except PromptTooLongError as error:
    print(error, error.length, error.limit)

try:
    check_prompt("x" * 50)
except PromptError as error:
    print(type(error).__name__, isinstance(error, Exception))
```

```text
el prompt tiene 45 caracteres y el límite es 20 45 20
PromptTooLongError True
```

La sintaxis de `class` y `super().__init__` se explica en el [pilar de objetos](../../../05-objetos/index.md); aquí basta con copiar la forma. Lo importante: la clase hija `PromptTooLongError` se captura también con la madre `PromptError`.

Y cuando conviertes un error en otro, conserva la causa original con `raise ... from`:

```python
# chaining.py
import json

def parse_reply(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError as error:
        raise ValueError("la respuesta del modelo no es JSON válido") from error

try:
    parse_reply("no soy json")
except ValueError as error:
    print(error)
    print("causa:", type(error.__cause__).__name__)
```

```text
la respuesta del modelo no es JSON válido
causa: JSONDecodeError
```

El traceback mostrará los dos errores encadenados, lo que ayuda a depurar.

---

## EAFP y LBYL {: .topic-title }

Hay dos filosofías para evitar un error:

- **LBYL** (*look before you leap*, «mira antes de saltar»): comprobar antes con un `if`.
- **EAFP** (*easier to ask forgiveness than permission*, «es más fácil pedir perdón que permiso»): hacerlo y capturar el fallo. Es el estilo habitual en Python.

```python
# eafp.py
from pathlib import Path

settings = {"model": "modelo-demo"}

# LBYL: mirar antes de saltar
if "temperature" in settings:
    temperature = settings["temperature"]
else:
    temperature = 0.7
print(temperature)

# EAFP: pedir perdón en lugar de permiso
try:
    temperature = settings["temperature"]
except KeyError:
    temperature = 0.7
print(temperature)

# con ficheros, EAFP evita la carrera entre "comprobar" y "abrir"
path = Path("data/app.log")
if path.exists():
    text = path.read_text(encoding="utf-8")
try:
    text = path.read_text(encoding="utf-8")
except FileNotFoundError:
    text = ""
print(len(text.splitlines()))
```

```text
0.7
0.7
2
```

Los dos primeros dan lo mismo. Con archivos, EAFP es más seguro: entre el `exists()` y el `read_text()` el archivo puede desaparecer (otro proceso lo borra), y entonces el LBYL falla igual. Capturar el error es la única forma fiable.

!!! tip "No es una regla absoluta"
    Para un diccionario, `settings.get("temperature", 0.7)` es lo más claro. EAFP brilla cuando la comprobación previa es cara o no es fiable (archivos, red, bases de datos).

---

## with como gestor de contexto {: .topic-title }

`with` funciona con cualquier objeto que sepa **entrar** y **salir** de un contexto: al salir, haya error o no, ejecuta su limpieza. Es un `try/finally` empaquetado. Puedes crear el tuyo con `contextlib.contextmanager`:

```python
# ctx.py
import time
from contextlib import contextmanager


@contextmanager
def stopwatch(label):
    start = time.perf_counter()
    print(f"[{label}] empieza")
    try:
        yield
    finally:
        print(f"[{label}] termina ({time.perf_counter() - start:.1f} s)")


with stopwatch("tarea"):
    time.sleep(0.2)

try:
    with stopwatch("falla"):
        raise RuntimeError("algo salió mal")
except RuntimeError as error:
    print("capturado:", error)
```

```text
[tarea] empieza
[tarea] termina (0.2 s)
[falla] empieza
[falla] termina (0.0 s)
capturado: algo salió mal
```

- Lo que va **antes** del `yield` es la entrada; lo que va en el `finally` es la salida.
- El `yield` marca dónde se ejecuta el bloque del `with` (es un generador, como en [Generadores](../../../03-funciones/06-generadores/01-generadores/index.md)).
- Aunque el bloque lance un error, el `finally` se ejecuta y el error sigue subiendo.

Los gestores que ya usas: `open`, `with conn` de SQLite, `closing`, `tempfile.TemporaryDirectory`.

---

## El ejercicio de los apuntes, sin banderas {: .topic-title }

Los apuntes proponen pedir una ruta hasta que sea válida, con una variable `correcto` que se pone a `True`. Con `while True` y `break`, y el `else` del `try`, queda más limpio:

```python
# school_exercise.py
from pathlib import Path

paths = ["data/nope.log", "data/folder", "data/app.log"]
for raw_path in paths:
    try:
        lines = Path(raw_path).read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        print(f"{raw_path}: el archivo no existe")
    except (PermissionError, IsADirectoryError):
        print(f"{raw_path}: es una carpeta o no tienes permisos")
    else:
        print(f"{raw_path}: {len(lines)} líneas")
        break
```

```text
data/nope.log: el archivo no existe
data/folder: es una carpeta o no tienes permisos
data/app.log: 2 líneas
```

(Aquí las rutas vienen de una lista para poder ejecutarlo sin teclado; con `input()` dentro de un `while True` sería igual, como en [while](../../../01-fundamentos/04-bucles/02-while/index.md).) El `except (PermissionError, IsADirectoryError)` agrupa los dos errores que en Windows y en Linux significan lo mismo al abrir una carpeta como archivo.

---

## Python en IA {: .topic-title }

Con modelos, lo normal es que las cosas fallen:

- **Red y límites de uso:** `ConnectionError`, tiempos de espera, respuestas de «demasiadas peticiones». Se reintentan ([Decoradores](../../../03-funciones/05-decoradores/01-decoradores/index.md)).
- **Respuestas mal formadas:** un JSON roto o con campos que faltan → `JSONDecodeError`, `KeyError`.
- **Prompts inválidos:** vacíos, demasiado largos → tus propias excepciones.

Una jerarquía propia (`PromptError` → `PromptTooLongError`...) te permite decidir en un punto qué errores se reintentan, cuáles se muestran al usuario y cuáles abortan.

!!! tip "Captura en la frontera, lanza dentro"
    Las funciones pequeñas lanzan errores concretos. Solo la capa que habla con el usuario (el bucle del chat, la ruta de una web) los captura y decide el mensaje.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `try { } catch (e) { } finally { }` | `try:` / `except Tipo as e:` / `finally:` |
| `catch (e)` captura todo | `except Tipo` captura por tipo |
| Sin `else` en `try` | `else` si no hubo error |
| `throw new Error("x")` | `raise ValueError("x")` |
| `throw e` (relanzar) | `raise` a secas |
| `class MyError extends Error` | `class MyError(Exception)` |
| `new Error("x", { cause: e })` | `raise Error("x") from e` |
| `try/finally` para cerrar recursos | `with` |

!!! tip "Consejos"
    - **Captura el tipo concreto**, no `Exception` por defecto.
    - **`else` para lo que depende de que no haya error**; `finally` para limpiar.
    - **`with` antes que `try/finally`** cuando exista un gestor.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Gestió d'errors — «La sintaxi bàsica» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_600/#1-la-sintaxi-basica> |
| Gestió d'errors — «Capturem diferents tipus d'errors» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_600/#2-capturem-diferents-tipus-derrors-excepcions> |
| Gestió d'errors — «L'estructura completa: else i finally» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_600/#3-lestructura-completa-else-i-finally-opcional> |
| Gestió d'errors — «Exercici pràctic: robustesa en la lectura de logs» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_600/#exercici-practic-robustesa-en-la-lectura-de-logs> |
| **Documentación oficial** | |
| Tutorial — Gestionar excepciones | <https://docs.python.org/3/tutorial/errors.html#handling-exceptions> |
| Tutorial — Lanzar excepciones | <https://docs.python.org/3/tutorial/errors.html#raising-exceptions> |
| Tutorial — Excepciones definidas por el usuario | <https://docs.python.org/3/tutorial/errors.html#user-defined-exceptions> |
| Tutorial — Encadenamiento de excepciones | <https://docs.python.org/3/tutorial/errors.html#exception-chaining> |
| Tutorial — Acciones de limpieza (`finally`) | <https://docs.python.org/3/tutorial/errors.html#defining-clean-up-actions> |
| Jerarquía de excepciones | <https://docs.python.org/3/library/exceptions.html#exception-hierarchy> |
| Glosario — «EAFP» | <https://docs.python.org/3/glossary.html#term-EAFP> |
| Glosario — «LBYL» | <https://docs.python.org/3/glossary.html#term-LBYL> |
| `contextlib.contextmanager` | <https://docs.python.org/3/library/contextlib.html#contextlib.contextmanager> |
| Glosario — «context manager» | <https://docs.python.org/3/glossary.html#term-context-manager> |
