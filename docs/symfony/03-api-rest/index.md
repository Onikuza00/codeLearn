# API REST { .section-fundamentos }

> Una API REST es la misma aplicación de Symfony con una diferencia: los controladores devuelven **datos en JSON** en vez de HTML. Rutas, entidades, servicios y seguridad siguen funcionando igual.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:controller ProductoApiController
    composer require symfony/serializer-pack    # Serializer + anotaciones + validador
    ```

No hay un `make:api`: se crea un controlador normal y se cambia lo que devuelve.

---

## Qué cambia respecto a una web {: .topic-title }

| | Aplicación web | API REST |
|---|---|---|
| Devuelve | HTML renderizado con Twig | JSON |
| Método del controlador | `$this->render(...)` | `$this->json(...)` |
| Quién la consume | Un navegador | Otro programa: un frontend, una app, otro servidor |
| Estado | Sesión con cookie | Sin estado; token en cada petición |
| Errores | Página de error | Código HTTP con un cuerpo JSON |

Todo lo demás —el enrutador, Doctrine, los servicios, los *voters*— no cambia.

!!! info "REST no es un estándar, es un estilo"
    REST (*Representational State Transfer*) es un conjunto de convenciones sobre cómo estructurar una API: los recursos se identifican por URL, y el verbo HTTP indica la operación.

    Nadie valida que las cumplas. Pero seguirlas hace que tu API sea previsible para quien la consume, y esa previsibilidad es todo el valor.

---

## Recursos y verbos {: .topic-title }

La regla de fondo: **la URL nombra una cosa, el verbo dice qué le haces**.

| Verbo | Ruta | Qué hace | Devuelve |
|---|---|---|---|
| `GET` | `/api/productos` | Listar | `200` con el array |
| `GET` | `/api/productos/{id}` | Obtener uno | `200` con el objeto |
| `POST` | `/api/productos` | Crear | `201` con el creado |
| `PUT` | `/api/productos/{id}` | Reemplazar entero | `200` con el actualizado |
| `PATCH` | `/api/productos/{id}` | Modificar parte | `200` con el actualizado |
| `DELETE` | `/api/productos/{id}` | Borrar | `204` sin cuerpo |

!!! danger "El verbo va en la petición, nunca en la URL"
    ```
    POST /api/productos/7/borrar      ❌
    DELETE /api/productos/7           ✅

    GET /api/getProductos             ❌
    GET /api/productos                ✅
    ```
    Una URL identifica **un recurso**, no una acción. Meter el verbo en la ruta rompe la convención y obliga a quien consume la API a leerse la documentación para cada operación, en vez de deducirla.

    En plural y en minúsculas, por costumbre: `/api/productos`, no `/api/Producto`.

---

## Códigos de estado {: .topic-title }

El código HTTP es la primera respuesta que lee el cliente. Devolver siempre `200` con un campo `"error"` dentro obliga a inspeccionar el cuerpo para saber si algo falló.

| Código | Cuándo |
|---|---|
| `200 OK` | Todo bien, y hay contenido |
| `201 Created` | Se ha creado un recurso — normalmente tras un `POST` |
| `204 No Content` | Todo bien, y no hay nada que devolver — típico del `DELETE` |
| `400 Bad Request` | La petición está mal formada: el JSON no se puede leer |
| `401 Unauthorized` | No sé quién eres: falta el token o no vale |
| `403 Forbidden` | Sé quién eres, pero no puedes |
| `404 Not Found` | El recurso no existe |
| `422 Unprocessable Content` | El JSON se entiende, pero los datos no pasan la validación |
| `500 Internal Server Error` | Ha fallado el servidor |

!!! tip "`400` y `422` no son lo mismo"
    `400` es "no entiendo lo que me mandas": una llave sin cerrar, un cuerpo vacío.

    `422` es "te entiendo perfectamente, pero el precio es negativo": el JSON es correcto y el problema son los datos.

    Distinguirlos permite al cliente reaccionar distinto: ante un `400` hay un fallo de programación; ante un `422` hay errores que enseñar al usuario junto a cada campo.

!!! warning "El `401` y el `403` se confunden constantemente"
    `401` es un problema de **autenticación**: no sé quién eres. El cliente debe iniciar sesión o renovar el token.

    `403` es un problema de **autorización**: sé quién eres y no tienes permiso. Iniciar sesión otra vez no arregla nada.

    Devolver `403` donde tocaba `401` hace que el cliente no sepa que debe renovar el token, y el usuario se queda fuera sin motivo aparente.

---

## El controlador más simple {: .topic-title }

```php
namespace App\Controller\Api;

use App\Repository\ProductoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/productos')]
class ProductoApiController extends AbstractController
{
    #[Route('', name: 'api_producto_index', methods: ['GET'])]
    public function index(ProductoRepository $repositorio): JsonResponse
    {
        return $this->json($repositorio->findAll(), 200, [], [
            'groups' => ['producto:read'],
        ]);
    }
}
```

`$this->json()` recibe cuatro argumentos: los datos, el código de estado, cabeceras adicionales y el contexto de serialización. Ese cuarto es el que controla **qué campos salen**, y se explica en [serialización](01-serializacion/index.md).

!!! danger "Sin grupos de serialización, sale TODO"
    Una entidad `User` serializada sin filtro incluye el hash de la contraseña, los roles y cualquier relación que Doctrine cargue. Todo eso viaja al cliente.

    No es un fallo teórico: es la fuga de datos más habitual al montar la primera API. Lo primero que se configura son los grupos, antes que ningún endpoint.

---

## Autenticación {: .topic-title }

Una API no usa sesiones: cada petición llega sola y debe autenticarse por sí misma. En Symfony eso se resuelve con tokens JWT, y está desarrollado en el bloque de seguridad:

➡️ **[Seguridad → JWT](../02-seguridad/08-jwt/index.md)**

Ahí están también la configuración de **CORS**, necesaria si el frontend vive en otro dominio, y la tabla de diagnóstico de los fallos típicos.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [01 - Serialización](01-serializacion/index.md) | `$this->json()`, `#[Groups]`, `deserialize`, referencias circulares, fechas |
| [02 - CRUD completo](02-crud/index.md) | Los cinco endpoints, `PUT` frente a `PATCH`, `EntityValueResolver`, paginación |
| [03 - Validación y errores](03-validacion-errores/index.md) | `ValidatorInterface`, formato de error, `#[MapRequestPayload]`, excepciones |

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — API REST amb Symfony** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/webservice/ |
| 🐘 **Symfony — The Serializer Component** | https://symfony.com/doc/current/serializer.html |
| 🐘 **Symfony — Validation** | https://symfony.com/doc/current/validation.html |
