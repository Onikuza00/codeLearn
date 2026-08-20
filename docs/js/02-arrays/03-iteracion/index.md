# Iteración de arrays { .bloque-js }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/array-while-for.mp4"></video>
</div>

> Recorrer un array significa visitar cada uno de sus elementos, uno por uno. Ya viste las 4 formas de hacerlo por separado — aquí las comparas lado a lado para saber cuál elegir en cada caso.

---

## Las 4 formas de recorrer un array {: .topic-title }

```js
const frutas = ["manzana", "pera", "uva"];

// 1. while — con índice manual
let i = 0;
while (i < frutas.length) {
    console.log(frutas[i]);
    i++;
}

// 2. for — con índice, más compacto
for (let i = 0; i < frutas.length; i++) {
    console.log(frutas[i]);
}

// 3. for...of — sin índice, valor directo
for (const fruta of frutas) {
    console.log(fruta);
}

// 4. forEach — método del array
frutas.forEach(fruta => console.log(fruta));
```

Las 4 imprimen exactamente lo mismo (`manzana`, `pera`, `uva`) — la diferencia está en **qué control te dan**, no en el resultado.

<div class="array-demo">
<p class="array-demo__label">frutas</p>
<div class="array-demo__viz" id="demo-iter-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-iter-while">while</button>
<button class="array-demo__btn" id="demo-iter-for">for</button>
<button class="array-demo__btn" id="demo-iter-forof">for...of</button>
<button class="array-demo__btn" id="demo-iter-foreach">forEach</button>
</div>
<div class="array-demo__log" id="demo-iter-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-iter-viz");
    if (!viz) return;
    var log = document.getElementById("demo-iter-log");
    var frutas = ["manzana", "pera", "uva"];
    ArrayDemo.renderViz(viz, frutas);

    function correr(nombre, recorrido) {
        ArrayDemo.clearLog(log);
        var visitado = [];
        recorrido(visitado);
        ArrayDemo.log(log, nombre + " → orden de visita: " + visitado.join(" → "));
    }

    document.getElementById("demo-iter-while").addEventListener("click", function () {
        correr("while", function (visitado) {
            var i = 0;
            while (i < frutas.length) { visitado.push(frutas[i]); i++; }
        });
    });

    document.getElementById("demo-iter-for").addEventListener("click", function () {
        correr("for", function (visitado) {
            for (var i = 0; i < frutas.length; i++) { visitado.push(frutas[i]); }
        });
    });

    document.getElementById("demo-iter-forof").addEventListener("click", function () {
        correr("for...of", function (visitado) {
            for (var fruta of frutas) { visitado.push(fruta); }
        });
    });

    document.getElementById("demo-iter-foreach").addEventListener("click", function () {
        correr("forEach", function (visitado) {
            frutas.forEach(function (fruta) { visitado.push(fruta); });
        });
    });
});
</script>

!!! tip "Prueba cortar el recorrido"
    Si `for`/`for...of` tuvieran un `break` en el medio, el log mostraría MENOS elementos que los 3 totales. Con `forEach` eso es imposible — siempre visita los 3, no hay forma de cortarlo desde adentro.

!!! danger "forEach no devuelve nada — no lo asignes a una variable"
    ```js
    const resultado = frutas.forEach(fruta => fruta.toUpperCase());
    console.log(resultado);   // undefined — SIEMPRE, sin importar qué haga el callback
    ```
    Es el mismo gotcha que ya viste con `map`/`filter`: si necesitas el resultado de la iteración, `forEach` es el método equivocado. Existe una forma "técnica" de cortar un `forEach` a mitad — lanzar una excepción y capturarla con `try`/`catch` — pero está explícitamente desaconsejada: usar excepciones para controlar el flujo normal de un loop es un antipatrón. Si necesitas `break`, la respuesta correcta es cambiar a `for` o `for...of`, no forzar `forEach`.

---

## Comparativa {: .topic-title }

| | `while` | `for` | `for...of` | `forEach` |
|---|:---:|:---:|:---:|:---:|
| ¿Necesita índice manual? | ✅ Sí | ✅ Sí | ❌ No | ❌ No |
| ¿Te da el índice si lo pides? | Manual | Manual | ❌ No directo | ✅ Sí (2do parámetro) |
| ¿Se puede cortar con `break`? | ✅ Sí | ✅ Sí | ✅ Sí | ❌ No |
| ¿Se puede saltar con `continue`? | ✅ Sí | ✅ Sí | ✅ Sí | ❌ No |
| Recorrer en reversa | ✅ Fácil | ✅ Fácil | ❌ No directo | ❌ No |

`forEach` sí te da el índice y el array completo si los pides como parámetros extra del callback:

```js
frutas.forEach((fruta, indice, arrayCompleto) => {
    console.log(indice, fruta);
});
// 0 manzana
// 1 pera
// 2 uva
```

---

## Guía de decisión {: .topic-title }

| Necesitas... | Usa |
|---|---|
| Cortar el recorrido a mitad (`break`) o saltar elementos (`continue`) | `for` o `for...of` |
| Recorrer en reversa, o con saltos (de 2 en 2) | `for` clásico |
| El caso más simple: "hacé esto con cada elemento" | `for...of` o `.forEach()` |
| El índice junto con el valor, sin declarar variable aparte | `.forEach((valor, indice) => ...)` |
| **Transformar** el array en uno nuevo mientras lo recorres | Ni estos — usa [`map`/`filter`/`reduce`](../04-transformacion/index.md) |

!!! info "¿Por qué existen tantas formas de hacer lo mismo?"
    JavaScript fue agregando formas más cómodas con el tiempo: `while`/`for` son las más viejas y las más flexibles (control total del índice). `for...of` llegó después para el caso común de "solo quiero el valor". `forEach` es un método de array, pensado para callbacks cortos al estilo funcional. Ninguna reemplazó a las anteriores — cada una es mejor para un caso distinto, por eso siguen conviviendo todas.

!!! warning "Ya viste while/for/do-while en detalle"
    La mecánica de cada bucle (condición, actualización, scope) está cubierta en [Estructuras de control](../../01-basico/03-estructuras-control/index.md). Aquí el foco es específicamente **cuál conviene para recorrer un array**, no cómo funciona cada uno por dentro.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — for...of** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...of |
| 📘 **MDN — Array.prototype.forEach()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach |
| 📖 **aprendejavascript.dev — Iteración y recorrido** | https://www.aprendejavascript.dev/clase/arrays/iteracion |
