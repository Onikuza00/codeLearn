# Funciones y tipado { .section-fundamentos }

> PHP moderno permite declarar tipos en parámetros y retornos, pero **por defecto los convierte en silencio** en lugar de rechazarlos. Activar el modo estricto y conocer las closures es lo que separa el PHP de hace diez años del que se escribe hoy.

---

## Parámetros y valores por defecto { .topic-title }

```php
function calcularTotal(float $base, float $iva = 0.21): float
{
    return $base * (1 + $iva);
}

calcularTotal(100);          // 121.0
calcularTotal(100, 0.10);    // 110.0
```

Los parámetros con valor por defecto van **siempre al final**. Si pones uno con defecto antes de uno obligatorio, PHP avisa y el defecto queda inservible.

## Tipos en parámetros y retorno { .topic-title }

| Declaración | Significa |
|---|---|
| `string $nombre` | Solo texto |
| `?string $nombre` | Texto **o `null`** |
| `int\|string $id` | Union: uno de los dos (PHP 8) |
| `array $lineas` | Array, sin especificar de qué |
| `Task $tarea` | Instancia de esa clase o de una hija |
| `TaskSorter $sorter` | Cualquier clase que implemente esa interfaz |
| `: void` | No devuelve nada |
| `: static` | Devuelve una instancia de la propia clase (encadenables) |
| `: never` | No termina nunca: lanza excepción o corta la ejecución |
| `mixed` | Cualquier cosa. Casi siempre es señal de que falta pensar el tipo |

## `declare(strict_types=1)`: la línea que cambia todo { .topic-title }

Sin esa declaración, PHP **convierte** el argumento para que encaje con el tipo declarado:

```php
function repetir(int $veces): string { ... }

repetir('5');     // sin strict_types → PHP lo convierte a 5 y sigue
repetir('5');     // con strict_types → TypeError
```

```php
<?php

declare(strict_types=1);   // primera instrucción del fichero, sin excepción
```

!!! danger "Sin modo estricto, los tipos son una sugerencia"
    Es exactamente el mismo problema que `==` frente a `===`: PHP intenta ayudar convirtiendo, y al hacerlo esconde el error. Un `'abc'` que llega donde se esperaba un `int` debería reventar en el acto, no convertirse en `0` y propagar un dato basura por toda la aplicación.

    La declaración es **por fichero**, no global, y tiene que ser la primera instrucción tras `<?php`. Symfony la pone por defecto en el código que genera.

!!! tip "`int` sí se acepta donde se espera `float`"
    Incluso en modo estricto. Es la única conversión que sobrevive, porque todo entero es representable como decimal sin pérdida. Al revés no: un `float` donde se espera `int` da `TypeError`.

## Argumentos con nombre { .topic-title }

Desde PHP 8, se puede pasar un argumento por su nombre en vez de por su posición:

```php
function crearTarea(string $titulo, bool $urgente = false, ?string $nota = null) { ... }

crearTarea('Revisar pedido', nota: 'Llamar al cliente');   // se salta $urgente
```

Sirve para saltarse parámetros opcionales intermedios y para que la llamada se lea sola cuando hay varios booleanos seguidos.

!!! warning "El nombre del parámetro pasa a ser parte del contrato público"
    En cuanto alguien te llama con `nota:`, renombrar ese parámetro rompe su código. Antes era un detalle interno; con argumentos con nombre, deja de serlo.

## Número variable de argumentos { .topic-title }

```php
function sumar(int ...$numeros): int
{
    return array_sum($numeros);
}

sumar(1, 2, 3);                 // 6
sumar(...[1, 2, 3]);            // el mismo array, esparcido
```

`...$numeros` recoge todos los argumentos restantes en un array. El mismo operador, en la llamada, hace lo contrario: esparce un array en argumentos sueltos.

## `readonly`: propiedades que solo se asignan una vez { .topic-title }

```php
final class Dinero
{
    public function __construct(
        public readonly int $centimos,
        public readonly string $moneda,
    ) {}
}

$precio = new Dinero(1999, 'EUR');
$precio->centimos = 0;    // ❌ Error: Cannot modify readonly property
```

Una propiedad `readonly` (PHP 8.1) se asigna **una sola vez, desde dentro de la clase**, y después es inmutable. Combinada con la promoción en el constructor, es la forma corta de escribir objetos de valor que no pueden cambiar por sorpresa.

## Closures: funciones dentro de variables { .topic-title }

```php
$doble = function (int $n): int {
    return $n * 2;
};

$doble(21);   // 42
```

A diferencia de JavaScript, **una closure de PHP no ve las variables de alrededor**. Hay que enumerarlas con `use`:

```php
$iva = 0.21;

$conIva = function (float $base) use ($iva): float {
    return $base * (1 + $iva);
};
```

!!! danger "`use` captura una copia en el momento de definir la closure"
    ```php
    $iva = 0.21;
    $calcular = fn(float $b) => $b * (1 + $iva);
    $iva = 0.10;              // se cambia DESPUÉS

    $calcular(100);           // 121.0 — usa el 0.21 capturado, no el 0.10
    ```

    La captura es **por valor y en ese instante**: una foto fija. Para que la closure siga viendo los cambios hay que capturar por referencia con `use (&$iva)`, que casi nunca es lo que quieres.

    Viniendo de JavaScript esto sorprende, porque allí la closure ve la variable viva.

## Función flecha: `fn()` { .topic-title }

```php
$conIva = fn(float $base): float => $base * (1 + $iva);   // sin use, captura sola
```

Desde PHP 7.4. Dos diferencias con la closure larga:

- **Captura automáticamente** las variables que usa, por valor. No hace falta `use`.
- Solo admite **una expresión**, y la devuelve. No hay llaves ni varias líneas.

Es la que se usa en los callbacks de `array_map`, `array_filter` y `usort`, donde el cuerpo es una sola línea.

## Callables: pasar una función como argumento { .topic-title }

```php
array_map('strtoupper', $nombres);              // función nativa, por nombre
array_map([$this, 'formatear'], $nombres);      // método de un objeto
array_map($this->formatear(...), $nombres);     // sintaxis moderna (PHP 8.1)
```

Esa última —`$objeto->metodo(...)` con los tres puntos literales— es la **sintaxis de callable de primera clase**. Convierte un método en una closure sin escribir el array con el nombre en texto, así que el editor y el analizador estático pueden comprobarlo.

!!! tip "Declarar `callable` frente a `Closure`"
    `callable` acepta las tres formas de arriba, incluido el nombre de función en texto plano. `Closure` solo acepta objetos closure de verdad. Cuando quieras garantizar que lo que recibes es una función real y comprobable, declara `Closure`.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Funciones** | [php.net/manual/es/language.functions.php](https://www.php.net/manual/es/language.functions.php) |
| 📘 **Manual oficial — Declaración de tipos** | [php.net/manual/es/language.types.declarations.php](https://www.php.net/manual/es/language.types.declarations.php) |
| 📘 **Manual oficial — Closures** | [php.net/manual/es/class.closure.php](https://www.php.net/manual/es/class.closure.php) |
