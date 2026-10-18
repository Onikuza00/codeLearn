# for y range { .section-python .bloque-python }

> El `for` repite un bloque una vez por cada elemento de algo que se pueda recorrer, y `range()` genera los números cuando solo quieres repetir un número de veces. Aquí también ves `break`, `continue` y el `else` del bucle.

---

## for recorre elementos {: .topic-title }

Un bucle **for** coge los elementos de uno en uno y ejecuta el bloque con cada uno. Se lee casi como una frase: «para cada mensaje en mensajes, haz esto».

El flujo completo:

**1. El script**

```python
# for_basic.py
messages = ["Hola", "¿Qué es un token?", "Gracias"]

for message in messages:
    print(f"Mensaje de {len(message)} caracteres: {message}")

for letter in "IA":
    print(letter)
```

**2. Cómo se ejecuta**

```bash
python for_basic.py
```

**3. Qué pasa por dentro.** `messages` es una **lista** (varios valores entre corchetes; se estudia en el pilar de estructuras de datos). El `for` toma el primer elemento y lo guarda en `message`. Ejecuta el bloque. Toma el segundo, lo guarda en `message` y vuelve a ejecutar. Y así hasta que no quedan más.

**4. La salida**

```text
Mensaje de 4 caracteres: Hola
Mensaje de 17 caracteres: ¿Qué es un token?
Mensaje de 7 caracteres: Gracias
I
A
```

El nombre `message` lo eliges tú. Conviene que sea el singular de la colección. El segundo `for` recorre un texto letra a letra: un `str` también se puede recorrer.

!!! warning "Los dos puntos y la sangría, otra vez"
    Como en el `if`, la línea del `for` termina en `:` y lo que se repite va con sangría. Una línea sin sangría después del `for` se ejecuta **una sola vez**, al terminar el bucle.

---

## range() genera números {: .topic-title }

Cuando no tienes una lista pero quieres repetir algo, usa `range()`. Es una secuencia de números que se genera sobre la marcha.

```python
# ranges.py
print(list(range(5)))
print(list(range(1, 6)))
print(list(range(0, 10, 2)))
print(list(range(5, 0, -1)))
print(list(range(3, 3)))
print(range(5), len(range(5)))

for second in range(3, 0, -1):
    print(f"Respuesta en {second}...")
print("¡Ya!")

for _ in range(3):
    print("Reintentando")
```

```text
[0, 1, 2, 3, 4]
[1, 2, 3, 4, 5]
[0, 2, 4, 6, 8]
[5, 4, 3, 2, 1]
[]
range(0, 5) 5
Respuesta en 3...
Respuesta en 2...
Respuesta en 1...
¡Ya!
Reintentando
Reintentando
Reintentando
```

Las tres formas de `range`:

| Forma | Genera |
|---|---|
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 6)` | 1, 2, 3, 4, 5 |
| `range(0, 10, 2)` | 0, 2, 4, 6, 8 (de 2 en 2) |
| `range(5, 0, -1)` | 5, 4, 3, 2, 1 (cuenta atrás) |

La regla que más se olvida: **el final nunca se incluye**. `range(1, 6)` llega hasta el 5. Y `range(5)` tiene 5 elementos, del 0 al 4.

`list(range(...))` solo sirve para enseñar los números; en un `for` no hace falta crearla. `range` no guarda todos los números en memoria: los va produciendo.

Cuando no usas la variable del bucle, por convención se llama `_`: `for _ in range(3):` significa «repite tres veces, no me importa el número».

!!! warning "TypeError con decimales"
    `range` solo trabaja con enteros. `range(0, 1, 0.1)` falla:

    ```text
    TypeError: 'float' object cannot be interpreted as an integer
    ```

    Para pasos decimales, cuenta con enteros y divide: `step / 10`.

---

## break y continue {: .topic-title }

- **`break`** sale del bucle del todo, ahora mismo.
- **`continue`** salta lo que queda de esta vuelta y pasa a la siguiente.

```python
# break_continue.py
messages = ["Hola", "", "¿Qué es un token?", "/exit", "no se lee"]

for message in messages:
    if message == "":
        continue
    if message == "/exit":
        print("Fin de la conversación")
        break
    print(f"Procesando: {message}")
```

```text
Procesando: Hola
Procesando: ¿Qué es un token?
Fin de la conversación
```

El mensaje vacío se salta con `continue`. Al llegar a `/exit`, `break` corta el bucle y `"no se lee"` ni se mira.

---

## El else del bucle {: .topic-title }

Un `for` puede tener un `else`. Su bloque se ejecuta **solo si el bucle terminó sin ningún `break`**. Es ideal para búsquedas: «si recorrí todo y no encontré nada».

```python
# loop_else.py
forbidden_words = ["contraseña", "tarjeta"]
prompt = "Resume este texto sobre Python"

for word in forbidden_words:
    if word in prompt:
        print(f"Prompt bloqueado: contiene '{word}'")
        break
else:
    print("Prompt limpio, se puede enviar")
```

```text
Prompt limpio, se puede enviar
```

Si cambias el prompt por `"Guarda mi tarjeta"`, el `if` se cumple, el `break` salta y el `else` **no** se ejecuta:

```text
Prompt bloqueado: contiene 'tarjeta'
```

!!! warning "El `else` es del `for`, no del `if`"
    Fíjate en la sangría: el `else` está alineado con el `for`. Si lo alinearas con el `if`, se ejecutaría en cada palabra que no coincidiera. La regla para recordarlo: «`else` = no hubo `break`».

---

## Acumular y la variable que sobrevive {: .topic-title }

El patrón de **acumulador**: una variable que empieza en 0 y va sumando.

```python
# total_words.py
messages = ["Hola", "¿Qué es un token?", "Gracias por la ayuda"]

total_words = 0
for message in messages:
    total_words += len(message.split())

print(f"Palabras en total: {total_words}")
```

```text
Palabras en total: 9
```

`total_words += n` es la forma corta de `total_words = total_words + n`.

La variable del bucle sigue existiendo cuando este acaba. Python no crea un ámbito nuevo para el `for`:

```python
# trap.py
for number in range(3):
    print(number)
print(number)

for item in []:
    print("nunca")
print(item)
```

```text
0
1
2
2
...
NameError: name 'item' is not defined. Did you mean: 'iter'?
```

`number` sigue valiendo `2` después del bucle. Pero si el bucle no da ninguna vuelta (lista vacía), la variable no llega a crearse.

---

## Python en IA {: .topic-title }

En IA se recorre texto todo el rato: mensajes de una conversación, documentos que se trocean, fragmentos que se puntúan. El bucle `for` es la herramienta de base.

Un ejemplo típico: el historial de un chat. Para enviarlo a un modelo, recorres todos los mensajes y los vas juntando en un único texto. Con `continue` te saltas los vacíos y con `break` puedes parar cuando el prompt ya es demasiado largo.

!!! tip "Para y cuenta antes de enviar"
    Si recorres mensajes para armar un prompt, lleva un acumulador (`total_words`) y corta con `break` al pasar un límite. Así evitas enviar un prompt desmesurado.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `for (let i = 0; i < 5; i++) { }` | `for i in range(5):` |
| `for (const x of lista) { }` | `for x in lista:` |
| `for (const i in lista)` (índices) | No existe; usa `enumerate` |
| `break` / `continue` | `break` / `continue` |
| No hay `else` en bucles | `for ... else` |
| `i` solo existe dentro del `for` con `let` | La variable sigue viva después del bucle |

!!! tip "Consejos"
    - **Nombra el elemento en singular:** `for message in messages`.
    - **Usa `_`** cuando no necesites el valor del contador.
    - **Para recorrer con el índice** no escribas `range(len(...))`: tienes [enumerate y zip](../03-enumerate-y-zip/index.md).

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Iteracions: for i range — «Recórrer una llista element per element amb for» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_201/#1-recorrer-una-llista-element-per-element-amb-for> |
| Iteracions: for i range — «La funció range()» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_201/#2-la-funcio-range-generar-sequencies-de-numeros> |
| Caixa d'eines — «Control de bucles» (`break`, `continue`, `else`) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_901/#4-control-de-bucles> |
| Caixa d'eines — «El bloc else als bucles» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_901/#3-el-bloc-else-als-bucles-lexclusivitat-de-python> |
| **Documentación oficial** | |
| Tutorial — Sentencias `for` | <https://docs.python.org/3/tutorial/controlflow.html#for-statements> |
| Tutorial — La función `range()` | <https://docs.python.org/3/tutorial/controlflow.html#the-range-function> |
| Tutorial — `break` y `continue` | <https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements> |
| Tutorial — Cláusulas `else` en bucles | <https://docs.python.org/3/tutorial/controlflow.html#else-clauses-on-loops> |
| Biblioteca — Tipo `range` | <https://docs.python.org/3/library/stdtypes.html#ranges> |
| Referencia — La sentencia `for` | <https://docs.python.org/3/reference/compound_stmts.html#the-for-statement> |
