# GOTCHAS — Conocimiento vivo del stack de Pau

> Errores reales, teoría nueva, y mejoras documentadas sesión a sesión.

---

<!-- ============================================= -->
<!-- MAÑANA — CSS                                 -->
<!-- ============================================= -->
# ☀️ MAÑANA — CSS

> *(vacío — próxima sesión)*

---

<!-- ============================================= -->
<!-- TARDE — JS                                   -->
<!-- ============================================= -->
# 🌙 TARDE — JS · 25/07/2026

---

## 📚 TEORÍA NUEVA

Conceptos nuevos que aparecieron en esta sesión:

### 1. El operador `%` (módulo/resto)

No es "divisible por". Es **"¿cuánto sobra?"**.

```js
10 % 3  → 1   // 3 cabe 3 veces, sobra 1
10 % 2  → 0   // cabe exacto → es par
7 % 2   → 1   // sobra 1 → es impar
```

**Pares:** `n % 2 === 0` · **Impares:** `n % 2 !== 0`
**Divisibilidad:** `n % divisor === 0` → "divisor divide exactamente a n"

### 2. `split("")` vs `split(" ")` vs `split(", ")`

`split()` **parte un string por el separador** y devuelve array. El separador DESAPARECE.

| Código | Separa por | Resultado |
|--------|-----------|-----------|
| `"hola".split("")` | string vacío → **cada caracter** | `["h","o","l","a"]` |
| `"hola mundo".split(" ")` | espacio → **cada palabra** | `["hola","mundo"]` |
| `"a,b,c".split(",")` | coma | `["a","b","c"]` |
| `"hola".split("x")` | no existe | `["hola"]` — 1 elemento |

### 3. `string[i]` — indexar caracteres (y mirar "para atrás")

Podés acceder a cualquier caracter de un string por su posición:

```js
"hola"[0] → "h"
"hola"[3] → "a"
"hola"[1-1] → "h"  // mirar "para atrás"
"hola"[1+1] → "l"  // mirar "para adelante"
```

**Aplicación:** en `limpiarEspacios`, cuando estás en un espacio, mirás `string[i-1]` para ver si el anterior también es espacio.

### 4. `.length` — qué tipos lo tienen y cuáles NO

| Tipo | ¿Tiene? | Ejemplo |
|------|---------|---------|
| **String** | ✅ Sí | `"hola".length` → 4 |
| **Array** | ✅ Sí | `[1,2,3].length` → 3 |
| **Number** | ❌ **NO** | `(5).length` → `undefined` |

⚠️ **Si hacés `item.length` en un número, JS devuelve `undefined`**, no tira error. Y `undefined > 5` es `false` — tu condición nunco se cumple y no sabés por qué.

### 5. `++` (incrementar) vs `+=` (acumular)

```js
let suma = 0;
suma++;     // suma = 1  → SIRVE PARA CONTAR (suma 1)
suma += 5;  // suma = 6  → SIRVE PARA ACUMULAR (suma cualquier valor)
```

- Para **contar** cuántos pares hay: `suma++`
- Para **sumar** el valor de los pares: `suma += i`

### 6. `!` (negación) vs `!==` (desigualdad estricta)

NO son lo mismo. **`!` niega el valor booleano. `!==` pregunta "es distinto".**

```js
let x = 5;
!x         → false    (5 es truthy, !5 es false)
x !== 3    → true     (5 es distinto de 3 → true)
```

Tu error: `!i % 2 == 0` se ejecuta como `(!i) % 2 == 0`, no como `i % 2 !== 0`. No funciona.

### 7. Precedencia de operadores (orden de ejecución)

Los operadores NO se ejecutan todos en el mismo orden:

```
!  (negación)  → 1° (primero)
%  (módulo)    → 2°
==  (igualdad) → 3°
&&  (and)      → 4°
||  (or)       → 5° (último)
```

**Regla de oro:** si tenés dudas, **usá paréntesis**. `(i % 2 !== 0)` es más legible y no falla.

### 8. Comparar elementos adyacentes en un array

```js
for (let i = 0; i < array.length - 1; i++) {
  if (array[i] > array[i + 1]) return false;
}
```

Usá SIEMPRE `length - 1`, porque el último elemento no tiene "siguiente".

---

## 🐛 REGISTRO DE FALLOS Y MEJORAS

Cada error con: ❌ fallo original → ✅ mejora → 🧠 teoría relacionada

---

### Fallo 1: `sumarPares`

**❌ Código original:**
```js
if (i % 2 == 0) suma++;    // cuenta cuántos pares hay, no suma valores
```

**✅ Mejora:**
```js
if (i % 2 == 0) suma += i; // acumula el valor de cada par
```

**🧠 Teoría:** `++` suma 1 (contar). `+=` suma cualquier valor (acumular). Son operadores distintos con propósitos distintos. → Ver teoría #5

**Estado:** 🔁 Repasar

---

### Fallo 2: `contarPalabras`

**❌ Código original:**
```js
return numero - 1;  // "Hola mundo" → 1 espacio → devuelve 0
```

**✅ Mejora:**
```js
return numero + 1;  // "Hola mundo" → 1 espacio → devuelve 2
```

**🧠 Teoría:** Las palabras en una frase son **espacios + 1**. Si el string está vacío, devolver 0 antes del loop (early return). → Ver teoría de indexado #3

**Estado:** 🔁 Repasar

---

### Fallo 3: `filtrarMayores`

**❌ Código original:**
```js
if (item.length > limite)  // los números NO tienen .length
```

**✅ Mejora:**
```js
if (item > limite)
```

**🧠 Teoría:** `.length` existe en strings y arrays, NO en números. Hacer `.length` en un número da `undefined`, y `undefined > 5` es `false` silenciosamente. → Ver teoría #4

**Estado:** ✅ Completado

---

### Fallo 4: `esPalindromo`

**❌ Código original:**
```js
string.reverse()  // no existe en strings
```

**✅ Mejora:**
```js
string.split("").reverse().join("")
```

**🧠 Teoría:** `.reverse()` es método de **arrays**, no de strings. Para invertir un string: convertilo a array con `split("")`, invertí el array, volvé a string con `join("")`. → Ver teoría #2

**Estado:** ✅ Completado

---

### Fallo 5: `contarMayusculas`

**❌ Código original:**
```js
if (letra === letra.toUpperCase()) contador++;  // espacios también pasan
```

**✅ Mejora:**
```js
if (letra === letra.toUpperCase() && letra !== " ") contador++;
```

**🧠 Teoría:** `" ".toUpperCase()` devuelve `" "` — los espacios no tienen mayúscula/minúscula, pero la comparación da `true`. Siempre filtrar casos borde. → Relacionado con teoría de tipos #4

**Estado:** ✅ Completado

---

### Fallo 6: `numerosImpares`

**❌ Código original:**
```js
for (let i = 1; i < n; i++)  // no procesa el valor n
```

**✅ Mejora:**
```js
for (let i = 1; i <= n; i++) // incluye a n
```

**🧠 Teoría:** `<` excluye el límite. `<=` lo incluye. Visual: cuando `i = n`, la condición `n < n` es `false` y el loop termina sin ejecutar el cuerpo. → Concepto de off-by-one

**Estado:** 🔁 Repasar

---

### Fallo 7: `estaOrdenado`

**❌ Código original:**
```js
if (array[i] + 1 < array[i]) return false;  // NUNCA es true
```

**✅ Mejora:**
```js
if (array[i] > array[i + 1]) return false;
```

**🧠 Teoría:** `n + 1` siempre es mayor que `n`. Esa condición es imposible. Lo que necesitás es comparar cada elemento con **el que le sigue** (`array[i] > array[i + 1]`). Y el loop va hasta `length - 1`. → Ver teoría #8

**Estado:** 🔁 Repasar

---

### Fallo 8: `esPrimo`

**❌ Código original:**
```js
if (numero % numero == 0 && numero % 1 == 0) return true;  // siempre true
```

**✅ Mejora:**
```js
if (n < 2) return false;
for (let i = 2; i < n; i++) {
  if (n % i === 0) return false;  // encontró un divisor → no es primo
}
return true;  // ningún divisor → es primo
```

**🧠 Teoría:** `n % n == 0` es cierto para TODO número (todo número es divisible por sí mismo). Lo que necesitás verificar es que **ningún** número entre 2 y n-1 lo divida exactamente. → Ver teoría del operador `%` #1

**Estado:** 🔁 Repasar

---

### Fallo 9: `limpiarEspacios`

**❌ Código original:**
```js
let count = 0;
string.split("").forEach(letra => {
  if (letra == " ") count++;
  if ((letra == " " && count < 1) || letra != " ") resultado.push(letra);
});
// count nunca se reinicia, count < 1 nunca es true después del primer espacio
```

**✅ Mejora:**
```js
for (let i = 0; i < string.length; i++) {
  if (string[i] === " " && string[i - 1] === " ") continue; // salto
  resultado += string[i];
}
```

**🧠 Teoría:** Un contador global que solo suma no sirve para detectar repetición local. Lo que necesitás es **mirar el caracter anterior** con `string[i - 1]`. Si el actual es espacio y el anterior también, saltalo. → Ver teoría #3

**Estado:** ⏳ Pendiente

---

# 🌙 TARDE — JS · 02/08/2026 (Día 02 — Arrays + Métodos)

### Fallo 10: `promedioAprobados` — los arrays SIEMPRE son truthy

**❌ Código original:**
```js
if (!estudiantes.filter(n => n.nota >= 5)) return null;  // nunca dispara
```

**✅ Mejora:**
```js
let cont = 0;
estudiantes.forEach(estudi => {
  if (estudi.nota >= 5) { suma += estudi.nota; cont++; }
});
return cont === 0 ? null : suma / cont;
```

**🧠 Teoría:** `filter()` devuelve un array, y los arrays (incluso vacíos) son **siempre truthy**. `![]` es `false` → el `if` nunca corre. Para detectar vacío: `array.length === 0` (o contar aprobados dentro del loop, patrón E12). Además: `filter` no modifica el original ni sirve como condición por sí solo.

**Estado:** 🔁 Repasar

---

# 🌙 TARDE — JS · 05/08/2026 (Día 05 — Repaso retención)

### Fallo 11: `frecuenciaCaracteres` — `return` dentro del loop

**❌ Código original:**
```js
function frecuenciaCaracteres(texto) {
  let lista = {};
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === " ") continue;
    if (lista[texto[i]])
      lista[texto[i]]++;
    else
      lista[texto[i]] = 1;
    return lista;  // sale en la primera iteración
  }
}
```

**✅ Mejora:**
```js
function frecuenciaCaracteres(texto) {
  let lista = {};
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === " ") continue;
    if (lista[texto[i]])
      lista[texto[i]]++;
    else
      lista[texto[i]] = 1;
  }
  return lista;  // fuera del loop, al nivel de la función
}
```

**🧠 Teoría:** un `return` dentro de un loop solo sirve para salir ANTES de tiempo (encontré lo que buscaba / error). Si querés el resultado de recorrer TODO, el `return` va DESPUÉS de la llave del for. Antídoto: trace mental con un caso simple antes de guardar — si en la primera vuelta ya salís de la función, el loop no va a terminar.

**Estado:** ✅ Completado

### Fallo 12: `agruparPorLetra` — guard de espacios "copiado" + naming

**❌ Código original:**
```js
if (palabras[i][0] === " ") continue;  // el enunciado no pide ignorar espacios acá
```

**🧠 Teoría:** el `continue` para espacios venía "copiado" del R1, donde SÍ tenía sentido. Acá el enunciado no lo pide → código extra = comportamiento imprevisto (una palabra que arranque con espacio se descartaría silenciosamente). Regla: el código debe hacer exactamente lo que pide el enunciado, ni más ni menos. También naming: `lista` no describe un objeto de grupos → mejor `grupos`.

**Estado:** ✅ Completado

---

### Fallo 13: `ordenarPorPrecio` (bubble sort) — incoherencia swap vs condición

**❌ Código original (2° intento):**
```js
for (let j = 0; j < productos.length; j++) {       // falta length - 1
  if (productos[j].precio > productos[j + 1].precio) {
    valor = productos[i];                          // compara j pero swapea i
    productos[i] = productos[i + 1];
  }
}
```

**✅ Mejora:**
```js
for (let i = 0; i < productos.length; i++) {
  for (let j = 0; j < productos.length - 1; j++) {
    if (productos[j].precio > productos[j + 1].precio) {
      valor = productos[j];
      productos[j] = productos[j + 1];
      productos[j + 1] = valor;
    }
  }
}
```

**🧠 Teoría:**
1. **Swap y condición deben usar LOS MISMOS índices.** "Lo que comparás, lo que intercambiás" — si detectás que (j, j+1) está desordenado, intercambiás (j, j+1), no otra pareja.
2. **Comparar adyacentes → loop hasta `length - 1`** (el último no tiene siguiente; `productos[length]` es `undefined` → `undefined.precio` revienta). Mismo gotcha que Fallo 7 `estaOrdenado`.
3. **El `i` del loop externo no se usa** — no es error. El externo es la "máquina de repeticiones": cada pasada empuja el mayor al final como una burbuja. Una sola pasada no alcanza. Optimización posible: `j < length - 1 - i` (los últimos i ya quedaron ordenados).

**Estado:** ✅ Completado

---

# 🌙 MAÑANA — JS · 10/08/2026 (Día 10 — Objetos)

### Fallo 14: `clavesConValor` — los pares de `Object.entries` son arrays, no objetos

**❌ Intentos previos:**
```js
return lista.filter(valorBuscado);                     // filter necesita una función, no un valor suelto
return lista.filter(n => n.values === valorBuscado);    // los pares NO tienen propiedad .values
return Object.keys(buscados);                           // Object.keys sobre un array da sus índices (0,1...), no las claves de adentro
```

**✅ Versión final (con guía):**
```js
function clavesConValor(objeto, valorBuscado) {
  let lista = Object.entries(objeto);
  let buscados = lista.filter(([clave, valor]) => valor === valorBuscado);
  return buscados.map(([clave, valor]) => clave);
}
```

**🧠 Teoría:** `Object.entries()` devuelve un array de pares `[clave, valor]` — cada par ES un array de 2 posiciones (`par[0]` = clave, `par[1]` = valor), no un objeto con propiedades con nombre tipo `.values`. Se accede por índice o por destructuring (`([clave, valor]) => ...`), nunca con notación de punto. Y ojo: `Object.keys/values/entries` siempre operan sobre el objeto que les pasás directamente — si ya tenés un ARRAY (de pares, filtrado o no) y querés extraer algo de adentro de cada elemento, la herramienta es `map`/`filter` (arrays), no volver a llamar a `Object.keys` sobre ese array.

**Estado:** ✅ Completado (con guía paso a paso)

---

### Fallo 15: `jugadorGanador` — confundir la sintaxis de `reduce` y pensar que "acumular" es solo sumar

**❌ Intento 1:** creer que `reduce(acu, item)` es la forma de llamar a `reduce` (dos argumentos separados), en vez de pasarle UNA función callback que a su vez tiene esos dos parámetros.

**❌ Intento 2:** pensar que el acumulador de `reduce` solo sirve para sumar/agregar — no para comparar y quedarte con uno de los dos (patrón "buscar el mejor").

**❌ Intento 3 (el que rompía el código):** guardar el resultado de `.reduce()` sin valor inicial y recién ahí chequear si el sistema estaba vacío — pero `[].reduce(...)` sin inicial **explota antes** de llegar a ese chequeo.

```js
// ❌ el chequeo llega demasiado tarde
let ganador = players.reduce((mejor, i) => i[1] > mejor[1] ? i : mejor);  // 💥 TypeError si players=[]
return ganador ? ganador[0] : null;
```

**✅ Versión final:**
```js
function jugadorGanador(sistema) {
  let players = Object.entries(sistema);
  if (players.length === 0) return null;   // ✅ chequeo ANTES de reduce
  let ganador = players.reduce((mejor, i) => i[1] > mejor[1] ? i : mejor);
  return ganador[0];
}
```

**🧠 Teoría:** `reduce` recibe una función callback como argumento — `acumulador` y `elementoActual` son los PARÁMETROS de esa función, no argumentos sueltos de `reduce`. Y "acumular" no es sinónimo de sumar: el acumulador también sirve para comparar y elegir uno solo (patrón "buscar el mejor"), sin sumar ni agregar nada. Documentado en `docs/js/02-arrays/04-transformacion/index.md` (sección "Acumular no es sinónimo de sumar"). Además, sin valor inicial, el chequeo de array vacío va SIEMPRE antes de llamar `reduce`, nunca como condición sobre el resultado.

**Estado:** ✅ Completado (con guía paso a paso)

---

# 🌙 TARDE — JS · 11/08/2026 (Día 11 — Callbacks + Closures)

### Fallo 16: `ejecutarSiPositivo` — callback recibido pero nunca invocado

**❌ Código original:**
```js
function ejecutarSiPositivo(numero, callback) {
   if(numero > 0) return numero * 2;   // hardcodea la operación, ignora "callback"
   return null;
}
```

**✅ Mejora:**
```js
function ejecutarSiPositivo(numero, callback) {
  if (numero <= 0) return null;
  return callback(numero);
}
```

**🧠 Teoría:** el parámetro `callback` estaba en la firma pero nunca se llamaba — el código hardcodeaba `numero * 2` en su lugar. Pasó el test de casualidad porque el callback de prueba era justo `n => n * 2`; con cualquier otro callback hubiera fallado. Mismo patrón "acierta por casualidad" que E1/E5/P3 del Día 10, aplicado ahora a un parámetro-función en vez de a una condición.

**Estado:** 🔁 Repasar

---

### Fallo 17: `repetir` — off-by-one, recurrencia del Fallo 6

**❌ Código original:**
```js
for (let i = 0; i < n - 1; i++) {   // corta un paso antes de tiempo
  array.push(callback(i));
}
```

**✅ Mejora:**
```js
for (let i = 0; i < n; i++) {
  array.push(callback(i));
}
```

**🧠 Teoría:** mismo gotcha que el Fallo 6 (`numerosImpares`, 25/07). `i < n` ya excluye `n` por el propio `<` — restar `-1` a mano excluye el límite dos veces. El enunciado "desde 0 hasta n-1" describe el ÚLTIMO VALOR que toma `i`, no un ajuste que haya que hacer en la condición del loop. → Ver teoría #off-by-one.

**Estado:** 🔁 Repasar (segunda vez que aparece — reforzar antes del próximo bloque de loops)

---

# 🌙 MAÑANA — JS · 13/08/2026 (Día 13 — Métodos Avanzados)

### Fallo 26: `posicionDe` — `??` aplicado a `findIndex()`, que nunca es nullish

**❌ Código original:**
```js
function posicionDe(usuarios, id) {
  return usuarios.findIndex(e => e.id === id) ?? undefined;
}
```

**✅ Mejora:**
```js
function posicionDe(usuarios, id) {
  return usuarios.findIndex(e => e.id === id);
}
```

**🧠 Teoría:** `findIndex()` SIEMPRE devuelve un número — nunca `null` ni `undefined`, ni siquiera cuando no encuentra nada (ahí devuelve `-1`). El `?? undefined` no hacía nada: no hay ningún valor nullish a la izquierda que reemplazar, es código muerto. Y aunque hubiera actuado, habría sido el resultado equivocado: el enunciado pedía `-1` como "no encontrado" (lo que `findIndex` ya devuelve solo), no `undefined` — ese es el sentinel de `find()`, un método distinto. Cada método de búsqueda tiene su propio "no encontrado" (`find` → `undefined`, `findIndex` → `-1`, `indexOf` → `-1`, `includes` → `false`): no son intercambiables. Pasó el test igual, por casualidad — mismo patrón de "código que acierta sin responder la pregunta real" que los Fallos 10 y 16.

**Estado:** ✅ Corregido (explicado en el momento)

---

### Fallo 27: `crearContadorConThis` — arrow function como método (pierde `this`) + postfix/prefix confundidos

**❌ Código original (intentos sucesivos):**
```js
// Intento 1 — arrow function COMO el método: no tiene this propio,
// hereda el de crearContadorConThis, no el del objeto devuelto
incrementar: () => this.valor++

// Intento 2 — invocación correcta (IIFE), pero this.valor++ es postfix:
// devuelve el valor VIEJO, la secuencia sale 0, 1, 2 en vez de 1, 2, 3
return (() => this.valor++)();

// Intento 3 — compensó el postfix arrancando valor en 1, en vez de
// arreglar el operador, y de paso se comió el incremento entero
valor: 1,
incrementar: function() {
  return (() => this.valor)();
}
```

**✅ Mejora:**
```js
function crearContadorConThis() {
  return {
    valor: 0,
    incrementar: function() {
      return (() => ++this.valor)();
    }
  };
}
```

**🧠 Teoría (dos conceptos en el mismo ejercicio):**

1. **Arrow function como método pierde el `this` que hace falta:** un objeto literal (`{ }`) no crea contexto de `this` propio. Una arrow definida directo como propiedad hereda el `this` de donde se DEFINIÓ (el cuerpo de `crearContadorConThis`), no el objeto que se está devolviendo — que en ese momento ni siquiera terminó de construirse como tal. `incrementar` necesita ser un `function` normal (ahí sí `this` es el objeto, porque se llama como `c.incrementar()`), y la arrow va ANIDADA adentro, heredando ese `this` correcto por closure.
2. **Postfix (`this.valor++`) vs. prefix (`++this.valor`):** el mismo gotcha del Fallo 26 pero en un operador distinto — `this.valor++` devuelve el valor de ANTES de sumar. Con `valor` arrancando en `0`, la primera llamada daba `0` en vez de `1`. `++this.valor` devuelve el valor YA sumado. Compensarlo arrancando `valor` en `1` "funcionaba" matemáticamente para la secuencia del test, pero rompía el significado real del estado (`c.valor` mostraría `1` en un contador recién creado que todavía no contó nada) — arreglar el síntoma en vez de la causa. Teoría completa, con tabla comparativa y demo en vivo, ahora en [Operadores](/js/01-basico/02-operadores/) (sección nueva, creada a partir de este fallo).

**Estado:** ✅ Corregido (varios intentos, con guía)

---

## ✅ PATRONES QUE DOMINO

- `forEach` para recorrer arrays
- `split("")` + `reverse()` + `join("")` para invertir caracteres
- `includes()` para detectar duplicados
- `.toLowerCase()` para comparación case-insensitive
- Acumulador con `suma += n` en loop/forEach
- Early return para arrays vacíos
- Usar `&&` para múltiples condiciones en un if
- Closures (11/08): "variable afuera + función que la recuerda" — resuelto sin fallos en `crearContador`, `crearContadorDesde`, `crearAcumulador` (E3, E4, E6 del Día 11)
- `some`/`every`/`find` (13/08): elegir el método correcto según qué pregunta hace falta responder — resuelto sin fallos en `hayAlgunoCaro`, `todosDisponibles`, `buscarPorId`, `hayHuecos` (4/5 del Grupo 1, Día 13)
- Spread para no mutar (13/08): `{...obj, clave: valor}` y `[...arr, item]` — resuelto sin fallos en `duplicarPuntuacion` y `agregarItem` (Grupo 2, Día 13), y predicción correcta de valor/referencia en `predecirValorFinal`

## ⚠️ PATRONES QUE NECESITO REFORZAR

### `this` (nuevo, 13/08)
- **Arrow function como método pierde el `this` correcto:** un objeto literal no crea contexto de `this` — una arrow definida directo como propiedad hereda el `this` de donde se DEFINIÓ, no el objeto que la contiene. Si un método necesita `this` apuntando al objeto, tiene que ser `function` normal; la arrow (si hace falta) va anidada ADENTRO de ese método, nunca en su lugar.
- **Antes de escribir un método, preguntarme:** "¿este método se va a llamar como `objeto.metodo()`, o se puede sacar suelto?" — si puede sacarse suelto (pasarlo como callback, por ejemplo), `this` se pierde salvo que use arrow/closure en vez de depender de `this`. Ver Fallos 26 y 27, y la teoría en [Operadores](/js/01-basico/02-operadores/) y [`this`](/js/03-objetos/06-this/).

### Postfix vs. prefix (nuevo, 13/08)
- **`x++`/`this.algo++` devuelve el valor VIEJO. `++x`/`++this.algo` devuelve el valor NUEVO.** Si una función necesita devolver "el valor ya actualizado", usar SIEMPRE prefix — postfix da el resultado de la llamada anterior, un paso atrás, sin ningún error que lo avise. Reincidió con `this.valor` en el Fallo 27, mismo mecanismo que el operador simple.

### Bucles
- **Off-by-one:** al definir un loop, preguntarme "¿incluyo o excluyo el límite?" → `<` vs `<=`. Reincidió el 11/08 (Fallo 17, `repetir`): `i < n` ya excluye `n` por sí solo, no hace falta restar `-1` a mano — el enunciado "hasta n-1" describe el último valor de `i`, no un ajuste de la condición.

### Condiciones que aciertan por casualidad (nuevo, 10/08)
- **Chequear la variable equivocada:** antes de escribir un `if`/ternario para "¿está vacío?" o "¿existe?", preguntarme *"¿esta condición responde literalmente la pregunta, o solo da el resultado correcto por casualidad matemática?"* — pasó 3 veces en un mismo día (E1, E5, P3 del 10/08): chequear un valor derivado (`propiedades.length !== 0`, la suma total) en vez de la propiedad real (`.length === 0`, `sistema[jugador]`).
- **`??` + operaciones aritméticas:** cuando combino `??` con `+`/`-`/etc, usar paréntesis explícitos SIEMPRE — `??` tiene menos precedencia, y `undefined ?? 0` seguido de operación puede dar `NaN` en vez del default esperado si no encierro `(valor ?? default)` antes de operar.

### Operadores
- **`!` ≠ `!==`:** `!` niega un booleano. `!==` pregunta "es distinto". No confundirlos.
- **Precedencia:** usar paréntesis cuando haya dudas. `(i % 2 !== 0)` y no `!i % 2`

### Tipos
- **`.length`** solo en strings y arrays. Los números NO lo tienen.
- **Casos borde:** espacios en `toUpperCase()`, strings vacíos, arrays de 1 elemento.

### Lógica
- **Mirar "para atrás":** `array[i-1]` o `string[i-1]` para contexto local.
- **Primos:** si encuentro un divisor → no es primo. Si termino el loop sin encontrar → es primo.
- **Adyacentes:** comparar `array[i]` con `array[i+1]`, loop hasta `length - 1`.

### Objetos
- **Los pares de `Object.entries()` son arrays, no objetos:** `[clave, valor]` se accede por índice (`par[0]`/`par[1]`) o destructuring, nunca con `.values` ni notación de punto inventada.
- **`Object.keys/values/entries` operan sobre lo que les pasás directamente:** si ya tenés un array (filtrado, mapeado) y necesitás algo de adentro de cada elemento, la herramienta es `map`/`filter`, no volver a llamar `Object.keys` sobre ese array.

### Búsqueda en arrays (nuevo, 13/08)
- **Cada método de búsqueda tiene su propio "no encontrado":** `find` → `undefined`, `findIndex`/`indexOf` → `-1`, `includes` → `false`. No mezclarlos ni "defenderse" con `??` sobre un método que nunca da nullish (`findIndex` jamás es `null`/`undefined`) — antes de poner `?? algo`, preguntarme "¿este método puede devolver null o undefined de verdad?".

---

<!-- ============================================= -->
<!-- SYMFONY                                        -->
<!-- ============================================= -->
# 🐘 SYMFONY · 12/08/2026 (Repaso Fundamentos + Ejercicios)

## 🐛 REGISTRO DE FALLOS Y MEJORAS

---

### Fallo 18: `TareasController::index` — nombre de variable que miente sobre su tipo

**❌ Código original:**
```php
public function index(TareaRepository $tarea): Response
{
    $lista = $tarea->findAll();
```

**✅ Mejora:**
```php
public function index(TareaRepository $tareaRepository): Response
{
    $lista = $tareaRepository->findAll();
```

**🧠 Teoría:** el parámetro no era una `Tarea`, era el `TareaRepository` completo — el nombre `$tarea` (singular) sugería una entidad, cuando en realidad daba acceso a todas. Primer instinto fue `$em` (convención de `EntityManagerInterface`, un tipo distinto con otra responsabilidad: persist/flush/remove), después `$repository` (válido pero pierde de qué entidad es — colisiona si el controller crece con más repositorios). El nombre correcto cuenta la misma historia que el tipo: `$tareaRepository`.

**Estado:** ✅ Completado

---

### Fallo 19: `TareasController::buscar` — ruta duplicada, barra faltante, ParamConverter no usado

**❌ Código original:**
```php
#[Route('/tareas{id}', name: 'app_tareas')]  // mismo name que el index, falta "/"
public function buscar(TareaRepository $tareaRepository, $id): Response
{
    $lista = $tareaRepository->find($id);   // patrón manual, sin comprobar null
```

**✅ Mejora:**
```php
#[Route('/tareas/{id}', name: 'tarea_id')]
public function buscar(Tarea $tarea): Response
{
    return $this->render('tareas/show.html.twig', ['tarea' => $tarea]);
```

**🧠 Teoría:** tres fallos en la misma línea. (1) Dos rutas no pueden compartir `name` — Symfony no arranca. (2) `/tareas{id}` sin `/` matchea `/tareas5`, no `/tareas/5`. (3) El wildcard `{id}` por defecto activa el ParamConverter/`EntityValueResolver`: declarar `Tarea $tarea` directo hace que Symfony llame `find($id)` y lance el 404 solo si no existe — el patrón manual (`find()` + `if(!$x)` + `createNotFoundException()`) ya no hace falta. Ver `docs/symfony/00-fundamentos/04-doctrine/02-repository-entitymanager/index.md#paramconverter`.

**Estado:** ✅ Completado

---

### Fallo 20: `index.html.twig` — variable inexistente, `for` invertido, objeto sin propiedad

**❌ Código original:**
```twig
{% for tareas in tarea %}
    <li>{{tarea}}</li>
{% else %}
    <p>No hay productos a mostrar</p>
{%endfor%}
```

**✅ Mejora:**
```twig
{% for tarea in lista %}
    <li>{{tarea.title}}</li>
{% else %}
    <p>No hay tareas a mostrar</p>
{%endfor%}
```

**🧠 Teoría:** tres fallos en una línea. (1) `tarea` no existía en el contexto — el controller pasa `lista`, no `tarea`. (2) El `for` estaba invertido: `tareas` (plural) era la variable de vuelta y `tarea` (singular) la supuesta colección — al revés de la convención `for item in coleccion`. (3) `{{ tarea }}` imprime el objeto `Tarea` entero, que no tiene `__toString()` — hace falta acceder a una propiedad (`tarea.title`).

**Estado:** ✅ Completado

---

### Fallo 21: `show.html.twig` — copiar el `for` de la lista a una plantilla de un solo objeto (reincidencia del Fallo 20)

**❌ Código original:**
```twig
{% for tarea in lista %}
    <li>{{ tarea.title }}</li>
    {% if tarea.done %}...{% endif %}
{% else %}
    <p>No hay tareas a mostrar</p>
{% endfor %}
```

**✅ Mejora:**
```twig
<li>{{ tarea.title }}</li>
{% if tarea.done %}
    <p>✅ Hecha</p>
{% else %}
    <p>⏳ Pendiente</p>
{% endif %}
```

**🧠 Teoría:** `show.html.twig` nació de duplicar `index.html.twig` en VS Code (incluso quedó con el nombre `show.html copy.twig` al principio) y el `for`/`lista` no se adaptó al nuevo contexto. La pregunta que faltó hacerse: **¿qué le pasa el controller a esta plantilla — un array o un objeto?** `index()` pasa `lista` (array → hace falta `for`). `buscar()` pasa `tarea` (un objeto único, ya resuelto por ParamConverter → **nunca** hace falta `for`, ya lo tenés "en la mano"). Reincidió porque venía de una copia literal, no de pensar el caso de nuevo — mismo patrón de reincidencia que Fallo 6 → Fallo 17 (off-by-one).

**Estado:** 🔁 Repasar

---

### Fallo 22: `crear()` — cadena de errores acumulados (EntityManager, primera vez)

**❌ Código original (varios intentos):**
```php
public function crear(Request $request, EntityManagerInterface $em, Tarea $tarea): Response  // ❌ falta use Tarea/Request, param Tarea de más
{
    $titulo = $request->get('title');                    // ❌ ->get() ambiguo, pedía ->query->get()
    $tarea = new Tarea();
    $tarea->setTitle($titulo);
    $tarea->setDone(false);
    $tarea->setCreatedAt(new \DateTimeInmutable());       // ❌ typo: es Immutable, no Inmutable
    $em->persist($tarea);
    $em->flush();
    return "tarea creada!";                               // ❌ string suelto, el método declara : Response
}
```
Ruta: `#[Route('/tareas/crear', name: 'tarea_crear', method: 'POST')]` — ❌ es `methods` (plural), no `method`.

**✅ Mejora:**
```php
#[Route('/tareas/crear', name: 'tarea_crear', methods: 'POST')]
public function crear(Request $request, EntityManagerInterface $em): Response
{
    $titulo = $request->query->get('title');
    $tarea = new Tarea();
    $tarea->setTitle($titulo);
    $tarea->setDone(false);
    $tarea->setCreatedAt(new \DateTimeImmutable());
    $em->persist($tarea);
    $em->flush();
    return $this->redirectToRoute('app_tareas');
}
```

**🧠 Teoría:** primer uso del EntityManager en el proyecto, y salieron todos los detalles nuevos de una vez: (1) `Tarea $tarea` como parámetro de más — sin `{id}` en la ruta, Symfony no tiene de dónde resolverlo vía ParamConverter, tira 500 antes de ejecutar el método. (2) faltaban los `use` de `Tarea` y `Request`. (3) `DateTimeInmutable` — el nombre de la clase PHP es en inglés, `Immutable`. (4) el método declara `: Response`, devolver un `string` suelto es `TypeError`. (5) el atributo `#[Route]` usa `methods` (plural, `array|string`) — `method` no es un parámetro válido del constructor, PHP lo rechaza al cargar la ruta.

**Estado:** ✅ Completado

---

### Fallo 23: `completar()` — ruta con llave de más + `flush()` sin EntityManager (fallo silencioso)

**❌ Código original:**
```php
#[Route('/tareas/{id}/completar}', name: 'tarea_completada', methods: 'POST')]  // ❌ llave de más al final
public function tareaCompletada(Tarea $tarea): Response
{
    $tarea->setDone(true);
    flush();                                                                     // ❌ función global de PHP, no Doctrine
    return $this->redirectToRoute('app_tareas');
}
```

**✅ Mejora:**
```php
#[Route('/tareas/{id}/completar', name: 'tarea_completada', methods: 'POST')]
public function tareaCompletada(Tarea $tarea, EntityManagerInterface $em): Response
{
    $tarea->setDone(true);
    $em->flush();
    return $this->redirectToRoute('app_tareas');
}
```

**🧠 Teoría:** `flush()` sin `$em->` es una función real de PHP (vaciar el buffer de salida) — no tira error, así que el bug es silencioso: `setDone(true)` cambia el objeto en memoria, pero como nunca se llama al `flush()` de Doctrine, el `UPDATE` nunca llega a la base de datos. Parece funcionar (no hay excepción) pero no persiste nada. Faltaba inyectar `EntityManagerInterface $em` en la firma del método.

**Estado:** ✅ Completado

---

### Fallo 24: `findPendientes()` — placeholder confundido con la propiedad, alias equivocado, límite no pedido

**❌ Código original (varios intentos):**
```php
->andWhere('n.done = :valor')
->setParameter('n.done')              // ❌ el placeholder se llama "valor" (por :valor), no "n.done"; falta el 2° argumento
```
```php
->orderBy('t.id', 'ASC')              // ❌ alias "t" no existe (el alias es "n"); pedía createdAt DESC, no id ASC
->setMaxResults(10)                   // ❌ no lo pedía el enunciado — corta la lista en silencio si hay más de 10
```
```php
->orderBy('n.createdAt', 'DES')       // ❌ typo, falta la C: es DESC
```

**✅ Mejora:**
```php
public function findPendientes(): array
{
    return $this->createQueryBuilder('n')
        ->andWhere('n.done = :valor')
        ->setParameter('valor', false)
        ->orderBy('n.createdAt', 'DESC')
        ->getQuery()
        ->getResult();
}
```

**🧠 Teoría:** el placeholder (`:valor`) es un nombre arbitrario que vos elegís al escribir el `where()` — no tiene relación con la propiedad que se compara (`n.done`). `setParameter` rellena por ese nombre, con el valor que pide la lógica de negocio (`findPendientes` → `done = false`, no `true`). Aparte, el alias usado en `orderBy`/`where` tiene que ser el mismo que se definió en `createQueryBuilder('n')` — usar otro alias que no existe rompe la consulta.

**Estado:** ✅ Completado

---

### Fallo 25: `include` de Twig — `extends` en un parcial (circular) + ruta de más + shorthand inválido

**❌ Código original:**
```twig
{# _item.html.twig #}
{% extends 'index.html.twig' %}     {# ❌ un parcial para incluir no extiende nada; esto sería circular #}
    <li>{{tarea.title}}</li>
    ...
```
```twig
{# index.html.twig #}
{% include 'templates/tareas/_item.html.twig' with {tarea} %}
{# ❌ Twig ya busca dentro de templates/, no hace falta repetirlo #}
{# ❌ {tarea} es shorthand de objetos de JS — Twig exige {tarea: tarea} #}
```

**✅ Mejora:**
```twig
{# _item.html.twig — sin extends, es solo el fragmento #}
<li>{{tarea.title}}</li>
{% if tarea.done %}...{% endif %}
```
```twig
{% include 'tareas/_item.html.twig' with {tarea: tarea} %}
```

**🧠 Teoría:** `extends` hereda la estructura ENTERA de una plantilla (para páginas completas); `include` inserta un fragmento chico en un punto cualquiera. Un parcial pensado para `include` nunca lleva `extends` — y en este caso además hubiera sido circular (`index` incluye a `_item`, `_item` extiende a `index`). Las rutas de Twig son relativas a `templates/`, nunca hay que repetir ese prefijo. Y Twig no tiene shorthand de objetos como JS (`{tarea}` → `{tarea: tarea}`) — siempre `clave: valor` explícito.

**Estado:** ✅ Completado

---

## ✅ PATRONES QUE DOMINO (Symfony)

- `make:entity` — flujo interactivo, tipos y longitudes correctos a la primera (`Tarea`: `title`, `done`, `createdAt`)
- Migraciones: generar y correr sin errores, tabla verificada contra la Entity
- Distinción EntityManager (persist/flush/remove) vs Repository (find/findAll/findBy) — aplicada correctamente sin mezclar responsabilidades
- ParamConverter con wildcard `{id}` — una vez visto el ejemplo, lo aplicó bien a la primera en `buscar()`
- `remove()` + `flush()` (Ejercicio 8, borrar tarea) — correcto a la primera, sin fallos, aplicando el patrón ya aprendido en `completar()`

## ⚠️ PATRONES QUE NECESITO REFORZAR (Symfony)

### Twig — colección vs. objeto único
- **Antes de escribir `{% for %}`, preguntar: ¿qué variable me pasa el controller, y es un array o un objeto?** Si el controller hace `render(..., ['tarea' => $tarea])` con un solo objeto, no hay nada que recorrer — usar la variable directo. El `for` es solo para arrays (`findAll()`, `findBy()`). Reincidió por copiar una plantilla de lista sin repensar el caso → Fallo 20 → Fallo 21.

### Twig — `extends` vs `include`
- **`extends` hereda una estructura entera (páginas completas); `include` inserta un fragmento chico.** Un parcial para `include` nunca lleva `extends` — confundirlos puede crear referencias circulares (Fallo 25).

### Doctrine — `$em->flush()` sin `$em` no avisa
- **`flush()` sin `$em->` es una función real de PHP (buffer de salida), no un error.** El cambio en memoria (`setDone(true)`, etc.) se pierde en silencio si no se llama al `flush()` del EntityManager inyectado. Revisar SIEMPRE que el método reciba `EntityManagerInterface $em` cuando modifica una entidad (Fallo 23).

### Doctrine — placeholder de QueryBuilder ≠ nombre de propiedad
- **El nombre en `:algo` (where) y en `setParameter('algo', valor)` es arbitrario, elegido por vos** — no tiene relación con la propiedad de la Entity que estás comparando. El valor que rellena el placeholder lo decide la lógica de negocio del método (`findPendientes` → `false`), no el nombre de la propiedad (Fallo 24).

---

*Próxima sesión: Messenger (según roadmap original). Los fundamentos base (Entity, Repository, ParamConverter, EntityManager crear/completar/borrar, QueryBuilder, include/filtros de Twig) quedaron todos ejercitados. Antes de arrancar contenido nuevo, warm-up corto (5-10min) repasando "for vs. objeto único" en Twig (Fallo 20/21), que fue el único punto que reincidió. Ejercicio 11 (filtros Twig — `length`, `date()`) quedó pendiente por falta de tiempo, no por dificultad — retomarlo al principio de la próxima sesión antes de Messenger.*