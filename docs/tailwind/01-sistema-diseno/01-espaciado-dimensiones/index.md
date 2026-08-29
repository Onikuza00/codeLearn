# Espaciado y dimensiones { .bloque-tailwind }

> Una sola escala numérica detrás de `padding`, `margin`, `gap`, `width` y `height` — el mismo número da siempre el mismo valor real, en cualquier propiedad.

---

## Escala de espaciado {: .topic-title }

La usan `padding`, `margin`, `gap`, `width`, `height` y varias propiedades más. La unidad base es `0.25rem` (4px) por cada punto entero:

| Clase | Valor |
|---|---|
| `0` | `0px` |
| `px` | `1px` |
| `0.5` | `0.125rem` (2px) |
| `1` | `0.25rem` (4px) |
| `1.5` | `0.375rem` (6px) |
| `2` | `0.5rem` (8px) |
| `2.5` | `0.625rem` (10px) |
| `3` | `0.75rem` (12px) |
| `3.5` | `0.875rem` (14px) |
| `4` | `1rem` (16px) |

A partir de aquí ya no existe una clase para cada número — el salto entre clases se abre progresivamente: cuanto más grande el espaciado, menos falta el ajuste fino.

| Rango | Salto entre clases disponibles |
|---|---|
| `4` – `12` | de 1 en 1 → pasos de `0.25rem` (4px) |
| `12` – `16` | de 2 en 2 → pasos de `0.5rem` (8px) |
| `16` – `64` | de 4 en 4 → pasos de `1rem` (16px) |
| `64` – `80` | de 8 en 8 → pasos de `2rem` (32px) |
| `80` – `96` | salto único de `16` → `4rem` (64px) |

!!! tip "No hace falta memorizarla"
    La regla que importa es "cada punto = 0.25rem (4px)". El resto es que Tailwind no genera una clase por cada número posible en los rangos grandes — si un valor concreto no existe como clase, el valor arbitrario (`p-[50px]`) cubre el hueco.

```html
<div class="p-4 m-2 gap-4">
  <!-- padding: 1rem · margin: 0.5rem · gap: 1rem -->
</div>
```

### Padding — todas las direcciones

| Clase | Propiedad CSS |
|---|---|
| `p-` | `padding` (las 4 direcciones) |
| `pt-` | `padding-top` |
| `pr-` | `padding-right` |
| `pb-` | `padding-bottom` |
| `pl-` | `padding-left` |
| `px-` | `padding-left` + `padding-right` |
| `py-` | `padding-top` + `padding-bottom` |

```html
<div class="pt-4 px-8">
  <!-- padding-top: 1rem · padding-left/right: 2rem -->
</div>
```

### Margin — todas las direcciones

| Clase | Propiedad CSS |
|---|---|
| `m-` | `margin` (las 4 direcciones) |
| `mt-` | `margin-top` |
| `mr-` | `margin-right` |
| `mb-` | `margin-bottom` |
| `ml-` | `margin-left` |
| `mx-` | `margin-left` + `margin-right` |
| `my-` | `margin-top` + `margin-bottom` |

```html
<div class="ml-4">   <!-- margin-left: 1rem -->
<div class="mr-8">   <!-- margin-right: 2rem -->
```

!!! note "Margin negativo"
    Con signo `-` delante se invierte: `-mt-4` es `margin-top: -1rem`. Solo existe para `margin`, no para `padding` (el padding nunca puede ser negativo en CSS).

### Margin automático — centrar bloques

Cualquier clase de margin acepta `auto` como valor — el navegador reparte el espacio sobrante solo:

```html
<div class="w-64 mx-auto">
  <!-- bloque de ancho fijo, centrado horizontalmente -->
</div>
```

| Clase | Efecto |
|---|---|
| `mx-auto` | Centra horizontalmente un bloque con ancho fijo (`w-`) |
| `my-auto` | Centra verticalmente (necesita que el padre tenga altura definida) |
| `ml-auto` | Empuja el elemento hacia la derecha dentro de un `flex` |
| `mr-auto` | Empuja el elemento hacia la izquierda dentro de un `flex` |

!!! tip "El truco clásico para centrar"
    `mx-auto` **solo funciona si el elemento tiene un ancho definido** (`w-64`, `max-w-md`...) — un bloque a `w-full` ya ocupa todo el ancho disponible, así que no hay espacio sobrante que repartir y `mx-auto` no hace nada visible.

### Space between — margen entre hijos

Añade separación entre elementos hermanos sin tocar el primero ni el último — a diferencia de `gap-`, funciona en CUALQUIER contenedor, no solo `flex`/`grid`:

```html
<div class="space-y-4">
  <p>Párrafo 1</p>
  <p>Párrafo 2</p>
  <!-- margin-top: 1rem en el 2º párrafo en adelante, el 1º no lo lleva -->
</div>
```

| Clase | Efecto |
|---|---|
| `space-x-` | Margen horizontal entre hijos (excepto el primero) |
| `space-y-` | Margen vertical entre hijos (excepto el primero) |

!!! note "`gap-` vs. `space-`"
    `gap-` solo existe dentro de `display: flex`/`grid` — es la opción moderna y la que se usa por defecto. `space-x-`/`space-y-` es más antiguo (usa `margin` con selectores CSS) pero sigue siendo útil cuando el contenedor NO es flex/grid, por ejemplo una lista de párrafos normales.

### Gap direccional

`gap-` reparte el mismo hueco en ambos ejes de un `flex`/`grid`. Con `gap-x-`/`gap-y-` se controla cada eje por separado:

| Clase | Propiedad CSS |
|---|---|
| `gap-` | `gap` (fila y columna) |
| `gap-x-` | `column-gap` — hueco horizontal |
| `gap-y-` | `row-gap` — hueco vertical |

```html
<div class="grid grid-cols-3 gap-x-6 gap-y-2">
  <!-- más separación horizontal que vertical -->
</div>
```

---

## Width {: .topic-title }

Usa la misma escala de espaciado, más un set propio de palabras clave y fracciones:

| Clase | Valor |
|---|---|
| `w-<escala>` (ej. `w-64`) | Valor fijo, misma escala de arriba |
| `w-1/2`, `w-1/3`, `w-2/3`, `w-1/4`, `w-3/4` | Porcentaje, según fracción |
| `w-full` | `100%` |
| `w-screen` | `100vw` |
| `w-min` / `w-max` / `w-fit` | `min-content` / `max-content` / `fit-content` |
| `w-auto` | `auto` |

### min-width / max-width

`min-width` reutiliza palabras clave simples:

| Clase | Valor |
|---|---|
| `min-w-0` | `0px` |
| `min-w-full` | `100%` |
| `min-w-min` | `min-content` |
| `min-w-max` | `max-content` |
| `min-w-fit` | `fit-content` |

`max-width` tiene **su propia escala nombrada** — es la que se usa para limitar el ancho de bloques de contenido (párrafos, contenedores centrados):

| Clase | Valor |
|---|---|
| `max-w-xs` | `20rem` (320px) |
| `max-w-sm` | `24rem` (384px) |
| `max-w-md` | `28rem` (448px) |
| `max-w-lg` | `32rem` (512px) |
| `max-w-xl` | `36rem` (576px) |
| `max-w-2xl` … `max-w-7xl` | de `42rem` a `80rem` |
| `max-w-full` | `100%` |
| `max-w-none` | sin límite |
| `max-w-prose` | `65ch` (ancho óptimo de lectura) |

---

## Size — ancho y alto a la vez {: .topic-title }

`size-` fija `width` y `height` al mismo valor con una sola clase, en vez de repetir `w-` + `h-`:

```html
<img class="size-12 rounded-full">
<!-- equivale a: w-12 h-12 -->
```

| Clase | Valor |
|---|---|
| `size-<escala>` (ej. `size-12`) | Valor fijo, misma escala de espaciado, en ambos ejes |
| `size-1/2`, `size-1/3`... | Porcentaje, en ambos ejes |
| `size-full` | `100%` en ambos ejes |
| `size-auto` | `auto` en ambos ejes |
| `size-min` / `size-max` / `size-fit` | `min-content` / `max-content` / `fit-content` |

!!! tip "Cuándo usarla"
    Es la utility natural para cualquier elemento cuadrado: iconos, avatares, spinners. Si algún día se necesita ancho y alto distintos, ahí sí toca volver a `w-` + `h-` por separado.

---

## Height {: .topic-title }

Mismo patrón que `width`, con `h-` en vez de `w-`:

| Clase | Valor |
|---|---|
| `h-<escala>` (ej. `h-32`) | Valor fijo, misma escala de espaciado |
| `h-full` | `100%` del contenedor padre |
| `h-screen` | `100vh` |
| `h-min` / `h-max` / `h-fit` | `min-content` / `max-content` / `fit-content` |
| `h-auto` | `auto` |

### min-height / max-height

A diferencia de `max-width`, `max-height` **no** tiene una escala nombrada propia — usa la misma escala numérica que `height`, más las mismas palabras clave:

| Clase | Valor |
|---|---|
| `min-h-0` | `0px` |
| `min-h-full` | `100%` |
| `min-h-screen` | `100vh` |
| `min-h-min` / `-max` / `-fit` | `min/max/fit-content` |

| Clase | Valor |
|---|---|
| `max-h-<escala>` | Valor fijo, escala de espaciado |
| `max-h-full` | `100%` |
| `max-h-screen` | `100vh` |
| `max-h-none` | sin límite |
| `max-h-min` / `-max` / `-fit` | `min/max/fit-content` |

!!! tip "`vh`/`vw` vs. `svh`/`lvh`/`dvh`"
    En móvil, la barra del navegador aparece y desaparece al hacer scroll, y eso cambia el `100vh` real. Tailwind trae variantes: `h-dvh` (dynamic, se ajusta en vivo), `h-svh` (small, la barra siempre visible), `h-lvh` (large, la barra siempre oculta). Para pantallas completas en móvil, `h-dvh` suele ser la más fiable.

---

## Aspect ratio {: .topic-title }

Fija la proporción ancho/alto de un elemento — el navegador calcula la altura solo, en base al ancho disponible:

```html
<img class="aspect-video w-full object-cover" src="...">
<!-- siempre 16/9, sin importar el ancho -->
```

| Clase | Proporción |
|---|---|
| `aspect-square` | `1 / 1` |
| `aspect-video` | `16 / 9` |
| `aspect-auto` | La proporción natural del contenido (por defecto) |
| `aspect-[4/3]` | Valor arbitrario, cualquier proporción |

!!! tip "El caso de uso más común: imágenes y vídeos"
    Sin `aspect-`, una imagen deja un hueco en blanco o se deforma hasta que carga y se conoce su tamaño real. Fijar `aspect-video`/`aspect-square` reserva el espacio desde el primer render — evita el salto de layout (*layout shift*) cuando la imagen termina de cargar.

---

## 📖 Referencias

- 📘 **Documentación oficial — Padding** — https://tailwindcss.com/docs/padding
- 📘 **Documentación oficial — Margin** — https://tailwindcss.com/docs/margin
- 📘 **Documentación oficial — Width** — https://tailwindcss.com/docs/width
- 📘 **Documentación oficial — Height** — https://tailwindcss.com/docs/height
- 📘 **Documentación oficial — Aspect ratio** — https://tailwindcss.com/docs/aspect-ratio
