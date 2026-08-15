# Controllers { .section-fundamentos }

> Un controlador es el punto de encuentro entre una URL y la lógica que la atiende: recibe la petición, decide qué hacer, y siempre devuelve una respuesta. No dibuja HTML a mano ni consulta la base de datos directamente — coordina a quien sí sabe hacer eso.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/-efGx5RMVZk" title="Curso de Symfony 6 — Controlador (DFBastidas)" loading="lazy" allowfullscreen></iframe>
</div>

---

## MakerBundle — generar controladores por comando {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:controller NombreController   # crea el controlador + su plantilla Twig
    symfony console make:entity                        # crea una entidad Doctrine
    symfony console make:crud NombreEntidad             # genera un CRUD completo sobre una entidad existente
    symfony console make:migration                      # genera el SQL de un cambio en las entidades
    symfony console make:form                           # genera una clase FormType
    symfony console make:user                           # crea la entidad User para autenticación
    symfony console make:auth                           # genera el formulario de login + authenticator
    ```

`make:controller` crea el esqueleto con el nombre de clase y el archivo PHP siempre iguales — Symfony los relaciona por convención, así que no conviene renombrar uno sin el otro.

## `AbstractController` {: .topic-title }

Un controlador es, en el fondo, una clase PHP normal dentro de `src/Controller/`. Casi siempre hereda de `AbstractController`, que no aporta lógica propia — aporta **atajos** para no repetir código en cada método.

```php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ArticuloController extends AbstractController
{
    #[Route('/articulos', name: 'articulo_index')]
    public function index(): Response
    {
        return $this->render('articulo/index.html.twig');
    }
}
```

Los atajos más usados de `AbstractController`:

| Método | Para qué |
|---|---|
| `$this->render()` | Renderiza una plantilla Twig |
| `$this->redirectToRoute()` | Redirige a otra ruta por su nombre |
| `$this->json()` | Serializa datos a JSON con el `Content-Type` correcto |
| `$this->isGranted()` | Comprueba si el usuario tiene un rol/permiso |
| `$this->addFlash()` | Guarda un mensaje flash para la próxima petición |

## El objeto `Request` {: .topic-title }

Cuando el controlador necesita leer algo de la petición entrante (parámetros de la URL tipo `?pagina=2`, datos de un formulario, cabeceras...), se pide como parámetro y Symfony lo inyecta solo:

```php
use Symfony\Component\HttpFoundation\Request;

#[Route('/articulos', name: 'articulo_index')]
public function index(Request $request): Response
{
    $pagina = $request->query->get('pagina', 1);   // ?pagina=2 → "2" (o 1 si no viene)

    return $this->render('articulo/index.html.twig', ['pagina' => $pagina]);
}
```

`$request->query` lee la query string (GET). Para datos enviados por formulario (POST) se usa `$request->request` en su lugar.

## El objeto `Response` {: .topic-title }

Todo método de un controlador tiene que devolver, sin excepción, algo que sea una `Response`. Las formas más habituales:

```php
// HTML renderizado con Twig
return $this->render('articulo/index.html.twig', ['articulos' => $articulos]);

// JSON — ideal para una API
return $this->json(['id' => $articulo->getId(), 'titulo' => $articulo->getTitulo()]);

// Redirección
return $this->redirectToRoute('articulo_index');

// Respuesta manual, sin pasar por Twig
return new Response('<h1>Hola</h1>');
```

## Manejo de errores — página 404 {: .topic-title }

Cuando buscás un recurso que podría no existir (por ejemplo, un `Product` por su `id` en Doctrine), `find()` devuelve `null` en vez de lanzar un error. Devolver ese `null` directamente a la plantilla rompe la respuesta — hay que decidir explícitamente qué pasa si no existe.

```php
#[Route('/productos/{id}', name: 'producto_show')]
public function show(int $id, ProductRepository $productRepository): Response
{
    $product = $productRepository->find($id);

    if (!$product) {
        throw $this->createNotFoundException('Producto no encontrado.');
    }

    return $this->render('producto/show.html.twig', ['product' => $product]);
}
```

`createNotFoundException()` es un atajo de `AbstractController` que lanza una `NotFoundHttpException` — Symfony la captura sola y responde con un **404** real, con su página de error por defecto (personalizable en `templates/bundles/TwigBundle/Exception/error404.html.twig`).

Para otros códigos de error el patrón es el mismo, pero lanzando `HttpException` a mano: `throw new HttpException(500, 'mensaje');`.

## Método de acción + `#[Route]` {: .topic-title }

Cualquier método público de un controlador que atienda una URL se llama **método de acción**. La conexión con la URL se declara justo encima, con el atributo `#[Route]`:

```php
#[Route('/articulos/{id}', name: 'articulo_show')]
public function show(int $id): Response
{
    // ...
}
```

El `name` no es cosmético: es el identificador que vas a usar más adelante para generar enlaces (`path('articulo_show', ...)` en Twig) o redirigir (`redirectToRoute('articulo_show', ...)`), sin tener que escribir la URL literal en ningún sitio.

## Autowiring — inyección de dependencias {: .topic-title }

Un controlador no debería crear él mismo los objetos que necesita (el `EntityManager`, un servicio propio, un logger). En vez de eso, los **pide como parámetros** con su tipo, y Symfony se encarga de dárselos ya construidos:

```php
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

#[Route('/articulos/nuevo', name: 'articulo_new')]
public function new(EntityManagerInterface $entityManager, LoggerInterface $logger): Response
{
    $articulo = new Articulo();
    $articulo->setTitulo('Nuevo artículo');

    $entityManager->persist($articulo);
    $entityManager->flush();

    $logger->info('Artículo creado.');

    return $this->redirectToRoute('articulo_index');
}
```

Esto se llama **autowiring**: Symfony mira el tipo declarado (`EntityManagerInterface`, `LoggerInterface`) y sabe qué servicio real inyectar ahí, sin que lo configures a mano. Es la aplicación directa del principio de responsabilidad única — el controlador no sabe *cómo* se guarda un artículo o *cómo* se escribe un log, solo que puede pedir algo que sepa hacerlo.

---

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | Apunts DAW2, Institut Montilivi |
| 📘 **Documentación oficial de Symfony — Controller** | [symfony.com/doc/current/controller.html](https://symfony.com/doc/current/controller.html) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/) |
| 🎥 **SymfonyCasts — Rutas, controladores y respuestas** (ES) | [symfonycasts.com/es/screencast/symfony/route-controller](https://symfonycasts.com/es/screencast/symfony/route-controller) |
