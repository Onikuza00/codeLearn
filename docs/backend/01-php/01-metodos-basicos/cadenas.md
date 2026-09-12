# Cadenas de texto { .section-fundamentos }

> Funciones de `string`: longitud, caja, recorte, búsqueda, formateo, expresiones regulares y JSON. Las versiones `mb_*` son para texto con acentos, `ñ` o emoji.

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
