# Matrices { .bloque-js }

> Una matriz es un **array de arrays** — elementos organizados en filas y columnas. No es un tipo nuevo de JavaScript, es el mismo array de siempre, anidado un nivel más.

---

## Crear y acceder {: .topic-title }

```js
const matriz = [
    [1, 2, 3],
    [4, 5, 6],
];

matriz[1][2];   // 6 — primer índice: fila. Segundo índice: columna.
```

Las matrices **no tienen que ser cuadradas** — cada fila puede tener un largo distinto.

<div class="array-demo">
<p class="array-demo__label">matriz[1]</p>
<div class="array-demo__viz" id="demo-matriz-fila"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-matriz-acceso">matriz[1][2]</button>
</div>
<div class="array-demo__log" id="demo-matriz-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-matriz-fila");
    if (!viz) return;
    var log = document.getElementById("demo-matriz-log");
    var matriz = [[1, 2, 3], [4, 5, 6]];
    ArrayDemo.renderViz(viz, matriz[1]);

    document.getElementById("demo-matriz-acceso").addEventListener("click", function () {
        ArrayDemo.log(log, "matriz[1][2] → " + matriz[1][2]);
    });
});
</script>

!!! danger "new Array(3).fill([]) no crea 3 arrays independientes"
    ```js
    const matriz = new Array(3).fill([]);
    matriz[0].push("x");
    console.log(matriz);   // [["x"], ["x"], ["x"]] ← las 3 filas cambiaron
    ```
    `fill([])` copia la **misma referencia** al array vacío en las 3 posiciones — no crea 3 arrays distintos, apunta 3 veces al mismo. Para crear una matriz vacía de verdad, usa `Array.from`, que ejecuta la función una vez POR posición:
    ```js
    const matriz = Array.from({ length: 3 }, () => []);
    matriz[0].push("x");
    console.log(matriz);   // [["x"], [], []] ← solo cambió la fila 0
    ```

---

## Recorrer una matriz {: .topic-title }

Necesitas **dos bucles anidados**: uno para las filas, otro para las columnas de cada fila.

```js
// Con for clásico
for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
        console.log(matriz[i][j]);
    }
}

// Con forEach anidado
matriz.forEach((fila, filaIndex) => {
    fila.forEach((elemento, columnaIndex) => {
        console.log(`[${filaIndex}][${columnaIndex}] = ${elemento}`);
    });
});
```

---

## Ejemplo: 3 en raya {: .topic-title }

Un tablero de 3 en raya es una matriz 3×3. Comprobar quién ganó significa revisar filas, columnas y las 2 diagonales:

```js
const tablero = [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["O", "O", "X"],
];

// Filas
for (let i = 0; i < 3; i++) {
    if (tablero[i][0] === tablero[i][1] && tablero[i][1] === tablero[i][2]) {
        console.log(`Gana ${tablero[i][0]} — fila ${i}`);
    }
}

// Columnas
for (let i = 0; i < 3; i++) {
    if (tablero[0][i] === tablero[1][i] && tablero[1][i] === tablero[2][i]) {
        console.log(`Gana ${tablero[0][i]} — columna ${i}`);
    }
}

// Diagonal ↘
if (tablero[0][0] === tablero[1][1] && tablero[1][1] === tablero[2][2]) {
    console.log(`Gana ${tablero[0][0]} — diagonal ↘`);
}

// Diagonal ↙
if (tablero[0][2] === tablero[1][1] && tablero[1][1] === tablero[2][0]) {
    console.log(`Gana ${tablero[0][2]} — diagonal ↙`);
}
```

<div class="array-demo">
<p class="array-demo__label">Tablero (haz clic en una casilla para cambiarla)</p>
<div class="array-demo__viz" id="demo-tictactoe-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-tictactoe-check">Comprobar ganador</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-tictactoe-reset">Reset</button>
</div>
<div class="array-demo__log" id="demo-tictactoe-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-tictactoe-viz");
    if (!viz) return;
    var log = document.getElementById("demo-tictactoe-log");
    var valores = ["X", "O", ""];
    var original = [["X", "O", "X"], ["O", "X", "O"], ["O", "O", "X"]];
    var tablero = original.map(function (fila) { return fila.slice(); });

    function render() {
        viz.innerHTML = "";
        viz.style.display = "grid";
        viz.style.gridTemplateColumns = "repeat(3, 2.6rem)";
        viz.style.gap = "0.3rem";
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                (function (fila, col) {
                    var casilla = document.createElement("button");
                    casilla.className = "array-demo__item";
                    casilla.style.cursor = "pointer";
                    casilla.style.border = "none";
                    casilla.textContent = tablero[fila][col] || "·";
                    casilla.addEventListener("click", function () {
                        var actual = tablero[fila][col];
                        var idx = (valores.indexOf(actual) + 1) % valores.length;
                        tablero[fila][col] = valores[idx];
                        render();
                    });
                    viz.appendChild(casilla);
                })(i, j);
            }
        }
    }

    document.getElementById("demo-tictactoe-check").addEventListener("click", function () {
        var ganador = null;
        var detalle = "";
        for (var i = 0; i < 3 && !ganador; i++) {
            if (tablero[i][0] && tablero[i][0] === tablero[i][1] && tablero[i][1] === tablero[i][2]) {
                ganador = tablero[i][0]; detalle = "fila " + i;
            }
        }
        for (var j = 0; j < 3 && !ganador; j++) {
            if (tablero[0][j] && tablero[0][j] === tablero[1][j] && tablero[1][j] === tablero[2][j]) {
                ganador = tablero[0][j]; detalle = "columna " + j;
            }
        }
        if (!ganador && tablero[0][0] && tablero[0][0] === tablero[1][1] && tablero[1][1] === tablero[2][2]) {
            ganador = tablero[0][0]; detalle = "diagonal ↘";
        }
        if (!ganador && tablero[0][2] && tablero[0][2] === tablero[1][1] && tablero[1][1] === tablero[2][0]) {
            ganador = tablero[0][2]; detalle = "diagonal ↙";
        }
        ArrayDemo.log(log, ganador ? ("Gana " + ganador + " — " + detalle) : "Nadie gana todavía");
    });

    document.getElementById("demo-tictactoe-reset").addEventListener("click", function () {
        tablero = original.map(function (fila) { return fila.slice(); });
        render();
        ArrayDemo.clearLog(log);
    });

    render();
});
</script>

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `Array.from({ length: n }, () => [])` para crear filas independientes | `new Array(n).fill([])` — todas las filas apuntan al mismo array |
| Dos bucles anidados, uno por dimensión | Intentar recorrer una matriz con un solo `for` |
| `matriz[fila][columna]` en ese orden, siempre | Invertir el orden de los índices sin darte cuenta |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Arrays multidimensionales** | https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Indexed_collections#arrays_multidimensionales |
| 📘 **MDN — Array.from()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/from |
| 📖 **aprendejavascript.dev — Matrices con Arrays** | https://www.aprendejavascript.dev/clase/arrays/matrices |
