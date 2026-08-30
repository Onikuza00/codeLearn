# Asincronía { .bloque-js }

> JavaScript ejecuta una sola línea a la vez. Cuando una tarea tarda —pedir datos a un servidor, esperar un temporizador— no puede quedarse parado esperando, porque la página entera se congelaría. La asincronía es el conjunto de mecanismos que permiten *encargar* una tarea lenta y seguir trabajando mientras tanto.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/frm0CHyeSbE" title="Callbacks vs Promises en JavaScript — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## El problema que resuelve {: .topic-title }

JavaScript es un lenguaje **de un solo hilo** (*single-threaded*). Un hilo es una línea de ejecución: una secuencia de instrucciones que se van haciendo una detrás de otra. Tener uno solo significa que, en un momento dado, el navegador solo puede estar haciendo una cosa con tu código.

Eso tiene una consecuencia directa: si una instrucción tarda tres segundos, durante esos tres segundos el navegador no puede hacer nada más. Ni repintar la pantalla, ni responder a un clic, ni ejecutar la siguiente línea. La página parece colgada.

```js
// Código SÍNCRONO: cada línea espera a la anterior
console.log("Primero");
console.log("Segundo");
console.log("Tercero");
// Salida: Primero → Segundo → Tercero
```

El problema aparece cuando la tarea no depende de nosotros. Pedir un fichero a un servidor puede tardar 50 milisegundos o 4 segundos, según la red. Si esperásemos de forma síncrona, la interfaz se bloquearía.

La solución del navegador es **delegar**. Las tareas lentas no las hace el hilo de JavaScript: las hace el navegador por su cuenta (red, temporizadores, disco). Cuando terminan, avisan. Ese "avisar cuando termine" es exactamente lo que estudia este bloque.

---

## Cómo se organiza la espera: el bucle de eventos {: .topic-title }

Para entender por qué el código asíncrono se ejecuta *en el orden que se ejecuta*, hace falta conocer tres piezas. No hay que memorizarlas, pero sí saber que existen.

| Pieza | Qué es | Papel |
|---|---|---|
| **Pila de llamadas** (*call stack*) | La lista de funciones que se están ejecutando ahora mismo | Solo cabe una función a la vez en la cima; es el único hilo |
| **APIs del navegador** | Temporizadores, red, eventos del DOM | Hacen el trabajo lento **fuera** del hilo de JavaScript |
| **Cola de tareas** (*task queue*) | La sala de espera de las funciones ya listas para ejecutarse | Guardan turno hasta que la pila se vacía |

El **bucle de eventos** (*event loop*) es el vigilante que conecta las tres: mira si la pila de llamadas está vacía y, cuando lo está, coge la primera función de la cola y la ejecuta.

De aquí sale la regla más importante de todo el bloque:

!!! warning "El código asíncrono NUNCA se ejecuta antes de que termine el síncrono"
    Aunque pongas `setTimeout(fn, 0)` —cero milisegundos de espera— esa función no se ejecuta inmediatamente. Se manda a la cola, y la cola no se atiende hasta que **todo** el código síncrono de ese momento ha terminado.

    ```js
    console.log("A");
    setTimeout(() => console.log("B"), 0);
    console.log("C");

    // Salida real: A → C → B
    ```
    El `0` no significa "ya", significa "en cuanto puedas, pero el último de la cola".

Hay un detalle más: las promesas no usan la misma cola que `setTimeout`. Usan una cola prioritaria llamada **cola de microtareas**, que se vacía entera antes de tocar la cola normal. Por eso un `.then()` siempre se ejecuta antes que un `setTimeout(fn, 0)` escrito en la misma línea de tiempo.

```js
console.log("1 — síncrono");
setTimeout(() => console.log("4 — cola de tareas"), 0);
Promise.resolve().then(() => console.log("3 — cola de microtareas"));
console.log("2 — síncrono");

// Salida: 1 → 2 → 3 → 4
```

!!! tip "Cómo razonar cualquier ejercicio de orden de ejecución"
    Recorre el código en tres pasadas, en este orden:

    1. Todo lo síncrono, de arriba abajo.
    2. Todas las microtareas pendientes (`.then`, `.catch`, `await`).
    3. Las tareas normales (`setTimeout`, `setInterval`, eventos).

    Con esas tres pasadas se resuelve prácticamente cualquier pregunta de entrevista sobre orden de salida.

---

## Las tres generaciones {: .topic-title }

La asincronía en JavaScript no se inventó de golpe. Se resolvió tres veces, y cada solución arregla un problema de la anterior. Las tres siguen vivas en el lenguaje, pero **no se usan igual**.

| Generación | Qué aportó | Cuándo la escribes hoy |
|---|---|---|
| **Callbacks** | El mecanismo base: pasar una función para que se llame "al terminar" | Solo en APIs que lo exigen: `setTimeout`, `addEventListener` |
| **Promesas** | Un objeto que representa el resultado futuro; encadenable y con errores centralizados | Cuando compones varias operaciones a la vez (`Promise.all`) |
| **`async`/`await`** | Escribir el flujo asíncrono como si fuera síncrono, con `try`/`catch` normal | **Por defecto.** Es lo que escribes el 90 % del tiempo |

!!! danger "Esto no es un histórico: es una jerarquía de uso"
    Estudias callbacks porque es la base sobre la que se construye todo lo demás, y porque `addEventListener` y `setTimeout` siguen siendo callbacks. Pero **no escribes lógica de negocio anidando callbacks**. Para eso existe `async`/`await`.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [Callbacks](01-callbacks/index.md) | Función como argumento, `setTimeout`, `setInterval`, `clearInterval`, *callback hell* |
| [Promesas](02-promesas/index.md) | Estados, `new Promise`, `resolve`/`reject`, `.then()`, `.catch()`, `.finally()`, encadenado |
| [Promesas — composición](03-promesas-avanzado/index.md) | `Promise.all`, `allSettled`, `race`, `any`, `resolve`/`reject`, patrón de timeout |
| [Fetch API](04-fetch/index.md) | `fetch()`, objeto `Response`, `response.ok`, verbos HTTP, cabeceras, `AbortController` |
| [async / await](05-async-await/index.md) | `async`, `await`, `try`/`catch`, secuencial vs. paralelo, errores típicos |
| [WebSockets](06-websockets/index.md) | Conexión persistente y bidireccional, eventos `open`/`message`/`close`, tiempo real |
| [Capa de API](07-capa-de-api/index.md) | Cliente centralizado, errores con contexto, renovar el token, estados de interfaz, *debounce* |
| [Server-Sent Events](08-server-sent-events/index.md) | `EventSource`, formato del flujo, reconexión automática, SSE frente a WebSocket |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Programación asíncrona** | https://www.aprendejavascript.dev/clase/programacion-asincrona/callbacks |
| 📘 **MDN — Usar promesas** | https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Using_promises |
| 📗 **web.dev — JavaScript** | https://web.dev/javascript?hl=es-419 |
| 📙 **Institut Montilivi — AJAX** | https://apunts.institutmontilivi.cat/DAW-M0612/ajax.html |
