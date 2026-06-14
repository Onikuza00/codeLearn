# 01.06 Twig Component vs Live Component

## Comparativa directa

| | Twig Component | Live Component |
|---|---|---|
| Renderizado | 1 vez en el servidor | Se re-renderiza por AJAX |
| Interactividad | No tiene | Sí (`data-model`, `data-action`) |
| Atributo PHP | `#[AsTwigComponent]` | `#[AsLiveComponent]` + `use DefaultActionTrait` |
| Props writables | No | Sí con `#[LiveProp(writable: true)]` |
| Eventos servidor | No | Sí con `#[LiveAction]` |
| Uso típico | Cards, listas, headers | Buscadores, carritos, formularios |

## ¿Cuándo usar cuál?

| Situación | Usá |
|-----------|-----|
| Solo mostrás datos | Twig Component |
| No cambia después de cargar | Twig Component |
| Es una card, un badge, un footer | Twig Component |
| El usuario interactúa y necesita backend | Live Component |
| Es un buscador, carrito, formulario | Live Component |
| Validación en servidor | Live Component |

## En este ejercicio

**ImageCard es un Twig Component.** Se renderiza una vez y se queda estático. El zoom lo maneja Stimulus del lado del cliente, no necesita backend.

Si quisiéramos un botón de "Me gusta" que guarde en BD, ahí sí necesitaríamos Live Component.
