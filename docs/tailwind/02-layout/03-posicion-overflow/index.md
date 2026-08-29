# Posición y overflow { .bloque-tailwind }

> `position`, `z-index`, desbordamiento y encaje de imágenes — el control fino que no depende de Flexbox ni Grid.

---

## Position {: .topic-title }

```html
<div class="relative">
  <span class="absolute top-0 right-0">Badge</span>
</div>
```

| Clase | `position` |
|---|---|
| `static` | `static` (por defecto — `top`/`left`/etc. no hacen nada) |
| `relative` | `relative` |
| `absolute` | `absolute` |
| `fixed` | `fixed` |
| `sticky` | `sticky` |

!!! warning "`absolute` necesita un ancestro `relative`"
    Un elemento `absolute` se posiciona respecto al ancestro posicionado más cercano (cualquiera que no sea `static`). Si ningún ancestro tiene `relative`/`absolute`/`fixed`, se posiciona respecto al `<body>` entero — el bug clásico de "el badge se fue a la esquina de toda la página" es casi siempre un `relative` que falta en el padre.

---

## Desplazamiento — `top-`/`right-`/`bottom-`/`left-`/`inset-` {: .topic-title }

Solo funcionan sobre un elemento posicionado (`relative`, `absolute`, `fixed` o `sticky`). Usan la misma escala de espaciado:

```html
<div class="absolute inset-0">
  <!-- top: 0, right: 0, bottom: 0, left: 0 -->
</div>
<div class="absolute top-4 right-4">
  <!-- separado 1rem del borde superior y derecho -->
</div>
```

| Clase | Propiedad |
|---|---|
| `top-`, `right-`, `bottom-`, `left-` | Cada lado por separado |
| `inset-` | Los 4 lados a la vez |
| `inset-x-`, `inset-y-` | Horizontal / vertical |

---

## z-index {: .topic-title }

```html
<div class="relative z-10">Por encima</div>
<div class="relative z-0">Por debajo</div>
```

| Clase | `z-index` |
|---|---|
| `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50` | Valores predefinidos, de menor a mayor |
| `z-auto` | `auto` — el valor por defecto |

!!! note "z-index solo compite dentro del mismo contexto de apilamiento"
    Un `z-index` alto no gana automáticamente contra cualquier otro elemento de la página — solo compite con sus hermanos dentro del mismo contenedor posicionado. Y **z-index no hace nada en un elemento `static`**, tiene que llevar también `relative`/`absolute`/`fixed`/`sticky`.

---

## Overflow {: .topic-title }

```html
<div class="overflow-y-auto h-64">
  <!-- scroll vertical solo si el contenido no cabe -->
</div>
```

| Clase | `overflow` |
|---|---|
| `overflow-auto` | Scroll solo si hace falta |
| `overflow-hidden` | Corta el contenido que se sale, sin scroll |
| `overflow-visible` | El contenido se sale sin recortarse (por defecto) |
| `overflow-scroll` | Scroll siempre visible, haga falta o no |
| `overflow-x-`, `overflow-y-` | Cada eje por separado |

---

## object-fit — encajar imágenes/vídeos {: .topic-title }

Se usa junto a `aspect-` para que una imagen rellene un contenedor de proporción fija sin deformarse:

```html
<img class="aspect-video w-full object-cover" src="...">
```

| Clase | `object-fit` |
|---|---|
| `object-cover` | Rellena el contenedor, recorta lo que sobra (mantiene proporción) |
| `object-contain` | Cabe entero dentro del contenedor, puede dejar huecos |
| `object-fill` | Rellena estirando — deforma la imagen si la proporción no coincide |
| `object-none` | Tamaño original, ignora el contenedor |

---

## 📖 Referencias

- 📘 **Documentación oficial — Position** — https://tailwindcss.com/docs/position
- 📘 **Documentación oficial — Z-index** — https://tailwindcss.com/docs/z-index
- 📘 **Documentación oficial — Overflow** — https://tailwindcss.com/docs/overflow
- 📘 **Documentación oficial — Object fit** — https://tailwindcss.com/docs/object-fit
