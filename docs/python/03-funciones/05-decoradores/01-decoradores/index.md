# Decoradores { .section-python .bloque-python }

> Un decorador es una función que recibe otra función y devuelve una versión mejorada, sin tocar su código. Aquí construyes uno desde cero, aprendes `wraps`, y haces los dos que más se usan con APIs: un cronómetro y un reintento con espera creciente.

---

## Qué es un decorador {: .topic-title }

Un **decorador** envuelve una función con código extra que se ejecuta antes y después: registrar la llamada, medir el tiempo, comprobar permisos... Los apuntes de la escuela lo explican con la imagen del envoltorio. Mecánicamente es lo que ya viste: un **closure** que recibe una función y devuelve otra, y un `*args, **kwargs` para reenviar todo ([\*args y \*\*kwargs](../../02-args-y-kwargs/01-args-y-kwargs/index.md)).

**1. El script**

```python
# first.py
def log_call(function):
    def wrapper(*args, **kwargs):
        print(f"[LOG] llamando a {function.__name__} con {args} {kwargs}")
        result = function(*args, **kwargs)
        print(f"[LOG] {function.__name__} devolvió {result!r}")
        return result
    return wrapper


@log_call
def build_prompt(question, system_prompt="Eres breve."):
    return f"{system_prompt} | {question}"


print(build_prompt("¿Qué es un token?", system_prompt="Responde en una frase."))

def build_prompt_plain(question):
    return question
build_prompt_plain = log_call(build_prompt_plain)
build_prompt_plain("hola")
```

**2. Cómo se ejecuta**

```bash
python first.py
```

**3. Qué pasa por dentro.** `@log_call` encima del `def` es **azúcar sintáctico** para esto: definir `build_prompt` y después `build_prompt = log_call(build_prompt)`. El segundo ejemplo, escrito a mano, lo demuestra. `log_call` recibe la función original, define `wrapper` (que la llama con todos los argumentos, y escribe antes y después) y **devuelve `wrapper`**. A partir de ahí, `build_prompt` ya no es la original: es `wrapper`, que lleva la original dentro.

**4. La salida**

```text
[LOG] llamando a build_prompt con ('¿Qué es un token?',) {'system_prompt': 'Responde en una frase.'}
[LOG] build_prompt devolvió 'Responde en una frase. | ¿Qué es un token?'
Responde en una frase. | ¿Qué es un token?
[LOG] llamando a build_prompt_plain con ('hola',) {}
[LOG] build_prompt_plain devolvió 'hola'
```

Lo que escribes dentro de `wrapper` antes de la llamada se ejecuta **antes**; lo de después, **después**. La función original no se ha tocado.

---

## functools.wraps {: .topic-title }

Hay un efecto secundario: como `build_prompt` ahora es `wrapper`, pierde su nombre y su docstring. Los decoradores del curso no lo evitan; la solución estándar es `functools.wraps`.

```python
# wraps_demo.py
from functools import wraps


def without_wraps(function):
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper


def with_wraps(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper


@without_wraps
def first():
    """Docstring de first."""


@with_wraps
def second():
    """Docstring de second."""


print(first.__name__, first.__doc__)
print(second.__name__, second.__doc__)
```

```text
wrapper None
second Docstring de second.
```

`@wraps(function)` copia el nombre, el docstring y otros datos de la original al `wrapper`. Sin él, `help()`, los mensajes de error y los logs mostrarían `wrapper` en lugar del nombre real.

!!! warning "Un decorador sin `wraps` rompe la información de la función"
    Es la omisión más común. Pon `@wraps(function)` encima del `wrapper` en **todos** tus decoradores.

---

## Un cronómetro con perf_counter {: .topic-title }

El decorador de tiempo de los apuntes usa `time.time()`. Para medir **duraciones**, lo correcto es `time.perf_counter()`: es un reloj monótono (no salta hacia atrás si el sistema cambia la hora) y de mayor resolución. `time.time()` es el reloj de pared: sirve para saber *qué hora es*, no para medir cuánto ha tardado algo.

```python
# timer.py
import time
from functools import wraps


def timer(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return function(*args, **kwargs)
        finally:
            elapsed = time.perf_counter() - start
            print(f"[TIEMPO] {function.__name__} tardó {elapsed:.1f} s")
    return wrapper


@timer
def slow_task(seconds):
    time.sleep(seconds)
    return "listo"


print(slow_task(0.3))
```

```text
[TIEMPO] slow_task tardó 0.3 s
listo
```

- El `try/finally` hace que el tiempo se **imprima siempre**, aunque la función falle.
- El `return` dentro del `try` entrega el valor y, antes de salir, se ejecuta el `finally`.
- El tiempo exacto cambia entre ejecuciones; con `time.sleep(0.3)` sale `0.3 s` redondeado a un decimal.

---

## Decoradores con argumentos {: .topic-title }

Si quieres escribir `@repeat(times=3)`, necesitas **una capa más**: una función que recibe los argumentos y devuelve el decorador de verdad.

```python
# args_decorator.py
from functools import wraps


def repeat(times):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                results.append(function(*args, **kwargs))
            return results
        return wrapper
    return decorator


@repeat(times=3)
def say(text):
    return text.upper()


print(say("hola"))
print(say.__name__)
```

```text
['HOLA', 'HOLA', 'HOLA']
say
```

Tres niveles: `repeat(times)` → `decorator(function)` → `wrapper(*args, **kwargs)`. Primero se ejecuta `repeat(times=3)`, que devuelve `decorator`; después ese `decorator` recibe la función. Si te pierdes, escribe el `@` a mano: `say = repeat(times=3)(say)`.

---

## Reintentos con espera creciente {: .topic-title }

Las llamadas a una API fallan por motivos pasajeros: una caída de red, un límite de uso. La estrategia habitual es **reintentar esperando cada vez más** (*exponential backoff*): 0,1 s, 0,2 s, 0,4 s... Es perfecto para un decorador con argumentos. Aquí la llamada falla a propósito, sin ninguna API real.

```python
# retry.py
import time
from functools import wraps


def retry(max_attempts=3, base_delay=0.1):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return function(*args, **kwargs)
                except ConnectionError as error:
                    if attempt == max_attempts:
                        print(f"[RETRY] intento {attempt}/{max_attempts} fallido, me rindo")
                        raise
                    delay = base_delay * 2 ** (attempt - 1)
                    print(f"[RETRY] intento {attempt}/{max_attempts} fallido ({error}); espero {delay:.1f} s")
                    time.sleep(delay)
        return wrapper
    return decorator


calls = {"count": 0}


@retry(max_attempts=4, base_delay=0.1)
def flaky_call(prompt):
    calls["count"] += 1
    if calls["count"] < 3:
        raise ConnectionError("servidor no disponible")
    return f"respuesta a {prompt!r} tras {calls['count']} llamadas"


print(flaky_call("Hola"))


@retry(max_attempts=2, base_delay=0.1)
def always_fails():
    raise ConnectionError("caído")


try:
    always_fails()
except ConnectionError as error:
    print(f"error final: {error}")
```

```text
[RETRY] intento 1/4 fallido (servidor no disponible); espero 0.1 s
[RETRY] intento 2/4 fallido (servidor no disponible); espero 0.2 s
respuesta a 'Hola' tras 3 llamadas
[RETRY] intento 1/2 fallido (caído); espero 0.1 s
[RETRY] intento 2/2 fallido, me rindo
error final: caído
```

- La función falla dos veces, y a la tercera responde. Las esperas se duplican: `base_delay * 2 ** (attempt - 1)`.
- Solo se reintenta ante `ConnectionError` (el error esperado). Cualquier otro error **no** se captura y sube directamente.
- En el último intento, `raise` (sin nada) **vuelve a lanzar** el mismo error, para que lo vea quien llamó.

!!! warning "Reintenta solo lo que tenga sentido reintentar"
    Un fallo de red o de límite de uso es pasajero. Un error por un prompt mal formado fallará siempre, y reintentarlo solo gasta tiempo y dinero. Captura excepciones concretas, nunca `except Exception` a ciegas, y pon siempre un máximo de intentos.

---

## Decoradores que ya existen {: .topic-title }

Los apuntes citan `@functools.lru_cache` bajo un apartado de «control de acceso y autenticación». Es una confusión: `lru_cache` no tiene que ver con permisos, es una **caché** que recuerda los resultados de llamadas ya hechas.

```python
# cache.py
from functools import lru_cache

calls = []

@lru_cache(maxsize=128)
def expensive(word):
    calls.append(word)
    return word.upper()

print(expensive("a"), expensive("a"), expensive("b"))
print(calls)
print(expensive.cache_info())
```

```text
A A B
['a', 'b']
CacheInfo(hits=1, misses=2, maxsize=128, currsize=2)
```

La segunda llamada con `"a"` no ejecutó la función: se sirvió desde la caché (`hits=1`). Los argumentos tienen que ser hashables. Y cuando apilas decoradores, se aplican **de abajo hacia arriba** (`@a` sobre `@b` decora primero con `b`).

!!! tip "Muchos decoradores vienen hechos"
    `@lru_cache`, y en el pilar de objetos `@property`, `@staticmethod` y `@dataclass`, son decoradores. Los frameworks web (`@app.route(...)`) los usan para registrar funciones.

---

## Python en IA {: .topic-title }

Los decoradores resuelven las preocupaciones «transversales» de una llamada a un modelo sin ensuciar la función:

- **`@retry`** para fallos pasajeros y límites de uso.
- **`@timer`** para medir cuánto tarda cada petición.
- **`@lru_cache`** para no pagar dos veces por la misma consulta (por ejemplo, el mismo embedding).
- **Registro de tokens y de costes** en cada llamada.

En el [capítulo final del pilar](../../07-python-en-ia/01-cliente-de-prompts/index.md) se usan `@timer` y `@retry` juntos.

!!! tip "El decorador se apila con la función, no la ensucia"
    La función `send_prompt` solo sabe enviar. El reintento y el cronómetro se añaden con dos líneas encima. Si mañana no los quieres, las quitas.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| Función de orden superior que envuelve otra (`withRetry(fn)`) | Lo mismo, con sintaxis `@` |
| Decoradores de clases y métodos (según versión y herramienta) | `@decorador` estándar, para funciones y clases |
| `const wrapped = withRetry(fn)` | `fn = retry(fn)` o `@retry` |
| Se pierde `fn.name` al envolver | Se pierde `__name__`: se arregla con `@wraps` |
| `performance.now()` | `time.perf_counter()` |
| `setTimeout`-based backoff | `time.sleep(delay)` |

!!! tip "Consejos"
    - **`@wraps` siempre.**
    - **`perf_counter` para medir, `time.time()` solo para la hora.**
    - **Si no entiendes un decorador con argumentos, expande los `@`** a llamadas normales.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Decoradors (@) en Python — «Què és un decorador?» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_902/#1-que-es-un-decorador> |
| Decoradors (@) en Python — «On ens trobarem els decoradors?» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_902/#2-on-ens-trobarem-els-decoradors> |
| Decoradors (@) en Python — «Creem el nostre primer decorador» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_902/#3-creem-el-nostre-primer-decorador> |
| **Documentación oficial** | |
| Glosario — «decorator» | <https://docs.python.org/3/glossary.html#term-decorator> |
| Referencia — Definiciones de funciones (decoradores) | <https://docs.python.org/3/reference/compound_stmts.html#function-definitions> |
| `functools.wraps` | <https://docs.python.org/3/library/functools.html#functools.wraps> |
| `functools.lru_cache` | <https://docs.python.org/3/library/functools.html#functools.lru_cache> |
| `time.perf_counter` | <https://docs.python.org/3/library/time.html#time.perf_counter> |
| `time.sleep` | <https://docs.python.org/3/library/time.html#time.sleep> |
| PEP 318 — Decoradores para funciones y métodos | <https://peps.python.org/pep-0318/> |
