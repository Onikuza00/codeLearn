# Tipografía { .bloque-tailwind }

> Tamaño, peso, interlineado y espaciado entre letras — cuatro escalas independientes que se combinan en cada bloque de texto.

---

## Tamaño de fuente {: .topic-title }

```html
<p class="text-sm">Texto pequeño</p>
<h2 class="text-2xl">Título grande</h2>
```

Cada clase trae también su `line-height` por defecto — no hace falta añadirlo aparte salvo que se quiera cambiar:

| Clase | `font-size` | `line-height` por defecto |
|---|---|---|
| `text-xs` | `0.75rem` (12px) | `1rem` (16px) |
| `text-sm` | `0.875rem` (14px) | `1.25rem` (20px) |
| `text-base` | `1rem` (16px) | `1.5rem` (24px) |
| `text-lg` | `1.125rem` (18px) | `1.75rem` (28px) |
| `text-xl` | `1.25rem` (20px) | `1.75rem` (28px) |
| `text-2xl` | `1.5rem` (24px) | `2rem` (32px) |

!!! tip "`text-base` es el punto de partida"
    `text-base` (16px) es el tamaño por defecto del navegador para el texto de párrafo — es la referencia desde la que se calculan proporcionalmente los `rem` de toda la escala. Para cuerpo de texto normal, `text-base` o `text-sm` cubren casi todos los casos.

---

## Peso de fuente {: .topic-title }

```html
<p class="font-normal">Peso normal</p>
<p class="font-bold">Peso bold</p>
```

| Clase | `font-weight` |
|---|---|
| `font-thin` | `100` |
| `font-extralight` | `200` |
| `font-light` | `300` |
| `font-normal` | `400` |
| `font-medium` | `500` |
| `font-semibold` | `600` |
| `font-bold` | `700` |
| `font-extrabold` | `800` |
| `font-black` | `900` |

!!! warning "El peso solo funciona si la fuente lo tiene"
    Si la familia tipográfica cargada no incluye ese grosor (por ejemplo, `font-black` sin haber cargado el peso 900), el navegador lo simula ("faux bold") y se ve borroso o distinto al resto. Hay que comprobar qué pesos trae realmente la fuente cargada (Google Fonts, `@font-face`) antes de usarlos todos.

### Estilo — cursiva

```html
<em class="italic">Texto en cursiva</em>
<span class="not-italic">Anula una cursiva heredada</span>
```

`italic` / `not-italic` — controlan `font-style`, independiente del peso.

---

## Interlineado (`leading-`) {: .topic-title }

```html
<p class="leading-relaxed">Párrafo con más aire entre líneas.</p>
```

| Clase | `line-height` |
|---|---|
| `leading-none` | `1` |
| `leading-tight` | `1.25` |
| `leading-snug` | `1.375` |
| `leading-normal` | `1.5` |
| `leading-relaxed` | `1.625` |
| `leading-loose` | `2` |

---

## Espaciado entre letras (`tracking-`) {: .topic-title }

```html
<p class="tracking-wide uppercase">Texto en mayúsculas</p>
```

| Clase | `letter-spacing` |
|---|---|
| `tracking-tighter` | `-0.05em` |
| `tracking-tight` | `-0.025em` |
| `tracking-normal` | `0em` |
| `tracking-wide` | `0.025em` |
| `tracking-wider` | `0.05em` |
| `tracking-widest` | `0.1em` |

!!! tip "Cuándo tocar cada escala"
    `leading-` importa en párrafos largos (legibilidad vertical). `tracking-` se usa sobre todo en texto en mayúsculas o títulos pequeños, donde las letras muy juntas cuestan de leer — valores negativos (`tracking-tight`/`-tighter`) funcionan bien en títulos grandes, donde letras muy separadas se ven sueltas.

---

## Alineación de texto {: .topic-title }

```html
<p class="text-center">Centrado</p>
```

| Clase | `text-align` |
|---|---|
| `text-left` | `left` |
| `text-center` | `center` |
| `text-right` | `right` |
| `text-justify` | `justify` |
| `text-start` | `start` (respeta la dirección del idioma: LTR/RTL) |
| `text-end` | `end` |

!!! tip "`text-start`/`text-end` frente a `left`/`right`"
    En español da igual, pero `text-start`/`text-end` se adaptan automáticamente si algún día el sitio soporta un idioma RTL (árabe, hebreo) — `left`/`right` no cambian nunca de lado.

---

## Familia tipográfica {: .topic-title }

```html
<p class="font-sans">Texto con la fuente por defecto</p>
<code class="font-mono">const x = 1;</code>
```

| Clase | Pila de fuentes (resumen) |
|---|---|
| `font-sans` | Fuente del sistema, sin serifas — la familia por defecto de todo el sitio |
| `font-serif` | Fuente con serifas (Georgia, Times) |
| `font-mono` | Fuente monoespaciada — código, datos tabulares |

!!! note "Personalizar la fuente real"
    Estas 3 clases apuntan a la fuente del sistema por defecto. Para usar una fuente propia (Google Fonts, `@font-face`), se sobreescribe la variable en `@theme` — `--font-sans: "Inter", sans-serif;` — y automáticamente `font-sans` pasa a usarla en todo el sitio.

---

## Transformación de texto {: .topic-title }

```html
<span class="uppercase">siempre en mayúsculas</span>
```

| Clase | `text-transform` |
|---|---|
| `uppercase` | `uppercase` |
| `lowercase` | `lowercase` |
| `capitalize` | `capitalize` (primera letra de cada palabra) |
| `normal-case` | `none` — anula una transformación heredada |

---

## Decoración de texto {: .topic-title }

```html
<a class="underline hover:no-underline" href="#">Enlace</a>
```

| Clase | `text-decoration-line` |
|---|---|
| `underline` | `underline` |
| `overline` | `overline` |
| `line-through` | `line-through` |
| `no-underline` | `none` |

!!! tip "Grosor y color del subrayado"
    `decoration-<color>` y `decoration-<n>` cambian el color y el grosor de la línea sin afectar al color del texto — útil para un enlace con subrayado sutil (`decoration-slate-300`) en vez del mismo color que el texto.

---

## Desbordamiento de texto {: .topic-title }

```html
<p class="truncate w-48">Este párrafo es demasiado largo para caber</p>
<!-- se corta en una línea y termina en … -->
```

| Clase | Efecto |
|---|---|
| `truncate` | Corta en una línea + `...` al final (combina 3 propiedades CSS a la vez) |
| `text-ellipsis` | Solo el `...`, sin forzar una línea |
| `whitespace-nowrap` | El texto nunca salta de línea |
| `whitespace-pre-line` | Respeta los saltos de línea del texto, pero colapsa espacios |
| `whitespace-pre-wrap` | Respeta saltos de línea Y espacios tal cual están escritos |

### Cortar a varias líneas — `line-clamp-`

```html
<p class="line-clamp-3">
  Texto muy largo que se corta justo después de la 3ª línea completa, con … al final.
</p>
```

`truncate` corta SIEMPRE en una sola línea. `line-clamp-1` … `line-clamp-6` permiten varias líneas antes de cortar — el patrón típico de una descripción de tarjeta o un resumen de artículo. `line-clamp-none` lo desactiva.

### Palabras muy largas — `break-`

```html
<p class="break-words w-32">unURLmuylargaqueNormalmenteNoCabria.com</p>
```

| Clase | Efecto |
|---|---|
| `break-normal` | Solo rompe línea en los espacios (por defecto) |
| `break-words` | Si una palabra no cabe, se parte para no desbordar el contenedor |
| `break-all` | Puede partir en cualquier letra, incluso en palabras que sí cabrían |
| `break-keep` | Nunca parte una palabra (aunque se desborde) |

---

## Ajuste de línea en títulos — `text-wrap` {: .topic-title }

```html
<h1 class="text-balance">Un título de dos líneas con ambas parejas en longitud</h1>
```

| Clase | Efecto |
|---|---|
| `text-wrap` | Comportamiento normal del navegador (por defecto) |
| `text-nowrap` | Nunca salta de línea |
| `text-balance` | Reparte el texto para que todas las líneas midan parecido — pensado para titulares cortos |
| `text-pretty` | Evita dejar una sola palabra sola en la última línea (huérfanas) — pensado para párrafos |

!!! note "`text-balance` solo tiene sentido en textos cortos"
    El navegador necesita recalcular varias combinaciones de salto de línea para "equilibrar" el texto — es barato en un titular de pocas palabras, pero no se aplica a párrafos largos (el navegador lo ignora a partir de cierta longitud).

---

## Listas {: .topic-title }

```html
<ul class="list-disc list-inside">
  <li>Elemento uno</li>
  <li>Elemento dos</li>
</ul>
```

| Clase | Efecto |
|---|---|
| `list-none` | Sin marcador — quita los puntos/números por defecto |
| `list-disc` | Puntos (listas `<ul>`) |
| `list-decimal` | Números (listas `<ol>`) |
| `list-inside` | El marcador entra dentro del área de texto |
| `list-outside` | El marcador queda fuera, alineado a la izquierda (por defecto) |

---

## Alineación vertical {: .topic-title }

Solo afecta a elementos `inline`, `inline-block` o celdas de tabla — en un bloque normal no hace nada:

```html
<img class="inline-block align-middle" src="icono.svg">
<span>Texto alineado con el icono</span>
```

| Clase | `vertical-align` |
|---|---|
| `align-baseline` | Alinea con la línea base del texto (por defecto) |
| `align-top` | Con la parte superior de la línea |
| `align-middle` | Centrado respecto a la línea |
| `align-bottom` | Con la parte inferior de la línea |

---

## 📖 Referencias

- 📘 **Documentación oficial — Font size** — https://tailwindcss.com/docs/font-size
- 📘 **Documentación oficial — Font weight** — https://tailwindcss.com/docs/font-weight
- 📘 **Documentación oficial — Line height** — https://tailwindcss.com/docs/line-height
- 📘 **Documentación oficial — Letter spacing** — https://tailwindcss.com/docs/letter-spacing
- 📘 **Documentación oficial — Text align** — https://tailwindcss.com/docs/text-align
- 📘 **Documentación oficial — Font family** — https://tailwindcss.com/docs/font-family
- 📘 **Documentación oficial — Text overflow** — https://tailwindcss.com/docs/text-overflow
- 📘 **Documentación oficial — Whitespace** — https://tailwindcss.com/docs/whitespace
