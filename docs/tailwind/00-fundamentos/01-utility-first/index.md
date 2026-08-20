# Utility-first { .bloque-tailwind }

> La clase la escribió alguien más, la composición la haces tú. Este cambio de mentalidad es lo primero que hay que entender — todo lo demás es memorizar nombres de una escala consistente.

---

## ¿Qué es utility-first? {: .topic-title }

Una **utility class** es una clase que hace UNA sola cosa, con un nombre que describe exactamente esa cosa:

```html
<div class="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md">
  Tarjeta
</div>
```

`flex` activa flexbox. `items-center` centra en el eje cruzado. `gap-4` separa los hijos. `rounded-lg` redondea bordes. Ninguna clase hace más de una cosa — el componente se construye **componiendo** varias utility classes en el `class`, no escribiendo una clase propia con varias propiedades dentro.

---

## CSS tradicional vs. utility-first {: .topic-title }

```css
/* CSS tradicional — inventas el nombre, escribes las reglas aparte */
.tarjeta {
    display: flex;
    align-items: center;
    gap: 1rem;
    border-radius: 0.5rem;
    background-color: white;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}
```

```html
<!-- Utility-first — compones directamente en el HTML -->
<div class="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md">
```

El resultado visual es idéntico. Lo que cambia es dónde vive la decisión de estilo: en un archivo `.css` separado, o en el propio elemento.

---

## El trade-off real {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Ganas | ❌ Pagas |
|---|---|
| No inventas nombres de clase nuevos para cada componente | El HTML se ve más largo/verboso a simple vista |
| No hay CSS muerto que nadie se anima a borrar | Hay que aprender la escala de nombres de Tailwind |
| El estilo de un componente está TODO en su propio HTML, no repartido en un `.css` que crece sin parar | Cambiar un valor repetido en 10 sitios significa tocar 10 sitios (o extraer un componente reutilizable) |
</div>

!!! tip "No es que el CSS tradicional esté mal"
    BEM, `@layer`, variables nativas — siguen siendo válidos y necesarios para lo que Tailwind no resuelve (animaciones complejas, selectores relacionales como `:has()`). Tailwind no sustituye el CSS, sustituye la parte repetitiva: espaciados, colores, tipografía, layout básico.

---

## 📖 Referencias

- 📘 **Documentación oficial — Core concepts: Styling with utility classes** — https://tailwindcss.com/docs/styling-with-utility-classes
