# Flexbox { .bloque-tailwind }

> `flex` es el punto de partida — todo lo demás (dirección, alineación, wrap) son modificadores que solo funcionan sobre un contenedor que ya es flex.

---

## Activar Flexbox {: .topic-title }

```html
<div class="flex">...</div>
<div class="inline-flex">...</div>
```

| Clase | `display` |
|---|---|
| `flex` | `flex` |
| `inline-flex` | `inline-flex` |

---

## Dirección {: .topic-title }

```html
<div class="flex flex-col">
  <!-- los hijos se apilan verticalmente -->
</div>
```

| Clase | `flex-direction` |
|---|---|
| `flex-row` | `row` (por defecto) |
| `flex-row-reverse` | `row-reverse` |
| `flex-col` | `column` |
| `flex-col-reverse` | `column-reverse` |

---

## Alineación {: .topic-title }

```html
<div class="flex justify-between items-center">
  <!-- hijos repartidos horizontalmente, centrados verticalmente -->
</div>
```

| Clase | `justify-content` (eje principal) |
|---|---|
| `justify-start` | `flex-start` |
| `justify-center` | `center` |
| `justify-end` | `flex-end` |
| `justify-between` | `space-between` |
| `justify-around` | `space-around` |
| `justify-evenly` | `space-evenly` |

| Clase | `align-items` (eje cruzado) |
|---|---|
| `items-start` | `flex-start` |
| `items-center` | `center` |
| `items-end` | `flex-end` |
| `items-baseline` | `baseline` |
| `items-stretch` | `stretch` (por defecto) |

!!! note "`justify-` es el eje principal, `items-` es el cruzado — y el eje principal depende de `flex-direction`"
    En `flex-row` (por defecto), el eje principal es horizontal: `justify-` reparte a lo ancho, `items-` alinea a lo alto. En `flex-col` se invierte: `justify-` reparte a lo alto, `items-` alinea a lo ancho. El nombre de la clase no cambia, pero el eje al que afecta sí.

---

## Wrap {: .topic-title }

```html
<div class="flex flex-wrap gap-4">
  <!-- los hijos que no caben pasan a la siguiente línea -->
</div>
```

| Clase | `flex-wrap` |
|---|---|
| `flex-nowrap` | `nowrap` (por defecto — todo en una línea, se encoge) |
| `flex-wrap` | `wrap` |
| `flex-wrap-reverse` | `wrap-reverse` |

---

## Comportamiento de los hijos {: .topic-title }

```html
<div class="flex">
  <div class="flex-1">Ocupa el espacio sobrante</div>
  <div class="flex-none">Tamaño fijo, no crece ni encoge</div>
</div>
```

| Clase | Efecto |
|---|---|
| `flex-1` | `flex: 1 1 0%` — crece y encoge libremente, ignora su tamaño base |
| `flex-auto` | `flex: 1 1 auto` — crece y encoge, partiendo de su tamaño de contenido |
| `flex-initial` | `flex: 0 1 auto` — encoge si hace falta, pero no crece (por defecto) |
| `flex-none` | `flex: none` — tamaño fijo, no crece ni encoge |
| `grow` / `grow-0` | Activa/desactiva `flex-grow` por separado |
| `shrink` / `shrink-0` | Activa/desactiva `flex-shrink` por separado |

### Tamaño base — `basis-`

```html
<div class="flex">
  <div class="basis-1/3">Ocupa 1/3 antes de repartir el resto</div>
</div>
```

`basis-` fija el tamaño de partida de un hijo ANTES de que `grow`/`shrink` entren en juego — es el tercer valor del shorthand `flex` (`flex: <grow> <shrink> <basis>`). Usa la misma escala de espaciado, fracciones (`basis-1/2`), `basis-full` y `basis-auto`.

### Alineación de un solo hijo — `self-`

```html
<div class="flex items-start">
  <div class="self-center">Solo este se centra, el resto queda arriba</div>
</div>
```

`self-` sobreescribe `items-` para UN hijo concreto — mismos valores (`self-start`, `self-center`, `self-end`, `self-stretch`, `self-baseline`, `self-auto`).

### Orden visual

```html
<div class="flex">
  <div class="order-2">Se ve segundo</div>
  <div class="order-1">Se ve primero</div>
</div>
```

`order-1` … `order-12` cambian el orden visual sin tocar el HTML. `order-first`/`order-last` mandan un elemento al principio o al final sin más.

!!! warning "`order-` es solo visual"
    El orden en el DOM no cambia — solo el orden en pantalla. Para lectores de pantalla y navegación por teclado, el orden real sigue siendo el del HTML. No abuses de `order-` para maquetar contenido que debería estar ya ordenado en el HTML.

---

## 📖 Referencias

- 📘 **Documentación oficial — Flex** — https://tailwindcss.com/docs/flex
- 📘 **Documentación oficial — Justify content** — https://tailwindcss.com/docs/justify-content
- 📘 **Documentación oficial — Align items** — https://tailwindcss.com/docs/align-items
