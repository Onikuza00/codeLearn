# while { .section-python .bloque-python }

> El `while` repite un bloque mientras una condición sea verdadera, sin saber cuántas vueltas dará. Es la herramienta para pedir un dato hasta que sea válido y para mantener un chat abierto.

---

## while repite mientras se cumpla {: .topic-title }

Un `for` recorre algo que ya tienes. Un **while** repite mientras una condición siga siendo verdadera. Se usa cuando **no sabes** cuántas vueltas harán falta.

El flujo completo, con una cuenta atrás de intentos:

**1. El script**

```python
# while_basic.py
remaining = 3

while remaining > 0:
    print(f"Quedan {remaining} intentos")
    remaining -= 1

print("Sin intentos")
```

**2. Cómo se ejecuta**

```bash
python while_basic.py
```

**3. Qué pasa por dentro.** Python mira la condición. Si es verdadera, ejecuta el bloque y vuelve a mirarla. Si es falsa, sale. El bloque tiene que **cambiar algo** que afecte a la condición; aquí, `remaining -= 1`.

**4. La salida**

```text
Quedan 3 intentos
Quedan 2 intentos
Quedan 1 intentos
Sin intentos
```

!!! warning "Bucle infinito"
    Si el bloque no cambia nada que afecte a la condición, el bucle no termina nunca. Si se te cuelga el programa, pulsa `Ctrl + C` en la terminal: Python lanza `KeyboardInterrupt` y se detiene.

---

## Validar una entrada {: .topic-title }

El uso estrella del `while`: pedir un dato y repetir la pregunta hasta que sea correcto. Los apuntes de la escuela lo resuelven así:

```python
# validate_school.py
temperature = float(input("Temperatura (0 a 2): "))

while temperature < 0 or temperature > 2:
    print("Valor fuera de rango")
    temperature = float(input("Temperatura (0 a 2): "))

print(f"Temperatura fijada en {temperature}")
```

```text
Temperatura (0 a 2): 5
Valor fuera de rango
Temperatura (0 a 2): 0.8
Temperatura fijada en 0.8
```

Funciona con números. Pero hay dos problemas.

**Primero, falla con texto.** Si el usuario escribe letras, `float()` rompe el programa:

```text
Temperatura (0 a 2): alta
ValueError: could not convert string to float: 'alta'
```

**Segundo, repites el `input`.** Aparece antes del bucle y dentro. Si cambias uno y olvidas el otro, tienes un fallo.

La forma habitual en Python resuelve las dos cosas: `while True` con `break` y un `try/except` dentro.

```python
# validate.py
while True:
    raw_value = input("Temperatura (0 a 2): ")

    try:
        temperature = float(raw_value)
    except ValueError:
        print("Escribe un número, por ejemplo 0.7")
        continue

    if 0 <= temperature <= 2:
        break

    print("Tiene que estar entre 0 y 2")

print(f"Temperatura fijada en {temperature}")
```

Probado con tres entradas seguidas (`alta`, `5`, `0.8`):

```text
Temperatura (0 a 2): alta
Escribe un número, por ejemplo 0.7
Temperatura (0 a 2): 5
Tiene que estar entre 0 y 2
Temperatura (0 a 2): 0.8
Temperatura fijada en 0.8
```

Cómo funciona:

- `while True:` no termina por sí solo. Solo sale el `break`.
- El `input` está **una sola vez**, dentro del bucle.
- Si no es un número, el `except` avisa y `continue` vuelve al principio sin mirar el rango.
- Si es un número en rango, `break` sale y `temperature` queda guardada.
- Si es un número fuera de rango, se muestra el aviso y se da otra vuelta.

!!! tip "`try` dentro del `while`, no al revés"
    El `try/except` va **dentro** del bucle para que un error no lo destruya. Si lo pones fuera, el primer error saca al programa del bucle. Cómo funcionan las excepciones en general lo ves en el pilar de ficheros y errores.

---

## Limitar los intentos {: .topic-title }

Igual que el `for`, el `while` admite `else`: se ejecuta si la condición se volvió falsa **sin pasar por un `break`**. Con un contador de intentos:

```python
# attempts.py
MAX_ATTEMPTS = 3
attempts = 0
temperature = None

while attempts < MAX_ATTEMPTS:
    attempts += 1
    raw_value = input(f"Temperatura (intento {attempts}/{MAX_ATTEMPTS}): ")
    try:
        temperature = float(raw_value)
    except ValueError:
        continue
    break
else:
    print("Demasiados intentos, uso el valor por defecto")
    temperature = 0.7

print(f"Temperatura: {temperature}")
```

Con tres respuestas incorrectas (`a`, `b`, `c`):

```text
Temperatura (intento 1/3): a
Temperatura (intento 2/3): b
Temperatura (intento 3/3): c
Demasiados intentos, uso el valor por defecto
Temperatura: 0.7
```

Y con una incorrecta seguida de una correcta (`a`, `1.1`):

```text
Temperatura (intento 1/3): a
Temperatura (intento 2/3): 1.1
Temperatura: 1.1
```

En el segundo caso el `break` se ejecutó, así que el `else` se saltó.

---

## Un bucle de chat {: .topic-title }

Otro uso clásico: mantener abierta una conversación hasta que el usuario pida salir.

```python
# chat_loop.py
print("Chat de prueba. Escribe /exit para salir.")
turns = 0

while True:
    user_text = input("Tú: ").strip()

    if not user_text:
        continue
    if user_text == "/exit":
        break

    turns += 1
    print(f"Bot: recibido ({len(user_text.split())} palabras)")

print(f"Hasta pronto. Turnos: {turns}")
```

```text
Chat de prueba. Escribe /exit para salir.
Tú: Hola, qué tal
Bot: recibido (3 palabras)
Tú: 
Tú: Explícame qué es un token
Bot: recibido (5 palabras)
Tú: /exit
Hasta pronto. Turnos: 2
```

Dos líneas de protección a la entrada: `if not user_text: continue` ignora lo vacío (es un valor falso, como viste en [if / elif / else](../../03-decisiones/01-if-elif-else/index.md)) y `if user_text == "/exit": break` es la salida. Todo lo demás es la lógica del turno.

!!! tip "El «menú con bandera» de los apuntes"
    Los apuntes usan una variable (`option = ""`) y `while option != "3"` para sacar un menú. Funciona, pero obliga a inicializar la variable con un valor falso. Con `while True` y `break` no hace falta.

---

## Python en IA {: .topic-title }

Un asistente conversacional es un `while True`: lee, responde, repite. Es exactamente la forma del script anterior, con una llamada a un modelo en el lugar de la respuesta simulada.

También aparece al hacer peticiones que pueden fallar: **reintentar** hasta que funcione o hasta un máximo de intentos (el patrón de `attempts.py`). Es muy frecuente porque las llamadas a una API pueden fallar por red o por límites de uso.

!!! warning "Siempre una salida"
    Un bucle de reintentos sin máximo puede lanzar peticiones sin parar. Con una API de pago, cada vuelta cuesta. Pon siempre un tope (`MAX_ATTEMPTS`) y una forma de salir (`/exit`, `break`).

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `while (cond) { }` | `while cond:` |
| `while (true) { ... break; }` | `while True:` y `break` |
| `do { } while (cond)` | No existe; se usa `while True` + `break` |
| `continue` / `break` | `continue` / `break` |
| `try { } catch { }` dentro del bucle | `try:` / `except:` dentro del bucle |
| No hay `else` en bucles | `while ... else` |

!!! tip "Consejos"
    - **`for` si sabes qué recorrer, `while` si dependes de una condición.**
    - **Un solo `input` dentro de `while True`** evita duplicar la pregunta.
    - **Cada vuelta debe acercarse a la salida:** un contador, un `break`, una entrada nueva.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Iteracions: while — «El cas d'ús estrella: validar l'entrada de dades» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_301/#1-el-cas-dus-estrella-validar-lentrada-de-dades> |
| Iteracions: while — «El patró "Menú d'Opcions"» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_301/#2-el-patro-menu-dopcions-bucle-amb-break-o-flag> |
| Caixa d'eines — «La instrucció break» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_901/#1-la-instruccio-break-aturar-el-bucle> |
| Caixa d'eines — «La instrucció continue» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_901/#2-la-instruccio-continue-saltar-a-la-seguent-volta> |
| **Documentación oficial** | |
| Referencia — La sentencia `while` | <https://docs.python.org/3/reference/compound_stmts.html#the-while-statement> |
| Tutorial — `break` y `continue` | <https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements> |
| Tutorial — Cláusulas `else` en bucles | <https://docs.python.org/3/tutorial/controlflow.html#else-clauses-on-loops> |
| Tutorial — Gestionar excepciones | <https://docs.python.org/3/tutorial/errors.html#handling-exceptions> |
| `KeyboardInterrupt` | <https://docs.python.org/3/library/exceptions.html#KeyboardInterrupt> |
