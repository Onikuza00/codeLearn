# CSS Layers { .section-layers .bloque-css }

> `@layer` permite declarar capas de CSS con prioridad explícita. El orden de las capas define qué gana, sin importar especificidad ni orden de carga. Adiós a los `!important` de emergencia.

---

## El problema que resuelven {: .topic-title }

CSS tiene un problema de base: **todo compite por especificidad**.

Imagina que tienes:

1. Un `reset.css` de terceros
2. Un `components.css` con tus componentes
3. Un `utilities.css` con helpers

Sin layers, el orden de carga define quién pisa a quién. Pero si `reset.css` tiene selectores con más especificidad que tus componentes, el reset gana aunque lo hayas cargado primero. O terminás usando `!important` para romper el empate.

**Con layers, tú decides el orden de prioridad:**

```css
@layer reset, components, utilities;
```

Y después escribís cada cosa en su capa. El orden de las capas define quién gana, **no la especificidad**.

---

## Sintaxis básica {: .topic-title }

### Declarar capas (una sola vez, al principio)

```css
@layer reset, base, components, utilities;
```

Esto declara 4 capas en orden de **menor a mayor prioridad**:
- `reset` es la menos prioritaria
- `utilities` es la que más prioridad tiene

Todo lo que esté FUERA de capas (estilos "sueltos") tiene la máxima prioridad, por encima de cualquier capa.

### Asignar estilos a una capa

```css
@layer reset {
    *,
    *::before,
    *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
}

@layer base {
    body {
        font-family: system-ui, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
    }
}

@layer components {
    .card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
}

@layer utilities {
    .text-center { text-align: center; }
    .mt-4 { margin-top: 1rem; }
}
```

### Declarar + asignar en un solo paso

No necesitas la línea de declaración si asignas directamente:

```css
@layer reset {
    /* ... */
}
```

!!! tip "Declara el orden primero"
    CSS crea la capa automáticamente si no existe, pero declarar primero el orden es más seguro y hace explícita la jerarquía.

---

## Orden de prioridad (lo más importante) {: .topic-title }

El orden de las capas define **todo**:

```css
@layer A, B, C;
```

| Prioridad | Gana |
|-----------|------|
| 🔥 Máxima | Estilos sin capa (no-`@layer`) |
| 3️⃣ | Capa C (la última) |
| 2️⃣ | Capa B |
| 1️⃣ | Capa A (la primera) |

**Dentro de una misma capa**: sigue aplicando la cascada normal (especificidad + orden de origen).

Una vez que entiendes esto, `@layer` es simplemente **especificidad controlada por ti**.

### Ejemplo visual

```css
@layer base, theme;

@layer base {
    .btn {
        background: gray;
        color: white;
    }
}

@layer theme {
    .btn {
        background: blue; /* GANA aunque tenga la misma especificidad */
    }
}
```

Aquí `.btn` se ve azul aunque los dos tengan la misma especificidad. ¿Por qué? Porque `theme` está declarada DESPUÉS de `base` en `@layer base, theme`.

---

## Anidar capas (subcapas) {: .topic-title }

Puedes tener capas dentro de capas para proyectos grandes:

```css
@layer framework {
    @layer reset, base, theme;
}

@layer framework.reset { /* ... */ }
@layer framework.base  { /* ... */ }
@layer framework.theme { /* ... */ }
```

Las subcapas siguen el mismo orden de prioridad, pero anidadas dentro de su capa padre.

**¿Para qué sirve?** Para encapsular bibliotecas de terceros o frameworks enteros en una sola capa. No importa cómo estructuren su CSS internamente, tú decides si el framework va antes o después de tus componentes.

```css
@layer bootstrap, my-components;

/* Todo Bootstrap cae en su capa con su propia jerarquía interna */
@layer bootstrap {
    @layer reset, base, components;
}

@layer my-components {
    @layer card, form, nav;
}
```

---

## `!important` dentro de capas (ojo con esto) {: .topic-title }

`!important` invierte la prioridad de las capas:

| Sin `!important` | Con `!important` |
|-----------------|------------------|
| Gana la capa más prioritaria | Gana la capa **menos** prioritaria |

```css
@layer low, high;

@layer low {
    .text { color: red !important; } /* GANA sobre high */
}

@layer high {
    .text { color: blue; }
}
```

`!important` es una excepción de último recurso. Con layers ya no deberías necesitarlo casi nunca.

---

## Casos de uso reales {: .topic-title }

### 1. Reset + componentes + utilidades (el clásico)

```css
@layer reset, base, components, utilities;

@import url("reset.css") layer(reset);
@import url("typography.css") layer(base);
@import url("cards.css") layer(components);
@import url("grid.css") layer(components);
@import url("spacing.css") layer(utilities);
```

Cada archivo se mete en su capa. No importa el orden de los `@import` — el orden de las capas lo decide todo.

### 2. Tema oscuro sin `!important`

Sin layers, cuando quieres sobrescribir estilos para el tema oscuro, muchas veces necesitas `!important` porque la especificidad del original es muy alta.

Con layers:

```css
@layer base, theme;

@layer base {
    .card {
        background: white;
        color: #1a1a1a;
    }
}

@layer theme {
    html[data-theme="dark"] .card {
        background: #1a1a1a;   /* Gana aunque la especificidad sea igual */
        color: white;
    }
}
```

### 3. Aislar CSS de terceros

```css
@layer vendor, app;

/* Todo el CSS de Bootstrap cae en vendor */
@import url("bootstrap.min.css") layer(vendor);

@layer app {
    /* Tus estilos, ganan siempre sobre vendor */
}
```

Bootstrap puede tener la especificidad que quiera. Como está en la capa `vendor` y tus estilos en `app`, los tuyos ganan siempre.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Declara las capas al inicio del archivo principal, con el orden explícito | Usar `!important` dentro de capas — rompe la lógica y es confuso |
| Usa pocas capas — 3 a 5 es suficiente para la mayoría de proyectos | Crear muchas capas — más de 6-7 y pierdes el control |
| Pon utilidades en la última capa (antes de estilos sin capa) — así siempre ganan | Mezclar estilos con capa y sin capa sin entender la prioridad (los sin capa ganan siempre) |
| Usa `@import` con `layer()` para integrar librerías externas | Usar layers para problemas de especificidad que BEM resuelve mejor — son complementarios |
| Piensa en capas como acuerdos de equipo — define el orden una vez y no lo cambies | |
</div>

---

## Layers + BEM {: .topic-title }

No compiten, se complementan:

| BEM | Layers |
|-----|--------|
| Controla nombres de clase | Controla orden de prioridad |
| Evita conflictos de nombres | Evita conflictos de especificidad |
| Funciona a nivel de componente | Funciona a nivel de arquitectura |
| Lo usa quien escribe el CSS | Lo usa quien organiza el proyecto |

Ejemplo combinado:

```css
@layer base, components, utilities;

@layer base {
    .heading { font-family: var(--font-heading); }
}

@layer components {
    .card__title--large {
        font-size: 2rem; /* BEM mantiene especificidad baja */
    }
}

@layer utilities {
    .u-text-center { text-align: center; }
}
```

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 99+ ✅ | 97+ ✅ | 15.4+ ✅ | 99+ ✅ |

**Cobertura global**: ~95% — completamente listo para producción. Es de las features modernas con mejor adopción.

---

## 📖 Recursos

| Recurso | Link |
|---------|------|
| 📘 **MDN — `@layer`** | https://developer.mozilla.org/en-US/docs/Web/CSS/@layer |
| 🎥 **midudev — Cómo organizar CSS** | https://www.youtube.com/watch?v=lFZc3bqWLo0 |
| 🎥 **Kevin Powell — CSS Layers** | https://www.youtube.com/watch?v=6z4G_5tuyAs |
| 📗 **Guía completa — Una Kravets** | https://css-tricks.com/css-cascade-layers/ |
| ✅ **Can I Use** | https://caniuse.com/css-cascade-layers |

---

> 🧠 **Resumen mental**: `@layer` te da control sobre qué estilos ganan sin usar especificidad. Declara el orden al inicio, escribe cada cosa en su capa, y olvídate de los `!important`.
