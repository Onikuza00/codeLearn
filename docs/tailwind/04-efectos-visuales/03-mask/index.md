# Mask { .bloque-tailwind }

> Una máscara recorta o difumina un elemento usando otra imagen (o un degradado) como plantilla — donde la máscara es opaca se ve el elemento, donde es transparente desaparece.

---

## mask-image {: .topic-title }

```html
<div class="mask-linear-to-r mask-linear-from-black mask-linear-to-transparent">
  <!-- el elemento se desvanece de izquierda a derecha -->
</div>
```

| Clase | Función |
|---|---|
| `mask-none` | Sin máscara (por defecto) |
| `mask-linear-<ángulo>` | Máscara en degradado lineal |
| `mask-radial-*` | Máscara en degradado radial (desde el centro) |
| `mask-conic-*` | Máscara en degradado cónico (como un reloj) |
| `mask-[url(...)]` | Máscara con una imagen/SVG propio, valor arbitrario |

---

## Difuminar bordes — edge fades {: .topic-title }

El caso de uso más habitual: que el borde de una lista o imagen se desvanezca en vez de cortar en seco.

```html
<div class="overflow-y-auto mask-t-from-90% mask-b-from-90%">
  <!-- el contenido se desvanece justo antes del borde superior e inferior -->
</div>
```

| Clase | Efecto |
|---|---|
| `mask-t-from-<%>` | Desvanece el borde superior, empezando en ese porcentaje |
| `mask-b-from-<%>` | Borde inferior |
| `mask-l-from-<%>` / `mask-r-from-<%>` | Bordes izquierdo / derecho |

---

## Comportamiento de la máscara {: .topic-title }

Mismo patrón que `background-`, aplicado a la máscara en vez del color de fondo:

| Clase | Equivalente a |
|---|---|
| `mask-repeat` / `mask-no-repeat` | `background-repeat` |
| `mask-size-cover` / `mask-size-contain` | `background-size` |
| `mask-center`, `mask-top`, `mask-left`... | `background-position` |

!!! tip "Se combina con `aspect-` y `object-fit` sin conflicto"
    `mask-` recorta según opacidad, `object-fit` decide cómo encaja el contenido dentro de su caja — son capas distintas y se pueden aplicar juntas sobre la misma imagen sin que una pise a la otra.

---

## 📖 Referencias

- 📘 **Documentación oficial — Mask image** — https://tailwindcss.com/docs/mask-image
