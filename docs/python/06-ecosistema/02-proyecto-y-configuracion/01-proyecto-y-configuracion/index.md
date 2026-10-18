# Proyecto y configuración { .section-python .bloque-python }

> Un proyecto de Python describe quién es y qué necesita en `pyproject.toml`, y recibe su configuración del exterior: variables de entorno y un archivo `.env` que nunca se sube a Git. Aquí ves cómo se organiza todo y cómo se leen los ajustes con seguridad.

---

## pyproject.toml {: .topic-title }

En [Entorno: venv y pip](../../../01-fundamentos/01-inicio/02-entorno-venv-pip/index.md) guardaste las dependencias con `pip freeze > requirements.txt`. Para un proyecto que se va a instalar y compartir, el estándar es un único archivo: **`pyproject.toml`**. Está escrito en **TOML**, un formato de configuración sencillo (`clave = valor`, secciones entre corchetes).

**1. El archivo**

```toml
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "chatcli"
version = "0.1.0"
description = "Cliente de chat de ejemplo"
requires-python = ">=3.11"
dependencies = [
    "httpx>=0.27",
    "python-dotenv>=1.0",
]

[project.optional-dependencies]
dev = ["pytest>=8"]

[project.scripts]
chatcli = "chatcli.cli:main"

[tool.setuptools.packages.find]
where = ["src"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

**2. Cómo se lee.** Python trae `tomllib` para leer TOML:

```python
# read_toml.py
import tomllib

with open("pyproject.toml", "rb") as file:
    project = tomllib.load(file)["project"]

print(project["name"], project["version"], project["requires-python"])
print(project["dependencies"])
print(project["optional-dependencies"]["dev"])
print(project["scripts"])
```

```bash
python read_toml.py
```

```text
chatcli 0.1.0 >=3.11
['httpx>=0.27', 'python-dotenv>=1.0']
['pytest>=8']
{'chatcli': 'chatcli.cli:main'}
```

(`tomllib` se abre en modo **binario**, `"rb"`.)

**3. Qué significa cada sección:**

| Sección | Para qué |
|---|---|
| `[build-system]` | Con qué herramienta se construye el paquete |
| `[project]` | Nombre, versión, versión mínima de Python y **dependencias** |
| `[project.optional-dependencies]` | Grupos opcionales (por ejemplo, `dev` para las herramientas de desarrollo) |
| `[project.scripts]` | Comandos que se instalan (`chatcli` ejecuta `chatcli.cli:main`) |
| `[tool.xxx]` | Configuración de herramientas (`pytest`, `mypy`...) |

Para instalar el proyecto con el grupo de desarrollo: `python -m pip install -e ".[dev]"`.

### freeze frente a pyproject

| | `pyproject.toml` | `requirements.txt` (de `pip freeze`) |
|---|---|---|
| Qué guarda | Lo que **tu proyecto necesita** (con rangos: `httpx>=0.27`) | **Todo** lo instalado, con versiones exactas |
| Para qué | Describir el proyecto; instalar como paquete | Reproducir un entorno concreto (despliegues) |
| Quién lo escribe | Tú | `pip freeze`, automáticamente |

Con `pip freeze` sale también lo que dependen tus dependencias (`anyio`, `certifi`, `h11`...), a veces con un comentario sobre la instalación editable. Se suelen tener los dos: `pyproject.toml` como fuente de verdad y un archivo con versiones fijas para repetir el mismo entorno. Herramientas más nuevas como **uv** automatizan esa gestión (entorno, dependencias y archivo de versiones fijas con un solo comando); no se usa aquí, pero merece la pena conocerlo.

---

## Variables de entorno {: .topic-title }

La **configuración** (modelo, temperatura, claves) no debe estar escrita dentro del código: cambia entre tu máquina, la de un compañero y el servidor. Las **variables de entorno** son pares `NOMBRE=valor` que el sistema operativo da a cada programa. En Python se leen con `os.environ` (como un diccionario) o `os.getenv`.

```python
# env_basic.py
import os

print(os.environ.get("CHAT_MODEL"))
print(os.getenv("CHAT_MODEL", "modelo-demo"))
try:
    os.environ["CHAT_API_KEY"]
except KeyError as error:
    print("KeyError:", error)

os.environ["CHAT_TEMPERATURE"] = "0.2"
print(float(os.environ["CHAT_TEMPERATURE"]), type(os.environ["CHAT_TEMPERATURE"]))
print(os.getenv("CHAT_DEBUG", "0") == "1")
```

```text
None
modelo-demo
KeyError: 'CHAT_API_KEY'
0.2 <class 'str'>
False
```

- `os.getenv(nombre)` devuelve `None` si no existe; con un segundo argumento, un valor por defecto.
- `os.environ[nombre]` lanza `KeyError` si no existe: úsalo para lo **obligatorio**.
- **Todo valor es un `str`.** Un booleano o un número hay que convertirlos (como en [Entrada y conversión](../../../01-fundamentos/02-datos-basicos/03-entrada-y-conversion/index.md)).
- Asignar a `os.environ` solo afecta al programa en ejecución (y a los procesos que lance).

Y se puede dar valor desde la terminal, solo para esa ejecución:

```bash
CHAT_MODEL=desde-shell python env_basic.py
```

```text
desde-shell
desde-shell
```

(En PowerShell: `$env:CHAT_MODEL="desde-shell"; python env_basic.py`.)

---

## El archivo .env {: .topic-title }

Escribir las variables a mano en cada terminal es incómodo. Es habitual guardarlas en un archivo **`.env`** en la raíz del proyecto y cargarlas con `python-dotenv`:

```text
# .env
CHAT_MODEL=desde-dotenv
CHAT_API_KEY=clave-de-prueba-no-real
CHAT_TEMPERATURE=0.3
CHAT_DEBUG=1
```

```python
# dotenv_demo.py
import os

from dotenv import load_dotenv

print("antes:", os.getenv("CHAT_MODEL"))
load_dotenv()
print("después:", os.getenv("CHAT_MODEL"))
print(os.getenv("CHAT_API_KEY")[:6] + "…")
```

```text
antes: None
después: desde-dotenv
clave-…
```

Y si la variable ya estaba definida en el entorno, **el entorno gana** (por defecto `load_dotenv` no sobreescribe):

```bash
CHAT_MODEL=desde-shell python dotenv_demo.py
```

```text
antes: desde-shell
después: desde-shell
clave-…
```

Es lo que quieres: el servidor define sus variables reales y el `.env` es solo la comodidad del desarrollo.

!!! warning "El `.env` NUNCA se sube a Git"
    Contiene secretos. Añade `.env` al `.gitignore` desde el primer commit. Si una clave llega a un repositorio, aunque la borres después sigue en el historial: hay que **revocarla** y crear una nueva.

    ```text
    # .gitignore
    .env
    .venv/
    __pycache__/
    ```

    (Desde Python 3.13, `venv` crea un `.gitignore` dentro de `.venv/` que ya lo ignora.) Lo que sí se sube es un **`.env.example`** con los nombres de las variables y valores falsos, para que otra persona sepa qué definir.

---

## Una clase Settings {: .topic-title }

Lee la configuración **una vez**, en un único sitio, la valida y entrega un objeto con tipos. El resto del programa no toca `os.environ`.

```python
# settings.py
import os
from dataclasses import dataclass

from dotenv import load_dotenv


class ConfigError(Exception):
    """Falta algo obligatorio en la configuración."""


@dataclass(frozen=True)
class Settings:
    api_key: str
    model: str = "modelo-demo"
    temperature: float = 0.7
    debug: bool = False

    def __repr__(self) -> str:
        return f"Settings(model={self.model!r}, temperature={self.temperature}, api_key='***')"

    @classmethod
    def from_env(cls) -> "Settings":
        load_dotenv()
        api_key = os.getenv("CHAT_API_KEY")
        if not api_key:
            raise ConfigError("falta CHAT_API_KEY (defínela en el entorno o en .env)")
        try:
            temperature = float(os.getenv("CHAT_TEMPERATURE", "0.7"))
        except ValueError as error:
            raise ConfigError("CHAT_TEMPERATURE debe ser un número") from error
        return cls(
            api_key=api_key,
            model=os.getenv("CHAT_MODEL", "modelo-demo"),
            temperature=temperature,
            debug=os.getenv("CHAT_DEBUG", "0") == "1",
        )


print(Settings.from_env())
```

Con el `.env` de arriba:

```text
Settings(model='desde-dotenv', temperature=0.3, api_key='***')
```

Sin la clave (quitando el `.env`), y con una temperatura que no es un número (`CHAT_TEMPERATURE=alta`):

```text
ConfigError: falta CHAT_API_KEY (defínela en el entorno o en .env)
ConfigError: CHAT_TEMPERATURE debe ser un número
```

- Es una [dataclass](../../../05-objetos/02-dataclass/01-dataclasses/index.md) inmutable, con un constructor de clase (`from_env`) que usa lo aprendido sobre [métodos de clase](../../../05-objetos/01-clases/01-clases/index.md).
- El **`__repr__` oculta la clave** (`api_key='***'`): si alguien imprime o registra el objeto, el secreto no sale.
- Falla **al arrancar** con un mensaje claro, no cuando llegue la petición número 300.

---

## Python en IA {: .topic-title }

Las claves de API son los secretos más típicos de un proyecto con modelos. Las reglas:

- **En el entorno o en `.env`, nunca en el código.**
- **Nunca en un log ni en un mensaje de error** (de ahí el `__repr__` que las oculta).
- **Una clave por entorno**: desarrollo y producción no comparten.
- Los **parámetros del modelo** (nombre, temperatura, máximo de tokens) también van en la configuración: cambiar de modelo es cambiar una variable.

!!! tip "`.env.example` en el repositorio"
    Un archivo con `CHAT_API_KEY=pon-aqui-tu-clave` documenta qué hay que definir sin exponer nada. Quien clone el proyecto lo copia a `.env` y lo rellena.

---

## Comparación con JavaScript {: .topic-title }

| En JS / Node.js | En Python |
|---|---|
| `package.json` | `pyproject.toml` |
| `dependencies` / `devDependencies` | `dependencies` / `optional-dependencies` |
| `package-lock.json` | Archivo de versiones fijas (`pip freeze`, o el de `uv`) |
| `"scripts": { ... }` | `[project.scripts]` (comandos instalados) |
| `process.env.NOMBRE` | `os.environ["NOMBRE"]` / `os.getenv` |
| `dotenv` (`require("dotenv").config()`) | `python-dotenv` (`load_dotenv()`) |
| `.env` ignorado en `.gitignore` | Igual |

!!! tip "Consejos"
    - **Configuración leída en un único sitio** (`Settings.from_env()`).
    - **Valores obligatorios con error claro**; opcionales con valor por defecto.
    - **Ni claves ni `.env` en Git.**

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye `pyproject.toml`, variables de entorno ni gestión de dependencias | — |
| **Documentación oficial** | |
| Guía de empaquetado — Escribir `pyproject.toml` | <https://packaging.python.org/en/latest/guides/writing-pyproject-toml/> |
| Especificación de `pyproject.toml` | <https://packaging.python.org/en/latest/specifications/pyproject-toml/> |
| Módulo `tomllib` | <https://docs.python.org/3/library/tomllib.html> |
| `os.environ` | <https://docs.python.org/3/library/os.html#os.environ> |
| `os.getenv` | <https://docs.python.org/3/library/os.html#os.getenv> |
| Tutorial — Gestionar paquetes con pip (`freeze`) | <https://docs.python.org/3/tutorial/venv.html#managing-packages-with-pip> |
| python-dotenv en PyPI | <https://pypi.org/project/python-dotenv/> |
| uv (documentación) | <https://docs.astral.sh/uv/> |
