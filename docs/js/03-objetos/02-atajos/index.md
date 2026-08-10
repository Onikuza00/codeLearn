# Atajos y propiedades computadas { .bloque-js }

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/objetos-atajos.mp4"></video>
</div>

> Dos técnicas para trabajar con objetos de forma más corta: **shorthand** al crearlos, y **destructuring** al leerlos.

---

## Shorthand — propiedades con nombre de variable {: .topic-title }

Cuando la variable y la clave se llaman igual, no hace falta repetir el nombre:

```js
const name = 'Spidey';
const universe = 42;

const spiderman = {
    name,       // en vez de name: name
    universe,   // en vez de universe: universe
    powers: ['web', 'invisibility', 'spider-sense']
};
```

---

## Destructuring — extraer propiedades a variables {: .topic-title }

Sacar valores de un objeto y asignarlos a variables en una sola operación:

```js
const { universe } = spiderman;
console.log(universe);   // 42
```

Varias propiedades a la vez:

```js
const { universe, name, powers } = spiderman;
```

### Renombrar variables

Cuando el nombre de la propiedad no te sirve como nombre de variable:

```js
const { universe: universeNumber } = spiderman;
console.log(universeNumber);   // 42
```

### Valores por defecto

Si la propiedad no existe en el objeto, usa el valor por defecto en vez de `undefined`:

```js
const { name, isAvenger = false } = spiderman;
console.log(isAvenger);   // false — spiderman no tiene esa propiedad
```

### Objetos anidados

```js
const spiderman = {
    name: 'Spidey',
    partner: { name: 'Mary Jane' }
};

const { partner: { name } } = spiderman;
console.log(name);   // 'Mary Jane'
```

!!! warning "Renombrar y anidar al mismo tiempo puede confundir"
    En `const { partner: { name } } = spiderman`, `partner` NO es una variable nueva — es la ruta hacia adentro del objeto. La variable que realmente se crea es `name` (la de adentro de `partner`). Si además quisieras el `name` de afuera, necesitás renombrar uno de los dos para no pisarlos.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Destructuring assignment** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment |
| 📖 **aprendejavascript.dev — Atajos y propiedades computadas** | https://www.aprendejavascript.dev/clase/objetos/atajos |
