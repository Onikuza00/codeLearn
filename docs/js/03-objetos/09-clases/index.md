# Clases { .bloque-js }

> `class` no es un sistema nuevo — es azúcar sintáctico sobre las [funciones constructoras](../08-constructores/index.md) que ya viste. No añade capacidad nueva, solo hace el mismo mecanismo más legible y agrupado.

---

## Sintaxis {: .topic-title }

```js
// Función constructora (lo que ya sabías)
function Persona(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
}
Persona.prototype.saludar = function () {
    console.log(`Hola, soy ${this.nombre}`);
};
```

```js
// Misma cosa, sintaxis de clase
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    saludar() {
        console.log(`Hola, soy ${this.nombre}`);
    }
}
```

Ambas versiones producen exactamente el mismo resultado.

---

## `constructor` {: .topic-title }

Es un método especial que se ejecuta automáticamente cada vez que haces `new`. Recibe los parámetros para inicializar la instancia.

```js
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
}

const ana = new Persona("Ana", 25);
```

---

## Miembros estáticos {: .topic-title }

Con `static`, una propiedad o método vive en la clase misma, no en las instancias — se llama sin `new`.

```js
class Matematicas {
    static PI = 3.14159;

    static sumar(a, b) {
        return a + b;
    }
}

Matematicas.sumar(5, 3);   // 8 — se llama sobre la clase

const mat = new Matematicas();
mat.sumar(1, 2);   // ❌ TypeError — sumar no existe en la instancia
```

---

## Getters y setters {: .topic-title }

Métodos que se usan como si fueran propiedades — permiten meter lógica al leer o escribir un valor, sin cambiar cómo se usa desde fuera.

```js
class Temperatura {
    constructor(celsius = 0) {
        this._celsius = celsius;
    }

    get fahrenheit() {
        return (this._celsius * 9) / 5 + 32;
    }

    set celsius(valor) {
        if (valor < -273.15) throw new Error("Por debajo del cero absoluto");
        this._celsius = valor;
    }
}

const temp = new Temperatura(25);
temp.fahrenheit;      // 77 — se lee como propiedad, no temp.fahrenheit()
temp.celsius = -300;  // ❌ Error — el setter valida antes de asignar
```

---

## Campos privados (`#`) {: .topic-title }

Desde ES2022, una propiedad o método con `#` delante NO es accesible desde fuera de la clase.

```js
class CuentaBancaria {
    #saldo = 0;

    constructor(saldoInicial) {
        this.#saldo = saldoInicial;
    }

    depositar(cantidad) {
        this.#saldo += cantidad;   // ✅ dentro de la clase, sí se puede
    }

    get saldo() {
        return this.#saldo;
    }
}

const cuenta = new CuentaBancaria(1000);
cuenta.depositar(500);
cuenta.saldo;      // 1500 — vía el getter
cuenta.#saldo;     // ❌ SyntaxError — inaccesible desde fuera
```

---

## `class` vs función constructora {: .topic-title }

| | Función constructora | `class` |
|---|---|---|
| Sintaxis | Verbosa, métodos separados en `prototype` | Agrupada, todo dentro del cuerpo |
| Hoisting | Sí | No — hay que declarar la clase antes de usarla |
| Modo estricto | Manual | Automático dentro del cuerpo de la clase |
| Por debajo | Prototipos | Prototipos — es lo mismo |

Usa `class` por defecto en código nuevo: misma base, sintaxis más clara, y mucho más simple en cuanto entra herencia.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `#propiedad` para lo que de verdad no debería tocarse desde fuera | Confiar en `_propiedad` (convención) como si fuera privacidad real |
| `static` para lo que pertenece a la clase, no a cada instancia | Poner en `static` algo que depende de una instancia concreta |
| Getters/setters cuando leer/escribir necesita lógica (validar, calcular) | Getters/setters para acceso directo sin ninguna lógica — un campo público alcanza |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Clases** | https://www.aprendejavascript.dev/clase/referencia-prototipo/clases |
