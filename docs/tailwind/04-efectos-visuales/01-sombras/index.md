# Sombras { .bloque-tailwind }

> `shadow-` da elevación visual sin ocupar espacio en el layout — es `box-shadow` puro, la misma propiedad CSS que usa `ring-` por debajo.

---

## Escala de sombras {: .topic-title }

```html
<div class="rounded-lg bg-white p-6 shadow-md">
  Tarjeta con sombra media
</div>
```

| Clase | Uso típico |
|---|---|
| `shadow-sm` | Apenas perceptible — bordes de inputs, separación sutil |
| `shadow` | Sombra por defecto — tarjetas planas |
| `shadow-md` | Tarjetas con algo de elevación |
| `shadow-lg` | Elementos flotantes — dropdowns, popovers |
| `shadow-xl` / `shadow-2xl` | Modales, elementos muy elevados sobre el fondo |
| `shadow-none` | Quita cualquier sombra heredada |

---

## Color de sombra {: .topic-title }

```html
<button class="shadow-lg shadow-sky-500/50">
  Sombra con el color del botón, no gris
</button>
```

Por defecto la sombra es gris/negra semitransparente. `shadow-<color>` la tiñe — combinado con `/` para la opacidad, igual que con `bg-`/`text-`.

!!! tip "Sombras de color: para acentos, no para todo"
    Una sombra del mismo color que el elemento (`shadow-sky-500/50` en un botón `bg-sky-500`) da sensación de "brillo" o elevación con personalidad — usarlo en TODAS las tarjetas de una página, en cambio, satura visualmente en vez de ayudar.

---

## Opacidad del elemento entero {: .topic-title }

```html
<div class="opacity-50">
  <!-- TODO el bloque al 50%: fondo, texto, imágenes, bordes... -->
</div>
```

`opacity-` es distinta del `/` que ya viste en colores (`bg-black/50`). El modificador `/` solo afecta a UN color puntual; `opacity-` afecta al elemento COMPLETO y a todos sus hijos a la vez, como una capa de transparencia por encima de todo.

| Clase | `opacity` |
|---|---|
| `opacity-0` | Invisible (pero sigue ocupando espacio y respondiendo a clics, a diferencia de `hidden`) |
| `opacity-50` | Mitad de opacidad |
| `opacity-100` | Totalmente visible (por defecto) |

!!! note "`opacity-0` no es lo mismo que `hidden`"
    `opacity-0` deja el elemento invisible pero sigue ocupando su espacio en el layout y sigue siendo clicable/interactivo. Si además hace falta sacarlo del flujo o que deje de recibir clics, hay que combinarlo con `pointer-events-none` o directamente usar `hidden`.

---

## 📖 Referencias

- 📘 **Documentación oficial — Box shadow** — https://tailwindcss.com/docs/box-shadow
- 📘 **Documentación oficial — Opacity** — https://tailwindcss.com/docs/opacity
