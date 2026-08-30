# CRUD completo { .section-fundamentos }

> Los cinco endpoints de un recurso, escritos enteros. Cada uno tiene su verbo, su código de respuesta y una trampa propia.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:controller ProductoApiController
    symfony console debug:router                        # comprobar rutas y verbos
    ```

---

## El esqueleto {: .topic-title }

```php
namespace App\Controller\Api;

use App\Entity\Producto;
use App\Repository\ProductoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/productos')]
class ProductoApiController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
    ) { }
}
```

El prefijo `#[Route]` sobre la clase evita repetir `/api/productos` en cada método.

---

## Listar {: .topic-title }

```php
#[Route('', name: 'api_producto_index', methods: ['GET'])]
public function index(ProductoRepository $repositorio): JsonResponse
{
    return $this->json($repositorio->findAll(), 200, [], [
        'groups' => ['producto:read'],
    ]);
}
```

!!! danger "`findAll()` no vale en cuanto la tabla crece"
    Con cien registros funciona. Con cien mil, la petición carga la tabla entera en memoria, agota el límite de PHP y devuelve un `500`.

    Toda lista pública necesita paginación **desde el primer día**, aunque hoy haya tres filas:

    ```php
    #[Route('', name: 'api_producto_index', methods: ['GET'])]
    public function index(Request $request, ProductoRepository $repositorio): JsonResponse
    {
        $pagina = max(1, $request->query->getInt('page', 1));
        $porPagina = min(100, $request->query->getInt('limit', 20));

        $productos = $repositorio->findBy([], ['id' => 'DESC'], $porPagina, ($pagina - 1) * $porPagina);

        return $this->json([
            'data' => $productos,
            'meta' => [
                'page' => $pagina,
                'limit' => $porPagina,
                'total' => $repositorio->count([]),
            ],
        ], 200, [], ['groups' => ['producto:read']]);
    }
    ```
    Fíjate en el `min(100, ...)`: sin ese tope, un cliente puede pedir `?limit=999999` y tumbar el servidor desde la barra de direcciones.

!!! tip "Envolver la lista en `data` y `meta` desde el principio"
    Devolver un array pelado funciona hasta que necesitas añadir el total o los enlaces de paginación. Ese día cambias la forma de la respuesta y **rompes a todos los clientes**.

    Decidirlo al principio cuesta cero; cambiarlo después cuesta una versión nueva de la API.

---

## Obtener uno {: .topic-title }

```php
#[Route('/{id}', name: 'api_producto_show', methods: ['GET'])]
public function show(Producto $producto): JsonResponse
{
    return $this->json($producto, 200, [], ['groups' => ['producto:read']]);
}
```

El parámetro `Producto $producto` lo resuelve el `EntityValueResolver`: busca por el `{id}` de la ruta y, si no existe, lanza un `404` automáticamente. No hace falta comprobar nada.

!!! warning "Las rutas estáticas van antes que las dinámicas"
    ```php
    #[Route('/destacados', methods: ['GET'])]   // ✅ primero
    #[Route('/{id}', methods: ['GET'])]         // después
    ```
    Al revés, `{id}` captura la palabra `destacados`, intenta buscar un producto con ese identificador y devuelve un `404`. El síntoma es que un endpoint que existe responde "no encontrado".

    Otra defensa es exigir que el identificador sea numérico:

    ```php
    #[Route('/{id}', requirements: ['id' => '\d+'], methods: ['GET'])]
    ```

---

## Crear {: .topic-title }

```php
#[Route('', name: 'api_producto_new', methods: ['POST'])]
public function new(Request $request): JsonResponse
{
    $producto = $this->serializer->deserialize(
        $request->getContent(),
        Producto::class,
        'json',
        ['groups' => ['producto:write']]
    );

    $errores = $this->validator->validate($producto);

    if (count($errores) > 0) {
        return $this->json(['errors' => $this->formatear($errores)], 422);
    }

    $this->em->persist($producto);
    $this->em->flush();

    return $this->json($producto, 201, [], ['groups' => ['producto:read']]);
}
```

Tres detalles:

- **`201`, no `200`.** Indica que se ha creado un recurso.
- **Se devuelve el objeto creado**, con su `id` y sus fechas. El cliente lo necesita para no tener que pedirlo otra vez.
- **`producto:write` al deserializar**, para que el cliente no pueda fijar campos que no le corresponden.

!!! tip "Devuelve también la cabecera `Location`"
    Es la convención REST para decir dónde ha quedado el recurso nuevo:

    ```php
    return $this->json($producto, 201, [
        'Location' => $this->generateUrl('api_producto_show', ['id' => $producto->getId()]),
    ], ['groups' => ['producto:read']]);
    ```

---

## Actualizar {: .topic-title }

```php
#[Route('/{id}', name: 'api_producto_edit', methods: ['PUT', 'PATCH'])]
public function edit(Request $request, Producto $producto): JsonResponse
{
    $this->serializer->deserialize(
        $request->getContent(),
        Producto::class,
        'json',
        [
            AbstractNormalizer::OBJECT_TO_POPULATE => $producto,
            'groups' => ['producto:write'],
        ]
    );

    $errores = $this->validator->validate($producto);

    if (count($errores) > 0) {
        return $this->json(['errors' => $this->formatear($errores)], 422);
    }

    $this->em->flush();

    return $this->json($producto, 200, [], ['groups' => ['producto:read']]);
}
```

!!! danger "Sin `OBJECT_TO_POPULATE`, no se actualiza nada"
    El Serializer crea un objeto nuevo con los datos recibidos, la entidad original sigue igual y el `flush()` no detecta ningún cambio.

    La API responde `200` con el objeto modificado —que es el nuevo, no el guardado— y el cliente cree que ha funcionado. Solo se descubre al recargar.

    Es el fallo más difícil de ver de todo el CRUD, porque **no hay ningún error**.

!!! warning "`PUT` y `PATCH` no significan lo mismo"
    `PUT` **reemplaza el recurso entero**: lo que no envíes debería quedar vacío. `PATCH` modifica solo los campos enviados.

    Con `OBJECT_TO_POPULATE`, el comportamiento real es el de `PATCH`: solo se tocan las propiedades presentes en el JSON. Aceptar los dos verbos en el mismo método, como en el ejemplo, es cómodo pero significa que tu `PUT` en realidad se comporta como un `PATCH`.

    Es una decisión legítima si la documentas. Lo que no vale es aceptar `PUT` y que el cliente crea que los campos omitidos se van a limpiar.

---

## Borrar {: .topic-title }

```php
#[Route('/{id}', name: 'api_producto_delete', methods: ['DELETE'])]
public function delete(Producto $producto): Response
{
    $this->em->remove($producto);
    $this->em->flush();

    return new Response(null, 204);
}
```

`204 No Content` significa "hecho, y no hay nada que devolver". El cuerpo debe estar vacío.

!!! warning "Un `204` con cuerpo es una respuesta inválida"
    ```php
    return $this->json(['message' => 'Borrado'], 204);   // ❌
    ```
    El estándar dice que un `204` no lleva cuerpo, y algunos clientes se atragantan al recibirlo. Si quieres devolver un mensaje, usa `200`. Si no, `204` y nada más.

!!! danger "Borrar una entidad con relaciones puede fallar o arrastrar datos"
    Si otras filas apuntan a la que borras, la base de datos rechaza la operación con un error de clave foránea, y el cliente ve un `500` sin explicación.

    Hay que decidirlo de forma explícita en la entidad: `cascade: ['remove']` para borrar en cascada, `onDelete: 'SET NULL'` para desvincular. La decisión es de negocio, no técnica.

    Cuando el borrado real no interesa —historiales, auditoría—, la alternativa es el borrado lógico: una columna `borradoEn` y un filtro en el repositorio.

---

## El usuario autenticado {: .topic-title }

```php
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/mios', name: 'api_producto_mios', methods: ['GET'])]
public function mios(#[CurrentUser] User $usuario, ProductoRepository $repositorio): JsonResponse
{
    return $this->json(
        $repositorio->findBy(['propietario' => $usuario]),
        200, [],
        ['groups' => ['producto:read']]
    );
}
```

!!! danger "Filtrar por usuario en la lista no protege el detalle"
    Que `/api/productos/mios` solo devuelva los tuyos no impide que alguien pida `/api/productos/7` y vea uno ajeno. Son dos endpoints distintos.

    Cada acción sobre un recurso concreto necesita su propia comprobación, y ahí es donde entran los *voters*:

    ```php
    #[Route('/{id}', methods: ['DELETE'])]
    #[IsGranted('PRODUCTO_BORRAR', 'producto')]
    public function delete(Producto $producto): Response { }
    ```
    Está desarrollado en [Seguridad → Voters](../../02-seguridad/05-voters/index.md).

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Paginar toda lista, con un tope de tamaño | `findAll()` y confiar en que la tabla no crezca |
| Envolver la lista en `data` y `meta` desde el principio | Devolver un array pelado y cambiar la forma después |
| Rutas estáticas antes que `/{id}` | Que `/destacados` acabe buscando un producto |
| `201` al crear, `204` al borrar | `200` para todo |
| Devolver el objeto creado con su identificador | Responder `201` con el cuerpo vacío |
| `OBJECT_TO_POPULATE` al actualizar | Preguntarte por qué el `PUT` no guarda |
| Documentar si tu `PUT` se comporta como `PATCH` | Dejar que el cliente lo descubra |
| Decidir el comportamiento en cascada del borrado | Descubrirlo con un error de clave foránea |
| Un *voter* en cada acción sobre un recurso | Filtrar en la lista y dar el detalle por protegido |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — API REST amb Symfony** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/webservice/ |
| 🐘 **Symfony — Controller** | https://symfony.com/doc/current/controller.html |
