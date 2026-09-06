# Control de flujo { .section-fundamentos }

> Condicionales y bucles en PHP. La sintaxis es casi idéntica a la de JavaScript, así que lo que hay que aprender no es la forma sino las tres diferencias que muerden: `switch` compara de forma laxa, `match` no, y existe una sintaxis alternativa pensada para mezclar PHP con HTML.

---

## Condicionales { .topic-title }

```php
if ($total > 100) {
    $envio = 0;
} elseif ($total > 50) {
    $envio = 3;
} else {
    $envio = 6;
}
```

En PHP es `elseif` (una palabra). `else if` separado también funciona, pero rompe la sintaxis alternativa que se ve más abajo, así que se escribe junto.

!!! tip "Salida temprana antes que anidar"
    ```php
    // ❌ anidamiento
    function procesar(?Pedido $pedido): string {
        if ($pedido !== null) {
            if ($pedido->estaPagado()) {
                return 'ok';
            }
        }
        return 'error';
    }

    // ✅ salida temprana
    function procesar(?Pedido $pedido): string {
        if ($pedido === null)        return 'error';
        if (!$pedido->estaPagado())  return 'error';
        return 'ok';
    }
    ```

    Validar primero y salir, dejar el camino correcto sin sangrar. Es el patrón de **early return**, y funciona igual en cualquier lenguaje.

## `switch`: compara de forma laxa y se cae en cascada { .topic-title }

```php
switch ($estado) {
    case 'pendiente':
        $color = 'gris';
        break;
    case 'enviado':
    case 'confirmado':      // dos casos, misma acción
        $color = 'verde';
        break;
    default:
        $color = 'rojo';
}
```

!!! danger "Sin `break` sigue ejecutando el caso siguiente"
    Olvidar un `break` no da error: la ejecución **continúa hacia abajo** por los casos siguientes hasta encontrar uno o terminar el `switch`. Es útil a propósito (los dos casos juntos del ejemplo), y un bug silencioso el resto de las veces.

!!! danger "`switch` compara con `==`, no con `===`"
    ```php
    switch (0) {
        case 'texto':   // en PHP 7 entraba aquí
        ...
    }
    ```

    El `switch` usa comparación laxa, con toda la conversión automática de tipos que eso arrastra. Si comparas valores que pueden venir como texto desde un formulario, el resultado puede sorprenderte.

## `match`: la versión estricta y moderna { .topic-title }

Desde PHP 8. Es lo que se usa hoy en casi todos los casos donde antes iba un `switch`.

```php
$color = match ($estado) {
    'pendiente'              => 'gris',
    'enviado', 'confirmado'  => 'verde',
    default                  => 'rojo',
};
```

Cuatro diferencias con `switch`, todas a favor:

| | `switch` | `match` |
|---|---|---|
| Comparación | `==` (laxa) | **`===` (estricta)** |
| Devuelve valor | No, asigna dentro | **Sí, es una expresión** |
| `break` | Obligatorio | No existe, no hay cascada |
| Sin coincidencia ni `default` | Sigue de largo | **Lanza `UnhandledMatchError`** |

!!! tip "Que reviente sin `default` es una ventaja"
    Si añades un estado nuevo al sistema y olvidas contemplarlo, `switch` te devuelve el `default` en silencio y el bug aparece semanas después. `match` **lanza una excepción en el acto**. Cuando el conjunto de valores es cerrado —los casos de un enum, por ejemplo—, conviene omitir el `default` a propósito.

`match` también admite condiciones, pasándole `true`:

```php
$envio = match (true) {
    $total > 100 => 0,
    $total > 50  => 3,
    default      => 6,
};
```

## Bucles { .topic-title }

```php
for ($i = 0; $i < 10; $i++) { ... }

while ($fila = $consulta->fetch()) { ... }

do { ... } while ($quedanPaginas);

foreach ($productos as $producto) { ... }
foreach ($productos as $clave => $valor) { ... }
```

`foreach` es el que se usa para recorrer arrays y objetos iterables: no depende de que los índices sean consecutivos, y funciona igual con claves de texto. `for` queda para cuando de verdad necesitas el número del índice.

!!! warning "`foreach` sobre una copia, y el peligro de `&`"
    Modificar `$valor` dentro del bucle no cambia el array original, salvo que pidas referencia con `&$valor` — y en ese caso hace falta un `unset($valor)` después. Está detallado en [Arrays](../03-arrays/index.md).

!!! danger "No modifiques el array que estás recorriendo"
    Añadir o quitar elementos de un array dentro de su propio `foreach` da resultados impredecibles. Lo que se hace es acumular en otro array y aplicar los cambios al terminar.

## `break` y `continue` aceptan un número { .topic-title }

```php
foreach ($pedidos as $pedido) {
    foreach ($pedido->getLineas() as $linea) {
        if ($linea->estaCancelada()) {
            continue 2;   // salta al siguiente PEDIDO, no a la siguiente línea
        }
    }
}
```

Ese número —cuántos niveles de bucle atraviesa— no existe en JavaScript, donde hay que recurrir a etiquetas. Con más de dos niveles conviene extraer una función en lugar de contar niveles.

## Sintaxis alternativa para plantillas { .topic-title }

Cuando PHP se mezcla con HTML, las llaves se pierden de vista. Existe una forma equivalente que cierra con una palabra:

```php
<ul>
<?php foreach ($productos as $producto): ?>
    <li>
        <?= htmlspecialchars($producto->getNombre()) ?>
        <?php if ($producto->estaAgotado()): ?>
            <span class="agotado">Agotado</span>
        <?php endif; ?>
    </li>
<?php endforeach; ?>
</ul>
```

Los cierres son `endif;`, `endforeach;`, `endwhile;`, `endfor;`, `endswitch;`. Se ve a simple vista qué bloque se está cerrando, cosa que una `}` suelta entre etiquetas HTML no permite.

!!! tip "`<?=` es `echo`, y el `htmlspecialchars` no es opcional"
    `<?= $x ?>` es la forma corta de `<?php echo $x; ?>`. Siempre está disponible, no depende de configuración.

    Y todo lo que venga del usuario pasa por **`htmlspecialchars()`** antes de imprimirse. Sin eso, un nombre de producto con `<script>` dentro se ejecuta en el navegador de quien mire la página: eso es un **XSS**. Twig lo hace automáticamente; PHP puro, no.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Estructuras de control** | [php.net/manual/es/language.control-structures.php](https://www.php.net/manual/es/language.control-structures.php) |
| 📘 **Manual oficial — `match`** | [php.net/manual/es/control-structures.match.php](https://www.php.net/manual/es/control-structures.match.php) |
| ⚡ **DevDocs — PHP** | [devdocs.io/php](https://devdocs.io/php/) |
