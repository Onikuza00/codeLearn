# Promesas { .bloque-js }

> Una promesa es un objeto que representa un valor que **todavía no existe**, pero que existirá (o fallará) en algún momento. En vez de entregar una función para que te avisen, recibes un objeto al que puedes suscribirte.

---

## La idea {: .topic-title }

Imagina que pides una pizza por teléfono. No te dan la pizza en ese momento: te dan un **número de pedido**. Ese número no es la pizza, pero es un objeto real que puedes tener en la mano y que representa tres futuros posibles:

- La pizza todavía viene de camino.
- La pizza llega.
- La pizza no puede llegar (se ha quemado, no hay repartidor).

La promesa es ese número de pedido. Con los callbacks, entregabas tu teléfono a la pizzería y esperabas que te llamaran. Con las promesas, **tú tienes el objeto** y decides qué hacer con él: pasarlo a otra función, guardarlo, combinarlo con otros pedidos.

Esa diferencia —tener un objeto en vez de ceder el control— es lo que resuelve los tres problemas del *callback hell*: el código se lee hacia abajo, los errores se recogen en un único sitio y varias promesas se pueden componer.

---

## Los tres estados {: .topic-title }

Una promesa está siempre en uno de estos tres estados:

| Estado | Nombre técnico | Significado |
|---|---|---|
| Pendiente | *pending* | Estado inicial: la operación no ha terminado |
| Cumplida | *fulfilled* | La operación terminó bien y hay un valor |
| Rechazada | *rejected* | La operación falló y hay un motivo |

!!! warning "Una promesa cambia de estado UNA sola vez"
    Cuando pasa de pendiente a cumplida o rechazada, queda **fijada para siempre**. No puede volver a pendiente ni cambiar de cumplida a rechazada.

    Esto tiene una consecuencia práctica: si dentro de una promesa llamas a `resolve()` y después a `reject()`, la segunda llamada **se ignora en silencio**. No lanza error, simplemente no hace nada. Es una fuente típica de confusión al depurar.

El término *settled* ("asentada") agrupa los dos estados finales: una promesa está *settled* si ya está cumplida **o** rechazada. Aparece en el nombre de `Promise.allSettled()`.

---

## Crear una promesa {: .topic-title }

Se construye con `new Promise()`, pasándole una función que recibe dos parámetros: `resolve` y `reject`. Esa función se llama **ejecutor**.

```js
const promesaPizza = new Promise((resolve, reject) => {
    const hayIngredientes = true;

    setTimeout(() => {
        if (hayIngredientes) {
            resolve("🍕 Pizza margarita lista");   // pasa a cumplida
        } else {
            reject(new Error("No quedan ingredientes"));   // pasa a rechazada
        }
    }, 2000);
});
```

Tres detalles importantes del ejecutor:

1. **Se ejecuta inmediatamente**, en el mismo momento en que creas la promesa. No espera a que nadie llame a `.then()`.
2. `resolve(valor)` marca la promesa como cumplida y guarda ese valor.
3. `reject(motivo)` la marca como rechazada. Por convención el motivo es siempre un objeto `Error`, nunca un texto suelto.

!!! danger "Rechaza siempre con `new Error(...)`, no con una cadena"
    ```js
    reject("Algo falló");             // ❌ pierdes el stack trace
    reject(new Error("Algo falló"));  // ✅ tienes .name, .message y .stack
    ```
    Un `Error` guarda el rastro de llamadas que llevó al fallo. Rechazar con una cadena te deja depurando a ciegas, y además rompe el contrato de que en el `catch` puedas leer `error.message`.

En la práctica **escribirás pocos `new Promise`**. La mayoría de APIs modernas (`fetch`, las de Node) ya devuelven promesas hechas. `new Promise` se usa sobre todo para *envolver* una API antigua basada en callbacks:

```js
// Convertir setTimeout en algo esperable
function esperar(milisegundos) {
    return new Promise(resolve => setTimeout(resolve, milisegundos));
}
```

---

## Consumir: `.then()` y `.catch()` {: .topic-title }

Una vez tienes la promesa, te suscribes a su resultado con dos métodos:

- `.then(callback)` — se ejecuta si la promesa se **cumple**; recibe el valor.
- `.catch(callback)` — se ejecuta si la promesa se **rechaza**; recibe el motivo.

```js
promesaPizza
    .then(pizza => {
        console.log("Recibido:", pizza);
    })
    .catch(error => {
        console.log("Problema:", error.message);
    });
```

Existe un tercer método, `.finally(callback)`, que se ejecuta **en los dos casos**, pase lo que pase. Sirve para limpieza: cerrar un indicador de carga, habilitar un botón otra vez.

```js
mostrarCargando();

pedirDatos()
    .then(datos => pintar(datos))
    .catch(error => mostrarError(error))
    .finally(() => ocultarCargando());   // siempre, haya ido bien o mal
```

!!! tip "`.finally()` no recibe ningún argumento"
    No sabe si la promesa se cumplió o falló, y tampoco puede cambiar el valor que se pasa hacia adelante. Es intencionado: su única responsabilidad es limpiar, no decidir. Si necesitas saber qué pasó, hazlo en `.then()`/`.catch()`.

---

## Encadenado {: .topic-title }

Aquí está la ventaja real sobre los callbacks. **`.then()` devuelve una promesa nueva**, así que se pueden encadenar uno detrás de otro, en vertical.

La regla que lo hace funcionar: lo que devuelves dentro de un `.then()` se convierte en el valor que recibe el siguiente `.then()`.

```js
// Cadena de producción: cada paso recibe lo que devolvió el anterior
agarrarPatataCruda()
    .then(patata => pelarYCortar(patata))
    .then(trozos => freir(trozos))
    .then(patatasFritas => anadirSal(patatasFritas))
    .then(producto => empaquetar(producto))
    .then(paquete => console.log("Listo:", paquete))
    .catch(error => console.log("Falló la línea:", error.message));
```

Cuando la función que llamas recibe exactamente un parámetro y devuelve una promesa, puedes pasarla directamente sin envolverla en una flecha:

```js
agarrarPatataCruda()
    .then(pelarYCortar)     // equivale a .then(patata => pelarYCortar(patata))
    .then(freir)
    .then(anadirSal)
    .catch(error => console.log(error.message));
```

!!! danger "Sin `return`, la cadena se rompe"
    ```js
    pedirUsuario()
        .then(usuario => {
            pedirPedidos(usuario);        // ❌ falta el return
        })
        .then(pedidos => {
            console.log(pedidos);         // undefined
        });
    ```
    El primer `.then()` no devuelve nada, así que su promesa se cumple con `undefined` sin esperar a `pedirPedidos`. El segundo `.then()` se ejecuta al momento, con las manos vacías.

    ```js
    .then(usuario => {
        return pedirPedidos(usuario);     // ✅
    })
    ```
    Con la flecha en una sola línea el `return` es implícito (`.then(usuario => pedirPedidos(usuario))`), y por eso el fallo aparece casi siempre al añadir llaves. **Si escribes llaves en un `.then()`, comprueba que hay un `return`.**

---

## Un solo `.catch()` para toda la cadena {: .topic-title }

Un `.catch()` al final captura los errores de **cualquier** punto anterior de la cadena. No hace falta uno por paso.

El mecanismo es sencillo: cuando una promesa se rechaza, todos los `.then()` siguientes se saltan hasta encontrar el primer `.catch()`.

```js
paso1()
    .then(paso2)     // si paso1 falla, esto se salta
    .then(paso3)     // esto también
    .then(paso4)     // y esto
    .catch(error => console.log("Falló algún paso:", error.message));
```

Un `.catch()` intermedio, en cambio, **recupera** la cadena: si lo pones a mitad y no vuelve a lanzar el error, los `.then()` posteriores siguen ejecutándose con normalidad. Eso permite valores de reserva:

```js
pedirDelServidor()
    .catch(() => leerDeCache())        // si el servidor falla, tiro de caché
    .then(datos => pintar(datos))      // esto se ejecuta en los dos casos
    .catch(error => mostrarError(error));
```

!!! warning "Una promesa rechazada sin `.catch()` no es un error silencioso"
    El navegador la registra como *unhandled promise rejection* y la muestra en consola. En Node.js moderno, además, **tumba el proceso**. Toda cadena de promesas termina en un `.catch()` o en un `try`/`catch` con `await`.

---

## Callbacks frente a promesas {: .topic-title }

| Aspecto | Callbacks | Promesas |
|---|---|---|
| Forma del código | Se anida hacia la derecha | Se encadena hacia abajo |
| Errores | Uno por nivel, repetidos | Un `.catch()` para toda la cadena |
| Composición | Contadores manuales | `Promise.all`, `race`, `allSettled` |
| Reutilización | La función queda atada a su callback | La promesa se guarda y se pasa como un valor más |
| Doble llamada | Un callback mal escrito puede llamarse dos veces | Una promesa se resuelve una única vez, garantizado |

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `return` en todo `.then()` con llaves | Llamar a otra función asíncrona dentro sin devolverla |
| Rechazar con `new Error("mensaje")` | `reject("mensaje")` con una cadena suelta |
| Un `.catch()` al final de cada cadena | Dejar cadenas sin gestión de errores |
| `.finally()` para limpiar (ocultar carga, cerrar) | Duplicar la limpieza en `.then()` y en `.catch()` |
| Usar la promesa que ya te da la API | Envolver en `new Promise` algo que ya devuelve promesa |
| Encadenar en vertical | Anidar un `.then()` dentro de otro `.then()` |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Promises básico** | https://www.aprendejavascript.dev/clase/programacion-asincrona/promises-basico |
| 📘 **MDN — Usar promesas** | https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Using_promises |
| 📘 **MDN — Promise** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise |
