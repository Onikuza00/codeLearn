# Tailwind en React { .section-react .bloque-react }

> Tailwind es el estándar actual para dar estilo a una aplicación de React. En vez de escribir un archivo CSS por componente, pones clases de utilidad directamente en el `className`. Aquí aprendes a instalarlo en tu proyecto de Vite y a usarlo bien dentro de componentes.

---

## Utilidades dentro del `className` {: .topic-title }

Con Tailwind cada clase hace una sola cosa: `p-4` pone un relleno, `font-semibold` pone la letra en seminegrita, `rounded-lg` redondea las esquinas. Combinas varias en el mismo elemento y no escribes nada de CSS.

En React funciona exactamente igual que en HTML, con la diferencia de JSX: el atributo se llama `className`, no `class`.

```jsx
<h3 className="text-lg font-semibold text-gray-900">Ingeniero Backend</h3>
```

Cómo funciona Tailwind (utility-first, anatomía de una clase, colores, espaciados...) está explicado en el [bloque de Tailwind](../../../../tailwind/index.md). Aquí no lo repetimos: solo vemos **qué cambia al usarlo en React**.

!!! tip "Instala la extensión del editor"
    La extensión *Tailwind CSS IntelliSense* de VS Code autocompleta las clases dentro del `className` y te enseña el CSS que genera cada una. Con las clases tan largas, se nota mucho.

---

## Instalar Tailwind en el proyecto de Vite {: .topic-title }

Partimos del proyecto de Vite del [bloque 1.1](../../01-inicio/05-entorno-vite/index.md). Son tres pasos.

**1. Instalar los paquetes:**

```bash
pnpm add tailwindcss @tailwindcss/vite
```

**2. Añadir el plugin a la configuración de Vite.** En `vite.config.js` ya tienes el plugin de React; añade el de Tailwind a la lista:

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
});
```

**3. Importar Tailwind en tu CSS.** Abre el `src/index.css` que trae el proyecto, borra lo que haya y deja una sola línea:

```css
/* src/index.css */
@import "tailwindcss";
```

Ese archivo ya lo importa `main.jsx` con `import "./index.css"`, así que no hay nada más que conectar. Arranca el servidor con `pnpm dev` y ya puedes usar clases en cualquier componente.

!!! warning "Si las clases no hacen nada"
    Comprueba estas tres cosas, por este orden: que `index.css` tiene el `@import "tailwindcss"`, que `main.jsx` importa ese archivo y que **reiniciaste `pnpm dev`** después de tocar `vite.config.js` (los cambios de configuración no se aplican en caliente).

!!! tip "No hace falta decirle dónde están tus archivos"
    Tailwind v4 detecta solo los archivos de tu proyecto y busca en ellos las clases que usas. Solo genera el CSS de las que encuentra, así que el resultado final es pequeño.

---

## Estilar el JobCard {: .topic-title }

Vamos a darle estilo al `JobCard` de los capítulos anteriores, de principio a fin. El componente:

```jsx
// src/JobCard.jsx
export default function JobCard({ titulo, empresa }) {
    return (
        <article className="rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
            <small className="text-sm text-gray-500">{empresa}</small>
        </article>
    );
}
```

`App.jsx` no cambia: sigue usando el componente.

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return <JobCard titulo="Ingeniero Backend" empresa="Data Systems" />;
}
```

El navegador recibe el HTML de siempre, con `class` en lugar de `className` y las mismas clases:

```html
<article class="rounded-lg border border-gray-200 p-4 shadow-sm">
    <h3 class="text-lg font-semibold text-gray-900">Ingeniero Backend</h3>
    <small class="text-sm text-gray-500">Data Systems</small>
</article>
```

Fíjate en lo que **no** ha hecho falta: ningún archivo `JobCard.css`, ningún `import` de estilos, ningún nombre de clase inventado. Las clases ya están en el elemento y se ve de un vistazo cómo es.

!!! tip "Los estados y el responsive también van en el `className`"
    `hover:shadow-md`, `md:p-6`, `focus:ring-2`... funcionan igual dentro de React. Cómo se escriben está en [Responsive y estados](../../../../tailwind/03-responsive-estados/index.md).

---

## Clases según una condición {: .topic-title }

Ahora el `JobCard` recibe una prop `destacada`. Si es `true`, la tarjeta se pinta con un borde y un fondo amarillos.

`className` es una expresión de JavaScript, así que puedes usar una plantilla de texto con un ternario: la parte fija va siempre y la que cambia se elige.

```jsx
// src/JobCard.jsx
export default function JobCard({ titulo, empresa, destacada }) {
    return (
        <article
            className={`rounded-lg border p-4 shadow-sm ${
                destacada ? "border-yellow-400 bg-yellow-50" : "border-gray-200"
            }`}
        >
            <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
            <small className="text-sm text-gray-500">{empresa}</small>
        </article>
    );
}
```

```jsx
// src/App.jsx
import JobCard from "./JobCard.jsx";

export default function App() {
    return (
        <section className="grid gap-4">
            <JobCard titulo="Ingeniero Backend" empresa="Data Systems" />
            <JobCard titulo="Desarrollador Frontend" empresa="Tech Solutions" destacada={true} />
        </section>
    );
}
```

El primer `JobCard` recibe `border-gray-200` y el segundo, `border-yellow-400 bg-yellow-50`:

```html
<section class="grid gap-4">
    <article class="rounded-lg border p-4 shadow-sm border-gray-200">...</article>
    <article class="rounded-lg border p-4 shadow-sm border-yellow-400 bg-yellow-50">...</article>
</section>
```

!!! tip "Con varias condiciones, usa `clsx`"
    Si el elemento tiene tres o cuatro condiciones, esta plantilla se vuelve ilegible. La función `clsx`, explicada en [CSS en React](../01-css-en-react/index.md), lo resuelve y funciona igual con clases de Tailwind.

!!! tip "Cada rama, con la clase completa"
    Escribe `"border-yellow-400 bg-yellow-50"` entero en la rama del ternario. Parece una obviedad, pero en la siguiente sección verás por qué es una regla obligatoria.

---

## Escribe siempre la clase completa {: .topic-title }

Tailwind **no lee tu código como código**: lo lee como texto plano y busca palabras que parezcan clases. No entiende las plantillas de texto ni las sumas de texto, y no ejecuta nada. Si construyes el nombre de una clase por partes, Tailwind no lo ve entero y no genera su CSS.

Imagina una `Etiqueta` con una prop `color`, escrita así:

```jsx
// ❌ No funciona
export default function Etiqueta({ color }) {
    return <span className={`bg-${color}-100 text-${color}-800`}>Remoto</span>;
}
```

Con `color="green"` el navegador recibe `bg-green-100`, pero esa clase **no existe en el CSS**: Tailwind solo vio las palabras `bg-${color}-100` y no supo qué hacer con ellas. El elemento sale sin estilos y no hay ningún error.

La solución es guardar las clases **completas** en un objeto y escoger una según la prop:

```jsx
// src/Etiqueta.jsx
const colores = {
    remoto: "bg-green-100 text-green-800",
    presencial: "bg-blue-100 text-blue-800",
};

export default function Etiqueta({ tipo }) {
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colores[tipo]}`}>
            {tipo}
        </span>
    );
}
```

`colores[tipo]` busca en el objeto la clave que vale `tipo`. Si `tipo` es `"remoto"`, devuelve el texto `"bg-green-100 text-green-800"`. Todas las clases aparecen enteras en el archivo, así que Tailwind las encuentra.

```jsx
// src/App.jsx
import Etiqueta from "./Etiqueta.jsx";

export default function App() {
    return (
        <section className="flex gap-2">
            <Etiqueta tipo="remoto" />
            <Etiqueta tipo="presencial" />
        </section>
    );
}
```

```html
<section class="flex gap-2">
    <span class="rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">remoto</span>
    <span class="rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">presencial</span>
</section>
```

!!! warning "Es el error más típico de Tailwind en React"
    Si una clase no se aplica y el código "parece correcto", busca un `${}` dentro de un nombre de clase. La regla de la propia documentación de Tailwind: **nunca construyas clases con las props; asigna cada valor de la prop a una clase completa**.

!!! tip "Una ventaja: cada valor puede tener sus propios tonos"
    Con el objeto puedes dar a cada caso los colores que quieras (`"bg-yellow-300 text-black"`), cosa que no podrías hacer con una plantilla del tipo `bg-${color}-100`.

---

## Clases que se pisan: `tailwind-merge` {: .topic-title }

Si pones dos clases que cambian lo mismo (`p-4` y `p-8`), **gana la que aparece más tarde en el CSS generado, no la que escribes después** en el `className`. Es decir: no puedes fiarte del orden en que las escribes.

La regla de Tailwind es no poner nunca dos clases en conflicto en el mismo elemento. Esto se complica cuando un componente deja que quien lo usa le pase clases extra con la prop `className`:

```jsx
// src/JobCard.jsx
export default function JobCard({ titulo, className }) {
    return <article className={`p-4 ${className}`}>{titulo}</article>;
}
```

```jsx
// src/App.jsx
<JobCard titulo="Ingeniero Backend" className="p-8" />
```

El HTML sale con `class="p-4 p-8"` y no sabes cuál de los dos rellenos se verá. Para resolverlo existe **`tailwind-merge`**: entiende qué clases afectan a lo mismo y se queda con la última.

```bash
pnpm add tailwind-merge
```

```js
import { twMerge } from "tailwind-merge";

twMerge("px-2 py-1 bg-red-500", "p-3 bg-blue-500");
// "p-3 bg-blue-500"
```

Lo habitual es combinarlo con [`clsx`](../01-css-en-react/index.md) en una pequeña función, que se suele llamar `cn`:

```js
// src/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...entradas) {
    return twMerge(clsx(entradas));
}
```

```jsx
// src/JobCard.jsx
import { cn } from "./cn.js";

export default function JobCard({ titulo, className }) {
    return <article className={cn("p-4", className)}>{titulo}</article>;
}
```

Ahora `<JobCard className="p-8" />` produce `class="p-8"`: lo de fuera sustituye a lo de dentro, sin sorpresas.

!!! tip "Mejor aún: no dejes pasar clases de fuera"
    La propia documentación de Tailwind recomienda, en React, **exponer props concretas** (como `destacada`) en lugar de aceptar clases de fuera, porque esas clases suelen entrar en conflicto. Usa `cn` solo cuando de verdad necesites que el componente acepte un `className`.

!!! warning "Instala `tailwind-merge` solo si lo necesitas"
    Con `clsx` te basta mientras no tengas conflictos. No lo añadas "por si acaso".

---

## Reutilizar estilos: crea un componente {: .topic-title }

Con utilidades repites las mismas clases en muchos sitios. La solución en Tailwind no es crear una clase CSS propia, sino **un componente de React**. Así tienes un único sitio donde cambiar el estilo.

```jsx
// src/Boton.jsx
export default function Boton({ texto }) {
    return (
        <button className="rounded-full bg-violet-500 px-5 py-2 font-semibold text-white shadow-md hover:bg-violet-700">
            {texto}
        </button>
    );
}
```

```jsx
// src/App.jsx
import Boton from "./Boton.jsx";

export default function App() {
    return (
        <section className="flex gap-2">
            <Boton texto="Guardar" />
            <Boton texto="Aplicar" />
        </section>
    );
}
```

```html
<section class="flex gap-2">
    <button class="rounded-full bg-violet-500 px-5 py-2 font-semibold text-white shadow-md hover:bg-violet-700">Guardar</button>
    <button class="rounded-full bg-violet-500 px-5 py-2 font-semibold text-white shadow-md hover:bg-violet-700">Aplicar</button>
</section>
```

Si mañana quieres el botón verde, cambias `Boton.jsx` y cambian los dos.

!!! tip "No necesitas `@apply` ni clases propias"
    Tailwind permite crear una clase propia con `@layer components` (por ejemplo `.btn-primary`), y la documentación lo da por bueno para lenguajes de plantillas sin componentes. En React casi nunca hace falta: el propio componente es la reutilización.

---

## En Vue y en React {: .topic-title }

| En Vue | En React |
|---|---|
| `class="p-4 rounded"` | `className="p-4 rounded"` |
| `:class="{ 'bg-yellow-50': destacada }"` | `` className={clsx("p-4", destacada && "bg-yellow-50")} `` |
| `:class="[base, destacada ? 'a' : 'b']"` | `` className={clsx(base, destacada ? "a" : "b")} `` |
| Estilos con `<style scoped>` | No hacen falta: las utilidades ya son locales a cada elemento |
| Un componente `.vue` para reutilizar | Un componente de React para reutilizar |

!!! warning "Sin fuente oficial"
    La tabla de Vue es conocimiento propio. Una diferencia real: Vue trae `:class` con objetos y matrices de serie, mientras que en React hace falta `clsx` para lo mismo. Y el patrón `cn` (`twMerge` + `clsx`) es una convención muy extendida, pero no viene de la documentación de Tailwind.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| Tailwind — Instalar con Vite | <https://tailwindcss.com/docs/installation/using-vite> |
| Tailwind — Detectar clases en el código (clases dinámicas) | <https://tailwindcss.com/docs/detecting-classes-in-source-files> |
| Tailwind — Reutilizar estilos y conflictos | <https://tailwindcss.com/docs/styling-with-utility-classes> |
| clsx | <https://github.com/lukeed/clsx> |
| tailwind-merge | <https://github.com/dcastil/tailwind-merge> |
