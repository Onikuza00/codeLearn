# Agrupar opciones: `optgroup` { .bloque-css }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/YAfq6Pub43w" title="Mejorando las opciones con optgroup — midudev" loading="lazy" allowfullscreen></iframe>
</div>

> Cuando un `<select>` tiene muchas opciones, agruparlas visualmente ayuda a encontrar la correcta más rápido — y no hace falta ni una línea de CSS ni de JS, es HTML semántico.

---

## `<optgroup>` {: .topic-title }

Agrupa varias `<option>` bajo una etiqueta común. El atributo `label` es **obligatorio** — sin él, el grupo no muestra ningún título.

```html
<select>
    <optgroup label="Frontend">
        <option value="react">React</option>
        <option value="vue">Vue</option>
    </optgroup>
    <optgroup label="Backend">
        <option value="node">Node.js</option>
        <option value="php">PHP</option>
    </optgroup>
</select>
```

!!! tip "El propio `<optgroup>` no se puede seleccionar"
    Es solo un contenedor visual — el usuario nunca puede elegir "Frontend" como valor, solo las `<option>` de dentro. Eso lo diferencia de un `<option disabled>` usado como separador falso, que sí ocupa un hueco en la lista de opciones seleccionables aunque esté deshabilitado.

---

## `<hr>` dentro de un `<select>` {: .topic-title }

Una alternativa más simple para separar visualmente sin crear grupos con nombre:

```html
<select>
    <option value="react">React</option>
    <option value="vue">Vue</option>
    <hr>
    <option value="node">Node.js</option>
    <option value="php">PHP</option>
</select>
```

!!! warning "Soporte de navegador desigual, y menos semántico"
    `<hr>` dentro de un `<select>` no tiene el mismo soporte consistente entre navegadores que `<optgroup>`, y no aporta ningún significado (no dice DE QUÉ es cada grupo, solo separa). Úsalo solo para una separación visual simple sin categorías con nombre — para agrupar de verdad, `<optgroup>` es la opción correcta.

---

## Combinando ambos {: .topic-title }

Para jerarquías más complejas, varios `<optgroup>` pueden convivir en el mismo `<select>`:

```html
<select>
    <optgroup label="España">
        <option value="madrid">Madrid</option>
        <option value="barcelona">Barcelona</option>
    </optgroup>
    <optgroup label="México">
        <option value="cdmx">Ciudad de México</option>
        <option value="guadalajara">Guadalajara</option>
    </optgroup>
    <optgroup label="Remoto">
        <option value="remoto">100% remoto</option>
    </optgroup>
</select>
```

!!! tip "Accesibilidad: los lectores de pantalla anuncian el grupo"
    Un lector de pantalla anuncia el `label` del `<optgroup>` antes de leer sus opciones — el usuario sabe en qué categoría está sin necesidad de verla. Es una mejora de accesibilidad real, no solo estética.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — optgroup** | https://developer.mozilla.org/es/docs/Web/HTML/Element/optgroup |
| 🎥 **jscamp.dev — Mejorando las opciones con optgroup** | https://www.jscamp.dev/javascript/mejorando-options |
