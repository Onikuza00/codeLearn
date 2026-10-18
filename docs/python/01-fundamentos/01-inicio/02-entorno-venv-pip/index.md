# Entorno: venv y pip { .section-python .bloque-python }

> Cada proyecto de Python vive en su propio entorno virtual con sus propias librerías. Aquí lo creas, lo activas, instalas paquetes con pip y guardas la lista en `requirements.txt`.

---

## Por qué un entorno por proyecto {: .topic-title }

Imagina dos proyectos. Uno necesita la versión 1 de una librería y el otro la versión 2. Si instalas todo en el Python del sistema, solo puede haber una versión: uno de los dos se rompe.

La solución es el **entorno virtual**: una carpeta con su propio Python y sus propias librerías, aislada del resto. Es lo mismo que hace `node_modules` en JavaScript, pero con una diferencia: en Node, `npm install` ya instala en la carpeta del proyecto. En Python, si no creas el entorno, `pip` instala en el Python global.

!!! warning "Nunca instales paquetes en el Python global"
    Con el tiempo se mezclan versiones, se rompen herramientas del sistema y no sabes qué necesita cada proyecto. Crea siempre un entorno antes del primer `pip install`.

---

## Crear el entorno {: .topic-title }

El módulo que lo crea se llama `venv` y viene con Python. Lo ejecutas con `python -m` (ejecutar un módulo como si fuera un programa). El nombre habitual de la carpeta es `.venv`.

**1. El comando**, en la carpeta de tu proyecto:

```bash
python -m venv .venv
```

**2. Qué pasa por dentro.** Python crea la carpeta `.venv` con una copia ligera de sí mismo y unos scripts de activación. En Windows queda así (resumido):

```text
.venv/
├── .gitignore
├── Include/
├── Lib/
├── Scripts/
│   ├── Activate.ps1
│   ├── activate
│   ├── activate.bat
│   ├── pip.exe
│   └── python.exe
└── pyvenv.cfg
```

En Linux y macOS la carpeta `Scripts` se llama `bin`.

**3. Qué ve Python.** Dentro del entorno, Python sabe que no es el global:

```python
# where_am_i.py
import sys

print(sys.prefix)
print(sys.base_prefix)
```

```text
C:\...\tu-proyecto\.venv
C:\Users\Usuario\AppData\Local\Programs\Python\Python313
```

La primera ruta es tu entorno. La segunda es el Python original en el que se basa.

!!! tip "Git ignora `.venv` solo"
    Desde Python 3.13, `venv` crea dentro de la carpeta un `.gitignore` con un `*`. Así la carpeta nunca se sube al repositorio. En versiones anteriores tienes que añadir `.venv/` a tu `.gitignore`.

---

## Activar el entorno {: .topic-title }

Activar significa que, mientras tengas esa terminal abierta, `python` y `pip` son los del entorno.

| Terminal | Comando |
|---|---|
| PowerShell (Windows) | `.venv\Scripts\Activate.ps1` |
| CMD (Windows) | `.venv\Scripts\activate.bat` |
| Bash, Zsh (Linux, macOS, Git Bash) | `source .venv/bin/activate` (en Git Bash de Windows: `source .venv/Scripts/activate`) |

Sabrás que está activo porque el prompt empieza por `(.venv)`. Para salir:

```bash
deactivate
```

!!! warning "PowerShell: «la ejecución de scripts está deshabilitada»"
    Si `Activate.ps1` falla con ese mensaje, Windows bloquea los scripts por defecto. La documentación oficial propone permitirlos solo para tu usuario:

    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

---

## Instalar paquetes con pip {: .topic-title }

**pip** es el instalador de paquetes de Python. Descarga desde PyPI, el repositorio público. Con el entorno activo:

```bash
python -m pip list
```

```text
Package Version
------- -------
pip     26.1.2
```

Un entorno nuevo solo trae `pip`. Instalamos `python-dotenv`, que sirve para leer variables desde un archivo `.env`:

```bash
python -m pip install python-dotenv
```

```text
Successfully installed python-dotenv-1.2.4
```

!!! tip "Escribe `python -m pip` en vez de `pip`"
    Así te aseguras de que el `pip` es del mismo Python que vas a usar. Con `pip` a secas, en algunas instalaciones, puede ser el de otro Python distinto.

Para ver la lista exacta de lo instalado y guardarla:

```bash
python -m pip freeze > requirements.txt
```

El archivo `requirements.txt` queda así:

```text
python-dotenv==1.2.4
```

Quien clone el proyecto crea su entorno y reconstruye todo con un comando:

```bash
python -m pip install -r requirements.txt
```

Es el equivalente de `package.json` más `npm install`.

---

## Python en IA {: .topic-title }

Aquí el entorno importa de verdad. Las librerías de IA son grandes y cambian de versión a menudo. Con un entorno por proyecto, actualizar una no rompe las demás.

Además, las claves de API **no van en el código**. Un patrón habitual es guardarlas en un archivo `.env` y leerlas al arrancar. Con el entorno activo:

```text
# .env
API_KEY=clave-de-prueba
```

```python
# config.py
import os

from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("API_KEY")
print(f"La clave empieza por: {api_key[:5]}")
```

```text
La clave empieza por: clave
```

Qué ha pasado: `load_dotenv()` lee el `.env` y mete sus líneas como variables de entorno; `os.getenv("API_KEY")` las recupera. Fuera del entorno falla, porque el paquete no está instalado allí:

```text
ModuleNotFoundError: No module named 'dotenv'
```

!!! warning "Nunca subas el `.env` a Git"
    Añade `.env` a tu `.gitignore`. Una clave publicada se puede usar (y cobrar) por cualquiera. Lo que sí se sube es `requirements.txt`.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `npm install` crea `node_modules` en el proyecto | `python -m venv .venv` y luego `pip install` |
| `package.json` | `requirements.txt` |
| `npm install` (reconstruye) | `python -m pip install -r requirements.txt` |
| `npm` / `pnpm` | `pip` |
| Registro npm | PyPI |
| `dotenv` (paquete de npm) | `python-dotenv` |

!!! tip "Consejos"
    - **Un entorno por proyecto**, en la raíz del proyecto, siempre con el mismo nombre (`.venv`).
    - **Comprueba qué Python usas** con `python -c "import sys; print(sys.executable)"`: la ruta debe estar dentro de `.venv`.
    - **Borrar el entorno es seguro:** borras la carpeta y lo recreas con `requirements.txt`.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| L'entorn de desenvolupament — apartado «Característiques» (solo menciona que se pueden crear entornos distintos, sin explicarlos) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_001/#caracteristiques> |
| **Documentación oficial** | |
| Tutorial — Crear entornos virtuales | <https://docs.python.org/3/tutorial/venv.html#creating-virtual-environments> |
| Tutorial — Gestionar paquetes con pip | <https://docs.python.org/3/tutorial/venv.html#managing-packages-with-pip> |
| Biblioteca — `venv`, crear entornos | <https://docs.python.org/3/library/venv.html#creating-virtual-environments> |
| Glosario — «virtual environment» | <https://docs.python.org/3/glossary.html#term-virtual-environment> |
| `os.getenv` | <https://docs.python.org/3/library/os.html#os.getenv> |
| Guía de empaquetado — Instalar paquetes con pip y entornos virtuales | <https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/> |
| python-dotenv en PyPI | <https://pypi.org/project/python-dotenv/> |
