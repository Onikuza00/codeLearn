# Métodos básicos { .section-fundamentos }

> Funciones nativas de PHP que se usan a diario, una a una con sus variantes. Para cada una: qué hace, su firma y un ejemplo con el resultado. No es la lista completa del manual — son las que aparecen en casi cualquier archivo.

---

## Cadenas de texto { .topic-title }

### `strlen` / `mb_strlen`

Longitud de un string. `strlen` cuenta **bytes**; `mb_strlen` cuenta **caracteres**.

```php
strlen('árbol');      // 6  — la 'á' son 2 bytes en UTF-8
mb_strlen('árbol');   // 5
```

!!! tip "Con acentos, ñ o emoji, siempre `mb_`"
    Todas las funciones de string sin prefijo (`strlen`, `strtolower`, `substr`, `strpos`) trabajan por bytes y solo entienden ASCII. Para texto real usa las `mb_*`. Symfony 7 exige la extensión `mbstring` justo por esto.

### `strtolower` / `strtoupper` / `mb_strtolower` / `mb_strtoupper`

Cambian la caja. Las versiones sin `mb_` solo tocan letras ASCII — no acentos ni `ñ`.

```php
strtolower('Hola ÑOÑO');      // 'hola ÑOÑO'   — la Ñ no baja
mb_strtolower('Hola ÑOÑO');   // 'hola ñoño'
```

### `ucfirst` / `lcfirst` / `ucwords`

Primera letra en mayúscula: de la frase (`ucfirst`), de cada palabra (`ucwords`). `lcfirst` la baja.

```php
ucfirst('hola mundo');   // 'Hola mundo'
ucwords('hola mundo');   // 'Hola Mundo'
```

### `trim` / `ltrim` / `rtrim`

Quitan caracteres de los extremos. Por defecto, espacios en blanco; con un 2º argumento, los caracteres que le indiques. `ltrim` / `rtrim` actúan en un solo lado.

```php
trim('  hola  ');            // 'hola'
trim('--hola--', '-');       // 'hola'
rtrim('foto.png', 'gnp.');   // 'foto'   — quita cualquiera de esos chars por la derecha
```

!!! tip "`trim` NO quita los espacios del medio"
    `trim(' hola mundo ')` → `'hola mundo'` (el espacio interno se queda). Para los del medio: `preg_replace('/\s+/', ' ', $s)`.

### `str_replace`

Reemplaza **todas** las apariciones de una subcadena. Si le pasas arrays, reemplaza varias a la vez.

```php
str_replace(' ', '-', 'hola mundo');          // 'hola-mundo'
str_replace(['<', '>'], '', '<b>hola</b>');   // 'bhola/b'
```

### `substr` / `mb_substr`

Extrae un trozo: desde una posición y, opcionalmente, un largo. Índice negativo = desde el final.

```php
substr('hola mundo', 0, 4);   // 'hola'
substr('hola mundo', -5);     // 'mundo'
```

### `strpos` / `str_contains` / `str_starts_with` / `str_ends_with`

`strpos` da la posición de la primera aparición, o `false`. Los `str_*` (PHP 8) devuelven `bool` directamente.

```php
strpos('hola mundo', 'mundo');           // 5
strpos('hola', 'z');                     // false
str_contains('hola mundo', 'mundo');     // true
str_ends_with('archivo.pdf', '.pdf');    // true
```

!!! danger "`strpos` y el `0` traicionero"
    Si la coincidencia está al principio, `strpos` devuelve `0`, que es *falsy*. `if (strpos(...))` falla ahí. Compara con `!== false`, o usa `str_contains` si solo te importa el sí/no.

### `explode` / `implode`

`explode` parte un string en array por un separador. `implode` es el inverso (el `array.join` de JS).

```php
explode(',', 'a,b,c');                // ['a', 'b', 'c']
implode('-', ['2026', '08', '30']);   // '2026-08-30'
```

### `str_pad`

Rellena un string hasta un largo dado, por la izquierda, la derecha o ambos lados.

```php
str_pad('7', 3, '0', STR_PAD_LEFT);   // '007'
```

### `str_repeat`

Repite un string N veces.

```php
str_repeat('=', 10);   // '=========='
```

### `sprintf` / `printf`

Formatean con marcadores: `%s` string, `%d` entero, `%.2f` float con 2 decimales, `%05d` con ceros a la izquierda. `sprintf` devuelve el string; `printf` lo imprime.

```php
sprintf('%s tiene %d años', 'Ana', 30);   // 'Ana tiene 30 años'
sprintf('%.2f €', 3.5);                    // '3.50 €'
```

### `number_format`

Formatea un número con separador de miles y de decimales.

```php
number_format(1234567.891, 2, ',', '.');   // '1.234.567,89'  (formato europeo)
```

### `htmlspecialchars`

Convierte `< > & " '` en entidades HTML. Imprescindible al meter datos del usuario dentro del HTML (evita XSS).

```php
htmlspecialchars('<script>alert(1)</script>');   // '&lt;script&gt;alert(1)&lt;/script&gt;'
```

### `preg_match`

¿El string casa con la expresión regular? Devuelve `1` / `0` (o `false` si la regex es inválida). El 3er argumento, por referencia, recibe los grupos capturados.

```php
preg_match('/^\d{5}$/', '28013');              // 1
preg_match('/(\w+)@(\w+)/', 'ana@mail', $m);   // $m = ['ana@mail', 'ana', 'mail']
```

### `preg_replace`

Reemplaza usando una regex. Devuelve el string modificado (o `null` si la regex falla).

```php
preg_replace('/[^a-z0-9]+/', '-', 'Hola, Mundo!');   // 'hola-mundo-'
```

!!! tip "`preg_replace` solo reemplaza"
    No baja a minúsculas ni recorta. Para un slug el orden es: `mb_strtolower` → `preg_replace('/[^a-z0-9]+/', '-', …)` → `trim($s, '-')`.

### `preg_split`

Parte un string por una regex, cuando el separador no es fijo.

```php
preg_split('/\s+/', 'hola   mundo  cruel');   // ['hola', 'mundo', 'cruel']
```

### `json_encode` / `json_decode`

Array/objeto PHP ⇄ string JSON. `json_decode($j, true)` devuelve array asociativo; sin el `true`, un `stdClass`.

```php
json_encode(['id' => 1, 'ok' => true]);   // '{"id":1,"ok":true}'
json_decode('{"id":1}', true);            // ['id' => 1]
```

---

## Arrays { .topic-title }

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

Ordenan **por referencia** y devuelven `bool`, no el array. `sort` por valor (reindexa), `asort` por valor (conserva claves), `ksort` por clave, `usort` con un comparador propio.

```php
$n = [3, 1, 2];
sort($n);                            // $n = [1, 2, 3]
usort($n, fn($a, $b) => $b - $a);    // $n = [3, 2, 1]
```

!!! danger "`$x = sort($a)` te deja `$x = true`"
    Las funciones de ordenación no devuelven el array ordenado — modifican el que les pasas. El resultado es la propia variable `$a`.

---

## Números y matemáticas { .topic-title }

### `abs` / `round` / `floor` / `ceil`

Valor absoluto; redondeo a N decimales; hacia abajo; hacia arriba.

```php
abs(-7);             // 7
round(3.14159, 2);   // 3.14
floor(3.9);          // 3.0
ceil(3.1);           // 4.0
```

### `min` / `max`

El menor / el mayor. Aceptan varios argumentos o un array.

```php
min(4, 2, 8);     // 2
max([4, 2, 8]);   // 8
```

### `intdiv` / `%`

División entera y módulo (resto).

```php
intdiv(17, 5);   // 3
17 % 5;          // 2
```

### `**` / `pow` / `sqrt`

Potencia (operador `**` o la función `pow`) y raíz cuadrada.

```php
2 ** 10;     // 1024
sqrt(144);   // 12.0
```

### `random_int` / `mt_rand` / `rand`

Entero aleatorio en un rango. `random_int` es criptográficamente seguro — úsalo por defecto.

```php
random_int(1, 6);   // p. ej. 4  (seguro)
mt_rand(1, 6);      // rápido, NO seguro
```

### `intval` / `floatval` / casts

Convierten a número. Los casts `(int)` `(float)` `(string)` `(bool)` hacen lo mismo.

```php
intval('42abc');   // 42
(int) '3.99';      // 3
(string) 42;       // '42'
```

### `is_numeric`

¿Es un número, o un string que representa un número?

```php
is_numeric('3.14');   // true
is_numeric('3,14');   // false   — el separador decimal es el punto
```

!!! danger "Dinero: nunca en un `float`"
    Doctrine devuelve las columnas `DECIMAL` como `string` para no perder precisión. Castea a propósito para operar (`(float) $precio`) y reformatea al final con `number_format`. En binario, `0.1 + 0.2` no da `0.3`.

---

## Comprobar tipos y valores { .topic-title }

### `gettype` / `get_debug_type`

El tipo de una variable como string. `get_debug_type` (PHP 8) es más preciso: da el nombre de clase completo.

```php
gettype(42);            // 'integer'
get_debug_type($obj);   // 'App\Entity\Product'
```

### `is_string` / `is_int` / `is_array` / `is_bool` / `is_null` / `is_callable`

Comprobación de tipo concreta, devuelven `bool`.

```php
is_string('hola');   // true
is_int('42');        // false   — es un string
is_array([]);        // true
```

### `isset`

¿La variable o clave existe **y** no es `null`? No lanza aviso aunque no exista.

```php
isset($usuario['email']);   // false si no existe o si es null
```

### `empty`

¿El valor es "vacío"? Cuentan como vacío: `''`, `'0'`, `0`, `0.0`, `null`, `false`, `[]`.

```php
empty('');    // true
empty('0');   // true   — ¡el string '0' también!
empty([]);    // true
```

### `??` / `??=` / `?:`

`??` (null coalescing) usa el segundo valor si el primero no existe o es `null`. `?:` (elvis) usa el segundo si el primero es *falsy*.

```php
$nombre = $datos['nombre'] ?? 'Anónimo';
$config['ttl'] ??= 30;
$titulo = $titulo ?: 'Sin título';
```

!!! tip "`isset` vs `empty` vs `??`"
    - `isset($x)` — existe y no es `null`.
    - `empty($x)` — es falsy (ojo con `'0'`, `0`, `[]`).
    - `$x ?? 'def'` — el patrón limpio para "usa esto si no hay nada". Reemplaza al viejo `isset($x) ? $x : 'def'`.

---

## Depuración { .topic-title }

### `var_dump`

Tipo + valor + longitud de todo lo que le pases. Lo imprime directamente.

```php
var_dump(['a' => 1, 'b' => [2, 3]]);
```

### `print_r`

Versión legible. Con `true` como 2º argumento, lo **devuelve** en vez de imprimirlo.

```php
error_log(print_r($datos, true));   // volcar a los logs
```

### `var_export`

Imprime el valor como **código PHP válido**.

```php
var_export([1, 2, 3]);   // array ( 0 => 1, 1 => 2, 2 => 3, )
```

### `error_log`

Escribe en el log de errores del servidor, no en la respuesta.

```php
error_log("Llega aquí con id={$id}");
```

!!! tip "En Symfony: `dump()` y `dd()`"
    El VarDumper de Symfony trae `dump($v)` (vuelca y sigue) y `dd($v)` (*dump and die* — vuelca y corta ahí). Mucho más legibles y salen en la barra de depuración. `var_dump` / `print_r` quedan para scripts sueltos sin framework.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/llenguatges/php](https://apunts.institutmontilivi.cat/MOD-0613/llenguatges/php/) |
| 📘 **Manual oficial de PHP** | [php.net](https://www.php.net/manual/es/) — cada función en `php.net/<nombre>` |
| ⚡ **DevDocs — PHP** | [devdocs.io/php](https://devdocs.io/php/) — búsqueda instantánea, offline |
| 📗 **PHP: The Right Way** | [phptherightway.com](https://phptherightway.com/) — convenciones y buenas prácticas |
