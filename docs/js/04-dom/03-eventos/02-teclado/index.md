# Eventos de teclado { .bloque-js }

> Reaccionan al pulsar o soltar una tecla. Todos reciben un objeto de evento con la información de qué tecla y qué modificadores estaban activos.

---

## `keydown` y `keyup` {: .topic-title }

```js
input.addEventListener('keydown', function (event) {
    console.log('Se ha presionado:', event.key);
});

input.addEventListener('keyup', function (event) {
    console.log('Se ha soltado:', event.key);
});
```

Ambos comparten el mismo conjunto de propiedades en el evento:

| Propiedad | Qué devuelve |
|---|---|
| `key` | El **carácter** — distingue mayúsculas de minúsculas, pero da el mismo valor para teclas repetidas físicamente distintas (ej. las dos teclas `Shift`) |
| `code` | La **tecla física** — siempre el mismo valor pase lo que pase con mayúsculas o layout, útil para teclas con función múltiple (numérico) |
| `altKey` | `true` si `Alt` estaba pulsada |
| `ctrlKey` | `true` si `Ctrl` estaba pulsada |
| `shiftKey` | `true` si `Shift` estaba pulsada |
| `metaKey` | `true` si la tecla `Meta` (⌘/Win) estaba pulsada |

!!! tip "`key` vs `code`: cuándo usar cada una"
    Usa `key` cuando te importa **qué carácter** se escribió (validar que sea una letra, un número...). Usa `code` cuando te importa **qué tecla física** se pulsó, independientemente del layout o de si `Shift` estaba activo — por ejemplo, controles de videojuego donde `WASD` siempre debe ser la misma tecla física aunque el teclado esté en otro idioma.

!!! warning "keydown se repite mientras mantienes la tecla"
    Si no sueltas la tecla, `keydown` se sigue disparando una y otra vez (igual que al escribir rápido en un input). `keyup` en cambio solo se dispara una vez, al soltar.

---

## Cancelar una tecla {: .topic-title }

Dos formas de impedir que el carácter llegue al control (por ejemplo, bloquear números en un campo de texto):

```js
// Devolviendo false desde el handler
nombreUsuario.addEventListener('keydown', function (event) {
    if ('1234567890'.includes(event.key)) {
        return false;
    }
});
```

```js
// O con preventDefault(), si necesitas seguir ejecutando código después
nombreUsuario.addEventListener('keydown', function (event) {
    if ('1234567890'.includes(event.key)) {
        event.preventDefault();
    }
});
```

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Institut Montilivi — Esdeveniments del teclat** | https://apunts.institutmontilivi.cat/DAW-M0612/esdeveniments_teclat.html |
