# Eventos de ratón { .bloque-js }

> Reaccionan a acciones con el puntero o los botones del ratón.

!!! info "El botón principal puede no ser el izquierdo"
    Por defecto el botón principal es el izquierdo y el de menú contextual el derecho, pero el usuario puede haberlos intercambiado en su configuración (por ejemplo, si es zurdo). No asumas cuál es "el botón izquierdo" — usa la propiedad `button` del evento.

---

## `click` y `dblclick` {: .topic-title }

```js
boton.addEventListener('click', function () { /* ... */ });
boton.addEventListener('dblclick', function () { /* ... */ });
```

!!! tip "Un doble clic dispara AMBOS eventos"
    Si un elemento tiene listeners tanto en `click` como en `dblclick`, al hacer doble clic se ejecutan los dos: primero `click`, después `dblclick`. No son mutuamente excluyentes.

---

## `contextmenu` {: .topic-title }

Se dispara al hacer clic con el botón de menú contextual (normalmente el derecho).

```js
elemento.addEventListener('contextmenu', function (event) {
    event.preventDefault(); // evita que se abra el menú contextual del navegador
});
```

---

## `mousedown` / `mouseup` {: .topic-title }

Detectan el momento exacto en que se **presiona** o se **suelta** cualquier botón del ratón — no solo el clic completo.

```js
elemento.addEventListener('mousedown', function (event) {
    console.log('Botón presionado:', event.button);
});
```

La propiedad `button` indica cuál se pulsó:

| Valor | Botón |
|---|---|
| `0` | Principal |
| `1` | Rueda / botón central |
| `2` | Menú contextual |

!!! tip "Orden real de los eventos al hacer doble clic"
    1. `mousedown`
    2. `mouseup`
    3. `click`
    4. `dblclick`

    `click` solo se dispara si el elemento recibió un `mousedown` seguido de un `mouseup` — no es un evento "primitivo" del navegador, es una interpretación de esos dos.

---

## `mousemove` {: .topic-title }

Se dispara continuamente mientras el puntero se mueve sobre el elemento. Las coordenadas están disponibles en tres sistemas de referencia distintos:

| Eje X | Eje Y | Referencia |
|---|---|---|
| `clientX` | `clientY` | Respecto a la ventana visible (viewport) |
| `pageX` | `pageY` | Respecto a toda la página (incluye el scroll) |
| `screenX` | `screenY` | Respecto a la pantalla física |

```js
elemento.addEventListener('mousemove', function (event) {
    elemento.textContent = `Coordenadas: ${event.clientX}, ${event.clientY}`;
});
```

---

## `mouseover` / `mouseout` {: .topic-title }

Detectan cuándo el puntero **entra** o **sale** del elemento. Traen dos propiedades para saber de dónde viene y a dónde va:

```js
elemento.addEventListener('mouseover', function (event) {
    const actual = event.target;         // el elemento al que entra el puntero
    const anterior = event.relatedTarget; // de dónde venía
});

elemento.addEventListener('mouseout', function (event) {
    const abandonado = event.target;        // el elemento que el puntero deja
    const siguiente = event.relatedTarget;  // dónde queda el puntero ahora
});
```

!!! warning "mouseover/mouseout burbujean; mouseenter/mouseleave NO"
    `mouseover` y `mouseout` se disparan también al pasar por elementos hijos del elemento observado (heredan el burbujeo). Si tu elemento tiene hijos y solo quieres detectar la entrada/salida del elemento como un todo (sin que los hijos disparen el evento de nuevo), usa `mouseenter`/`mouseleave` en su lugar — funcionan igual pero no burbujean.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Institut Montilivi — Esdeveniments del ratolí** | https://apunts.institutmontilivi.cat/DAW-M0612/esdeveniments_ratoli.html |
