# async / await { .bloque-js }

> `async`/`await` no es una tecnología nueva: es una forma más legible de escribir promesas. Por debajo hay exactamente las mismas promesas, pero el código se lee de arriba abajo, como si fuera síncrono.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/41VfSbuYBP0" title="async/await, Promise.all y Promise.allSettled — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Qué resuelve {: .topic-title }

El mismo trabajo, escrito de las dos maneras:

```js
// Con promesas
function obtenerDatos() {
    return fetch("/api/datos")
        .then(response => response.json())
        .then(datos => {
            console.log(datos);
            return datos;
        })
        .catch(error => {
            console.log("Error:", error);
        });
}

// Con async/await
async function obtenerDatos() {
    try {
        const response = await fetch("/api/datos");
        const datos = await response.json();
        console.log(datos);
        return datos;
    } catch (error) {
        console.log("Error:", error);
    }
}
```

Las ventajas de la segunda versión son concretas, no cuestión de gusto:

- **Los valores se guardan en variables normales.** `const datos = await ...` en vez de recibirlos como argumento de una función anidada.
- **El manejo de errores es el del lenguaje.** `try`/`catch` de toda la vida, el mismo que ya usas para código síncrono.
- **Se depura mejor.** Los puntos de interrupción y el `stack trace` funcionan como en código normal, sin saltar entre callbacks.

---

## `async`: la función siempre devuelve una promesa {: .topic-title }

La palabra `async` delante de una función hace una cosa: **envuelve automáticamente lo que devuelva en una promesa**.

```js
async function miFuncion() {
    return 42;
}

console.log(miFuncion());   // Promise { <pending> }, NO 42

miFuncion().then(resultado => console.log(resultado));   // 42
```

Y del mismo modo, un `throw` dentro de una función `async` no lanza el error hacia fuera: **rechaza la promesa** que devuelve.

```js
async function fallar() {
    throw new Error("algo salió mal");
}

fallar().catch(error => console.log(error.message));   // "algo salió mal"
```

!!! danger "Llamar a una función `async` sin `await` te da la promesa, no el valor"
    ```js
    const usuario = obtenerUsuario(7);
    console.log(usuario.nombre);   // ❌ undefined
    ```
    `usuario` es una promesa pendiente, y las promesas no tienen propiedad `nombre`. El síntoma es siempre el mismo: `undefined` en una propiedad que sabes que existe, o el texto `[object Promise]` en pantalla.

    Si ves eso, busca un `await` que falta.

---

## `await`: pausar hasta que la promesa se resuelva {: .topic-title }

`await` delante de una promesa detiene la ejecución **de esa función** hasta que la promesa se asiente, y devuelve su valor ya desempaquetado.

```js
async function medir() {
    console.time("espera");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.timeEnd("espera");   // espera: 1000.4ms
}
```

Es importante entender qué se pausa exactamente: **solo la función `async` donde está el `await`**. El resto del programa sigue corriendo con normalidad. No se bloquea ni la página ni el hilo; simplemente esa función queda en pausa y retoma cuando el valor está listo.

`await` solo funciona dentro de una función `async`:

```js
function miFuncion() {
    await esperar(1000);   // ❌ SyntaxError: await is only valid in async functions
}
```

!!! tip "Excepción: `await` de nivel superior en módulos"
    Dentro de un módulo de JavaScript (`<script type="module">` o un fichero `.mjs`) sí puedes usar `await` fuera de cualquier función, en el nivel más externo del fichero. Se llama *top-level await*.

    ```js
    // fichero.mjs — válido
    const config = await fetch("/config.json").then(r => r.json());
    ```
    En un `<script>` normal, sin `type="module"`, esto sigue siendo un error de sintaxis.

---

## Errores con `try`/`catch` {: .topic-title }

Una promesa rechazada que se espera con `await` **lanza una excepción**. Por eso se captura con `try`/`catch` normal.

```js
async function cargarUsuario(id) {
    try {
        const response = await fetch(`/api/usuarios/${id}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("No se pudo cargar el usuario:", error.message);
        return null;               // valor de reserva
    } finally {
        ocultarIndicadorDeCarga();  // siempre
    }
}
```

!!! danger "Un `await` sin `try`/`catch` puede tumbar el proceso"
    Si la promesa se rechaza y nadie la captura, el error se propaga hacia arriba. En el navegador queda como *unhandled rejection* en consola; en Node.js **termina el proceso**.

    Eso no significa envolver cada `await` en su propio `try`. Lo razonable es un `try` por unidad de trabajo: si tres pasos consecutivos fallan por la misma razón y se recuperan igual, comparten bloque.

Una alternativa útil cuando solo quieres un valor por defecto ante el fallo, sin el peso del `try`:

```js
const datos = await pedirDatos().catch(() => null);
if (datos === null) return mostrarError();
```

---

## Secuencial contra paralelo {: .topic-title }

Este es el error de rendimiento más común con `async`/`await`, y el que más caro sale.

Cada `await` **espera al anterior**. Si las operaciones no dependen unas de otras, esperar en fila es tiempo tirado.

```js
// ❌ Secuencial: 1 s + 1 s + 2 s = 4 segundos
async function cargarPerfilLento(idUsuario) {
    const usuario = await api.getUsuario(idUsuario);       // 1 s
    const amigos = await api.getAmigos(idUsuario);         // 1 s
    const publicaciones = await api.getPosts(idUsuario);   // 2 s

    return { usuario, amigos, publicaciones };
}
```

Ninguna de las tres necesita el resultado de las otras: las tres solo necesitan `idUsuario`. Lanzándolas a la vez con `Promise.all`, el total es el de la más lenta:

```js
// ✅ Paralelo: max(1 s, 1 s, 2 s) = 2 segundos
async function cargarPerfilRapido(idUsuario) {
    const [usuario, amigos, publicaciones] = await Promise.all([
        api.getUsuario(idUsuario),
        api.getAmigos(idUsuario),
        api.getPosts(idUsuario)
    ]);

    return { usuario, amigos, publicaciones };
}
```

!!! tip "La pregunta que decide entre secuencial y paralelo"
    Ante dos `await` seguidos, pregúntate: **¿el segundo necesita el resultado del primero?**

    - Sí → secuencial, y está bien. Ejemplo: primero pides el usuario, y con su `id` de empresa pides la empresa.
    - No → `Promise.all`. Ejemplo: pides usuario, notificaciones y ajustes, todos con el mismo `id`.

    Este cambio no es una microoptimización: pasar de 4 s a 2 s de carga se nota en pantalla.

El mismo error aparece dentro de un bucle, y ahí es todavía más caro porque se multiplica:

```js
// ❌ N peticiones en fila
for (const id of ids) {
    const item = await pedirItem(id);
    resultados.push(item);
}

// ✅ N peticiones a la vez
const resultados = await Promise.all(ids.map(id => pedirItem(id)));
```

!!! warning "Cuidado con lanzar cientos de peticiones a la vez"
    `Promise.all` sobre un array de 500 elementos abre 500 conexiones de golpe. El navegador las encola y el servidor puede responder con un `429 Too Many Requests`.

    Cuando la lista es grande, se procesa **por lotes**: trozos de 5 o 10 en paralelo, un lote detrás de otro.

---

## `forEach` no espera {: .topic-title }

Un fallo muy frecuente y difícil de ver: poner un `await` dentro de un `forEach` no hace nada útil.

```js
// ❌ "Terminado" sale ANTES de guardar nada
ids.forEach(async id => {
    await guardar(id);
});
console.log("Terminado");
```

`forEach` ignora por completo el valor que devuelve su callback. Como el callback es `async`, devuelve una promesa que `forEach` tira a la basura: no espera nada.

Las dos formas correctas:

```js
// Si el orden importa y deben ir de una en una
for (const id of ids) {
    await guardar(id);
}
console.log("Terminado");

// Si pueden ir todas a la vez
await Promise.all(ids.map(id => guardar(id)));
console.log("Terminado");
```

`for...of` sí respeta el `await`. `forEach`, `map` y compañía no: `map` devuelve el array de promesas, que es justo lo que aprovecha `Promise.all`.

---

## La evolución, resumida {: .topic-title }

| Generación | Problema que arrastraba |
|---|---|
| Callbacks | Anidamiento en pirámide, errores repetidos por nivel |
| Promesas | Legibles y componibles, pero encadenar `.then()` sigue siendo indirecto |
| `async`/`await` | Sintaxis directa, `try`/`catch` normal; hay que vigilar el paralelismo |

No se sustituyen: `async`/`await` está construido **sobre** promesas, y sigues necesitando `Promise.all` para el paralelismo. Lo único que queda relegado son los callbacks para lógica encadenada.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `async`/`await` como forma por defecto de escribir asincronía | Encadenar `.then()` en código nuevo por costumbre |
| `Promise.all` cuando las operaciones son independientes | `await` en fila para cosas que no dependen entre sí |
| `for...of` cuando necesitas esperar en cada vuelta | `await` dentro de `forEach` — no espera nada |
| `try`/`catch` por unidad de trabajo | Un `try` gigante que engloba toda la función |
| Comprobar `response.ok` antes del `await response.json()` | Dar por bueno cualquier `fetch` que no lanzó excepción |
| Procesar listas grandes por lotes | `Promise.all` sobre cientos de peticiones de golpe |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — async/await** | https://www.aprendejavascript.dev/clase/programacion-asincrona/async-await |
| 📘 **MDN — async function** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function |
| 📘 **MDN — await** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/await |
