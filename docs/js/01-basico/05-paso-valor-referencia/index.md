# Valor vs. referencia { .bloque-js }

> JavaScript no trata todos los tipos de datos igual cuando los asignas o los pasas a una función. Los primitivos se **copian**; los objetos, arrays y funciones se **comparten**. No entender esta diferencia es la causa de bugs donde "modificas una cosa y cambia otra que no tocaste".

---

## Paso por valor {: .topic-title }

`string`, `number`, `boolean`, `null`, `undefined`, `symbol` y `bigint` son primitivos. Al asignarlos o pasarlos como argumento, JavaScript crea **una copia independiente** del valor — modificar la copia nunca afecta al original.

```js
let puntuacion = 100;
let puntuacionJugador = puntuacion;

puntuacionJugador = 150;

console.log(puntuacion);          // 100 — intacto
console.log(puntuacionJugador);   // 150
```

Lo mismo pasa al entrar a una función: el parámetro recibe una copia, no el original.

```js
function aumentarPuntuacion(actual) {
    actual = actual + 10;
}

let puntuacionInicial = 100;
aumentarPuntuacion(puntuacionInicial);

console.log(puntuacionInicial);   // 100 — sin cambios
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-paso-valor"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-paso-valor");
    if (!el) return;
    var puntuacion = 100;
    var puntuacionJugador = puntuacion;
    puntuacionJugador = 150;
    var lineas = [
        "puntuacion         → " + puntuacion,
        "puntuacionJugador  → " + puntuacionJugador + "   (cambió sola, no afectó a la otra)"
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

---

## Paso por referencia {: .topic-title }

Estos tipos NO se copian al asignarlos. Se copia la **referencia** — la dirección de memoria donde vive el valor real. Dos variables pueden apuntar al mismo objeto: modificar una lo modifica para las dos.

```js
let jugador1 = { nombre: "Pau", vida: 100 };
let jugador2 = jugador1;

jugador2.vida = 50;

console.log(jugador1.vida);   // 50 — también cambió
```

Con arrays pasa exactamente igual:

```js
let equipoA = ["Ana", "Leo"];
let equipoB = equipoA;

equipoB.push("Marc");

console.log(equipoA);   // ["Ana", "Leo", "Marc"] — también cambió
```

Y al pasarlos como argumento de una función, la función recibe la misma referencia — mutar el objeto/array dentro de la función se ve fuera de ella:

```js
function agregarMiembro(equipo, nuevo) {
    equipo.push(nuevo);
}

let miEquipo = ["Ana", "Leo"];
agregarMiembro(miEquipo, "Marc");

console.log(miEquipo);   // ["Ana", "Leo", "Marc"] — la función SÍ lo cambió
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-paso-referencia"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-paso-referencia");
    if (!el) return;
    var jugador1 = { nombre: "Pau", vida: 100 };
    var jugador2 = jugador1;
    jugador2.vida = 50;
    var lineas = [
        "jugador1.vida → " + jugador1.vida + "   (jugador2 es la MISMA referencia, no una copia)"
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

!!! danger "Esto es la otra cara de 'no mutar, crear nuevo'"
    Ya viste este mecanismo desde el lado de la solución en [Spread Operator](../../03-objetos/05-spread/index.md) y en los métodos de arrays que no mutan. Ahora ves el motivo real por el que hace falta `{...obj}` o `[...arr]`: sin el spread, `let copia = original` NO crea una copia — crea una segunda etiqueta para el mismo objeto.

---

## Primitivo dentro de un objeto {: .topic-title }

Que un objeto se pase por referencia no significa que **todo lo que hay dentro** se comporte igual. Si extraes una propiedad primitiva (`objeto.propiedad`) y la pasas sola a una función, esa propiedad viaja por valor — como cualquier primitivo.

```js
function subirNivel(nivel) {
    nivel = nivel + 1;
    return nivel;
}

let personaje = { nombre: "Héroe", nivel: 5 };
subirNivel(personaje.nivel);

console.log(personaje.nivel);   // 5 — sin cambios, se pasó una COPIA del número
```

Para que el cambio se vea reflejado, hace falta pasar el objeto completo y modificar la propiedad desde dentro:

```js
function subirNivel(personaje) {
    personaje.nivel = personaje.nivel + 1;
}

let personaje = { nombre: "Héroe", nivel: 5 };
subirNivel(personaje);

console.log(personaje.nivel);   // 6 — modificado
```

!!! tip "La pregunta que resuelve la duda"
    ¿Qué le estoy pasando a la función: el objeto entero, o un valor que saqué de adentro con `.propiedad`? Si es el objeto entero → referencia compartida, mutar adentro se nota afuera. Si es un valor suelto (aunque venga de un objeto) → copia independiente, mutar adentro no se nota afuera.

---

## Por qué funciona así {: .topic-title }

Copiar un objeto o array completo cada vez que se asigna o se pasa a una función sería caro en memoria y en tiempo, sobre todo con estructuras grandes. Compartir la referencia es mucho más eficiente — el coste es que hay que ser consciente de cuándo dos variables apuntan al mismo sitio, para no mutar algo sin querer.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa `{...obj}` / `[...arr]` cuando necesites una copia independiente | Asumir que `let copia = original` copia un objeto o array |
| Antes de mutar un objeto/array recibido como parámetro, pregúntate si el original debería cambiar | Mutar un parámetro objeto/array "sin querer" dentro de una función |
| Recuerda que un primitivo sacado con `.propiedad` viaja por valor, aunque venga de un objeto | Esperar que modificar un número/string extraído de un objeto cambie el objeto original |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Paso por valor y por referencia** | https://www.aprendejavascript.dev/clase/referencia-prototipo/objetos-referencia |
| 📘 **MDN — Tipos de datos y estructuras** | https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures |
