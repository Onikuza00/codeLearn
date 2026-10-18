# logging { .section-python .bloque-python }

> `logging` es la forma seria de dejar rastro de lo que hace tu programa: con niveles de gravedad, hora, nombre y destino configurables. Aquí sustituyes los `print` de depuración por registros que puedes encender, apagar y guardar en un archivo.

---

## Niveles {: .topic-title }

Un **log** (registro) es un historial de lo que ha pasado en el programa. A diferencia de `print`, cada mensaje lleva un **nivel** de gravedad, y tú decides desde qué nivel quieres verlos.

**1. El script**

```python
# levels.py
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
logger = logging.getLogger("client")

logger.debug("detalle interno (no se ve con INFO)")
logger.info("enviando petición")
logger.warning("respuesta lenta")
logger.error("la petición ha fallado")
logger.critical("sin conexión")
print(logging.getLevelName(logging.WARNING), logging.WARNING, logging.DEBUG, logging.CRITICAL)
```

**2. Cómo se ejecuta**

```bash
python levels.py
```

**3. Qué pasa por dentro.** `basicConfig` configura el registro una vez: nivel mínimo y formato. `getLogger("client")` obtiene un *logger* con nombre. Cada método (`debug`, `info`...) emite un mensaje de ese nivel; solo salen los de nivel igual o superior al configurado. Por defecto los mensajes van a la **salida de error** (`stderr`), no a la salida normal.

**4. La salida**

```text
INFO:client:enviando petición
WARNING:client:respuesta lenta
ERROR:client:la petición ha fallado
CRITICAL:client:sin conexión
WARNING 30 10 50
```

El `debug` no aparece porque el nivel mínimo es `INFO`.

| Nivel | Valor | Cuándo |
|---|---|---|
| `DEBUG` | 10 | Detalle para depurar |
| `INFO` | 20 | Lo normal: «hice esto» |
| `WARNING` | 30 | Algo raro, pero sigue (es el nivel por defecto) |
| `ERROR` | 40 | Algo ha fallado |
| `CRITICAL` | 50 | El programa no puede continuar |

!!! warning "Por defecto no ves `info` ni `debug`"
    Sin configurar, solo salen `WARNING` y superiores. Si tu `logger.info(...)` no imprime nada, falta `basicConfig(level=logging.INFO)`.

---

## Formato y archivo {: .topic-title }

El formato decide qué datos lleva cada línea (hora, nivel, nombre...). Con `filename=` los registros van a un archivo en vez de a la terminal.

```python
# format_file.py
import logging
from pathlib import Path

log_path = Path("logs/client.log")
log_path.unlink(missing_ok=True)

logging.basicConfig(
    filename=log_path,
    encoding="utf-8",
    level=logging.DEBUG,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("client")
logger.info("cliente iniciado")
logger.debug("modelo=%s temperatura=%.1f", "modelo-demo", 0.2)
logger.warning("reintento %d de %d", 2, 3)

print(log_path.read_text(encoding="utf-8"))
```

```text
14:05:25 | INFO     | client | cliente iniciado
14:05:25 | DEBUG    | client | modelo=modelo-demo temperatura=0.2
14:05:25 | WARNING  | client | reintento 2 de 3
```

(La hora cambia en cada ejecución.)

- `%(asctime)s`, `%(levelname)s`, `%(name)s`, `%(message)s` son marcadores del formato; `-8s` alinea el nivel en 8 espacios.
- `encoding="utf-8"` también aquí, para que los acentos no se rompan.
- Los argumentos van **aparte**: `logger.debug("modelo=%s ...", valor)`. Es el estilo del módulo `logging`, y tiene una ventaja:

```python
# lazy.py
import logging

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger("client")

class Expensive:
    def __str__(self):
        print("(se ha formateado)")
        return "datos"

logger.debug("valor: %s", Expensive())
logger.debug(f"valor: {Expensive()}")
print("fin")
```

```text
(se ha formateado)
fin
```

Con `%s` y argumentos, el texto **solo se construye si el mensaje se va a mostrar**. Con una f-string se construye siempre, aunque el nivel lo descarte (por eso sale «se ha formateado» una vez, la de la f-string). Con textos grandes, como prompts, importa.

---

## Registrar errores {: .topic-title }

Dentro de un `except`, `logger.exception(...)` registra el mensaje con nivel `ERROR` **y el traceback completo**. Es la forma correcta de dejar constancia de un fallo sin detener el programa.

```python
# exception.py
import logging
import json

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
logger = logging.getLogger("client")

try:
    json.loads("no es json")
except json.JSONDecodeError:
    logger.exception("no pude leer la respuesta")

try:
    json.loads("{")
except json.JSONDecodeError as error:
    logger.error("JSON inválido: %s", error)
logger.info("sigue funcionando")
```

```text
ERROR | no pude leer la respuesta
Traceback (most recent call last):
  File "...\exception.py", line 9, in <module>
    json.loads("no es json")
    ...
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
ERROR | JSON inválido: Expecting property name enclosed in double quotes: line 1 column 2 (char 1)
INFO | sigue funcionando
```

- `exception()` incluye el traceback. Úsalo **solo dentro de un `except`**.
- `error(...)` con el mensaje de la excepción ocupa una línea: suficiente cuando el traceback no aporta.
- El programa continúa ("sigue funcionando").

---

## Varios destinos y jerarquía {: .topic-title }

Para mandar los mensajes a **varios sitios con niveles distintos** (la terminal solo ve lo importante, el archivo guarda todo), se usan *handlers*:

```python
# both.py
import logging
import sys

logger = logging.getLogger("client")
logger.setLevel(logging.DEBUG)

console = logging.StreamHandler(sys.stdout)
console.setLevel(logging.INFO)
console.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))

file_handler = logging.FileHandler("logs/both.log", mode="w", encoding="utf-8")
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(logging.Formatter("%(levelname)s | %(name)s | %(message)s"))

logger.addHandler(console)
logger.addHandler(file_handler)

logger.debug("solo va al archivo")
logger.info("va a los dos")
file_handler.close()
print("--- archivo ---")
print(open("logs/both.log", encoding="utf-8").read())
```

```text
INFO: va a los dos
--- archivo ---
DEBUG | client | solo va al archivo
INFO | client | va a los dos

```

Los nombres con puntos forman una **jerarquía**: `client.http` es hijo de `client` y hereda su configuración, pero puede cambiarla:

```python
# hierarchy.py
import logging

logging.basicConfig(level=logging.INFO, format="%(name)s | %(message)s")
logging.getLogger("client").info("raíz del cliente")
logging.getLogger("client.http").info("hijo hereda la configuración")
logging.getLogger("client.http").setLevel(logging.WARNING)
logging.getLogger("client.http").info("este ya no se ve")
logging.getLogger("client.http").warning("este sí")
```

```text
client | raíz del cliente
client.http | hijo hereda la configuración
client.http | este sí
```

!!! tip "Un logger por módulo"
    La convención es `logger = logging.getLogger(__name__)` al principio de cada archivo (el nombre de cada módulo, [Módulos y paquetes](../../../06-ecosistema/index.md)). Quien use tu código configura el logging **una vez**, en el punto de entrada.

---

## Python en IA {: .topic-title }

El registro es lo que te permite saber qué pasó en una conversación que ya terminó:

- **Cada petición:** modelo, número de mensajes, tokens de entrada y salida, tiempo que tardó.
- **Los reintentos y errores**, con su traceback.
- **Costes acumulados.**

!!! warning "No registres secretos ni datos personales"
    Los prompts y respuestas pueden contener datos de personas, y las peticiones llevan claves de API. Nunca escribas una clave en un log; y piensa dos veces antes de guardar prompts completos. Si lo haces, protege el archivo y define cuánto tiempo se conserva.

!!! tip "`DEBUG` para el prompt completo, `INFO` para el resumen"
    Registra el prompt entero en `DEBUG` (solo cuando investigas) y en `INFO` solo un resumen: modelo, tamaño, tiempo.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `console.log` / `console.error` | `logger.info` / `logger.error` |
| `console.debug` | `logger.debug` |
| Librerías externas (`winston`, `pino`) | `logging` ya viene con Python |
| Niveles según la librería | `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL` |
| `console.error(err.stack)` | `logger.exception("...")` |
| `LOG_LEVEL` por variable de entorno | `logging.basicConfig(level=...)` |

!!! tip "Consejos"
    - **`logging` en lugar de `print`** en cualquier programa que vaya a durar.
    - **Argumentos con `%s`**, no f-strings.
    - **`logger.exception` dentro de `except`.**

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye `logging` (solo escribe líneas de log a mano en un archivo) | — |
| Fitxers de text pla — «Escriptura de fitxers de text» (log escrito a mano con `a`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#escriptura-de-fitxers-de-text> |
| **Documentación oficial** | |
| Módulo `logging` | <https://docs.python.org/3/library/logging.html> |
| `logging.basicConfig` | <https://docs.python.org/3/library/logging.html#logging.basicConfig> |
| Niveles de logging | <https://docs.python.org/3/library/logging.html#logging-levels> |
| Atributos de `LogRecord` (formato) | <https://docs.python.org/3/library/logging.html#logrecord-attributes> |
| `Logger.exception` | <https://docs.python.org/3/library/logging.html#logging.Logger.exception> |
| Guía básica de logging (HOWTO) | <https://docs.python.org/3/howto/logging.html#logging-basic-tutorial> |
| Guía — Registrar en un archivo | <https://docs.python.org/3/howto/logging.html#logging-to-a-file> |
| `FileHandler` | <https://docs.python.org/3/library/logging.handlers.html#logging.FileHandler> |
