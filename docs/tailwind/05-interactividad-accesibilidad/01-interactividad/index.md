# Interactividad { .bloque-tailwind }

> Cómo se comporta un elemento ante el ratón, el teclado y el scroll — la parte de la interfaz que no se ve hasta que alguien interactúa con ella.

---

## Cursor {: .topic-title }

```html
<button class="cursor-pointer">Botón</button>
<button class="cursor-not-allowed opacity-50" disabled>Deshabilitado</button>
```

| Clase | `cursor` |
|---|---|
| `cursor-pointer` | Manita — indica que es clicable |
| `cursor-not-allowed` | Prohibido — para elementos deshabilitados |
| `cursor-wait` | Reloj de arena — cargando |
| `cursor-grab` / `cursor-grabbing` | Para elementos arrastrables |
| `cursor-default` | Flecha normal |

!!! tip "Un `<button>` ya tiene `cursor-pointer` en la mayoría de navegadores"
    El caso real donde hace falta es en elementos que NO son `<button>`/`<a>` pero se comportan como clicables (un `<div>` con `onclick`) — ahí `cursor-pointer` es la única pista visual de que se puede pulsar.

---

## Pointer events {: .topic-title }

```html
<div class="pointer-events-none">
  <!-- ignora clics, hover, etc. — como si no estuviera -->
</div>
```

`pointer-events-none` desactiva TODA interacción del ratón sobre el elemento (clics, hover) sin ocultarlo ni quitarlo del layout. `pointer-events-auto` la restaura.

---

## User select {: .topic-title }

```html
<span class="select-none">Precio: 29,99€</span>
```

| Clase | `user-select` |
|---|---|
| `select-none` | El usuario no puede seleccionar ese texto con el ratón |
| `select-text` | Selección normal (por defecto) |
| `select-all` | Un solo clic selecciona todo el texto del elemento |

---

## Scroll behavior {: .topic-title }

```html
<html class="scroll-smooth">
```

`scroll-smooth` hace que cualquier salto a un ancla (`<a href="#seccion">`) se desplace con animación en vez de saltar de golpe. Se pone en el `<html>`, no en el elemento concreto.

---

## Formularios {: .topic-title }

```html
<input type="checkbox" class="accent-sky-500">
<textarea class="resize-none"></textarea>
```

| Clase | Efecto |
|---|---|
| `accent-<color>` | Color del check/radio/range nativo del navegador |
| `appearance-none` | Quita el estilo nativo del navegador (para estilizar un `<select>` desde cero) |
| `resize-none` | El `<textarea>` no se puede redimensionar a mano |
| `resize-y` / `resize-x` | Solo vertical / solo horizontal |

---

## 📖 Referencias

- 📘 **Documentación oficial — Cursor** — https://tailwindcss.com/docs/cursor
- 📘 **Documentación oficial — Pointer events** — https://tailwindcss.com/docs/pointer-events
- 📘 **Documentación oficial — User select** — https://tailwindcss.com/docs/user-select
