# async y await { .section-python .bloque-python }

> La asincronía permite lanzar varias esperas a la vez (peticiones de red, sobre todo) en lugar de una detrás de otra. Aquí aprendes `async`, `await`, `asyncio.run`, `gather`, `AsyncClient`, los límites de concurrencia y cuándo NO merece la pena.

---

## Corrutinas y asyncio.run {: .topic-title }

Cuando haces una petición de red, tu programa se queda **esperando**: no calcula nada, solo espera la respuesta. Con 10 peticiones seguidas, esperas 10 veces. La **asincronía** permite que, mientras una espera, otra avance. Lo hace **en un solo hilo**: cada tarea cede el control cuando se pone a esperar.

Dos palabras clave:

- **`async def`** define una **corrutina**: una función que puede pausarse.
- **`await`** dice «espera a esto; mientras, deja que otras tareas avancen». Solo se puede escribir dentro de un `async def`.

**1. El script**

```python
# basics.py
import asyncio
import time


async def fetch(name, seconds):
    print(f"{name}: empiezo")
    await asyncio.sleep(seconds)
    print(f"{name}: termino")
    return name.upper()


async def main():
    coroutine = fetch("a", 0.1)
    print(type(coroutine).__name__)
    print(await coroutine)

    start = time.perf_counter()
    results = await asyncio.gather(fetch("x", 0.3), fetch("y", 0.3), fetch("z", 0.3))
    print(results, f"{time.perf_counter() - start:.1f} s")


asyncio.run(main())
```

**2. Cómo se ejecuta**

```bash
python basics.py
```

**3. Qué pasa por dentro.** Llamar a `fetch("a", 0.1)` **no ejecuta nada**: devuelve un objeto corrutina (como un generador sin arrancar). Hay que **esperarlo** con `await` o entregárselo al *bucle de eventos* (*event loop*), el motor que va saltando entre tareas. **`asyncio.run(main())`** crea ese bucle, ejecuta `main` y lo cierra. Es el único punto de entrada. **`asyncio.gather(...)`** lanza varias corrutinas a la vez y devuelve la lista de resultados, **en el mismo orden** en que las pasaste.

**4. La salida**

```text
coroutine
a: empiezo
a: termino
A
x: empiezo
y: empiezo
z: empiezo
x: termino
y: termino
z: termino
['X', 'Y', 'Z'] 0.3 s
```

Tres tareas de 0,3 s han tardado 0,3 s en total, no 0,9: las tres esperaron **a la vez**. Fíjate en el orden de los mensajes: empiezan las tres antes de que termine ninguna.

`asyncio.sleep` es la versión asíncrona de `time.sleep`: **cede** el control. La versión normal bloquearía todo.

!!! warning "Olvidar `await`: la corrutina no se ejecuta"
    ```python
    # forgot_await.py
    import asyncio


    async def fetch():
        return 42


    async def main():
        result = fetch()
        print(type(result).__name__, result == 42)
        print(await fetch())


    asyncio.run(main())
    ```

    ```text
    RuntimeWarning: coroutine 'fetch' was never awaited
    coroutine False
    42
    ```

    `result` no es `42`: es una corrutina sin ejecutar. Python avisa con un `RuntimeWarning` (el aviso aparece por la salida de errores).

---

## Peticiones en paralelo {: .topic-title }

La ventaja real: varias peticiones de red a la vez. `httpx.AsyncClient` es la versión asíncrona de `httpx.Client` ([HTTP con httpx](../../03-http/01-http-con-httpx/index.md)); sus métodos se esperan con `await`, y se usa con `async with`.

```python
# sync_vs_async.py
import asyncio
import time

import httpx

from chatcli.fake_server import VALID_KEY, start_server, stop_server

server, base_url = start_server()
HEADERS = {"Authorization": f"Bearer {VALID_KEY}"}
QUESTIONS = ["Hola", "¿Qué es un token?", "¿Qué es un embedding?", "¿Qué es RAG?"]


def body(question):
    return {"messages": [{"role": "user", "content": question}]}


start = time.perf_counter()
with httpx.Client(base_url=base_url, headers=HEADERS) as client:
    sync_replies = [client.post("/v1/chat", json=body(q)).json()["reply"] for q in QUESTIONS]
sync_time = time.perf_counter() - start


async def ask(client, question):
    response = await client.post("/v1/chat", json=body(question))
    return response.json()["reply"]


async def main():
    async with httpx.AsyncClient(base_url=base_url, headers=HEADERS) as client:
        return await asyncio.gather(*(ask(client, q) for q in QUESTIONS))


start = time.perf_counter()
async_replies = asyncio.run(main())
async_time = time.perf_counter() - start

print(sync_replies == async_replies)
print(async_replies[1])
print(f"secuencial: ~{sync_time:.1f} s | concurrente: ~{async_time:.1f} s")
stop_server(server)
```

```text
True
Respuesta simulada a: ¿Qué es un token?
secuencial: ~1.4 s | concurrente: ~0.6 s
```

- Cada petición al servidor simulado tarda al menos 0,2 s. Seguidas, los tiempos se **suman** (1,4 s medidos en total, con la apertura de conexiones). Concurrentes, se **solapan** (0,6 s).
- Las respuestas son **las mismas** y en el mismo orden (`True`): `gather` conserva el orden.
- `gather(*(... for q in QUESTIONS))`: el `*` esparce la comprensión (generador) como argumentos ([Desempaquetado](../../../02-estructuras-de-datos/05-desempaquetado/01-desempaquetado/index.md)).
- Los tiempos varían por máquina; lo que importa es la proporción.

---

## Errores, timeouts y límites {: .topic-title }

```python
# errors_gather.py
import asyncio


async def work(name, fail=False):
    await asyncio.sleep(0.05)
    if fail:
        raise ValueError(f"{name} falló")
    return f"{name} ok"


async def main():
    try:
        await asyncio.gather(work("a"), work("b", fail=True), work("c"))
    except ValueError as error:
        print("gather lanza:", error)

    results = await asyncio.gather(work("a"), work("b", fail=True), work("c"), return_exceptions=True)
    print(results)
    for result in results:
        if isinstance(result, Exception):
            print("error recogido:", result)

    try:
        async with asyncio.timeout(0.1):
            await asyncio.sleep(1)
    except TimeoutError:
        print("TimeoutError: tardó demasiado")


asyncio.run(main())
```

```text
gather lanza: b falló
['a ok', ValueError('b falló'), 'c ok']
error recogido: b falló
TimeoutError: tardó demasiado
```

- Por defecto, si una tarea de `gather` falla, el error **sale** (`gather lanza`). Las otras siguen en marcha, pero pierdes sus resultados.
- Con **`return_exceptions=True`**, el error se **devuelve en la lista** como un valor más y tú lo revisas. Es lo habitual cuando quieres que un fallo no estropee el resto.
- **`asyncio.timeout(segundos)`** corta lo que esté dentro del bloque si tarda más.

Lanzar 1000 peticiones a la vez suele ser mala idea: la API te limitará (429). Con un **semáforo** se limita cuántas corren simultáneamente:

```python
# limit.py
import asyncio
import time

active = 0
peak = 0


async def call(number, semaphore):
    global active, peak
    async with semaphore:
        active += 1
        peak = max(peak, active)
        await asyncio.sleep(0.1)
        active -= 1
    return number


async def main():
    semaphore = asyncio.Semaphore(3)
    start = time.perf_counter()
    results = await asyncio.gather(*(call(n, semaphore) for n in range(9)))
    print(results)
    print("máximo simultáneo:", peak, f"| {time.perf_counter() - start:.1f} s")


asyncio.run(main())
```

```text
[0, 1, 2, 3, 4, 5, 6, 7, 8]
máximo simultáneo: 3 | 0.3 s
```

Nueve tareas de 0,1 s con un máximo de 3 a la vez: 3 tandas, 0,3 s. (Este ejemplo usa `global` para contar; ya sabes por qué conviene evitarlo en código real: [Scope y closures](../../../03-funciones/01-funciones-basicas/03-scope-y-closures/index.md).)

---

## Cuándo sí y cuándo no {: .topic-title }

La asincronía ayuda cuando el programa **espera** (red, base de datos, disco lento). No ayuda cuando **calcula**: una tarea que consume CPU no cede el control.

```python
# blocking.py
import asyncio
import time


async def ticker():
    for _ in range(3):
        await asyncio.sleep(0.1)
        print("tic")


async def bad():
    time.sleep(0.5)


async def main():
    task = asyncio.create_task(ticker())
    start = time.perf_counter()
    await bad()
    print(f"bad() bloqueó {time.perf_counter() - start:.1f} s sin dejar correr a ticker")
    await task


asyncio.run(main())
```

```text
bad() bloqueó 0.5 s sin dejar correr a ticker
tic
tic
tic
```

`time.sleep` (o cualquier llamada bloqueante) dentro de una corrutina **congela todo el bucle**: `ticker` no pudo avanzar hasta que `bad()` terminó.

| Situación | Mejor |
|---|---|
| Una petición, o varias en serie | Síncrono (`httpx.Client`): más simple |
| Muchas peticiones independientes | Asíncrono (`AsyncClient` + `gather`) |
| Cálculo pesado | Procesos (`multiprocessing`), no `async` |
| Librería que solo ofrece versión síncrona | Hilos (`asyncio.to_thread`) o síncrono |

!!! warning "El `async` se contagia"
    Una función que usa `await` debe ser `async`, y quien la llama también (o usar `asyncio.run`). Mezclar mundos síncrono y asíncrono en el mismo programa complica el diseño: elige un estilo por parte del programa.

---

## Python en IA {: .topic-title }

La asincronía encaja de lleno en IA:

- **Muchas peticiones a un modelo** (resumir 50 documentos, evaluar 200 preguntas): `gather` con un `Semaphore` de 5-10 las acelera sin pasarse del límite.
- **Servidores web** que atienden a varios usuarios a la vez mientras esperan al modelo.
- **Streaming** de respuestas (con `async for` sobre el flujo).

Los SDK de los proveedores ofrecen un cliente síncrono y otro asíncrono (`AsyncClient`).

!!! tip "Semáforo y reintentos van de la mano"
    Un `Semaphore` evita saturar el servicio; reintentos con espera creciente absorben los 429 que aun así lleguen. Con las dos medidas, una evaluación grande es estable.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `async function f()` | `async def f()` |
| `await promesa` | `await corrutina` |
| Llamar a una `async function` ejecuta hasta el primer `await` | Llamar a una corrutina **no ejecuta nada** hasta que se espera |
| `Promise.all([a, b])` | `asyncio.gather(a, b)` |
| `Promise.allSettled` | `gather(..., return_exceptions=True)` |
| El motor ya tiene un bucle de eventos | Hay que arrancarlo: `asyncio.run(main())` |
| `fetch` es asíncrono siempre | Hay `Client` y `AsyncClient` |
| `await` de nivel superior (módulos ES) | Dentro de `async def` + `asyncio.run` |

!!! tip "Consejos"
    - **Un único `asyncio.run(main())`** en el punto de entrada.
    - **`gather` + `Semaphore`** para muchas peticiones.
    - **Nada bloqueante dentro de `async def`.**

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye programación asíncrona | — |
| **Documentación oficial** | |
| `asyncio` | <https://docs.python.org/3/library/asyncio.html> |
| Corrutinas y tareas | <https://docs.python.org/3/library/asyncio-task.html#coroutines> |
| `asyncio.run` | <https://docs.python.org/3/library/asyncio-runner.html#asyncio.run> |
| `asyncio.gather` | <https://docs.python.org/3/library/asyncio-task.html#asyncio.gather> |
| `asyncio.timeout` | <https://docs.python.org/3/library/asyncio-task.html#asyncio.timeout> |
| `asyncio.create_task` | <https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task> |
| `asyncio.Semaphore` | <https://docs.python.org/3/library/asyncio-sync.html#asyncio.Semaphore> |
| httpx — Soporte asíncrono | <https://www.python-httpx.org/async/> |
