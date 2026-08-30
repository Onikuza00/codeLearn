# Módulos { .bloque-js }

> Un módulo es un fichero de JavaScript que decide qué parte de su contenido comparte con los demás y qué se queda para él. Es lo que permite repartir una aplicación en ficheros sin que todo choque entre sí.

---

## El problema {: .topic-title }

Durante años, la única forma de partir el código en varios ficheros era poner varias etiquetas `<script>`. Y eso tiene tres problemas graves.

**Todo comparte el mismo espacio.** Cada variable declarada en el nivel superior de un `<script>` es global. Dos ficheros que declaren `usuario` se pisan, y el último gana. En un proyecto con veinte ficheros y dos librerías, las colisiones son cuestión de tiempo.

**El orden es tuyo.** Si `carrito.js` usa una función de `utilidades.js`, la etiqueta de utilidades tiene que ir antes. Ese orden no está escrito en ninguna parte más que en el HTML, y romperlo produce un error que no explica la causa.

**No se ve de qué depende cada fichero.** Abres `carrito.js` y ves que llama a `formatearPrecio()`. ¿De dónde sale? De algún otro `<script>`. Hay que buscarlo.

```html
<!-- Frágil: el orden es una dependencia invisible -->
<script src="utilidades.js"></script>
<script src="api.js"></script>
<script src="carrito.js"></script>
```

Los módulos resuelven los tres de golpe: cada fichero tiene su propio ámbito, declara explícitamente qué necesita, y el navegador resuelve el orden solo.

---

## Activarlos {: .topic-title }

Un fichero se convierte en módulo con el atributo `type="module"`:

```html
<script type="module" src="app.js"></script>
```

A partir de ahí cambian varias cosas, y conviene conocerlas porque explican comportamientos que sorprenden.

| | `<script>` normal | `<script type="module">` |
|---|---|---|
| Ámbito de las variables | Global | **Propio del fichero** |
| Momento de ejecución | Bloquea el análisis del HTML | **Diferido**: al terminar de cargar la página |
| Modo estricto | Solo con `"use strict"` | **Siempre activo** |
| `this` en el nivel superior | `window` | `undefined` |
| Se ejecuta si se incluye dos veces | Sí, dos veces | **Solo una** |
| Requiere servidor | No | **Sí** (no funciona con `file://`) |

!!! danger "Los módulos no funcionan abriendo el HTML con doble clic"
    Con una dirección `file://`, el navegador bloquea la carga de módulos por su política de seguridad entre orígenes. El error que aparece habla de CORS, lo cual despista bastante, porque no hay ningún servidor de por medio.

    Hace falta servir la página por HTTP. Con la extensión Live Server del editor, con `php -S localhost:8000`, o con cualquier servidor local.

!!! tip "Los módulos ya son diferidos: no hace falta `defer`"
    Un `<script type="module">` se comporta como si llevara `defer`: se descarga en paralelo y se ejecuta cuando el HTML está completo.

    Eso significa que **el DOM ya existe** cuando corre tu código. No hace falta envolverlo en `DOMContentLoaded` ni poner la etiqueta al final del `<body>`.

---

## Exportar {: .topic-title }

Nada de un módulo es visible desde fuera salvo lo que exportes explícitamente. Esa es la regla básica.

### Exportación con nombre

```js
// utilidades.js
export const IVA = 0.21;

export function formatearPrecio(valor) {
    return `${valor.toFixed(2)} €`;
}

export class Carrito { /* ... */ }
```

También se pueden marcar todas al final, que a veces se lee mejor porque deja la interfaz del módulo reunida en un sitio:

```js
const IVA = 0.21;
function formatearPrecio(valor) { /* ... */ }

export { IVA, formatearPrecio };
```

### Exportación por defecto

Cada módulo puede tener **una sola** exportación por defecto, pensada para cuando el fichero representa una única cosa.

```js
// ClienteApi.js
export default class ClienteApi { /* ... */ }
```

---

## Importar {: .topic-title }

```js
import { formatearPrecio, IVA } from "./utilidades.js";
import ClienteApi from "./ClienteApi.js";
import ClienteApi, { URL_BASE } from "./ClienteApi.js";   // las dos a la vez
```

La diferencia visible: las exportaciones con nombre van entre llaves, la de por defecto no.

Y hay una diferencia de fondo. **Los nombres entre llaves tienen que coincidir exactamente** con lo exportado, porque el módulo se resuelve por nombre. La exportación por defecto, en cambio, no tiene nombre propio: se lo pones tú al importarla.

```js
import Cualquiera from "./ClienteApi.js";      // válido, aunque confuso
import { formatearPrcio } from "./utilidades.js";   // ❌ error: no existe
```

Si necesitas cambiar un nombre —porque choca con otro—, se hace con `as`:

```js
import { formatearPrecio as formatearEuros } from "./utilidades.js";
import * as utilidades from "./utilidades.js";   // todo en un objeto

utilidades.formatearPrecio(10);
```

!!! danger "La extensión `.js` es obligatoria en el navegador"
    ```js
    import { algo } from "./utilidades";       // ❌ 404 en el navegador
    import { algo } from "./utilidades.js";    // ✅
    ```
    La ruta es literalmente la dirección que el navegador va a pedir. Sin extensión, pide un fichero que no existe.

    Node y los empaquetadores como Vite sí permiten omitirla, y de ahí viene la confusión: copias un ejemplo escrito para Node y en el navegador falla.

!!! warning "La ruta relativa necesita el `./`"
    ```js
    import { algo } from "utilidades.js";      // ❌ el navegador lo trata como paquete
    import { algo } from "./utilidades.js";    // ✅
    ```
    Sin `./` o `../`, el navegador entiende que te refieres a un paquete instalado, no a un fichero tuyo. Es un especificador que solo un empaquetador sabe resolver.

---

## Nombrado o por defecto {: .topic-title }

Es la duda más frecuente al estructurar un proyecto.

| | Con nombre | Por defecto |
|---|---|---|
| Cuántas por fichero | Las que quieras | Una |
| El nombre al importar | Fijo, tiene que coincidir | Lo eliges tú |
| Autocompletado del editor | Funciona bien | Funciona peor |
| Renombrar en todo el proyecto | Automático | Hay que revisar fichero por fichero |

!!! tip "Prefiere las exportaciones con nombre"
    Con la exportación por defecto, cada fichero puede llamar a lo mismo de forma distinta: `import Api`, `import Cliente`, `import api`. Buscar todos los usos de una clase deja de ser una búsqueda de texto fiable.

    Reserva la exportación por defecto para cuando el módulo **es** una sola cosa y el nombre del fichero ya lo dice todo. Para todo lo demás, nombres explícitos.

---

## Comportamiento a tener en cuenta {: .topic-title }

### Un módulo se ejecuta una sola vez

Aunque lo importen diez ficheros, el código del nivel superior de un módulo corre **una única vez**. El resultado se guarda y se reparte.

```js
// configuracion.js
console.log("Configurando…");     // se imprime UNA vez
export const config = { tema: "oscuro" };
```

Eso tiene una consecuencia muy útil: **un objeto exportado es compartido**. Todos los que lo importan ven la misma instancia, así que sirve como estado común sin necesidad de nada más.

Y una trampa: si ese objeto es mutable, cualquier módulo puede modificarlo y los demás verán el cambio. A veces es lo que quieres; cuando no lo es, cuesta rastrear quién lo tocó.

### Las importaciones son vínculos vivos

Lo que importas no es una copia del valor, es una referencia al del módulo original. Si allí cambia, aquí también.

```js
// contador.js
export let cuenta = 0;
export function incrementar() { cuenta++; }

// app.js
import { cuenta, incrementar } from "./contador.js";

console.log(cuenta);   // 0
incrementar();
console.log(cuenta);   // 1  — el valor importado se ha actualizado
```

!!! warning "Pero no puedes reasignar lo que importas"
    ```js
    import { cuenta } from "./contador.js";
    cuenta = 5;      // ❌ TypeError: Assignment to constant variable
    ```
    Solo el módulo dueño puede cambiar sus propios valores. Desde fuera se leen, y se modifican llamando a las funciones que él exporta. Es la misma idea que una propiedad privada con métodos públicos.

### Las importaciones suben al principio

`import` se procesa antes de que se ejecute nada del fichero. Da igual dónde lo escribas: el módulo importado se carga primero.

Por eso los `import` van siempre arriba, y por eso no pueden estar dentro de una condición o de una función:

```js
if (usuarioConectado) {
    import { panel } from "./panel.js";     // ❌ SyntaxError
}
```

Para cargar algo condicionalmente existe la importación dinámica.

---

## Importación dinámica {: .topic-title }

`import()` como función devuelve una **promesa** con el módulo. Permite cargar código solo cuando hace falta.

```js
boton.addEventListener("click", async () => {
    const { abrirEditor } = await import("./editor.js");
    abrirEditor();
});
```

El navegador no descarga `editor.js` hasta que alguien pulsa el botón. Si es una librería pesada que la mayoría de usuarios no llega a usar, es una mejora real en el tiempo de carga inicial. La técnica se llama **división del código** (*code splitting*).

Encaja con todo lo del bloque de asincronía: es una promesa, así que se maneja con `await` y `try`/`catch`.

```js
try {
    const modulo = await import("./opcional.js");
    modulo.arrancar();
} catch (error) {
    console.warn("No se pudo cargar el módulo:", error);
}
```

!!! tip "Aquí se cierra el círculo del *top-level await*"
    Dentro de un módulo puedes usar `await` fuera de cualquier función, en el nivel más externo del fichero:

    ```js
    // configuracion.js — módulo
    export const config = await fetch("/config.json").then(r => r.json());
    ```
    Los módulos que importen este esperarán a que la configuración esté lista antes de ejecutarse. Es la excepción que se mencionaba en la página de [async/await](../05-asincronia/05-async-await/index.md), y solo existe en módulos: en un `<script>` normal es un error de sintaxis.

    Úsalo con cuidado: bloquea la carga de todo lo que dependa de ese módulo.

---

## Ficheros de reexportación {: .topic-title }

Cuando una carpeta tiene muchos ficheros, es común crear un `index.js` que recoge y vuelve a exportar todo, para que quien lo use tenga un único punto de entrada.

```js
// servicios/index.js
export { ClienteApi } from "./ClienteApi.js";
export { Autenticacion } from "./Autenticacion.js";
export { Notificador } from "./Notificador.js";
```

```js
import { ClienteApi, Notificador } from "./servicios/index.js";
```

Se le llama *barrel file*. Ordena las importaciones, pero tiene un coste: obliga a cargar el fichero entero aunque solo necesites una cosa de él, y en proyectos grandes complica que el empaquetador descarte lo que no se usa. Úsalo en carpetas pequeñas y cohesionadas.

---

## Otros sistemas de módulos {: .topic-title }

Te vas a encontrar dos sintaxis distintas, y conviene saber cuál es cuál.

| | Módulos ES (ESM) | CommonJS |
|---|---|---|
| Sintaxis | `import` / `export` | `require()` / `module.exports` |
| Dónde | Navegador y Node moderno | Node antiguo |
| Cuándo se resuelve | Al analizar el fichero | Al ejecutarlo |
| Carga condicional | Con `import()` | `require()` en cualquier sitio |

```js
// CommonJS — lo verás en proyectos de Node con años
const express = require("express");
module.exports = { arrancar };
```

**Los módulos ES son el estándar del lenguaje.** CommonJS fue la solución de Node antes de que existieran, y sigue vivo en mucho código. En Node, un proyecto usa módulos ES si su `package.json` incluye `"type": "module"`, o si los ficheros tienen extensión `.mjs`.

!!! info "Por qué casi nadie sirve módulos sueltos en producción"
    Un proyecto con doscientos módulos son doscientas peticiones HTTP. Aunque HTTP/2 lo hace menos grave, sigue siendo peor que servir unos pocos ficheros optimizados.

    Por eso existen los **empaquetadores** (Vite, Rollup, esbuild): leen tus módulos, resuelven las dependencias, descartan lo que nadie usa y generan unos pocos ficheros. En desarrollo sirven módulos nativos para que recargar sea instantáneo, y al construir para producción los agrupan.

    La sintaxis que escribes es la misma. El empaquetador solo cambia cómo llega al navegador.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `export` con nombre por defecto | `export default` en todos los ficheros |
| Extensión `.js` y `./` en las rutas del navegador | `from "utilidades"` copiado de un ejemplo de Node |
| Todos los `import` arriba del fichero | Intentar importar dentro de un `if` |
| `import()` para lo pesado y poco usado | Cargar toda la aplicación en el arranque |
| Un módulo, una responsabilidad clara | Un `utilidades.js` con cuarenta funciones sin relación |
| Modificar el estado de un módulo desde sus funciones | Reasignar lo que has importado |
| Servir por HTTP durante el desarrollo | Abrir el HTML con doble clic |
| Reexportar en carpetas pequeñas | Un fichero índice gigante para todo el proyecto |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Módulos** | https://www.aprendejavascript.dev/clase/modulos/que-son-los-modulos |
| 📘 **MDN — Módulos de JavaScript** | https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules |
| 📗 **web.dev — JavaScript** | https://web.dev/javascript?hl=es-419 |
