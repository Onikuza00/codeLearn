# JSX desde cero { .section-react .bloque-react }

> `createElement` funciona, pero es largo y difícil de leer. JSX permite escribir la estructura de la interfaz con una sintaxis parecida a HTML dentro de JavaScript.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/vGRARY_mRxg" title="JSX: la sintaxis de React" loading="lazy" allowfullscreen></iframe>
</div>

---

## Qué es JSX {: .topic-title }

**JSX** es una extensión de la sintaxis de JavaScript que permite escribir marcado parecido a HTML dentro del código. Midudev lo resume así: JSX **no es HTML**, es JavaScript que se parece a HTML.

Ventajas frente a `createElement`: menos código, estructura más visible y una lectura más natural.

```jsx
const card = (
    <article className="job-card">
        <h3>Frontend Developer</h3>
        <p>Remoto · Barcelona</p>
        <button>Aplicar</button>
    </article>
);
```

!!! info "Si vienes de Vue"
    Es el mismo papel que el `<template>`, pero sin archivo ni sintaxis aparte: el marcado vive dentro de JavaScript y es una expresión más.

---

## Qué hace el compilador {: .topic-title }

El navegador no entiende JSX. Una herramienta de compilación lo transforma en llamadas a `createElement`:

| Escribes (JSX) | Se ejecuta (JavaScript) |
|---|---|
| `<h1>Hola</h1>` | `React.createElement("h1", null, "Hola")` |
| `<p className="x">Texto</p>` | `React.createElement("p", { className: "x" }, "Texto")` |

Por eso JSX es **azúcar sintáctico**: la misma aplicación, escrita de forma más cómoda.

---

## Reglas básicas {: .topic-title }

| Regla | Ejemplo |
|---|---|
| Cerrar **todas** las etiquetas, también las vacías | `<img />`, `<input />`, `<br />` |
| Una **sola raíz** por expresión | Envolver hermanos en un `<div>` o en un Fragment |
| Paréntesis si el JSX ocupa varias líneas | `return ( ... );` |
| JSX es una **expresión** | Se asigna a variables, se pasa como argumento o se devuelve de una función |

!!! warning "`className`, no `class`"
    `class` es palabra reservada de JavaScript, así que el atributo se escribe `className`.

| En Vue | En React |
|---|---|
| `<template>` en un archivo `.vue` | JSX dentro del `.jsx` |
| `class="job-card"` | `className="job-card"` |
| Etiquetas vacías sin cerrar (`<img>`) | Siempre cerradas (`<img />`) |

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| JSCamp (midudev) — JSX: La sintaxis de React | <https://www.jscamp.dev/introduccion-a-react/jsx> |
| React — Escribir marcado con JSX | <https://es.react.dev/learn/writing-markup-with-jsx> |
| Vídeo de apoyo — JSX | <https://www.youtube.com/watch?v=vGRARY_mRxg> |
