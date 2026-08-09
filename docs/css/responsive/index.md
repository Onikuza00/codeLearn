# Responsive CSS { .section-responsive .bloque-css }

> Diseño responsive significa que el layout se adapta al contexto del usuario. Ya sea una pantalla de 320px o un monitor 4K, el contenido debe verse bien sin importar el dispositivo.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/hrxjBqZWsb0" title="Responsive Design — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## ¿Qué problema resuelven?

El responsive clásico con **Media Queries** pregunta "¿qué ancho tiene la ventana?". Y funciona para el layout general. Pero cuando tienes componentes reutilizables que se mueven entre contextos, las media queries no alcanzan.

**Container Queries** resuelven eso: preguntan "¿qué ancho tiene el contenedor?" en vez de "¿qué ancho tiene la pantalla?".

---

## Temario

| Temario | Concepto |
|---------|----------|
| [**Media Queries**](01-media-queries/index.md) | La base: responsive según viewport y preferencias del usuario |
| [**Container Queries**](02-container-queries/index.md) | Responsive a nivel de componente |
| [**Funciones responsive**](funciones-responsive.md) | Patrones con `flex`, `grid`, `clamp()` que se adaptan sin media queries |

---

## Próximos

- `picture` y `srcset` para imágenes responsive

---

## 📖 Referencias

- 📘 **MDN — Responsive Design** — https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
- 📘 **MDN — Container Queries** — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- 🎥 **midudev — Responsive Design** — https://www.youtube.com/watch?v=hrxjBqZWsb0
