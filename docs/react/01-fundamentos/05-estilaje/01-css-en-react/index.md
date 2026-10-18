# CSS en React { .section-react .bloque-react }

> Antes de usar Tailwind o cualquier otra herramienta hay que entender cómo entra el CSS en una aplicación de React: dónde va el archivo, cómo se conecta con el componente y cómo se le pasan clases desde fuera. Es la mecánica base y es igual en todos los casos.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/7iobxzd_2wY?start=3770" title="Curso React.js, aprende desde cero — midulive (desde 1:02:50, Estilos en React)" loading="lazy" allowfullscreen></iframe>
</div>

---

## El CSS es el de siempre {: .topic-title }

React no inventa una forma nueva de escribir CSS. Las reglas son las mismas: selectores, propiedades, variables, media queries. Lo que hay que aprender es cómo se pone la clase en el JSX y cómo se conecta el archivo CSS con el componente, y es lo que explica este capítulo.

---

## `className` en lugar de `class` {: .topic-title }

`class` es una palabra reservada de JavaScript (sirve para crear clases), y JSX es JavaScript. Por eso la clase de un elemento se escribe `className`:

```jsx
<article className="card">...</article>
```

El navegador recibe el HTML normal, con `class`:

```html
<article class="card">...</article>
```

El valor es un texto como cualquier otro, así que varias clases van separadas por un espacio: `className="card destacada"`. Está explicado en [JSX desde cero](../../02-jsx/01-jsx-desde-cero/index.md); aquí lo usamos para enlazarlo con un archivo CSS.

!!! warning "Si escribes `class`, no funciona como esperas"
    Copiar HTML con `class="..."` dentro de JSX es el fallo más común al migrar. Búscalo con el editor (`class=`) y cámbialo por `className=`.

---

## Un archivo CSS y su `import` {: .topic-title }

En un proyecto de Vite, el CSS de un componente es un archivo `.css` que **importas desde el propio componente**. Lo ponemos junto a él:

```text
src/
  App.jsx
  JobCard.jsx
  JobCard.css     ← nuevo
```

Primero el CSS. Es una hoja de estilos normal:

```css
/* src/JobCard.css */
.card {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    padding: 1rem;
}

.card h3 {
    margin: 0;
    color: var(--color-primario);
}
```

Después, el componente. La línea `import "./JobCard.css"` le dice a Vite que ese archivo forma parte de la aplicación; no hay que guardar nada en ninguna variable:

```jsx
// src/JobCard.jsx
import "./JobCard.css";

export default function JobCard({ titulo, empresa }) {
    return (
        <article className="card">
            <h3>{titulo}</h3>
            <small>{empresa}</small>
        </article>
    );
}
```

`App.jsx` usa el componente como siempre. No tiene que saber nada del CSS:

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return <JobCard titulo="Ingeniero Backend" empresa="Data Systems" />;
}
```

Y el navegador recibe el HTML con la clase. El contenido de `JobCard.css` lo inyecta Vite en la página dentro de una etiqueta `<style>`, y cada vez que guardas el archivo se actualiza sin recargar:

```html
<head>
    <style>
        .card { border: 1px solid #ddd; ... }
        .card h3 { margin: 0; ... }
    </style>
</head>
<body>
    <article class="card">
        <h3>Ingeniero Backend</h3>
        <small>Data Systems</small>
    </article>
</body>
```

!!! warning "Si te olvidas del `import`, no hay error"
    El componente se pinta igual, solo que **sin estilos**. Si una clase "no hace nada", revisa primero que el `import` está y que la ruta empieza por `./`.

---

## Dónde va cada archivo CSS {: .topic-title }

Un proyecto de Vite suele tener dos tipos de CSS:

```text
src/
  main.jsx          ← importa index.css
  index.css         ← estilos de TODA la aplicación
  App.jsx
  JobCard.jsx
  JobCard.css       ← estilos de UN componente
```

**`index.css`**: es el que trae la plantilla de Vite, y `main.jsx` lo importa con `import "./index.css"`. Aquí van las cosas generales de la página: el reset, la tipografía base, las variables en `:root`.

```css
/* src/index.css */
:root {
    --color-primario: #1e3a8a;
}

body {
    margin: 0;
    font-family: system-ui, sans-serif;
}
```

Por eso `JobCard.css` pudo usar `var(--color-primario)` sin definirla: está en `index.css` y vale para toda la aplicación.

**`JobCard.css`**: los estilos de un componente concreto, junto a él y con su mismo nombre. Así, si borras el componente, borras también su CSS.

!!! warning "El CSS es global aunque lo importes desde un solo componente"
    Que `JobCard.css` se importe en `JobCard.jsx` no lo limita a ese componente. Vite lo inyecta en toda la página, así que `.card` afecta a **cualquier** elemento con esa clase, en cualquier componente. Dos componentes que usen la misma clase se pisan. Esto es lo que resuelven los [CSS Modules](../03-css-modules/index.md).

!!! tip "Vue lo hace distinto"
    En Vue, `<style scoped>` limita el CSS al componente. En React no hay nada equivalente con un `.css` normal: el archivo es global, y el ámbito local lo da otra herramienta (CSS Modules) o ninguna (Tailwind).

---

## Una clase según una prop {: .topic-title }

Para que el estilo cambie según los datos, la clase tiene que depender de una prop. Añadimos al CSS una clase `destacada`:

```css
/* src/JobCard.css */
.destacada {
    border-color: gold;
    background-color: #fffbe6;
}
```

`className` es una expresión de JavaScript, así que puedes usar un ternario: siempre `card`, y `destacada` solo si la prop es `true`.

```jsx
// src/JobCard.jsx
import "./JobCard.css";

export default function JobCard({ titulo, empresa, destacada }) {
    return (
        <article className={destacada ? "card destacada" : "card"}>
            <h3>{titulo}</h3>
            <small>{empresa}</small>
        </article>
    );
}
```

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return (
        <section>
            <JobCard titulo="Ingeniero Backend" empresa="Data Systems" />
            <JobCard titulo="Desarrollador Frontend" empresa="Tech Solutions" destacada={true} />
        </section>
    );
}
```

El primer `JobCard` recibe `destacada: undefined`, que es falso, y se queda con `card`. El segundo recibe `true` y añade la otra clase:

```html
<section>
    <article class="card">...</article>
    <article class="card destacada">...</article>
</section>
```

!!! tip "Con muchas condiciones, usa `clsx`"
    Un ternario va bien para una condición. Si hay tres o cuatro, se lee mucho mejor con `clsx`, que tienes en la sección siguiente.

---

## `clsx`: varias clases condicionales {: .topic-title }

!!! info "Paso 1: el problema"
    Imagina que el `JobCard` tiene dos props que cambian su aspecto: `destacada` y `cerrada`. Con una plantilla de texto y dos ternarios queda así:

    ```jsx
    <article className={`card ${destacada ? "destacada" : ""} ${cerrada ? "cerrada" : ""}`}>
    ```

    Funciona, pero cuesta leerlo, y deja espacios de sobra: si ninguna prop es verdadera, el resultado es `"card  "`, con espacios al final. Cuantas más condiciones haya, peor.

    **`clsx`** es una función muy pequeña que construye ese texto por ti.

!!! info "Paso 2: instalarlo"
    ```bash
    pnpm add clsx
    ```

    Y se importa en el componente que lo vaya a usar:

    ```jsx
    import clsx from "clsx";
    ```

!!! info "Paso 3: qué hace"
    `clsx` recibe textos y devuelve **un solo texto con todos ellos separados por un espacio**:

    ```js
    clsx("card", "destacada");   // "card destacada"
    ```

    Eso es lo que necesita `className`. Hasta aquí no tiene ninguna ventaja; la ventaja viene en el siguiente paso.

!!! info "Paso 4: añadir una clase solo si se cumple una condición"
    Para eso se usa `&&`, que se lee «y entonces». Funciona así:

    ```js
    true && "destacada"    // "destacada"
    false && "destacada"   // false
    ```

    Si la condición es verdadera, el resultado es la clase. Si es falsa, el resultado es `false`. Y `clsx` **ignora todo lo que sea falso** (`false`, `null`, `undefined`), no lo escribe:

    ```js
    clsx("card", true && "destacada");    // "card destacada"
    clsx("card", false && "destacada");   // "card"
    ```

    Con una prop en lugar de `true` o `false`, queda:

    ```js
    clsx("card", destacada && "destacada");
    ```

    «Pon `card` siempre, y pon `destacada` solo si la prop `destacada` es verdadera».

!!! info "Paso 5: aplicarlo al `JobCard`"
    Primero la clase `cerrada` en el CSS, junto a `destacada`:

    ```css
    /* src/JobCard.css */
    .cerrada {
        opacity: 0.5;
    }
    ```

    Después el componente. Cada elemento de `clsx` es una clase: la primera va siempre y las otras dos dependen de su prop.

    ```jsx
    // src/JobCard.jsx
    import clsx from "clsx";
    import "./JobCard.css";

    export default function JobCard({ titulo, empresa, destacada, cerrada }) {
        return (
            <article className={clsx("card", destacada && "destacada", cerrada && "cerrada")}>
                <h3>{titulo}</h3>
                <small>{empresa}</small>
            </article>
        );
    }
    ```

    Y `App.jsx` usa el componente con tres combinaciones distintas de props:

    ```jsx
    // src/App.jsx
    import JobCard from "./JobCard.jsx";

    export default function App() {
        return (
            <section>
                <JobCard titulo="Ingeniero Backend" empresa="Data Systems" />
                <JobCard titulo="Desarrollador Frontend" empresa="Tech Solutions" destacada={true} />
                <JobCard titulo="Analista de datos" empresa="Data Systems" destacada={true} cerrada={true} />
            </section>
        );
    }
    ```

    Lo que pasa con cada uno:

    | `JobCard` | Props | `clsx(...)` devuelve |
    |---|---|---|
    | Primero | ninguna | `"card"` |
    | Segundo | `destacada` | `"card destacada"` |
    | Tercero | `destacada` y `cerrada` | `"card destacada cerrada"` |

    Y el HTML que llega al navegador:

    ```html
    <section>
        <article class="card">...</article>
        <article class="card destacada">...</article>
        <article class="card destacada cerrada">...</article>
    </section>
    ```

!!! tip "Para añadir otra condición, añade otra línea"
    Si mañana hay una prop `urgente`, solo tienes que escribir `urgente && "urgente"` dentro de `clsx`. No hay que tocar nada más.

!!! tip "`clsx` y `classnames` hacen lo mismo"
    Si ves `classnames` en un proyecto antiguo, o en la lección de CSS Modules de midudev, es la misma idea con otro nombre. Encontrarás una de las dos.

!!! warning "No lo uses con una sola condición"
    Con una única condición, el ternario de la sección anterior es más corto y no necesita instalar nada. `clsx` compensa cuando hay varias.

---

## Aceptar un `className` desde fuera {: .topic-title }

A veces quien usa el componente quiere añadirle una clase propia, por ejemplo la que lo marca como destacado. Para eso el componente recibe una prop llamada `className` y la **suma** a la suya:

```jsx
// src/JobCard.jsx
import "./JobCard.css";

export default function JobCard({ titulo, empresa, className = "" }) {
    return (
        <article className={`card ${className}`}>
            <h3>{titulo}</h3>
            <small>{empresa}</small>
        </article>
    );
}
```

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return <JobCard titulo="Ingeniero Backend" empresa="Data Systems" className="destacada" />;
}
```

React llama a `JobCard({ titulo: "...", empresa: "...", className: "destacada" })`, la plantilla de texto junta las dos clases y sale:

```html
<article class="card destacada">...</article>
```

`className` aquí es el **nombre de una prop**, igual que `titulo` o `empresa`. React no hace nada especial con ella: eres tú quien la coloca en el elemento.

!!! warning "Sin valor por defecto, aparece la palabra `undefined`"
    Si quitas el `= ""` y alguien usa `<JobCard />` sin `className`, la plantilla de texto escribe `class="card undefined"`. Es el motivo de poner `className = ""` en la firma, como se explica en [Valores por defecto](../../04-props/02-valores-por-defecto-y-spread/index.md).

---

## `style` o `className` {: .topic-title }

Para un valor que viene de una prop (un color, un ancho en píxeles), la clase CSS no sirve, porque no sabes el valor de antemano. Ahí se usa `style`, que se explica en [Estilos en JSX](../../02-jsx/04-estilos-en-jsx/index.md).

| Qué quieres | Usa |
|---|---|
| Un estilo fijo (borde, relleno, tipografía) | `className` + una clase en el archivo CSS |
| Distintos estilos según el caso | `className` con la clase que toque |
| Un valor calculado o recibido por prop | `style={{ ... }}` |

!!! tip "Empieza siempre por `className`"
    Los estilos en línea no admiten `:hover`, ni media queries, ni pseudoelementos. Solo úsalos para valores que realmente cambian con los datos.

---

## En Vue y en React {: .topic-title }

| En Vue | En React |
|---|---|
| `class="card"` | `className="card"` |
| `:class="{ destacada: destacada }"` | `` className={destacada ? "card destacada" : "card"} `` |
| `:style="{ color: color }"` | `style={{ color: color }}` |
| `<style scoped>` dentro del `.vue` | Archivo `.css` aparte, **global** |
| Variables CSS en `<style>` | Variables CSS en `index.css` |

!!! warning "Sin fuente oficial"
    La tabla de Vue es conocimiento propio. La diferencia importante es que un `.css` importado en React no tiene ámbito local, aunque se importe desde un solo componente.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| midulive — Curso React.js, aprende desde cero (desde 1:02:50, Estilos en React) | <https://www.youtube.com/watch?v=7iobxzd_2wY&t=3770s> |
| Vite — Características: CSS | <https://vite.dev/guide/features#css> |
| JSCamp — Instalación de Vite (`main.jsx` e `index.css`) | <https://www.jscamp.dev/introduccion-a-react/instalacion-vite> |
