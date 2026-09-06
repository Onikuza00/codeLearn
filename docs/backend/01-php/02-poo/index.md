# POO { .section-fundamentos }

> Clases, propiedades, constructores e interfaces en PHP puro — sin nada de Symfony todavía. Es la base que hace falta para entender por qué Symfony inyecta dependencias por constructor y desambigua interfaces con `#[Autowire]`.

---

## Clase e instancia { .topic-title }

Una **clase** es una plantilla: describe qué propiedades y qué métodos va a tener algo. Un **objeto** (o instancia) es el "algo" concreto que se crea a partir de esa plantilla, con `new`.

```php
class Task
{
    public string $title;
}

$task = new Task();     // $task es una instancia de Task
$task->title = 'Escribir teoría de POO';
```

Una clase se define una vez. Se pueden crear tantas instancias como haga falta, cada una con sus propios valores.

## Propiedades y visibilidad { .topic-title }

Las propiedades son las variables que vive dentro de un objeto. Cada una lleva un modificador de **visibilidad**, que decide desde dónde se puede acceder:

| Visibilidad | Accesible desde |
|---|---|
| `public` | Desde cualquier sitio, incluido fuera de la clase |
| `private` | Solo desde dentro de la propia clase |
| `protected` | Desde la clase y las que hereden de ella |

```php
class Task
{
    private string $title;
    private bool $done = false;   // valor por defecto
}
```

`private` es el punto de partida razonable: nada fuera de la clase debería poder cambiar el estado interno directamente. Si hace falta leerlo o modificarlo desde fuera, se expone un método (`getTitle()`, `markAsDone()`) — eso es **encapsulación**: el objeto controla cómo se toca su propio estado, no cualquiera desde fuera.

## Constructor y propiedades promocionadas { .topic-title }

El **constructor** es un método especial, `__construct()`, que se ejecuta automáticamente al hacer `new`. Sirve para dejar el objeto listo desde el primer momento, en vez de crearlo vacío y rellenarlo propiedad a propiedad.

```php
class Task
{
    private string $title;

    public function __construct(string $title)
    {
        $this->title = $title;
    }
}

$task = new Task('Escribir teoría de POO');
```

PHP tiene un atajo para el caso típico de "recibo un valor y lo guardo tal cual en una propiedad del mismo nombre": la **promoción de propiedades**. Escribir la visibilidad delante del parámetro del constructor declara la propiedad y la asigna en un solo paso:

```php
class Task
{
    public function __construct(
        private string $title,   // declara $title como propiedad Y la asigna
    ) {
    }
}
```

Es exactamente el mismo resultado que el bloque anterior, con menos líneas. Este es el patrón que ya has visto en los servicios de Symfony (`private LoggerInterface $logger` dentro del `__construct`) — ahí no hay magia de Symfony, es PHP puro.

## Métodos { .topic-title }

Un **método** es una función declarada dentro de una clase. Dentro de un método, `$this` es la forma de referirse "al objeto sobre el que se está llamando este método ahora mismo".

```php
class Task
{
    public function __construct(
        private string $title,
        private bool $done = false,
    ) {
    }

    public function markAsDone(): void
    {
        $this->done = true;
    }

    public function getTitle(): string
    {
        return $this->title;
    }
}

$task = new Task('Escribir teoría de POO');
$task->markAsDone();
echo $task->getTitle();
```

!!! tip "`$this->propiedad`, sin `$` en el nombre de después de la flecha"
    `$this` lleva `$` porque es una variable. Lo que va detrás de `->` es un **identificador de miembro** (propiedad o método), y esos nunca llevan `$`: `$this->title`, no `$this->$title`. El mismo criterio aplica a cualquier objeto, no solo a `$this`: `$task->getTitle()`.

## Interfaces { .topic-title }

Una **interfaz** es un contrato: declara qué métodos debe tener una clase — su nombre, sus parámetros, su tipo de retorno — pero **sin implementación**. Ningún cuerpo, ninguna lógica dentro.

```php
interface Sorter
{
    public function sort(array $items): array;
}
```

Eso es el archivo entero. `Sorter` no se puede instanciar (`new Sorter()` es un error) — es un molde, no una pieza.

Una clase se compromete a cumplir ese contrato con `implements`. PHP obliga a que tenga, con la misma firma exacta, todo lo que la interfaz declara:

```php
class ByTitleSorter implements Sorter
{
    public function sort(array $items): array
    {
        usort($items, fn ($a, $b) => $a->getTitle() <=> $b->getTitle());
        return $items;
    }
}
```

Pueden existir varias clases distintas que implementen la misma interfaz, cada una con su propia lógica interna. Todas "son" un `Sorter` a efectos de PHP, aunque ordenen de forma distinta. Eso es lo que permite escribir código contra el **contrato** (`Sorter`) sin atarse a una implementación concreta — el mismo problema que resolvía la inyección de dependencias en [Servicios](/symfony/01-servicios/#que-problema-resuelve): quien usa un `Sorter` no sabe ni le importa cuál de las implementaciones recibe.

!!! tip "Una interfaz no es una clase ni un servicio"
    `interface` y `class` son palabras clave distintas — una interfaz nunca lleva cuerpo en sus métodos, ni se instancia con `new`. Y en Symfony, una interfaz tampoco es "un servicio": los servicios son las clases concretas que la implementan (`ByTitleSorter`, en el ejemplo). El contenedor nunca guarda "un servicio `Sorter`" — guarda las clases reales, y resuelve cuál te entrega cuando algo pide el tipo `Sorter` por type-hint.

## `usort()` — ordenar un array con tu propio criterio { .topic-title }

`usort($array, $callback)` ordena `$array` **in place** usando el callback para comparar pares de elementos. El callback recibe dos elementos y devuelve un número: negativo si el primero va antes, positivo si va después, cero si son iguales.

```php
$tasks = [$taskC, $taskA, $taskB];

usort($tasks, fn (Task $a, Task $b) => $a->getTitle() <=> $b->getTitle());
```

El operador `<=>` ("nave espacial") hace exactamente eso: compara dos valores y devuelve `-1`, `0` o `1`. Es la forma corta de escribir la comparación que `usort()` espera.

!!! danger "`sort()` no es `usort()`, y no devuelve el array"
    `sort($array)` ordena con el criterio por defecto (numérico o alfabético) y **devuelve un booleano** (`true`/`false`, si funcionó o no) — no el array ordenado. Modifica `$array` por referencia. Si necesitas un criterio propio (por fecha, por prioridad, por un campo de un objeto), es `usort()`, no `sort()`.

## 📚 Fuentes { .topic-title }

- [PHP Manual — Classes and Objects](https://www.php.net/manual/en/language.oop5.php)
- [PHP Manual — Object Interfaces](https://www.php.net/manual/en/language.oop5.interfaces.php)
- [PHP Manual — Constructor Promotion](https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.constructor.promotion)
- [PHP Manual — `usort()`](https://www.php.net/manual/en/function.usort.php)
