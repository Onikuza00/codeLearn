# BEM { .section-bem }

> **B**lock **E**lement **M**odifier es una metodología de nomenclatura para clases CSS. No es una tecnología — no necesitás instalar nada. Es solo una **convención para nombrar clases** de forma que el CSS sea predecible, escalable y mantenible.

---

## ¿Qué problema resuelve?

Sin convención, los nombres de clase son un caos:

```css
/* ❌ Sin BEM — nombres que no dicen nada */
.card { }
.title { }
.desc { }
.featured-card { }
.link-card { }
```

- ¿`.title` es de la card o del header?
- ¿`.featured-card` es una variante o otra cosa?
- Si querés cambiar el estilo de un título, ¿buscás `.title`, `.card-title`, `.featured-title`?

**BEM responde: cada clase tiene un rol fijo y sabés exactamente qué pinta.**

---

## Los 3 niveles

```css
/* BLOQUE — el componente */
.card { }

/* ELEMENTO — una parte del bloque (__) */
.card__title { }
.card__icon { }
.card__link { }

/* MODIFICADOR — variante del bloque (--) */
.card--featured { }
.card--dark { }
```

---

### 🧱 Bloque (Block)

El componente contenedor. Es la **raíz**. Una card, un header, un formulario, un botón.

```css
.feature-card { }
.header { }
.form { }
```

---

### 🧩 Elemento (Element)

Una **parte** del bloque que NO tiene sentido fuera de él. Se separa con `__`

```css
.feature-card__icon { }
.feature-card__title { }
.feature-card__desc { }
.feature-card__link { }
```

La regla de oro: **nunca anides selectores**. No importa si el título está dentro de un `<h3>` o un `<div>`, la clase ya sabe qué es.

```css
/* ❌ MAL — atado al tag y a la jerarquía */
.feature-card h3 { }

/* ✅ BIEN — la clase es autosuficiente */
.feature-card__title { }
```

---

### ✨ Modificador (Modifier)

Una **variante** del bloque o elemento. Se separa con `--`

```css
/* Variantes del bloque */
.feature-card--featured { }
.feature-card--dark { }
.feature-card--compact { }
```

No repetís todo el bloque — solo escribís **lo que cambia**:

```css
.feature-card--featured {
    background: #f8eba2;
    border-color: gold;
}
```

---

## En la práctica

### HTML con BEM

```html
<section class="features">
    <article class="feature-card feature-card--featured">
        <div class="feature-card__icon">📊</div>
        <h3 class="feature-card__title">Analytics Dashboard</h3>
        <p class="feature-card__desc">Real-time data visualization</p>
        <a class="feature-card__link" href="#">Learn more →</a>
    </article>
</section>
```

### CSS con BEM

```css
.feature-card {
    /* Base — todas las cards comparten esto */
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.feature-card--featured {
    /* Solo la card destacada */
    background: #f8eba2;
    border: 2px solid gold;
}

.feature-card__icon {
    font-size: 3rem;
    text-align: center;
}

.feature-card__title {
    font-size: 1.5rem;
    font-weight: 700;
}
```

---

## Lo que NO es BEM

```css
/* ❌ Anidar como si fuera Sass anidado */
.feature-card__title__span { }   /* No existe "elemento de elemento" */

/* ❌ Bloque + bloque */
.feature-card__featured { }      /* "featured" es modificador, no elemento */

/* ❌ Elemento que podría ser bloque */
.card__btn-primary { }     /* Un botón es su propio bloque, no un elemento de card */
```

**Cuando un elemento merece ser su propio componente**, separate:

```html
<article class="feature-card">
  <button class="btn btn--primary">Comprar</button>
</article>
```

`.btn` es un bloque independiente que se REUTILIZA. No es parte de `feature-card`.

---

## Ventajas de BEM

| Ventaja | Explicación |
|---------|-------------|
| **Legibilidad** | Sabés qué hace una clase solo con leerla |
| **Especificidad plana** | Todas las clases tienen especificidad 0-1-0. Sin guerras de `!important` |
| **Reutilización** | Movés una card a otro lado y los estilos la siguen |
| **Sin anidamiento** | No necesitás Sass/SCSS para tener CSS limpio |
| **Escalable** | 10 o 1000 componentes funcionan igual |

---

## BEM + otras herramientas

BEM no compite con nada — convive con todo:

```css
/* BEM con variables CSS */
.feature-card {
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
}

/* BEM con @layer */
@layer components {
    .feature-card { ... }
}

/* BEM con container queries */
@container cards (min-width: 400px) {
    .feature-card {
        flex-direction: row;
    }
}
```

---

## Buenas prácticas

### ✅ Hacé

- Usá nombres semánticos: `.feature-card__title`, no `.feature-card__t`
- Un solo nivel de elemento: `card__title`, no `card__title__wrapper`
- Los modificadores SOLOS no existen: `.feature-card--featured` sin `.feature-card` no pinta nada

### ❌ No hagas

- `feature-card__title__span` — no existe elemento de elemento
- `.card__btn--primary` si el botón se reusa fuera de la card
- BEM en componentes que ya encapsulan CSS (Vue SFC, Web Components)

---

## 📖 Recursos

| Recurso | Link |
|---------|------|
| 📘 **BEM — Documentación oficial** | https://getbem.com/ |
| 📗 **CSS-Tricks — BEM 101** | https://css-tricks.com/bem-101/ |
| 📙 **Guía oficial Yandex** | https://en.bem.info/methodology/css/ |
| 🇪🇸 **Andros Fenollosa — Lección BEM** (recomendado) | https://andros.dev/cursos/css/6/bem/ |
| 🇪🇸 **Platzi — Guía BEM para CSS** | https://platzi.com/blog/bem/ |
| 🎥 **midudev — Convenciones CSS** | https://www.youtube.com/watch?v=7nMFq6fIuZQ |
