# Del script al prompt { .section-python .bloque-python }

> Un chat de juguete que junta todo el pilar: configuración, validación, f-strings, bucles y decisiones. No llama a ningún modelo: la respuesta se simula, pero el esqueleto es el mismo que tendrá un programa real.

---

## Qué vamos a construir {: .topic-title }

Un programa de terminal con este comportamiento:

1. Pide la temperatura y repite la pregunta hasta que sea válida.
2. Abre un chat que lee lo que escribes.
3. Entiende dos comandos: `/history` y `/exit`.
4. En cada turno construye el **prompt completo** (system prompt más historial) y calcula su tamaño aproximado.
5. Si el prompt se pasa de un límite, lo rechaza.
6. Si todo va bien, devuelve una respuesta simulada.

Cada pieza es un capítulo del pilar:

| Pieza | Capítulo |
|---|---|
| Constantes de configuración | [Variables y tipos](../../02-datos-basicos/01-variables-y-tipos/index.md) |
| Construir el prompt | [Strings y f-strings](../../02-datos-basicos/02-strings-y-f-strings/index.md) |
| Leer y convertir la temperatura | [Entrada y conversión](../../02-datos-basicos/03-entrada-y-conversion/index.md) |
| Validar rango y vacío | [if / elif / else](../../03-decisiones/01-if-elif-else/index.md) |
| Comandos del chat | [match / case](../../03-decisiones/02-match-case/index.md) |
| Repetir hasta que sea válido, bucle del chat | [while](../../04-bucles/02-while/index.md) |
| Recorrer mensajes y numerarlos | [for y range](../../04-bucles/01-for-y-range/index.md) y [enumerate y zip](../../04-bucles/03-enumerate-y-zip/index.md) |

---

## El script completo {: .topic-title }

**1. El script**

```python
# chat_toy.py
MODEL_NAME = "modelo-demo"
SYSTEM_PROMPT = "Eres un asistente breve. Responde siempre en español."
MAX_PROMPT_TOKENS = 60

# 1. Pedir la temperatura hasta que sea válida
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

print(f"\n{MODEL_NAME} listo (temperatura {temperature:.1f}). /history, /exit")
history = []

# 2. Bucle de conversación
while True:
    user_text = input("Tú: ").strip()

    if not user_text:
        continue

    match user_text:
        case "/exit":
            break
        case "/history":
            for number, message in enumerate(history, start=1):
                print(f"  {number}. [{message['role']}] {message['content']}")
            continue

    history.append({"role": "user", "content": user_text})

    # 3. Construir el prompt completo con f-strings
    lines = [f"system: {SYSTEM_PROMPT}"]
    for message in history:
        lines.append(f"{message['role']}: {message['content']}")
    prompt = "\n".join(lines)

    rough_tokens = len(prompt) // 4
    if rough_tokens > MAX_PROMPT_TOKENS:
        print(f"Prompt demasiado largo (~{rough_tokens} tokens). Usa /exit y empieza de nuevo.")
        history.pop()
        continue

    # 4. Simular la respuesta del modelo (aquí iría la llamada real)
    reply = f"[{MODEL_NAME}] Has dicho {len(user_text.split())} palabras."
    history.append({"role": "assistant", "content": reply})
    print(f"Bot: {reply}  (prompt ~{rough_tokens} tokens)")

print(f"Fin: {len(history)} mensajes en el historial")
```

**2. Cómo se ejecuta**

```bash
python chat_toy.py
```

**3. Qué pasa por dentro**, bloque a bloque:

- **Configuración arriba.** Tres constantes en mayúsculas. Cambiar el comportamiento es tocar una línea.
- **Primer `while True`.** Pide la temperatura. El `try/except` maneja el texto que no es número, `continue` repite la pregunta y `break` sale cuando el valor está en rango.
- **`history = []`.** Una lista vacía (más en el pilar de estructuras de datos). Cada mensaje se guarda como un diccionario con `role` y `content`: es la forma habitual de representar una conversación.
- **Segundo `while True`.** Cada vuelta es un turno. Una entrada vacía se ignora y `/exit` rompe el bucle.
- **`match`.** Reparte los comandos. Cada `case` acaba en `break` (sale del chat) o en `continue` (vuelve a pedir).
- **El prompt.** Se parte de la línea del system prompt y se añade una línea por mensaje. `"\n".join(lines)` las une.
- **Tamaño aproximado.** `len(prompt) // 4` es una estimación muy burda de los tokens. Sirve para vigilar el límite, no para facturar.
- **Respuesta simulada.** Una f-string que cuenta las palabras. Es el hueco donde, en un programa real, va la llamada al modelo.

**4. La salida**, con una sesión de ejemplo (el usuario escribe `5`, `alta` y `0.7` para la temperatura, y luego varios mensajes):

```text
Temperatura (0 a 2): 5
Tiene que estar entre 0 y 2
Temperatura (0 a 2): alta
Escribe un número, por ejemplo 0.7
Temperatura (0 a 2): 0.7

modelo-demo listo (temperatura 0.7). /history, /exit
Tú: Hola
Bot: [modelo-demo] Has dicho 1 palabras.  (prompt ~18 tokens)
Tú: ¿Qué es un token?
Bot: [modelo-demo] Has dicho 4 palabras.  (prompt ~35 tokens)
Tú: 
Tú: /history
  1. [user] Hola
  2. [assistant] [modelo-demo] Has dicho 1 palabras.
  3. [user] ¿Qué es un token?
  4. [assistant] [modelo-demo] Has dicho 4 palabras.
Tú: Una pregunta bastante larga para que el prompt supere el límite que hemos fijado en la configuración
Prompt demasiado largo (~74 tokens). Usa /exit y empieza de nuevo.
Tú: /exit
Fin: 4 mensajes en el historial
```

Fíjate en tres cosas:

- La línea vacía no produce ninguna respuesta: `continue` la descarta.
- El prompt crece en cada turno (18 y luego 35 tokens aproximados), porque el historial entero viaja en cada petición.
- El mensaje largo se rechaza **antes** de añadirse al historial definitivo: el `history.pop()` lo quita.

!!! warning "Un modelo no recuerda: tú le reenvías todo"
    Un modelo de lenguaje no guarda la conversación entre peticiones. Cada vez recibe el prompt completo. Por eso el tamaño crece con cada turno y por eso hay un límite. Si no recortas el historial, tarde o temprano la petición ya no cabe.

---

## Errores típicos del script {: .topic-title }

Estos son los fallos más comunes al escribir algo así:

!!! warning "TypeError al juntar texto y número"
    `"Temperatura: " + temperature` falla porque `temperature` es un `float`. Usa la f-string: `f"Temperatura: {temperature}"`.

!!! warning "Olvidar la conversión"
    Si `temperature = raw_value` (sin `float(...)`), la comparación `0 <= temperature <= 2` lanza `TypeError`, porque compara un número con un texto.

!!! warning "El `break` del `match` sale del `while`"
    Dentro de un `match` que está en un bucle, `break` rompe el **bucle**, no el `match` (el `match` ya sale solo). Es justo lo que buscamos con `/exit`. Pero tenlo presente si añades un `for` dentro de un `case`: ahí el `break` saldría del `for`.

!!! warning "Un historial que nunca se recorta"
    En este juguete, el límite de `MAX_PROMPT_TOKENS` hace que la conversación acabe bloqueada. En un programa real se recortan los mensajes más antiguos.

---

## Python en IA {: .topic-title }

Lo que has construido es, en pequeño, la estructura de una aplicación con un modelo de lenguaje:

| Lo que hace el juguete | En una aplicación real |
|---|---|
| Constantes arriba | Modelo, parámetros y clave leídos de la configuración y del `.env` |
| `history` con `role` y `content` | La lista de mensajes que se envía al modelo |
| Construir `prompt` con f-strings | Armar el contexto: instrucciones, datos recuperados, pregunta |
| `rough_tokens` | Contar tokens de verdad para respetar el límite |
| `reply` simulada | La respuesta que devuelve la API |
| Validar y rechazar | Comprobar entradas antes de gastar una petición |

Para cambiar de simulado a real solo se sustituye el bloque 4. El resto del programa (leer, validar, construir, guardar) no cambia.

!!! tip "Simula primero, conecta después"
    Probar la lógica con una respuesta falsa es gratis, rápido y repetible. Cuando todo funciona, conectas el modelo real y solo puedes culpar a esa parte si algo falla.

!!! tip "Los tokens no son caracteres"
    El `len(prompt) // 4` del script es una regla del pulgar muy gruesa, pensada para texto en inglés; en español suele quedarse corta. El recuento exacto depende del tokenizador del modelo concreto.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `const MODEL_NAME = "..."` | `MODEL_NAME = "..."` |
| `readline` / `prompt()` | `input()` |
| `while (true) { ... break; }` | `while True:` y `break` |
| `switch (text) { case "/exit": ... }` | `match text:` y `case "/exit":` |
| `` `${role}: ${content}` `` | `f"{role}: {content}"` |
| `lines.join("\n")` | `"\n".join(lines)` |
| `{ role: "user", content: text }` | `{"role": "user", "content": text}` |
| `history.push(x)` | `history.append(x)` |

!!! tip "Consejos"
    - **Imprime el prompt** (`print(prompt)`) justo antes de enviarlo cuando algo no cuadre.
    - **Un `continue` por caso especial** deja el flujo principal sin anidar.
    - **Pruébalo con entradas malas a propósito:** vacío, letras en la temperatura, un comando inventado.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Entrada de dades: input() — «Pràctica guiada: el generador de rutes» (construir texto a partir de entradas) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_003/#4-practica-guiada-el-generador-de-rutes> |
| Iteracions: while — «El patró "Menú d'Opcions"» (bucle con salida) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_301/#2-el-patro-menu-dopcions-bucle-amb-break-o-flag> |
| Iteracions: while — «El cas d'ús estrella: validar l'entrada de dades» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_301/#1-el-cas-dus-estrella-validar-lentrada-de-dades> |
| **Documentación oficial** | |
| `input()` | <https://docs.python.org/3/library/functions.html#input> |
| Tutorial — Literales de cadena formateados | <https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals> |
| Tutorial — Sentencias `match` | <https://docs.python.org/3/tutorial/controlflow.html#match-statements> |
| Referencia — La sentencia `while` | <https://docs.python.org/3/reference/compound_stmts.html#the-while-statement> |
| `enumerate()` | <https://docs.python.org/3/library/functions.html#enumerate> |
| Tutorial — Gestionar excepciones | <https://docs.python.org/3/tutorial/errors.html#handling-exceptions> |
