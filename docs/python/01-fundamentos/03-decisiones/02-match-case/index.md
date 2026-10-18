# match / case { .section-python .bloque-python }

> `match` compara un valor con una lista de patrones y ejecuta el primero que encaja. Existe desde Python 3.10 y es la forma limpia de repartir comandos. Aquí ves cuándo usarlo y cuándo no.

---

## El match más simple {: .topic-title }

Un `match` coge un valor (el **sujeto**) y lo compara con cada `case` de arriba abajo. Ejecuta el primero que encaja. Se parece al `switch` de JavaScript, pero es más potente.

El flujo completo, con los comandos de un chat:

**1. El script**

```python
# commands.py
command = input("Comando: ").strip().lower()

match command:
    case "/help":
        print("Comandos: /help, /clear, /exit")
    case "/clear":
        print("Historial borrado")
    case "/exit" | "/quit":
        print("Hasta pronto")
    case _:
        print(f"Comando desconocido: {command}")
```

**2. Cómo se ejecuta**

```bash
python commands.py
```

**3. Qué pasa por dentro.** Python limpia lo escrito (`strip().lower()`) y lo compara con cada patrón en orden. Cuando uno encaja, ejecuta su bloque y **sale del `match`**: no hay `break` ni cae al siguiente caso.

**4. La salida**, con tres entradas:

```text
Comando: /help
Comandos: /help, /clear, /exit
```

```text
Comando: /QUIT
Hasta pronto
```

```text
Comando: /nada
Comando desconocido: /nada
```

Tres piezas a destacar:

- `case "/exit" | "/quit":` el `|` junta varias opciones en un mismo caso («o»).
- `case _:` el guion bajo es el **comodín**: encaja con cualquier cosa. Va el último y hace de `else`.
- Con `.strip().lower()` antes, `/QUIT` también encaja. Los patrones comparan exactamente.

!!! tip "`match` y `case` no son palabras reservadas del todo"
    Son *soft keywords*: solo significan algo dentro de un `match`. Puedes seguir teniendo una variable llamada `match` (por ejemplo, para una expresión regular) sin romper nada.

!!! warning "SyntaxError en una versión antigua"
    Antes de Python 3.10, `match` da `SyntaxError`. Comprueba tu versión con `python --version`.

---

## Patrones con estructura {: .topic-title }

La gracia del `match` es que no solo compara valores: **descompone** la estructura. Con `split()` conviertes la línea en una lista de palabras y el patrón la desmonta:

```python
# with_args.py
line = input("> ").strip()

match line.split():
    case ["/model", name]:
        print(f"Modelo cambiado a {name}")
    case ["/temp", value] if value.replace(".", "", 1).isdigit():
        print(f"Temperatura {float(value)}")
    case ["/temp", _]:
        print("La temperatura debe ser un número")
    case ["/say", first, *rest]:
        print(f"Primera palabra: {first}; resto: {rest}")
    case []:
        print("Línea vacía")
    case _:
        print("No entiendo")
```

Probando cinco entradas:

```text
> /model modelo-b
Modelo cambiado a modelo-b
> /temp 0.3
Temperatura 0.3
> /temp alta
La temperatura debe ser un número
> /say hola a todos
Primera palabra: hola; resto: ['a', 'todos']
> /model
No entiendo
```

Qué hace cada patrón:

- `["/model", name]` encaja con una lista de **exactamente dos** elementos, cuyo primero es `"/model"`. El segundo se guarda en la variable `name`. Es **captura**: `name` nace aquí.
- `if value.replace(...).isdigit()` es una **guarda**: el caso solo vale si, además de encajar el patrón, se cumple la condición. Si falla, `match` sigue con el siguiente caso (por eso `/temp alta` cae en el patrón de después).
- `["/say", first, *rest]` encaja con dos o más elementos. `*rest` recoge todo lo sobrante en una lista.
- `[]` encaja con una lista vacía.
- `/model` solo, sin nombre, no encaja con ningún patrón de dos elementos y acaba en `_`.

!!! warning "Una lista del patrón exige la longitud exacta"
    `["/model", name]` no encaja con `["/model"]` ni con `["/model", "a", "b"]`. Si quieres «el resto», usa `*rest`.

---

## Constantes: el error de la captura {: .topic-title }

Aquí hay una trampa. Un nombre suelto en un `case` **no compara**: **captura**. Dentro de un patrón, un nombre sin punto es una variable nueva.

```python
# bare_name.py
DEFAULT = "/help"
command = "/exit"

match command:
    case DEFAULT:
        print("ayuda")
    case "/exit":
        print("salir")
```

```text
SyntaxError: name capture 'DEFAULT' makes remaining patterns unreachable
```

Python no te deja: `case DEFAULT:` encajaría con todo (y guardaría el valor en `DEFAULT`), así que el caso de abajo no se alcanzaría nunca.

La solución son los **nombres con punto**, que sí se comparan por valor:

```python
# dotted.py
class Commands:
    HELP = "/help"
    EXIT = "/exit"

command = "/exit"
match command:
    case Commands.HELP:
        print("ayuda")
    case Commands.EXIT:
        print("salir")
```

```text
salir
```

`Commands` es una clase usada como contenedor de constantes (las clases se explican en el pilar de objetos). Lo que importa: con el punto, Python entiende que es un valor existente.

!!! warning "Sin ningún caso que encaje, no pasa nada"
    Un `match` sin `case _` que no encuentra coincidencia simplemente no ejecuta nada. No lanza error. El programa sigue:

    ```python
    # no_match.py
    match 404:
        case 200:
            print("ok")
    print("sigue sin error")
    ```

    ```text
    sigue sin error
    ```

---

## Cuándo NO usar match {: .topic-title }

`match` no sustituye a todos los `if`:

| Situación | Mejor |
|---|---|
| Rangos (`temperature < 0`, `temperature > 2`) | `if` / `elif` |
| Dos ramas (sí / no) | `if` / `else` |
| Condiciones que combinan varias variables | `if` con `and` / `or` |
| Un valor contra muchos literales exactos | **`match`** |
| Desmontar una lista o un diccionario con forma conocida | **`match`** |

Los rangos con guarda sí se pueden hacer (`case n if n > 5`), pero un `if` ya lo expresa más corto.

```python
# guard.py
status = 7
match status:
    case 0:
        print("cero")
    case n if n > 5:
        print(f"{n} es mayor que 5")
```

```text
7 es mayor que 5
```

---

## Python en IA {: .topic-title }

Un chat o un agente recibe órdenes constantemente: comandos del usuario, tipos de mensaje, etapas de un proceso. `match` es ideal para esa tabla de despacho.

Un patrón muy habitual es repartir según el **rol** de un mensaje (`system`, `user`, `assistant`) o según un **tipo de evento**. En lugar de una cadena de `elif`, tienes un `case` por tipo, legible de un vistazo. Cuando los mensajes sean diccionarios, `match` también sabrá desmontarlos (lo verás en el pilar de estructuras de datos).

!!! tip "Siempre un `case _`"
    En comandos de usuario, termina con `case _:` para dar un mensaje de «no entiendo». Sin él, un comando mal escrito se queda en silencio.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `switch (x) { case 1: ... }` | `match x:` / `case 1:` |
| Hay que escribir `break` | Sale solo al ejecutar un `case` |
| `case 1: case 2:` (se cuela) | <code>case 1 &#124; 2:</code> |
| `default:` | `case _:` |
| Solo compara valores | Compara y **descompone** estructuras |
| Existe desde siempre | Python 3.10 o superior |

!!! tip "Consejos"
    - **Limpia la entrada antes** (`strip()`, `lower()`): los patrones comparan exactamente.
    - **Pon los casos específicos antes que los generales.** Se prueba en orden, y el primero que encaja gana.
    - **El comodín `case _` va siempre el último.** Y nunca pongas un nombre suelto esperando que sea una constante.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye `match / case` | — |
| **Documentación oficial** | |
| Tutorial — Sentencias `match` | <https://docs.python.org/3/tutorial/controlflow.html#match-statements> |
| Referencia — La sentencia `match` (patrones, guardas, captura) | <https://docs.python.org/3/reference/compound_stmts.html#match> |
