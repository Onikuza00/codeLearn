# Tipos y operadores { .section-fundamentos }

> PHP es de tipado dinámico como JavaScript, pero convierte los tipos con reglas distintas y tiene un ámbito de variables mucho más estricto. Estas diferencias son las que producen los errores raros al pasar de un lenguaje al otro.

---

## Tipos { .topic-title }

| Tipo | Ejemplo | Nota |
|---|---|---|
| `string` | `'Pau'`, `"Pau"` | Las comillas simples y dobles **no** son equivalentes |
| `int` | `43` | Entero |
| `float` | `19.99` | Decimal. No hay `double` aparte |
| `bool` | `true`, `false` | En minúscula |
| `array` | `[1, 2, 3]` | Lista y diccionario a la vez |
| `null` | `null` | Ausencia de valor |
| `object` | `new Task()` | Instancia de una clase |

Se comprueba con `gettype($x)`, o mejor con las funciones específicas: `is_string()`, `is_int()`, `is_array()`, `is_null()`.

## Comillas simples y dobles no son lo mismo { .topic-title }

```php
$nombre = 'Pau';

echo "Hola $nombre";      // Hola Pau      — interpola
echo 'Hola $nombre';      // Hola $nombre  — literal
echo "Total: {$pedido->getTotal()} €";   // llaves para expresiones
```

Las **dobles** interpretan variables y secuencias de escape (`\n`, `\t`). Las **simples** no interpretan nada, van más rápido y son las que se usan por defecto cuando no hay que interpolar.

Las llaves `{}` hacen falta en cuanto la expresión pasa de una variable simple: propiedades de objeto, índices de array asociativo, llamadas a método.

## Concatenar es con punto { .topic-title }

```php
$saludo = 'Hola ' . $nombre;    // ✅
$saludo .= '!';                 // ✅ concatenación con asignación
```

!!! danger "El `+` NO concatena en PHP"
    Viniendo de JavaScript es el error más automático:

    ```php
    echo 'Hola ' + $nombre;   // ❌ TypeError en PHP 8
    ```

    En PHP el `+` es **solo suma aritmética**. Con dos arrays hace unión de arrays (conserva la clave del primero), que tampoco es lo que esperas. Para juntar texto, siempre el punto.

## Ámbito: las funciones no ven el exterior { .topic-title }

Esta es la diferencia más grande con JavaScript, y la que produce «pero si la variable está declarada arriba».

```php
$total = 100;

function mostrar() {
    echo $total;    // ❌ Warning: Undefined variable $total
}
```

En JavaScript una función ve las variables del ámbito que la contiene. **En PHP no.** Una función solo ve sus parámetros y lo que declara dentro.

```php
function mostrar(int $total) {   // ✅ se pasa como argumento
    echo $total;
}
```

Existen `global $total;` y `$GLOBALS`, pero son un mal síntoma: si una función necesita un dato, se le pasa.

!!! tip "PHP no tiene ámbito de bloque"
    Un `if` o un `for` **no** crean ámbito. Una variable declarada dentro de un `if` sigue existiendo después:

    ```php
    if (true) { $x = 5; }
    echo $x;    // 5 — funciona
    ```

    Es lo contrario de `let`/`const` en JavaScript. Y el contador de un `for` sigue vivo al terminar el bucle.

## Constantes { .topic-title }

```php
define('IVA', 0.21);        // en tiempo de ejecución
const IVA = 0.21;           // en tiempo de compilación, más rápido

class Pedido {
    const ESTADO_PENDIENTE = 'pendiente';   // constante de clase
}
echo Pedido::ESTADO_PENDIENTE;
```

Las constantes **no llevan `$`**. Las de clase se acceden con `::` y son la forma habitual de evitar textos sueltos repartidos por el código.

## Comparación: `==` frente a `===` { .topic-title }

`==` compara **después de convertir tipos**. `===` compara **valor y tipo**.

```php
0 == '0'        // true
'1' == '01'     // true   (los dos se leen como número)
null == false   // true
[] == false     // true

0 === '0'       // false
```

!!! danger "Usa `===` por defecto, siempre"
    La conversión automática de `==` produce comparaciones que parecen imposibles. La regla práctica es: **`===` salvo que tengas un motivo concreto y sepas explicarlo**.

    Y ojo con esta, que cambió: hasta PHP 7, `0 == 'texto'` daba `true` (el texto se convertía a `0`). Desde **PHP 8** da `false`, porque ahora es el número el que se convierte a texto. Código antiguo puede comportarse distinto según la versión.

`!=` y `!==` funcionan igual pero al revés.

## Valores «falsy» { .topic-title }

Se evalúan como falso: `false`, `0`, `0.0`, `''`, `'0'`, `[]`, `null`.

!!! warning "`'0'` es falso en PHP, en JavaScript no"
    ```php
    if ('0') { ... }    // NO entra
    ```

    Una cadena con un cero es falsa. Muerde cuando validas un campo de formulario que puede valer legítimamente `0` — una cantidad, un descuento. Ahí no se comprueba con `if ($valor)`, se comprueba con `if ($valor !== '')` o `isset()`.

## Operadores útiles { .topic-title }

| Operador | Qué hace |
|---|---|
| `??` | Coalescencia nula: devuelve el derecho si el izquierdo es `null` **o no existe** |
| `??=` | Asigna solo si está a `null` o no existe |
| `?:` | Ternario corto: devuelve el izquierdo si es **truthy** |
| `<=>` | Nave espacial: `-1`, `0` o `1`. El que espera `usort()` |
| `?->` | Acceso seguro: si el objeto es `null`, devuelve `null` en vez de reventar |
| `.`  `.=` | Concatenar |
| `%` | Resto |
| `**` | Potencia |

!!! tip "`??` y `?:` no son lo mismo"
    ```php
    $nombre = $_GET['nombre'] ?? 'anónimo';   // ✅ no avisa aunque no exista la clave
    $nombre = $_GET['nombre'] ?: 'anónimo';   // ⚠️ Warning si la clave no existe
    ```

    `??` mira **si existe y no es null**; `?:` mira **si es truthy** y da aviso cuando la variable no está definida. Para leer datos de entrada —`$_GET`, `$_POST`, un array de configuración— siempre `??`.

    Y cuidado con `?:` sobre valores que pueden ser `0` o `''` legítimos: los toma por vacíos y aplica el valor por defecto.

## Conversión explícita { .topic-title }

```php
$entero  = (int) '42';        // 42
$decimal = (float) '19,99';   // ⚠️ 19.0 — la coma corta la lectura
$texto   = (string) 42;       // '42'
$bool    = (bool) '0';        // false
```

!!! warning "La coma decimal no se convierte"
    `(float) '19,99'` devuelve `19.0`, no `19.99`: PHP lee hasta el primer carácter no numérico y para. Con datos que vienen de un formulario español o de un CSV de proveedor, hay que sustituir la coma por punto antes de convertir.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Tipos** | [php.net/manual/es/language.types.php](https://www.php.net/manual/es/language.types.php) |
| 📘 **Manual oficial — Operadores** | [php.net/manual/es/language.operators.php](https://www.php.net/manual/es/language.operators.php) |
| 📘 **Tabla de comparación de tipos** | [php.net/manual/es/types.comparisons.php](https://www.php.net/manual/es/types.comparisons.php) |
