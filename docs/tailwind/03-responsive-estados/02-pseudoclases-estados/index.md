# Pseudo-clases y estados { .bloque-tailwind }

> Cualquier utility class puede activarse solo en un estado concreto — hover, foco, un formulario inválido, modo oscuro — anteponiendo el prefijo correspondiente.

---

## Interacción {: .topic-title }

```html
<button class="bg-sky-500 hover:bg-sky-600 active:bg-sky-700">
  Botón
</button>
```

| Prefijo | Se activa cuando... |
|---|---|
| `hover:` | El cursor está encima |
| `focus:` | El elemento tiene el foco (clic o teclado) |
| `focus-visible:` | Tiene el foco Y el navegador decide mostrarlo (normalmente solo con teclado) |
| `focus-within:` | El foco está en el elemento O en cualquiera de sus hijos |
| `active:` | Se está pulsando en ese momento |
| `visited:` | Un enlace ya visitado |

!!! tip "`focus:` vs. `focus-visible:`"
    `focus:` se activa también al hacer clic con el ratón, lo que a veces muestra un anillo de foco que solo tiene sentido para navegación por teclado. `focus-visible:` es más preciso: el navegador decide cuándo mostrarlo según cómo llegó el foco — mejor para el anillo de accesibilidad.

---

## Formularios {: .topic-title }

```html
<input class="border invalid:border-red-500 disabled:opacity-50" required>
```

| Prefijo | Se activa cuando... |
|---|---|
| `disabled:` | El campo está deshabilitado |
| `required:` | El campo es obligatorio |
| `invalid:` / `valid:` | Según la validación nativa del navegador |
| `checked:` | Un checkbox/radio marcado |
| `placeholder-shown:` | El placeholder está visible (campo vacío) |

---

## Posición en una lista {: .topic-title }

```html
<li class="odd:bg-slate-50">
  <!-- filas alternas -->
</li>
```

| Prefijo | Se activa cuando... |
|---|---|
| `first:` | Es el primer hijo |
| `last:` | Es el último hijo |
| `only:` | Es hijo único |
| `odd:` / `even:` | Filas impares / pares (útil para tablas tipo cebra) |
| `empty:` | El elemento no tiene contenido |

---

## Modo oscuro {: .topic-title }

```html
<div class="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
```

`dark:` aplica los estilos cuando el modo oscuro está activo. Por defecto sigue la preferencia del sistema operativo del visitante (`prefers-color-scheme`); si el sitio tiene un botón para cambiar de tema a mano, se configura para reaccionar a una clase (`.dark`) en vez de al sistema.

---

## Combinar prefijos {: .topic-title }

Los prefijos se encadenan sin límite — no importa el orden en que se escriban:

```html
<button class="bg-sky-500 md:hover:bg-sky-600 dark:md:hover:bg-sky-400">
  <!-- solo cambia en hover, y solo desde tablet en adelante -->
</button>
```

---

## 📖 Referencias

- 📘 **Documentación oficial — Hover, focus and other states** — https://tailwindcss.com/docs/hover-focus-and-other-states
- 📘 **Documentación oficial — Dark mode** — https://tailwindcss.com/docs/dark-mode
