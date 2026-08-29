# Eventos de página y formularios { .bloque-js }

> Reaccionan a cambios en la ventana del navegador o a la interacción del usuario con los controles de un formulario.

---

## `load` {: .topic-title }

Se dispara cuando el elemento ha terminado de cargarse por completo. Se usa sobre todo con `<body>`, pero sirve para cualquier elemento con tiempo de carga variable (por ejemplo `<img>`).

```js
window.addEventListener('load', function () {
    console.log('La página ha terminado de cargar, incluidas imágenes y recursos');
});
```

---

## `beforeunload` {: .topic-title }

Se ejecuta justo antes de cerrar o recargar la página, mientras el documento todavía es visible. Su uso típico es avisar al usuario de que hay cambios sin guardar.

```js
window.addEventListener('beforeunload', function (event) {
    event.preventDefault(); // necesario para que el navegador muestre el diálogo de confirmación
});
```

---

## `resize` {: .topic-title }

Se dispara al cambiar el tamaño de la ventana. Útil para recalcular o redibujar elementos que dependen del ancho/alto disponible.

```js
window.addEventListener('resize', function () {
    console.log('Nuevo tamaño de ventana:', window.innerWidth, window.innerHeight);
});
```

---

## `scroll` {: .topic-title }

Se dispara al mover la barra de desplazamiento.

```js
contenedor.addEventListener('scroll', function () {
    console.log(contenedor.scrollTop, contenedor.scrollLeft); // posición del scroll DEL ELEMENTO
});

window.addEventListener('scroll', function () {
    console.log(window.scrollX, window.scrollY); // posición del scroll DE LA PÁGINA
});
```

!!! tip "scrollTop/scrollLeft funcionan incluso con las barras ocultas"
    Puedes leer y modificar `scrollTop`/`scrollLeft` aunque el elemento tenga `overflow: hidden` y no se vea ninguna barra — es una propiedad del elemento, no solo un reflejo visual de la barra.

---

## `focus` / `blur` {: .topic-title }

Detectan cuándo un elemento **gana** (`focus`) o **pierde** (`blur`) el foco — por ejemplo, al entrar o salir del cursor de edición de un `<input>`.

```js
campo.addEventListener('focus', function () { campo.classList.add('activo'); });
campo.addEventListener('blur', function () { campo.classList.remove('activo'); });
```

---

## `change` vs `input` {: .topic-title }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/AV2sjA4X-V4" title="Manejar evento change en JavaScript — midudev" loading="lazy" allowfullscreen></iframe>
</div>

Ambos reaccionan a cambios en `<input>`, `<select>` o `<textarea>`, pero en momentos distintos.

```js
campo.addEventListener('input', function () {
    console.log('Cada pulsación:', campo.value); // se dispara con CADA cambio, al instante
});

campo.addEventListener('change', function () {
    console.log('Al confirmar:', campo.value); // solo cuando el campo pierde el foco Y el valor cambió
});
```

!!! warning "change no es 'en tiempo real'"
    Si necesitas reaccionar mientras el usuario escribe (validación en vivo, contador de caracteres...), `change` no sirve — solo se dispara al salir del campo. Usa `input` para eso. `change` sí es el correcto para `<select>` y checkboxes/radios, donde "cambiar" significa una acción puntual, no una secuencia de teclas.

!!! tip "El checkbox ya se marca solo — el `change` llega DESPUÉS"
    Marcar o desmarcar un checkbox al hacer clic es comportamiento nativo del navegador, no hace falta ninguna línea de JS para que pase. El orden real es: 1) el usuario hace clic, 2) el navegador actualiza `.checked` por su cuenta, 3) recién ahí se dispara `'change'`. Dentro del listener, `checkbox.checked` ya refleja el valor NUEVO — nunca hace falta asignarlo a mano para el checkbox que el usuario tocó directamente. Asignarlo manualmente (`checkbox.checked = ...`) solo hace falta cuando es el propio código el que fuerza el cambio en OTRO elemento (por ejemplo, sincronizar varios checkboxes desde uno "maestro").

---

## `select`, `cut`, `copy`, `paste` {: .topic-title }

```js
campo.addEventListener('select', function () {
    console.log('Se ha seleccionado texto dentro del campo');
});

campo.addEventListener('paste', function (event) {
    event.preventDefault(); // por ejemplo, para bloquear pegar contenido externo
});
```

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Institut Montilivi — Esdeveniments de pàgina i formularis** | https://apunts.institutmontilivi.cat/DAW-M0612/esdeveniments_pagina.html |
