# Funciones responsive { .section-responsive }

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

**Importante:** el `calc()` resta el gap porque `flex-basis` no incluye el gap. Sin restarlo, `50% + 50% + gap` desborda y la segunda card se va abajo.

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

---

## Container Queries

```css
.contenedor {
    container: nombre / inline-size;
}

@container nombre (min-width: 500px) {
    .hijo {
        flex-direction: row;
    }
}
```

**Regla clave:** el `@container` solo puede estilar **descendientes** del contenedor, no al contenedor mismo. Si el contenedor es `.grid`, no puedes hacer `@container { .grid { ... } }`.

### Container en el grid (recomendado)

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

## `:has()` condicional

```css
.card:has(.badge) {
    border-color: var(--c-active);
}
```

Selecciona la card **solo si** contiene un `.badge`. Útil para destacar cards con ciertas características sin tener que agregar clases extra.

---

## Puntos clave a recordar

1. `flex-basis` se calcula sobre el tamaño del **contenedor padre flex**, no sobre el viewport
2. `calc(50% - gap)` es necesario porque `flex-basis` no descuenta el gap automáticamente
3. `auto-fit` ≠ `auto-fill`: el primero colapsa columnas vacías, el segundo las mantiene
4. En Container Queries, el contenedor mide el inline-size del **elemento contenedor**, no del viewport. Un breakpoint de 500px en el grid se dispara con 700px+ de pantalla (el grid suele ser ~viewport menos padding)
5. `rgb()` no acepta opacidad → usa `rgba()` para colores con transparencia
