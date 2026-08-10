# Scroll Snap { .section-scroll-snap }

> **scroll-snap** controla dónde "se pega" el scroll cuando el usuario se detiene. Haz sliders, carruseles y galerías sin una línea de JavaScript.

---

## El problema que resuelve {: .topic-title }

Un slider horizontal con CSS puro es fácil con `overflow-x: auto` y `display: flex`. Pero el resultado es feo: el usuario scrollea y se queda **a medio camino** entre dos slides. No hay un "enganche" visual.

Antes resolvíamos esto con:

- **JavaScript + Intersection Observer** — más de 50 líneas
- **Librerías** (Swiper, Flickity) — KB de JS para algo que CSS resuelve en 2 propiedades

**scroll-snap** hace que el scroll se "enganche" al slide más cercano cuando el usuario levanta el dedo. Es nativo, suave, sin JavaScript.

---

## Sintaxis básica {: .topic-title }

Dos propiedades, una en el contenedor y otra en los hijos:

### 1. Contenedor: `scroll-snap-type`

```css
.slider {
    scroll-snap-type: x mandatory;
}
```

| Valor | Significado |
|-------|-------------|
| `x` / `y` | Eje en el que scrolleas |
| `inline` / `block` | Eje lógico (según dirección de escritura) |
| `mandatory` | **Siempre** se engancha al punto más cercano |
| `proximity` | Se engancha solo si el scroll está cerca de un punto |

**`mandatory`** es el que quieres para sliders y carruseles. **`proximity`** es más suave, útil para listas largas donde no quieres forzar el snap.

### 2. Hijos: `scroll-snap-align`

```css
.slide {
    scroll-snap-align: start;
}
```

| Valor | Dónde se engancha |
|-------|-------------------|
| `start` | Al borde inicial del contenedor |
| `center` | Al centro del contenedor |
| `end` | Al borde final del contenedor |

**`start`** es el más común para sliders de izquierda a derecha. **`center`** sirve para galerías de una imagen por vez centrada.

---

## Ejemplo completo: slider horizontal {: .topic-title }

```css
.slider {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;

    /* Ocultar scrollbar (opcional, por estética) */
    scrollbar-width: none;
}
.slider::-webkit-scrollbar {
    display: none;
}

.slide {
    flex: 0 0 80%;          /* Cada slide ocupa el 80% del viewport */
    scroll-snap-align: start;
    border-radius: 12px;
    /* ... estilos visuales */
}
```

```html
<div class="slider">
    <div class="slide">Slide 1</div>
    <div class="slide">Slide 2</div>
    <div class="slide">Slide 3</div>
</div>
```

El resultado: scrolleás horizontalmente y cada slide se "engancha" al borde izquierdo del contenedor. Sin JavaScript.

---

## scroll-snap-stop (opcional) {: .topic-title }

Evita que el usuario se salte slides al scrollear rápido:

```css
.slide {
    scroll-snap-align: start;
    scroll-snap-stop: always;
}
```

Por defecto es `normal` — el usuario puede pasar varios slides de un solo scroll rápido. Con `always`, **cada slide obliga a una parada**.

Úsalo con criterio. En un carrusel de imágenes puede ser útil, en una lista de productos es molesto.

---

## scroll-padding (opcional) {: .topic-title }

Si tienes un header fijo, los slides pueden quedar tapados al scrollear. `scroll-padding` te da un margen interno al contenedor:

```css
.slider {
    scroll-snap-type: x mandatory;
    scroll-padding: 0 60px;  /* 60px de padding a los costados */
    /* Así el slide enganchado no choca contra el borde */
}
```

---

## Casos de uso {: .topic-title }

### 1. Galería de productos centrada

```css
.gallery {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 50%;
    /* El padding centra el primer slide */
}

.gallery-item {
    flex: 0 0 60%;
    scroll-snap-align: center;
}
```

Cada producto se centra en la pantalla. El padding lateral hace que el primer y último slide también se vean centrados.

### 2. Carrusel a pantalla completa

```css
.carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    /* Ocultar scrollbar */
    scrollbar-width: none;
}
.carousel::-webkit-scrollbar {
    display: none;
}

.carousel img {
    flex: 0 0 100vw;      /* Cada imagen ocupa todo el viewport */
    scroll-snap-align: start;
}
```

`100vw` hace que cada imagen ocupe todo el ancho del viewport. Es el comportamiento de un carrusel "full screen".

### 3. Grid de scroll vertical (`y mandatory`)

```css
.sections {
    height: 100vh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
}

.section {
    height: 100vh;
    scroll-snap-align: start;
}
```

Cada sección ocupa toda la pantalla y el scroll se engancha. Útil para landing pages "one page" con secciones completas.

### 4. scroll-snap con container queries

```css
.card-slider {
    container: slider / inline-size;
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
}

.card-slider__item {
    scroll-snap-align: start;
}

/* Si el contenedor es chico -> slides más anchos */
@container slider (max-width: 400px) {
    .card-slider__item {
        flex: 0 0 85%;
    }
}

/* Si el contenedor es grande -> slides más angostos (se ven 2-3) */
@container slider (min-width: 700px) {
    .card-slider__item {
        flex: 0 0 45%;
    }
}
```

---

## scroll-snap vs carrusel JS {: .topic-title }

| scroll-snap | Swiper / Librería |
|-------------|-------------------|
| ✅ 0 KB de JS | ❌ Pesa KB |
| ✅ Rendimiento nativo | ❌ Layout shift potencial |
| ✅ Funciona con scroll táctil | ⚠️ Depende de la librería |
| ❌ No tiene indicadores automáticos | ✅ Dots, flechas, autoplay incluidos |
| ❌ No tiene autoplay | ✅ Autoplay configurable |
| ⚠️ Sin flechas de navegación (necesitas HTML + JS) | ✅ Todo integrado |

**Cuándo usar scroll-snap puro**: componentes simples (galería de productos, slider de testimonios) donde no necesitas autoplay ni indicadores.

**Cuándo usar librería**: carruseles con flechas, dots, autoplay, transiciones complejas. Y aun así, plantéate si realmente necesitas todo eso o es sobreingeniería.

---

## Buenas prácticas {: .topic-title }

### ✅ Haz

- Usa `scroll-snap-type: x mandatory` para sliders lineales
- Combina con `overflow-x: auto` — no `hidden`, que no se pueda scrollear rompe el snap
- Oculta la scrollbar si es un carrusel estético (pero asegúrate de que siga scrolleando)
- Usa `scroll-padding` si tienes headers fijos o quieres espacio visual en los bordes

### ❌ No hagas

- No pongas `scroll-snap-type` en un contenedor sin overflow — no va a funcionar
- No uses `mandatory` en listas largas con scroll libre (forzar snap en una lista de 100 items es molesto)
- No agregues JS para hacer lo que `scroll-snap` ya resuelve
- No asumas que todos los usuarios ven la scrollbar — en móvil no se ve y el snap funciona igual

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 69+ ✅ | 68+ ✅ | 11+ ✅ | 79+ ✅ |

**Cobertura global**: ~97% — soporte masivo desde 2020. Se puede usar sin ningún fallback.

---

## 📖 Recursos

| Recurso | Link |
|---------|------|
| 📘 **MDN — CSS Scroll Snap** | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap |
| 🎥 **Kevin Powell — scroll-snap** | https://www.youtube.com/watch?v=yXgq0oTYBRw |
| 🎥 **midudev — CSS práctico** | https://www.youtube.com/watch?v=2JgP9G9Eliw |
| 📗 **Guía completa — Ahmad Shadeed** | https://ishadeed.com/article/css-scroll-snap/ |
| ✅ **Can I Use** | https://caniuse.com/css-snappoints |

---

> 🧠 **Resumen mental**: `scroll-snap-type` en el contenedor + `scroll-snap-align` en los hijos. Dos propiedades y tienes sliders nativos sin JS. Para carruseles complejos, sigues necesitando una librería, pero para el 80% de los casos, CSS alcanza.
