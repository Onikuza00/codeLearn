# JSX con llaves { .section-react .bloque-react }

> Las llaves `{ }` abren una ventana a JavaScript dentro del marcado. Con ellas el JSX deja de ser estático y muestra datos, cálculos y estilos.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/7iobxzd_2wY?start=2429" title="JSX y llaves (desde 40:29) — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Llaves: expresiones {: .topic-title }

Dentro de `{ }` cabe cualquier **expresión**: algo que produce un valor (una variable, una operación, una llamada a función, una propiedad).

```jsx
const user = { name: "Ana" };
const jobs = ["Frontend", "Backend", "Full Stack"];

<p>Hola, {user.name}</p>
<p>2 + 2 = {2 + 2}</p>
<p>Empleos disponibles: {jobs.length}</p>
```

No valen las **sentencias** (`if`, `for`, `while`): no producen un valor. Para decidir o repetir se usan expresiones, como el operador ternario o `.map()`.

Las llaves solo valen en dos sitios:

| Dónde | Ejemplo | ¿Funciona? |
|---|---|---|
| Como contenido de una etiqueta | `<h1>{name}</h1>` | Sí |
| Como valor de un atributo, justo tras `=` | `src={avatar}` | Sí |
| Como nombre de etiqueta | `<{tag}>` | No |

!!! tip "Etiqueta dinámica"
    Si necesitas elegir la etiqueta según una variable, guárdala en una variable con **mayúscula inicial** y úsala como componente: `const Tag = "h1"; <Tag>Hola</Tag>`. En Vue se hace con `<component :is="tag">`.

!!! tip "Equivalencia con Vue"
    `{ }` en React cumple el papel de `{{ }}` en el texto y de `:attr` en los atributos de Vue. Con una diferencia: no hay directivas (`v-if`, `v-for`), solo JavaScript normal.

---

## Llaves en atributos {: .topic-title }

Para pasar un valor de JavaScript a un atributo, las llaves van **sin comillas**:

```jsx
<img src={job.logo} alt={job.company} />
<button disabled={isApplied}>Aplicar</button>
```

!!! warning "Con comillas es un texto literal"
    `src="{job.logo}"` envía la cadena `{job.logo}`, no el valor de la variable.

| En Vue | En React |
|---|---|
| `{{ user.name }}` | `{user.name}` |
| `:src="job.logo"` | `src={job.logo}` |
| `:disabled="isApplied"` | `disabled={isApplied}` |

---

## Estilos en línea {: .topic-title }

`style` recibe un **objeto** de JavaScript, no una cadena de CSS. Por eso aparecen dobles llaves: las de fuera son las del JSX y las de dentro, las del objeto.

```jsx
<h1 style={{ fontSize: "24px", color: "tomato" }}>Empleos</h1>
```

Reglas del objeto: propiedades en **camelCase** (`fontSize`, no `font-size`) y valores como cadenas con su unidad (`"24px"`).

El objeto también se puede guardar en una variable y pasar con una sola pareja de llaves. Si la propiedad y la variable se llaman igual, vale la forma abreviada:

```jsx
const color = "tomato";
const styles = { color, fontSize: "24px" }; // abreviado: color: color

<h1 style={styles}>Empleos</h1>
```

!!! tip "No es una sintaxis especial"
    `{{ }}` son unas llaves de JSX que contienen un objeto literal. Nada más.

!!! warning "Solo para entender la doble llave"
    En proyectos reales los estilos van en archivos CSS aparte. Esta sección explica por qué existe la doble llave, no es la forma recomendada de dar estilo.

---

## Error: renderizar un objeto {: .topic-title }

Un objeto no se puede pintar tal cual: React no sabe qué mostrar de él.

```jsx
const person = { name: "Ana", role: "Frontend" };

<p>{person}</p>        // ❌ Error: un objeto no es válido como hijo de React
<p>{person.name}</p>   // ✅ Ana
```

El mensaje original de la consola es `Objects are not valid as a React child`.

La solución es elegir qué propiedad quieres mostrar.

!!! warning "Es un error típico"
    Suele aparecer al olvidar el punto: `{user}` en lugar de `{user.name}`. Lo mismo ocurre con un objeto `Date`: usa `{date.toLocaleDateString()}`, no `{date}`.

!!! tip "Diferencia con Vue"
    En Vue, `{{ person }}` pinta el objeto como texto JSON y no falla. React lanza un error, así que es fácil notar el fallo.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| JSCamp (midudev) — JSX: La sintaxis de React | <https://www.jscamp.dev/introduccion-a-react/jsx> |
| JSCamp (midudev) — Componentes (apartado Estilos en JSX) | <https://www.jscamp.dev/introduccion-a-react/componentes> |
| React — JavaScript en JSX con llaves (complemento: llaves en atributos y error con objetos) | <https://es.react.dev/learn/javascript-in-jsx-with-curly-braces> |
