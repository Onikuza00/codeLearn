# Generadores { .section-python .bloque-python }

> Un generador es una función que entrega sus valores uno a uno con `yield`, y se queda en pausa entre uno y otro. Sirve para recorrer datos grandes sin cargarlos y para simular algo que llega poco a poco, como el streaming de un modelo.

---

## yield: una función que se pausa {: .topic-title }

Una función normal ejecuta su cuerpo de golpe y termina con `return`. Una función con **`yield`** es un **generador**: al llamarla no ejecuta nada, devuelve un objeto generador. Cada vez que pides un valor, corre hasta el siguiente `yield`, entrega ese valor y **se queda en pausa** recordando dónde iba.

**1. El script**

```python
# basic.py
def count_down(start):
    print("empieza")
    while start > 0:
        yield start
        start -= 1
    print("termina")


generator = count_down(3)
print(type(generator))
print(next(generator))
print(next(generator))
print(next(generator))
try:
    next(generator)
except StopIteration:
    print("StopIteration: no quedan valores")

for number in count_down(2):
    print("recibido", number)
print(list(count_down(3)))
```

**2. Cómo se ejecuta**

```bash
python basic.py
```

**3. Qué pasa por dentro.** `count_down(3)` crea el generador sin ejecutar el cuerpo (por eso no aparece «empieza» al crearlo). Cada `next(generator)` ejecuta hasta el siguiente `yield`. El primero imprime «empieza» y entrega 3. El segundo reanuda justo después del `yield`, resta 1 y entrega 2. Cuando no quedan más `yield`, el cuerpo termina y Python lanza **`StopIteration`**, la señal de «ya no hay más».

**4. La salida**

```text
<class 'generator'>
empieza
3
2
1
termina
StopIteration: no quedan valores
empieza
recibido 2
recibido 1
termina
empieza
termina
[3, 2, 1]
```

Un `for` (y `list(...)`) llama a `next` por ti y se detiene en `StopIteration` sin que lo veas. La diferencia clave con una lista: los valores **no existen hasta que se piden**.

!!! warning "Un generador se gasta"
    Se recorre una sola vez. Si lo recorres de nuevo, sale vacío. Para otra pasada, vuelve a llamar a la función generadora.

---

## Iteradores {: .topic-title }

Un **iterable** es algo que se puede recorrer con un `for` (listas, textos, diccionarios...). Un **iterador** es el objeto que lleva la cuenta de por dónde vas y entrega el siguiente valor con `next`. `iter(iterable)` te da su iterador.

```python
# iterators.py
numbers = [10, 20]
iterator = iter(numbers)
print(next(iterator), next(iterator))
try:
    next(iterator)
except StopIteration:
    print("fin")

print(iter(numbers) is numbers, iter(iterator) is iterator)

generator = (n for n in range(3))
print(iter(generator) is generator)
for _ in range(2):
    print(list(generator))
```

```text
10 20
fin
False True
True
[0, 1, 2]
[]
```

- Una lista es un iterable, pero **no** es su propio iterador: `iter(numbers)` crea uno nuevo cada vez, por eso se puede recorrer varias veces.
- Un iterador **sí** es su propio iterador (`iter(iterator) is iterator`): se gasta. Los generadores son iteradores.
- La expresión generadora `(n for n in range(3))` es un generador, y por eso la segunda `list` sale vacía (la [expresión generadora](../../../02-estructuras-de-datos/04-comprensiones/02-comprensiones-dict-set-generadores/index.md#expresiones-generadoras) es la versión corta de este capítulo).

`enumerate`, `zip`, `map`, `filter` y `range` (este último de otra manera) siguen todos este protocolo.

---

## Perezosos y baratos en memoria {: .topic-title }

Como un generador produce los valores bajo demanda, nunca guarda la colección entera:

```python
# lazy.py
import sys

def numbers_up_to(limit):
    number = 0
    while number < limit:
        yield number
        number += 1

as_list = list(range(1_000_000))
as_generator = numbers_up_to(1_000_000)
print(sys.getsizeof(as_list) > 1_000_000, sys.getsizeof(as_generator) < 300)
print(sum(as_generator))

def first_match(lines, word):
    for line in lines:
        print("miro:", line)
        if word in line:
            return line

print(first_match(iter(["uno", "dos tokens", "tres"]), "tokens"))

def read_lines(texts):
    for text in texts:
        print("leo:", text)
        yield text.strip()

lines = read_lines(["  a ", " b "])
print(next(lines))
```

```text
True True
499999500000
miro: uno
miro: dos tokens
dos tokens
leo:   a 
a
```

- El generador ocupa unos pocos cientos de bytes sin importar cuántos valores vaya a entregar; la lista de un millón, más de un megabyte.
- Con datos que llegan de uno en uno (líneas de un archivo grande, filas de una base de datos), un generador procesa cada elemento y lo descarta: **memoria constante**.
- `read_lines` solo ha «leído» la primera línea cuando pides el primer valor: la segunda ni se toca.

!!! tip "Cuándo generador y cuándo lista"
    Generador si recorres **una vez** y los datos son grandes o infinitos. Lista si necesitas recorrer varias veces, usar índices o saber el tamaño.

---

## yield from {: .topic-title }

`yield from otro` entrega uno a uno todos los valores de otro iterable o generador. Evita escribir un bucle solo para reenviar.

```python
# yield_from.py
def numbers():
    yield 1
    yield 2

def letters():
    yield "a"
    yield "b"

def both():
    yield from numbers()
    yield from letters()
    yield from ["x", "y"]

print(list(both()))

def total_with_return():
    yield 1
    yield 2
    return "fin"

def wrapper():
    result = yield from total_with_return()
    yield f"retorno: {result}"

print(list(wrapper()))
```

```text
[1, 2, 'a', 'b', 'x', 'y']
[1, 2, 'retorno: fin']
```

- `both()` junta tres fuentes: dos generadores y una lista.
- Un generador también puede tener `return valor`; con `yield from`, ese valor queda disponible como resultado de la expresión (`result`). Es un uso avanzado que verás poco.

---

## Simular el streaming de un modelo {: .topic-title }

Los modelos de lenguaje pueden responder en **streaming**: en vez de esperar a la respuesta completa, van llegando trozos de texto. Un generador es la forma natural de representarlo. Aquí lo simulamos con pausas, sin ninguna API.

```python
# stream.py
import time


def stream_reply(text, delay=0.05):
    for word in text.split():
        time.sleep(delay)
        yield word + " "


print("Bot: ", end="")
full_reply = ""
for chunk in stream_reply("Un token es un trozo de texto que el modelo procesa."):
    print(chunk, end="", flush=True)
    full_reply += chunk
print()
print(len(full_reply.split()), "palabras recibidas")
```

```text
Bot: Un token es un trozo de texto que el modelo procesa. 
11 palabras recibidas
```

- `stream_reply` entrega un trozo (una palabra) cada 50 ms. En la terminal las palabras aparecen una a una, como en un chat real.
- `print(chunk, end="", flush=True)`: `end=""` evita el salto de línea y `flush=True` fuerza que se muestre ya (si no, la terminal puede acumular).
- El que consume decide qué hacer con cada trozo: mostrarlo, acumularlo (`full_reply`), contarlo...

!!! warning "Si no recorres el generador, no pasa nada"
    Crear `stream_reply(...)` sin hacer `for` ni `next` no ejecuta ni una línea. Es un fallo frecuente: llamar al generador y no consumirlo.

---

## Python en IA {: .topic-title }

- **Streaming de respuestas:** los SDK de modelos ofrecen la respuesta como un flujo de trozos que se recorre con un `for`. El patrón del ejemplo anterior es el mismo que usarás con uno real.
- **Procesar documentos grandes** línea a línea o por trozos, sin cargar el archivo entero.
- **Lotes (batches):** un generador que entrega listas de N elementos para enviarlos al modelo por tandas.
- **Pipelines:** encadenar generadores (leer, limpiar, trocear) donde cada paso procesa un elemento cada vez.

!!! tip "Acumula mientras muestras"
    En un streaming, enseña cada trozo en cuanto llega **y** guarda una copia del texto completo (`full_reply += chunk`). Al final necesitarás la respuesta entera para el historial.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `function* gen() { yield 1; }` | `def gen(): yield 1` (sin asterisco) |
| `gen.next()` devuelve `{ value, done }` | `next(gen)` devuelve el valor o lanza `StopIteration` |
| `for (const x of gen())` | `for x in gen():` |
| `yield* otro()` | `yield from otro()` |
| `for await (const chunk of stream)` (streams asíncronos) | `for chunk in stream` (síncrono) o `async for` ([pilar 06](../../../06-ecosistema/index.md)) |
| Iteradores con `Symbol.iterator` | Protocolo `__iter__` / `__next__` |

!!! tip "Consejos"
    - **Nombra los generadores como una colección** (`read_lines`, `stream_reply`): se usan en un `for`.
    - **`list(gen)` solo si de verdad necesitas la lista entera.**
    - **No lo recorras dos veces:** se gasta.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye generadores ni `yield` | — |
| **Documentación oficial** | |
| Tutorial — Iteradores | <https://docs.python.org/3/tutorial/classes.html#iterators> |
| Tutorial — Generadores | <https://docs.python.org/3/tutorial/classes.html#generators> |
| Referencia — Expresiones `yield` | <https://docs.python.org/3/reference/expressions.html#yield-expressions> |
| Referencia — La sentencia `yield` | <https://docs.python.org/3/reference/simple_stmts.html#the-yield-statement> |
| Glosario — «generator» | <https://docs.python.org/3/glossary.html#term-generator> |
| Glosario — «iterator» | <https://docs.python.org/3/glossary.html#term-iterator> |
| `next()` | <https://docs.python.org/3/library/functions.html#next> |
| PEP 380 — `yield from` | <https://peps.python.org/pep-0380/> |
