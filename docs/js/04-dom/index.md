# DOM { .section-dom .bloque-js }

> El árbol de objetos que el navegador construye a partir del HTML — el punto de entrada de JS para leer y cambiar lo que se ve en pantalla.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/CnOx3mgjliU" title="Manipulación del DOM — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Qué es el DOM {: .topic-title }

**DOM** (Document Object Model) es la representación en memoria de una página HTML como un árbol de nodos: cada etiqueta es un objeto con propiedades, métodos y eventos propios. El navegador construye este árbol cuando termina de cargar la página.

Todo el acceso al DOM arranca desde el objeto global `document`, que representa la página entera.

!!! warning "El DOM no existe hasta que la página termina de cargar"
    Si tu script intenta acceder a un elemento antes de que el navegador lo haya parseado, `document.querySelector(...)` devuelve `null` aunque el elemento SÍ esté en el HTML. Por eso los `<script>` van al final del `<body>`, o se usa `defer`/el evento `DOMContentLoaded`.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [Selección de elementos](01-seleccion/index.md) | `querySelector`, `getElementById`, `getElementsByClassName`/`TagName` |
| [Manipulación del DOM](02-manipulacion/index.md) | `textContent`/`innerHTML`, atributos, estilos, `classList`, crear/eliminar elementos |
| [Eventos](03-eventos/index.md) | `addEventListener`, objeto evento, propagación, delegación, ratón/teclado/página |
| [Formularios](04-formularios/index.md) | `form.elements`, `FormData`, `checkValidity`/`reportValidity`, `validity`, `setCustomValidity` |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Institut Montilivi — Apunts DOM** | https://apunts.institutmontilivi.cat/DAW-M0612/dom.html |
| 📖 **aprendejavascript.dev — DOM y eventos** | https://www.aprendejavascript.dev/clase/dom-y-eventos/seleccion-elementos |
