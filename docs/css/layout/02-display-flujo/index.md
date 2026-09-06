# Display y flujo { .section-layout .bloque-css }

> Antes de Flexbox y Grid hay una capa que sigue mandando en todo: el **flujo normal**. Es cómo se colocan los elementos cuando no les dices nada, y `display` es la propiedad que decide en qué se convierte cada caja.

---

## El flujo normal {: .topic-title }

Sin ninguna regla de posicionamiento, el navegador coloca los elementos en el orden en que aparecen en el HTML:

- Los **de bloque** se apilan uno debajo de otro y ocupan todo el ancho disponible.
- Los **en línea** se colocan uno al lado del otro, y saltan de línea cuando no caben.

Casi todo lo que se hace con CSS es **modificar** ese flujo. Conviene recordar que el flujo sigue ahí debajo aunque uses Grid.

## `block`, `inline` e `inline-block` {: .topic-title }

| | `block` | `inline` | `inline-block` |
|---|---|---|---|
| Salta de línea | Sí | No | No |
| Acepta `width`/`height` | ✅ | ❌ | ✅ |
| Margen **vertical** | ✅ | ❌ | ✅ |
| Margen **horizontal** | ✅ | ✅ | ✅ |
| Padding vertical | ✅ | Se pinta, **pero no empuja** | ✅ |

!!! danger "Un elemento `inline` ignora `width`, `height` y los márgenes verticales"
    Es la causa clásica de «le he puesto altura a un `<span>` y no pasa nada». Un `<a>`, un `<span>` o un `<em>` son `inline` por defecto: su tamaño lo decide su contenido y punto.

    Y el padding vertical es peor todavía: **se dibuja** —el fondo se ve más alto— pero **no empuja** a las líneas de alrededor, así que se solapa con el texto de arriba y abajo. Parece que funciona hasta que hay dos líneas.

    La solución es `display: inline-block` o, casi siempre mejor, meter el elemento en un contenedor flex.

!!! warning "El hueco fantasma entre elementos `inline-block`"
    ```html
    <span class="caja"></span>
    <span class="caja"></span>
    ```

    Aparece un espacio de unos 4 px entre las dos cajas que no está en tu CSS. **Es el salto de línea del HTML**: entre elementos en línea, el espacio en blanco del código cuenta como un espacio de texto real.

    Se arregla poniendo las etiquetas pegadas, con un comentario entre ellas, o —lo razonable hoy— usando `flex` o `grid` en el padre, donde el espacio en blanco no cuenta.

## Ocultar un elemento: tres formas distintas {: .topic-title }

| Técnica | Ocupa espacio | Es clicable | Lo leen los lectores de pantalla |
|---|---|---|---|
| `display: none` | ❌ | ❌ | ❌ |
| `visibility: hidden` | ✅ | ❌ | ❌ |
| `opacity: 0` | ✅ | **✅** | **✅** |
| Atributo `hidden` | ❌ | ❌ | ❌ |

!!! danger "`opacity: 0` no oculta nada: solo lo hace transparente"
    El elemento sigue ahí, sigue recibiendo clics y sigue leyéndose en voz alta. Un menú «oculto» con `opacity: 0` es una trampa de accesibilidad y una fuente de clics fantasma sobre botones invisibles.

    Si necesitas animar la desaparición —y por eso usas `opacity`—, acompáñala de `visibility: hidden` con un `transition-delay`, o usa `@starting-style` y `transition-behavior: allow-discrete` para poder animar hacia `display: none`.

!!! tip "Ocultar solo visualmente, pero no para un lector de pantalla"
    Para texto que debe leerse en voz alta sin verse —una etiqueta descriptiva de un icono— no vale `display: none`. Se usa la clase que oculta visualmente:

    ```css
    .visually-hidden {
        position: absolute;
        width: 1px; height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
    ```

## Los valores de `display` que importan {: .topic-title }

| Valor | Qué hace |
|---|---|
| `block` / `inline` / `inline-block` | Flujo normal |
| `flex` / `inline-flex` | Contenedor [flexbox](../04-flexbox/index.md) |
| `grid` / `inline-grid` | Contenedor [grid](../05-grid/index.md) |
| `none` | Fuera del árbol de renderizado |
| `contents` | El elemento desaparece como caja, **sus hijos suben** al padre |
| `flow-root` | Crea un contexto de formato nuevo, sin más efectos |

!!! tip "`display: contents` para saltarse un contenedor sobrante"
    Cuando un `<div>` intermedio impide que sus hijos participen en el grid del abuelo, `display: contents` en ese div lo hace desaparecer como caja y sus hijos pasan a ser items del grid.

    Ojo: en algunos navegadores elimina también la semántica del elemento, así que no se usa sobre etiquetas que aporten significado (`<ul>`, `<table>`).

!!! tip "`flow-root` es el `clearfix` moderno"
    Hace lo mismo que el viejo truco de `overflow: hidden` —contener flotantes y cortar el colapso de márgenes— pero **sin el efecto secundario de recortar el contenido** ni romper `position: sticky`. Cuando solo quieres el contexto de formato, es la opción limpia.

## `display` de dos valores {: .topic-title }

La sintaxis moderna separa cómo se comporta la caja **por fuera** y cómo coloca a sus hijos **por dentro**:

```css
display: block flex;    /* equivale a display: flex  */
display: inline flex;   /* equivale a display: inline-flex */
```

Aclara algo que los valores de una palabra escondían: `display: flex` no hace que el elemento sea «flexible», hace que **sus hijos** se coloquen en flex, mientras él sigue siendo un bloque.

---

## 📖 Referencias {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **MDN — `display`** | [developer.mozilla.org/es/docs/Web/CSS/display](https://developer.mozilla.org/es/docs/Web/CSS/display) |
| 📘 **MDN — Flujo normal** | [developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Normal_Flow](https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Normal_Flow) |
