# Transformación: forEach, map, filter y reduce { .bloque-js }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/Z34BF9PCfYg" title="Curso completo de JavaScript — midudev" loading="lazy" allowfullscreen></iframe>
</div>

## `forEach` — ejecuta código por cada elemento, no devuelve nada {: .method-title .method-foreach }

### Qué es

Ejecuta tu callback por cada elemento. **Devuelve `undefined`** — no produce un resultado nuevo.

### Sintaxis

```js
array.forEach(function (elemento) {
  // haces algo con elemento, sin return
});
```

### Cómo funciona (trace)

```js
let numeros = [2, 4, 6];
numeros.forEach(n => console.log(n));
// 2   ← primer elemento
// 4   ← segundo
// 6   ← tercero
```

El método recorre `[2, 4, 6]` y llama a tu función 3 veces: `(2)`, `(4)`, `(6)`.

<div class="array-demo">
<p class="array-demo__label">numeros</p>
<div class="array-demo__viz" id="demo-foreach-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-foreach-run">forEach(n =&gt; dobles.push(n * 2))</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-foreach-reset">Reset</button>
</div>
<p class="array-demo__label">dobles (efecto secundario, vacío hasta que corras)</p>
<div class="array-demo__viz" id="demo-foreach-dobles"></div>
<div class="array-demo__log" id="demo-foreach-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-foreach-viz");
    if (!viz) return;
    var doblesViz = document.getElementById("demo-foreach-dobles");
    var log = document.getElementById("demo-foreach-log");
    var numeros = [1, 2, 3];
    ArrayDemo.renderViz(viz, numeros);
    ArrayDemo.renderViz(doblesViz, []);

    document.getElementById("demo-foreach-run").addEventListener("click", function () {
        var dobles = [];
        numeros.forEach(function (n) { dobles.push(n * 2); });
        ArrayDemo.renderViz(doblesViz, dobles);
        ArrayDemo.log(log, "forEach recorrió los " + numeros.length + " elementos — devolvió undefined, el array dobles se llenó como efecto secundario");
    });

    document.getElementById("demo-foreach-reset").addEventListener("click", function () {
        ArrayDemo.renderViz(doblesViz, []);
        ArrayDemo.clearLog(log);
    });
});
</script>

### Para qué se usa

Efectos secundarios: **imprimir, acumular en una variable externa, mutar otro array**:

```js
let numeros = [1, 2, 3];
let dobles = [];

numeros.forEach(n => {
  dobles.push(n * 2);   // efecto secundario: llenar otro array
});
```

### Cuándo NO usarlo

- Cuando necesitas **devolver** algo → usa `map` o `filter`.
- Cuando necesitas **cortar** a mitad (como `break`) → `forEach` no se corta. Usa `for`.

---

## `map` — transforma cada elemento, mismo largo {: .method-title .method-map }

### Qué es

Recorre el array, ejecuta tu callback, y **construye un array NUEVO con lo que tu callback devuelva**.

### Reglas de oro

1. Tu callback **DEBE usar `return`** — eso es lo que entra al nuevo array.
2. El array nuevo tiene **la misma longitud** que el original (siempre 1 por 1).
3. **NO muta** el array original.

### Sintaxis

```js
let nuevo = array.map(function (elemento) {
  return transformacionDe(elemento);   // ← el return es obligatorio
});
```

### Cómo funciona (trace)

```js
let numeros = [1, 2, 3];
let dobles = numeros.map(n => n * 2);
//                 [1, 2, 3]
//          n*2 →  [2, 4, 6]
```

| Vuelta | elemento | callback | resultado parcial |
|--------|:--------:|:--------:|:-----------------:|
| 1 | `1` | `1 * 2` | `2` |
| 2 | `2` | `2 * 2` | `4` |
| 3 | `3` | `3 * 2` | `6` |

`map` junta los 3 resultados en un array nuevo: `[2, 4, 6]`. El original `[1,2,3]` sigue intacto.

<div class="array-demo">
<p class="array-demo__label">numeros</p>
<div class="array-demo__viz" id="demo-map-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-map-run">map(n =&gt; n * 2)</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-map-reset">Reset</button>
</div>
<p class="array-demo__label">resultado (array nuevo)</p>
<div class="array-demo__viz" id="demo-map-resultado"></div>
<div class="array-demo__log" id="demo-map-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-map-viz");
    if (!viz) return;
    var resultadoViz = document.getElementById("demo-map-resultado");
    var log = document.getElementById("demo-map-log");
    var numeros = [1, 2, 3];
    ArrayDemo.renderViz(viz, numeros);
    ArrayDemo.renderViz(resultadoViz, []);

    document.getElementById("demo-map-run").addEventListener("click", function () {
        var dobles = numeros.map(function (n) { return n * 2; });
        ArrayDemo.renderViz(resultadoViz, dobles);
        ArrayDemo.renderViz(viz, numeros);
        ArrayDemo.log(log, "map() → array nuevo, misma longitud (" + dobles.length + "), el original no cambió");
    });

    document.getElementById("demo-map-reset").addEventListener("click", function () {
        ArrayDemo.renderViz(resultadoViz, []);
        ArrayDemo.clearLog(log);
    });
});
</script>

### Con objetos (muy común)

```js
let productos = [
  { nombre: "Teclado", precio: 30 },
  { nombre: "Mouse",   precio: 15 },
];

let soloPrecios = productos.map(p => p.precio);
// [30, 15]
```

Extraes un campo de cada objeto y armas un array nuevo con solo eso.

### Cuándo NO usarlo

- Para **efectos secundarios** (imprimir, mutar) → usa `forEach`. `map` sin usar el resultado que devuelve es un desperdicio.
- El nombre `map` viene de **mapear** (mapear = transformar punto a punto, como en un mapa geográfico).

---

## `filter` — se queda con lo que cumple, más corto {: .method-title .method-filter }

### Qué es

Recorre el array, ejecuta tu callback como **predicado** (pregunta de sí/no), y construye un array NUEVO con **solo los elementos que devuelvan `true`**.

### Reglas de oro

1. Tu callback devuelve `true` (queda) o `false` (se descarta).
2. La longitud del nuevo array puede cambiar (suele ser menor).
3. **NO muta** el array original.

### Sintaxis

```js
let filtrados = array.filter(function (elemento) {
  return condicion;   // true → pasa, false → se va
});
```

### Cómo funciona (trace)

```js
let numeros = [1, 2, 3, 4, 5, 6];
let pares = numeros.filter(n => n % 2 === 0);
//          [1, 2, 3, 4, 5, 6]
//    par?   ✗  ✓  ✗  ✓  ✗  ✓
//               [2, 4, 6]
```

| Elemento | `n % 2 === 0` | ¿Entra? |
|:--------:|:-------------:|:-------:|
| `1` | `false` | ❌ |
| `2` | `true` | ✅ |
| `3` | `false` | ❌ |
| `4` | `true` | ✅ |
| `6` | `true` | ✅ |

<div class="array-demo">
<p class="array-demo__label">numeros</p>
<div class="array-demo__viz" id="demo-filter-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-filter-run">filter(n =&gt; n % 2 === 0)</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-filter-reset">Reset</button>
</div>
<p class="array-demo__label">resultado (solo los pares)</p>
<div class="array-demo__viz" id="demo-filter-resultado"></div>
<div class="array-demo__log" id="demo-filter-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-filter-viz");
    if (!viz) return;
    var resultadoViz = document.getElementById("demo-filter-resultado");
    var log = document.getElementById("demo-filter-log");
    var numeros = [1, 2, 3, 4, 5, 6];
    ArrayDemo.renderViz(viz, numeros);
    ArrayDemo.renderViz(resultadoViz, []);

    document.getElementById("demo-filter-run").addEventListener("click", function () {
        var pares = numeros.filter(function (n) { return n % 2 === 0; });
        ArrayDemo.renderViz(resultadoViz, pares);
        ArrayDemo.log(log, "filter() → quedaron " + pares.length + " de " + numeros.length + ", el original no cambió");
    });

    document.getElementById("demo-filter-reset").addEventListener("click", function () {
        ArrayDemo.renderViz(resultadoViz, []);
        ArrayDemo.clearLog(log);
    });
});
</script>

### Con objetos (muy común)

```js
let productos = [
  { nombre: "Teclado", precio: 30, stock: 5 },
  { nombre: "Mouse",   precio: 15, stock: 0 },
];

let disponibles = productos.filter(p => p.stock > 0);
// [{ nombre: "Teclado", precio: 30, stock: 5 }]  ← el Mouse no tiene stock
```

### Cuándo NO usarlo

- Para **transformar** los elementos → usa `map`. `filter` solo elige, no cambia.

---

## `reduce` — reduce todo a un valor, con inicial {: .method-title .method-reduce }

### Qué es

Recorre el array y **acumula** todos los elementos en UN solo valor: una suma, un promedio, un objeto, un string. Es el método para "destilar" el array.

### Reglas de oro

1. El callback recibe **dos parámetros**: `acumulador` (el valor que se va construyendo) y `elemento` (cada item).
2. **DEBE devolver** el nuevo acumulador (con `return` si usas llaves `{ }`).
3. **El segundo argumento de `reduce` es el valor inicial** del acumulador. Siempre úsalo.
4. **NO muta** el array original.

### Sintaxis

```js
let resultado = array.reduce(function (acumulador, elemento) {
  return acumulador + elemento;   // ← devuelves el acumulador ACTUALIZADO
}, 0);                             // ← valor inicial del acumulador
```

### Cómo funciona (trace)

```js
let numeros = [10, 20, 30];
let suma = numeros.reduce((acum, n) => acum + n, 0);
```

| Vuelta | `acum` (viene de atrás) | `n` | `acum + n` | nuevo `acum` |
|--------|:---:|:---:|:---:|:---:|
| 1 | `0` (inicial) | `10` | `10` | `10` |
| 2 | `10` | `20` | `30` | `30` |
| 3 | `30` | `30` | `60` | `60` |

Al final `reduce` devuelve lo que quedó en el acumulador: `60`.

<div class="array-demo">
<p class="array-demo__label">numeros</p>
<div class="array-demo__viz" id="demo-reduce-viz"></div>
<div class="array-demo__controls">
<button class="array-demo__btn" id="demo-reduce-run">reduce((acum, n) =&gt; acum + n, 0)</button>
<button class="array-demo__btn array-demo__btn--reset" id="demo-reduce-reset">Reset</button>
</div>
<p class="array-demo__label">acumulador, vuelta a vuelta (la última arriba)</p>
<div class="array-demo__log" id="demo-reduce-log"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var viz = document.getElementById("demo-reduce-viz");
    if (!viz) return;
    var log = document.getElementById("demo-reduce-log");
    var numeros = [10, 20, 30];
    ArrayDemo.renderViz(viz, numeros);

    document.getElementById("demo-reduce-run").addEventListener("click", function () {
        ArrayDemo.clearLog(log);
        var pasos = [];
        var resultado = numeros.reduce(function (acum, n) {
            var nuevoAcum = acum + n;
            pasos.push("acum=" + acum + " + n=" + n + " → nuevo acum=" + nuevoAcum);
            return nuevoAcum;
        }, 0);
        for (var i = pasos.length - 1; i >= 0; i--) {
            ArrayDemo.log(log, pasos[i]);
        }
        ArrayDemo.log(log, "Resultado final: " + resultado);
    });

    document.getElementById("demo-reduce-reset").addEventListener("click", function () {
        ArrayDemo.clearLog(log);
    });
});
</script>

### Los dos parámetros, con nombre honesto

```js
array.reduce((acumulador, elemento) => ..., valorInicial);
//            ↑ el que acumula   ↑ el de cada vuelta
```

- `acumulador` = "lo que llevo hasta ahora" → empieza en el valor inicial y se reescribe en cada vuelta con lo que devuelvas.
- `elemento` = cada item del array, igual que en `forEach`/`map`/`filter`.

### Por qué NO es lo mismo que forEach + variable externa

```js
// forEach: el acumulador vive AFUERA
let suma = 0;
numeros.forEach(n => { suma += n; });
return suma;

// reduce: el acumulador vive DENTRO de la llamada
return numeros.reduce((acum, n) => acum + n, 0);
```

🧠 `reduce` es `forEach` + acumulador externo, pero **sin la variable global suelta**. El acumulador es parte de la operación, no un estado que mantienes tú.

### ⚠️ El valor inicial NO es opcional

```js
numeros.reduce((acum, n) => acum + n);      // ❌ sin valor inicial
```

Sin el `0`, `reduce` toma el **primer elemento como acumulador inicial** y arranca desde el segundo. Dos problemas:
- Cambia el resultado si el primer elemento no "encaja" como acumulador (ej: sumar números, pero el acumulador arranca como número → funciona por casualidad).
- **`[].reduce(...)` sin inicial truena** con `TypeError: Reduce of empty array with no initial value`. Con `0` inicial, `[]` devuelve `0`.

```js
[].reduce((acum, n) => acum + n, 0);   // ✅ → 0
[].reduce((acum, n) => acum + n);      // 💥 TypeError
```

### Con condición adentro (filtro implícito)

El acumulador no tiene que ser una suma simple: puedes decidir **si sumas o no** dentro del callback — es el mismo patrón de `if` dentro del loop que ya usaste en `promedioAprobados`:

```js
let items = [
  { nombre: "Manzana", precio: 2, tipo: "perecedero" },
  { nombre: "Arroz",   precio: 5, tipo: "seco" },
];

let total = items.reduce((acum, item) => {
  if (item.tipo === "perecedero") acum += item.precio;
  return acum;   // ← SIEMPRE devuelves el acumulador, cambie o no
}, 0);
// → 2
```

🧠 **Ojo:** el `return acum` va SIEMPRE, incluso cuando no entras al `if`. Si lo pones solo adentro del `if`, en las vueltas que no cumple devuelves `undefined` y el acumulador se rompe.

### ⚠️ "Acumular" no es sinónimo de "sumar"

El error mental más común con `reduce`: pensar que el acumulador solo sirve para ir **sumando/agregando** cosas (un número que crece, un objeto que se llena, un array que se agranda). Pero el acumulador también puede usarse para **comparar y quedarte con uno solo** — nada se suma ni se agrega, en cada vuelta decidís "¿me quedo con lo que traía o con el actual?".

```js
let jugadores = [
  { nombre: "ana",   puntos: 15 },
  { nombre: "bruno", puntos: 22 },
  { nombre: "carla", puntos: 8  },
];

let ganador = jugadores.reduce((mejor, actual) =>
  actual.puntos > mejor.puntos ? actual : mejor
);
// { nombre: "bruno", puntos: 22 }
```

| Vuelta | `mejor` (acumulador) | `actual` | ¿Gana `actual`? | nuevo `mejor` |
|--------|:---:|:---:|:---:|:---:|
| — | (arranca en `jugadores[0]`, sin inicial) | | | `{ana, 15}` |
| 1 | `{ana, 15}` | `{bruno, 22}` | `22 > 15` → sí | `{bruno, 22}` |
| 2 | `{bruno, 22}` | `{carla, 8}` | `8 > 22` → no | `{bruno, 22}` |

🧠 Fijate que **no hay valor inicial** (`, 0` o `, {}`) — acá no tiene sentido inventar uno: el primer elemento real YA es un candidato válido a "mejor hasta ahora". Cuando omitís el inicial, `reduce` usa `jugadores[0]` como arranque y compara desde el segundo. Mismo gotcha de siempre: sin inicial, **truena en array vacío** — si tu array puede estar vacío, chequealo ANTES de llamar `reduce` (`if (jugadores.length === 0) return null;`).

**Regla general:** el acumulador es "lo que llevás construyendo hasta ahora" — construir puede ser sumar, agregar a un objeto/array, **o elegir uno entre dos**. Las tres son la misma mecánica de `reduce`, solo cambia qué hacés con `acum` y `actual` dentro del callback.

### Cuándo NO usarlo

- Para **transformar todos los elementos** (mismo largo) → `map`.
- Para **elegir algunos** → `filter`.
- `reduce` es para cuando el resultado es **UN solo valor** que se construye recorriendo todo.

---

## ⚖️ Tabla comparativa

| | `forEach` | `map` | `filter` | `reduce` |
|---|:---:|:---:|:---:|:---:|
| **¿Qué hace?** | Ejecuta código por cada elemento | Transforma cada elemento | Elige algunos elementos | Acumula todo en un valor |
| **¿Devuelve?** | `undefined` | Array nuevo (misma longitud) | Array nuevo (longitud variable) | El valor final acumulado |
| **¿Muta el original?** | Puede (si tú mutas) | ❌ No | ❌ No | ❌ No |
| **Callback** | código, sin return | `return` transformación | `return` true/false | `return` nuevo acumulador |
| **Encadenable** | ❌ | ✅ | ✅ | ✅ |
| **Uso típico** | imprimir, acumular | `precios = items.map(i => i.precio)` | `mayores = nums.filter(n => n > 10)` | `total = nums.reduce((a, n) => a + n, 0)` |

## 🧭 Guía de decisión

Pregúntate qué quieres lograr:

| Quieres... | Usa |
|-----------|-----|
| Ejecutar algo por cada elemento (imprimir, acumular) | `forEach` |
| Transformar TODOS los elementos, 1 a 1, mismo largo | `map` |
| Quedarte con SOLO algunos (filtrar) | `filter` |
| Reducir todo a UN valor (suma, total) | `reduce` |
| Cortar a la mitad / control fino del índice | `for` clásico |

---

## 🐛 Errores clásicos (a vigilar)

### 1. Olvidar el `return` en `map` → array de `undefined`

```js
let dobles = numeros.map(n => { n * 2 });   // ❌ sin return
// [undefined, undefined, undefined]

let dobles = numeros.map(n => n * 2);       // ✅ return implícito
let dobles = numeros.map(n => { return n * 2; });  // ✅ return explícito
```

🧠 **Regla de la flecha:** `n => n * 2` devuelve solo. `n => { ... }` necesita `return` adentro.

### 2. Olvidar el `return` en `filter` → array vacío

```js
let pares = numeros.filter(n => { n % 2 === 0 });   // ❌ → []
let pares = numeros.filter(n => n % 2 === 0);       // ✅ → [2, 4, 6]
```

🧠 Un `filter` cuyo callback no devuelve nada siempre filtra todo.

### 3. Usar `map` para efectos secundarios

```js
numeros.map(n => console.log(n));   // ❌ map es para transformar, no para imprimir
numeros.forEach(n => console.log(n));  // ✅
```

🧠 `map` sin usar su resultado = estás tirando el array nuevo que construyó. Si no lo vas a usar, es `forEach`.

### 4. Esperar `break` en `forEach`

```js
numeros.forEach(n => {
  if (n === 3) break;   // ❌ SyntaxError — forEach no se corta
});
```

🧠 `forEach` recorre siempre todo. Si necesitas cortar, usa `for`.

### 5. Confundir `map` con `filter` (y al revés)

- `map`: **cambia** los elementos (mismo número).
- `filter`: **elige** entre los elementos (menos número).

---

## 🔗 Relación con lo que ya sabes

- **`map` + objeto-contador**: `map` es la versión declarativa de "recorrer y construir otro array", como hacías con `push` dentro de un `for`.
- **`filter` + `mediaAprobados` (E12)**: en E12 filtraste aprobados con un `if` dentro del loop. Eso es un `filter` hecho a mano:

```js
// Lo que hiciste en E12 (a mano)
let aprobados = [];
for (let i = 0; i < estudiantes.length; i++) {
  if (estudiantes[i].nota >= 5) aprobados.push(estudiantes[i]);
}

// Mismo resultado con filter
let aprobados = estudiantes.filter(e => e.nota >= 5);
```

🧠 El `for` y los métodos hacen lo mismo: la diferencia es que los métodos **declaran la intención** y te ahorran errores de índice, off-by-one y `length - 1`.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Array.prototype.forEach()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach |
| 📘 **MDN — Array.prototype.map()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map |
| 📘 **MDN — Array.prototype.filter()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter |
| 📘 **MDN — Array.prototype.reduce()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce |
| 📖 **aprendejavascript.dev — Transformar Arrays** | https://www.aprendejavascript.dev/clase/arrays/transformacion |
| 📖 **aprendejavascript.dev — Iteración y recorrido** | https://www.aprendejavascript.dev/clase/arrays/iteracion |
