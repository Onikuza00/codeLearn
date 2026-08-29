# Herencia { .bloque-js }

> Una clase puede heredar propiedades y métodos de otra clase "padre". Con [funciones constructoras](../08-constructores/index.md) esto se armaba a mano con `Object.create()` — con `class`, `extends` lo hace por ti.

---

## `extends` {: .topic-title }

```js
class Animal {
    constructor(nombre) {
        this.nombre = nombre;
    }

    dormir() {
        console.log(`${this.nombre} está durmiendo`);
    }
}

class Perro extends Animal {
    constructor(nombre, raza) {
        super(nombre);
        this.raza = raza;
    }

    ladrar() {
        console.log(`${this.nombre} dice: ¡Guau!`);
    }
}

const rex = new Perro("Rex", "Labrador");
rex.dormir();   // heredado de Animal
rex.ladrar();   // propio de Perro
```

---

## `super()` {: .topic-title }

Llama al `constructor` de la clase padre. Es obligatorio invocarlo ANTES de usar `this` en el constructor de la clase hija — si no, JavaScript no sabe todavía qué objeto es `this`.

```js
class Perro extends Animal {
    constructor(nombre, raza) {
        super(nombre);      // primero, siempre
        this.raza = raza;   // después de super(), ya se puede usar this
    }
}
```

`super` también sirve fuera del constructor, para llamar a un método del padre desde el método que lo sobrescribe.

---

## Sobrescribir métodos {: .topic-title }

Una clase hija puede redefinir un método heredado, y todavía llamar a la versión del padre con `super.metodo()`.

```js
class Vehiculo {
    acelerar() {
        console.log("Acelerando...");
    }
}

class Moto extends Vehiculo {
    acelerar() {
        super.acelerar();                    // ejecuta la versión del padre
        console.log("¡Haciendo caballito!");  // y le añade algo propio
    }
}

new Moto().acelerar();
// "Acelerando..."
// "¡Haciendo caballito!"
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-herencia-super"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-herencia-super");
    if (!el) return;
    var log = [];
    class Vehiculo {
        acelerar() { log.push("Acelerando..."); }
    }
    class Moto extends Vehiculo {
        acelerar() { super.acelerar(); log.push("¡Haciendo caballito!"); }
    }
    new Moto().acelerar();
    el.innerHTML = log.map(function (l) { return "<div>" + l + "</div>"; }).join("");
})();
</script>

---

## Cadenas de herencia {: .topic-title }

`extends` se puede encadenar: una clase hereda de otra que ya hereda de una tercera.

```js
class SerVivo {
    respirar() { console.log("respirando"); }
}
class Animal extends SerVivo {
    moverse() { console.log("moviéndose"); }
}
class Mamifero extends Animal {
    amamantar() { console.log("amamantando"); }
}
class Gato extends Mamifero {
    maullar() { console.log("¡Miau!"); }
}

const michi = new Gato();
michi.respirar();   // de SerVivo
michi.moverse();    // de Animal
michi.amamantar();  // de Mamifero
michi.maullar();    // propio
```

Una instancia de `Gato` tiene acceso a los métodos de TODOS sus ancestros, no solo del padre directo.

---

## Por debajo, sigue siendo prototipos {: .topic-title }

`extends`/`super()` configuran automáticamente la misma cadena de prototipos que armarías a mano con `Object.create()` y `Padre.call(this, ...)`. Ver [Prototipos](../07-prototipos/index.md) y [Constructores](../08-constructores/index.md) para el mecanismo real detrás de esta sintaxis.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `super(...)` como primera línea del constructor hijo | Usar `this` antes de llamar a `super()` |
| `super.metodo()` cuando quieras extender, no reemplazar, el comportamiento del padre | Reescribir desde cero un método que solo necesita un añadido |
| Cadenas de herencia cortas y con sentido real (`Gato extends Mamifero`) | Encadenar `extends` solo para reutilizar código sin relación conceptual real |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Herencia en clases** | https://www.aprendejavascript.dev/clase/referencia-prototipo/herencia-en-clases |
