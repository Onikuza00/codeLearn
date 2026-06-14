# Arquitectura de Componentes { .section-architecture }

---

## ¿Qué es la arquitectura de componentes?

Symfony UX no reinventa la rueda. Toma los mismos principios que existen en React, Vue o Svelte y los adapta al mundo server-side de Symfony.

!!! tip "Referencia oficial"
    El [cookbook de Component Architecture](https://ux.symfony.com/cookbook/component-architecture) de Symfony UX contiene estos mismos principios.

---

## Las 4 reglas

### 1. Composición

Una página es una **colección de componentes reutilizables**. El objetivo es hacerlos atómicos: un `Alert` puede contener un `Icon` y un `Button`.

```php title="src/Twig/Components/Alert.php"
namespace App\Twig\Components;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent('alert')]
class Alert
{
    public string $type = 'info';
    public string $message = '';
}
```

```twig title="Composición: Alert contiene otros componentes"
<twig:Alert type="success" message="Cuenta creada correctamente.">
    <twig:ux:icon name="check" />
    <twig:Button variant="primary">Aceptar</twig:Button>
</twig:Alert>
```

!!! tip "Componentes atómicos"
    Cada componente hace **una sola cosa** y la hace bien. Alert muestra un mensaje. Button renderiza un botón. Después los combinás.

### 2. Independencia

Un componente **no debe saber nada del resto de la página**. Deberías poder sacarlo de una página, llevarlo a otra, y que siga funcionando igual.

```php
// ✅ Bien: recibe todo por props
class ProductCard
{
    public Product $producto;
}

// ❌ Mal: depende de algo externo
class ProductCard
{
    public function getProducto()
    {
        // Asume que existe $GLOBALS['producto'] o algo similar
    }
}
```

!!! warning "Regla de oro"
    Si tu componente solo funciona en una página específica, **no es un componente**: es un fragmento de template acoplado.

### 3. Props unidireccionales

Los datos **bajan del padre al hijo**, nunca al revés. Es el mismo flujo que React o Vue.

```
Padre → pasa prop → Hijo
                      │
                      ▼ (nunca hacia arriba)
```

```twig
<twig:ProductCard :producto="producto" />
               │
               ▼
         ProductCard.php
         public Product $producto;
```

Si el hijo necesita avisarle algo al padre, se usan **eventos** (no props reversas).

### 4. Estado vs Props

| | Props | Estado |
|---|---|---|
| Quién las define | El padre | El componente mismo |
| Pueden cambiar | Sí, si el padre cambia | Sí, internamente |
| Quién las modifica | Solo el padre | El componente |
| Ejemplo | `producto`, `precio` | `isOpen`, `likes` |

```php
class ProductCard
{
    // PROPS: las define el padre
    public Product $producto;
    public string $variant = 'default';

    // ESTADO (Live Component): cambia internamente
    #[LiveProp(writable: true)]
    public bool $zoomed = false;
}
```

---

## Props — Comunicación padre → hijo

### Sintaxis

```twig
<twig:ProductCard
    nombre="Zapatillas"          {# string literal #}
    :precio="producto.precio"    {# variable (el : hace que sea dinámica) #}
    :descuento="10 + 5"          {# expresión #}
/>
```

| Sintaxis | Interpretación |
|---|---|
| `nombre="Zapatillas"` | String literal "Zapatillas" |
| `:precio="89"` | Número 89 (no string) |
| `:nombre="producto.nombre"` | Variable de Twig |
| `:precio="precioBase + iva"` | Expresión matemática |

!!! tip "El `:` convierte el valor en expresión Twig"
    Sin `:` → siempre string. Con `:` → cualquier expresión de Twig (variables, operaciones, null, etc.).

### En la clase PHP

```php
#[AsTwigComponent('product_card')]
class ProductCard
{
    public string $nombre = '';
    public float $precio = 0.0;
    public ?string $imagen = null;  // opcional
}
```

Las props son **propiedades públicas** de la clase. Symfony las autocompleta con el valor que le pases desde Twig.

| Tipo | Requerida | Default |
|---|---|---|
| `string $nombre` | Sí (no tiene default) | — |
| `float $precio = 0.0` | No | `0.0` |
| `?string $imagen = null` | No | `null` |

---

## Slots — HTML interno

Los slots permiten pasar **contenido HTML** al componente:

```twig
<twig:ProductCard nombre="Zapatillas" precio="89">
    <p class="badge">Envío gratis</p>
</twig:ProductCard>
```

```twig title="templates/components/product_card.html.twig"
<article class="card">
    <h2>{{ nombre }}</h2>
    <p>{{ precio }} €</p>
    {{ slots.default|raw }}  {# ← se renderiza "Envío gratis" #}
</article>
```

!!! tip "Slots con nombre"
    Si necesitás múltiples slots:
    ```twig
    <twig:Card>
        <:header>Título</:header>
        <:footer>Pie</:footer>
    </twig:Card>
    ```
    ```twig
    {{ slots.header|raw }}
    {{ slots.footer|raw }}
    ```

---

## Eventos — Comunicación hijo → padre

### Live Actions como "emit"

En Vue harías `$emit('comprar', id)`. En Live Component enviás una acción al servidor:

```php
$this->emit('productoComprado', ['id' => $this->product->getId()]);
```

### Eventos entre componentes con `emit()` y `#[LiveListener]`

=== "Componente que emite"

    ```php title="src/Twig/Components/AddToCartButton.php"
    namespace App\Twig\Components;

    use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
    use Symfony\UX\LiveComponent\Attribute\LiveAction;
    use Symfony\UX\LiveComponent\Attribute\LiveProp;
    use Symfony\UX\LiveComponent\DefaultActionTrait;

    #[AsLiveComponent('add_to_cart_button')]
    class AddToCartButton
    {
        use DefaultActionTrait;

        #[LiveProp]
        public Product $product;

        #[LiveAction]
        public function add(): void
        {
            // Guardar en BD + emitir evento
            $this->emit('productAdded', [
                'productId' => $this->product->getId(),
            ]);
        }
    }
    ```

=== "Componente que escucha"

    ```php title="src/Twig/Components/CartBadge.php"
    namespace App\Twig\Components;

    use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
    use Symfony\UX\LiveComponent\Attribute\LiveListener;
    use Symfony\UX\LiveComponent\Attribute\LiveProp;
    use Symfony\UX\LiveComponent\DefaultActionTrait;

    #[AsLiveComponent('cart_badge')]
    class CartBadge
    {
        use DefaultActionTrait;

        #[LiveProp(writable: true)]
        public int $count = 0;

        #[LiveListener('productAdded')]
        public function onProductAdded(#[LiveArg] int $productId): void
        {
            $this->count++;
        }
    }
    ```

=== "Template"

    ```twig title="templates/components/cart_badge.html.twig"
    <div {{ attributes }}>
        <span>{{ count }}</span>
    </div>
    ```

!!! success "Flujo completo"
    1. Usuario hace click en "Añadir al carrito"
    2. `add()` ejecuta en el servidor, guarda en BD y emite `productAdded`
    3. `CartBadge` escucha el evento y actualiza `count`
    4. Ambos componentes se re-renderizan sin recargar

---

## Estado compartido (provide/inject)

Symfony UX **no tiene provide/inject nativo** como Vue. Estas son las alternativas:

| Estrategia | Cuándo usarla |
|---|---|
| **Props drilling** | Árbol poco profundo (2-3 niveles) |
| **Eventos** `emit()` + `#[LiveListener]` | Componentes hermanos o primo-hermano |
| **Stimulus controllers** | Estado compartido vía `data-*` |
| **Servicios de Symfony** | Estado que muchos componentes necesitan |

!!! warning "¿Mucho estado compartido?"
    Si necesitás compartir mucho estado entre muchos componentes, probablemente tengas un **componente Live más grande** en lugar de muchos pequeños acoplados. No fuerces la separación si no hay una razón clara.

---

## Resumen

| Concepto | Descripción |
|---|---|
| **Composición** | Componentes atómicos que se combinan |
| **Independencia** | Cada componente funciona en cualquier contexto |
| **Props** | Datos del padre al hijo (`:variable` o `"literal"`) |
| **Slots** | HTML interno (`{{ slots.default|raw }}`) |
| **Eventos** | `emit()` + `#[LiveListener]` para comunicación |
| **Estado** | Props (externo) vs Estado (interno) |
