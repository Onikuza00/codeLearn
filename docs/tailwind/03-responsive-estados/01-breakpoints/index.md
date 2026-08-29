# Breakpoints { .bloque-tailwind }

> Mobile-first: los estilos sin prefijo son la base (móvil), y cada breakpoint sobreescribe a partir de un ancho mínimo hacia arriba.

---

## La escala {: .topic-title }

```html
<div class="text-sm md:text-base lg:text-lg">
  <!-- 14px en móvil, 16px desde 768px, 18px desde 1024px -->
</div>
```

| Prefijo | `min-width` |
|---|---|
| *(sin prefijo)* | Se aplica siempre, es la base |
| `sm:` | `40rem` (640px) |
| `md:` | `48rem` (768px) |
| `lg:` | `64rem` (1024px) |
| `xl:` | `80rem` (1280px) |
| `2xl:` | `96rem` (1536px) |

!!! note "Cada breakpoint es `min-width`, nunca un rango"
    `md:flex` no significa "solo entre 768px y 1024px" — significa "desde 768px en adelante" (y sigue activo en `lg`/`xl` salvo que se sobreescriba explícitamente). Por eso el orden mobile-first importa: se escribe la base primero y se añaden capas hacia pantallas más grandes, nunca al revés.

---

## Breakpoints máximos {: .topic-title }

Para el caso inverso (aplicar algo SOLO por debajo de un ancho), existe el prefijo `max-`:

```html
<div class="flex max-md:flex-col">
  <!-- en fila desde siempre, en columna SOLO por debajo de 768px -->
</div>
```

| Prefijo | `max-width` |
|---|---|
| `max-sm:` | por debajo de `640px` |
| `max-md:` | por debajo de `768px` |
| `max-lg:` | por debajo de `1024px` |
| `max-xl:` | por debajo de `1280px` |

---

## Valores arbitrarios {: .topic-title }

Si un ancho concreto no coincide con la escala, se puede escribir directo:

```html
<div class="min-[600px]:flex">
```

---

## 📖 Referencias

- 📘 **Documentación oficial — Responsive design** — https://tailwindcss.com/docs/responsive-design
