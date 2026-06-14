# Stimulus { .section-stimulus }

---

## ¿Qué es?

**Stimulus** es un framework JS minimalista de Basecamp (Ruby on Rails). Symfony UX lo usa internamente como "pegamento" entre el HTML y el JavaScript.

!!! tip "Filosofía"
    No es un framework de componentes como React o Vue. Es un **framework para tu HTML**: se conecta a elementos que ya existen en el DOM y les agrega comportamiento.

| | React / Vue | Stimulus |
|---|---|---|
| Renderiza HTML desde JS | ✅ Sí | ❌ No, el HTML ya existe |
| Estado | En JS (state) | En el servidor o en atributos `data-*` |
| Curva de aprendizaje | Alta | Baja |
| Ideal para | SPAs, dashboards | Toques de interactividad |

---

## Maker — Creación

```bash
php bin/console make:stimulus-controller Gallery
```

### Opciones del Maker (4 preguntas)

| # | Pregunta | Respuesta | Por qué |
|---|----------|-----------|---------|
| 1 | Language (JavaScript or TypeScript) | `js` | TypeScript no aporta nada para controllers simples |
| 2 | Do you want to include targets? | `yes` → nombre: `main` | Para acceder a elementos sin `querySelector` |
| 3 | Do you want to include values? | `yes` → nombre y tipo | Para pasar datos desde el HTML al JS |
| 4 | Do you want to include CSS classes? | `no` | Preferimos usar clases fijas en CSS |

??? info "Targets vs Values vs CSS Classes"
    | Concepto | Qué hace | Ejemplo HTML |
    |---|---|---|
    | **Target** | Referencia a un elemento del DOM | `data-gallery-target="main"` → `this.mainTarget` |
    | **Value** | Dato configurable desde HTML | `data-gallery-images-value="[...]"` → `this.imagesValue` |
    | **CSS Class** | Nombre de clase configurable | `data-gallery-zoomed-class="mi-clase"` → `this.zoomedClass` |

---

## Código generado

```js title="assets/controllers/gallery_controller.js"
import { Controller } from '@hotwired/stimulus';

/* stimulusFetch: 'lazy' */
export default class extends Controller {
    static targets = ['main'];
    static values = { images: Array };

    change(event) {
        const image = event.params.image;
        this.mainTarget.src = image;
    }
}
```

!!! info "`stimulusFetch: 'lazy'`"
    El JS **no se descarga** hasta que aparece un elemento con `data-controller="gallery"` en la página. Optimización de rendimiento automática.

---

## Conceptos clave

### Controller

Se conecta a un elemento HTML mediante `data-controller`:

```html
<div data-controller="gallery">
```

El nombre se normaliza automáticamente:
- `gallery_controller.js` → `gallery`
- `galleryZoom_controller.js` → `gallery-zoom`
- `GalleryZoomController.js` → `gallery-zoom`

### Targets

Referencias a elementos del DOM dentro del controller:

```html
<img data-gallery-target="main" src="foto.jpg">
```

```js
static targets = ['main']
this.mainTarget      // → la <img> (único)
this.mainTargets     // → array de todas las <img> con ese target
this.hasMainTarget   // → true/false si existe
```

!!! tip "Sin targets tendrías que hacer..."
    En JS vanilla: `this.element.querySelector('[data-gallery-target="main"]')`. Stimulus te da `this.mainTarget` gratis.

### Values

Parámetros que vienen del HTML:

```html
<div data-controller="gallery"
     data-gallery-images-value='["foto1.jpg", "foto2.jpg"]'>
```

```js
static values = { images: Array }
this.imagesValue  // → ["foto1.jpg", "foto2.jpg"]
```

Tipos soportados: `Array`, `Object`, `String`, `Number`, `Boolean`.

### Actions

Eventos del DOM que ejecutan métodos del controller:

```html
<button data-action="click->gallery#change">
```

```
click -> gallery # change
└───┘   └──────┘ └──┘
evento  ctrl      método
```

- **`->`** separa el evento del controller
- **`#`** separa el controller del método

```js
change(event) {
    // event.params → parámetros data-*-param
    // event.target → el elemento que disparó el evento
}
```

### Parámetros en acciones

```html
<button data-action="click->gallery#change"
        data-gallery-image-param="foto2.jpg">
```

```js
change(event) {
    event.params.image  // → "foto2.jpg"
}
```

El nombre se pasa de kebab-case a camelCase: `image-param` → `event.params.image`.

---

## Ejemplo completo: galería de imágenes

=== "PHP (Controller)"

    ```php title="src/Controller/ProductController.php"
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

=== "Twig (template)"

    ```twig title="templates/product/show.html.twig"
    <div data-controller="gallery"
         data-gallery-images-value="{{ product.images|json_encode }}">
        <img data-gallery-target="main"
             src="{{ product.images[0] }}"
             alt="{{ product.name }}" />

        {% for image in product.images %}
            <button type="button"
                    data-action="click->gallery#change"
                    data-gallery-image-param="{{ image }}">
                <img src="{{ image }}" alt="" />
            </button>
        {% endfor %}
    </div>
    ```

=== "JS (Stimulus)"

    ```js title="assets/controllers/gallery_controller.js"
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

**Flujo:** click en miniatura → Stimulus ejecuta `change()` → cambia `this.mainTarget.src` por la imagen seleccionada → sin recargar.

---

## ¿Cuándo usar Stimulus vs Live Component?

| Situación | Tecnología |
|---|---|
| 🌀 Abrir/cerrar menús, tooltips, modales | ✅ **Stimulus** |
| 🎨 Toggle de clases CSS, animaciones | ✅ **Stimulus** |
| 🖼️ Cambiar imagen, zoom, carrusel simple | ✅ **Stimulus** |
| Drag & drop simple | ✅ **Stimulus** |
| 💾 Guardar en base de datos, validar | Live Component |
| 🔍 Buscar, filtrar con backend | Live Component |
| 🛒 Carrito, formularios, paginación | Live Component |

!!! tip "Regla práctica"
    **¿Solo frontend (clases, eventos DOM)?** → Stimulus.  
    **¿Necesitás backend (BD, validación)?** → Live Component.  
    **¿Sin interacción?** → Twig Component.

---

## Resumen

| Característica | Descripción |
|---|---|
| Maker | `make:stimulus-controller Nombre` |
| Registro | Automático (`assets/controllers/`) |
| Targets | `this.nombreTarget` (referencia a elementos) |
| Values | `this.nombreValue` (datos desde HTML) |
| Actions | `evento->controller#metodo` |
| Parámetros | `data-*-param` → `event.params.nombre` |
| `lazy` | No descarga JS hasta que se necesita |
| Ideal para | Menús, modales, toggles, galerías, zoom |
