# Symfony — Web Components

> **Fecha inicio:** 13/06/2026
> **Nivel:** Desde cero
> **Contexto:** Me lo pidió mi jefe y no sé ni qué son

---

## Antes que nada: ¿QUÉ es un "componente web"?

Olvidate de Symfony un segundo.

En desarrollo web, un **componente** es un **bloque de UI reutilizable**. Como piezas de LEGO:

```
┌──────────────────────┐
│     Tarjeta Producto  │  ← Este es un componente
│  ┌────┐               │
│  │ img │  Zapatillas   │
│  └────┘   89€         │
│        [Añadir]       │
└──────────────────────┘
```

Esa tarjeta la podés reusar en 5 páginas distintas sin copiar y pegar el HTML cada vez.

### El problema que resuelven

**Sin componentes**, hacés esto:

```twig
{# página1.html.twig #}
<div class="card">
    <h2>{{ producto1.nombre }}</h2>
    <p>{{ producto1.precio }}</p>
</div>

{# página2.html.twig #}
<div class="card">  ← mismo HTML copiado a mano
    <h2>{{ producto2.nombre }}</h2>
    <p>{{ producto2.precio }}</p>
</div>
```

Si querés cambiar algo, tenés que ir **página por página** modificando.

**Con componentes**, hacés esto:

```twig
<twig:ProductCard :product="producto1" />
<twig:ProductCard :product="producto2" />
```

Y si querés cambiar algo, lo cambiás **en 1 solo lugar**.

---

## ¿Y qué son los "Web Components de Symfony"?

Atención: **no te confundas con los Web Components del navegador** (Custom Elements, Shadow DOM, etc.). Eso es otra cosa. Los Web Components de Symfony son **la forma de hacer componentes reutilizables desde PHP/Twig**.

Básicamente:

| Concepto | Traducción |
|----------|-----------|
| `<twig:ProductCard>` | "Symfony, renderizá el componente ProductCard acá" |
| La clase PHP | "Symfony, esta es la lógica del componente" |
| El template Twig | "Symfony, este es el HTML del componente" |

No necesitás JavaScript. No necesitás React. **Todo se renderiza desde PHP.**

---

## Cómo funciona en la práctica (paso a paso)

### #1 Creás una clase PHP

```php
// src/Twig/Components/ProductCard.php

namespace App\Twig\Components;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent('product_card')]   // ← esto registra el componente
class ProductCard
{
    // Las propiedades que RECIBE el componente desde afuera
    public string $nombre = '';
    public float $precio = 0;
}
```

### #2 Creás el template HTML

```twig
{# templates/components/product_card.html.twig #}
<article class="card">
    <h2>{{ nombre }}</h2>
    <p class="price">{{ precio }} €</p>
</article>
```

### #3 Lo usás en cualquier página

```twig
<twig:ProductCard nombre="Zapatillas" :precio="89.50" />
<twig:ProductCard nombre="Reloj" :precio="145.00" />
```

Y **esto**:

```html
<article class="card">
    <h2>Zapatillas</h2>
    <p class="price">89.50 €</p>
</article>
<article class="card">
    <h2>Reloj</h2>
    <p class="price">145.00 €</p>
</article>
```

---

## Los 3 conceptos clave para entenderlos

### 1. Props (propiedades)

Son **datos que le pasás al componente** desde afuera:

```twig
<twig:ProductCard
    nombre="Zapatillas"         ← string literal
    :precio="producto.precio"    ← variable (el : hace que sea dinámico)
    :descuento="10 + 5"          ← expresión matemática
/>
```

Y la clase los recibe como propiedades:

```php
class ProductCard
{
    public string $nombre = '';
    public float $precio = 0;
    public int $descuento = 0;
}
```

### 2. Slots (espacios para contenido)

**Contenido HTML que ponés DENTRO del componente:**

```twig
<twig:ProductCard nombre="Zapatillas" :precio="89">
    <p class="extra">Envío gratis</p>   ← ESTO es un slot
</twig:ProductCard>
```

En el template del componente:

```twig
<article class="card">
    <h2>{{ nombre }}</h2>
    <p>{{ precio }} €</p>
    {{ slots.default|raw }}   ← acá se renderiza "Envío gratis"
</article>
```

### 3. Live Components

Ahora viene lo más interesante.

Un **Twig Component** normal se renderiza **una vez** y listo. Pero un **Live Component** puede **re-renderizarse sin recargar la página**.

Ejemplo: un buscador que filtra mientras escribís.

```php
#[AsLiveComponent('search_products')]
class SearchProducts
{
    use DefaultActionTrait;

    #[LiveProp(writable: true)]   // ← se puede escribir desde el frontend
    public string $query = '';

    public function getProducts(): array
    {
        // Acá iría la lógica de búsqueda
        // Mientras escribís, esto se ejecuta de nuevo
    }
}
```

```twig
<div>
    <input data-model="query" placeholder="Buscar...">
    {# data-model sincroniza el input con PHP automáticamente #}

    <ul>
        {% for product in this.products %}
            <li>{{ product.name }}</li>
        {% endfor %}
    </ul>
</div>
```

**¿Qué pasa acá?**
1. El usuario escribe en el input
2. Symfony recibe el nuevo valor por AJAX
3. PHP ejecuta `getProducts()` de nuevo
4. Symfony re-renderiza el HTML
5. El navegador actualiza SOLO esa parte de la página

**Sin Vue. Sin React. Sin recargar la página.**

---

## ¿Cuándo usar cada uno?

| Usá Twig Component si... | Usá Live Component si... |
|--------------------------|-------------------------|
| Solo mostrás datos | El usuario interactúa |
| Es una card, un botón, una lista | Es un buscador, un carrito, un formulario |
| No cambia después de cargar | Necesita actualizarse sin recargar |
| Ej: footer, header, sidebar | Ej: carrito de compras, filtros, búsqueda |

---

## Resumen en 5 líneas

1. Los Web Components de Symfony son **bloques de UI reutilizables** que se renderizan desde PHP
2. **Twig Components →** componentes estáticos (se renderizan 1 vez)
3. **Live Components →** componentes con vida que se actualizan por AJAX
4. Se usan con `<twig:NombreDelComponente>` en Twig
5. Todo el HTML se genera desde el servidor — no necesitás React/Vue

---

## Para mañana: tu tarea

No codees nada todavía. **Solo leé esto** y después contestame:

1. ¿Entendés el concepto de "componente" como pieza de LEGO?
2. ¿Tenés algún ejemplo en tu proyecto de la startup donde digas "esto podría ser un componente"?
3. ¿Cómo se llama el CMS Symfony que usás en el trabajo? (¿EasyAdmin? ¿Sonata? ¿Uno propio?)

Con eso, mañana vemos cómo crear tu primer componente real.
