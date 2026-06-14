# 01.11 Live Components — Interactividad sin JavaScript

---

## ¿Qué son?

Los **Live Components** son la evolución de los Twig Components. Permiten que un componente se **re-renderice por AJAX** sin recargar la página, manteniendo estado en el servidor.

**Analogía:** un Twig Component es una foto. Un Live Component es un video en vivo.

| | Twig Component | Live Component |
|---|---|---|
| Se renderiza | 1 vez en el servidor | Cada vez que cambia su estado |
| Interactividad | No tiene (solo HTML) | Sí (clicks, inputs, eventos) |
| Estado | Solo las props iniciales | Props + estado mutable |
| JS necesario | No | Stimulus (viene incluido) |
| Ideal para | Cards, headers, listas estáticas | Buscadores, carritos, formularios, likes |

---

## Maker — Creación

No existe `make:live-component`. Se usa el mismo maker de Twig Components con el flag `--live`:

```bash
php bin/console make:twig-component ImageCard --live
```

El flag `--live` es la **única opción** del maker para Live Components:

| Flag | Sin flag |
|------|----------|
| Genera `#[AsLiveComponent]` | Genera `#[AsTwigComponent]` |
| Añade `use DefaultActionTrait` | No la añade |
| El template incluye `{{ attributes }}` | Template sin atributos especiales |

No hay preguntas interactivas. El maker genera directo los archivos.

---

## Archivos generados

### PHP: `src/Twig/Components/ImageCard.php`

```php
<?php

namespace App\Twig\Components;

use App\Entity\Product;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent('ImageCard')]
final class ImageCard
{
    use DefaultActionTrait;

    public Product $producto;
}
```

**Diferencias con Twig Component:**

| Twig Component | Live Component |
|---|---|
| `#[AsTwigComponent]` | `#[AsLiveComponent]` |
| Sin trait | `use DefaultActionTrait` |

### Template: `templates/components/ImageCard.html.twig`

```twig
<div {{ attributes }}>
    {% if producto.imageUrl %}
        <img src="{{ producto.imageUrl }}" alt="{{ producto.name }}">
    {% endif %}
    <h2>{{ producto.name }}</h2>
    <p>Precio: {{ producto.price }} €</p>
    {# El botón de abajo solo funciona SI es Live Component #}
    <button data-action="live#action" data-live-action-param="like">
        👍 {{ producto.likes }}
    </button>
</div>
```

**`{{ attributes }}`** es obligatorio en Live Components. Ahí se renderizan los atributos `data-*` que Stimulus necesita para la comunicación AJAX.

---

## LiveProps — Estado sincronizado

Las `#[LiveProp]` son props que **el frontend puede modificar** y que provocan un re-renderizado automático:

```php
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

| Configuración | Qué hace |
|---|---|
| `#[LiveProp]` | Prop de solo lectura (como un Twig Component) |
| `#[LiveProp(writable: true)]` | El frontend puede modificarla → provoca re-render |
| `#[LiveProp(writable: ['zoomed'])]` | Solo ciertos campos son modificables |

En el template:

```twig
<img src="{{ producto.imageUrl }}"
     class="{{ zoomed ? 'zoomed' : '' }}"
     data-action="click->live#update"
     data-model="zoomed">
```

Cuando hacés click:
1. Stimulus envía `zoomed = true` al servidor
2. PHP actualiza la prop
3. Symfony re-renderiza el componente
4. La clase `.zoomed` se aplica (o se quita)

---

## LiveActions — Métodos que se ejecutan en el servidor

```php
use Symfony\UX\LiveComponent\Attribute\LiveAction;
use Symfony\UX\LiveComponent\Attribute\LiveArg;

#[AsLiveComponent('ImageCard')]
final class ImageCard
{
    use DefaultActionTrait;

    public Product $producto;

    #[LiveAction]
    public function addLike(): void
    {
        $this->producto->setLikes($this->producto->getLikes() + 1);
    }
}
```

En el template:

```twig
<button data-action="live#action" data-live-action-param="addLike">
    👍 {{ producto.likes }}
</button>
```

**Flujo completo del like:**
1. Usuario hace click en el botón
2. Stimulus envía `action=addLike` al servidor
3. PHP ejecuta `addLike()` → incrementa likes en BD
4. Symfony re-renderiza el componente
5. El nuevo contador de likes se muestra sin recargar la página

---

## Comparativa: Twig Component vs Live Component

| Característica | Twig Component | Live Component |
|---|---|---|
| Maker | `make:twig-component` | `make:twig-component --live` |
| Atributo | `#[AsTwigComponent]` | `#[AsLiveComponent]` |
| Trait | — | `use DefaultActionTrait` |
| `{{ attributes }}` | Opcional | Obligatorio |
| Props writables | No | Sí (`#[LiveProp(writable: true)]`) |
| Acciones servidor | No | Sí (`#[LiveAction]`) |
| Re-render | No | Sí (automático al cambiar estado) |
| Ideal para | Cards, listas, headers | Búsqueda, carrito, formularios, likes |

## ¿Cuándo usar Live Component?

| Situación | Usá |
|-----------|-----|
| Mostrar datos sin interacción | Twig Component |
| Toggle de clase CSS, animaciones, zoom | Stimulus |
| Click que guarda en BD, incrementa likes | Live Component |
| Input que filtra resultados en servidor | Live Component |
| Formulario con validación | Live Component |
| Dashboard complejo con muchos datos | UX React/Vue |

**Regla práctica:** si necesitás backend → Live Component. Si es solo frontend → Stimulus. Si no hay interacción → Twig Component.
