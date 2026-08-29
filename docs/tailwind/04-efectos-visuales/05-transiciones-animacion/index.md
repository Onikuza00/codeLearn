# Transiciones y animación { .bloque-tailwind }

> Una transición interpola entre DOS estados (normal → hover). Una animación se repite o recorre varios pasos por sí sola, sin depender de que el usuario haga algo.

---

## Transiciones {: .topic-title }

```html
<button class="bg-sky-500 hover:bg-sky-600 transition-colors duration-300">
  Cambia de color suavemente
</button>
```

| Clase | Qué propiedades anima |
|---|---|
| `transition` | Color, fondo, borde, sombra, opacidad, transform, filtro — el set más común |
| `transition-colors` | Solo color/fondo/borde |
| `transition-opacity` | Solo opacidad |
| `transition-transform` | Solo `rotate-`/`scale-`/`translate-`/`skew-` |
| `transition-shadow` | Solo `shadow-` |
| `transition-all` | Cualquier propiedad animable (más caro en rendimiento) |
| `transition-none` | Desactiva la transición |

### Duración, curva y retraso

| Clase | Propiedad |
|---|---|
| `duration-75` … `duration-1000` | Duración en milisegundos |
| `ease-linear` | Velocidad constante |
| `ease-in` | Empieza lento, acelera |
| `ease-out` | Empieza rápido, frena (la más natural para hover) |
| `ease-in-out` | Lento al principio y al final |
| `delay-75` … `delay-1000` | Espera antes de empezar |

!!! tip "`transition-colors` en vez de `transition-all` por defecto"
    `transition-all` vigila TODAS las propiedades animables aunque solo cambie una — es más caro de calcular para el navegador. Declarar la propiedad concreta (`transition-colors`, `transition-transform`) es más preciso y más barato; `transition-all` se reserva para cuando de verdad cambian varias cosas a la vez.

---

## Animaciones predefinidas {: .topic-title }

Animaciones ya listas, se repiten solas sin necesidad de un estado (`hover:`, etc.):

```html
<div class="animate-spin">⏳</div>
<span class="animate-ping absolute size-3 rounded-full bg-sky-400"></span>
```

| Clase | Efecto |
|---|---|
| `animate-spin` | Rotación continua — spinners de carga |
| `animate-ping` | Pulso que crece y se desvanece — notificaciones, indicadores "en vivo" |
| `animate-pulse` | Parpadeo suave de opacidad — placeholders de carga (*skeleton*) |
| `animate-bounce` | Rebote vertical |
| `animate-none` | Sin animación |

!!! note "Animaciones personalizadas necesitan `@keyframes`"
    Las 4 animaciones predefinidas cubren los casos más comunes. Para una animación propia hace falta definir un `@keyframes` en CSS y registrarlo en `@theme` — Tailwind no genera keyframes arbitrarios solo con clases de utilidad.

---

## 📖 Referencias

- 📘 **Documentación oficial — Transition property** — https://tailwindcss.com/docs/transition-property
- 📘 **Documentación oficial — Animation** — https://tailwindcss.com/docs/animation
