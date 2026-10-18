# HTTP con httpx { .section-python .bloque-python }

> Hablar con una API es mandar peticiones HTTP y leer respuestas, normalmente en JSON. Aquí usas `httpx` (síncrono) contra un servidor simulado en tu propia máquina: estado, cabeceras, JSON, tiempos de espera, errores y reintentos.

---

## Preparar el terreno {: .topic-title }

Python trae `urllib`, pero casi todo el mundo usa **httpx** (o `requests`): más cómodo y moderno. **No es de la biblioteca estándar**: se instala con `pip` en el entorno ([Proyecto y configuración](../../02-proyecto-y-configuracion/01-proyecto-y-configuracion/index.md)).

```bash
python -m pip install httpx
```

Para no depender de internet ni de ninguna API de pago, los ejemplos hablan con un **servidor simulado local** (`chatcli.fake_server`, que verás completo en [el último capítulo del pilar](../../07-python-en-ia/01-cli-de-chat-testeado/index.md)). Se arranca en un hilo, en un puerto libre, y ofrece:

| Ruta | Qué hace |
|---|---|
| `GET /health` | Responde `{"status": "ok"}` |
| `GET /slow` | Tarda 0,5 s en responder |
| `GET /flaky` | Falla con 503 las dos primeras veces |
| `POST /v1/chat` | Pide `Authorization: Bearer <clave>` y un JSON con `messages`; devuelve una respuesta simulada |

---

## GET y la respuesta {: .topic-title }

**1. El script**

```python
# basic_get.py
import httpx

from chatcli.fake_server import start_server, stop_server

server, base_url = start_server()

response = httpx.get(f"{base_url}/health")
print(response.status_code, response.reason_phrase)
print(response.headers["content-type"])
print(response.json())
print(response.text)
print(response.is_success, response.elapsed.total_seconds() < 1)
stop_server(server)
```

**2. Cómo se ejecuta**

```bash
python basic_get.py
```

**3. Qué pasa por dentro.** `httpx.get(url)` abre una conexión, envía la petición y espera la respuesta. El objeto `Response` guarda todo: el **código de estado** (`status_code`), las **cabeceras** (`headers`, que no distinguen mayúsculas), el cuerpo como texto (`.text`) y como datos de Python (`.json()`, que hace el `json.loads` por ti).

**4. La salida**

```text
200 OK
application/json; charset=utf-8
{'status': 'ok'}
{"status": "ok"}
True True
```

Los códigos de estado se agrupan por centenas:

| Código | Significa |
|---|---|
| 2xx (200) | Todo bien |
| 4xx (401, 404, 422, 429) | Error **del que pide** (clave, ruta, datos, demasiadas peticiones) |
| 5xx (500, 503) | Error **del servidor** |

---

## POST con JSON y cabeceras {: .topic-title }

```python
# post_json.py
import httpx

from chatcli.fake_server import VALID_KEY, start_server, stop_server

server, base_url = start_server()
payload = {"model": "modelo-demo", "messages": [{"role": "user", "content": "¿Qué es un token?"}]}

response = httpx.post(
    f"{base_url}/v1/chat",
    json=payload,
    headers={"Authorization": f"Bearer {VALID_KEY}"},
)
print(response.status_code)
data = response.json()
print(data["reply"])
print(data["usage"])
print(response.request.method, response.request.url.path, response.request.headers["content-type"])

bad_key = httpx.post(f"{base_url}/v1/chat", json=payload, headers={"Authorization": "Bearer mala"})
print(bad_key.status_code, bad_key.json())
bad_body = httpx.post(f"{base_url}/v1/chat", content=b"no es json", headers={"Authorization": f"Bearer {VALID_KEY}"})
print(bad_body.status_code, bad_body.json())
missing = httpx.get(f"{base_url}/nada")
print(missing.status_code)
stop_server(server)
```

```text
200
Respuesta simulada a: ¿Qué es un token?
{'input_tokens': 4, 'output_tokens': 5}
POST /v1/chat application/json
401 {'error': 'clave no válida'}
422 {'error': 'petición mal formada'}
404
```

- `json=payload` convierte el diccionario a JSON y pone la cabecera `Content-Type: application/json`.
- La clave va en la cabecera **`Authorization: Bearer <clave>`**, la forma habitual de autenticarse. La clave de este ejemplo es falsa y vive solo en el servidor simulado.
- Un `401` indica que la clave no vale, un `422` que el cuerpo está mal formado y un `404` que la ruta no existe. **Ninguno lanza una excepción**: tú decides qué hacer con el código.
- `response.request` es la petición que se envió, útil para depurar.

!!! warning "Un 4xx o 5xx no es una excepción por defecto"
    `httpx.get(...)` devuelve la respuesta aunque sea un 500. Si no miras `status_code`, tu programa usará un cuerpo de error como si fuera un dato bueno. Llama a **`response.raise_for_status()`** o comprueba `is_success`.

---

## Errores y timeouts {: .topic-title }

```python
# errors.py
import httpx

from chatcli.fake_server import start_server, stop_server

server, base_url = start_server()

response = httpx.get(f"{base_url}/nada")
try:
    response.raise_for_status()
except httpx.HTTPStatusError as error:
    print("HTTPStatusError:", error.response.status_code, error.request.url.path)

try:
    httpx.get(f"{base_url}/slow", timeout=0.1)
except httpx.TimeoutException as error:
    print("TimeoutException:", type(error).__name__)
print(httpx.get(f"{base_url}/slow", timeout=2).json())

stop_server(server)
try:
    httpx.get(base_url + "/health", timeout=4)
except httpx.ConnectError:
    print("ConnectError: no hay nadie escuchando")
except httpx.TransportError as error:
    print("TransportError:", type(error).__name__)

print(issubclass(httpx.ConnectError, httpx.TransportError), issubclass(httpx.TimeoutException, httpx.TransportError), issubclass(httpx.HTTPStatusError, httpx.HTTPError))
print(httpx.Timeout(5.0, connect=2.0))
```

```text
HTTPStatusError: 404 /nada
TimeoutException: ReadTimeout
{'status': 'tarde'}
ConnectError: no hay nadie escuchando
True True True
Timeout(connect=2.0, read=5.0, write=5.0, pool=5.0)
```

| Excepción | Cuándo |
|---|---|
| `HTTPStatusError` | Solo si llamas a `raise_for_status()` y el código es 4xx o 5xx |
| `TimeoutException` (`ConnectTimeout`, `ReadTimeout`...) | La conexión o la respuesta tardó más del límite |
| `ConnectError` | No se pudo conectar (servidor caído, sin red) |
| `TransportError` | La clase madre de los fallos de red y de tiempo |
| `HTTPError` | La clase madre de todas |

- `timeout=0.1` hizo saltar `ReadTimeout`: la ruta `/slow` tarda 0,5 s. Con `timeout=2` funciona.
- `httpx.Timeout(5.0, connect=2.0)` fija límites distintos: conexión, lectura, escritura. **Siempre pon un timeout**: httpx usa 5 segundos por defecto, pero con una API de modelos, que puede tardar decenas de segundos en responder, conviene ajustarlo a conciencia.
- Los fallos de red son `ConnectError`/`TimeoutException`; los del servidor, códigos de estado. Se tratan por separado.

!!! tip "Los tiempos de espera de una API de modelos son largos"
    Un modelo puede tardar bastante en generar una respuesta larga. Un timeout de lectura demasiado corto cortará respuestas válidas; demasiado largo dejará colgado tu programa si el servidor no responde. Elige un valor y mídelo.

---

## Client: reutilizar la configuración {: .topic-title }

Con `httpx.get` / `httpx.post` se abre una conexión nueva cada vez. Un **`httpx.Client`** mantiene la conexión abierta, reutiliza las cabeceras y la URL base, y se cierra con `with`:

```python
# client_demo.py
import httpx

from chatcli.fake_server import VALID_KEY, start_server, stop_server

server, base_url = start_server()

with httpx.Client(
    base_url=base_url,
    headers={"Authorization": f"Bearer {VALID_KEY}"},
    timeout=httpx.Timeout(5.0, connect=2.0),
) as client:
    for question in ["Hola", "¿Qué es un token?"]:
        response = client.post("/v1/chat", json={"messages": [{"role": "user", "content": question}]})
        response.raise_for_status()
        print(response.json()["reply"])
    print(client.get("/health").json())
print(client.is_closed)
stop_server(server)
```

```text
Respuesta simulada a: Hola
Respuesta simulada a: ¿Qué es un token?
{'status': 'ok'}
True
```

La URL base, la clave y el timeout se declaran **una vez**. Las rutas son relativas (`"/v1/chat"`). Al salir del `with`, la conexión se cierra (`is_closed`).

---

## Reintentos {: .topic-title }

Algunos fallos son pasajeros (un 503, un timeout, un 429 de «demasiadas peticiones»). Se reintentan con espera creciente, como el decorador de [Decoradores](../../../03-funciones/05-decoradores/01-decoradores/index.md), pero decidiendo por **código de estado** y por **excepción de red**:

```python
# retry_demo.py
import time

import httpx

from chatcli.fake_server import start_server, stop_server

RETRYABLE_STATUS = {429, 500, 502, 503, 504}

server, base_url = start_server()


def get_with_retry(client, path, max_attempts=4, base_delay=0.1):
    for attempt in range(1, max_attempts + 1):
        try:
            response = client.get(path)
        except (httpx.TimeoutException, httpx.TransportError) as error:
            reason = type(error).__name__
        else:
            if response.status_code not in RETRYABLE_STATUS:
                return response
            reason = f"HTTP {response.status_code}"
        if attempt == max_attempts:
            raise RuntimeError(f"{path}: agotados {max_attempts} intentos ({reason})")
        delay = base_delay * 2 ** (attempt - 1)
        print(f"intento {attempt} falló ({reason}); espero {delay:.1f} s")
        time.sleep(delay)


with httpx.Client(base_url=base_url, timeout=2) as client:
    print(get_with_retry(client, "/flaky").json())
    stop_server(server)
    try:
        get_with_retry(client, "/health", max_attempts=2)
    except RuntimeError as error:
        print(error)
```

```text
intento 1 falló (HTTP 503); espero 0.1 s
intento 2 falló (HTTP 503); espero 0.2 s
{'status': 'ok tras 3 intentos'}
intento 1 falló (ConnectTimeout); espero 0.1 s
/health: agotados 2 intentos (ConnectTimeout)
```

- `/flaky` falla dos veces con 503 y a la tercera responde.
- Después se para el servidor y se prueba otra ruta: el reintento también cubre fallos de red, y al agotar los intentos **se rinde con un error claro**. (En Windows, un puerto sin servidor tarda en rechazar la conexión, por eso aquí salta el tiempo de conexión, `ConnectTimeout`, en vez de `ConnectError`.)
- Solo se reintenta lo que merece la pena. Un `401` o un `422` fallarán igual la siguiente vez; reintentarlos sería inútil.

!!! warning "Reintentar `POST` puede duplicar efectos"
    Reintentar un `GET` es inocuo. Un `POST` que crea algo puede crearlo dos veces si el primero sí llegó. Con APIs de modelos, repetir una petición significa pagarla otra vez.

---

## Python en IA {: .topic-title }

Una API de modelo de lenguaje es, en el fondo, esto: una URL, una cabecera `Authorization`, un `POST` con un JSON (`model`, `messages`, parámetros) y una respuesta JSON (texto, `usage` de tokens). Los SDK oficiales empaquetan este mismo trabajo y añaden tipos, reintentos y streaming ([Llamar a la API de Claude](../../../07-python-para-ia/index.md)).

Puntos que importan en este contexto:

- **Timeouts** generosos pero finitos.
- **Reintentos** solo con 429 / 5xx / red, con espera creciente.
- **El código de estado** manda: un 429 pide frenar, un 401 pide revisar la clave, un 400 pide corregir la petición.
- **Nunca registrar la cabecera `Authorization`.**

!!! tip "Un servidor local para desarrollar"
    Probar contra un servidor simulado (que devuelve errores a propósito) es gratis, rápido y repetible. Es la base de los tests del [pilar siguiente](../../05-tests/01-pytest/index.md).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python (httpx) |
|---|---|
| `fetch(url)` | `httpx.get(url)` |
| `await res.json()` | `response.json()` |
| `fetch(url, { method: "POST", body: JSON.stringify(x) })` | `httpx.post(url, json=x)` |
| `res.ok` | `response.is_success` |
| `fetch` no lanza con un 404 | `httpx` tampoco; `raise_for_status()` lanza |
| `AbortController` + `setTimeout` | `timeout=...` |
| Todo es asíncrono | Síncrono por defecto; hay `AsyncClient` ([Asincronía](../../04-asincronia/01-async-await/index.md)) |
| `axios.create({ baseURL, headers })` | `httpx.Client(base_url=..., headers=...)` |

!!! tip "Consejos"
    - **`Client` con `with`** para varias peticiones.
    - **`raise_for_status()`** antes de usar el cuerpo.
    - **Timeout siempre explícito.**

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso menciona las APIs (en la introducción) pero no enseña peticiones HTTP | — |
| Introducció — «Per què Python i no només Bash?» (mención de las APIs) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_000/> |
| **Documentación oficial** | |
| httpx — Inicio rápido | <https://www.python-httpx.org/quickstart/> |
| httpx — Clientes | <https://www.python-httpx.org/advanced/clients/> |
| httpx — Timeouts | <https://www.python-httpx.org/advanced/timeouts/> |
| httpx — Excepciones | <https://www.python-httpx.org/exceptions/> |
| httpx en PyPI | <https://pypi.org/project/httpx/> |
| `http.server` (servidor de ejemplo) | <https://docs.python.org/3/library/http.server.html#http.server.ThreadingHTTPServer> |
