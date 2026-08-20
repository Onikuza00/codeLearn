# Display y caja { .bloque-tailwind }

> Antes de Flexbox o Grid, todo elemento ya tiene un `display` por defecto — es el interruptor que decide si `flex-`/`grid-` van a servir de algo.

---

## Display {: .topic-title }

```html
<div class="hidden md:block">
  <!-- oculto en móvil, visible en bloque desde tablet -->
</div>
```

| Clase | `display` |
|---|---|
| `block` | Bloque — ocupa toda la línea, admite ancho/alto |
| `inline` | En línea — no admite ancho/alto, se ajusta al contenido |
| `inline-block` | Mezcla: fluye en línea, pero admite ancho/alto |
| `flex` / `inline-flex` | Ver [Flexbox](../01-flexbox/index.md) |
| `grid` / `inline-grid` | Ver [Grid](../02-grid/index.md) |
| `hidden` | No se renderiza — no ocupa espacio, no existe visualmente |
| `contents` | El elemento "desaparece" mostrando solo sus hijos, como si estuvieran sueltos en el padre |

---

## Visibility {: .topic-title }

```html
<div class="invisible">
  <!-- no se ve, pero SIGUE ocupando su espacio -->
</div>
```

| Clase | Efecto |
|---|---|
| `visible` | Visible (por defecto) |
| `invisible` | Invisible, pero mantiene su espacio en el layout |

!!! note "`hidden` vs. `invisible`"
    `hidden` (display: none) saca el elemento del flujo por completo — el resto del layout se reacomoda como si no existiera. `invisible` lo oculta pero deja el hueco vacío donde estaba — útil para no generar saltos de layout cuando algo aparece/desaparece dinámicamente.

---

## Box sizing {: .topic-title }

```html
<div class="box-border w-64 p-4 border-2">
  <!-- el ancho final SIGUE siendo 64 — padding y border se restan por dentro -->
</div>
```

| Clase | `box-sizing` |
|---|---|
| `box-border` | El `padding` y el `border` se incluyen DENTRO del `width`/`height` declarado (por defecto en Tailwind) |
| `box-content` | El `padding` y el `border` se SUMAN al `width`/`height` — el elemento final es más grande de lo declarado |

!!! tip "Por qué casi nunca hace falta tocarlo"
    Tailwind aplica `box-border` a todo por defecto (parte de su reset base) — es el comportamiento intuitivo (`w-64` siempre mide 64, sin sorpresas al añadir padding). `box-content` es la excepción rara, casi nunca se necesita en la práctica.

---

## 📖 Referencias

- 📘 **Documentación oficial — Display** — https://tailwindcss.com/docs/display
- 📘 **Documentación oficial — Visibility** — https://tailwindcss.com/docs/visibility
- 📘 **Documentación oficial — Box sizing** — https://tailwindcss.com/docs/box-sizing
