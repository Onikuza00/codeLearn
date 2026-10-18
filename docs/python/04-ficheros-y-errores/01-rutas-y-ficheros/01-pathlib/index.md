# pathlib { .section-python .bloque-python }

> `pathlib` representa las rutas como objetos: se unen con `/`, se consultan con atributos y se leen y escriben sin abrir el archivo a mano. Es la forma actual de trabajar con rutas, frente a las cadenas de texto.

---

## Una ruta es un objeto {: .topic-title }

Una **ruta** es el camino hasta un archivo o carpeta. Los apuntes de la escuela las manejan como cadenas de texto (`"/var/log/syslog.log"`). Funciona, pero tiene pegas: las barras cambian entre Windows y Linux, y unir trozos con `+` es frágil. `pathlib.Path` resuelve eso.

**1. El script**

```python
# pathlib_demo.py
from pathlib import Path

base = Path("data")
file_path = base / "offers.txt"
print(file_path)
print(file_path.name, file_path.stem, file_path.suffix, file_path.parent)
print(file_path.with_suffix(".csv"))
print(file_path.exists(), base.exists(), base.is_dir())

base.mkdir(exist_ok=True)
file_path.write_text("Frontend Developer\nBackend Developer\n", encoding="utf-8")
print(file_path.exists(), file_path.is_file())
text = file_path.read_text(encoding="utf-8")
print(repr(text))
print(text.splitlines())
print(file_path.stat().st_size, "bytes")

(base / "a.log").write_text("x", encoding="utf-8")
(base / "b.log").write_text("y", encoding="utf-8")
print(sorted(path.name for path in base.glob("*.log")))
print(sorted(path.name for path in base.iterdir()))
print(Path("data/../data/offers.txt").resolve() == file_path.resolve())
```

**2. Cómo se ejecuta**

```bash
python pathlib_demo.py
```

(La carpeta `data` ya existía, vacía. El script funciona igual si no existe, por el `mkdir`.)

**3. Qué pasa por dentro.** `Path("data")` crea un objeto ruta; **no toca el disco**. El operador `/` une rutas y pone el separador correcto del sistema. Los atributos (`name`, `suffix`...) se calculan sobre el texto de la ruta. Solo métodos como `exists`, `write_text` o `mkdir` consultan o cambian el disco.

**4. La salida** (en Windows; en Linux y macOS las barras son `/`)

```text
data\offers.txt
offers.txt offers .txt data
data\offers.csv
False True True
True True
'Frontend Developer\nBackend Developer\n'
['Frontend Developer', 'Backend Developer']
39 bytes
['a.log', 'b.log']
['a.log', 'b.log', 'offers.txt']
True
```

| Pieza | Qué da |
|---|---|
| `ruta / "x"` | Une rutas (crea otra `Path`) |
| `.name` / `.stem` / `.suffix` | Nombre completo / sin extensión / extensión |
| `.parent` | Carpeta que lo contiene |
| `.with_suffix(".csv")` | La misma ruta con otra extensión |
| `.exists()`, `.is_file()`, `.is_dir()` | Consultas al disco |
| `.read_text()` / `.write_text()` | Leer / escribir un texto entero |
| `.mkdir(exist_ok=True)` | Crea la carpeta (sin error si ya existe) |
| `.glob("*.log")` | Los archivos que encajan con un patrón |
| `.iterdir()` | Todo lo que hay dentro de una carpeta |
| `.resolve()` | La ruta absoluta y normalizada |

!!! tip "`encoding=\"utf-8\"` también aquí"
    `read_text` y `write_text` usan la codificación del sistema si no la indicas. En Windows eso puede no ser UTF-8, y los acentos salen rotos. Indícala siempre, como explica [open y with](../02-open-y-with/index.md#la-codificacion).

!!! warning "Escribir con `write_text` machaca el archivo"
    Si el archivo existe, `write_text` lo **sobrescribe** sin avisar (como el modo `"w"`). Comprueba `exists()` antes si no quieres perder lo que había.

---

## Rutas relativas a tu script {: .topic-title }

Una ruta relativa como `Path("data")` se resuelve desde el **directorio de trabajo**, que es desde donde ejecutas el comando, no donde está el script. Si ejecutas el script desde otra carpeta, `data` apuntará a otro sitio.

```python
# cwd.py
from pathlib import Path

here = Path(__file__).parent
print(here.name)
print((here / "data" / "offers.txt").exists())
print(Path.cwd().name)
```

```text
g01
True
g01
```

- `__file__` es la ruta del propio script; `.parent` es su carpeta.
- Construir las rutas a partir de `here` hace que funcionen **desde cualquier carpeta**.
- `Path.cwd()` es el directorio de trabajo (aquí coinciden porque ejecuté el script desde su carpeta).

---

## Cuando el archivo no está {: .topic-title }

```python
# missing.py
from pathlib import Path

try:
    Path("data/nope.txt").read_text(encoding="utf-8")
except FileNotFoundError as error:
    print(error)
Path("data/offers.txt").unlink()
print(Path("data/offers.txt").exists())
Path("data/offers.txt").unlink(missing_ok=True)
```

```text
[Errno 2] No such file or directory: 'data\\nope.txt'
False
```

- Leer un archivo que no existe lanza `FileNotFoundError`; es lo primero que querrás manejar ([Excepciones](../../04-errores/01-excepciones/index.md)).
- `unlink()` borra un archivo; con `missing_ok=True` no falla si ya no estaba. Para borrar una carpeta con contenido hace falta `shutil.rmtree`; ten mucho cuidado con él.
- El `\\` del mensaje es una barra invertida escrita como en un texto de Python.

!!! warning "Rutas con barras invertidas en cadenas"
    En Windows, `"C:\nuevo\datos"` se interpreta como un salto de línea (`\n`). Con `Path` usa barras normales (`Path("C:/nuevo/datos")` funciona también en Windows) o un raw string (`r"C:\nuevo\datos"`).

---

## Python en IA {: .topic-title }

Los proyectos con modelos manejan muchos archivos: documentos a indexar, conversaciones guardadas, resultados de evaluaciones, caches. Con `pathlib`:

- **Recorrer una carpeta de documentos:** `for doc in Path("docs").glob("*.txt")`.
- **Guardar resultados** en una carpeta que se crea si no existe.
- **Rutas que funcionan igual** en tu máquina, en el servidor y en el de un compañero.

!!! tip "Una carpeta de datos por proyecto"
    Define una constante `DATA_DIR = Path(__file__).parent / "data"` al principio del script y construye todas las rutas a partir de ella. Cambiar dónde se guarda algo es tocar una línea.

---

## Comparación con JavaScript {: .topic-title }

| En Node.js | En Python |
|---|---|
| `path.join("data", "a.txt")` | `Path("data") / "a.txt"` |
| `path.basename(p)` / `path.extname(p)` | `p.name` / `p.suffix` |
| `fs.existsSync(p)` | `p.exists()` |
| `fs.readFileSync(p, "utf8")` | `p.read_text(encoding="utf-8")` |
| `fs.writeFileSync(p, text)` | `p.write_text(text, encoding="utf-8")` |
| `fs.mkdirSync(p, { recursive: true })` | `p.mkdir(parents=True, exist_ok=True)` |
| `fs.readdirSync(p)` | `p.iterdir()` |
| `__dirname` | `Path(__file__).parent` |

!!! tip "Consejos"
    - **`Path` y `/`, no cadenas con `+`.**
    - **Rutas desde el script (`__file__`)**, no desde donde se ejecute.
    - **Comprueba con `exists()` antes de sobrescribir**, o usa el modo `"x"` de `open` ([siguiente capítulo](../02-open-y-with/index.md)).

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Fitxers de text pla — «Treballar amb fitxers de text pla» (rutas como cadenas, sin `pathlib`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#1-treballar-amb-fitxers-de-text-pla-txt-log> |
| **Documentación oficial** | |
| Módulo `pathlib` | <https://docs.python.org/3/library/pathlib.html> |
| `pathlib` — Uso básico | <https://docs.python.org/3/library/pathlib.html#basic-use> |
| `Path.read_text` | <https://docs.python.org/3/library/pathlib.html#pathlib.Path.read_text> |
| `Path.write_text` | <https://docs.python.org/3/library/pathlib.html#pathlib.Path.write_text> |
| `Path.mkdir` | <https://docs.python.org/3/library/pathlib.html#pathlib.Path.mkdir> |
| `Path.glob` | <https://docs.python.org/3/library/pathlib.html#pathlib.Path.glob> |
| `PurePath.suffix` | <https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.suffix> |
