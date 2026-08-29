# Selección de elementos { .bloque-js }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/1rRmZ-YaFkI" title="Eventos y JavaScript en el navegador — midudev" loading="lazy" allowfullscreen></iframe>
</div>

> Antes de leer, cambiar o borrar cualquier cosa del HTML, hay que conseguir una referencia al nodo del DOM que lo representa.

---

## `querySelector()` {: .topic-title }

Localiza el **primer elemento** que coincide con un selector CSS. Devuelve `null` si no encuentra nada.

```js
const titulo = document.querySelector('.titulo');
const primerParrafo = document.querySelector('p');
const item = document.querySelector('#lista li:first-child');
```

Acepta cualquier sintaxis CSS válida (clases, ids, combinadores, pseudo-selectores) — es el método más flexible y el que se usa por defecto.

---

## `querySelectorAll()` {: .topic-title }

Localiza **todos** los elementos que coinciden con un selector CSS. Devuelve una `NodeList`, no un array.

```js
const items = document.querySelectorAll('li.completado');

items.forEach(item => console.log(item.textContent));
```

!!! tip "NodeList no tiene todos los métodos de array"
    `NodeList` trae `forEach()`, pero no `map()`, `filter()` ni `reduce()`. Si necesitas esos métodos, conviértela primero: `Array.from(items)` o `[...items]`.

---

## `getElementById()` {: .topic-title }

Localiza un elemento por su atributo `id`. Solo existe en `document` (no se puede llamar sobre otro elemento).

```js
const titulo = document.getElementById('titulo'); // sin el '#'
```

Es más rápido que `querySelector` porque el navegador indexa los ids, pero solo sirve para eso — un único criterio de búsqueda.

---

## `getElementsByClassName()` y `getElementsByTagName()` {: .topic-title }

Localizan elementos por clase o por etiqueta. Devuelven una `HTMLCollection`.

```js
const tarjetas = document.getElementsByClassName('tarjeta');
const parrafos = document.getElementsByTagName('p');
```

---

## `HTMLCollection` vs `NodeList` {: .topic-title }

Ninguna de las dos es un array: son colecciones "array-like" (tienen `.length` y acceso por índice `[0]`), pero cada una se comporta distinto a la hora de recorrerlas y de reaccionar a cambios en el DOM.

| | `HTMLCollection` | `NodeList` |
|---|---|---|
| La devuelven | `getElementsByClassName()`, `getElementsByTagName()`, `.children` | `querySelectorAll()`, `.childNodes` |
| ¿Viva o estática? | **Siempre viva** | Depende del método — ver aviso abajo |
| `for...of` | ❌ No es iterable directamente | ✅ Sí |
| `.forEach()` | ❌ No existe | ✅ Sí |
| `.map()` / `.filter()` / `.reduce()` | ❌ Ninguna de las dos los tiene | ❌ Ninguna de las dos los tiene |
| Acceso por índice `[0]` / `.item(i)` | ✅ | ✅ |
| `.namedItem('id')` | ✅ (busca además por `id` o `name`) | ❌ No existe |

Para usar métodos de array con cualquiera de las dos hace falta convertirla primero:

```js
const tarjetas = document.getElementsByClassName('tarjeta'); // HTMLCollection

tarjetas.forEach(t => {});       // ❌ TypeError: tarjetas.forEach is not a function
for (const t of tarjetas) {}     // ❌ TypeError: tarjetas is not iterable

const arrayTarjetas = Array.from(tarjetas); // ✅ o [...tarjetas] — ahora sí: map/filter/reduce
```

!!! warning "HTMLCollection siempre viva — NodeList no siempre estática"
    `getElementsByClassName()`/`getElementsByTagName()`/`.children` devuelven una colección **viva**: si añades o quitas elementos que cumplen el criterio, la colección (y su `.length`) se actualiza sola — incluso en medio de un bucle que la está recorriendo, lo que puede saltear elementos o dejar el bucle corriendo más o menos vueltas de las esperadas.

    `NodeList` no es siempre estática: depende de qué método la generó. `querySelectorAll()` devuelve una NodeList **estática** (una foto fija del momento en que se ejecutó, aunque el DOM cambie después). `.childNodes`, en cambio, devuelve una NodeList **viva**. No asumir que toda `NodeList` se comporta como la de `querySelectorAll()`.

!!! tip "Recorrer y borrar a la vez, sobre una colección viva"
    Si hay que eliminar elementos mientras se recorre una colección VIVA (`HTMLCollection` o `.childNodes`), un `for` clásico hacia adelante es peligroso: al borrar el elemento `i`, el que estaba en `i+1` pasa a ocupar esa posición y el bucle lo salta sin procesarlo. Dos formas seguras de evitarlo: recorrer el índice hacia atrás (`for (let i = coleccion.length - 1; i >= 0; i--)`), o convertir a un array estático primero con `Array.from()`/`[...coleccion]` antes de iterar.

---

## Navegación por el árbol DOM {: .topic-title }

Una vez tienes un elemento, puedes moverte a sus parientes sin volver a llamar a `querySelector`. Con este HTML de partida:

```html
<div class="lista">
    <div class="tarjeta">A</div>
    <div class="item">
        <h3>Título</h3>
        <p>Texto</p>
    </div>
    <div class="tarjeta">C</div>
</div>
```

```js
const item = document.querySelector('.item');

item.parentElement;         // <div class="lista">...</div> — el contenedor que lo envuelve
item.children;               // HTMLCollection [ <h3>, <p> ] — sus dos hijos directos
item.firstElementChild;      // <h3>Título</h3> — el primero de esos hijos
item.lastElementChild;       // <p>Texto</p> — el último de esos hijos
item.nextElementSibling;     // <div class="tarjeta">C</div> — el siguiente CON el mismo padre
item.previousElementSibling; // <div class="tarjeta">A</div> — el anterior CON el mismo padre
```

!!! tip "children NO es lo mismo que childNodes"
    `children` devuelve solo los elementos HTML hijos. `childNodes` devuelve TODOS los nodos hijos, incluidos los de texto (espacios en blanco entre etiquetas cuentan como nodo de texto) y comentarios. Casi siempre quieres `children` — es el que da resultados predecibles cuando el HTML tiene indentación o saltos de línea entre etiquetas.

---

## Comprobar que el elemento existe {: .topic-title }

Si el selector no encuentra nada, `querySelector`/`getElementById` devuelven `null` — y `null.algo` explota en tiempo de ejecución.

```js
const boton = document.querySelector('.no-existe');
boton.addEventListener('click', () => {}); // ❌ TypeError: no se puede leer una propiedad de null
```

```js
const boton = document.querySelector('.boton');

if (boton) {
    boton.addEventListener('click', () => {});
}

// o con optional chaining
boton?.addEventListener('click', () => {});
```

!!! tip "Guarda el resultado en una variable"
    Volver a llamar a `document.querySelector(...)` cada vez que necesitas el mismo elemento es trabajo repetido para el navegador. Selecciónalo una vez, guárdalo en una variable con nombre descriptivo, y reutiliza esa variable.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Institut Montilivi — Apunts DOM** | https://apunts.institutmontilivi.cat/DAW-M0612/dom.html |
| 📖 **aprendejavascript.dev — Selección de elementos** | https://www.aprendejavascript.dev/clase/dom-y-eventos/seleccion-elementos |
