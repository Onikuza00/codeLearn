# Primer script y REPL { .section-python .bloque-python }

> Hay dos formas de ejecutar Python: guardar un archivo `.py` o escribir línea a línea en el REPL. Aquí usas las dos, aprendes `print` y los comentarios, y ves cómo leer los errores.

---

## Tu primer script {: .topic-title }

Un **script** es un archivo de texto con instrucciones de Python. Lo guardas con extensión `.py` y se lo das al intérprete. Con el entorno ya activo ([capítulo anterior](../02-entorno-venv-pip/index.md)), el flujo completo:

**1. El script**, con comentarios y `print`:

```python
# greeting.py
# Esto es un comentario: Python lo ignora
print("Prompt builder")  # también se puede comentar al final de la línea
print("Modelo:", "modelo-demo")
print("Temperatura:", 0.7)
print("a", "b", "c", sep=" | ")
print("Sin salto", end=" ")
print("de línea")
print("Línea 1\nLínea 2")
```

**2. Cómo se ejecuta:**

```bash
python greeting.py
```

**3. Qué pasa por dentro.** Python lee el archivo de arriba abajo y ejecuta cada línea en orden. Los `#` y lo que va detrás se descartan. `print` escribe en la salida estándar, es decir, en la terminal.

**4. La salida:**

```text
Prompt builder
Modelo: modelo-demo
Temperatura: 0.7
a | b | c
Sin salto de línea
Línea 1
Línea 2
```

Fíjate en lo que hace cada parte:

- `print("Modelo:", "modelo-demo")` acepta varios valores y los separa con un espacio.
- `sep=" | "` cambia el separador. Su valor por defecto es un espacio.
- `end=" "` cambia lo que se escribe al final. Por defecto es un salto de línea, por eso la siguiente línea empieza en una línea nueva. Con `end=" "` no lo hay y `"de línea"` queda pegado.
- `\n` dentro de un texto es un salto de línea. Se llama **carácter de escape**.

!!! tip "`sep` y `end` solo se pueden pasar por nombre"
    Escribe `sep=" | "`, no `" | "` suelto. Si lo pones sin el nombre, Python lo trata como un valor más y lo imprime.

---

## El REPL {: .topic-title }

El **REPL** (*Read, Eval, Print, Loop*) es una consola donde escribes una instrucción, Python la ejecuta y te enseña el resultado al instante. Es tu libreta de pruebas. Lo abres escribiendo `python` sin archivo:

```text
>>> 2 + 3
5
>>> print("hola")
hola
>>> x = 10
>>> x * 2
20
>>> _ + 1
21
>>> "abc".upper()
'ABC'
```

Qué ocurre ahí:

- `>>>` es el prompt: Python espera una instrucción.
- Si escribes una **expresión** (algo que tiene valor, como `2 + 3`), el REPL muestra el resultado sin necesidad de `print`. Si es una asignación (`x = 10`), no muestra nada.
- `_` guarda el último resultado mostrado. Aquí era `20`, y por eso `_ + 1` da `21`.
- Los textos se muestran con comillas (`'ABC'`) porque el REPL enseña la representación del valor. `print` enseña el texto tal cual.

Para salir:

| Sistema | Cómo salir |
|---|---|
| Cualquiera | `exit()` y Enter |
| Windows | `Ctrl + Z` y luego Enter |
| Linux y macOS | `Ctrl + D` |

!!! warning "Los apuntes dicen «Ctrl + Z» a secas"
    `Ctrl + Z` funciona solo en Windows y hay que pulsar Enter después. En Linux y macOS la combinación es `Ctrl + D`. `exit()` vale en todos y es la más segura.

!!! tip "Cuándo REPL y cuándo script"
    REPL para probar una idea de una línea. Script en cuanto algo tenga más de tres o cuatro líneas, porque el REPL no guarda nada al salir.

---

## Leer un error {: .topic-title }

Los errores de Python son largos pero ordenados. Lo importante está en las **últimas líneas**: el tipo de error, el mensaje, y una flecha `^` que apunta al sitio.

Un texto sin cerrar:

```python
# broken_string.py
print("Hola)
```

```text
    print("Hola)
          ^
SyntaxError: unterminated string literal (detected at line 2)
```

Una variable que no existe (aquí por un error de mayúsculas):

```python
# broken_case.py
Print("x")
```

```text
NameError: name 'Print' is not defined. Did you mean: 'print'?
```

Una indentación que falta:

```python
# broken_indent.py
if True:
print("dentro")
```

```text
    print("dentro")
    ^^^^^
IndentationError: expected an indented block after 'if' statement on line 2
```

!!! warning "NameError: name '...' is not defined"
    Python distingue mayúsculas de minúsculas: `print` existe, `Print` no. También salta si usas una variable antes de crearla. Revisa el nombre carácter a carácter.

---

## Python en IA {: .topic-title }

El REPL es el sitio ideal para probar cómo se comporta el código que prepara tus prompts antes de meterlo en un script. Por ejemplo, ver qué devuelve cortar un texto o contar palabras:

```text
>>> "Explica qué es un token".split()
['Explica', 'qué', 'es', 'un', 'token']
>>> len(_)
5
```

Y `print` va a ser tu herramienta de depuración número uno: antes de enviar un prompt a un modelo, imprímelo y míralo. Es la forma más rápida de descubrir un espacio sobrante o una variable vacía.

!!! tip "Imprime lo que vas a enviar"
    Si el modelo responde algo raro, muchas veces el problema está en el prompt que construiste. Un `print(prompt)` justo antes de enviarlo te lo enseña.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `console.log("hola")` | `print("hola")` |
| `// comentario` | `# comentario` |
| `/* varios */` | No existe; se usa `#` en cada línea |
| `node archivo.js` | `python archivo.py` |
| `node` (REPL) | `python` (REPL) |
| Salir: `.exit` o `Ctrl + C` dos veces | Salir: `exit()` |
| Los errores salen en la consola del navegador | Los errores salen en la terminal, con traza |

!!! tip "Consejos"
    - **Ejecuta desde la carpeta del archivo**, o pasa la ruta completa: `python carpeta/archivo.py`.
    - **Primera línea del archivo con su nombre en un comentario** (`# greeting.py`): ayuda a identificar el script cuando copias fragmentos.
    - **Si sale `python` no reconocido en Windows**, prueba con `py archivo.py` (el lanzador de Python para Windows).

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Un tastet — apartado «Escrivim quelcom» (`print`, `sep`, `end`, `\n`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_002/#escrivim-quelcom> |
| Un tastet — «Exemples de print()» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_002/#exemples-de-print> |
| L'entorn de desenvolupament — «Mode interactiu» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_001/#mode-interactiu> |
| L'entorn de desenvolupament — «Instal·lació de Python en Windows» (salir con `exit()`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_001/#installacio-de-python-en-windows> |
| **Documentación oficial** | |
| Tutorial — Invocar el intérprete (Ctrl-D / Ctrl-Z, `quit()`) | <https://docs.python.org/3/tutorial/interpreter.html#invoking-the-interpreter> |
| Tutorial — Modo interactivo | <https://docs.python.org/3/tutorial/interpreter.html#interactive-mode> |
| Biblioteca — `print()` | <https://docs.python.org/3/library/functions.html#print> |
| Referencia — Comentarios | <https://docs.python.org/3/reference/lexical_analysis.html#comments> |
| Referencia — Indentación | <https://docs.python.org/3/reference/lexical_analysis.html#indentation> |
| Tutorial — Errores y excepciones | <https://docs.python.org/3/tutorial/errors.html#handling-exceptions> |
