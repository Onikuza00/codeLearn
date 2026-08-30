# Doctrine — Relaciones { .section-fundamentos }

> Una relación conecta dos entidades. Doctrine la traduce a una **clave foránea** (`project_id` en la tabla `task`) y te deja navegarla como objetos: `$task->getProject()` o `$project->getTasks()`, sin escribir el `JOIN`.

---

## Los cuatro tipos {: .topic-title }

| Tipo | Ejemplo | Dónde vive la clave foránea |
|---|---|---|
| **ManyToOne** | Muchas `Task` → un `Project` | En la tabla del lado *Many* (`task.project_id`) |
| **OneToMany** | Un `Project` → muchas `Task` | No crea columna — es el reverso del ManyToOne |
| **ManyToMany** | Muchas `Task` ↔ muchos `Tag` | Tabla intermedia aparte (`task_tag`) |
| **OneToOne** | Un `User` → un `Profile` | En cualquiera de las dos tablas (columna única) |

`ManyToOne` y `OneToMany` son **el mismo enlace visto desde cada extremo**. Se declaran juntos (bidireccional) para poder navegarlo en los dos sentidos.

## El wizard de `make:entity` {: .topic-title }

Se crea desde la entidad del lado *Many*. Al añadir una propiedad y elegir el tipo `relation` (o directamente `ManyToOne`), pregunta:

!!! example "💻 `make:entity Task` — añadir la relación"
    ```text
    New property name: project
    Field type: relation
    What class should this entity be related to?: Project

    Relation type? [ManyToOne, OneToMany, ManyToMany, OneToOne]: ManyToOne
    Is the Task.project property allowed to be null (nullable)?: no
    Do you want to add a new property to Project so that you can access/update
      the related Task objects from it?: yes
    New field name inside Project: tasks
    Do you want to activate orphanRemoval on your relationship?: no
    ```

`orphanRemoval: yes` = si sacas una `Task` de la colección del `Project`, Doctrine la **borra de la BD**, no solo la desvincula. Para "una Task no existe sin su Project". En la duda, `no`.

Después: `make:migration` + `doctrine:migrations:migrate`.

## Qué código genera {: .topic-title }

**Lado owning — `Task`** (el que tiene la clave foránea):

```php
#[ORM\ManyToOne(inversedBy: 'tasks')]
#[ORM\JoinColumn(nullable: false)]
private ?Project $project = null;
```

**Lado inverso — `Project`**:

```php
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\OneToMany(mappedBy: 'project', targetEntity: Task::class)]
private Collection $tasks;

public function __construct()
{
    $this->tasks = new ArrayCollection();
}

public function addTask(Task $task): static
{
    if (!$this->tasks->contains($task)) {
        $this->tasks->add($task);
        $task->setProject($this);   // ← mantiene el otro lado en sincronía
    }
    return $this;
}

public function removeTask(Task $task): static
{
    if ($this->tasks->removeElement($task)) {
        if ($task->getProject() === $this) {
            $task->setProject(null);
        }
    }
    return $this;
}
```

## Owning vs inverse {: .topic-title }

| | Lado **owning** | Lado **inverse** |
|---|---|---|
| Cuál es | `ManyToOne` (`Task`) | `OneToMany` (`Project`) |
| Tiene | `inversedBy: 'tasks'` + `JoinColumn` | `mappedBy: 'project'` |
| En la BD | La columna `project_id` | Nada |
| Para guardar la relación | **Este** es el que cuenta | Por sí solo no persiste |

`inversedBy` / `mappedBy` son **el nombre de la propiedad en el otro extremo del cable**: `inversedBy: 'tasks'` = "en `Project` la colección se llama `tasks`"; `mappedBy: 'project'` = "en `Task` la referencia se llama `project`". Si renombras una de las dos propiedades, tienes que actualizar el string de la otra.

!!! tip "Gotchas reales"
    - **La FK siempre en el lado `ManyToOne`.** La tabla `task` gana la columna `project_id`; `project` no gana ninguna columna. El `OneToMany` es puro reverso.
    - **Solo el lado owning persiste.** `$project->addTask($task)` sin tocar `Task.project` no guarda nada. Por eso el `addTask()` generado llama a `$task->setProject($this)` — sincroniza el lado que sí cuenta. Lo directo y seguro: `$task->setProject($project)`.
    - **`new ArrayCollection()` en el constructor es obligatorio.** Sin esa línea, un `new Project()` deja `$tasks` sin inicializar y `$project->getTasks()` peta con *"typed property must not be accessed before initialization"*.
    - **Una `Collection` no es un array.** Se recorre igual en un `{% for %}`, pero se cuenta con `|length` / `.count()`, se añade con `->add()` y se quita con `->removeElement()` — nunca `[] =` ni `unset()`.
    - **`JoinColumn(nullable: false)` + filas existentes = migración que falla.** Si la tabla ya tenía `Task` sin `project_id`, no puede ponerse `NOT NULL`. En proyecto nuevo sin datos, sin problema.

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 Symfony — Doctrine Associations | [symfony.com/doc/current/doctrine/associations.html](https://symfony.com/doc/current/doctrine/associations.html) |
| 📗 Doctrine ORM — Association Mapping | [doctrine-project.org/.../association-mapping.html](https://www.doctrine-project.org/projects/doctrine-orm/en/current/reference/association-mapping.html) |
| 🏫 Apunts del profesor — Institut Montilivi | [apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/doctrine](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/doctrine/) |
