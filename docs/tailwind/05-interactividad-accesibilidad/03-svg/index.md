# SVG { .bloque-tailwind }

> Un SVG no se colorea con `bg-`/`text-` — usa sus propias propiedades, `fill` (relleno) y `stroke` (contorno).

---

## Fill y stroke {: .topic-title }

```html
<svg class="fill-sky-500 stroke-slate-900 stroke-2">
  <circle cx="12" cy="12" r="10" />
</svg>
```

| Clase | Propiedad SVG |
|---|---|
| `fill-<color>` | `fill` — color de relleno |
| `fill-none` | Sin relleno, solo el contorno |
| `stroke-<color>` | `stroke` — color del trazo/contorno |
| `stroke-none` | Sin contorno |
| `stroke-0`, `stroke-1`, `stroke-2` | `stroke-width` — grosor del trazo |

!!! note "Muchos iconos usan `currentColor`"
    Los iconos SVG de librerías (Heroicons, Lucide) suelen traer `fill="currentColor"` o `stroke="currentColor"` en el propio archivo — eso significa que heredan el color de `text-` en vez de necesitar `fill-`/`stroke-` explícitos. Si un icono no cambia de color al poner `text-sky-500`, es señal de que NO usa `currentColor` y hace falta `fill-`/`stroke-` en su lugar.

!!! tip "SVG sprite: un solo archivo, muchos iconos"
    Un SVG sprite agrupa varios iconos en un único archivo, cada uno envuelto en un `<symbol id="...">` — no se muestra directamente, solo define las formas disponibles. Para pintar uno en concreto se referencia con `<use href="#id-del-icono">`, y ese `<use>` es el que lleva las clases de Tailwind (`fill-`, `stroke-`, `size-`):
    ```html
    <svg class="size-6 fill-sky-500">
      <use href="/sprite.svg#icono-cerrar" />
    </svg>
    ```
    Una sola petición HTTP carga todos los iconos del sprite; cada uso solo "recorta" el símbolo que necesita, y sigue heredando `currentColor` igual que un SVG suelto.

---

## 📖 Referencias

- 📘 **Documentación oficial — Fill** — https://tailwindcss.com/docs/fill
- 📘 **Documentación oficial — Stroke** — https://tailwindcss.com/docs/stroke
