# Métodos básicos { .bloque-js }

> Los valores primitivos (números, strings, booleanos) traen métodos ya hechos. Esta página los agrupa por categoría, con un ejemplo y el resultado real de cada uno. Confundir `contains` con `includes` o no saber que `Number("")` da `0` son fallos típicos de no tener esta lista a mano.

---

## Qué es un método {: .topic-title }

Un **método** es una función que "vive" dentro de un valor. Se llama con un punto: `valor.metodo()`. Un string trae los suyos (`"hola".toUpperCase()`), un número los suyos, y un array los suyos.

!!! danger "Los métodos de un tipo no existen en otro"
    Cada tipo tiene su lista. Si llamas a un método que no es de ese tipo, JS lanza `TypeError: x.metodo is not a function`.
    ```js
    "hola".contains("ol")   // ❌ TypeError: contains no existe en strings
    "hola".includes("ol")   // ✅ true
    ```
    `contains` es de los elementos del DOM (`menu.contains(nodo)`) y de `classList` (`classList.contains("clase")`), nunca de un string.

!!! tip "Los strings son inmutables"
    Ningún método de string cambia el string original: **devuelve uno nuevo**. Si no guardas el resultado, se pierde.
    ```js
    let texto = "  Hola  ";
    texto.trim();              // devuelve "Hola", pero texto sigue siendo "  Hola  "
    texto = texto.trim();      // ✅ ahora sí: guardas el nuevo
    ```

---

## Números {: .topic-title }

### Convertir a número

Lo que sale del DOM (`.value`, `.textContent`, `.dataset`) es **siempre texto**. Antes de comparar o sumar, hay que convertirlo.

| Método | Qué hace | Ejemplo | Resultado |
|---|---|---|---|
| `Number(x)` | Convierte **todo** el texto o falla | `Number("12.5")` | `12.5` |
| | | `Number("12px")` | `NaN` |
| `parseInt(x)` | Lee un entero desde el principio y **se para** en lo que no es dígito | `parseInt("12px")` | `12` |
| | Corta los decimales | `parseInt("12.9")` | `12` |
| `parseFloat(x)` | Igual que `parseInt`, pero conserva los decimales | `parseFloat("12.9px")` | `12.9` |

!!! warning "Los casos raros de `Number()`"
    ```js
    Number("")      // 0   ← un campo vacío se convierte en 0, no en NaN
    Number("   ")   // 0   ← solo espacios: también 0
    Number("12,5")  // NaN ← la coma no vale, el separador decimal es el punto
    Number(null)    // 0
    Number(undefined) // NaN
    ```
    Si un campo vacío no debe pasar por válido, comprueba el texto **antes** de convertir: `if (input.value === "") return;`

!!! tip "`Number` o `parseInt`"
    - `Number` es **estricto**: si hay algo que no es número, da `NaN`. Úsalo para validar.
    - `parseInt`/`parseFloat` son **tolerantes**: leen lo que pueden. Úsalos para sacar el `12` de `"12px"`.

### Comprobar si es un número

| Método | Qué pregunta | Ejemplo | Resultado |
|---|---|---|---|
| `isNaN(x)` | ¿Convertido a número, da `NaN`? | `isNaN("abc")` | `true` |
| | | `isNaN("")` | `false` (porque `Number("")` es `0`) |
| `Number.isNaN(x)` | ¿Es **exactamente** el valor `NaN`? | `Number.isNaN("abc")` | `false` (un string no es `NaN`) |
| `Number.isInteger(x)` | ¿Es un número entero? | `Number.isInteger(5)` | `true` |
| | | `Number.isInteger(5.5)` | `false` |
| | | `Number.isInteger("5")` | `false` (un string no es un número) |

!!! danger "`isNaN` convierte; `Number.isNaN` no"
    `isNaN("abc")` primero convierte `"abc"` a número (`NaN`) y por eso dice `true`. `Number.isNaN("abc")` no convierte nada: `"abc"` es un string, no el valor `NaN`, y dice `false`. Para validar texto de un formulario, `isNaN(texto)` es lo natural, pero recuerda que `""` y `"   "` pasan por números válidos.

### Redondear y dar formato

| Método | Qué hace | Ejemplo | Resultado |
|---|---|---|---|
| `Math.round(x)` | Al entero más cercano | `Math.round(2.5)` | `3` |
| `Math.floor(x)` | Hacia abajo | `Math.floor(2.9)` | `2` |
| `Math.ceil(x)` | Hacia arriba | `Math.ceil(2.1)` | `3` |
| `Math.trunc(x)` | Quita los decimales | `Math.trunc(-2.9)` | `-2` |
| `Math.min(a, b)` | El menor | `Math.min(5, 3)` | `3` |
| `Math.max(a, b)` | El mayor | `Math.max(5, 3)` | `5` |
| `x.toFixed(n)` | `n` decimales, **como string** | `(12.5).toFixed(1)` | `"12.5"` |

!!! warning "`toFixed` devuelve un string"
    ```js
    typeof (12.5).toFixed(1)   // "string"
    ```
    Si después quieres operar con el resultado, vuelve a pasarlo por `Number(...)`.

!!! warning "Los decimales de JS no son exactos"
    ```js
    0.1 + 0.2            // 0.30000000000000004
    (1.005).toFixed(2)   // "1.00"  ← no "1.01"
    ```
    Los números decimales se guardan en binario y algunos no caben exactos. Para dinero, trabaja en **céntimos enteros** (`1250` en vez de `12.5`) y divide solo al mostrarlo.

!!! tip "`Math.floor` y `Math.trunc` no son lo mismo con negativos"
    `Math.floor(-2.9)` es `-3` (hacia abajo) y `Math.trunc(-2.9)` es `-2` (quita los decimales sin más). Con positivos coinciden.

📖 Relacionado: [Variables y tipos](/js/01-basico/01-variables-tipos/) (coerción y `Math`) · [Operadores](/js/01-basico/02-operadores/)

---

## Strings {: .topic-title }

### Medir y acceder

| Método | Qué hace | Ejemplo | Resultado |
|---|---|---|---|
| `.length` | Cantidad de caracteres (propiedad, **sin paréntesis**) | `"Hola".length` | `4` |
| `[i]` | Carácter en la posición `i` (empieza en 0) | `"Hola"[0]` | `"H"` |
| `.at(i)` | Igual, pero admite negativos | `"Hola".at(-1)` | `"a"` |

!!! danger "`length` es del string, no del elemento"
    ```js
    input.length          // ❌ undefined: input es el ELEMENTO
    input.value.length    // ✅ el texto que contiene
    ```
    Antes de `.length` pregunta: *¿tengo el elemento o su valor?*

### Buscar dentro de un string

| Método | Qué pregunta | Ejemplo | Resultado |
|---|---|---|---|
| `a.includes(b)` | ¿`a` contiene entero a `b`? | `"Camiseta roja".includes("roja")` | `true` |
| `a.startsWith(b)` | ¿`a` empieza por `b`? | `"camiseta".startsWith("cam")` | `true` |
| `a.endsWith(b)` | ¿`a` acaba en `b`? | `"camiseta".endsWith("eta")` | `true` |
| `a.indexOf(b)` | ¿En qué posición está `b`? | `"camiseta".indexOf("s")` | `4` |
| | Si no está | `"camiseta".indexOf("z")` | `-1` |

!!! danger "`a.includes(b)`: los papeles importan"
    `a` es el texto **grande** y `b` lo que **buscas**. Pregunta si `a` contiene *entero* a `b`, no al revés ni letra por letra.
    ```js
    "0123456789".includes("12345")   // true  → "12345" es un trozo seguido
    "0123456789".includes("13579")   // false → aunque sean todo dígitos
    ```
    Para "¿todos los caracteres son dígitos?" hay que preguntar **carácter a carácter** (ver `split("")` más abajo).

!!! warning "Distingue mayúsculas de minúsculas"
    ```js
    "Camiseta roja".includes("cami")                 // false ← la C es mayúscula
    "Camiseta roja".toLowerCase().includes("cami")   // true
    ```
    Para un buscador sin distinguir mayúsculas, pasa **los dos lados** a minúsculas: el texto escrito y el dato donde buscas.

### Transformar

| Método | Qué hace | Ejemplo | Resultado |
|---|---|---|---|
| `.toLowerCase()` | A minúsculas | `"Hola".toLowerCase()` | `"hola"` |
| `.toUpperCase()` | A mayúsculas | `"hola".toUpperCase()` | `"HOLA"` |
| `.trim()` | Quita espacios al principio y al final | `"  hola  ".trim()` | `"hola"` |
| `.slice(i, j)` | Trozo desde `i` hasta `j` (sin incluir `j`) | `"camiseta".slice(0, 3)` | `"cam"` |
| | Con negativo cuenta desde el final | `"camiseta".slice(-4)` | `"seta"` |
| `.replace(a, b)` | Cambia la **primera** aparición | `"hola mundo".replace("o", "0")` | `"h0la mundo"` |
| `.replaceAll(a, b)` | Cambia **todas** | `"hola mundo".replaceAll("o", "0")` | `"h0la mund0"` |
| `.padStart(n, c)` | Rellena por delante hasta `n` caracteres | `"7".padStart(2, "0")` | `"07"` |
| `.repeat(n)` | Repite el texto `n` veces | `"ab".repeat(3)` | `"ababab"` |

!!! tip "`trim()` antes de validar"
    Un campo con solo espacios (`"   "`) tiene `length` 3 y parece "no vacío". `input.value.trim() === ""` lo detecta.

### De texto a array y de vuelta

| Método | Qué hace | Ejemplo | Resultado |
|---|---|---|---|
| `.split(sep)` | Parte el string en un array | `"a,b,c".split(",")` | `["a", "b", "c"]` |
| | Con `""` da cada carácter | `"12345".split("")` | `["1","2","3","4","5"]` |
| `array.join(sep)` | Une un array en un string | `["a", "b"].join("-")` | `"a-b"` |

Con `split("")` puedes preguntar carácter a carácter, algo que un string no permite directamente:

```js
const digitos = "0123456789";

"12345".split("").every(c => digitos.includes(c))   // true
"12a45".split("").every(c => digitos.includes(c))   // false
```

Aquí `includes` se usa bien: el texto grande (`digitos`) a la izquierda y el carácter suelto (`c`) a la derecha.

📖 Relacionado: [Métodos básicos de arrays](/js/02-arrays/02-metodos-basicos/) · [Iteración](/js/02-arrays/03-iteracion/) (`every`, `map`)

---

## Convertir entre tipos {: .topic-title }

| De → A | Cómo | Ejemplo | Resultado |
|---|---|---|---|
| Texto → número | `Number(x)` | `Number("42")` | `42` |
| Número → texto | `String(x)` o `x.toString()` | `String(123)` | `"123"` |
| Cualquiera → booleano | `Boolean(x)` | `Boolean("")` | `false` |

!!! danger "El `+` suma o concatena según el tipo"
    ```js
    "5" + 1     // "51" ← con un string, + CONCATENA
    "5" - 1     // 4    ← con - ,  *  y  / convierte a número
    "5" * "2"   // 10
    ```
    Por eso, si `input.value` es `"5"` y haces `input.value + 1`, obtienes `"51"`. Convierte antes: `Number(input.value) + 1`.

!!! danger "Un string no vacío es `true`, aunque diga `\"false\"`"
    ```js
    Boolean("")        // false ← solo el string VACÍO es falso
    Boolean("0")       // true
    Boolean("false")   // true  ← el texto "false" no es el booleano false
    ```
    Por eso `aria-expanded="false"` no se puede negar con `!`: `!"false"` es `false`. Compara contra el texto exacto: `valor === "false"`.

---

## Dónde encaja con el DOM {: .topic-title }

| Lo que lees | Qué tipo es | Antes de operar |
|---|---|---|
| `input.value` | string | `Number(...)` si es un número |
| `elemento.textContent` | string | `Number(...)` si es un número |
| `elemento.dataset.x` | string | `Number(...)` si es un número |
| `elemento.getAttribute("x")` | string | comparar contra el texto exacto (`"true"`) |
| Un parámetro de tu función | el tipo con el que te llamen | nada: ya trae su tipo |

Pregunta rápida antes de escribir: **"¿esto viene del DOM (texto) o me lo pasan como argumento (ya tiene su tipo)?"**

📖 Relacionado: [Manipulación del DOM](/js/04-dom/02-manipulacion/) · [Formularios y validación](/js/04-dom/03-eventos/03-pagina-formularios/)

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — `Number`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Number |
| 📘 **MDN — `parseInt`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/parseInt |
| 📘 **MDN — `String`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String |
| 📘 **MDN — `String.prototype.includes`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/includes |
| 📘 **MDN — `Math`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math |
