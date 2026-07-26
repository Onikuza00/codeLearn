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

---

*Próxima sesión: corregir Fallos 6, 7, 8, 9.*