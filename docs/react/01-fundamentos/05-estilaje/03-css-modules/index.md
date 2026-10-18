# CSS Modules { .section-react .bloque-react }

> Con CSS normal, todas las clases valen para toda la aplicación y acaban pisándose entre sí. Los CSS Modules son archivos CSS con un nombre especial que hacen que las clases solo valgan para el componente que las importa.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/d9DO4MDFyXQ?start=20" title="CSS modules — midudev (desde 0:20)" loading="lazy" allowfullscreen></iframe>
</div>

---

## El problema del CSS global {: .topic-title }

Cuando importas un `.css` desde un componente, las clases no se quedan en ese componente: se añaden a **toda la aplicación**. Dos componentes que usen el mismo nombre de clase se pisan.

```css
/* src/Button.css */
.button {
    background-color: blue;
    color: white;
}
```

```css
/* src/Card.css */
.button {
    background-color: red;
    font-size: 20px;
}
```

Cada componente importa su archivo y usa la clase `button`:

```jsx
// src/Button.jsx
import "./Button.css";

export default function Button() {
    return <button className="button">Aceptar</button>;
}
```

```jsx
// src/Card.jsx
import "./Card.css";

export default function Card() {
    return (
        <article>
            <button className="button">Ver más</button>
        </article>
    );
}
```

```jsx
// src/App.jsx
import Button from "./Button.jsx";
import Card from "./Card.jsx";

export default function App() {
    return (
        <section>
            <Button />
            <Card />
        </section>
    );
}
```

El navegador recibe las dos reglas `.button` a la vez. Como tienen la misma fuerza, gana la que se carga después, la de `Card.css`. Resultado: **los dos botones salen rojos y con letra de 20 px**, aunque el primero se escribió en azul.

Midudev lo resume en cuatro problemas:

| Problema | Qué significa |
|---|---|
| Colisiones de nombres | Dos clases `.button` se pisan entre sí |
| Difícil de mantener | No sabes en qué componentes se usa cada clase |
| Miedo a romper algo | Cambiar un estilo puede afectar a otros componentes |
| Sin encapsulación | Los estilos de un componente afectan a los demás |

!!! tip "Mismo problema que en Vue"
    En Vue lo resuelve `<style scoped>`. En React no existe esa etiqueta, y por eso se usan los CSS Modules.

---

## Qué es un CSS Module {: .topic-title }

Es un archivo CSS normal con una sola diferencia: su nombre acaba en **`.module.css`**. Con eso, las clases tienen ámbito local de forma automática. Vite (o Webpack) les cambia el nombre para que sean únicas.

```text
❌ Button.css          → CSS global
✅ Button.module.css   → CSS Module (ámbito local)
```

Tres convenciones:
- El archivo se llama igual que el componente (`JobCard.module.css`).
- Termina en `.module.css`.
- Va en la misma carpeta que el componente.

!!! warning "Sin `.module` es CSS global"
    Si olvidas `.module` en el nombre, el archivo sigue siendo CSS global y el resto del capítulo no funciona. Es el error más fácil de cometer: revisa el nombre antes de buscar fallos en otro sitio.

---

## Crear y usar un CSS Module {: .topic-title }

Vamos a darle estilo al `JobCard`. Primero el archivo del módulo, junto al componente:

```text
src/
  JobCard.jsx
  JobCard.module.css   ← nuevo
```

```css
/* src/JobCard.module.css */
.card {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    padding: 1rem;
}

.titulo {
    margin: 0;
    color: var(--color-primario);
}
```

Es CSS de toda la vida. Fíjate en que `var(--color-primario)` usa una variable que vive en el CSS global (`index.css`), y no hay problema: un módulo puede usar las variables globales.

En el componente se importa el módulo con un nombre que tú eliges (por convención, `styles`) y las clases se leen como propiedades de ese objeto:

```jsx
// src/JobCard.jsx
import styles from "./JobCard.module.css";

export default function JobCard({ titulo, empresa }) {
    return (
        <article className={styles.card}>
            <h3 className={styles.titulo}>{titulo}</h3>
            <small>{empresa}</small>
        </article>
    );
}
```

`App.jsx` no cambia: usa `JobCard` como siempre.

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return <JobCard titulo="Ingeniero Backend" empresa="Data Systems" />;
}
```

Son tres pasos:

```jsx
// 1. Importar el módulo
import styles from "./JobCard.module.css";

// 2. Usar la clase como styles.nombreClase, dentro de llaves
<article className={styles.card}>
```

Con `className={styles.card}` ya no escribes un texto (`"card"`), sino que **lees una propiedad de un objeto**. Por eso lleva llaves.

!!! warning "`className=\"card\"` no funciona"
    La clase real ya no se llama `card`, así que `className="card"` no aplica ningún estilo. Usa siempre `styles.card`.

---

## Cómo funcionan por dentro {: .topic-title }

Lo que pasa en tres pasos:

**1. Lo que escribes:**

```jsx
import styles from "./JobCard.module.css";

<article className={styles.card}>
    <h3 className={styles.titulo}>Ingeniero Backend</h3>
</article>
```

**2. Lo que contiene `styles`.** Vite cambia el nombre de cada clase para hacerlo único y lo guarda en un objeto:

```js
styles = {
    card: "JobCard_card__a1b2c",
    titulo: "JobCard_titulo__d3e4f",
};
```

**3. El HTML que llega al navegador:**

```html
<article class="JobCard_card__a1b2c">
    <h3 class="JobCard_titulo__d3e4f">Ingeniero Backend</h3>
</article>
```

Los nombres siguen este patrón: `[Componente]_[clase-original]__[hash-único]`. Así, `.button` en `Button.module.css` y `.button` en `Card.module.css` pasan a llamarse distinto y **ya no se pisan**.

!!! tip "No dependas del nombre generado"
    El texto exacto (`a1b2c`) cambia según la herramienta y la versión. Es solo para entender qué pasa: trabaja siempre con `styles.card` y deja el resto a la herramienta. Para verlo en tu proyecto, abre las herramientas de desarrollo del navegador y mira el atributo `class` del elemento.

La misma prueba de antes, ahora con módulos:

```css
/* src/Button.module.css */
.button { background-color: blue; color: white; }
```

```css
/* src/Card.module.css */
.button { background-color: red; font-size: 20px; }
```

Cada componente importa su módulo y usa `styles.button`. Esta vez cada botón recibe **su** clase única, y el de `Button` sigue en azul.

---

## Nombres de clase: camelCase {: .topic-title }

Una clase con guion, como `.is-active`, obliga a usar corchetes para leerla:

```css
/* JobCard.module.css */
.is-active { background-color: gold; }
```

```jsx
<article className={styles["is-active"]}>
```

Funciona, pero es incómodo. La convención es escribir las clases en **camelCase**, para poder usar el punto:

```css
.isActive { background-color: gold; }
```

```jsx
<article className={styles.isActive}>
```

!!! tip "Si te equivocas de nombre, no hay error"
    `styles.isActiv` vale `undefined`, así que `className={undefined}` simplemente no pone ninguna clase. No verás ningún error: solo notarás que falta el estilo. Si un estilo no se aplica, comprueba primero el nombre de la clase.

---

## Aplicar varias clases {: .topic-title }

A veces un elemento necesita dos clases, o una solo si se cumple una condición. Con módulos no puedes escribir `"card destacada"` a mano, porque cada clase es un valor distinto. Hay varias formas.

Añadimos una clase al módulo:

```css
/* src/JobCard.module.css */
.destacada {
    border-color: gold;
    background-color: #fffbe6;
}
```

**Opción 1: una clase u otra con un condicional.** Cuando solo cambia una clase entera:

```jsx
<article className={destacada ? styles.destacada : styles.card}>
```

**Opción 2: plantilla de texto (*template literal*).** Cuando quieres siempre `card` y, además, `destacada` en algunos casos:

```jsx
<article className={destacada ? `${styles.card} ${styles.destacada}` : styles.card}>
```

El componente completo:

```jsx
// src/JobCard.jsx
import styles from "./JobCard.module.css";

export default function JobCard({ titulo, empresa, destacada }) {
    return (
        <article className={destacada ? `${styles.card} ${styles.destacada}` : styles.card}>
            <h3 className={styles.titulo}>{titulo}</h3>
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

El primer `JobCard` recibe una sola clase y el segundo, dos:

```html
<section>
    <article class="JobCard_card__a1b2c">...</article>
    <article class="JobCard_card__a1b2c JobCard_destacada__g5h6i">...</article>
</section>
```

**Opción 3: matriz con `join`.** Más legible cuando hay muchas condiciones:

```jsx
<article className={[styles.card, destacada && styles.destacada].filter(Boolean).join(" ")}>
```

Se leen así: se juntan las clases en una lista, `filter(Boolean)` descarta las que valen `false` o `undefined`, y `join(" ")` las une con un espacio.

**Opción 4: la librería `classnames`.** Hace lo mismo de forma más corta, pero hay que instalarla:

```jsx
import classNames from "classnames";

<article className={classNames(styles.card, { [styles.destacada]: destacada })}>
```

!!! tip "Empieza por la opción 1 o 2"
    Las dos primeras no necesitan nada más y cubren casi todos los casos. Pasa a la 3 o a `classnames` solo cuando tengas tres o más condiciones en el mismo elemento.

---

## Mezclar con CSS global {: .topic-title }

Los módulos y el CSS global conviven. Un mismo elemento puede llevar una clase del módulo y una global (por ejemplo, un `.container` que está en `index.css`):

```jsx
<article className={`${styles.card} container`}>
//                     ↑ módulo      ↑ global (texto normal)
```

La clase global va como texto normal, porque no pasa por `styles`.

### Escapar al ámbito global: `:global()`

A veces necesitas, dentro de un módulo, una regla que sí sea global. Para eso está `:global()`:

```css
/* src/JobCard.module.css */
.card {
    display: flex;          /* local */
}

:global(.container) {
    max-width: 1200px;      /* global */
    margin: 0 auto;
}
```

Se usa sobre todo para dar estilo a elementos que crea una librería externa y a los que no puedes poner `styles.algo`.

!!! warning "Úsalo con muy poca frecuencia"
    Cada `:global()` es una regla que vuelve a afectar a toda la aplicación, justo lo que querías evitar. Si te encuentras usándolo mucho, es mejor que esa regla viva en un archivo CSS global.

---

## Cuándo usar CSS Modules y cuándo CSS global {: .topic-title }

| Usa CSS Modules para | Usa CSS global para |
|---|---|
| Estilos de un componente concreto | Reset o normalize |
| Componentes reutilizables (Button, Card, Modal) | Variables globales (`:root`) |
| Evitar colisiones de nombres | Estilos de `body` y `html` |
| Proyectos medianos o grandes | Utilidades genéricas (`.container`, `.text-center`) |
| | Fuentes y tipografía base |

!!! tip "La regla práctica"
    Lo que es de **un** componente va en su `.module.css`; lo que es de **toda** la aplicación va en el CSS global. Si dudas, empieza por el módulo.

---

## En Vue y en React {: .topic-title }

| En Vue | En React |
|---|---|
| `<style scoped>` aísla los estilos del componente | Archivo `.module.css` por componente |
| `<style module>` y `$style.card` en la plantilla | `import styles from "./X.module.css"` y `styles.card` |
| Estilos globales con `<style>` sin `scoped` | CSS normal importado desde `main.jsx` |

!!! warning "Sin fuente oficial"
    La equivalencia con `scoped` y `<style module>` es conocimiento propio, no sale de midudev ni de la doc de React. Ojo a la diferencia: en Vue el CSS vive dentro del `.vue`, en React es un archivo aparte.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| midudev — 8 CSS modules (vídeo, desde 0:20) | <https://www.youtube.com/watch?v=d9DO4MDFyXQ&t=20s> |
| JSCamp — CSS Modules | <https://www.jscamp.dev/introduccion-a-react/css-modules> |
