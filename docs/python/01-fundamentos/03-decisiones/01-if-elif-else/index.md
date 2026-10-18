# if / elif / else { .section-python .bloque-python }

> Un programa decide con `if`. En Python el bloque se marca con dos puntos y con la indentación, y los valores vacíos también cuentan como falsos. Aquí ves las condiciones completas, de principio a fin.

---

## if, elif y else {: .topic-title }

Un `if` ejecuta un bloque solo si su condición es verdadera. Con `elif` (de *else if*) añades más condiciones y con `else` cubres todo lo demás.

El flujo completo, con la temperatura de un modelo:

**1. El script**

```python
# temperature_level.py
temperature = float(input("Temperatura (0 a 2): "))

if temperature < 0 or temperature > 2:
    print("Fuera de rango")
elif temperature == 0:
    print("Determinista")
elif temperature <= 1:
    print("Equilibrado")
else:
    print("Muy creativo")

print("Fin del script")
```

**2. Cómo se ejecuta**

```bash
python temperature_level.py
```

**3. Qué pasa por dentro.** Python evalúa las condiciones **de arriba abajo** y ejecuta solo el primer bloque cuya condición sea verdadera. Después salta al final de toda la cadena. La última línea, sin sangría, se ejecuta siempre.

**4. La salida**, probando cuatro valores:

```text
Temperatura (0 a 2): -1
Fuera de rango
Fin del script
```

```text
Temperatura (0 a 2): 0
Determinista
Fin del script
```

```text
Temperatura (0 a 2): 0.7
Equilibrado
Fin del script
```

```text
Temperatura (0 a 2): 1.5
Muy creativo
Fin del script
```

Con `0.7`, la condición `temperature <= 1` es la primera que se cumple. Python ya no mira el `else`.

---

## Los dos puntos y la indentación {: .topic-title }

Aquí está lo que más diferencia a Python:

- **Los dos puntos (`:`)** cierran la línea del `if`, `elif` y `else`. Dicen «ahora empieza el bloque».
- **La indentación** (4 espacios por convención) marca qué líneas pertenecen al bloque. No hay llaves.

Lo que tiene sangría se ejecuta solo si se cumple la condición. Lo que no, se ejecuta siempre.

!!! warning "SyntaxError: expected ':'"
    Olvidar los dos puntos:

    ```python
    # no_colon.py
    x = 1
    if x == 1
        print("uno")
    ```

    ```text
        if x == 1
                 ^
    SyntaxError: expected ':'
    ```

!!! warning "IndentationError"
    Si la sangría no es coherente, Python no adivina:

    ```text
    IndentationError: unindent does not match any outer indentation level
    ```

    Usa siempre 4 espacios y no mezcles tabuladores con espacios. El editor lo hace por ti.

---

## Comparaciones y operadores lógicos {: .topic-title }

| Operador | Significa |
|---|---|
| `==` / `!=` | Igual / distinto |
| `<` `>` `<=` `>=` | Menor, mayor, menor o igual, mayor o igual |
| `and` | Las dos condiciones son verdaderas |
| `or` | Al menos una es verdadera |
| `not` | Invierte el resultado |
| `in` / `not in` | Está / no está dentro de algo |

```python
# chained.py
temperature = 0.7

print(0 <= temperature <= 1)
print(temperature > 0 and temperature < 1)
print(not temperature > 1)
print("a" < "b", "Z" < "a", 3 != 4)
print("gpt" in "gpt-demo", "x" not in "abc")
```

```text
True
True
True
True True True
True True
```

Lo que hay que ver:

- `0 <= temperature <= 1` es una **comparación encadenada**: se lee como en matemáticas. Es equivalente a la línea de abajo con `and`, pero más limpia.
- Los textos se comparan por orden de caracteres, y las mayúsculas van antes que las minúsculas (`"Z" < "a"`).
- `in` sirve para texto y para casi cualquier colección.

!!! warning "SyntaxError con `=` en un if"
    `=` guarda un valor; `==` compara. Si escribes `if x = 1:`, Python te corrige:

    ```text
    SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
    ```

---

## Verdadero y falso {: .topic-title }

En un `if` no hace falta que la condición sea un booleano. Python acepta cualquier valor y lo trata como verdadero o falso. Son **falsos**: `False`, `None`, `0`, `0.0`, el texto vacío `""` y las colecciones vacías (`[]`, `{}`). Todo lo demás es verdadero.

```python
# truthy.py
system_prompt = ""
history = []

if not system_prompt:
    print("Sin system prompt")
if not history:
    print("Historial vacío")

user_text = ""
shown = user_text or "(vacío)"
print(shown)
print(0 or "x", "a" and "b", None or 0)
```

```text
Sin system prompt
Historial vacío
(vacío)
x b 0
```

- `if not system_prompt:` cubre a la vez «no existe» (`None`) y «está vacío» (`""`).
- `or` y `and` **no devuelven `True` o `False`**: devuelven uno de sus dos operandos. `user_text or "(vacío)"` da el primero si es verdadero y, si no, el segundo. Es un valor por defecto en una línea.
- `0 or "x"` da `"x"`; `"a" and "b"` da `"b"`; `None or 0` da `0`.

!!! warning "Los textos '0' y 'False' son verdaderos"
    Tienen contenido, así que `bool("0")` y `bool("False")` dan `True`. Para decidir con lo que escribe un usuario, compara con `==`.

---

## `is` frente a `==` {: .topic-title }

- `==` pregunta si dos valores **son iguales**.
- `is` pregunta si son **el mismo objeto**.

```python
# is_vs_eq.py
first = [1, 2]
second = [1, 2]
print(first == second, first is second)

system_prompt = None
if system_prompt is None:
    print("No hay system prompt")
print(system_prompt == None)
```

```text
True False
No hay system prompt
True
```

Las dos listas valen lo mismo pero son dos objetos distintos. La regla: usa `is` y `is not` **solo con `None`** (y con `True`/`False` si de verdad lo necesitas). Para todo lo demás, `==`.

!!! warning "SyntaxWarning al usar `is` con un texto"
    ```python
    # is_literal.py
    name = "gpt"
    print(name is "gpt")
    ```

    ```text
    SyntaxWarning: "is" with 'str' literal. Did you mean "=="?
    True
    ```

    Puede dar `True` por casualidad, pero no es fiable. Python avisa porque casi siempre es un error.

---

## El condicional en una línea {: .topic-title }

Para elegir entre **dos valores**, existe la expresión condicional (el «ternario»): `valor_si_cierto if condición else valor_si_falso`.

```python
# ternary.py
temperature = 1.4
mood = "creativo" if temperature > 1 else "preciso"
print(mood)
count = 1
print(f"{count} mensaje" + ("s" if count != 1 else ""))
```

```text
creativo
1 mensaje
```

El orden es distinto al de JavaScript (`condición ? a : b`): primero va el valor, luego el `if`.

---

## Python en IA {: .topic-title }

Las decisiones con `if` están por todas partes cuando preparas una petición a un modelo:

- **¿Hay system prompt?** `if system_prompt:` añade el bloque solo si no está vacío.
- **¿La temperatura está en rango?** Una comparación encadenada, `0 <= temperature <= 2`.
- **¿El prompt es demasiado largo?** Compara un tamaño aproximado con un máximo antes de enviar nada.
- **¿Llegó respuesta o `None`?** `if reply is None:` para tratar el caso sin respuesta.

!!! tip "Valida antes de gastar"
    Cada petición real a un modelo tiene un coste y un tiempo. Un `if` antes de enviar es gratis. Comprobar entradas vacías, rangos y longitud antes de la llamada evita errores y gasto. Lo verás aplicado en el [script final del pilar](../../05-python-en-ia/01-del-script-al-prompt/index.md).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `if (x > 1) { ... }` | `if x > 1:` y bloque con sangría |
| `else if` | `elif` |
| `a && b` | `a and b` |
| <code>a &#124;&#124; b</code> | `a or b` |
| `!a` | `not a` |
| `===` `!==` | `==` `!=` |
| `a ? b : c` | `b if a else c` |
| `0`, `""`, `null`, `undefined`, `NaN` son falsy | `0`, `""`, `None`, `[]`, `{}` son falsos |
| `[]` es truthy | `[]` es falso |
| `x ?? "defecto"` | `x if x is not None else "defecto"` |

!!! tip "Consejos"
    - **Una sola condición, una sola idea.** Si el `if` necesita media línea de `and`/`or`, guarda partes en variables con nombre (`is_valid = ...`).
    - **Casos muy simples y de valores exactos:** cuando comparas una variable contra muchos valores concretos, mira [match / case](../02-match-case/index.md).
    - **No compares con `True`:** `if is_valid:` mejor que `if is_valid == True:`.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Condicionals. Prenem decisions — «L'estructura bàsica: if i else» (y «El secret més important de Python: els dos punts i la indentació») | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_005/#1-lestructura-basica-if-i-else> |
| Condicionals. Prenem decisions — «Com comparem coses? (operadors de comparació)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_005/#2-com-comparem-coses-operadors-de-comparacio> |
| Condicionals. Prenem decisions — «Què passa si hi ha més de dues opcions? (elif)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_005/#3-que-passa-si-hi-ha-mes-de-dues-opcions-elif> |
| Condicionals. Prenem decisions — «Pràctica guiada» (`or` en una condición) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_005/#4-practica-guiada-comprovar-els-privilegis-dinstallacio> |
| **Documentación oficial** | |
| Tutorial — Sentencias `if` | <https://docs.python.org/3/tutorial/controlflow.html#if-statements> |
| Referencia — La sentencia `if` | <https://docs.python.org/3/reference/compound_stmts.html#the-if-statement> |
| Biblioteca — Comprobación de valores de verdad | <https://docs.python.org/3/library/stdtypes.html#truth-value-testing> |
| Biblioteca — Operaciones booleanas `and`, `or`, `not` | <https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not> |
| Biblioteca — Comparaciones | <https://docs.python.org/3/library/stdtypes.html#comparisons> |
| Referencia — Expresiones condicionales | <https://docs.python.org/3/reference/expressions.html#conditional-expressions> |
| Referencia — Indentación | <https://docs.python.org/3/reference/lexical_analysis.html#indentation> |
