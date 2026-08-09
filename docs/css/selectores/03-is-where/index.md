# :is() y :where() { .bloque-css }

> `:is()` y `:where()` agrupan una lista de selectores en uno solo, para no repetir el mismo prefijo una y otra vez. La diferencia entre ambos está en la **especificidad**.

---

## ¿Para qué sirven? {: .topic-title }

Sin agrupar, cuando varios selectores comparten un mismo "camino", tienes que escribirlo completo cada vez:

```css
/* ❌ Repetitivo */
header h1,
header h2,
header h3 {
    font-family: var(--font-heading);
}
```

Con `:is()` (o `:where()`), lo agrupas:

```css
/* ✅ Agrupado */
header :is(h1, h2, h3) {
    font-family: var(--font-heading);
}
```

---

## Sintaxis básica {: .topic-title }

```css
contenedor :is(a, b, c) { }
contenedor :where(a, b, c) { }
```

Ambos aceptan una lista de selectores separada por comas y significan lo mismo semánticamente: "cualquiera de estos".

<div class="demo-box">
<p class="demo-box__label">Vista previa</p>
<div class="demo-is-card">
  <h4>Título h4</h4>
  <h5>Subtítulo h5</h5>
  <p>Párrafo normal, sin cambios</p>
</div>
<p class="demo-box__caption"><code>.demo-is-card :is(h4, h5)</code> — el párrafo queda fuera del grupo.</p>
</div>

<style>
.demo-is-card { padding: 0.75rem 1rem; border: 1px dashed var(--md-default-fg-color--lightest); border-radius: 8px; }
.demo-is-card :is(h4, h5) { color: #34D399; margin: 0.25rem 0; }
.demo-is-card p { margin: 0.25rem 0; }
</style>

---

## La diferencia clave: especificidad {: .topic-title }

| | `:is()` | `:where()` |
|---|---------|------------|
| **Especificidad** | La del selector **más específico** de la lista | **Siempre 0** (cero), sin importar la lista |
| **Uso típico** | Agrupar selectores del día a día | Resets, baselines, librerías que no quieren pisar nada |

```css
/* :is() toma la especificidad del más fuerte → aquí, el ID */
:is(.card, #hero) { }     /* especificidad: 1-0-0 */

/* :where() siempre pesa CERO, sin importar lo que haya adentro */
:where(.card, #hero) { }  /* especificidad: 0-0-0 */
```

!!! tip "Cuándo usar cada uno"
    Si necesitas que tu regla **pueda ser sobrescrita fácilmente** después (por ejemplo, un reset de tipografías), usa `:where()` — su especificidad cero hace que cualquier clase normal le gane. Si simplemente quieres agrupar sin pensar en la cascada, usa `:is()`.

---

## Casos de uso principales {: .topic-title }

### 1. Simplificar selectores anidados largos

```css
/* ❌ Sin agrupar */
.card h1 a,
.card h2 a,
.card h3 a {
    color: inherit;
}

/* ✅ Con :is() */
.card :is(h1, h2, h3) a {
    color: inherit;
}
```

### 2. Resets de librería con `:where()`

```css
/* Un reset que NO compite con tus propias clases */
:where(ul, ol) {
    margin: 0;
    padding: 0;
    list-style: none;
}
```

Como `:where()` pesa cero, cualquier `.mi-lista { list-style: disc; }` que escribas después gana sin necesitar `!important`.

### 3. Combinarlos con pseudo-clases

```css
:is(button, a.btn):hover {
    opacity: 0.85;
}
```

Aplica el mismo hover a botones reales y a links que actúan como botón.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa `:where()` para resets y estilos base reutilizables | Usar `:is()` en un reset — hereda la especificidad más alta y es difícil de sobrescribir después |
| Usa `:is()` para agrupar selectores del día a día sin pensarlo mucho | Anidar `:is()` dentro de `:is()` sin necesidad |
| Combínalos con `:not()` y `:has()` para expresar lógica compleja de forma legible | Meter selectores muy distintos en el mismo grupo solo para ahorrar líneas — perjudica la legibilidad |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 88+ ✅ | 78+ ✅ | 14+ ✅ | 88+ ✅ |

**Cobertura global**: ~96% — listo para producción.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — `:is()`** | https://developer.mozilla.org/es/docs/Web/CSS/:is |
| 📘 **MDN — `:where()`** | https://developer.mozilla.org/es/docs/Web/CSS/:where |
| 🎥 **midudev — Selectores CSS** | https://www.youtube.com/watch?v=3sPROx7lBmE |
| 🎨 **CSS-Tricks — Almanac** | https://css-tricks.com/almanac/selectors/i/is/ |
| ✅ **Can I Use** | https://caniuse.com/css-matches-pseudo |
