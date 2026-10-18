# Componentes vs funciones { .section-react .bloque-react }

> Los componentes de React son funciones de JavaScript, pero no todas las funciones son componentes. Aquí ves qué los distingue, qué puede devolver un componente y cuándo usar cada uno.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/69qpJ0ZUIlc" title="Función vs componente — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Qué distingue a un componente de una función normal {: .topic-title }

Los dos son funciones. La diferencia está en cómo se usan y en lo que devuelven.

| | Componente | Función normal |
|---|---|---|
| **Cómo se usa** | Como una etiqueta: `<Boton />` | Con paréntesis: `saludar("Miguel")` |
| **Qué devuelve** | Algo que React puede pintar (JSX, texto, número...) | Cualquier valor de JavaScript |
| **Nombre** | `PascalCase`: `Boton`, `JobCard` | `camelCase`: `calcularTotal` |

Un componente, de principio a fin:

```jsx
// src/Boton.jsx
export default function Boton() {
    return <button>Haz clic</button>;
}
```

```jsx
// src/App.jsx
import Boton from "./Boton.jsx";

export default function App() {
    return <Boton />;
}
```

```html
<button>Haz clic</button>
```

Una función normal, de principio a fin:

```jsx
// src/utils.js
export function calcularTotal(precio, iva) {
    return precio + precio * iva;
}
```

```jsx
// src/App.jsx
import { calcularTotal } from "./utils.js";

export default function App() {
    const total = calcularTotal(100, 0.21);

    return <p>Total: {total}</p>;
}
```

```html
<p>Total: 121</p>
```

La función normal se **llama** y te da un número. El componente se **escribe como etiqueta** y React se encarga de pintar lo que devuelve. Por qué la mayúscula es obligatoria lo tienes en [Tu primer componente](../01-primer-componente/index.md).

---

## Qué puede devolver un componente {: .topic-title }

Un componente no tiene por qué devolver siempre una etiqueta. React sabe pintar estos valores:

| Devuelve | Qué se ve |
|---|---|
| JSX: `<h1>Hola</h1>` | La etiqueta |
| Un texto: `"Hola desde un componente"` | Ese texto |
| Un número: `42` | El número |
| `null` | Nada |

Los cuatro, con el flujo completo:

```jsx
// src/Ejemplos.jsx
export function ConEtiqueta() {
    return <h1>Hola</h1>;
}

export function ConTexto() {
    return "Hola desde un componente";
}

export function ConNumero() {
    return 42;
}

export function Invisible() {
    return null;
}
```

```jsx
// src/App.jsx
import { ConEtiqueta, ConTexto, ConNumero, Invisible } from "./Ejemplos.jsx";

export default function App() {
    return (
        <section>
            <ConEtiqueta />
            <p><ConTexto /></p>
            <p><ConNumero /></p>
            <Invisible />
        </section>
    );
}
```

```html
<section>
    <h1>Hola</h1>
    <p>Hola desde un componente</p>
    <p>42</p>
</section>
```

`Invisible` no deja ningún rastro en el HTML: devolver `null` significa «aquí no pintes nada». Los textos y los números van dentro de un `<p>` para que se vea dónde empieza cada uno.

!!! tip "return null es muy útil"
    Un componente que a veces no debe mostrarse devuelve `null` en esos casos.

!!! warning "Un objeto no se puede devolver"
    `return { nombre: "Miguel" }` da error, porque React no sabe cómo pintar un objeto. Lo mismo pasa al escribir un objeto entre llaves dentro del JSX: lo explico en [JSX con llaves](../../02-jsx/02-javascript-en-jsx/index.md). Para mostrar sus datos, lee cada propiedad por separado.

!!! tip "Verdadero y falso tampoco pintan nada"
    `true`, `false` y `undefined` se comportan como `null`: no aparece nada en pantalla.

---

## Mezclar componentes y funciones normales {: .topic-title }

Es muy habitual que un componente use una función normal como ayuda. La función hace el cálculo o el formato; el componente se ocupa de pintarlo.

```jsx
// src/Producto.jsx
// Función normal: ayuda a dar formato al precio
function formatearPrecio(precio) {
    return `${precio}€`;
}

// Componente: pinta el producto y usa la función de arriba
export default function Producto({ nombre, precio }) {
    const precioFormateado = formatearPrecio(precio);

    return (
        <div>
            <h3>{nombre}</h3>
            <p>{precioFormateado}</p>
        </div>
    );
}
```

```jsx
// src/App.jsx
import Producto from "./Producto.jsx";

export default function App() {
    return <Producto nombre="Laptop" precio={999} />;
}
```

```html
<div>
    <h3>Laptop</h3>
    <p>999€</p>
</div>
```

Fíjate en cómo se usa cada una: `formatearPrecio(precio)` se **llama** con paréntesis y `<Producto ... />` se **escribe como etiqueta**.

!!! tip "Una función de ayuda no necesita ser un componente"
    `formatearPrecio` devuelve un texto, no una interfaz. No tiene mayúscula ni se escribe como etiqueta, y no hace falta.

---

## Cuándo usar cada uno {: .topic-title }

| Usa un componente cuando... | Usa una función normal cuando... |
|---|---|
| Necesitas pintar interfaz | Necesitas hacer un cálculo o una transformación |
| Quieres reutilizar un trozo de pantalla | Quieres formatear datos |
| Quieres combinar elementos visuales | Tienes lógica que no pinta nada |

Un ejemplo de cada una:

```jsx
// Componente: pinta una tarjeta
function Tarjeta({ titulo, descripcion }) {
    return (
        <div className="card">
            <h2>{titulo}</h2>
            <p>{descripcion}</p>
        </div>
    );
}
```

```jsx
// Funciones normales: devuelven datos, no interfaz
function validarEmail(email) {
    return email.includes("@");
}

function obtenerFechaActual() {
    return new Date().toLocaleDateString();
}
```

!!! tip "Una pregunta para decidir"
    ¿Lo que devuelve es parte de la pantalla? Es un componente. ¿Es un dato (un número, un texto, un booleano)? Es una función normal.

---

## Error típico: llamar a un componente como una función {: .topic-title }

Un componente se usa como etiqueta, nunca como una función normal:

```jsx
function Saludo() {
    return <h1>Hola</h1>;
}

// Mal: lo llamas como una función
const resultado = Saludo();

// Bien: lo usas como etiqueta
<Saludo />
```

!!! warning "No llames a los componentes con paréntesis"
    Si lo llamas como función, React no lo trata como un componente de su árbol. Parecerá que funciona, pero más adelante, cuando uses estado, empezará a fallar de formas difíciles de entender. Escríbelo siempre como etiqueta.

---

## Ya sabes {: .topic-title }

| Tema | Idea clave |
|---|---|
| Diferencia | Un componente se usa como etiqueta y devuelve algo que React pinta; una función normal se llama y devuelve cualquier valor |
| Qué devuelve un componente | JSX, texto, número o `null` (no pinta nada); nunca un objeto |
| Mezclarlos | El componente pinta y la función normal calcula o formatea |
| Cuándo | Interfaz, componente; lógica o datos, función |
| Error típico | Llamar a un componente como función |

En la próxima lección se aprende **estado** con `useState`, que permite crear componentes que reaccionan a las acciones del usuario.

> **Recuerda:** los componentes son funciones especiales que devuelven algo que React pinta y llevan `PascalCase`. Las funciones normales ayudan con la lógica, pero no se pintan directamente.

| En Vue | En React |
|---|---|
| El componente es un archivo `.vue` que se usa como etiqueta en el `<template>` | El componente es una función que se usa como etiqueta en el JSX |
| Las funciones auxiliares van en `<script>` o en un archivo aparte | Las funciones auxiliares van en el mismo archivo o en un archivo aparte |

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| midudev — Función vs componente (vídeo) | <https://www.youtube.com/watch?v=69qpJ0ZUIlc> |
| JSCamp (midudev) — Componentes vs funciones normales | <https://www.jscamp.dev/introduccion-a-react/componentes-vs-funciones> |
