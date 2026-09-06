# Arrays { .section-fundamentos }

> El array es la estructura que más se usa en PHP: una consulta a la base de datos devuelve un array, un formulario llega como array, la configuración es un array. A diferencia de JavaScript, en PHP **un solo tipo** hace de lista y de diccionario a la vez.

---

## Un solo tipo para dos cosas { .topic-title }

En JavaScript hay `Array` (lista, índices numéricos) y `Object` (diccionario, claves de texto). En PHP **solo hay `array`**, y hace las dos cosas según qué claves le pongas.

```php
$lista  = ['manzana', 'pera', 'uva'];          // claves 0, 1, 2 automáticas
$diccio = ['nombre' => 'Pau', 'edad' => 43];   // claves de texto
$mixto  = ['manzana', 'color' => 'rojo'];      // se pueden mezclar
```

Por dentro siempre es lo mismo: **un mapa ordenado de clave → valor**. Cuando no pones clave, PHP asigna el siguiente entero libre.

!!! tip "Las claves numéricas no se reordenan solas al borrar"
    Este es el gotcha que más sorprende viniendo de JS:

    ```php
    $frutas = ['manzana', 'pera', 'uva'];
    unset($frutas[1]);
    // Ahora las claves son 0 y 2. NO se recolocan.
    ```

    Si luego recorres con un `for ($i = 0; $i < count($frutas); $i++)` te saltas datos y accedes a índices que no existen. Para renumerar: `$frutas = array_values($frutas);`

## Recorrer: `foreach` es el que se usa { .topic-title }

```php
foreach ($frutas as $fruta) { ... }              // solo el valor
foreach ($persona as $clave => $valor) { ... }   // clave y valor
```

`foreach` funciona igual con claves numéricas y de texto, y no depende de que los índices sean consecutivos. Por eso es el que se usa casi siempre, y `for` queda para cuando de verdad necesitas el número del índice.

!!! warning "`foreach` trabaja sobre una copia, salvo que pidas referencia"
    ```php
    foreach ($precios as $precio) {
        $precio *= 1.21;      // ❌ no cambia nada: $precio es una copia
    }

    foreach ($precios as &$precio) {
        $precio *= 1.21;      // ✅ modifica el array original
    }
    unset($precio);           // ⚠️ imprescindible
    ```

    Ese `unset()` final no es opcional. La variable `$precio` **sigue siendo una referencia al último elemento** después del bucle, y el siguiente `foreach` que reutilice ese nombre machacaría el último valor del array. Es un bug clásico y muy difícil de ver.

## Las funciones que más se usan { .topic-title }

Recuerda la diferencia con JS: son **funciones sueltas**, no métodos, y el array va como argumento.

| Qué quieres | PHP | Equivalente JS |
|---|---|---|
| Transformar cada elemento | `array_map($fn, $arr)` | `arr.map(fn)` |
| Quedarte con algunos | `array_filter($arr, $fn)` | `arr.filter(fn)` |
| Reducir a un valor | `array_reduce($arr, $fn, $inicial)` | `arr.reduce(fn, ini)` |
| ¿Existe este valor? | `in_array($valor, $arr)` | `arr.includes(v)` |
| ¿Existe esta clave? | `array_key_exists($k, $arr)` / `isset($arr[$k])` | `k in obj` |
| Solo las claves / los valores | `array_keys($arr)` / `array_values($arr)` | `Object.keys()` / `.values()` |
| Extraer una columna | `array_column($arr, 'precio')` | `arr.map(o => o.precio)` |
| Unir dos arrays | `array_merge($a, $b)` | `[...a, ...b]` |
| Cuántos hay | `count($arr)` | `arr.length` |
| Añadir al final | `$arr[] = $x` | `arr.push(x)` |

!!! danger "El orden de argumentos cambia entre `array_map` y `array_filter`"
    ```php
    array_map(fn($p) => $p * 1.21, $precios);      // callback PRIMERO
    array_filter($precios, fn($p) => $p > 100);    // array PRIMERO
    ```

    No hay lógica detrás, es herencia histórica. Se consulta, no se memoriza.

!!! warning "`array_filter` conserva las claves originales"
    ```php
    $caros = array_filter([10, 200, 30, 400], fn($p) => $p > 100);
    // [1 => 200, 3 => 400]  — claves 1 y 3, no 0 y 1
    ```

    Si eso va a un `json_encode()`, sale como **objeto** `{"1":200,"3":400}` en vez de como array. Se arregla con `array_values($caros)`.

## Ordenar: la familia `sort` { .topic-title }

Aquí está el fallo que más se repite. Todas estas funciones **modifican el array por referencia y devuelven `true`/`false`**, no el array ordenado.

| Función | Ordena por | Conserva claves |
|---|---|---|
| `sort()` | valor, ascendente | ❌ renumera |
| `rsort()` | valor, descendente | ❌ renumera |
| `asort()` / `arsort()` | valor | ✅ |
| `ksort()` / `krsort()` | clave | ✅ |
| `usort()` | **criterio propio** | ❌ renumera |
| `uasort()` | criterio propio | ✅ |

!!! danger "`sort()` no devuelve el array — y no acepta criterio propio"
    ```php
    return sort($tasks);        // ❌ devuelve true, no el array
    ```
    ```php
    usort($tasks, fn($a, $b) => $a->getPriority() <=> $b->getPriority());
    return $tasks;              // ✅ ordena en sitio, luego devuelves
    ```

    Dos errores en uno: `sort()` devuelve un booleano, y además ordena por el valor tal cual — no sirve para ordenar objetos por una de sus propiedades. Para eso está `usort()`.

!!! tip "El operador nave espacial `<=>`"
    `$a <=> $b` devuelve `-1`, `0` o `1`. Es exactamente lo que espera el callback de `usort()`: negativo si `$a` va antes, cero si empatan, positivo si va después.

    ```php
    usort($tasks, fn($a, $b) => $a->getDueDate() <=> $b->getDueDate());
    ```

    Sirve para números, textos y objetos `DateTime`. Evita tener que escribir `if` anidados.

## Desestructurar y esparcir { .topic-title }

```php
[$primero, $segundo] = ['a', 'b'];                    // por posición
['nombre' => $nombre] = ['nombre' => 'Pau'];          // por clave

$todos = [...$activos, ...$inactivos];                // spread (PHP 7.4+)
```

El *spread* con **claves de texto** solo funciona desde PHP 8.1. Antes, para arrays asociativos había que usar `array_merge()`.

## Arrays multidimensionales { .topic-title }

Un array cuyos valores son a su vez arrays. Es lo que devuelve casi cualquier consulta:

```php
$productos = [
    ['ref' => 'A1', 'precio' => 120],
    ['ref' => 'B2', 'precio' => 340],
];

foreach ($productos as $producto) {
    echo $producto['ref'];
}

$refs = array_column($productos, 'ref');            // ['A1', 'B2']
$porRef = array_column($productos, null, 'ref');    // indexado por 'ref'
```

Ese tercer argumento de `array_column()` es de las cosas más útiles y menos conocidas: **reindexa el array por la columna que le digas**, y te ahorra un bucle para construir un mapa de búsqueda.

## Depurar un array { .topic-title }

```php
var_dump($arr);      // tipos y longitudes, muy verboso
print_r($arr);       // legible, sin tipos
dump($arr);          // Symfony: coloreado y plegable
dd($arr);            // Symfony: dump and die
```

`echo $arr` no sirve: imprime `Array` y lanza un aviso.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Arrays** | [php.net/manual/es/language.types.array.php](https://www.php.net/manual/es/language.types.array.php) |
| 📘 **Manual oficial — Funciones de array** | [php.net/manual/es/ref.array.php](https://www.php.net/manual/es/ref.array.php) |
| ⚡ **DevDocs — PHP** | [devdocs.io/php](https://devdocs.io/php/) |
