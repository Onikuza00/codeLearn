# Observers { .bloque-js }

> Los *observers* son APIs del navegador que avisan cuando algo cambia, en lugar de que tú preguntes constantemente. Sustituyen a los eventos `scroll` y `resize` con dos ventajas: no bloquean el hilo principal y no se disparan cientos de veces por segundo.

---

## El problema que resuelven {: .topic-title }

```js
// ❌ el patrón viejo
window.addEventListener('scroll', () => {
    const rect = elemento.getBoundingClientRect();   // fuerza recálculo de estilos
    if (rect.top < window.innerHeight) { ... }
});
```

Ese listener se dispara **decenas de veces por segundo**, y cada `getBoundingClientRect()` obliga al navegador a recalcular la posición de los elementos en ese instante. Con varios elementos vigilados, el scroll se vuelve pesado.

Los *observers* le dan la vuelta: **el navegador te avisa cuando pasa algo**, de forma asíncrona y sin bloquear el pintado.

## `IntersectionObserver` {: .topic-title }

Avisa cuando un elemento **entra o sale** de la pantalla (o de un contenedor).

```js
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.target);   // una sola vez
        }
    });
}, {
    root: null,             // null = la ventana
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.25,        // avisa cuando el 25 % es visible
});

document.querySelectorAll('.animar').forEach((el) => observador.observe(el));
```

| Opción | Qué hace |
|---|---|
| `root` | Contra qué se compara. `null` es la ventana |
| `rootMargin` | Agranda o encoge esa zona. Valores negativos disparan **más tarde** |
| `threshold` | Qué porcentaje debe verse. Acepta un array: `[0, 0.5, 1]` |

**Para qué se usa:** animaciones al hacer scroll, carga diferida de contenido, scroll infinito, saber qué sección está activa en un menú.

!!! tip "`rootMargin` es lo que hace útil el scroll infinito"
    Con un `rootMargin: '0px 0px 400px 0px'` sobre un centinela al final de la lista, el navegador avisa **400 px antes** de que llegue a la pantalla. Da tiempo a cargar la página siguiente y el usuario nunca ve el hueco.

!!! warning "El callback se dispara una vez al empezar a observar"
    En cuanto llamas a `observe()`, el observador reporta el estado inicial del elemento, esté o no en pantalla. Si tu callback asume que solo se llama al cruzar el umbral, actuará de más nada más cargar la página. Se comprueba siempre `entrada.isIntersecting`.

## `ResizeObserver` {: .topic-title }

Avisa cuando **un elemento** cambia de tamaño — no la ventana, el elemento.

```js
const observador = new ResizeObserver((entradas) => {
    for (const entrada of entradas) {
        const { width } = entrada.contentRect;
        entrada.target.classList.toggle('estrecho', width < 400);
    }
});

observador.observe(document.querySelector('.tarjeta'));
```

Un `window.addEventListener('resize')` no sirve para esto: un elemento puede cambiar de tamaño porque cambió su contenido, porque se abrió un panel lateral o porque su contenedor flex se reorganizó, sin que la ventana se toque.

!!! tip "Es el equivalente en JS de las container queries"
    Cuando el diseño solo depende del **ancho del componente**, lo primero es CSS con `@container`. `ResizeObserver` es para cuando además hace falta lógica en JavaScript: recalcular un gráfico, reposicionar un tooltip, decidir cuántos elementos caben.

!!! danger "Error «ResizeObserver loop completed with undelivered notifications»"
    Aparece cuando el callback **modifica el tamaño** del elemento que está observando: el cambio dispara otra notificación, que vuelve a cambiar el tamaño, y así.

    La solución es no escribir estilos que afecten al tamaño observado dentro del callback, o aplazar el cambio con `requestAnimationFrame()`.

## `MutationObserver` {: .topic-title }

Avisa cuando **cambia el DOM**: se añaden o quitan nodos, cambia un atributo, cambia el texto.

```js
const observador = new MutationObserver((mutaciones) => {
    for (const m of mutaciones) {
        if (m.type === 'childList') { ... }
        if (m.type === 'attributes') { console.log(m.attributeName); }
    }
});

observador.observe(contenedor, {
    childList: true,      // hijos añadidos o eliminados
    subtree: true,        // y los de sus descendientes
    attributes: true,
    attributeFilter: ['class', 'data-estado'],
    characterData: false,
});
```

**Para qué se usa:** reaccionar a contenido que inserta un script de terceros, mantener sincronizado algo con un DOM que no controlas, detectar cuándo aparece un elemento inyectado.

!!! warning "Es el último recurso, no el primero"
    Si el código que modifica el DOM es tuyo, **avisa desde ahí**: un evento personalizado, una llamada directa, un cambio de estado. `MutationObserver` es para cuando **no controlas** quien cambia el DOM.

    Y `subtree: true` sobre un contenedor grande genera muchísimas notificaciones. Se acota siempre lo máximo posible con `attributeFilter` y observando el nodo más pequeño que sirva.

## Lo que comparten los tres {: .topic-title }

```js
observador.observe(elemento);     // empezar a vigilar
observador.unobserve(elemento);   // dejar de vigilar uno
observador.disconnect();          // dejar de vigilar todo
```

!!! danger "Un observador que no se desconecta es una fuga de memoria"
    El observador mantiene una referencia a los elementos que vigila. Si esos elementos se eliminan del DOM pero el observador sigue vivo, **no se liberan nunca**.

    En una aplicación de una sola página, cada componente que crea un observador tiene que llamar a `disconnect()` al desmontarse. Y cuando la animación de entrada solo debe ocurrir una vez, `unobserve()` dentro del propio callback.

## Cuál usar {: .topic-title }

| Quiero saber… | Observer |
|---|---|
| Si algo está visible en pantalla | **`IntersectionObserver`** |
| Si un elemento cambió de tamaño | **`ResizeObserver`** |
| Si el DOM cambió | **`MutationObserver`** |
| Si la ventana cambió de tamaño | El evento `resize`, con *throttle* |

!!! tip "La carga diferida de imágenes ya no necesita observer"
    Para eso está el atributo nativo: `<img loading="lazy">`. Lo hace el navegador, mejor y sin JavaScript. `IntersectionObserver` se reserva para lo que el HTML no cubre.

---

## 📖 Recursos oficiales {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **MDN — Intersection Observer API** | [developer.mozilla.org/es/docs/Web/API/Intersection_Observer_API](https://developer.mozilla.org/es/docs/Web/API/Intersection_Observer_API) |
| 📘 **MDN — `ResizeObserver`** | [developer.mozilla.org/es/docs/Web/API/ResizeObserver](https://developer.mozilla.org/es/docs/Web/API/ResizeObserver) |
| 📘 **MDN — `MutationObserver`** | [developer.mozilla.org/es/docs/Web/API/MutationObserver](https://developer.mozilla.org/es/docs/Web/API/MutationObserver) |
