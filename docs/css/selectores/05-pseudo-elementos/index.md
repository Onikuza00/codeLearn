# Pseudo-elementos: ::before y ::after { .bloque-css }

> `::before` y `::after` generan un elemento "fantasma" dentro de otro elemento, **sin tocar el HTML**. Es la herramienta detrás de la mayoría de los trucos decorativos que ves en CSS puro: badges, tooltips, subrayados animados, comillas de cita.

---

## ¿Qué son? {: .topic-title }

A diferencia de las pseudo-clases (`:hover`, `:has()`, `:nth-child()`) que **seleccionan** elementos que ya existen, los pseudo-elementos **generan** contenido nuevo, invisible en el HTML real:

```css
.card::before {
    content: "";
}

.card::after {
    content: "";
}
```

| | Pseudo-clase | Pseudo-elemento |
|---|---|---|
| Sintaxis | Un solo `:` — `:hover` | Doble `::` — `::before` |
| Qué hace | Selecciona un estado o relación de un elemento existente | Genera un elemento nuevo dentro del elemento |
| Ejemplos | `:hover`, `:has()`, `:nth-child()` | `::before`, `::after`, `::first-letter`, `::placeholder` |

!!! tip "¿Por qué doble `::`?"
    Los navegadores también aceptan `:before`/`:after` con un solo `:` por compatibilidad con CSS2 (código viejo). La sintaxis correcta y moderna es con doble `::`, para distinguirlos claramente de las pseudo-clases.

---

## `content` es obligatorio {: .topic-title }

Sin la propiedad `content`, el pseudo-elemento **no se renderiza** — no existe, aunque le pongas otros estilos.

```css
/* ❌ No aparece nada, falta content */
.card::before {
    width: 20px;
    height: 20px;
    background: red;
}

/* ✅ Con content (aunque sea vacío), la caja existe */
.card::before {
    content: "";
    width: 20px;
    height: 20px;
    background: red;
}
```

`::before` se inserta como **primer hijo** del elemento, `::after` como **último hijo** — ambos por dentro, no por fuera.

---

## Qué puede llevar `content` {: .topic-title }

```css
.a::before { content: "Texto literal"; }
.b::before { content: attr(data-tooltip); }   /* toma el valor de un atributo HTML */
.c::before { content: "\201C"; }               /* carácter Unicode — comilla tipográfica */
.d::before { content: counter(mi-contador); }  /* contador CSS */
.e::before { content: ""; }                    /* vacío — solo caja decorativa */
```

---

## Trucos comunes {: .topic-title }

### 1. Badge decorativo sin HTML extra

```css
.card {
    position: relative;
}

.card::after {
    content: "Nuevo";
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa</p>
<div class="demo-pe-card">Card de producto</div>
</div>

<style>
.demo-pe-card { position: relative; padding: 1rem; border-radius: 8px; background: rgba(0,0,0,0.04); text-align: center; }
.demo-pe-card::after { content: "Nuevo"; position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; padding: 2px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; }
</style>

### 2. Tooltip 100% CSS con `:hover` + `attr()`

```css
.tooltip {
    position: relative;
}

.tooltip::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    background: #1a1a1a;
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    white-space: nowrap;
}

.tooltip:hover::after {
    opacity: 1;
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — pasa el mouse</p>
<span class="demo-pe-tooltip" data-tooltip="¡Acá está el tooltip!">Hover para ver el tooltip</span>
</div>

<style>
.demo-pe-tooltip { position: relative; padding: 0.5rem 0.8rem; border-radius: 6px; background: rgba(52, 211, 153, 0.15); font-weight: 600; cursor: default; }
.demo-pe-tooltip::after { content: attr(data-tooltip); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 6px; opacity: 0; pointer-events: none; transition: opacity 0.2s; background: #1a1a1a; color: white; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.75rem; white-space: nowrap; }
.demo-pe-tooltip:hover::after { opacity: 1; }
</style>

!!! tip "attr() evita duplicar el texto"
    Con `content: attr(data-tooltip)`, el texto del tooltip vive en el HTML (`data-tooltip="..."`), no repetido en el CSS. Un solo lugar para cambiarlo.

### 3. Subrayado animado

```css
.link {
    position: relative;
    text-decoration: none;
}

.link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 2px;
    background: currentColor;
    transition: width 0.3s;
}

.link:hover::after {
    width: 100%;
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — pasa el mouse</p>
<a href="#" class="demo-pe-link" onclick="return false;">Enlace con subrayado animado</a>
</div>

<style>
.demo-pe-link { position: relative; text-decoration: none; color: #047857; font-weight: 600; }
.demo-pe-link::after { content: ""; position: absolute; left: 0; bottom: -2px; width: 0; height: 2px; background: currentColor; transition: width 0.3s; }
.demo-pe-link:hover::after { width: 100%; }
</style>

> Este truco combina `::after` con `transition` — repasa `transition` en su propio temario: [Transitions](../../animaciones/01-transitions/index.md).

### 4. Comillas tipográficas en citas

```css
blockquote::before { content: "\201C"; }  /* “ */
blockquote::after  { content: "\201D"; }  /* ” */
```

!!! info "Clearfix: un truco legacy que capaz veas en código viejo"
    Antes de Flexbox/Grid, `.clearfix::after { content: ""; display: table; clear: both; }` era el truco estándar para contener floats. Hoy casi no lo necesitas, pero si ves ese patrón en un proyecto viejo, ahora sabés qué hace.

---

## ⚠️ No funcionan en elementos "reemplazados" {: .topic-title }

`::before`/`::after` no se renderizan de forma confiable en elementos como `<img>`, `<input>`, `<br>` o `<hr>` — los navegadores no tienen un modelo de caja definido para insertar contenido generado ahí adentro.

!!! danger "Gotcha real: no pongas ::before/::after en <img>"
    Si necesitas un badge o overlay sobre una imagen, no lo pongas en el `<img>` directamente — envuelve la imagen en un `<div>` con `position: relative` y aplica el pseudo-elemento a ese contenedor, no a la imagen.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Úsalos para decoración pura (badges, subrayados, comillas) | Meter contenido esencial ahí — no es seleccionable ni siempre accesible |
| Siempre pon `content`, aunque sea `content: ""` | Olvidar `content` — sin eso el pseudo-elemento no existe |
| Combina `position: absolute` en el pseudo-elemento con `position: relative` en el padre | Usar `position: absolute` sin `position: relative` en el padre — se posiciona respecto al ancestro equivocado |
| Usa `attr()` para tooltips dinámicos sin duplicar texto | Ponerlos en `<img>`, `<input>` u otros elementos reemplazados |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| ✅ Universal | ✅ Universal | ✅ Universal | ✅ Universal |

**Cobertura global**: ~99% — es CSS2/CSS3 base, soporte desde siempre.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — `::before`** | https://developer.mozilla.org/es/docs/Web/CSS/::before |
| 📘 **MDN — `::after`** | https://developer.mozilla.org/es/docs/Web/CSS/::after |
| 📘 **MDN — `content`** | https://developer.mozilla.org/es/docs/Web/CSS/content |
| 📖 **lenguajecss.com — Pseudo-elementos** | https://lenguajecss.com/css/pseudoelementos/introduccion/ |
| 🎥 **midudev — Selectores CSS** | https://www.youtube.com/watch?v=3sPROx7lBmE |
