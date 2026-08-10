# Objetos { .section-objetos .bloque-js }

> Colección de propiedades clave-valor — la ficha de datos, frente a la lista ordenada del array.

<div class="video-embed">
<video controls preload="metadata" src="https://video.aprendejs.dev/objetos-introduccion.mp4"></video>
</div>

---

## Declaración {: .topic-title }

Se declara con llaves `{ }`, con propiedades separadas por comas. Cada propiedad tiene una clave y un valor divididos por `:`.

```js
const persona = {
    name: 'Dani',
    age: 30,
    isWorking: true
};
```

Las propiedades pueden ser de **cualquier tipo**, incluidos arrays y otros objetos anidados:

```js
const persona = {
    name: 'Dani',
    family: ['Miguel', 'Maria'],
    address: { street: 'Calle de la piruleta', number: 13 }
};
```

---

## Métodos {: .topic-title }

Cuando una función es el valor de una propiedad, se le llama **método**:

```js
const persona = {
    name: 'Dani',
    walk: function () {
        console.log('Estoy caminando');
    }
};

persona.walk();   // 'Estoy caminando'
```

---

## Acceso a propiedades {: .topic-title }

Hay dos notaciones:

```js
const persona = { name: 'Dani' };

persona.name;          // notación de punto — clave literal, escrita en el código
persona['name'];       // notación de corchetes — funciona igual

const clave = 'name';
persona[clave];        // notación de corchetes con VARIABLE — esto es lo que la de punto no puede hacer
```

!!! tip "Ya usaste esto sin saberlo"
    En `frecuenciaCaracteres` escribiste `lista[texto[i]]++` — eso es notación de corchetes con una clave que no conocés de antemano (viene de recorrer el string). La notación de punto solo sirve cuando la clave es fija y la escribís vos mismo en el código; en cuanto la clave depende de una variable, corchetes es la única opción.

Acceso con claves que tienen espacios: `persona['full name']` — solo posible con corchetes, la notación de punto no lo permite.

---

## Modificar y eliminar {: .topic-title }

```js
const persona = { name: 'Dani' };

persona.age = 30;        // agregar propiedad
delete persona.age;      // eliminar propiedad
```

!!! danger "const NO bloquea el contenido del objeto — solo bloquea la reasignación de la variable"
    ```js
    const persona = { name: 'Dani' };

    persona.age = 30;          // ✅ funciona — modificaste el CONTENIDO
    console.log(persona);      // { name: 'Dani', age: 30 }

    persona = { name: 'Pau' }; // ❌ TypeError — intentaste REASIGNAR la variable entera
    ```
    Mismo mecanismo que viste en [Fundamentos de los Arrays](../02-arrays/index.md): `const` congela **la variable**, no el valor que contiene. Es el motivo por el que casi siempre vas a declarar objetos con `const` — rara vez necesitás reasignar el objeto entero, solo modificar lo que hay dentro.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [Atajos y propiedades computadas](02-atajos/index.md) | Shorthand, destructuring, valores por defecto |
| [Iteración](03-iterar/index.md) | `for...in`, `Object.keys`/`values`/`entries` |
| [Optional chaining](04-optional-chaining/index.md) | `?.` para acceso seguro a propiedades anidadas |
| [Spread Operator](05-spread/index.md) | `{...obj}` — clonar, combinar, actualizar sin mutar |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Objetos, conceptos básicos** | https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/Object_basics |
| 📖 **aprendejavascript.dev — Objetos** | https://www.aprendejavascript.dev/clase/objetos/introduccion |
