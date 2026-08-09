# Métodos básicos { .bloque-js }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/arrays-metodos.mp4"></video>
</div>

> Un **método** es una función que se ejecuta sobre un objeto (`array.push(...)`); una **propiedad** es una variable que pertenece a ese objeto (`array.length`). Los arrays traen ambos de fábrica para que no tengas que reinventar operaciones básicas.

---

## `.length` {: .topic-title }

Propiedad (no método) que indica cuántos elementos tiene el array. Te sirve para saber el tamaño antes de recorrerlo o validar que no esté vacío.

```js
const frutas = ["manzana", "pera", "plátano", "fresa"];
frutas.length;   // 4
```

!!! tip "Truco poco conocido: reasignar .length recorta el array"
    ```js
    frutas.length = 2;
    console.log(frutas);   // ["manzana", "pera"] — se recortó, no hace falta splice
    ```
    Funciona porque `.length` no es de solo lectura — pero úsalo con cuidado, no es obvio para quien lea el código después que un simple `= 2` está BORRANDO elementos.

<div class="array-demo">
<p class="array-demo__label">Demo interactiva</p>
<div class="array-demo__viz" id="demo-length-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-length-trim">frutas.length = 2</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-length-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-length-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-length-viz");
    if (!viz) return;
    var log = document.getElementById("demo-length-log");
    var original = ["manzana", "pera", "plátano", "fresa"];
    var frutas = original.slice();

    function render() { ArrayDemo.renderViz(viz, frutas); }

    document.getElementById("demo-length-trim").addEventListener("click", function () {
        var antes = frutas.length;
        frutas.length = 2;
        render();
        ArrayDemo.log(log, "length: " + antes + " → 2  |  quedó [" + frutas.join(", ") + "]");
    });

    document.getElementById("demo-length-reset").addEventListener("click", function () {
        frutas = original.slice();
        render();
        ArrayDemo.clearLog(log);
    });

    render();
});
</script>

---

## `push` / `pop` {: .topic-title }

`push()` añade un elemento al final del array y devuelve el nuevo largo. `pop()` quita y devuelve el último elemento.

```js
const frutas = ["plátano", "fresa"];

const nuevoLargo = frutas.push("naranja");   // añade al FINAL
console.log(frutas);       // ["plátano", "fresa", "naranja"]
console.log(nuevoLargo);   // 3 — push devuelve el nuevo largo, no el array

const ultima = frutas.pop();   // quita del FINAL
console.log(ultima);       // "naranja" — pop devuelve lo que quitó
console.log(frutas);       // ["plátano", "fresa"]
```

<div class="array-demo">
<p class="array-demo__label">Demo interactiva</p>
<div class="array-demo__viz" id="demo-pushpop-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-pushpop-push">push("naranja")</button>
<button class="array-demo__btn" id="demo-pushpop-pop">pop()</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-pushpop-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-pushpop-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-pushpop-viz");
    if (!viz) return;
    var log = document.getElementById("demo-pushpop-log");
    var original = ["plátano", "fresa"];
    var frutas = original.slice();

    function render() { ArrayDemo.renderViz(viz, frutas); }

    document.getElementById("demo-pushpop-push").addEventListener("click", function () {
        var nuevoLargo = frutas.push("naranja");
        render();
        ArrayDemo.log(log, 'push("naranja") → largo nuevo = ' + nuevoLargo);
    });

    document.getElementById("demo-pushpop-pop").addEventListener("click", function () {
        if (frutas.length === 0) { ArrayDemo.log(log, "pop() → array vacío, nada que quitar"); return; }
        var quitado = frutas.pop();
        render();
        ArrayDemo.log(log, 'pop() → devuelve "' + quitado + '"');
    });

    document.getElementById("demo-pushpop-reset").addEventListener("click", function () {
        frutas = original.slice();
        render();
        ArrayDemo.clearLog(log);
    });

    render();
});
</script>

## `shift` / `unshift` {: .topic-title }

`shift()` quita y devuelve el primer elemento del array. `unshift()` añade un elemento al principio.

```js
const primera = frutas.shift();   // quita del PRINCIPIO
console.log(primera);      // "plátano"
console.log(frutas);       // ["fresa"]

frutas.unshift("manzana");   // añade al PRINCIPIO
console.log(frutas);       // ["manzana", "fresa"]
```

<div class="array-demo">
<p class="array-demo__label">Demo interactiva</p>
<div class="array-demo__viz" id="demo-shiftunshift-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-shiftunshift-shift">shift()</button>
<button class="array-demo__btn" id="demo-shiftunshift-unshift">unshift("manzana")</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-shiftunshift-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-shiftunshift-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-shiftunshift-viz");
    if (!viz) return;
    var log = document.getElementById("demo-shiftunshift-log");
    var original = ["plátano", "fresa"];
    var frutas = original.slice();

    function render() { ArrayDemo.renderViz(viz, frutas); }

    document.getElementById("demo-shiftunshift-shift").addEventListener("click", function () {
        if (frutas.length === 0) { ArrayDemo.log(log, "shift() → array vacío, nada que quitar"); return; }
        var quitada = frutas.shift();
        render();
        ArrayDemo.log(log, 'shift() → devuelve "' + quitada + '"');
    });

    document.getElementById("demo-shiftunshift-unshift").addEventListener("click", function () {
        var nuevoLargo = frutas.unshift("manzana");
        render();
        ArrayDemo.log(log, 'unshift("manzana") → largo nuevo = ' + nuevoLargo);
    });

    document.getElementById("demo-shiftunshift-reset").addEventListener("click", function () {
        frutas = original.slice();
        render();
        ArrayDemo.clearLog(log);
    });

    render();
});
</script>

!!! tip "Regla mnemotécnica"
    `push`/`pop` trabajan en el **final** (piensa en apilar platos). `shift`/`unshift` trabajan en el **principio** (piensa en correr la fila hacia un lado).

!!! danger "Los 4 MUTAN el array original"
    A diferencia de `map`/`filter`/`reduce`, estos cuatro métodos modifican el array original directamente — no devuelven uno nuevo. Si necesitas conservar el original, trabaja sobre una copia (`[...array]`) antes de usarlos.

---

## `slice` {: .topic-title }

Devuelve una **copia** de una porción del array, sin tocar el original. Te sirve cuando necesitas leer un pedazo del array sin efectos secundarios.

```js
const numeros = [1, 2, 3, 4, 5];

const copia = numeros.slice(1, 3);   // desde índice 1, HASTA (sin incluir) índice 3
console.log(copia);      // [2, 3]
console.log(numeros);    // [1, 2, 3, 4, 5] — el original NO cambió
```

| Argumento | Qué es |
|---|---|
| `slice()` (sin argumentos) | Copia el array completo |
| `slice(2)` | Desde el índice 2 hasta el final |
| `slice(1, 3)` | Desde el índice 1 hasta el 3 (sin incluirlo) |
| `slice(-2)` | Los últimos 2 elementos |

<div class="array-demo">
<p class="array-demo__label">Array original</p>
<div class="array-demo__viz" id="demo-slice-viz"></div>
<p class="array-demo__label">Copia de <code>slice(1, 3)</code></p>
<div class="array-demo__viz" id="demo-slice-copia"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-slice-run">slice(1, 3)</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-slice-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-slice-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-slice-viz");
    if (!viz) return;
    var copiaViz = document.getElementById("demo-slice-copia");
    var log = document.getElementById("demo-slice-log");
    var numeros = [1, 2, 3, 4, 5];

    function render() {
        ArrayDemo.renderViz(viz, numeros);
        ArrayDemo.renderViz(copiaViz, []);
    }

    document.getElementById("demo-slice-run").addEventListener("click", function () {
        var copia = numeros.slice(1, 3);
        ArrayDemo.renderViz(copiaViz, copia);
        ArrayDemo.log(log, "slice(1, 3) → copia nueva, el original no cambia");
    });

    document.getElementById("demo-slice-reset").addEventListener("click", function () {
        render();
        ArrayDemo.clearLog(log);
    });

    render();
});
</script>

---

## `splice` {: .topic-title }

Cambia el contenido del array **en el lugar**: borra, inserta o reemplaza elementos. Te sirve cuando necesitas editar el array original en un punto concreto.

```js
const numeros = [1, 2, 3, 4, 5];

// splice(inicio, cuántos borrar, ...qué insertar)
numeros.splice(1, 2);            // borra 2 elementos desde el índice 1
console.log(numeros);            // [1, 4, 5] — MUTÓ el original

const letras = ["a", "b", "e"];
letras.splice(2, 0, "c", "d");   // en el índice 2, borra 0, inserta "c" y "d"
console.log(letras);             // ["a", "b", "c", "d", "e"]
```

<div class="array-demo">
<p class="array-demo__label">Demo interactiva</p>
<div class="array-demo__viz" id="demo-splice-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-splice-run">splice(1, 2)</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-splice-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-splice-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-splice-viz");
    if (!viz) return;
    var log = document.getElementById("demo-splice-log");
    var original = [1, 2, 3, 4, 5];
    var numeros = original.slice();

    function render() { ArrayDemo.renderViz(viz, numeros); }

    document.getElementById("demo-splice-run").addEventListener("click", function () {
        numeros.splice(1, 2);
        render();
        ArrayDemo.log(log, "splice(1, 2) → MUTÓ el original de verdad");
    });

    document.getElementById("demo-splice-reset").addEventListener("click", function () {
        numeros = original.slice();
        render();
        ArrayDemo.clearLog(log);
    });

    render();
});
</script>

!!! danger "slice vs splice — el nombre parecido es la trampa"
    | | `slice` | `splice` |
    |---|---|---|
    | ¿Muta el original? | ❌ No — devuelve una copia | ✅ Sí — modifica el array en el lugar |
    | ¿Para qué sirve? | "Dame una porción, sin tocar nada" | "Inserta/borra/reemplaza aquí mismo" |
    | Argumentos | `slice(inicio, fin)` | `splice(inicio, cantidadABorrar, ...nuevosElementos)` |

    Si tu objetivo es **leer** una parte del array sin efectos secundarios, es `slice`. Si tu objetivo es **editar** el array original en un punto concreto, es `splice`. Confundirlos es de los errores más comunes con arrays — cuando dudes, pregúntate: *¿necesito que el original cambie, o solo necesito un pedazo de él?*

---

## `concat()` vs spread {: .topic-title }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/concat.mp4"></video>
</div>

Ambos combinan arrays en uno **nuevo**, sin mutar los originales. `concat()` es el método clásico; el spread (`...`) es la forma moderna y más flexible.

```js
const numeros = [1, 2, 3];
const numeros2 = [4, 5];

const todos1 = numeros.concat(numeros2);   // [1, 2, 3, 4, 5]
const todos2 = [...numeros, ...numeros2];  // [1, 2, 3, 4, 5] — mismo resultado
```

Ambos crean un array **nuevo**, sin mutar los originales. El spread (`...`) es la forma más usada en código moderno — además de combinar, te sirve para copiar un array (`[...numeros]`) o insertar elementos sueltos en el medio (`[...numeros, "extra", ...numeros2]`), algo que `concat()` no permite tan directo.

<div class="array-demo">
<p class="array-demo__label">numeros</p>
<div class="array-demo__viz" id="demo-concat-a"></div>
<p class="array-demo__label">numeros2</p>
<div class="array-demo__viz" id="demo-concat-b"></div>
<p class="array-demo__label">Resultado (vacío hasta que combines)</p>
<div class="array-demo__viz" id="demo-concat-resultado"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-concat-concat">numeros.concat(numeros2)</button>
<button class="array-demo__btn" id="demo-concat-spread">[...numeros, "extra", ...numeros2]</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-concat-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-concat-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var vizA = document.getElementById("demo-concat-a");
    if (!vizA) return;
    var vizB = document.getElementById("demo-concat-b");
    var vizResultado = document.getElementById("demo-concat-resultado");
    var log = document.getElementById("demo-concat-log");
    var numeros = [1, 2, 3];
    var numeros2 = [4, 5];

    function render() {
        ArrayDemo.renderViz(vizA, numeros);
        ArrayDemo.renderViz(vizB, numeros2);
        ArrayDemo.renderViz(vizResultado, []);
    }

    document.getElementById("demo-concat-concat").addEventListener("click", function () {
        var resultado = numeros.concat(numeros2);
        ArrayDemo.renderViz(vizResultado, resultado);
        ArrayDemo.log(log, "concat() → array nuevo, ninguno de los originales cambió");
    });

    document.getElementById("demo-concat-spread").addEventListener("click", function () {
        var resultado = [].concat(numeros, ["extra"], numeros2);
        ArrayDemo.renderViz(vizResultado, resultado);
        ArrayDemo.log(log, 'spread → mismo resultado, y puedes insertar "extra" en el medio');
    });

    document.getElementById("demo-concat-reset").addEventListener("click", function () {
        render();
        ArrayDemo.clearLog(log);
    });

    render();
});
</script>

---

## `join` {: .topic-title }

Convierte el array en un **string**, uniendo sus elementos con el separador que le pases. Es el inverso de `split()`.

```js
const palabras = ["Hola", "mundo", "desde", "JS"];

palabras.join(" ");    // "Hola mundo desde JS"
palabras.join(", ");   // "Hola, mundo, desde, JS"
palabras.join("");     // "HolamundodesdeJS"
palabras.join();       // "Hola,mundo,desde,JS" — sin separador, usa coma por defecto
```

<div class="array-demo">
<p class="array-demo__label">palabras</p>
<div class="array-demo__viz" id="demo-join-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-join-space">join(" ")</button>
<button class="array-demo__btn" id="demo-join-comma">join(", ")</button>
<button class="array-demo__btn" id="demo-join-empty">join("")</button>
<button class="array-demo__btn" id="demo-join-default">join()</button>
</div>
<div class="array-demo__log" id="demo-join-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-join-viz");
    if (!viz) return;
    var log = document.getElementById("demo-join-log");
    var palabras = ["Hola", "mundo", "desde", "JS"];
    ArrayDemo.renderViz(viz, palabras);

    function bind(id, sep, label) {
        document.getElementById(id).addEventListener("click", function () {
            var resultado = sep === undefined ? palabras.join() : palabras.join(sep);
            ArrayDemo.log(log, label + ' → "' + resultado + '"');
        });
    }

    bind("demo-join-space", " ", 'join(" ")');
    bind("demo-join-comma", ", ", 'join(", ")');
    bind("demo-join-empty", "", 'join("")');
    bind("demo-join-default", undefined, "join()");
});
</script>

!!! info "join es el inverso de split"
    `"a,b,c".split(",")` parte un string en array. `["a","b","c"].join(",")` hace exactamente lo contrario: junta un array en un string. Es el mismo patrón que ya usas para invertir strings: `str.split("").reverse().join("")`.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `slice` cuando solo necesitas leer una porción | Confundir `slice` con `splice` — uno muta, el otro no |
| `splice` cuando de verdad necesitas editar el original en el lugar | Usar `splice` cuando en realidad querías una copia |
| Spread (`...`) para copiar o combinar sin mutar | Mutar el array original de un `push`/`splice` si otra parte del código todavía lo necesita intacto |
| Guardar el valor devuelto por `pop`/`shift` si lo vas a usar | Olvidar que `push`/`pop`/`shift`/`unshift` mutan el original |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Array.prototype.push()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/push |
| 📘 **MDN — Array.prototype.slice()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/slice |
| 📘 **MDN — Array.prototype.splice()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/splice |
| 📘 **MDN — Array.prototype.join()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/join |
| 📖 **aprendejavascript.dev — Métodos** | https://www.aprendejavascript.dev/clase/arrays/metodos |
