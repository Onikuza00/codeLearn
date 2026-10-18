# Un componente real: JobCard { .section-react .bloque-react }

> Una tarjeta de empleo (`JobCard`) con varias props, que se reutiliza con datos distintos y se compone con otros componentes hasta formar una aplicación.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/xPmiUUf9Kgs" title="Creando componente para un empleo con React — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Antes de empezar {: .topic-title }

Aquí aplicas lo que ya sabes de [Props](../../04-props/01-props/index.md) a un caso real: una aplicación de empleos. Cada empleo se pinta como una tarjeta con título, empresa, ubicación y descripción. Todas las tarjetas tienen la misma forma y cambian solo los datos. Eso es justo lo que resuelven las props.

---

## Un componente real: JobCard {: .topic-title }

Una tarjeta de empleo es reutilizable: la escribes una vez y recibe datos distintos cada vez que la usas. En el proyecto de Vite del [bloque 1.1](../../01-inicio/05-entorno-vite/index.md) son dos archivos. Primero el componente:

```jsx
// src/JobCard.jsx
export default function JobCard({ titulo, empresa, ubicacion, descripcion }) {
    return (
        <article className="job-listing-card">
            <div>
                <h3>{titulo}</h3>
                <small>
                    {empresa} | {ubicacion}
                </small>
                <p>{descripcion}</p>
            </div>
            <button className="button-apply-job">Aplicar</button>
        </article>
    );
}
```

Y después `App`, que usa la tarjeta dos veces con datos distintos:

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return (
        <section>
            <h2>Empleos disponibles</h2>
            <div className="jobs-listings">
                <JobCard
                    titulo="Desarrollador Frontend"
                    empresa="Tech Solutions Inc."
                    ubicacion="Remoto"
                    descripcion="Buscamos un desarrollador frontend con experiencia en React, TypeScript y Tailwind CSS."
                />
                <JobCard
                    titulo="Ingeniero de Software Senior"
                    empresa="Data Driven Co."
                    ubicacion="Ciudad de México"
                    descripcion="Estamos buscando un ingeniero de software con experiencia en desarrollo web."
                />
            </div>
        </section>
    );
}
```

Las clases (`job-listing-card`, `button-apply-job`, `jobs-listings`) vienen del CSS del proyecto. Sin ese CSS la tarjeta funciona igual, solo que sin estilo.

### Sin Vite

Midudev lo prueba en un solo `react.html`, con React desde un CDN y Babel traduciendo el JSX en el navegador. Los componentes `JobCard` y `App` son los mismos; solo cambia dónde viven. Sirve para probar sin instalar nada, pero es lento y no se usa en proyectos reales. Ese enfoque está explicado en [React sin JSX](../../01-inicio/03-react-sin-jsx/index.md).

### Qué hace JobCard

- Recibe **4 props** a la vez mediante destructuring: `{ titulo, empresa, ubicacion, descripcion }`.
- Usa `className` en lugar de `class`, porque JSX es JavaScript y `class` ya significa otra cosa allí.
- Coloca cada prop en su sitio con llaves: `{titulo}`.
- Devuelve una estructura JSX completa: una tarjeta de empleo.

!!! tip "La firma te dice qué necesita el componente"
    En React no declaras las props aparte. La lista entre llaves de `function JobCard({ ... })` es toda la «documentación» que tienes. Mantenla ordenada y con nombres claros.

---

## Solo renderizamos App {: .topic-title }

En `main.jsx` solo se dibuja `App`:

```jsx
root.render(<App />);
```

React ejecuta `App`, ve que dentro hay dos `<JobCard />` y los ejecuta también, cada uno con sus props. Tú no tienes que renderizar cada `JobCard` a mano: basta con el componente de arriba del todo.

Esto es la **composición de componentes**: un componente que contiene a otros. `App` es el padre, cada `JobCard` es un hijo y cada uno recibe sus propios datos.

| Ventaja | Qué significa |
|---|---|
| Reutilización | El mismo componente, con datos diferentes |
| Organización | Cada componente tiene su propia responsabilidad |
| Escalabilidad | Añadir otra tarjeta es añadir otro `<JobCard />` |

!!! tip "Cada instancia tiene sus propios datos"
    Dos `<JobCard />` son dos copias independientes. Lo que le pases a una no afecta a la otra.

---

## Comparación con JavaScript vanilla {: .topic-title }

Veamos cuánto mejora esto lo que hacías antes con JavaScript puro. Para pintar cada empleo de una lista:

```js
jobs.forEach((job) => {
    const article = document.createElement("article");
    article.className = "job-listing-card";

    article.innerHTML = `<div>
        <h3>${job.titulo}</h3>
        <small>${job.empresa} | ${job.ubicacion}</small>
        <p>${job.descripcion}</p>
    </div>
    <button class="button-apply-job">Aplicar</button>`;

    container.appendChild(article);
});
```

Problemas de este enfoque:

- **Código repetitivo:** cada vez que necesitas una tarjeta, escribes todo esto.
- **Difícil de mantener:** si cambia la estructura, hay que buscarla por todo el código.
- **Manipulación manual del DOM:** tienes que crear, modificar y añadir los elementos a mano.
- **Propenso a errores:** una errata dentro del texto del HTML rompe todo.
- **HTML dentro de strings:** el editor no lo valida, ni autocompleta, ni lo colorea.
- **Difícil de probar:** necesitas un DOM real para comprobar el resultado.

Con React es el componente `JobCard` de arriba. Lo usas así:

```jsx
<JobCard
    titulo={job.titulo}
    empresa={job.empresa}
    ubicacion={job.ubicacion}
    descripcion={job.descripcion}
/>
```

Ventajas de React:

- **Código limpio y declarativo:** describes qué quieres ver, no cómo construirlo paso a paso.
- **Fácil de mantener:** cambias el componente una vez y se actualiza en todos los sitios.
- **React gestiona el DOM:** no hay `createElement` ni `appendChild`.
- **Reutilizable:** el mismo componente con datos diferentes.
- **JSX valida la estructura:** un error de sintaxis se detecta enseguida.
- **Fácil de probar:** puedes comprobar el componente sin un DOM real.

!!! info "Declarativo frente a imperativo"
    El código de vanilla es **imperativo**: das las órdenes una a una (crea, rellena, añade). El de React es **declarativo**: dices cómo debe verse con unos datos y React se encarga del resto.

---

## Composición: Header, JobList y Footer {: .topic-title }

La verdadera potencia de React está en componer componentes pequeños para formar interfaces grandes. Así se puede dividir toda la aplicación:

```jsx
function Header() {
    return (
        <header>
            <h1>DevJobs</h1>
            <nav>
                <a href="/">Inicio</a>
                <a href="/empleos">Empleos</a>
            </nav>
        </header>
    );
}

function JobList() {
    return (
        <div className="jobs-listings">
            <JobCard titulo="..." empresa="..." ubicacion="..." descripcion="..." />
            <JobCard titulo="..." empresa="..." ubicacion="..." descripcion="..." />
        </div>
    );
}

function Footer() {
    return (
        <footer>
            <p>&copy; 2025 DevJobs</p>
        </footer>
    );
}

function App() {
    return (
        <div>
            <Header />
            <JobList />
            <Footer />
        </div>
    );
}
```

Los `"..."` son datos de relleno para abreviar; en una aplicación real irían los de cada empleo.

Esto sigue el **principio de responsabilidad única**: cada componente hace una sola cosa.

| Componente | Responsabilidad |
|---|---|
| `Header` | Mostrar la cabecera y la navegación |
| `JobList` | Mostrar la lista de empleos |
| `Footer` | Mostrar el pie de página |
| `App` | Juntar todos los anteriores |

Con eso el código es:

- **Más fácil de leer:** cada componente es pequeño y sencillo.
- **Más fácil de mantener:** un cambio afecta a un solo componente.
- **Más fácil de probar:** puedes comprobar cada uno por separado.
- **Más fácil de reutilizar:** `Header` sirve en cualquier página.

!!! tip "Mira `App` como un índice"
    Un buen `App` se lee como el índice de un libro: `Header`, `JobList`, `Footer`. Si tienes que leer cincuenta líneas de JSX para entenderlo, falta partirlo en componentes.

---

## Buenas prácticas {: .topic-title }

### 1. Un componente, una responsabilidad

Cada componente debe hacer una sola cosa y hacerla bien:

```jsx
// Bien: componentes enfocados
function JobTitle({ children }) {
    return <h3>{children}</h3>;
}

function JobCompany({ empresa, ubicacion }) {
    return (
        <small>
            {empresa} | {ubicacion}
        </small>
    );
}

// Mal: un componente que hace demasiado
function EverythingComponent({ titulo, empresa, ubicacion, descripcion, usuario, configuracion }) {
    // Demasiadas responsabilidades
}
```

!!! tip "Una señal de que hace demasiado"
    Si no sabes ponerle un nombre corto al componente, o si recibe props sin relación entre sí (los datos del empleo y los del usuario), parte el componente en dos.

### 2. Nombres descriptivos

Usa nombres que digan qué hace el componente:

```jsx
// Bien
function UserProfileCard() {}
function JobListingItem() {}
function NavigationMenu() {}

// Mal
function Item() {}   // Demasiado genérico
function Thing() {}  // No dice nada
function Comp1() {}  // Nada claro
```

### 3. Props claras y descriptivas

Los nombres de las props son la "interfaz" del componente. Quien lo use los lee sin abrir el archivo:

```jsx
// Bien: props con nombres claros
function Button({ text, onClick, disabled }) {
    return (
        <button onClick={onClick} disabled={disabled}>
            {text}
        </button>
    );
}

// Mal: props ambiguas
function Button({ t, oc, d }) {
    return (
        <button onClick={oc} disabled={d}>
            {t}
        </button>
    );
}
```

!!! tip "Escribe como si no fueras a acordarte"
    Dentro de tres meses `oc` no te dirá nada. `onClick` sí. Y se escribe en `camelCase`, como cualquier variable.

---

## Consejos {: .topic-title }

- **Mismo nombre en el padre y en el hijo:** si el padre escribe `ubicacion="Remoto"`, el hijo debe leer `ubicacion`. Un nombre distinto (`localizacion`) da `undefined` sin avisar.
- **Mayúscula en el componente, minúscula en las props:** `<JobCard titulo="...">`, no `<jobCard Titulo="...">`.

| En Vue | En React |
|---|---|
| `defineProps(["titulo", "empresa"])` | Parámetro `{ titulo, empresa }` de la función |
| `<JobCard titulo="..." :salario="45000" />` | `<JobCard titulo="..." salario={45000} />` |
| Las props se declaran aparte | No se declaran: son los parámetros |

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| midudev — Creando componente para un empleo con React (vídeo) | <https://www.youtube.com/watch?v=xPmiUUf9Kgs> |
| JSCamp (midudev) — Creando JobCard: nuestro primer componente real | <https://www.jscamp.dev/introduccion-a-react/nuestro-primer-componente-real> |
