# Números y matemáticas { .section-fundamentos }

> Aritmética, redondeo, números aleatorios y conversión de texto a número.

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
