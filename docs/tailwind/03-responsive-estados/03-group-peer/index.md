# group, peer y has { .bloque-tailwind }

> `hover:`/`focus:` reaccionan al propio elemento. `group-*`/`peer-*` reaccionan al estado de OTRO elemento — el padre o un hermano. `has-*` va más allá: reacciona al CONTENIDO de otro elemento, no a su estado.

---

## group — reaccionar al padre {: .topic-title }

El padre lleva la clase `group`; cualquier hijo puede reaccionar a un estado del padre con `group-hover:`, `group-focus:`, etc:

```html
<div class="group">
  <img class="opacity-75 group-hover:opacity-100" src="...">
  <p class="hidden group-hover:block">Se ve solo al pasar por la tarjeta entera</p>
</div>
```

| Clase en el padre | Clase en el hijo |
|---|---|
| `group` | `group-hover:`, `group-focus:`, `group-active:`... |

!!! tip "El caso típico: tarjetas interactivas"
    Sin `group`, cada hijo solo puede reaccionar a SU PROPIO hover — pasar el cursor por la imagen no afectaría al texto de al lado. Con `group` en el contenedor, toda la tarjeta reacciona como una unidad aunque el cursor esté técnicamente sobre un hijo distinto.

**Otro caso muy habitual: atenuar los demás elementos de una lista al pasar el cursor por uno.** El contenedor común lleva `group`, cada ítem se atenúa con `group-hover:opacity-50` (reacciona a que el cursor esté EN CUALQUIER PARTE del grupo), y ese mismo ítem recupera opacidad completa con su propio `hover:opacity-100` — con `!` delante para ganarle la especificidad al `group-hover` cuando el cursor está justo encima de él.

```html
<ul class="group/lista">
  <li class="group-hover/lista:opacity-50 hover:!opacity-100">Ítem 1</li>
  <li class="group-hover/lista:opacity-50 hover:!opacity-100">Ítem 2</li>
  <li class="group-hover/lista:opacity-50 hover:!opacity-100">Ítem 3</li>
</ul>
```

!!! note "No es `has()` — es `group` + `hover` con `!important`"
    Este patrón no consulta el contenido de nadie, solo dos estados combinados con distinta prioridad: "¿el cursor está en el grupo?" (`group-hover`) contra "¿el cursor está en MÍ?" (`hover`). El `!` es el modificador de Tailwind para `!important` — necesario aquí porque ambas clases podrían aplicar a la vez y, sin forzar prioridad, ganaría la que esté declarada después en el CSS generado, no la más específica para el elemento hovereado.

---

## peer — reaccionar a un hermano {: .topic-title }

Un elemento lleva la clase `peer`; los **hermanos que vienen DESPUÉS de él en el HTML** pueden reaccionar a su estado con `peer-*`:

```html
<input type="checkbox" class="peer">
<p class="hidden peer-checked:block">Aparece cuando el checkbox está marcado</p>
```

| Clase en el elemento | Clase en el hermano siguiente |
|---|---|
| `peer` | `peer-checked:`, `peer-focus:`, `peer-invalid:`... |

!!! warning "`peer` solo mira hacia adelante"
    A diferencia de `group` (que puede estar en cualquier ancestro), `peer` únicamente afecta a los elementos que vienen DESPUÉS en el HTML, nunca a los anteriores ni al padre. Es habitual para mensajes de error de formulario: el `<input>` va primero con `peer`, el mensaje va justo después con `peer-invalid:block`.

---

## has-* — reaccionar al contenido, no al estado {: .topic-title }

`has-*` es la versión Tailwind del pseudo-selector `:has()` de CSS: en vez de reaccionar a un ESTADO de otro elemento (hover, focus...), reacciona a si ese elemento CONTIENE algo que cumple un selector.

```html
<label class="has-checked:bg-indigo-50 has-checked:ring-indigo-200">
  Google Pay
  <input type="radio" class="checked:border-indigo-500 ...">
</label>
```

Combinado con `group`, permite mirar el contenido de un ANCESTRO en vez del propio elemento:

```html
<div class="group">
  <p>Product Designer at <a href="...">planeteria.tech</a></p>
  <svg class="hidden group-has-[a]:block"><!-- solo se ve si el group tiene un <a> --></svg>
</div>
```

| Variante | Reacciona a |
|---|---|
| `group-hover:` | el ESTADO del padre (hover, focus...) |
| `has-*:` | el CONTENIDO del propio elemento |
| `group-has-*:` | el CONTENIDO de un ancestro marcado con `group` |

!!! note "No es lo mismo que `group-hover`"
    `group-hover:` mira qué le está pasando al padre. `has-*:`/`group-has-*:` miran qué HAY dentro — sin necesitar JavaScript para condicionar el estilo según el contenido, algo que antes de `:has()` era imposible en CSS puro.

---

## Grupos y peers anidados {: .topic-title }

Si hay más de un `group`/`peer` anidados, se nombran para no mezclarlos:

```html
<div class="group/card">
  <div class="group/image">
    <p class="group-hover/card:underline">Reacciona a la tarjeta</p>
    <p class="group-hover/image:underline">Reacciona solo a la imagen</p>
  </div>
</div>
```

---

## 📖 Referencias

- 📘 **Documentación oficial — Styling based on parent state** — https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state
- 📘 **Documentación oficial — Styling based on sibling state** — https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state
- 📘 **Documentación oficial — Styling based on descendants** — https://tailwindcss.com/docs/hover-focus-and-other-states#has
