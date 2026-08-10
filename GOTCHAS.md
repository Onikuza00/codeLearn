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

## ✅ PATRONES QUE DOMINO

- `forEach` para recorrer arrays
- `split("")` + `reverse()` + `join("")` para invertir caracteres
- `includes()` para detectar duplicados
- `.toLowerCase()` para comparación case-insensitive
- Acumulador con `suma += n` en loop/forEach
- Early return para arrays vacíos
- Usar `&&` para múltiples condiciones en un if

## ⚠️ PATRONES QUE NECESITO REFORZAR

### Bucles
- **Off-by-one:** al definir un loop, preguntarme "¿incluyo o excluyo el límite?" → `<` vs `<=`

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

---

*Próxima sesión (Día 06): resolver V2-V4 de la card "Día 05 · Array vacío + reduce" — `primeroSeguro` (early return con `.length === 0`), `sumarEdades` (reduce con valor inicial `0`), `precioTotalPerecederos` (reduce con condición adentro). Teoría de reduce ya está en `docs/js/02-arrays/index.md`.*