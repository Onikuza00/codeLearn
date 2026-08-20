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

Localizan elementos por clase o por etiqueta. Devuelven una `HTMLCollection`, **viva**: si el DOM cambia después, la colección se actualiza sola.

```js
const tarjetas = document.getElementsByClassName('tarjeta');
const parrafos = document.getElementsByTagName('p');
```

!!! warning "HTMLCollection viva vs NodeList estática"
    `getElementsByClassName`/`getElementsByTagName` devuelven una colección **viva**: si añades o quitas elementos con esa clase/etiqueta, la longitud de la colección cambia sola, incluso dentro de un bucle que la está recorriendo. `querySelectorAll` devuelve una `NodeList` **estática**: una foto fija en el momento en que se ejecutó, aunque el DOM cambie después. Por eso `querySelectorAll` es más predecible como punto de partida.

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
