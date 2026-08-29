# Grid { .bloque-tailwind }

> `grid` define la cuadrícula, `grid-cols-`/`grid-rows-` la dividen en pistas, y `col-span-`/`row-span-` deciden cuántas pistas ocupa cada hijo.

---

## Activar Grid {: .topic-title }

```html
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

| Clase | `display` |
|---|---|
| `grid` | `grid` |
| `inline-grid` | `inline-grid` |

---

## Columnas y filas {: .topic-title }

```html
<div class="grid grid-cols-4">
  <!-- 4 columnas de ancho igual -->
</div>
```

| Clase | `grid-template-columns` |
|---|---|
| `grid-cols-1` … `grid-cols-12` | `repeat(N, minmax(0, 1fr))` — N columnas iguales |
| `grid-cols-none` | `none` |

`grid-rows-1` … `grid-rows-6` funcionan igual para `grid-template-rows`.

---

## Cuántas pistas ocupa cada hijo {: .topic-title }

```html
<div class="grid grid-cols-3">
  <div class="col-span-2">Ocupa 2 columnas</div>
  <div>Ocupa 1</div>
</div>
```

| Clase | Efecto |
|---|---|
| `col-span-1` … `col-span-12` | El hijo ocupa N columnas |
| `col-span-full` | Ocupa todas las columnas disponibles |
| `col-start-1` … `col-start-13` | En qué línea de columna empieza |
| `col-end-1` … `col-end-13` | En qué línea de columna termina |
| `row-span-`, `row-start-`, `row-end-` | Lo mismo, para filas |

---

## Columnas de ancho variable — `auto-fit`/`minmax` {: .topic-title }

`grid-cols-N` reparte columnas de igual ancho, pero un patrón muy común (galerías, tarjetas responsive sin media queries) necesita ancho variable con un mínimo garantizado. Eso no tiene clase predefinida — se hace con un **valor arbitrario**:

```html
<div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
  <!-- tantas columnas de mínimo 200px como quepan, repartiendo el resto -->
</div>
```

!!! tip "Por qué no hay una clase para esto"
    `auto-fit`/`minmax()` es CSS de grid puro, no un valor de una escala fija — depende del contenido y del contenedor. Por eso Tailwind no lo predefine: se escribe tal cual dentro de `grid-cols-[...]`, igual que cualquier CSS válido.

---

## Alineación en la cuadrícula {: .topic-title }

```html
<div class="grid place-items-center h-64">
  <!-- centra CADA hijo dentro de su celda, en ambos ejes -->
</div>
```

| Clase | Función |
|---|---|
| `justify-items-` | Alinea los hijos horizontalmente dentro de su celda |
| `align-items-` (mismas que en Flexbox) | Alinea los hijos verticalmente dentro de su celda |
| `place-items-` | Atajo: `justify-items-` + `align-items-` a la vez |
| `justify-content-` / `align-content-` | Alinea la cuadrícula ENTERA dentro del contenedor (cuando sobra espacio) |
| `place-content-` | Atajo de los dos anteriores |

### Alineación de un solo hijo — `justify-self`/`place-self`

```html
<div class="grid grid-cols-3">
  <div class="justify-self-end">Solo este se pega a la derecha de su celda</div>
</div>
```

| Clase | Función |
|---|---|
| `justify-self-` | Sobreescribe `justify-items-` para UN hijo (solo existe en Grid, no en Flexbox) |
| `self-` (mismas que en Flexbox) | Sobreescribe `align-items-` para un hijo |
| `place-self-` | Atajo: `justify-self-` + `self-` a la vez |

---

## Filas/columnas creadas automáticamente {: .topic-title }

Cuando hay más hijos de los que caben en `grid-cols-N`, Grid crea filas nuevas por sí solo — `auto-rows-`/`auto-cols-` controla el tamaño de esas pistas "implícitas":

```html
<div class="grid grid-cols-3 auto-rows-fr">
  <!-- las filas que se van creando reparten el alto por igual -->
</div>
```

| Clase | Efecto |
|---|---|
| `auto-rows-auto` | Tamaño según el contenido (por defecto) |
| `auto-rows-min` / `-max` | `min-content` / `max-content` |
| `auto-rows-fr` | Reparte el espacio igual que `1fr` |
| `auto-cols-` | Lo mismo, para columnas creadas automáticamente |
| `grid-flow-row` | Rellena fila a fila (por defecto) |
| `grid-flow-col` | Rellena columna a columna |
| `grid-flow-dense` | Intenta rellenar huecos que dejan los `col-span-`/`row-span-` |

---

## 📖 Referencias

- 📘 **Documentación oficial — Grid template columns** — https://tailwindcss.com/docs/grid-template-columns
- 📘 **Documentación oficial — Grid column start/end** — https://tailwindcss.com/docs/grid-column
- 📘 **Documentación oficial — Justify items** — https://tailwindcss.com/docs/justify-items
