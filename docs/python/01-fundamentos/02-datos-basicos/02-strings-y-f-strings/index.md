# Strings y f-strings { .section-python .bloque-python }

> Un string es texto, y casi todo en IA es texto. Aquí aprendes los métodos que más vas a usar, a cortar con slicing y a construir mensajes con f-strings.

---

## Métodos de texto {: .topic-title }

Un **string** (`str`) es una secuencia de caracteres entre comillas, simples o dobles. Da igual cuál uses, pero sé coherente.

Los **métodos** son funciones que van pegadas al valor con un punto: `texto.lower()`. Los de texto no modifican el original, **devuelven uno nuevo** (los textos son inmutables, lo viste en [Variables y tipos](../01-variables-y-tipos/index.md)).

El flujo completo:

**1. El script**

```python
# methods.py
raw = "   ¿Qué es un TOKEN?  \n"

print(repr(raw.strip()))
print(raw.strip().lower())
print(raw.strip().upper())
print(raw.strip().split())
print("-".join(["system", "user", "assistant"]))
print("Hola Miguel".replace("Miguel", "Ana"))
print("/model gpt".startswith("/"))
print("token" in raw.lower())
print(len("café"), len("hola"))
print("hola".find("l"), "hola".find("z"))
print("ab" * 3)
```

**2. Cómo se ejecuta**

```bash
python methods.py
```

**3. Qué pasa por dentro.** Cada método parte del texto original y devuelve otro. Se pueden encadenar: `raw.strip().lower()` limpia y luego pasa a minúsculas. `repr()` enseña el texto con sus comillas y sus caracteres ocultos (`\n`).

**4. La salida**

```text
'¿Qué es un TOKEN?'
¿qué es un token?
¿QUÉ ES UN TOKEN?
['¿Qué', 'es', 'un', 'TOKEN?']
system-user-assistant
Hola Ana
True
True
4 4
2 -1
ababab
```

| Método | Qué hace |
|---|---|
| `strip()` | Quita espacios y saltos al principio y al final |
| `lower()` / `upper()` | Minúsculas / mayúsculas |
| `split()` | Parte por espacios y devuelve una **lista** de palabras |
| `"-".join(lista)` | Une los elementos de una lista usando `-` en medio |
| `replace(a, b)` | Cambia `a` por `b` |
| `startswith(x)` | ¿Empieza por `x`? |
| `find(x)` | Posición de `x`, o `-1` si no está |
| `x in texto` | ¿Está `x` dentro del texto? |
| `len(texto)` | Número de caracteres |

!!! warning "Un método no cambia la variable"
    `text.upper()` devuelve el texto en mayúsculas pero `text` sigue igual. Si quieres quedarte con el resultado, asígnalo: `text = text.upper()`.

!!! tip "`join` se escribe al revés"
    Si vienes de JavaScript, es justo al revés: allí es `lista.join("-")`; en Python es `"-".join(lista)`. El separador es el que llama al método.

---

## Slicing {: .topic-title }

El **slicing** corta un trozo de un texto con `[inicio:fin]`. El inicio se incluye y el fin **no**. Los índices empiezan en 0 y los negativos cuentan desde el final.

```python
# slicing.py
prompt = "Explica qué es Python"

print(prompt[0])
print(prompt[-1])
print(prompt[0:7])
print(prompt[7:])
print(prompt[:-6])
print(prompt[::2])
print(prompt[::-1])
print(prompt[:100])
```

```text
E
n
Explica
 qué es Python
Explica qué es 
Epiaqée yhn
nohtyP se éuq acilpxE
Explica qué es Python
```

Cómo leerlo:

- `prompt[0]` es el primero y `prompt[-1]` el último.
- `prompt[0:7]` toma desde el 0 hasta el 6. Si omites el inicio o el fin, llega hasta ese extremo.
- `prompt[::2]` salta de dos en dos. `prompt[::-1]` recorre al revés.
- `prompt[:100]` no da error aunque el texto sea más corto: el slicing se corta solo. Es muy cómodo para recortar un prompt a un máximo de caracteres.

!!! warning "IndexError con un solo índice"
    `prompt[100]` sí da `IndexError: string index out of range`. Un índice suelto exige que exista; un slice no.

---

## f-strings {: .topic-title }

Una **f-string** es un texto con una `f` delante que acepta expresiones entre llaves. Es la forma moderna de construir mensajes.

Compara las dos formas de construir lo mismo:

```python
# fstrings.py
model_name = "modelo-demo"
temperature = 0.7234
price = 1234.5
ratio = 0.256

print(f"Modelo: {model_name}")
print(f"Temperatura: {temperature:.2f}")
print(f"Doble: {temperature * 2:.1f}")
print(f"Precio: {price:,.2f}")
print(f"Porcentaje: {ratio:.1%}")
print(f"[{model_name:>15}]")
print(f"[{model_name:<15}]")
print(f"[{model_name:^15}]")
print(f"{model_name=}")
print(f"{{llaves}} literales y {model_name!r}")
print("Modelo: " + model_name + " | T: " + str(temperature))
```

```text
Modelo: modelo-demo
Temperatura: 0.72
Doble: 1.4
Precio: 1,234.50
Porcentaje: 25.6%
[    modelo-demo]
[modelo-demo    ]
[  modelo-demo  ]
model_name='modelo-demo'
{llaves} literales y 'modelo-demo'
Modelo: modelo-demo | T: 0.7234
```

Entre las llaves va cualquier expresión (`temperature * 2`). Detrás de los dos puntos va el **formato**:

| Formato | Significa | Ejemplo |
|---|---|---|
| `:.2f` | 2 decimales | `0.72` |
| `:,.2f` | Separador de miles y 2 decimales | `1,234.50` |
| `:.1%` | Porcentaje con 1 decimal | `25.6%` |
| `:>15` / `:<15` / `:^15` | Alinear a derecha / izquierda / centro en 15 huecos | `[    modelo-demo]` |
| `=` | Escribe el nombre y el valor | `model_name='modelo-demo'` |
| `!r` | Usa `repr()` (con comillas) | `'modelo-demo'` |
| `{{` y `}}` | Una llave literal | `{llaves}` |

La última línea es la forma antigua, con `+`: hay que convertir con `str()` y es más larga. Con la f-string no hace falta convertir nada.

!!! warning "Falta la `f`"
    `print("Hola {name}")` sin la `f` imprime literalmente `Hola {name}`. Y si el nombre de la llave no existe, falla:

    ```text
    NameError: name 'nombre' is not defined
    ```

    Es lo que pasa con `print(f"Hola {nombre}")` si la variable se llama `name`.

---

## Triple comilla y prompts {: .topic-title }

Con tres comillas (`"""`) el texto puede ocupar varias líneas. Es lo habitual para escribir un prompt largo. Y se puede combinar con la `f`:

```python
# triple.py
model_name = "modelo-demo"
question = "¿Qué es un token?"

prompt = f"""Eres un asistente de {model_name}.
Responde en español y de forma breve.

Pregunta: {question}"""

print(prompt)
print(len(prompt.splitlines()), "líneas")

bad = """
Primera línea
"""
print(repr(bad))
print(repr(bad.strip()))
print("Ruta: C:\nuevo", "|", r"C:\nuevo")
```

```text
Eres un asistente de modelo-demo.
Responde en español y de forma breve.

Pregunta: ¿Qué es un token?
4 líneas
'\nPrimera línea\n'
'Primera línea'
Ruta: C:
uevo | C:\nuevo
```

Tres cosas a ver:

- El texto se respeta tal cual: saltos de línea incluidos. Por eso la sangría de dentro de las comillas **cuenta**. No indentes el contenido del prompt como si fuera código.
- Si abres con las comillas en una línea y empiezas el texto en la siguiente, el texto lleva un `\n` al principio y otro al final. `strip()` los limpia.
- `\n` dentro de un texto es un salto de línea, también en `"C:\nuevo"`. Un **raw string** (`r"..."`) desactiva los escapes y es útil en rutas de Windows y en expresiones regulares.

---

## Python en IA {: .topic-title }

Un prompt es un string. Construirlo bien es la mitad del trabajo, y las f-strings son la herramienta:

```python
# build_prompt.py
system_prompt = "Eres un asistente breve."
question = "  ¿Qué es un token?  "

prompt = f"{system_prompt}\n\nPregunta: {question.strip()}"
print(prompt)
print(len(prompt.split()), "palabras")
```

```text
Eres un asistente breve.

Pregunta: ¿Qué es un token?
9 palabras
```

Dos cuidados:

- **Limpia la entrada** con `strip()` antes de meterla en el prompt. Un espacio sobrante es un carácter más que envías.
- **Cuenta con `split()`** si necesitas una medida rápida del tamaño. Las palabras no son tokens, pero sirven para vigilar el tamaño.

!!! warning "No metas texto del usuario en el prompt sin mirar"
    Si el texto del usuario va dentro del prompt, el usuario puede escribir instrucciones en él («ignora lo anterior...»). Una f-string lo inserta sin filtrar. Es un riesgo conocido de los sistemas con modelos de lenguaje; conviene marcar claramente en el prompt dónde empieza y dónde acaba el texto del usuario.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `` `Hola ${name}` `` (template literal) | `f"Hola {name}"` |
| `` `varias\nlíneas` `` | `"""varias líneas"""` |
| `name.trim()` | `name.strip()` |
| `name.toLowerCase()` | `name.lower()` |
| `lista.join("-")` | `"-".join(lista)` |
| `texto.includes("a")` | `"a" in texto` |
| `texto.slice(0, 7)` | `texto[0:7]` |
| `texto.length` | `len(texto)` |
| `texto.split(" ")` | `texto.split()` (y también `split(" ")`) |

!!! tip "Consejos"
    - **Usa `.strip().lower()` al leer** respuestas del usuario antes de comparar.
    - **`repr()` y `{x!r}`** enseñan los espacios y los saltos ocultos cuando algo no coincide.
    - **Comillas:** si el texto lleva comillas dobles dentro, usa simples por fuera: `'Dijo "hola"'`.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Entrada de dades: input() — apartado «Pràctica guiada: el generador de rutes» (concatenar con `+`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_003/#4-practica-guiada-el-generador-de-rutes> |
| Variables i Tipus de Dades en Sistemes — «Tipats en Python» (`str()` para concatenar) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_004/#tipats-en-python> |
| Caixa d'eines — «Treballar amb text i llistes» (`len`, `in`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_901/#3-treballar-amb-text-i-llistes> |
| **Documentación oficial** | |
| Tutorial — Texto (strings y slicing) | <https://docs.python.org/3/tutorial/introduction.html#text> |
| Biblioteca — Métodos de `str` | <https://docs.python.org/3/library/stdtypes.html#string-methods> |
| Tutorial — Literales de cadena formateados | <https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals> |
| Referencia — f-strings | <https://docs.python.org/3/reference/lexical_analysis.html#f-strings> |
| Biblioteca — Mini-lenguaje de especificación de formato | <https://docs.python.org/3/library/string.html#format-specification-mini-language> |
| `len()` | <https://docs.python.org/3/library/functions.html#len> |
