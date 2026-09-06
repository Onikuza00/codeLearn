# Twig — Extensiones { .section-fundamentos }

> Twig trae muchos filtros de serie, pero tarde o temprano hace falta uno propio: formatear un importe como lo hace tu empresa, mostrar «hace 3 días» en vez de una fecha. Una extensión de Twig es la forma de añadir filtros y funciones sin ensuciar las plantillas ni los controladores.

---

## Crear una extensión {: .topic-title }

```bash
symfony console make:twig-extension
```

Pide un nombre y genera **dos ficheros**:

```
src/Twig/AppExtension.php          ← declara qué existe
src/Twig/AppExtensionRuntime.php   ← contiene el código
```

!!! danger "Son dos clases, y esperar solo una es el error de partida"
    Muchos ejemplos que circulan por internet muestran una sola clase con la lógica dentro. Es la forma **antigua**, y sigue funcionando, pero no es lo que genera el *maker* actual.

    Buscar «la clase de la extensión» y encontrar dos archivos con nombres parecidos desconcierta si no sabes que la separación es deliberada.

## Por qué dos clases {: .topic-title }

La extensión se registra **en cada petición**, aunque la plantilla no llegue a usar ningún filtro tuyo. Si la lógica —y sus dependencias— vivieran ahí, Symfony tendría que construir el servicio de traducción, el repositorio y lo que hiciera falta **siempre**, para nada.

Separando en dos:

- **`Extension`** — solo declara los nombres. Es ligerísima y no depende de nada.
- **`Runtime`** — tiene el código y las dependencias inyectadas. **Solo se instancia si el filtro se usa de verdad.**

Es carga perezosa aplicada a las plantillas.

## La clase `Extension` {: .topic-title }

```php
namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

final class AppExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('fecha_relativa', [AppExtensionRuntime::class, 'fechaRelativa']),
            new TwigFilter('precio', [AppExtensionRuntime::class, 'precio']),
        ];
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('menu_activo', [AppExtensionRuntime::class, 'menuActivo']),
        ];
    }
}
```

Fíjate en que **no hay constructor ni dependencias**: solo el nombre público del filtro y a qué método del *runtime* apunta.

## La clase `Runtime` {: .topic-title }

```php
namespace App\Twig;

use Twig\Extension\RuntimeExtensionInterface;

final class AppExtensionRuntime implements RuntimeExtensionInterface
{
    public function __construct(
        private RequestStack $requestStack,
    ) {}

    public function fechaRelativa(\DateTimeInterface $fecha): string
    {
        $dias = (new \DateTimeImmutable())->diff($fecha)->days;

        return match (true) {
            $dias === 0 => 'hoy',
            $dias === 1 => 'ayer',
            $dias < 30  => "hace {$dias} días",
            default     => $fecha->format('d/m/Y'),
        };
    }

    public function precio(float $importe): string
    {
        return number_format($importe, 2, ',', '.') . ' €';
    }
}
```

Aquí sí van las dependencias, por constructor, como en cualquier servicio.

!!! warning "El `Runtime` tiene que implementar `RuntimeExtensionInterface`"
    Es lo que permite a Symfony autoconfigurarlo como *runtime* de Twig. Sin esa interfaz, el filtro falla con un error de servicio no encontrado que no señala la causa.

## Usarlo en la plantilla {: .topic-title }

```twig
<p>Publicado {{ articulo.fecha|fecha_relativa }}</p>
<p>Total: {{ pedido.total|precio }}</p>

{% if menu_activo('app_dashboard') %}...{% endif %}
```

Un **filtro** transforma un valor y se usa con `|`. Una **función** se llama por su nombre y no parte de ningún valor previo. Si la operación es «coger esto y convertirlo», es filtro; si es «dame un dato», es función.

## Comprobar que está registrado {: .topic-title }

```bash
symfony console debug:twig
```

Lista todos los filtros, funciones y tests disponibles, los tuyos incluidos. Es lo primero que hay que mirar cuando Twig dice que el filtro no existe.

!!! tip "Antes de crear un filtro, mira si Twig ya lo trae"
    `date`, `number_format`, `format_currency`, `slice`, `join`, `default`, `trim`, `striptags`, `u.truncate`… La biblioteca estándar cubre mucho, y `format_currency` con el componente Intl ya formatea importes por idioma y moneda mejor que un filtro propio.

    Una extensión se justifica cuando hay **lógica de tu dominio**, no cuando falta un formateo genérico.

## Qué NO poner en una extensión {: .topic-title }

<div class="pros-cons" markdown>

| ✅ Sí | ❌ No |
|---|---|
| Formateo de presentación | Consultas a la base de datos |
| Cálculos derivados de un valor | Lógica de negocio |
| Comprobaciones de la interfaz (ruta activa) | Escrituras o cambios de estado |

</div>

!!! danger "Una consulta a la BD dentro de un filtro es una fábrica de problemas N+1"
    Un filtro se ejecuta **una vez por elemento** de un bucle. Si dentro consulta la base de datos, una lista de 200 filas lanza 200 consultas, y el problema queda escondido en una plantilla donde nadie lo busca.

    Los datos se preparan en el controlador o en un servicio y llegan a la plantilla ya resueltos.

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Symfony — Extensiones de Twig** | [symfony.com/doc/current/templating/twig_extension.html](https://symfony.com/doc/current/templating/twig_extension.html) |
| 📘 **Twig — Filtros y funciones de serie** | [twig.symfony.com/doc/3.x/](https://twig.symfony.com/doc/3.x/) |
