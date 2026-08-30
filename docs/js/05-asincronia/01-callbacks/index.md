# Callbacks { .bloque-js }

> Un *callback* es una función que se entrega como argumento a otra función, para que esta la ejecute en un momento concreto. Es el mecanismo más básico de la asincronía: no devuelvo el resultado, te devuelvo la llamada cuando lo tenga.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/frm0CHyeSbE" title="Callbacks vs Promises en JavaScript — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Qué es un callback {: .topic-title }

En JavaScript las funciones son **valores**. Se pueden guardar en una variable, meter en un array y —lo que importa aquí— pasar como argumento a otra función.

Cuando una función recibe otra función por argumento y decide cuándo ejecutarla, a esa función recibida se la llama *callback*. El nombre viene del inglés *call back*: "cuando termines, llámame".

```js
function saludar(nombre) {
    console.log(`Hola, ${nombre}`);
}

function despedir(nombre) {
    console.log(`Adiós, ${nombre}`);
}

// procesarUsuario NO decide qué hacer: eso lo decide quien la llama
function procesarUsuario(nombre, accion) {
    accion(nombre);
}

procesarUsuario("Ana", saludar);    // "Hola, Ana"
procesarUsuario("Ana", despedir);   // "Adiós, Ana"
```

!!! danger "El error de sintaxis más común: los paréntesis"
    ```js
    procesarUsuario("Ana", saludar);     // ✅ paso LA FUNCIÓN
    procesarUsuario("Ana", saludar());   // ❌ paso el RESULTADO de ejecutarla
    ```
    Con paréntesis, JavaScript ejecuta `saludar()` **en ese instante** y pasa lo que devuelve (aquí, `undefined`). Sin paréntesis, pasas la función sin ejecutarla, que es lo que quiere el callback.

    La misma trampa aparece en el DOM: `boton.addEventListener("click", manejar)` funciona; `addEventListener("click", manejar())` no.

Este patrón lo llevas usando desde el principio sin llamarlo así:

```js
[1, 2, 3].map(n => n * 2);                       // el callback es n => n * 2
boton.addEventListener("click", () => { ... });  // el callback es la flecha
```

En esos dos casos el callback es **síncrono**: se ejecuta dentro del propio `map`. El salto conceptual llega cuando el callback se ejecuta *más tarde*.

---

## setTimeout {: .topic-title }

`setTimeout(callback, milisegundos)` le pide al navegador que ejecute una función **una sola vez**, pasado un tiempo. La palabra clave es *pide*: JavaScript no se queda esperando.

```js
console.log("Inicio");

setTimeout(() => {
    console.log("¡Han pasado 2 segundos!");
}, 2000);

console.log("Fin");

// Salida: Inicio → Fin → (2 s después) ¡Han pasado 2 segundos!
```

Fíjate en el orden. `"Fin"` sale **antes** que el mensaje del temporizador, aunque esté escrito después. Eso es la asincronía funcionando: `setTimeout` delega la espera en el navegador y devuelve el control inmediatamente.

`setTimeout` devuelve un identificador numérico que sirve para cancelarlo antes de que se dispare:

```js
const idTemporizador = setTimeout(() => console.log("nunca"), 5000);
clearTimeout(idTemporizador);   // cancelado
```

!!! warning "El tiempo que pasas es un mínimo, no una garantía"
    `setTimeout(fn, 1000)` significa "no lo ejecutes **antes** de 1000 ms". Si cuando pasa ese tiempo el hilo está ocupado ejecutando otra cosa, la función espera su turno en la cola. Por eso `setTimeout` no sirve para nada que necesite precisión de reloj (animaciones, música, cronómetros exactos).

    Para animar, la herramienta correcta es `requestAnimationFrame`, que se sincroniza con el repintado de la pantalla.

---

## setInterval {: .topic-title }

`setInterval(callback, milisegundos)` es el hermano repetitivo: ejecuta la función **cada** X milisegundos, indefinidamente, hasta que alguien la pare.

Se para con `clearInterval(id)`, pasándole el identificador que devolvió `setInterval`.

```js
let segundos = 0;

const idIntervalo = setInterval(() => {
    segundos++;
    console.log(`Van ${segundos} segundos`);

    if (segundos === 5) {
        clearInterval(idIntervalo);
        console.log("Parado");
    }
}, 1000);
```

!!! danger "Un setInterval sin clearInterval es una fuga de memoria"
    El intervalo sigue vivo aunque el elemento que lo usaba ya no esté en pantalla. Cada vez que se dispara, ejecuta código sobre algo que ya no existe, consume CPU y puede lanzar errores en bucle.

    Regla práctica: **por cada `setInterval` que escribes, decide en ese mismo momento dónde se va a llamar a `clearInterval`.** Guarda siempre el identificador en una variable; si no lo guardas, ya no puedes pararlo.

---

## Callbacks con parámetros {: .topic-title }

El callback no solo se ejecuta: normalmente recibe **datos** de quien lo llama. Esa es la forma de devolver un resultado hacia atrás cuando no puedes usar `return`.

```js
function esperarUnSegundo(callback) {
    setTimeout(() => {
        callback("Dato listo");   // le pasamos el resultado al callback
    }, 1000);
}

esperarUnSegundo(mensaje => {
    console.log(mensaje);   // "Dato listo"
});
```

Esto explica una duda muy frecuente: **por qué una función asíncrona no puede devolver el valor con `return`**.

```js
function pedirDato() {
    setTimeout(() => {
        return "Dato listo";   // ❌ este return NO llega a ninguna parte útil
    }, 1000);
}

const resultado = pedirDato();
console.log(resultado);   // undefined
```

El `return` de dentro devuelve el valor a `setTimeout`, no a `pedirDato`. Cuando el temporizador se dispara, `pedirDato` terminó hace un segundo. El valor no puede viajar hacia atrás en el tiempo: por eso hay que pasarlo hacia delante, al callback.

---

## Convención error-primero {: .topic-title }

En el ecosistema de Node.js se estandarizó una forma de señalar errores con callbacks: el primer parámetro del callback es siempre el error (`null` si todo fue bien) y el segundo es el resultado.

```js
leerFichero("datos.txt", (error, contenido) => {
    if (error) {
        console.error("Falló:", error.message);
        return;                     // early return: cortar cuanto antes
    }
    console.log(contenido);
});
```

Se llama *error-first callback*. Conviene reconocerla porque sigue viva en el código antiguo de Node y en muchas librerías. No es un patrón que escribas hoy en código nuevo: para eso están las promesas.

---

## El infierno de callbacks {: .topic-title }

El problema aparece cuando una operación asíncrona depende del resultado de la anterior. Como el resultado solo llega dentro del callback, la siguiente operación tiene que escribirse **dentro** de él. Y la siguiente, dentro de esa.

```js
obtenerUsuario(id, usuario => {
    obtenerPedidos(usuario, pedidos => {
        obtenerDetalles(pedidos[0], detalles => {
            obtenerEnvio(detalles, envio => {
                console.log(envio);
            }, errorEnvio => { /* ... */ });
        }, errorDetalles => { /* ... */ });
    }, errorPedidos => { /* ... */ });
}, errorUsuario => { /* ... */ });
```

A esto se le llama **callback hell** o *pirámide de la perdición*, por la forma que dibuja la indentación. Los problemas concretos son tres:

1. **Se lee mal.** El orden lógico va hacia la derecha, no hacia abajo. Cuesta seguir qué pasa después de qué.
2. **Los errores se repiten.** Cada nivel necesita su propia gestión de fallos; no hay un sitio único donde recogerlos.
3. **No se puede componer.** Lanzar dos operaciones a la vez y esperar a ambas requiere contadores manuales.

Un parche parcial es extraer cada nivel a una función con nombre, lo que aplana la pirámide:

```js
function alRecibirUsuario(usuario) {
    obtenerPedidos(usuario, alRecibirPedidos);
}

function alRecibirPedidos(pedidos) {
    obtenerDetalles(pedidos[0], alRecibirDetalles);
}

obtenerUsuario(id, alRecibirUsuario);
```

Se lee mejor, pero los otros dos problemas siguen ahí. La solución real es el objeto que estudias en la siguiente página: la **promesa**.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Pasar la función sin paréntesis: `setTimeout(avisar, 1000)` | `setTimeout(avisar(), 1000)` — ejecuta al momento y pasa `undefined` |
| Guardar el identificador de `setInterval` en una variable | Lanzar un `setInterval` sin poder pararlo después |
| Decidir dónde va el `clearInterval` en el mismo momento de escribirlo | Dejar temporizadores vivos cuando el componente desaparece |
| Devolver el resultado **pasándolo al callback** | Intentar `return` desde dentro de un `setTimeout` |
| Usar callbacks para eventos y temporizadores | Encadenar lógica de negocio anidando callbacks |
| Pasar a promesas / `async`-`await` cuando hay más de un paso encadenado | Construir pirámides de 4 niveles "porque ya funciona" |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Callbacks** | https://www.aprendejavascript.dev/clase/programacion-asincrona/callbacks |
| 📘 **MDN — Función callback** | https://developer.mozilla.org/es/docs/Glossary/Callback_function |
| 📘 **MDN — setTimeout** | https://developer.mozilla.org/es/docs/Web/API/Window/setTimeout |
