# enumerate y zip { .section-python .bloque-python }

> `enumerate` te da el número de cada elemento y `zip` recorre dos listas a la vez. Son la forma de Python de hacer lo que otros lenguajes hacen con un contador manual.

---

## El problema de range(len()) {: .topic-title }

A veces necesitas el elemento y también su posición. Los apuntes de la escuela lo resuelven con `range(len(...))`:

```python
# range_len.py
messages = ["Hola", "¿Qué es un token?", "Gracias"]

for i in range(len(messages)):
    print(f"{i + 1}. {messages[i]}")
```

```text
1. Hola
2. ¿Qué es un token?
3. Gracias
```

Funciona, pero tiene tres pegas:

- Hay que escribir `messages` dos veces y `len` por el camino.
- Hay que acceder con `messages[i]`: más ruido.
- Si cambias la lista y olvidas una de las dos referencias, el código se rompe en silencio.

Python tiene una herramienta pensada para esto.

---

## enumerate {: .topic-title }

**`enumerate`** envuelve cualquier cosa recorrible y va entregando pares `(número, elemento)`. El flujo completo:

**1. El script**

```python
# enumerate_demo.py
messages = ["Hola", "¿Qué es un token?", "Gracias"]

for number, message in enumerate(messages, start=1):
    print(f"{number}. {message}")

print(list(enumerate("abc")))
for index, letter in enumerate("abc"):
    print(index, letter)
```

**2. Cómo se ejecuta**

```bash
python enumerate_demo.py
```

**3. Qué pasa por dentro.** `enumerate(messages, start=1)` produce `(1, "Hola")`, luego `(2, "¿Qué es un token?")`, y así. En el `for`, `number, message` **desempaqueta** cada par: el primer valor va a `number` y el segundo a `message`. Sin `start`, la cuenta empieza en 0.

**4. La salida**

```text
1. Hola
2. ¿Qué es un token?
3. Gracias
[(0, 'a'), (1, 'b'), (2, 'c')]
0 a
1 b
2 c
```

Mira la segunda mitad: `list(enumerate("abc"))` te enseña los pares que se generan. Cada par es una **tupla** (dos valores entre paréntesis).

!!! tip "`start=1` para numerar como lo haría una persona"
    Los índices de Python empiezan en 0, pero una lista numerada para leer empieza en 1. Con `start=1` te ahorras el `i + 1`.

!!! warning "El orden es (número, elemento)"
    `for message, number in enumerate(...)` los cruza: `message` valdría el número. Si ves un número donde esperabas un texto, mira el orden.

---

## zip {: .topic-title }

**`zip`** junta dos o más colecciones y entrega una tupla con un elemento de cada una. Como la cremallera de una chaqueta: une diente con diente.

```python
# zip_demo.py
roles = ["system", "user", "assistant"]
contents = ["Eres un asistente", "Hola", "¡Hola! ¿En qué ayudo?"]

for role, content in zip(roles, contents):
    print(f"[{role}] {content}")

print(list(zip(roles, contents))[0])
```

```text
[system] Eres un asistente
[user] Hola
[assistant] ¡Hola! ¿En qué ayudo?
('system', 'Eres un asistente')
```

En cada vuelta, `role` y `content` salen de la misma posición de sus listas. Sin `zip` tendrías que usar `range(len(...))` y dos accesos con índice.

### Listas de distinto tamaño

`zip` se detiene cuando se acaba la más corta, y no avisa:

```python
# zip_short.py
roles = ["system", "user", "assistant"]
contents = ["Eres un asistente", "Hola"]

for role, content in zip(roles, contents):
    print(role, "->", content)

print("--- strict ---")
for role, content in zip(roles, contents, strict=True):
    print(role, "->", content)
```

```text
system -> Eres un asistente
user -> Hola
--- strict ---
system -> Eres un asistente
Traceback (most recent call last):
  ...
ValueError: zip() argument 2 is shorter than argument 1
```

Sin `strict`, el `"assistant"` desaparece sin ruido. Con `strict=True` (desde Python 3.10), si las longitudes no coinciden hay `ValueError`. Es una forma de no perder datos en silencio.

!!! warning "Datos perdidos sin error"
    Con `zip` normal, una lista más corta de lo esperado se recorta sin avisar. Si las dos listas deberían medir lo mismo, usa `strict=True`.

---

## Juntar los dos {: .topic-title }

Se pueden combinar. Los paréntesis en el `for` desempaquetan el par que viene de `zip` mientras `enumerate` pone el número:

```python
# both.py
roles = ["system", "user", "assistant"]
contents = ["Eres un asistente", "Hola", "¡Hola! ¿En qué ayudo?"]

for number, (role, content) in enumerate(zip(roles, contents), start=1):
    words = len(content.split())
    print(f"{number}. {role:<9} {words} palabras")
```

```text
1. system    3 palabras
2. user      1 palabras
3. assistant 4 palabras
```

El `:<9` es el formato de alineación de [Strings y f-strings](../../02-datos-basicos/02-strings-y-f-strings/index.md). Y para deshacer un `zip` se usa `zip(*pares)`:

```python
# unzip.py
pairs = [("user", "Hola"), ("assistant", "Buenas")]
roles, contents = zip(*pairs)
print(roles)
print(contents)
```

```text
('user', 'assistant')
('Hola', 'Buenas')
```

!!! warning "`enumerate` y `zip` se consumen una vez"
    Son objetos que se gastan al recorrerlos. Si los guardas en una variable y los recorres dos veces, la segunda sale vacía:

    ```python
    # enum_once.py
    pairs = enumerate(["a", "b"])
    print(list(pairs))
    print(list(pairs))
    ```

    ```text
    [(0, 'a'), (1, 'b')]
    []
    ```

    Si necesitas recorrerlo más de una vez, conviértelo en lista con `list(...)` o vuelve a crearlo.

---

## Python en IA {: .topic-title }

Una conversación con un modelo es una sucesión de mensajes con **rol** y **contenido**. `zip` y `enumerate` aparecen en cuanto hay datos en paralelo:

- **Roles y contenidos** en dos listas separadas: `zip(roles, contents)`.
- **Documentos y puntuaciones** (en una búsqueda por similitud): `zip(documents, scores)`.
- **Numerar los fragmentos** que vas a meter en un prompt: `enumerate(chunks, start=1)` para escribir «Fuente 1», «Fuente 2»...

!!! tip "Numerar fuentes en un prompt"
    Si metes varios fragmentos de texto en un prompt, numerarlos (`[1]`, `[2]`...) permite al modelo citarlos y a ti comprobar de dónde sale cada afirmación.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `lista.forEach((x, i) => { })` | `for i, x in enumerate(lista):` |
| `for (const [i, x] of lista.entries())` | `for i, x in enumerate(lista):` |
| Orden `(elemento, índice)` | Orden `(índice, elemento)` |
| No hay equivalente nativo de `zip` | `zip(a, b)` |
| `a.map((x, i) => [x, b[i]])` | `zip(a, b)` |
| Longitudes distintas: `undefined` | `zip` corta a la más corta; `strict=True` avisa |

!!! tip "Consejos"
    - **Si escribes `range(len(...))`, para y piensa:** casi siempre `enumerate` o `zip` lo dejan más claro.
    - **Dale nombre a cada pieza del par** (`role`, `content`), no `x` e `y`.
    - **Necesitas el índice solo para imprimir:** `enumerate(..., start=1)`.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Iteracions: for i range — «Combinar range() i len() per recórrer per posició» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_201/#3-combinar-range-i-len-per-recorrer-per-posicio-index> |
| Procediments (bloque antiguo del curso) — uso de `enumerate` en los ejemplos | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_020/#procediments> |
| **Documentación oficial** | |
| `enumerate()` | <https://docs.python.org/3/library/functions.html#enumerate> |
| `zip()` | <https://docs.python.org/3/library/functions.html#zip> |
| Tutorial — Técnicas de bucle | <https://docs.python.org/3/tutorial/datastructures.html#looping-techniques> |
