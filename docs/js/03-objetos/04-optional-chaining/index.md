# Optional chaining `?.` { .bloque-js }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/objetos-optional-chaining.mp4"></video>
</div>

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/QOk9gP-u_DI" title="Optional Chaining — midudev" loading="lazy" allowfullscreen></iframe>
</div>

> Uno de los errores más comunes en JavaScript es leer una propiedad de algo que resultó ser `undefined`. El operador `?.` te deja acceder a propiedades anidadas sin validar cada nivel a mano.

---

## El problema {: .topic-title }

```js
const gamesystem = { name: 'PS5' };

console.log(gamesystem.specifications.ram);
// ❌ TypeError: Cannot read properties of undefined (reading 'ram')
```

`specifications` no existe, así que `.ram` intenta leerse sobre `undefined` y explota.

---

## Formas tradicionales de prevenirlo {: .topic-title }

```js
// Con typeof
if (typeof gamesystem.specifications === 'object') {
    console.log(gamesystem.specifications.ram);
} else {
    console.log('No hay especificaciones');
}

// Con el operador in
if ('specifications' in gamesystem) {
    console.log(gamesystem.specifications.ram);
}
```

Ambas funcionan, pero se vuelven ilegibles en cuanto hay varios niveles anidados:

```js
let email = undefined;
if (user && user.settings &&
    user.settings.notifications &&
    user.settings.notifications.email) {
    email = user.settings.notifications.email;
}
```

---

## La solución: `?.` {: .topic-title }

```js
console.log(gamesystem.specifications?.ram);
// undefined — sin error

const email = user?.settings?.notifications?.email;
```

Si en cualquier punto de la cadena algo es `null` o `undefined`, la expresión entera corta ahí y devuelve `undefined` — no sigue intentando leer lo siguiente, y no tira error.

!!! tip "No es magia, es un cortocircuito"
    `?.` es el mismo tipo de mecanismo que `&&` cortando la evaluación (`a && a.b`) — solo que integrado en la sintaxis de acceso a propiedades, para no repetir `a &&` en cada nivel.

---

## Acceso dinámico con corchetes {: .topic-title }

También podés combinar `?.` con la notación de corchetes cuando la clave viene de una variable:

```js
const key = 'ram';
gamesystem.specifications?.[key];
```

---

## Nullish coalescing `??` — poner un valor por defecto {: .topic-title }

`?.` solo evita el error — te deja con `undefined` en la mano. Si además querés un valor por defecto cuando eso pasa, `??` es el complemento natural:

```js
gamesystem.specifications?.ram ?? 'Sin especificar';
```

`??` dice: "si lo de la izquierda es `null` o `undefined`, usá lo de la derecha". El combo `?.` + `??` reemplaza al ternario "chequeo y repito la misma expresión":

```js
// ❌ Repetís la expresión completa en las dos ramas del ternario
persona.direccion?.ciudad ? persona.direccion?.ciudad : 'Desconocida';

// ✅ Una sola vez, con ??
persona?.direccion?.ciudad ?? 'Desconocida';
```

!!! danger "`??` no es lo mismo que `||`"
    `||` cae al valor por defecto ante **cualquier** valor falsy (`0`, `""`, `false`, `null`, `undefined`, `NaN`). `??` solo cae ante `null`/`undefined`. Si un `precio` válido es `0`, `precio || 100` te lo pisa incorrectamente por `100`; `precio ?? 100` respeta el `0` porque no es `null`/`undefined`. Mismo tipo de gotcha que ya viste con arrays truthy: elegir la herramienta que pregunta exactamente lo que necesitás, no la que "más o menos" funciona.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Optional chaining (?.)** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Optional_chaining |
| 📘 **MDN — Nullish coalescing operator (??)** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing |
| 📖 **aprendejavascript.dev — Operador de encadenamiento opcional** | https://www.aprendejavascript.dev/clase/objetos/optional-chaining |
