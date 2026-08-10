# :not() { .bloque-css }

> `:not()` selecciona un elemento **si NO cumple** un selector dado. Es la negación lógica de CSS: en vez de decir qué quieres, dices qué quieres excluir.

---

## ¿Para qué sirve? {: .topic-title }

Sin `:not()`, para excluir un caso tienes que apoyarte en otra clase o en la cascada. Con `:not()` lo declaras directo:

```css
/* Todos los botones MENOS el que tiene .primary */
.btn:not(.primary) {
    background: #eee;
}
```

":not" en inglés significa "no". Se lee natural: *selecciona el `.btn` que NO tiene la clase `.primary`*.

---

## Sintaxis básica {: .topic-title }

```css
selector:not(otro-selector) {
    /* estilos si NO cumple otro-selector */
}
```

| Ejemplo | Significado |
|---------|-------------|
| `.card:not(.featured)` | `.card` que NO tiene la clase `.featured` |
| `li:not(:last-child)` | Todos los `li` MENOS el último |
| `input:not([disabled])` | `input` que NO tiene el atributo `disabled` |
| `.item:not(:has(img))` | `.item` que NO contiene una imagen (combinado con `:has()`) |

---

## Lista de selectores (novedad importante) {: .topic-title }

Antes solo aceptaba UN selector. Desde CSS Selectors Level 4 (soporte total en navegadores modernos), `:not()` acepta una **lista separada por comas**:

```css
/* Antes: había que encadenar :not() */
a:not(.externo):not(.descarga) { }

/* Ahora: lista directa, más legible */
a:not(.externo, .descarga) { }
```

Es una relación **OR**: excluye si coincide con CUALQUIERA de los selectores de la lista.

---

## Casos de uso principales {: .topic-title }

### 1. Excluir el último elemento de un borde

```css
.lista-items li:not(:last-child) {
    border-bottom: 1px solid #eee;
}
```

Todos los items tienen separador, menos el último (evita un borde colgando al final).

<div class="demo-box">
<p class="demo-box__label">Vista previa</p>
<ul class="demo-not-list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
<p class="demo-box__caption">Los 2 primeros tienen borde inferior — el último (<code>:last-child</code>) queda excluido por <code>:not()</code>.</p>
</div>

<style>
.demo-not-list { list-style: none; padding: 0; margin: 0; max-width: 220px; }
.demo-not-list li { padding: 0.5rem 0.75rem; }
.demo-not-list li:not(:last-child) { border-bottom: 3px solid #34D399; }
</style>

### 2. Excluir varios tipos de link a la vez

```css
a:not(.btn, .breadcrumb, [href^="#"]) {
    text-decoration: underline;
}
```

Subraya todos los links MENOS los que son botones, breadcrumbs, o anclas internas.

### 3. Combinado con `:has()` (ya lo viste en Selectores)

```css
/* Card sin imagen */
.card:not(:has(img)) {
    text-align: center;
    padding: 3rem;
}
```

### 4. Estados de formulario

```css
input:not(:focus):not(:valid) {
    border-color: #ccc;
}
```

Estilo neutro solo cuando el input NO tiene foco Y NO es válido todavía (evita marcar error mientras el usuario escribe por primera vez).

---

## Especificidad {: .topic-title }

`:not()` toma la especificidad del selector **más específico** que tenga adentro — igual criterio que `:has()`.

```css
li:not(.destacado) { }   /* especificidad: 0-1-1 (clase + tag) */
li:not(#unico) { }       /* especificidad: 1-0-1 — el ID pesa */
```

!!! warning "Un ID adentro de `:not()` también dispara la especificidad"
    Mismo gotcha que en `:has()`: si metes un ID dentro de `:not()`, toda la regla hereda esa especificidad alta. Evita IDs dentro de `:not()` si puedes usar una clase.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa la lista de selectores (`:not(.a, .b)`) en vez de encadenar `:not():not()` | Anidar `:not()` dentro de sí mismo sin necesidad — hace el selector difícil de leer |
| Combínalo con `:has()` para casos "sin X" | Meter un ID dentro de `:not()` — dispara la especificidad sin necesidad |
| Prefiérelo sobre añadir una clase extra "de exclusión" en el HTML | Abusar de `:not()` cuando una clase directa en el HTML sería más simple de leer |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 88+ ✅ | 84+ ✅ | 14+ ✅ | 88+ ✅ |

**Cobertura global**: ~97% — soporte masivo, incluida la lista de selectores desde 2021.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — `:not()`** | https://developer.mozilla.org/es/docs/Web/CSS/:not |
| 🎥 **midudev — Selectores CSS** | https://www.youtube.com/watch?v=3sPROx7lBmE |
| 🎨 **CSS-Tricks — Almanac** | https://css-tricks.com/almanac/selectors/n/not/ |
| ✅ **Can I Use** | https://caniuse.com/css-not-sel-list |
