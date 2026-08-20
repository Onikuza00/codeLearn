# group y peer { .bloque-tailwind }

> `hover:`/`focus:` reaccionan al propio elemento. `group-*`/`peer-*` reaccionan al estado de OTRO elemento — el padre o un hermano.

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
