# Colores { .bloque-tailwind }

> Cada color de la paleta trae 11 tonos ya calculados — de casi blanco a casi negro — para no tener que inventar variaciones a mano.

---

## Paleta y shades {: .topic-title }

```html
<div class="bg-sky-500 text-white">
<div class="bg-sky-100 text-sky-900">
```

Cada color de la paleta (`sky`, `red`, `emerald`, `slate`...) trae una escala de shades del `50` (casi blanco) al `950` (casi negro):

| Shade | Uso típico |
|---|---|
| `50`–`100` | Fondos muy suaves |
| `400`–`600` | El tono "base" del color — botones, acentos |
| `700`–`950` | Texto sobre fondo claro, modo oscuro |

Los prefijos son los mismos de siempre: `bg-`, `text-`, `border-`, `fill-`, `stroke-`.

---

## Opacidad {: .topic-title }

La opacidad se aplica con `/` después del color, sin necesidad de una clase aparte:

```html
<div class="bg-black/50">     <!-- fondo negro al 50% de opacidad -->
<p class="text-slate-900/75"> <!-- texto al 75% -->
```

---

## Degradados {: .topic-title }

```html
<div class="bg-gradient-to-r from-sky-500 to-blue-500">
  <!-- degradado horizontal, de sky-500 a blue-500 -->
</div>
```

| Clase | Función |
|---|---|
| `bg-gradient-to-r` / `-l` / `-t` / `-b` / `-tr`... | Dirección del degradado |
| `from-<color>` | Color inicial |
| `via-<color>` | Color intermedio (opcional) |
| `to-<color>` | Color final |

### Texto con degradado

```html
<h1 class="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
  Título con degradado
</h1>
```

`bg-clip-text` recorta el fondo (el degradado) a la silueta exacta del texto; `text-transparent` hace que el texto en sí no tape ese fondo. Las dos clases van siempre juntas para este efecto.

---

## Fondo con imagen — posición, repetición, tamaño {: .topic-title }

```html
<div class="bg-[url(/foto.jpg)] bg-cover bg-center bg-no-repeat">
```

| Clase | Propiedad |
|---|---|
| `bg-center`, `bg-top`, `bg-bottom`, `bg-left`, `bg-right`... | `background-position` |
| `bg-repeat` | Repite la imagen (por defecto) |
| `bg-no-repeat` | No la repite |
| `bg-auto` | Tamaño original de la imagen |
| `bg-cover` | Cubre todo el contenedor, recorta si hace falta |
| `bg-contain` | Cabe entera dentro del contenedor |

---

## Ring — color del anillo de foco {: .topic-title }

`ring-` dibuja un contorno alrededor del elemento sin desplazar el layout (no ocupa espacio como un `border`) — se usa sobre todo para el estado de foco de elementos interactivos:

```html
<button class="focus:ring-4 focus:ring-sky-500/50">
  Botón accesible
</button>
```

| Clase | Función |
|---|---|
| `ring-<color>` | Color del anillo — mismos nombres/shades que `bg-`/`text-` |
| `ring-<n>` | Grosor del anillo (`ring-1`, `ring-2`, `ring-4`, `ring-8`) |
| `ring-offset-<n>` | Separación entre el elemento y el anillo |

!!! note "Casi siempre junto a `focus:`"
    Sin el prefijo `focus:`, el anillo se ve siempre — lo normal es combinarlo con el estado de foco (`focus:ring-...`) para que aparezca solo cuando el usuario navega con teclado o hace clic, marcando accesibilidad sin ensuciar el diseño en reposo.

---

## Border — grosor y estilo {: .topic-title }

```html
<div class="border-2 border-dashed border-sky-500">
```

| Clase | Propiedad |
|---|---|
| `border` | `border-width: 1px` en los 4 lados |
| `border-0`, `border-2`, `border-4`, `border-8` | Grosor concreto |
| `border-t`, `border-r`, `border-b`, `border-l` | Un solo lado, ancho `1px` (combinable con `-2`/`-4`/`-8`: `border-t-2`) |
| `border-solid` | Línea continua (por defecto) |
| `border-dashed` | Línea discontinua |
| `border-dotted` | Puntos |
| `border-none` | Sin borde |

`border-<color>` usa la misma paleta y shades ya vistos arriba en esta página.

---

## Border radius {: .topic-title }

```html
<img class="rounded-full" src="...">   <!-- círculo perfecto, si es cuadrado -->
<div class="rounded-lg">               <!-- esquinas suavemente redondeadas -->
```

| Clase | `border-radius` |
|---|---|
| `rounded-none` | `0px` |
| `rounded-sm` | `0.25rem` (4px) |
| `rounded` | `0.375rem` (6px) — por defecto |
| `rounded-md` | `0.5rem` (8px) |
| `rounded-lg` | `0.75rem` (12px) |
| `rounded-xl` / `-2xl` / `-3xl` | `1rem` / `1.5rem` / `2rem` |
| `rounded-full` | `9999px` — círculo si el elemento es cuadrado, píldora si es rectangular |

```html
<div class="rounded-t-lg">
  <!-- solo las esquinas superiores -->
</div>
```

`rounded-t-`, `rounded-b-`, `rounded-l-`, `rounded-r-` redondean solo un lado; `rounded-tl-`, `rounded-tr-`, `rounded-bl-`, `rounded-br-` afinan a una esquina concreta.

---

## Outline — contorno nativo {: .topic-title }

```html
<input class="outline-2 outline-offset-2 outline-sky-500">
```

Es la propiedad CSS `outline` nativa (distinta de `ring-`, que usa `box-shadow`). Mismo patrón de clases: `outline` (1px, sólido), `outline-<n>` (grosor), `outline-dashed`/`-dotted`/`-double` (estilo), `outline-<color>`, `outline-offset-<n>` (separación).

!!! note "¿`ring-` u `outline-`?"
    `ring-` sigue el `border-radius` del elemento automáticamente y se combina con `shadow-` sin pisarse — mejor para foco en botones/tarjetas redondeadas. `outline-` es la propiedad nativa del navegador, más simple, y NO sigue el `border-radius` en algunos casos de radios muy grandes — para la mayoría de foco de formularios, cualquiera de las dos funciona.

---

## Divide — bordes entre hijos {: .topic-title }

```html
<div class="divide-y divide-slate-200">
  <div class="py-2">Item 1</div>
  <div class="py-2">Item 2</div>
  <div class="py-2">Item 3</div>
</div>
```

Añade un borde ENTRE cada hijo (nunca en los extremos) — el equivalente de `space-y-`/`space-x-` pero con una línea en vez de espacio.

| Clase | Efecto |
|---|---|
| `divide-y` | Borde horizontal entre hijos apilados verticalmente |
| `divide-x` | Borde vertical entre hijos en fila |
| `divide-<color>` | Color de esos bordes |
| `divide-dashed` / `divide-dotted` | Estilo de línea |

---

## 📖 Referencias

- 📘 **Documentación oficial — Colors** — https://tailwindcss.com/docs/colors
- 📘 **Documentación oficial — Background gradients** — https://tailwindcss.com/docs/background-image
- 📘 **Documentación oficial — Box shadow / ring** — https://tailwindcss.com/docs/box-shadow#adding-a-ring
- 📘 **Documentación oficial — Border width** — https://tailwindcss.com/docs/border-width
- 📘 **Documentación oficial — Border radius** — https://tailwindcss.com/docs/border-radius
- 📘 **Documentación oficial — Outline width** — https://tailwindcss.com/docs/outline-width
- 📘 **Documentación oficial — Divide width** — https://tailwindcss.com/docs/divide-width
