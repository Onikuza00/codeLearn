# Constructores { .bloque-js }

> Una función constructora crea múltiples objetos con la misma estructura, sin repetir el literal `{ }` cada vez. Es el mecanismo que existía antes de `class` — y `class` sigue siendo, por debajo, esto mismo con otra sintaxis.

---

## Función constructora {: .topic-title }

Una función normal, invocada con `new`. Por convención se escribe con mayúscula inicial, para distinguirla de una función normal a simple vista.

```js
function Persona(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
}

const ana = new Persona("Ana", 25);
const carlos = new Persona("Carlos", 30);
```

---

## `this` dentro del constructor {: .topic-title }

Dentro de una función constructora, `this` es una referencia al objeto que se está creando en ESA llamada. Cada `new Persona(...)` tiene su propio `this` — por eso `ana` y `carlos` no comparten valores.

---

## Qué hace `new` {: .topic-title }

Al llamar una función constructora con `new`, JavaScript hace automáticamente cuatro cosas:

1. Crea un objeto vacío (`this = {}`).
2. Enlaza su prototipo (`this.__proto__ = Persona.prototype`).
3. Ejecuta el código de la función con ese `this`.
4. Devuelve `this` — no hace falta un `return` explícito.

---

## `prototype` {: .topic-title }

Toda función constructora tiene una propiedad `prototype`. Ahí van los métodos que van a compartir TODAS las instancias, en vez de definirlos dentro del constructor.

```js
function Coche(marca, modelo) {
    this.marca = marca;
    this.modelo = modelo;
}

Coche.prototype.acelerar = function () {
    console.log(`${this.marca} ${this.modelo} está acelerando`);
};

const coche1 = new Coche("Toyota", "Corolla");
coche1.acelerar();   // "Toyota Corolla está acelerando"
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-constructor-prototype"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-constructor-prototype");
    if (!el) return;
    function Coche(marca, modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }
    Coche.prototype.acelerar = function () {
        return this.marca + " " + this.modelo + " está acelerando";
    };
    var coche1 = new Coche("Toyota", "Corolla");
    el.innerHTML = "<div>coche1.acelerar() → " + coche1.acelerar() + "</div>";
})();
</script>

!!! danger "Método en el constructor = una copia por instancia"
    ```js
    // ❌ Ineficiente — cada instancia crea SU PROPIA copia de la función
    function Coche(marca) {
        this.marca = marca;
        this.acelerar = function () { /* ... */ };
    }

    // ✅ Eficiente — todas las instancias comparten LA MISMA función
    Coche.prototype.acelerar = function () { /* ... */ };
    ```
    Con 1000 coches, la primera versión crea 1000 funciones idénticas en memoria. La segunda crea una sola, y todas las instancias la comparten a través de la cadena de prototipos.

---

## `prototype` vs `__proto__` {: .topic-title }

| | `prototype` | `__proto__` |
|---|---|---|
| ¿Quién lo tiene? | Solo funciones constructoras | Todos los objetos |
| ¿Para qué sirve? | Define qué métodos tendrán las instancias | Apunta al `prototype` de la función que lo creó |

```js
console.log(Coche.prototype === coche1.__proto__);   // true — apuntan a lo mismo
```

---

## Propiedades vs métodos {: .topic-title }

Regla práctica: lo que cambia entre instancias (`nombre`, `edad`) va en el constructor con `this.`; lo que se comporta igual para todas (los métodos) va en `prototype`.

```js
function Persona(nombre, edad) {
    this.nombre = nombre;   // propia de cada instancia
    this.edad = edad;
}

Persona.prototype.saludar = function () {   // compartido por todas
    console.log(`Hola, soy ${this.nombre}`);
};
```

---

## Verificar instancias {: .topic-title }

```js
coche1 instanceof Coche;         // true — ¿coche1 viene de la cadena de Coche?
coche1.constructor === Coche;    // true — ¿qué función lo construyó?
```

---

## Herencia entre constructores {: .topic-title }

```js
function Animal(nombre) {
    this.nombre = nombre;
}

function Perro(nombre, raza) {
    Animal.call(this, nombre);   // ejecuta el constructor de Animal, con el this de Perro
    this.raza = raza;
}

Perro.prototype = Object.create(Animal.prototype);
Perro.prototype.constructor = Perro;
```

`Animal.call(this, nombre)` es la parte clave: ejecuta la lógica de `Animal` pero aplicada al objeto que se está creando como `Perro`, no como un `Animal` aparte.

---

## Relación con `class` {: .topic-title }

Todo esto — `new`, `this`, `prototype`, `Animal.call(this, ...)` — es exactamente lo que `class`/`extends`/`constructor`/`super()` hacen por debajo con sintaxis más legible. Ver [Prototipos](../07-prototipos/index.md) para la cadena en la que se apoya todo esto.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Constructores con mayúscula inicial (`Persona`, no `persona`) | Llamar una función constructora sin `new` |
| Propiedades propias con `this.` dentro del constructor | Definir métodos dentro del constructor con `this.metodo = function...` |
| Métodos compartidos en `Constructor.prototype` | Repetir el mismo método en cada instancia |
| `instanceof` / `.constructor` para verificar de dónde viene un objeto | Comparar constructores a mano recorriendo `__proto__` |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Funciones constructoras e instancias** | https://www.aprendejavascript.dev/clase/referencia-prototipo/funciones-constructoras-instancias |
