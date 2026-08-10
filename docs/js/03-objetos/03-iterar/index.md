# Iteración de objetos { .bloque-js }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/objetos-iterar.mp4"></video>
</div>

> Recorrer un objeto significa visitar cada una de sus propiedades. A diferencia de un array, un objeto no tiene orden por índice — necesitás herramientas distintas para recorrerlo.

---

## `for...in` {: .topic-title }

Recorre las **claves** (propiedades enumerables) de un objeto:

```js
const spiderman = {
    name: 'Spidey',
    universe: 42,
    powers: ['web', 'invisibility', 'spider-sense']
};

for (const property in spiderman) {
    console.log(`${property}: ${spiderman[property]}`);
}
// name: Spidey
// universe: 42
// powers: web,invisibility,spider-sense
```

!!! danger "for...in NO es lo mismo que for...of"
    `for...in` recorre las **claves** de un objeto (propiedades enumerables). `for...of` recorre los **valores** de algo iterable, como un array. Usar `for...in` sobre un array funciona por accidente (te da los índices como strings), pero no es para eso — quedate con `for...of` o `.forEach()` para arrays, y `for...in` (o mejor, `Object.keys/values/entries`) para objetos.

---

## `Object.keys()` / `Object.values()` / `Object.entries()` {: .topic-title }

Las tres devuelven un **array** — a partir de ahí podés usar todo lo que ya dominás de arrays (`.forEach`, `.map`, `.filter`...).

```js
Object.keys(spiderman)     // ["name", "universe", "powers"]
Object.values(spiderman)   // ["Spidey", 42, [...]]
Object.entries(spiderman)  // [["name","Spidey"], ["universe",42], ["powers",[...]]]
```

`Object.entries` combinado con destructuring en el callback es el patrón típico para recorrer clave y valor a la vez:

```js
Object.entries(spiderman).forEach(([property, value]) => {
    console.log(`${property}: ${value}`);
});
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-objetos-iterar"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("demo-js-objetos-iterar");
    if (!el) return;
    var spiderman = { name: "Spidey", universe: 42, powers: ["web", "invisibility"] };
    var lineas = [
        "Object.keys()    → " + JSON.stringify(Object.keys(spiderman)),
        "Object.values()  → " + JSON.stringify(Object.values(spiderman)),
        "Object.entries() → " + JSON.stringify(Object.entries(spiderman))
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
});
</script>

---

## Enumerabilidad {: .topic-title }

Por defecto, cuando agregás propiedades a un objeto, son **enumerables** (aparecen en `for...in` y en los `Object.*`). Algunas propiedades internas del lenguaje no lo son, pero eso no afecta a los objetos literales que estás creando vos.

!!! info "Gotcha con objetos creados por función-constructora (para más adelante)"
    Si un objeto viene de una `function` usada como constructor (`new Persona(...)`), `for...in` también te devuelve sus **métodos** como si fueran propiedades. Con objetos literales `{ }` (que es lo que usás hoy) esto no pasa. Aplica cuando lleguemos al bloque de constructores/clases.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Object.keys()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/keys |
| 📘 **MDN — Object.values()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/values |
| 📘 **MDN — Object.entries()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/entries |
| 📖 **aprendejavascript.dev — Transformación a Array e iteración** | https://www.aprendejavascript.dev/clase/objetos/iterar |
| 🎓 **Apunts institut — Objectes (iteració)** | https://apunts.institutmontilivi.cat/DAW-M0612/objectes.html |
