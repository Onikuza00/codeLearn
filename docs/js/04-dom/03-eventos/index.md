# Eventos { .bloque-js }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/1rRmZ-YaFkI" title="Eventos y JavaScript en el navegador — midudev" loading="lazy" allowfullscreen></iframe>
</div>

> Un evento es la señal de que algo ha pasado — un clic, una tecla pulsada, la página cargada — y un **handler** es la función que reacciona a esa señal.

---

## Tres formas de asociar un evento {: .topic-title }

**1. Atributo HTML**, con el prefijo `on`:

```html
<button onclick="mostrarFecha()">Ver fecha</button>
```

**2. Propiedad del objeto DOM**, asignando la función (sin ejecutarla):

```js
document.getElementById('boton').onclick = mostrarFecha; // sin paréntesis: asignas la función, no la ejecutas
```

**3. `addEventListener()`** — la forma recomendada:

```js
document.getElementById('boton').addEventListener('click', mostrarFecha);
```

| Usa `addEventListener()` | Evita atributo/propiedad |
|---|---|
| Permite varios handlers en el mismo evento del mismo elemento | Un único `onclick` — el segundo pisa al primero |
| Se puede quitar con `removeEventListener()` | No hay forma limpia de quitar solo uno |
| Separa el JS del HTML | Mezcla comportamiento con marcado |

!!! warning "La propiedad se sobrescribe, no se acumula"
    ```js
    boton.onclick = function () { console.log('primero'); };
    boton.onclick = function () { console.log('segundo'); };
    // al hacer clic, solo se ve "segundo" — el primero desapareció
    ```
    Con `addEventListener()` esto no pasa: puedes llamarlo varias veces sobre el mismo elemento y evento, y **todos** los handlers se ejecutan en el orden en que se añadieron.

---

## El objeto del evento {: .topic-title }

Cada handler recibe automáticamente un **parámetro** con información sobre lo ocurrido. Es opcional y su nombre es arbitrario (`event`, `e`...) — solo importa la posición.

```js
boton.addEventListener('click', function (event) {
    console.log(event.type);    // 'click'
    console.log(event.target);  // el elemento exacto que recibió el clic
});
```

Además de `type` y `target`, cada tipo de evento añade sus propias propiedades (coordenadas del ratón, tecla pulsada...) — se detallan en el temario de abajo.

---

## Quitar un evento — `removeEventListener()` {: .topic-title }

```js
function saludar() { console.log('Hola'); }

boton.addEventListener('click', saludar);
boton.removeEventListener('click', saludar); // ✅ misma referencia de función
```

!!! danger "Una función anónima no se puede quitar"
    ```js
    boton.addEventListener('click', () => console.log('Hola'));
    boton.removeEventListener('click', () => console.log('Hola')); // ❌ no hace nada
    ```
    Aunque el código sea idéntico, son dos funciones **distintas** en memoria. `removeEventListener` compara referencias, no contenido — si vas a necesitar quitar un handler más adelante, guárdalo en una variable con nombre.

---

## `preventDefault()` {: .topic-title }

```js
enlace.addEventListener('click', function (event) {
    event.preventDefault(); // el navegador NO navega a la URL del enlace
});
```

Sirve para cancelar cualquier acción que el navegador haría por defecto: seguir un enlace, enviar un formulario, abrir el menú contextual. No todos los eventos se pueden cancelar — se puede comprobar con `event.cancelable`.

---

## Propagación: burbujeo (bubbling) {: .topic-title }

Un evento no ocurre solo en el elemento donde pasó — **sube** por todos sus elementos padre, de dentro hacia afuera.

```html
<div id="exterior">
    <div id="interior"></div>
</div>
```

```js
exterior.addEventListener('click', () => console.log('exterior'));
interior.addEventListener('click', () => console.log('interior'));

// clic en #interior imprime, en este orden:
// 'interior'
// 'exterior'
```

### Detener la propagación — `stopPropagation()`

```js
interior.addEventListener('click', function (event) {
    event.stopPropagation(); // el clic NO llega al listener de #exterior
});
```

!!! tip "preventDefault() y stopPropagation() son independientes"
    `preventDefault()` cancela la acción por defecto del navegador (navegar, enviar el formulario...). `stopPropagation()` corta el burbujeo hacia los padres. Puedes usar uno, otro, los dos o ninguno — no dependen entre sí.

---

## Delegación de eventos {: .topic-title }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/2M0zZmX5Jco" title="Delegación de eventos — midudev" loading="lazy" allowfullscreen></iframe>
</div>

En vez de poner un listener en cada elemento de una lista, se aprovecha el burbujeo: un único listener en el padre, y se identifica el hijo real con `event.target`.

```js
lista.addEventListener('click', function (event) {
    if (event.target.matches('li')) {
        event.target.classList.toggle('completada');
    }
});
```

!!! tip "Funciona automáticamente con elementos añadidos después"
    Si añades un `<li>` nuevo a `lista` con `appendChild()` en cualquier momento, el clic sobre ese `<li>` nuevo YA funciona sin tocar nada más — el listener vive en el padre, no en cada hijo. Poner un listener individual en cada `<li>` no tendría este comportamiento: habría que volver a engancharlo cada vez que se crea un elemento nuevo.

### `closest()` — cuando el clic no cae justo en el elemento esperado

`event.target.matches('li')` solo da `true` si lo que se clicó ES exactamente un `<li>`. Si ese `<li>` tiene contenido anidado (un icono, un `<span>`) y el clic cae ahí, `event.target` es ese hijo — y `matches('li')` da `false`, aunque visualmente el clic haya sido "sobre la tarea".

`closest(selector)` busca hacia **arriba**: arranca en el propio elemento y sube por sus ancestros hasta encontrar el primero que coincide con el selector, o `null` si no hay ninguno. Es el complemento de `querySelector()`, que busca hacia abajo entre los descendientes.

```html
<li>
    <span class="icono">🔥</span> Tarea
</li>
```

```js
lista.addEventListener('click', function (event) {
    const item = event.target.closest('li');
    if (item) item.classList.toggle('completada');
});
```

Clic en el `<span>` del icono: `event.target.matches('li')` da `false` (el target es el `<span>`, no el `<li>`). `event.target.closest('li')` sube desde el `<span>` y encuentra el `<li>` igual.

!!! tip "closest() también sirve para excluir clics fuera de cualquier ítem"
    Si el clic ocurre en el propio contenedor (fuera de todos los `<li>`), `closest('li')` devuelve `null` — el `if (item)` filtra ese caso sin necesitar ninguna otra comprobación.

### `event.target` vs `event.currentTarget`

En un listener de delegación, ambas propiedades casi nunca apuntan al mismo elemento:

```js
lista.addEventListener('click', function (event) {
    console.log(event.target);        // el <li> exacto donde se hizo clic
    console.log(event.currentTarget); // <ul> — el elemento que tiene el listener enganchado
});
```

| Propiedad | Qué es |
|---|---|
| `event.target` | El elemento **más específico** donde ocurrió el evento — el que originó el clic |
| `event.currentTarget` | El elemento que tiene **enganchado el listener** que se está ejecutando ahora mismo |

En delegación, `currentTarget` es siempre el padre (fijo); `target` cambia según qué hijo se haya pulsado — por eso es `target` el que hay que comprobar para saber "cuál" se clicó.

### `contains()` — saber si un clic fue realmente "fuera"

Para cerrar un menú o dropdown al clicar fuera de él, comparar el `target` por `id` es frágil: cualquier elemento anidado dentro del menú tiene su propio `id` (o ninguno), así que compararlo contra el `id` del contenedor nunca detecta esos casos correctamente.

```js
document.addEventListener('click', function (event) {
    const dentroDelMenu = menu.contains(event.target);
    const dentroDelBoton = boton.contains(event.target);
    if (!dentroDelMenu && !dentroDelBoton) {
        menu.classList.add('hidden');
    }
});
```

`elemento.contains(otroElemento)` devuelve `true` si `otroElemento` ES el propio `elemento`, o es descendiente suyo a cualquier profundidad — a diferencia de comparar por `===` o por `.id`, no importa cuán anidado esté el clic dentro del menú o del botón.

!!! tip "El listener va en `document`, no en el menú"
    Un clic "fuera" del menú, por definición, no ocurre dentro del menú — así que un listener enganchado en el propio menú nunca lo va a ver. Hace falta escuchar en un antepasado común a todo lo que existe en la página, y `document` siempre lo es.

### Cuándo usar delegación y cuándo no

| Usa un listener por elemento | Usa delegación |
|---|---|
| Pocos elementos, fijos, no van a cambiar | 10+ elementos, o una lista que crece dinámicamente |
| Prototipo rápido / código de aprendizaje | Rendimiento importa (muchos listeners pesan) |

!!! warning "stopPropagation() rompe la delegación"
    Si un hijo (por ejemplo un botón dentro del `<li>`) llama a `event.stopPropagation()`, el clic nunca llega a burbujear hasta el `<ul>` — y el listener delegado del padre simplemente no se entera de que pasó nada. Delegación y `stopPropagation()` indiscriminado no son buenos compañeros: si necesitas frenar la propagación en un caso puntual, hazlo solo ahí, no como costumbre.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [Eventos de ratón](01-raton/index.md) | `click`, `dblclick`, `mousedown`/`mouseup`, `mousemove`, `mouseover`/`mouseout`, `contextmenu` |
| [Eventos de teclado](02-teclado/index.md) | `keydown`, `keyup`, `key` vs `code`, teclas modificadoras |
| [Eventos de página y formularios](03-pagina-formularios/index.md) | `load`, `resize`, `scroll`, `focus`/`blur`, `change` vs `input` |
| [Arrastrar y soltar](04-arrastrar-soltar/index.md) | `draggable`, `dragstart`/`dragover`/`drop`, `insertBefore()` |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Institut Montilivi — Gestió d'esdeveniments** | https://apunts.institutmontilivi.cat/DAW-M0612/esdeveniments.html |
| 📖 **aprendejavascript.dev — Eventos** | https://www.aprendejavascript.dev/clase/dom-y-eventos/eventos |
| 🎥 **jscamp.dev — Eventos y JavaScript en el navegador** | https://www.jscamp.dev/javascript/eventos-navegador |
