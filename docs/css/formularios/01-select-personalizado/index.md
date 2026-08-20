# Select personalizado { .section-select .bloque-css }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/j3tJ12-rutc" title="Estilando el elemento select — midudev" loading="lazy" allowfullscreen></iframe>
</div>

> Un `<select>` trae su propio diseño impuesto por el navegador (flecha incluida) — no responde a `border`, `padding` o `background` como cualquier otro elemento hasta que le quitas ese estilo nativo.

---

## El problema que resuelve {: .topic-title }

Un `<select>` normal cambia de aspecto según el sistema operativo y el navegador — su flecha, sus bordes y su padding interno no son CSS que puedas pisar directamente. El resultado es un control que nunca encaja del todo con el resto del diseño.

**`appearance: none`** quita ese dibujo nativo entero, dejando el elemento como un bloque en blanco listo para maquetar con CSS normal.

---

## `appearance: none` {: .topic-title }

```css
select {
    appearance: none;
    -webkit-appearance: none; /* compatibilidad con Safari */
}
```

!!! warning "Quitar el estilo nativo también quita la flecha"
    Al poner `appearance: none`, el `<select>` pierde su flecha desplegable por completo — no se oculta, desaparece. Si no añades una propia, el usuario pierde la única pista visual de que ese elemento es desplegable.

---

## Flecha personalizada con SVG {: .topic-title }

Se añade como `background-image`, no como elemento HTML — así no interfiere con el texto de las opciones.

```css
select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    padding-right: 2.5rem; /* deja hueco para que el texto no se solape con la flecha */
}
```

---

## Estados: `:hover` y `:focus` {: .topic-title }

Sin `appearance: none`, el navegador dibuja su propio anillo de foco. Al quitarlo, hay que definir el tuyo — un `<select>` sin indicador de foco visible es un problema de accesibilidad, no solo estético.

```css
select {
    transition: border-color 0.2s, background-color 0.2s;
}

select:hover {
    border-color: #94a3b8;
}

select:focus {
    outline: 2px solid #1173d4;
    outline-offset: 2px;
}
```

---

## Ejemplo completo {: .topic-title }

```css
select {
    appearance: none;
    -webkit-appearance: none;

    background-color: #242d3a;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;

    border: 1px solid #334155;
    border-radius: 0.5rem;
    padding: 0.6rem 2.5rem 0.6rem 1rem;
    color: white;

    transition: border-color 0.2s, background-color 0.2s;
}

select:hover {
    border-color: #94a3b8;
}

select:focus {
    outline: 2px solid #1173d4;
    outline-offset: 2px;
}
```

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — appearance** | https://developer.mozilla.org/es/docs/Web/CSS/appearance |
| 🎥 **jscamp.dev — Estilando el elemento select** | https://www.jscamp.dev/javascript/estilando-select |
