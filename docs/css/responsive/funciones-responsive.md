# Funciones responsive { .section-responsive .bloque-css }

Patrones y funciones CSS que se adaptan al contexto del contenedor.

---

## `flex: grow shrink basis`

### 1 columna mobile, 2 columnas desktop

```css
.card {
    flex: 1 1 100%;                /* mobile: ocupa todo el ancho */
}

@media (width > 768px) {
    .card {
        flex: 1 1 calc(50% - gap); /* desktop: mitad del contenedor */
    }
}
```

**Cómo funciona:**

- `flex-grow: 1` — si sobra espacio, la card se estira
- `flex-shrink: 1` — si falta espacio, la card se encoge
- `flex-basis: calc(50% - var(--gap))` — el tamaño base es la mitad del contenedor menos el gap, así entran justo 2 por fila

!!! warning "El calc() tiene que restar el gap"
    { .flex }
    `flex-basis` no incluye el gap. Sin restarlo, `50% + 50% + gap` desborda y la segunda card se va abajo.

---

## Grid responsive sin media queries

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
}
```

**Cómo funciona:**

| Ancho del contenedor | Columnas | Card mide ~ |
|---------------------|----------|------------|
| 300px               | 1        | 260px      |
| 550px               | 2        | 260px      |
| 800px               | 3        | 260px      |
| 1000px              | 3-4      | 260px      |

- `auto-fit` mete tantas columnas de 260px como quepan
- Si sobra espacio, `1fr` lo reparte entre las columnas
- Cuando no cabe otra columna de 260px, pasa a fila siguiente
- **0 media queries**

### auto-fit vs auto-fill

```css
/* auto-fit: colapsa columnas vacías, se estira para llenar */
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

/* auto-fill: mantiene columnas vacías, deja huecos */
grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
```

---

## `clamp()` para tipografía fluida

```css
.titulo {
    font-size: clamp(2rem, 5vw, 4rem);
    /*            mínimo  preferido  máximo */
}
```

- En mobile ~375px: `5vw` = 18.75px → usa el mínimo de 2rem (32px)
- En desktop ~1024px: `5vw` = 51.2px → usa el máximo de 4rem (64px)
- En medio: escala suavemente entre mínimo y máximo

### También sirve para espaciado, no solo tipografía

```css
.seccion {
    padding: clamp(1rem, 4vw, 3rem);
}
```

Mismo patrón: padding chico en mobile, grande en desktop, escalando suave en el medio — sin media queries.

---

## `min()` y `max()` — límites sin condicionales

`clamp()` en realidad es un atajo de estos dos combinados: `clamp(MIN, preferido, MAX)` = `max(MIN, min(preferido, MAX))`.

```css
.sidebar {
    width: min(300px, 100%);
    /* nunca más de 300px, pero se achica si la pantalla no tiene espacio */
}

.contenido {
    width: max(50%, 400px);
    /* nunca menos de 400px, aunque el 50% del contenedor sea menor */
}
```

| Función | Usa... | Sirve como... |
|---|---|---|
| `min(a, b)` | El valor MÁS CHICO de la lista | Techo — "nunca más de X" |
| `max(a, b)` | El valor MÁS GRANDE de la lista | Piso — "nunca menos de X" |

<div class="demo-box">
<p class="demo-box__label">Vista previa — redimensiona la ventana del navegador</p>
<div class="demo-minmax-box">width: min(300px, 100%)</div>
<p class="demo-box__caption">La caja nunca pasa de 300px, pero se achica si la ventana no tiene espacio. Probalo achicando el navegador.</p>
</div>

<style>
.demo-minmax-box { width: min(300px, 100%); padding: 0.6rem 0.9rem; border-radius: 8px; background: rgba(52, 211, 153, 0.15); font-size: 0.85rem; text-align: center; }
</style>

!!! tip "Cuándo usar cada uno"
    `min()` para poner un techo (una sidebar que no debe pasar de cierto ancho). `max()` para poner un piso (una columna que nunca debe achicarse demasiado). `clamp()` cuando necesitas ambos límites a la vez.

---

## `aspect-ratio` — proporción sin hacks

```css
.video-wrapper {
    aspect-ratio: 16 / 9;
}

img {
    aspect-ratio: 1 / 1;
    object-fit: cover;   /* recorta sin deformar */
}
```

!!! warning "Antes de aspect-ratio: el hack del padding-top"
    Antes de esta propiedad (soporte total desde 2021), mantener una proporción responsive requería el truco `padding-top: 56.25%` (para 16:9) sobre un contenedor con `height: 0`. Si ves ese patrón en código viejo, es exactamente lo que `aspect-ratio` reemplaza en una sola línea.

`aspect-ratio` sin `object-fit` en una imagen la **deforma** para llenar la proporción — combínalos siempre que la imagen no tenga ya el ratio exacto.

---

## Container Queries — dónde poner el contenedor en un grid

> Sintaxis completa y reglas de `@container` en su propio temario: [Container Queries](02-container-queries/index.md).

Un caso concreto que no está cubierto en el temario general: **dónde declarar el `container` cuando trabajas con un grid de cards**.

Cuando cada card tiene tamaño similar en mobile y desktop (por `minmax`), es mejor poner el container en el **grid padre**, no en cada card. Así el breakpoint diferencia claramente mobile (~300-350px) de desktop (700px+).

```css
.grid {
    container: grid-cards / inline-size;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.card {
    display: flex;
    flex-direction: column;    /* mobile: columna */
}

@container grid-cards (min-width: 500px) {
    .card {
        flex-direction: row;  /* desktop: fila */
    }
}
```

---

## Puntos clave a recordar

1. `flex-basis` se calcula sobre el tamaño del **contenedor padre flex**, no sobre el viewport
2. `calc(50% - gap)` es necesario porque `flex-basis` no descuenta el gap automáticamente
3. `auto-fit` ≠ `auto-fill`: el primero colapsa columnas vacías, el segundo las mantiene
4. En Container Queries, el contenedor mide el inline-size del **elemento contenedor**, no del viewport. Un breakpoint de 500px en el grid se dispara con 700px+ de pantalla (el grid suele ser ~viewport menos padding)
5. `rgb()` **sí acepta opacidad** desde CSS Color Level 4 (soporte total en navegadores modernos): `rgb(255 0 0 / 50%)`. `rgba()` es hoy un alias de `rgb()` — funcionan igual, `rgb()` con slash es la sintaxis moderna recomendada
6. `clamp(MIN, preferido, MAX)` = `max(MIN, min(preferido, MAX))` — son la misma familia de funciones
7. `aspect-ratio` reemplaza el hack `padding-top` — combínalo con `object-fit: cover` en imágenes

---

## 📖 Recursos

| Recurso | Link |
|---------|------|
| 📘 **MDN — Función `rgb()`** | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb |
| 📘 **MDN — `calc()`** | https://developer.mozilla.org/en-US/docs/Web/CSS/calc |
| 📘 **MDN — `clamp()`** | https://developer.mozilla.org/en-US/docs/Web/CSS/clamp |
| 📘 **MDN — `min()`** | https://developer.mozilla.org/en-US/docs/Web/CSS/min |
| 📘 **MDN — `max()`** | https://developer.mozilla.org/en-US/docs/Web/CSS/max |
| 📘 **MDN — `aspect-ratio`** | https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio |
