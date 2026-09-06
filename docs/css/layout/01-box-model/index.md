# Box model { .section-layout .bloque-css }

> Todo elemento de una página es una caja rectangular con cuatro capas. Cuánto ocupa esa caja depende de una propiedad que casi todo el mundo cambia en la primera línea de su CSS y luego olvida: `box-sizing`.

---

## Las cuatro capas {: .topic-title }

De dentro hacia fuera:

| Capa | Qué es |
|---|---|
| **`content`** | El contenido: texto, imagen, hijos |
| **`padding`** | Espacio interior. **Se pinta con el fondo** |
| **`border`** | El borde |
| **`margin`** | Espacio exterior. **Siempre transparente** |

La diferencia práctica entre `padding` y `margin`: el `padding` forma parte de la caja —el fondo y los eventos de ratón llegan hasta ahí— y el `margin` es hueco fuera de ella.

## `box-sizing`: la propiedad que lo cambia todo {: .topic-title }

```css
.caja { width: 300px; padding: 20px; border: 5px solid; }
```

¿Cuánto ocupa esa caja de ancho? Depende:

| `box-sizing` | El `width` mide | Ancho real |
|---|---|---|
| `content-box` (por defecto) | Solo el contenido | 300 + 40 + 10 = **350 px** |
| `border-box` | Contenido + padding + borde | **300 px** |

!!! danger "El valor por defecto es el que nadie quiere"
    Con `content-box`, añadir `padding` a un elemento lo hace **más grande**, y dos columnas de `width: 50%` con padding se salen del contenedor. Es una herencia de los primeros días de CSS que se mantiene por compatibilidad.

    Por eso prácticamente todos los proyectos empiezan con esto:

    ```css
    *, *::before, *::after {
        box-sizing: border-box;
    }
    ```

    Con `border-box`, `width: 300px` significa 300 px en pantalla, pase lo que pase con el padding. Es la primera línea de cualquier hoja de estilos moderna, y conviene saber por qué está ahí.

El `margin` **nunca** entra en el `width`, ni siquiera con `border-box`.

## Colapso de márgenes {: .topic-title }

Dos márgenes verticales adyacentes **no se suman: se funden en el mayor de los dos**.

```css
.arriba { margin-bottom: 30px; }
.abajo  { margin-top: 20px; }
/* La separación real es 30px, no 50px */
```

!!! warning "Ocurre en tres situaciones distintas"
    1. **Entre hermanos** — el caso de arriba.
    2. **Padre e hijo** — si el padre no tiene `padding` ni `border` arriba, el `margin-top` del hijo **se escapa fuera del padre** y lo empuja a él.
    3. **Caja vacía** — sus propios márgenes superior e inferior se funden.

    El segundo es el que más desconcierta: pones `margin-top` a un título y lo que se mueve es el contenedor entero.

**Cómo evitarlo cuando molesta:**

- `display: flex` o `grid` en el padre: dentro de un contenedor flex o grid **no hay colapso**. Es la razón práctica por la que `gap` es más predecible que `margin`.
- `padding: 1px` o `border` en el padre.
- `overflow: auto` o `display: flow-root` en el padre.

!!! tip "El colapso es solo vertical"
    Los márgenes horizontales nunca colapsan. Y tampoco colapsan los elementos flotantes, ni los posicionados en absoluto, ni los hijos de un flex o grid.

## Porcentajes: todos se calculan sobre el ancho {: .topic-title }

```css
.caja { padding-top: 10%; }   /* 10% del ANCHO del padre, no del alto */
```

!!! tip "Ese comportamiento raro tiene un uso"
    Es lo que permite el truco clásico de mantener una proporción fija: un `padding-top: 56.25%` da exactamente una relación 16:9 sea cual sea el ancho.

    Hoy existe `aspect-ratio: 16 / 9`, que hace lo mismo y se lee. Pero el truco viejo sigue apareciendo en código heredado y conviene reconocerlo.

## Alturas y anchos {: .topic-title }

| Propiedad | Para qué |
|---|---|
| `width` / `height` | Tamaño fijo o porcentual |
| `min-width` / `min-height` | Suelo: nunca menos que esto |
| `max-width` / `max-height` | Techo: nunca más que esto |

`min-*` y `max-*` **ganan** a `width`/`height`. El patrón responsive básico es `width: 100%; max-width: 1200px;`: ocupa todo lo disponible, pero nunca pasa de ahí.

!!! danger "`height: 100%` no funciona si el padre no tiene altura"
    Un porcentaje necesita algo sobre lo que calcularse. Si el padre tiene altura automática, el hijo no puede pedirle el 100 % de algo indefinido, y el navegador ignora la regla.

    Para «que ocupe toda la pantalla», la solución moderna es `min-height: 100dvh` — con `dvh` en lugar de `vh`, porque en móvil la barra del navegador aparece y desaparece, y `100vh` deja un trozo cortado.

## Desbordamiento {: .topic-title }

Cuando el contenido no cabe:

| Valor | Qué hace |
|---|---|
| `visible` (por defecto) | Se sale y se ve |
| `hidden` | Se recorta |
| `scroll` | Barra siempre visible |
| `auto` | Barra solo si hace falta |
| `clip` | Recorta y no permite ningún desplazamiento |

!!! warning "`overflow` distinto de `visible` crea un contexto de formato"
    Poner `overflow: hidden` no solo recorta: además **contiene los flotantes** y **corta el colapso de márgenes**. Por eso se usó durante años como truco de *clearfix*.

    Y tiene un efecto secundario que muerde: un ancestro con `overflow: hidden` **rompe `position: sticky`** en sus descendientes. Es la causa número uno de «mi sticky no funciona».

---

## 📖 Referencias {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **MDN — El modelo de caja** | [developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/The_box_model](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/The_box_model) |
| 📘 **MDN — Colapso de márgenes** | [developer.mozilla.org/es/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing](https://developer.mozilla.org/es/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing) |
