# Configuración v4 { .bloque-tailwind }

> Desde v4, la configuración vive en CSS, no en un archivo JavaScript aparte. Si aprendes Tailwind hoy, esto es lo que te vas a encontrar.

---

## CSS-first: `@import` y `@theme` {: .topic-title }

Todo arranca con una línea en tu CSS principal:

```css
@import "tailwindcss";
```

Para personalizar los tokens de diseño (colores, fuentes, espaciados propios del proyecto), se usa el bloque `@theme`, directamente en CSS:

```css
@import "tailwindcss";

@theme {
  --color-marca: #0EA5E9;
  --font-display: "Poppins", sans-serif;
}
```

Cada variable definida en `@theme` genera automáticamente sus utility classes: `--color-marca` te da `bg-marca`, `text-marca`, `border-marca`, sin configurar nada más.

!!! note "El `.js` de configuración no desapareció del todo"
    Para proyectos que migran desde v3, o para configuración avanzada (plugins complejos), Tailwind v4 todavía admite cargar un `tailwind.config.js` con la directiva `@config` — pero el camino nuevo, y el que verás en tutoriales actuales, es CSS-first.

---

## Compilación JIT — por qué el CSS final es tan pequeño {: .topic-title }

Cada vez que compilas (o cada vez que `--watch` detecta un cambio), Tailwind **escanea tu HTML/JS buscando qué utility classes usas de verdad** y genera CSS solo para esas — nada del framework que no aparezca escrito en tu código termina en el archivo final. Este motor se llama **JIT** (Just-In-Time).

```html
<div class="bg-sky-500 p-4">
```

Con esa línea en tu HTML, el CSS final incluye SOLO las reglas de `bg-sky-500` y `p-4` — no las miles de combinaciones posibles de color/espaciado que Tailwind podría generar en teoría.

!!! note "Antes de v3 esto era un paso aparte"
    En Tailwind v2, el CSS se generaba completo primero y luego una herramienta externa (`PurgeCSS`) lo "purgaba" en un segundo paso. Desde v3, el escaneo y la generación pasan a la vez, en la misma compilación — más rápido, y es lo que hace que ya no haga falta declarar manualmente qué archivos escanear en v4.

!!! tip "Sin `--watch`, hay que recompilar a mano cada vez"
    El escaneo JIT solo ocurre CUANDO compilas — si añades una clase nueva en el HTML y no vuelves a lanzar el comando, el CSS final se queda desactualizado y esa clase no tiene estilos. `--watch` vigila los archivos y relanza la compilación solo en cada guardado, así los cambios se ven en tiempo real sin tener que ejecutar el comando a mano una y otra vez.

---

## 📖 Referencias

- 📘 **Documentación oficial — Theme variables** — https://tailwindcss.com/docs/theme
- 📘 **Documentación oficial — Upgrade guide (v3 → v4)** — https://tailwindcss.com/docs/upgrade-guide
