# argparse { .section-python .bloque-python }

> `argparse` convierte los argumentos de la línea de comandos en datos de Python, y te regala un `--help` y los mensajes de error. Aquí defines argumentos y opciones, subcomandos y códigos de salida, y ves cómo lo haría `typer`.

---

## Argumentos y opciones {: .topic-title }

Un programa de terminal se controla con **argumentos**: `python archivo.py "texto" --opcion valor`. Python los guarda en `sys.argv` como una lista de textos, pero parsearlos a mano es tedioso. **`argparse`** (biblioteca estándar) lo hace por ti: declaras qué acepta tu programa y él lee, convierte, valida y genera la ayuda.

**1. El script**

```python
# simple_cli.py
import argparse

parser = argparse.ArgumentParser(prog="ask", description="Hace una pregunta a un modelo (simulado)")
parser.add_argument("question", help="la pregunta, entre comillas")
parser.add_argument("--model", default="modelo-demo", help="nombre del modelo (por defecto: %(default)s)")
parser.add_argument("--temperature", type=float, default=0.7, help="entre 0 y 2")
parser.add_argument("-v", "--verbose", action="store_true", help="más detalle")
parser.add_argument("--tags", nargs="*", default=[], help="etiquetas opcionales")

args = parser.parse_args()
print(args)
if args.verbose:
    print(f"modelo={args.model} temperatura={args.temperature}")
print(f"Pregunta: {args.question}")
```

**2. Cómo se ejecuta**

```bash
python simple_cli.py "¿Qué es un token?"
python simple_cli.py "Hola" --model otro --temperature 0.2 -v --tags a b
```

**3. Qué pasa por dentro.** `ArgumentParser` es el objeto que sabe qué espera el programa. Cada `add_argument` declara un argumento:

| Pieza | Qué es |
|---|---|
| `"question"` (sin guiones) | Argumento **posicional**: obligatorio, por orden |
| `"--model"` | **Opción**: opcional, con nombre; puede tener `default` |
| `type=float` | Convierte el texto a ese tipo (y rechaza lo que no cuadre) |
| `action="store_true"` | Una **bandera**: `False` si no aparece, `True` si aparece (`-v`) |
| `nargs="*"` | Acepta **cero o más** valores (`--tags a b`) |
| `choices=[...]` | Solo admite esos valores |

`parse_args()` lee `sys.argv`, valida y devuelve un `Namespace`: un objeto con un atributo por argumento (`args.model`).

**4. La salida**

```text
$ python simple_cli.py "¿Qué es un token?"
Namespace(question='¿Qué es un token?', model='modelo-demo', temperature=0.7, verbose=False, tags=[])
Pregunta: ¿Qué es un token?
$ python simple_cli.py "Hola" --model otro --temperature 0.2 -v --tags a b
Namespace(question='Hola', model='otro', temperature=0.2, verbose=True, tags=['a', 'b'])
modelo=otro temperatura=0.2
Pregunta: Hola
```

(Las líneas con `$` son las órdenes que se escribieron; el resto es la salida.)

!!! tip "Un texto con espacios, entre comillas"
    La terminal separa los argumentos por espacios. `"¿Qué es un token?"` entre comillas llega como **un** argumento.

---

## La ayuda y los errores, gratis {: .topic-title }

```text
$ python simple_cli.py --help
usage: ask [-h] [--model MODEL] [--temperature TEMPERATURE] [-v]
           [--tags [TAGS ...]]
           question

Hace una pregunta a un modelo (simulado)

positional arguments:
  question              la pregunta, entre comillas

options:
  -h, --help            show this help message and exit
  --model MODEL         nombre del modelo (por defecto: modelo-demo)
  --temperature TEMPERATURE
                        entre 0 y 2
  -v, --verbose         más detalle
  --tags [TAGS ...]     etiquetas opcionales
```

Y cuando el uso es incorrecto, `argparse` muestra el uso, explica el problema y **termina con código 2**:

```text
$ python simple_cli.py
usage: ask [-h] [--model MODEL] [--temperature TEMPERATURE] [-v]
           [--tags [TAGS ...]]
           question
ask: error: the following arguments are required: question
exit 2
$ python simple_cli.py Hola --temperature alta
usage: ask [-h] [--model MODEL] [--temperature TEMPERATURE] [-v]
           [--tags [TAGS ...]]
           question
ask: error: argument --temperature: invalid float value: 'alta'
exit 2
```

(`exit 2` lo imprimí yo después de cada ejecución con `echo "exit $?"`.)

Con `choices` ocurre lo mismo si el valor no está permitido:

```python
# parse_list.py
import argparse

parser = argparse.ArgumentParser(prog="ask")
parser.add_argument("question")
parser.add_argument("--temperature", type=float, default=0.7)
parser.add_argument("--level", choices=["low", "high"], default="low")

print(parser.parse_args(["Hola", "--temperature", "1.5"]))
print(parser.parse_args(["--level", "high", "Hola"]))
try:
    parser.parse_args(["Hola", "--level", "medio"])
except SystemExit as error:
    print("SystemExit", error.code)
```

```text
usage: ask [-h] [--temperature TEMPERATURE] [--level {low,high}] question
ask: error: argument --level: invalid choice: 'medio' (choose from 'low', 'high')
Namespace(question='Hola', temperature=1.5, level='low')
Namespace(question='Hola', temperature=0.7, level='high')
SystemExit 2
```

- `parse_args(lista)` acepta una **lista** de argumentos en lugar de leer `sys.argv`. Es la clave para **probar** el parser sin tocar la terminal.
- Un uso incorrecto lanza **`SystemExit`** (código 2). En un test, se captura con `pytest.raises(SystemExit)`.
- Las opciones pueden ir antes o después del posicional.

---

## Subcomandos {: .topic-title }

Programas como `git commit` o `pip install` tienen **subcomandos**. Con `add_subparsers` cada uno tiene sus propios argumentos.

```python
# subcommands.py
import argparse
import sys


def main(argv=None):
    parser = argparse.ArgumentParser(prog="chatcli")
    subparsers = parser.add_subparsers(dest="command", required=True)

    ask = subparsers.add_parser("ask", help="una pregunta")
    ask.add_argument("question")

    subparsers.add_parser("chat", help="conversación interactiva")

    args = parser.parse_args(argv)
    if args.command == "ask":
        print("preguntando:", args.question)
    else:
        print("modo chat")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

```text
$ python subcommands.py ask "Hola"
preguntando: Hola
$ python subcommands.py chat
modo chat
$ python subcommands.py
usage: chatcli [-h] {ask,chat} ...
chatcli: error: the following arguments are required: command
$ python subcommands.py -h
usage: chatcli [-h] {ask,chat} ...

positional arguments:
  {ask,chat}
    ask       una pregunta
    chat      conversación interactiva

options:
  -h, --help  show this help message and exit
```

- `dest="command"` guarda qué subcomando se eligió en `args.command`.
- `required=True` obliga a elegir uno.

La estructura de `main` es la convención: **recibe `argv` opcional** (para tests), **devuelve un código de salida** (0 = bien, distinto de 0 = error) y el `if __name__ == "__main__":` lo pasa a `sys.exit`. Así otros programas y scripts pueden saber si funcionó.

!!! warning "`print` de errores a `stderr`, éxito a `stdout`"
    Los mensajes de error van por la **salida de errores** (`print(..., file=sys.stderr)`) y los resultados por la salida normal. Así `chatcli ask "x" > salida.txt` no mezcla los errores con los datos.

---

## typer: la alternativa {: .topic-title }

**Typer** (paquete de terceros, `pip install typer`) construye el CLI **a partir de los type hints** de una función. Es el mismo programa, con menos código:

```python
# typer_cli.py
import typer

app = typer.Typer()


@app.command()
def ask(question: str, model: str = "modelo-demo", temperature: float = 0.7, verbose: bool = False):
    """Hace una pregunta a un modelo (simulado)."""
    if verbose:
        print(f"modelo={model} temperatura={temperature}")
    print(f"Pregunta: {question}")


if __name__ == "__main__":
    app()
```

```bash
python typer_cli.py "Hola" --temperature 0.2 --verbose
```

```text
modelo=modelo-demo temperatura=0.2
Pregunta: Hola
```

- El parámetro sin valor por defecto (`question`) es un argumento posicional; los que tienen valor, opciones; `bool` se convierte en `--verbose / --no-verbose`.
- Con `--temperature alta` muestra un error con cuadro y colores (que depende de la terminal).
- El docstring se convierte en la descripción de `--help`.

`argparse` no necesita instalar nada y es más que suficiente para la mayoría de herramientas; `typer` merece la pena cuando el CLI crece.

---

## Python en IA {: .topic-title }

Una herramienta de línea de comandos es el primer «producto» natural de un proyecto con modelos: `chatcli ask "pregunta" --temperature 0.2`, `evaluate dataset.csv`, `index docs/`. Ventajas:

- **Se automatiza**: se llama desde scripts, tareas programadas, integración continua.
- **Se prueba**: `main(["ask", "Hola"])` y se comprueba la salida y el código.
- **Cambia parámetros sin editar código**: modelo, temperatura, archivo de entrada.

!!! tip "Opciones de línea de comandos > variables de entorno > valores por defecto"
    Un orden habitual de prioridad: lo que escribes en la línea de comandos manda sobre el entorno (`.env`), y este sobre los valores por defecto. El CLI del capítulo final lo aplica con `--model` y `--temperature`.

---

## Comparación con JavaScript {: .topic-title }

| En Node.js | En Python |
|---|---|
| `process.argv` | `sys.argv` |
| `commander`, `yargs` (paquetes) | `argparse` (estándar) |
| `process.exit(1)` | `sys.exit(1)` |
| `program.command("ask")` | `add_subparsers().add_parser("ask")` |
| `--help` automático (con la librería) | `--help` automático (`argparse`) |
| `process.stderr.write` | `print(..., file=sys.stderr)` |

!!! tip "Consejos"
    - **`main(argv=None)` + `parse_args(argv)`** para poder probar.
    - **Devuelve un código de salida** y llama a `sys.exit(main())`.
    - **`type=` y `choices=`** validan en la entrada y dan buenos mensajes.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye `argparse` ni `sys.argv` (los datos se piden con `input()`) | — |
| Entrada de dades: input() — «Com funciona input()?» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_003/#1-com-funciona-input> |
| **Documentación oficial** | |
| Módulo `argparse` | <https://docs.python.org/3/library/argparse.html> |
| `ArgumentParser.add_argument` | <https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.add_argument> |
| `ArgumentParser.add_subparsers` | <https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.add_subparsers> |
| Tutorial de `argparse` (HOWTO) | <https://docs.python.org/3/howto/argparse.html> |
| `sys.argv` | <https://docs.python.org/3/library/sys.html#sys.argv> |
| `sys.exit` | <https://docs.python.org/3/library/sys.html#sys.exit> |
| Typer en PyPI | <https://pypi.org/project/typer/> |
| Typer (repositorio) | <https://github.com/fastapi/typer> |
