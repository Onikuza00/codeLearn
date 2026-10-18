# open y with { .section-python .bloque-python }

> `open()` abre un archivo y `with` se encarga de cerrarlo siempre, pase lo que pase. Aquí aprendes los modos de apertura, las tres formas de leer, cómo escribir y por qué hay que indicar la codificación.

---

## Escribir y leer con with {: .topic-title }

Para trabajar con el contenido de un archivo se usa `open(ruta, modo, encoding=...)`. Devuelve un **objeto archivo**. Cuando terminas, hay que **cerrarlo**. `with` lo hace solo al salir del bloque, incluso si hay un error. Los apuntes de la escuela dicen «hoy en día, SIEMPRE `with`». Es correcto.

**1. El script**

```python
# write_read.py
with open("data/offers.txt", "w", encoding="utf-8") as file:
    file.write("Frontend Developer;Madrid\n")
    file.write("Backend Developer;Barcelona\n")
    print("Data Analyst;Madrid", file=file)

print(file.closed)

with open("data/offers.txt", "r", encoding="utf-8") as file:
    for line in file:
        title, city = line.strip().split(";")
        print(f"{title} -> {city}")

with open("data/offers.txt", encoding="utf-8") as file:
    lines = file.readlines()
print(len(lines), repr(lines[0]))

with open("data/offers.txt", encoding="utf-8") as file:
    content = file.read()
print(type(content), len(content))
```

**2. Cómo se ejecuta**

```bash
python write_read.py
```

**3. Qué pasa por dentro.** En la primera línea se abre `offers.txt` en modo escritura (`"w"`), se guarda el objeto archivo en `file` y se ejecuta el bloque. Al salir del bloque, Python cierra el archivo; por eso `file.closed` es `True` después. `write` **no añade** salto de línea: lo pones tú (`\n`). `print(..., file=file)` sí lo añade, como cuando imprimes en pantalla. Las tres formas de leer devuelven cosas distintas.

**4. La salida**

```text
True
Frontend Developer -> Madrid
Backend Developer -> Barcelona
Data Analyst -> Madrid
3 'Frontend Developer;Madrid\n'
<class 'str'> 74
```

| Forma de leer | Devuelve | Cuándo |
|---|---|---|
| `for line in file` | Una línea cada vez | Archivos grandes: no se carga todo en memoria |
| `file.readlines()` | Lista con todas las líneas | Archivo pequeño y quieres la lista |
| `file.read()` | Todo el contenido en un `str` | Archivo pequeño y lo quieres entero |

Cada línea trae el `\n` final. `line.strip()` lo quita (los apuntes lo señalan).

!!! tip "Para leer o escribir un texto entero, `Path` es más corto"
    `Path("data/offers.txt").read_text(encoding="utf-8")` hace el `open`, el `read` y el cierre en una línea ([pathlib](../01-pathlib/index.md)). Usa `open` + `with` cuando quieras ir línea a línea o escribir por partes.

---

## Los modos de apertura {: .topic-title }

| Modo | Qué hace | Si el archivo no existe |
|---|---|---|
| `"r"` | Leer (por defecto) | `FileNotFoundError` |
| `"w"` | Escribir, **vaciando** el archivo | Lo crea |
| `"a"` | Añadir al final | Lo crea |
| `"x"` | Crear nuevo; **falla si ya existe** | Lo crea |
| `"b"` (se suma: `"rb"`, `"wb"`) | Modo binario (bytes, no texto) | — |

Los apuntes recogen `r`, `w` y `a`. `x` y `b` completan el cuadro.

```python
# modes.py
with open("data/log.txt", "w", encoding="utf-8") as file:
    file.write("uno\n")
with open("data/log.txt", "a", encoding="utf-8") as file:
    file.write("dos\n")
with open("data/log.txt", encoding="utf-8") as file:
    print(file.read().splitlines())

with open("data/log.txt", "w", encoding="utf-8") as file:
    pass
with open("data/log.txt", encoding="utf-8") as file:
    print(repr(file.read()))

try:
    with open("data/log.txt", "x", encoding="utf-8") as file:
        file.write("no")
except FileExistsError as error:
    print(f"FileExistsError: {error.filename}")

try:
    with open("data/log.txt", "w", encoding="utf-8") as file:
        file.read()
except Exception as error:
    print(type(error).__name__, error)

with open("data/raw.bin", "wb") as file:
    file.write("é".encode("utf-8"))
with open("data/raw.bin", "rb") as file:
    print(file.read())
```

```text
['uno', 'dos']
''
FileExistsError: data/log.txt
UnsupportedOperation not readable
b'\xc3\xa9'
```

- `"w"` y luego `"a"`: el archivo acaba con las dos líneas.
- Abrir en `"w"` y no escribir nada **vacía** el archivo. Es la trampa más cara de este modo.
- `"x"` protege de sobrescribir: si existe, lanza `FileExistsError`.
- Un archivo abierto en `"w"` no se puede leer (`UnsupportedOperation: not readable`).
- En binario se leen y escriben **bytes** (`b'...'`). Una `é` en UTF-8 ocupa dos bytes.

!!! warning "Modo \"w\" vacía el archivo al abrirlo"
    No hace falta escribir nada: con solo abrirlo en `"w"` lo que había se pierde. Si quieres añadir, usa `"a"`.

---

## La codificación {: .topic-title }

Un archivo de texto es una secuencia de bytes. La **codificación** dice cómo convertir esos bytes en letras. Si no la indicas, Python usa la del sistema. Los apuntes de la escuela recomiendan `encoding="utf-8"`, con razón:

```python
# encoding.py
with open("data/accents.txt", "w", encoding="utf-8") as file:
    file.write("Ñandú y café\n")

with open("data/accents.txt", encoding="utf-8") as file:
    print(file.read().strip())

with open("data/accents.txt", encoding="latin-1") as file:
    print(file.read().strip())

with open("data/accents.txt", "rb") as file:
    print(file.read())

try:
    with open("data/accents.txt", encoding="ascii") as file:
        file.read()
except UnicodeDecodeError as error:
    print("UnicodeDecodeError:", error.reason)
```

```text
Ñandú y café
ÃandÃº y cafÃ©
b'\xc3\x91and\xc3\xba y caf\xc3\xa9\r\n'
UnicodeDecodeError: ordinal not in range(128)
```

- Leído con la codificación correcta, el texto sale bien.
- Leído con otra (`latin-1`), no falla pero se **rompe** (`Ã±`, `Ã©`): es el famoso texto con símbolos raros.
- Los bytes reales (`\xc3\x91` es la `Ñ` en UTF-8) lo explican.
- Con `ascii` hay `UnicodeDecodeError`: ese byte no existe en ASCII.
- El `\r\n` del final es un detalle de Windows: en modo texto, Python convierte `\n` en `\r\n` al escribir y lo deshace al leer.

En Windows, la codificación por defecto depende de la configuración regional (en esta máquina, `cp1252`), por lo que un archivo escrito sin `encoding` y leído en otro equipo puede salir mal.

!!! warning "UnicodeDecodeError y texto con símbolos raros"
    Casi siempre significa «el archivo se escribió con una codificación y se lee con otra». Indica `encoding="utf-8"` al abrir, siempre, y en todos los programas que lean ese archivo.

---

## Si no usas with {: .topic-title }

Sin `with`, tienes que cerrar tú. Si se te olvida, o si hay un error antes del `close`, el archivo queda abierto:

```python
# not_closed.py
file = open("data/offers.txt", encoding="utf-8")
print(file.closed)
file.close()
print(file.closed)
try:
    file.read()
except ValueError as error:
    print(error)
```

```text
False
True
I/O operation on closed file.
```

Los apuntes tienen un ejemplo de `try/except/else/finally` que abre con `open()` a secas y cierra con `f.close()` en el `else`. Funciona, pero contradice su propia recomendación: con `with` el cierre es automático y todo el bloque `finally` sobra. [Excepciones](../../04-errores/01-excepciones/index.md) lo rehace.

---

## Python en IA {: .topic-title }

- **Prompts como archivos de texto:** guardar los prompts largos en `.txt` o `.md` y leerlos con `read_text`, en lugar de pegarlos en el código.
- **Registros (logs) de conversaciones** en modo `"a"`: una línea por mensaje, sin reescribir todo.
- **Corpus de documentos** que se leen línea a línea o por trozos.
- **Acentos y símbolos:** casi todos los textos para modelos llevan ñ, tildes, emojis. Sin `encoding="utf-8"` explícito acabas con textos rotos que luego se envían al modelo.

!!! tip "Un prompt en un archivo se versiona y se compara"
    Guardar el prompt como archivo permite revisarlo en Git, cambiarlo sin tocar código y comparar versiones.

---

## Comparación con JavaScript {: .topic-title }

| En Node.js | En Python |
|---|---|
| `fs.readFileSync(p, "utf8")` | `open(p, encoding="utf-8").read()` (con `with`) |
| `fs.appendFileSync(p, text)` | `open(p, "a", encoding="utf-8")` |
| `fs.createReadStream` | `for line in file` (lectura perezosa) |
| `fs.openSync` + `closeSync` | `with open(...)` cierra solo |
| La codificación se indica en cada llamada | Igual, con `encoding=` |
| `flag: "wx"` (falla si existe) | `"x"` |

!!! tip "Consejos"
    - **`with` siempre**, y `encoding="utf-8"` siempre.
    - **Línea a línea** para archivos grandes.
    - **`"w"` con cuidado:** vacía el archivo.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Fitxers de text pla — «Modes d'obertura principals» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#modes-dobertura-principals> |
| Fitxers de text pla — «La bona pràctica: la instrucció with» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#la-bona-practica-la-instruccio-with> |
| Fitxers de text pla — «Escriptura de fitxers de text» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#escriptura-de-fitxers-de-text> |
| Gestió d'errors — «L'estructura completa: else i finally» (`open` sin `with`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_600/#3-lestructura-completa-else-i-finally-opcional> |
| **Documentación oficial** | |
| `open()` | <https://docs.python.org/3/library/functions.html#open> |
| Tutorial — Leer y escribir archivos | <https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files> |
| Tutorial — Métodos de los objetos archivo | <https://docs.python.org/3/tutorial/inputoutput.html#methods-of-file-objects> |
| Referencia — La sentencia `with` | <https://docs.python.org/3/reference/compound_stmts.html#the-with-statement> |
| Codificaciones estándar | <https://docs.python.org/3/library/codecs.html#standard-encodings> |
