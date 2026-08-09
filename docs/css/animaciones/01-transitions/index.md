# Transitions { .bloque-css }

> `transition` suaviza el cambio entre **2 estados** de una propiedad — el estado inicial y el estado final. Necesita algo que dispare el cambio: `:hover`, `:focus`, o una clase que agrega JS.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/RwjgfNX41TE" title="Animaciones CSS — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Sintaxis básica {: .topic-title }

```css
.btn {
    background: gray;
    transition: background 0.3s ease;
}

.btn:hover {
    background: #34D399;
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — pasa el mouse</p>
<div class="demo-trans-basic">Hover aquí</div>
</div>

<style>
.demo-trans-basic { display: inline-block; padding: 0.6rem 1.1rem; border-radius: 8px; background: #64748b; color: white; font-weight: 600; transition: background 0.3s ease; }
.demo-trans-basic:hover { background: #34D399; color: #04321f; }
</style>

Sin `transition`, el cambio de `background` sería **instantáneo**. Con `transition`, el navegador interpola los valores intermedios durante la duración indicada.

---

## Las 4 propiedades (y el shorthand) {: .topic-title }

```css
.elemento {
    transition-property: background, transform;   /* qué propiedades animar */
    transition-duration: 0.3s;                     /* cuánto dura */
    transition-timing-function: ease-out;          /* cómo acelera/desacelera */
    transition-delay: 0s;                          /* espera antes de arrancar */
}

/* Shorthand — el orden es: propiedad duración timing-function delay */
.elemento {
    transition: background 0.3s ease-out 0s;
}
```

| Propiedad | Qué controla | Valor por defecto |
|---|---|---|
| `transition-property` | Qué propiedades animar (`all` = todas) | `all` |
| `transition-duration` | Cuánto dura el cambio | `0s` (sin transición) |
| `transition-timing-function` | La curva de aceleración | `ease` |
| `transition-delay` | Espera antes de empezar | `0s` |

!!! warning "Evita transition: all por defecto"
    `all` observa TODAS las propiedades animables — incluye cosas que capaz no querías animar, y es más caro de calcular para el navegador. Sé explícito: `transition: background, transform;`.

---

## Timing functions — la curva de la animación {: .topic-title }

```css
.caja { transition: transform 0.6s EASING; }
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — pasa el mouse por cada una</p>
<div class="demo-trans-timing">
  <div class="demo-timing-item demo-timing-linear"><span>linear</span></div>
  <div class="demo-timing-item demo-timing-ease"><span>ease</span></div>
  <div class="demo-timing-item demo-timing-easein"><span>ease-in</span></div>
  <div class="demo-timing-item demo-timing-easeout"><span>ease-out</span></div>
</div>
</div>

<style>
.demo-trans-timing { display: flex; flex-direction: column; gap: 0.5rem; }
.demo-timing-item { width: 60px; padding: 0.4rem 0.6rem; border-radius: 6px; background: rgba(52, 211, 153, 0.18); font-size: 0.75rem; text-align: center; transition: transform 0.6s; }
.demo-timing-linear:hover { transform: translateX(220px); transition-timing-function: linear; }
.demo-timing-ease:hover { transform: translateX(220px); transition-timing-function: ease; }
.demo-timing-easein:hover { transform: translateX(220px); transition-timing-function: ease-in; }
.demo-timing-easeout:hover { transform: translateX(220px); transition-timing-function: ease-out; }
</style>

| Timing function | Cómo se siente |
|---|---|
| `linear` | Velocidad constante — robótico, sin naturalidad |
| `ease` (default) | Arranca rápido, termina lento — el más natural para casos generales |
| `ease-in` | Arranca lento, termina rápido — bueno para elementos que "se van" |
| `ease-out` | Arranca rápido, termina lento — bueno para elementos que "llegan" |
| `cubic-bezier(x1, y1, x2, y2)` | Curva 100% personalizada | 

!!! tip "cubic-bezier a mano"
    Para curvas personalizadas (rebote, overshoot), usa [cubic-bezier.com](https://cubic-bezier.com/) — ajustás la curva visualmente y copiás el valor.

---

## Qué propiedades animar (rendimiento) {: .topic-title }

No todas las propiedades cuestan lo mismo animar.

| Propiedad | Costo | Por qué |
|---|---|---|
| `transform`, `opacity` | ✅ Barato | El navegador las anima en la GPU, sin recalcular layout |
| `width`, `height`, `top`, `left`, `margin` | ❌ Caro | Fuerzan **reflow** — el navegador recalcula el layout de la página en cada frame |

```css
/* ❌ Caro — anima 'left', fuerza reflow en cada frame */
.caja { transition: left 0.3s; }
.caja:hover { left: 100px; }

/* ✅ Barato — mismo efecto visual, animando transform */
.caja { transition: transform 0.3s; }
.caja:hover { transform: translateX(100px); }
```

!!! danger "El error de rendimiento más común en animaciones CSS"
    Animar `width`, `height`, `top`/`left` o `margin` fuerza al navegador a recalcular el layout en cada frame — se nota como "trabado" en dispositivos flojos. Casi siempre puedes lograr el mismo efecto con `transform` (`translate`, `scale`, `rotate`), que corre en la GPU.

---

## Estados que disparan una transition {: .topic-title }

```css
.btn { transition: transform 0.2s; }

.btn:hover { transform: scale(1.05); }   /* mouse encima */
.btn:focus-visible { transform: scale(1.05); }  /* foco por teclado */
.btn:active { transform: scale(0.97); }  /* mientras se clickea */
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — prueba click y mantén presionado</p>
<button class="demo-trans-states">Botón</button>
</div>

<style>
.demo-trans-states { padding: 0.6rem 1.2rem; border-radius: 8px; border: none; background: #0284c7; color: white; font-weight: 700; cursor: pointer; transition: transform 0.15s ease; }
.demo-trans-states:hover { transform: scale(1.05); }
.demo-trans-states:active { transform: scale(0.95); }
.demo-trans-states:focus-visible { outline: 2px solid #34D399; outline-offset: 2px; }
</style>

!!! tip "focus-visible, no focus a secas"
    `:focus-visible` solo muestra el estilo de foco cuando el usuario navega con teclado (Tab), no en cada click de mouse. Es más prolijo visualmente y sigue siendo accesible.

---

## Respeta `prefers-reduced-motion` {: .topic-title }

```css
.card {
    transition: transform 0.3s;
}

@media (prefers-reduced-motion: reduce) {
    .card {
        transition: none;
    }
}
```

> Ya viste esta media feature en su propio temario: [Media Queries](../../responsive/01-media-queries/index.md).

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Anima `transform` y `opacity` — corren en la GPU | Animar `width`/`height`/`top`/`left` sin necesidad — fuerzan reflow |
| Sé explícito con `transition-property` | Usar `transition: all` por defecto |
| Usa `:focus-visible` para el estado de foco | Quitar el estilo de foco sin reemplazarlo — rompe accesibilidad |
| Respeta `prefers-reduced-motion` en transiciones no esenciales | Ignorar la preferencia de accesibilidad del usuario |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 26+ ✅ | 16+ ✅ | 9+ ✅ | 12+ ✅ |

**Cobertura global**: ~99% — soporte universal, es CSS base desde hace más de una década.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Using CSS transitions** | https://developer.mozilla.org/es/docs/Web/CSS/CSS_transitions/Using_CSS_transitions |
| 📘 **MDN — `transition-timing-function`** | https://developer.mozilla.org/es/docs/Web/CSS/transition-timing-function |
| 🎥 **midudev — Animaciones CSS** | https://www.youtube.com/watch?v=RwjgfNX41TE |
| 🎮 **cubic-bezier.com** | https://cubic-bezier.com/ |
