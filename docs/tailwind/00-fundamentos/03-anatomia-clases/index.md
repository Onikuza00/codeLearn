# Anatomía de una clase { .bloque-tailwind }

> `p-4` no es un número random. Cada utility class sigue el mismo patrón: prefijo que dice QUÉ propiedad, valor que viene de una escala consistente en TODO el framework.

---

## Prefijo + escala {: .topic-title }

```
p   -  4
↑      ↑
qué    cuánto (escala, no píxeles directos)
```

| Prefijo | Propiedad CSS | Ejemplo |
|---|---|---|
| `p-` | `padding` | `p-4` → `padding: 1rem` |
| `m-` | `margin` | `m-2` → `margin: 0.5rem` |
| `w-` | `width` | `w-full` → `width: 100%` |
| `text-` | `font-size` o `color` (según el valor) | `text-lg`, `text-blue-500` |
| `bg-` | `background-color` | `bg-white` |

La clave: el número **no es la unidad**, es una posición en una escala. `4` en la escala de espaciado equivale a `1rem` — el mismo `4` se repite en `p-4`, `m-4`, `gap-4`, siempre con el mismo valor real detrás.

---

## Por qué una escala y no valores libres {: .topic-title }

```html
<!-- Sin escala: cada quien mete el px que le parece -->
<div style="padding: 13px; margin: 22px;">

<!-- Con escala: todo el proyecto usa los mismos saltos -->
<div class="p-3 m-5">
```

Con una escala compartida (`0, 1, 2, 3, 4, 5, 6, 8, 10, 12...`), es imposible que dos componentes del mismo proyecto usen espaciados casi-iguales-pero-no-iguales por accidente — el problema típico de un CSS sin variables.

!!! tip "Cuando la escala no alcanza"
    Existe la sintaxis de valor arbitrario: `p-[13px]` salta la escala y aplica el valor exacto entre corchetes. Es la válvula de escape, no el camino por defecto — si la usas todo el rato, probablemente el diseño no está siguiendo la escala del proyecto.

---

## 📖 Referencias

- 📘 **Documentación oficial — Spacing scale** — https://tailwindcss.com/docs/theme#default-theme-variable-reference
