# Funciones { .bloque-js }

> Una función es un bloque de instrucciones **reutilizable**: la defines una vez, la llamas todas las veces que haga falta. Es la unidad básica para organizar código en JavaScript — todo lo que viene después (arrays, callbacks, closures) se construye sobre esto.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/XxRfF71Yrcc" title="Funciones en JavaScript — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## ¿Qué es una función? {: .topic-title }

```js
function sumar(a, b) {
    return a + b;
}

sumar(2, 3);   // 5 — la llamas ("invocas") con paréntesis
```

Sin invocarla con `()`, la función no hace nada — solo queda definida, esperando a que la llames.

---

## Anatomía de una función {: .topic-title }

```js
function nombreFuncion(parametro1, parametro2) {
    // cuerpo — instrucciones
    return resultado;
}
```

| Parte | Qué es |
|---|---|
| `function` | Palabra clave que declara la función |
| `nombreFuncion` | Identificador — cómo la vas a llamar después |
| `(parametro1, parametro2)` | Datos que la función recibe al ser llamada |
| `{ ... }` | Cuerpo — las instrucciones que ejecuta |
| `return` | Devuelve un valor y termina la ejecución |

---

## Parámetros y argumentos {: .topic-title }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/parametros-opt.mp4"></video>
</div>

```js
// Sin parámetros — no necesita datos externos
function saludar() {
    console.log("¡Hola, mundo!");
}

// Con parámetros — recibe datos para trabajar
function presentarse(nombre, edad) {
    console.log(`Hola, soy ${nombre} y tengo ${edad} años`);
}

presentarse("Pau", 22);
```

!!! info "Parámetro ≠ argumento — no es lo mismo, aunque se usen como sinónimos"
    - **Parámetro**: el nombre que pones en la definición de la función (`nombre`, `edad`). Es un hueco vacío esperando un dato.
    - **Argumento**: el valor real que pasas al llamarla (`"Pau"`, `22`). Es lo que rellena ese hueco.

    `function presentarse(nombre, edad)` declara dos **parámetros**. `presentarse("Pau", 22)` le pasa dos **argumentos**.

!!! warning "El orden de los parámetros importa — es un error muy común"
    ```js
    function dividir(dividendo, divisor) {
        return dividendo / divisor;
    }

    dividir(10, 2);   // ✅ 5 — el orden coincide con la definición
    dividir(2, 10);   // ❌ 0.2 — mismos argumentos, orden invertido, resultado distinto
    ```
    JavaScript asigna cada argumento a su parámetro **por posición**, no por lo que "parece lógico". El primer argumento va al primer parámetro, siempre.

---

## `return` — devuelve un valor y corta la ejecución {: .topic-title }

```js
function comprobarEdad(edad) {
    if (edad < 18) {
        return "menor de edad";   // ← termina aquí, la línea de abajo NO se ejecuta
    }
    console.log("esto solo se ejecuta si edad >= 18");
    return "mayor de edad";
}
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-return"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-return");
    if (!el) return;
    function comprobarEdadDemo(edad) {
        if (edad < 18) {
            return "menor de edad";
        }
        return "mayor de edad";
    }
    var lineas = [
        'comprobarEdad(15) → "' + comprobarEdadDemo(15) + '"',
        'comprobarEdad(20) → "' + comprobarEdadDemo(20) + '"'
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

!!! warning "Sin `return`, la función devuelve `undefined`"
    ```js
    function sumar(a, b) {
        a + b;   // ❌ falta el return
    }

    sumar(2, 3);   // undefined — calculó la suma pero no la devolvió
    ```
    Calcular un valor y devolverlo son dos cosas distintas. Si no hay `return`, el resultado del cálculo se pierde apenas termina la función.

---

## Function expression {: .topic-title }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/hoisting-opt.mp4"></video>
</div>

Lo de arriba (`function sumar(a, b) { ... }`) es una **function declaration**. Una **function expression** es lo mismo, pero escrito de otra forma: la función se **asigna a una variable**, en vez de declararse con nombre propio.

```js
// Function declaration
function sumar(a, b) {
    return a + b;
}

// Function expression — la función vive DENTRO de una variable
const sumar = function (a, b) {
    return a + b;
};
```

!!! info "La función en sí no tiene nombre — es anónima"
    En `const sumar = function (a, b) { ... }`, la función que está a la derecha del `=` no se llama `sumar` a sí misma — es una **función anónima**. `sumar` es solo el nombre de la variable que la contiene. Por eso la invocas como `sumar(2, 3)`: no estás llamando a la función por su propio nombre, estás llamando a la variable que la guarda.

| | Function declaration | Function expression |
|---|---|---|
| Sintaxis | `function nombre() {}` | `const x = function() {}` |
| ¿La función tiene nombre propio? | Sí | No — es anónima, vive en la variable |
| ¿Se puede llamar antes de esa línea? | ✅ Sí | ❌ No |

!!! danger "Hoisting: la declaration se puede llamar ANTES de definirse, la expression no"
    JavaScript "sube" (hoist) las function declarations completas antes de ejecutar el resto del código — por eso funcionan aunque las llames antes de la línea donde están escritas. Una function expression vive **dentro de una variable**, y esa variable no tiene valor asignado hasta que el código llega a esa línea exacta.

    ```js
    saludar();   // ✅ "¡Hola!" — funciona, aunque esté declarada más abajo
    function saludar() { console.log("¡Hola!"); }

    despedirse();   // ❌ TypeError: despedirse is not a function
    const despedirse = function () { console.log("¡Adiós!"); };
    ```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo — hoisting</p>
<div id="demo-js-hoisting"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-hoisting");
    if (!el) return;
    var resultados = [];

    try {
        resultados.push('saludarDemo() ANTES de su definición → "' + saludarDemo() + '"  (declaration: funciona)');
    } catch (e) {
        resultados.push('saludarDemo() ANTES → ' + e.constructor.name + ': ' + e.message);
    }
    function saludarDemo() { return "¡Hola!"; }

    try {
        resultados.push('despedirseDemo() ANTES de su definición → "' + despedirseDemo() + '"');
    } catch (e) {
        resultados.push('despedirseDemo() ANTES → ' + e.constructor.name + ': ' + e.message + '  (expression: no funciona)');
    }
    var despedirseDemo = function () { return "¡Adiós!"; };

    el.innerHTML = resultados.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

---

## Arrow function {: .topic-title }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/arrow-functions-opt.mp4"></video>
</div>

La arrow function es una forma **más corta** de escribir una function expression — usa `=>` en vez de la palabra `function`, y siempre es anónima, asignada a una variable:

```js
// Function expression
const sumar = function (a, b) {
    return a + b;
};

// Arrow function — mismo resultado, sintaxis más corta
const sumar = (a, b) => {
    return a + b;
};

// Arrow function con return implícito — UNA sola expresión, sin llaves
const sumar = (a, b) => a + b;
```

!!! warning "Return implícito SOLO sin llaves — con `{ }` hay que escribir `return`"
    ```js
    const sumar = (a, b) => a + b;        // ✅ 5 — sin llaves, return implícito
    const sumar = (a, b) => { a + b };    // ❌ undefined — con llaves, el return NO es automático
    const sumar = (a, b) => { return a + b; };  // ✅ 5 — con llaves, hay que escribirlo
    ```
    En cuanto agregas `{ }`, JavaScript entiende que ahí puede haber varias instrucciones — y ya no asume cuál es el resultado. Tienes que decírselo con `return`, igual que en una función normal.

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo — return implícito</p>
<div id="demo-js-arrow-return"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-arrow-return");
    if (!el) return;
    var sumarImplicito = function (a, b) { return a + b; };
    var sumarSinReturn = function (a, b) { a + b; };
    var lineas = [
        '(a, b) => a + b        → sumarImplicito(2, 3) = ' + sumarImplicito(2, 3),
        '(a, b) => { a + b }    → sumarSinReturn(2, 3) = ' + sumarSinReturn(2, 3)
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

!!! info "La diferencia que no se ve a simple vista: `this`"
    Una function declaration o expression tiene su propio `this` cuando se invoca. Una arrow function **no tiene `this` propio** — usa el del lugar donde está escrita. No hace falta profundizar en esto todavía (aparece en serio cuando trabajes con objetos y clases), pero es la razón técnica por la que arrow function no siempre es intercambiable 1 a 1 con una function normal.

!!! tip "¿Cuál usar? Arrow function por defecto en código moderno"
    Para callbacks cortos y funciones que no necesitan su propio `this` (la gran mayoría de los casos), arrow function es más corta y más legible. Reserva function declaration para cuando quieras aprovechar el hoisting a propósito, o necesites un `this` propio (por ejemplo, métodos de objeto).

---

## Recursividad {: .topic-title }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/recursividad-opt.mp4"></video>
</div>

La recursividad es una técnica en la que **una función se llama a sí misma**. En vez de repetir con un `for`/`while`, la función resuelve un problema pequeño y delega el resto en otra llamada a sí misma.

```js
function cuentaAtras(n) {
    if (n < 0) return;          // ← caso base: aquí para
    console.log(n);
    cuentaAtras(n - 1);         // ← se llama a sí misma, con un valor MÁS PEQUEÑO
}

cuentaAtras(3);   // 3, 2, 1, 0
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-recursion-cuenta"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-recursion-cuenta");
    if (!el) return;
    var log = [];
    function cuentaAtras(n) {
        if (n < 0) return;
        log.push(n);
        cuentaAtras(n - 1);
    }
    cuentaAtras(3);
    el.innerHTML = "<div>cuentaAtras(3) → " + log.join(", ") + "</div>";
})();
</script>

!!! danger "El caso base NO es opcional — sin él, la función se llama infinitamente"
    Cada llamada recursiva tiene que acercarse más al caso base (`n - 1`, cada vez más chico). Si te olvidas del caso base, o la función nunca llega a cumplirlo, se llama a sí misma sin parar.

    A diferencia de un `while` sin condición de corte (que bloquea el navegador para siempre), una recursión sin caso base revienta rápido con un error concreto — cada llamada ocupa espacio en la **pila de llamadas** (call stack), que tiene un límite:

    ```js
    function sinCasoBase(n) {
        return sinCasoBase(n + 1);   // nunca para
    }

    sinCasoBase(1);   // RangeError: Maximum call stack size exceeded
    ```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo — sin caso base</p>
<div id="demo-js-recursion-stack"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-recursion-stack");
    if (!el) return;
    function sinCasoBase(n) {
        return sinCasoBase(n + 1);
    }
    try {
        sinCasoBase(1);
    } catch (e) {
        el.innerHTML = "<div>" + e.constructor.name + ": " + e.message + "</div>";
    }
})();
</script>

### Ejemplo clásico: factorial

El factorial de `n` es la multiplicación de `n` por todos los enteros anteriores hasta 1 (`5! = 5 × 4 × 3 × 2 × 1 = 120`). Es el ejemplo de libro para recursividad porque la propia definición matemática ya es recursiva: *"el factorial de n es n por el factorial de n-1"*.

```js
function factorial(n) {
    if (n === 0 || n === 1) return 1;   // caso base
    return n * factorial(n - 1);        // n depende del resultado de un problema más chico
}

factorial(5);   // 120
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-factorial"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-factorial");
    if (!el) return;
    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    }
    el.innerHTML = "<div>factorial(5) → " + factorial(5) + "</div>";
})();
</script>

!!! tip "Para entender una recursión, dibújala en papel"
    Escribí cada llamada como una línea nueva, con el valor que recibe, hasta llegar al caso base — después desenrollá hacia arriba multiplicando/sumando los resultados. `factorial(5)` espera el resultado de `factorial(4)`, que espera el de `factorial(3)`... hasta `factorial(1)`, que devuelve `1` sin esperar a nadie más. Recién ahí empiezan a "resolverse" las llamadas de atrás para adelante.

!!! info "¿Recursividad o bucle? Cualquiera de las dos resuelve lo mismo"
    Todo lo que se puede hacer con recursividad se puede hacer con un `for`/`while`, y viceversa. La recursividad brilla cuando el problema ya es naturalmente recursivo (recorrer un árbol de carpetas, Fibonacci, estructuras anidadas) — para un contador simple, un `for` normal es más directo y gasta menos memoria (no acumula llamadas en la pila).

**Para practicar:** suma de los primeros `n` números enteros de forma recursiva, y la sucesión de Fibonacci recursiva — los dos ejercicios clásicos para afianzar el patrón de caso base + llamada con un valor más pequeño.

---

## Scope (ámbito) {: .topic-title }

El **scope** es la zona del código donde una variable existe y se puede usar. Es jerárquico: un scope de adentro ve las variables de los scopes que lo envuelven, pero no al revés.

```js
let nombre = "global";

function externa() {
    let nombre = "función externa";   // shadowing: tapa el "nombre" global mientras estás aquí
    function interna() {
        console.log(nombre);   // ¿cuál "nombre" ve?
    }
    interna();
}

externa();   // "función externa"
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo — scope chain y shadowing</p>
<div id="demo-js-scope-chain"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-scope-chain");
    if (!el) return;
    var nombreGlobalDemo = "global";
    function externaDemo() {
        var nombreGlobalDemo = "función externa";
        function internaDemo() {
            return nombreGlobalDemo;
        }
        return internaDemo();
    }
    el.innerHTML = "<div>externa() → \"" + externaDemo() + "\"  (encontró la más cercana, no la global)</div>";
})();
</script>

### Los 3 niveles de scope

| Nivel | Dónde vive | Visible desde |
|---|---|---|
| **Global** | Fuera de cualquier función/bloque | Todo el archivo |
| **Función** | Dentro de una función | Solo dentro de esa función (y las anidadas dentro de ella) |
| **Bloque** | Dentro de `{ }` — `if`, `for`, `while` | Solo dentro de ese bloque — **solo con `let`/`const`**, `var` lo ignora |

### La cadena de scope (scope chain)

Cuando JS busca una variable, recorre los scopes de adentro hacia afuera, en este orden: **local → función padre → global**. Se queda con la **primera** que encuentra — por eso `interna()` del ejemplo de arriba ve `"función externa"` y no `"global"`: encuentra el `nombre` de `externa()` antes de llegar al global.

!!! danger "No puedes declarar la misma variable dos veces en el mismo scope"
    ```js
    let edad = 20;
    let edad = 25;   // ❌ SyntaxError: Identifier 'edad' has already been declared
    ```
    Esto es un error de sintaxis (rompe el script entero, ni siquiera llega a ejecutarse) — distinto a shadowing, donde la variable duplicada está en un scope **diferente** (una función anidada, un bloque), y ahí sí es válido.

!!! tip "Para qué sirve el scope: encapsulación"
    Que una variable NO sea visible desde afuera no es una limitación — es protección. Evita conflictos de nombres entre partes distintas del código, y evita que cualquier parte del programa pueda modificar por accidente una variable que "no le corresponde". Es la base de por qué existen los closures (siguiente sección).

---

## Funciones como valores {: .topic-title }

Que una función se pueda guardar en una variable (como viste arriba con function expression / arrow) no es casualidad: en JavaScript, **una función es un valor**, igual que un número o un string. Eso significa que puedes:

- Asignarla a una variable
- Pasarla como argumento a otra función
- Devolverla desde otra función

```js
// Pasar una función COMO argumento de otra función
function operar(a, b, operacion) {
    return operacion(a, b);   // operacion es una función — la estás LLAMANDO aquí
}

const sumar = (a, b) => a + b;
const restar = (a, b) => a - b;

operar(5, 3, sumar);    // 8  — le pasaste la función sumar, no su resultado
operar(5, 3, restar);   // 2  — misma operar(), distinta función por dentro
```

!!! danger "Pasa la función, no su resultado — sin paréntesis"
    ```js
    operar(5, 3, sumar);     // ✅ pasas la FUNCIÓN — operar() la va a llamar cuando la necesite
    operar(5, 3, sumar());   // ❌ pasas el RESULTADO (8) — sumar() se ejecuta antes, sin sus argumentos reales
    ```
    `sumar` (sin paréntesis) es una referencia a la función. `sumar()` (con paréntesis) ya la ejecuta. Si escribes los paréntesis al pasarla como argumento, le estás dando el resultado de una llamada rota, no la función.

Esta es la idea central detrás de los **callbacks** (funciones que le pasas a otra función para que las ejecute en el momento justo) y de patrones como `array.map(elemento => ...)` que ya usaste en [Arrays + Métodos](../../02-arrays/index.md) — `elemento => ...` no es más que una función pasada como argumento.

---

## Closures {: .topic-title }

Un closure es cuando **una función "recuerda" las variables de su scope padre**, incluso después de que esa función padre ya terminó de ejecutarse. No es una sintaxis especial que escribís a propósito — se forma solo, automáticamente, cada vez que una función anidada usa una variable de afuera.

```js
function crearContador() {
    let contador = 0;              // vive en el scope de crearContador()

    return function () {           // esta función interna "recuerda" contador
        contador++;
        return contador;
    };
}

const contar1 = crearContador();
contar1();   // 1
contar1();   // 2
contar1();   // 3 — contador sigue vivo, aunque crearContador() ya terminó de ejecutarse hace rato
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-closure"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-closure");
    if (!el) return;

    function crearContadorDemo() {
        var contador = 0;
        return function () {
            contador++;
            return contador;
        };
    }

    var contar1 = crearContadorDemo();
    var contar2 = crearContadorDemo();
    var lineas = [
        'contar1() → ' + contar1(),
        'contar1() → ' + contar1(),
        'contar1() → ' + contar1(),
        'contar2() → ' + contar2() + '   ← otro closure, arranca de cero — NO comparte contador con contar1'
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

!!! tip "¿Por qué funciona esto? Por scope + funciones como valores"
    `crearContador()` **devuelve una función** (funciones como valores), y esa función devuelta sigue teniendo acceso al scope donde nació (scope chain) — aunque `crearContador()` ya haya terminado. JavaScript no destruye `contador` mientras exista algo que todavía pueda usarlo. Closures no es un concepto nuevo: es la consecuencia directa de juntar los dos anteriores.

**Para qué sirve en la práctica:**

- **Privacidad de datos** — `contador` no es accesible desde afuera de ninguna forma. La única manera de tocarlo es a través de la función que `crearContador()` devolvió. Es la forma que tiene JS de simular variables "privadas" sin usar clases.
- **Estado independiente** — `contar1` y `contar2` en el demo de arriba son dos closures distintos, cada uno con su propia copia de `contador`. No se pisan entre sí.
- **Funciones configurables** — una función "de fábrica" que crea otras funciones ya ajustadas con ciertos valores:

```js
function crearSaludo(saludo) {
    return function (nombre) {
        return `${saludo}, ${nombre}!`;
    };
}

const saludarFormal = crearSaludo("Buenos días");
const saludarInformal = crearSaludo("Ey");

saludarFormal("Pau");    // "Buenos días, Pau!"
saludarInformal("Pau");  // "Ey, Pau!"
```

!!! warning "Closures no son gratis: quedan en memoria mientras algo los referencie"
    Cada closure mantiene vivas las variables que usa, así ya no las necesites. No es un problema para casos normales (contadores, configuración), pero si creas closures dentro de un loop que corre miles de veces y nunca sueltas las referencias, eso sí puede acumular memoria de más. Para el código que vas a escribir ahora, no es algo que tengas que evitar — es algo que vale la pena poder nombrar cuando lo veas.

---

## Parámetros por defecto y rest parameters {: .topic-title }

```js
// Parámetro por defecto — se usa SOLO si no le pasas ese argumento
function saludar(nombre = "invitado") {
    console.log(`Hola, ${nombre}`);
}

saludar();          // "Hola, invitado"
saludar("Pau");      // "Hola, Pau"

// Rest parameters — junta argumentos sueltos en un array
function sumarTodos(...numeros) {
    return numeros.reduce((acum, n) => acum + n, 0);
}

sumarTodos(1, 2, 3, 4);   // 10 — numeros es [1, 2, 3, 4]
```

!!! info "Rest parameters siempre al final"
    `function f(a, b, ...resto)` es válido. `function f(...resto, a, b)` no — el rest parameter tiene que ser el último, porque junta "todo lo que sobra".

!!! warning "Rest NO es lo mismo que pasarle un array entero"
    Con rest sigues pasando argumentos **sueltos**, separados por comas. Si le pasas un array literal, lo mete DENTRO de otro array:

    ```js
    sumarTodos(1, 2, 3, 4);      // ✅ numeros = [1, 2, 3, 4]
    sumarTodos([1, 2, 3, 4]);    // ❌ numeros = [[1, 2, 3, 4]] — un array dentro de otro array
    ```

    Si ya tienes un array y quieres que sus elementos entren como argumentos sueltos, necesitas **spread** en la llamada — el inverso de rest:

    ```js
    let misNumeros = [1, 2, 3, 4];

    sumarTodos(...misNumeros);
    // es exactamente igual a escribir:
    sumarTodos(1, 2, 3, 4);
    ```

    **Rest** (en la definición de la función) junta argumentos sueltos → array. **Spread** (en la llamada) desarma un array → argumentos sueltos. Mismo símbolo (`...`), direcciones opuestas — combinados dan la sensación de "pasar el array entero", pero en el medio pasan por la forma de argumentos sueltos.

---

## Funciones incorporadas que ya usas {: .topic-title }

JavaScript trae funciones globales listas para usar — no las declaras vos, ya existen en el navegador:

| Función | Qué hace |
|---|---|
| `console.log()` | Imprime en la consola |
| `console.error()` | Imprime como error (texto rojo) |
| `console.warn()` | Imprime como advertencia (texto amarillo) |
| `console.table()` | Imprime un array/objeto como tabla |
| `alert()` | Ventana emergente — **bloquea** la ejecución hasta cerrarla |
| `prompt()` | Pide un dato al usuario — bloquea, y **siempre devuelve texto** |
| `confirm()` | Pregunta sí/no — bloquea, devuelve `true`/`false` |

```js
let edad = prompt("¿Cuántos años tienes?");
typeof edad;   // "string" — SIEMPRE, aunque el usuario escriba "25"

let edadNumero = Number(edad);   // hay que convertirlo a mano si lo vas a usar como número
```

!!! danger "No nombres tus funciones igual que las incorporadas"
    Si declaras `function console() {}` o `let alert = 5;`, pisas la función global y rompes cualquier código (tuyo o de una librería) que dependa de ella. Los nombres de funciones incorporadas están reservados de facto.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa arrow functions para callbacks cortos | Depender del hoisting como estilo normal de código |
| Devuelve explícitamente con `return` | Confiar en que una función "hace algo" sin comprobar qué devuelve |
| Convierte `prompt()` con `Number()` si esperas un número | Asumir que `prompt()` te da un número directo |
| Usa rest parameters para cantidad variable de argumentos | Nombrar tus funciones igual que las incorporadas (`alert`, `confirm`...) |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Funciones** | https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions |
| 📘 **MDN — Arrow functions** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions |
| 📘 **MDN — Rest parameters** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/rest_parameters |
| 📘 **MDN — Closures** | https://developer.mozilla.org/es/docs/Web/JavaScript/Closures |
| 📖 **jscamp.dev — Funciones en JavaScript** | https://www.jscamp.dev/javascript/funciones |
| 📖 **aprendejavascript.dev — Tu primera función** | https://www.aprendejavascript.dev/clase/funciones/tu-primera-funcion |
| 📖 **aprendejavascript.dev — Parámetros** | https://www.aprendejavascript.dev/clase/funciones/parametros |
| 📖 **aprendejavascript.dev — Function expression** | https://www.aprendejavascript.dev/clase/funciones/function-expression |
| 📖 **aprendejavascript.dev — Flecha** | https://www.aprendejavascript.dev/clase/funciones/flecha |
| 📖 **aprendejavascript.dev — Recursividad** | https://www.aprendejavascript.dev/clase/funciones/recursividad |
| 📖 **aprendejavascript.dev — Scope** | https://www.aprendejavascript.dev/clase/funciones/scope |
| 📖 **aprendejavascript.dev — Closures** | https://www.aprendejavascript.dev/clase/funciones/closures |
| 🎥 **midudev — Funciones en JavaScript** | https://www.youtube.com/watch?v=XxRfF71Yrcc |
