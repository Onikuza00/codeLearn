# Tu primer componente { .section-react .bloque-react }

> Hasta ahora hemos usado JSX para crear elementos, pero la verdadera potencia de React está en los componentes. Un componente es una función de JavaScript que retorna JSX: es como crear tus propias etiquetas HTML personalizadas y reutilizables.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/Yjau7HymI2o" title="Creando un componente — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## ¿Qué es un componente? {: .topic-title }

Un componente es simplemente una función de JavaScript que devuelve JSX:

```jsx
function Saludo() {
    return <h1>¡Hola desde un componente!</h1>;
}
```

Y se usa como si fuera una etiqueta HTML:

```jsx
<Saludo />
```

---

## ¿Por qué componentes? {: .topic-title }

| Ventaja | Qué significa |
|---|---|
| Reutilizables | Escribes una vez, usas en cualquier lugar |
| Organizados | Cada componente tiene su propia lógica |
| Componibles | Combinas componentes para crear interfaces complejas |
| Mantenibles | Es más fácil de entender y de modificar |

---

## Elemento vs componente {: .topic-title }

Los **elementos** son los bloques básicos de la interfaz: lo que se renderiza en el DOM, representado por etiquetas HTML.

```jsx
<h1>Hola</h1>
```

Los **componentes** son funciones que retornan elementos:

```jsx
function Saludar() {
    return <h1>Hola</h1>;
}

<Saludar />
```

Esa es la diferencia fundamental entre elementos y componentes. La mayúscula inicial es lo que los distingue para React: `<section>` es una etiqueta HTML y `<Saludar />` es tu componente.

!!! tip "`<Saludar />` no es lo mismo que `Saludar`"
    Con la etiqueta, React ejecuta la función y pinta lo que devuelve. A secas, `Saludar` es solo la función, sin ejecutar.

---

## Tu primer componente: Saludar {: .topic-title }

Vamos a crear un componente simple para entender los conceptos básicos. En el proyecto de Vite del [bloque 1.1](../../01-inicio/05-entorno-vite/index.md) son dos archivos. Primero el componente:

```jsx
// src/Saludar.jsx
export default function Saludar() {
    return <h1>¡Hola desde un componente!</h1>;
}
```

Y después se usa en `App.jsx`, que `main.jsx` ya dibuja:

```jsx
// src/App.jsx
import Saludar from "./Saludar.jsx";

export default function App() {
    return <Saludar />;
}
```

### Sin Vite

Midudev lo prueba en un solo `react.html`, con React desde un CDN y Babel traduciendo el JSX en el navegador. Sirve para probar sin instalar nada, pero es lento y no se usa en proyectos reales. El enfoque con CDN está explicado en [React sin JSX](../../01-inicio/03-react-sin-jsx/index.md); el componente `Saludar` es el mismo en los dos casos.

---

## Los tres pasos para crear un componente {: .topic-title }

Crear un componente son siempre tres cosas: definirlo, devolver JSX y exportarlo.

**1. Definir la función con nombre en mayúscula.** Si empieza en minúscula, React cree que es una etiqueta HTML y no funciona:

```jsx
function Saludar() {
    // ...
}
```

!!! warning "Con minúscula no funciona"
    `<saludar />` se lee como una etiqueta HTML que no existe, no como tu componente. Usa siempre `PascalCase` (`Saludar`, `TarjetaUsuario`).

**2. Devolver el JSX con `return`.** Lo que devuelves es lo que se pinta en pantalla. Si el JSX ocupa varias líneas, va entre paréntesis (lo ves en [JSX desde cero](../../02-jsx/01-jsx-desde-cero/index.md)):

```jsx
function Saludar() {
    return <h1>Hola, Miguel</h1>;
}
```

**3. Exportarlo.** Con `export default` dices "esta es la función principal de este archivo". Así otro archivo puede importarla (lo ves en [Importar y exportar](../03-importar-exportar/index.md)). `export` es JavaScript normal, no es de React:

```jsx
export default function Saludar() {
    return <h1>Hola, Miguel</h1>;
}
```

!!! warning "Sin `export default` no se puede importar"
    Si olvidas exportarlo, otro archivo no puede importar el componente y verás un error al arrancar.

---

## Un componente dentro de otro {: .topic-title }

Igual que en HTML metes un `<li>` dentro de un `<ul>`, en React metes un componente dentro de otro. Por debajo es una función que llama a otra función.

Al que contiene lo llamamos **padre** y al que va dentro, **hijo**. Aquí `App` es el padre y `Saludar` es el hijo, usado dos veces:

```jsx
function Saludar() {
    return <h1>Hola</h1>;
}

export default function App() {
    return (
        <section>
            <Saludar />
            <Saludar />
        </section>
    );
}
```

El navegador no sabe nada de componentes. Recibe solo el HTML que sale de ejecutar las funciones:

```html
<section>
    <h1>Hola</h1>
    <h1>Hola</h1>
</section>
```

!!! tip "Cada uso es una copia"
    Cada `<Saludar />` crea su propia copia independiente. Lo escribes una vez y lo reutilizas tantas veces como quieras.

Fíjate en la mayúscula, que es lo que distingue una cosa de otra: `<section>` es una etiqueta HTML y `<Saludar />` es tu componente.

Puedes tener **varios componentes en el mismo archivo**, como `Saludar` y `App` arriba. Es cómodo si son pequeños. Cuando el archivo crece, mueves uno a su propio archivo.

---

## No definas un componente dentro de otro {: .topic-title }

Un componente puede *usar* a otro, pero nunca *definirlo* dentro de su cuerpo:

```jsx
export default function App() {
    // Mal: Saludar se define dentro de App
    function Saludar() {
        return <h1>Hola</h1>;
    }

    return <Saludar />;
}
```

React vuelve a crear esa función cada vez que `App` se ejecuta, y para React es un componente nuevo cada vez. Pierde lo que tuviera guardado y va lento. La solución es sencilla: define cada componente fuera de los demás, como en el ejemplo anterior.

!!! warning "Error típico"
    Meter un componente dentro de otro parece cómodo porque el hijo ve las variables del padre, pero es lento y da fallos difíciles de encontrar. Todos fuera, uno al lado de otro.

Si el hijo necesita datos del padre, no se define dentro: se los pasas con **props**, que se explican en el bloque [Props](../../04-props/01-props/index.md).

---

## Cómo se organiza una aplicación {: .topic-title }

Una aplicación de React es un árbol de componentes. Arriba está uno solo, normalmente `App`, y de él cuelgan los demás, que a su vez tienen los suyos.

No hace falta que un componente se repita para merecer existir. Una barra lateral, una lista o una página entera también son componentes, aunque los uses una sola vez. Sirven para ordenar el código en piezas con nombre.

!!! tip "Consejos"
    - **Nombres de varias palabras en `PascalCase`:** `TarjetaUsuario`, no `tarjeta_usuario` ni `tarjetaUsuario`.
    - **Un componente por archivo cuando crezca:** lo habitual es llamar al archivo igual que al componente (`Saludar.jsx`).
    - **Empieza pequeño:** si un trozo de interfaz se repite o tiene nombre propio (una tarjeta, un botón), es candidato a componente.

| En Vue | En React |
|---|---|
| Un archivo `.vue` (SFC) con `<template>`, `<script>` y `<style>` | Una función que devuelve JSX |
| Importas el SFC y lo usas en el `<template>` | Importas la función y la usas como `<Saludar />` |
| El componente es un archivo | El componente es una función (puede haber varios en un archivo) |

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| midudev — Creando un componente (vídeo) | <https://www.youtube.com/watch?v=Yjau7HymI2o> |
| JSCamp (midudev) — Componentes | <https://www.jscamp.dev/introduccion-a-react/componentes> |
| React — Tu primer componente (complemento: tres pasos, padre/hijo, consejos) | <https://es.react.dev/learn/your-first-component> |
