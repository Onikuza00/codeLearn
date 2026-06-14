# Symfony Web Components — Bloque 01

> **Estado:** En curso
> **Fecha inicio:** 14/06/2026

---

## 1. Arquitectura de Componentes en Symfony

Symfony UX no reinventa la rueda. Toma los mismos principios que ya existen en React, Vue o Svelte y los adapta al mundo server-side de Symfony. El [cookbook oficial de Component Architecture](https://ux.symfony.com/cookbook/component-architecture) resume todo en cuatro reglas:

### 4 reglas de la arquitectura de componentes

1. **Composición**: una página es una colección de componentes reutilizables. El objetivo es hacerlos atómicos: un `Alert` puede contener un `Icon` y un `Button`.
2. **Independencia**: un componente no debe saber nada del resto de la página. Deberías poder sacarlo de una página, llevarlo a otra, y que siga funcionando igual.
3. **Props unidireccionales**: los datos bajan del padre al hijo. Si el hijo necesita avisarle algo al padre, usa eventos.
4. **Estado vs Props**: las props son iniciales; el estado puede cambiar durante la vida del componente.

```php
// src/Twig/Components/Alert.php
namespace App\Twig\Components;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent('alert')]
class Alert
{
    public string $type = 'info';
    public string $message = '';
}
```

```twig
{# Composición: Alert contiene otros componentes #}
<twig:Alert type="success" message="Cuenta creada correctamente.">
    <twig:ux:icon name="check" />
    <twig:Button variant="primary">Aceptar</twig:Button>
</twig:Alert>
```

> **Regla de oro:** si tu componente solo funciona en una página específica, no es un componente: es un fragmento de template acoplado.

---

## 2. Twig Components (estáticos)

Son los componentes base. Se renderizan **una vez** en el servidor y el navegador recibe HTML plano. No tienen estado frontend ni JavaScript propio.

```php
// src/Twig/Components/ProductCard.php
namespace App\Twig\Components;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent('product_card')]
class ProductCard
{
    public string $nombre = '';
    public float $precio = 0.0;
}
```

```twig
{# templates/components/product_card.html.twig #}
<article class="card">
    <h2>{{ nombre }}</h2>
    <p class="price">{{ precio }} €</p>
</article>
```

```twig
{# Uso en cualquier template, sin importar nada #}
<twig:ProductCard nombre="Zapatillas" precio="89" />

{# Con variables: el : delante hace que sea dinámico #}
<twig:ProductCard :nombre="producto.nombre" :precio="producto.precio" />
```

**Características clave:**
- `#[AsTwigComponent('nombre')]` los registra automáticamente.
- Las props son propiedades públicas de la clase PHP.
- El template vive en `templates/components/` por convención.
- No necesitás importarlos en cada página: una vez registrados, están disponibles como `<twig:Nombre />`.
- Ideales para: cards, headers, footers, listas, alerts, badges.

> **Comparación con Vue:** es como un componente Vue que no tiene reactividad: recibe props, renderiza HTML, y listo.

---

## 3. Live Components (interactivos)

Extienden Twig Components. Se re-renderizan vía AJAX cuando cambia su estado. Permiten interactividad sin escribir casi JavaScript.

```php
// src/Twig/Components/SearchProducts.php
namespace App\Twig\Components;

use App\Repository\ProductRepository;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\Attribute\LiveProp;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent('search_products')]
class SearchProducts
{
    use DefaultActionTrait;

    #[LiveProp(writable: true)]  // ← el frontend puede escribir este valor
    public string $query = '';

    public function __construct(private ProductRepository $repo) {}

    public function getProducts(): array
    {
        return $this->repo->search($this->query);
    }
}
```

```twig
{# templates/components/search_products.html.twig #}
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

**Qué pasa cuando el usuario escribe:**
1. `data-model="query"` detecta el cambio en el input.
2. Live Component envía una petición AJAX a Symfony.
3. PHP ejecuta `getProducts()` con la nueva `$query`.
4. Symfony re-renderiza **solo** el HTML del componente.
5. El navegador actualiza la lista sin recargar la página.

### Live Actions

Son métodos PHP que se ejecutan en el servidor ante una interacción del usuario:

```php
#[AsLiveComponent('add_to_cart')]
class AddToCart
{
    use DefaultActionTrait;

    #[LiveProp]
    public Product $product;

    public function __construct(private CartService $cart) {}

    #[LiveAction]
    public function add(): void
    {
        $this->cart->add($this->product);
    }
}
```

```twig
<button data-action="live#action" data-live-action-param="add">
    Añadir al carrito
</button>
```

### Loading states

```twig
<button data-action="live#action" data-live-action-param="add">
    <span data-loading="action.addToCart">Añadiendo...</span>
    <span data-loading="action.addToCart|hide">Añadir al carrito</span>
</button>
```

### `defer` y `lazy`

```twig
{# defer: no se renderiza hasta que el componente está visible en el viewport #}
<twig:HeavyWidget :product="product" defer />

{# lazy: carga solo cuando se dispara una acción o cambio de estado #}
<twig:CommentsList :product="product" lazy />
```

**Características clave:**
- `#[AsLiveComponent]` + `DefaultActionTrait`.
- `#[LiveProp(writable: true)]` para estado sincronizado con el frontend.
- `data-model` para binding bidireccional.
- Debounce automático de 150ms en inputs.
- Live Actions para eventos servidor.
- Loading states con `data-loading`.
- Ideales para: búsquedas, carritos, formularios con validación, paginación, likes, filtros.

---

## 4. Props y Eventos (comunicación)

### Props unidireccionales

Igual que en Vue o React: del padre al hijo, nunca al revés.

```twig
<twig:ProductCard
    nombre="Zapatillas"         {# string literal #}
    :precio="producto.precio"  {# variable: el : hace que sea dinámico #}
/>
```

```php
#[AsTwigComponent('product_card')]
class ProductCard
{
    public string $nombre = '';
    public float $precio = 0.0;
}
```

### Slots

Para pasar HTML interno al componente.

```twig
<twig:ProductCard nombre="Zapatillas" precio="89">
    <p class="badge">Envío gratis</p>
</twig:ProductCard>
```

```twig
{# templates/components/product_card.html.twig #}
<article class="card">
    <h2>{{ nombre }}</h2>
    <p>{{ precio }} €</p>
    {{ slots.default|raw }}
</article>
```

### Live Actions como "emit"

En Vue harías `$emit('comprar', id)`. En Live Component enviás una acción al servidor:

```php
$this->emit('productoComprado', ['id' => $this->product->getId()]);
```

### Eventos entre componentes con `emit()` y `#[LiveListener]`

```php
// Componente hijo que emite
#[AsLiveComponent('add_to_cart_button')]
class AddToCartButton
{
    use DefaultActionTrait;

    #[LiveProp]
    public Product $product;

    #[LiveAction]
    public function add(): void
    {
        $this->emit('productAdded', [
            'productId' => $this->product->getId(),
        ]);
    }
}
```

```php
// Componente que escucha
#[AsLiveComponent('cart_badge')]
class CartBadge
{
    use DefaultActionTrait;

    #[LiveProp]
    public int $count = 0;

    #[LiveListener('productAdded')]
    public function onProductAdded(#[LiveArg] int $productId): void
    {
        $this->count++;
    }
}
```

```twig
{# templates/components/cart_badge.html.twig #}
<div {{ attributes }}>
    <span>{{ count }}</span>
</div>
```

### provide/inject para estado compartido

Symfony UX **no tiene provide/inject nativo** como Vue. Si necesitás compartir estado entre componentes, usá:

- **Props drilling**: pasar props por varios niveles (funciona bien para árboles poco profundos).
- **Eventos entre Live Components**: `emit()` + `#[LiveListener]`.
- **Stimulus controllers**: compartir estado vía `this.application` o atributos `data-*`.
- **Servicios de Symfony**: inyectar el mismo servicio en varios componentes.

> **Regla:** si necesitás compartir mucho estado entre muchos componentes, probablemente tengas un componente Live más grande en lugar de muchos pequeños acoplados.

---

## 5. Stimulus (el pegamento JS)

Stimulus es un framework JS minimalista que Symfony UX usa internamente. No es un framework de componentes como React o Vue: es un "framework para tu HTML". Conecta controladores JS a elementos que ya existen en el DOM.

```php
// src/Controller/ProductController.php
namespace App\Controller;

use App\Entity\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProductController extends AbstractController
{
    #[Route('/product/{id}', name: 'product_show')]
    public function show(Product $product): Response
    {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }
}
```

```twig
{# templates/product/show.html.twig #}
<div data-controller="gallery" data-gallery-images-value="{{ product.images|json_encode }}">
    <img data-gallery-target="main" src="{{ product.images[0] }}" alt="{{ product.name }}" />

    {% for image in product.images %}
        <button
            type="button"
            data-action="click->gallery#change"
            data-gallery-image-param="{{ image }}"
        >
            <img src="{{ image }}" alt="" />
        </button>
    {% endfor %}
</div>
```

```js
// assets/controllers/gallery_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['main'];
    static values = { images: Array };

    change(event) {
        const image = event.params.image;
        this.mainTarget.src = image;
    }
}
```

**Conceptos clave:**
- **Controller**: clase JS que se conecta a un elemento HTML mediante `data-controller`.
- **Targets**: elementos del DOM a los que accedés (`this.mainTarget`).
- **Values**: parámetros que vienen del HTML (`data-gallery-images-value`).
- **Actions**: métodos que se ejecutan ante eventos (`click->gallery#change`).

### ¿Cuándo usar Stimulus vs Live Component?

| Situación | Usar |
|-----------|------|
| Abrir/cerrar menús, tooltips, modales | Stimulus |
| Toggle de clases, animaciones, cambio de imagen | Stimulus |
| Drag & drop simple, carruseles | Stimulus |
| Guardar en base de datos, validar, buscar | Live Component |
| Carrito, formularios, paginación, filtros backend | Live Component |

> **Regla práctica:** si la lógica es 100% frontend → Stimulus. Si necesitás backend → Live Component.

---

## 6. UX React y UX Vue (para alta interactividad)

Symfony UX permite embeber componentes React o Vue **dentro** de templates Twig. Se usan cuando Live Components no alcanza.

```php
// src/Controller/DashboardController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        return $this->render('dashboard/index.html.twig', [
            'metrics' => $this->getMetrics(),
            'user' => $this->getUser(),
        ]);
    }
}
```

```twig
{# templates/dashboard/index.html.twig #}
{{ react_component('Dashboard', {
    metrics: metrics,
    user: user
}) }}
```

```jsx
// assets/react/components/Dashboard.jsx
import { useState } from 'react';

export default function Dashboard({ metrics, user }) {
    const [range, setRange] = useState('7d');

    return (
        <div>
            <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
            </select>
            <Chart data={metrics[range]} user={user} />
        </div>
    );
}
```

**Casos de uso:**
- Dashboards complejos con mucho estado local.
- Drag & drop avanzado.
- Editores rich text.
- Visualizaciones de datos interactivas.
- Widgets que ya tenés en React/Vue y no querés reescribir.

> **Regla 80/20:** el 80% de la interactividad se resuelve con Live Components. El 20% más complejo va en UX React/Vue.

---

## 7. UX Toolkit

Es una colección de componentes UI prediseñados inspirados en shadcn/ui y Flowbite. Botones, diálogos, tabs, acordeones, etc. No son una caja negra: se copian al proyecto y los personalizás.

```bash
composer require symfony/ux-toolkit
```

```php
// Siguen siendo clases PHP + templates Twig
// src/Twig/Components/Button.php
namespace App\Twig\Components;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent('button')]
class Button
{
    public string $variant = 'primary';
    public string $size = 'md';
}
```

```twig
{# templates/components/button.html.twig #}
<button class="btn btn--{{ variant }} btn--{{ size }}">
    {{ slot()|raw }}
</button>
```

```twig
{# Uso #}
<twig:Button variant="primary" size="lg">
    Guardar cambios
</twig:Button>

<twig:Dialog>
    <twig:DialogTrigger>Abrir modal</twig:DialogTrigger>
    <twig:DialogContent>
        <twig:DialogTitle>Confirmar</twig:DialogTitle>
        <p>¿Estás seguro?</p>
    </twig:DialogContent>
</twig:Dialog>
```

**Filosofía:**
- Copiar y personalizar.
- No dependés de una librería externa que cambie de API.
- Funcionan con Twig Components + Stimulus.

---

## 8. Web Components del navegador (Custom Elements)

**NO** confundir con los "Web Components de Symfony" (que son server-side). Estos son la especificación nativa del navegador: Custom Elements, Shadow DOM y HTML Templates.

```php
// src/Controller/DemoController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DemoController extends AbstractController
{
    #[Route('/demo/web-component', name: 'demo_web_component')]
    public function index(): Response
    {
        return $this->render('demo/web_component.html.twig');
    }
}
```

```twig
{# templates/demo/web_component.html.twig #}
<hello-world name="Pau"></hello-world>

<script type="module">
    class HelloWorld extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            const name = this.getAttribute('name') || 'mundo';
            this.shadowRoot.innerHTML = `
                <style>
                    p { color: rebeccapurple; font-weight: bold; }
                </style>
                <p>Hola, ${name} — desde el Shadow DOM</p>
            `;
        }
    }

    customElements.define('hello-world', HelloWorld);
</script>
```

**¿Por qué Symfony no los usa por defecto?**
- Symfony UX apunta a renderizar en servidor y hidratar con Stimulus.
- Los Custom Elements añaden complejidad (Shadow DOM, ciclo de vida, encapsulamiento).
- No son necesarios para la mayoría de los casos.

> **Están disponibles si querés usarlos, pero no es el camino recomendado en Symfony UX.**

---

## 9. Árbol de decisión: ¿qué usar?

| Pregunta | Respuesta |
|----------|-----------|
| ¿Solo mostrás datos? | Twig Component |
| ¿El usuario interactúa pero no necesitás backend? | Stimulus |
| ¿El usuario interactúa y necesitás backend? | Live Component |
| ¿Necesitás un widget complejo (editor, dashboard)? | UX React/Vue |
| ¿Necesitás componentes UI prediseñados? | UX Toolkit |

### Ejemplo práctico: página de producto

```php
// src/Controller/ProductController.php
#[Route('/product/{id}', name: 'product_show')]
public function show(Product $product): Response
{
    return $this->render('product/show.html.twig', [
        'product' => $product,
    ]);
}
```

```twig
{# templates/product/show.html.twig #}

{# Header estático: Twig Component #}
<twig:Header />

{# Galería: Stimulus (zoom, cambio de imagen) #}
<div data-controller="gallery" data-gallery-images-value="{{ product.images|json_encode }}">
    <img data-gallery-target="main" src="{{ product.images[0] }}" alt="{{ product.name }}" />
    {% for image in product.images %}
        <button data-action="click->gallery#change" data-gallery-image-param="{{ image }}">
            <img src="{{ image }}" alt="" />
        </button>
    {% endfor %}
</div>

{# Card de producto: Twig Component con slot #}
<twig:ProductCard :product="product">
    {# AddToCart es un Live Component: guarda en BD #}
    <twig:AddToCart :product="product" />
</twig:ProductCard>
```

```twig
{# templates/components/add_to_cart.html.twig #}
<button
    {{ attributes }}
    data-action="live#action"
    data-live-action-param="add"
>
    <span data-loading="action.add">Añadiendo...</span>
    <span data-loading="action.add|hide">Añadir al carrito</span>
</button>
```

---

## 10. Recursos

### Oficiales (actualizados)
- ⭐ [Symfony UX — Component Architecture](https://ux.symfony.com/cookbook/component-architecture) — **Guía oficial: cuándo usar Twig, Live, Stimulus o React**
- [Symfony UX Live Components Docs](https://symfony.com/doc/current/ux-live-component/index.html)
- [Symfony UX Twig Components Docs](https://symfony.com/doc/current/ux-twig-component/index.html)
- [Symfony UX Demos](https://ux.symfony.com/demos) — Probá Live Components en vivo

### Artículos 2026
- ["Symfony at 20: what the quiet framework got right"](https://jorijn.com/en/blog/symfony-at-20-what-the-quiet-framework-got-right/) (abril 2026)
- ["PHP & Symfony in 2026: the stack worth a CTO's attention"](https://mustiere.fr/en/blog/php-symfony-2026-cto-perspective/) (mayo 2026)
- ["Symfony Live Components & UX 3.0"](https://sharpskill.dev/en/blog/symfony/symfony-live-components-ux-3-reactive-apps-without-javascript) (mayo 2026)
