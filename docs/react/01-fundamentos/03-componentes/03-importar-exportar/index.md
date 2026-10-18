# Importar y exportar { .section-react .bloque-react }

> Hasta ahora todo el código vivía en un solo archivo. En una aplicación real cada componente va en su propio archivo, y para usarlo desde otro sitio hay que exportarlo en su archivo e importarlo donde se necesite.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/jf2TC5aQpf4" title="Cómo importar/exportar archivos correctamente — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## El problema: todo en un archivo {: .topic-title }

Imagina una aplicación entera dentro de `App.jsx`: la cabecera, el pie, las tarjetas, la lista, el buscador y el propio `App`, todos juntos, con 500 líneas.

```jsx
// src/App.jsx
function Header() {
    return <header>...</header>;
}

function Footer() {
    return <footer>...</footer>;
}

function JobCard({ job }) {
    return <article>...</article>;
}

function App() {
    return (
        <div>
            <Header />
            <Footer />
        </div>
    );
}

export default App;
```

Funciona, pero cuesta cada vez más:

| Problema | Qué pasa |
|---|---|
| Difícil de leer | 500 líneas en un solo archivo |
| Difícil de encontrar | ¿Dónde está el componente que necesito? |
| Difícil de depurar | Todo está mezclado |
| Difícil de colaborar | Dos personas tocan el mismo archivo y chocan en Git |
| No reutilizable | No puedes usar esos componentes desde otros archivos |

---

## La solución: módulos {: .topic-title }

Cada componente va en su propio archivo, y los archivos se conectan con `import` y `export`. Esto se llama **módulos de JavaScript**: es el sistema estándar del lenguaje, no algo propio de React.

```text
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── JobCard.jsx
└── App.jsx
```

!!! tip "El archivo se llama como el componente"
    Lo habitual es un componente por archivo y que el archivo tenga el mismo nombre: `Header.jsx` contiene `Header`. Así sabes dónde buscarlo sin pensar.

---

## Separar un componente, paso a paso {: .topic-title }

Vamos a sacar `Header` de `App.jsx`.

### Paso 1: crear el archivo y exportar

Creas `src/components/Header.jsx` con el componente y una línea de `export default` al final:

```jsx
// src/components/Header.jsx
function Header() {
    return (
        <header className="header">
            <h1>DevJobs</h1>
            <nav>
                <a href="#jobs">Trabajos</a>
                <a href="#about">Acerca</a>
            </nav>
        </header>
    );
}

export default Header;
```

`export default` hace tres cosas:

- Marca el componente para que se pueda importar desde otros archivos.
- `default` significa que es la exportación **principal** del archivo.
- Solo puede haber **un** `export default` por archivo.

!!! warning "Sin export no se puede importar"
    Si olvidas el `export`, el componente existe pero es privado: solo se puede usar dentro de su propio archivo. Al importarlo, React te dará un error.

### Paso 2: importar en App.jsx

En `App.jsx` traes el componente con `import` y lo usas como cualquier otro:

```jsx
// src/App.jsx
import Header from "./components/Header";

function App() {
    return (
        <div className="app">
            <Header />
        </div>
    );
}

export default App;
```

`import` se lee por partes:

| Parte | Qué significa |
|---|---|
| `Header` | El nombre que usarás en este archivo |
| `from "./components/Header"` | La ruta al archivo, sin la extensión `.jsx` |
| `./` | «La carpeta actual» |

El resultado en el navegador es el mismo de antes, pero ahora cada pieza vive en su archivo:

```html
<div class="app">
    <header class="header">
        <h1>DevJobs</h1>
        <nav>
            <a href="#jobs">Trabajos</a>
            <a href="#about">Acerca</a>
        </nav>
    </header>
</div>
```

!!! warning "La ruta empieza por ./"
    `import Header from "components/Header"` (sin `./`) falla: React cree que es un paquete instalado, no un archivo tuyo. Las rutas a tus archivos siempre empiezan por `./` o `../`.

!!! tip "Extensión: con o sin"
    Con Vite puedes escribir `"./components/Header"` sin `.jsx`. También funciona `"./components/Header.jsx"`, y es más fiel a cómo lo hacen los módulos nativos del navegador. Otros empaquetadores antiguos pueden pedir la extensión. Elige una forma y úsala siempre igual.

---

## Export default y export con nombre {: .topic-title }

Hay dos formas de exportar:

| Tipo | Exportar | Importar |
|---|---|---|
| **Por defecto** (default) | `export default function Header() {}` | `import Header from "./Header";` |
| **Con nombre** (named) | `export function Header() {}` | `import { Header } from "./Header";` |

### Export default

Una exportación principal por archivo. Al importar puedes usar **cualquier nombre**:

```jsx
// Header.jsx
export default function Header() {
    return <header>...</header>;
}
```

```jsx
// Los tres funcionan: es el mismo componente
import Header from "./components/Header";
import Cabecera from "./components/Header";
import MiHeader from "./components/Header";
```

Ventajas: es sencillo y puedes renombrar al importar. Desventajas: no sabes el nombre original del componente, cada archivo puede llamarlo distinto (confuso) y el editor autocompleta peor.

### Export con nombre

Varias exportaciones por archivo, y al importar usas el **nombre exacto con llaves**:

```jsx
// Header.jsx
export function Header() {
    return <header>...</header>;
}

export function HeaderLogo() {
    return <img src="logo.png" alt="Logo" />;
}
```

```jsx
import { Header, HeaderLogo } from "./components/Header";
```

Ventajas: el nombre es el mismo en toda la aplicación, el autocompletado funciona mejor, puedes exportar varias cosas y es más explícito. Desventajas: hay que escribir las llaves y recordar el nombre exacto.

!!! warning "Error típico: mezclar los dos tipos"
    Si el componente se exportó **con nombre** y lo importas **sin llaves**, falla. Y al revés. La forma de exportar manda sobre la de importar: default sin llaves, con nombre con llaves.

    ```jsx
    // Header.jsx: export con nombre
    export function Header() { /* ... */ }

    // Mal: Header no es default
    import Header from "./components/Header";

    // Bien: con llaves, porque es con nombre
    import { Header } from "./components/Header";
    ```

!!! tip "Un solo export default"
    Dos `export default` en el mismo archivo no se pueden. El segundo componente va como export con nombre o en otro archivo.

---

## Por qué midudev prefiere los exports con nombre {: .topic-title }

En React moderno se usan mucho los exports con nombre, por cuatro razones.

**1. Consistencia.** Con default, cada archivo puede ponerle un nombre distinto al mismo componente:

```jsx
// Con export default: tres nombres para lo mismo
import Header from "./components/Header";    // en App.jsx
import MyHeader from "./components/Header";  // en OtraPagina.jsx
import TopBar from "./components/Header";    // en OtraMas.jsx
```

```jsx
// Con export con nombre: siempre el mismo
import { Header } from "./components/Header";
```

**2. Refactoring seguro.** Si renombras el componente, el editor puede actualizar todas las referencias de golpe.

**3. Autocompletado.** Con llaves, el editor te sugiere el nombre exacto. Con default tienes que recordarlo.

**4. Varias exportaciones.** Un mismo archivo puede exportar varias cosas y tú importas solo las que necesitas:

```jsx
// utils.js
export function formatDate(date) { /* ... */ }
export function formatCurrency(amount) { /* ... */ }
export function formatPhone(phone) { /* ... */ }
```

```jsx
import { formatDate, formatCurrency } from "./utils";
```

!!! tip "Elige un estilo y mantenlo"
    No hay una única forma correcta. Mucha gente usa default si el archivo tiene un solo componente y con nombre si exporta varios. Algunos equipos eligen solo uno de los dos estilos y no los mezclan en el mismo archivo. Lo importante es que todo el proyecto siga la misma regla.

!!! warning "Evita el default anónimo"
    `export default () => {}` no tiene nombre, y en las herramientas de depuración el componente aparece sin nombre. Dale siempre un nombre claro al componente y al archivo.

### Dos formas de escribir un export con nombre

Son equivalentes:

```jsx
// Forma 1: inline, en la propia declaración (la más común)
export function Header() { /* ... */ }
export function HeaderLogo() { /* ... */ }
```

```jsx
// Forma 2: todo al final del archivo
function Header() { /* ... */ }
function HeaderLogo() { /* ... */ }

export { Header, HeaderLogo };
```

---

## Mezclar default y con nombre {: .topic-title }

Un archivo puede tener **un** export default y **todos los exports con nombre** que quiera. Por ejemplo, `Header` como principal y `HeaderLogo` como extra:

```jsx
// src/components/Header.jsx
export function HeaderLogo() {
    return <img src="logo.png" alt="Logo de DevJobs" />;
}

export default function Header() {
    return (
        <header>
            <HeaderLogo />
            <h1>DevJobs</h1>
        </header>
    );
}
```

Al importar, el default va sin llaves y el que tiene nombre, con llaves, en la misma línea:

```jsx
// src/App.jsx
import Header, { HeaderLogo } from "./components/Header";
```

Y un componente que **no** se exporta es privado: solo se puede usar dentro de su archivo.

```jsx
// src/components/Header.jsx
function Menu() {
    return <nav>...</nav>;   // privado: sin export, solo lo ve este archivo
}

export default function Header() {
    return (
        <header>
            <Menu />
        </header>
    );
}
```

---

## Renombrar imports con as {: .topic-title }

A veces dos archivos exportan algo con el mismo nombre y chocan:

```jsx
// Error: los dos se llaman Button
import { Button } from "./components/Button";
import { Button } from "./ui/Button";
```

Se soluciona renombrando uno (o los dos) con `as`:

```jsx
import { Button } from "./components/Button";
import { Button as UIButton } from "./ui/Button";

function App() {
    return (
        <div>
            <Button>Componente Button</Button>
            <UIButton>UI Button</UIButton>
        </div>
    );
}
```

Con nombres más descriptivos todavía se entiende mejor:

```jsx
import { Button as PrimaryButton } from "./components/Button";
import { Button as SecondaryButton } from "./ui/Button";
```

Un caso real: dos componentes distintos que se llaman `Card`:

```jsx
import { Card as JobCard } from "./components/JobCard";
import { Card as UserCard } from "./components/UserCard";

function Dashboard() {
    return (
        <div>
            <JobCard job={job} />
            <UserCard user={user} />
        </div>
    );
}
```

!!! tip "as solo cambia el nombre en este archivo"
    El archivo original sigue exportando `Button`. `as` solo decide cómo lo llamas tú aquí.

---

## Rutas de importación {: .topic-title }

Las rutas a tus archivos son **relativas** a donde estás escribiendo:

```jsx
// Mismo directorio
import { Header } from "./Header";

// Subdirectorio
import { Header } from "./components/Header";

// Directorio padre (una carpeta arriba)
import { Header } from "../Header";

// Dos niveles arriba
import { Header } from "../../Header";
```

Reglas fáciles de recordar: `./` es «aquí», `../` es «una carpeta arriba».

### Importar varias cosas a la vez

```jsx
// Varios exports con nombre
import { Header, Footer, Nav } from "./components";

// Un default y varios con nombre
import App, { config, API_URL } from "./App";

// Todo como un objeto con espacio de nombres
import * as Utils from "./utils";

Utils.formatDate();
Utils.formatCurrency();
```

!!! tip "El archivo raíz"
    Cada aplicación tiene un componente raíz (`App`) del que cuelga todo lo demás. En un proyecto con Vite lo importa `main.jsx` para montarlo en el DOM. Con un framework de rutas por archivos, como Next.js, hay un componente raíz distinto por cada página.

---

## Errores comunes {: .topic-title }

Los cuatro fallos que más vas a ver:

**1. Olvidar el export.**

```jsx
// Mal: no se exporta
function Header() {
    return <header>...</header>;
}

// Bien
export function Header() {
    return <header>...</header>;
}
```

**2. Mezclar default y con nombre al importar.**

```jsx
// Header.jsx
export function Header() { /* ... */ }

// Mal: Header no es un export default
import Header from "./components/Header";

// Bien: con llaves
import { Header } from "./components/Header";
```

**3. Ruta incorrecta.**

```jsx
// Mal: falta el ./
import { Header } from "components/Header";

// Bien
import { Header } from "./components/Header";
```

**4. Extensión en algunos empaquetadores.**

```jsx
// Con Vite no hace falta
import { Header } from "./components/Header";

// Algunos empaquetadores antiguos piden la extensión
import { Header } from "./components/Header.jsx";
```

!!! warning "Los errores se leen"
    Cuando el import falla, el error de la consola suele decir qué no encuentra. Casi siempre es una de estas cuatro cosas: falta el export, faltan o sobran las llaves, falta el `./` o el nombre del archivo está mal escrito (mayúsculas incluidas).

| En Vue | En React |
|---|---|
| Cada archivo `.vue` ya es un módulo y se exporta solo | Tú escribes el `export` en la función |
| `import Header from "./Header.vue"` (con extensión `.vue`) | `import Header from "./Header"` (sin extensión con Vite) |
| Lo habitual es un SFC por archivo | Lo habitual es un componente por archivo, pero puede haber varios |

---

## Lo que hemos aprendido {: .topic-title }

| Tema | Idea clave |
|---|---|
| Módulos | Separar el código en varios archivos |
| `export default` | Una exportación principal por archivo |
| Export con nombre | Varias exportaciones, con su nombre exacto |
| `import` | Traer código de otros archivos |
| Renombrar imports | `as` para evitar choques de nombres |
| Estilo | Los exports con nombre son más consistentes y mantenibles |
| Estructura | Componentes en carpetas, uno por archivo |

En la próxima lección de midudev se aprende CSS Modules, una forma de escribir CSS que solo afecta a un componente.

> **Recuerda:** usa un estilo coherente en todo el proyecto, nombra bien archivos y componentes, y mantén los archivos pequeños y enfocados en una sola responsabilidad.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| midudev — Cómo importar/exportar archivos correctamente (vídeo) | <https://www.youtube.com/watch?v=jf2TC5aQpf4> |
| JSCamp (midudev) — Módulos JavaScript: Import y Export | <https://www.jscamp.dev/introduccion-a-react/modulos-import-export> |
| React — Importar y exportar componentes (complemento: archivo raíz, mezclar default y con nombre, default anónimo) | <https://es.react.dev/learn/importing-and-exporting-components> |
