# POO avanzada { .section-fundamentos }

> Herencia, clases abstractas, traits y enums. La pregunta que hay detrás de casi todo este tema es una sola: **cuándo heredar y cuándo componer**. Heredar es cómodo al principio y caro después.

---

## Herencia { .topic-title }

```php
class Documento
{
    public function __construct(protected string $titulo) {}

    public function describir(): string
    {
        return "Documento: {$this->titulo}";
    }
}

class Factura extends Documento
{
    public function describir(): string
    {
        return 'Factura — ' . parent::describir();   // reutiliza y amplía
    }
}
```

Una clase hereda de **una sola** clase padre. Con `protected` la hija ve la propiedad; con `private` no. `parent::` llama a la versión del padre del método que estás sobrescribiendo.

`final` cierra la puerta: `final class` no se puede extender, `final function` no se puede sobrescribir.

!!! warning "Composición antes que herencia"
    La herencia crea el acoplamiento más fuerte que existe: un cambio en el padre se propaga a todas las hijas, y una jerarquía de tres niveles se vuelve imposible de seguir.

    La regla práctica: hereda solo cuando la hija **es** un caso del padre de verdad y va a compartir estado y comportamiento. Si lo que quieres es reutilizar una funcionalidad, **inyéctala como dependencia** en el constructor. Es lo que hace Symfony en todas partes, y por eso sus servicios casi nunca heredan unos de otros.

## Clases abstractas { .topic-title }

Una clase abstracta **no se puede instanciar**: existe para que otras hereden de ella. Puede mezclar métodos ya implementados con métodos que obliga a implementar.

```php
abstract class Exportador
{
    // implementado: común a todos
    public function exportar(array $filas): string
    {
        return $this->cabecera() . $this->cuerpo($filas);
    }

    // obligatorio: cada hija lo resuelve a su manera
    abstract protected function cabecera(): string;
    abstract protected function cuerpo(array $filas): string;
}

new Exportador();     // ❌ Cannot instantiate abstract class
```

## Interfaz o clase abstracta { .topic-title }

| | Interfaz | Clase abstracta |
|---|---|---|
| Contiene | Solo firmas (y constantes) | Firmas **y** código ya escrito |
| Estado (propiedades) | No | Sí |
| Cuántas se pueden usar | **Muchas** (`implements A, B, C`) | **Una** (`extends`) |
| Se instancia | No | No |
| Para qué | Declarar **qué sabe hacer** algo | Compartir **implementación** entre parientes |

!!! tip "La regla para elegir"
    Si solo quieres decir «esto sabe ordenar tareas» → **interfaz**. Si además quieres darles a todas las implementaciones un trozo de código común → **clase abstracta**.

    Y ante la duda, interfaz: una clase implementa tantas como quiera, pero solo hereda de una. Las interfaces no consumen tu único cupo de herencia.

## Traits: reutilizar sin heredar { .topic-title }

Un trait es un bloque de métodos que se **inserta** dentro de una clase. Sirve cuando varias clases sin parentesco necesitan el mismo comportamiento.

```php
trait RegistraCambios
{
    private array $cambios = [];

    public function registrar(string $campo): void
    {
        $this->cambios[] = $campo;
    }
}

class Factura { use RegistraCambios; }
class Cliente { use RegistraCambios; }
```

Si dos traits traen un método con el mismo nombre, hay que desambiguar:

```php
class Informe
{
    use Exportable, Imprimible {
        Exportable::formatear insteadof Imprimible;
        Imprimible::formatear as formatearParaImprimir;
    }
}
```

!!! danger "Un trait no es un tipo: no se puede comprobar con `instanceof`"
    ```php
    $factura instanceof RegistraCambios;   // ❌ no compila como esperas
    ```

    El trait es **copiar y pegar en tiempo de compilación**, no una relación de tipos. Si necesitas comprobar que un objeto tiene ese comportamiento, el patrón es **interfaz + trait**: la interfaz declara el contrato (y sí es un tipo comprobable), el trait aporta la implementación.

!!! warning "Los traits se abusan con facilidad"
    Un trait con estado propio metido en cinco clases distintas es una dependencia oculta: no aparece en el constructor, no se puede sustituir en un test, y nadie sabe de dónde sale ese método. Antes de crear uno, comprueba si un **servicio inyectado** resuelve lo mismo de forma explícita.

## `static`, `self` y `$this` { .topic-title }

```php
class Contador
{
    private static int $total = 0;      // compartida por TODAS las instancias

    public static function incrementar(): void
    {
        self::$total++;                 // en un método static no hay $this
    }
}

Contador::incrementar();
```

Lo `static` pertenece a la **clase**, no al objeto: se accede con `::` y no hay `$this`.

!!! tip "`self` frente a `static`: enlace estático tardío"
    ```php
    class Padre {
        public static function crear(): static { return new static(); }
        public static function crearMal(): self { return new self(); }
    }
    class Hija extends Padre {}

    Hija::crear();      // devuelve una Hija   ✅
    Hija::crearMal();   // devuelve un Padre   ❌
    ```

    `self` se resuelve a **la clase donde está escrito**. `static` se resuelve a **la clase desde la que se llamó**. Para métodos de fábrica que deben devolver la clase concreta, siempre `static`.

!!! warning "Un método `static` no se puede sustituir en un test"
    Es una llamada directa a la clase, sin objeto que inyectar ni interfaz que suplantar. Por eso las utilidades `static` envenenan los tests: lo que empieza como `Helper::formatear()` acaba siendo imposible de aislar. Un servicio inyectado hace lo mismo y sí se puede sustituir.

## Enums { .topic-title }

Desde PHP 8.1. Un enum es un tipo con un **conjunto cerrado de valores posibles**.

```php
enum Prioridad: string          // "respaldado": cada caso tiene un valor
{
    case Alta  = 'alta';
    case Media = 'media';
    case Baja  = 'baja';

    public function etiqueta(): string
    {
        return match ($this) {
            self::Alta  => 'Urgente',
            self::Media => 'Normal',
            self::Baja  => 'Puede esperar',
        };
    }
}
```

Sin `: string` sería un enum **puro**: los casos existen pero no tienen valor asociado. Con valor (`string` o `int`) se puede guardar en base de datos y reconstruir desde ella.

| Operación | Qué hace |
|---|---|
| `Prioridad::Alta` | El caso |
| `Prioridad::Alta->value` | `'alta'` |
| `Prioridad::Alta->name` | `'Alta'` |
| `Prioridad::cases()` | Array con todos los casos — ideal para rellenar un desplegable |
| `Prioridad::from('alta')` | El caso, o **lanza `ValueError`** |
| `Prioridad::tryFrom('xx')` | El caso, o **`null`** |

!!! danger "`from()` revienta, `tryFrom()` devuelve `null`"
    Con datos que vienen de fuera —un formulario, un CSV, una API— se usa **`tryFrom()`** y se comprueba el `null`. `from()` es para valores que ya deberían ser válidos, y ahí sí interesa que reviente si no lo son.

!!! tip "El enum reemplaza a las constantes de texto"
    Antes esto se hacía con `const ESTADO_PENDIENTE = 'pendiente'`, y nada impedía pasar `'pendinte'` con una errata. Con un enum, el tipo `Prioridad` en la firma **garantiza** que solo llegan los tres valores posibles, y el editor te los autocompleta.

    Además, un `match` sobre un enum **sin `default`** lanza una excepción si añades un caso nuevo y olvidas contemplarlo. Ese fallo ruidoso es exactamente lo que quieres.

Un enum puede implementar interfaces y tener métodos, pero **no puede tener propiedades ni heredar**: sus casos son instancias únicas e inmutables.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Clases y objetos** | [php.net/manual/es/language.oop5.php](https://www.php.net/manual/es/language.oop5.php) |
| 📘 **Manual oficial — Traits** | [php.net/manual/es/language.oop5.traits.php](https://www.php.net/manual/es/language.oop5.traits.php) |
| 📘 **Manual oficial — Enumeraciones** | [php.net/manual/es/language.enumerations.php](https://www.php.net/manual/es/language.enumerations.php) |
