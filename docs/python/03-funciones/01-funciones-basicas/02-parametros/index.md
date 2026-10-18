# Parámetros { .section-python .bloque-python }

> Los parámetros son la puerta de entrada de una función. Aquí ves las formas de pasar argumentos, los valores por defecto (y su trampa más famosa), cómo exigir que algo se pase por posición o por nombre, y qué ocurre de verdad cuando una función recibe una lista.

---

## Posicionales y con nombre {: .topic-title }

Al llamar a una función puedes pasar los argumentos **por posición** (el orden decide) o **por nombre** (`nombre=valor`, el orden da igual). Se pueden mezclar, pero los posicionales van primero.

**1. El script**

```python
# params.py
def build_message(role, content):
    return {"role": role, "content": content}


print(build_message("user", "Hola"))
print(build_message(content="Hola", role="user"))
print(build_message("user", content="Hola"))

try:
    build_message("user")
except TypeError as error:
    print(error)
try:
    build_message("user", "Hola", "extra")
except TypeError as error:
    print(error)
try:
    build_message("user", role="x", content="y")
except TypeError as error:
    print(error)
```

**2. Cómo se ejecuta**

```bash
python params.py
```

**3. Qué pasa por dentro.** Python asigna primero los argumentos posicionales, de izquierda a derecha, a los parámetros. Después asigna los que traen nombre. Si falta un parámetro obligatorio, sobra un argumento o uno se asigna dos veces, hay `TypeError`.

**4. La salida**

```text
{'role': 'user', 'content': 'Hola'}
{'role': 'user', 'content': 'Hola'}
{'role': 'user', 'content': 'Hola'}
build_message() missing 1 required positional argument: 'content'
build_message() takes 2 positional arguments but 3 were given
build_message() got multiple values for argument 'role'
```

Las tres primeras llamadas dan el mismo resultado. Los tres errores son los típicos y sus mensajes dicen exactamente qué pasa: falta uno, sobra uno, o has dado el mismo dos veces.

!!! tip "Pasa por nombre lo que no se entiende solo"
    `build_message("user", "Hola")` se lee bien. `send(prompt, "m", 0.2, True)` no: ¿qué es `True`? Con nombres (`temperature=0.2, stream=True`) la llamada se explica sola.

---

## Valores por defecto {: .topic-title }

Si un parámetro tiene un valor por defecto, pasarlo es opcional. Los parámetros con valor por defecto van **después** de los obligatorios.

```python
# defaults.py
def build_request(prompt, model="modelo-demo", temperature=0.7):
    return {"model": model, "temperature": temperature, "prompt": prompt}


print(build_request("Hola"))
print(build_request("Hola", temperature=0.2))
print(build_request("Hola", "otro-modelo"))
```

```text
{'model': 'modelo-demo', 'temperature': 0.7, 'prompt': 'Hola'}
{'model': 'modelo-demo', 'temperature': 0.2, 'prompt': 'Hola'}
{'model': 'otro-modelo', 'temperature': 0.7, 'prompt': 'Hola'}
```

Cambiar solo la temperatura se hace por nombre y sin tocar el modelo. Es el patrón de todas las funciones de configuración.

### La trampa del default mutable

El valor por defecto se crea **una sola vez**, cuando se ejecuta el `def`, no en cada llamada. Con un valor inmutable (número, texto, `None`) da igual. Con una lista o un diccionario, el mismo objeto se reutiliza en todas las llamadas.

```python
# mutable_default.py
def add_message_bad(text, history=[]):
    history.append(text)
    return history


print(add_message_bad("uno"))
print(add_message_bad("dos"))
print(add_message_bad.__defaults__)


def add_message(text, history=None):
    if history is None:
        history = []
    history.append(text)
    return history


print(add_message("uno"))
print(add_message("dos"))
mine = ["previo"]
print(add_message("tres", mine), mine)
```

```text
['uno']
['uno', 'dos']
(['uno', 'dos'],)
['uno']
['dos']
['previo', 'tres'] ['previo', 'tres']
```

- La segunda llamada de `add_message_bad` devuelve `['uno', 'dos']`: el `history` por defecto es **la misma lista** de la primera llamada. `__defaults__` lo confirma: la función guarda esa lista dentro.
- La solución es `None` como valor por defecto y crear la lista dentro, con `if history is None`. Cada llamada recibe una lista nueva.
- Si el que llama pasa su propia lista, la función la modifica (`mine` cambia). Eso es lo esperado: es *su* lista.

!!! warning "Historiales que se mezclan entre conversaciones"
    Con `history=[]` como default, dos conversaciones distintas comparten sin querer los mismos mensajes. Es un error muy típico en código de chat y no da ninguna excepción.

---

## Solo posicionales y solo con nombre {: .topic-title }

Puedes obligar a pasar ciertos argumentos de una manera concreta con dos marcadores en la lista de parámetros:

- **`/`**: todo lo que va **antes** debe pasarse por posición.
- **`*`**: todo lo que va **después** debe pasarse por nombre.

```python
# special.py
def send(prompt, /, model, *, temperature=0.7, stream=False):
    return f"{prompt!r} {model} {temperature} {stream}"


print(send("Hola", "modelo-demo"))
print(send("Hola", model="modelo-demo", temperature=0.2))
for call in ['send(prompt="Hola", model="m")', 'send("Hola", "m", 0.2)']:
    try:
        eval(call)
    except TypeError as error:
        print(error)
```

```text
'Hola' modelo-demo 0.7 False
'Hola' modelo-demo 0.2 False
send() got some positional-only arguments passed as keyword arguments: 'prompt'
send() takes 2 positional arguments but 3 were given
```

| Zona | Cómo se puede pasar |
|---|---|
| Antes de `/` (`prompt`) | Solo por posición |
| Entre `/` y `*` (`model`) | Por posición o por nombre |
| Después de `*` (`temperature`, `stream`) | Solo por nombre |

La razón de ser: los parámetros de opciones (`temperature`, `stream`) **siempre con nombre** evitan llamadas ilegibles, y se pueden reordenar sin romper a quien ya usa la función.

!!! tip "`*` solo, sin nombre, es un separador"
    En `def send(prompt, *, temperature=0.7)` el `*` no recoge nada: solo marca que lo siguiente es solo con nombre. Cuando lleva nombre (`*args`) sí recoge argumentos; es el tema de [\*args y \*\*kwargs](../../02-args-y-kwargs/01-args-y-kwargs/index.md).

---

## ¿Valor o referencia? {: .topic-title }

Los apuntes del bloque antiguo dicen que «Python pasa todo por valor, pero según el tipo se puede modificar el original». La conclusión práctica es correcta; la explicación confunde. El modelo correcto es **paso por referencia de objeto** (a veces llamado *pass by assignment*): la función recibe **una etiqueta nueva pegada al mismo objeto**. Es exactamente lo que viste en [Variables y tipos](../../../01-fundamentos/02-datos-basicos/01-variables-y-tipos/index.md).

```python
# by_reference.py
def rename(text):
    text = text.upper()
    return text

def add_tag(tags):
    tags.append("nuevo")

def replace_tags(tags):
    tags = ["otro"]
    return tags

title = "qa"
rename(title)
print(title)

tags = ["a"]
add_tag(tags)
print(tags)
replace_tags(tags)
print(tags)

def show_id(value):
    return id(value)

print(show_id(tags) == id(tags))
```

```text
qa
['a', 'nuevo']
['a', 'nuevo']
True
```

- `rename`: el texto es inmutable. `text.upper()` crea un texto nuevo y la etiqueta local `text` se re-apunta a él. `title` fuera no se entera.
- `add_tag`: la lista es mutable y la función recibe **el mismo objeto** (el `id` coincide). `append` lo modifica en el sitio, y se ve fuera.
- `replace_tags`: `tags = ["otro"]` **no modifica** la lista, re-apunta la etiqueta local a otra lista. La de fuera queda igual.

La regla: **reasignar** el nombre dentro de la función nunca afecta fuera; **modificar** un objeto mutable (con `append`, `update`, `[i] = ...`) sí.

!!! warning "Una función que modifica su argumento sin avisar"
    Si una función hace `messages.append(...)` sobre la lista que recibe, el que llama ve el cambio. Si no es lo que se espera, copia primero (`messages = list(messages)`) o devuelve una lista nueva ([Listas](../../../02-estructuras-de-datos/01-listas-y-tuplas/01-listas/index.md#copiar-o-repartir-etiquetas)).

---

## Python en IA {: .topic-title }

Las funciones que hablan con modelos tienen muchos parámetros opcionales (`temperature`, `max_tokens`, `stream`...). Los SDK suelen declararlos como **solo con nombre** para que las llamadas sean legibles y se puedan añadir opciones nuevas sin romper a nadie.

Y el default mutable es especialmente peligroso con historiales: una función `chat(message, history=[])` acumularía en silencio los mensajes de todas las conversaciones.

!!! tip "Una función de configuración con defaults razonables"
    Pon en los parámetros los valores por defecto que usarías casi siempre, y obliga a pasar por nombre los que cambian el comportamiento. Quien llama solo escribe lo que se sale de lo normal.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `function f(a, b = 2)` | `def f(a, b=2)` |
| `f({ temperature: 0.2 })` (objeto de opciones) | `f(temperature=0.2)` (argumentos con nombre de serie) |
| Un default `[]` se crea en cada llamada | Un default `[]` se crea **una vez**: cuidado |
| Parámetros solo posicionales o con nombre: no existen | `/` y `*` en la firma |
| Se pasan objetos "por valor de la referencia" | Igual: referencia de objeto |
| Parámetro sobrante: se ignora | `TypeError` |

!!! tip "Consejos"
    - **`None` como default para listas y diccionarios.**
    - **Opciones con `*`** para que siempre se pasen por nombre.
    - **Evita modificar los argumentos**; devuelve un valor nuevo.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Funcions i Modularitat (def) — «Passem dades a la funció: paràmetres» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_500/#2-passem-dades-a-la-funcio-parametres> |
| Procediments (bloque antiguo) — parámetros por defecto y por nombre | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_020/#procediments> |
| Pas per valor i pas per referència (bloque antiguo) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_022/#pas-per-valor-i-pas-per-referencia> |
| **Documentación oficial** | |
| Tutorial — Valores de argumento por defecto | <https://docs.python.org/3/tutorial/controlflow.html#default-argument-values> |
| Tutorial — Argumentos con nombre | <https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments> |
| Tutorial — Parámetros especiales (`/` y `*`) | <https://docs.python.org/3/tutorial/controlflow.html#special-parameters> |
| Tutorial — Parámetros solo posicionales | <https://docs.python.org/3/tutorial/controlflow.html#positional-only-parameters> |
| Tutorial — Parámetros solo con nombre | <https://docs.python.org/3/tutorial/controlflow.html#keyword-only-arguments> |
| PEP 570 — Parámetros solo posicionales | <https://peps.python.org/pep-0570/> |
| PEP 3102 — Parámetros solo con nombre | <https://peps.python.org/pep-3102/> |
