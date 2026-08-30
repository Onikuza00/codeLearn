# Capa de API { .bloque-js }

> Saber usar `fetch` no basta para montar una aplicación. Repetir la misma URL base, las mismas cabeceras y la misma comprobación de errores en veinte sitios es lo que convierte un proyecto en algo imposible de mantener. Esta página es el paso de "sé hacer una petición" a "sé diseñar cómo mi aplicación habla con el servidor".

---

## El problema {: .topic-title }

Así empieza siempre un proyecto:

```js
// tareas.js
const response = await fetch("https://api.ejemplo.com/tareas", {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
});
const tareas = await response.json();

// usuarios.js
const response = await fetch("https://api.ejemplo.com/usuarios", {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
});
const usuarios = await response.json();
```

Todavía no duele. Empieza a doler cuando aparece cualquiera de estas cosas:

- La URL base cambia entre desarrollo y producción.
- Hay que añadir una cabecera nueva a todas las peticiones.
- Falta la comprobación de `response.ok`, y hay que añadirla en veinte sitios.
- El token caduca y hay que renovarlo antes de reintentar.

Ninguna de esas es una tarea de cinco minutos si la lógica está repartida. Con una capa de API, todas son un cambio en un solo fichero.

!!! info "El principio detrás de esto"
    Es el **principio de responsabilidad única** aplicado a la comunicación: un único módulo sabe *cómo* se habla con el servidor; el resto de la aplicación solo sabe *qué* pide.

    Dicho de otra forma: si mañana cambias `fetch` por otra librería, o la API por completo, solo se toca un fichero.

---

## Una función base {: .topic-title }

El primer paso es concentrar en un solo sitio lo que se repite: la URL base, las cabeceras y la comprobación del estado.

```js
const URL_BASE = "https://api.ejemplo.com";

async function peticion(ruta, opciones = {}) {
    const respuesta = await fetch(`${URL_BASE}${ruta}`, {
        ...opciones,
        headers: {
            "Content-Type": "application/json",
            ...obtenerCabeceraDeSesion(),
            ...opciones.headers          // quien llama puede añadir o sobrescribir
        }
    });

    if (!respuesta.ok) {
        throw await construirError(respuesta);
    }

    if (respuesta.status === 204) return null;   // sin contenido

    return respuesta.json();
}
```

Dos detalles que importan:

**El orden del `spread` en `headers`.** Las cabeceras propias van primero y las de quien llama al final, para que se puedan sobrescribir puntualmente. Si lo inviertes, nadie podrá cambiar el `Content-Type` para enviar un `FormData`.

**El `204`.** Es la respuesta habitual de un `DELETE`: correcto, pero sin cuerpo. Llamar a `.json()` sobre una respuesta vacía lanza una excepción de JSON mal formado. Es un error que aparece la primera vez que se borra algo, y cuesta relacionarlo con la causa.

---

## Errores con información {: .topic-title }

Lanzar `new Error("Error 400")` no le sirve de nada a quien tiene que reaccionar. Un error útil conserva el código de estado y lo que dijo el servidor.

```js
class ErrorDeApi extends Error {
    constructor(mensaje, estado, detalles) {
        super(mensaje);
        this.name = "ErrorDeApi";
        this.estado = estado;
        this.detalles = detalles;      // p. ej. errores de validación por campo
    }
}

async function construirError(respuesta) {
    let cuerpo = {};

    try {
        cuerpo = await respuesta.json();
    } catch {
        // el servidor devolvió HTML o texto plano: no pasa nada
    }

    return new ErrorDeApi(
        cuerpo.message ?? `Error ${respuesta.status}`,
        respuesta.status,
        cuerpo.errors ?? null
    );
}
```

Con eso, quien llama puede decidir según el caso:

```js
try {
    await api.crearTarea(datos);
} catch (error) {
    if (error.estado === 422) return pintarErroresDeCampo(error.detalles);
    if (error.estado === 403) return avisar("No tienes permiso");
    mostrarErrorGeneral(error.message);
}
```

!!! tip "Ponte de acuerdo con el backend en el formato del error"
    Que todos los errores tengan la misma forma —`{ message, errors }`, por ejemplo— permite tratarlos igual en todas partes. Symfony ya sigue un formato estándar (RFC 7807, *Problem Details*) que encaja bien con esto.

    Acordarlo al principio del proyecto cuesta una conversación. Descubrir a mitad que cada endpoint devuelve los errores de una forma distinta cuesta una tarde.

!!! warning "El `try` del `JSON.parse` no es opcional"
    Cuando un servidor falla de verdad —un 500, o un intermediario que devuelve su propia página de error—, la respuesta suele ser HTML, no JSON. Sin ese `try`, tu gestor de errores lanza **otro** error, y pierdes por completo el original.

---

## Métodos con nombre {: .topic-title }

Sobre la función base se construyen las operaciones que la aplicación entiende. Aquí es donde el resto del código deja de saber que existe HTTP.

```js
export const api = {
    tareas: {
        listar: (filtros = {}) =>
            peticion(`/tareas?${new URLSearchParams(filtros)}`),

        obtener: (id) =>
            peticion(`/tareas/${id}`),

        crear: (datos) =>
            peticion("/tareas", { method: "POST", body: JSON.stringify(datos) }),

        actualizar: (id, cambios) =>
            peticion(`/tareas/${id}`, { method: "PATCH", body: JSON.stringify(cambios) }),

        borrar: (id) =>
            peticion(`/tareas/${id}`, { method: "DELETE" })
    }
};
```

El resto de la aplicación queda así:

```js
const tareas = await api.tareas.listar({ estado: "pendiente" });
await api.tareas.borrar(7);
```

Ni URLs, ni cabeceras, ni verbos HTTP repartidos por la interfaz. Si mañana la ruta cambia de `/tareas` a `/v2/tasks`, se toca una línea.

---

## Renovar el token {: .topic-title }

Un token caduca. Cuando eso pasa, el servidor responde `401`. Lo correcto no es echar al usuario: es renovar el token y reintentar la petición sin que se entere.

```js
let renovacionEnCurso = null;

async function peticionConSesion(ruta, opciones = {}) {
    try {
        return await peticion(ruta, opciones);
    } catch (error) {
        if (error.estado !== 401) throw error;      // early return

        // Si ya hay una renovación en marcha, esperamos a esa misma
        renovacionEnCurso ??= renovarToken().finally(() => {
            renovacionEnCurso = null;
        });

        await renovacionEnCurso;

        return peticion(ruta, opciones);            // un único reintento
    }
}
```

!!! danger "Sin la variable compartida, diez peticiones simultáneas renuevan diez veces"
    Es el fallo clásico. Si la pantalla lanza varias peticiones a la vez y el token acaba de caducar, **todas** reciben un `401` y **todas** intentan renovar. El servidor recibe una ráfaga de renovaciones, y con tokens de un solo uso las últimas invalidan a las primeras: el usuario acaba expulsado igualmente.

    Guardar la promesa de renovación en una variable compartida hace que la primera renueve y las demás esperen a ese mismo resultado. Es el patrón de **promesa compartida**, y es la única forma correcta de resolverlo.

!!! warning "Reintenta una sola vez"
    Si tras renovar el token vuelve a llegar un `401`, no es un problema de caducidad: la sesión ya no vale. Reintentar en bucle deja la aplicación colgada haciendo peticiones para siempre.

---

## Los estados de la interfaz {: .topic-title }

Una petición no tiene dos resultados posibles, tiene cuatro. Modelarlos desde el principio evita esa pantalla eterna con "Cargando…" cuando algo falla.

| Estado | Qué se ve |
|---|---|
| Cargando | Un indicador, o un esqueleto de la lista |
| Con datos | El contenido |
| Vacío | Un mensaje de "no hay nada todavía", no una lista en blanco |
| Error | Qué ha pasado y un botón para reintentar |

```js
async function cargarTareas(contenedor) {
    mostrarCargando(contenedor);

    try {
        const tareas = await api.tareas.listar();

        if (tareas.length === 0) {
            return mostrarVacio(contenedor, "Todavía no tienes tareas");
        }

        pintarTareas(contenedor, tareas);
    } catch (error) {
        mostrarError(contenedor, error.message, () => cargarTareas(contenedor));
    }
}
```

!!! tip "El estado vacío no es el mismo que el de error"
    Una lista vacía **es** una respuesta correcta. Si la tratas como un fallo, el usuario cree que algo se ha roto cuando en realidad no ha creado nada aún.

    Y al revés: dejar la pantalla en blanco cuando falla la carga es peor que un mensaje de error, porque el usuario no sabe si esperar o recargar.

---

## Esperar a que deje de escribir {: .topic-title }

En un buscador que consulta al servidor, lanzar una petición por cada tecla es un desperdicio: escribir "camiseta" son ocho peticiones de las que solo importa la última.

La técnica se llama *debounce*: retrasar la ejecución hasta que pasen unos milisegundos sin actividad.

```js
function retrasar(fn, milisegundos = 300) {
    let temporizador;

    return (...argumentos) => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => fn(...argumentos), milisegundos);
    };
}

const buscarConRetraso = retrasar(async (texto) => {
    const resultados = await api.tareas.listar({ q: texto });
    pintarResultados(resultados);
}, 300);

campoBusqueda.addEventListener("input", evento => {
    buscarConRetraso(evento.target.value);
});
```

Fíjate en cómo funciona: cada pulsación **cancela** el temporizador anterior y crea uno nuevo. Solo cuando pasan 300 ms sin escribir, la función se ejecuta. La variable `temporizador` sobrevive entre llamadas porque queda capturada en un **closure**.

---

## Respuestas que llegan desordenadas {: .topic-title }

Incluso con *debounce* queda un problema más sutil. Dos búsquedas lanzadas seguidas pueden responder en orden distinto al que se enviaron: si la primera tarda más que la segunda, sus resultados llegan después y **pisan** a los correctos.

El usuario ve en pantalla el resultado de lo que escribió antes. Es una condición de carrera, y no se arregla esperando más.

La solución es cancelar la petición anterior antes de lanzar la nueva:

```js
let controladorActual = null;

async function buscar(texto) {
    controladorActual?.abort();              // cancela la búsqueda anterior
    controladorActual = new AbortController();

    try {
        const resultados = await api.tareas.listar(
            { q: texto },
            { signal: controladorActual.signal }
        );
        pintarResultados(resultados);
    } catch (error) {
        if (error.name === "AbortError") return;   // cancelada por nosotros
        mostrarError(error.message);
    }
}
```

Para que esto funcione, la función base tiene que dejar pasar la `signal` hasta el `fetch`. Es una razón más para tener una sola capa: se añade una vez y lo hereda toda la aplicación.

!!! tip "*Debounce* y `AbortController` resuelven cosas distintas"
    El *debounce* reduce **cuántas** peticiones se lanzan. El `AbortController` garantiza que la que se pinta es **la última**, aunque no sea la primera en volver.

    Se usan juntos: el primero ahorra tráfico, el segundo evita mostrar datos equivocados.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Una función base con la URL, cabeceras y comprobación de estado | Repetir `fetch` con las mismas cabeceras por todo el código |
| Métodos con nombre de dominio (`api.tareas.crear`) | Escribir rutas HTTP en los manejadores de la interfaz |
| Errores con `estado` y `detalles` | `throw new Error("Error 400")` sin contexto |
| `try`/`catch` alrededor del `JSON.parse` del error | Suponer que un fallo del servidor devuelve JSON |
| Promesa compartida al renovar el token | Que cada `401` dispare su propia renovación |
| Un único reintento tras renovar | Reintentar en bucle mientras siga el `401` |
| Modelar los cuatro estados de la interfaz | Solo "cargando" y "con datos" |
| *Debounce* + `AbortController` en las búsquedas | Una petición por tecla pulsada |
| Comprobar el `204` antes de leer el cuerpo | Llamar a `.json()` sobre una respuesta vacía |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — AbortController** | https://developer.mozilla.org/es/docs/Web/API/AbortController |
| 📘 **MDN — Errores personalizados** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error |
| 📗 **web.dev — JavaScript** | https://web.dev/javascript?hl=es-419 |
