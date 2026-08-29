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

# 🌙 TARDE — JS · 20/08/2026 (Día 19-20 — DOM: Manipulación, Eventos, Formularios)

## 🐛 REGISTRO DE FALLOS Y MEJORAS

---

### Fallo 37: `datosProductoCard` — variable sin declarar (fuga global)

**❌ Código original:**
```js
function datosProductoCard(tarjeta) {
  let precio = parseFloat(tarjeta?.dataset?.precio)
  let categoria = tarjeta?.dataset?.categoria
  let stock = parseInt(tarjeta?.dataset?.stock)
  producto = {precio: precio, categoria: categoria, stock: stock}  // ❌ sin let/const
  return producto;
}
```

**✅ Mejora:**
```js
const producto = {precio: precio, categoria: categoria, stock: stock}
```

**🧠 Teoría:** omitir `let`/`const` no tira error — crea una variable **global implícita**. En este archivo de ejercicios es particularmente grave: las 15 funciones comparten el mismo scope global del script, así que una fuga en una función puede pisar una variable del mismo nombre en otra función, sin ningún aviso. `const` por defecto evita esto de raíz.

**Estado:** ✅ Completado

---

### Fallo 38: `eliminarTarea` — bandera booleana reseteada dentro del propio loop

**❌ Código original:**
```js
items.forEach(e => {
  if(e.textContent === texto){
     e.remove()
     canvio = true;
  }else {
    canvio = false;   // ❌ pisa el true de una vuelta anterior si el item que sigue no matchea
  }
})
return canvio ? items.length -1 : items.length;  // items es NodeList estático, capturado antes de borrar
```

**✅ Mejora:**
```js
items.forEach(e => {
  if (e.textContent === texto) e.remove();
});
return lista.children.length;  // HTMLCollection viva, refleja el DOM ya mutado
```

**🧠 Teoría:** una bandera que marca "encontré algo" solo debería poder pasar de `false` a `true` — nunca volver atrás en una vuelta donde simplemente no hubo match (acá, el último `<li>` recorrido no coincidía y pisaba el `true` de la vuelta anterior). Más de fondo: cuando el propio DOM ya puede darte la respuesta directamente después de mutarlo (`lista.children.length`), no hace falta arrastrar estado manual (bandera + aritmética `-1`) para reconstruirla.

**Estado:** ✅ Completado

---

### Fallo 39: `activarArrastre` — `clientX` usado también para el eje Y (copiar/pegar sin ajustar)

**❌ Código original:**
```js
tarjeta.style.left = e.clientX + "px";
tarjeta.style.top = e.clientX + "px";   // ❌ debería ser clientY
```

**✅ Mejora:**
```js
tarjeta.style.left = e.clientX + "px";
tarjeta.style.top = e.clientY + "px";
```

**🧠 Teoría:** typo clásico de copiar una línea para el segundo eje y no cambiar la letra final — pasó desapercibido porque el test solo comprueba que la tarjeta "se movió", no el valor exacto de `top`. Revisar carácter por carácter cuando se duplica una línea casi idéntica. Relacionado: `screenX`/`screenY` (relativos a la pantalla física completa) no son lo mismo que `clientX`/`clientY` (relativos al viewport) — para posicionar con `style.left`/`top` siempre `clientX`/`clientY`.

**Estado:** ✅ Completado

---

### Fallo 40: `validarConfirmacionEmail` — marca el elemento equivocado + sin limpiar el estado de error

**❌ Código original:**
```js
function validarConfirmacionEmail(email, confirmarEmail) {
    if (email.value !== confirmarEmail.value) {
       email.setCustomValidity('Las contraseñas no coinciden');  // ❌ marca "email", el enunciado pide "confirmarEmail"
    }
    // ❌ sin else: una vez inválido, queda inválido para siempre
}
```

**✅ Mejora:**
```js
function validarConfirmacionEmail(email, confirmarEmail) {
    if (email.value !== confirmarEmail.value) {
       confirmarEmail.setCustomValidity('Los emails no coinciden');
    } else {
       confirmarEmail.setCustomValidity('');
    }
}
```

**🧠 Teoría:** dos fallos independientes en la misma función. (1) El campo que se marca inválido tiene que ser el que el enunciado señala explícitamente, no el primer parámetro que "está a mano". (2) `setCustomValidity()` deja el campo marcado como inválido de forma **permanente** hasta que se lo vuelve a llamar con `''` — sin el `else`, corregir el valor después nunca revierte el estado de error.

**Estado:** ✅ Completado

---

### Fallo 41: `renderizarProductos` (22/08) — `classList.add()` con string de varias clases + elemento sin insertar + condición sobre la propiedad equivocada

**❌ Código original (intento 1):**
```js
function renderizarProductos(contenedor, productos) {
  contenedor.classList.add("flex flex-col gap-2") // ❌ classList.add() no acepta un token con espacios (SyntaxError)

  productos.forEach(box => {
    let card = document.createElement("article")
    contenedor.appendChild(card);
    card.classList.add("flex flex-col gap-2") // ❌ mismo error, se repite

    // ...

    let esInferior = box.precio === 0 // ❌ compara el precio, el enunciado pide box.stock === 0
    let badge = document.createElement("span")
    badge.textContent = esInferior ? "Agotado" : "Disponible"
    badge.className = esInferior ? "..." : "..."
    // ❌ badge nunca se agrega a card — creado en memoria, invisible en el DOM
  })
}
```

**✅ Mejora:**
```js
function renderizarProductos(contenedor, productos) {
  productos.forEach(producto => {
    const card = document.createElement('article');
    card.className = 'product-card'; // className SÍ acepta el string completo con espacios

    // ...

    const sinStock = producto.stock === 0; // la propiedad que el enunciado señala, no otra derivada

    const badge = document.createElement('span');
    badge.className = 'stock-badge ...';
    card.appendChild(badge); // insertado en el árbol, ahora sí visible/testeable
  });
}
```

**🧠 Teoría:** tres fallos independientes. (1) `classList.add()` recibe cada clase como un ARGUMENTO separado — un token no puede tener espacios, y pasar un string con varias clases junto tira `SyntaxError` en runtime. `className = '...'` sí acepta el string completo, porque reemplaza el atributo entero de una vez en vez de sumar tokens uno a uno. (2) `document.createElement()` crea el nodo en memoria — no existe en la página (ni lo ve un test) hasta que se lo agrega con `appendChild()`/`append()`. (3) Reincidencia de "Condiciones que aciertan por casualidad" (10/08): comparar la propiedad derivada o "a mano" (`precio`) en vez de la que el enunciado señala explícitamente (`stock`).

**Estado:** ✅ Completado

---

### Fallo 42: `activarSeleccionMasiva` (22/08) — acumulador armado fuera del listener + comparación en vez de asignación

**❌ Código original (intento 1):**
```js
function activarSeleccionMasiva(contenedorTabla) {
  contenedorTabla.addEventListener("click", function(e){
    contenedorTabla.forEach(box => { // ❌ contenedorTabla no es iterable, es un único elemento
      e.target.id === "check-todos" ? box.checked : !box.checked // ❌ ternario suelto, no asigna nada
      e.target.type === "checkboxes" ? e.target.checked : !e.target.checked // ❌ "checkboxes" no existe
    })
  })
}
```

**✅ Mejora:**
```js
function activarSeleccionMasiva(contenedorTabla) {
  let inputs = contenedorTabla.querySelectorAll(".check-fila")
  let master = contenedorTabla.querySelector("#check-todos")

  contenedorTabla.addEventListener("change", function(e){
    let todos = true;
    if (e.target === master) {
      inputs.forEach(box => box.checked = master.checked)
    } else {
      inputs.forEach(box => { if (!box.checked) todos = false; })
      master.checked = todos;
    }
  })
}
```

**🧠 Teoría:** un acumulador (la bandera `todos`) declarado FUERA del listener corre una sola vez al montar la función, no en cada evento — tiene que vivir DENTRO del handler para reaccionar a cada cambio. Y `===`/un ternario que no se asignan a ningún lado no hacen nada: JS calcula el valor y lo descarta, hace falta `=` para que el resultado quede guardado.

**Estado:** ✅ Completado

---

### Fallo 43: `marcarPrimeraTarjetaAgotada` (22/08) — `dataset` siempre es string

**❌ Código original (intento 1):**
```js
if (card.dataset.stock === 0 && unica) { // ❌ "0" === 0 es false, dataset nunca es number
```

**✅ Mejora:**
```js
if (card.dataset.stock == 0 && unica) { // == sí compara con coerción; o Number(card.dataset.stock) === 0
```

**🧠 Teoría:** `element.dataset.X` devuelve SIEMPRE un string, sin importar que en el HTML parezca un número (`data-stock="0"` da el string `"0"`, no `0`). Comparar con `===` contra un literal numérico nunca coincide sin convertir antes.

**Estado:** ✅ Completado

---

### Fallo 44: `activarAcordeon` (22/08) — `classList.toggle()` devuelve el resultado invertido de lo esperado

**❌ Código original (intento 2):**
```js
e.target.ariaExpanded = e.target.nextElementSibling.classList.toggle("hidden");
// ❌ toggle() da true cuando "hidden" queda PRESENTE (cerrado) — lo contrario de "expandido"
```

**✅ Mejora:**
```js
e.target.ariaExpanded = !e.target.nextElementSibling.classList.toggle("hidden");
```

**🧠 Teoría:** `classList.toggle()` devuelve `true` si la clase terminó PRESENTE en el elemento. Cuando esa clase (`hidden`) es la negación semántica de lo que hay que comunicar (`aria-expanded`, "está visible"), el resultado hay que invertirlo con `!` antes de usarlo.

**Estado:** ✅ Completado

---

### Fallo 45: `filtrarListaEnVivo` (22/08) — `.includes('')` aplicado al lado equivocado de la comparación

**❌ Código original (camino hasta la versión final):**
```js
let valor = e.target.value.toLowerCase().includes(""); // ❌ valor termina siendo `true`, se pierde el texto
contenedorItems.forEach(x => { // ❌ contenedorItems no es iterable directamente (mismo bug que Fallo 42)
  x.dataset.nombre.toLowerCase() === valor // ❌ === exige igualdad exacta, y compara contra un booleano
    ? x.classList.remove("hidden") : x.classList.add("hidden")
})
```

**✅ Mejora:**
```js
let valor = e.target.value.toLowerCase();
contenedorItems.querySelectorAll(".item-lista").forEach(x => {
  x.dataset.nombre.toLowerCase().includes(valor) ? x.classList.remove("hidden") : x.classList.add("hidden")
})
```

**🧠 Teoría:** un string vacío es subcadena de CUALQUIER string, así que `nombre.includes('')` da `true` para todos — ese comportamiento sale de usar el texto de búsqueda como ARGUMENTO de `.includes()` en la comparación real contra cada ítem, no de llamarlo aparte sobre el propio texto buscado. Y `.includes()` (contiene) no es lo mismo que `===` (es exactamente igual).

**Estado:** ✅ Completado

---

### Fallo 46: `activarStepperCarrito` (22/08) — `.Number()` no existe + `if` sin llaves

**❌ Código original (intento 1):**
```js
let num = spanCantidad.textContent.Number() // ❌ TypeError: Number no es un método de string

if (num > 0)
  num--;
  spanCantidad.textContent = num; // ❌ esta línea NO está dentro del if, aunque la indentación lo sugiera
```

**✅ Mejora:**
```js
let num = Number(spanCantidad.textContent) // Number() es una función global, recibe el valor como argumento

if (num > 0) {
  num--;
  spanCantidad.textContent = num;
}
```

**🧠 Teoría:** `Number(valor)` es una función GLOBAL, no un método sobre los strings. Y un `if` sin `{}` solo controla la línea siguiente — JS no lee la indentación, así que cualquier línea extra "adentro" visualmente en realidad corre siempre, sea cual sea el resultado de la condición.

**Estado:** ✅ Completado

---

### Fallo 47: `activarCierreModalFuera` (22/08) — comparar por `.id` en vez de por el elemento

**❌ Código original (intento 1):**
```js
modal.addEventListener("click", function(){ // ❌ falta el parámetro del evento
  if (e.target.id !== "modal-contenido") { // ❌ e no existe; además el id real es "modal-contenido-e9"
    e.target.classList.add("hidden")
  }
})
```

**✅ Mejora:**
```js
modal.addEventListener("click", function(e){
  if (e.target == modal) {
    e.target.classList.add("hidden")
  }
})
```

**🧠 Teoría:** para distinguir "clickeó el fondo" de "clickeó algo de adentro" no sirve comparar `.id` (cualquier hijo interno tiene su propio id o ninguno) — sirve comparar los ELEMENTOS directamente (`e.target === modal`, o contra `e.currentTarget`).

**Estado:** ✅ Completado

---

### Fallo 48: `activarDragReordenable` (22/08) — Drag and Drop nativo, primera vez: asignación al revés + argumentos de `insertBefore()` invertidos

**❌ Código original (camino hasta la versión final):**
```js
lista.addEventListener("dragstart", function(e){
  e.target = item; // ❌ event.target es de solo lectura, y además al revés (debería ser item = e.target)
})
lista.addEventListener("drop", function(e){
  lista.insertBefore(e.target, item) // ❌ mueve el elemento soltado, no el arrastrado
})
lista.addEventListener("dragover", () => preventDefault()) // ❌ preventDefault no es global, falta `e.` y el parámetro
```

**✅ Mejora:**
```js
let item = null;
lista.addEventListener("dragstart", function(e){ item = e.target; })
lista.addEventListener("drop", function(e){ lista.insertBefore(item, e.target) })
lista.addEventListener("dragover", (e) => e.preventDefault())
```

**🧠 Teoría:** `event.target` es de solo lectura, nunca se le asigna nada. `insertBefore(nodoAMover, nodoDeReferencia)` — el primer argumento es el que se mueve, el segundo antes de cuál se inserta; invertirlos mueve el elemento equivocado. `preventDefault()` es siempre un método del propio evento, nunca una función suelta. Primera vez usando la API nativa de Drag and Drop — teoría sumada el mismo día en `docs/js/04-dom/03-eventos/04-arrastrar-soltar/`.

**Estado:** ✅ Completado

---

### Fallo 49: `chat()` (claude.js, curso API de Claude, 22/08) — traducir Python literal a JS: `.append()` no existe + falta `async`/`await`

**❌ Código original:**
```js
function add_user_message(messages, text){
  const user_message = { "role":"user", "content": text }
  messages.append(user_message) // ❌ los arrays de JS no tienen .append(), eso es Python
}

function chat(messages){
 const message = client.messages.create({ model: modelo, max_tokens: 1000, messages: messages })
 // ❌ falta async en la función y await en la llamada — message termina siendo una Promise, no la respuesta
 return message.content[0].text
}
```

**✅ Mejora:**
```js
function add_user_message(messages, text){
  const user_message = { "role":"user", "content": text }
  messages.push(user_message)
}

async function chat(messages){
 const message = await client.messages.create({ model: modelo, max_tokens: 1000, messages: messages })
 return message.content[0].text
}
```

**🧠 Teoría:** `Array.prototype.append` no existe en JS — el método para añadir al final de un array es `.push()`. Y `client.messages.create()` devuelve una `Promise` (a diferencia del cliente síncrono de Python) — cualquier función que haga `await` sobre ella tiene que declararse `async`, y quien LLAME a esa función también necesita `await` para recibir el valor real en vez de la `Promise` sin resolver.

**Estado:** ✅ Completado

---

### Fallo 50: `chat()` con `system`/`temperature` (claude.js, 22/08) — confundir argumentos con nombre de Python con JS

**❌ Código original:**
```js
async function chat(messages, system = none){ // ❌ `none` no existe en JS (es Python)
  ...
}

const answer = await chat(messages, system = systemPrompt)
// ❌ NO es "pasar system como argumento": es una asignación a una variable `system` no declarada
// en modo estricto (módulo ES) esto tira ReferenceError: system is not defined
```

**✅ Mejora:**
```js
async function chat(messages, system){ // sin valor por defecto: un parámetro no pasado ya es `undefined`
  ...
}

const answer = await chat(messages, systemPrompt) // se pasa por POSICIÓN, no por nombre
```

**🧠 Teoría:** Python tiene argumentos con nombre (`chat(messages, temperature=0.0)` salta directo a ese parámetro). JS no — en una función normal, los parámetros son posicionales. `nombre = valor` escrito dentro de una llamada NO nombra un parámetro: es una expresión de asignación normal. Y como el archivo es un módulo ES (modo estricto automático), asignar a una variable no declarada tira `ReferenceError`, no crea una global silenciosa. Para simular kwargs en JS de verdad, hay que diseñar la función para recibir un objeto de opciones (`{ system, temperature }`) en vez de parámetros sueltos.

**Estado:** ✅ Completado

---

### Fallo 51: `chat()` — `message.content[0].text` (claude.js, 22/08) — asumir la posición del bloque de texto sin comprobar su tipo

**❌ Código original:**
```js
async function chat(messages){
 const message = await client.messages.create(params)
 return message.content[0].text // ❌ asume que el primer bloque siempre es texto
}
```

Con Sonnet 5 (adaptive thinking activado por defecto), `message.content[0]` resultó ser un bloque `{ type: "thinking", ... }`, no el de texto — `content[0].text` dio `undefined`. Ese `undefined` se guardó como respuesta del asistente y se reenvió en el siguiente turno de una conversación multiturno, y la API rechazó la solicitud completa con `400 messages.1.content: Field required`. Un bug arrastró al otro.

**✅ Mejora:**
```js
async function chat(messages){
 const message = await client.messages.create(params)
 return message.content.find(block => block.type === "text").text
}
```

**🧠 Teoría:** `message.content` puede traer varios bloques (texto, `thinking`, uso de herramientas...) y su ORDEN no está garantizado por posición fija — hay que **buscar** (`.find()`) el bloque cuyo `type` sea `"text"`, nunca asumir `content[0]`. Doc ampliada en [Creando la conexión](/ia/claude/02-claude-api/02-creando-conexion/).

**Estado:** ✅ Completado

---

### Fallo 52: `activarFiltroCategorias` (23/08) — `classList` con selector en vez de nombre de clase + `toggle()` sin forzar el resultado

**❌ Código original:**
```js
contenedorBotones.querySelectorAll(".filtro-btn").foreEach(j => { // ❌ typo: forEach
  if(j !== btn) j.classList.toggle(".filtro-btn--activo") // ❌ el punto queda dentro del nombre de clase
})

if(cat === x.dataset.categoria || cat === "todos") // ❌ compara la categoría del producto, no la del filtro
  x.classList.toggle("hidden") // ❌ sin force: invierte el estado anterior, no fija el resultado
```

**✅ Mejora:**
```js
contenedorBotones.querySelectorAll(".filtro-btn").forEach(j => {
  j.classList.toggle("filtro-btn--activo", j === btn);
});

const coincide = x.dataset.categoria === categoria || categoria === "todos";
x.classList.toggle("hidden", !coincide);
```

**🧠 Teoría:** `classList.add()/remove()/toggle()` reciben NOMBRES de clase, nunca selectores — el punto (`.`) es exclusivo de `querySelector()`/`closest()`/`matches()`, meterlo dentro de `classList` busca una clase literal con el punto incluido, que no existe. Y `toggle(clase, booleano)` fuerza el resultado según una condición evaluada de nuevo en cada llamada — sin el segundo argumento, `toggle()` invierte lo que YA HABÍA, así que repetir la misma acción (doble click a la misma categoría) puede dar resultados distintos cada vez. Ver también Fallo 44.

**Estado:** ✅ Completado

---

### Fallo 53: `activarAcordeonExclusivo` (23/08) — negar o comparar un string contra un booleano no invierte su significado

**❌ Código original:**
```js
faq.setAttribute("aria-expanded", !expansion) // ❌ expansion es STRING; !"false" da siempre false

faq.setAttribute("aria-expanded", expansion === false) // ❌ string vs booleano con ===, nunca son iguales

faq.nextElementSibling.classList.remove("hidden", expansion === "true") // ❌ remove() no acepta un segundo argumento "force"
```

**✅ Mejora:**
```js
faq.setAttribute("aria-expanded", expansion === "false");
faq.nextElementSibling.classList.toggle("hidden", expansion === "true");
```

**🧠 Teoría:** `getAttribute()` (y `dataset`) devuelven SIEMPRE un string, nunca un booleano real. `!string` no evalúa el SIGNIFICADO del texto — evalúa si el string está vacío o no, y `"true"`/`"false"` son los dos no vacíos, así que `!expansion` da `false` sea cual sea el contenido. Tampoco sirve comparar el string contra un booleano con `===` (tipos distintos nunca son iguales). La única conversión correcta es comparar contra el STRING exacto: `expansion === "false"`. Y `classList.remove()` no tiene el segundo argumento "force" que sí tiene `toggle()` — pasárselo no hace nada.

**Estado:** ✅ Completado

---

### Fallo 54: `validarRangoNumerico` (23/08) — `||` en vez de `&&` para "dentro de un rango" (reincidencia)

**❌ Código original:**
```js
if(Number(inputEdad.value) >= 18 || Number(inputEdad.value) <= 65){ // ❌ || : casi cualquier número cumple una de las dos
  inputEdad.setCustomValidity("")
}else{
  inputEdad.setCustomValidity(spanError) // ❌ pasa el elemento, no un string con el mensaje
}
```

**✅ Mejora:**
```js
const edad = Number(inputEdad.value);
if (edad >= 18 && edad <= 65) {
  spanError.textContent = "";
  inputEdad.setCustomValidity(spanError.textContent);
} else {
  spanError.textContent = "La edad debe estar entre 18 y 65 años";
  inputEdad.setCustomValidity(spanError.textContent);
}
```

**🧠 Teoría:** "dentro de un rango" exige los DOS límites a la vez (`&&`); "fuera de un rango" exige CUALQUIERA de los dos (`||`). Reincidencia directa del mismo patrón ya marcado como "a reforzar". Y `setCustomValidity()` solo existe en elementos de formulario (`input`, `select`, `textarea`) y necesita un STRING como mensaje, nunca una referencia a otro elemento del DOM.

**Estado:** ✅ Completado

---

### Fallo 55: `activarDropdownConCierre` (23/08) — `classList.contains()` confundido con `Element.contains()`

**❌ Código original:**
```js
document.addEventListener("click", (e) => {
  if(menu.classList.contains(e.target)) return; // ❌ contains() de clases (espera un string), no de nodos
  if(boton.classList.contains(e.target)) return;
  menu.classList.add("hidden")
})
```

**✅ Mejora:**
```js
document.addEventListener("click", (e) => {
  if (menu.contains(e.target)) return;
  if (boton.contains(e.target)) return;
  menu.classList.add("hidden");
});
```

**🧠 Teoría:** dos métodos que comparten el nombre `contains()` pero pertenecen a objetos distintos y esperan argumentos distintos: `Element.contains(nodo)` responde "¿este nodo está adentro de mí?" (para saber si un click fue dentro de un contenedor); `DOMTokenList.contains(nombreDeClase)` (el de `.classList`) responde "¿tengo esta clase puesta?". Pasarle un nodo del DOM al segundo nunca coincide con nada.

**Estado:** ✅ Completado

---

### Fallo 56: `activarStepperConLimite` (23/08) — clamping con `Math.min`/`Math.max` mal aplicado + `++` dentro de una expresión reasignada

**❌ Código original:**
```js
let contador = Number(spanCantidad.dataset.cantidad) // ❌ fuera de los listeners, fuga de estado

if(contador > 0 && contador <= limite) contador++ // ❌ >0 no aplica al botón de sumar; <= deja pasarse

contador = Math.min(limite, contador++) // ❌ el ++ devuelve el valor VIEJO, la reasignación lo pisa: queda congelado
```

**✅ Mejora:**
```js
botonMas.addEventListener("click", () => {
  let contador = Number(spanCantidad.dataset.cantidad); // leído fresco, dentro del listener
  contador = Math.min(limite, contador + 1); // suma simple, sin efecto secundario
  spanCantidad.dataset.cantidad = contador;
  spanCantidad.textContent = `${contador}`;
});
```

**🧠 Teoría:** `Math.min(tope, valor)`/`Math.max(piso, valor)` fijan un límite sin condiciones `if` propensas a errores de "por uno" (`<=` vs `<`) — pero los argumentos importan: el tope/piso siempre va primero, y el "próximo valor" (`contador + 1`, no `contador++`) segundo. `contador++` (post-incremento) devuelve el valor VIEJO para la expresión mientras muta la variable por su cuenta — si el resultado de esa expresión se vuelve a asignar a la misma variable, la asignación PISA el incremento con el valor viejo, dejando la variable congelada. Reincidencia del mecanismo de fondo de "Postfix vs. prefix" (13/08). Y leer el estado UNA sola vez fuera de un listener que se dispara varias veces es fuga de estado: hay que releerlo fresco en cada disparo, y escribirlo de vuelta completo (`textContent` Y `dataset`, no solo uno).

**Estado:** ✅ Completado

---

### Fallo 57: `filtrarPorNombreOCategoria` (23/08) — `.contains()` en vez de `.includes()` + acumulador declarado fuera del bucle

**❌ Código original:**
```js
let son = false; // ❌ fuera del forEach, se comparte entre TODOS los ítems del bucle
contenedorItems.querySelectorAll(".item-producto").forEach(x => {
  if(x.dataset.nombre.toLowerCase().contains(item) || x.dataset.categoria.toLowerCase().contains(item)) // ❌ .contains() no existe en strings
    son = true;
})
x.classList.toggle("hidden", !son) // ❌ fuera del forEach, x ya no existe (ReferenceError)
```

**✅ Mejora:**
```js
contenedorItems.querySelectorAll(".item-producto").forEach(x => {
  let son = false; // declarada DENTRO, se resetea en cada vuelta
  if (x.dataset.nombre.toLowerCase().includes(item) || x.dataset.categoria.toLowerCase().includes(item))
    son = true;
  x.classList.toggle("hidden", !son);
});
```

**🧠 Teoría:** los strings de JS usan `.includes()`, no `.contains()` (confusión típica con otros lenguajes). Y un acumulador/bandera que necesita reiniciarse en cada ítem tiene que declararse DENTRO del bucle que lo usa — declarado afuera, se comparte entre todas las vueltas y arrastra el resultado del ítem anterior al siguiente. Ver también Fallo 38 (mismo mecanismo de fondo con banderas dentro de loops).

**Estado:** ✅ Completado

---

### Fallo 58: `activarSeleccionGrid` (23/08) — variable compartida entre dos ramas de lógica distinta

**❌ Código original:**
```js
let todasMarcadas = master.checked // ❌ si el maestro estaba en false, el acumulador arranca en false
                                    //    y nada en el bucle lo sube a true, aunque todos terminen marcados
contenedor.querySelectorAll(".check-producto").forEach(x => {
  if(e.target === master)
    x.checked = todasMarcadas // ❌ al fijar todasMarcadas en true, esta rama marca TODO sin importar
                               //    si el maestro se acaba de desmarcar
  else{
    if(!x.checked) todasMarcadas = false;
  }
})
```

**✅ Mejora:**
```js
contenedor.addEventListener("change", (e) => {
  let todasMarcadas = true; // acumulador propio de la rama "cambió un producto"

  contenedor.querySelectorAll(".check-producto").forEach(x => {
    if (e.target === master) {
      x.checked = master.checked; // lee el maestro directo, no una variable compartida
    } else {
      if (!x.checked) todasMarcadas = false;
    }
  });

  if (e.target !== master) master.checked = todasMarcadas;
});
```

**🧠 Teoría:** cuando dos ramas de un mismo evento necesitan lógica distinta (sincronizar hacia abajo vs. recalcular hacia arriba), compartir una variable entre las dos es frágil — un ajuste pensado para una rama rompe silenciosamente la otra. Cada rama necesita su propia fuente de verdad: para "forzar" un valor, leer el elemento REAL (`master.checked`) en el momento; para "acumular" un resultado, una variable local que arranca en el valor neutro (`true` para "todos", nunca heredado de otro estado) y solo el propio bucle la modifica.

**Estado:** ✅ Completado

---

### Fallo 59: `resaltarFilaSeleccionada` (23/08, bloque de refuerzo) — método llamado sobre la variable equivocada dentro de un `forEach` de exclusividad

**❌ Código original:**
```js
let fila = e.target.closeset("fila-tabla") // ❌ typo "closest" + falta el punto del selector

tabla.querySelectorAll(".fila-tabla").forEach(x => {
  fila.classList.toggle("fila--activa", x === fila) // ❌ toggle() sobre "fila" (fija), nunca sobre "x"
})
```

**✅ Mejora:**
```js
const fila = e.target.closest(".fila-tabla");
if (!fila) return;

tabla.querySelectorAll(".fila-tabla").forEach(x => {
  x.classList.toggle("fila--activa", x === fila);
});
```

**🧠 Teoría:** en un `forEach` que recorre TODOS los elementos para marcar exclusivamente uno solo (patrón ya visto en `activarFiltroCategorias` y `resaltarFilaSeleccionada`), el método que aplica la marca siempre se llama sobre la variable del PARÁMETRO del callback (`x`, la vuelta actual) — nunca sobre una variable capturada de afuera del bucle (`fila`, siempre la misma). Llamarlo sobre la variable fija hace que todas las vueltas toquen al mismo elemento, sin importar cuántas veces se repita el `forEach`.

**Estado:** ✅ Completado

---

### Fallo 60: `activarCierreAvisos` (23/08, bloque de refuerzo) — confundir el patrón de exclusividad con el de cierre independiente

**❌ Código original:**
```js
zona.addEventListener("click", functtion(e){ // ❌ typo: function

  let contador = zona.querySelector("#zona-avisos-r3").dataset.restantes
  // ❌ zona ya es ese elemento; buscar un hijo con su propio id da null

  zona.querySelectorAll(".aviso").forEach(x => {
    x.classList.contains(":not(.hidden)") // ❌ selector CSS pasado a contains(), nunca coincide
    contador++ // ❌ sin condición real, cuenta siempre los 3
    zona.dataset.contador = contador // ❌ nombre de atributo equivocado, pedía "restantes"
  })
})
```

**✅ Mejora:**
```js
function activarCierreAvisos(zona) {
  zona.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-cerrar");
    if (!boton) return;

    boton.closest(".aviso").classList.add("hidden");

    let contador = 0;
    zona.querySelectorAll(".aviso").forEach(x => {
      if (!x.classList.contains("hidden")) {
        contador++;
        zona.dataset.restantes = contador;
        zona.querySelector("#contador-avisos-r3").textContent = contador;
      }
    });
  });
}
```

**🧠 Teoría:** dos patrones que se PARECEN a simple vista piden lógica opuesta — un acordeón exclusivo (una sola respuesta abierta, hay que cerrar a los demás) y un cierre independiente por ítem (cada uno se cierra solo, sin tocar a los otros). Antes de escribir el `forEach`, identificar cuál de los dos pide el enunciado, no asumir por parecido superficial con el ejercicio anterior. Además, un elemento nunca se busca a sí mismo con `querySelector` sobre su propio id (eso busca entre sus HIJOS, da `null`) — si ya lo tenés como parámetro, usalo directo.

**Estado:** ✅ Completado

---

### Fallo 61: `validarCodigoPostal` (23/08, bloque de refuerzo) — reincidencia de `setCustomValidity(elemento)` + "exactamente N" vs. "como máximo N"

**❌ Código original:**
```js
let codi = inputCodigo.value
if((codi.length <= 5) && !isNaN(codi)){ // ❌ <=5 en vez de ===5
  inputCodigo.setCustomValidity("")
}
else
  inputCodigo.setCustomValidity(spanError) // ❌ reincidencia exacta del Fallo 54: pasa el elemento, no un string
```

**✅ Mejora:**
```js
function validarCodigoPostal(inputCodigo, spanError) {
  const codigo = inputCodigo.value;
  const esValido = codigo.length === 5 && !isNaN(codigo);

  if (!esValido) {
    spanError.textContent = "El código postal debe tener 5 dígitos";
    inputCodigo.setCustomValidity(spanError.textContent);
    return;
  }

  spanError.textContent = "";
  inputCodigo.setCustomValidity("");
}
```

**🧠 Teoría:** "exactamente N caracteres" es `length === N`, no `length <= N` (que acepta cualquier cosa más corta también). Para comprobar que un string entero es numérico sin usar expresiones regulares, `!isNaN(string)` funciona: `isNaN()` intenta convertir el string a número, y cualquier carácter no numérico hace fallar esa conversión. Y la reincidencia EXACTA de `setCustomValidity(elemento)` (mismo fallo que el Fallo 54, mismo día, dos ejercicios distintos) confirma que ese patrón concreto todavía no está consolidado — corregirlo una vez no alcanza.

**Estado:** ✅ Completado

---

### Fallo 62: `chat()` con prellenado de asistente (claude2.js, 23/08, lección "Datos estructurados") — Sonnet 5 no soporta la técnica del curso

**❌ Código original (siguiendo el curso al pie de la letra):**
```js
addUserMessage(messages, 'Genera una regla muy corta de EventBridge en JSON');
addAssistantMessage(messages, '```json'); // ❌ 400 Bad Request con Sonnet 5

const texto = await chat(messages, null, ['```']);
```

`client.messages.create()` devuelve `400 — "This model does not support assistant message prefill. The conversation must end with a user message."` — el prellenado de mensajes de asistente (técnica central de la lección) no funciona con `claude-sonnet-5`, aunque el curso de Skilljar lo enseñe así.

Intento intermedio (sin prellenado, pidiéndole a Claude que abra él mismo el bloque de código y usando `` ``` `` como secuencia de parada) tampoco funciona: Claude arranca su respuesta escribiendo `` ```json `` por costumbre, esos primeros backticks YA coinciden con la secuencia de parada, y la generación corta ahí mismo — respuesta vacía (`content: []`, `stop_reason: "stop_sequence"`, 1 solo token generado).

**✅ Alternativa que sí funciona con Sonnet 5:**
```js
addUserMessage(messages, 'Genera una regla muy corta de EventBridge en JSON. Responde SOLO con el JSON crudo, sin bloque de código, sin backticks, sin explicación ni texto alrededor.');

const texto = await chat(messages);
const datosLimpios = JSON.parse(texto.trim());
```

**🧠 Teoría:** pedirle a Claude explícitamente que no use backticks evita el problema de raíz — sin backticks de ningún tipo en la respuesta, ni siquiera hace falta `stop_sequences`. Confirmado en la práctica: `content: [{ type: 'text', text: '{ ... }' }]`, JSON parseable directo. Mismo criterio que el Fallo 51 (Sonnet 5 se comporta distinto a lo que enseña un curso pensado para un modelo anterior) — la experiencia real con el modelo actual gana sobre el temario del curso.

**Estado:** ✅ Completado — documentado también en `docs/ia/claude/02-claude-api/07-datos-estructurados/`.

---

### Fallo 63: `activarPanelLateral` (25/08, bloque de refuerzo) — listener en el elemento equivocado + reincidencia de los tres `contains()` + guard invertido

**❌ Código original (evolución del intento):**
```js
function activarPanelLateral(botonAbrir, panel) {
  botonAbrir.addEventListener('click', function(e){   // ❌ debía ser 'document', no el botón
    let btn = botonAbrir.classList.contains(e.target)  // ❌ classList.contains() espera un STRING de clase, no un nodo
    let estaAbierto = panel.classList.contains("hidden")  // ❌ el nombre dice lo contrario de lo que guarda
    if(!estaAbierto) return;   // ❌ corta justo cuando el panel está abierto, el único caso a procesar
  });
}
```

**✅ Versión corregida:**
```js
function activarPanelLateral(botonAbrir, panel) {
  document.addEventListener('click', function(e){
    let clickEnBoton = botonAbrir.contains(e.target)     // Element.contains(nodo), no classList
    if(clickEnBoton) return panel.classList.toggle('hidden');

    const estaCerrado = panel.classList.contains('hidden')
    if(estaCerrado) return;

    if(panel.contains(e.target)) return;
    return panel.classList.add('hidden')
  });
}
```

**🧠 Teoría:** tres fallos independientes, todos ya vistos antes por separado, coincidiendo en el mismo ejercicio: (1) escuchar en `botonAbrir` en vez de `document` mata la lógica de "clic fuera cierra", porque los clics fuera del botón nunca llegan a ese listener; (2) `classList.contains()` (clases) vs `elemento.contains()` (nodos) — reincidencia directa del "los tres `contains()`" de `repaso-urgente.md`; (3) nombrar una variable con el sentido contrario al que realmente tiene (`estaAbierto` guardando "está oculto") hace invisible una inversión de lógica — el nombre tiene que coincidir con el valor real, no con lo que "se supone" que debería medir.

**Estado:** ✅ Completado (guiado paso a paso, tres correcciones)

---

### Fallo 64: `filtrarTareasPorEstadoYTexto` (25/08, bloque de refuerzo) — negación de De Morgan mal aplicada + listeners anidados en una función que nunca se ejecuta sola

**❌ Código original (evolución del intento):**
```js
function filtrarTareasPorEstadoYTexto(inputBusqueda, selectEstado, contenedorTareas) {
const aplicarFiltros = () => {
  contenedorTareas.querySelectorAll(".tarea").forEach(e => {
    const titulo = e.dataset.titulo.toUpperCase().includes(inputBusqueda.value.toUpperCase())
    const estado = e.dataset.estado.toUpperCase() === selectEstado.value.toUpperCase()
    const todos = selectEstado.value.toUpperCase() === "TODOS"
    e.classList.toggle("hidden", !todos && (!titulo || !estado))  // ❌ negación mal repartida
  })
  inputBusqueda.addEventListener("input", aplicarFiltros)   // ❌ dentro de aplicarFiltros: nunca se registran
  selectEstado.addEventListener("change", aplicarFiltros)
}
}
```

**✅ Versión corregida:**
```js
function filtrarTareasPorEstadoYTexto(inputBusqueda, selectEstado, contenedorTareas) {
  const aplicarFiltros = () => {
    contenedorTareas.querySelectorAll(".tarea").forEach(e => {
      const titulo = e.dataset.titulo.toUpperCase().includes(inputBusqueda.value.toUpperCase())
      const estado = e.dataset.estado.toUpperCase() === selectEstado.value.toUpperCase()
      const todos = selectEstado.value.toUpperCase() === "TODOS"
      const entra = titulo && (estado || todos)
      e.classList.toggle("hidden", !entra)
    })
  }
  inputBusqueda.addEventListener("input", aplicarFiltros)
  selectEstado.addEventListener("change", aplicarFiltros)
}
```

**🧠 Teoría:** dos lecciones distintas. (1) Negar una expresión compuesta con `&&`/`||` a mano (De Morgan) es fácil de errar — cambiar el signo de cada término suelto sin invertir también el operador que los une da un resultado distinto. La forma segura: armar primero la versión en POSITIVO (`entra = titulo && (estado || todos)`, calcada de la pregunta real: "¿coincide el título Y (coincide el estado O vale cualquiera)?"), y negar el resultado completo una sola vez al final (`!entra`), nunca término por término. (2) Un `addEventListener` escrito dentro de la función que se supone que dispara no se ejecuta nunca solo — `aplicarFiltros` se define pero nadie la llama hasta que un evento real dispara el listener, y ese listener nunca se registró porque estaba atrapado dentro del propio cuerpo de la función que debía registrarlo.

**Estado:** ✅ Completado (varias vueltas, incluyendo un repaso completo en prosa de la lógica)

---

### Fallo 65: `moverAbajo` (25/08, bloque de refuerzo) — `closest()` sin el punto + `insertBefore` con argumentos invertidos (regresión) + variable global implícita (reincidencia)

**❌ Código original (evolución del intento):**
```js
function moverAbajo(lista) {
  lista.addEventListener("click", function(e){
    const btn = e.target.closest("btn-bajar")   // ❌ sin el punto: busca una etiqueta <btn-bajar>, no existe
    if(!btn) return;
    const item = e.target.closest(".item-lista")
    const hermano = item.previousElementSibling  // ❌ "bajar" es el SIGUIENTE hermano, no el anterior
    if(hermano){
      valor = item.dataset.tarea                 // ❌ sin let/const — variable global implícita (reincidencia Fallo 37)
      item.dataset.tarea = hermano.dataset.tarea  // ❌ swap manual de atributo en vez de mover el nodo real
      hermano.dataset.tarea = valor
      lista.insertBefore(item, hermano)           // ❌ item ya está inmediatamente antes de hermano: no-op
    }
  })
}
```

**✅ Versión corregida:**
```js
function moverAbajo(lista) {
  lista.addEventListener("click", function(e){
    const btn = e.target.closest(".btn-bajar")
    if(!btn) return;
    const item = e.target.closest(".item-lista")
    const hermano = item.nextElementSibling
    if(!hermano) return
    lista.insertBefore(hermano, item)
  })
}
```

**🧠 Teoría:** `closest()` recibe un selector CSS y SIEMPRE lleva punto para una clase (tabla de `repaso-urgente.md`) — sin él, busca una etiqueta HTML literal que no existe, y el guard corta siempre. El orden de `insertBefore(nodoAMover, nodoDeReferencia)` ya se había consolidado el 22/08 (Fallo 48, "domino" desde el 23/08 en `moverArriba`) pero hoy volvió a fallar: mover `item` "antes de" `hermano` cuando `item` YA está ahí es un no-op — para bajar, hay que mover al SIGUIENTE (`hermano`) antes del actual, no al revés. Y `valor` sin `let`/`const` es la misma fuga de variable global del Fallo 37 (20/08), en el mismo archivo de ejercicios donde 15 funciones comparten scope — sigue sin estar consolidado del todo.

**Estado:** ✅ Completado (guiado paso a paso, con retroceso en `insertBefore` respecto al 23/08)

---

### Fallo 66: `activarValoracionEstrellas` (25/08, bloque de refuerzo) — negación de más sobre un booleano ya alineado con el `force` + `querySelector` sobre el propio contenedor

**❌ Código original (evolución del intento):**
```js
contenedor.querySelectorAll(".estrella").forEach(x => {
  const esActivo = x.dataset.valor <= valor
  x.classList.toggle("estrella--activa", !esActivo)   // ❌ esActivo YA significa lo que toggle necesita
})
// más abajo, para informar el resultado:
const valoracion = contenedor.querySelector("#valoracion-r9").dataset.valoracion  // ❌ contenedor YA es #valoracion-r9
valoracion = `${valor} de 5`   // ❌ reasignar un const
```

**✅ Versión corregida:**
```js
contenedor.querySelectorAll(".estrella").forEach(x => {
  const esActivo = x.dataset.valor <= valor
  x.classList.toggle("estrella--activa", esActivo)   // sin negar: el booleano ya coincide con la clase
})
contenedor.dataset.valoracion = valor
contenedor.querySelector("#texto-valoracion-r9").textContent = `${valor} de 5`
```

**🧠 Teoría:** el Fallo 44 (22/08) ya decía que `toggle()` devuelve el estado de la CLASE, y que si el booleano es la negación semántica de la clase hace falta invertirlo con `!`. Hoy pasó lo contrario: el booleano (`esActivo`, "¿debe estar activa?") ya tenía el MISMO sentido que la clase (`estrella--activa`) — no hacía falta ningún `!`. Antes de negar, preguntarme: "¿mi booleano significa lo mismo que la clase, o lo contrario?" — solo en el segundo caso hace falta `!`. Y `querySelector()` busca entre los DESCENDIENTES de un elemento, nunca en el elemento mismo — si `contenedor` ya es el nodo que buscás, usarlo directo, sin volver a consultarlo por su propio id.

**Estado:** ✅ Completado (dos correcciones)

---

### Fallo 67: `resumirCarrito` (25/08, bloque de refuerzo) — selector de clase compuesta mal escrito

**❌ Código original:**
```js
contenedor.querySelectorAll(".linea.carrito").forEach(x => { ... })  // ❌ busca clase "linea" Y clase "carrito" a la vez
```

**✅ Versión corregida:**
```js
contenedor.querySelectorAll(".linea-carrito").forEach(x => { ... })  // una sola clase, con guion
```

**🧠 Teoría:** `.a.b` (sin espacio, dos selectores pegados) pide un elemento que tenga las dos clases `a` Y `b` simultáneamente — selector completamente distinto de `.a-b`, una sola clase cuyo nombre incluye un guion. El guion es parte del nombre, no un separador de selectores. Con `.linea.carrito`, `querySelectorAll` no encontraba ningún elemento real (nunca hay clases `linea` y `carrito` por separado en el HTML) y el acumulador se quedaba en `0` siempre, sin ningún error visible — mismo patrón silencioso que otros fallos de selector ya vistos.

**Estado:** ✅ Completado (a la primera salvo este detalle de selector)

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
- DOM — manipulación y eventos (20/08): `textContent` para renderizado seguro anti-XSS, `FormData` + `Object.fromEntries` para leer formularios, `addEventListener` + `preventDefault`, `classList.toggle` para alternar estado, delegación básica (listener en el padre en vez de por ítem) — resueltos sin fallos en `mostrarNombreUsuario`, `datosFormulario`, `evitarNavegacion`, `alternarFavorito`, `activarDelegacionTareas` y `activarEnvioConEnter`
- `clientX`/`clientY` sin mezclar ejes (22/08): resuelto sin ningún fallo en `mostrarTooltipEnCursor` — primera vez limpio desde el Fallo 39 del 20/08
- `dataset` convertido antes de comparar (23/08): resuelto sin fallos en `marcarTodosAgotados` (`Number(x.dataset.stock) === 0`), aplicando sin recordatorio la lección del Fallo 43
- `insertBefore()` con el orden de argumentos correcto (23/08): resuelto a la primera en `moverArriba` — patrón consolidado desde el Fallo 48 del 22/08
- Guard clause combinado con `||` en un solo `if...return` (23/08): resuelto sin fallos en `moverArriba` (`if(!btn || !anterior) return`)
- `Number()` sobre `dataset` sin recordatorio (25/08): aplicado sin corrección en `activarValoracionEstrellas` y `resumirCarrito`, lección del Fallo 43 ya interiorizada
- Acumulador con `let total = 0` fuera del `forEach` + `+=` dentro (25/08): plan correcto desde el primer intento en `resumirCarrito`, sin necesitar guía — distingue bien cuándo el estado debe persistir ENTRE vueltas (acumulador) de cuándo debe leerse fresco EN cada vuelta (Fallo de 20/08)
- Guard clauses encadenados sin anidar, con `return` seguido (25/08): aplicado de forma consistente en `activarPanelLateral`, `moverAbajo` y `activarValoracionEstrellas`, incluso detectando y sacando un `if` sobrante él solo tras la corrección

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
- **Rangos — `&&` para "dentro", `||` para "fuera" (reincidió 23/08, ya visto sin numerar el 22/08 en `validarLongitudUsuario`):** "dentro de un rango" exige los DOS límites a la vez (`valor >= min && valor <= max`); "fuera de un rango" exige CUALQUIERA de los dos (`valor < min || valor > max`). Usar el operador equivocado casi siempre da `true` para casi todo, un bug silencioso porque no explota, solo deja pasar valores que deberían rechazarse. Ver Fallo 54.

### Objetos
- **Los pares de `Object.entries()` son arrays, no objetos:** `[clave, valor]` se accede por índice (`par[0]`/`par[1]`) o destructuring, nunca con `.values` ni notación de punto inventada.
- **`Object.keys/values/entries` operan sobre lo que les pasás directamente:** si ya tenés un array (filtrado, mapeado) y necesitás algo de adentro de cada elemento, la herramienta es `map`/`filter`, no volver a llamar `Object.keys` sobre ese array.

### Búsqueda en arrays (nuevo, 13/08)
- **Cada método de búsqueda tiene su propio "no encontrado":** `find` → `undefined`, `findIndex`/`indexOf` → `-1`, `includes` → `false`. No mezclarlos ni "defenderse" con `??` sobre un método que nunca da nullish (`findIndex` jamás es `null`/`undefined`) — antes de poner `?? algo`, preguntarme "¿este método puede devolver null o undefined de verdad?".

### Variables sin declarar / fuga global (nuevo, 20/08 — REINCIDENCIA 25/08)
- **Antes de escribir `nombre = {...}` o cualquier asignación, preguntarme: ¿tiene `let`/`const` adelante?** Sin eso es una fuga a variable global — especialmente grave en un archivo de ejercicios donde varias funciones comparten el mismo scope. Reincidió el 25/08 en `moverAbajo` (`valor = item.dataset.tarea`) — sigue sin estar consolidado del todo. Ver Fallos 37 y 65.

### Banderas booleanas dentro de loops (nuevo, 20/08)
- **Una bandera que marca "pasó algo" solo avanza de `false` a `true` — nunca ponerla de vuelta en `false` dentro de una iteración que simplemente no matcheó.** Y antes de usar una bandera, preguntarme si el propio DOM ya me da la respuesta directamente después de mutarlo (ej. `.children.length`), sin necesitar estado manual aparte. Ver Fallo 38.

### Coordenadas de eventos de mouse (nuevo, 20/08)
- **`clientX`/`clientY` son ejes distintos** — copiar una línea para el segundo eje y no cambiar la letra final es un error fácil de cometer y difícil de notar a simple vista. Revisar carácter por carácter al duplicar una línea casi idéntica. Ver Fallo 39.
- **`screenX`/`screenY` ≠ `clientX`/`clientY`:** el primero es relativo a la pantalla física completa, el segundo al viewport del navegador. Para posicionar con `style.left`/`top`, siempre `clientX`/`clientY`.

### Formularios — apuntar al campo correcto + limpiar `setCustomValidity` (nuevo, 20/08)
- **Antes de llamar `setCustomValidity()`, confirmar CUÁL de los parámetros es el campo que el enunciado pide marcar** — no asumir que es el primero o "el que está más a mano". Y siempre necesita su rama `else` con `setCustomValidity('')`, si no el campo queda inválido para siempre aunque el usuario corrija el valor. Ver Fallo 40.
- **REINCIDENCIA 23/08, sin mejora — `setCustomValidity(elemento)` en vez de un string:** pasó dos veces el mismo día, en dos ejercicios distintos (`validarRangoNumerico` del Bloque 2, `validarCodigoPostal` del bloque de refuerzo). `setCustomValidity()` solo existe en elementos de formulario y siempre necesita un STRING como mensaje — nunca una referencia a otro elemento del DOM (ej. el span de error). Antes de llamarlo, preguntarme explícitamente: "¿lo que le estoy pasando es texto, o es un elemento?". Ver Fallos 54 y 61 — este patrón todavía NO está consolidado, necesita más práctica.

### Calcular sin usar el resultado (nuevo, 22/08)
- **Un ternario, una comparación (`===`) o una llamada que no se asignan a ningún lado no hacen NADA** — JS calcula el valor y lo descarta. Antes de dar una línea por terminada, preguntarme: "¿esto asigna con `=`, hace `return`, o simplemente calcula y tira el resultado?". Reincidió tres veces el mismo día: un ternario suelto, `box.checked === todos` en vez de `=`, y `.includes('')` llamado sobre el texto de búsqueda en vez de usarlo como argumento de la comparación real. Ver Fallos 42 y 45.

### Confundir un elemento del DOM con el valor que contiene (nuevo, 22/08)
- **Un elemento (`<table>`, `<ul>`, `<span>`) no es ni una colección iterable ni un número/string por sí solo.** Antes de usar `.forEach()`, confirmar que lo que tengo es de verdad una colección (`querySelectorAll(...)`, no el contenedor entero). Antes de comparar/sumar un valor "de" un elemento, leerlo primero (`.textContent`, `.value`, `.dataset.X`) — nunca operar sobre el elemento en sí. Ver Fallo 42 (`contenedorTabla.forEach`), Fallo 45 (mismo bug en `contenedorItems`) y Fallo 46 (`spanCantidad` comparado como número).

### `dataset` siempre es string (nuevo, 22/08)
- **`element.dataset.X` devuelve SIEMPRE texto**, sin importar que en el HTML parezca un número (`data-stock="0"` da `"0"`, no `0`) — comparar con `===` contra un literal numérico nunca coincide sin convertir antes (`Number(...)`, `+valor`, o comparar con `==`). Ver Fallo 43.

### `classList.toggle()` devuelve el estado de LA CLASE, no de lo que representa (nuevo, 22/08)
- **El booleano que devuelve `toggle()` dice "¿la clase quedó puesta?", no "¿el elemento quedó visible/activo?"** — si la clase que alterno es la negación semántica de lo que necesito comunicar (`hidden` vs. `aria-expanded`), el resultado hay que invertirlo con `!` antes de usarlo. Ver Fallo 44.
- **El caso espejo (25/08):** si mi booleano YA significa lo mismo que la clase (`estrella--activa` y "¿debe estar activa?" son la misma pregunta), NO hace falta ningún `!`. Antes de negar por costumbre, preguntarme: "¿mi booleano y la clase apuntan en el mismo sentido, o en sentidos opuestos?". Ver Fallo 66.

### `if` sin llaves (nuevo, 22/08)
- **Sin `{}`, un `if` solo controla la línea INMEDIATAMENTE siguiente** — JS no lee la indentación. Cualquier línea extra que "parezca" adentro por estar tabulada en realidad se ejecuta siempre, pase lo que pase la condición. Usar siempre llaves cuando el cuerpo tiene más de una instrucción, aunque hoy "por suerte" no rompiera nada. Ver Fallo 46.

### Drag and Drop nativo (nuevo, 22/08)
- **`event.target` es de solo lectura** — nunca se le asigna nada, ni en `dragstart` ni en ningún evento. **`insertBefore(nodoAMover, nodoDeReferencia)`** — el primer argumento es el que se mueve, el segundo antes de cuál se inserta; invertirlos mueve el elemento equivocado. **`preventDefault()` es siempre un método del evento** (`e.preventDefault()`), nunca una función global suelta. Ver Fallo 48 y la teoría en [Arrastrar y soltar](/js/04-dom/03-eventos/04-arrastrar-soltar/).

### Negar una expresión compuesta (`&&`/`||`) término por término — De Morgan (nuevo, 25/08)
- **Negar `A && (B || C)` NO es `!A && (!B || !C)`** — hay que invertir también los operadores que unen los términos, no solo cada término suelto (`!A || (!B && !C)`). Es fácil de errar a mano y el error no siempre se nota a simple vista. Antes de escribir un `!` sobre una expresión compuesta: armar primero la versión en POSITIVO, calcada de la pregunta real en palabras ("¿pasa X Y (pasa Y O pasa Z)?"), guardarla en una variable con nombre claro, y negar esa variable completa una sola vez al final — nunca redistribuir el `!` manualmente. Ver Fallo 64.

### Elegir el elemento correcto para un listener "global" de clic (nuevo, 25/08)
- **Un listener pensado para capturar clics en CUALQUIER parte de la página va en `document`, no en un elemento específico de la interfaz** (el botón que abre un panel, por ejemplo). Si se engancha en un elemento chico, solo se disparará para clics dentro de ese elemento — el resto de la página queda ciego. Antes de escribir `elemento.addEventListener('click', ...)`, preguntarme: "¿este listener necesita ver clics de TODA la página, o solo de este elemento puntual?". Ver Fallo 63.

### Selector de clase compuesta (`.a.b`) vs. clase con guion (`.a-b`) (nuevo, 25/08)
- **`.linea.carrito` (sin espacio, pegados) pide un elemento con las clases `linea` Y `carrito` a la vez — un selector totalmente distinto a `.linea-carrito`**, una sola clase cuyo nombre incluye un guion. El guion es parte del nombre de la clase, nunca un separador. Antes de escribir un selector con guion, copiar el nombre EXACTO del HTML, sin puntos de más en el medio. Ver Fallo 67.

### Traducir Python a JS literalmente (nuevo, 22/08 — curso API de Claude)
- **Antes de escribir código adaptado de un ejemplo en Python, preguntarme: "¿este método/sintaxis existe igual en JS, o es un falso amigo?"** `.append()` de una lista de Python no es `.push()` de un array de JS. `None` no es nada en JS (ni siquiera `null` por defecto — un parámetro no pasado ya es `undefined`). Y lo más engañoso: `nombre = valor` dentro de una llamada a función NO es un argumento con nombre como en Python — es una asignación, y en un módulo ES (modo estricto) asignar a una variable no declarada tira `ReferenceError`. Ver Fallos 49 y 50.

### Asumir la posición de un bloque en `content` sin comprobar su tipo (nuevo, 22/08 — curso API de Claude)
- **La respuesta de la API de Claude (`message.content`) es un ARRAY de bloques, no un texto directo — y el primer bloque no siempre es el de texto** (modelos con adaptive thinking anteponen un bloque `thinking`). Antes de leer `content[0].text`, preguntarme si hace falta buscar (`.find(block => block.type === "text")`) en vez de asumir la posición. Un `undefined` sin detectar acá se propaga silencioso y puede romper una conversación multiturno más adelante. Ver Fallo 51.

### `classList` con selector vs. nombre de clase (nuevo, 23/08)
- **`classList.add()/remove()/toggle()` reciben NOMBRES de clase, nunca selectores CSS** — el punto (`.`) es exclusivo de `querySelector()`/`closest()`/`matches()`. Meter el punto dentro de `classList` busca una clase que literalmente incluye el punto en su nombre, que nunca existe. Antes de escribir `classList.algo(valor)`, preguntarme: "¿este `valor` viene de un selector que usé para buscar el elemento, o es el nombre de clase tal cual está en el HTML?". Ver Fallo 52.

### `closest()` es un método del elemento, no una función suelta (nuevo, 23/08)
- **`elemento.closest(selector)`** — el elemento va ANTES del punto, el selector CSS es el argumento. Escribirlo al revés (`closest(elemento)`) o pasarle el nombre de una propiedad en vez de un selector son errores de sintaxis distintos, pero de la misma confusión: tratar un método de instancia como si fuera una función independiente.

### String `"true"`/`"false"` no es un booleano (nuevo, 23/08)
- **`getAttribute()` y `dataset` devuelven SIEMPRE texto, incluso cuando el HTML dice `"true"` o `"false"`.** Ni `!string` (evalúa si el string está vacío, no su significado) ni `string === booleano` (tipos distintos con `===` nunca son iguales) convierten ese texto a la condición real. La única forma correcta es comparar contra el STRING exacto: `valor === "false"`. Ver Fallo 53, y el mismo mecanismo de fondo que "`dataset` siempre es string".

### `toggle()` sin segundo argumento invierte, no fija (nuevo, 23/08)
- **Sin force, `toggle()` mira el estado ANTERIOR de la clase y lo invierte** — sirve para un interruptor de un solo cambio por click, pero si el mismo cálculo se repite en cada evento (un filtro, una validación), hace falta el segundo argumento booleano para FORZAR el resultado según la condición actual, no según lo que hubiera antes. Ver Fallo 52.

### `Element.contains()` vs. `DOMTokenList.contains()` (nuevo, 23/08)
- **Dos métodos con el mismo nombre, en objetos distintos:** `elemento.contains(nodo)` responde si un NODO está adentro de otro (para saber si un click cayó dentro de un contenedor); `elemento.classList.contains(nombreDeClase)` responde si una CLASE está puesta. Antes de escribir `.contains(...)`, confirmar sobre cuál de los dos objetos se está llamando y qué tipo de argumento espera. Ver Fallo 55.

### Clamping con `Math.min`/`Math.max` en vez de condiciones a mano (nuevo, 23/08)
- **`Math.min(tope, valor)`/`Math.max(piso, valor)` fijan un límite sin el riesgo de "por uno" de un `if` con `<=`/`>=`.** El orden importa: el límite siempre primero, el valor candidato después. Y nunca usar `++`/`--` dentro de la expresión que se le pasa si el resultado se va a reasignar a la misma variable — el efecto secundario del operador se pierde, pisado por la propia asignación (ver "Postfix vs. prefix"). Ver Fallo 56.

### Acumulador compartido entre dos ramas de lógica distinta (nuevo, 23/08)
- **Cuando un mismo evento puede significar dos cosas distintas (sincronizar hacia abajo vs. recalcular hacia arriba), cada rama necesita su propia fuente de verdad** — reutilizar la misma variable para las dos, aunque parezca ahorrar código, hace que un ajuste pensado para una rompa la otra sin avisar. Para "forzar" un valor, leer el elemento real en el momento; para "acumular" un resultado, una variable local que arranca en su valor neutro y solo ese bucle la toca. Ver Fallo 58.

### Exclusividad vs. cierre independiente (nuevo, 23/08, bloque de refuerzo)
- **Dos patrones de recorrido que se PARECEN a simple vista piden lógica opuesta:** un acordeón/filtro EXCLUSIVO (marcar uno, desmarcar a TODOS los demás — necesita un `forEach` sobre TODA la colección) vs. un cierre INDEPENDIENTE por ítem (tocar solo el que se clickeó, sin recorrer ni tocar a los demás para nada). Antes de escribir el `forEach`, identificar cuál de los dos pide el enunciado — no copiar el patrón del ejercicio anterior por parecido superficial. Ver Fallo 60.

### Un elemento nunca se busca a sí mismo por su propio id (nuevo, 23/08, bloque de refuerzo)
- **`elemento.querySelector('#el-id-del-propio-elemento')` busca entre los HIJOS de `elemento`, nunca se encuentra a sí mismo — da `null`.** Si el elemento ya lo tenés como parámetro o variable, usalo directo; `querySelector`/`querySelectorAll` sirven para bajar a descendientes, no para "confirmar" algo que ya tenés en la mano. Ver Fallo 60.

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

# 🐘 SYMFONY · 17/08/2026 (Formularios)

## 🐛 REGISTRO DE FALLOS Y MEJORAS

---

### Fallo 28: `TareaType` — tipo mal escrito + `use` faltante

**❌ Código original:**
```php
// sin "use ...\TextType;" en los imports
->add('title', TextTye::class, [
    'label' => "Titulo de la Tarea",
    'required' => true,
])
```

**✅ Mejora:**
```php
use Symfony\Component\Form\Extension\Core\Type\TextType;
// ...
->add('title', TextType::class, [...])
```

**🧠 Teoría:** dos fallos en la misma línea. El nombre del tipo tenía un typo (`TextTye`), y encima faltaba su `use` — cada tipo de campo (`TextType`, `DateType`, `ChoiceType`...) necesita su propio import, igual que `OptionsResolver`. Sin el `use`, aunque el nombre estuviera bien escrito, tampoco habría funcionado.

**Estado:** ✅ Completado

---

### Fallo 29: `crear()` — entidad incompleta antes de `createForm()`

**❌ Código original:**
```php
$tarea = new Tarea();
$form = $this->createForm(TareaType::class, $tarea);
// done y createdAt nunca se rellenan
```

**✅ Mejora:**
```php
$tarea = new Tarea();
$tarea->setDone(false);
$tarea->setCreatedAt(new \DateTimeImmutable());
$form = $this->createForm(TareaType::class, $tarea);
```

**🧠 Teoría:** `TareaType` solo mapea `title` — `done` y `createdAt` no están en el formulario, así que nadie los rellena por defecto. Como esas columnas son `NOT NULL` en la base de datos, sin este paso el `flush()` habría explotado. Los campos que NO están en el formulario tienen que llegar ya resueltos en la entidad ANTES de crear el formulario.

**Estado:** ✅ Completado

---

### Fallo 30: `tareaEditada()` — `Request` usado pero nunca declarado

**❌ Código original:**
```php
public function tareaEditada(Tarea $tarea, EntityManagerInterface $em): Response
{
    $form = $this->createForm(TareaType::class, $tarea);
    $form->handleRequest($request); // ❌ $request no existe en este método
```

**✅ Mejora:**
```php
public function tareaEditada(Request $request, Tarea $tarea, EntityManagerInterface $em): Response
```

**🧠 Teoría:** tener el `use Symfony\Component\HttpFoundation\Request;` arriba solo importa la clase — no inyecta el objeto. Cada método necesita pedir explícitamente cada dependencia que use, como parámetro de su propia firma.

**Estado:** ✅ Completado

---

### Fallo 31: `TareaType` — patrón de opción personalizada incompleto (3 piezas, faltaron 2)

**❌ Código original:**
```php
// buildForm() — el campo se añadía SIEMPRE, sin condición
->add('edicion', ChoiceType::class, [
    'choices' => ['Pendiente' => false, "Hecha" => true],
]);
// configureOptions() con la opción, pero nunca leída en buildForm()

// controlador — nunca se pasaba la opción
$form = $this->createForm(TareaType::class, $tarea);
```

**✅ Mejora:**
```php
// buildForm()
if ($options['edicion']) {
    $builder->add('done', ChoiceType::class, [
        'choices' => ['Pendiente' => false, 'Hecha' => true],
        'expanded' => true,
    ]);
}

// configureOptions()
$resolver->setDefaults(['data_class' => Tarea::class, 'edicion' => false]);

// controlador, solo en editar()
$form = $this->createForm(TareaType::class, $tarea, ['edicion' => true]);
```

**🧠 Teoría:** el patrón de "opción personalizada" (del PDF, con `esAdmin`) tiene TRES piezas que van sincronizadas, y solo la primera estaba bien:
1. Declarar el default en `configureOptions()` — ✅ estaba.
2. Leer esa opción DENTRO de `buildForm()` con un `if` para decidir qué campos añadir — ❌ faltaba, el campo se añadía siempre.
3. Pasar el valor distinto desde el controlador, solo donde hace falta (`editar()`, no en `crear()`) — ❌ faltaba, `createForm()` nunca recibía el tercer argumento.

Además, el nombre del campo (`edicion`) no coincidía con ninguna propiedad real de la entidad — tenía que ser `done`, y le faltaba `expanded: true` para que saliera como radio buttons en vez de `<select>`.

**Estado:** ✅ Completado (con guía paso a paso)

---

### Fallo 32: `index()` — `Request` sin declarar (reincidencia del Fallo 30) + variable inconsistente + código muerto

**❌ Código original:**
```php
public function index(TareaRepository $tareaRepository): Response  // ❌ falta Request $request, otra vez
{
    $titulo = $request->query->get('termino');   // ❌ guarda en $titulo...
    $tarea = new Tarea();                          // ❌ sobra, no se usa
    if($termino)                                    // ❌ ...pero comprueba $termino (nunca definida)
    $lista = $tareaRepository->findByTitle($termino);
```

**✅ Mejora:**
```php
public function index(Request $request, TareaRepository $tareaRepository): Response
{
    $termino = $request->query->get('termino');
    $lista = $termino ? $tareaRepository->findByTitle($termino) : $tareaRepository->findAll();
```

**🧠 Teoría:** el olvido de `Request $request` en la firma ya había pasado en `tareaEditada()` (Fallo 30) — segunda vez el mismo día. Y el fallo de `$titulo`/`$termino` es la misma familia que los Fallos 20/21 de Twig, pero ahora en variables PHP: guardar un valor en un nombre y comprobar/usar otro distinto — sin error visible, la condición simplemente nunca se cumple (variable indefinida = `null` = `false`).

**Estado:** ✅ Completado

---

### Fallo 33: `TareaRepository::findByTitle()` — propiedad inexistente

**❌ Código original:**
```php
->andWhere('n.name LIKE :titulo')   // ❌ Tarea no tiene "name", tiene "title"
->orderBy('n.name', 'DESC')          // ❌ mismo error, repetido
```

**✅ Mejora:**
```php
->andWhere('n.title LIKE :titulo')
->orderBy('n.title', 'DESC')
```

**🧠 Teoría:** a diferencia de un placeholder (`:titulo`, arbitrario, Fallo 24), el nombre después de `n.` SÍ tiene que ser una propiedad real de la Entity — Doctrine no inventa columnas, tira `QueryException` si no existe.

**Estado:** ✅ Completado

---

### Fallo 34: `index()` — aplicar el patrón de crear/editar a un formulario de solo lectura

**❌ Código original:**
```php
$form = $this->createForm(BusquedaType::class);
$form->handleRequest($request);
if($form->isSubmitted() && $form->isValid()){
    $em->persist($tarea);        // ❌ $em ni $tarea existen en este método
    $em->flush();
    return $this->redirectToRoute('app_tareas');  // ❌ además, esto BORRARÍA el filtro buscado
}
```

**✅ Mejora:**
```php
$form = $this->createForm(BusquedaType::class);  // solo para renderizar, sin handleRequest
// el filtro se lee directo de $request->query, como ya se hacía
```

**🧠 Teoría:** no todo formulario necesita el ciclo `handleRequest()`/`isSubmitted()`/`persist()`/`redirect`. Ese ciclo completo es para formularios que MUTAN datos (crear, editar, borrar). Un formulario de búsqueda/filtro por `GET` es de solo lectura — se lee la query string directo, y el formulario solo sirve para pintar el HTML. Copiar el patrón de `crear()` sin pensar si aplica generó dos variables inexistentes y además rompía la funcionalidad (el redirect perdía el término buscado).

**Estado:** ✅ Completado

---

### Fallo 35: `busqueda.html.twig` — `extends` en un parcial (reincidencia del Fallo 25) + variable equivocada

**❌ Código original:**
```twig
{% extends 'base.html.twig' %}     {# ❌ un parcial para include no extiende nada — Fallo 25, otra vez #}
{% block body %}
    {{ form_start(formularioTarea) }}   {# ❌ variable de OTRO formulario, nunca se pasó a este parcial #}
```

**✅ Mejora:**
```twig
{{ form_start(buscador) }}
    {{ form_widget(buscador) }}
{{ form_end(buscador) }}
```

**🧠 Teoría:** mismo gotcha del Fallo 25 (12/08), reincidiendo en un contexto distinto (formulario en vez de lista) — confirma que el punto sigue sin estar del todo interiorizado. Y la variable dentro de un parcial siempre es la que le llega por el `with {clave: valor}` del `include`, nunca una prestada de otra plantilla.

**Estado:** ✅ Completado (reincidencia — repasar antes del próximo `include`)

---

### Fallo 36: `render()` — pasar el `Form` crudo en vez del `FormView`

**❌ Código original:**
```php
'busqueda' => $form   // ❌ objeto Form completo, no seguro para Twig
```

**✅ Mejora:**
```php
'busqueda' => $form->createView()
```

**🧠 Teoría:** `form_start()`/`form_widget()`/etc. en Twig esperan específicamente un `FormView` — pasar el `Form` (con toda su lógica de validación/envío) da un error de tipo al renderizar. `createView()` no es un paso opcional de estilo, es obligatorio siempre que un formulario llegue a una plantilla.

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

### Twig — `extends` vs `include` (reincidió dos veces — 12/08 y 17/08)
- **`extends` hereda una estructura entera (páginas completas); `include` inserta un fragmento chico.** Un parcial para `include` nunca lleva `extends` — confundirlos puede crear referencias circulares (Fallo 25, 12/08 → Fallo 35, 17/08). Antes de escribir CUALQUIER parcial nuevo, primera pregunta: "¿esto se va a incluir o se va a extender?" — si es un `include`, cero `extends`/`block`, directo el fragmento.

### Controlador — declarar `Request $request` cuando se usa (reincidió dos veces — Fallos 30 y 32)
- **Si un método lee algo de la petición (`$request->query`, `$request->get()`...), `Request $request` tiene que estar en la firma del método** — tener el `use` arriba no alcanza, cada método pide sus propias dependencias. Revisar esto ANTES de escribir cualquier línea que use `$request`.

### Reconocer cuándo un formulario necesita el ciclo completo de procesamiento
- **No todo formulario lleva `handleRequest()` + `isSubmitted()` + `persist()`/`flush()` + redirect.** Ese ciclo es para formularios que MUTAN datos (crear, editar, borrar). Un formulario de filtro/búsqueda por `GET` es de solo lectura: se lee la query string directo (`$request->query->get(...)`), y el formulario solo sirve para pintar el HTML — copiar el patrón de mutación a un caso de solo-lectura generó variables inexistentes y rompía la funcionalidad (Fallo 34).

### Doctrine — `$em->flush()` sin `$em` no avisa
- **`flush()` sin `$em->` es una función real de PHP (buffer de salida), no un error.** El cambio en memoria (`setDone(true)`, etc.) se pierde en silencio si no se llama al `flush()` del EntityManager inyectado. Revisar SIEMPRE que el método reciba `EntityManagerInterface $em` cuando modifica una entidad (Fallo 23).

### Doctrine — placeholder de QueryBuilder ≠ nombre de propiedad
- **El nombre en `:algo` (where) y en `setParameter('algo', valor)` es arbitrario, elegido por vos** — no tiene relación con la propiedad de la Entity que estás comparando. El valor que rellena el placeholder lo decide la lógica de negocio del método (`findPendientes` → `false`), no el nombre de la propiedad (Fallo 24).

### Formularios — patrón de opción personalizada (3 piezas sincronizadas) — repasar en próximos ejercicios
- **Es un patrón de tres piezas, no una sola:** (1) declarar el default en `configureOptions()`, (2) leer esa opción dentro de `buildForm()` con un `if` para decidir qué campos añadir, (3) pasar el valor distinto desde el controlador en el `createForm(Type::class, $entidad, ['opcion' => valor])` de cada caso que lo necesite. Fallar cualquiera de las tres rompe el patrón completo, aunque el resto esté bien (Fallo 31). Concepto marcado explícitamente para dominar — repasarlo activamente la próxima vez que aparezca un formulario con comportamiento condicional.
- **El nombre del campo en `add()` tiene que coincidir con una propiedad real de la entidad** (o llevar `mapped: false` si es a propósito) — nombres inventados como "edicion" en vez de "done" rompen el mapeo automático.

---

*Bloque de Formularios (17/08/2026), F1-F9 completados: `make:form`, `configureOptions()`/`buildForm()`, Constraints, renderizado Twig (`form_widget`/`form_row`), procesamiento con `handleRequest`/`isSubmitted`/`isValid`, patrón de opción personalizada, formulario sin entidad + QueryBuilder con `LIKE`, y formulario de borrado (CSRF). Pendiente: F10 (`form_row` individual en `crear.html.twig`). Puntos a reforzar activamente (ver arriba): patrón de opción personalizada (3 piezas), `extends` vs `include` (reincidió dos veces), declarar `Request $request` cuando se usa (reincidió dos veces), reconocer cuándo un formulario necesita el ciclo completo vs solo lectura. Próxima sesión de Symfony según el PDF real (no el roadmap maestro): bloque 6 — Servicios (Service Container). Ver `project_symfony_plan_temario_pdf.md` en memoria persistente.*