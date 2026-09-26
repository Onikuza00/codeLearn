# 🚨 Repaso urgente — JS / DOM

> Esta página no es teoría genérica: cada punto sale de un fallo **real** registrado en `GOTCHAS.md` (Fallos 37-67) o de las sesiones rehechas desde cero, como la del [21/09](2026/09/semana-3/2026-09-21.md), ordenado por número de reincidencias. Lo primero que hay que mirar al empezar una sesión de JS, antes de escribir una sola línea.
>
> Corte: cierre del 26/09/2026 (tanda 2). · Symfony tiene su propia página: [Repaso urgente — Symfony](repaso-urgente-symfony.md).
>
> **Formato del código** (igual que los daily): primero una card `✅` con el código bueno y debajo una card `❌` por cada error. Los avisos (tips, warnings, danger) van como siempre.

---

## 🔴 Nivel 1 — Reincidencias confirmadas

Estos han fallado **más de una vez, en días distintos**. Corregirlos una vez no ha bastado.

### 1. `setCustomValidity()` siempre recibe un STRING

El fallo más persistente de todos: tres veces, y dos de ellas **el mismo día en dos ejercicios distintos**.

!!! success "✅ Versión correcta"
    ```js
    // El mensaje es texto. Y siempre necesita su rama de limpieza
    if (!esValido) {
      spanError.textContent = "El código postal debe tener 5 dígitos";
      inputCodigo.setCustomValidity(spanError.textContent);
      return;
    }

    spanError.textContent = "";
    inputCodigo.setCustomValidity(""); // sin esto, el campo queda inválido para siempre
    ```

!!! failure "❌ Fallo 54 — se pasa el elemento `<span>`, no el mensaje"
    ```js
    inputEdad.setCustomValidity(spanError);   // ❌ un elemento, no un string
    ```
    🧠 **Lección:** el argumento es siempre un string.

!!! failure "❌ Fallo 61 — lo mismo, en otro ejercicio del mismo día"
    ```js
    inputCodigo.setCustomValidity(spanError);   // ❌ un elemento, no un string
    ```
    🧠 **Lección:** el argumento es siempre un string.

!!! danger "Pregunta obligatoria antes de escribirlo"
    **"Lo que le estoy pasando, ¿es texto o es un elemento?"**
    `setCustomValidity()` solo existe en `input`/`select`/`textarea`, y su único argumento válido es un string. Un string vacío `""` significa "válido"; cualquier otro texto significa "inválido, y este es el motivo".

!!! warning "Reincidencia 21/09 — tres formas más de fallar con `setCustomValidity`"
    - **Leer antes de escribir:** `inputEdad.setCustomValidity(spanError.textContent)` con el span aún vacío pasa `""`, que significa "válido". Escribe el texto (o guárdalo en una `const mensaje`) y úsalo en los dos sitios.
    - **Marcar el campo equivocado:** el que se marca y se limpia es el que señala el enunciado (`confirmarEmail`, no `email`), y el mismo en las dos ramas.
    - **Cada rama toca los dos estados:** lo que ve el usuario (el `<span>`) y la validez del campo. Un `" "` en el span pasa un test flojo, pero no muestra nada.

!!! warning "Reincidencia 26/09 — la rama válida no vaciaba el span"
    En `validarRangoNumerico` la rama válida solo hacía `setCustomValidity("")` y el mensaje del valor anterior se quedaba en pantalla. Es el tercer punto de arriba: **cada rama deja los dos estados completos**, sin depender de lo que hubiera antes.

📖 Teoría: [Formularios y validación](/js/04-dom/03-eventos/03-pagina-formularios/)

---

### 3. `x++` dentro de una expresión que se reasigna

!!! success "✅ Versión correcta"
    ```js
    // Suma simple, sin efecto secundario que pueda pisarse
    contador = Math.min(limite, contador + 1);
    ```

!!! failure "❌ Fallo 56 — el contador queda CONGELADO, nunca sube"
    ```js
    contador = Math.min(limite, contador++);   // ❌ contador++ devuelve el valor VIEJO
    ```
    🧠 **Lección:** `x++` devuelve el valor viejo y la asignación lo pisa.

Traza paso a paso de por qué:

| Paso | Qué pasa |
|---|---|
| 1 | `contador` vale `3` |
| 2 | `contador++` **devuelve `3`** (el valor viejo) y de paso pone `contador` a `4` |
| 3 | `Math.min(5, 3)` → `3` |
| 4 | `contador = 3` ← **la asignación pisa el `4` del paso 2** |

!!! tip "Regla corta"
    `x++` devuelve el valor **viejo**. `++x` devuelve el **nuevo**. Y si el resultado de la expresión se vuelve a asignar a esa misma variable, **no uses ninguno de los dos**: usa `x + 1`.

📖 Teoría: [Operadores](/js/01-basico/02-operadores/) · [Math](/js/01-basico/01-variables-tipos/)

---

## 🟠 Nivel 2 — El clúster "todo lo que sale del DOM es texto"

La raíz: el DOM devuelve strings, no los tipos que parecen.

### 4. `dataset` y `getAttribute()` siempre devuelven string

!!! success "✅ Versión correcta"
    ```js
    // Números: convertir antes de comparar
    if (Number(x.dataset.stock) === 0) { }

    // "Booleanos": comparar contra el STRING exacto
    faq.setAttribute("aria-expanded", expansion === "false");
    ```

!!! failure "❌ Fallo 43 — `data-stock=\"0\"` devuelve `\"0\"` (texto), nunca `0` (número)"
    ```js
    if (x.dataset.stock === 0) { }   // ❌ nunca entra
    ```
    🧠 **Lección:** `dataset` siempre devuelve string.

!!! failure "❌ Fallo 53 — `!expansion` sobre un string"
    ```js
    faq.setAttribute("aria-expanded", !expansion);   // ❌ !"false" → false, siempre
    ```
    🧠 **Lección:** `"false"` es un string no vacío, es *truthy*.

!!! failure "❌ Fallo 53 — string contra booleano"
    ```js
    faq.setAttribute("aria-expanded", expansion === false);   // ❌ string vs booleano → false, siempre
    ```
    🧠 **Lección:** `aria-expanded="false"` es el TEXTO `"false"`; se compara contra el string.

!!! danger "Por qué `!expansion` no funciona nunca"
    `!` sobre un string comprueba si está **vacío**, no lo que el texto significa. `"true"` y `"false"` son ambos strings no vacíos → `!expansion` da `false` en los dos casos. El texto `"false"` es *truthy*.

!!! warning "Reincidencia 26/09 — `getAttribute` en el acordeón"
    - `getAttribute("aria-expanded") === true` compara el string `"true"` con un booleano: siempre `false`.
    - `if(abierto)` con `abierto = getAttribute("aria-expanded")` **siempre entra**: `"false"` es un string no vacío, así que es *truthy*. Además `getAttribute` recibe un solo argumento; el segundo se ignora.
    - La comparación correcta es contra el texto: `=== "true"`.
    - En `alternarDetalleAccesible` volvió las dos veces: guardar `getAttribute(...)` sin convertir y `=== true`. Pregunta antes de comparar: **«¿es un texto o un booleano lo que comparo?»**

📖 Teoría: [Manipulación del DOM](/js/04-dom/02-manipulacion/)

---

## 🟡 Nivel 3 — Estado: dónde vive cada variable

### 7. Acumulador declarado fuera del bucle o del listener

Cuatro fallos con el mismo mecanismo: leer o declarar el estado **una sola vez**, cuando debería refrescarse en cada vuelta.

!!! success "✅ Versión correcta"
    ```js
    // Dentro del bucle: se reinicia en cada vuelta
    contenedor.querySelectorAll(".item").forEach(x => {
      let son = false;
      if (x.dataset.nombre.includes(item)) son = true;
      x.classList.toggle("hidden", !son);
    });

    // Dentro del listener: se lee fresco en cada disparo
    botonMas.addEventListener("click", () => {
      let contador = Number(spanCantidad.dataset.cantidad);
      contador = Math.min(limite, contador + 1);
      spanCantidad.dataset.cantidad = contador;   // escribir SIEMPRE los dos
      spanCantidad.textContent = `${contador}`;
    });
    ```

!!! failure "❌ Fallo 57 — `son` se comparte entre TODOS los ítems"
    ```js
    let son = false;   // ❌ fuera del bucle: arrastra el resultado del anterior
    contenedor.querySelectorAll(".item").forEach(x => {
      if (x.dataset.nombre.includes(item)) son = true;
    });
    ```
    🧠 **Lección:** lo que se reinicia en cada vuelta va dentro.

!!! failure "❌ Fallo 56 — leído UNA vez, fuera de un listener que se dispara muchas veces"
    ```js
    let contador = Number(spanCantidad.dataset.cantidad);   // ❌ se lee una sola vez
    botonMas.addEventListener("click", () => { /* contador ya está desfasado */ });
    ```
    🧠 **Lección:** lo que cambia en cada evento se lee dentro del listener.

!!! danger "La pregunta que lo detecta"
    **"¿Esta variable debe reiniciarse en cada vuelta / en cada click?"**
    Si la respuesta es sí, va **dentro**. Una variable declarada fuera de un bucle solo tiene sentido si acumula a través de todas las vueltas a propósito (una suma total, un contador global).

---

### 8. Dos ramas de lógica, una sola variable

!!! success "✅ Versión correcta"
    ```js
    let todasMarcadas = true; // valor NEUTRO, no heredado

    forEach(x => {
      if (e.target === master) {
        x.checked = master.checked;   // "forzar" → leer el elemento real, ahora
      } else {
        if (!x.checked) todasMarcadas = false;  // "acumular" → variable local
      }
    });
    ```

!!! failure "❌ Fallo 58 — el acumulador arranca heredando el estado del maestro"
    ```js
    let todasMarcadas = master.checked;                   // ❌ valor heredado
    forEach(x => {
      if (e.target === master) x.checked = todasMarcadas; // rama A usa la variable...
      else if (!x.checked) todasMarcadas = false;         // ...que la rama B modifica
    });
    ```
    🧠 **Lección:** cada rama, su propia fuente de verdad.

!!! tip "Forzar vs. acumular"
    - **Forzar** un valor → leer el elemento **real** en ese momento (`master.checked`).
    - **Acumular** un resultado → variable local que arranca en su **valor neutro** (`true` para "todos", `0` para un contador) y que solo toca ese bucle.

---

## 🟢 Nivel 4 — Falsos amigos de la API

### 10. Los tres `contains()`

Mismo nombre, tres sitios distintos, tres argumentos distintos:

| Llamada | Pregunta que responde | Argumento |
|---|---|---|
| `elemento.contains(nodo)` | ¿Este **nodo** está dentro de mí? | Un nodo del DOM |
| `elemento.classList.contains(clase)` | ¿Tengo esta **clase** puesta? | Un string, sin punto |
| `texto.includes(sub)` | ¿Este **string** contiene ese trozo? | Un string |

!!! success "✅ Versión correcta"
    ```js
    // Click fuera de un contenedor → Element.contains(nodo)
    if (menu.contains(e.target)) return;

    // Búsqueda de texto → String.includes()
    if (x.dataset.nombre.toLowerCase().includes(item)) { }
    ```

!!! failure "❌ Fallo 55 — `classList.contains()` con un nodo"
    ```js
    if (menu.classList.contains(e.target)) return;   // ❌ classList.contains recibe un nombre de clase
    ```
    🧠 **Lección:** para «¿este nodo está dentro?» es `menu.contains(e.target)`.

!!! failure "❌ Fallo 57 — `.contains()` no existe en strings"
    ```js
    if (x.dataset.nombre.toLowerCase().contains(item)) { }   // ❌ en strings es includes()
    ```
    🧠 **Lección:** cada tipo tiene su método.

!!! warning "21/09 — `includes` con los papeles al revés"
    `a.includes(b)` pregunta **"¿`a` contiene entero a `b`?"**. `"0123456789".includes("12345")` es `true` (es un trozo seguido) y `"0123456789".includes("13579")` es `false`, aunque los dos sean dígitos. Para "¿todos los caracteres son dígitos?" hay que preguntar **carácter a carácter**: `codigo.split("").every(c => digitos.includes(c))`. Y `Element.contains(nodo)` es `true` también para el propio nodo (`boton.contains(boton)`).

!!! warning "26/09 — `contains` con los papeles al revés en el dropdown"
    ```js
    // ❌ "¿lo clicado contiene al botón?" — se pregunta al revés
    if (e.target.contains(boton) || e.target.contains(menu)) return
    ```
    `A.contains(B)` pregunta **"¿`B` está dentro de `A`?"**: el contenedor es `boton`/`menu` y el nodo buscado es `e.target`. Al revés, el clic en un `<li>` del menú cerraba el menú, y un clic en `body` (que contiene los dos) nunca lo cerraba. Correcto: `boton.contains(e.target)` y `menu.contains(e.target)`.

!!! warning "26/09 — `classList.contains` con un nodo (fallo 55, otra vez)"
    En el popover se escribió `boton.classList.contains(e.target)`: `classList.contains` recibe un **nombre de clase**, no un nodo, y devuelve siempre `false` sin lanzar error. Para «¿este nodo está dentro del botón?» es `boton.contains(e.target)`, sin `classList` en medio.

---

### 11. Un elemento no es el valor que contiene

!!! success "✅ Versión correcta"
    ```js
    // Colección: querySelectorAll, no el contenedor
    contenedorTabla.querySelectorAll("tr").forEach(...);

    // Valor: leerlo primero
    if (Number(spanCantidad.textContent) < limite) { }

    // El elemento real es e.target (o se busca con querySelector)
    if (e.target.checked) { }
    ```

!!! failure "❌ Fallo 42 — un contenedor no es una colección iterable"
    ```js
    contenedorTabla.forEach(...);   // ❌
    ```
    🧠 **Lección:** el contenedor es dónde buscas; la colección, lo que encuentras.

!!! failure "❌ Fallo 46 — un `<span>` no es un número"
    ```js
    if (spanCantidad < limite) { }   // ❌
    ```
    🧠 **Lección:** el valor se lee con `.textContent`, `.value`, `.checked` o `.dataset.X`.

!!! failure "❌ 26/09 — un booleano (lo que devuelve `matches`) no es el checkbox"
    ```js
    const esMaestro = e.target.matches("#check-maestro-repaso")
    if (esMaestro.checked) { }   // ❌ undefined: .checked es del elemento, no del booleano
    ```
    🧠 **Lección:** `matches()` devuelve un booleano, nunca el elemento.

!!! tip "Antes de operar sobre algo del DOM"
    Pregunta: **"¿tengo el elemento, o tengo su valor?"** Para el valor hay que pasar siempre por `.textContent`, `.value`, `.checked` o `.dataset.X`. Para iterar hay que pasar siempre por `querySelectorAll()`: el contenedor es **dónde buscas**, la colección es **lo que encuentras**. Y `matches()` devuelve un booleano, nunca el elemento.

---

### 12. Calcular algo y no usar el resultado

Tres veces el mismo día (y volvió el 26/09). JS calcula el valor y lo tira, sin ningún aviso.

!!! success "✅ Versión correcta"
    ```js
    box.checked = todos;                     // asigna con =
    if (x.classList.contains("hidden")) { }  // la pregunta va dentro de un if
    x.checked = e.target.checked;            // asignación, no comparación
    ```

!!! failure "❌ Fallo 42 — compara y descarta (era una asignación)"
    ```js
    box.checked === todos;   // ❌ era una asignación: =
    ```
    🧠 **Lección:** `===` pregunta, `=` cambia.

!!! failure "❌ Pregunta y descarta"
    ```js
    x.classList.contains("hidden");   // ❌ faltaba el if
    ```
    🧠 **Lección:** un `contains()` suelto no hace nada.

!!! failure "❌ Ternario suelto"
    ```js
    condicion ? algo : otro;   // ❌ no asigna a nada
    ```
    🧠 **Lección:** el ternario produce un valor; hay que guardarlo o devolverlo.

!!! failure "❌ 26/09 — compara dentro del `forEach` del maestro"
    ```js
    x.checked === e.target.checked   // ❌ compara y no cambia nada
    ```
    🧠 **Lección:** dentro del `forEach` del maestro hay que asignar.

!!! danger "Antes de dar una línea por terminada"
    **"¿Esta línea asigna con `=`, hace `return`, o llama a algo que muta el DOM?"**
    Si no hace ninguna de las tres, esa línea **no hace nada**.

---

## 🆕 Nuevos patrones — 25/08

### 14. Negar una expresión compuesta (`&&`/`||`) — De Morgan

Ahora mismo el patrón más urgente: dos vueltas seguidas en el mismo ejercicio.

!!! success "✅ Versión correcta"
    ```js
    // Armar primero la versión en POSITIVO, calcada de la pregunta real
    const entra = titulo && (estado || todos);
    e.classList.toggle("hidden", !entra);   // negar el resultado UNA sola vez, al final
    ```

!!! failure "❌ Fallo 64 — negar `A && (B || C)` término por término, sin invertir los operadores"
    ```js
    e.classList.toggle("hidden", !todos && (!titulo || !estado));   // ❌
    ```
    🧠 **Lección:** no se redistribuye el `!` por los términos sueltos.

!!! danger "Regla corta"
    Negar `A && (B || C)` NO es `!A && (!B || !C)` — hay que invertir también los operadores (`!A || (!B && !C)`). Es fácil de errar a mano. Antes de escribir un `!` sobre una expresión con `&&`/`||` por dentro: armar primero la versión en positivo, en una variable con nombre claro, y negarla entera una sola vez al final — nunca redistribuir el `!` por los términos sueltos.

📖 Teoría: [Operadores](/js/01-basico/02-operadores/)

---

### 15. Elegir el elemento correcto para un listener "global"

!!! success "✅ Versión correcta"
    ```js
    // document ve clics de toda la página
    document.addEventListener('click', (e) => { ... });
    ```

!!! failure "❌ Fallo 63 — solo ve clics DENTRO del propio botón"
    ```js
    botonAbrir.addEventListener('click', (e) => { ... });   // ❌
    ```
    🧠 **Lección:** un listener «global» va en `document`.

!!! tip "Pregunta antes de escribirlo"
    "¿Este listener necesita reaccionar a clics de CUALQUIER parte de la página, o solo de este elemento puntual?" Si es lo primero, va en `document` — enganchado en un elemento chico, el resto de la página queda ciego para ese listener.

---

### 16. `insertBefore(nodoAMover, referencia)` — revisar el orden cada vez

!!! success "✅ Versión correcta"
    ```js
    // Mover al hermano ANTES del item lo empuja un lugar hacia abajo
    lista.insertBefore(hermano, item);
    ```

!!! failure "❌ Fallo 65 — `item` ya está inmediatamente antes de `hermano`: no-op"
    ```js
    lista.insertBefore(item, hermano);   // ❌
    ```
    🧠 **Lección:** decir en voz alta qué nodo se mueve y antes de cuál queda.

!!! warning "Ya se había dominado el 23/08 (Fallo 48) y volvió a fallar"
    Antes de llamar `insertBefore`, decir en voz alta qué nodo se mueve y antes de cuál queda — si el nodo que se mueve ya está exactamente ahí, la llamada es un no-op.

---

## 🆕 Nuevos patrones — 21/09

### 17. Un listener se registra una sola vez, fuera de cualquier otro handler

!!! success "✅ Versión correcta"
    ```js
    // Dos listeners, los dos fuera. Cierra solo si el click no está en el menú NI en el botón
    boton.addEventListener("click", () => menu.classList.toggle("hidden"))

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !boton.contains(e.target)) menu.classList.add("hidden")
    })
    ```

!!! failure "❌ 21/09 — un listener dentro de otro handler"
    ```js
    // El click que abre el menú burbujea a document y ejecuta el listener recién registrado
    boton.addEventListener("click", () => {
      menu.classList.toggle("hidden")
      document.addEventListener("click", (e) => { /* ... */ })   // ❌
    })
    ```
    🧠 **Lección:** un listener se registra una sola vez, fuera de cualquier otro handler.

!!! danger "Dos preguntas antes de escribirlo"
    1. **"¿Este `addEventListener` está dentro de otro handler?"** Sácalo: cada click al botón registraría uno más, y el click que abre también burbujea hasta `document`.
    2. **"¿Cierro cuando está fuera de A *y* de B?"** Es `!A && !B`, nunca `!A || B` (De Morgan, como en el nº 14).

---

## 🆕 Nuevos patrones — 26/09

### 18. ¿Quién llama a mi función, y cuándo?

Dos ejercicios del mismo día pedían cosas opuestas y el enunciado no lo decía:

| Ejercicio | El test hace… | Entonces la función… |
|---|---|---|
| `validarRangoNumerico` | pone el valor, llama a `fn(...)` y **comprueba enseguida** | valida **al llamarla**; el listener lo pone quien la llama (la demo) |
| `activarSeleccionGrid` | llama a `fn(...)` y **después** dispara eventos `change` | **se engancha** a los eventos |

!!! success "✅ Versión correcta"
    ```js
    // Checkboxes y selects: el cambio lo dispara "change"
    contenedor.addEventListener("change", (e) => { /* ... */ })
    ```

!!! failure "❌ 26/09 — el test dispara `change`, no `click`"
    ```js
    contenedor.addEventListener("click", (e) => { /* ... */ })   // ❌ el handler nunca se ejecutaba
    ```
    🧠 **Lección:** hay que saber qué evento dispara el cambio.

!!! danger "Dos preguntas antes de escribirlo"
    1. **"¿Quién llama a mi función y cuándo: antes o después de que ocurra el cambio?"**
    2. **"¿Qué evento dispara el cambio?"** En checkboxes y selects es `change` (cubre también el teclado); `click` es para botones.

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
- [ ] ¿Algún `addEventListener` está dentro de otro handler? Sácalo: se registra una sola vez.
- [ ] Con `setCustomValidity`, ¿marco y limpio el campo que señala el enunciado, y escribo el texto antes de leerlo?

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
