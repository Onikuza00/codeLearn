# `this` { .bloque-js }

> `this` no apunta siempre a lo mismo — su valor depende de **cómo se llama la función**, no de dónde está escrita. Es la parte de JavaScript que más confunde a quien viene de otros lenguajes, porque en la mayoría de ellos `this`/`self` es fijo.

---

## La regla real: importa cómo se llama, no dónde se define {: .topic-title }

La misma función puede tener un `this` distinto según quién la invoque:

```js
function saludar() {
    console.log(this.nombre);
}

const persona = { nombre: "Ana", saludar };

persona.saludar();   // "Ana" — se llamó COMO MÉTODO de persona
const suelta = persona.saludar;
suelta();             // undefined (o error en modo estricto) — se llamó SUELTA, sin objeto delante
```

`saludar` es literalmente la misma función en los dos casos. Lo único que cambia es la forma de llamarla — con `objeto.metodo()` o sin objeto delante.

---

## `this` como método {: .topic-title }

El caso más común: cuando una función es la propiedad de un objeto y la llamas con `objeto.metodo()`, `this` es ESE objeto — el que está a la izquierda del punto en el momento de la llamada.

```js
const contador = {
    valor: 0,
    incrementar() {
        this.valor++;
    }
};

contador.incrementar();
contador.valor;   // 1 — this.valor === contador.valor
```

<div class="demo-box">
<p class="demo-box__label">Resultado en vivo</p>
<div id="demo-js-this-metodo"></div>
</div>

<script>
(function () {
    var el = document.getElementById("demo-js-this-metodo");
    if (!el) return;
    var contador = { valor: 0, incrementar: function () { this.valor++; } };
    contador.incrementar();
    contador.incrementar();
    el.innerHTML = "<div>contador.valor tras 2 llamadas → " + contador.valor + "</div>";
})();
</script>

---

## `this` en una función suelta {: .topic-title }

Sin un objeto delante en la llamada, `this` no apunta a nada útil: `undefined` en modo estricto (el que usan los módulos JS por defecto), o al objeto global en modo no estricto.

```js
function mostrar() {
    console.log(this);
}

mostrar();   // undefined en modo estricto
```

!!! warning "Perder el `this` es un bug clásico al pasar un método como callback"
    ```js
    const boton = { texto: "Enviar", onClick() { console.log(this.texto); } };

    elemento.addEventListener("click", boton.onClick);   // ❌ this ya no es "boton" al ejecutarse
    ```
    Al pasar `boton.onClick` como referencia (sin los paréntesis, sin el objeto), se desconecta del objeto — el motor solo ve "una función", no "un método de boton". Cuando el navegador la invoque, `this` va a depender de cómo el navegador la llame, no de dónde la sacaste. La solución típica: un arrow function que envuelva la llamada (`() => boton.onClick()`), o `.bind(boton)`.

---

## `this` en arrow functions: no tiene el suyo propio {: .topic-title }

Una arrow function NO tiene su propio `this` — usa el del contexto donde fue escrita (`this` léxico). Esto la hace ideal dentro de un método, para funciones internas que necesitan seguir viendo el mismo `this` del método que las contiene.

```js
const contador = {
    valor: 0,
    incrementarTrasEspera() {
        setTimeout(() => {
            this.valor++;   // ✅ this sigue siendo "contador" — heredado del método
        }, 1000);
    }
};
```

Si en vez de una arrow function fuera una función normal ahí dentro, `this` se perdería — la función pasada a `setTimeout` se ejecuta sin `objeto.` delante, así que caería en el mismo caso de "función suelta" de más arriba.

---

## `this` con `new` {: .topic-title }

Al llamar una función con `new`, `this` es el objeto nuevo que se está construyendo — se ve en detalle en [Constructores](../08-constructores/index.md).

```js
function Persona(nombre) {
    this.nombre = nombre;   // this = la instancia que se está creando
}

const ana = new Persona("Ana");
```

---

## Resumen: cuatro formas de invocar, cuatro `this` {: .topic-title }

| Cómo se llama | Qué es `this` |
|---|---|
| `objeto.metodo()` | El objeto a la izquierda del punto |
| `funcionSuelta()` | `undefined` (modo estricto) |
| `new Funcion()` | La instancia nueva que se crea |
| Arrow function | El `this` del contexto donde se escribió (léxico, no propio) |

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Preguntarte "¿con qué delante se está llamando esto?" antes de asumir qué es `this` | Asumir que `this` depende de dónde escribiste la función |
| Arrow functions para callbacks internos que necesitan el `this` del método que los contiene | Función normal como callback esperando que `this` "se acuerde" del objeto original |
| `.bind(objeto)` cuando pasas un método como referencia suelta (event listeners, callbacks) | Pasar `objeto.metodo` sin envolver ni hacer bind, y sorprenderte si `this` es `undefined` |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — `this`** | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this |
