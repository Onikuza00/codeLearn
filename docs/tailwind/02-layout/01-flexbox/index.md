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

### `flex-1` en layouts responsive — trucos reales

El patrón más común en producción: una barra lateral de ancho fijo + un contenido que ocupa todo lo que sobra, apilados en móvil y en fila en escritorio.

```html
<div class="flex flex-col md:flex-row">
  <aside class="md:w-64">Barra lateral</aside>
  <main class="flex-1">Contenido — ocupa el resto del ancho en escritorio</main>
</div>
```

!!! warning "`flex-1` cambia de eje junto con `flex-direction`"
    Igual que `justify-`/`items-` (ver aviso más arriba), `flex-1` reparte el eje PRINCIPAL, y ese eje depende de `flex-direction`. En el ejemplo de arriba, en móvil el contenedor está en `flex-col`: ahí `flex-1` en `<main>` reparte ALTURA, no ancho — no fuerza que ocupe el 100% del ancho por sí solo. Si en móvil también necesitas ancho completo, hay que pedirlo explícito con `w-full`, no dar por hecho que `flex-1` ya lo cubre.

!!! danger "`flex-1` no encoge contenido largo por defecto — el gotcha más común"
    Por spec, un hijo flex tiene `min-width: auto`, que en la práctica significa "no encoger nunca por debajo del tamaño de su contenido" (un texto largo sin espacios, una imagen). Esto hace que `flex-1` a veces NO reparta el espacio como se espera: el contenido se desborda del contenedor en vez de truncarse o ajustarse. La solución es añadir `min-w-0` (o `min-h-0` en `flex-col`) al hijo con `flex-1`, que resetea ese mínimo implícito y permite que sí encoja — muchas veces combinado con `truncate` para cortar el texto con `…`.

    ```html
    <div class="flex">
      <div class="flex-1 min-w-0">
        <p class="truncate">Un título larguísimo que si no fuera por min-w-0 desbordaría la tarjeta</p>
      </div>
    </div>
    ```

**Alternativas a `flex-1` cuando el reparto tiene que ser predecible:**

| Necesidad | Herramienta | Por qué |
|---|---|---|
| "Que ocupe todo lo que sobra" (1 elemento flexible junto a otros fijos) | `flex-1` | Es justo para eso — no conoce fracciones, solo "el resto" |
| Columnas con fracción fija y que cambie por breakpoint (ej. mitad en tablet, un tercio en escritorio) | `basis-1/2 md:basis-1/3` | `flex-1` ignora el tamaño base; si el reparto tiene que ser una fracción concreta y no "lo que sobra", `basis-` es más explícito |
| Varias columnas de ancho mínimo que se auto-ajustan sin media queries manuales | `grid` con `grid-cols-[repeat(auto-fit,minmax(...,1fr))]` | Flexbox no tiene equivalente nativo a `auto-fit`/`minmax()` — para ese caso, Grid es la herramienta correcta, no un truco de `flex-wrap` |

---

## 📖 Referencias

- 📘 **Documentación oficial — Flex** — https://tailwindcss.com/docs/flex
- 📘 **Documentación oficial — Justify content** — https://tailwindcss.com/docs/justify-content
- 📘 **Documentación oficial — Align items** — https://tailwindcss.com/docs/align-items
