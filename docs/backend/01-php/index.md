# PHP — Fundamentos { .section-fundamentos }

> PHP es un lenguaje de servidor para generar HTML, APIs y lógica de negocio. Symfony, Laravel y WordPress son PHP por debajo. Esta sección recoge lo básico del lenguaje que hace falta antes de tocar un framework.

---

## Para quien viene de JavaScript { .topic-title }

Las diferencias que más despistan al principio:

- Las funciones de string y array **no son métodos**: son funciones sueltas y el dato va como argumento. `strtolower($texto)`, no `$texto.toLowerCase()`.
- El **nombre** de las funciones es inconsistente por herencia histórica: `str_replace` con guion bajo, `strtolower` sin, `strpos`, `array_map`. No hay patrón — se consulta, no se memoriza.
- El **orden de argumentos** a veces está al revés que en JS: `array_map($callback, $array)` (callback primero).
- Las variables llevan `$` delante. Las constantes de clase no: `Types::DECIMAL`.

## Temario { .topic-title }

| Lección | Estado | Qué cubre |
|---|---|---|
| [Métodos básicos](01-metodos-basicos/index.md) | ✅ | Funciones nativas por tipo (strings, arrays, números, comprobaciones, depuración) — qué hacen, sintaxis y ejemplo |
| [Tipos y operadores](04-variables-tipos/index.md) | ✅ | Tipos, comillas simples vs. dobles, ámbito de función, constantes, `==` frente a `===`, `??` frente a `?:`, conversión |
| [Control de flujo](05-estructuras-control/index.md) | ✅ | `if`/`elseif`, `switch` frente a `match`, bucles, `break`/`continue` con nivel, sintaxis alternativa para plantillas |
| [Arrays](03-arrays/index.md) | ✅ | Indexados y asociativos, `foreach` y referencias, funciones de array, la familia `sort`/`usort`, multidimensionales |
| [Funciones y tipado](06-funciones-tipado/index.md) | ✅ | Valores por defecto, `declare(strict_types=1)`, nullable y union types, argumentos con nombre, `readonly`, closures y `use()`, `fn()`, callables |
| [POO](02-poo/index.md) | ✅ | Clases, propiedades y visibilidad, constructor y promoción, métodos, interfaces, `usort()` |
| [POO avanzada](07-poo-avanzada/index.md) | ✅ | Herencia, clases abstractas frente a interfaces, traits, `static`/`self` frente a `$this`, enums |
| [Namespaces y Composer](08-namespaces-composer/index.md) | ✅ | PSR-4, `namespace` y `use`, `composer.json` frente a `composer.lock`, autoload, rangos de versión |
| [Excepciones](09-excepciones/index.md) | ✅ | `try`/`catch`/`finally`, jerarquía `Throwable`, `Error` frente a `Exception`, excepciones propias, encadenado |
| [Formularios y validación](10-superglobales-formularios/index.md) | ✅ | `$_GET`/`$_POST`/`$_FILES`/`$_SERVER`, validar al entrar y escapar al salir, consultas preparadas, subida de ficheros, patrón PRG |
| [Cookies y sesiones](11-cookies-sesiones/index.md) | ✅ | `setcookie()` y sus atributos, `$_SESSION`, login/logout, fijación de sesión, `password_hash()` |

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/llenguatges/php](https://apunts.institutmontilivi.cat/MOD-0613/llenguatges/php/) |
| 📘 **Manual oficial de PHP** | [php.net](https://www.php.net/manual/es/) — URL directa a cada función: `php.net/strtolower` |
| ⚡ **DevDocs — PHP** | [devdocs.io/php](https://devdocs.io/php/) — búsqueda rápida, funciona offline |
