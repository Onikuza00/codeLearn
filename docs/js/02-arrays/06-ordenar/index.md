# Ordenar arrays { .bloque-js }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/array-sort.mp4"></video>
</div>

> "No mutar, crear nuevo" — la regla que ya viste en `map`/`filter`/`reduce` — tiene su excepción más famosa aquí: `sort()` muta el array original. Es el gotcha más común de este tema.

---

## `sort()` — el comparador por defecto convierte a texto {: .topic-title }

```js
const nombres = ["Leo", "Ana", "Pau"];
nombres.sort();   // ["Ana", "Leo", "Pau"] — alfabético, funciona bien con strings

const numeros = [40, 100, 1, 5, 25];
numeros.sort();   // [1, 100, 25, 40, 5] ← "100" queda antes que "25": compara como TEXTO, no como número
```

<div class="array-demo">
<p class="array-demo__label">numeros</p>
<div class="array-demo__viz" id="demo-sort-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-sort-default">sort() sin comparador</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-sort-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-sort-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-sort-viz");
    if (!viz) return;
    var log = document.getElementById("demo-sort-log");
    var original = [40, 100, 1, 5, 25];
    var numeros = original.slice();
    ArrayDemo.renderViz(viz, numeros);

    document.getElementById("demo-sort-default").addEventListener("click", function () {
        numeros.sort();
        ArrayDemo.renderViz(viz, numeros);
        ArrayDemo.log(log, 'sort() convirtió a texto antes de comparar → "100" queda antes que "25"');
    });

    document.getElementById("demo-sort-reset").addEventListener("click", function () {
        numeros = original.slice();
        ArrayDemo.renderViz(viz, numeros);
        ArrayDemo.clearLog(log);
    });
});
</script>

!!! danger "sort() sin argumentos ordena como TEXTO, no como números"
    `[10, 2, 33, 4].sort()` da `[10, 2, 33, 4]`... convertido: compara `"10"` vs `"2"` caracter por caracter, y `"1"` es menor que `"2"`, así que `10` queda antes que `2`. Para números necesitas SIEMPRE una función comparadora.

---

## Función comparadora {: .topic-title }

`sort(comparador)` recibe una función que compara dos elementos a la vez (`a`, `b`) y devuelve un número: negativo (`a` va antes), positivo (`a` va después), o cero (da igual el orden).

```js
const numeros = [10, 2, 33, 4];

numeros.sort((a, b) => a - b);   // [2, 4, 10, 33] — ascendente
numeros.sort((a, b) => b - a);   // [33, 10, 4, 2] — descendente
```

<div class="array-demo">
<p class="array-demo__label">numeros</p>
<div class="array-demo__viz" id="demo-comparador-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-comparador-asc">sort((a, b) =&gt; a - b)</button>
<button class="array-demo__btn" id="demo-comparador-desc">sort((a, b) =&gt; b - a)</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-comparador-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-comparador-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-comparador-viz");
    if (!viz) return;
    var log = document.getElementById("demo-comparador-log");
    var original = [10, 2, 33, 4];
    var numeros = original.slice();
    ArrayDemo.renderViz(viz, numeros);

    document.getElementById("demo-comparador-asc").addEventListener("click", function () {
        numeros.sort(function (a, b) { return a - b; });
        ArrayDemo.renderViz(viz, numeros);
        ArrayDemo.log(log, "(a, b) => a - b → ascendente");
    });

    document.getElementById("demo-comparador-desc").addEventListener("click", function () {
        numeros.sort(function (a, b) { return b - a; });
        ArrayDemo.renderViz(viz, numeros);
        ArrayDemo.log(log, "(a, b) => b - a → descendente");
    });

    document.getElementById("demo-comparador-reset").addEventListener("click", function () {
        numeros = original.slice();
        ArrayDemo.renderViz(viz, numeros);
        ArrayDemo.clearLog(log);
    });
});
</script>

!!! tip "Truco mnemotécnico: a - b = ascendente"
    `a - b` da negativo cuando `a` es menor que `b` → `a` queda antes → ascendente. Invierte el orden (`b - a`) y obtienes descendente. No memorices "negativo/positivo/cero" en abstracto — memoriza `a - b` = ascendente.

También ordena arrays de objetos, comparando el campo que te interese:

```js
const productos = [
    { nombre: "Mouse", precio: 15 },
    { nombre: "Teclado", precio: 30 },
    { nombre: "Monitor", precio: 200 },
];

productos.sort((a, b) => a.precio - b.precio);   // de más barato a más caro
```

---

## `sort()` MUTA — cómo evitarlo {: .topic-title }

```js
const original = [3, 1, 2];

const ordenado = original.sort();
console.log(original);   // [1, 2, 3] — el "original" TAMBIÉN cambió, es el MISMO array
console.log(ordenado === original);   // true — sort() devuelve una referencia al mismo array
```

<div class="array-demo">
<p class="array-demo__label">original</p>
<div class="array-demo__viz" id="demo-inmutable-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-inmutable-spread">[...original].sort()</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-inmutable-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-inmutable-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-inmutable-viz");
    if (!viz) return;
    var log = document.getElementById("demo-inmutable-log");
    var original = [3, 1, 2];
    ArrayDemo.renderViz(viz, original);

    document.getElementById("demo-inmutable-spread").addEventListener("click", function () {
        var copiaOrdenada = [].concat(original).sort(function (a, b) { return a - b; });
        ArrayDemo.log(log, "copia ordenada = [" + copiaOrdenada.join(", ") + "]  |  original sigue = [" + original.join(", ") + "]");
    });

    document.getElementById("demo-inmutable-reset").addEventListener("click", function () {
        ArrayDemo.clearLog(log);
    });
});
</script>

!!! warning "Para no mutar: copia antes de ordenar"
    ```js
    const ordenado = [...original].sort((a, b) => a - b);   // copia con spread, ordena la copia
    ```
    Es el mismo patrón "no mutar, crear nuevo" que ya conocés de `map`/`filter`. Existe también `toSorted()` (la versión no-mutante nativa de `sort()`), pero su soporte en navegadores es más reciente — si tu proyecto necesita compatibilidad amplia, usa `[...array].sort()`.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa siempre una función comparadora con números | Confiar en `sort()` sin argumentos para ordenar números |
| Copia el array (`[...array]`) antes de ordenar si necesitas el original | Olvidar que `sort()` muta — y sorprenderte cuando el "original" cambió |
| `(a, b) => a - b` para ascendente, `(a, b) => b - a` para descendente | Memorizar "negativo/positivo" en abstracto sin el truco de la resta |
| Ordenar objetos comparando el campo que te importa | Intentar ordenar objetos sin comparador — compara por texto y da resultados sin sentido |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Array.prototype.sort()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort |
| 📘 **MDN — Array.prototype.toSorted()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted |
| 📖 **aprendejavascript.dev — Ordenar Arrays** | https://www.aprendejavascript.dev/clase/arrays/ordenar |
