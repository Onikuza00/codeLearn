# Doctrine — Enums { .section-fundamentos }

> Un enum PHP es un tipo con un conjunto **cerrado** de valores con nombre. En una Entity sustituye a los *strings mágicos* (`'todo'`, `'done'`, `'high'`) por valores que el lenguaje garantiza válidos, y Doctrine los guarda en una columna normal.

---

## El problema — strings mágicos {: .topic-title }

Sin enum, un estado o una prioridad es un string suelto:

```php
$task->setStatus('doing');
```

Nada impide `'doign'`, `'in progress'`, `'DOING'`, `null` o `'42'`. El conjunto de valores válidos vive en tu cabeza y en comentarios dispersos. Los typos **no petan**, fallan en silencio semanas después. No hay autocompletado ni una única fuente de verdad.

## Enum PHP — puro vs respaldado {: .topic-title }

Un **case** es cada uno de los valores fijos del enum. `TaskStatus::Doing` es un valor de tipo `TaskStatus` — no se puede construir uno inválido.

```php
// Puro: los cases solo tienen identidad, sin valor escalar
enum TaskStatus
{
    case Todo;
    case Doing;
    case Done;
}

// Respaldado (backed): cada case lleva un escalar detrás (string o int)
enum TaskStatus: string
{
    case Todo  = 'todo';
    case Doing = 'doing';
    case Done  = 'done';
}
```

Para mapear con Doctrine el enum tiene que ser **respaldado**: la columna guarda ese escalar. Se usa `: string` (no `: int`) para que la BD sea legible — un `SELECT` muestra `doing`, no `1`.

Los enums viven en `src/Enum/`. La carpeta no la genera nada, se crea a mano.

## Métodos de un enum respaldado {: .topic-title }

| Expresión | Devuelve | Nota |
|---|---|---|
| `TaskStatus::Doing->value` | `'doing'` | el escalar guardado |
| `TaskStatus::Doing->name` | `'Doing'` | el identificador PHP del case (string) |
| `TaskStatus::from('doing')` | `TaskStatus::Doing` | lanza `\ValueError` si el valor no existe |
| `TaskStatus::tryFrom('xxx')` | `null` | igual que `from()` pero sin lanzar |
| `TaskStatus::cases()` | `[TaskStatus::Todo, TaskStatus::Doing, TaskStatus::Done]` | todos los cases, en orden de declaración |

## Mapear en la Entity {: .topic-title }

```php
use App\Enum\TaskStatus;
use App\Enum\TaskPriority;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Column(enumType: TaskStatus::class)]
private ?TaskStatus $status = null;

#[ORM\Column(enumType: TaskPriority::class)]
private ?TaskPriority $priority = null;
```

- La clave es **`enumType:`**, no `type:`. Doctrine deja la columna como `VARCHAR` y guarda el `->value`.
- Al leer de la BD, Doctrine rehidrata el string al enum con `::from()` por debajo. En PHP `$task->getStatus()` te da un `TaskStatus`; en la tabla es `'todo'`.
- El type-hint de la propiedad es el propio enum: `?TaskStatus`. Los getters/setters que genera `make:entity` ya vienen tipados así.
- `make:migration` + `doctrine:migrations:migrate` — la columna nueva es un `VARCHAR` corriente.

## Un enum puede tener métodos {: .topic-title }

Útil para no repartir por las plantillas la lógica de "cómo se muestra cada estado":

```php
enum TaskPriority: string
{
    case Low    = 'low';
    case Medium = 'medium';
    case High   = 'high';

    public function label(): string
    {
        return match ($this) {
            self::Low    => 'Baja',
            self::Medium => 'Media',
            self::High   => 'Alta',
        };
    }
}
```

En Twig: `{{ task.priority.label }}` (Twig llama al método sin los paréntesis).

!!! tip "Gotchas reales"
    - **`->value` vs `->name`.** `value` es lo que guardaste (`'todo'`); `name` es el nombre del case en PHP (`Todo`). Renderizar `->name` cuando querías `->value` (o al revés) es el fallo más común.
    - **Nullable en PHP, igual que las demás propiedades.** `?TaskStatus $status = null` deja instanciar la Entity "incompleta" y que sea el Validator quien exija el valor. Si la columna es NOT NULL, la constraint `NotNull` se mapea sola.
    - **`from()` peta, `tryFrom()` no.** Con datos de fuera (query string, API), `tryFrom()` + comprobar `null`. `from()` solo cuando ya sabes que el valor es válido.
    - **En Twig se accede con `.value`.** `{{ task.status }}` a secas imprime el objeto enum y da error de conversión a string; necesitas `{{ task.status.value }}` o un método como `.label`.
    - **En formularios va con `EnumType`** (o `ChoiceType` con la opción `class`), no como texto libre — se ve en el bloque de Formularios.
    - **Un `match` sin `default` sobre `self::Cases`** obliga a cubrir todos los cases: si mañana añades uno y olvidas el `label()`, PHP lanza `UnhandledMatchError` en vez de devolver basura.

## 📚 Fuentes {: .topic-title }

- [PHP Manual — Enumerations](https://www.php.net/manual/es/language.enumerations.php)
- [Symfony — Doctrine: mapping enums](https://symfony.com/doc/current/doctrine.html)
- [Doctrine ORM — Enums](https://www.doctrine-project.org/projects/doctrine-orm/en/current/reference/basic-mapping.html#enums)
