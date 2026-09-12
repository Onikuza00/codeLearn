# Doctrine — Índices y rendimiento { .section-fundamentos }

> Un índice es una estructura auxiliar que la base de datos mantiene al lado de una tabla para encontrar filas sin recorrerla entera. No cambia qué datos hay ni qué devuelve una consulta — solo cuánto tarda en devolverlos.

---

## El problema que resuelve {: .topic-title }

Una tabla sin índices se lee de arriba abajo. Para responder `WHERE cliente_id = 42`, la base de datos mira **todas** las filas una por una y se queda con las que cumplen. Eso se llama *full table scan* (recorrido completo de tabla).

Con 200 filas no se nota. Con 4 millones de pedidos, cada consulta del listado recorre los 4 millones aunque el cliente solo tenga 30 pedidos.

La analogía: el índice alfabético al final de un libro. El contenido del libro es la tabla. El índice es una lista ordenada de «término → página». Para encontrar una palabra no lees el libro entero: la buscas en el índice y saltas a la página.

En una base de datos, un índice sobre la columna `fecha` es una **copia ordenada** de todos los valores de `fecha`, y cada valor apunta a su fila. Para «los pedidos de enero», la base recorre esa lista ordenada en vez de leer la tabla entera.

---

## Lo que ya está indexado sin hacer nada {: .topic-title }

| Columna | ¿Índice automático? | Por qué |
|---|---|---|
| Clave primaria (`id`) | Sí | La base lo crea sola. Por eso `find($id)` es instantáneo |
| Lado propietario de un `ManyToOne` (la FK, `cliente_id`) | Sí | Doctrine añade el índice al generar la relación |
| Columna con `#[ORM\Column(unique: true)]` | Sí | La restricción de unicidad necesita un índice para comprobarse |
| Cualquier otra columna (`fecha`, `estado`, `email`...) | **No** | Hay que declararlo a mano si se filtra u ordena por ella a menudo |

!!! warning "La FK está indexada, pero el orden no"
    En el listado `WHERE cliente_id = :id ORDER BY fecha DESC`, el `cliente_id` ya tiene índice por ser la FK del `ManyToOne`. Pero el `ORDER BY fecha` no: la base encuentra rápido las filas del cliente y luego **las ordena en memoria** en cada consulta. Con muchos pedidos por cliente, eso vuelve a ser lento. La solución es un índice que cubra las dos columnas a la vez.

---

## Declarar un índice en la Entity {: .topic-title }

El índice es parte del **esquema de la tabla**, no de las consultas. Se declara con un atributo sobre la clase de la entidad, no sobre una propiedad:

```php
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PedidoRepository::class)]
#[ORM\Index(name: 'idx_cliente_fecha', columns: ['cliente_id', 'fecha'])]
class Pedido
{
    // ...
}
```

- `columns` son los **nombres de columna de la base de datos** (`cliente_id`, no `cliente`), en el orden en que se usan al filtrar y ordenar.
- `name` es libre; la convención habitual es `idx_` + columnas.
- Un `#[ORM\Index]` por cada combinación de columnas que se consulta junta. Se pueden apilar varios atributos sobre la misma clase.

Después, el cambio se aplica como cualquier otro cambio de esquema — con una migración:

!!! example "💻 Comandos — genera vs. ejecuta"
    ```bash
    symfony console make:migration               # genera el CREATE INDEX de la diferencia
    symfony console doctrine:migrations:migrate   # lo ejecuta contra la BD
    ```

El `QueryBuilder` del repository **no** crea el índice y no hay que mencionarlo en las consultas: la base de datos lo usa sola cuando una consulta filtra u ordena por esas columnas.

---

## Índice compuesto: el orden de las columnas importa {: .topic-title }

Un índice sobre `['cliente_id', 'fecha']` sirve para:

- `WHERE cliente_id = :id`
- `WHERE cliente_id = :id ORDER BY fecha DESC`
- `WHERE cliente_id = :id AND fecha > :desde`

Pero **no** sirve para `WHERE fecha > :desde` a secas, sin `cliente_id`. Es la misma regla que una guía telefónica ordenada por apellido y luego por nombre: sirve para buscar «García, Ana», pero no para buscar a todas las «Ana» sin saber el apellido.

!!! tip "Regla práctica"
    En un índice compuesto, la columna por la que filtras con `=` va primero; la columna por la que ordenas o filtras por rango (`>`, `<`, `BETWEEN`) va después.

---

## El coste: por qué no se indexa todo {: .topic-title }

Un índice no es gratis:

- **Ocupa disco.** Es una copia ordenada de una o varias columnas.
- **Ralentiza las escrituras.** Cada `INSERT`, `UPDATE` o `DELETE` tiene que actualizar también todos los índices de esa tabla.

Por eso se indexan solo las columnas por las que se **filtra u ordena de forma habitual** — las que aparecen en el `WHERE` y el `ORDER BY` de las consultas que se ejecutan muchas veces. Indexar una columna que casi nunca se consulta es coste sin beneficio.

---

## Comprobar si un índice se usa {: .topic-title }

`EXPLAIN` delante de una consulta SQL muestra el plan de ejecución: si la base hace un recorrido completo de tabla o si entra por un índice.

```sql
EXPLAIN SELECT * FROM pedido WHERE cliente_id = 42 ORDER BY fecha DESC;
```

- En PostgreSQL, `Seq Scan` = recorrido completo (malo si la tabla es grande); `Index Scan using idx_cliente_fecha` = está usando el índice.
- En MySQL, la columna `type` con valor `ALL` = recorrido completo; `ref` o `range` = usa índice.

No hace falta dominar `EXPLAIN` a este nivel. Basta con saber que existe y que es la forma de **verificar** una decisión de rendimiento en vez de suponerla.

---

## La frase para explicarlo {: .topic-title }

!!! tip "Cómo se nombra al explicarlo"
    «El listado filtra por `cliente_id` y ordena por `fecha`. Pondría un índice compuesto sobre esas dos columnas para que la base no recorra la tabla entera en cada consulta. Lo verificaría con `EXPLAIN`.»

    Es la respuesta a un requisito **no funcional** de rendimiento: no cambia qué hace el sistema, cambia cuánto tarda cuando la tabla crece.

---

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📘 **Doctrine ORM — Mapping: índices** | [doctrine-project.org/projects/doctrine-orm/en/current/reference/attributes-reference.html](https://www.doctrine-project.org/projects/doctrine-orm/en/current/reference/attributes-reference.html) |
| 📘 **PostgreSQL — Using EXPLAIN** | [postgresql.org/docs/current/using-explain.html](https://www.postgresql.org/docs/current/using-explain.html) |
| 📘 **Use The Index, Luke** (guía sobre índices SQL, independiente del motor) | [use-the-index-luke.com](https://use-the-index-luke.com/) |
