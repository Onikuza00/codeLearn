# Variables y tipos { .section-python .bloque-python }

> En Python una variable es un nombre que apunta a un valor, y el tipo vive en el valor. Aquí ves los tipos básicos, cómo comprobarlos y por qué dos nombres pueden apuntar al mismo objeto.

---

## Una variable es un nombre {: .topic-title }

Una **variable** es un nombre que se pega a un valor. Se crea con `=`, sin `let` ni `const`.

Piensa en una etiqueta adhesiva. El valor es el objeto y la etiqueta es el nombre. Puedes despegarla y pegarla en otro objeto cuando quieras.

!!! warning "No es una caja con el valor dentro"
    Los apuntes de la escuela hablan de «espacio de memoria» y de «caja». Sirve para empezar, pero engaña. En Python el nombre **apunta** al valor; no lo contiene. Lo ves cuando dos nombres señalan el mismo valor (más abajo).

El flujo completo, con la configuración de un modelo:

**1. El script**

```python
# config.py
model_name = "modelo-demo"
temperature = 0.7
max_tokens = 256
use_history = True
system_prompt = None

print(model_name, type(model_name))
print(temperature, type(temperature))
print(max_tokens, type(max_tokens))
print(use_history, type(use_history))
print(system_prompt, type(system_prompt))
```

**2. Cómo se ejecuta**

```bash
python config.py
```

**3. Qué pasa por dentro.** Cada línea crea un valor y le pega un nombre. `type(...)` pregunta a ese valor de qué clase es.

**4. La salida**

```text
modelo-demo <class 'str'>
0.7 <class 'float'>
256 <class 'int'>
True <class 'bool'>
None <class 'NoneType'>
```

---

## Los tipos básicos {: .topic-title }

| Tipo | Qué guarda | Ejemplo |
|---|---|---|
| `str` | Texto | `"modelo-demo"` |
| `int` | Enteros, sin límite de tamaño | `256` |
| `float` | Decimales | `0.7` |
| `bool` | Verdadero o falso (con mayúscula inicial) | `True`, `False` |
| `NoneType` | Ausencia de valor, su único valor es `None` | `None` |

`None` es lo que usas cuando algo todavía no tiene valor, como un system prompt opcional. Es el `null` de Python (no existe `undefined`).

Y `type()` es la herramienta para comprobar qué tienes delante. Hay un par de operaciones con números que conviene ver ya:

```python
# dynamic.py
value = 5
print(type(value))
value = "cinco"
print(type(value))

print(7 / 2, 7 // 2, 7 % 2, 2 ** 10)
print(0.1 + 0.2)
print(2 ** 100)
print(type(7 / 2), type(7 // 2))
print(round(2.5), round(3.5), round(0.7123, 2))
print(isinstance(True, int), True + True)
```

```text
<class 'int'>
<class 'str'>
3.5 3 1 1024
0.30000000000000004
1267650600228229401496703205376
<class 'float'> <class 'int'>
2 4 0.71
True 2
```

Qué enseña cada línea:

- `value` cambia de `int` a `str`: es el **tipado dinámico**. El tipo es del valor, no del nombre. Ya lo viste en [Qué es Python](../../01-inicio/01-que-es-python/index.md).
- `/` siempre da `float`. `//` es la división entera y `%` el resto. `**` es la potencia.
- `0.1 + 0.2` no da `0.3` exacto. Es normal en los decimales de coma flotante y pasa también en JavaScript.
- Un `int` no se desborda: `2 ** 100` sale entero y completo.
- `round(2.5)` da `2` y `round(3.5)` da `4`: Python redondea al par más cercano cuando está justo en medio.
- `bool` es un caso especial de `int`: `True + True` vale `2`.

!!! warning "ZeroDivisionError"
    `7 / 0` lanza `ZeroDivisionError`. Es un error de ejecución, no de sintaxis: el código está bien escrito pero la operación no tiene sentido.

---

## Dos nombres, un mismo valor {: .topic-title }

Esto es lo que rompe el modelo de la caja:

```python
# names.py
first = [1, 2]
second = first
second.append(3)
print(first)
print(first is second)

count = 10
other = count
other = other + 1
print(count, other)
```

```text
[1, 2, 3]
True
10 11
```

La lista (`[1, 2]`, la verás en el pilar de estructuras de datos) tiene dos etiquetas: `first` y `second`. Al añadir un elemento por `second`, `first` también lo ve, porque es **el mismo objeto**. `is` lo confirma.

Con `count` no pasa. `other = other + 1` no modifica el `10`: crea un `11` nuevo y pega ahí la etiqueta.

La diferencia es la **mutabilidad**. Un valor **mutable** (como una lista) se puede cambiar en el sitio. Uno **inmutable** (número, texto, `None`) no se cambia nunca: se crea otro.

```python
# immutable.py
text = "hola"
try:
    text[0] = "H"
except TypeError as error:
    print(error)

text = "H" + text[1:]
print(text)
```

```text
'str' object does not support item assignment
Hola
```

El texto no se puede modificar letra a letra. Lo que haces es construir otro y re-apuntar el nombre. El `try/except` se explica en [Entrada y conversión](../03-entrada-y-conversion/index.md); aquí basta con saber que el error se captura y se imprime.

!!! tip "`is` compara identidad, `==` compara valor"
    `first is second` pregunta «¿son el mismo objeto?». `first == second` pregunta «¿valen lo mismo?». Para comparar valores usa `==`. Más en [if / elif / else](../../03-decisiones/01-if-elif-else/index.md).

---

## Nombres y constantes {: .topic-title }

Un nombre puede tener letras, números y `_`, pero no empezar por número, y distingue mayúsculas (`Model` y `model` son distintos). La convención de Python (PEP 8) es **snake_case**: minúsculas separadas por guiones bajos.

| Mal | Bien |
|---|---|
| `x = "modelo-demo"` | `model_name = "modelo-demo"` |
| `t = 0.7` | `temperature = 0.7` |
| `flag = True` | `use_history = True` |

Python no tiene `const`. Por convención, lo que no debe cambiar se escribe en MAYÚSCULAS:

```python
# constants.py
MAX_TOKENS = 256
print(f"{MAX_TOKENS=}")
```

```text
MAX_TOKENS=256
```

Python no te impide reasignarla. Es un aviso para quien lea el código.

!!! warning "Los valores vacíos cuentan como falsos"
    `bool(0)`, `bool("")`, `bool(None)` y `bool([])` dan `False`, pero `bool("0")` da `True` porque es un texto con contenido. Lo desarrolla [if / elif / else](../../03-decisiones/01-if-elif-else/index.md#verdadero-y-falso).

---

## Python en IA {: .topic-title }

Los parámetros de una llamada a un modelo son justo estos tipos: el nombre del modelo es un `str`, la temperatura un `float`, el máximo de tokens un `int`, «usar streaming» un `bool` y un system prompt opcional un `str` o `None`.

El error clásico es el tipo equivocado: una temperatura que llega como `"0.7"` (texto) en lugar de `0.7`. Con `type()` lo detectas al instante:

```python
# check_type.py
temperature = "0.7"
print(type(temperature))
print(type(float(temperature)))
```

```text
<class 'str'>
<class 'float'>
```

!!! tip "Agrupa la configuración arriba del archivo"
    Pon `MODEL_NAME`, `TEMPERATURE` y `MAX_TOKENS` juntas al principio, en mayúsculas. Cambiar un valor es tocar una línea, y quien lee el script ve la configuración de un vistazo. Es el patrón del [script final del pilar](../../05-python-en-ia/01-del-script-al-prompt/index.md).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `let` / `const` | Solo `=` (sin palabra clave) |
| `typeof x` | `type(x)` |
| `number` (entero y decimal) | `int` y `float` por separado |
| `null` y `undefined` | `None` |
| `true` / `false` | `True` / `False` |
| `camelCase` | `snake_case` |
| Los enteros grandes pierden precisión | `int` de tamaño ilimitado |
| `Math.floor(7 / 2)` | `7 // 2` |

!!! tip "Consejos"
    - **Usa `type()` en el REPL** cuando dudes de qué tienes.
    - **Nombres que se leen solos:** `is_ssh_enabled`, `max_tokens`. Los booleanos, mejor con prefijo `is_`, `has_` o `use_`.
    - **No reutilices un nombre para otro tipo** aunque Python lo permita: `value = 5` y luego `value = "cinco"` confunde.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Un tastet — apartado «Variables» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_002/#variables> |
| Variables i Tipus de Dades en Sistemes — «Què és una variable?» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_004/#que-es-una-variable> |
| Variables i Tipus de Dades en Sistemes — «Tipats en Python» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_004/#tipats-en-python> |
| Variables i Tipus de Dades en Sistemes — «Bones pràctiques en els noms de variables» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_004/#bones-practiques-en-els-noms-de-variables-estil-sysadmin> |
| **Documentación oficial** | |
| Referencia — Objetos, valores y tipos | <https://docs.python.org/3/reference/datamodel.html#objects-values-and-types> |
| Referencia — Nombres y enlaces (*naming and binding*) | <https://docs.python.org/3/reference/executionmodel.html#naming-and-binding> |
| Tutorial — Números | <https://docs.python.org/3/tutorial/introduction.html#numbers> |
| Biblioteca — Tipos numéricos | <https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex> |
| Biblioteca — Valores booleanos | <https://docs.python.org/3/library/stdtypes.html#bltin-boolean-values> |
| `type()` | <https://docs.python.org/3/library/functions.html#type> |
| `round()` | <https://docs.python.org/3/library/functions.html#round> |
| `isinstance()` | <https://docs.python.org/3/library/functions.html#isinstance> |
| PEP 8 — Convenciones de nombres | <https://peps.python.org/pep-0008/#naming-conventions> |
