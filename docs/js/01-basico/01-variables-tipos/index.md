# Variables y tipos de datos { .bloque-js }

> JavaScript decide el tipo de un valor en tiempo de ejecución, no cuando lo escribes. Antes de tocar lógica, hay que tener claro **cómo declarar** una variable y **qué tipos de datos** existen — de ahí salen la mitad de los bugs de principiante.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/aR1bhrgXXN8" title="Variables y tipos de datos en JavaScript — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## `const`, `let` — y por qué `var` no {: .topic-title }

```js
const pi = 3.1416;   // no se puede reasignar
let contador = 0;    // sí se puede reasignar
```

| Palabra | ¿Reasignable? | Cuándo usarla |
|---|:---:|---|
| `const` | ❌ | Por defecto. Configuración, valores que no cambian |
| `let` | ✅ | Solo cuando SABES que vas a reasignar — contadores, acumuladores |
| `var` | ✅ | Nunca. Legacy: no respeta el scope de bloque |

```js
const total = 100;
total = 200;   // ❌ TypeError: Assignment to constant variable
```

!!! tip "Regla práctica: empieza siempre con const"
    Declara todo con `const`. Solo cambia a `let` cuando el propio código te obligue — el compilador te va a avisar con un error si intentas reasignar algo que declaraste `const`. Es la forma más simple de evitar reasignaciones accidentales.

!!! danger "Por qué no `var`"
    `var` no respeta el scope de bloque (`{ }`) — solo el de función. Esto significa que una variable `var` declarada dentro de un `if` o un `for` **se filtra** fuera de ese bloque. `let`/`const` sí quedan encerradas en el bloque donde nacen.

    ```js
    if (true) {
        var x = 1;
        let y = 2;
    }
    console.log(x); // 1 — se filtró
    console.log(y); // ❌ ReferenceError — y no existe aquí afuera
    ```

---

## Tipos primitivos {: .topic-title }

JavaScript tiene 7 tipos primitivos. Un valor primitivo **no es un objeto** y no tiene métodos propios — cuando escribes `"hola".toUpperCase()`, JS lo envuelve temporalmente en un objeto `String` para prestarte el método.

| Tipo | Ejemplo | Qué representa |
|---|---|---|
| `number` | `42`, `3.14`, `-7` | Enteros y decimales — un solo tipo numérico, sin distinción int/float |
| `string` | `"hola"`, `'hola'`, `` `hola` `` | Texto |
| `boolean` | `true`, `false` | Verdadero/falso |
| `undefined` | `let x;` | JS lo asigna solo cuando declaras sin valor |
| `null` | `let x = null;` | Tú lo asignas a propósito — "esto está vacío" |
| `bigint` | `9007199254740993n` | Enteros más allá del límite seguro de `number` |
| `symbol` | `Symbol("id")` | Identificador único — poco frecuente en código de aplicación |

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo — <code>typeof</code></p>
<div id="demo-js-typeof"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-typeof");
    if (!el) return;
    var lineas = [
        'typeof 42          → "' + typeof 42 + '"',
        'typeof "hola"      → "' + typeof "hola" + '"',
        'typeof true        → "' + typeof true + '"',
        'typeof undefined   → "' + typeof undefined + '"',
        'typeof null        → "' + typeof null + '"   ← el bug histórico, ver más abajo',
        'typeof 10n         → "' + typeof 10n + '"'
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

---

## `undefined` vs `null` — no son lo mismo {: .topic-title }

```js
let sinAsignar;        // undefined — JS lo pone solo
let vacioApropósito = null;  // null — VOS decidiste que está vacío
```

| | `undefined` | `null` |
|---|---|---|
| ¿Quién lo asigna? | JavaScript, automáticamente | El programador, a propósito |
| Significa | "no se declaró ningún valor todavía" | "aquí no hay valor, y es intencional" |
| Caso típico | Variable declarada sin inicializar, parámetro no pasado | Resetear un valor, "usuario sin dirección" |

!!! info "typeof null es \"object\" — y es un error que quedó para siempre"
    `typeof null` debería devolver `"null"`, pero devuelve `"object"`. Es un bug de la primera versión de JavaScript (1995) que nunca se corrigió porque arreglarlo rompería código existente en toda la web. Si necesitas comprobar null específicamente, compara directo: `valor === null`.

---

## Coerción de tipos {: .topic-title }

JavaScript convierte tipos automáticamente cuando una operación los mezcla — a veces te ayuda, a veces te arruina el resultado.

```js
"5" + 3    // "53"  ← + con un string CONCATENA, convierte el número a texto
"5" - 3    // 2     ← -, *, / fuerzan conversión a número
"5" * "2"  // 10    ← ambos strings se convierten a número
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo — coerción</p>
<div id="demo-js-coercion"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-coercion");
    if (!el) return;
    var lineas = [
        '"5" + 3   → "' + ("5" + 3) + '"',
        '"5" - 3   → ' + ("5" - 3),
        '"5" * "2" → ' + ("5" * "2"),
        '0.1 + 0.2 → ' + (0.1 + 0.2) + '   ← precisión de coma flotante, no es un bug de tu código'
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

!!! warning "`==` compara con coerción, `===` no — usa siempre `===`"
    ```js
    0 == "0"     // true  — "0" se convierte a número antes de comparar
    0 == ""      // true  — "" se convierte a 0
    0 == false   // true  — false se convierte a 0

    0 === "0"    // false — tipos distintos, ni lo intenta
    ```
    `==` (igualdad débil) convierte los tipos antes de comparar, y el resultado sorprende más de lo que ayuda. `===` (igualdad estricta) compara tipo y valor a la vez — es la que deberías usar siempre, salvo que tengas una razón explícita para lo contrario.

!!! tip "0.1 + 0.2 no da 0.3 — y no es un error tuyo"
    Todos los lenguajes que usan coma flotante binaria (IEEE 754) tienen este comportamiento, no es exclusivo de JS. Si necesitas comparar decimales, no uses `===` directo — compara contra un margen de error pequeño (`Math.abs(a - b) < Number.EPSILON`) o trabaja en enteros (céntimos en vez de euros, por ejemplo).

---

## `BigInt` — cuando `number` no alcanza {: .topic-title }

`number` pierde precisión a partir de `Number.MAX_SAFE_INTEGER` (9007199254740991). Para enteros más grandes, `BigInt` los representa con precisión exacta:

```js
Number.MAX_SAFE_INTEGER          // 9007199254740991
Number.MAX_SAFE_INTEGER + 1      // 9007199254740992 ✅ todavía bien
Number.MAX_SAFE_INTEGER + 2      // 9007199254740992 ❌ debería ser 993, perdió precisión

9007199254740993n                // BigInt — precisión exacta, nota la 'n' al final
```

No puedes mezclar `number` y `bigint` en una operación directa — hay que convertir explícitamente:

```js
10n + 5;        // ❌ TypeError: Cannot mix BigInt and other types
10n + BigInt(5); // ✅ 15n
```

---

## `Math` — operaciones numéricas comunes {: .topic-title }

`Math` es un objeto global con métodos matemáticos, siempre en mayúscula y sin necesidad de instanciar nada (`Math.metodo(...)`, nunca `new Math()`):

```js
Math.round(4.5);   // 5 — redondea al entero más cercano
Math.floor(4.9);   // 4 — SIEMPRE hacia abajo
Math.ceil(4.1);    // 5 — SIEMPRE hacia arriba
Math.abs(-7);      // 7 — valor absoluto, sin signo
Math.max(3, 9, 1);  // 9
Math.min(3, 9, 1);  // 1
Math.random();      // decimal entre 0 (incluido) y 1 (excluido)
```

!!! tip "`round()` no es lo mismo que `floor()` — importa cuál elegís"
    `Math.round()` redondea al más cercano (hacia arriba desde `.5`); `Math.floor()` trunca siempre hacia abajo, sin importar el decimal. Para un porcentaje o índice donde cualquier resto por mínimo que sea no debería "contar", `floor()` es la opción correcta — `round()` puede redondear hacia arriba un resultado que en realidad todavía no llegó al 100%.

---

## Nombres de variables — reglas y convenciones {: .topic-title }

**Reglas obligatorias** — si las rompes, JavaScript da error:

- Solo puede contener letras, números, `_` y `$`.
- No puede **empezar** por un número (`1nombre` ❌, `nombre1` ✅).
- Es **case-sensitive**: `miVariable` y `mivariable` son dos variables distintas.

**Convenciones** — no son obligatorias, pero se esperan en código profesional:

| Estilo | Ejemplo | Dónde se usa |
|---|---|---|
| `camelCase` | `nombreUsuario` | Variables y funciones — el estándar en JS |
| `SCREAMING_CASE` | `API_URL`, `MAX_INTENTOS` | Solo constantes que nunca cambian |
| `snake_case` | `mi_archivo.js` | Poco usado en variables JS; común en nombres de archivo |
| `kebab-case` | `mi-archivo.js` | Nombres de archivo y clases CSS, nunca variables (el guion se interpreta como resta) |

```js
// ✅ camelCase para variables normales
let nombreUsuario = "Pau";
let precioTotal = 49.99;

// ✅ SCREAMING_CASE para constantes que nunca cambian
const API_URL = "https://api.ejemplo.com";
const MAX_INTENTOS = 3;
```

Un nombre descriptivo evita comentarios explicativos: `precioTotal` no necesita un comentario que diga "esto es el precio total".

!!! warning "SCREAMING_CASE es solo para constantes verdaderas"
    No lo uses en un `let` — esa convención comunica "este valor nunca cambia", y si lo aplicas a algo reasignable, mientes sobre el propio código.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Declara todo con `const` por defecto | Usar `let` "por si acaso" cambia después |
| Usa `let` solo cuando reasignas de verdad | Usar `var` — no respeta el scope de bloque |
| Compara con `===` / `!==` | Comparar con `==` / `!=` y confiar en la coerción |
| `null` para "vacío a propósito" | Confundir `null` con `undefined` |
| `BigInt` para enteros fuera del rango seguro | Operar `number` y `bigint` juntos sin convertir |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Tipos de datos y estructuras** | https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures |
| 📘 **MDN — `let`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/let |
| 📘 **MDN — `const`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/const |
| 📘 **MDN — `BigInt`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/BigInt |
| 📖 **jscamp.dev — Tipos de datos y variables** | https://www.jscamp.dev/javascript/tipos-datos-variables |
| 🎥 **midudev — Variables y tipos de datos** | https://www.youtube.com/watch?v=aR1bhrgXXN8 |
