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

---

## Comentarios en JSX {: .topic-title }

En HTML los comentarios se escriben así:

```html
<!-- Este es un comentario en HTML -->
<div>Contenido</div>
```

Si los copias tal cual dentro de JSX, la aplicación da error:

```jsx
// Mal: esto no funciona
function App() {
    return (
        <div>
            <!-- Este comentario rompe JSX -->
            <h1>Hola</h1>
        </div>
    );
}
```

JSX no es HTML, es JavaScript que se transforma en llamadas a `createElement`, y `<!-- ... -->` no es JavaScript válido. En JSX los comentarios se escriben como una expresión de JavaScript entre llaves:

```jsx
function App() {
    return (
        <div>
            {/* Este es un comentario en JSX */}
            <h1>Hola</h1>
            {/*
                Los comentarios también
                pueden ocupar varias líneas
            */}
            <p>Contenido</p>
        </div>
    );
}
```

La sintaxis es siempre `{/* tu comentario */}`: abre con `{/*` y cierra con `*/}`.

!!! tip "Busca los comentarios al migrar HTML"
    Si pasas una página de HTML a React, busca `<!--` en el editor y reemplaza cada comentario por `{/* */}`.

!!! warning "Un comentario sin llaves se pinta como texto"
    Un `/* comentario */` suelto dentro del JSX, sin las llaves, no se trata como comentario: aparece escrito en la pantalla. Las llaves son las que abren JavaScript.

---

## Paréntesis cuando el JSX ocupa varias líneas {: .topic-title }

Si el JSX cabe en la misma línea que el `return`, no hace falta nada. Si lo bajas a la línea siguiente, ponlo **entre paréntesis**:

```jsx
function Saludar() {
    return (
        <div>
            <h1>Hola, Miguel</h1>
            <p>Vives en Madrid</p>
        </div>
    );
}
```

!!! warning "Sin paréntesis no se pinta nada"
    JavaScript da el `return` por terminado al final de esa línea y todo lo de debajo se ignora. La función devuelve `undefined`, así que no aparece nada en pantalla.

---

## Un solo elemento en lo más alto {: .topic-title }

JSX devuelve **un solo elemento** en lo más alto. Esto falla:

```jsx
function Saludar() {
    return (
        <h1>Hola, Miguel</h1>
        <p>Vives en Madrid</p>
    );
}
```

!!! warning "Error típico"
    React lo rechaza con un error parecido a «Adjacent JSX elements must be wrapped in an enclosing tag» (los elementos JSX contiguos deben ir dentro de una etiqueta contenedora).

Es como una función que solo puede devolver un valor. Lo arreglas envolviéndolo todo en un `<div>`:

```jsx
function Saludar() {
    return (
        <div>
            <h1>Hola, Miguel</h1>
            <p>Vives en Madrid</p>
        </div>
    );
}
```

Si no quieres añadir un `<div>` de más al HTML, usa un Fragment `<>...</>` (lo ves en [Fragments](../03-fragments/index.md)).

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
