# Guardar conversaciones { .section-python .bloque-python }

> Un historial de chat que sobrevive entre ejecuciones: se guarda en JSON de forma segura, cada mensaje se registra también en SQLite y todo lo que falla deja rastro en el log. Une ficheros, formatos, base de datos y errores del pilar, sin llamar a ninguna API.

---

## Qué vamos a construir {: .topic-title }

El cliente de prompts del [pilar 03](../../../03-funciones/07-python-en-ia/01-cliente-de-prompts/index.md) olvida todo al terminar. Aquí le damos memoria:

1. **Cargar** el historial al empezar (si existe).
2. **Guardarlo** en JSON, con escritura segura.
3. **Registrar** cada mensaje en una tabla SQLite.
4. **Manejar los fallos**: archivo ausente, JSON dañado, estructura incorrecta.
5. **Dejar rastro** con `logging`.

| Pieza | Capítulo |
|---|---|
| Rutas desde el script | [pathlib](../../01-rutas-y-ficheros/01-pathlib/index.md) |
| `open`, `with`, `encoding` | [open y with](../../01-rutas-y-ficheros/02-open-y-with/index.md) |
| `json.load` / `json.dump` | [JSON](../../02-formatos/02-json/index.md) |
| Tabla de mensajes | [sqlite3](../../03-sqlite/01-sqlite3/index.md) |
| `try/except`, excepción propia | [Excepciones](../../04-errores/01-excepciones/index.md) |
| Niveles y mensajes | [logging](../../04-errores/02-logging/index.md) |

---

## El script completo {: .topic-title }

**1. El script**

```python
# chat_store.py
import json
import logging
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
JSON_PATH = DATA_DIR / "conversation.json"
DB_PATH = DATA_DIR / "chat.db"

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s | %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("chat_store")


class StoreError(Exception):
    """No se pudo guardar o cargar la conversación."""


def load_conversation(path=JSON_PATH):
    try:
        with open(path, encoding="utf-8") as file:
            conversation = json.load(file)
    except FileNotFoundError:
        logger.info("no hay historial previo, empiezo uno nuevo")
        return {"messages": []}
    except json.JSONDecodeError as error:
        backup = path.with_suffix(".broken")
        path.replace(backup)
        logger.error("historial dañado (%s); lo guardo como %s", error.msg, backup.name)
        return {"messages": []}
    if "messages" not in conversation:
        raise StoreError(f"el archivo {path.name} no tiene la clave 'messages'")
    logger.info("historial cargado: %d mensajes", len(conversation["messages"]))
    return conversation


def save_conversation(conversation, path=JSON_PATH):
    path.parent.mkdir(exist_ok=True)
    temporary = path.with_suffix(".tmp")
    try:
        with open(temporary, "w", encoding="utf-8") as file:
            json.dump(conversation, file, ensure_ascii=False, indent=2)
        temporary.replace(path)
    except (OSError, TypeError) as error:
        logger.exception("no se pudo guardar el historial")
        raise StoreError("fallo al guardar") from error
    logger.info("historial guardado (%d mensajes)", len(conversation["messages"]))


def log_to_database(role, content, db_path=DB_PATH):
    with closing(sqlite3.connect(db_path)) as conn:
        with conn:
            conn.execute("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, role TEXT NOT NULL, content TEXT NOT NULL)")
            conn.execute("INSERT INTO messages (role, content) VALUES (?, ?)", (role, content))


def count_in_database(db_path=DB_PATH):
    with closing(sqlite3.connect(db_path)) as conn:
        return conn.execute("SELECT COUNT(*) FROM messages").fetchone()[0]


conversation = load_conversation()
for role, content in [("user", "¿Qué es un token?"), ("assistant", "Un trozo de texto que el modelo procesa.")]:
    conversation["messages"].append({"role": role, "content": content})
    log_to_database(role, content)
save_conversation(conversation)
print("en la base de datos:", count_in_database(), "mensajes")
```

**2. Cómo se ejecuta**, dos veces seguidas, y una tercera con el archivo dañado a propósito:

```bash
python chat_store.py
python chat_store.py
```

**3. Qué pasa por dentro:**

- **`DATA_DIR = Path(__file__).parent / "data"`**: las rutas parten del script, no del directorio de trabajo.
- **`StoreError`**: una excepción propia para los fallos de almacenamiento. Quien use el módulo captura una sola clase.
- **`load_conversation`** distingue tres casos: no existe (historial nuevo, `INFO`), JSON dañado (se **aparta** el archivo como `.broken` para no perderlo, se registra un `ERROR` y se empieza de cero) y estructura incorrecta (se lanza `StoreError`, porque no sabemos qué hacer con eso).
- **`save_conversation`** escribe primero en un archivo `.tmp` y solo al terminar lo **sustituye** con `replace`. Si algo falla a mitad, el historial anterior sigue intacto. Los errores de disco o de tipos (`OSError`, `TypeError`) se registran con `logger.exception` (con traceback) y se relanzan como `StoreError ... from error`.
- **`log_to_database`** abre la conexión con `closing`, usa `with conn` para la transacción y pasa los valores con `?`.
- **`logging`** con `stream=sys.stdout` y un formato sin hora (para que la salida sea reproducible); en un programa real añadirías `%(asctime)s`.
- El bloque final **usa** todo: carga, añade dos mensajes (guardándolos también en SQLite), guarda y cuenta.

**4. La salida**: primera ejecución, segunda, y tercera con el archivo roto (`{"messages": [`):

```text
INFO | no hay historial previo, empiezo uno nuevo
INFO | historial guardado (2 mensajes)
en la base de datos: 2 mensajes
---
INFO | historial cargado: 2 mensajes
INFO | historial guardado (4 mensajes)
en la base de datos: 4 mensajes
--- archivo dañado
ERROR | historial dañado (Expecting value); lo guardo como conversation.broken
INFO | historial guardado (2 mensajes)
en la base de datos: 6 mensajes
```

Con un JSON válido pero sin la clave `messages` (`{"otra": 1}`) falla con la excepción propia:

```text
StoreError: el archivo conversation.json no tiene la clave 'messages'
```

Observa la ejecución con el archivo dañado: el historial en JSON empieza de cero (2 mensajes), pero la base de datos **conserva** todo (6 mensajes). Son dos almacenes con propósitos distintos: el JSON es el estado de la conversación; SQLite, el registro permanente.

!!! warning "Escribir encima del archivo es peligroso"
    Si `save_conversation` hiciera `open(path, "w")` directamente y el programa se cayera a mitad, el archivo quedaría vacío o a medias. Escribir en un temporal y hacer `replace` evita ese riesgo.

!!! warning "No tragues el error de un JSON dañado"
    Empezar de cero sin avisar y sobrescribir el archivo roto destruye la evidencia. Aquí se aparta como `.broken` y se avisa en el log.

---

## Python en IA {: .topic-title }

Una conversación con un modelo es **estado**: los mensajes anteriores se reenvían en cada petición. Persistirla permite:

- **Reanudar** una conversación después de cerrar el programa.
- **Auditar** qué se envió y qué se respondió (y cuánto costó).
- **Reproducir** un fallo: con el historial guardado puedes repetir exactamente la misma petición.
- **Crear datasets** de ejemplos reales para evaluar (se retoma en el [pilar 07](../../../07-python-para-ia/index.md)).

!!! tip "JSON para el estado, SQLite para el histórico"
    Un archivo JSON por conversación es fácil de leer y de versionar. Cuando necesites buscar entre muchas conversaciones, contar tokens por día o filtrar por usuario, una tabla SQL lo hace en una consulta.

!!! warning "Datos personales"
    Los historiales pueden contener información de personas. Decide qué se guarda, durante cuánto tiempo y quién puede leerlo, antes de tener miles de conversaciones acumuladas.

---

## Comparación con JavaScript {: .topic-title }

| En Node.js | En Python |
|---|---|
| `fs.writeFileSync` a un `.tmp` + `fs.renameSync` | `open(tmp, "w")` + `tmp.replace(path)` |
| `JSON.parse` con `try/catch` | `json.load` con `except JSONDecodeError` |
| `class StoreError extends Error` | `class StoreError(Exception)` |
| `better-sqlite3` | `sqlite3` de la biblioteca estándar |
| `console.log` | `logging` |

!!! tip "Consejos"
    - **Cada fallo posible tiene su rama:** ausente, dañado, estructura incorrecta.
    - **Escritura segura (`.tmp` + `replace`)** para archivos que no quieres perder.
    - **Registra con `logging`**, no con `print`.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Fitxers de text pla — «La bona pràctica: la instrucció with» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#la-bona-practica-la-instruccio-with> |
| Fitxers JSON i XML — «Lectura i escriptura de fitxers JSON» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_602/#lectura-i-escriptura-de-fitxers-json> |
| Bases de dades: SQLite — «Gestió d'errors i transaccions amb try...except» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_603/#3-gestio-derrors-i-transaccions-amb-tryexcept> |
| Gestió d'errors — «Capturem diferents tipus d'errors» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_600/#2-capturem-diferents-tipus-derrors-excepcions> |
| **Documentación oficial** | |
| `pathlib.Path` (incluye `replace`) | <https://docs.python.org/3/library/pathlib.html#pathlib.Path> |
| `json.dump` | <https://docs.python.org/3/library/json.html#json.dump> |
| La conexión como gestor de contexto (`sqlite3`) | <https://docs.python.org/3/library/sqlite3.html#sqlite3-connection-context-manager> |
| Tutorial — Encadenamiento de excepciones | <https://docs.python.org/3/tutorial/errors.html#exception-chaining> |
| `logging.basicConfig` | <https://docs.python.org/3/library/logging.html#logging.basicConfig> |
