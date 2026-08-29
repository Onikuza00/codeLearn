# 🚨 Repaso urgente — JS / DOM

> Esta página no es teoría genérica: cada punto sale de un fallo **real** registrado en `GOTCHAS.md` (Fallos 37-67), ordenado por número de reincidencias. Lo primero que hay que mirar al empezar una sesión de JS, antes de escribir una sola línea.
>
> Corte: cierre del 25/08/2026. · Symfony tiene su propia página: [Repaso urgente — Symfony](repaso-urgente-symfony.md).

---

## 📊 Prioridad — de más a menos urgente

| Nivel | Patrón | Veces que ha fallado |
|:---:|---|:---:|
| 🔴 1 | `setCustomValidity()` recibe un **string**, no un elemento | 3 (20/08, 23/08 ×2) |
| 🔴 1 | Negar una expresión compuesta (`&&`/`||`) término por término — De Morgan | 2 (25/08 ×2, mismo ejercicio) |
| 🔴 1 | Los tres `contains()` distintos | 4 (23/08 ×3, 25/08) |
| 🟠 2 | Variable sin `let`/`const` — fuga a global implícita | 2 (20/08, 25/08) |
| 🟠 2 | Rangos: `&&` para "dentro", `\|\|` para "fuera" | 2 (22/08, 23/08) |
| 🟠 2 | `x++` dentro de una expresión que se reasigna | 2 (13/08, 23/08) |
| 🟡 3 | Todo lo que sale del DOM es **texto** (`dataset`, `getAttribute`) | 2 (22/08, 23/08) |
| 🟡 3 | `classList`/`closest()` — a cuál le va el punto y a cuál no | 3 (23/08 ×2, 25/08) |
| 🟡 3 | `toggle(clase, booleano)` — el segundo argumento **fija**, no invierte (en cualquier sentido, marcar o desmarcar) | 4 (22/08, 23/08 ×2, 25/08) |
| 🟡 3 | Acumulador declarado **fuera** del bucle o del listener (cuando debía ir dentro) | 4 (20/08, 22/08, 23/08 ×2) |
| 🟢 4 | Elegir el elemento correcto para un listener "global" (`document` vs. un elemento puntual) | 1 (25/08) |
| 🟢 4 | `insertBefore(nodoAMover, referencia)` con los argumentos invertidos | 1 (25/08, con retroceso respecto al 23/08) |
| 🟢 4 | Selector de clase compuesta (`.a.b`) vs. clase con guion (`.a-b`) | 1 (25/08) |
| 🟢 4 | Dos ramas de lógica compartiendo una sola variable | 1 (23/08) |
| 🟢 4 | Confundir un elemento del DOM con el valor que contiene | 3 (22/08) |
| 🟢 4 | Calcular algo y no usar el resultado | 3 (22/08) |

---

## 🔴 Nivel 1 — Reincidencias confirmadas

Estos tres han fallado **más de una vez, en días distintos**. Corregirlos una vez no ha bastado.

### 1. `setCustomValidity()` siempre recibe un STRING

El fallo más persistente de todos: tres veces, y dos de ellas **el mismo día en dos ejercicios distintos**.

```js
// ❌ Fallo 54 y Fallo 61 — se pasa el elemento <span>, no el mensaje
inputEdad.setCustomValidity(spanError);
inputCodigo.setCustomValidity(spanError);
```

```js
// ✅ El mensaje es texto. Y siempre necesita su rama de limpieza
if (!esValido) {
  spanError.textContent = "El código postal debe tener 5 dígitos";
  inputCodigo.setCustomValidity(spanError.textContent);
  return;
}

spanError.textContent = "";
inputCodigo.setCustomValidity(""); // sin esto, el campo queda inválido para siempre
```

!!! danger "Pregunta obligatoria antes de escribirlo"
    **"Lo que le estoy pasando, ¿es texto o es un elemento?"**
    `setCustomValidity()` solo existe en `input`/`select`/`textarea`, y su único argumento válido es un string. Un string vacío `""` significa "válido"; cualquier otro texto significa "inválido, y este es el motivo".

📖 Teoría: [Formularios y validación](/js/04-dom/03-eventos/03-pagina-formularios/)

---

### 2. Rangos — `&&` para dentro, `||` para fuera

```js
// ❌ Fallo 54 — con || casi CUALQUIER número cumple una de las dos condiciones
if (edad >= 18 || edad <= 65) { /* 5 pasa. 200 pasa. Todo pasa. */ }
```

```js
// ✅ "Dentro de un rango" exige los DOS límites a la vez
if (edad >= 18 && edad <= 65) { }

// ✅ "Fuera de un rango" exige CUALQUIERA de los dos
if (edad < 18 || edad > 65) { }
```

!!! warning "Por qué se cuela"
    Este bug **no explota nunca**. La validación sigue funcionando, simplemente deja pasar valores que debería rechazar. Si una validación "va bien" pero no rechaza nada, el sospechoso número uno es el operador del rango.

---

### 3. `x++` dentro de una expresión que se reasigna

```js
// ❌ Fallo 56 — el contador queda CONGELADO, nunca sube
contador = Math.min(limite, contador++);
```

Traza paso a paso de por qué:

| Paso | Qué pasa |
|---|---|
| 1 | `contador` vale `3` |
| 2 | `contador++` **devuelve `3`** (el valor viejo) y de paso pone `contador` a `4` |
| 3 | `Math.min(5, 3)` → `3` |
| 4 | `contador = 3` ← **la asignación pisa el `4` del paso 2** |

```js
// ✅ Suma simple, sin efecto secundario que pueda pisarse
contador = Math.min(limite, contador + 1);
```

!!! tip "Regla corta"
    `x++` devuelve el valor **viejo**. `++x` devuelve el **nuevo**. Y si el resultado de la expresión se vuelve a asignar a esa misma variable, **no uses ninguno de los dos**: usa `x + 1`.

📖 Teoría: [Operadores](/js/01-basico/02-operadores/) · [Math](/js/01-basico/01-variables-tipos/)

---

## 🟠 Nivel 2 — El clúster "todo lo que sale del DOM es texto"

Tres fallos distintos con la **misma raíz**: el DOM devuelve strings, no los tipos que parecen.

### 4. `dataset` y `getAttribute()` siempre devuelven string

```js
// ❌ Fallo 43 — data-stock="0" devuelve "0" (texto), nunca 0 (número)
if (x.dataset.stock === 0) { }        // nunca entra
```

```js
// ❌ Fallo 53 — aria-expanded="false" es el TEXTO "false", no el booleano
faq.setAttribute("aria-expanded", !expansion);        // !"false" → false, siempre
faq.setAttribute("aria-expanded", expansion === false); // string vs booleano → false, siempre
```

```js
// ✅ Números: convertir antes de comparar
if (Number(x.dataset.stock) === 0) { }

// ✅ "Booleanos": comparar contra el STRING exacto
faq.setAttribute("aria-expanded", expansion === "false");
```

!!! danger "Por qué `!expansion` no funciona nunca"
    `!` sobre un string comprueba si está **vacío**, no lo que el texto significa. `"true"` y `"false"` son ambos strings no vacíos → `!expansion` da `false` en los dos casos. El texto `"false"` es *truthy*.

📖 Teoría: [Manipulación del DOM](/js/04-dom/02-manipulacion/)

---

### 5. `classList` recibe nombres de clase, nunca selectores

```js
// ❌ Fallo 52 — el punto se queda DENTRO del nombre de la clase
j.classList.toggle(".filtro-btn--activo");

// ❌ Fallo 60 — un selector CSS completo pasado a contains()
x.classList.contains(":not(.hidden)");
```

```js
// ✅ Sin punto, sin selector: el nombre tal cual está en el HTML
j.classList.toggle("filtro-btn--activo");
if (!x.classList.contains("hidden")) { }
```

!!! tip "Dónde va el punto y dónde no"
    | Método | ¿Lleva punto? |
    |---|:---:|
    | `querySelector()` / `querySelectorAll()` | ✅ sí — es un selector CSS |
    | `closest()` / `matches()` | ✅ sí — es un selector CSS |
    | `classList.add/remove/toggle/contains()` | ❌ **no** — es un nombre de clase |

    Pregunta antes de escribirlo: *"¿este valor viene del selector con el que busqué el elemento, o es el nombre de la clase del HTML?"*

---

### 6. `toggle(clase, booleano)` — el segundo argumento FIJA

```js
// ❌ Fallo 52 — sin force: invierte lo que YA HABÍA
// Dos clicks seguidos a la misma categoría dan resultados distintos
x.classList.toggle("hidden");
```

```js
// ✅ Con force: el resultado depende de la condición ACTUAL, no del estado anterior
const coincide = x.dataset.categoria === categoria || categoria === "todos";
x.classList.toggle("hidden", !coincide);
```

!!! warning "Cuándo cada forma"
    - **Sin force** → interruptor puro: un click, un cambio (un botón de menú, un favorito).
    - **Con force** → el estado se **recalcula** en cada evento (un filtro, una validación, un patrón de exclusividad).

    Y ojo: `toggle()` devuelve *"¿la clase quedó puesta?"*, no *"¿el elemento quedó visible?"* — si la clase es `hidden`, el significado está **invertido** (Fallo 44).

!!! danger "`remove()` NO tiene segundo argumento"
    ```js
    faq.classList.remove("hidden", expansion === "true"); // ❌ el segundo argumento se ignora
    ```
    El "force" es exclusivo de `toggle()`. `add()` y `remove()` aceptan varias clases, pero ningún booleano.

---

## 🟡 Nivel 3 — Estado: dónde vive cada variable

### 7. Acumulador declarado fuera del bucle o del listener

Cuatro fallos con el mismo mecanismo: leer o declarar el estado **una sola vez**, cuando debería refrescarse en cada vuelta.

```js
// ❌ Fallo 57 — "son" se comparte entre TODOS los ítems: arrastra el resultado del anterior
let son = false;
contenedor.querySelectorAll(".item").forEach(x => {
  if (x.dataset.nombre.includes(item)) son = true;
});
```

```js
// ❌ Fallo 56 — leído UNA vez, fuera de un listener que se dispara muchas veces
let contador = Number(spanCantidad.dataset.cantidad);
botonMas.addEventListener("click", () => { /* contador ya está desfasado */ });
```

```js
// ✅ Dentro del bucle: se reinicia en cada vuelta
contenedor.querySelectorAll(".item").forEach(x => {
  let son = false;
  if (x.dataset.nombre.includes(item)) son = true;
  x.classList.toggle("hidden", !son);
});

// ✅ Dentro del listener: se lee fresco en cada disparo
botonMas.addEventListener("click", () => {
  let contador = Number(spanCantidad.dataset.cantidad);
  contador = Math.min(limite, contador + 1);
  spanCantidad.dataset.cantidad = contador;   // escribir SIEMPRE los dos
  spanCantidad.textContent = `${contador}`;
});
```

!!! danger "La pregunta que lo detecta"
    **"¿Esta variable debe reiniciarse en cada vuelta / en cada click?"**
    Si la respuesta es sí, va **dentro**. Una variable declarada fuera de un bucle solo tiene sentido si acumula a través de todas las vueltas a propósito (una suma total, un contador global).

---

### 8. Dos ramas de lógica, una sola variable

```js
// ❌ Fallo 58 — el acumulador arranca heredando el estado del maestro
let todasMarcadas = master.checked;
forEach(x => {
  if (e.target === master) x.checked = todasMarcadas; // rama A usa la variable...
  else if (!x.checked) todasMarcadas = false;         // ...que la rama B modifica
});
```

```js
// ✅ Cada rama, su propia fuente de verdad
let todasMarcadas = true; // valor NEUTRO, no heredado

forEach(x => {
  if (e.target === master) {
    x.checked = master.checked;   // "forzar" → leer el elemento real, ahora
  } else {
    if (!x.checked) todasMarcadas = false;  // "acumular" → variable local
  }
});
```

!!! tip "Forzar vs. acumular"
    - **Forzar** un valor → leer el elemento **real** en ese momento (`master.checked`).
    - **Acumular** un resultado → variable local que arranca en su **valor neutro** (`true` para "todos", `0` para un contador) y que solo toca ese bucle.

---

### 9. Dentro de un `forEach`, el método va sobre el parámetro

```js
// ❌ Fallo 59 — toggle() sobre "fila" (siempre la misma) en vez de "x" (la vuelta actual)
tabla.querySelectorAll(".fila-tabla").forEach(x => {
  fila.classList.toggle("fila--activa", x === fila);
});
```

```js
// ✅ El método se llama sobre x; "fila" solo se usa para comparar
tabla.querySelectorAll(".fila-tabla").forEach(x => {
  x.classList.toggle("fila--activa", x === fila);
});
```

!!! tip "El patrón de exclusividad, completo"
    ```js
    const elegido = e.target.closest(".fila-tabla");
    if (!elegido) return;                      // guard clause primero

    contenedor.querySelectorAll(".fila-tabla").forEach(x => {
      x.classList.toggle("fila--activa", x === elegido);
    });
    ```
    Tres piezas: `closest()` para subir al elemento real → guard clause → `forEach` sobre **todos** con `toggle(clase, x === elegido)`.

---

## 🟢 Nivel 4 — Falsos amigos de la API

### 10. Los tres `contains()`

Mismo nombre, tres sitios distintos, tres argumentos distintos:

| Llamada | Pregunta que responde | Argumento |
|---|---|---|
| `elemento.contains(nodo)` | ¿Este **nodo** está dentro de mí? | Un nodo del DOM |
| `elemento.classList.contains(clase)` | ¿Tengo esta **clase** puesta? | Un string, sin punto |
| `texto.includes(sub)` | ¿Este **string** contiene ese trozo? | Un string |

```js
// ❌ Fallo 55 — classList.contains() con un nodo
if (menu.classList.contains(e.target)) return;

// ❌ Fallo 57 — .contains() no existe en strings
if (x.dataset.nombre.toLowerCase().contains(item)) { }
```

```js
// ✅ Click fuera de un contenedor → Element.contains(nodo)
if (menu.contains(e.target)) return;

// ✅ Búsqueda de texto → String.includes()
if (x.dataset.nombre.toLowerCase().includes(item)) { }
```

---

### 11. Un elemento no es el valor que contiene

```js
// ❌ Un contenedor no es una colección iterable
contenedorTabla.forEach(...);        // ❌ Fallo 42
```

```js
// ❌ Un <span> no es un número
if (spanCantidad < limite) { }       // ❌ Fallo 46
```

```js
// ✅ Colección: querySelectorAll, no el contenedor
contenedorTabla.querySelectorAll("tr").forEach(...);

// ✅ Valor: leerlo primero
if (Number(spanCantidad.textContent) < limite) { }
```

!!! tip "Antes de operar sobre algo del DOM"
    Pregunta: **"¿tengo el elemento, o tengo su valor?"** Para el valor hay que pasar siempre por `.textContent`, `.value` o `.dataset.X`. Para iterar hay que pasar siempre por `querySelectorAll()`.

---

### 12. Calcular algo y no usar el resultado

Tres veces el mismo día. JS calcula el valor y lo tira, sin ningún aviso.

```js
box.checked === todos;                  // ❌ compara y descarta (era una asignación: =)
x.classList.contains("hidden");         // ❌ pregunta y descarta (faltaba el if)
condicion ? algo : otro;                // ❌ ternario suelto, no asigna a nada
```

!!! danger "Antes de dar una línea por terminada"
    **"¿Esta línea asigna con `=`, hace `return`, o llama a algo que muta el DOM?"**
    Si no hace ninguna de las tres, esa línea **no hace nada**.

---

### 13. Exclusividad vs. cierre independiente

Dos patrones que se parecen a simple vista y piden lógica **opuesta**:

| | Exclusividad | Cierre independiente |
|---|---|---|
| **Ejemplo** | Acordeón, filtro, fila activa | Cerrar un aviso, borrar un ítem |
| **Comportamiento** | Marcar uno = desmarcar los demás | Cada uno se cierra solo |
| **¿`forEach` sobre todos?** | ✅ imprescindible | ❌ solo si hay que recontar después |

```js
// ✅ Exclusividad
contenedor.querySelectorAll(".panel").forEach(x => {
  x.classList.toggle("activo", x === elegido);
});

// ✅ Independiente — tocar solo el clicado
boton.closest(".aviso").classList.add("hidden");
```

!!! warning "Fallo 60"
    Copiar el patrón del ejercicio anterior por parecido superficial es la causa exacta de este fallo. **Antes de escribir el `forEach`, decidir cuál de los dos pide el enunciado.**

---

## 🆕 Nuevos patrones — 25/08

### 14. Negar una expresión compuesta (`&&`/`||`) — De Morgan

Ahora mismo el patrón más urgente: dos vueltas seguidas en el mismo ejercicio.

```js
// ❌ Fallo 64 — negar A && (B || C) término por término, sin invertir los operadores
e.classList.toggle("hidden", !todos && (!titulo || !estado));
```

```js
// ✅ Armar primero la versión en POSITIVO, calcada de la pregunta real
const entra = titulo && (estado || todos);
e.classList.toggle("hidden", !entra);   // negar el resultado UNA sola vez, al final
```

!!! danger "Regla corta"
    Negar `A && (B || C)` NO es `!A && (!B || !C)` — hay que invertir también los operadores (`!A || (!B && !C)`). Es fácil de errar a mano. Antes de escribir un `!` sobre una expresión con `&&`/`||` por dentro: armar primero la versión en positivo, en una variable con nombre claro, y negarla entera una sola vez al final — nunca redistribuir el `!` por los términos sueltos.

📖 Teoría: [Operadores](/js/01-basico/02-operadores/)

---

### 15. Elegir el elemento correcto para un listener "global"

```js
// ❌ Fallo 63 — solo ve clics DENTRO del propio botón
botonAbrir.addEventListener('click', (e) => { ... });
```

```js
// ✅ document ve clics de toda la página
document.addEventListener('click', (e) => { ... });
```

!!! tip "Pregunta antes de escribirlo"
    "¿Este listener necesita reaccionar a clics de CUALQUIER parte de la página, o solo de este elemento puntual?" Si es lo primero, va en `document` — enganchado en un elemento chico, el resto de la página queda ciego para ese listener.

---

### 16. `insertBefore(nodoAMover, referencia)` — revisar el orden cada vez

```js
// ❌ Fallo 65 — item ya está inmediatamente antes de hermano: no-op
lista.insertBefore(item, hermano);
```

```js
// ✅ Mover al hermano ANTES del item lo empuja un lugar hacia abajo
lista.insertBefore(hermano, item);
```

!!! warning "Ya se había dominado el 23/08 (Fallo 48) y volvió a fallar"
    Antes de llamar `insertBefore`, decir en voz alta qué nodo se mueve y antes de cuál queda — si el nodo que se mueve ya está exactamente ahí, la llamada es un no-op.

---

### 17. Selector de clase compuesta (`.a.b`) vs. clase con guion (`.a-b`)

```js
// ❌ Fallo 67 — busca elemento con clase "linea" Y clase "carrito" a la vez
contenedor.querySelectorAll(".linea.carrito");
```

```js
// ✅ Una sola clase, el guion es parte del nombre
contenedor.querySelectorAll(".linea-carrito");
```

!!! tip "Antes de escribir un selector con guion"
    Copiar el nombre EXACTO de la clase del HTML, sin puntos de más en el medio — `.a.b` y `.a-b` son selectores completamente distintos.

---

## ✅ Checklist de 60 segundos

Antes de dar cualquier función por terminada:

- [ ] ¿Cada línea **asigna**, **devuelve** o **muta** algo? Si no, sobra.
- [ ] ¿Las variables que se reinician están declaradas **dentro** del bucle/listener?
- [ ] ¿Todo valor que viene del DOM está **convertido** antes de compararse?
- [ ] En `classList`, ¿los nombres de clase van **sin punto**?
- [ ] Si un `toggle()` se recalcula en cada evento, ¿lleva su **segundo argumento**?
- [ ] ¿`setCustomValidity()` recibe un **string** y tiene su rama de limpieza `("")`?
- [ ] En rangos, ¿es `&&` (dentro) o `||` (fuera)? ¿La validación **rechaza** de verdad algo?
- [ ] ¿Hay un **guard clause** (`if (!x) return`) después de cada `closest()`?
- [ ] Dentro de un `forEach`, ¿el método se llama sobre el **parámetro del callback**?
- [ ] ¿Todas las variables llevan `const` o `let` delante?
- [ ] Si negué una expresión con `&&`/`||`, ¿armé primero la versión en positivo y negué el resultado completo una sola vez?
- [ ] Un listener para clics de "cualquier parte de la página", ¿está enganchado en `document`, no en un elemento puntual?

---

## 📖 Dónde está la teoría completa

| Tema | Enlace |
|---|---|
| Selección y `closest()` | [Selección en el DOM](/js/04-dom/01-seleccion/) |
| `classList`, `dataset`, atributos | [Manipulación del DOM](/js/04-dom/02-manipulacion/) |
| Eventos y delegación | [Eventos](/js/04-dom/03-eventos/) |
| Validación de formularios | [Formularios](/js/04-dom/03-eventos/03-pagina-formularios/) |
| Operadores, precedencia, postfix | [Operadores](/js/01-basico/02-operadores/) |
| `Math.min` / `Math.max` | [Variables y tipos](/js/01-basico/01-variables-tipos/) |
| Registro completo de fallos | `GOTCHAS.md` (Fallos 37-67) |
