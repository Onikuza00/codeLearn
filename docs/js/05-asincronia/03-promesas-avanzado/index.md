# Promesas — composición { .bloque-js }

> Encadenar promesas resuelve la secuencia: primero esto, luego lo otro. Componer promesas resuelve lo contrario: lanzar varias operaciones **a la vez** y decidir cómo se combinan sus resultados.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/41VfSbuYBP0" title="async/await, Promise.all y Promise.allSettled — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Promesas ya resueltas {: .topic-title }

`Promise.resolve(valor)` y `Promise.reject(motivo)` crean una promesa que ya nace en su estado final. No hay espera: la promesa está cumplida (o rechazada) desde el primer instante.

```js
const yaLista = Promise.resolve("valor inmediato");
const yaFallida = Promise.reject(new Error("fallo inmediato"));
```

Su utilidad real es **normalizar**: convertir en promesa algo que puede ser un valor normal o una promesa, para tratarlo siempre igual.

```js
// La caché devuelve un valor directo; el servidor devuelve una promesa.
// Con Promise.resolve, quien llama no necesita distinguirlos.
function obtenerUsuario(id) {
    if (cache.has(id)) {
        return Promise.resolve(cache.get(id));
    }
    return fetch(`/api/usuarios/${id}`).then(r => r.json());
}

// Da igual de dónde venga: siempre se consume igual
obtenerUsuario(7).then(usuario => pintar(usuario));
```

---

## `Promise.all()` — todas o ninguna {: .topic-title }

`Promise.all(arrayDePromesas)` lanza todas las promesas **en paralelo** y devuelve una promesa que:

- se **cumple** cuando todas se han cumplido, con un array de resultados;
- se **rechaza** en cuanto una sola falla, con el error de esa.

```js
const [usuario, pedidos, favoritos] = await Promise.all([
    fetch("/api/usuario").then(r => r.json()),
    fetch("/api/pedidos").then(r => r.json()),
    fetch("/api/favoritos").then(r => r.json())
]);
```

Dos garantías que conviene tener claras:

1. **El orden del array de salida es el del array de entrada**, no el orden en que terminaron. La primera posición es siempre el primer resultado, aunque haya sido la más lenta.
2. **El tiempo total es el de la más lenta**, no la suma. Si tardan 1 s, 1 s y 2 s, el total son 2 s.

!!! danger "Si una falla, pierdes las que sí funcionaron"
    `Promise.all` es todo o nada. Cuando una promesa se rechaza, la promesa combinada se rechaza inmediatamente y **los resultados de las que sí terminaron bien no llegan a ninguna parte**.

    Además, las demás peticiones no se cancelan: siguen su curso en segundo plano, simplemente su resultado se descarta.

    Úsalo cuando de verdad necesitas todos los datos para poder pintar algo. Si una parte de la pantalla puede funcionar sin las demás, lo que quieres es `allSettled`.

---

## `Promise.allSettled()` — todas, pase lo que pase {: .topic-title }

`Promise.allSettled()` espera a que todas terminen, hayan ido bien o mal, y **nunca se rechaza**. Devuelve un array de objetos que describen qué pasó con cada una.

Cada elemento tiene la forma:

| Si fue bien | Si falló |
|---|---|
| `{ status: "fulfilled", value: <resultado> }` | `{ status: "rejected", reason: <error> }` |

```js
const resultados = await Promise.allSettled([
    cargarPerfil(),
    cargarNotificaciones(),
    cargarPublicidad()
]);

resultados.forEach(resultado => {
    if (resultado.status === "fulfilled") {
        pintar(resultado.value);
        return;                             // early return
    }
    console.warn("Un bloque no cargó:", resultado.reason.message);
});
```

!!! tip "La regla para elegir entre `all` y `allSettled`"
    Pregúntate: **¿la pantalla sirve de algo si una de las piezas falla?**

    - No sirve de nada → `Promise.all`. Falla todo junto y muestras un error único.
    - Sí sirve → `Promise.allSettled`. Pintas lo que llegó y degradas lo que no.

    Un panel con tres tarjetas independientes casi siempre es `allSettled`. Un formulario que necesita el usuario **y** sus permisos para renderizarse es `all`.

---

## `Promise.race()` — la primera que termine {: .topic-title }

`Promise.race()` devuelve el resultado de la **primera** promesa que se asiente, sea cumplida o rechazada. Las demás se ignoran.

Su uso más frecuente es poner un límite de tiempo a una operación que podría no terminar nunca:

```js
function conLimiteDeTiempo(promesa, milisegundos) {
    const temporizador = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Tiempo agotado")), milisegundos);
    });

    return Promise.race([promesa, temporizador]);
}

try {
    const datos = await conLimiteDeTiempo(fetch("/api/lento"), 3000);
} catch (error) {
    console.error(error.message);   // "Tiempo agotado" si tardó más de 3 s
}
```

!!! warning "`race` no cancela la promesa perdedora"
    Ganar la carrera solo significa que su resultado es el que se propaga. La petición lenta **sigue viajando por la red** y consumiendo recursos hasta que el servidor responda.

    Para cancelar de verdad una petición HTTP necesitas `AbortController`, que se explica en la página de [Fetch](../04-fetch/index.md).

Ojo con un detalle: si la primera en terminar es una que falla, `race` se rechaza, aunque otra hubiera funcionado. Para "la primera que funcione" existe otro método.

---

## `Promise.any()` — la primera que funcione {: .topic-title }

`Promise.any()` devuelve la primera promesa que se **cumple**, ignorando las que fallan. Solo se rechaza si fallan **todas**.

```js
// Tres servidores espejo: me vale el primero que responda bien
const datos = await Promise.any([
    fetch("https://espejo1.ejemplo.com/datos"),
    fetch("https://espejo2.ejemplo.com/datos"),
    fetch("https://espejo3.ejemplo.com/datos")
]);
```

Cuando fallan todas, el error que recibes es un `AggregateError`: un error que contiene dentro, en su propiedad `errors`, el array con todos los fallos individuales.

```js
try {
    const datos = await Promise.any([a(), b(), c()]);
} catch (error) {
    console.error(error.errors);   // array con los tres errores
}
```

---

## Los cuatro, comparados {: .topic-title }

| Método | Se cumple cuando... | Se rechaza cuando... | Caso típico |
|---|---|---|---|
| `all` | **todas** se cumplen | **una** falla | Datos obligatorios para pintar la pantalla |
| `allSettled` | **todas** terminan | nunca | Bloques independientes que pueden fallar por separado |
| `race` | la **primera** en terminar se cumple | la **primera** en terminar falla | Límite de tiempo, redundancia con corte |
| `any` | la **primera** que se cumpla | **todas** fallan | Servidores espejo, fuentes alternativas |

---

## Un error frecuente al componer {: .topic-title }

Los cuatro métodos reciben un array de **promesas ya lanzadas**, no de funciones. Escribir el nombre de la función sin ejecutarla no lanza nada.

```js
await Promise.all([cargarA, cargarB]);       // ❌ array de funciones: se cumple al instante
await Promise.all([cargarA(), cargarB()]);   // ✅ array de promesas en marcha
```

Y el fallo inverso, más sutil: dentro de un `map` hay que **devolver** la promesa, o el array se llena de `undefined`.

```js
const promesas = ids.map(id => fetch(`/api/items/${id}`).then(r => r.json()));
const items = await Promise.all(promesas);
```

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `Promise.all` cuando las operaciones son independientes entre sí | Encadenar `await` uno tras otro si no dependen unos de otros |
| `allSettled` cuando un fallo parcial es aceptable | `all` para bloques de pantalla independientes |
| `race` con un temporizador para poner límites de tiempo | Confiar en que `race` cancela la petición perdedora |
| Pasar promesas ya invocadas al array | Pasar referencias a funciones sin los paréntesis |
| Leer `status`/`value`/`reason` en los resultados de `allSettled` | Tratar el resultado de `allSettled` como si fuera el valor directo |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Promises avanzado** | https://www.aprendejavascript.dev/clase/programacion-asincrona/promises-avanzado |
| 📘 **MDN — Promise.all()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all |
| 📘 **MDN — Promise.allSettled()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled |
