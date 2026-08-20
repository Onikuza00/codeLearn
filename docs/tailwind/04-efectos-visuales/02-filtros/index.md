# Filtros { .bloque-tailwind }

> `filter` transforma los píxeles del propio elemento (desenfoque, brillo, saturación). `backdrop-filter` hace lo mismo, pero sobre lo que se ve A TRAVÉS del elemento — no sobre el elemento en sí.

---

## Filtros sobre el elemento {: .topic-title }

```html
<img class="blur-sm grayscale" src="...">
```

| Clase | Efecto |
|---|---|
| `blur-none` … `blur-3xl` | Desenfoque, de nulo a muy intenso |
| `brightness-0` … `brightness-200` | Brillo — `100` es el original, menos oscurece, más ilumina |
| `contrast-0` … `contrast-200` | Contraste |
| `grayscale` | Blanco y negro completo |
| `saturate-0` … `saturate-200` | Saturación del color |
| `sepia` | Tono sepia (efecto foto antigua) |
| `invert` | Invierte los colores |
| `drop-shadow-sm` … `drop-shadow-2xl` | Sombra que sigue la silueta real (útil en PNG con transparencia, a diferencia de `shadow-` que sigue el rectángulo de la caja) |

```html
<div class="hover:grayscale-0 grayscale transition">
  <!-- imagen en gris, a color al pasar el cursor -->
</div>
```

---

## Backdrop filters — el fondo detrás del elemento {: .topic-title }

Mismas clases, con el prefijo `backdrop-`. Solo tienen efecto visible si el elemento (o su fondo) es semitransparente — es el efecto "glassmorphism":

```html
<div class="bg-white/30 backdrop-blur-md">
  <!-- panel translúcido, con lo que hay detrás desenfocado -->
</div>
```

| Clase | Afecta a |
|---|---|
| `backdrop-blur-` | Lo que se ve detrás, no el propio elemento |
| `backdrop-brightness-`, `backdrop-contrast-`, `backdrop-saturate-`, `backdrop-grayscale` | Mismo patrón que sus equivalentes sin `backdrop-` |

!!! warning "`backdrop-` necesita transparencia real para notarse"
    Sobre un fondo 100% opaco (`bg-white` sin `/opacidad`) no hay nada "detrás" que desenfocar — el efecto solo se ve con `bg-white/30`, `bg-black/50`, etc. Es el error más común al usar `backdrop-blur-` por primera vez: se aplica y no pasa nada visible.

---

## 📖 Referencias

- 📘 **Documentación oficial — Filter** — https://tailwindcss.com/docs/filter
- 📘 **Documentación oficial — Backdrop filter** — https://tailwindcss.com/docs/backdrop-filter
