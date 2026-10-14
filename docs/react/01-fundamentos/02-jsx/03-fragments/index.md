# Fragments { .section-react .bloque-react }

> Una expresión JSX solo puede tener un elemento raíz. Un Fragment agrupa elementos sin añadir ningún nodo extra al DOM.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/7iobxzd_2wY?start=2070" title="Fragment (desde 34:30) — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## El problema de la raíz única {: .topic-title }

Devolver dos elementos hermanos da error:

```jsx
// ❌ Error: las expresiones JSX deben tener un único elemento padre
return (
    <h1>Empleos</h1>
    <p>3 disponibles</p>
);
```

El mensaje original de la consola es `JSX expressions must have one parent element`.

El motivo, según la documentación de React: el JSX se transforma en objetos de JavaScript y una función no puede devolver dos objetos sin envolverlos en uno.

---

## Dos soluciones {: .topic-title }

**Envolver en un `<div>`:** funciona, pero añade un nodo al DOM que quizá no quieres (estilos, `ul > li`, tablas...).

**Usar un Fragment**, la sintaxis corta `<>...</>`:

```jsx
return (
    <>
        <h1>Empleos</h1>
        <p>3 disponibles</p>
    </>
);
```

En el navegador solo aparecen el `<h1>` y el `<p>`, sin contenedor.

!!! info "Fuente"
    La lección de midudev solo adelanta los Fragments al hablar de la raíz única. El detalle de esta página es de la documentación de React, [Escribir marcado con JSX](https://es.react.dev/learn/writing-markup-with-jsx).

| En Vue | En React |
|---|---|
| Vue 3 admite varias raíces en el `<template>` | Una sola raíz: `<div>` o Fragment `<>...</>` |

---

## Fragment con `key` {: .topic-title }

El atajo `<>...</>` no admite atributos, así que no puede llevar `key`. Cuando necesites una `key` (por ejemplo, al repetir un grupo de elementos en una lista), importa `Fragment` y escríbelo completo:

```jsx
import { Fragment } from "react";

{jobs.map(job => (
    <Fragment key={job.id}>
        <h2>{job.title}</h2>
        <p>{job.company}</p>
    </Fragment>
))}
```

`<Fragment>` y `<>...</>` hacen lo mismo; la única diferencia es que solo la forma completa acepta `key`.

!!! tip "Cuándo usar cada uno"
    Usa `<>...</>` por defecto. Cambia a `<Fragment key={...}>` solo cuando estés repitiendo el grupo con `.map()`. La lista y la `key` se explican en el capítulo de renderizado de listas.

**Caso 1: un grupo que se escribe una sola vez → `<>...</>`**

```jsx
function Header() {
    return (
        <>
            <h1>Empleos</h1>
            <p>3 disponibles</p>
        </>
    );
}
```

No hay lista ni repetición, así que no necesitas `key`.

**Caso 2: el mismo grupo repetido para cada elemento de un array → `<Fragment key={...}>`**

```jsx
const jobs = [
    { id: 1, title: "Frontend", company: "Acme" },
    { id: 2, title: "Backend", company: "Globex" },
];

function JobList() {
    return (
        <section>
            {jobs.map(job => (
                // Cada vuelta del map devuelve un grupo (h2 + p): React necesita la key aquí
                <Fragment key={job.id}>
                    <h2>{job.title}</h2>
                    <p>{job.company}</p>
                </Fragment>
            ))}
        </section>
    );
}
```

El HTML resultante no lleva contenedores extra; `<h2>` y `<p>` quedan como hermanos directos:

```html
<section>
    <h2>Frontend</h2>
    <p>Acme</p>
    <h2>Backend</h2>
    <p>Globex</p>
</section>
```

!!! warning "Con `<>` dentro de un `.map()` falla"
    Si escribes `<>...</>` en lugar de `<Fragment key={job.id}>`, React avisa en consola de que cada elemento de la lista necesita una `key`, y no hay forma de ponérsela al atajo.

| En Vue | En React |
|---|---|
| `<template v-for="job in jobs" :key="job.id">` | `<Fragment key={job.id}>` dentro de un `.map()` |

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| JSCamp (midudev) — JSX: La sintaxis de React | <https://www.jscamp.dev/introduccion-a-react/jsx> |
| React — Escribir marcado con JSX | <https://es.react.dev/learn/writing-markup-with-jsx> |
| React — `<Fragment>` (complemento: Fragment con `key`) | <https://es.react.dev/reference/react/Fragment> |
