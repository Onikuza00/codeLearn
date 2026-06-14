# Flexbox { .section-flex }

> Flexbox es un sistema de layout unidimensional — trabaja en una sola dirección (fila **o** columna). Ideal para componentes, navs, centrados, y distribución equitativa.

---

## ¿Para qué sirve?

Distribuir espacio y alinear contenido en **una dimensión** con mínimo esfuerzo.

| Situación | Por qué Flexbox |
|-----------|----------------|
| Navbar con logo, enlaces, botón | Flex alinea los 3 en el eje horizontal con `space-between` |
| Centrar un elemento hijo | `display: flex; place-items: center` |
| Cards que ocupan el mismo alto | `align-items: stretch` por defecto |
| Galería simple que wrap | `flex-wrap: wrap` con `gap` |
| Distribuir espacio sobrante | `flex: 1` reparte el espacio entre hijos |

---

## Sub-secciones

<div class="grid cards" markdown>

-   **Conceptos básicos**
    Eje principal vs cruzado, `flex-direction`, `flex-wrap`, `flex-flow`.

    [:octicons-arrow-right-24: Ir a conceptos](conceptos.md)

-   **Alineación y distribución**
    `justify-content`, `align-items`, `align-self`, `gap`.

    [:octicons-arrow-right-24: Ir a alineación](alineacion.md)

-   **Items flexibles**
    `flex-grow`, `flex-shrink`, `flex-basis`, `order` y el shorthand `flex`.

    [:octicons-arrow-right-24: Ir a items](items.md)

</div>

---

## Referencias

- [MDN: Flexbox](https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Flexbox)
- [CSS-Tricks: Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
