# Entrada y conversión { .section-python .bloque-python }

> `input()` pide un dato al usuario y siempre lo devuelve como texto. Aquí aprendes a convertirlo a número y a controlar lo que pasa cuando escribe algo que no se puede convertir.

---

## input() devuelve texto {: .topic-title }

`input()` para el programa, enseña un mensaje y espera a que el usuario escriba algo y pulse Enter. Lo que escribe es lo que devuelve.

El flujo completo:

**1. El script**

```python
# ask.py
user_name = input("¿Cómo te llamas? ")
print(f"Hola, {user_name}")
print(type(user_name))
```

**2. Cómo se ejecuta**

```bash
python ask.py
```

**3. Qué pasa por dentro.** Python imprime el mensaje (sin salto de línea), se queda esperando y, cuando pulsas Enter, guarda lo escrito en `user_name` (sin el Enter final).

**4. La salida**, con `Ana` escrito por el usuario:

```text
¿Cómo te llamas? Ana
Hola, Ana
<class 'str'>
```

Fíjate en el espacio al final del mensaje (`"¿Cómo te llamas? "`). Sin él, lo que escribas queda pegado a la pregunta.

!!! warning "Aunque escribas un número, llega texto"
    Si el usuario escribe `3`, `input()` devuelve el texto `"3"`, no el número. Es el error más repetido con `input()`.

---

## Convertir con int() y float() {: .topic-title }

Para operar con el dato hay que convertirlo: `int()` para enteros y `float()` para decimales.

```python
# text_vs_number.py
amount = input("¿Cuántos mensajes? ")
print(type(amount))
print(amount + amount)
total = int(amount) + 2
print(total)
print(amount + 2)
```

```text
¿Cuántos mensajes? 3
<class 'str'>
33
5
Traceback (most recent call last):
  ...
TypeError: can only concatenate str (not "int") to str
```

Cuatro cosas en un solo script:

- `amount + amount` no suma: **junta textos**, `"3" + "3"` es `"33"`.
- `int(amount) + 2` convierte primero y luego suma: `5`.
- `amount + 2` mezcla texto y número y falla con `TypeError`.
- Las conversiones se pueden anidar: `int(input("..."))` pregunta y convierte en una sola línea.

Más conversiones útiles:

```python
# conversions.py
print(int("42"), int(" 42 "), float("3.5"), float("1e3"))
print(int(3.9), int(-3.9))
print(str(12) + "%", bool("False"))
for bad in ["3.5", "", "abc"]:
    try:
        int(bad)
    except ValueError as error:
        print(error)
```

```text
42 42 3.5 1000.0
3 -3
12% True
invalid literal for int() with base 10: '3.5'
invalid literal for int() with base 10: ''
invalid literal for int() with base 10: 'abc'
```

- `int(" 42 ")` ignora los espacios de alrededor.
- `int(3.9)` da `3`: **recorta** los decimales, no redondea.
- `bool("False")` es `True`, porque es un texto con contenido.
- `int("3.5")` falla: un texto con decimales no se convierte directo a entero. Haz `int(float("3.5"))`.

!!! warning "ValueError: invalid literal for int()"
    Es el error de este capítulo. Aparece cuando el texto no tiene pinta de número: letras, vacío o con coma decimal (`"0,5"`). El usuario escribe lo que quiere, así que tienes que contar con ello.

---

## Controlar el ValueError {: .topic-title }

Un **try/except** prueba un bloque y, si salta el error indicado, ejecuta otro bloque en lugar de romper el programa.

```python
# temperature.py
raw_value = input("Temperatura (0 a 1): ")

try:
    temperature = float(raw_value)
except ValueError:
    print(f"'{raw_value}' no es un número")
else:
    print(f"Temperatura fijada en {temperature}")
```

Con tres entradas distintas:

```text
Temperatura (0 a 1): 0.7
Temperatura fijada en 0.7
```

```text
Temperatura (0 a 1): alta
'alta' no es un número
```

```text
Temperatura (0 a 1):   0,5 
'  0,5 ' no es un número
```

Cómo se lee:

- `try:` es lo que se intenta.
- `except ValueError:` se ejecuta solo si falla con ese error concreto.
- `else:` se ejecuta si **no** hubo error. Ahí va lo que depende de que la conversión haya salido bien.

La tercera entrada tiene coma decimal. En Python el separador decimal es el punto, así que `0,5` no se convierte.

!!! tip "Captura solo el error que esperas"
    `except ValueError:` es preciso. Evita el `except:` a secas: tapa cualquier error, incluso los que no esperabas, y es muy difícil encontrar el fallo luego. Las excepciones se estudian a fondo en el pilar de ficheros y errores; aquí solo necesitas esto.

---

## Limpiar lo que escribe el usuario {: .topic-title }

Los usuarios escriben mayúsculas, espacios de más... Normaliza antes de comparar:

```python
# clean.py
answer = input("¿Quieres seguir? (s/n) ").strip().lower()
print(repr(answer), answer == "s")
```

```text
¿Quieres seguir? (s/n)   S 
's' True
```

`strip()` quita los espacios y `lower()` pasa a minúsculas. Los dos métodos están en [Strings y f-strings](../02-strings-y-f-strings/index.md).

!!! warning "EOFError cuando no hay entrada"
    Si el programa se ejecuta sin teclado (por ejemplo, con la entrada redirigida desde un archivo vacío) o el usuario pulsa `Ctrl + Z` en Windows (`Ctrl + D` en Linux) en medio de un `input()`, Python lanza `EOFError`. Es normal en programas interactivos: no hay nada más que leer.

---

## Python en IA {: .topic-title }

Casi todos los parámetros de un modelo entran como texto: desde la línea de comandos, desde un formulario web, desde un archivo de configuración o desde un `.env` (lo viste en [Entorno](../../01-inicio/02-entorno-venv-pip/index.md)). Cualquier valor que sea un número hay que convertirlo y validarlo antes de usarlo.

Este es el patrón mínimo para la temperatura del modelo:

```python
# model_settings.py
raw_value = input("Temperatura (0 a 2): ")

try:
    temperature = float(raw_value)
except ValueError:
    temperature = 0.7
    print("Valor no válido, uso 0.7 por defecto")

print(f"Temperatura final: {temperature}")
```

```text
Temperatura (0 a 2): mucha
Valor no válido, uso 0.7 por defecto
Temperatura final: 0.7
```

!!! tip "Un valor por defecto razonable evita el crash"
    Si un parámetro viene mal, usar un valor por defecto y avisar es mejor que romper el programa a mitad de una conversación. Pedir de nuevo hasta que sea correcto, en cambio, se hace con un bucle: [while](../../04-bucles/02-while/index.md).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `prompt("Nombre")` (navegador) | `input("Nombre")` (terminal) |
| `Number("3")` | `int("3")` / `float("3")` |
| `Number("abc")` da `NaN` | `int("abc")` lanza `ValueError` |
| `parseInt("3.9")` da `3` | `int("3.9")` lanza error; `int(3.9)` da `3` |
| `try { } catch (e) { }` | `try:` / `except ValueError:` |
| `String(5)` | `str(5)` |

!!! tip "Consejos"
    - **Escribe el mensaje con espacio final** (`"Nombre: "`), para que no quede pegado.
    - **Convierte en cuanto llega el dato**, no más tarde en el programa.
    - **Prueba tus `input`** con valores raros: vacío, letras, números negativos, coma decimal.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Entrada de dades: input() — «Com funciona input()?» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_003/#1-com-funciona-input> |
| Entrada de dades: input() — «El gran secret de input(): tot és text!» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_003/#2-el-gran-secret-de-input-tot-es-text> |
| Entrada de dades: input() — «La solució: transformar el text en números (casting)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_003/#3-la-solucio-transformar-el-text-en-numeros-casting> |
| Variables i Tipus de Dades en Sistemes — «Tipats en Python» (`str()`, `int()` explícitos) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_004/#tipats-en-python> |
| **Documentación oficial** | |
| `input()` | <https://docs.python.org/3/library/functions.html#input> |
| `int()` | <https://docs.python.org/3/library/functions.html#int> |
| `float()` | <https://docs.python.org/3/library/functions.html#float> |
| `ValueError` | <https://docs.python.org/3/library/exceptions.html#ValueError> |
| `EOFError` | <https://docs.python.org/3/library/exceptions.html#EOFError> |
| Tutorial — Gestionar excepciones | <https://docs.python.org/3/tutorial/errors.html#handling-exceptions> |
