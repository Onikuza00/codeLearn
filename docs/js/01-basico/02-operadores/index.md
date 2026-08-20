# Operadores { .bloque-js }

> No todos los operadores que "hacen algo parecido" se comportan igual. Esta página junta los que más confusión generan en la práctica — no por ser raros, sino porque el código con el operador equivocado sigue corriendo sin error, y devuelve algo distinto de lo que esperabas sin avisar.

---

## `x++` vs `++x` {: .topic-title }

`x++` y `++x` suman 1 a `x` — hasta ahí, iguales. La diferencia está en **qué valor te devuelve la expresión en el momento en que la usás**, no en el resultado final de `x`.

!!! danger "Postfix devuelve el valor VIEJO. Prefix devuelve el valor NUEVO."
    ```js
    let x = 1;
    console.log(x++);   // 1 — te da el valor que x TENÍA, y RECIÉN DESPUÉS lo incrementa
    console.log(x);     // 2 — ahora sí, ya incrementado

    let y = 1;
    console.log(++y);   // 2 — incrementa PRIMERO, y te da el resultado ya sumado
    ```
    `x++` ("post-fijo", el `++` va DESPUÉS): primero te entrega el valor actual, y el incremento pasa como efecto secundario, después de haberte dado ese valor. `++x` ("pre-fijo", el `++` va ANTES): incrementa primero, y te entrega el valor ya actualizado. El nombre del operador te dice literalmente dónde pasa el incremento respecto a cuándo te llega el valor.

!!! tip "Lo mismo pasa con `this.propiedad`"
    El operador no distingue entre una variable suelta y una propiedad de objeto — `this.valor++` y `++this.valor` siguen exactamente la misma regla que `x++`/`++x`, porque `this.valor` es simplemente el lugar donde está el número.
    ```js
    const contador = { valor: 0 };

    function incrementarMal() {
        return contador.valor++;   // devuelve 0 (el valor VIEJO), aunque contador.valor ya pasó a ser 1
    }

    function incrementarBien() {
        return ++contador.valor;   // devuelve 1 (el valor NUEVO) — esto es lo que casi siempre querés
    }
    ```
    Si una función "cuenta" algo y devuelve `this.algo++`, el número que devuelve va siempre una llamada por detrás del estado real — el mismo desfase que con cualquier variable suelta, solo que más difícil de notar porque está escondido detrás de `this.`.

<div class="pros-cons" markdown="1">

| Operador | Nombre | Incrementa/decrementa | Devuelve |
|---|---|---|---|
| `x++` | Postfix (incremento posterior) | `x` en 1 | El valor de `x` **antes** de sumar |
| `++x` | Prefix (incremento previo) | `x` en 1 | El valor de `x` **después** de sumar |
| `x--` | Postfix (decremento posterior) | `x` en -1 | El valor de `x` **antes** de restar |
| `--x` | Prefix (decremento previo) | `x` en -1 | El valor de `x` **después** de restar |

</div>

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-postfix-prefix"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-postfix-prefix");
    if (!el) return;
    var x = 3, yPost = x++;
    var a = 3, yPre = ++a;
    var lineas = [
        "let x = 3; const yPost = x++;   → yPost = " + yPost + ", x ahora = " + x,
        "let a = 3; const yPre  = ++a;   → yPre  = " + yPre  + ", a ahora = " + a
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

**Por qué importa cuando devolvés el resultado:** el caso donde esto muerde de verdad es cuando usás la expresión completa (`x++` o `++x`) como el valor que le devolvés a alguien más — un `return`, un argumento, un `console.log`.

```js
function incrementarBien(contador) {
    return ++contador.valor;   // devuelve el valor NUEVO — lo que casi siempre querés
}

function incrementarConfuso(contador) {
    return contador.valor++;   // devuelve el valor VIEJO — un resultado corrido hacia atrás
}
```

!!! tip "Consejo"
    Si necesitás el valor YA actualizado como resultado, usá `++x`. Si el valor de retorno de la expresión no te importa (por ejemplo, en la actualización de un `for`), `x++` alcanza — ahí nadie lee ese resultado.

---

## Nullish coalescing `??` {: .topic-title }

`??` dice: "si lo de la izquierda es `null` o `undefined`, usá lo de la derecha". Se documenta en profundidad junto a `?.` en [Optional chaining](../../03-objetos/04-optional-chaining/index.md) — acá va el resumen comparativo con su "primo" `||`, que es donde está la trampa real.

```js
const precio = 0;

precio || 100;   // 100 — ❌ pisa el 0 porque 0 es falsy
precio ?? 100;   // 0   — ✅ respeta el 0 porque no es null/undefined
```

<div class="pros-cons" markdown="1">

| Operador | Cae al valor por defecto cuando la izquierda es... |
|---|---|
| `\|\|` | Cualquier valor **falsy**: `0`, `""`, `false`, `null`, `undefined`, `NaN` |
| `??` | **Solo** `null` o `undefined` |

</div>

!!! danger "`??` no es lo mismo que `||`"
    Si un valor válido puede ser `0`, `""` o `false`, `||` te lo pisa por error — `??` respeta esos valores porque no son `null`/`undefined`. Mismo tipo de gotcha que los arrays truthy: elegí la herramienta que pregunta exactamente lo que necesitás, no la que "más o menos" funciona.

!!! tip "Consejo"
    Con operaciones aritméticas, `??` siempre entre paréntesis: `(valor ?? 0) + 10`, no `valor ?? 0 + 10` — `??` tiene menos precedencia que `+`, y sin paréntesis el resultado puede darte `NaN` en vez del default.

---

## Ternario `? :` {: .topic-title }

El ternario condensa un `if`/`else` de una sola asignación en una línea. Se documenta con más detalle en [Estructuras de control](../03-estructuras-control/index.md) — acá el resumen comparativo con el `if`/`else` que reemplaza.

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

<div class="pros-cons" markdown="1">

| Situación | Usa |
|---|---|
| Elegir entre 2 valores para asignar o devolver | Ternario `? :` |
| Ejecutar una acción (llamar una función, loggear, mutar algo) según una condición | `if` / `else` normal |
| Las dos ramas del ternario terminan devolviendo lo mismo, o son booleanos | `??` o la condición sola — el ternario sobra |

</div>

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

!!! tip "Consejo"
    Si las dos ramas del ternario terminan en lo mismo salvo por chequear "¿existe?" (`valor ? valor : default`), esa repetición es la señal de usar `??` en su lugar — una sola expresión, sin repetir nada.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `++x` cuando necesitás el valor ya actualizado como resultado | Asumir que `x++` te da el valor sumado — postfix da el de ANTES |
| `??` cuando `0`, `""` o `false` son valores válidos que no querés pisar | `\|\|` para valores por defecto sin pensar si el valor real puede ser falsy |
| Ternario solo para elegir un valor a asignar/devolver | Ternario para ejecutar acciones — eso es trabajo de `if`/`else` |
| Paréntesis explícitos al mezclar `??` con operaciones aritméticas | `valor ?? 0 + 10` sin paréntesis — la precedencia no hace lo que parece |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Incremento (`++`)** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Increment |
| 📘 **MDN — Decremento (`--`)** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Decrement |
| 📘 **MDN — Nullish coalescing (`??`)** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing |
| 📘 **MDN — Operador condicional (ternario)** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Conditional_operator |
