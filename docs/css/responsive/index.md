# Responsive CSS { .section-responsive }

> Diseño responsive significa que el layout se adapta al contexto del usuario. Ya sea una pantalla de 320px o un monitor 4K, el contenido debe verse bien sin importar el dispositivo.

---

## ¿Qué problema resuelven?

El responsive clásico con **Media Queries** pregunta "¿qué ancho tiene la ventana?". Y funciona para el layout general. Pero cuando tenés componentes reutilizables que se mueven entre contextos, las media queries no alcanzan.

**Container Queries** resuelven eso: preguntan "¿qué ancho tiene el contenedor?" en vez de "¿qué ancho tiene la pantalla?".

---

## Bloques

| Bloque | Concepto | Estado |
|--------|----------|--------|
| **Container Queries** | Responsive a nivel de componente | ✅ Completo |

---

## Próximos

- Media Queries avanzadas (`@media (hover:)`, `@media (prefers-reduced-motion:)`)
- Unidades responsive (`min()`, `max()`, `clamp()`)
- `picture` y `srcset` para imágenes responsive

---

## 📖 Referencias

- 📘 **MDN — Responsive Design** — https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
- 📘 **MDN — Container Queries** — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- 🎥 **midudev — Responsive Design** — https://www.youtube.com/watch?v=4vMlsWQkRWo
