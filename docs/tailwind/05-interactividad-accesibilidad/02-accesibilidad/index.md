# Accesibilidad { .bloque-tailwind }

> Contenido que existe para quien usa un lector de pantalla, pero que nadie más necesita ver — sin ese contenido, una persona ciega pierde información que el resto capta solo con mirar.

---

## sr-only {: .topic-title }

```html
<button>
  <svg><!-- icono de "cerrar" --></svg>
  <span class="sr-only">Cerrar ventana</span>
</button>
```

| Clase | Efecto |
|---|---|
| `sr-only` | Oculta visualmente el elemento, pero sigue siendo leído por lectores de pantalla |
| `not-sr-only` | Deshace `sr-only` — vuelve a mostrarse visualmente |

Un icono de "cerrar" (una X) se entiende mirándolo, pero un lector de pantalla solo puede anunciar lo que hay en el HTML. Sin el `<span class="sr-only">`, ese botón se leería como "botón" sin más contexto — con él, se lee "Cerrar ventana, botón".

!!! tip "`display: none` no sirve para esto"
    Si se oculta con `hidden`, el lector de pantalla tampoco lo lee — el contenido desaparece para todo el mundo. `sr-only` usa una técnica distinta (el elemento sigue en el DOM, visualmente comprimido a 1px, pero legible) para que exista SOLO para quien lo necesita.

### `not-sr-only` combinado con breakpoints

```html
<span class="sr-only md:not-sr-only">
  Solo visible desde tablet, pero siempre leíble
</span>
```

Patrón típico: un texto que en móvil solo hace falta para accesibilidad (el espacio es limitado, hay un icono que ya lo comunica visualmente), pero que en pantallas grandes SÍ se muestra como texto normal.

---

## 📖 Referencias

- 📘 **Documentación oficial — Screen readers** — https://tailwindcss.com/docs/display#screen-readers
