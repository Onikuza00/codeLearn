# Arrastrar y soltar { .bloque-js }

> API nativa del navegador para arrastrar elementos con el ratón y soltarlos en otro sitio — no confundir con "seguir al cursor" (eso es `mousemove`).

---

## Activar el arrastre — `draggable` {: .topic-title }

```html
<li draggable="true">Elemento arrastrable</li>
```

Sin este atributo, ningún evento de arrastre se dispara sobre el elemento — por defecto solo el texto seleccionado y las imágenes son arrastrables.

---

## Las tres fases {: .topic-title }

| Evento | Cuándo se dispara | En qué elemento |
|---|---|---|
| `dragstart` | Al empezar a arrastrar | El elemento que se arrastra |
| `dragover` | Continuamente, mientras algo se arrastra ENCIMA | El elemento sobre el que pasa |
| `drop` | Al soltar | El elemento donde se suelta |

```js
elemento.addEventListener('dragstart', function (event) { /* ... */ });
elemento.addEventListener('dragover', function (event) { /* ... */ });
elemento.addEventListener('drop', function (event) { /* ... */ });
```

!!! warning "Sin preventDefault() en dragover, drop nunca se dispara"
    Por defecto, el navegador NO permite soltar nada en ningún elemento — ese es el comportamiento por defecto de `dragover`. Si no se llama `event.preventDefault()` dentro de su listener, el evento `drop` jamás llega a dispararse, sin ningún error visible que lo avise.

    ```js
    zona.addEventListener('dragover', function (event) {
        event.preventDefault(); // habilita el drop en este elemento
    });
    ```

---

## Recordar qué se está arrastrando {: .topic-title }

`dragstart` y `drop` ocurren en momentos y (normalmente) elementos distintos — para saber en el `drop` CUÁL fue el elemento que arrancó el arrastre, hay que guardarlo en una variable por fuera de los handlers (closure), en el momento del `dragstart`:

```js
let elementoArrastrado = null;

lista.addEventListener('dragstart', function (event) {
    elementoArrastrado = event.target; // guardado para usarlo después, en el drop
});

lista.addEventListener('drop', function (event) {
    // acá event.target es el elemento SOBRE el que se soltó, no el que se arrastró
    console.log(elementoArrastrado, event.target);
});
```

---

## Mover el nodo en el DOM {: .topic-title }

El `drop` no reordena nada por sí solo — hay que mover el nodo manualmente. `insertBefore()` inserta un nodo justo antes de otro, dentro del mismo padre:

```js
padre.insertBefore(nodoAMover, nodoDeReferencia);
```

!!! tip "insertBefore() mueve, no clona"
    Si el nodo que se le pasa ya está en el DOM en otro lugar, el navegador lo QUITA de su posición actual y lo vuelve a insertar en la nueva — no hace falta llamar `removeChild()` antes a mano.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Drag and Drop API** | https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API |
