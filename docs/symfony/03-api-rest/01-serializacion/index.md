# Serialización { .section-fundamentos }

> Serializar es convertir un objeto PHP en JSON; deserializar, lo contrario. Es el puente entre tus entidades y el mundo exterior, y decide exactamente **qué campos** cruzan ese puente.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/serializer-pack
    ```

El *pack* trae el Serializer, el componente de anotaciones y el validador, que es lo que hace falta para una API.

---

## Cómo funciona {: .topic-title }

El componente trabaja en dos pasos, y conviene distinguirlos porque los errores aparecen en uno o en otro.

**Normalizador** — convierte el objeto PHP en un array asociativo. Aquí actúan los grupos, las fechas y las relaciones.

**Codificador** — convierte ese array en texto JSON. Aquí solo se aplican banderas de formato.

```
Objeto PHP  →  [normalizador]  →  array  →  [codificador]  →  texto JSON
```

Casi todos los problemas —campos de más, referencias circulares, fechas raras— están en el primer paso.

---

## Serializar en el controlador {: .topic-title }

```php
return $this->json($producto, 200, [], [
    'groups' => ['producto:read'],
]);
```

Los cuatro argumentos son: datos, código de estado, cabeceras y **contexto de serialización**. El cuarto es el que importa.

También se puede usar el servicio directamente, cuando hace falta el texto y no una respuesta:

```php
use Symfony\Component\Serializer\SerializerInterface;

public function exportar(SerializerInterface $serializer, Producto $producto): Response
{
    $json = $serializer->serialize($producto, 'json', ['groups' => ['producto:read']]);

    return new Response($json, 200, ['Content-Type' => 'application/json']);
}
```

!!! info "`$this->json()` usa el Serializer si está instalado"
    Si no lo está, cae en `json_encode()`, que ignora los grupos y no sabe tratar objetos complejos.

    Por eso una API que "no hace caso a los grupos" suele tener el mismo problema de fondo: el Serializer no está instalado y nadie se ha dado cuenta, porque `json_encode` devuelve algo que parece correcto.

---

## Grupos: qué campos salen {: .topic-title }

Sin filtro, el Serializer expone **todas** las propiedades accesibles de la entidad. Los grupos son la forma de decidir cuáles.

```php
namespace App\Entity;

use Symfony\Component\Serializer\Attribute\Groups;

class Producto
{
    #[Groups(['producto:read'])]
    private ?int $id = null;

    #[Groups(['producto:read', 'producto:write'])]
    private ?string $nombre = null;

    #[Groups(['producto:read', 'producto:write'])]
    private ?string $precio = null;

    #[Groups(['producto:read'])]
    private ?\DateTimeImmutable $creadoEn = null;

    // Sin grupo: nunca sale ni entra
    private ?string $notaInterna = null;
}
```

La convención de nombres `entidad:read` y `entidad:write` separa lo que se puede leer de lo que se puede escribir:

- `id` y `creadoEn` solo en `read` — el cliente los ve, pero no puede fijarlos.
- `nombre` y `precio` en los dos — el cliente los lee y los envía.
- `notaInterna` sin grupo — no existe para el exterior.

!!! danger "Una entidad `User` sin grupos expone el hash de la contraseña"
    Es la fuga más habitual al montar la primera API:

    ```json
    {
        "id": 1,
        "email": "ana@ejemplo.com",
        "password": "$2y$13$Xk8fT...",
        "roles": ["ROLE_ADMIN"]
    }
    ```
    El hash no permite recuperar la contraseña, pero sí atacarla sin límite de intentos y fuera de tu servidor. Y los roles le dicen a cualquiera quién es administrador.

    **Los grupos se configuran antes de escribir el primer endpoint**, no después de que alguien lo note.

Los grupos también se pueden aplicar a un método, para exponer un valor calculado que no es una propiedad:

```php
#[Groups(['producto:read'])]
public function getPrecioConIva(): float
{
    return $this->precio * 1.21;
}
```

Sale en el JSON como `precioConIva`.

---

## Referencias circulares {: .topic-title }

Un `Producto` tiene una `Categoria`, y la `Categoria` tiene una colección de `Producto`. Al serializar el producto, el Serializer entra en la categoría, que vuelve al producto, que vuelve a la categoría.

El resultado es una excepción de referencia circular, o un JSON de varios megabytes.

!!! tip "Los grupos son la solución, no un parche"
    La forma limpia es no incluir la vuelta:

    ```php
    class Producto
    {
        #[Groups(['producto:read'])]
        private ?Categoria $categoria = null;
    }

    class Categoria
    {
        #[Groups(['producto:read', 'categoria:read'])]
        private ?string $nombre = null;

        #[Groups(['categoria:read'])]          // NO en producto:read
        private Collection $productos;
    }
    ```
    Serializando con `producto:read`, la categoría aporta su nombre y ahí se detiene: su colección de productos no pertenece a ese grupo.

    Pensar los grupos como "qué forma tiene esta respuesta" en vez de "qué campos tiene esta entidad" resuelve el problema de raíz.

Existen alternativas —limitar la profundidad con `#[MaxDepth]`, o registrar un `circular_reference_handler` que devuelva solo el identificador—, pero son remedios: la respuesta sigue teniendo una forma que nadie ha decidido a conciencia.

!!! warning "Cuidado con serializar colecciones grandes"
    Incluir una relación en el grupo hace que Doctrine cargue **todas** las entidades relacionadas. Una categoría con diez mil productos convierte una petición en un desastre de memoria.

    Para relaciones que pueden crecer, expón el identificador o una URL, y deja que el cliente pida la lista aparte con su propia paginación.

---

## Fechas {: .topic-title }

Por defecto, un `DateTimeInterface` se serializa en formato RFC 3339: `2026-08-30T14:22:00+02:00`.

Para cambiarlo, en el contexto:

```php
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;

return $this->json($producto, 200, [], [
    'groups' => ['producto:read'],
    DateTimeNormalizer::FORMAT_KEY => 'Y-m-d',
]);
```

!!! tip "Devuelve las fechas en formato ISO y con zona horaria"
    Es lo que el cliente puede convertir sin ambigüedad: `new Date(cadena)` en JavaScript lo entiende directamente.

    Una fecha como `30/08/2026` obliga a quien la recibe a adivinar el orden de día y mes, y a suponer una zona horaria. Formatéala para el usuario en el cliente, no en la API.

---

## Deserializar {: .topic-title }

El camino inverso: convertir el JSON que llega en un objeto.

```php
use Symfony\Component\Serializer\SerializerInterface;

$producto = $serializer->deserialize(
    $request->getContent(),
    Producto::class,
    'json'
);
```

Para **actualizar** una entidad existente en lugar de crear una nueva, se le indica sobre qué objeto escribir:

```php
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

$serializer->deserialize(
    $request->getContent(),
    Producto::class,
    'json',
    [
        AbstractNormalizer::OBJECT_TO_POPULATE => $producto,
        'groups' => ['producto:write'],
    ]
);
```

Sin esa opción, el Serializer crea un objeto nuevo, la entidad original queda intacta y el `flush()` no guarda nada. La aplicación responde `200` y no ha cambiado nada.

!!! danger "El grupo de escritura es lo que impide que el cliente se ascienda a administrador"
    Si deserializas sin `'groups' => ['producto:write']`, el cliente puede enviar **cualquier** propiedad de la entidad. Sobre un `User`, eso incluye:

    ```json
    { "email": "ana@ejemplo.com", "roles": ["ROLE_ADMIN"] }
    ```

    Y se la asignas. Es una escalada de privilegios de manual, y sale de una sola opción que falta.

    Otra medida útil es rechazar campos desconocidos en vez de ignorarlos:

    ```php
    AbstractNormalizer::ALLOW_EXTRA_ATTRIBUTES => false,
    ```
    Así, un cliente que envía un campo que no existe recibe un error en vez de creer que se ha guardado.

!!! warning "Un JSON mal formado lanza una excepción, no devuelve `null`"
    `deserialize()` lanza `NotEncodableValueException` si el cuerpo no es JSON válido. Sin capturarla, el cliente recibe un `500` cuando el fallo es suyo y debería ser un `400`.

    ```php
    use Symfony\Component\Serializer\Exception\NotEncodableValueException;

    try {
        $producto = $serializer->deserialize($request->getContent(), Producto::class, 'json');
    } catch (NotEncodableValueException) {
        return $this->json(['message' => 'JSON no válido'], 400);
    }
    ```
    En [validación y errores](../03-validacion-errores/index.md) se explica cómo centralizar esto para no repetirlo en cada método.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Configurar los grupos antes del primer endpoint | Serializar la entidad entera "de momento" |
| Separar `entidad:read` de `entidad:write` | Un solo grupo para leer y escribir |
| `id` y fechas solo en el grupo de lectura | Dejar que el cliente fije el identificador |
| Diseñar los grupos como la forma de la respuesta | Parchear las referencias circulares con `MaxDepth` |
| `OBJECT_TO_POPULATE` al actualizar | Deserializar y preguntarte por qué no guarda |
| `groups` también al deserializar | Aceptar cualquier propiedad que envíe el cliente |
| Capturar `NotEncodableValueException` | Devolver un `500` por un JSON mal escrito |
| Exponer el identificador de una relación grande | Serializar una colección de diez mil elementos |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — API REST amb Symfony** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/webservice/ |
| 🐘 **Symfony — The Serializer Component** | https://symfony.com/doc/current/serializer.html |
