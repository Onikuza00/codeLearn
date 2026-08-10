# Fundamentos de los Arrays { .section-arrays .bloque-js }

> Un array es una colección **ordenada** de valores — el contenedor que vas a usar constantemente para agrupar datos: números, strings, objetos, incluso otros arrays.

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/array-que-son.mp4"></video>
</div>

---

## ¿Qué es un array? {: .topic-title }

Se declara con corchetes `[ ]`, con los elementos separados por comas:

```js
[1, 2, 3, 4, 5]
```

```js
const numeros = [1, 2, 3, 4, 5];
let nombres = ["Dani", "Miguel", "Maria"];
```

Un array puede contener **cualquier tipo de dato**, incluso mezclado o anidado:

```js
const anidado = [1, 2, 3, [4, 5, 6]];         // un array dentro de otro array
const mixto = ["uno", 2, true, null];         // mezcla de tipos
```

!!! warning "Mezclar tipos funciona, pero evítalo salvo que tenga sentido"
    Que JavaScript lo permita no significa que sea buena idea. Un array pensado para guardar un solo tipo de dato (todos números, todos objetos con la misma forma) es mucho más fácil de recorrer y predecir que uno con tipos mezclados sin motivo.

---

## Acceso por índice {: .topic-title }

Los índices empiezan en **0**, no en 1:

```js
const numeros = [1, 2, 3, 4, 5];

numeros[0];    // 1 — el primero
numeros[2];    // 3 — el tercero
numeros[10];   // undefined — no existe esa posición, y NO da error
```

También puedes acceder con una variable como índice:

```js
let indice = 2;
numeros[indice];   // 3
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-array-indice"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-array-indice");
    if (!el) return;
    var numeros = [1, 2, 3, 4, 5];
    var lineas = [
        'numeros[0]  → ' + numeros[0],
        'numeros[2]  → ' + numeros[2],
        'numeros[10] → ' + numeros[10]
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

---

## Modificar elementos {: .topic-title }

```js
const numeros = [1, 2, 3, 4, 5];

numeros[0] = 10;
numeros[2] = 30;

console.log(numeros);   // [10, 2, 30, 4, 5]
```

!!! danger "const NO bloquea el contenido del array — solo bloquea la reasignación de la variable"
    ```js
    const numeros = [1, 2, 3];

    numeros[0] = 99;        // ✅ funciona — modificaste el CONTENIDO
    console.log(numeros);   // [99, 2, 3]

    numeros = [4, 5, 6];    // ❌ TypeError — intentaste REASIGNAR la variable entera
    ```
    `const` congela **la variable** (no puede volver a apuntar a otro array), no el array en sí. Es la misma idea que viste en [Variables y tipos de datos](../01-basico/01-variables-tipos/index.md) con los objetos: `const` es superficial, no profundo. Vas a usar `const` en casi todos tus arrays — casi nunca necesitas reasignar el array entero, solo modificar lo que hay dentro.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [Métodos básicos](02-metodos-basicos/index.md) | `push`/`pop`/`shift`/`unshift`, `slice`/`splice`, spread |
| [Iteración](03-iteracion/index.md) | `while`/`for`/`for...of`/`forEach` comparados |
| [Transformación](04-transformacion/index.md) | `forEach`, `map`, `filter`, `reduce` |
| [Buscar](05-buscar/index.md) | `indexOf`, `includes`, `some`, `every`, `find`, `findIndex` |
| [Ordenar](06-ordenar/index.md) | `sort()`, comparador, inmutabilidad |
| [Matrices](07-matrices/index.md) | Arrays de arrays, 3 en raya |
| [Algoritmos](08-algoritmos/index.md) | Búsqueda lineal/binaria, O(n) vs O(log n) |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Array** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array |
| 📖 **aprendejavascript.dev — Arrays, ¿qué son?** | https://www.aprendejavascript.dev/clase/arrays/arrays-que-son |
