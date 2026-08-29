# Errores personalizados { .bloque-js }

> Un error personalizado es uno que TÚ creas y lanzas a propósito, cuando detectas una condición inválida — en vez de esperar a que JavaScript lance uno genérico por su cuenta.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/OhE-mEt37iA?start=117" title="¡Maneja los errores de JavaScript como un senior! — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## `throw` {: .topic-title }

`throw` lanza un error manualmente. En cuanto se ejecuta, JS detiene el código y busca el `catch` más cercano.

```js
throw new Error("mensaje descriptivo");
```

```js
function buscarUsuario(nombre) {
    const usuario = usuarios.find(u => u.nombre === nombre);
    if (!usuario) {
        throw new Error(`El usuario ${nombre} no fue encontrado`);
    }
    return usuario;
}
```

---

## Crear una instancia de `Error` {: .topic-title }

Lo mínimo es `new Error("...")`. JS también trae tipos nativos más específicos — `TypeError`, `RangeError`, `ReferenceError` — para lanzar el que mejor describa el problema.

```js
if (typeof edad !== "number") {
    throw new TypeError("edad debe ser un número");
}
```

---

## Clases de error personalizadas {: .topic-title }

Extender `Error` con `class` te da un tipo de error propio del dominio de tu aplicación, con datos extra además del mensaje.

```js
class ErrorValidacion extends Error {
    constructor(campo, valor) {
        super(`Error de validación en el campo '${campo}': ${valor}`);
        this.name = "ErrorValidacion";
        this.campo = campo;
        this.valor = valor;
    }
}

throw new ErrorValidacion("edad", -5);
```

- `super(mensaje)` pasa el mensaje al constructor de `Error` — ver [Herencia](../../03-objetos/10-herencia-clases/index.md).
- `this.name` identifica el tipo, en vez de mostrar siempre `"Error"` genérico.
- Las propiedades extra (`campo`, `valor`) viajan pegadas al error, listas para usarse en el `catch`.

---

## Distinguir tipos de error {: .topic-title }

Con `instanceof` puedes reaccionar distinto según qué tipo de error atrapaste:

```js
try {
    validarFormulario(datos);
} catch (error) {
    if (error instanceof ErrorValidacion) {
        console.log(`Campo inválido: ${error.campo}`);
    } else {
        throw error;   // no es tuyo, déjalo propagarse
    }
}
```

!!! tip "Si no reconoces el error, no lo trague — vuelve a lanzarlo"
    `throw error` dentro de un `catch` reenvía el error hacia arriba. Atrapar un error que no sabes manejar y no hacer nada con él (o no relanzarlo) es peor que no atraparlo — lo esconde en silencio.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Mensajes específicos y con contexto (`campo`, `valor` recibido) | Mensajes genéricos tipo `"Error"` sin información útil |
| Clases de error propias para fallos de validación o estado inconsistente de tu dominio | Usar errores personalizados para controlar el flujo normal del programa |
| `instanceof` para distinguir qué tipo de error atrapaste | Tratar todos los errores igual en un `catch` genérico |
| Relanzar (`throw error`) lo que no sabes manejar | Atrapar un error, no hacer nada, y dejar que el fallo pase desapercibido |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Custom Errors** | https://www.aprendejavascript.dev/clase/manejo-de-errores/custom-errors |
