# Migrar un proyecto a componentes { .section-react .bloque-react }

> Tienes una página en HTML y quieres pasarla a React. No hace falta hacerlo todo de golpe: se empieza con todo dentro de un solo componente y se va separando poco a poco.

---

## La estrategia {: .topic-title }

El plan es sencillo y funciona casi siempre:

1. **Todo el HTML en un solo componente**, y comprobar que funciona.
2. **Separar las piezas más fáciles** (cabecera, pie).
3. **Separar las piezas con datos** (cada tarjeta, la lista).

No te preocupes si al principio el componente es enorme. Es el primer paso natural al migrar de HTML a React.

!!! tip "No separes todo desde el principio"
    Si intentas dividirlo todo a la vez, cuando algo falle no sabrás si el fallo es de la migración o de la separación. Con todo en un componente, primero compruebas que el HTML funciona y solo después lo partes.

---

## Paso 1: todo en App.jsx {: .topic-title }

Copias el HTML de la página dentro del `return` de `App`:

```jsx
// src/App.jsx
export default function App() {
    return (
        <div className="app">
            <header>
                <nav>
                    <h1>DevJobs</h1>
                </nav>
            </header>
            <main>
                <section>
                    <h2>Trabajos disponibles</h2>
                </section>
            </main>
            <footer>
                <p>&copy; 2025 DevJobs</p>
            </footer>
        </div>
    );
}
```

Con esto ya tienes la página funcionando en React. Es un buen primer paso porque te permite:

- Comprobar que el HTML funciona dentro de React.
- Descubrir problemas de sintaxis antes de separar nada.
- Ver la aplicación en marcha antes de refactorizar.

!!! warning "Los comentarios de HTML rompen JSX"
    Si tu HTML tiene comentarios como `<!-- Cabecera -->`, al copiarlos aparece un error. En JSX los comentarios se escriben de otra forma, con llaves: `{/* Cabecera */}`. Lo tienes explicado en [JSX desde cero](../../02-jsx/01-jsx-desde-cero/index.md). Busca `<!--` en tu editor para encontrarlos todos.

---

## Paso 2: separar Header y Footer {: .topic-title }

Empezamos por las piezas más fáciles. Por qué estas primero:

| Motivo | Qué significa |
|---|---|
| Son independientes | No dependen del resto de la página |
| Tienen una responsabilidad clara | La cabecera es la cabecera, el pie es el pie |
| No cambian a menudo | Es difícil que te hagan romper nada |
| Son fáciles de identificar | Se ven a simple vista |

Cada una va a su archivo, en una carpeta `components`. La cabecera ya la separaste en [Importar y exportar](../03-importar-exportar/index.md). El pie se hace igual:

```jsx
// src/components/Footer.jsx
export default function Footer() {
    return (
        <footer>
            <p>&copy; 2025 DevJobs. Todos los derechos reservados.</p>
        </footer>
    );
}
```

Y `App.jsx` los importa y los usa:

```jsx
// src/App.jsx
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <section>
                    <h2>Trabajos disponibles</h2>
                </section>
            </main>
            <Footer />
        </div>
    );
}
```

La estructura del proyecto queda así:

```text
src/
├── components/
│   ├── Header.jsx
│   └── Footer.jsx
├── App.jsx
└── main.jsx
```

Qué has ganado:

- **`App.jsx` más corto:** menos líneas, y se entiende de un vistazo.
- **Reutilizable:** puedes usar `Header` en otras páginas.
- **Más fácil de mantener:** si cambia el pie, solo abres `Footer.jsx`.
- **Mejor organización:** cada cosa en su archivo.

!!! warning "Error típico: olvidar el import"
    Si escribes `<Header />` sin importarlo, la página se rompe con un error como «Header is not defined» (Header no está definido). Cada componente que uses tiene que importarse en el archivo donde lo uses.

---

## Paso 3: JobCard con datos {: .topic-title }

Ahora la parte más importante: la tarjeta de cada empleo. Primero necesitas datos. En `App.jsx` defines un array de objetos, uno por empleo:

```jsx
// src/App.jsx (datos de ejemplo)
const empleos = [
    {
        id: 1,
        titulo: "Frontend Developer",
        empresa: "TechCorp",
        ubicacion: "Madrid, España",
        salario: "45.000€ - 60.000€",
        descripcion: "Buscamos un desarrollador frontend con experiencia en React.",
        etiquetas: ["React", "TypeScript", "CSS"],
    },
    {
        id: 2,
        titulo: "Backend Developer",
        empresa: "DataStack",
        ubicacion: "Barcelona, España",
        salario: "50.000€ - 70.000€",
        descripcion: "Desarrollador backend para trabajar con Node.js y bases de datos.",
        etiquetas: ["Node.js", "PostgreSQL", "API"],
    },
];
```

El componente `JobCard` recibe **un objeto empleo** como prop. Sin destructuring tendrías que escribir `empleo.titulo`, `empleo.empresa`... en cada línea. Con destructuring en el cuerpo, sacas las propiedades una vez y las usas directamente:

```jsx
// src/components/JobCard.jsx
export default function JobCard({ empleo }) {
    // Sacamos las propiedades del objeto empleo
    const { titulo, empresa, ubicacion, salario, descripcion, etiquetas } = empleo;

    return (
        <article className="job-card">
            <header>
                <h3>{titulo}</h3>
                <p>{empresa}</p>
            </header>
            <div>
                <p>{ubicacion}</p>
                <p>{salario}</p>
                <p>{descripcion}</p>
            </div>
            <footer>
                <span>{etiquetas.join(", ")}</span>
                <button>Aplicar</button>
            </footer>
        </article>
    );
}
```

Y `App.jsx` pasa a cada tarjeta el empleo que le toca:

```jsx
// src/App.jsx
import Header from "./components/Header";
import Footer from "./components/Footer";
import JobCard from "./components/JobCard";

// (aquí va el array de empleos de arriba)

export default function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <h2>Trabajos disponibles ({empleos.length})</h2>
                <JobCard empleo={empleos[0]} />
                <JobCard empleo={empleos[1]} />
            </main>
            <Footer />
        </div>
    );
}
```

Qué pasa por dentro: `empleo={empleos[0]}` entrega el primer objeto como una sola prop; React llama a `JobCard({ empleo: { id: 1, titulo: "Frontend Developer", ... } })`, las llaves del parámetro sacan `empleo`, y la línea con `const { ... } = empleo` saca cada dato. El resultado de la primera tarjeta:

```html
<article class="job-card">
    <header>
        <h3>Frontend Developer</h3>
        <p>TechCorp</p>
    </header>
    <div>
        <p>Madrid, España</p>
        <p>45.000€ - 60.000€</p>
        <p>Buscamos un desarrollador frontend con experiencia en React.</p>
    </div>
    <footer>
        <span>React, TypeScript, CSS</span>
        <button>Aplicar</button>
    </footer>
</article>
```

!!! tip "Dos formas de sacar los datos"
    Puedes sacarlos en el parámetro (`{ titulo, empresa }`, como en [Props](../../04-props/01-props/index.md)) o dentro del cuerpo con `const { titulo, empresa } = empleo`. La segunda es útil cuando la prop es un objeto entero y quieres usar sus datos sueltos.

!!! warning "Aquí repetimos a mano"
    De momento escribes un `<JobCard />` por cada empleo. Más adelante verás cómo generar todas con `.map()` y evitar esa repetición.

---

## Paso 4: JobList {: .topic-title }

La lista de empleos también merece su propio componente. Recibe el array y coloca las tarjetas:

```jsx
// src/components/JobList.jsx
import JobCard from "./JobCard";

export default function JobList({ empleos }) {
    return (
        <section className="jobs-container">
            <h2>Trabajos disponibles ({empleos.length})</h2>
            <JobCard empleo={empleos[0]} />
            <JobCard empleo={empleos[1]} />
        </section>
    );
}
```

Y `App.jsx` queda muy corto: pasa el array a `JobList` y deja que se ocupe él:

```jsx
// src/App.jsx
import Header from "./components/Header";
import JobList from "./components/JobList";
import Footer from "./components/Footer";

// (aquí va el array de empleos de arriba)

export default function App() {
    return (
        <div className="app">
            <Header />
            <JobList empleos={empleos} />
            <Footer />
        </div>
    );
}
```

Fíjate en cómo se lee `App` ahora: cabecera, lista, pie. Cada nivel pasa sus datos al siguiente: `App` tiene el array, se lo da a `JobList`, que le da a cada `JobCard` su empleo.

!!! tip "Tú decides cuántos componentes crear"
    Si una pieza tiene sentido por sí sola (una tarjeta, una lista, un formulario), es candidata a componente. Si te cuesta ponerle un nombre corto, probablemente hace demasiado y conviene partirla.

---

## El patrón de migración {: .topic-title }

Estos pasos sirven para cualquier proyecto:

| Paso | Qué haces | Cómo compruebas |
|---|---|---|
| 1 | Todo en un componente | Que la página funciona |
| 2 | Identificas piezas independientes (Header, Footer) | Que son fáciles de aislar |
| 3 | Las extraes a archivos aparte | Que se importan sin errores |
| 4 | Las compones en `App` | Que se ve igual que antes |
| 5 | Repites con las piezas más complejas (JobList, JobCard) | Que sigue igual |

Este enfoque progresivo es mejor que intentar separar todo a la vez.

---

## Errores comunes al migrar {: .topic-title }

Los fallos que más vas a ver al pasar HTML a React:

| Error | Qué ocurre | Cómo se arregla |
|---|---|---|
| Dejar `class` | React espera `className` | `<div className="header">` |
| Dejar etiquetas sin cerrar (`<img>`, `<input>`) | En JSX es obligatorio cerrarlas | `<img />`, `<input type="text" />` |
| Dejar comentarios `<!-- -->` | Rompen JSX | `{/* comentario */}` |
| Olvidar el `export` del componente | No se puede importar | `export default function Header()` |
| Olvidar el `import` | «Header is not defined» | `import Header from "./components/Header"` |

Las dos primeras filas ya las tienes en las reglas de [JSX desde cero](../../02-jsx/01-jsx-desde-cero/index.md).

!!! tip "Usa el buscador del editor"
    Antes de empezar, busca en tu HTML `class=`, `<!--` y las etiquetas sin cerrar. Arreglarlas de golpe te ahorra muchos errores seguidos.

| En Vue | En React |
|---|---|
| El HTML va en el `<template>` y los comentarios `<!-- -->` funcionan | El HTML va en el `return` y los comentarios son `{/* */}` |
| `class="header"` se queda igual | `class` pasa a `className` |
| Cada pieza es un archivo `.vue` con su `<template>` | Cada pieza es una función en su archivo, que devuelve JSX |

---

## Ya sabes {: .topic-title }

| Tema | Idea clave |
|---|---|
| Estrategia | Empezar con todo en un componente y separar poco a poco |
| Header y Footer | Las piezas más fáciles se separan primero |
| JobCard | Recibe un objeto como prop y saca sus datos con destructuring |
| JobList | Recibe el array y reparte cada empleo a su tarjeta |
| Errores | `class`, etiquetas sin cerrar, comentarios, export e import |

> **Recuerda:** no intentes separar todo en componentes desde el principio. Empieza con todo funcionando en un solo componente y sepáralo poco a poco.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| JSCamp (midudev) — Migrando el proyecto DevJobs a React | <https://www.jscamp.dev/introduccion-a-react/migrando-proyecto> |
| JSCamp (midudev) — Ejercicios de práctica | <https://www.jscamp.dev/introduccion-a-react/ejercicios-de-practica> |
