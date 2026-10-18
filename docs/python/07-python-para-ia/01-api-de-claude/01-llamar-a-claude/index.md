# Llamar a la API de Claude { .section-python .bloque-python }

> El SDK oficial de Anthropic para Python convierte una petición a la API de Claude en una llamada a `messages.create`. Aquí instalas el SDK, envías tu primer mensaje, lees la respuesta y el consumo de tokens, recibes el texto en streaming, manejas errores y límites, y das el primer paso con herramientas (tool use).

!!! warning "Cómo se ha validado este capítulo"
    Cuando se escribió, **no había una `ANTHROPIC_API_KEY` en el entorno**, así que **ninguna llamada de este capítulo se ha hecho a la API real**. El código se ha ejecutado con el SDK oficial (`anthropic` 1.15.0) contra un **servidor local que imita el formato de la Messages API** (en [el capítulo final del pilar](../../06-python-en-ia/01-rag-de-documentos-propios/index.md) se explica cómo). Eso valida que el código se construye, se envía y se interpreta bien. **Los textos de respuesta que ves son los del servidor simulado («Respuesta simulada a: ...»), no de Claude.** Los nombres de modelo, parámetros y comportamientos se han contrastado con la documentación oficial.

---

## Instalar y autenticar {: .topic-title }

El SDK oficial es un paquete de terceros: se instala con `pip` dentro del entorno virtual ([Entorno: venv y pip](../../../01-fundamentos/01-inicio/02-entorno-venv-pip/index.md)).

```bash
python -m pip install anthropic
```

La clave de API se crea en la consola de Anthropic y se entrega al programa por la **variable de entorno `ANTHROPIC_API_KEY`**. El cliente sin argumentos la lee solo:

```python
import anthropic

client = anthropic.Anthropic()
```

Es el patrón de [Proyecto y configuración](../../../06-ecosistema/02-proyecto-y-configuracion/01-proyecto-y-configuracion/index.md): la clave vive en el entorno o en un `.env` (que no se sube a Git) y **nunca en el código**. Con `python-dotenv`, `load_dotenv()` antes de crear el cliente.

!!! warning "Nunca pegues una clave en el código, en un test ni en un log"
    Una clave publicada se puede usar (y cobrar) por otra persona. Si se filtra, hay que revocarla en la consola y crear otra. En los ejemplos de este capítulo se usa una clave falsa, `clave-falsa-de-prueba`, que solo vale para el servidor local.

!!! info "El SDK 1.x usa `httpx2`"
    Desde la versión 1.0, el SDK se apoya en el paquete `httpx2` y no en `httpx`. Si pasas tu propio cliente HTTP (un proxy, por ejemplo), tiene que ser de `httpx2`. Para el uso normal, no hace falta que lo sepas.

---

## Tu primera llamada {: .topic-title }

**1. El script**

```python
# basic.py
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1024,
    system="Eres un asistente breve. Responde en español.",
    messages=[{"role": "user", "content": "¿Qué es un token?"}],
    output_config={"effort": "low"},
)

print(response.stop_reason)
for block in response.content:
    if block.type == "text":
        print(block.text)
print(response.usage.input_tokens, response.usage.output_tokens)
print(response.model, response.id)
```

**2. Cómo se ejecuta** (con `ANTHROPIC_API_KEY` definida)

```bash
python basic.py
```

**3. Qué pasa por dentro.** `client.messages.create(...)` hace un `POST /v1/messages` (el mismo que hiciste a mano con `httpx` en [HTTP con httpx](../../../06-ecosistema/03-http/01-http-con-httpx/index.md)) con el JSON que le describes, y devuelve un objeto `Message` ya validado y con tipos. Los parámetros:

| Parámetro | Qué es |
|---|---|
| `model` | El identificador del modelo, exacto: `claude-sonnet-5-5`, `claude-opus-5-5`, `claude-haiku-5-5`... **sin sufijo de fecha** |
| `max_tokens` | Máximo de tokens que puede generar. Obligatorio |
| `system` | El system prompt, **aparte** de la lista de mensajes (no es un mensaje más) |
| `messages` | La conversación: lista de diccionarios con `role` (<code>"user"</code> o <code>"assistant"</code>) y `content` |
| `output_config={"effort": ...}` | Cuánto «esfuerzo» dedica el modelo: `low`, `medium`, `high`, `xhigh`, `max` |

**4. La salida.** Con el servidor simulado local (**no es la respuesta del modelo real**):

```text
end_turn
Respuesta simulada a: ¿Qué es un token?
25 12
claude-sonnet-5-5 msg_simulado_001
```

- **`stop_reason`** dice por qué terminó: `end_turn` (acabó), `max_tokens` (se cortó), `tool_use` (pide una herramienta), `refusal`...
- **`content`** es una **lista de bloques**, no un texto. Cada bloque tiene un `type` (`text`, `tool_use`, `thinking`...). Por eso se recorre y se comprueba `block.type == "text"` antes de leer `block.text`.
- **`usage`** da los tokens de entrada y de salida: es lo que se factura. Los precios por millón de tokens están en la tabla de modelos de la documentación.
- **`id`** y `response._request_id` identifican la petición: guárdalos en los logs para reclamar o depurar.

!!! tip "Qué modelo elegir"
    En el momento de escribir esto, los identificadores vigentes son `claude-fable-5-1` (el más capaz), `claude-opus-5-5`, `claude-sonnet-5-5` (equilibrio entre velocidad e inteligencia) y `claude-haiku-5-5` (el más rápido y barato), con ventana de contexto de 1M tokens. Los precios y los modelos cambian: consulta siempre la [tabla oficial de modelos](https://platform.claude.com/docs/en/about-claude/models/overview) y pon el modelo en la **configuración** (`CHAT_MODEL`), no en el código.

---

## La temperatura ya no se pasa así {: .topic-title }

En los ejemplos con servidores simulados de los pilares anteriores usabas un parámetro `temperature`. Con los modelos actuales de Claude y con el SDK 1.x **ese parámetro ya no existe**:

```python
# temperature.py
import anthropic

client = anthropic.Anthropic()
client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=100,
    temperature=0.2,
    messages=[{"role": "user", "content": "Hola"}],
)
```

```text
TypeError: Messages.create() got an unexpected keyword argument 'temperature'
```

- El SDK 1.x ha quitado `temperature`, `top_p` y `top_k` de la firma de `messages.create`: es un `TypeError` **antes de enviar nada**.
- Además, la documentación de los modelos recientes avisa de que **enviar `temperature`, `top_p` o `top_k` con un valor no predeterminado devuelve un error 400** (es el caso de Claude Sonnet 5.5; otros modelos recientes, como Claude Opus 5.5, ni siquiera lo aceptan).
- La palanca para controlar «cuánto piensa» y «cuánto gasta» el modelo ahora es **`output_config={"effort": ...}`**. `low` para tareas sencillas y rápidas, `high` para razonar más.

!!! warning "Un parámetro de ejemplo no es un parámetro real"
    `temperature` sigue existiendo en otras APIs y en modelos más antiguos. Antes de copiar un parámetro de un tutorial, comprueba que el modelo y la versión del SDK que usas lo aceptan.

---

## Conversación y system prompt {: .topic-title }

La API **no recuerda nada** entre peticiones: en cada llamada envías la conversación completa en `messages`. Es lo que hace `Conversation.to_api()` de [Modelar una conversación](../../../05-objetos/06-python-en-ia/01-modelar-una-conversacion/index.md), con una diferencia: el system prompt va en el parámetro `system`, no como primer mensaje.

```python
history = [
    {"role": "user", "content": "Me llamo Ana."},
    {"role": "assistant", "content": "Encantado, Ana."},
]
response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1024,
    system="Eres un asistente breve.",
    messages=[*history, {"role": "user", "content": "¿Cómo me llamo?"}],
    output_config={"effort": "low"},
)
```

Los roles de `messages` son `user` y `assistant`. Dos mensajes seguidos del mismo rol se combinan en un solo turno, y el primero debe ser de `user`.

---

## Streaming {: .topic-title }

Una respuesta larga puede tardar. Con **streaming**, los trozos de texto llegan según se generan, como el generador que simulaste en [Generadores](../../../03-funciones/06-generadores/01-generadores/index.md). Es lo recomendable para respuestas largas (evita tiempos de espera) y para mostrar texto al usuario enseguida.

```python
# streaming.py
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "¿Qué es un embedding?"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()

print()
print(final.stop_reason, final.usage.output_tokens)
print(final.content[0].text)
```

Salida con el servidor simulado:

```text
Respuesta simulada a: ¿Qué es un embedding? 
end_turn 7
Respuesta simulada a: ¿Qué es un embedding? 
```

- `client.messages.stream(...)` es un gestor de contexto (`with`), como `open`.
- **`stream.text_stream`** es un generador de trozos de texto.
- **`stream.get_final_message()`** devuelve el mensaje completo ya montado, con `stop_reason` y `usage`. Si no necesitas ir mostrando trozos, puedes llamar solo a esto.
- Acumula lo que vas mostrando si necesitas el texto entero después.

---

## Errores, límites y reintentos {: .topic-title }

El SDK **reintenta solo** los errores pasajeros (fallos de conexión, 408, 409, 429 y 5xx) con espera creciente, **2 veces por defecto**, y respeta la cabecera `retry-after` cuando existe. Se cambia con `max_retries` (`0` lo desactiva). Lo que no se reintenta (400, 401, 403, 404) sale como excepción, y se capturan de lo concreto a lo general:

```python
# errors.py
import anthropic


def attempt(client):
    try:
        response = client.messages.create(
            model="claude-sonnet-5-5",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hola"}],
        )
    except anthropic.AuthenticationError as error:
        print(f"AuthenticationError {error.status_code} {error.type}")
    except anthropic.RateLimitError as error:
        print(f"RateLimitError {error.status_code} retry-after={error.response.headers.get('retry-after')}")
    except anthropic.APIStatusError as error:
        print(f"APIStatusError {error.status_code}")
    except anthropic.APIConnectionError:
        print("Sin conexión con la API")
    else:
        print("OK:", response.content[0].text)
```

Probado contra el servidor simulado, con cuatro comportamientos distintos:

```text
bad_key: AuthenticationError 401 authentication_error
rate_limit: RateLimitError 429 retry-after=0
overloaded_then_ok: OK tras 3 llamadas -> Respuesta simulada a: Hola
overloaded_then_ok: APIStatusError 529
```

- Una **clave inválida** (401) falla a la primera: reintentar no la arreglaría.
- Un **429** (`RateLimitError`) con `max_retries=1` se reintentó una vez y acabó saliendo como excepción.
- Un **529** (servicio sobrecargado) que se resuelve a la tercera: con `max_retries=3` el SDK lo absorbe (3 llamadas, sin que lo notes); con `max_retries=0` sale como `APIStatusError 529`.

| Código | `anthropic.*` | Qué hacer |
|---|---|---|
| 400 | `BadRequestError` | La petición es incorrecta: corrígela (también salta al gastar el límite de gasto) |
| 401 / 403 | `AuthenticationError` / `PermissionDeniedError` | Revisa la clave y los permisos |
| 404 | `NotFoundError` | Modelo o ruta inexistente |
| 429 | `RateLimitError` | Límite de uso: espera (`retry-after`) y baja el ritmo |
| 5xx / 529 | `APIStatusError` | Fallo o saturación del servicio: reintenta |
| sin red | `APIConnectionError` | Comprueba la conexión |

También hay que mirar el `stop_reason` aunque no haya excepción:

```python
# stop_reason.py
response = client.messages.create(model="claude-sonnet-5-5", max_tokens=20, messages=[{"role": "user", "content": "Cuéntame algo largo"}])
print(response.stop_reason)
if response.stop_reason == "max_tokens":
    print("Respuesta cortada: sube max_tokens o usa streaming")
```

```text
max_tokens
Respuesta cortada: sube max_tokens o usa streaming
```

(El servidor simulado devolvió `max_tokens` para forzar el caso.) Otro `stop_reason` a vigilar es `refusal`: el modelo declinó la petición por seguridad, y entonces `response.stop_details` explica la categoría.

!!! tip "Registra el `_request_id`"
    `response._request_id` (público, aunque lleve guion bajo) identifica la petición en los sistemas de Anthropic. Guárdalo en el log junto al modelo y los tokens ([logging](../../../04-ficheros-y-errores/04-errores/02-logging/index.md)).

---

## Herramientas: el primer paso {: .topic-title }

Con **tool use** describes funciones de tu programa y Claude decide cuándo pedirte que las ejecutes. **Claude no ejecuta nada**: devuelve un bloque `tool_use` con el nombre y los argumentos; tú ejecutas la función y le devuelves el resultado en un bloque `tool_result`.

```python
# tools.py
import json

import anthropic

OFFERS = [
    {"title": "Frontend Developer", "city": "Madrid"},
    {"title": "Backend Developer", "city": "Barcelona"},
    {"title": "Data Analyst", "city": "Madrid"},
]

tools = [
    {
        "name": "search_offers",
        "description": "Busca ofertas de empleo por ciudad y devuelve sus títulos.",
        "input_schema": {
            "type": "object",
            "properties": {"city": {"type": "string", "description": "Ciudad, por ejemplo Madrid"}},
            "required": ["city"],
        },
    }
]


def search_offers(city):
    return [offer["title"] for offer in OFFERS if offer["city"].lower() == city.lower()]


client = anthropic.Anthropic()
messages = [{"role": "user", "content": "¿Qué ofertas hay en Madrid?"}]
while True:
    response = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024, tools=tools, messages=messages)
    messages.append({"role": "assistant", "content": response.content})
    if response.stop_reason != "tool_use":
        break
    results = []
    for block in response.content:
        if block.type == "tool_use":
            print("Claude pide:", block.name, block.input)
            found = search_offers(**block.input)
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": json.dumps(found, ensure_ascii=False)})
    messages.append({"role": "user", "content": results})

print(response.content[0].text)
print(len(messages), [m["role"] for m in messages])
```

Con el servidor simulado, que pide la herramienta en la primera vuelta y responde en la segunda:

```text
Claude pide: search_offers {'city': 'Madrid'}
En Madrid hay 2 ofertas: Frontend Developer y Data Analyst.
4 ['user', 'assistant', 'user', 'assistant']
```

El **bucle**:

1. Envías la pregunta y la lista de herramientas (nombre, descripción en lenguaje natural y `input_schema`, un JSON Schema).
2. Si `stop_reason == "tool_use"`, Claude pide una o varias herramientas en bloques `tool_use` (con un `id` y un `input`).
3. Ejecutas **tu** función con `block.input` y devuelves el resultado en un mensaje de `user` con bloques `tool_result` que repiten el `tool_use_id`.
4. Repites hasta que `stop_reason` sea `end_turn`.

- Se añade a `messages` el `response.content` completo del asistente (los bloques, no solo el texto): la API necesita ver sus propios `tool_use`.
- **Todos los `tool_result` de una misma vuelta van en un solo mensaje.**
- Los argumentos son datos del modelo: **valídalos** (con Pydantic, [Pydantic](../../../05-objetos/05-pydantic/01-pydantic/index.md)) antes de usarlos, y nunca ejecutes ni construyas SQL o rutas con ellos sin comprobarlos.

El SDK ofrece además un ayudante, el *tool runner* (en beta), que automatiza este bucle a partir de funciones con decorador; el bucle manual de arriba es la base que conviene entender primero.

!!! warning "Un modelo puede pedir una herramienta que no existe o con argumentos erróneos"
    Si el nombre no está en tu diccionario de herramientas, o si `block.input` no cumple tu esquema, devuelve un `tool_result` con `"is_error": True` explicando el problema, en lugar de romper el programa.

---

## Python en IA {: .topic-title }

Todo lo que viste en los pilares anteriores se aplica aquí:

- **Configuración** (`Settings`) con el modelo y la clave por entorno.
- **Validación** de la respuesta con Pydantic si le pides JSON.
- **Reintentos** y tiempos de espera: ya los gestiona el SDK, y puedes añadir tu propio nivel por encima.
- **Tests** sin red: sustituye el cliente por un objeto falso (el `Protocol` `LLM` del capítulo final) o apunta `base_url` a un servidor local.
- **Coste**: guarda `usage` de cada llamada; es lo que se factura.

!!! tip "Una función `complete(system, user) -> str` como frontera"
    Envuelve la llamada al SDK en una clase pequeña con un solo método. El resto de tu programa depende de esa interfaz, no del SDK: así puedes cambiar de modelo, de proveedor o de simulación sin tocar nada más (es lo que hace `ClaudeLLM` en el capítulo final).

!!! info "Qué es criterio propio y no está en la documentación"
    El patrón de envolver el SDK en una interfaz, los consejos de logging y de validación, y la comparación con JavaScript son criterio propio. Lo que sí viene de la documentación oficial: los identificadores de modelo, el funcionamiento de `messages.create`, `usage`, `stop_reason`, el streaming, los reintentos automáticos del SDK (2 por defecto), las excepciones, el bucle de `tool_use` y la retirada de `temperature`. Las salidas de este capítulo son del servidor simulado, no de la API.

---

## Comparación con JavaScript {: .topic-title }

| En JS (`@anthropic-ai/sdk`) | En Python (`anthropic`) |
|---|---|
| `new Anthropic()` | `anthropic.Anthropic()` |
| `await client.messages.create({ ... })` | `client.messages.create(...)` (o `AsyncAnthropic` con `await`) |
| `max_tokens`, `system`, `messages` | Los mismos nombres |
| `for await (const e of stream)` | `for text in stream.text_stream` |
| `err instanceof Anthropic.RateLimitError` | `except anthropic.RateLimitError` |
| `process.env.ANTHROPIC_API_KEY` | `ANTHROPIC_API_KEY` leída por el cliente |
| Cliente asíncrono siempre | Cliente síncrono y `AsyncAnthropic` ([Asincronía](../../../06-ecosistema/04-asincronia/01-async-await/index.md)) |

!!! tip "Consejos"
    - **Modelo, esfuerzo y `max_tokens` en la configuración.**
    - **Recorre `response.content` por tipo de bloque**, no accedas a `content[0].text`.
    - **Guarda `usage` y `_request_id`** de cada llamada.
    - **Streaming para respuestas largas**, y `max_tokens` generoso.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye la API de ningún modelo de lenguaje (en la introducción solo menciona que Python sirve para conectar con APIs) | — |
| **Documentación oficial** | |
| Anthropic — Empezar (primera llamada a la API) | <https://platform.claude.com/docs/en/get-started> |
| Anthropic — Modelos (identificadores, precios, contexto) | <https://platform.claude.com/docs/en/about-claude/models/overview> |
| Anthropic — Claude Sonnet 5.5 (parámetros de muestreo no admitidos) | <https://platform.claude.com/docs/en/models/sonnet-5-5/overview> |
| Anthropic — Parámetro `effort` | <https://platform.claude.com/docs/en/build-with-claude/effort> |
| Anthropic — Streaming | <https://platform.claude.com/docs/en/build-with-claude/streaming> |
| Anthropic — Errores de la API | <https://platform.claude.com/docs/en/api/errors> |
| Anthropic — Límites de uso | <https://platform.claude.com/docs/en/api/rate-limits> |
| Anthropic — Tool use (visión general) | <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview> |
| SDK de Python (repositorio) | <https://github.com/anthropics/anthropic-sdk-python> |
| `anthropic` en PyPI | <https://pypi.org/project/anthropic/> |
