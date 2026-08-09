# Animaciones CSS { .bloque-css }

> Mover, transformar y transicionar elementos sin JavaScript. Dos herramientas, dos casos de uso: `transition` para cambios entre 2 estados, `@keyframes`/`animation` para secuencias complejas que se disparan solas.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/RwjgfNX41TE" title="Animaciones CSS — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## ¿Qué problema resuelven? {: .topic-title }

Sin CSS, cualquier cambio de estado (hover, aparecer, cargar) es **instantáneo** — de golpe, sin transición visual. Eso se siente brusco y es difícil de seguir con la vista.

| Necesitas... | Herramienta |
|---|---|
| Un cambio suave entre 2 estados, disparado por algo (hover, focus, clase agregada por JS) | `transition` |
| Una secuencia con varios pasos, que se repite sola, sin depender de un evento | `@keyframes` + `animation` |

---

## Temario

| Temario | Concepto |
|---------|----------|
| [**Transitions**](01-transitions/index.md) | Cambios suaves entre 2 estados: `:hover`, `:focus`, clases |
| [**Keyframes y animation**](02-keyframes/index.md) | Secuencias de varios pasos, en loop, sin evento disparador |

---

## 📖 Referencias

- 📘 **MDN — Using CSS transitions** — https://developer.mozilla.org/es/docs/Web/CSS/CSS_transitions/Using_CSS_transitions
- 📘 **MDN — CSS Animations** — https://developer.mozilla.org/es/docs/Web/CSS/CSS_animations/Using_CSS_animations
- 🎥 **midudev — Animaciones CSS** — https://www.youtube.com/watch?v=RwjgfNX41TE
- 🎮 **cubic-bezier.com** — https://cubic-bezier.com/
