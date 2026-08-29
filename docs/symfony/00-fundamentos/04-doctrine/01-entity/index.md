# Doctrine — Entity { .section-fundamentos }

> La Entity es el punto de partida de Doctrine: una clase PHP normal que mapea una fila de una tabla. Sin ella no hay Repository ni EntityManager con quién trabajar.

---

## Los tres actores {: .topic-title }

| Actor | Rol | ¿Actúa en tiempo real? |
|---|---|---|
| **Entity** | Clase PHP normal que mapea una fila de una tabla. Solo propiedades + getters/setters. | No — es pasiva, nunca llama a nada |
| **Repository** | Capa de consultas: sabe *cómo* pedir Entities a la base de datos (`find`, `findAll`, `findBy`...) | Sí — construye y ejecuta queries |
| **EntityManager** | El que habla de verdad con la base de datos: persiste, actualiza, borra. Le da al Repository la conexión con la que trabajar. | Sí — es el motor real |

## La Entity — el molde de datos {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:entity   # [MakerBundle] crea o edita UNA entidad — clase PHP + propiedades + getters/setters
    ```

Es el único comando que toca la definición de la clase. Se ejecuta cada vez que agregás o cambiás una propiedad; si la entidad ya existe, pregunta qué campo agregar en vez de crear una nueva.

**Dónde vive** — siempre en `src/Entity/`, un archivo por entidad, con el mismo nombre que la clase (`Product.php` → `class Product`). Dentro de cada una encontrás siempre lo mismo: propiedades privadas + atributos `#[ORM\...]` que las mapean a columnas, y sus getters/setters. Cada propiedad se mapea a una columna con atributos `#[ORM\...]`:

```php
#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]                    // clave primaria
    #[ORM\GeneratedValue]        // autoincremental — la BD la genera sola
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]   // VARCHAR(255)
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]  // DECIMAL(10,2) — dinero
    private ?string $price = null;

    #[ORM\Column(type: Types::TEXT)]   // TEXT — texto largo, sin límite fijo
    private ?string $description = null;

    #[ORM\Column]                // sin type: lo deduce del type-hint (int → INT, bool → BOOLEAN...)
    private ?int $stock = null;
}
```

`make:entity` genera también los getters/setters — no se escriben a mano. Los setters devuelven `static` (`return $this;`) para poder encadenarlos.

!!! tip "El tipo de columna: cuándo `#[ORM\Column]` a secas no alcanza"
    Sin `type:`, Doctrine deduce la columna del type-hint de PHP (`int → INT`, `bool → BOOLEAN`, `string → VARCHAR(255)`, `\DateTimeImmutable → DATETIME`). Hay dos casos donde eso no sirve y hay que forzarlo:

    - **Dinero → `decimal`, nunca `float`.** Un `float` arrastra errores de redondeo binario (`0.1 + 0.2` no da exactamente `0.3`). `decimal` guarda el número exacto, con `precision` (dígitos totales) y `scale` (decimales). Doctrine te lo devuelve como **`string`** en PHP para no perder precisión — por eso el type-hint es `?string $price`, no `?float`.
    - **Texto largo → `text`.** `VARCHAR(255)` corta a 255 caracteres; `text` no tiene límite fijo. También se mapea a `?string`, y no lleva `length`.

    `Types::DECIMAL` / `Types::TEXT` salen de la clase `Doctrine\DBAL\Types\Types` — hay que importarla arriba del archivo:

    ```php
    use Doctrine\DBAL\Types\Types;
    ```

    `Types::DECIMAL` es solo la constante que vale el string `'decimal'`. Puedes escribir directamente `type: 'decimal'` / `type: 'text'` sin ningún `use`; la constante solo te protege de un typo (el IDE la autocompleta, el string no).

!!! tip "Por qué `?string $name`, si la columna es NOT NULL"
    Fijate que `$name` es `?string` (nullable en PHP) aunque la columna en la BD **no** acepte `NULL` (no tiene `nullable: true`). No es un descuido de `make:entity` — es a propósito: si la propiedad fuera `string` a secas, PHP no te dejaría ni instanciar `new Product()` sin pasarle el nombre ya en el constructor, y nunca llegarías a validarlo. Al ser nullable en PHP, el objeto puede existir temporalmente "incompleto" (recién creado, antes de llamar a `setName()`), y es el **Validator** de Symfony (constraint `NotBlank`/`NotNull`, mapeada automáticamente desde el `nullable: false` de Doctrine) quien atrapa ese hueco como un error de validación normal — no un `TypeError` de PHP.

## `make:entity` paso a paso {: .topic-title }

1. **Nombre de la clase** — si no lo pasás como argumento (`make:entity Product`), pregunta *"Class name of the entity to create or update"*. El `id` autoincremental se añade solo, no se pregunta.
2. **Loop de propiedades**, una por una — *"New property name (press \<return\> to stop adding fields)"* la primera vez, *"Add another property?..."* después. Dejarlo en blanco es la única forma de terminar.
3. Por cada propiedad, siempre en este orden:
   - *"Field type (enter `?` to see all types)"* — sugiere un tipo según el nombre del campo; `?` lista todos los tipos válidos.
   - Solo según el tipo elegido:

     | Tipo | Pregunta extra |
     |---|---|
     | `string` | *"Field length"* (default `255`) — es el `length: 255` de tu `$name` |
     | `decimal` | *"Precision"* (default `10`, dígitos totales) + *"Scale"* (default `0`, decimales) — es lo que lleva `$price` para dinero: `DECIMAL(10, 2)`. La propiedad queda como `?string` en PHP, no `?float` (ver el tip de arriba) |
     | `enum` | clase del enum + *"¿puede guardar varios valores?"* |
     | relación (`ManyToOne`...) | wizard aparte — pendiente, otra subsección de Doctrine |
   - Siempre al final: *"Can this field be null in the database (nullable)"* (default `false`) — es el `?` de `private ?string $name` cuando respondés que sí.
4. Enter en blanco → termina el loop, genera/actualiza el PHP con getters y setters.

Reconstruido sobre tu `Product.php` real, así se vería la sesión completa:

| Prompt | Respuesta (según lo que hay en `Product.php`) |
|---|---|
| Class name | `Product` |
| New property name → Field type → (extra) → nullable | `name` → `string` → length `255` → `no` |
| Add another property? → Field type → (extra) → nullable | `price` → `decimal` → precision `10`, scale `2` → `no` |
| Add another property? → Field type → (extra) → nullable | `imageUrl` → `string` → length `500` → `no` |
| Add another property? → Field type → nullable | `likes` → `integer` → `no` |
| Add another property? | *(vacío)* → termina |

## Validator — constraints sobre la Entity {: .topic-title }

Las constraints son atributos que van sobre la propiedad, del mismo modo que los `#[ORM\...]` — pero en vez de decir *cómo se guarda*, dicen *qué valores son válidos*:

```php
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\NotBlank]
#[Assert\Length(min: 3, max: 255)]
private ?string $name = null;
```

!!! tip "No se disparan solas"
    Se disparan al llamar a `$validator->validate($product)` (inyectando `ValidatorInterface`) — nunca solas, hace falta pedirle al Validator que las revise.

Las más comunes:

| Constraint | Para qué sirve |
|---|---|
| `NotBlank` | El valor no puede estar vacío (ni `""`, ni `null`) |
| `NotNull` | El valor no puede ser `null` (vacío `""` sí pasa) |
| `Length(min:, max:)` | Longitud mínima/máxima de un string |
| `Email` | Formato de email válido |
| `Url` | Formato de URL válido |
| `Regex(pattern:)` | Debe coincidir con una expresión regular |
| `Choice(choices:)` | El valor tiene que estar dentro de una lista cerrada |
| `Range(min:, max:)` | Número dentro de un rango |
| `Positive` / `PositiveOrZero` | Número mayor que cero / mayor o igual que cero |
| `Type(type:)` | Fuerza que el valor sea de un tipo concreto (`'integer'`, `'string'`...) |
| `UniqueEntity` (Doctrine, va sobre la **clase**, no la propiedad) | No puede repetirse otro registro con el mismo valor en ese campo |

No es una lista cerrada — hay más para fechas, archivos, IBAN, tarjetas, etc. Estas son las que más aparecen en una entidad típica; el listado completo está en la [referencia oficial de constraints](https://symfony.com/doc/current/reference/constraints.html).

### Mensajes de error personalizados {: .topic-title }

Sin especificar nada, cada constraint usa un mensaje por defecto genérico (en inglés salvo que el proyecto tenga configurada la traducción). Para poner tu propio texto, la mayoría acepta el parámetro `message`:

```php
#[Assert\NotBlank(message: 'El nombre es obligatorio.')]
#[Assert\Email(message: 'Introduce un email válido.')]
private ?string $name = null;
```

Las constraints que comprueban **dos límites a la vez** (`Length`, `Range`) no usan `message` — usan un mensaje por cada límite, porque el error es distinto según cuál se incumple:

```php
#[Assert\Length(
    min: 3,
    max: 255,
    minMessage: 'Mínimo {{ limit }} caracteres.',
    maxMessage: 'Máximo {{ limit }} caracteres.',
)]
private ?string $name = null;
```

!!! tip "`{{ limit }}` no es texto literal"
    Dentro del mensaje, `{{ limit }}` es un placeholder que Symfony sustituye automáticamente por el valor real (`min`/`max` según cuál de los dos disparó el error) — así el mismo mensaje sirve aunque cambies los números más adelante, sin tener que reescribir el texto a mano.

## Validación del esquema {: .topic-title }

Con la Entity ya escrita, todavía falta un paso — la tabla no existe de verdad en la base de datos. Este comando lo confirma:

!!! example "💻 Comandos — DoctrineBundle"
    ```bash
    symfony console doctrine:schema:validate   # [DoctrineBundle] compara las Entities contra la BD real
    ```

Comprueba dos cosas por separado:

1. **Mapping válido** — que Doctrine puede leer bien los atributos `#[ORM\...]` (sin errores de sintaxis/config).
2. **Sincronía con la BD** — si el esquema real de la base de datos coincide con lo que las Entities describen.

En este punto del proceso, lo normal es que el mapping esté bien pero la sincronía falle: la clase `Product` existe en PHP, pero la tabla `product` todavía no existe en la base de datos. La forma correcta de crear esa tabla es con una migración:

## Migraciones {: .topic-title }

La Entity define cómo *debería* ser la tabla; la migración es el paso que lo aplica de verdad contra la base de datos — dos comandos, dos paquetes distintos:

!!! example "💻 Comandos — genera vs. ejecuta"
    ```bash
    symfony console make:migration              # [MakerBundle] compara Entities vs BD actual, genera el SQL de la diferencia
    symfony console doctrine:migrations:migrate  # [DoctrineBundle] ejecuta ese SQL contra la BD
    ```

Cada cambio en una Entity (nueva propiedad, columna que cambia de tipo...) necesita su propia migración — es el historial versionado del esquema, igual que un commit de Git pero para la estructura de la BD.

## Fixtures {: .topic-title }

Con la tabla ya creada pero vacía, el siguiente paso es poblarla con datos de prueba — separado del esquema, otro par genera/ejecuta:

!!! example "💻 Comandos — genera vs. ejecuta"
    ```bash
    symfony console make:fixtures            # [MakerBundle] genera, por convención, src/DataFixtures/AppFixtures.php
    symfony console doctrine:fixtures:load   # [DoctrineBundle] BORRA los datos actuales y carga los de AppFixtures.php
    ```

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | Apunts DAW2, Institut Montilivi |
| 📘 **Documentación oficial de Symfony — Doctrine** | [symfony.com/doc/current/doctrine.html](https://symfony.com/doc/current/doctrine.html) |
| 📘 **Documentación oficial de Symfony — Validation** | [symfony.com/doc/current/validation.html](https://symfony.com/doc/current/validation.html) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/doctrine](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/doctrine/) |
| 🎥 **SymfonyCasts — Doctrine, Symfony 7 y la base de datos** (ES, 15 capítulos) | [symfonycasts.com/es/screencast/symfony-doctrine/installing-doctrine](https://symfonycasts.com/es/screencast/symfony-doctrine/installing-doctrine) |
| 🎥 **SymfonyCasts — Entidad de la nave estelar** (ES, ep. 3) | [symfonycasts.com/es/screencast/symfony-doctrine/entity](https://symfonycasts.com/es/screencast/symfony-doctrine/entity) |
