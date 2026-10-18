# `*args` y `**kwargs` { .section-python .bloque-python }

> Con `*args` una función acepta cualquier número de argumentos posicionales y con `**kwargs`, cualquier número de argumentos con nombre. Y los mismos símbolos, en la llamada, reparten una lista o un diccionario en argumentos.

---

## Recoger posicionales: `*args` {: .topic-title }

A veces no sabes cuántos argumentos va a recibir una función. Un parámetro con `*` delante **recoge todos los posicionales sobrantes en una tupla**. Por convención se llama `args`, pero el nombre da igual: lo que cuenta es el `*`.

**1. El script**

```python
# args.py
def total_words(*texts):
    print(texts, type(texts))
    return sum(len(text.split()) for text in texts)


print(total_words("Hola mundo", "Explica qué es un token"))
print(total_words())

def build_prompt(system_prompt, *questions):
    lines = [system_prompt]
    for number, question in enumerate(questions, start=1):
        lines.append(f"{number}. {question}")
    return "\n".join(lines)

print(build_prompt("Responde breve.", "¿Qué es un token?", "¿Qué es un embedding?"))
```

**2. Cómo se ejecuta**

```bash
python args.py
```

**3. Qué pasa por dentro.** Python asigna los posicionales a los parámetros normales y mete **todos los demás** en una tupla llamada `texts` (o `questions`). Si no sobra ninguno, la tupla está vacía. Dentro de la función la recorres como cualquier tupla.

**4. La salida**

```text
('Hola mundo', 'Explica qué es un token') <class 'tuple'>
7
() <class 'tuple'>
0
Responde breve.
1. ¿Qué es un token?
2. ¿Qué es un embedding?
```

Es lo que usan `print(*cosas)` o `max(1, 2, 3)`: aceptan un número libre de argumentos.

---

## Recoger con nombre: `**kwargs` {: .topic-title }

Un parámetro con `**` delante **recoge los argumentos con nombre que sobran en un diccionario**.

```python
# kwargs.py
def build_request(model, **options):
    print(options, type(options))
    return {"model": model, **options}


print(build_request("modelo-demo", temperature=0.2, max_tokens=256))
print(build_request("modelo-demo"))

def show(*args, **kwargs):
    print(args, kwargs)

show(1, 2, a=3, b=4)
show()
```

```text
{'temperature': 0.2, 'max_tokens': 256} <class 'dict'>
{'model': 'modelo-demo', 'temperature': 0.2, 'max_tokens': 256}
{} <class 'dict'>
{'model': 'modelo-demo'}
(1, 2) {'a': 3, 'b': 4}
() {}
```

- `options` es un diccionario normal: `{'temperature': 0.2, 'max_tokens': 256}`.
- `{"model": model, **options}` lo mezcla en la petición ([Desempaquetado](../../../02-estructuras-de-datos/05-desempaquetado/01-desempaquetado/index.md)).
- `def show(*args, **kwargs)` acepta **cualquier** llamada. Es la firma «comodín».

El orden de los parámetros es siempre: normales, `*args`, parámetros solo con nombre, `**kwargs`. Los apuntes de la escuela (bloque antiguo) lo recogen: primero normales, luego `*args`, luego `**kwargs`.

```python
# order.py
def send(model, *messages, stream=False, **options):
    return model, messages, stream, options


print(send("m", "uno", "dos", stream=True, temperature=0.2))

try:
    exec("def bad(**kwargs, *args): pass")
except SyntaxError as error:
    print(error)
```

```text
('m', ('uno', 'dos'), True, {'temperature': 0.2})
arguments cannot follow var-keyword argument (<string>, line 1)
```

Los parámetros que vienen después de `*messages` (como `stream`) son **solo con nombre** de forma automática. Y `**options` siempre va el último.

!!! warning "SyntaxError: arguments cannot follow var-keyword argument"
    `**kwargs` tiene que ser el último parámetro de la firma.

---

## Expandir en la llamada {: .topic-title }

Los mismos símbolos, en la **llamada**, hacen el trabajo contrario: **reparten**. Un `*lista` pasa cada elemento como argumento posicional y un `**diccionario` pasa cada par como argumento con nombre.

```python
# expand.py
def build_request(model, temperature=0.7, max_tokens=256):
    return {"model": model, "temperature": temperature, "max_tokens": max_tokens}


positional = ["modelo-demo", 0.2]
print(build_request(*positional))

params = {"temperature": 0.1, "max_tokens": 512}
print(build_request("modelo-demo", **params))

try:
    build_request("modelo-demo", **{"top_k": 5})
except TypeError as error:
    print(error)

defaults = {"temperature": 0.7}
custom = {"temperature": 0.3}
try:
    build_request("m", **defaults, **custom)
except TypeError as error:
    print(error)
print(build_request("m", **{**defaults, **custom}))
```

```text
{'model': 'modelo-demo', 'temperature': 0.2, 'max_tokens': 256}
{'model': 'modelo-demo', 'temperature': 0.1, 'max_tokens': 512}
build_request() got an unexpected keyword argument 'top_k'
__main__.build_request() got multiple values for keyword argument 'temperature'
{'model': 'm', 'temperature': 0.3, 'max_tokens': 256}
```

- `build_request(*positional)` equivale a `build_request("modelo-demo", 0.2)`.
- `build_request("modelo-demo", **params)` equivale a escribir `temperature=0.1, max_tokens=512`.
- Una clave del diccionario que la función no acepta (`top_k`) da `TypeError`.
- Si dos `**` traen la **misma clave**, hay `TypeError`. Para que gane el último, mezcla antes con `{**defaults, **custom}`.

Este es el patrón de las configuraciones: guardas los parámetros en un diccionario y los pasas todos con `**params`.

Y la combinación de las dos mitades, `*args` + `**kwargs` en la firma y los dos en la llamada, permite una función que **reenvía** todo a otra sin saber qué lleva:

```python
# forward.py
def send(prompt, model="modelo-demo", temperature=0.7):
    return f"{model} T={temperature}: {prompt}"


def send_logged(*args, **kwargs):
    print(f"enviando con args={args} kwargs={kwargs}")
    return send(*args, **kwargs)


print(send_logged("Hola", temperature=0.1))
```

```text
enviando con args=('Hola',) kwargs={'temperature': 0.1}
modelo-demo T=0.1: Hola
```

`send_logged` no sabe cuántos parámetros tiene `send`: recoge todo y lo reenvía. Es la base de los **decoradores** ([Decoradores](../../05-decoradores/01-decoradores/index.md)).

!!! warning "Los apuntes mezclan dos cosas distintas"
    Al final de la página sobre `*args` y `**kwargs`, los apuntes llaman «tuple unpacking» a las llamadas con `*lista`. Son dos cosas relacionadas pero distintas: **desempaquetar en una asignación** (`primer, *resta = numeros`, [Desempaquetado](../../../02-estructuras-de-datos/05-desempaquetado/01-desempaquetado/index.md)) y **expandir argumentos en una llamada** (`f(*lista)`). Comparten símbolo, no mecanismo.

---

## Python en IA {: .topic-title }

Es el patrón central de los SDK de IA. Una función de «crear petición» suele tener unos pocos parámetros fijos y un montón de opciones que cambian según el modelo. Con `**params` pasas esas opciones desde un diccionario, y puedes tenerlas en un archivo de configuración:

```python
# params_pattern.py
def create(model, messages, **params):
    return {"model": model, "messages": messages, **params}


settings = {"temperature": 0.2, "max_tokens": 512}
request = create("modelo-demo", [{"role": "user", "content": "Hola"}], **settings)
print(request)
```

```text
{'model': 'modelo-demo', 'messages': [{'role': 'user', 'content': 'Hola'}], 'temperature': 0.2, 'max_tokens': 512}
```

Así tu código no depende de qué opciones tiene cada modelo: lee la configuración y la pasa entera.

!!! warning "Un error tipográfico en un `**kwargs` pasa silenciosamente"
    Si una función solo hace `{**options}` y no valida, `temprature=0.2` (mal escrito) se acepta sin quejarse y el modelo ignora la opción. Con parámetros explícitos, Python te avisa. Usa `**kwargs` para reenviar, y parámetros con nombre para lo que tu código necesita de verdad.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `function f(...args)` | `def f(*args)` |
| `args` es un array | `args` es una tupla |
| `function f(options)` + `f({ a: 1 })` | `def f(**options)` + `f(a=1)` |
| `f(...lista)` | `f(*lista)` |
| `f(...Object.values(o))` | `f(*d.values())` |
| `f({ ...a, ...b })` | `f(**a, **b)` (repetir una clave da error) |
| `arguments` | No existe; se usa `*args` |

!!! tip "Consejos"
    - **`*args` y `**kwargs` para reenviar**, parámetros con nombre para lo que usas.
    - **Un diccionario de configuración + `**`** mantiene las llamadas cortas.
    - **Nombres claros:** si tiene sentido, `*texts`, `**options`; no siempre `args`/`kwargs`.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Barregem *args i **kwargs (bloque antiguo) — orden de los parámetros y llamada con `*` y `**` | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_022/#barregem-args-i-kwargs> |
| Funcions (bloque antiguo) — `*numeros` en `suma` y `minim_maxim` | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/python/py_021/#funcions> |
| **Documentación oficial** | |
| Tutorial — Listas de argumentos arbitrarias | <https://docs.python.org/3/tutorial/controlflow.html#arbitrary-argument-lists> |
| Tutorial — Desempaquetar listas de argumentos | <https://docs.python.org/3/tutorial/controlflow.html#unpacking-argument-lists> |
| Tutorial — Resumen de parámetros | <https://docs.python.org/3/tutorial/controlflow.html#recap> |
| Referencia — Llamadas | <https://docs.python.org/3/reference/expressions.html#calls> |
| Glosario — «parameter» | <https://docs.python.org/3/glossary.html#term-parameter> |
