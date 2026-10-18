# Módulos y paquetes { .section-python .bloque-python }

> Un módulo es un archivo `.py` que otros archivos pueden importar. Un paquete es una carpeta de módulos. Aquí aprendes `import`, qué significa `if __name__ == "__main__"`, cómo se organiza un paquete y por qué los proyectos serios usan la carpeta `src/`.

---

## Importar un módulo {: .topic-title }

Cualquier archivo `.py` es un **módulo**. Para usar lo que define otro, lo **importas**. Los apuntes de la escuela usan `import random` o `import csv` de la biblioteca estándar, pero no explican cómo escribir los tuyos.

Este es el módulo `prompts.py`:

```python
# prompts.py
print(f"cargando prompts.py (__name__ = {__name__!r})")

SYSTEM_PROMPT = "Eres un asistente breve."


def build_prompt(question):
    return f"{SYSTEM_PROMPT}\n\nPregunta: {question}"


if __name__ == "__main__":
    print("ejecutado directamente")
    print(build_prompt("¿Qué es un token?"))
```

Y este, `main.py`, que lo importa de tres maneras:

**1. El script**

```python
# main.py
import prompts
from prompts import build_prompt, SYSTEM_PROMPT as SYSTEM
import prompts as p

print(prompts.SYSTEM_PROMPT)
print(build_prompt("Hola").splitlines()[-1])
print(SYSTEM == p.SYSTEM_PROMPT, prompts is p)
import prompts
print("segundo import: no vuelve a ejecutar el módulo")
print(prompts.__name__, prompts.__file__.endswith("prompts.py"))
```

**2. Cómo se ejecuta**

```bash
python prompts.py
python main.py
```

**3. Qué pasa por dentro.** La primera vez que se importa un módulo, Python busca el archivo, **ejecuta todo su contenido de arriba abajo** y guarda el módulo en una caché. Las siguientes importaciones reutilizan ese módulo, sin volver a ejecutarlo. Las tres formas dan acceso a lo mismo:

| Forma | Cómo se usa |
|---|---|
| `import prompts` | `prompts.build_prompt(...)` |
| `from prompts import build_prompt` | `build_prompt(...)` directamente |
| `import prompts as p` / `from ... import X as Y` | Con un alias |

**4. La salida** de `python prompts.py`:

```text
cargando prompts.py (__name__ = '__main__')
ejecutado directamente
Eres un asistente breve.

Pregunta: ¿Qué es un token?
```

Y la de `python main.py`:

```text
cargando prompts.py (__name__ = 'prompts')
Eres un asistente breve.
Pregunta: Hola
True True
segundo import: no vuelve a ejecutar el módulo
prompts True
```

!!! warning "ModuleNotFoundError e ImportError"
    ```python
    # bad_import.py
    try:
        import no_such_module
    except ModuleNotFoundError as error:
        print("ModuleNotFoundError:", error)
    try:
        from prompts import not_there
    except ImportError as error:
        print("ImportError:", error)
    ```

    ```text
    ModuleNotFoundError: No module named 'no_such_module'
    cargando prompts.py (__name__ = 'prompts')
    ImportError: cannot import name 'not_there' from 'prompts' (...prompts.py)
    ```

    El primero: el módulo no existe (o el paquete no está instalado en el entorno activo). El segundo: el módulo existe, pero no tiene ese nombre. Fíjate en que, al importar, el módulo **se ejecutó** (aparece el «cargando...»).

---

## if __name__ == "__main__" {: .topic-title }

Cada módulo tiene una variable `__name__`. Si lo **ejecutas directamente** (`python prompts.py`), vale `"__main__"`. Si lo **importas**, vale su nombre (`"prompts"`). Como se vio en la salida:

- Ejecutando `prompts.py`: `__name__ = '__main__'` y se ejecuta el bloque del `if`.
- Importándolo desde `main.py`: `__name__ = 'prompts'` y el bloque **no** se ejecuta.

Sirve para que un archivo sea a la vez **reutilizable** (se puede importar sin efectos) y **ejecutable** (con su propio programa o pruebas). Todo lo que haya al nivel superior del módulo, fuera de ese `if`, se ejecuta al importar: no pongas ahí código con efectos (llamadas a APIs, impresiones).

!!! tip "Convención del punto de entrada"
    Pon la lógica en funciones y deja en el `if __name__ == "__main__":` solo una llamada: `main()`. Así `main` se puede probar y reutilizar.

---

## Paquetes e imports relativos {: .topic-title }

Un **paquete** es una **carpeta** con módulos dentro. Las subcarpetas son subpaquetes. Tradicionalmente cada carpeta lleva un archivo `__init__.py` (puede estar vacío) que marca «esto es un paquete» y que se ejecuta al importarlo.

Un paquete de ejemplo:

```text
shop/
├── __init__.py
├── config.py
└── tools/
    ├── __init__.py
    ├── numbers.py
    └── text.py
```

```python
# shop/tools/__init__.py
from .text import clean

__all__ = ["clean"]
```

```python
# shop/tools/text.py
def clean(text):
    return " ".join(text.split())
```

```python
# shop/tools/numbers.py
from .text import clean
from ..config import CURRENCY


def price_label(value):
    return clean(f"{value:,.2f}   {CURRENCY}")
```

```python
# shop/config.py
CURRENCY = "EUR"
```

```python
# use_package.py
from shop.tools import clean
from shop.tools.numbers import price_label
import shop.config

print(clean("  hola   mundo  "))
print(price_label(1234.5))
print(shop.config.CURRENCY)
import shop.tools
print(shop.tools.__name__, shop.tools.__all__)
```

```text
hola mundo
1,234.50 EUR
EUR
shop.tools ['clean']
```

- **Imports absolutos:** `from shop.tools.numbers import price_label`: la ruta completa desde la raíz del paquete. Son los preferidos por claridad.
- **Imports relativos:** `from .text import clean` («de este mismo paquete») y `from ..config import CURRENCY` («del paquete padre»). Un punto es la carpeta actual; dos, la de arriba.
- El `__init__.py` de `tools` re-exporta `clean`, así que se importa como `from shop.tools import clean`. `__all__` lista lo que exporta `from shop.tools import *`.

!!! warning "ImportError: attempted relative import with no known parent package"
    Los imports relativos solo funcionan dentro de un **paquete**. Si ejecutas el archivo directamente (`python shop/tools/numbers.py`), Python lo trata como un script suelto y falla:

    ```text
    ImportError: attempted relative import with no known parent package
    ```

    Para ejecutar un módulo de un paquete, se usa `-m` desde la carpeta que contiene el paquete: `python -m shop.tools.numbers`.

---

## Dónde busca Python {: .topic-title }

Al importar, Python busca en `sys.path`: la carpeta del script que se ejecuta, las rutas de la instalación y el `site-packages` del entorno virtual donde se instalan los paquetes con `pip` ([Entorno: venv y pip](../../../01-fundamentos/01-inicio/02-entorno-venv-pip/index.md)). Un módulo propio se encuentra si está en la carpeta del script. Pero no si ejecutas desde otra carpeta. La solución profesional es **instalar** tu propio paquete en el entorno.

---

## Estructura de proyecto con src/ {: .topic-title }

La organización estándar para un proyecto:

```text
chatcli/
├── pyproject.toml
├── src/
│   └── chatcli/
│       ├── __init__.py
│       ├── __main__.py
│       └── cli.py
└── tests/
```

Poner el paquete dentro de **`src/`** evita que `import chatcli` funcione «de casualidad» solo por ejecutar desde la raíz: obliga a instalar el paquete (que es como lo usará el resto del mundo), y así descubres a tiempo los errores de empaquetado. El archivo `pyproject.toml` (el tema del [siguiente capítulo](../../02-proyecto-y-configuracion/01-proyecto-y-configuracion/index.md)) describe el proyecto. Con el entorno activo, se instala en modo **editable** (`-e`): los cambios en el código se ven al instante, sin reinstalar.

```bash
python -m pip install -e .
python -m pip list
```

```text
chatcli           0.1.0     C:\...\i02
httpx             0.28.1
python-dotenv     1.2.4
```

(Se omiten las demás líneas; `chatcli` aparece con la ruta de la carpeta de desarrollo.)

Y ahora funciona desde cualquier carpeta, con el módulo y con el comando que declaró el proyecto:

```python
# src/chatcli/cli.py
from chatcli import __version__


def main():
    print(f"chatcli {__version__}")


if __name__ == "__main__":
    main()
```

```bash
python -c "import chatcli; print(chatcli.__version__)"
python -m chatcli
chatcli
```

```text
0.1.0
chatcli 0.1.0
chatcli 0.1.0
```

- `python -m chatcli` ejecuta `src/chatcli/__main__.py`.
- `chatcli` a secas es un **comando** creado por `pyproject.toml` (`[project.scripts]`).
- Con el Python **global** (sin el entorno), `import chatcli` falla: `ModuleNotFoundError: No module named 'chatcli'`. El paquete solo existe en el entorno donde se instaló.

---

## Python en IA {: .topic-title }

Un proyecto con modelos crece rápido: cliente, configuración, prompts, validación de respuestas, almacenamiento, CLI. Si todo está en un solo archivo, deja de ser manejable. Separarlo en módulos:

- **`config.py`**: ajustes y claves.
- **`client.py`**: la comunicación con el proveedor.
- **`prompts.py`**: plantillas de prompts.
- **`models.py`**: `Message`, `Conversation`, validaciones.

Cada uno se prueba por separado y se cambia sin afectar al resto.

!!! tip "Un módulo, una responsabilidad"
    Si un módulo mezcla «construir prompts», «llamar a la API» y «guardar en disco», parte en tres. Los imports entre ellos documentan las dependencias.

!!! warning "Imports circulares"
    Si `a.py` importa `b.py` y `b.py` importa `a.py`, puedes obtener `ImportError`. Se arregla moviendo lo común a un tercer módulo.

---

## Comparación con JavaScript {: .topic-title }

| En JS / Node.js | En Python |
|---|---|
| `import { x } from "./file.js"` | `from file import x` |
| `import * as lib from "lib"` | `import lib` |
| `export` explícito | Todo lo del módulo es importable (se evita con `_nombre` y `__all__`) |
| `package.json` `"main"` / `"bin"` | `pyproject.toml` `[project.scripts]` |
| `node_modules` | `site-packages` del entorno virtual |
| `import.meta.url === process.argv[1]` (módulo principal) | `if __name__ == "__main__":` |
| `index.js` de una carpeta | `__init__.py` |
| `npm link` | `pip install -e .` |

!!! tip "Consejos"
    - **Nunca llames a tu módulo como uno de la biblioteca estándar** (`random.py`, `json.py`, `csv.py`): taparía al original.
    - **Imports al principio del archivo**, agrupados: estándar, terceros, propios.
    - **`src/` + `pip install -e .`** para cualquier proyecto que vaya a crecer.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye módulos propios, paquetes ni `__name__` (solo usa `import` de la biblioteca estándar) | — |
| Caixa d'eines — «Generació d'atzar (import random)» (uso de `import`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_901/#2-generacio-datzar-import-random> |
| **Documentación oficial** | |
| Tutorial — Módulos | <https://docs.python.org/3/tutorial/modules.html#modules> |
| Tutorial — Ejecutar módulos como scripts | <https://docs.python.org/3/tutorial/modules.html#executing-modules-as-scripts> |
| Tutorial — La ruta de búsqueda de módulos | <https://docs.python.org/3/tutorial/modules.html#the-module-search-path> |
| Tutorial — Paquetes | <https://docs.python.org/3/tutorial/modules.html#packages> |
| Tutorial — Referencias dentro de un paquete | <https://docs.python.org/3/tutorial/modules.html#intra-package-references> |
| `__main__` — Entorno de código de nivel superior | <https://docs.python.org/3/library/__main__.html> |
| Guía de empaquetado — `src` frente a estructura plana | <https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/> |
