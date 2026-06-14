# Live Components { .section-live }

---

## ¿Qué son?

Los **Live Components** extienden los Twig Components. Se re-renderizan vía AJAX cuando cambia su estado, permitiendo interactividad sin escribir JavaScript.

| | Twig Component | Live Component |
|---|---|---|
| 🖼️ Renderizado | 1 vez en servidor | Se re-renderiza por AJAX |
| 📦 Estado | Solo props iniciales | Props + estado mutable |
| ⚡ JS necesario | No | Stimulus (incluido) |
| 🎯 Ideal para | Cards, listas, headers | Buscadores, carritos, formularios |

> **Analogía:** Twig Component es una **foto**. Live Component es un **video en vivo**.

---

## Maker — Creación

```bash
php bin/console make:twig-component SearchProducts --live
```

!!! info "No existe `make:live-component`"
    El maker de Live Components es el mismo que el de Twig Components, pero con el flag `--live`. No hay preguntas interactivas, genera directo los archivos.

| Con `--live` | Sin `--live` |
|---|---|
| `#[AsLiveComponent]` | `#[AsTwigComponent]` |
| `use DefaultActionTrait` | Sin trait |
| Template con `{{ attributes }}` | Template sin atributos |

---

## Código generado

=== "PHP"

    ```php title="src/Twig/Components/SearchProducts.php"
    namespace App\Twig\Components;

    use App\Repository\ProductRepository;
    use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
    use Symfony\UX\LiveComponent\Attribute\LiveProp;
    use Symfony\UX\LiveComponent\DefaultActionTrait;

    #[AsLiveComponent('search_products')]
    class SearchProducts
    {
        use DefaultActionTrait;

        #[LiveProp(writable: true)]
        public string $query = '';

        public function __construct(private ProductRepository $repo) {}

        public function getProducts(): array
        {
            return $this->repo->search($this->query);
        }
    }
    ```

=== "Twig"

    ```twig title="templates/components/search_products.html.twig"
    <div {{ attributes }}>
        <input
            type="search"
            data-model="query"
            placeholder="Buscar productos..."
        >
        <ul>
            {% for product in this.products %}
                <li>{{ product.name }}</li>
            {% endfor %}
        </ul>
    </div>
    ```

!!! tip "`{{ attributes }}` es obligatorio"
    Ahí se renderizan los atributos `data-*` que Stimulus necesita para la comunicación AJAX. Sin esto, el componente no funciona.

---

## Flujo de interacción

Cuando el usuario escribe en el input:

```
✏️ Usuario escribe "zapat"
    → data-model="query" detecta el cambio
    → Stimulus envía query="zapat" al servidor (AJAX)
    → PHP actualiza $this->query
    → PHP ejecuta getProducts() con el nuevo valor
    → Symfony re-renderiza SOLO el componente
    → El navegador actualiza la lista SIN recargar
```

!!! success "Sin escribir JavaScript"
    Todo el flujo anterior ocurre sin que escribas una línea de JS. Stimulus y Live Component lo manejan solos.

---

## LiveProps — Estado sincronizado

```php title="LiveProp configurable"
use Symfony\UX\LiveComponent\Attribute\LiveProp;

#[AsLiveComponent('ImageCard')]
final class ImageCard
{
    use DefaultActionTrait;

    public Product $producto;

    #[LiveProp(writable: true)]
    public bool $zoomed = false;
}
```

??? tip "¿Cuándo usar writable?"
    | Situación | Solución |
    |---|---|
    | Prop que el frontend NO debe modificar | `#[LiveProp]` |
    | Prop que el frontend PUEDE modificar | `#[LiveProp(writable: true)]` |
    | Solo ciertos campos modificables | `#[LiveProp(writable: ['campo1'])]` |

```twig
<img src="{{ producto.imageUrl }}"
     class="{{ zoomed ? 'zoomed' : '' }}"
     data-action="click->live#update"
     data-model="zoomed">
```

!!! success "Flujo del toggle"
    1. Hacés click en la imagen
    2. Stimulus envía `zoomed = true` al servidor
    3. PHP actualiza `$this->zoomed`
    4. Symfony re-renderiza el componente
    5. Se aplica o quita la clase `.zoomed`

---

## LiveActions — Métodos en el servidor

Son métodos PHP que se ejecutan en el servidor ante una interacción del usuario.

```php title="Acción: dar like"
use Symfony\UX\LiveComponent\Attribute\LiveAction;

#[AsLiveComponent('product_card')]
class ProductCard
{
    use DefaultActionTrait;

    #[LiveProp]
    public Product $product;

    #[LiveAction]
    public function addLike(): void
    {
        $this->product->setLikes($this->product->getLikes() + 1);
    }
}
```

```twig title="Botón que dispara la acción"
<button data-action="live#action" data-live-action-param="addLike">
    👍 {{ product.likes }}
</button>
```

!!! success "Flujo del like"
    1. Hacés click en 👍
    2. Stimulus envía `action=addLike` al servidor
    3. PHP ejecuta `addLike()` → incrementa likes en BD
    4. Symfony re-renderiza el componente
    5. El nuevo contador aparece sin recargar

### Pasar parámetros a una LiveAction

```php
#[LiveAction]
public function addToCart(#[LiveArg] int $productId): void
{
    $this->cartService->add($productId);
}
```

```twig
<button data-action="live#action"
        data-live-action-param="addToCart"
        data-live-product-id-param="{{ product.id }}">
    Añadir al carrito
</button>
```

---

## Loading states

```twig
<button data-action="live#action" data-live-action-param="addLike">
    <span data-loading="action.addLike">Guardando...</span>
    <span data-loading="action.addLike|hide">👍 {{ product.likes }}</span>
</button>
```

!!! info "Cómo funciona"
    Mientras la acción se ejecuta en el servidor:
    - Aparece "Guardando..."
    - Se oculta 👍 {{ product.likes }}
    
    Al terminar:
    - Vuelve el contador actualizado
    - Desaparece "Guardando..."

---

## defer y lazy

```twig
{# Carga cuando el componente es visible en pantalla #}
<twig:HeavyWidget :product="product" defer />

{# Carga solo cuando el usuario interactúa #}
<twig:CommentsList :product="product" lazy />
```

!!! warning "¿Cuál usar?"
    | Atributo | Comportamiento | Ideal para |
    |---|---|---|
    | `defer` | Renderiza al hacerse visible | Widgets pesados bajo el scroll |
    | `lazy` | Renderiza al interactuar | Comentarios, secciones secundarias |

---

## Resumen

| Característica | Descripción |
|---|---|
| Maker | `make:twig-component --live` |
| Atributo PHP | `#[AsLiveComponent]` |
| Trait | `use DefaultActionTrait` |
| `{{ attributes }}` | ✅ Obligatorio |
| Binding | `data-model="campo"` (debounce 150ms) |
| Acciones | `#[LiveAction]` + `data-action="live#action"` |
| Loading | `data-loading="action.nombre"` |
| Defer / Lazy | `defer` (viewport) / `lazy` (interacción) |

---

## ¿Cuándo usar Live Component?

| Situación | Tecnología |
|---|---|
| 🖼️ Cards, listas, headers — sin interacción | Twig Component |
| ⚡ Toggle de clases, animaciones, zoom — solo frontend | Stimulus |
| 🔄 Búsquedas, likes, carritos — necesita backend | **Live Component** |
| 🚀 Dashboards, editores — alta interactividad | UX React/Vue |

!!! tip "Regla práctica"
    **¿Necesitás backend?** → Live Component.  
    **¿Solo frontend?** → Stimulus.  
    **¿Sin interacción?** → Twig Component.

---

## Demo — Buscador de productos paso a paso

### Paso 1: Crear el componente

```bash
php bin/console make:twig-component SearchProducts --live
```

Genera:
- `src/Twig/Components/SearchProducts.php`
- `templates/components/SearchProducts.html.twig`

### Paso 2: Programar la lógica PHP

```php title="src/Twig/Components/SearchProducts.php"
namespace App\Twig\Components;

use App\Repository\ProductRepository;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\Attribute\LiveProp;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent('search_products')]
class SearchProducts
{
    use DefaultActionTrait;

    #[LiveProp(writable: true)]
    public string $query = '';

    public function __construct(
        private ProductRepository $repo
    ) {}

    public function getProducts(): array
    {
        if (empty($this->query)) {
            return $this->repo->findAll();
        }
        return $this->repo->createQueryBuilder('p')
            ->where('p.name LIKE :query')
            ->setParameter('query', '%' . $this->query . '%')
            ->getQuery()
            ->getResult();
    }
}
```

### Paso 3: Crear el template

```twig title="templates/components/SearchProducts.html.twig"
<div {{ attributes }}>
    <input
        type="search"
        data-model="query"
        placeholder="Buscar productos..."
        autofocus
    >

    <ul>
        {% for product in this.products %}
            <li>{{ product.name }} — {{ product.price }}€</li>
        {% else %}
            <li>No se encontraron productos</li>
        {% endfor %}
    </ul>
</div>
```

### Paso 4: Usarlo en una página

```twig title="templates/product/index.html.twig"
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Productos</h1>
    <twig:SearchProducts />
{% endblock %}
```

### Resultado

```
┌─────────────────────────────────────┐
│  Buscar productos... [✏️ escribís] │
├─────────────────────────────────────┤
│  Zapatillas Rojas — 89€            │
│  Reloj Clásico — 145€              │ ← se filtra solo
│  Auriculares Bose — 299€           │
└─────────────────────────────────────┘

  Sin recargar la página. Sin JavaScript manual.
```

---

## Recursos

- [Symfony UX Live Components Docs](https://symfony.com/doc/current/ux-live-component/index.html)
- [Symfony UX Demos](https://ux.symfony.com/demos) — Probá Live Components en vivo
- ["Symfony Live Components & UX 3.0"](https://sharpskill.dev/en/blog/symfony/symfony-live-components-ux-3-reactive-apps-without-javascript) (mayo 2026)
