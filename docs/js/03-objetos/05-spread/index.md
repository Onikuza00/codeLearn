# Spread Operator { .bloque-js }

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/gFvWNjVy-wc" title="Spread en objetos" loading="lazy" allowfullscreen></iframe>
</div>

> `{ ...obj }` copia las propiedades enumerables de un objeto dentro de otro nuevo. Mismo operador que ya usaste con arrays en Semana 1 — acá aplicado a objetos.

---

## Clonación superficial {: .topic-title }

```js
const obj1 = { foo: 'bar', x: 42 };

const clonedObj = { ...obj1 };
// { foo: 'bar', x: 42 }
```

`clonedObj` es un objeto **nuevo** — modificarlo no toca `obj1`.

---

## Combinar objetos {: .topic-title }

```js
const obj1 = { foo: 'bar', x: 42 };
const obj2 = { foo: 'baz', y: 13 };

const mergedObj = { ...obj1, ...obj2 };
// { foo: 'baz', x: 42, y: 13 }
```

!!! danger "Claves repetidas: gana la ÚLTIMA"
    Si dos objetos combinados tienen la misma clave, se queda con el valor del que aparece **más a la derecha**. En el ejemplo, `obj2.foo` ("baz") pisa a `obj1.foo` ("bar") porque `...obj2` va después. El orden importa.

---

## El patrón que vas a usar en React {: .topic-title }

Actualizar una propiedad sin mutar el objeto original — "no mutar, crear nuevo", la misma idea de [Fundamentos de los Arrays](../../02-arrays/index.md) aplicada a objetos:

```js
const persona = { name: 'Pau', age: 24 };

const actualizado = { ...persona, age: 25 };
// persona sigue siendo { name: 'Pau', age: 24 }
// actualizado es { name: 'Pau', age: 25 }
```

Esto es literalmente lo que hace `setState` por debajo en React.

---

## `Object.assign()` vs spread {: .topic-title }

```js
Object.assign({}, obj1, obj2);   // hace lo mismo que { ...obj1, ...obj2 }
```

!!! info "No son 100% intercambiables"
    `Object.assign()` dispara los `setters` del objeto de destino; el spread `{ ...obj }` no. Con objetos literales simples (los que usás hoy) no notás la diferencia — pero si más adelante trabajás con `class` y getters/setters, esto puede cambiar el comportamiento.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Spread syntax** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax |
| 📘 **MDN — Object.assign()** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/assign |
