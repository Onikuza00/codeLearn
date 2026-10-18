# Componentes puros { .section-react .bloque-react }

> React da por hecho que tus componentes son funciones puras: con los mismos datos de entrada devuelven siempre el mismo JSX y no cambian nada de fuera. Si lo cumples, evitas errores raros que cuesta mucho encontrar.

---

## Qué es una función pura {: .topic-title }

Una función es **pura** cuando cumple dos reglas:

1. **No cambia nada que existiera antes** de llamarla. Se ocupa solo de sus asuntos.
2. **Mismas entradas, mismo resultado.** Si le pasas lo mismo, devuelve siempre lo mismo.

Ya conoces el ejemplo más claro: una fórmula de matemáticas. Si `y = 2x` y `x = 3`, `y` siempre vale 6, nunca depende de la hora del día.

```js
// Pura: solo usa lo que recibe y devuelve un valor
function doble(numero) {
    return 2 * numero;
}

doble(3); // 6, siempre
```

| | Pura | Impura |
|---|---|---|
| Resultado | Depende solo de lo que recibe | Puede cambiar entre llamadas |
| Variables de fuera | No las cambia | Las modifica |
| Ejemplo | `doble(3)` | Una función que suma 1 a un contador global |

React funciona con esta idea: **un componente es una función pura**. Con las mismas props devuelve el mismo JSX.

---

## Un componente puro, de principio a fin {: .topic-title }

Un componente que solo usa las props que recibe:

```jsx
// src/JobCard.jsx
export default function JobCard({ titulo, salario }) {
    return (
        <article>
            <h3>{titulo}</h3>
            <p>Salario: {salario}€</p>
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
            <JobCard titulo="Desarrollador Frontend" salario={45000} />
            <JobCard titulo="Ingeniero Backend" salario={52000} />
        </section>
    );
}
```

```html
<section>
    <article>
        <h3>Desarrollador Frontend</h3>
        <p>Salario: 45000€</p>
    </article>
    <article>
        <h3>Ingeniero Backend</h3>
        <p>Salario: 52000€</p>
    </article>
</section>
```

Con `titulo="Desarrollador Frontend"` y `salario={45000}`, `JobCard` devuelve siempre ese HTML. Lo piensas como una receta: si sigues los pasos y no añades ingredientes por el camino, sale siempre el mismo plato.

!!! tip "Una pregunta para comprobarlo"
    Mira solo el cuerpo del componente: ¿todo lo que pinta sale de sus props, de su estado o de variables que crea ahí dentro? Entonces es puro. Si lee o cambia algo de fuera, no lo es.

---

## Efectos secundarios: lo que rompe la pureza {: .topic-title }

Un **efecto secundario** es cambiar algo de fuera de la función. Mientras React está pintando, un componente solo debe **devolver** JSX, no modificar nada.

Este componente lo rompe: cuenta solicitudes con una variable que vive fuera.

```jsx
// src/JobCard.jsx
let solicitudes = 0;

export default function JobCard({ titulo }) {
    // Mal: cambia una variable que existía antes
    solicitudes = solicitudes + 1;

    return <p>{titulo} (solicitud nº {solicitudes})</p>;
}
```

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return (
        <section>
            <JobCard titulo="Frontend" />
            <JobCard titulo="Backend" />
            <JobCard titulo="Full Stack" />
        </section>
    );
}
```

Esperas ver 1, 2 y 3. Pero el resultado depende de **cuántas veces y en qué orden** se ejecute cada componente, y eso no lo controlas tú. Dos usos del mismo `JobCard` con los mismos datos pueden dar un resultado distinto. Eso es lo que significa «impuro».

La solución: pasar el dato como prop en lugar de calcularlo con una variable de fuera.

```jsx
// src/JobCard.jsx
export default function JobCard({ titulo, numero }) {
    return <p>{titulo} (solicitud nº {numero})</p>;
}
```

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return (
        <section>
            <JobCard titulo="Frontend" numero={1} />
            <JobCard titulo="Backend" numero={2} />
            <JobCard titulo="Full Stack" numero={3} />
        </section>
    );
}
```

```html
<section>
    <p>Frontend (solicitud nº 1)</p>
    <p>Backend (solicitud nº 2)</p>
    <p>Full Stack (solicitud nº 3)</p>
</section>
```

Ahora el JSX depende solo de las props, así que es siempre el mismo.

!!! warning "Error típico: tocar el DOM mientras se pinta"
    `document.getElementById("time").className = "night"` dentro del cuerpo de un componente es un efecto secundario: cambia algo de fuera durante el render. Calcula el valor y devuélvelo en el JSX: `<h1 className={esNoche ? "night" : "day"}>`.

!!! tip "No dependas de otros componentes"
    Cada componente debe calcular su JSX por su cuenta, como en un examen: no puede suponer que otro se pintó antes. El orden en que React los ejecuta no está garantizado.

---

## StrictMode: quien detecta lo impuro {: .topic-title }

React tiene un **modo estricto** que ayuda a encontrar componentes impuros. En desarrollo, llama a cada componente **dos veces** seguidas. Si es puro, da igual: el resultado es el mismo. Si es impuro, el fallo se ve enseguida.

Se activa envolviendo el componente raíz en `main.jsx` (el proyecto de Vite ya lo trae así):

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

Con el `JobCard` impuro de antes, en lugar de 1, 2 y 3 verías **2, 4 y 6**: cada componente se ejecutó dos veces y la variable de fuera subió el doble. La versión con `numero` como prop sale bien, aunque se llame dos veces.

!!! tip "Deja StrictMode activado"
    Solo funciona en desarrollo. En producción no hace nada, así que no ralentiza la aplicación a tus usuarios.

!!! warning "Si algo ocurre dos veces, no es un fallo de React"
    Si un `console.log` dentro del componente sale duplicado, es StrictMode. Es normal y es lo que se espera.

---

## Mutación local: lo que sí puedes cambiar {: .topic-title }

Cambiar una variable de fuera es el problema. Cambiar una que **acabas de crear en ese mismo render** no lo es, porque nadie de fuera la ve nunca.

```jsx
// src/JobList.jsx
import JobCard from "./JobCard.jsx";

export default function JobList({ titulos }) {
    // Esta lista nace y muere en este render: es mutación local
    const tarjetas = [];

    for (let i = 0; i < titulos.length; i++) {
        tarjetas.push(<JobCard key={i} titulo={titulos[i]} />);
    }

    return <section>{tarjetas}</section>;
}
```

```jsx
// src/App.jsx
import JobList from "./JobList.jsx";

export default function App() {
    return <JobList titulos={["Frontend", "Backend"]} />;
}
```

El array `tarjetas` se crea dentro de la función, se rellena con `push` y se devuelve. Cada vez que React llama a `JobList` con los mismos `titulos`, crea el suyo desde cero y sale el mismo resultado.

!!! warning "La misma lista, pero creada fuera, sí es impura"
    Si `const tarjetas = []` estuviera fuera de la función, cada render seguiría añadiendo elementos al mismo array. Entonces estarías cambiando algo que existía antes.

---

## Dónde van los cambios de verdad {: .topic-title }

Una aplicación necesita cambiar cosas: actualizar la pantalla, guardar datos, reaccionar a un clic. Esos cambios son los efectos secundarios, y tienen su sitio: **fuera del render**.

| Dónde | Cuándo |
|---|---|
| **Manejadores de eventos** | El sitio preferido. Se ejecutan cuando el usuario hace algo (un clic), no mientras React pinta |
| **`useEffect`** | El último recurso. Ejecuta código después de pintar |

Los manejadores de eventos (`onClick`) se definen dentro del componente, pero no corren durante el render, así que **no tienen que ser puros**. Los verás en el bloque de eventos.

!!! tip "Piensa primero en el render"
    Cuando quieras que algo cambie, empieza por preguntarte si se puede calcular dentro del propio JSX con lo que ya tienes. Llegarás más lejos de lo que crees antes de necesitar un efecto.

---

## Por qué le importa a React {: .topic-title }

Escribir componentes puros requiere un poco de disciplina, pero a cambio React puede:

- **Ejecutarlos en otro sitio**, por ejemplo en un servidor, porque dan el mismo resultado con las mismas entradas.
- **Saltarse trabajo**: si las props no han cambiado, no hace falta volver a pintar el componente, porque el resultado sería el mismo.
- **Reiniciar un render a medias** sin riesgo si llegan datos nuevos.

| En Vue | En React |
|---|---|
| Una `computed` también debe ser pura | Todo el cuerpo del componente debe ser puro |
| El código de `setup` corre una sola vez al crear el componente | El cuerpo del componente corre en cada render |
| Los cambios se hacen en métodos y en `watch` | Los cambios van en manejadores de eventos |

---

## Ya sabes {: .topic-title }

| Tema | Idea clave |
|---|---|
| Función pura | No cambia nada de fuera; mismas entradas, mismo resultado |
| Componente puro | Con las mismas props, devuelve siempre el mismo JSX |
| Efecto secundario | Cambiar algo de fuera mientras se pinta; rompe la pureza |
| StrictMode | Ejecuta cada componente dos veces en desarrollo para destapar lo impuro |
| Mutación local | Cambiar lo que creas en el propio render es correcto |
| Dónde cambiar cosas | En manejadores de eventos; `useEffect` como último recurso |

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| React — Mantener los componentes puros | <https://es.react.dev/learn/keeping-components-pure> |
