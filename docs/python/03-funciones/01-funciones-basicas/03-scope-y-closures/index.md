# Scope y closures { .section-python .bloque-python }

> El scope decide qué nombres ve cada parte del código. Aquí aprendes la regla LEGB, por qué `global` casi siempre sobra, y cómo una función puede recordar valores del sitio donde se creó: el closure.

---

## Variables locales y globales {: .topic-title }

El **scope** (ámbito) es la zona del código donde un nombre existe. Una variable creada dentro de una función es **local**: solo vive mientras la función se ejecuta y nadie fuera la ve. Una variable creada en el archivo, fuera de las funciones, es **global** (del módulo) y cualquier función puede leerla.

**1. El script**

```python
# local.py
MODEL_NAME = "modelo-demo"

def describe():
    temperature = 0.7
    return f"{MODEL_NAME} a {temperature}"

print(describe())
try:
    print(temperature)
except NameError as error:
    print(error)
```

**2. Cómo se ejecuta**

```bash
python local.py
```

**3. Qué pasa por dentro.** Cada llamada a `describe()` crea un espacio de nombres propio donde vive `temperature`. Dentro, `MODEL_NAME` no existe en ese espacio, así que Python sigue buscando hacia fuera y lo encuentra en el global. Cuando la función termina, su espacio desaparece.

**4. La salida**

```text
modelo-demo a 0.7
name 'temperature' is not defined
```

!!! warning "NameError al usar una variable local fuera"
    `temperature` solo existe dentro de `describe`. Si necesitas ese valor fuera, **devuélvelo** con `return`.

---

## La regla LEGB {: .topic-title }

Cuando Python busca un nombre, mira en este orden y se queda con el primero que encuentra:

| Letra | Ámbito | Dónde |
|---|---|---|
| **L** | *Local* | Dentro de la función actual |
| **E** | *Enclosing* | En las funciones que la envuelven |
| **G** | *Global* | En el archivo (módulo) |
| **B** | *Built-in* | Los nombres de Python (`len`, `print`...) |

```python
# legb.py
level = "global"

def outer():
    level = "enclosing"

    def inner():
        level = "local"
        print("inner:", level)

    inner()
    print("outer:", level)

outer()
print("módulo:", level)
print(len("abc"))
len = "tapado"
print(len)
```

```text
inner: local
outer: enclosing
módulo: global
3
tapado
```

Hay tres variables `level` distintas, una por ámbito, y cada una gana en el suyo. Asignar a un nombre dentro de una función **crea una local**, no cambia la de fuera.

Las dos últimas líneas enseñan el error de los nombres incorporados: `len = "tapado"` en el módulo oculta la función `len` de Python. No da error, pero ya no puedes usarla. No uses `list`, `dict`, `str`, `max`, `id` o `type` como nombre de variable.

---

## global y nonlocal {: .topic-title }

Si dentro de una función **asignas** a un nombre, Python decide por defecto que es local. Eso rompe este intento de contador:

```python
# unbound.py
counter = 0

def increment_bad():
    counter = counter + 1

try:
    increment_bad()
except UnboundLocalError as error:
    print(error)

def increment_global():
    global counter
    counter = counter + 1

increment_global()
increment_global()
print(counter)
```

```text
cannot access local variable 'counter' where it is not associated with a value
2
```

- En `increment_bad`, como hay una asignación a `counter`, Python lo trata como local **en toda la función**. Al leerlo a la derecha del `=`, aún no tiene valor: `UnboundLocalError`.
- `global counter` le dice a Python «este nombre es el del módulo». Ahora funciona.
- `nonlocal` hace lo mismo con una variable de una función **envolvente** (lo ves en el siguiente apartado).

!!! warning "Por qué evitar `global`"
    Una función que cambia una variable global tiene un efecto escondido: para entender qué hace hay que mirar fuera de ella. Es difícil de probar (el resultado depende del estado de fuera) y de reutilizar. La alternativa: recibir los datos como **parámetros** y entregar el resultado con **`return`**.

    ```python
    # avoid_global.py
    history = []

    def add_global(text):
        history.append(text)

    add_global("hola")
    print(history)

    def add_clean(history, text):
        return [*history, text]

    print(add_clean([], "hola"), add_clean(["a"], "b"))
    ```

    ```text
    ['hola']
    ['hola'] ['a', 'b']
    ```

    `add_global` funciona sin `global` porque `append` **modifica** la lista, no reasigna el nombre. Pero depende de una variable de fuera. `add_clean` solo usa lo que recibe y devuelve una lista nueva.

Las constantes globales en mayúsculas (`MODEL_NAME`) sí son un uso razonable: se leen, no se cambian.

---

## Closures {: .topic-title }

Una función definida dentro de otra puede **usar las variables de la función que la envuelve**, y las sigue recordando aunque la función exterior ya haya terminado. Eso es un **closure** (cierre): la función interior lleva consigo su entorno.

```python
# closure.py
def make_counter():
    count = 0

    def increment():
        nonlocal count
        count += 1
        return count

    return increment


a = make_counter()
b = make_counter()
print(a(), a(), a())
print(b())
print(a.__closure__[0].cell_contents)
```

```text
1 2 3
1
3
```

- `make_counter` crea `count` y la función `increment`, y **devuelve la función** (sin paréntesis: no la ejecuta).
- `a` y `b` son dos funciones `increment` distintas, cada una con **su propio** `count`. `a` llega a 3 y `b` empieza en 1.
- `nonlocal count` permite modificar el `count` de la función de fuera (sin él, `count += 1` daría `UnboundLocalError`).
- El valor recordado está en `a.__closure__`.

El mismo mecanismo sirve para «fabricar» funciones con una configuración fija:

```python
# greeter.py
def make_prompt_builder(system_prompt):
    def build(question):
        return f"{system_prompt}\n\nPregunta: {question}"
    return build


brief = make_prompt_builder("Responde en una frase.")
detailed = make_prompt_builder("Responde con detalle.")
print(brief("¿Qué es un token?"))
print(detailed("¿Qué es un token?"))
```

```text
Responde en una frase.

Pregunta: ¿Qué es un token?
Responde con detalle.

Pregunta: ¿Qué es un token?
```

`brief` y `detailed` son dos funciones con el mismo código y distinto `system_prompt` recordado. Los **decoradores** ([siguiente bloque](../../05-decoradores/01-decoradores/index.md)) son esta idea aplicada: una función que recibe otra y devuelve una nueva con algo recordado.

!!! warning "Los closures guardan la variable, no su valor"
    La función interior mira la variable de fuera **cuando se ejecuta**, no cuando se crea. Si esa variable cambia, la función ve el cambio. Es una fuente de errores en bucles; [Lambdas y funciones de orden superior](../../04-funciones-como-valores/01-lambdas-y-orden-superior/index.md#el-error-del-bucle) lo muestra.

---

## Python en IA {: .topic-title }

- **Configuración fija por función:** un closure como `make_prompt_builder` produce «constructores de prompt» especializados (breve, detallado, en inglés) sin repetir código.
- **Estado de una sesión:** un contador de tokens gastados o un historial que vive dentro de un closure.
- **Constantes globales:** `MODEL_NAME`, `MAX_TOKENS` en mayúsculas al principio del archivo, como en los scripts anteriores.

!!! tip "Constantes sí, estado compartido no"
    Una global en mayúsculas que nunca cambia es segura. Una global que las funciones modifican (un historial, un contador de peticiones) es una fuente de errores difíciles de rastrear, sobre todo en programas con varias conversaciones.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `let` / `const` con ámbito de bloque | El ámbito es la **función** (no el `if` ni el `for`) |
| Variable global implícita al asignar sin declarar | La asignación crea siempre una local; hay que decir `global` |
| Closures: cualquier función interior los tiene | Igual, pero para reasignar hay que declarar `nonlocal` |
| `window` / `globalThis` | El módulo (archivo) es el ámbito global |
| Reasignar una variable de fuera: se puede | Hay que declararla `global` o `nonlocal` |

!!! tip "Consejos"
    - **Lee de fuera sin problema; para cambiar, devuelve valores.**
    - **No uses nombres incorporados** (`list`, `id`, `type`...) como variables.
    - **Si una función necesita muchos datos de fuera**, es señal de que debería recibirlos como parámetros.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no trata ámbitos (`global`, `nonlocal`) ni closures | — |
| **Documentación oficial** | |
| Tutorial — Ámbitos y espacios de nombres | <https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces> |
| Tutorial — Ejemplo de ámbitos y espacios de nombres | <https://docs.python.org/3/tutorial/classes.html#scopes-and-namespaces-example> |
| Referencia — Resolución de nombres | <https://docs.python.org/3/reference/executionmodel.html#resolution-of-names> |
| Referencia — La sentencia `global` | <https://docs.python.org/3/reference/simple_stmts.html#the-global-statement> |
| Referencia — La sentencia `nonlocal` | <https://docs.python.org/3/reference/simple_stmts.html#the-nonlocal-statement> |
| Glosario — «nested scope» | <https://docs.python.org/3/glossary.html#term-nested-scope> |
