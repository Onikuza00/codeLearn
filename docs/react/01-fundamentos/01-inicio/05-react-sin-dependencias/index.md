# React sin dependencias (createElement) { .section-react .bloque-react }

> Antes de usar Vite o JSX, midudev monta una primera aplicación con un único archivo HTML y React cargado desde un CDN. Sirve para ver qué hace React por debajo, sin herramientas de build.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/vqw-f23bWfU" title="Primeros pasos en React — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## El archivo base {: .topic-title }

Un `index.html` con un contenedor `root` y un script de tipo módulo que importa React desde el CDN [esm.sh](https://esm.sh):

```html
<div id="root"></div>

<script type="module">
    import React from "https://esm.sh/react@19?dev";
    import { createRoot } from "https://esm.sh/react-dom@19/client?dev";

    const root = createRoot(document.getElementById("root"));
    const title = React.createElement("h1", null, "¡Hola React!");

    root.render(title);
</script>
```

No hay que instalar nada: el navegador descarga React al abrir la página.

!!! info "Solo para aprender"
    Midudev lo plantea como ejercicio didáctico. En proyectos reales se usan herramientas como Vite o Next.js.

---

## Qué hace cada parte {: .topic-title }

| Pieza | Para qué sirve |
|---|---|
| `react` | La lógica de los componentes y elementos |
| `react-dom/client` | Pinta React en el navegador (en el DOM) |
| `createRoot(nodo)` | Crea la raíz de React en el nodo del DOM donde vivirá la app |
| `root.render(elemento)` | Dibuja el elemento dentro de esa raíz |

!!! tip "Equivalencia con Vue"
    `createRoot(...).render(...)` cumple el papel de `createApp(App).mount("#app")` en Vue: decirle al framework en qué nodo debe vivir la aplicación.

---

## createElement {: .topic-title }

`React.createElement(tipo, props, ...hijos)` recibe tres cosas:

1. **Tipo:** la etiqueta (`"h1"`, `"div"`...).
2. **Props:** un objeto con atributos, estilos y eventos. `null` (o `{}`) significa «sin props».
3. **Hijos:** el contenido, uno detrás de otro.

Para anidar, los hijos son a su vez llamadas a `createElement`:

```js
const card = React.createElement(
    "article",
    { className: "job-card" },
    React.createElement("h3", null, "Frontend Developer"),
    React.createElement("p", null, "Remoto · Barcelona"),
    React.createElement("button", { onClick: () => alert("¡Aplicado!") }, "Aplicar")
);
```

Funciona, pero es muy largo para una tarjeta tan simple. Ese es el motivo por el que existe JSX (siguiente lección).

!!! tip "JSX es azúcar sintáctico"
    Al compilarse, el JSX se convierte en llamadas a `createElement`. Entender esto aquí quita el misterio al JSX después.

---

## Props habituales {: .topic-title }

| Prop | Detalle |
|---|---|
| `className` | Se usa en lugar de `class`, porque `class` es palabra reservada de JavaScript |
| `style` | Recibe un objeto y las propiedades van en camelCase: `font-size` pasa a `fontSize` |
| Eventos | En camelCase: `onClick`, `onChange`, `onSubmit` |

!!! warning "`className`, no `class`"
    Midudev lo marca como obligatorio en React.

| En Vue | En React |
|---|---|
| `class="job-card"` | `className: "job-card"` |
| `@click="apply"` | `onClick: apply` |
| `:style="{ fontSize: '16px' }"` | `style: { fontSize: "16px" }` |

---

## Por qué React y no JavaScript puro {: .topic-title }

Con el DOM a mano creas, configuras y añades cada nodo. Con React describes el resultado y él se ocupa del DOM. Midudev destaca tres ventajas: enfoque **declarativo**, código más **fácil de mantener** y actualizaciones **eficientes** (solo cambia lo necesario).

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| JSCamp (midudev) — Primeros pasos en React | <https://www.jscamp.dev/introduccion-a-react/primeros-pasos> |
| React — `createRoot` | <https://es.react.dev/reference/react-dom/client/createRoot> |
| Vídeo de apoyo — «Primeros pasos en React» | <https://www.youtube.com/watch?v=vqw-f23bWfU> |
