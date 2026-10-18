# Estilos en JSX { .section-react .bloque-react }

> En JSX los estilos en línea no se escriben como texto CSS, sino como un objeto de JavaScript. Aquí se ve por qué, cómo se escribe y cómo combinarlo con las props.

---

## Estilos en JSX: un objeto JavaScript {: .topic-title }

Vamos a añadir un estilo personalizado a nuestro componente. Recuerda que **JSX es JavaScript, no HTML**, y por eso el atributo `style` espera un objeto, no un texto.

El flujo completo, con el proyecto de Vite. Primero el componente, que recibe `nombre` y `color` como props y guarda los estilos en un objeto:

```jsx
// src/Saludar.jsx
export default function Saludar({ nombre, color }) {
    const estilos = {
        color: color,
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
    };

    return <h1 style={estilos}>¡Hola, {nombre}!</h1>;
}
```

Después, `App.jsx` lo usa dos veces con colores distintos:

```jsx
// src/App.jsx
import Saludar from "./Saludar.jsx";

export default function App() {
    return (
        <section>
            <Saludar nombre="Miguel" color="#09f" />
            <Saludar nombre="Ana" color="#f90" />
        </section>
    );
}
```

Cada uso recibe su propio objeto de props (`{ nombre: "Miguel", color: "#09f" }` y `{ nombre: "Ana", color: "#f90" }`), así que `estilos.color` vale un azul en el primero y un naranja en el segundo. El resultado en el navegador:

```html
<section>
    <h1 style="color: rgb(0, 153, 255); font-size: 32px; font-weight: bold; text-align: center;">¡Hola, Miguel!</h1>
    <h1 style="color: rgb(255, 153, 0); font-size: 32px; font-weight: bold; text-align: center;">¡Hola, Ana!</h1>
</section>
```

El mismo componente con dos colores distintos: esa es la reutilización.

---

## ¿Por qué estilos como objeto? {: .topic-title }

JSX es JavaScript, no HTML. Por eso:

| Regla | Ejemplo |
|---|---|
| Los estilos son un objeto JavaScript | `{ color: "red" }` |
| Las propiedades usan camelCase | `fontSize` en lugar de `font-size` |
| Los valores son textos o números | `"32px"` o `32` |
| Se pasan con llaves | `style={estilos}` o `style={{ color: "red" }}` |

Comparación entre HTML y JSX:

```html
<!-- HTML normal -->
<h1 style="color: red; font-size: 32px">Hola</h1>
```

```jsx
// JSX (JavaScript)
<h1 style={{ color: "red", fontSize: "32px" }}>Hola</h1>
```

!!! warning "Error típico: `style` con un texto"
    Escribir `style="color: red"` como en HTML falla en React, porque `style` espera un objeto. Siempre `style={{ color: "red" }}`.

!!! tip "Camel case, no guiones"
    En un objeto de JavaScript el guion se leería como una resta: `font-size` no es un nombre válido. Usa `fontSize`, `backgroundColor`, `textAlign`.

### La doble llave

La doble llave no es una sintaxis especial. Las de fuera abren JavaScript dentro del JSX y las de dentro son las del objeto (lo ves en [JSX con llaves](../02-javascript-en-jsx/index.md)):

```jsx
const estilos = { color: "red", fontSize: "32px" };

<h1 style={estilos}>Hola</h1>               {/* objeto guardado en una variable */}
<h1 style={{ color: "red", fontSize: "32px" }}>Hola</h1>  {/* objeto escrito en línea */}
```

!!! tip "Los textos llevan unidad"
    Un valor como `"32px"` o `"2rem"` va entre comillas. Un número a secas (`32`) se interpreta como píxeles.

---

## Estilos inline con props {: .topic-title }

Puedes usar el valor de las props directamente dentro del objeto de estilos, sin crear una variable aparte. El componente:

```jsx
// src/Saludar.jsx
export default function Saludar({ nombre, color }) {
    return (
        <h1 style={{ color: color, fontSize: "32px", textAlign: "center" }}>
            ¡Hola, {nombre}!
        </h1>
    );
}
```

Y su uso, igual que antes:

```jsx
// src/App.jsx
import Saludar from "./Saludar.jsx";

export default function App() {
    return (
        <section>
            <Saludar nombre="Miguel" color="blue" />
            <Saludar nombre="Ana" color="green" />
        </section>
    );
}
```

El primer título sale azul y el segundo, verde.

### Notación de propiedad abreviada

Se puede escribir más corto. Cuando la propiedad del objeto tiene el mismo nombre que la variable (`color: color`), basta con escribir una vez `color`:

```jsx
// src/Saludar.jsx
export default function Saludar({ nombre, color }) {
    return <h1 style={{ color, fontSize: "32px" }}>¡Hola, {nombre}!</h1>;
}
```

`{ color }` es lo mismo que `{ color: color }`. Es muy habitual en el código real.

!!! warning "En proyectos reales, los estilos van en CSS"
    Los estilos en línea sirven para entender por qué existe la doble llave y para valores que cambian con una prop. Lo normal es dar estilo con clases (`className`) y archivos CSS aparte.

| En Vue | En React |
|---|---|
| `:style="{ color: color, fontSize: '32px' }"` (objeto; admite camelCase) | `style={{ color, fontSize: "32px" }}` |
| También acepta un texto: `style="color: red"` | Solo acepta un objeto |
| `class="titulo"` | `className="titulo"` |

---

## Lo que hemos aprendido {: .topic-title }

| Tema | Idea clave |
|---|---|
| Qué son los componentes | Funciones que retornan JSX |
| Cómo crearlos | Nombre con mayúscula y retornar JSX |
| Qué son las props | Datos que se pasan a los componentes |
| Estilos en JSX | Objetos JavaScript en camelCase |
| Reutilización | El mismo componente con diferentes datos |
| Composición | Combinar componentes para crear interfaces complejas |
| Ventajas sobre vanilla JS | Código más limpio y mantenible |

En la próxima clase se aprende sobre el **estado** (`useState`), que permite crear componentes interactivos que reaccionan a eventos del usuario.

> **Recuerda:** los componentes son funciones que retornan JSX. Las props son los datos que reciben. JSX es JavaScript, por eso los estilos son objetos.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| JSCamp (midudev) — Componentes | <https://www.jscamp.dev/introduccion-a-react/componentes> |
| React — JavaScript en JSX con llaves (complemento: doble llave y `style`) | <https://es.react.dev/learn/javascript-in-jsx-with-curly-braces> |
