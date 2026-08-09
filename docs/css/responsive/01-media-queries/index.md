# Media Queries { .bloque-css }

> Las Media Queries son la base de todo el responsive: le preguntan al **navegador** (viewport, dispositivo, preferencias del usuario) para aplicar CSS condicional. Todo lo demás en Responsive — Container Queries, `clamp()` — se apoya en esta idea base.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/hrxjBqZWsb0" title="Responsive Design — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## ¿Qué son y para qué sirven? {: .topic-title }

Una media query aplica un bloque de CSS **solo si se cumple una condición** sobre el viewport o el dispositivo:

```css
@media (min-width: 768px) {
    .contenedor {
        flex-direction: row;
    }
}
```

Sin `@media`, el mismo CSS se aplica en todos los tamaños de pantalla. Con `@media`, decides **a partir de qué ancho** (o bajo qué condición) entra en juego.

<div class="demo-box">
<p class="demo-box__label">Vista previa — redimensiona la ventana del navegador</p>
<div class="demo-mq-box">Ancho grande (escritorio)</div>
<p class="demo-box__caption">Achica la ventana por debajo de 600px y el texto cambia — es una media query real actuando sobre el viewport de esta página.</p>
</div>

<style>
.demo-mq-box { padding: 0.75rem 1rem; border-radius: 8px; background: rgba(52, 211, 153, 0.15); font-weight: 600; text-align: center; }
.demo-mq-box::after { content: ""; }
@media (max-width: 600px) {
  .demo-mq-box { background: rgba(239, 68, 68, 0.15); }
  .demo-mq-box::after { content: " → Ancho pequeño (móvil)"; }
}
</style>

---

## Sintaxis básica {: .topic-title }

```css
@media (min-width: 768px) { }   /* clásica */
@media (width >= 768px) { }     /* range syntax moderna, más legible */
```

| | `min-width` / `max-width` | Range syntax (`>`, `<`, `>=`, `<=`) |
|---|---|---|
| **Soporte** | Universal, desde siempre | Navegadores modernos (2023+) |
| **Legibilidad** | Hay que recordar qué dirección apunta cada uno | Se lee como una comparación matemática normal |
| **Rangos** | Necesitas 2 media queries combinadas con `and` | Un solo `@media (768px <= width < 1024px)` |

```css
/* Clásico: rango entre 768px y 1024px */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Range syntax: mismo rango, una sola comparación */
@media (768px <= width < 1024px) { }
```

!!! tip "Si tu proyecto puede permitírselo, usa range syntax"
    Es más legible y evita el error clásico de confundir `min-width` con `max-width` al leer el código rápido. Si necesitas soportar navegadores muy viejos, quédate con la sintaxis clásica.

---

## Mobile-first: `min-width`, casi siempre {: .topic-title }

!!! warning "Regla de tu propio proyecto (CLAUDE.md)"
    Base sin media query = **mobile**. Usa `min-width` para subir a pantallas más grandes. Evita `max-width` salvo excepción justificada — es la convención que ya tienes fijada para todo el código que escribes.

```css
/* ✅ Mobile-first: base = móvil, subís con min-width */
.card {
    flex-direction: column;   /* mobile: apilado */
}

@media (min-width: 768px) {
    .card {
        flex-direction: row;  /* desktop: en fila */
    }
}
```

```css
/* ❌ Desktop-first: base = escritorio, bajás con max-width */
.card {
    flex-direction: row;
}

@media (max-width: 767px) {
    .card {
        flex-direction: column;
    }
}
```

Ambos funcionan, pero mobile-first obliga a pensar primero en la pantalla más restrictiva (la que tiene menos espacio y suele ser mayoría de tráfico real), y vas **sumando** complejidad a medida que hay más espacio disponible.

---

## Combinar condiciones {: .topic-title }

```css
/* AND: las dos condiciones a la vez */
@media (min-width: 768px) and (orientation: landscape) { }

/* OR: coma = "cualquiera de estas" */
@media (min-width: 1200px), (orientation: landscape) { }

/* NOT: invierte la condición completa */
@media not all and (min-width: 768px) { }
```

---

## Más allá del ancho: otras media features {: .topic-title }

No todo es `width`. El navegador también expone preferencias del sistema y capacidades del dispositivo:

| Media feature | Detecta | Uso típico |
|---|---|---|
| `prefers-color-scheme` | Modo oscuro/claro del sistema operativo | Adaptar colores sin pedirle al usuario que elija |
| `prefers-reduced-motion` | El usuario pidió menos animaciones (accesibilidad) | Desactivar/reducir transiciones y animaciones |
| `hover` | Si el dispositivo puede "hover" (mouse) o no (táctil) | No depender de hover en móvil |
| `pointer` | Precisión del puntero: `fine` (mouse) / `coarse` (dedo) | Botones más grandes en `pointer: coarse` |
| `orientation` | `portrait` / `landscape` | Layouts que rotan con el dispositivo |

```css
/* Modo oscuro automático, sin JS ni toggle */
@media (prefers-color-scheme: dark) {
    :root {
        --color-fondo: #1a1a1a;
        --color-texto: #f5f5f5;
    }
}

/* Respeta la preferencia de accesibilidad del usuario */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* Solo aplica estilos de hover si el dispositivo REALMENTE soporta hover */
@media (hover: hover) {
    .btn:hover {
        background: var(--color-primary);
    }
}
```

!!! danger "No asumas que hover = escritorio"
    Sin `@media (hover: hover)`, un estilo `:hover` puede quedar "pegado" en pantallas táctiles después del primer toque. Envolver los estilos de hover importantes en esta media query evita ese bug clásico en móvil.

---

## Breakpoints comunes (referencia, no regla fija) {: .topic-title }

```css
/* Valores orientativos — ajusta según tu contenido, no al revés */
@media (min-width: 480px)  { /* móvil grande */ }
@media (min-width: 768px)  { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1440px) { /* desktop grande */ }
```

!!! tip "El contenido manda, no el dispositivo"
    No diseñes "para iPhone" o "para iPad" — diseña hasta que tu layout se vea mal, y ahí pones el breakpoint. Los valores de arriba son solo un punto de partida.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Mobile-first: base sin media query, `min-width` para subir | `max-width` como default sin una razón concreta |
| Usa `prefers-reduced-motion` en animaciones no esenciales | Ignorar accesibilidad — asumir que todos quieren animaciones |
| Envuelve `:hover` en `@media (hover: hover)` si es un efecto importante | Confiar en `:hover` como única forma de dar feedback en móvil |
| Deja que el contenido defina los breakpoints | Copiar breakpoints "estándar" sin mirar tu propio diseño |
</div>

---

## Soporte (2026) {: .topic-title }

| Feature | Chrome | Firefox | Safari | Edge |
|---|:------:|:-------:|:------:|:----:|
| `@media` básico | ✅ Universal | ✅ Universal | ✅ Universal | ✅ Universal |
| Range syntax (`width > 768px`) | 104+ ✅ | 103+ ✅ | 16.4+ ✅ | 104+ ✅ |
| `prefers-color-scheme` | 76+ ✅ | 67+ ✅ | 12.1+ ✅ | 79+ ✅ |
| `prefers-reduced-motion` | 74+ ✅ | 63+ ✅ | 10.1+ ✅ | 79+ ✅ |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Using media queries** | https://developer.mozilla.org/es/docs/Web/CSS/CSS_media_queries/Using_media_queries |
| 📘 **MDN — `prefers-reduced-motion`** | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion |
| 🎥 **midudev — Responsive Design** | https://www.youtube.com/watch?v=hrxjBqZWsb0 |
| ✅ **Can I Use — Media queries range syntax** | https://caniuse.com/mdn-css_at-rules_media_range_syntax |
