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
| Variables, tipos y operadores | ⏳ | Tipos (`string`, `int`, `float`, `bool`, `array`, `null`), ámbito, constantes con `define()` / `const` |
| Estructuras de control | ⏳ | `if`/`elseif`/`switch`, `while`/`do-while`/`for`/`foreach` |
| Arrays a fondo | ⏳ | Indexados, asociativos, multidimensionales, recorrido con `foreach` |
| Funciones y modularidad | ⏳ | Parámetros, valores por defecto, type hints, `declare(strict_types=1)`, `include`/`require` |
| Interacción con el usuario | ⏳ | Superglobales (`$_GET`, `$_POST`, `$_SERVER`), formularios, validación, `htmlspecialchars` |
| Cookies y sesiones | ⏳ | `setcookie()` / `$_COOKIE`, `session_start()` / `$_SESSION`, login/logout |

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/llenguatges/php](https://apunts.institutmontilivi.cat/MOD-0613/llenguatges/php/) |
| 📘 **Manual oficial de PHP** | [php.net](https://www.php.net/manual/es/) — URL directa a cada función: `php.net/strtolower` |
| ⚡ **DevDocs — PHP** | [devdocs.io/php](https://devdocs.io/php/) — búsqueda rápida, funciona offline |
