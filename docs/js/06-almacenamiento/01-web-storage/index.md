# Web Storage { .bloque-js }

> `localStorage` y `sessionStorage` son dos almacenes de pares clave-valor que el navegador reserva para cada dominio. Misma API, misma capacidad; solo cambia cuánto duran los datos.

---

## Los dos almacenes {: .topic-title }

Ambos son propiedades del objeto global `window`, así que se usan directamente por su nombre. La API es idéntica: lo único que los diferencia es la duración y el alcance.

| | `localStorage` | `sessionStorage` |
|---|---|---|
| Duración | Indefinida — sobrevive a cerrar el navegador | Se borra al cerrar la pestaña |
| Alcance | Compartido por todas las pestañas del dominio | Aislado en **cada pestaña** |
| Caso típico | Tema visual, idioma, borradores | Asistente de varios pasos, datos de un solo flujo |

!!! info "Cada pestaña tiene su propio `sessionStorage`"
    Dos pestañas con la misma página tienen dos almacenes de sesión **separados**: lo que escribe una no lo ve la otra.

    Hay una excepción curiosa: si duplicas una pestaña (clic derecho → Duplicar), la nueva **hereda una copia** del contenido en ese momento. A partir de ahí evolucionan por separado.

Los datos también dependen del **protocolo**. Lo guardado en `http://ejemplo.com` no es accesible desde `https://ejemplo.com`, aunque el dominio sea el mismo: para el navegador son orígenes distintos.

---

## Guardar, leer y borrar {: .topic-title }

```js
localStorage.setItem("usuario", "Ana");        // guardar
const nombre = localStorage.getItem("usuario"); // leer → "Ana"
localStorage.removeItem("usuario");             // borrar una clave
localStorage.clear();                           // borrar TODO el dominio
```

Existen dos formas alternativas de acceso, porque el almacén es un objeto:

```js
localStorage.usuario = "Ana";       // como propiedad
localStorage["usuario"] = "Ana";    // como clave de objeto
```

**Usa siempre `setItem` y `getItem`.** No es solo cuestión de estilo: la notación de propiedad falla en cuanto la clave tiene un guion o coincide con un método existente (`length`, `clear`, `key`). Además, `removeItem` no tiene equivalente en notación de objeto.

!!! warning "`getItem` devuelve `null`; el acceso directo devuelve `undefined`"
    ```js
    localStorage.getItem("noExiste");   // null
    localStorage.noExiste;              // undefined
    ```
    La diferencia importa si comparas con `===`. Con `getItem`, la comprobación correcta es contra `null`:

    ```js
    const valor = localStorage.getItem("tema");
    if (valor === null) {
        aplicarTemaPorDefecto();
    }
    ```

Para recorrer todo lo guardado:

```js
localStorage.length;          // cuántas claves hay
localStorage.key(0);          // el nombre de la clave en la posición 0

Object.keys(localStorage).forEach(clave => {
    console.log(clave, localStorage.getItem(clave));
});
```

---

## Objetos y arrays: JSON {: .topic-title }

Web Storage solo guarda texto. Cualquier objeto o array hay que convertirlo con `JSON.stringify()` al escribir y `JSON.parse()` al leer.

```js
const ajustes = { tema: "oscuro", idioma: "es", notificaciones: true };

localStorage.setItem("ajustes", JSON.stringify(ajustes));

const guardados = JSON.parse(localStorage.getItem("ajustes"));
console.log(guardados.tema);   // "oscuro"
```

!!! danger "`JSON.parse(null)` no falla, pero `JSON.parse("texto suelto")` sí"
    Si la clave no existe, `getItem` devuelve `null` y `JSON.parse(null)` devuelve `null` tranquilamente. Pero si lo guardado no es JSON válido —porque otra versión del código escribió texto plano, o porque quedó a medias—, `JSON.parse` **lanza una excepción** y rompe la ejecución.

    La lectura segura se escribe una vez y se reutiliza:

    ```js
    function leerJSON(clave, valorPorDefecto = null) {
        const crudo = localStorage.getItem(clave);
        if (crudo === null) return valorPorDefecto;

        try {
            return JSON.parse(crudo);
        } catch {
            localStorage.removeItem(clave);   // dato corrupto: fuera
            return valorPorDefecto;
        }
    }
    ```

Otro detalle que sorprende: los tipos que no son texto se convierten al guardarlos.

```js
localStorage.setItem("edad", 30);
typeof localStorage.getItem("edad");   // "string" — es "30", no 30

localStorage.setItem("activo", false);
localStorage.getItem("activo") === "false";   // true — ¡es la CADENA "false"!
if (localStorage.getItem("activo")) { }       // se ejecuta: "false" es cierto
```

La cadena `"false"` no está vacía, así que en una condición vale como verdadera. Es un fallo silencioso clásico: guarda booleanos y números dentro de un objeto con JSON, o conviértelos explícitamente al leer con `Number()` o comparando con `=== "true"`.

---

## Cuando el almacén se llena {: .topic-title }

El límite ronda los 5 MB por origen. Al superarlo, `setItem` **lanza una excepción** (`QuotaExceededError`).

También falla en modo incógnito de algunos navegadores, o cuando el usuario ha bloqueado el almacenamiento de datos del sitio.

!!! warning "Escribir mucho debe ir protegido"
    Si guardas datos que pueden crecer —un historial, una caché de respuestas—, envuelve la escritura:

    ```js
    function guardarSeguro(clave, valor) {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
            return true;
        } catch {
            console.warn("No se pudo guardar: almacenamiento lleno o bloqueado");
            return false;
        }
    }
    ```
    Para preferencias sencillas no hace falta; para cachés sí.

---

## Sincronizar entre pestañas {: .topic-title }

El evento `storage` se dispara en **las otras pestañas** del mismo dominio cuando una de ellas modifica `localStorage`. Sirve para mantenerlas sincronizadas.

```js
window.addEventListener("storage", evento => {
    if (evento.key !== "tema") return;      // early return

    console.log("Antes:", evento.oldValue);
    console.log("Ahora:", evento.newValue);
    aplicarTema(evento.newValue);
});
```

!!! tip "El evento NO se dispara en la pestaña que hizo el cambio"
    Es intencionado: esa pestaña ya sabe lo que ha hecho. Si escribes el cambio y esperas que tu propio manejador reaccione, no pasará nada.

    El uso real es el contrario: si el usuario cierra sesión en una pestaña, las demás se enteran y también cierran.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `setItem` / `getItem` / `removeItem` | `localStorage.miClave = valor` como propiedad |
| `JSON.stringify` al escribir objetos y arrays | Pasar el objeto directo — se convierte en `"[object Object]"` |
| `JSON.parse` dentro de un `try`/`catch` | Confiar en que lo guardado sigue siendo JSON válido |
| Comparar con `=== null` al comprobar existencia | Comparar con `undefined` el resultado de `getItem` |
| Convertir con `Number()` lo que vas a usar como número | Operar con `"30"` como si fuera `30` |
| Prefijar las claves con el nombre de la aplicación (`app:tema`) | Claves genéricas como `datos` o `config` que colisionan |
| `sessionStorage` cuando el dato solo vale para esa pestaña | `localStorage` para todo por costumbre |
| Guardar solo lo que puedes perder sin consecuencias | Guardar tokens de sesión o datos personales |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Almacenamiento local** | https://apunts.institutmontilivi.cat/DAW-M0612/storage.html |
| 📘 **MDN — Web Storage API** | https://developer.mozilla.org/es/docs/Web/API/Web_Storage_API |
| 📘 **MDN — Window.localStorage** | https://developer.mozilla.org/es/docs/Web/API/Window/localStorage |
