# CSV { .section-python .bloque-python }

> Un CSV es una tabla en texto: una fila por línea y las columnas separadas por un carácter. El módulo `csv` se ocupa de las comillas y los separadores por ti. Aquí lo lees, lo escribes y evitas los dos problemas clásicos: las líneas dobles y los acentos en Excel.

---

## Escribir un CSV {: .topic-title }

Un **CSV** (*comma-separated values*) es un texto con una fila por línea y los valores separados por comas. Se podría construir a mano, pero los valores con comas o con comillas lo rompen. El módulo `csv` los protege. Los apuntes de la escuela recomiendan `DictWriter` cuando se parte de una lista de diccionarios.

**1. El script**

```python
# write_csv.py
import csv

offers = [
    {"title": "Frontend Developer", "company": "Tech Solutions", "city": "Madrid", "salary": 32000},
    {"title": "Backend, Senior", "company": "Data Corp", "city": "Barcelona", "salary": 41000},
    {"title": "Data Analyst", "company": "Data \"Corp\"", "city": "Madrid", "salary": 38000},
]

with open("data/offers.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=["title", "company", "city", "salary"])
    writer.writeheader()
    writer.writerows(offers)

print(open("data/offers.csv", encoding="utf-8", newline="").read())
```

**2. Cómo se ejecuta**

```bash
python write_csv.py
```

**3. Qué pasa por dentro.** `DictWriter` recibe el archivo y el orden de las columnas (`fieldnames`). `writeheader()` escribe la fila de cabecera y `writerows()` una fila por diccionario. Si un valor lleva una coma o una comilla, el módulo lo **entrecomilla** y duplica las comillas internas.

**4. La salida**

```text
title,company,city,salary
Frontend Developer,Tech Solutions,Madrid,32000
"Backend, Senior",Data Corp,Barcelona,41000
Data Analyst,"Data ""Corp""",Madrid,38000

```

Fíjate en `"Backend, Senior"`: sin comillas, la coma habría creado una columna de más.

(El `open(...).read()` final es solo para enseñar el contenido; en un programa real usarías `with`.)

!!! warning "Siempre `newline=\"\"` al abrir un CSV"
    Es un detalle de la documentación oficial que los apuntes incluyen al escribir pero conviene entender. En Windows, sin `newline=""`, las líneas salen **dobladas** (con una línea en blanco entre cada fila):

    ```python
    # newline_trap.py
    import csv

    with open("data/no_newline.csv", "w", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["a", "b"])
        writer.writerow(["1", "2"])
    print(open("data/no_newline.csv", "rb").read())

    with open("data/with_newline.csv", "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["a", "b"])
        writer.writerow(["1", "2"])
    print(open("data/with_newline.csv", "rb").read())
    ```

    ```text
    b'a,b\r\r\n1,2\r\r\n'
    b'a,b\r\n1,2\r\n'
    ```

    El primero tiene `\r\r\n`: el módulo `csv` escribe `\r\n` y Python, en modo texto, vuelve a convertir el `\n`. Con `newline=""` desactivas esa conversión. Hazlo también al **leer**.

---

## Leer un CSV {: .topic-title }

Hay dos lectores. `csv.reader` entrega cada fila como una **lista**. `csv.DictReader` usa la primera fila como nombres y entrega cada fila como un **diccionario**; es el recomendado, y los apuntes también lo dicen.

```python
# read_csv.py
import csv

with open("data/offers.csv", encoding="utf-8", newline="") as file:
    reader = csv.DictReader(file)
    print(reader.fieldnames)
    rows = list(reader)

print(len(rows))
print(rows[1])
print(type(rows[0]["salary"]))

total = sum(int(row["salary"]) for row in rows)
print(total)

with open("data/offers.csv", encoding="utf-8", newline="") as file:
    reader = csv.reader(file)
    header = next(reader)
    for row in reader:
        print(row[0], "|", row[3])
```

```text
['title', 'company', 'city', 'salary']
3
{'title': 'Backend, Senior', 'company': 'Data Corp', 'city': 'Barcelona', 'salary': '41000'}
<class 'str'>
111000
Frontend Developer | 32000
Backend, Senior | 41000
Data Analyst | 38000
```

- La coma dentro de `"Backend, Senior"` **no** parte la fila: el lector respeta las comillas.
- **Todo llega como texto.** `salary` es `'41000'`, un `str`. Convierte con `int()` o `float()` ([Entrada y conversión](../../../01-fundamentos/02-datos-basicos/03-entrada-y-conversion/index.md)).
- `next(reader)` consume la cabecera, y el `for` recorre el resto.
- `list(reader)` carga todas las filas; para archivos grandes, recórrelo con un `for`.

!!! warning "Los números del CSV son texto"
    Comparar `row["salary"] > 35000` da `TypeError`, y comparar con otro texto da resultados falsos (`"9000" > "35000"` es `True`). Convierte al leer.

---

## Otro separador y Excel {: .topic-title }

En países con coma decimal (España, por ejemplo), Excel exporta con **punto y coma** (`;`) para no mezclar. Se indica con `delimiter`:

```python
# delimiter.py
import csv

with open("data/spanish.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file, delimiter=";")
    writer.writerow(["título", "salario"])
    writer.writerow(["Analista de datos", "38000,5"])

print(open("data/spanish.csv", encoding="utf-8", newline="").read())

with open("data/spanish.csv", encoding="utf-8", newline="") as file:
    for row in csv.DictReader(file, delimiter=";"):
        print(row, float(row["salario"].replace(",", ".")))

with open("data/spanish.csv", encoding="utf-8", newline="") as file:
    print(next(csv.reader(file)))
```

```text
título;salario
Analista de datos;38000,5

{'título': 'Analista de datos', 'salario': '38000,5'} 38000.5
['título;salario']
```

- Con `delimiter=";"` se lee bien; sin él, la fila entera queda en **una sola columna** (la última línea).
- `float("38000,5")` falla; hay que cambiar la coma por un punto antes.

Excel, además, a veces no reconoce el UTF-8 y rompe los acentos. Una solución es guardar con `encoding="utf-8-sig"`, que añade una marca (BOM) al principio:

```python
# bom.py
import csv

with open("data/excel.csv", "w", newline="", encoding="utf-8-sig") as file:
    csv.writer(file, delimiter=";").writerow(["ciudad", "año"])
print(open("data/excel.csv", "rb").read())

with open("data/excel.csv", newline="", encoding="utf-8") as file:
    print(next(csv.reader(file, delimiter=";")))
with open("data/excel.csv", newline="", encoding="utf-8-sig") as file:
    print(next(csv.reader(file, delimiter=";")))
```

```text
b'\xef\xbb\xbfciudad;a\xc3\xb1o\r\n'
['﻿ciudad', 'año']
['ciudad', 'año']
```

Los tres primeros bytes (`\xef\xbb\xbf`) son esa marca. Leer ese archivo con `utf-8` normal la deja pegada al primer nombre de columna (`'﻿ciudad'`), y luego `row["ciudad"]` no encuentra la clave. Para **leer** archivos que vienen de Excel, usa `utf-8-sig`.

---

## Python en IA {: .topic-title }

El CSV es el formato de los datasets pequeños: preguntas con la respuesta esperada para evaluar, listas de documentos, resultados de pruebas de un modelo. Es fácil de revisar en una hoja de cálculo y de generar desde un script.

- **Un dataset de evaluación** como CSV (`question`, `expected`) que lees con `DictReader` y recorres con un `for`.
- **Resultados** (`question`, `answer`, `score`) que escribes con `DictWriter` para abrirlos en Excel.

!!! tip "Cuidado con las comas en los textos"
    Los textos de IA (preguntas, respuestas) llevan comas, comillas y saltos de línea. Es justo para lo que sirve el módulo `csv`: nunca construyas esas líneas con `+` ni con `join`.

---

## Comparación con JavaScript {: .topic-title }

| En Node.js | En Python |
|---|---|
| Librería externa (`csv-parse`, `papaparse`) | `csv` ya viene con Python |
| `line.split(",")` (frágil con comas dentro) | `csv.reader` (respeta comillas) |
| Cada fila como objeto con las claves de la cabecera | `csv.DictReader` |
| Todo llega como string | Todo llega como `str` |
| Escribir: unir con `join(",")` a mano | `csv.DictWriter` |

!!! tip "Consejos"
    - **`newline=""` y `encoding="utf-8"` al abrir.**
    - **`DictReader` / `DictWriter`** antes que listas por posición.
    - **`utf-8-sig`** para leer lo que viene de Excel y para entregarle un CSV con acentos.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Fitxers de text pla — «Fitxers estructurats en taula (.csv)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#2-fitxers-estructurats-en-taula-csv> |
| Fitxers de text pla — «Lectura de fitxers CSV» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#lectura-de-fitxers-csv> |
| Fitxers de text pla — «Escriptura de fitxers CSV» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_601/#escriptura-de-fitxers-csv> |
| **Documentación oficial** | |
| Módulo `csv` | <https://docs.python.org/3/library/csv.html> |
| `csv.reader` | <https://docs.python.org/3/library/csv.html#csv.reader> |
| `csv.DictReader` | <https://docs.python.org/3/library/csv.html#csv.DictReader> |
| `csv.DictWriter` | <https://docs.python.org/3/library/csv.html#csv.DictWriter> |
| Codificaciones estándar (`utf-8-sig`) | <https://docs.python.org/3/library/codecs.html#standard-encodings> |
