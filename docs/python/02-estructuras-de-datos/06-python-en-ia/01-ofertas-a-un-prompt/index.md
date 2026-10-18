# Datos de ofertas a un prompt { .section-python .bloque-python }

> Un script que recibe una lista de ofertas de empleo en bruto y la deja convertida en los mensajes que enviarías a un modelo. Une listas, diccionarios, sets, comprensiones y desempaquetado en un solo flujo, sin llamar a ninguna API.

---

## Qué vamos a construir {: .topic-title }

Partes de una lista de diccionarios con ofertas, con una repetida. Quieres terminar con una lista de mensajes `role` / `content` lista para enviarla a una API. En el camino:

1. Quitas las ofertas repetidas.
2. Te quedas con las que pagan lo suficiente.
3. Las agrupas por ciudad.
4. Sacas los tags distintos y cuántas veces aparece cada uno.
5. Formateas las ofertas como texto.
6. Montas los mensajes.
7. Estimas el tamaño antes de enviar.

Cada paso usa una pieza del pilar:

| Paso | Capítulo |
|---|---|
| Lista de diccionarios | [Diccionarios anidados y JSON](../../02-diccionarios/02-diccionarios-anidados-y-json/index.md) |
| Quitar repetidos con un set | [Sets](../../03-sets/01-sets/index.md) |
| Filtrar y aplanar | [Comprensiones de lista](../../04-comprensiones/01-comprensiones-de-lista/index.md) y [de dict y set](../../04-comprensiones/02-comprensiones-dict-set-generadores/index.md) |
| Agrupar por ciudad | [Diccionarios](../../02-diccionarios/01-diccionarios/index.md#setdefault) |
| Recorrer con número y desempaquetar | [Desempaquetado](../../05-desempaquetado/01-desempaquetado/index.md) |
| Texto del prompt | [Strings y f-strings](../../../01-fundamentos/02-datos-basicos/02-strings-y-f-strings/index.md) |

---

## El script completo {: .topic-title }

**1. El script**

```python
# offers_to_prompt.py
import json

MIN_SALARY = 35000
MODEL_NAME = "modelo-demo"

offers = [
    {"title": "Frontend Developer", "company": "Tech Solutions", "city": "Madrid", "salary": 32000, "tags": ["react", "css"]},
    {"title": "Backend Developer", "company": "Data Corp", "city": "Barcelona", "salary": 41000, "tags": ["python", "sql"]},
    {"title": "Data Analyst", "company": "Data Corp", "city": "Madrid", "salary": 38000, "tags": ["python", "sql", "pandas"]},
    {"title": "Backend Developer", "company": "Data Corp", "city": "Barcelona", "salary": 41000, "tags": ["python", "sql"]},
    {"title": "QA Engineer", "company": "Test Lab", "city": "Girona", "salary": 30000, "tags": ["testing"]},
    {"title": "ML Engineer", "company": "Neural SL", "city": "Madrid", "salary": 52000, "tags": ["python", "pytorch"]},
]

# 1. Quitar ofertas repetidas conservando el orden
seen = set()
unique_offers = []
for offer in offers:
    key = (offer["title"], offer["company"], offer["city"])
    if key in seen:
        continue
    seen.add(key)
    unique_offers.append(offer)
print(f"{len(offers)} ofertas, {len(unique_offers)} sin repetir")

# 2. Filtrar por salario con una comprensión
well_paid = [offer for offer in unique_offers if offer["salary"] >= MIN_SALARY]
print([offer["title"] for offer in well_paid])

# 3. Agrupar por ciudad con un diccionario
by_city = {}
for offer in well_paid:
    by_city.setdefault(offer["city"], []).append(offer["title"])
print(by_city)

# 4. Tags distintos con un set y cuántas veces aparece cada uno
all_tags = {tag for offer in well_paid for tag in offer["tags"]}
print(sorted(all_tags))
tag_count = {}
for offer in well_paid:
    for tag in offer["tags"]:
        tag_count[tag] = tag_count.get(tag, 0) + 1
print(tag_count)

# 5. Formatear el contexto en texto
lines = [
    f"{number}. {offer['title']} en {offer['company']} ({offer['city']}), {offer['salary']:,} EUR, tags: {', '.join(offer['tags'])}"
    for number, offer in enumerate(well_paid, start=1)
]
context = "\n".join(lines)
print(context)

# 6. Mensajes listos para una API
messages = [
    {"role": "system", "content": "Eres un orientador laboral. Responde en español y de forma breve."},
    {"role": "user", "content": f"Estas son las ofertas disponibles:\n{context}\n\n¿Cuál encaja con alguien que sabe Python y SQL?"},
]
print(json.dumps(messages, indent=2, ensure_ascii=False))

# 7. Tamaño aproximado antes de enviar
total_chars = sum(len(message["content"]) for message in messages)
print(f"~{total_chars // 4} tokens aproximados")
request = {"model": MODEL_NAME, "temperature": 0.2, "messages": messages}
print(list(request), len(request["messages"]))
```

**2. Cómo se ejecuta**

```bash
python offers_to_prompt.py
```

**3. Qué pasa por dentro**, paso a paso:

- **Paso 1: deduplicar con orden.** Dos ofertas son «la misma» si coinciden título, empresa y ciudad. Esa tupla es la **clave**: es hashable, así que cabe en un set. Si ya está en `seen`, `continue` salta la oferta; si no, se anota y se guarda. Un set por sí solo no sirve aquí, porque las ofertas son diccionarios (no hashables) y se perdería el orden.
- **Paso 2: filtrar.** Una comprensión con `if` deja solo las de salario suficiente. `MIN_SALARY` está arriba, con la configuración.
- **Paso 3: agrupar.** `setdefault(ciudad, [])` crea la lista la primera vez que aparece la ciudad. El `append` mete el título.
- **Paso 4: tags.** Una comprensión de set con dos `for` aplana y deduplica en una línea. Para **contar**, `tag_count.get(tag, 0) + 1` suma uno a lo que hubiera (o a cero si es la primera vez).
- **Paso 5: texto.** Una comprensión de lista con `enumerate(..., start=1)` numera las ofertas. Dentro de la f-string, `:,` pone el separador de miles y `', '.join(...)` une los tags. Las comillas simples dentro del texto con comillas dobles evitan que Python se confunda.
- **Paso 6: mensajes.** Una lista de dos diccionarios con `role` y `content`: el formato que esperan las APIs de modelos de lenguaje. El contenido del usuario lleva las ofertas dentro (`{context}`).
- **Paso 7: tamaño.** `sum(...)` con una expresión generadora cuenta los caracteres de todos los mensajes. Dividirlos entre 4 es una estimación muy burda de los tokens.

**4. La salida**

```text
6 ofertas, 5 sin repetir
['Backend Developer', 'Data Analyst', 'ML Engineer']
{'Barcelona': ['Backend Developer'], 'Madrid': ['Data Analyst', 'ML Engineer']}
['pandas', 'python', 'pytorch', 'sql']
{'python': 3, 'sql': 2, 'pandas': 1, 'pytorch': 1}
1. Backend Developer en Data Corp (Barcelona), 41,000 EUR, tags: python, sql
2. Data Analyst en Data Corp (Madrid), 38,000 EUR, tags: python, sql, pandas
3. ML Engineer en Neural SL (Madrid), 52,000 EUR, tags: python, pytorch
[
  {
    "role": "system",
    "content": "Eres un orientador laboral. Responde en español y de forma breve."
  },
  {
    "role": "user",
    "content": "Estas son las ofertas disponibles:\n1. Backend Developer en Data Corp (Barcelona), 41,000 EUR, tags: python, sql\n2. Data Analyst en Data Corp (Madrid), 38,000 EUR, tags: python, sql, pandas\n3. ML Engineer en Neural SL (Madrid), 52,000 EUR, tags: python, pytorch\n\n¿Cuál encaja con alguien que sabe Python y SQL?"
  }
]
~93 tokens aproximados
['model', 'temperature', 'messages'] 2
```

Mira lo que ha pasado con los datos: de 6 ofertas a 5 sin repetir, de 5 a 3 con buen salario, y de 3 ofertas (estructuras) a un texto que el modelo puede leer. Cada paso transforma la colección anterior, y cada una está en la estructura más adecuada para lo que se hace con ella.

Los `\n` que ves dentro de `"content"` son saltos de línea del texto, que `json.dumps` escribe como `\n` para que quepan en una sola línea de JSON.

---

## Errores típicos del script {: .topic-title }

!!! warning "TypeError: unhashable type: 'dict'"
    Si intentas `seen.add(offer)` con la oferta entera, falla: un diccionario no es hashable. Por eso la clave es una **tupla** con los campos que identifican la oferta.

!!! warning "KeyError: 'salary'"
    Si una oferta llega sin `salary`, `offer["salary"]` rompe el script entero. Si el dato puede faltar, usa `offer.get("salary", 0)` en el filtro. Dónde decidir entre `[...]` y `.get()` lo tienes en [Diccionarios](../../02-diccionarios/01-diccionarios/index.md#leer-con-seguridad).

!!! warning "Quitar repetidos con `set(offers)`"
    No se puede: los diccionarios no entran en un set. Y `list(set(...))` perdería el orden aunque pudiera. El patrón de las claves con `seen` resuelve las dos cosas.

!!! warning "Un prompt vacío o sin datos"
    Si ningún dato pasa el filtro, `context` queda vacío y el modelo recibiría un mensaje sin ofertas. Comprueba `if not well_paid:` antes de montar los mensajes.

---

## Python en IA {: .topic-title }

Esta es la tarea que más se repite en aplicaciones con modelos: **tomar datos estructurados, filtrarlos y convertirlos en texto para el modelo**. Lo que cambia entre aplicaciones son los datos (ofertas, documentos, tickets, productos), no el patrón.

| Lo que hace el script | En una aplicación real |
|---|---|
| Lista de ofertas | Resultados de una base de datos o de una API |
| Filtrar por salario | Quedarse con los fragmentos más relevantes de una búsqueda |
| Deduplicar con `seen` | Evitar enviar el mismo fragmento dos veces (y gastar tokens) |
| Agrupar por ciudad | Organizar el contexto por fuente o por tema |
| Texto numerado | Contexto con referencias `[1]`, `[2]` que el modelo puede citar |
| `messages` con `role` / `content` | La lista que recibe la API |
| `// 4` | Contar tokens con el tokenizador del modelo |

Cuando el programa conecte con una API real, el cambio será pequeño: enviar `request` y leer la respuesta (que llega como JSON y se vuelve a diccionario con `json.loads`, como en [Diccionarios anidados y JSON](../../02-diccionarios/02-diccionarios-anidados-y-json/index.md#diccionarios-y-json)). Todo lo anterior queda igual.

!!! tip "Prepara los datos antes, formatea después"
    Primero limpia, filtra y deduplica las estructuras (listas, sets, diccionarios). Convierte a texto en el último paso. Es más fácil depurar datos que depurar un texto largo.

!!! tip "Menos contexto, mejores respuestas y menos coste"
    Enviar solo lo relevante (el filtro del paso 2) ahorra tokens y suele mejorar la respuesta. Es una de las razones de que el filtrado sea tan frecuente.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `[...new Set(arr)]` | `list(set(arr))` (sin orden) o `list(dict.fromkeys(arr))` (con orden) |
| `offers.filter(o => o.salary >= MIN)` | `[o for o in offers if o["salary"] >= MIN]` |
| `Object.groupBy(offers, o => o.city)` | `setdefault(city, []).append(...)` |
| `` `${n}. ${o.title}` `` | `f"{n}. {o['title']}"` |
| `offers.map((o, i) => ...)` | `[... for i, o in enumerate(offers, start=1)]` |
| `JSON.stringify(messages, null, 2)` | `json.dumps(messages, indent=2, ensure_ascii=False)` |
| `lines.join("\n")` | `"\n".join(lines)` |

!!! tip "Consejos"
    - **Un bloque de código por paso**, con un comentario numerado, como en el script.
    - **Imprime después de cada paso** mientras construyes: si un resultado no es el esperado, lo ves donde nace.
    - **Mantén la configuración arriba** (`MIN_SALARY`, `MODEL_NAME`), igual que en el script del pilar anterior.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Diccionaris (dict) — «Estructures niuades (llistes de diccionaris)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_401/#4-estructures-niuades-llistes-de-diccionaris> |
| Llistes i Tuples — «Pràctica guiada: gestor de cua de tasques» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_101/#practica-guiada-gestor-de-cua-de-tasques> |
| **Documentación oficial** | |
| Tutorial — Comprensiones de lista | <https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions> |
| Tutorial — Sets | <https://docs.python.org/3/tutorial/datastructures.html#sets> |
| Tutorial — Diccionarios | <https://docs.python.org/3/tutorial/datastructures.html#dictionaries> |
| Biblioteca — `dict.setdefault` | <https://docs.python.org/3/library/stdtypes.html#dict.setdefault> |
| Módulo `json` — `json.dumps` | <https://docs.python.org/3/library/json.html#json.dumps> |
| Tutorial — Literales de cadena formateados | <https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals> |
