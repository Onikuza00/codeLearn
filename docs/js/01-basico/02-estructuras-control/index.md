# Estructuras de control { .bloque-js }

> Las estructuras de control deciden **qué código se ejecuta** (condicionales) y **cuántas veces** (bucles). Sin ellas, un programa es una lista de instrucciones que se ejecutan una sola vez, de arriba a abajo, sin decisiones.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/Z34BF9PCfYg" title="Curso completo de JavaScript — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## `if` / `else` / `else if` — condicionales {: .topic-title }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/condicional-if-opt.mp4"></video>
</div>

```js
const edad = 18;

if (edad >= 18) {
    console.log("Eres mayor de edad");
} else if (edad >= 16) {
    console.log("Eres casi mayor de edad");
} else {
    console.log("Eres menor de edad");
}
```

JS evalúa las condiciones en orden y ejecuta el primer bloque cuyo `if`/`else if` sea `true`. Si ninguno se cumple, ejecuta el `else` (si existe).

!!! tip "Simplifica condiciones complejas con `&&` y variables booleanas"
    ```js
    // ❌ difícil de leer
    if (usuario.activo && usuario.edad >= 18 && usuario.pais === "ES") { ... }

    // ✅ más legible
    const puedeComprar = usuario.activo && usuario.edad >= 18 && usuario.pais === "ES";
    if (puedeComprar) { ... }
    ```
    Guardar la condición en una variable con nombre descriptivo documenta la intención sin necesitar un comentario.

!!! warning "Evita anidar `if` dentro de `if` — usa early return"
    ```js
    // ❌ anidamiento profundo
    function procesar(usuario) {
        if (usuario) {
            if (usuario.activo) {
                if (usuario.edad >= 18) {
                    return "OK";
                }
            }
        }
        return null;
    }

    // ✅ early return — valida primero, ejecuta después
    function procesar(usuario) {
        if (!usuario) return null;
        if (!usuario.activo) return null;
        if (usuario.edad < 18) return null;
        return "OK";
    }
    ```
    Cada `if` corta el camino apenas detecta un caso inválido, en vez de ir metiéndose más adentro. El cuerpo principal de la función queda al mismo nivel de indentación, sin escaleras.

### Operador ternario — un `if`/`else` en una línea

Para elegir entre dos valores, el ternario es más corto que un `if`/`else` completo:

```js
const mensaje = edad >= 18 ? "Mayor de edad" : "Menor de edad";
// equivale a:
let mensaje;
if (edad >= 18) {
    mensaje = "Mayor de edad";
} else {
    mensaje = "Menor de edad";
}
```

!!! danger "Un ternario es para ELEGIR UN VALOR, no para ejecutar lógica"
    ```js
    // ❌ abuso del ternario — funciona, pero es difícil de leer
    edad >= 18 ? console.log("Mayor") : console.log("Menor");

    // ✅ eso es trabajo de un if normal
    if (edad >= 18) {
        console.log("Mayor");
    } else {
        console.log("Menor");
    }
    ```
    Si no estás asignando el resultado a una variable ni devolviéndolo, no es un buen caso para ternario.

---

## `switch` — cuando el `if`/`else` se hace largo {: .topic-title }

```js
const dia = new Date().getDay();   // 0 = domingo, 6 = sábado

switch (dia) {
    case 0:
        console.log("Domingo");
        break;
    case 6:
        console.log("Sábado");
        break;
    default:
        console.log("Día de semana");
}
```

`switch` evalúa una expresión y ejecuta el `case` que coincida. `default` es el equivalente a un `else` — se ejecuta si ningún `case` coincidió.

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo — el gotcha del <code>break</code></p>
<div id="demo-js-switch"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-switch");
    if (!el) return;

    function conBreak(dia) {
        var log = [];
        switch (dia) {
            case "lunes":
                log.push("Empieza la semana");
                break;
            case "viernes":
                log.push("Casi finde");
                break;
            default:
                log.push("Día normal");
        }
        return log.join(" / ");
    }

    function sinBreak(dia) {
        var log = [];
        switch (dia) {
            case "lunes":
                log.push("Empieza la semana");
            case "viernes":
                log.push("Casi finde");
            default:
                log.push("Día normal");
        }
        return log.join(" / ");
    }

    var lineas = [
        'CON break, "lunes" → ' + conBreak("lunes"),
        'SIN break, "lunes" → ' + sinBreak("lunes") + '   ← siguió ejecutando los case de abajo'
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

!!! danger "Sin `break`, el switch sigue cayendo a los `case` de abajo (fall-through)"
    Es el error más común con `switch`. Si un `case` coincide y no tiene `break`, JavaScript **no se detiene ahí** — sigue ejecutando el código de los `case` siguientes, sin volver a comprobar su condición. En el demo de arriba, `"lunes"` sin `break` termina ejecutando también el código de `"viernes"` y `default`.

**Agrupar cases** que comparten el mismo bloque:

```js
switch (mes) {
    case 12:
    case 1:
    case 2:
        console.log("Invierno");
        break;
    case 3:
    case 4:
    case 5:
        console.log("Primavera");
        break;
}
```

**`switch (true)`** — para evaluar condiciones en vez de valores exactos:

```js
switch (true) {
    case edad < 13:
        console.log("Niño");
        break;
    case edad < 18:
        console.log("Adolescente");
        break;
    default:
        console.log("Adulto");
}
```

!!! info "¿`switch` o `if`/`else`?"
    Con 2-3 condiciones, `if`/`else` suele ser más claro. Con muchos valores posibles de UNA sola variable (días, meses, códigos de estado), `switch` es más legible que una cadena larga de `else if`.

---

## `while` — repite mientras se cumpla una condición {: .topic-title }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/bucle-opt.mp4"></video>
</div>

```js
let cuentaAtras = 5;

while (cuentaAtras > 0) {
    console.log(cuentaAtras);
    cuentaAtras = cuentaAtras - 1;
}
console.log("¡Despegue! 🚀");
```

`while` comprueba la condición **antes** de cada vuelta. Si es falsa desde el principio, el bloque no se ejecuta ni una vez.

!!! danger "Bucle infinito: el error más peligroso de un while"
    Si la condición nunca se vuelve falsa, el bucle no termina nunca y bloquea la pestaña del navegador. Antes de escribir un `while`, pregúntate: *¿qué línea de este bloque hace que la condición eventualmente sea falsa?* Si no puedes responder, falta esa línea.

    ```js
    // ❌ bucle infinito — cuentaAtras nunca cambia
    let cuentaAtras = 5;
    while (cuentaAtras > 0) {
        console.log(cuentaAtras);
        // falta: cuentaAtras = cuentaAtras - 1;
    }
    ```

`break` corta el bucle por completo. `continue` salta directo a la siguiente vuelta, sin ejecutar el resto del cuerpo:

```js
let i = 0;
while (i < 10) {
    i++;
    if (i % 2 === 0) continue;   // salta los pares
    if (i === 9) break;          // corta en 9
    console.log(i);              // 1, 3, 5, 7
}
```

---

## `do...while` — se ejecuta al menos una vez {: .topic-title }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/do-while-opt.mp4"></video>
</div>

```js
let respuesta;
let intentos = 0;

do {
    intentos++;
    respuesta = intentos >= 3;   // ejemplo: se "acierta" al 3er intento
} while (!respuesta);

console.log(`Conseguido en ${intentos} intentos`);
```

| | `while` | `do...while` |
|---|---|---|
| ¿Cuándo comprueba la condición? | Antes de cada vuelta | Después de cada vuelta |
| ¿Puede ejecutarse 0 veces? | ✅ Sí, si la condición es falsa desde el inicio | ❌ No, siempre corre al menos 1 vez |

!!! tip "Cuándo usar do...while: cuando el cuerpo tiene que correr sí o sí una vez"
    Es el caso típico de "pedile algo al usuario, y si no responde bien volvé a pedirlo" — necesitas ejecutar el bloque una primera vez antes de tener algo que evaluar.

---

## `for` — bucle con contador {: .topic-title }

```js
for (let i = 1; i <= 10; i++) {
    console.log(i);
}
```

| Parte | Ejemplo | Qué hace |
|---|---|---|
| Inicialización | `let i = 1` | Se ejecuta UNA vez, antes de arrancar |
| Condición | `i <= 10` | Se evalúa antes de CADA vuelta — si es falsa, corta |
| Actualización | `i++` | Se ejecuta al FINAL de cada vuelta |

```js
// Hacia atrás
for (let i = 10; i >= 0; i--) { console.log(i); }

// Anidados — tabla de multiplicar
for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
        console.log(`${i} x ${j} = ${i * j}`);
    }
}
```

### `for...of` — recorrer valores de un array (o string)

```js
const frutas = ["manzana", "pera", "uva"];

for (const fruta of frutas) {
    console.log(fruta);   // manzana, pera, uva — el VALOR directo, sin índice
}
```

### `for...in` — recorrer claves de un objeto

```js
const usuario = { nombre: "Pau", edad: 22 };

for (const clave in usuario) {
    console.log(clave, usuario[clave]);   // nombre Pau / edad 22
}
```

!!! warning "No uses `for...in` en arrays"
    `for...in` recorre **claves enumerables**, y en un array las claves son los índices como strings (`"0"`, `"1"`...) — funciona por casualidad, pero puede incluir propiedades heredadas y no garantiza el orden. Para arrays usa `for...of`, `forEach`, o un `for` clásico. `for...in` es para objetos.

!!! info "¿Y `forEach`?"
    `forEach` no es una estructura de control del lenguaje — es un **método de array** (junto a `map`/`filter`/`reduce`). Ya lo viste en detalle en [Arrays + Métodos](../../02-arrays/index.md). La diferencia práctica: `forEach` no se puede cortar con `break` (usa `for`/`for...of` si necesitas cortar a mitad).

---

## Expresiones vs declaraciones {: .topic-title }

Una distinción que explica por qué ciertas cosas no se pueden escribir dentro de un `if`:

| | Declaración | Expresión |
|---|---|---|
| ¿Produce un valor? | ❌ No | ✅ Sí |
| Ejemplo | `let nombre = "Juan";` | `2 + 3`, `edad >= 18`, `sumar(2, 3)` |
| ¿Se puede usar en un `if (...)`? | ❌ No | ✅ Sí — `if` necesita una expresión booleana |

```js
if (let x = 5) { ... }     // ❌ SyntaxError — una declaración no es una expresión válida aquí
if (edad >= 18) { ... }    // ✅ edad >= 18 es una expresión, produce true/false
```

---

## Guía de decisión {: .topic-title }

| Necesitas... | Usa |
|---|---|
| Ejecutar código solo si se cumple una condición | `if` / `else` |
| Elegir entre 2 valores para asignar o devolver | Ternario `? :` |
| Comparar UNA variable contra muchos valores posibles | `switch` |
| Repetir mientras se cumpla una condición, sin saber cuántas veces | `while` |
| Repetir, pero necesitas que corra al menos 1 vez | `do...while` |
| Repetir un número exacto de veces (contador) | `for` |
| Recorrer los valores de un array | `for...of` o `.forEach()` |
| Recorrer las claves de un objeto | `for...in` |

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Early return para evitar anidar `if` dentro de `if` | Anidar 3+ niveles de `if` — aplana con early returns |
| Poner siempre `break` en cada `case` de un `switch` | Olvidar `break` y confiar en el fall-through por accidente |
| Preguntarte qué línea hace falsa la condición antes de escribir un `while` | Escribir un `while` sin tener claro cómo termina |
| `for...of` para arrays, `for...in` para objetos | Usar `for...in` en arrays |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — if...else** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/if...else |
| 📘 **MDN — switch** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/switch |
| 📘 **MDN — for...of** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...of |
| 📘 **MDN — for...in** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...in |
| 📖 **aprendejavascript.dev — Condicional if** | https://www.aprendejavascript.dev/clase/estructuras-de-control/condicional-if |
| 📖 **aprendejavascript.dev — Bucles con while** | https://www.aprendejavascript.dev/clase/estructuras-de-control/bucles-con-while |
| 📖 **aprendejavascript.dev — Bucles con do while** | https://www.aprendejavascript.dev/clase/estructuras-de-control/bucles-con-do-while |
| 📖 **aprendejavascript.dev — Bucles con for** | https://www.aprendejavascript.dev/clase/estructuras-de-control/bucles-con-for |
| 📖 **aprendejavascript.dev — Switch** | https://www.aprendejavascript.dev/clase/estructuras-de-control/switch |
| 📖 **aprendejavascript.dev — Expresiones y declaraciones** | https://www.aprendejavascript.dev/clase/estructuras-de-control/expresiones-y-declaraciones |
