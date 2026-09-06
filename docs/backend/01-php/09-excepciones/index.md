# Excepciones { .section-fundamentos }

> Una excepción interrumpe el flujo normal y sube por la pila de llamadas hasta que alguien la captura. Lo difícil no es la sintaxis: es decidir **quién** la captura y **qué** hace con ella. Capturar demasiado pronto o demasiado ancho esconde los fallos en vez de resolverlos.

---

## La estructura básica { .topic-title }

```php
try {
    $pedido = $this->repositorio->buscar($id);
    $this->pasarela->cobrar($pedido);
} catch (PedidoNoEncontrado $e) {
    return $this->responder404();
} catch (PagoRechazado $e) {
    return $this->responderError($e->getMessage());
} finally {
    $this->registrar('intento de cobro finalizado');
}
```

Los `catch` se evalúan **en orden**, y gana el primero que encaje. Por eso los tipos concretos van arriba y los genéricos abajo: un `catch (\Exception)` al principio se traga todo lo demás.

`finally` se ejecuta **siempre**: haya excepción o no, e incluso si dentro del `try` hay un `return`. Es donde se libera lo que hay que liberar.

## La jerarquía: `Error` y `Exception` son primos, no parientes { .topic-title }

```
Throwable  (interfaz)
├── Error                        ← fallos del lenguaje
│   ├── TypeError                  tipo incorrecto
│   ├── ValueError                 valor imposible
│   ├── ArgumentCountError         faltan argumentos
│   └── DivisionByZeroError
└── Exception                    ← fallos de la aplicación
    ├── LogicException             error de programación
    │   ├── InvalidArgumentException
    │   └── DomainException
    └── RuntimeException           error en ejecución
        └── OutOfBoundsException
```

!!! danger "`catch (Exception $e)` NO captura un `TypeError`"
    Es el malentendido más caro de este tema. `Error` y `Exception` **no heredan uno del otro**: los dos implementan `Throwable`, y ahí acaba el parentesco.

    ```php
    try { $this->procesar('texto'); }     // el método espera un int
    catch (\Exception $e) { ... }         // ❌ no entra: TypeError es un Error
    ```

    Para capturar cualquier cosa hay que usar `catch (\Throwable $e)`. Y ojo con el `\`: dentro de un namespace, `Exception` a secas busca la de tu propio namespace.

!!! tip "Un `Error` no deberías capturarlo casi nunca"
    Un `TypeError` significa que hay un bug en tu código. Capturarlo y seguir es tapar el síntoma: lo correcto es que reviente en desarrollo, lo veas y lo arregles. `\Throwable` se captura solo en la frontera exterior de la aplicación, para registrar el fallo y devolver una página de error decente.

## Capturar varios tipos a la vez { .topic-title }

```php
catch (RedException | TimeoutException $e) {
    $this->reintentar();
}
```

## Excepciones propias { .topic-title }

```php
namespace App\Exception;

class PedidoNoEncontrado extends \RuntimeException
{
    public static function conId(int $id): self
    {
        return new self("No existe el pedido {$id}");
    }
}

throw PedidoNoEncontrado::conId(48);
```

Crear un tipo propio permite **capturar exactamente ese caso** sin comparar mensajes de texto. Y el método de fábrica estático mantiene el mensaje en un solo sitio.

!!! tip "`LogicException` o `RuntimeException`: cuál extender"
    - **`LogicException`** — el fallo es un **error de programación**, detectable antes de ejecutar: un argumento imposible, un estado que no debería darse. No se captura: se arregla el código.
    - **`RuntimeException`** — el fallo solo se puede saber **en ejecución**: la red falló, el fichero no está, el pedido no existe. Estas sí se capturan y se gestionan.

    La mayoría de las excepciones de negocio son `RuntimeException`.

## Encadenar excepciones { .topic-title }

Cuando capturas una excepción de bajo nivel y lanzas una tuya, pasa la original como tercer argumento:

```php
try {
    $respuesta = $this->cliente->request('GET', $url);
} catch (TransportException $e) {
    throw new ErpNoDisponible('El ERP no responde', 0, $e);   // ← $e como "previous"
}
```

Así la traza conserva **la causa raíz**. Sin ese tercer argumento pierdes el motivo real —qué host, qué timeout— y depurar se vuelve adivinar.

## Qué no hacer { .topic-title }

<div class="pros-cons" markdown>

| ❌ No hagas | ✅ Haz |
|---|---|
| `catch (\Exception $e) {}` vacío | Captura solo lo que sabes gestionar, y registra el resto |
| Capturar en cada función por si acaso | Deja subir la excepción hasta quien puede decidir algo |
| Usar excepciones para flujo normal | Un producto sin stock no es excepcional: devuelve un valor |
| Mostrar `$e->getMessage()` al usuario | Mensaje genérico fuera, detalle completo en el registro |
| Comparar `$e->getMessage() === '...'` | Crea un tipo propio y captúralo por tipo |

</div>

!!! danger "El `catch` vacío es el peor patrón del tema"
    Un `catch` que no hace nada convierte un fallo en un comportamiento raro sin causa visible: los datos no se guardan, el correo no sale, y no hay ni una línea en los registros. Si de verdad quieres ignorar un caso, escríbelo explícito con un comentario que diga por qué.

!!! warning "El mensaje de excepción puede filtrar información"
    Una traza en pantalla enseña rutas del servidor, consultas y a veces credenciales. En producción: mensaje genérico para el usuario, traza completa **solo** al registro. Symfony ya lo hace según el entorno, pero en PHP puro hay que configurarlo (`display_errors = Off`).

## `finally` y el `return` { .topic-title }

```php
function probar(): string
{
    try    { return 'try'; }
    finally { echo 'finally se ejecuta igual'; }
}
```

El `finally` corre **después** de evaluar el `return` pero **antes** de devolverlo.

!!! warning "Un `return` dentro de `finally` machaca al del `try`"
    Y también se traga una excepción que estuviera propagándose. Es una fuente de bugs invisibles: en `finally` va limpieza, nunca un `return`.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Excepciones** | [php.net/manual/es/language.exceptions.php](https://www.php.net/manual/es/language.exceptions.php) |
| 📘 **Manual oficial — Jerarquía de errores** | [php.net/manual/es/class.throwable.php](https://www.php.net/manual/es/class.throwable.php) |
| 📘 **Excepciones predefinidas SPL** | [php.net/manual/es/spl.exceptions.php](https://www.php.net/manual/es/spl.exceptions.php) |
