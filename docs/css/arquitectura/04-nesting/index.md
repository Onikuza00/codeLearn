# CSS Nesting { .bloque-css }

> CSS Nesting permite anidar selectores directamente en CSS nativo, sin preprocesador. Lo que antes necesitaba Sass, ahora lo corre el navegador.

---

## ¿Qué problema resuelve? {: .topic-title }

Antes, para escribir selectores anidados como en Sass, necesitabas un build step (Sass, Less, PostCSS). Ahora los navegadores modernos lo entienden nativamente:

```css
/* ❌ Sin nesting — selectores completos repetidos */
.card { padding: 1rem; }
.card .card__title { font-size: 1.5rem; }
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
```

```css
/* ✅ Con nesting nativo — todo junto, sin build step */
.card {
    padding: 1rem;

    .card__title {
        font-size: 1.5rem;
    }

    &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
}
```

---

## El símbolo `&` — el selector padre {: .topic-title }

`&` representa el selector del bloque exterior. Se usa para pseudo-clases, modificadores BEM, y combinaciones con el propio selector padre.

```css
.btn {
    background: gray;

    &:hover { background: darkgray; }       /* .btn:hover */
    &:focus { outline: 2px solid blue; }    /* .btn:focus */
    &.btn--primary { background: blue; }    /* .btn.btn--primary */
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — pasa el mouse</p>
<button class="demo-nesting-btn">Hover / focus</button>
</div>

<style>
.demo-nesting-btn { padding: 0.5rem 1rem; border-radius: 6px; border: none; background: #64748b; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.demo-nesting-btn:hover { background: #34D399; color: #04321f; }
.demo-nesting-btn:focus { outline: 2px solid #34D399; outline-offset: 2px; }
</style>

---

## ⚠️ El gotcha: selectores de tipo necesitan `&` explícito {: .topic-title }

Esto es lo que más sorprende viniendo de Sass. Si el selector anidado empieza con un **selector de tipo** (`p`, `div`, `span`, `a`...), el spec exige `&` explícito adelante — si no, es inválido.

```css
.card {
    /* ✅ Empieza con clase, pseudo-clase o combinador — no necesita & */
    .card__title { }
    &:hover { }
    > p { }

    /* ❌ Empieza con selector de TIPO sin & — inválido según el spec */
    p { color: gray; }

    /* ✅ Mismo caso, con & explícito — correcto */
    & p { color: gray; }
}
```

!!! danger "Diferencia real con Sass"
    En Sass, `p { }` anidado dentro de `.card` siempre funcionó sin pensarlo. En CSS nesting nativo, un selector de tipo suelto como primer token es ambiguo para el parser — **necesita `&` delante**. Es el error más común al migrar de Sass a nesting nativo.

---

## Anidamiento profundo y combinadores {: .topic-title }

```css
.nav {
    & > .nav__item {
        display: inline-block;

        & > a {
            color: inherit;
            text-decoration: none;
        }
    }
}
```

Funciona igual que en Sass: cada nivel de anidamiento agrega el selector padre por delante (o lo sustituye donde pongas `&`).

---

## `@media` y `@supports` anidados {: .topic-title }

Puedes anidar at-rules directamente dentro de una regla, sin repetir el selector:

```css
.card {
    display: grid;
    grid-template-columns: 1fr;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
}
```

!!! tip "Responsive colocado junto a la regla base"
    Esto mantiene el comportamiento mobile-first (base sin media query, `@media (min-width)` para subir) **junto** a la regla que modifica, en vez de tener el responsive de `.card` disperso en otro archivo o al final del CSS.

---

## Nesting nativo vs Sass — diferencias reales {: .topic-title }

| | Sass nesting | CSS nesting nativo |
|---|---|---|
| Necesita build step | Sí | No — corre en el navegador |
| `&` antes de selector de tipo | Opcional | **Obligatorio** |
| Soporte | Cualquier navegador (se compila antes) | Navegadores modernos (2023+) |
| DevTools | Ves el CSS ya compilado (plano) | Ves el nesting real, tal cual lo escribiste |

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa `&` explícito siempre que anides un selector de tipo (`p`, `div`, `span`) | Asumir que "nesting nativo" es idéntico a Sass — el `&` obligatorio es una diferencia real |
| Anida máximo 2-3 niveles — más que eso, es difícil de leer igual que en Sass | Anidar tan profundo que necesites contar llaves para saber en qué nivel estás |
| Combínalo con BEM — nesting no reemplaza nombrar bien las clases | Usar nesting para simular la jerarquía del HTML — sigue generando selectores largos y con alta especificidad |
| Anida `@media`/`@supports` para mantener el responsive junto a la regla base | Anidar por anidar cuando un selector plano ya es igual de claro |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 112+ ✅ | 117+ ✅ | 16.5+ ✅ | 112+ ✅ |

**Cobertura global**: ~93% — sólido para producción, con `@supports (selector(&))` como fallback si necesitas soportar navegadores muy viejos.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — CSS Nesting** | https://developer.mozilla.org/es/docs/Web/CSS/CSS_nesting |
| 📖 **lenguajecss.com — CSS Nesting nativo** | https://lenguajecss.com/css/calidad-de-codigo/css-nesting/ |
| ✅ **Can I Use** | https://caniuse.com/css-nesting |
