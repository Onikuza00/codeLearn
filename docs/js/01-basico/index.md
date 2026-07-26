# JS Básico — Conceptos clave

> Lecciones, errores comunes y patrones personales a vigilar durante el aprendizaje de JavaScript.

---

## 🔢 Operadores

### Módulo (`%`)

Devuelve el **resto** de una división.

```js
10 % 3  → 1   // 3 cabe 3 veces, sobra 1
10 % 2  → 0   // cabe exacto → par
7 % 2   → 1   // sobra 1 → impar
```

| Uso | Código |
|-----|--------|
| Detectar par | `n % 2 === 0` |
| Detectar impar | `n % 2 !== 0` |
| Detectar divisor exacto | `n % divisor === 0` |

### Incremento (`++`) vs Asignación con suma (`+=`)

```js
suma++;     // suma = suma + 1  → CONTAR ocurrencias
suma += i;  // suma = suma + i  → ACUMULAR valores
```

**Error clásico:** en `sumarPares`, Pau usó `suma++` para contar pares, pero el ejercicio pedía sumar el **valor** de cada par. `suma++` da 3 (cantidad de pares hasta 6), `suma += i` da 12 (2+4+6).

### Negación (`!`) vs Desigualdad (`!==`)

**No son lo mismo:**

```js
let x = 5;
!x         → false   // ! CONVIERTE a booleano y lo NIEGA
x !== 3    → true    // !== pregunta "son distintos?"
```

**Error:** `!i % 2 == 0` no significa "i es impar". Por precedencia, se ejecuta como `(!i) % 2 == 0`. Lo correcto: `i % 2 !== 0`.

### Precedencia de operadores

```
!  (negación)  → 1°
%  (módulo)    → 2°
==  (igualdad) → 3°
&&  (and)      → 4°
||  (or)       → 5°
```

**Regla:** si hay dudas, **usá paréntesis**. `(i % 2 !== 0)` es más legible y no falla.

---

## 📦 Strings

### `split()` según el separador

Parte un string por el separador y devuelve array.

| Código | Separa por | Resultado |
|--------|-----------|-----------|
| `"hola".split("")` | **cada caracter** | `["h","o","l","a"]` |
| `"hola mundo".split(" ")` | **cada palabra** | `["hola","mundo"]` |
| `"a,b,c".split(",")` | **coma** | `["a","b","c"]` |

El separador **desaparece** del resultado.

### Acceso por índice — `string[i]`

Podés acceder y también **mirar atrás/adelante**:

```js
let str = "hola";
str[2]     → "l"
str[2-1]   → "o"       // el anterior
str[2+1]   → "a"       // el siguiente
```

**Aplicación:** en `limpiarEspacios`, mirás `str[i-1]` para saber si el espacio anterior era igual.

### `.toUpperCase()` en espacios

```js
" ".toUpperCase() === " "   // true
```

Los espacios **no tienen mayúscula/minúscula**, pero `toUpperCase()` devuelve el mismo carácter. En `contarMayusculas`, Pau tuvo que agregar `&& letra !== " "` para no contarlos.

---

## 📊 Arrays

### `.length` según el tipo

| Tipo | ¿Tiene? | Ejemplo |
|------|---------|---------|
| **String** | ✅ | `"hola".length` → 4 |
| **Array** | ✅ | `[1,2,3].length` → 3 |
| **Number** | ❌ | `(5).length` → `undefined` |

⚠️ En `filtrarMayores`, Pau hizo `item.length > limite` en números. No da error, devuelve `undefined`, y `undefined > 5` es `false` silenciosamente.

### Comparar elementos adyacentes

```js
for (let i = 0; i < array.length - 1; i++) {
  if (array[i] > array[i + 1]) return false;
}
```

Usar SIEMPRE `length - 1`. El último elemento no tiene "siguiente".

---

## 🔁 Bucles

### Off-by-one: `<` vs `<=`

El error más común. Con `n = 5`:

| Condición | ¿i=5 ejecuta? |
|-----------|:-------------:|
| `i < n` | ❌ No — `5 < 5` es false |
| `i <= n` | ✅ Sí — `5 <= 5` es true |

**Preguntarse siempre:** "¿este loop debería incluir el valor `n`?"

### Contador global vs contexto local

Para `limpiarEspacios`, Pau usó `count++` que nunca se reiniciaba. No sirve.

**Solución:** mirar `string[i - 1]` en vez de contar.

---

## 🧩 Lógica

### Números primos

```js
function esPrimo(n) {
  if (n < 2) return false;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;  // encontró divisor
  }
  return true;  // ningún divisor
}
```

**Error de Pau:** `n % n == 0 && n % 1 == 0` es **siempre true** para cualquier número. No filtra nada.

---

## 🔍 Patrones personales a vigilar

| # | Patrón | Ejemplo incorrecto | Solución |
|---|--------|-------------------|----------|
| 1 | Off-by-one | `i < n` cuando `n` debe incluirse | `i <= n` |
| 2 | Acumular vs contar | `suma++` en vez de `suma += i` | Usar el operador correcto |
| 3 | `!` como "no es igual" | `!i % 2 == 0` | `i % 2 !== 0` |
| 4 | `.length` en números | `item.length > limite` | `item > limite` |
| 5 | Contador global para contexto local | `count++` en espacios | Mirar `string[i-1]` |
| 6 | Primos: condición siempre true | `n % n == 0` | Loop de 2 a n-1 |
| 7 | Condición imposible | `array[i] + 1 < array[i]` | `array[i] > array[i + 1]` |
| 8 | No filtrar espacios | `letra === letra.toUpperCase()` | Agregar `&& letra !== " "` |

---

## ❌ Errores comunes

| Concepto | Cómo era | Cómo debería ser | Por qué |
|----------|----------|-----------------|---------|
| Inicializar acumuladores | `let result;` | `let result = 0` | `undefined + número = NaN` |
| Bucle contra array vacío | `for (let i = 0; i < numeros.length; i++)` | Comparar contra el parámetro `n` | Si el array está vacío, el bucle nunca ejecuta |
| Último índice al invertir | `for (let i = x.length; i > 0; i--)` | `for (let i = x.length - 1; i >= 0; i--)` | `length` es cantidad, el último índice es `length - 1` |
| Variable undefined | `lista.push(x[index])` | `lista.push(x[i])` | `index` no existe, debe ser la variable del bucle |
| `.includes()` al revés | `x[i].includes(vocales)` | `vocales.includes(x[i])` | Preguntar "¿la lista contiene el elemento?" |
| Inicializar máximo en 0 | `let mayor = 0` | `let mayor = x[0]` o `-Infinity` | Si todos son negativos, 0 no está en el array |
| FizzBuzz orden condiciones | `fizz` antes que `fizzbuzz` | Primero la condición más específica (`&&`) | Si es múltiplo de 3 y 5, entra en el primer `if` y nunca llega a `fizzbuzz` |
| `.toUpperCase()` en espacios | `letra === letra.toUpperCase()` | `letra === letra.toUpperCase() && letra !== " "` | `" ".toUpperCase()` es `" "`, da true siempre |

---

## ✅ Patrones que domino

- `forEach` para recorrer arrays
- `split("")` + `reverse()` + `join("")` para invertir caracteres
- `includes()` para detectar duplicados
- `.toLowerCase()` para case-insensitive
- Acumulador con `suma += n` en loop/forEach
- Early return para arrays vacíos
- `&&` para múltiples condiciones en un `if`

## ⚠️ Patrones a reforzar

### Bucles
- **Off-by-one:** al definir un loop, preguntar "¿incluyo o excluyo el límite?"

### Operadores
- **`!` ≠ `!==`:** `!` niega booleano, `!==` pregunta "es distinto"
- **Precedencia:** usar paréntesis si hay dudas

### Tipos
- **`.length`** solo en strings/arrays. Números NO tienen.
- **Casos borde:** espacios en `toUpperCase()`, strings vacíos, arrays de 1 elemento

### Lógica
- **Mirar "para atrás":** `array[i-1]` o `string[i-1]` para contexto local
- **Primos:** si encuentro divisor → no es primo. Si termino el loop → es primo
- **Adyacentes:** comparar `array[i]` con `array[i+1]`, loop hasta `length - 1`
