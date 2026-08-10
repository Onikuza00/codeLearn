# Keyframes y animation { .bloque-css }

> `@keyframes` define una secuencia de varios pasos (no solo 2 estados), y `animation` la conecta a un elemento. A diferencia de `transition`, **no necesita un evento que la dispare** — puede arrancar sola y repetirse en loop.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/RwjgfNX41TE" title="Animaciones CSS — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## `transition` vs `animation` — cuándo usar cada uno {: .topic-title }

| | `transition` | `animation` + `@keyframes` |
|---|---|---|
| **Pasos** | Solo 2 estados: inicial → final | Los que quieras: `0%`, `25%`, `50%`... `100%` |
| **Disparador** | Necesita un evento (`:hover`, clase de JS) | Puede arrancar sola, sin evento |
| **Repetición** | No se repite sola | `infinite`, o un número de veces |
| **Caso típico** | Botón que reacciona al hover | Loader que gira, badge que pulsa, skeleton loading |

---

## Sintaxis básica {: .topic-title }

```css
@keyframes girar {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.loader {
    animation: girar 1s linear infinite;
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa</p>
<div class="demo-anim-spinner"></div>
</div>

<style>
@keyframes demo-girar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.demo-anim-spinner { width: 32px; height: 32px; border: 4px solid rgba(52, 211, 153, 0.2); border-top-color: #34D399; border-radius: 50%; animation: demo-girar 1s linear infinite; }
</style>

| Parte | Qué es |
|---|---|
| `@keyframes girar { ... }` | Define **qué** pasa en cada momento de la animación |
| `animation: girar 1s linear infinite;` | Conecta el elemento con esa secuencia |

---

## Varios pasos con porcentajes {: .topic-title }

`from`/`to` son solo azúcar sintáctica para `0%`/`100%`. Con porcentajes puedes definir pasos intermedios:

```css
@keyframes pulso {
    0%   { transform: scale(1); opacity: 1; }
    50%  { transform: scale(1.15); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
}

.badge {
    animation: pulso 1.5s ease-in-out infinite;
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa</p>
<div class="demo-anim-badge">● En vivo</div>
</div>

<style>
@keyframes demo-pulso { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
.demo-anim-badge { display: inline-block; padding: 0.4rem 0.8rem; border-radius: 999px; background: #ef4444; color: white; font-size: 0.8rem; font-weight: 700; animation: demo-pulso 1.5s ease-in-out infinite; }
</style>

---

## Las propiedades de `animation` (y el shorthand) {: .topic-title }

```css
.elemento {
    animation-name: pulso;
    animation-duration: 1.5s;
    animation-timing-function: ease-in-out;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-fill-mode: none;
    animation-play-state: running;
}

/* Shorthand */
.elemento {
    animation: pulso 1.5s ease-in-out 0s infinite normal none running;
}
```

| Propiedad | Qué controla | Valores útiles |
|---|---|---|
| `animation-iteration-count` | Cuántas veces se repite | Un número, o `infinite` |
| `animation-direction` | Dirección entre repeticiones | `normal`, `reverse`, `alternate` |
| `animation-fill-mode` | Qué estilo queda ANTES/DESPUÉS de la animación | `none`, `forwards`, `backwards`, `both` |
| `animation-play-state` | Pausar/reanudar | `running`, `paused` |

!!! warning "animation-fill-mode: forwards — el gotcha más común"
    Sin `forwards`, cuando la animación termina, el elemento **vuelve** al estilo original (antes del `@keyframes`), aunque el último keyframe diga otra cosa. Si quieres que el estado final se quede, necesitas `animation-fill-mode: forwards`.

```css
@keyframes aparecer {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

.card {
    animation: aparecer 0.4s ease-out forwards;
    /*                              ↑ sin esto, vuelve a opacity:0 al terminar */
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — animación al cargar la página</p>
<div class="demo-anim-fadein">Aparezco con fade-in</div>
</div>

<style>
@keyframes demo-aparecer { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.demo-anim-fadein { padding: 0.6rem 1rem; border-radius: 8px; background: rgba(52, 211, 153, 0.15); font-weight: 600; text-align: center; animation: demo-aparecer 0.6s ease-out forwards; }
</style>

---

## `animation-direction: alternate` — va y vuelve {: .topic-title }

```css
@keyframes rebotar {
    from { transform: translateY(0); }
    to   { transform: translateY(-12px); }
}

.flecha {
    animation: rebotar 0.6s ease-in-out infinite alternate;
    /*                                            ↑ va y vuelve, no salta de golpe */
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa</p>
<div class="demo-anim-bounce">⬇</div>
</div>

<style>
@keyframes demo-rebotar { from { transform: translateY(0); } to { transform: translateY(-10px); } }
.demo-anim-bounce { font-size: 1.4rem; display: inline-block; animation: demo-rebotar 0.6s ease-in-out infinite alternate; }
</style>

Sin `alternate`, la animación salta del final (100%) directo al inicio (0%) en cada repetición — con `alternate`, invierte la dirección y se ve fluida en ambos sentidos.

---

## Pausar con `animation-play-state` {: .topic-title }

```css
.spinner {
    animation: girar 1s linear infinite;
}

.spinner:hover {
    animation-play-state: paused;
}
```

Útil para pausar loaders/carruseles al pasar el mouse, sin reiniciar la animación desde cero.

---

## Respeta `prefers-reduced-motion` {: .topic-title }

```css
.card {
    animation: aparecer 0.4s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
    .card {
        animation: none;
    }
}
```

!!! danger "Las animaciones en loop son las que más molestan"
    Un `animation: infinite` (spinners aparte, que son funcionales) puede ser un disparador real para usuarios con trastornos vestibulares o migrañas. Envuelve las animaciones puramente decorativas en `prefers-reduced-motion`.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa `animation-fill-mode: forwards` si el estado final debe quedarse | Olvidar `forwards` y sorprenderte cuando el elemento "vuelve" al final |
| Anima `transform`/`opacity` cuando puedas — más barato que otras propiedades | Animar `width`/`top`/`left` en un `@keyframes` en loop — cuesta más CPU |
| Usa `alternate` para movimientos de ida y vuelta (rebote, pulso) | Duplicar el keyframe invertido a mano cuando `alternate` hace lo mismo |
| Respeta `prefers-reduced-motion` en decorativas | Poner `infinite` en todo — un loop constante cansa visualmente |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 43+ ✅ | 16+ ✅ | 9+ ✅ | 12+ ✅ |

**Cobertura global**: ~99% — soporte universal, es CSS base desde hace más de una década.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Using CSS animations** | https://developer.mozilla.org/es/docs/Web/CSS/CSS_animations/Using_CSS_animations |
| 📘 **MDN — `@keyframes`** | https://developer.mozilla.org/es/docs/Web/CSS/@keyframes |
| 📘 **MDN — `animation-fill-mode`** | https://developer.mozilla.org/es/docs/Web/CSS/animation-fill-mode |
| 🎥 **midudev — Animaciones CSS** | https://www.youtube.com/watch?v=RwjgfNX41TE |
