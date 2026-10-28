# Qué es Python { .section-python .bloque-python }

> Python es un lenguaje pensado para que el código se lea casi como una frase. Aquí ves qué es, cómo se ejecuta un script por dentro y por qué su tipado sorprende a quien viene de JavaScript.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/TkN2i-_4N4g?start=32" title="¿Qué es Python y sus características? (00:32 – 05:31) — Curso completo de Python" loading="lazy" allowfullscreen></iframe>
</div>

---

## Un lenguaje que se lee {: .topic-title }

**Python** es un lenguaje de programación de propósito general. Lo creó Guido van Rossum y salió en 1991. Su idea central: que el código sea fácil de leer.

La prueba es que no usa llaves para agrupar. Usa **indentación** (los espacios al principio de la línea). Compara:

```python
# structure.py
temperature = 0.7

if temperature > 1:
    print("Muy creativo")
else:
    print("Más predecible")
```

Salida:

```text
Más predecible
```

Sin `{}`, sin `;`, sin paréntesis en el `if`. Los dos puntos abren el bloque y la indentación lo delimita. Las reglas de la indentación las tienes en [if / elif / else](../../03-decisiones/01-if-elif-else/index.md).

!!! tip "«Python» y «CPython» no son lo mismo"
    **Python** es el lenguaje: unas reglas escritas. **CPython** es el programa que las ejecuta y el que instalas desde python.org. Existen otros, pero casi siempre hablas de CPython. Lo puedes comprobar desde el propio código:

    ```python
    # implementation.py
    import sys

    print(sys.implementation.name)
    print(sys.version_info.major, sys.version_info.minor)
    ```

    ```text
    cpython
    3 13
    ```

---

## Cómo se ejecuta un script {: .topic-title }

Vamos de principio a fin con un script de tres líneas.

**1. El script**, guardado en un archivo con extensión `.py`:

```python
# hello.py
model_name = "modelo-demo"
print(f"Hola desde {model_name}")
```

**2. Cómo se ejecuta**, desde la terminal, en la carpeta del archivo:

```bash
python hello.py
```

**3. Qué pasa por dentro.** No hace falta compilar a mano. CPython lee tu texto, lo traduce a **bytecode** (instrucciones sencillas, internas) y una máquina virtual las ejecuta una a una. Puedes verlas con el módulo `dis`:

```bash
python -m dis hello.py
```

```text
  2           LOAD_CONST               0 ('modelo-demo')
              STORE_NAME               0 (model_name)

  3           LOAD_NAME                1 (print)
              PUSH_NULL
              LOAD_CONST               1 ('Hola desde ')
              LOAD_NAME                0 (model_name)
              FORMAT_SIMPLE
              BUILD_STRING             2
              CALL                     1
              POP_TOP
              RETURN_CONST             2 (None)
```

Cada línea de tu código se convierte en unas pocas instrucciones. Las de arriba pueden cambiar entre versiones de Python; lo importante es la idea.

**4. La salida:**

```text
Hola desde modelo-demo
```

!!! warning "«Interpretado» no significa «sin compilar»"
    Se suele decir que Python es interpretado y no compilado. Es una simplificación. La documentación oficial lo matiza: es interpretado, pero hay un compilador a bytecode por el medio. Para ti la consecuencia práctica es la misma: ejecutas el archivo directamente, sin paso de compilación.

---

## Tipado dinámico y fuerte {: .topic-title }

Dos palabras que se confunden mucho:

- **Dinámico:** una variable no lleva el tipo escrito. El tipo lo tiene el **valor**, y se decide al ejecutar.
- **Fuerte:** Python no mezcla tipos por su cuenta. Si quieres sumar un número y un texto, tienes que convertir tú.

Vamos al flujo completo:

```python
# typing_demo.py
amount = 5
text = "3"

print(amount + int(text))
print(text * 2)
print(amount + text)
```

```text
8
33
Traceback (most recent call last):
  File "...\typing_demo.py", line 7, in <module>
    print(amount + text)
          ~~~~~~~^~~~~
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

Las dos primeras líneas funcionan: `int(text)` convierte a mano y `"3" * 2` repite el texto. La tercera falla, y Python se niega a adivinar. Eso es ser fuerte.

!!! warning "TypeError: unsupported operand type(s)"
    Aparece cuando mezclas tipos que Python no sabe combinar, como `5 + "3"`. La solución es convertir uno de los dos: `5 + int("3")` o `str(5) + "3"`. Cómo convertir bien lo tienes en [Entrada y conversión](../../02-datos-basicos/03-entrada-y-conversion/index.md).

---

## Python en IA {: .topic-title }

Cuando trabajas con modelos de lenguaje, Python suele ser el lenguaje en el que te encuentras las librerías, los SDK de los proveedores y los ejemplos. Por eso este bloque existe.

Dos razones prácticas:

- **Pega cosas.** Lees un archivo, limpias texto, montas un prompt y llamas a una API en el mismo script, sin ceremonia.
- **Lo pesado va por debajo.** Las librerías de cálculo numérico suelen estar escritas en lenguajes más rápidos y tú las llamas desde Python.

!!! tip "El tipado fuerte te protege con los prompts"
    Un prompt es texto. Un parámetro como la temperatura es un número. Si mezclas los dos al construir una petición, Python te avisa con un `TypeError` en lugar de enviar algo raro. Es un error fácil de arreglar y mejor que descubrirlo en la respuesta del modelo.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| Bloques con `{ }` | Bloques con `:` e indentación |
| `;` opcional al final | Sin `;` |
| Node.js ejecuta el código | CPython ejecuta el código |
| `"5" + 3` da `"53"` (convierte solo) | `"5" + 3` da `TypeError` |
| `npm` y `package.json` | `pip` y `requirements.txt` (en el siguiente capítulo) |
| `undefined` y `null` | Solo `None` |

!!! tip "Consejos"
    - **Comprueba tu versión** con `python --version` antes de seguir. Usa siempre Python 3; Python 2 ya no tiene soporte.
    - **Prueba una línea rápida** sin crear archivo: `python -c "print(2 + 3)"`.
    - **Mira la filosofía del lenguaje** con `python -c "import this"`: imprime el «Zen de Python».

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Introducción — qué es Python, tipado dinámico y fuerte, versiones | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_000/> |
| Introducción — apartado «Una mica d'història» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_000/#una-mica-dhistoria> |
| L'entorn de desenvolupament — apartado «Característiques» (interpretado, tipado) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_001/#caracteristiques> |
| **Documentación oficial** | |
| Glosario — «interpreted» | <https://docs.python.org/3/glossary.html#term-interpreted> |
| Glosario — «bytecode» | <https://docs.python.org/3/glossary.html#term-bytecode> |
| Referencia — Objetos, valores y tipos | <https://docs.python.org/3/reference/datamodel.html#objects-values-and-types> |
| `sys.implementation` | <https://docs.python.org/3/library/sys.html#sys.implementation> |
| `python -m` (opciones de línea de comandos) | <https://docs.python.org/3/using/cmdline.html#cmdoption-m> |
| Python 2 ha llegado al final de su vida | <https://www.python.org/doc/sunset-python-2/> |
| **Vídeo** | |
| Vídeo de apoyo — «¿Qué es Python y sus características?» (desde 00:32) | <https://www.youtube.com/watch?v=TkN2i-_4N4g&t=32s> |
