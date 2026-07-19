# :has() { .section-has }

> `:has()` permite seleccionar un elemento **si contiene** otro elemento específico. Es conocido como "el selector padre" porque podemos estilar un contenedor según lo que tenga adentro.

---

## ¿Para qué sirve?

Antes de `:has()`, si querías que un `.card` se viera distinto cuando contenía una imagen, necesitabas JavaScript. Ahora:

```css
.card:has(img) {
    border: 2px solid gold;
}
```

":has" en inglés significa "tiene". Se lee natural: *seleccioná el .card que tiene un img*.

---

## Sintaxis básica

```css
/* Seleccioná el PADRE si contiene un HIJO que cumpla X */
.padre:has(.hijo) {
    /* estilos para el padre */
}
```

| Ejemplo | Significado |
|---------|-------------|
| `.card:has(img)` | `.card` que contiene un `<img>` |
| `.card:not(:has(img))` | `.card` que NO contiene un `<img>` |
| `form:has(input:invalid)` | `form` que tiene un input inválido |
| `ul:has(> li)` | `ul` que tiene un `li` como hijo DIRECTO |
| `h2:has(+ p)` | `h2` que tiene un `<p>` justo después |

---

## Casos de uso principales

### 1. Cards con imagen vs sin imagen

El caso más clásico. Cuando tenés una grilla de productos y algunos tienen foto y otros no:

```css
/* Card CON imagen */
.card:has(img) {
    grid-column: span 2;
    border: 2px solid var(--color-primary);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Card SIN imagen */
.card:not(:has(img)) {
    text-align: center;
    padding: 3rem;
    background: #f9f9f9;
}
```

### 2. Formularios sin JavaScript

```css
/* Contenedor cuando el input es inválido */
.form-group:has(input:invalid) {
    border-left: 3px solid red;
}

/* Contenedor cuando el input tiene foco */
.form-group:has(input:focus) {
    background: #f0f8ff;
}

/* Label cuando el checkbox está marcado */
label:has(input:checked) {
    font-weight: bold;
    color: green;
}
```

### 3. Layouts que se adaptan al contenido

```css
/* Si la sección tiene video, sacar padding */
section:has(video) {
    padding: 0;
}

/* Si hay 4 o más hijos, cambiar columnas */
.grid:has(> :nth-child(4)) {
    grid-template-columns: repeat(2, 1fr);
}
```

### 4. Navegación activa

```css
/* Destacar el nav item que tiene el link activo */
nav li:has(a.active) {
    background: var(--color-accent);
    border-radius: 8px;
}
```

---

## Combinar condiciones

### AND — varias condiciones (se concatenan)

```css
/* Card que tiene imagen Y está en oferta */
.card:has(img):has(.sale) {
    background: #fff3cd;
}
```

### OR — lista de selectores

```css
/* Card que tiene imagen O está en oferta */
.card:has(img, .sale) {
    /* al menos UNA condición */
}
```

### Negación con `:not()`

```css
/* Items que NO tienen descripción */
.item:not(:has(p)) {
    opacity: 0.5;
}
```

---

## Hijos directos vs cualquier descendiente

```css
/* CUALQUIER descendiente (más lento) */
.card:has(img) { }

/* Solo HIJO DIRECTO (más eficiente) */
.card:has(> img) { }
```

Usá `>` cuando sepas que el elemento es hijo directo. Es más específico y el navegador lo resuelve más rápido.

---

## Especificidad

`:has()` toma la especificidad del selector más específico que tenga adentro:

```css
.card:has(img) { }        /* específicidad: 0-1-1 */
.card:has(#hero) { }      /* específicidad: 1-1-1 — OJO! */
```

---

## Buenas prácticas

### ✅ Hacé

- Usá `:has()` para estilos condicionales sin JavaScript
- Preferí `:has(> .directo)` sobre `:has(.descendiente)` cuando puedas
- Combiná con `:not()` para los casos inversos

### ❌ No hagas

- `body:has(*)` — revisa TODO el documento, es muy lento
- `:has(:has(img))` — no se puede anidar
- Selectores demasiado profundos — afectan rendimiento

---

## Soporte (2026)

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 105+ ✅ | 121+ ✅ | 15.4+ ✅ | 105+ ✅ |

**Cobertura global**: ~94% — se puede usar en producción con progressive enhancement.

Para navegadores viejos, usá `@supports`:

```css
@supports selector(:has(*)) {
    .card:has(img) {
        border: 2px solid gold;
    }
}
```

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎮 **Tutorial interactivo** (aprender haciendo) | https://interactivecss.com/css-has-pseudo-class-interactive-tutorial/ |
| 📘 **MDN — Referencia oficial** | https://developer.mozilla.org/en-US/docs/Web/CSS/:has |
| 🎨 **CSS-Tricks — Almanac** | https://css-tricks.com/almanac/pseudo-selectors/h/has/ |
| 📗 **Guía completa 2026** | https://moderncsstools.com/guides/has-selector/ |
| 📙 **CSS :has() from scratch** | https://www.cssshowcase.com/articles/modern-css/has-from-scratch-the-parent-selector-css-always-needed |
| ✅ **Can I Use** | https://caniuse.com/css-has |
