# React { .section-urgente }

> Repaso antes de escribir un componente. Cada bloque sale de un fallo **real** de los ejercicios de React. Van ordenados por **reincidencia**, de más a menos urgente, y el color indica en cuántos ejercicios distintos ha fallado: 🟢 1 · 🟡 2 · 🟠 3 · 🔴 4 o más.
>
> JS / DOM, Symfony y Python tienen su propia página: [JS](repaso-urgente-js.md) · [Symfony](repaso-urgente-symfony.md) · [Python](repaso-urgente-python.md).

<div class="repaso-compact" markdown>

!!! rep-amarillo "🟡 1 · Clase de Tailwind ≠ propiedad CSS · E1, E3"
    El nombre de una clase de Tailwind no es el nombre de la propiedad CSS escrito con guiones. Se busca en la documentación por **lo que se quiere conseguir**, no por la propiedad que se recuerda.

    ```jsx
    <h1 className="flex align-center ...">          // ❌ no existe en Tailwind
    <h1 className="grid align-items-center ...">    // ❌ es la propiedad CSS, no la clase
    <h1 className="text-center ...">                // ✅ centra el texto en horizontal
    ```

    **Dos ejes distintos:** `text-center` centra el **texto** de dentro; `items-center` y `justify-center` alinean los **hijos** de un contenedor `flex` o `grid`. Y para centrar un bloque entero hace falta un ancho máximo más márgenes automáticos horizontales (`mx-auto`).

    📖 [Tailwind en React](/react/01-fundamentos/05-estilaje/02-tailwind-en-react/)

!!! rep-amarillo "🟡 2 · `class` → `className` · E1, E2"
    ```jsx
    <h1 class="text-center">       // ❌ aviso en consola
    <h1 className="text-center">   // ✅
    ```

    JSX no es HTML: se compila a JavaScript, y en JavaScript `class` es una palabra reservada. El atributo se llama `className`. React 19 lo tolera, pero lo avisa, y se cuela fácilmente al escribir deprisa.

    📖 [JSX desde cero](/react/01-fundamentos/02-jsx/01-jsx-desde-cero/)

!!! rep-amarillo "🟡 3 · `createElement(tipo, props, ...hijos)` — cada cosa en su hueco · E3, E4"
    Tres huecos con sentido fijo: **tipo**, **props** (un solo objeto) e **hijos** (del tercero en adelante).

    ```jsx
    createElement("a", { className: "..." }, { href: "#planes" }, "Empezar")   // ❌ href cae en los hijos: un objeto no se pinta
    createElement("a", { className: "...", href: "#planes" }, "Empezar")       // ✅ todas las props en el mismo objeto

    createElement("li", "✓ Rápido")          // ❌ el texto cae en el hueco de las props
    createElement("li", null, "✓ Rápido")    // ✅ sin props, null (o {})

    createElement("ul", { className: "..." }),   // ❌ el ) cierra el ul vacío
    createElement("li", null, "✓ Rápido"),       //    y el li queda de hermano, no de hijo
    ```

    **Los hijos van dentro de los paréntesis de su padre.** Una cadena en el hueco de las props lanza un error confuso en desarrollo (`Cannot use 'in' operator...`) y en producción deja el elemento vacío, sin aviso. JSX evita todo esto.

    📖 [React sin JSX](/react/01-fundamentos/01-inicio/03-react-sin-jsx/)

!!! rep-verde "🟢 4 · Importar un `.svg` es un export por defecto · E2"
    ```jsx
    import {imagen} from "./assets/react.svg"   // ❌ un .svg no tiene exports con nombre
    import imagen from "./assets/react.svg"     // ✅ sin llaves
    ```

    Las llaves piden un export **con nombre**. Un archivo de recurso solo tiene el export por defecto, y el nombre que le das al importarlo es libre. La ruta es relativa al archivo donde escribes el `import`.

    📖 [Entorno con Vite](/react/01-fundamentos/01-inicio/05-entorno-vite/)

!!! rep-verde "🟢 5 · O comillas, o llaves — nunca las dos · E2"
    ```jsx
    <img src="{imagen}" />   // ❌ es la cadena literal "{imagen}"
    <img src={imagen} />     // ✅ la variable
    ```

    En un atributo de JSX, o es un texto fijo entre comillas, o es una expresión de JavaScript entre llaves. Si la envuelves en comillas, deja de ser expresión.

    📖 [JavaScript en JSX](/react/01-fundamentos/02-jsx/02-javascript-en-jsx/)

!!! rep-verde "🟢 6 · `public/` se sirve desde la raíz · E2"
    ```html
    <link rel="icon" href="public/favicon.svg" />   <!-- ❌ esa ruta no existe en el navegador -->
    <link rel="icon" href="/favicon.svg" />         <!-- ✅ -->
    ```

    Vite sirve el contenido de `public/` como si estuviera en `/`. El nombre de la carpeta no forma parte de la URL. Y lo que se **importa** desde el código va en `src/assets/`, no en `public/`.

    📖 [Entorno con Vite](/react/01-fundamentos/01-inicio/05-entorno-vite/)

!!! rep-verde "🟢 7 · Sin JSX, `createElement` hay que importarlo · E3"
    ```jsx
    import { createElement } from "react"   // ✅ obligatorio si no hay JSX
    ```

    Con JSX, Vite se ocupa de lo necesario. Sin JSX, `createElement` es una función más de la librería y, si no la importas, la página se rompe.

    📖 [React sin JSX](/react/01-fundamentos/01-inicio/03-react-sin-jsx/)

!!! rep-verde "🟢 8 · Un componente devuelve el elemento, no una función · E3"
    ```jsx
    function Hero() {
      return () => { createElement("section", ...) }   // ❌ devuelve una función, y dentro no hay return
    }

    function Hero() {
      return createElement("section", ...)             // ✅
    }
    ```

    Un componente es una función que **devuelve lo que quieres pintar**. Si devuelves otra función, React no tiene nada que dibujar.

    📖 [Tu primer componente](/react/01-fundamentos/03-componentes/01-primer-componente/)

!!! rep-verde "🟢 9 · El elemento se elige por lo que es, no por cómo se ve · E3"
    ```jsx
    createElement("button", ..., "Una landing rápida con React.")   // ❌ es un párrafo
    createElement("p", ..., "Una landing rápida con React.")        // ✅
    ```

    La etiqueta describe el **significado** (párrafo, enlace, botón, lista). El aspecto es cosa de las clases. Un `button` sin acción confunde a quien use un lector de pantalla y a quien lea el código.

---

!!! check "✅ Checklist React de 60 segundos"
    Antes de dar un componente por terminado:

    - [ ] ¿Todos los atributos de clase son `className`, y la clase de Tailwind existe de verdad (la busqué por lo que quiero conseguir)?
    - [ ] ¿Cada atributo dinámico va con llaves **sin** comillas (`src={x}`)? ¿Cada recurso importado va sin llaves?
    - [ ] ¿Las rutas de `public/` empiezan por `/` y sin la palabra `public`?
    - [ ] Si no hay JSX, ¿importé `createElement`? ¿Las props van en **un solo objeto** en el 2.º hueco (o `null`) y los hijos del 3.º en adelante?
    - [ ] ¿Mi componente **devuelve** el elemento (no una función) y el `)` de cada padre cierra **después** de sus hijos?
    - [ ] ¿La etiqueta describe lo que es el contenido (`p`, `a`, `ul`...) y no solo cómo se ve?

</div>

## 📖 Teoría React

| Tema | Enlace |
|---|---|
| JSX, `className`, llaves | [JSX desde cero](/react/01-fundamentos/02-jsx/01-jsx-desde-cero/) · [JavaScript en JSX](/react/01-fundamentos/02-jsx/02-javascript-en-jsx/) |
| `createElement` y React sin JSX | [React sin JSX](/react/01-fundamentos/01-inicio/03-react-sin-jsx/) |
| Vite, `public/` y `src/assets/` | [Entorno con Vite](/react/01-fundamentos/01-inicio/05-entorno-vite/) |
| Tailwind en React | [Tailwind en React](/react/01-fundamentos/05-estilaje/02-tailwind-en-react/) |
| Componentes | [Tu primer componente](/react/01-fundamentos/03-componentes/01-primer-componente/) |
