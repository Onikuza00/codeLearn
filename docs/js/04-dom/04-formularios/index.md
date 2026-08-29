# Formularios { .bloque-js }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/Zr9op3fP-54" title="Más eventos: input, blur, submit, preventDefault — midudev" loading="lazy" allowfullscreen></iframe>
</div>

> Un formulario es un conjunto de elementos DOM como cualquier otro — la diferencia es que trae herramientas propias para leer todos sus valores a la vez y validarlos antes de enviarlos.

---

## Acceder a los campos {: .topic-title }

Cada campo con atributo `name` queda disponible como propiedad de `form.elements`:

```html
<form id="registro">
    <input name="email" type="email">
    <input name="password" type="password">
</form>
```

```js
const form = document.getElementById('registro');

form.elements.email.value;      // acceso directo por el name
form.elements['email'].value;   // equivalente, notación de corchetes
```

---

## Evento `submit` {: .topic-title }

Se dispara sobre el `<form>` (no sobre el botón) al enviarlo — tanto si el usuario hace clic en un `<button type="submit">` como si pulsa Enter dentro de un campo de texto del formulario.

```js
form.addEventListener('submit', function (event) {
    event.preventDefault(); // evita que la página recargue/navegue a la URL del action
    console.log('Formulario enviado');
});
```

!!! warning "Sin preventDefault(), la página recarga"
    El comportamiento por defecto del navegador al enviar un formulario es navegar (recargar la página o ir a la URL de `action`). Casi siempre quieres cancelarlo con `preventDefault()` para procesar el envío con JavaScript en vez de dejar que el navegador navegue.

---

## `FormData` {: .topic-title }

Construye automáticamente pares clave/valor a partir de un `<form>`, leyendo el atributo `name` de cada campo.

```js
const form = document.querySelector('form');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // evita el envío tradicional de la página

    const datos = new FormData(form);

    datos.get('email');      // el valor de <input name="email">
    datos.get('colores');    // si hay varios campos con el mismo name, solo el PRIMERO
    datos.getAll('colores'); // TODOS los valores con ese name (checkboxes múltiples)
});
```

Es directamente iterable, sin necesidad de llamar a `.entries()`:

```js
for (const [clave, valor] of datos) {
    console.log(clave, valor);
}
```

!!! warning "Un campo sin `name` no aparece en FormData"
    `FormData` solo recoge los campos que tienen atributo `name` en el HTML. Un `<input>` sin `name` es invisible para `FormData`, aunque tenga `id` y aunque lo veas perfectamente en pantalla.

---

## Validación nativa: los atributos HTML {: .topic-title }

Antes de tocar JavaScript, el propio HTML ya valida con atributos como `required`, `pattern`, `minlength`/`maxlength`, `min`/`max`, `type="email"`. El navegador bloquea el envío del formulario solo con eso — lo que sigue es cómo consultar y personalizar ese resultado desde JS.

---

## `checkValidity()` vs `reportValidity()` {: .topic-title }

```js
campo.checkValidity();  // true/false — SOLO comprueba, no muestra nada al usuario
campo.reportValidity(); // comprueba Y muestra el mensaje de error nativo del navegador si falla
```

| `checkValidity()` | `reportValidity()` |
|---|---|
| Validación silenciosa, para lógica interna | Validación interactiva, para avisar al usuario |
| No dispara ninguna UI | Muestra el globo de error nativo del navegador |

---

## El objeto `validity` {: .topic-title }

Cada campo tiene una propiedad `validity` con un booleano por cada tipo de restricción posible:

| Propiedad | Se activa cuando... |
|---|---|
| `valueMissing` | Hay `required` y el campo está vacío |
| `typeMismatch` | El valor no coincide con el `type` (ej. `type="email"` sin arroba) |
| `patternMismatch` | El valor no cumple el `pattern` (regex) |
| `tooShort` / `tooLong` | El valor no respeta `minlength`/`maxlength` |
| `rangeUnderflow` / `rangeOverflow` | El valor no respeta `min`/`max` |
| `stepMismatch` | El valor no encaja en el intervalo de `step` |
| `customError` | Hay un mensaje puesto a mano con `setCustomValidity()` |
| `valid` | Ninguna de las anteriores — el campo pasa todas las restricciones |

```js
campo.addEventListener('input', function () {
    if (campo.validity.valueMissing) {
        console.log('Este campo es obligatorio');
    }
    if (campo.validity.typeMismatch) {
        console.log('El formato no es válido');
    }
});
```

---

## `setCustomValidity()` — mensajes de validación a medida {: .topic-title }

Fuerza a un campo a marcarse como inválido con un mensaje propio, aunque cumpla todas las restricciones HTML.

```js
const password = document.querySelector('#password');
const confirmar = document.querySelector('#confirmar');

confirmar.addEventListener('input', function () {
    if (confirmar.value !== password.value) {
        confirmar.setCustomValidity('Las contraseñas no coinciden');
    } else {
        confirmar.setCustomValidity(''); // string vacío = campo válido otra vez
    }
});
```

!!! danger "Un string vacío es obligatorio para volver a marcar el campo como válido"
    `setCustomValidity()` deja el campo marcado como inválido de forma **permanente** hasta que lo llames de nuevo con `''`. Si pones un mensaje de error condicionalmente pero olvidas el `else` que lo limpia, el campo se queda inválido para siempre aunque el usuario corrija el valor.

---

## Gotchas de validación {: .topic-title }

!!! warning "form.submit() NO dispara la validación"
    ```js
    form.submit(); // ❌ envía el formulario SIN comprobar ninguna restricción

    form.requestSubmit(); // ✅ dispara el evento submit Y la validación nativa, como un clic real
    ```
    Solo un clic real en un `<button type="submit">`, o `form.requestSubmit()`, activan la validación del navegador. Llamar a `form.submit()` por código la salta por completo.

!!! warning "La validación HTML se puede saltar — nunca confíes solo en ella"
    Cualquiera puede abrir las herramientas de desarrollador, quitar el atributo `required`, o mandar la petición a mano sin pasar por el formulario. La validación en el navegador es para dar **feedback inmediato al usuario**, no para proteger tus datos — la validación real y definitiva siempre tiene que repetirse en el servidor.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Constraint validation** | https://developer.mozilla.org/es/docs/Web/HTML/Guides/Constraint_validation |
| 📘 **MDN — FormData** | https://developer.mozilla.org/es/docs/Web/API/FormData |
