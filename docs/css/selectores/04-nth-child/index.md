# :nth-child() avanzado { .bloque-css }

> `:nth-child()` selecciona elementos según su **posición** entre hermanos, usando una fórmula matemática. Es lo que hay detrás del "zebra striping", "los 3 primeros", o "todos menos los últimos 2".

---

## ¿Para qué sirve? {: .topic-title }

Sin `:nth-child()`, seleccionar "el elemento 3" o "los pares" te obliga a añadir clases a mano en el HTML. Con `:nth-child()` lo haces solo con CSS, según la posición real en el DOM:

```css
li:nth-child(2) {
    color: red;   /* solo el segundo <li> */
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa</p>
<ul class="demo-nth-basic">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <li>Item 4</li>
</ul>
<p class="demo-box__caption"><code>li:nth-child(2)</code> — solo el segundo item, sin tocar el HTML.</p>
</div>

<style>
.demo-nth-basic { list-style: none; padding: 0; margin: 0; display: flex; gap: 0.5rem; }
.demo-nth-basic li { padding: 0.5rem 0.75rem; border-radius: 6px; background: var(--md-default-fg-color--lightest); }
.demo-nth-basic li:nth-child(2) { background: #34D399; color: #04321f; font-weight: 700; }
</style>

---

## ⚠️ Empieza en 1, no en 0 {: .topic-title }

!!! warning "Mismo gotcha que el off-by-one de JS"
    A diferencia de los índices de array en JS (que empiezan en `0`), `:nth-child()` cuenta desde **1**. El primer elemento es `:nth-child(1)`, no `:nth-child(0)`. Es el mismo tipo de error que ya conoces de los loops: preguntarte siempre "¿desde dónde empieza a contar esto?" antes de escribir el número.

---

## Sintaxis: la fórmula `An+B` {: .topic-title }

```css
:nth-child(An+B)
```

`A` es cada cuántos elementos se repite, `B` es el desplazamiento inicial. `n` empieza en `0` y sube (0, 1, 2, 3...).

| Fórmula | Selecciona | Equivalente |
|---------|-----------|-------------|
| `2n` | Pares (2, 4, 6...) | `:nth-child(even)` |
| `2n+1` | Impares (1, 3, 5...) | `:nth-child(odd)` |
| `3n` | Múltiplos de 3 (3, 6, 9...) | — |
| `-n+3` | Los 3 primeros (1, 2, 3) | — |
| `n+4` | Del 4º en adelante | — |

<div class="demo-box">
<p class="demo-box__label">Vista previa — <code>:nth-child(odd)</code></p>
<ul class="demo-nth-odd">
  <li>Fila 1</li>
  <li>Fila 2</li>
  <li>Fila 3</li>
  <li>Fila 4</li>
  <li>Fila 5</li>
</ul>
<p class="demo-box__caption">Zebra striping: las filas impares (1, 3, 5) llevan fondo.</p>
</div>

<style>
.demo-nth-odd { list-style: none; padding: 0; margin: 0; max-width: 220px; }
.demo-nth-odd li { padding: 0.4rem 0.75rem; }
.demo-nth-odd li:nth-child(odd) { background: rgba(52, 211, 153, 0.18); }
</style>

---

## Casos de uso principales {: .topic-title }

### 1. Zebra striping (tablas o listas)

```css
tr:nth-child(even) {
    background: #f7f7f7;
}
```

### 2. Los primeros N elementos

```css
/* Destaca los 3 primeros productos */
.producto:nth-child(-n+3) {
    border: 2px solid gold;
}
```

`-n+3` se lee: cuando `n = 0` → `3`, cuando `n = -1` → `2`... pero como `n` nunca es negativo en la práctica, el navegador solo cuenta hacia abajo desde 3: selecciona el 1º, 2º y 3º.

### 3. Del elemento N en adelante

```css
/* Oculta todo después del 5º item */
.item:nth-child(n+6) {
    display: none;
}
```

### 4. `:nth-child(An+B of S)` — filtrar por selector (novedad)

Cuenta solo entre los elementos que cumplen `S`, ignorando el resto:

```css
/* De los elementos VISIBLES, resalta cada 2º */
.item:nth-child(2n of .visible) {
    background: yellow;
}
```

Sin el `of .visible`, `:nth-child(2n)` contaría TODOS los hermanos (visibles o no). Con el filtro, cuenta solo entre los que cumplen `.visible`.

---

## `:nth-child()` vs `:nth-of-type()` {: .topic-title }

Es la confusión más común con esta familia de selectores.

```html
<article>
  <h2>Título</h2>
  <p>Párrafo 1</p>
  <p>Párrafo 2</p>
</article>
```

```css
p:nth-child(2) { color: red; }   /* NO selecciona nada: el 2º HIJO es un <p>, pero cuenta TODOS los tags */
p:nth-of-type(2) { color: red; } /* Selecciona "Párrafo 2": el 2º <p>, ignorando el <h2> */
```

| | Cuenta... |
|---|---|
| `:nth-child(n)` | La posición entre **todos** los hermanos, sin importar el tag |
| `:nth-of-type(n)` | La posición solo entre hermanos **del mismo tag** |

!!! tip "Regla práctica"
    Si tu selector mezcla tags distintos (como `<h2>` + `<p>` arriba), casi siempre quieres `:nth-of-type()`. Si el contenedor solo tiene un tipo de hijo (una lista de `<li>`, una tabla de `<tr>`), da igual cuál uses.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa `even`/`odd` en vez de `2n`/`2n+1` cuando sea exactamente eso — se lee más claro | Olvidar que la cuenta empieza en 1, no en 0 |
| Usa `:nth-of-type()` cuando el contenedor mezcla varios tags | Usar `:nth-child()` esperando que "filtre por tag" — no lo hace, cuenta todos los hermanos |
| Usa `of S` (nivel 4) cuando necesites contar solo entre los que cumplen una condición | Depender de `:nth-child()` para reordenar contenido — solo selecciona, no mueve nada |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 111+ ✅ (`of S`) | 113+ ✅ (`of S`) | 9+ ✅ básico / 14+ (`of S`) | 111+ ✅ |

**Cobertura global**: `:nth-child()` básico ~99% (soporte universal desde hace años). La sintaxis `of S` es más nueva (2023+), cobertura ~93%.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — `:nth-child()`** | https://developer.mozilla.org/es/docs/Web/CSS/:nth-child |
| 📘 **MDN — `:nth-of-type()`** | https://developer.mozilla.org/es/docs/Web/CSS/:nth-of-type |
| 🎥 **midudev — Selectores CSS** | https://www.youtube.com/watch?v=3sPROx7lBmE |
| 🎨 **CSS-Tricks — nth-child tester** | https://css-tricks.com/almanac/selectors/n/nth-child/ |
| ✅ **Can I Use** | https://caniuse.com/css-nth-child-of |
