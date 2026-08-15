# Try/Catch { .bloque-js }

> Un error sin gestionar detiene TODA la ejecución del programa. `try`/`catch` te permite intentar código que puede fallar, capturar el fallo si ocurre, y seguir controlando qué pasa después — en vez de que la aplicación se rompa entera.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/OhE-mEt37iA?start=117" title="¡Maneja los errores de JavaScript como un senior! — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## Sintaxis {: .topic-title }

```js
try {
    // código que puede fallar
} catch (error) {
    // se ejecuta SOLO si algo dentro de try lanzó un error
}
```

Flujo real: JS intenta el `try`. Si todo va bien, `catch` se salta por completo. Si algo falla, la ejecución salta INMEDIATAMENTE a `catch` — el resto del `try` después del punto de fallo nunca se ejecuta — y el programa continúa después del bloque.

Si no necesitas los detalles del error, puedes omitir el parámetro:

```js
try {
    // ...
} catch {
    console.log("Algo falló, pero no me importa qué");
}
```

---

## El objeto error {: .topic-title }

Cuando ocurre una excepción, JS crea un objeto `Error` con información útil:

| Propiedad | Qué contiene |
|---|---|
| `name` | El tipo de error (`TypeError`, `ReferenceError`...) |
| `message` | Descripción legible de qué pasó |
| `stack` | El rastro de llamadas hasta llegar al error — para depurar |

```js
try {
    variableQueNoExiste + 5;
} catch (error) {
    console.log(error.name);      // "ReferenceError"
    console.log(error.message);   // "variableQueNoExiste is not defined"
}
```

---

## Tipos de error nativos {: .topic-title }

```js
console.log(variableQueNoExiste);   // ReferenceError — variable que no existe

const valor = null;
valor.propiedad;                    // TypeError — operación inválida sobre ese tipo
```

`SyntaxError` es distinto a los otros dos: lo detecta el motor de JS ANTES de ejecutar nada, por un error de sintaxis en el código — no se puede atrapar con `try`/`catch` en el mismo archivo, porque el archivo entero falla al parsear.

---

## Cuándo usar try/catch {: .topic-title }

**Tiene sentido para:**

- Llamadas a APIs externas (`fetch`, peticiones de red).
- Parsear JSON que puede venir mal formado (`JSON.parse`).
- Cualquier operación que puede fallar por un factor que no controlas.

**No lo uses para:**

- Controlar el flujo normal del programa.
- Validaciones simples — para eso está el `if`.
- Errores que puedes prevenir de antemano comprobando antes.

!!! danger "No abuses de try/catch"
    Si el problema es "esta propiedad puede no existir", la herramienta correcta ya la tienes: [Optional chaining](../../03-objetos/04-optional-chaining/index.md) (`?.`). Envolver un acceso a propiedad en `try`/`catch` para evitar un `TypeError` que podrías prevenir con `?.` es más código y menos claro de lo que resuelve.

---

## `finally` {: .topic-title }

Un tercer bloque opcional, después de `catch`, que **siempre se ejecuta** — haya habido error o no. Es para lo que tiene que pasar sí o sí, típicamente limpieza.

```js
try {
    // código a intentar
} catch (error) {
    // gestión de errores (opcional)
} finally {
    // esto se ejecuta SIEMPRE (opcional)
}
```

`finally` corre en los tres casos: el `try` termina bien, ocurre un error y `catch` lo gestiona, o hay un `return` dentro de `try`/`catch`. Orden real: **`try` → `catch` (si hubo error) → `finally` → el resto del código.**

No puedes usar `finally` sin `try` — pero sí puedes usar `try`/`finally` sin `catch`: si hay un error, `finally` se ejecuta igual y el error sigue propagándose después.

```js
function procesarConexion() {
    abrirConexion();
    try {
        hacerOperacion();
    } catch (error) {
        console.log("Falló:", error.message);
    } finally {
        cerrarConexion();   // se cierra SIEMPRE, haya fallado o no
    }
}
```

!!! danger "Un return en finally SOBRESCRIBE cualquier otro return"
    ```js
    function ejemplo() {
        try {
            return "desde try";
        } finally {
            return "desde finally";   // ❌ esto gana, siempre
        }
    }

    ejemplo();   // "desde finally" — el return de try nunca se ve
    ```
    Si `finally` tiene su propio `return`, anula el `return` de `try` o de `catch`, sin avisar. Evita poner `return` dentro de `finally` salvo que sea exactamente lo que quieres — casi nunca lo es.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `try`/`catch` alrededor de código que depende de algo externo (red, parseo) | `try`/`catch` para validar algo que podrías comprobar con `if` antes |
| Leer `error.message`/`error.name` para dar un mensaje útil | Atrapar el error y no hacer nada con él (`catch {}` vacío y silencioso) |
| `?.` para accesos a propiedades que pueden no existir | Envolver accesos a propiedades en `try`/`catch` en vez de usar `?.` |
| `finally` para limpieza que debe pasar siempre (cerrar, liberar, resetear) | `return` dentro de `finally` — sobrescribe silenciosamente el resultado real |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📖 **aprendejavascript.dev — Try/Catch** | https://www.aprendejavascript.dev/clase/manejo-de-errores/try-catch |
| 📖 **aprendejavascript.dev — Finally** | https://www.aprendejavascript.dev/clase/manejo-de-errores/finally |
