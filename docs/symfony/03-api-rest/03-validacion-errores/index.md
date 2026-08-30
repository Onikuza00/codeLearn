# Validación y errores { .section-fundamentos }

> Una API se juzga por cómo falla. Un error bien formado permite al cliente enseñar el problema junto al campo correcto; uno mal formado obliga a mostrar "ha ocurrido un error" y a mirar los registros.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/validator
    ```

Ya viene con `symfony/serializer-pack`.

---

## Validar la entidad {: .topic-title }

Las reglas se declaran como atributos sobre las propiedades:

```php
namespace App\Entity;

use Symfony\Component\Validator\Constraints as Assert;

class Producto
{
    #[Assert\NotBlank(message: 'El nombre es obligatorio')]
    #[Assert\Length(min: 3, max: 120)]
    private ?string $nombre = null;

    #[Assert\NotNull]
    #[Assert\Positive(message: 'El precio debe ser mayor que cero')]
    private ?float $precio = null;

    #[Assert\Email]
    private ?string $contacto = null;
}
```

Y se comprueban con el validador:

```php
use Symfony\Component\Validator\Validator\ValidatorInterface;

$errores = $this->validator->validate($producto);

if (count($errores) > 0) {
    return $this->json(['errors' => $this->formatear($errores)], 422);
}
```

!!! warning "El validador no lanza excepciones: devuelve una lista"
    `validate()` siempre devuelve un objeto `ConstraintViolationList`, esté vacío o no. Si no compruebas `count()`, el código sigue adelante y guarda datos inválidos.

    Y ojo con la comprobación: la lista implementa `Countable`, así que `count($errores) > 0` es correcto, pero `if ($errores)` es **siempre cierto** —es un objeto—, incluso cuando no hay ningún error.

---

## El formato del error {: .topic-title }

La lista de violaciones no es JSON: hay que convertirla a algo que el cliente entienda. Lo importante es que el error diga **qué campo** ha fallado, para poder pintarlo al lado.

```php
use Symfony\Component\Validator\ConstraintViolationListInterface;

private function formatear(ConstraintViolationListInterface $errores): array
{
    $salida = [];

    foreach ($errores as $error) {
        $salida[$error->getPropertyPath()][] = $error->getMessage();
    }

    return $salida;
}
```

```json
{
    "errors": {
        "nombre": ["El nombre es obligatorio"],
        "precio": ["El precio debe ser mayor que cero"]
    }
}
```

!!! danger "Un array plano de mensajes es inútil para el cliente"
    ```json
    { "errors": ["El nombre es obligatorio", "El precio debe ser mayor que cero"] }
    ```
    Con esto, el frontend solo puede volcar los mensajes en una lista arriba del formulario. No sabe qué campo marcar en rojo.

    Indexar por `getPropertyPath()` cuesta una línea y cambia por completo lo que el cliente puede hacer.

    Fíjate además en que el valor es un **array**: una propiedad puede incumplir varias reglas a la vez (vacía y demasiado corta). Devolver solo la primera esconde la mitad del problema.

!!! tip "Acuerda el formato de error con el frontend el primer día"
    Da igual cuál elijas mientras sea **el mismo en todos los endpoints**. Es lo que permite escribir una única función de gestión de errores en el cliente, como se explica en la [capa de API](../../../js/05-asincronia/07-capa-de-api/index.md) del bloque de JavaScript.

    Descubrir a mitad de proyecto que cada endpoint devuelve los errores de una forma distinta cuesta una tarde de reescritura en los dos lados.

!!! info "Existe un estándar: RFC 7807"
    *Problem Details for HTTP APIs* define un formato común con campos `type`, `title`, `status` y `detail`. Symfony lo usa en sus respuestas de error cuando el entorno no es de desarrollo, y API Platform lo emite por defecto.

    Adoptarlo evita inventarse un formato propio, y cualquiera que consuma tu API ya sabrá leerlo.

---

## La vía moderna: `#[MapRequestPayload]` {: .topic-title }

Desde Symfony 6.3 existe un atributo que **deserializa y valida en un solo paso**, antes de entrar en el método:

```php
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

#[Route('', methods: ['POST'])]
public function new(
    #[MapRequestPayload] ProductoDto $datos
): JsonResponse {
    // si llegamos aquí, el JSON era válido Y ha pasado la validación
    $producto = new Producto();
    $producto->setNombre($datos->nombre);
    $producto->setPrecio($datos->precio);

    $this->em->persist($producto);
    $this->em->flush();

    return $this->json($producto, 201, [], ['groups' => ['producto:read']]);
}
```

Con un objeto de transferencia (*DTO*) que declara la forma esperada:

```php
namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ProductoDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 3, max: 120)]
        public readonly string $nombre = '',

        #[Assert\Positive]
        public readonly float $precio = 0,
    ) { }
}
```

Symfony devuelve `400` si el JSON está mal formado y `422` si no pasa la validación, sin que escribas ni un `if`.

!!! tip "El DTO separa lo que entra de lo que se guarda"
    Es la ventaja de fondo, más allá de ahorrar líneas. Con un DTO, la forma de la petición y la forma de tu entidad son cosas independientes: puedes cambiar la entidad sin romper el contrato de la API, y al revés.

    Y desaparece de golpe el riesgo de asignación masiva: el DTO solo tiene los campos que el cliente puede enviar. Un `"roles"` de más ni siquiera existe donde caer.

    Para un CRUD sencillo, deserializar sobre la entidad con grupos de escritura basta. En cuanto la API crece, los DTO envejecen mucho mejor.

---

## Centralizar los errores {: .topic-title }

Repetir el mismo bloque de validación en cada método es exactamente lo que un *listener* de excepciones evita.

```php
namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

#[AsEventListener(event: 'kernel.exception')]
class ApiExceptionListener
{
    public function __invoke(ExceptionEvent $evento): void
    {
        $peticion = $evento->getRequest();

        if (!str_starts_with($peticion->getPathInfo(), '/api')) {
            return;                                  // early return: solo la API
        }

        $excepcion = $evento->getThrowable();

        $estado = $excepcion instanceof HttpExceptionInterface
            ? $excepcion->getStatusCode()
            : 500;

        $evento->setResponse(new JsonResponse([
            'message' => $estado === 500 ? 'Error interno' : $excepcion->getMessage(),
        ], $estado));
    }
}
```

Con esto, un `404` del `EntityValueResolver` o un `403` de un *voter* llegan al cliente como JSON en vez de como una página HTML de error.

!!! danger "Nunca devuelvas el mensaje real de una excepción `500`"
    Ese mensaje puede contener la consulta SQL que ha fallado, rutas de ficheros del servidor o parte de la cadena de conexión. Es información que un atacante agradece.

    Al cliente le llega un mensaje genérico; el detalle va al registro:

    ```php
    $this->logger->error($excepcion->getMessage(), ['exception' => $excepcion]);
    ```

!!! warning "Comprueba que la API devuelve JSON también cuando falla"
    Sin este *listener*, un `404` en `/api/productos/999` responde con la página de error de Symfony **en HTML**. El cliente intenta un `.json()` sobre eso y obtiene un error de análisis que no dice nada del problema real.

    Es la causa de muchos "el fetch me da un error rarísimo": la respuesta no era JSON.

---

## Prueba lo que devuelve, no lo que crees {: .topic-title }

```bash
curl -i -X POST http://localhost:8000/api/productos \
     -H "Content-Type: application/json" \
     -d '{"nombre":"","precio":-5}'
```

La bandera `-i` muestra las cabeceras, así que ves el código de estado además del cuerpo. Comprueba tres casos en cada endpoint: los datos correctos, los datos inválidos y el JSON mal formado.

!!! tip "Prueba también sin token y con un token caducado"
    Deben salir `401` y no `500`. Es el escenario que más se olvida y el que peor experiencia produce, porque el cliente no sabe que tiene que renovar la sesión.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `count($errores) > 0` | `if ($errores)` — un objeto siempre es cierto |
| Indexar los errores por nombre de campo | Un array plano de mensajes sin contexto |
| Devolver todos los mensajes de cada campo | Quedarte solo con el primero |
| Mismo formato de error en toda la API | Que cada endpoint invente el suyo |
| `#[MapRequestPayload]` con DTO cuando la API crece | Repetir deserializar y validar en cada método |
| `422` en validación, `400` en JSON mal formado | Devolver `400` para todo |
| Un *listener* que convierta las excepciones a JSON | Que un `404` devuelva HTML a un cliente que espera JSON |
| Mensaje genérico en los `500`, detalle al registro | Enviar al cliente la consulta SQL que ha fallado |
| Probar con `curl -i` los tres casos | Probar solo el camino feliz |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — API REST amb Symfony** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/webservice/ |
| 🐘 **Symfony — Validation** | https://symfony.com/doc/current/validation.html |
| 📄 **RFC 7807 — Problem Details for HTTP APIs** | https://datatracker.ietf.org/doc/html/rfc7807 |
