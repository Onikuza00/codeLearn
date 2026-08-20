# Transforms { .bloque-tailwind }

> Rotar, escalar, mover o inclinar un elemento sin afectar al layout de sus vecinos — el elemento se transforma visualmente, pero sigue ocupando su espacio original en el flujo del documento.

---

## Rotate, scale, translate, skew {: .topic-title }

```html
<img class="rotate-6 hover:rotate-0 transition" src="...">
```

| Clase | Efecto |
|---|---|
| `rotate-0` … `rotate-180` | Rotación en grados (también negativos: `-rotate-45`) |
| `scale-0` … `scale-150` | Escala uniforme (100 = tamaño original) |
| `scale-x-`, `scale-y-` | Escala solo en un eje |
| `translate-x-`, `translate-y-` | Desplazamiento — misma escala de espaciado, admite fracciones y `-` |
| `skew-x-`, `skew-y-` | Inclinación en grados |

```html
<div class="translate-x-4 -translate-y-2">
  <!-- movido 1rem a la derecha, 0.5rem hacia arriba -->
</div>
```

---

## Origen de la transformación {: .topic-title }

Por defecto, todas las transformaciones giran/escalan desde el centro del elemento. `origin-` cambia ese punto:

```html
<div class="rotate-45 origin-top-left">
```

| Clase | Punto de origen |
|---|---|
| `origin-center` | Centro (por defecto) |
| `origin-top`, `origin-bottom`, `origin-left`, `origin-right` | Cada borde |
| `origin-top-left`, `origin-top-right`, `origin-bottom-left`, `origin-bottom-right` | Cada esquina |

!!! note "No hace falta activar `transform` aparte"
    En versiones antiguas de Tailwind había que añadir la clase `transform` para que `rotate-`/`scale-`/etc. funcionaran. Desde hace varias versiones ya no es necesario — cualquier utility de transform se aplica directamente.

---

## 📖 Referencias

- 📘 **Documentación oficial — Rotate** — https://tailwindcss.com/docs/rotate
- 📘 **Documentación oficial — Scale** — https://tailwindcss.com/docs/scale
- 📘 **Documentación oficial — Translate** — https://tailwindcss.com/docs/translate
