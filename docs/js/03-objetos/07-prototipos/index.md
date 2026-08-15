# Prototipos { .bloque-js }

> JavaScript no implementa la herencia con clases "de verdad" como otros lenguajes — usa **prototipos**. Cada objeto tiene un enlace a otro objeto (su prototipo), del que hereda propiedades y métodos. Es como el manual de un coche: cada coche tiene su matrícula única, pero todos los de la misma marca y modelo consultan el mismo manual.

---

## Cadena de prototipos {: .topic-title }

Cuando accedes a una propiedad de un objeto, JavaScript sigue este algoritmo:

1. Busca la propiedad en el objeto mismo.
2. Si no está, busca en su prototipo.
3. Si tampoco está, busca en el prototipo del prototipo.
4. Sigue subiendo hasta llegar a `null` — ahí termina la cadena.

```js
const animal = {
    tipo: "Mamífero",
    respirar() {
        console.log("Respirando...");
    }
};

const perro = Object.create(animal);
perro.raza = "Labrador";
perro.ladrar = function () {
    console.log("¡Guau!");
};

perro.raza;        // "Labrador" — propiedad PROPIA de perro
perro.tipo;         // "Mamífero" — HEREDADA de animal
perro.ladrar();     // "¡Guau!" — propia
perro.respirar();   // "Respirando..." — heredada
```

La cadena resultante es `perro → animal → Object.prototype → null`.

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-cadena-prototipos"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-cadena-prototipos");
    if (!el) return;
    var animal = { tipo: "Mamífero", respirar: function () { return "Respirando..."; } };
    var perro = Object.create(animal);
    perro.raza = "Labrador";
    var lineas = [
        "perro.raza      → " + perro.raza + "   (propia)",
        "perro.tipo      → " + perro.tipo + "   (heredada de animal)",
        "perro.respirar() → " + perro.respirar() + "   (heredada de animal)"
    ];
    el.innerHTML = lineas.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

---

## `Object.create()` {: .topic-title }

`Object.create(prototipo)` crea un objeto nuevo con el objeto que le pasas como prototipo. Es la técnica recomendada para establecer herencia manualmente.

```js
const vehiculo = {
    acelerar() {
        console.log("Acelerando...");
    }
};

const coche = Object.create(vehiculo);
coche.ruedas = 4;

const moto = Object.create(vehiculo);
moto.ruedas = 2;

coche.acelerar();   // "Acelerando..." — heredado de vehiculo
moto.acelerar();    // "Acelerando..." — heredado de vehiculo
```

`coche` y `moto` son objetos distintos, con sus propias propiedades (`ruedas`), pero comparten el mismo prototipo `vehiculo` — el mismo "manual".

---

## `Object.prototype` {: .topic-title }

Cualquier objeto creado con la sintaxis literal `{}` hereda automáticamente de `Object.prototype`, que aporta métodos como `toString()`, `hasOwnProperty()` o `isPrototypeOf()`.

```js
const objeto = {};
objeto.toString();   // "[object Object]" — heredado, nunca lo escribiste
```

Para crear un objeto sin ningún prototipo, existe `Object.create(null)`:

```js
const sinPrototipo = Object.create(null);
sinPrototipo.toString();   // ❌ TypeError — no hereda ni siquiera eso
```

---

## Consultar y modificar {: .topic-title }

```js
const objeto = { nombre: "Ana" };
Object.getPrototypeOf(objeto);        // Object.prototype

const perro = Object.create(animal);
Object.getPrototypeOf(perro);         // animal

Object.setPrototypeOf(objeto, null);  // ahora objeto ya no hereda de nada
```

`Object.getPrototypeOf()` / `Object.setPrototypeOf()` son las funciones estándar para leer y cambiar el prototipo de un objeto ya creado.

!!! danger "No uses `__proto__` directamente"
    Al inspeccionar un objeto vas a ver una propiedad `__proto__` que apunta a su prototipo — es un resto histórico de compatibilidad, no la API recomendada. Usa `Object.getPrototypeOf()` / `Object.setPrototypeOf()` en su lugar; hacen lo mismo de forma explícita y estándar.

---

## `class`/`extends` {: .topic-title }

`class` en JavaScript no es un sistema de herencia distinto — es **azúcar sintáctico** sobre este mismo mecanismo de prototipos. `class Perro extends Animal` monta por debajo la misma cadena que armarías a mano con `Object.create()`. Entender prototipos primero es lo que hace que `class`/`extends` deje de ser una caja negra cuando lo veas.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `Object.create(prototipo)` para heredar manualmente | Escribir `objeto.__proto__ = otro` a mano |
| `Object.getPrototypeOf()` / `Object.setPrototipoOf()` para leer o cambiar el prototipo | Depender de `__proto__` en código nuevo |
| Pensar en la cadena como una búsqueda que sube hasta `null` | Asumir que una propiedad heredada es una copia — es la misma referencia compartida |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Prototipos** | https://www.aprendejavascript.dev/clase/referencia-prototipo/prototipos |
| 📘 **MDN — Herencia y la cadena de prototipos** | https://developer.mozilla.org/es/docs/Web/JavaScript/Inheritance_and_the_prototype_chain |
