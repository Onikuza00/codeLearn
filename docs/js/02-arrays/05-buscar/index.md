# Buscar en arrays { .bloque-js }

> Seis métodos para responder la misma pregunta de fondo — "¿está esto aquí, y dónde?" — pero cada uno devuelve un tipo de respuesta distinto: posición, booleano, o el elemento en sí.

---

## `indexOf` {: .topic-title }

Devuelve la posición de un elemento, o `-1` si no está.

```js
const frutas = ["manzana", "pera", "uva", "pera"];

frutas.indexOf("pera");     // 1 — la primera coincidencia
frutas.indexOf("kiwi");     // -1 — no está
```

<div class="array-demo">
<p class="array-demo__label">frutas</p>
<div class="array-demo__viz" id="demo-indexof-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-indexof-pera">indexOf("pera")</button>
<button class="array-demo__btn" id="demo-indexof-kiwi">indexOf("kiwi")</button>
</div>
<div class="array-demo__log" id="demo-indexof-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-indexof-viz");
    if (!viz) return;
    var log = document.getElementById("demo-indexof-log");
    var frutas = ["manzana", "pera", "uva", "pera"];
    ArrayDemo.renderViz(viz, frutas);

    document.getElementById("demo-indexof-pera").addEventListener("click", function () {
        ArrayDemo.log(log, 'indexOf("pera") → ' + frutas.indexOf("pera"));
    });
    document.getElementById("demo-indexof-kiwi").addEventListener("click", function () {
        ArrayDemo.log(log, 'indexOf("kiwi") → ' + frutas.indexOf("kiwi"));
    });
});
</script>

!!! warning "-1 es un número — cuidado al usarlo en un if"
    ```js
    if (frutas.indexOf("kiwi")) { ... }   // ❌ -1 es truthy, esto SIEMPRE entra
    if (frutas.indexOf("kiwi") !== -1) { ... }   // ✅ comparación explícita
    ```

---

## `includes` {: .topic-title }

Responde `true`/`false` — ¿está o no está?

```js
const frutas = ["manzana", "pera", "uva"];

frutas.includes("pera");   // true
frutas.includes("kiwi");   // false
```

<div class="array-demo">
<p class="array-demo__label">frutas</p>
<div class="array-demo__viz" id="demo-includes-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-includes-pera">includes("pera")</button>
<button class="array-demo__btn" id="demo-includes-kiwi">includes("kiwi")</button>
</div>
<div class="array-demo__log" id="demo-includes-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-includes-viz");
    if (!viz) return;
    var log = document.getElementById("demo-includes-log");
    var frutas = ["manzana", "pera", "uva"];
    ArrayDemo.renderViz(viz, frutas);

    document.getElementById("demo-includes-pera").addEventListener("click", function () {
        ArrayDemo.log(log, 'includes("pera") → ' + frutas.includes("pera"));
    });
    document.getElementById("demo-includes-kiwi").addEventListener("click", function () {
        ArrayDemo.log(log, 'includes("kiwi") → ' + frutas.includes("kiwi"));
    });
});
</script>

!!! tip "includes vs indexOf !== -1"
    `frutas.includes("pera")` y `frutas.indexOf("pera") !== -1` dan el mismo resultado — pero `includes` dice directamente lo que estás preguntando, sin el rodeo de comparar contra `-1`. Si no necesitas la posición, usa `includes`.

---

## `some` / `every` {: .topic-title }

`some()` pregunta "¿AL MENOS UNO cumple la condición?". `every()` pregunta "¿TODOS cumplen?". Ambos devuelven `true`/`false`, y ambos reciben una función (no un valor) como argumento.

```js
const edades = [22, 17, 30, 15];

edades.some(e => e >= 18);    // true — al menos uno es mayor
edades.every(e => e >= 18);   // false — no todos son mayores
```

<div class="array-demo">
<p class="array-demo__label">edades</p>
<div class="array-demo__viz" id="demo-someevery-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-someevery-some">some(e =&gt; e &gt;= 18)</button>
<button class="array-demo__btn" id="demo-someevery-every">every(e =&gt; e &gt;= 18)</button>
</div>
<div class="array-demo__log" id="demo-someevery-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-someevery-viz");
    if (!viz) return;
    var log = document.getElementById("demo-someevery-log");
    var edades = [22, 17, 30, 15];
    ArrayDemo.renderViz(viz, edades);

    document.getElementById("demo-someevery-some").addEventListener("click", function () {
        ArrayDemo.log(log, "some(e >= 18) → " + edades.some(function (e) { return e >= 18; }));
    });
    document.getElementById("demo-someevery-every").addEventListener("click", function () {
        ArrayDemo.log(log, "every(e >= 18) → " + edades.every(function (e) { return e >= 18; }));
    });
});
</script>

!!! danger "Array vacío: every da true, some da false"
    ```js
    [].every(e => e >= 18);   // true  — "todos" un conjunto vacío se cumple por vacuidad
    [].some(e => e >= 18);    // false — no hay NINGUNO que cumpla
    ```
    Es lógica formal, no un bug: "todos los elementos de la nada cumplen la condición" es verdadero porque no hay ningún contraejemplo. Si tu código depende de esto con arrays que pueden llegar vacíos, valídalo explícitamente.

---

## `find` / `findIndex` {: .topic-title }

`find()` devuelve el **elemento** que cumple la condición (o `undefined`). `findIndex()` devuelve su **índice** (o `-1`). Los dos cortan la búsqueda apenas encuentran la primera coincidencia.

```js
const usuarios = [
    { id: 1, nombre: "Ana" },
    { id: 2, nombre: "Pau" },
    { id: 3, nombre: "Leo" },
];

usuarios.find(u => u.id === 2);        // { id: 2, nombre: "Pau" }
usuarios.findIndex(u => u.id === 2);   // 1
usuarios.find(u => u.id === 99);       // undefined
```

<div class="array-demo">
<p class="array-demo__label">usuarios (por id)</p>
<div class="array-demo__viz" id="demo-find-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-find-find">find(u =&gt; u.id === 2)</button>
<button class="array-demo__btn" id="demo-find-findindex">findIndex(u =&gt; u.id === 2)</button>
<button class="array-demo__btn" id="demo-find-nada">find(u =&gt; u.id === 99)</button>
</div>
<div class="array-demo__log" id="demo-find-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-find-viz");
    if (!viz) return;
    var log = document.getElementById("demo-find-log");
    var usuarios = [{ id: 1, nombre: "Ana" }, { id: 2, nombre: "Pau" }, { id: 3, nombre: "Leo" }];
    ArrayDemo.renderViz(viz, usuarios.map(function (u) { return u.nombre + " (id:" + u.id + ")"; }));

    document.getElementById("demo-find-find").addEventListener("click", function () {
        var u = usuarios.find(function (u) { return u.id === 2; });
        ArrayDemo.log(log, "find(id===2) → " + JSON.stringify(u));
    });
    document.getElementById("demo-find-findindex").addEventListener("click", function () {
        var i = usuarios.findIndex(function (u) { return u.id === 2; });
        ArrayDemo.log(log, "findIndex(id===2) → " + i);
    });
    document.getElementById("demo-find-nada").addEventListener("click", function () {
        var u = usuarios.find(function (u) { return u.id === 99; });
        ArrayDemo.log(log, "find(id===99) → " + u);
    });
});
</script>

---

## Guía de decisión {: .topic-title }

| Necesitas... | Usa |
|---|---|
| La posición de un valor simple (string, número) | `indexOf` |
| Saber si un valor simple está, sin la posición | `includes` |
| Saber si AL MENOS UN elemento cumple una condición | `some` |
| Saber si TODOS los elementos cumplen una condición | `every` |
| El objeto/elemento completo que cumple una condición | `find` |
| La posición del elemento que cumple una condición | `findIndex` |

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `includes` cuando solo te importa sí/no | `indexOf(...) !== -1` cuando `includes` dice lo mismo más claro |
| `find`/`some`/`every` con objetos y condiciones | `indexOf`/`includes` con objetos — comparan por referencia, casi nunca dan lo que esperás |
| Comparar `indexOf` contra `-1` explícitamente | Usar el resultado de `indexOf` directo en un `if` |
| Recordar que `every([])` es `true` | Asumir que un array vacío "no cumple ninguna condición" |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Array.prototype.find()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/find |
| 📘 **MDN — Array.prototype.some()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/some |
| 📘 **MDN — Array.prototype.every()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/every |
| 📖 **aprendejavascript.dev — Buscar en Arrays** | https://www.aprendejavascript.dev/clase/arrays/buscar |
