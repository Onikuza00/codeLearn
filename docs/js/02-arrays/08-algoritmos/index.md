# Algoritmos con arrays { .bloque-js }

> Todo lo anterior fue "qué método usar". Esto es un nivel más abajo: **cómo funcionan por dentro** algunos de esos métodos, y por qué una búsqueda puede tardar 1 paso o 1000 según cómo la escribas.

---

## Encontrar el máximo — O(n) {: .topic-title }

```js
function encontrarMaximo(numeros) {
    let maximo = numeros[0];
    for (let i = 1; i < numeros.length; i++) {
        if (numeros[i] > maximo) {
            maximo = numeros[i];
        }
    }
    return maximo;
}
```

No hay atajo: para saber cuál es el mayor, tienes que **mirar cada elemento al menos una vez**. Por eso este algoritmo hace exactamente `n` comparaciones para un array de `n` elementos — se dice que tiene complejidad **O(n)**: el trabajo crece al mismo ritmo que el tamaño del array.

<div class="array-demo">
<p class="array-demo__label">numeros</p>
<div class="array-demo__viz" id="demo-maximo-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-maximo-run">encontrarMaximo()</button>
</div>
<div class="array-demo__log" id="demo-maximo-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-maximo-viz");
    if (!viz) return;
    var log = document.getElementById("demo-maximo-log");
    var numeros = [8, 34, 2, 91, 15, 47, 3];
    ArrayDemo.renderViz(viz, numeros);

    document.getElementById("demo-maximo-run").addEventListener("click", function () {
        var maximo = numeros[0];
        var pasos = 0;
        for (var i = 1; i < numeros.length; i++) {
            pasos++;
            if (numeros[i] > maximo) maximo = numeros[i];
        }
        ArrayDemo.log(log, "máximo = " + maximo + "  |  " + pasos + " comparaciones para " + numeros.length + " elementos");
    });
});
</script>

---

## Búsqueda lineal — O(n) {: .topic-title }

Recorre el array de principio a fin, comparando uno por uno, hasta encontrar lo que busca (o llegar al final):

```js
function busquedaLineal(array, elemento) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === elemento) return i;
    }
    return -1;
}
```

Es exactamente lo que hace `indexOf`/`find` por dentro. En el peor caso (el elemento está al final, o no está), revisa **los `n` elementos**.

---

## Búsqueda binaria — O(log n) {: .topic-title }

Si el array ya está **ordenado**, no hace falta mirar uno por uno: mira el elemento del medio, y descarta la mitad del array en cada paso.

```js
function busquedaBinaria(array, elemento) {
    let inicio = 0;
    let fin = array.length - 1;

    while (inicio <= fin) {
        const mitad = Math.floor((inicio + fin) / 2);

        if (array[mitad] === elemento) {
            return mitad;
        } else if (array[mitad] < elemento) {
            inicio = mitad + 1;   // descarta la mitad izquierda
        } else {
            fin = mitad - 1;      // descarta la mitad derecha
        }
    }

    return -1;
}
```

!!! danger "Requiere el array ORDENADO — si no, da resultados incorrectos"
    La búsqueda binaria decide qué mitad descartar comparando contra el elemento del medio. Esa lógica solo es válida si el array ya está ordenado — en un array desordenado puede descartar la mitad que sí contenía lo que buscabas, y devolver `-1` aunque el elemento esté ahí.

<div class="array-demo">
<p class="array-demo__label">array ordenado</p>
<div class="array-demo__viz" id="demo-busqueda-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-busqueda-lineal">Buscar 47 — lineal</button>
<button class="array-demo__btn" id="demo-busqueda-binaria">Buscar 47 — binaria</button>
</div>
<div class="array-demo__log" id="demo-busqueda-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-busqueda-viz");
    if (!viz) return;
    var log = document.getElementById("demo-busqueda-log");
    var array = [2, 5, 9, 13, 18, 24, 31, 38, 47, 55, 62, 70, 78, 85, 93];
    ArrayDemo.renderViz(viz, array);

    document.getElementById("demo-busqueda-lineal").addEventListener("click", function () {
        var pasos = 0, resultado = -1;
        for (var i = 0; i < array.length; i++) {
            pasos++;
            if (array[i] === 47) { resultado = i; break; }
        }
        ArrayDemo.log(log, "lineal → índice " + resultado + "  |  " + pasos + " pasos (revisó uno por uno)");
    });

    document.getElementById("demo-busqueda-binaria").addEventListener("click", function () {
        var inicio = 0, fin = array.length - 1, pasos = 0, resultado = -1;
        while (inicio <= fin) {
            pasos++;
            var mitad = Math.floor((inicio + fin) / 2);
            if (array[mitad] === 47) { resultado = mitad; break; }
            else if (array[mitad] < 47) inicio = mitad + 1;
            else fin = mitad - 1;
        }
        ArrayDemo.log(log, "binaria → índice " + resultado + "  |  " + pasos + " pasos (descartó mitades)");
    });
});
</script>

!!! tip "Con 15 elementos casi no se nota — con 1 millón, sí"
    En el demo, la diferencia es de pocos pasos. Pero O(n) vs O(log n) se nota en la escala: con 1.000.000 de elementos, la búsqueda lineal puede tardar hasta 1.000.000 de pasos en el peor caso; la binaria, como mucho unos 20 (log₂ de 1.000.000 ≈ 20). Duplicar el tamaño del array casi no cambia el trabajo de la búsqueda binaria — sí duplica el de la lineal.

---

## Guía de decisión {: .topic-title }

| Situación | Usa |
|---|---|
| Array desordenado, buscas una vez | Búsqueda lineal (`indexOf`/`find`) — ordenar primero no compensa |
| Array ya ordenado, vas a buscar muchas veces | Búsqueda binaria |
| Necesitas el mayor o menor valor | Recorrido completo — no hay atajo, es O(n) siempre |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Notación Big O (glosario)** | https://developer.mozilla.org/es/docs/Glossary/Big_O_notation |
| 📖 **aprendejavascript.dev — Algoritmos con Arrays** | https://www.aprendejavascript.dev/clase/arrays/algoritmos |
