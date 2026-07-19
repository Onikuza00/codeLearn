# Grid CSS { .section-grid }

> Grid es un sistema de layout **bidimensional** — trabaja en filas **y** columnas al mismo tiempo. Ideal para páginas completas, dashboards, galerías y layouts complejos.

---

## ¿Flexbox o Grid?

| Escenario | Flexbox | Grid |
|-----------|---------|------|
| Navbar con logo + enlaces + botón | ✅ Ideal | ❌ Sobra |
| Centrar un hijo | ✅ Ideal | ✅ También |
| Galería de cards que wrappean | ✅ `flex-wrap` | ✅ `auto-fill` |
| Página completa (header, sidebar, main, footer) | ❌ Torpe | ✅ Ideal |
| Dashboard con áreas irregulares | ❌ Difícil | ✅ Ideal |
| Layout 2D (filas Y columnas juntos) | ❌ No puede | ✅ Nació para eso |

!!! tip "La regla de oro" { .grid }
    **Una dimensión** (fila o columna) → Flexbox.  
    **Dos dimensiones** (filas y columnas) → Grid.

---

## Sub-secciones

<div class="grid cards" markdown>

-   **Conceptos básicos**
    `grid-template-columns`, `grid-template-rows`, `repeat()`, unidad `fr`.

    [:octicons-arrow-right-24: Ir a conceptos](conceptos.md)

-   **Ubicación y áreas**
    `grid-column`, `grid-row`, `grid-area`, `grid-template-areas`.

    [:octicons-arrow-right-24: Ir a ubicación](ubicacion.md)

-   **Auto layout responsive**
    `auto-fill`, `auto-fit`, `minmax()`, `auto-rows`, `auto-columns`.

    [:octicons-arrow-right-24: Ir a auto layout](auto.md)

</div>

---

## Referencias

- [MDN: Grid CSS](https://developer.mozilla.org/es/docs/Web/CSS/CSS_grid_layout)
- [CSS-Tricks: Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- 🎥 [midudev — Aprende Grid CSS en 30 minutos](https://www.youtube.com/watch?v=TlJbu0BMLaY)
- 📖 [lenguajecss.com — Grid CSS](https://lenguajecss.com/css/grid/que-es-grid/)
