# Depuración { .section-fundamentos }

> Volcar el contenido de una variable para ver qué hay dentro.

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
