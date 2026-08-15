# Rutas { .section-fundamentos }

> Una ruta es la regla que conecta una URL con el método de un controlador. El componente Routing es quien mira cada petición entrante y decide, según esa regla, quién la atiende — es la primera parada de cualquier petición HTTP dentro de Symfony.

---

## Declarar una ruta {: .topic-title }

Se declara con el atributo `#[Route]` justo encima del método del controlador que la atiende:

```php
#[Route('/blog', name: 'blog_index')]
public function index(): Response
{
    // ...
}
```

## Parámetros de ruta {: .topic-title }

Las URLs casi nunca son fijas del todo — necesitan partes variables, como el id de un artículo. Se declaran con llaves `{}`, y Symfony extrae el valor y lo pasa como argumento al método, siempre que el nombre coincida:

```php
#[Route('/articulos/{id}', name: 'articulo_show')]
public function show(int $id): Response
{
    // $id trae el valor que venía en la URL
}
```

**Varios parámetros:**

```php hl_lines="1 2"
#[Route('/comparar/{idA}-{idB}', name: 'comparar')]
public function comparar(int $idA, int $idB): Response
{
    // ...
}
```

**Valor por defecto** — con `defaults`, la ruta funciona aunque el parámetro no venga en la URL:

```php hl_lines="4"
#[Route(
    '/saludo/{nombre}',
    name: 'saludo',
    defaults: ['nombre' => 'invitado']
)]
public function saludo(string $nombre): Response
{
    return new Response("Hola, {$nombre}");
}
```

**Requisitos** — para validar el formato del parámetro con una expresión regular:

```php hl_lines="4 11"
#[Route(
    '/producto/{id}',
    name: 'producto_show',
    requirements: ['id' => '\d+']
)]
// Solo acepta {id} si son uno o más dígitos

#[Route(
    '/blog/{categoria}',
    name: 'blog_categoria',
    requirements: ['categoria' => 'noticias|tutoriales']
)]
// Solo acepta esos dos valores exactos para {categoria}
```

## Tipos de parámetro de la ruta {: .topic-title }

Más allá de `{id}`, el propio atributo `#[Route]` acepta opciones que afinan cuándo se activa:

| Opción | Para qué |
|---|---|
| `name` | El identificador único de la ruta — imprescindible para `redirectToRoute()` y `path()` |
| `host` | Restringe la ruta a un dominio o subdominio concreto — también admite un placeholder (`'{subdominio}.miweb.com'`) para capturarlo como parámetro dinámico |
| `methods` | Limita qué verbos HTTP acepta (`['GET', 'POST']`) — por defecto acepta todos |
| `schemes` | Restringe el protocolo (`['https']`), útil para forzar seguridad |
| `condition` | Una expresión lógica personalizada que debe dar `true` para que la ruta se active |
| `priority` | Prioridad numérica cuando dos rutas podrían coincidir con la misma URL |

Las seis opciones combinadas en una sola ruta:

```php hl_lines="3 4 5 6 7 8"
#[Route(
    '/panel',
    name: 'panel_admin',                                  // identificador único — redirectToRoute()/path()
    host: 'admin.miweb.com',                               // solo responde en ese dominio exacto
    methods: ['GET', 'POST'],                               // solo esos verbos HTTP; el resto → 405
    schemes: ['https'],                                     // solo por HTTPS
    condition: "context.getMethod() in ['GET', 'POST']",    // expresión ExpressionLanguage adicional
    priority: 2                                             // se evalúa antes que rutas con menor prioridad
)]
public function panel(): Response
{
    // ...
}
```

**Host con placeholder** — captura el subdominio como parámetro dinámico, igual que `{id}` captura un trozo del path:

```php hl_lines="1"
#[Route('/panel', name: 'panel_cliente', host: '{subdominio}.miweb.com')]
public function panel(string $subdominio): Response
{
    // $subdominio trae, por ejemplo, "acme" si la petición vino de acme.miweb.com
}
```

## Generar URLs: `path()`, `generateUrl()` y `redirectToRoute()` {: .topic-title }

Nunca se escribe una URL "a mano" dentro del código — siempre se referencia la ruta **por su nombre**, así si cambia el `path` de la ruta, todos los enlaces se actualizan solos. Hay tres herramientas según dónde estés parado y qué necesites:

- **`redirectToRoute()`** (controlador) — genera la URL **y redirige** de inmediato.
- **`generateUrl()`** (controlador) — genera la URL como **string**, sin redirigir; útil cuando necesitas la URL para meterla en un JSON, un email o un log.
- **`path()`** (Twig) — el equivalente a `generateUrl()` pero dentro de una plantilla.

```php
return $this->redirectToRoute('articulo_show', ['id' => $articulo->getId()]);

$url = $this->generateUrl('articulo_show', ['id' => $articulo->getId()]);
// $url = "/articulos/42" — lista para usar donde haga falta, sin redirigir a ningún sitio
```

```twig
<a href="{{ path('articulo_show', {id: articulo.id}) }}">Leer artículo</a>
```

## Agrupación de rutas {: .topic-title }

Cuando varios métodos de un mismo controlador comparten un prefijo de URL, se declara una vez en la clase en vez de repetirlo en cada método:

```php hl_lines="1"
#[Route('/blog', name: 'blog_')]
class BlogController extends AbstractController
{
    #[Route('', name: 'index')]           // URL final: /blog       — name final: blog_index
    public function index(): Response { /* ... */ }

    #[Route('/{id}', name: 'show')]       // URL final: /blog/{id}  — name final: blog_show
    public function show(int $id): Response { /* ... */ }
}
```

Tanto el `path` como el `name` de la clase actúan como prefijo de todo lo que hay debajo.

## Slug {: .topic-title }

Un slug es la parte de una URL que identifica un contenido de forma legible y segura para SEO — una versión simplificada del título:

- Título: `¿Qué es un slug en Symfony?`
- Slug: `que-es-un-slug-en-symfony`

Dos formas de generarlo:

- **`SluggerInterface`** (componente String) — convierte cualquier texto en slug de forma programática, desde un controlador o servicio; también existe un filtro `slug` para Twig.
- **Doctrine Extensions** (`Gedmo\DoctrineExtensions`) — la forma más habitual para entidades: genera el slug automáticamente a partir de otro campo (como el título) cada vez que se crea o actualiza el registro, sin tener que llamarlo a mano.

---

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | Apunts DAW2, Institut Montilivi |
| 📘 **Documentación oficial de Symfony — Routing** | [symfony.com/doc/current/routing.html](https://symfony.com/doc/current/routing.html) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/) |
| 🎥 **SymfonyCasts — Rutas, controladores y respuestas** (ES) | [symfonycasts.com/es/screencast/symfony/route-controller](https://symfonycasts.com/es/screencast/symfony/route-controller) |
| 🎥 **SymfonyCasts — Rutas más sofisticadas: requisitos y comodines** (ES) | [symfonycasts.com/es/screencast/symfony/route-requirements](https://symfonycasts.com/es/screencast/symfony/route-requirements) |
