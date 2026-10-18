# Props { .section-react .bloque-react }

> Los componentes pueden recibir props (propiedades), igual que una función recibe argumentos. Con ellas el mismo componente se reutiliza con datos distintos.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/xPmiUUf9Kgs" title="Creando componente para un empleo con React — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Props: pasando datos a componentes {: .topic-title }

Hasta ahora `Saludar` siempre decía lo mismo. Con **props** le das datos desde fuera, igual que a una función le pasas argumentos. Vamos a verlo de principio a fin, en el proyecto de Vite, con dos archivos.

**1. El componente**, que recibe `nombre` entre llaves en el parámetro. Es la forma habitual de escribirlo:

```jsx
// src/Saludar.jsx
export default function Saludar({ nombre }) {
    return <h1>¡Hola, {nombre}!</h1>;
}
```

**2. Dónde se usa**, escribiendo `nombre="Miguel"` dentro de la etiqueta, como un atributo de HTML:

```jsx
// src/App.jsx
import Saludar from "./Saludar.jsx";

export default function App() {
    return <Saludar nombre="Miguel" />;
}
```

**3. Qué pasa por dentro.** Cada atributo que escribes en la etiqueta es una prop. React las junta todas en **un único objeto** y llama a tu función con él. Las llaves del parámetro (`{ nombre }`) sacan de ese objeto el valor de `nombre`:

| Paso | Qué ocurre |
|---|---|
| Escribes | `<Saludar nombre="Miguel" />` |
| React construye | `{ nombre: "Miguel" }` |
| React llama a la función | `Saludar({ nombre: "Miguel" })` |
| Las llaves del parámetro | Sacan `nombre` de ese objeto: ahora `nombre` vale `"Miguel"` |

**4. El resultado** en el navegador:

```html
<h1>¡Hola, Miguel!</h1>
```

Si usas el componente dos veces con datos distintos, cada uso recibe su propio objeto:

```jsx
// src/App.jsx
import Saludar from "./Saludar.jsx";

export default function App() {
    return (
        <section>
            <Saludar nombre="Miguel" />
            <Saludar nombre="Ana" />
        </section>
    );
}
```

```html
<section>
    <h1>¡Hola, Miguel!</h1>
    <h1>¡Hola, Ana!</h1>
</section>
```

Esas llaves del parámetro se llaman **destructuring** (desestructuración: sacar las propiedades de un objeto directamente en variables). Es la forma que verás en casi todo el código real.

!!! warning "No olvides las llaves del parámetro"
    `function Saludar(nombre)` sin llaves **no** es destructuring: `nombre` sería el objeto entero `{ nombre: "Miguel" }` y verías `[object Object]` en pantalla. Las llaves son las que sacan el valor.

!!! warning "Una prop olvidada no da error"
    Si en `App.jsx` escribes `<Saludar />` sin `nombre`, `nombre` vale `undefined` y el título sale como «¡Hola, !». React no avisa de nada.

---

## La otra forma: el objeto `props` {: .topic-title }

También puedes recibir el objeto entero con un solo parámetro, que por costumbre se llama `props`, y leer cada dato con un punto. Es lo que enseña midudev primero y lo verás en código antiguo y en muchos ejemplos:

```jsx
// src/Saludar.jsx
export default function Saludar(props) {
    return <h1>¡Hola, {props.nombre}!</h1>;
}
```

`App.jsx` no cambia: sigue siendo `<Saludar nombre="Miguel" />`. Dentro de la función, `props` es el objeto `{ nombre: "Miguel" }`, así que `props.nombre` vale `"Miguel"`.

Estas tres formas hacen exactamente lo mismo:

```jsx
// 1. Destructuring en el parámetro (la habitual)
function Saludar({ nombre }) {
    return <h1>¡Hola, {nombre}!</h1>;
}

// 2. Sacando la variable a mano
function Saludar(props) {
    const nombre = props.nombre;
    return <h1>¡Hola, {nombre}!</h1>;
}

// 3. Con el objeto props
function Saludar(props) {
    return <h1>¡Hola, {props.nombre}!</h1>;
}
```

El resultado es el mismo en las tres: `<h1>¡Hola, Miguel!</h1>`. La primera es más limpia, porque no tienes que escribir `props.` delante de cada dato.

!!! tip "Mira qué recibe tu componente"
    Si dudas de qué contiene `props`, escribe `console.log(props)` dentro de la función (con la forma 2 o 3). En la consola del navegador verás el objeto, por ejemplo `{ nombre: "Miguel" }`.

---

## Múltiples props {: .topic-title }

Puedes pasar tantas props como necesites. Cada una es un atributo más en la etiqueta:

```jsx
// src/Saludar.jsx
export default function Saludar({ nombre, edad, ciudad }) {
    return (
        <div>
            <h1>¡Hola, {nombre}!</h1>
            <p>
                Tienes {edad} años y vives en {ciudad}
            </p>
        </div>
    );
}
```

```jsx
// src/App.jsx
import Saludar from "./Saludar.jsx";

export default function App() {
    return <Saludar nombre="Miguel" edad={25} ciudad="Madrid" />;
}
```

React junta las tres en un solo objeto y lo pasa a la función:

```jsx
Saludar({ nombre: "Miguel", edad: 25, ciudad: "Madrid" })
```

El resultado:

```html
<div>
    <h1>¡Hola, Miguel!</h1>
    <p>Tienes 25 años y vives en Madrid</p>
</div>
```

### Lo que no es texto va entre llaves

Con comillas, el valor siempre es un **texto**. Si quieres un número, un booleano, un array o un objeto, usa llaves. Fíjate en qué recibe la función en cada caso:

| Escribes | La función recibe | Tipo |
|---|---|---|
| `edad="25"` | `"25"` | texto |
| `edad={25}` | `25` | número |
| `activo={true}` | `true` | booleano |
| `tags={["a", "b"]}` | `["a", "b"]` | array |

!!! warning "Error típico: con comillas no es un número"
    Con comillas, `edad + 1` da `"251"` (junta dos textos). Con llaves, `edad={25}`, da `26`.

---

## Las props de las etiquetas HTML {: .topic-title }

Ya usabas props sin saberlo. En `<img src="foto.jpg" alt="Foto" width={100} />`, `src`, `alt` y `width` son props de la etiqueta `<img>`.

Las de `<img>` vienen ya definidas. En tus componentes inventas las que quieras, con el nombre que quieras, y de **cualquier tipo**: texto, números, objetos, arrays o funciones.

!!! tip "El nombre de la prop tiene que coincidir"
    Si en `App.jsx` escribes `nombre="Miguel"` pero el componente lee `{ name }`, `name` valdrá `undefined` sin ningún aviso. El nombre del atributo y el del parámetro deben ser el mismo.

---

## Pasar un objeto como prop {: .topic-title }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/xPmiUUf9Kgs?start=288" title="Creando componente para un empleo con React — midudev (desde el minuto 4:48)" loading="lazy" allowfullscreen></iframe>
</div>

Hasta ahora has pasado una prop por cada dato: `nombre`, `edad`, `ciudad`. Cuando los datos son muchos y van juntos (los de un empleo, un usuario, un producto), es más cómodo agruparlos en **un objeto** y pasar solo ese objeto. El componente recibe una sola prop y pinta cada dato en el HTML.

El flujo completo. Primero, el componente `JobCard` recibe la prop `empleo` y lee cada dato con un punto:

```jsx
// src/JobCard.jsx
export default function JobCard({ empleo }) {
    return (
        <article>
            <h3>{empleo.titulo}</h3>
            <small>{empleo.empresa} | {empleo.ubicacion}</small>
            <p>{empleo.descripcion}</p>
        </article>
    );
}
```

Después, `App.jsx` tiene los datos en un objeto y se lo pasa al componente:

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    const empleo = {
        titulo: "Desarrollador Frontend",
        empresa: "Tech Solutions Inc.",
        ubicacion: "Remoto",
        descripcion: "Buscamos un desarrollador con experiencia en React.",
    };

    return <JobCard empleo={empleo} />;
}
```

Qué pasa por dentro: `empleo={empleo}` entrega el objeto entero como una sola prop. React llama a `JobCard({ empleo: { titulo: "Desarrollador Frontend", ... } })`. Las llaves del parámetro sacan `empleo`, y `empleo.titulo` vale `"Desarrollador Frontend"`.

El resultado en el navegador:

```html
<article>
    <h3>Desarrollador Frontend</h3>
    <small>Tech Solutions Inc. | Remoto</small>
    <p>Buscamos un desarrollador con experiencia en React.</p>
</article>
```

Con un objeto en una variable, entre llaves va solo el nombre: `empleo={empleo}`. Si escribes el objeto directamente en la etiqueta salen **dos pares** de llaves:

```jsx
<JobCard empleo={{ titulo: "Desarrollador Frontend", empresa: "Tech Solutions Inc.", ubicacion: "Remoto" }} />
```

Las de fuera abren JavaScript dentro del JSX. Las de dentro son las del objeto. No es una sintaxis especial.

!!! tip "Un objeto o muchas props"
    Con pocos datos, props sueltas (`titulo`, `empresa`). Con muchos datos que van juntos, un objeto. Si el objeto viene de una lista o de un servidor, es lo que recibirás, y pasarlo entero es lo más cómodo.

!!! warning "Un dato que no existe en el objeto"
    Si el objeto no tiene la clave que lees, por ejemplo `empleo.salario`, el resultado es `undefined` y no se pinta nada, sin error. Y si el objeto entero no llega (`<JobCard />`), `empleo.titulo` rompe la página con un error.

---

## Lo que viene después {: .topic-title }

Los valores por defecto y el reenvío de props con spread están en [Valores por defecto y spread](../02-valores-por-defecto-y-spread/index.md).

!!! tip "Consejos"
    - **Llaves o comillas, nunca las dos:** `src="{foto}"` pinta el texto literal `{foto}`. Para usar una variable, `src={foto}`.
    - **Las props son de solo lectura:** el hijo las lee, pero no las cambia. Si necesita otro valor, calcula una variable nueva.
    - **Nombres claros:** `nombre`, `edad` y `ciudad` se entienden solos; `n`, `e` y `c` obligan a adivinar.

| En Vue | En React |
|---|---|
| `defineProps(["nombre"])` en el `<script setup>` | Parámetro `{ nombre }` de la función |
| `<Saludar nombre="Miguel" :edad="25" />` | `<Saludar nombre="Miguel" edad={25} />` |
| Las props se declaran aparte | No se declaran: son los parámetros |

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| midudev — Creando componente para un empleo con React (vídeo) | <https://www.youtube.com/watch?v=xPmiUUf9Kgs> |
| JSCamp (midudev) — Componentes | <https://www.jscamp.dev/introduccion-a-react/componentes> |
| React — Pasar props a un componente (complemento: objetos como props, props que cambian) | <https://es.react.dev/learn/passing-props-to-a-component> |
