# Valores por defecto y spread { .section-react .bloque-react }

> Dos trucos para trabajar mejor con props: darles un valor de reserva cuando no llegan y repartir un objeto entero en props sueltas.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/7iobxzd_2wY?start=4169" title="Curso React.js, aprende desde cero — midulive (desde 1:09:29, Reutilización de componentes: Props)" loading="lazy" allowfullscreen></iframe>
</div>

---

## Valores por defecto {: .topic-title }

No todos los empleos publican el salario. Si una prop puede faltar, le das un valor de reserva con `=` en el propio destructuring.

El componente, de principio a fin:

```jsx
// src/JobCard.jsx
export default function JobCard({ titulo, empresa, salario = "A convenir" }) {
    return (
        <article>
            <h3>{titulo}</h3>
            <small>{empresa}</small>
            <p>Salario: {salario}</p>
        </article>
    );
}
```

`App.jsx` lo usa una vez sin salario y otra con él:

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return (
        <section>
            <JobCard titulo="Ingeniero Backend" empresa="Data Systems" />
            <JobCard titulo="Desarrollador Frontend" empresa="Tech Solutions" salario="45.000€" />
        </section>
    );
}
```

En el primer uso no se pasa `salario`, así que React llama a `JobCard({ titulo: "Ingeniero Backend", empresa: "Data Systems" })` y `salario` toma su valor de reserva. En el segundo se respeta lo que llega:

```html
<section>
    <article>
        <h3>Ingeniero Backend</h3>
        <small>Data Systems</small>
        <p>Salario: A convenir</p>
    </article>
    <article>
        <h3>Desarrollador Frontend</h3>
        <small>Tech Solutions</small>
        <p>Salario: 45.000€</p>
    </article>
</section>
```

El valor por defecto solo se usa cuando la prop **no se pasa** o vale **`undefined`**. En cualquier otro caso se respeta lo que llegue:

| Escribes | `salario` vale |
|---|---|
| `<JobCard />` | `"A convenir"` (no se pasó) |
| `salario={undefined}` | `"A convenir"` |
| `salario={null}` | `null` (no se aplica el valor por defecto) |
| `salario={0}` | `0` (no se aplica el valor por defecto) |

!!! warning "`null` y `0` no activan el valor por defecto"
    Si tu dato viene de una API y puede ser `null`, el valor de reserva no te salvará: pintarás un hueco. En ese caso tendrás que decidir con una condición.

!!! tip "Pon el valor por defecto en la firma"
    Verlo ahí, en la primera línea del componente, te dice de un vistazo qué es opcional. Es mejor que comprobarlo a mano dentro del cuerpo con algo como `salario = salario || "A convenir"`, que además trata el `0` como si faltara.

---

## Reenviar con spread {: .topic-title }

Cuando los datos de un empleo ya viven en un objeto, escribir cada prop una a una resulta pesado. El operador **spread** (`...`, «esparcir») reparte las propiedades del objeto como props sueltas.

El componente no cambia: sigue recibiendo `{ titulo, empresa, ubicacion }`.

```jsx
// src/JobCard.jsx
export default function JobCard({ titulo, empresa, ubicacion }) {
    return (
        <article>
            <h3>{titulo}</h3>
            <small>{empresa} | {ubicacion}</small>
        </article>
    );
}
```

En `App.jsx` tienes el objeto y lo esparces con `{...empleo}`:

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    const empleo = {
        titulo: "Ingeniero Backend",
        empresa: "Data Systems",
        ubicacion: "Madrid",
    };

    return <JobCard {...empleo} />;
}
```

Estas dos líneas son equivalentes:

```jsx
<JobCard titulo={empleo.titulo} empresa={empleo.empresa} ubicacion={empleo.ubicacion} />

<JobCard {...empleo} />
```

Cada propiedad del objeto llega como una prop con su mismo nombre, y el resultado es el mismo:

```html
<article>
    <h3>Ingeniero Backend</h3>
    <small>Data Systems | Madrid</small>
</article>
```

También sirve para pasar de un componente a otro todo lo que has recibido:

```jsx
// src/Oferta.jsx
import JobCard from "./JobCard.jsx";

export default function Oferta(props) {
    return (
        <div className="card">
            <JobCard {...props} />
        </div>
    );
}
```

`Oferta` no usa ninguna prop: se las pasa todas a `JobCard`.

!!! warning "No abuses del spread"
    Es cómodo, pero escondes qué datos viajan. Si lo usas en todos los componentes, suele ser señal de que la estructura no es buena y conviene partirlos. Repetir las props una a una no es pecado: se lee mejor.

!!! tip "El spread reparte también lo que no esperas"
    Si el objeto tiene además un `id`, `JobCard` recibe una prop `id` aunque no la use. No da error, simplemente se ignora.

!!! tip "Spread o un objeto entero"
    Hay dos formas de pasar un objeto: esparcirlo (`{...empleo}`, cada propiedad es una prop) o pasarlo como una sola prop (`empleo={empleo}`, que ya viste en [Props](../01-props/index.md)). Con el segundo el hijo lee `empleo.titulo`; con el primero lee `titulo` directamente.

| En Vue | En React |
|---|---|
| Valor por defecto con `withDefaults` o la opción `default` de `defineProps` | Valor por defecto con `=` en el destructuring |
| `<JobCard v-bind="empleo" />` reparte un objeto en props | `<JobCard {...empleo} />` |

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| midulive — Curso React.js, aprende desde cero (desde 1:09:29, Reutilización de componentes: Props) | <https://www.youtube.com/watch?v=7iobxzd_2wY&t=4169s> |
| React — Pasar props a un componente (valores por defecto y spread) | <https://es.react.dev/learn/passing-props-to-a-component> |
