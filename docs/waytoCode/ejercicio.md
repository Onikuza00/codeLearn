# 🎯 Ejercicio activo

> Esta página se sobreescribe con cada nuevo ejercicio. La estructura se mantiene: recordatorio → enunciado → criterios → bonus.

---

## 01 — Landing page Flexbox + Grid

> ⏱ Tiempo estimado: **40 min**
> 📁 `CSS/bloque-2/01-landing/` — `index.html` + `style.css`

---

### 🧠 Recordatorio

#### Flexbox

```css
.contenedor {
  display: flex;
  justify-content: space-between; /* o center | flex-start | flex-end */
  align-items: center;
  gap: 1rem;
}
.item {
  flex: 1;  /* grow shrink basis */
}
```

#### Grid

```css
/* Tarjetas responsive */
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Layout con áreas */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "main   main   aside"
    "footer footer footer";
  gap: 1rem;
}
header { grid-area: header; } /* HIJOS DIRECTOS del contenedor */
main   { grid-area: main; }
aside  { grid-area: aside; }
footer { grid-area: footer; }
```

#### Reset

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

---

### 🎯 Objetivo

Maquetar una landing page completa: Flexbox en secciones lineales (header, hero, footer) y Grid en secciones de tarjetas (features, pricing, gallery). Sin JS, sin frameworks.

---

### 📝 Enunciado

#### HTML

```
body
├── header
│   ├── .logo          ("LOGO")
│   ├── nav > ul > li*3
│   └── a.btn          ("Empezar")
├── section.hero
│   ├── h1             ("Construí tu futuro")
│   ├── p              (descripción)
│   └── a.btn          ("Comenzar ahora")
├── section.features
│   ├── h2             ("Características")
│   └── .feature-card * 6 (h3 + p)
├── section.pricing
│   ├── h2             ("Planes")
│   └── .pricing-card * 3 (h3 + .price + ul + a.btn)
├── section.gallery
│   ├── h2             ("Galería")
│   └── .gallery-item * 8 (colores sólidos)
└── footer
    ├── nav > a * 4
    └── p              (copyright)
```

#### CSS

| Sección | Técnica | Detalle |
|---------|---------|---------|
| Header | Flexbox | logo izq, nav centro, btn der. Fondo oscuro |
| Hero | Flexbox | Centrado ambos ejes, min 60vh, gradiente |
| Features | Grid | `repeat(auto-fit, minmax(280px, 1fr))`, cards con sombra |
| Pricing | Grid áreas | 3 columnas con `grid-template-areas`, card Popular destacada |
| Gallery | Grid | `repeat(auto-fit, minmax(150px, 1fr))`, `aspect-ratio: 1` |
| Footer | Flexbox | Centrado, mismo fondo oscuro que header |

#### Condiciones

- Sin media queries (salvo necesario)
- `gap` en vez de `margin`
- Sin JS
- **40 min cronometrado**

---

### ✅ Criterios

- [ ] Header: logo-izq, nav-centro, btn-der con flexbox
- [ ] Hero: centrado vertical + horizontal, 60vh
- [ ] Features: `auto-fit` + `minmax`, responsive
- [ ] Pricing: `grid-template-areas`, 3 cols, Popular distinta
- [ ] Gallery: `auto-fit` + `aspect-ratio: 1`
- [ ] Footer: flexbox centrado
- [ ] Sin errores de sintaxis (unidades, espacios en `repeat()`)
- [ ] Reset con `box-sizing: border-box`
- [ ] Código limpio

---

### ⭐ Bonus (opcional)

#### `:has()` en features

Al hover sobre una card, las demás se atenúan:

```css
.features:has(.feature-card:hover) .feature-card:not(:hover) {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
```

`:has()` selecciona un elemento si CONTIENE otro. Acá: *"seleccioná .features si contiene una card con hover, y dentro bajale la opacidad a las que NO tienen hover"*.

#### Transiciones
- `transition` en botones CTA
- `transition` en la card Popular (`scale`)

#### Nav responsive
- En mobile (< 768px), ocultar nav y mostrar ☰ (solo CSS con checkbox oculto)
