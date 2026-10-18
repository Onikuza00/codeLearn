# sqlite3 { .section-python .bloque-python }

> SQLite es una base de datos completa que vive en un solo archivo y viene con Python. Aquí haces el ciclo completo (crear, leer, actualizar y borrar), pasas los datos con `?` para evitar la inyección SQL y entiendes qué hace de verdad `with conn`.

---

## Conectar y crear la tabla {: .topic-title }

Cuando los datos crecen, un CSV o un JSON se quedan cortos: buscar, filtrar o evitar repetidos obliga a recorrer todo. Una **base de datos** lo hace por ti. **SQLite** guarda todo en un único archivo (`offers.db`) y el módulo `sqlite3` lo maneja sin instalar nada. Los apuntes de la escuela cubren la conexión y las lecturas y escrituras básicas; aquí se completa el ciclo con actualizar y borrar (el título de esa página dice «CRUD básico», pero solo trata el crear y el leer).

**1. El script**, por partes. Primero la conexión y la tabla:

```python
# crud.py (parte 1)
import sqlite3
from contextlib import closing

with closing(sqlite3.connect("data/offers.db")) as conn:
    conn.row_factory = sqlite3.Row

    with conn:
        conn.execute("DROP TABLE IF EXISTS offers")
        conn.execute(
            """
            CREATE TABLE offers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                company TEXT NOT NULL,
                city TEXT,
                salary INTEGER,
                UNIQUE (title, company, city)
            )
            """
        )
```

**2. Cómo se ejecuta:** `python crud.py` (el script entero son las tres partes seguidas, dentro del mismo `with closing(...)`).

**3. Qué pasa por dentro** (parte 1):

- `sqlite3.connect("data/offers.db")` abre el archivo y lo **crea si no existe**.
- `closing(...)` garantiza que la conexión se **cierra** al salir del bloque. Hace falta porque `with conn` **no cierra** la conexión (ver más abajo).
- `conn.row_factory = sqlite3.Row` hace que cada fila se pueda leer **por nombre de columna**, no solo por posición.
- `with conn:` abre una **transacción**: si el bloque acaba bien, hace `commit`; si hay una excepción, hace `rollback`.
- `conn.execute(...)` ejecuta una sentencia SQL (crea un cursor internamente; los apuntes lo crean a mano con `conn.cursor()`, y es equivalente).
- `UNIQUE (title, company, city)` impide ofertas repetidas.

---

## Crear y leer {: .topic-title }

Siguiendo en el mismo bloque `with closing(...)`:

```python
# crud.py (parte 2)
    # CREATE
    with conn:
        conn.execute(
            "INSERT INTO offers (title, company, city, salary) VALUES (?, ?, ?, ?)",
            ("Frontend Developer", "Tech Solutions", "Madrid", 32000),
        )
        conn.executemany(
            "INSERT INTO offers (title, company, city, salary) VALUES (?, ?, ?, ?)",
            [
                ("Backend Developer", "Data Corp", "Barcelona", 41000),
                ("Data Analyst", "Data Corp", "Madrid", 38000),
                ("QA Engineer", "Test Lab", "Girona", 30000),
            ],
        )

    # READ
    rows = conn.execute("SELECT * FROM offers WHERE salary >= ? ORDER BY salary DESC", (35000,)).fetchall()
    for row in rows:
        print(row["id"], row["title"], row["salary"])
    print(dict(rows[0]))
    one = conn.execute("SELECT title FROM offers WHERE id = ?", (3,)).fetchone()
    print(one["title"], conn.execute("SELECT title FROM offers WHERE id = ?", (99,)).fetchone())
    print(conn.execute("SELECT COUNT(*), AVG(salary) FROM offers").fetchone()[:])
```

**4. La salida** de esta parte:

```text
2 Backend Developer 41000
3 Data Analyst 38000
{'id': 2, 'title': 'Backend Developer', 'company': 'Data Corp', 'city': 'Barcelona', 'salary': 41000}
Data Analyst None
(4, 35250.0)
```

- Los **`?`** son marcadores: los datos van **aparte**, en una tupla. Una tupla de un solo valor lleva coma: `(35000,)` (un detalle que los apuntes señalan con razón).
- `executemany` repite la sentencia por cada tupla de la lista.
- `fetchall()` devuelve todas las filas; `fetchone()` una sola, o **`None`** si no hay (el id 99).
- Con `Row`, `row["title"]` funciona y `dict(row)` la convierte a diccionario.
- Las funciones de SQL (`COUNT`, `AVG`) calculan en la base de datos.

---

## Actualizar y borrar {: .topic-title }

```python
# crud.py (parte 3)
    # UPDATE
    with conn:
        cursor = conn.execute("UPDATE offers SET salary = salary + ? WHERE city = ?", (1000, "Madrid"))
    print("filas actualizadas:", cursor.rowcount)

    # DELETE
    with conn:
        cursor = conn.execute("DELETE FROM offers WHERE salary < ?", (31000,))
    print("filas borradas:", cursor.rowcount)

    for row in conn.execute("SELECT title, salary FROM offers ORDER BY id"):
        print(tuple(row))
```

```text
filas actualizadas: 2
filas borradas: 1
('Frontend Developer', 33000)
('Backend Developer', 41000)
('Data Analyst', 39000)
```

- `UPDATE` cambia filas; `DELETE` las borra. `rowcount` dice **cuántas** afectó.
- Sin el `WHERE`, cualquiera de los dos afecta a **todas** las filas. Ponlo siempre.
- Recorrer el resultado de `execute` con un `for` lee fila a fila.

El ciclo completo es **CRUD**: *Create* (`INSERT`), *Read* (`SELECT`), *Update* (`UPDATE`), *Delete* (`DELETE`).

---

## ¿Por qué el signo de interrogación? {: .topic-title }

Los apuntes lo explican: nunca se concatena texto dentro de una sentencia SQL. Esto es lo que ocurre si se hace:

```python
# injection.py
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE users (name TEXT, secret TEXT)")
conn.executemany("INSERT INTO users VALUES (?, ?)", [("ana", "1234"), ("luis", "abcd")])

user_input = "x' OR '1'='1"
bad = f"SELECT name, secret FROM users WHERE name = '{user_input}'"
print(bad)
print(conn.execute(bad).fetchall())
print(conn.execute("SELECT name, secret FROM users WHERE name = ?", (user_input,)).fetchall())
conn.close()
```

```text
SELECT name, secret FROM users WHERE name = 'x' OR '1'='1'
[('ana', '1234'), ('luis', 'abcd')]
[]
```

La entrada del usuario cambió la **lógica** de la consulta (`OR '1'='1'` siempre es verdadero) y devolvió todos los datos. Es la **inyección SQL**. Con `?`, el valor viaja aparte y se trata siempre como un **dato**, nunca como SQL: la misma entrada no encuentra nada.

(`":memory:"` crea una base de datos temporal en memoria, útil para probar.)

!!! warning "Los `?` no sirven para nombres de tabla o de columna"
    Solo para **valores**. Si necesitas variar la tabla o la columna, elígela de una lista de nombres permitidos que escribas tú; nunca de lo que escriba un usuario.

---

## Errores y transacciones {: .topic-title }

```python
# errors.py
import sqlite3
from contextlib import closing

with closing(sqlite3.connect("data/offers.db")) as conn:
    try:
        with conn:
            conn.execute("INSERT INTO offers (title, company, city, salary) VALUES (?, ?, ?, ?)", ("Data Analyst", "Data Corp", "Madrid", 1))
    except sqlite3.IntegrityError as error:
        print("IntegrityError:", error)

    try:
        with conn:
            conn.execute("INSERT INTO offers (title, company, city, salary) VALUES (?, ?, ?, ?)", ("Nuevo", "Co", "Madrid", 1))
            conn.execute("INSERT INTO offers (title, company, city, salary) VALUES (?, ?, ?, ?)", ("Nuevo", "Co", "Madrid", 2))
    except sqlite3.IntegrityError:
        print("segunda inserción falló; la primera se deshizo")
    print(conn.execute("SELECT COUNT(*) FROM offers WHERE title = 'Nuevo'").fetchone()[0])

    try:
        conn.execute("SELECT * FROM nope")
    except sqlite3.OperationalError as error:
        print("OperationalError:", error)

    try:
        conn.execute("SELECT * FROM offers WHERE id = ?", 3)
    except sqlite3.ProgrammingError as error:
        print("ProgrammingError:", error)
    print(conn.execute("SELECT title FROM offers WHERE id = ?", (3,)).fetchone()[0])
```

```text
IntegrityError: UNIQUE constraint failed: offers.title, offers.company, offers.city
segunda inserción falló; la primera se deshizo
0
OperationalError: no such table: nope
ProgrammingError: parameters are of unsupported type
Data Analyst
```

| Error | Cuándo |
|---|---|
| `IntegrityError` | Se viola una restricción (`UNIQUE`, `NOT NULL`...) |
| `OperationalError` | Algo falla al operar (tabla inexistente, base bloqueada...) |
| `ProgrammingError` | Uso incorrecto de la API (parámetros mal pasados, conexión cerrada) |
| `sqlite3.Error` | La clase madre de todos; para capturarlos juntos |

- La **transacción** del `with conn:` es atómica: en el segundo bloque, la primera fila se insertó, la segunda falló por repetida y **se deshizo todo**. El recuento da `0`.
- `execute(sql, 3)` falla porque los parámetros deben ir en una **tupla** `(3,)`.

### `with conn` no cierra la conexión

Los apuntes usan `conn.close()` y `if 'conn' in locals()` dentro de `finally`; es frágil. Y tampoco es verdad que `with sqlite3.connect(...) as conn` cierre la conexión: **solo confirma o deshace**.

```python
# context_manager.py
import sqlite3

conn = sqlite3.connect(":memory:")
with conn:
    conn.execute("CREATE TABLE t (n INTEGER)")
    conn.execute("INSERT INTO t VALUES (1)")
try:
    with conn:
        conn.execute("INSERT INTO t VALUES (2)")
        raise RuntimeError("fallo a mitad")
except RuntimeError:
    pass
print(conn.execute("SELECT n FROM t").fetchall())

try:
    conn.execute("SELECT 1")
    print("la conexión sigue abierta tras el with")
finally:
    conn.close()
try:
    conn.execute("SELECT 1")
except sqlite3.ProgrammingError as error:
    print(error)
```

```text
[(1,)]
la conexión sigue abierta tras el with
Cannot operate on a closed database.
```

El segundo `INSERT` se deshizo (solo queda `(1,)`) y la conexión **seguía abierta**. Para cerrar al salir, el patrón es `with closing(sqlite3.connect(...)) as conn:` más el `with conn:` para las transacciones, como en `crud.py`.

---

## Python en IA {: .topic-title }

SQLite es el sitio razonable para **guardar conversaciones y resultados** cuando ya hay muchos: buscar los mensajes de una conversación, filtrar por fecha, contar tokens gastados, evitar duplicados. Está en un archivo, no hay servidor que instalar y sirve para prototipos y herramientas locales.

!!! tip "Parámetros siempre, aunque el texto lo escribas tú"
    Los textos de IA (mensajes de usuario, respuestas del modelo) contienen comillas, apóstrofos y saltos de línea. Con `?` no hay que escaparlos y no se rompe la sentencia.

!!! warning "Un mensaje del usuario es entrada no confiable"
    Y la respuesta de un modelo también. Nunca construyas SQL con `f"..."` sobre ellos.

---

## Comparación con JavaScript {: .topic-title }

| En Node.js | En Python |
|---|---|
| Librería externa (`better-sqlite3`, `sqlite3`) | `sqlite3` incluido en la biblioteca estándar |
| `db.prepare("... ?").run(x)` | `conn.execute("... ?", (x,))` |
| `stmt.get(x)` / `stmt.all(x)` | `fetchone()` / `fetchall()` |
| Filas como objetos | `row_factory = sqlite3.Row` (o tuplas por defecto) |
| `db.transaction(fn)` | `with conn:` |
| `db.close()` | `closing(...)` o `conn.close()` |

!!! tip "Consejos"
    - **`?` siempre y la tupla con coma:** `(valor,)`.
    - **`with conn:` para transacciones y `closing()` para cerrar.**
    - **`WHERE` en cada `UPDATE` y `DELETE`.**

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Bases de dades: SQLite — «Com funciona la connexió a SQLite?» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_603/#1-com-funciona-la-connexio-a-sqlite> |
| Bases de dades: SQLite — «Inserir i consultar dades (CRUD bàsic)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_603/#2-inserir-i-consultar-dades-crud-basic> |
| Bases de dades: SQLite — «Inserir dades de forma segura (paràmetres ?)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_603/#inserir-dades-de-forma-segura-parametres> |
| Bases de dades: SQLite — «Gestió d'errors i transaccions amb try...except» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_603/#3-gestio-derrors-i-transaccions-amb-tryexcept> |
| **Documentación oficial** | |
| Módulo `sqlite3` | <https://docs.python.org/3/library/sqlite3.html> |
| `sqlite3.connect` | <https://docs.python.org/3/library/sqlite3.html#sqlite3.connect> |
| Marcadores de posición (`?`) | <https://docs.python.org/3/library/sqlite3.html#sqlite3-placeholders> |
| `sqlite3.Row` | <https://docs.python.org/3/library/sqlite3.html#sqlite3.Row> |
| La conexión como gestor de contexto | <https://docs.python.org/3/library/sqlite3.html#sqlite3-connection-context-manager> |
| `Cursor.executemany` | <https://docs.python.org/3/library/sqlite3.html#sqlite3.Cursor.executemany> |
| `contextlib.closing` | <https://docs.python.org/3/library/contextlib.html#contextlib.closing> |
