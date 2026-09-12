# Comprobar tipos y valores { .section-fundamentos }

> Saber qué tipo tiene una variable y si existe, está vacía o es `null`.

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
