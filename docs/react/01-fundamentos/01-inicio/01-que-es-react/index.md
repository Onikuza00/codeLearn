# Qué es React y por qué { .section-react .bloque-react }

> React es una biblioteca de JavaScript para construir interfaces de usuario. En lugar de ordenar al navegador paso a paso qué cambiar en la página, describes cómo debe verse la interfaz en cada momento y React se encarga de actualizarla.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/sZ3g1UIdmeU" title="¿Qué es React? — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Qué es {: .topic-title }

**React** es una biblioteca de JavaScript creada por Facebook (hoy Meta) en 2013. Sirve para construir **interfaces de usuario**: la parte de la aplicación que el usuario ve y toca.

Su idea central son los **componentes reutilizables**. Es como un molde de LEGO: defines la pieza una vez y la usas tantas veces como necesites.

!!! info "Si vienes de Vue"
    Vue y React parten de la misma idea: interfaz declarativa y organizada en componentes. Cambia la sintaxis (`<template>` en Vue, JSX en React) y el alcance (ver más abajo).

---

## El problema del JavaScript puro {: .topic-title }

En un proyecto pequeño, JavaScript puro basta. Al crecer, manipular el **DOM** (el árbol de nodos de la página que JavaScript puede modificar) a mano se complica. Imagina un listado de empleos cargado desde un JSON, con filtros y un botón «Aplicar» en cada uno. Aparecen tres problemas:

| Problema | Qué ocurre |
|---|---|
| **Código repetitivo** | Cada empleo se crea a mano: `createElement`, clases, `innerHTML`, `appendChild`. Cambiar algo obliga a buscarlo por todo el código |
| **Estado manual** | Al aplicar hay que localizar el botón, cambiar su texto y sus clases. Con varios sitios que cambian, mantenerlo todo coherente es un caos |
| **Sincronización compleja** | Al filtrar hay que recorrer los elementos, leer atributos y alternar clases. Es fácil equivocarse |

---

## Imperativo frente a declarativo {: .topic-title }

Mismo botón «Aplicar» en dos enfoques.

**JavaScript puro (imperativo):** indicas *cómo*, paso a paso.

```js
const button = document.querySelector("#apply-button");
let isApplied = false;

button.addEventListener("click", () => {
    isApplied = !isApplied;
    button.textContent = isApplied ? "¡Aplicado!" : "Aplicar";
});
```

**React (declarativo):** indicas *qué* se ve según el estado.

```jsx
function ApplyButton() {
    const [isApplied, setIsApplied] = useState(false);

    return (
        <button onClick={() => setIsApplied(!isApplied)}>
            {isApplied ? "¡Aplicado!" : "Aplicar"}
        </button>
    );
}
```

En el primero actualizas el DOM tú mismo. En el segundo solo cambias el **estado** (el dato del que depende la interfaz) y React actualiza la pantalla.

!!! tip "Equivalencia con Vue"
    `useState` en React cumple el papel de `ref` en Vue: un dato reactivo del que depende lo que se pinta.

| En Vue | En React |
|---|---|
| Plantilla `<template>` con `v-if`, `{{ }}` | JSX: HTML dentro de JavaScript, con `{ }` |
| Estado con `ref` | Estado con `useState` |
| Declarativo y por componentes | Declarativo y por componentes |

---

## Biblioteca, no framework {: .topic-title }

- **Biblioteca:** ofrece herramientas para un problema concreto. En React, la interfaz.
- **Framework:** impone una estructura completa y reglas sobre cómo organizar el código.

React solo cubre la **capa de vista**. Enrutamiento, estado global, peticiones HTTP o animaciones se resuelven con otras librerías. Da flexibilidad, pero obliga a elegir.

!!! warning "React no trae router ni estado global"
    En Vue (framework progresivo) el router y el estado global tienen paquetes oficiales de referencia. En React tendrás que escoger tú esas piezas del ecosistema.

---

## Por qué aprenderlo {: .topic-title }

- **Demanda laboral:** muchas ofertas piden React.
- **Comunidad grande:** empresas como Facebook, Instagram, Netflix o Airbnb lo usan.
- **Ecosistema maduro:** buena documentación y muchas herramientas. Con **React Native** además se hacen apps móviles con conceptos parecidos.

!!! tip "Elegir React es una decisión práctica"
    El motivo para aprenderlo es la demanda y el ecosistema, no que sea «mejor» que las demás opciones.

## Alternativas {: .topic-title }

React no es la única opción: Vue, Angular, Svelte, Solid y Preact. Comparten conceptos (componentes, estado, props, reactividad), así que lo que aprendas se transfiere de una a otra.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| JSCamp (midudev) — ¿Qué es React? | <https://www.jscamp.dev/introduccion-a-react/por-que-react> |
| React — Inicio rápido | <https://es.react.dev/learn> |
| Vídeo de apoyo — «2 Que es React» | <https://www.youtube.com/watch?v=sZ3g1UIdmeU> |
