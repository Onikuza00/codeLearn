# Selectores CSS avanzados { .section-selectores .bloque-css }

> Los selectores son el corazón de CSS: **cómo eliges elementos del DOM** para aplicarles estilos. Aquí vamos más allá de clases y IDs con selectores relacionales modernos.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/3sPROx7lBmE" title="Selectores CSS — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## ¿Qué problema resuelven?

Las clases como `.card` ya saben a qué elemento apuntar. Pero a veces necesitas condiciones:

- "Esta card que CONTIENE una imagen"
- "Este input que está INVALIDO"
- "Esta sección que NO tiene imágenes"

Para eso existen los **selectores relacionales** como `:has()` y `:not()`.

---

## Temario

| Temario | Concepto |
|---------|----------|
| [`:has()`](01-has/index.md) | Seleccionar un elemento según lo que CONTIENE |
| [`:not()`](02-not/index.md) | Negación lógica — excluir según un selector |
| [`:is()` y `:where()`](03-is-where/index.md) | Agrupar selectores, con distinta especificidad |
| [`:nth-child()` avanzado](04-nth-child/index.md) | Seleccionar por posición entre hermanos |
| [`::before` y `::after`](05-pseudo-elementos/index.md) | Generar contenido decorativo sin tocar el HTML |

---

## 📖 Referencias

- 📘 **MDN — Selectores CSS** — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
- 🎥 **midudev — Selectores CSS** — https://www.youtube.com/watch?v=3sPROx7lBmE
