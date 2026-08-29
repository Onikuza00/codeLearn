# Manipulación del DOM { .bloque-js }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/CnOx3mgjliU" title="Manipulación del DOM — midudev" loading="lazy" allowfullscreen></iframe>
</div>

> Una vez que tienes la referencia al elemento (con `querySelector` y compañía), toca leer y cambiar lo que contiene, cómo se ve y de qué clases dispone.

---

## Contenido: `textContent` vs `innerHTML` {: .topic-title }

```js
const parrafo = document.querySelector('.mensaje');

parrafo.textContent = '<b>Hola</b>';   // se ve el texto literal "<b>Hola</b>"
parrafo.innerHTML = '<b>Hola</b>';     // se ve "Hola" en negrita — el navegador interpreta la etiqueta
```

| Usa `textContent` | Usa `innerHTML` |
|---|---|
| El contenido es texto plano | Necesitas insertar HTML de verdad (estructura, etiquetas) |
| El valor puede venir del usuario | El valor es fijo, escrito por ti en el código |
| Quieres el camino más rápido (sin parseo de HTML) | La complejidad del HTML justifica el coste |

!!! danger "innerHTML con datos del usuario abre la puerta a XSS"
    ```js
    // ❌ peligroso: si nombreUsuario contiene <img src=x onerror="robarCookies()">, se EJECUTA
    perfil.innerHTML = `Hola, ${nombreUsuario}`;

    // ✅ seguro: el navegador nunca interpreta el string como HTML
    perfil.textContent = `Hola, ${nombreUsuario}`;
    ```
    Si el contenido puede venir de un formulario, una URL o cualquier fuente externa, `innerHTML` deja que ese contenido inserte y ejecute sus propias etiquetas (`<script>`, manejadores `onerror`, etc.). `textContent` lo trata siempre como texto, nunca como marcado.

---

## Atributos {: .topic-title }

```js
const enlace = document.querySelector('a');

enlace.getAttribute('href');              // leer
enlace.setAttribute('href', '/nueva-url'); // escribir
enlace.hasAttribute('target');             // comprobar si existe
enlace.removeAttribute('target');          // eliminar
```

Para los atributos más comunes hay un atajo directo como propiedad del elemento, sin pasar por `getAttribute`/`setAttribute`:

| Propiedad | Ejemplo |
|---|---|
| `value` | `input.value` |
| `checked` | `checkbox.checked = true` |
| `disabled` | `boton.disabled = true` |
| `placeholder` | `input.placeholder = 'Escribe tu nombre'` |
| `href` | `enlace.href = '/nueva-url'` |
| `src` / `alt` | `imagen.src` / `imagen.alt` |
| `id` | `elemento.id = 'destacado'` |
| `title` | `elemento.title` |
| `type` | `input.type` |
| `selected` | `opcion.selected = true` (en un `<option>`) |

!!! tip "Los atributos `aria-*` no tienen propiedad directa — siempre `setAttribute`"
    Los atributos de accesibilidad (`aria-expanded`, `aria-hidden`, `aria-selected`...) comunican a lectores de pantalla el estado de un elemento — no cambian nada visual por sí solos, es responsabilidad del CSS/JS reflejar ese mismo estado (ej. mostrar/ocultar con `classList`) en paralelo.

    ```js
    boton.setAttribute('aria-expanded', 'true');   // string 'true', no el booleano true
    boton.getAttribute('aria-expanded');            // 'true' o 'false', siempre string
    ```

    No existe un atajo como `boton.ariaExpanded` que funcione de forma fiable entre navegadores — siempre `setAttribute`/`getAttribute`, y siempre con el string `'true'`/`'false'`, nunca el booleano.

!!! warning "value como propiedad y como atributo NO siempre coinciden"
    ```html
    <input type="text" value="valor inicial">
    ```
    ```js
    input.getAttribute('value'); // 'valor inicial' — SIEMPRE lo que puso el HTML, aunque el usuario haya escrito otra cosa
    input.value;                  // lo que hay AHORA en el campo — cambia mientras el usuario escribe
    ```
    `getAttribute('value')` lee el atributo original del HTML, congelado en el tiempo. La propiedad `.value` refleja el estado real y actual del campo. Para leer lo que el usuario escribió, siempre `.value` — nunca `getAttribute`.

---

## Atributos personalizados: `dataset` {: .topic-title }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/eDu4xfnHa5w" title="Cómo recuperar datos de los elementos HTML — midudev" loading="lazy" allowfullscreen></iframe>
</div>

Cualquier atributo con prefijo `data-` guarda información propia, invisible en pantalla pero accesible desde JS a través de `dataset` — sin pasar por `getAttribute`.

```html
<div class="tarjeta" data-nombre="Miguel" data-edad="25"></div>
```

```js
const tarjeta = document.querySelector('.tarjeta');

tarjeta.dataset.nombre; // 'Miguel' — sin el prefijo "data-"
tarjeta.dataset.edad;   // '25' — siempre como string

// equivalente, más largo:
tarjeta.getAttribute('data-nombre');
```

!!! tip "data-mi-atributo se convierte en dataset.miAtributo"
    Igual que con `style`, los nombres con guiones se convierten a camelCase: `data-modalidad-trabajo` en el HTML pasa a ser `dataset.modalidadTrabajo` en JS.

---

## Estilos {: .topic-title }

```js
elemento.style.backgroundColor = 'red';   // camelCase — background-color → backgroundColor
elemento.style.borderRadius = '8px';
```

!!! warning "Las propiedades CSS con guion se escriben en camelCase"
    ```js
    elemento.style.border-color = 'red'; // ❌ SyntaxError — el guion se interpreta como una resta
    elemento.style.borderColor = 'red';  // ✅ correcto
    ```
    Si el nombre de la propiedad es dinámico (una variable), usa notación de corchetes: `elemento.style['border-color'] = 'red'` también funciona, porque ahí el guion está dentro de un string, no en el código.

---

## Clases: `classList` {: .topic-title }

La forma recomendada de tocar clases — evita reconstruir el string completo de `className` a mano.

```js
elemento.classList.add('activo');
elemento.classList.add('activo', 'destacado');   // varias a la vez

elemento.classList.remove('activo');              // no falla si la clase no existe

elemento.classList.toggle('activo');              // la quita si está, la pone si no está

elemento.classList.contains('activo');            // true / false

elemento.classList.replace('activo', 'inactivo'); // sustituye una por otra
```

!!! danger "`classList.add()` no acepta un string con varias clases separadas por espacio"
    Cada argumento de `.add()`/`.remove()`/`.toggle()` es UN token, y un token no puede contener espacios. Esto explota especialmente al maquetar con Tailwind, donde es habitual querer aplicar varias utilidades de una — `flex`, `flex-col`, `gap-2` — de golpe:

    ```js
    elemento.classList.add('flex flex-col gap-2'); // ❌ SyntaxError: el token contiene espacios

    elemento.classList.add('flex', 'flex-col', 'gap-2'); // ✅ un argumento por clase
    elemento.className = 'flex flex-col gap-2';          // ✅ className SÍ acepta el string completo
    ```

    `className` sustituye TODO el atributo `class` de una vez (borra lo que hubiera antes); `classList.add()` suma clases sin tocar las que ya estaban. Elegí según si querés reemplazar o acumular.

!!! tip "`toggle()` es el patrón típico de un interruptor"
    ```js
    boton.addEventListener('click', () => {
        panel.classList.toggle('visible');
    });
    ```
    Una sola línea reemplaza el `if (tiene la clase) quitarla; si no, ponerla` — `toggle()` ya decide eso por ti.

!!! danger "`toggle()` sin segundo argumento invierte lo que YA HABÍA, no fuerza tu condición"
    ```js
    // ❌ dos clicks seguidos con la MISMA categoría dan resultados distintos,
    // porque toggle() no mira tu condición, mira si la clase ya estaba puesta
    productos.forEach(p => {
      if (p.dataset.categoria === categoria) p.classList.toggle('hidden');
    });

    // ✅ segundo argumento: un booleano que FUERZA el resultado
    // true  → la clase queda puesta (la agrega si no estaba)
    // false → la clase queda quitada (la saca si estaba)
    productos.forEach(p => {
      const coincide = p.dataset.categoria === categoria;
      p.classList.toggle('hidden', !coincide);
    });
    ```
    Sin el segundo argumento, `toggle()` decide solo mirando el estado ACTUAL de la clase — ideal para un interruptor simple (un solo click, un solo cambio). Pero si el resultado depende de una condición que podés evaluar de nuevo en cada llamada (¿coincide con el filtro?, ¿está seleccionado?), hace falta forzarlo con el booleano — si no, repetir la misma acción puede revertir un resultado que ya era correcto.

---

## Crear e insertar elementos {: .topic-title }

Crear un nodo es un paso separado de insertarlo en el DOM — hasta que no lo insertas, no se ve en pantalla.

```js
const nuevo = document.createElement('li');
nuevo.textContent = 'Tarea nueva';

lista.appendChild(nuevo);                  // lo añade al final
lista.insertBefore(nuevo, lista.firstChild); // lo añade al principio, antes de una referencia
```

`insertAdjacentHTML` inserta HTML directamente en una posición concreta relativa al elemento, sin crear el nodo aparte:

```js
lista.insertAdjacentHTML('beforeend', '<li>Tarea nueva</li>');
```

| Posición | Dónde inserta |
|---|---|
| `beforebegin` | Antes del propio elemento |
| `afterbegin` | Dentro del elemento, como primer hijo |
| `beforeend` | Dentro del elemento, como último hijo |
| `afterend` | Después del propio elemento |

---

## Reemplazar elementos {: .topic-title }

```js
const nuevo = document.createElement('p');
nuevo.textContent = 'Párrafo nuevo';

const antiguo = document.querySelector('.antiguo');
antiguo.parentElement.replaceChild(nuevo, antiguo); // (nodo nuevo, nodo a sustituir)
```

!!! tip "Si el nodo nuevo ya existía en el DOM, se mueve en vez de duplicarse"
    Un nodo solo puede estar en un sitio del DOM a la vez. Si pasas a `replaceChild()` un elemento que ya estaba en otra parte de la página (en vez de uno recién creado con `createElement()`), el navegador lo **desplaza** desde su posición original hasta el hueco que deja el nodo sustituido — no lo clona.

---

## Eliminar elementos {: .topic-title }

```js
elemento.remove();                    // el propio elemento se borra a sí mismo

lista.removeChild(elemento);          // o el padre borra a un hijo concreto
```

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Institut Montilivi — Apunts DOM** | https://apunts.institutmontilivi.cat/DAW-M0612/dom.html |
| 📖 **aprendejavascript.dev — Manipulación del DOM** | https://www.aprendejavascript.dev/clase/dom-y-eventos/manipulacion-dom |
