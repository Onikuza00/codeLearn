# Twig Components { .section-twig }

---

## ¿Qué son?

Son los componentes base de Symfony UX. Se renderizan **una vez** en el servidor y el navegador recibe HTML plano. No tienen estado frontend ni JavaScript propio.

| Concepto | Traducción |
|---|---|
| `<twig:ProductCard>` | "Symfony, renderizá el componente ProductCard acá" |
| La clase PHP | "Symfony, esta es la lógica del componente" |
| El template Twig | "Symfony, este es el HTML del componente" |

!!! tip "Analogía con Vue" { .twig }
    Es como un componente Vue que **no tiene reactividad**: recibe props, renderiza HTML, y listo. No hay estado, no hay eventos, no hay ciclos de vida del lado del cliente.

---

## Maker — Creación

```bash
php bin/console make:twig-component ProductCard
```

Solo te pide **una cosa**:

| Pregunta | Respuesta | Por qué |
|---|---|---|
| Component name | `ProductCard` | Nombre que usarás en `<twig:ProductCard>` |

!!! info "No hay más opciones"
    El maker solo pregunta el nombre. No hay flags ni opciones interactivas adicionales. Genera los dos archivos directamente.

---

## Código generado

=== "PHP"

    ```php title="src/Twig/Components/ProductCard.php"
    namespace App\Twig\Components;

    use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

    #[AsTwigComponent('product_card')]
    class ProductCard
    {
        public string $nombre = '';
        public float $precio = 0.0;
    }
    ```

=== "Twig"

    ```twig title="templates/components/product_card.html.twig"
    <article class="card">
        <h2>{{ nombre }}</h2>
        <p class="price">{{ precio }} €</p>
    </article>
    ```

!!! warning "El nombre del template debe coincidir"
    Symfony busca el template en `templates/components/` con el mismo nombre del componente: `ProductCard` → `ProductCard.html.twig`.

---

## Cómo se usa

```twig
{# En cualquier template, sin importar nada #}
<twig:ProductCard nombre="Zapatillas" precio="89" />

{# Con variables: el : delante hace que sea dinámico #}
<twig:ProductCard :nombre="producto.nombre" :precio="producto.precio" />
```

| Sintaxis | Resultado |
|---|---|
| `nombre="Zapatillas"` | Pasa el **string** "Zapatillas" |
| `:nombre="producto.nombre"` | Pasa el **valor** de `producto.nombre` |
| `:precio="89 + 10"` | Pasa el **resultado** de la expresión |

!!! tip "El `:` hace que sea una expresión Twig"
    Sin `:` → string literal. Con `:` → variable o expresión. Es la misma sintaxis que Vue.

---

## Props

Las props son propiedades **públicas** de la clase PHP. El componente las recibe desde afuera y las usa en el template.

```php
#[AsTwigComponent('product_card')]
class ProductCard
{
    public string $nombre = '';    // string, default vacío
    public float $precio = 0.0;    // float, default 0
    public ?string $imagen = null; // nullable, opcional
}
```

| Tipo de prop | Cómo se pasa | Default |
|---|---|---|
| Requerida | `<twig:ProductCard nombre="Zapatillas">` | No tiene |
| Opcional | Se omite | El valor en PHP |
| Nullable | Se omite o pasa `null` | `null` |

??? tip "Tipado estricto"
    Podés tipar las props con `string`, `int`, `float`, `bool`, `array`, o incluso clases de Doctrine como `Product`. Symfony valida el tipo automáticamente.

---

## Slots

Los slots permiten pasar **HTML interno** al componente:

```twig
<twig:ProductCard nombre="Zapatillas" precio="89">
    <p class="badge">Envío gratis</p>
</twig:ProductCard>
```

```twig title="templates/components/product_card.html.twig"
<article class="card">
    <h2>{{ nombre }}</h2>
    <p>{{ precio }} €</p>
    {{ slots.default|raw }}  {# ← acá se renderiza "Envío gratis" #}
</article>
```

!!! tip "Slots con nombre"
    Si necesitás múltiples slots usá nombres: `<twig:ProductCard><:footer>...</:footer></twig:ProductCard>` → `{{ slots.footer|raw }}`.

---

## Comparativa: Twig vs Live Component

| Característica | Twig Component | Live Component |
|---|---|---|
| Maker | `make:twig-component` | `make:twig-component --live` |
| Atributo | `#[AsTwigComponent]` | `#[AsLiveComponent]` |
| Trait | — | `use DefaultActionTrait` |
| `{{ attributes }}` | Opcional | **Obligatorio** |
| Props writables | No | Sí (`#[LiveProp(writable: true)]`) |
| Acciones servidor | No | Sí (`#[LiveAction]`) |
| Re-render | No | Sí (automático por AJAX) |

---

## ¿Cuándo usar Twig Component?

| Situación | Tecnología |
|---|---|
| 🖼️ Cards, listas, headers, footers | ✅ **Twig Component** |
| ⚡ Toggle de clases, zoom, animaciones | Stimulus |
| 🔄 Búsquedas, likes, carritos | Live Component |
| 📝 Dashboards, editores complejos | UX React/Vue |

!!! tip "Regla práctica"
    **¿Solo mostrás datos y no cambian?** → Twig Component.  
    **¿El usuario interactúa pero sin backend?** → Stimulus.  
    **¿Necesitás persistir en BD?** → Live Component.

---

## Resumen

| Característica | Descripción |
|---|---|
| Maker | `make:twig-component Nombre` |
| Atributo PHP | `#[AsTwigComponent('nombre')]` |
| Archivo PHP | `src/Twig/Components/Nombre.php` |
| Template | `templates/components/Nombre.html.twig` |
| Props | Propiedades públicas de la clase |
| Slots | `{{ slots.default|raw }}` |
| Registro | Automático, no necesitás importar nada |
| JS necesario | No |
| Ideal para | Cards, listas, headers, alerts |

---

## Recursos

- [Symfony UX Twig Components Docs](https://symfony.com/doc/current/ux-twig-component/index.html)
