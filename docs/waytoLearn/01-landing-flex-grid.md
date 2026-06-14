# 01 — Landing page Flexbox + Grid

> ⏱ Tiempo estimado: **40 min**
> 🎯 Dificultad: **Media**
> 📁 `CSS/bloque-2/01-landing/` — `index.html` + `style.css`

---

## 🧠 Recordatorio

### Flexbox

```css
/* Contenedor */
.contenedor {
  display: flex;
  justify-content: space-between; /* o center | flex-start | flex-end */
  align-items: center;            /* o flex-start | flex-end | stretch */
  gap: 1rem;
}

/* Items */
.item {
  flex: 1;  /* shorthand: grow shrink basis */
}
```

### Grid

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

header { grid-area: header; }
main   { grid-area: main; }
aside  { grid-area: aside; }
footer { grid-area: footer; }
/* ⚠️ header, main, aside, footer deben ser HIJOS DIRECTOS del contenedor .layout */
```

### Reset mínimo

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

---

## 🎯 Objetivo

Maquetar una landing page completa aplicando Flexbox en secciones lineales (header, hero, footer) y Grid en secciones de tarjetas (features, pricing, gallery). Sin frameworks, sin JS.

---

## 📝 Enunciado

### HTML

Creá un solo `index.html` con esta estructura semántica:

```
body
├── header
│   ├── .logo          (texto: "LOGO")
│   ├── nav > ul > li*3  (Inicio, Servicios, Contacto)
│   └── a.btn          (texto: "Empezar")
├── section.hero
│   ├── h1             ("Construí tu futuro")
│   ├── p              ("Descripción breve...")
│   └── a.btn          ("Comenzar ahora")
├── section.features
│   ├── h2             ("Características")
│   └── .feature-card * 6
│       └── cada card: h3 + p
├── section.pricing
│   ├── h2             ("Planes")
│   └── .pricing-card * 3
│       └── cada card: h3 + .price + ul > li*3 + a.btn
├── section.gallery
│   ├── h2             ("Galería")
│   └── .gallery-item * 8 (divs con colores de fondo)
└── footer
    ├── nav > a * 4
    └── p               (copyright)
```

### CSS

1. **Header** → flexbox: logo izquierda, nav centrado, botón derecha. Fondo oscuro, padding 1rem.
2. **Hero** → flexbox centrado (ambos ejes), mínimo 60vh. Fondo con gradiente (`linear-gradient`).
3. **Features** → grid `repeat(auto-fit, minmax(280px, 1fr))`. Cards con borde redondeado `border-radius: 8px` y sombra suave.
4. **Pricing** → grid con `grid-template-areas` para 3 columnas iguales. La card **"Popular"** debe verse diferente (color de fondo distinto, ligeramente más grande con `transform: scale(1.05)`).
5. **Galería** → grid `repeat(auto-fit, minmax(150px, 1fr))`. Items con `aspect-ratio: 1`. Usá colores sólidos variados como placeholder.
6. **Footer** → flexbox centrado. Mismo fondo oscuro que header.

### Condiciones

- **Sin media queries** salvo que sea imprescindible
- **Sin JavaScript**
- `gap` en vez de `margin` en grids y flex
- Archivos en `CSS/bloque-2/01-landing/`
- Cronometrado: **40 min**, sin pausas

---

## ✅ Criterios

- [ ] Header: logo-izq, nav-centro, btn-der con flexbox
- [ ] Hero: centrado vertical + horizontal, 60vh mínimo
- [ ] Features: `auto-fit` + `minmax`, responsive sin media queries
- [ ] Pricing: `grid-template-areas`, 3 columnas, card Popular distinta
- [ ] Galería: `auto-fit` + `aspect-ratio: 1`
- [ ] Footer: flexbox centrado, coherente con header
- [ ] Sin errores de sintaxis (unidades, espacios en `repeat()`)
- [ ] `gap` bien usado
- [ ] Reset incluido (`box-sizing: border-box`)
- [ ] Código limpio, sin comentarios ni console.log

---

## ⭐ Bonus (opcional)

### `:has()` en features

Cuando pasás el mouse sobre una card, que las demás se vean apagadas:

```css
.features:has(.feature-card:hover) .feature-card:not(:hover) {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
```

**`:`has()` en criollo**: selecciona un elemento si CONTIENE otro. Acá dice *"seleccioná `.features` si tiene una `.feature-card` con hover, y dentro de ese `.features`, bajale la opacidad a las cards que NO tienen hover"*.

### Transiciones
- `transition` en botones CTA (cambio de color de fondo en hover)
- `transition` en cards de pricing (el `scale` de la card Popular)

### Nav responsive
- En mobile (< 768px), ocultar el nav y mostrar un ícono ☰ (solo CSS, con un checkbox oculto)
