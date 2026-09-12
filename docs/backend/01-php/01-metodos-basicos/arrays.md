# Arrays { .section-fundamentos }

> Funciones sueltas para arrays: contar, buscar, transformar, combinar y ordenar. En PHP el array va como argumento de la función, no como método suyo.

### `count`

Número de elementos (el `array.length` de JS).

```php
count([10, 20, 30]);   // 3
```

### `in_array` / `array_search`

`in_array` → ¿está el valor? (`bool`). `array_search` → ¿en qué clave está? El 3er argumento `true` fuerza comparación estricta (sin coerción de tipos).

```php
in_array(2, [1, 2, 3]);           // true
in_array('2', [1, 2, 3], true);   // false
array_search('b', ['a', 'b']);    // 1
```

### `array_key_exists` / `isset`

`array_key_exists` → la clave existe (aunque su valor sea `null`). `isset` → existe **y** no es `null`.

```php
array_key_exists('x', ['x' => null]);   // true
isset(['x' => null]['x']);              // false
```

### `array_map`

Aplica una función a cada elemento y devuelve un array nuevo.

```php
array_map(fn($n) => $n * 2, [1, 2, 3]);   // [2, 4, 6]
```

!!! tip "El callback va primero"
    Al revés que `array.map(fn)` de JS: en PHP es `array_map($callback, $array)`.

### `array_filter`

Devuelve los elementos que pasan el callback. Sin callback, quita los *falsy*.

```php
array_filter([1, 2, 3, 4], fn($n) => $n % 2 === 0);   // [1 => 2, 3 => 4]
array_filter([0, 1, '', 2, null]);                      // [1 => 1, 3 => 2]
```

!!! tip "Conserva las claves — reindexa si hace falta"
    Después de filtrar, las claves quedan con huecos (`[1 => …, 3 => …]`). Si necesitas `[0, 1, 2, …]`: `array_values(array_filter(...))`.

### `array_reduce`

Reduce el array a un solo valor, acumulando.

```php
array_reduce([1, 2, 3, 4], fn($acc, $n) => $acc + $n, 0);   // 10
```

### `array_keys` / `array_values`

Las claves, o los valores, como array indexado.

```php
array_keys(['a' => 1, 'b' => 2]);     // ['a', 'b']
array_values(['a' => 1, 'b' => 2]);   // [1, 2]
```

### `array_merge` / spread `[...]`

Unen arrays. En claves de texto repetidas, gana la última. El spread `[...$a, ...$b]` hace lo mismo para arrays indexados (PHP 7.4+).

```php
array_merge([1, 2], [3, 4]);           // [1, 2, 3, 4]
array_merge(['x' => 1], ['x' => 2]);   // ['x' => 2]
[...[1, 2], ...[3, 4]];                 // [1, 2, 3, 4]
```

### `array_column`

Extrae una "columna" de un array de arrays u objetos.

```php
array_column([['name' => 'Ana'], ['name' => 'Leo']], 'name');   // ['Ana', 'Leo']
```

### `array_unique`

Quita los duplicados (conserva las claves).

```php
array_unique([1, 2, 2, 3, 3]);   // [0 => 1, 1 => 2, 3 => 3]
```

### `array_flip`

Intercambia claves por valores.

```php
array_flip(['a', 'b', 'c']);   // ['a' => 0, 'b' => 1, 'c' => 2]
```

### `array_combine`

Un array de claves + un array de valores → array asociativo.

```php
array_combine(['a', 'b'], [1, 2]);   // ['a' => 1, 'b' => 2]
```

### `$a[] =` / `array_pop` / `array_shift` / `array_unshift`

`$a[] = $x` añade al final (lo idiomático). Los `array_*` mutan el array por referencia: `pop` saca el último, `shift` el primero (reindexa), `unshift` añade al principio.

```php
$a = [1, 2];
$a[] = 3;              // [1, 2, 3]
array_pop($a);         // devuelve 3;  $a = [1, 2]
array_shift($a);       // devuelve 1;  $a = [2]
array_unshift($a, 0);  // $a = [0, 2]
```

### `array_slice`

Copia un trozo del array. **No** muta el original.

```php
array_slice([1, 2, 3, 4, 5], 1, 2);   // [2, 3]
```

### `range`

Genera un array con un rango de números o de letras.

```php
range(1, 5);       // [1, 2, 3, 4, 5]
range('a', 'e');   // ['a', 'b', 'c', 'd', 'e']
```

### `sort` / `rsort` / `usort` / `asort` / `ksort`

Todas ordenan el array **por referencia** (modifican el que les pasas, no devuelven uno nuevo) y su valor de retorno es un `bool` que solo dice si la operación fue bien, nunca el array. Se diferencian en **por qué campo ordenan** y en **si conservan las claves**.

**`sort`** — por valor, de menor a mayor. **Reindexa**: descarta las claves originales y las sustituye por `0, 1, 2…`. Para listas simples.

```php
$n = [3, 1, 2];
sort($n);   // $n = [1, 2, 3]
```

**`rsort`** — igual que `sort` pero de mayor a menor. También reindexa.

```php
$n = [3, 1, 2];
rsort($n);   // $n = [3, 2, 1]
```

**`usort`** — por un **criterio tuyo**. Le pasas un comparador (una función) que recibe dos elementos y devuelve un número: negativo si el primero va antes, positivo si va después, `0` si empatan. Reindexa. Es el único que sirve para ordenar objetos por una de sus propiedades, o por algo que no es el valor tal cual.

```php
$n = [3, 1, 2];
usort($n, fn($a, $b) => $b <=> $a);   // $n = [3, 2, 1]  (de mayor a menor)

// ordenar objetos por una propiedad suya:
usort($tasks, fn($a, $b) => $a->getDueDate() <=> $b->getDueDate());   // por fecha, la más próxima primero
```

**`asort`** — por valor, como `sort`, pero **conserva la asociación clave → valor** (no reindexa). Para arrays asociativos donde después de ordenar necesitas seguir sabiendo qué clave tiene cada valor.

```php
$edades = ['ana' => 30, 'luis' => 25, 'eva' => 41];
asort($edades);   // ['luis' => 25, 'ana' => 30, 'eva' => 41]
```

**`ksort`** — por **clave**, no por valor. Conserva la asociación.

```php
$edades = ['eva' => 41, 'ana' => 30, 'luis' => 25];
ksort($edades);   // ['ana' => 30, 'eva' => 41, 'luis' => 25]  (claves en orden alfabético)
```

Variantes: `arsort` = `asort` al revés · `krsort` = `ksort` al revés · `uasort` = `usort` conservando claves · `uksort` = comparador propio sobre las claves.

!!! tip "El comparador de `usort`: usa `<=>`, no `$a - $b`"
    `$a - $b` solo funciona con números. El operador nave espacial `$a <=> $b` devuelve `-1`, `0` o `1` y funciona con números, strings, fechas (`DateTimeImmutable`) y cualquier tipo comparable — es lo que espera el callback de `usort` casi siempre. Para invertir el orden, giras los operandos: `$b <=> $a`.

!!! danger "`$x = sort($a)` te deja `$x = true`"
    Las funciones de ordenación no devuelven el array ordenado — modifican el que les pasas. El resultado es la propia variable `$a`.
