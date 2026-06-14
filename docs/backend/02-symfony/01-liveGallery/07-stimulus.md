# 01.07 Stimulus — GalleryZoom

## ¿Qué es Stimulus?

Framework JS minimalista de Basecamp (creadores de Ruby on Rails). Su filosofía:

> "HTML que ya existe + JS que lo mejora"

No genera HTML desde JS como React/Vue. Se conecta a HTML existente y le agrega comportamiento.

---

## 1. Creación con Maker

**Comando:**
```bash
php bin/console make:stimulus-controller GalleryZoom
```

### Las 4 preguntas del Maker

| # | Pregunta | Respuesta | Por qué |
|---|----------|-----------|---------|
| 1 | Language (JavaScript or TypeScript) | `js` | TypeScript añade sintaxis innecesaria para esto |
| 2 | Do you want to include targets? | `yes` → name: `main` | Para acceder directo a la `<img>` sin `querySelector` |
| 3 | Do you want to include values? | `no` | El scale lo hardcodeamos en CSS |
| 4 | Do you want to include CSS classes? | `no` | Usamos clase fija `.zoomed` |

#### ¿Qué es un target?

Un target es un elemento HTML al que le ponemos un nombre para accederlo desde el JS:

```html
<img data-gallery-zoom-target="main" src="...">
```

```js
static targets = ['main']
this.mainTarget  // → accede al <img> directamente
```

Sin targets tendrías que hacer `this.element.querySelector('img')`.

#### ¿Qué son values y CSS classes?

**Values:** parámetros configurables desde HTML.
```html
<div data-gallery-zoom-scale-value="2">
```
```js
this.scaleValue  // → 2
```

**CSS Classes:** nombres de clase configurables desde HTML. Nosotros usamos `.zoomed` fijo.

### Código generado

```js
// assets/controllers/gallery_zoom_controller.js
import { Controller } from '@hotwired/stimulus';

/* stimulusFetch: 'lazy' */
export default class extends Controller {
    static targets = ['main']
}
```

**`stimulusFetch: 'lazy'`** → el JS no se descarga hasta que aparezca un elemento con `data-controller="gallery-zoom"` en la página.

---

## 2. Método zoom()

```js
zoom() {
    this.mainTarget.classList.toggle('zoomed');
}
```

| Incorrecto | Correcto |
|---|---|
| `targets.main.classList...` ❌ | `this.mainTarget.classList...` ✅ |

**Regla:** Stimulus genera el getter `this.[nombre]Target` automáticamente. `targets` es solo para declarar los nombres, no para accederlos.

---

## 3. Atributos en el template

```twig
<article data-controller="gallery-zoom">
    {% if producto.imageUrl %}
        <img src="{{ producto.imageUrl }}" alt="{{ producto.name }}"
             data-action="click->gallery-zoom#zoom"
             data-gallery-zoom-target="main">
    {% endif %}
    ...
</article>
```

### `data-controller="gallery-zoom"`
Conecta el HTML con el controller JS. El nombre se normaliza:
- `gallery_zoom_controller.js` → `gallery-zoom`
- `GalleryZoomController.js` → `gallery-zoom`

### `data-action="click->gallery-zoom#zoom"`
```
click  →  gallery-zoom  #  zoom
evento    controller      método
```
- `->` separa el **evento** del **controller**
- `#` separa el **controller** del **método**

### `data-gallery-zoom-target="main"`
Marca esta `<img>` como el target `main`. Sin esto, `this.mainTarget` es `undefined`.

---

## 4. CSS

```css
.zoomed {
    transform: scale(1.5);
    cursor: zoom-out;
}
```

**Problema conocido:** `scale()` cambia la representación visual pero no el layout. La imagen sobresale del `<article>`. Si hay `overflow: hidden` se corta. Se arregla con `overflow: visible` en el padre o un overlay.

## Flujo completo del zoom

```
Click en <img>
  → data-action="click->gallery-zoom#zoom"
  → Stimulus busca el data-controller="gallery-zoom" más cercano (el <article>)
  → Ejecuta zoom()
  → this.mainTarget = la <img> (por el data-target)
  → classList.toggle('zoomed')
  → CSS aplica scale(1.5)
  → Segundo click elimina la clase → vuelve a tamaño normal
```
