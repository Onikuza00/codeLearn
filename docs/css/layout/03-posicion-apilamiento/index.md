# Posición y apilamiento { .section-layout .bloque-css }

> `position` saca elementos del flujo y `z-index` decide quién tapa a quién. Los dos parecen simples hasta que un `z-index: 9999` no funciona, y entonces aparece el concepto que lo explica todo: el **contexto de apilamiento**.

---

## Los cinco valores de `position` {: .topic-title }

| Valor | Sale del flujo | Se posiciona respecto a |
|---|---|---|
| `static` (por defecto) | ❌ | Nada: ignora `top`/`left` |
| `relative` | ❌ | **Su propia posición original** |
| `absolute` | ✅ | El ancestro posicionado más cercano |
| `fixed` | ✅ | La ventana del navegador |
| `sticky` | ❌ | Alterna entre relativo y fijo |

**Salir del flujo** significa que el elemento deja de ocupar sitio: los demás se colocan como si no existiera.

!!! tip "`relative` reserva su hueco original"
    Un elemento `relative` con `top: 20px` se dibuja 20 px más abajo, pero **el hueco donde estaba sigue reservado**. Nada sube a ocuparlo.

    Por eso su uso más común no es mover nada, sino **servir de referencia** a un hijo `absolute`.

## El bloque contenedor de un `absolute` {: .topic-title }

```css
.tarjeta { position: relative; }        /* la referencia */
.insignia { position: absolute; top: 0; right: 0; }
```

Un elemento `absolute` se posiciona respecto al **ancestro posicionado más cercano** — cualquiera que no sea `static`. Si no encuentra ninguno, usa el bloque inicial de la página.

!!! danger "El error clásico: olvidar el `position: relative` en el padre"
    Sin él, la insignia no se coloca en la esquina de la tarjeta: se va a la esquina de **la página entera**, o de un ancestro lejano que sí estaba posicionado. El síntoma —«se me va al principio del documento»— siempre apunta a lo mismo.

!!! warning "`transform`, `filter` y `will-change` también crean bloque contenedor"
    Y esto rompe `position: fixed`. Un elemento `fixed` debería anclarse a la ventana, pero si **cualquier ancestro** tiene un `transform` distinto de `none`, pasa a anclarse a ese ancestro.

    Es de los bugs más desconcertantes de CSS: un modal `fixed` que funciona perfectamente hasta que alguien anima el contenedor padre con una translación.

`inset` es la forma corta de las cuatro:

```css
inset: 0;              /* top, right, bottom y left a 0 */
inset: 10px 20px;      /* vertical | horizontal */
```

## `sticky` {: .topic-title }

Se comporta como `relative` hasta que llega a un umbral al hacer scroll, y a partir de ahí se queda pegado.

```css
.cabecera { position: sticky; top: 0; }
```

!!! danger "Las tres razones por las que un `sticky` no funciona"
    1. **Falta el umbral.** Sin `top`, `bottom`, `left` o `right`, `sticky` no hace absolutamente nada. Es el olvido más frecuente.
    2. **Un ancestro tiene `overflow` distinto de `visible`.** `overflow: hidden`, `auto` o `scroll` en cualquier padre corta el efecto. Suele venir de un `overflow: hidden` puesto para otra cosa hace meses.
    3. **El padre no tiene altura suficiente.** El elemento solo se pega dentro de los límites de su contenedor: si el padre mide lo mismo que él, no hay recorrido donde pegarse.

## `z-index` y el contexto de apilamiento {: .topic-title }

Sin `z-index`, los elementos se apilan por su orden en el HTML: el último gana. `z-index` cambia ese orden, pero **solo dentro de su contexto**.

!!! danger "`z-index` no funciona sobre un elemento `static`"
    ```css
    .caja { z-index: 100; }                          /* ❌ se ignora */
    .caja { position: relative; z-index: 100; }      /* ✅ */
    ```

    Solo tiene efecto en elementos **posicionados** (`relative`, `absolute`, `fixed`, `sticky`) y en los hijos directos de un contenedor flex o grid. En cualquier otro caso, el navegador lo ignora sin avisar.

Un **contexto de apilamiento** es una burbuja: los `z-index` de dentro solo compiten entre ellos, y la burbuja entera se ordena respecto a sus hermanos como una sola pieza.

```
Contexto raíz
├── .cabecera            z-index: 100
└── .contenido           z-index: 1        ← crea contexto
    └── .modal           z-index: 9999     ← atrapado dentro
```

!!! danger "Por qué tu `z-index: 9999` no tapa la cabecera"
    Porque `.contenido` creó un contexto de apilamiento con su `z-index: 1`. **Todo lo que hay dentro queda encerrado ahí**: por muy alto que sea el número del modal, compite solo contra sus hermanos dentro de la burbuja, y la burbuja entera vale 1 frente al 100 de la cabecera.

    La solución nunca es subir el número. Es **sacar el modal de esa burbuja** —moverlo al final del `<body>`— o quitar el `z-index` del contenedor intermedio.

**Qué crea un contexto de apilamiento** (además del elemento raíz):

- Un elemento posicionado con `z-index` distinto de `auto`.
- `position: fixed` o `sticky`, **siempre**, incluso sin `z-index`.
- `opacity` menor que 1.
- `transform`, `filter`, `perspective`, `backdrop-filter`, `mix-blend-mode`, `isolation: isolate`, `will-change` con esas propiedades.
- `contain: paint` o `layout`.

!!! warning "Un `opacity: 0.99` cambia el apilamiento de toda la rama"
    Parece un ajuste inofensivo y en realidad crea un contexto nuevo que puede romper la superposición de cualquier descendiente. Lo mismo con un `transform: translateZ(0)` puesto para «forzar aceleración por hardware».

!!! tip "`isolation: isolate` sirve justo para eso"
    Crea un contexto de apilamiento **a propósito y sin efectos visuales**, para encapsular un componente y que sus `z-index` internos no interfieran con el resto de la página. Es la forma limpia de aislar, en lugar de recurrir a un `opacity: 0.999`.

## Una escala de `z-index`, no números al azar {: .topic-title }

```css
:root {
    --z-base: 0;
    --z-dropdown: 100;
    --z-cabecera: 200;
    --z-modal: 300;
    --z-aviso: 400;
}
```

Los `9999` y `99999` repartidos por el proyecto son una carrera armamentística que siempre acaba en un contexto de apilamiento que nadie entiende. Con variables, la jerarquía está escrita en un solo sitio y se puede razonar.

## El elemento que se pinta encima de todo {: .topic-title }

Para modales y menús, la alternativa moderna a pelear con `z-index` es la **capa superior** del navegador: `<dialog>` abierto con `showModal()` y los elementos con `popover` se pintan **por encima de todo el documento**, al margen de contextos de apilamiento.

Es la solución de fondo al problema: en lugar de buscar un número más alto, salir del sistema de capas.

---

## 📖 Referencias {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **MDN — `position`** | [developer.mozilla.org/es/docs/Web/CSS/position](https://developer.mozilla.org/es/docs/Web/CSS/position) |
| 📘 **MDN — Contexto de apilamiento** | [developer.mozilla.org/es/docs/Web/CSS/CSS_positioning/Understanding_z_index/Stacking_context](https://developer.mozilla.org/es/docs/Web/CSS/CSS_positioning/Understanding_z_index/Stacking_context) |
