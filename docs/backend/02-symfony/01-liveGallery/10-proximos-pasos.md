# 01.10 Próximos pasos

Cosas para practicar sobre este mismo ejercicio:

## 1. Transición CSS

Agregar suavidad al zoom:
```css
.zoomed {
    transform: scale(1.5);
    cursor: zoom-out;
    transition: transform 0.2s ease;
}
```

## 2. Overlay en vez de scale in-situ

Que la imagen agrandada ocupe toda la pantalla como un lightbox, en vez de escalar dentro del article.

## 3. Cerrar al hacer click fuera

Event listener en el overlay para que al hacer click en el fondo se cierre el zoom.

## 4. Values en Stimulus

Hacer que el factor de zoom sea configurable desde el HTML:
```html
<article data-controller="gallery-zoom" data-gallery-zoom-scale-value="2">
```
```js
static values = { scale: { type: Number, default: 1.5 } }

zoom() {
    this.mainTarget.style.transform = `scale(${this.scaleValue})`;
}
```

## 5. Live Component — botón "Me gusta"

Convertir ImageCard a Live Component y agregar un botón que incremente `likes` sin recargar la página.

## 6. Más eventos Stimulus

Probar otros eventos:
- `mouseenter->gallery-zoom#zoom` → zoom al pasar el ratón
- `dblclick->gallery-zoom#zoom` → zoom al hacer doble click
