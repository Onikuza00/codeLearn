# Expresiones regulares { .bloque-js }

> Una expresión regular es un patrón para buscar dentro de un texto. Tiene fama de ilegible y se la ha ganado, pero para validar un formato, extraer partes de una cadena o reemplazar con criterio no hay nada más corto.

---

## Crear una expresión regular {: .topic-title }

```js
const literal = /\d{4}-\d{2}-\d{2}/;                    // literal
const dinamica = new RegExp(`^${prefijo}\\d+$`, 'i');   // desde una cadena
```

La forma literal es la habitual. El constructor solo hace falta cuando el patrón se arma con variables.

!!! warning "En el constructor hay que escapar dos veces"
    ```js
    /\d+/                  // literal
    new RegExp('\\d+')     // cadena: la barra hay que escaparla
    ```

    En una cadena, `\d` no existe como secuencia de escape y se pierde. Hay que escribir `\\d`. Es la causa habitual de que un patrón funcione como literal y falle al construirlo dinámicamente.

    Y si el valor viene del usuario, hay que **escapar los caracteres especiales** antes de meterlo en un patrón, o un `.` o un `(` romperán la expresión.

## Los métodos {: .topic-title }

| Método | Devuelve | Para qué |
|---|---|---|
| `regex.test(texto)` | `true`/`false` | ¿Coincide? Lo más simple |
| `texto.match(regex)` | Array o `null` | La primera coincidencia con sus grupos, o todas con `g` |
| `texto.matchAll(regex)` | Iterador | Todas las coincidencias **con sus grupos**. Requiere `g` |
| `texto.replace(regex, x)` | Cadena nueva | Reemplaza la primera (o todas con `g`) |
| `texto.replaceAll(regex, x)` | Cadena nueva | Todas. **Obliga a la bandera `g`** |
| `texto.split(regex)` | Array | Partir por un patrón |
| `regex.exec(texto)` | Array o `null` | Coincidencia a coincidencia, manteniendo posición |

## Banderas {: .topic-title }

| Bandera | Qué hace |
|---|---|
| `g` | Global: busca todas, no solo la primera |
| `i` | Ignora mayúsculas y minúsculas |
| `m` | Multilínea: `^` y `$` valen por línea |
| `s` | El punto también casa con el salto de línea |
| `u` | Modo Unicode. Necesaria para emojis y `\p{...}` |

!!! danger "El bug clásico: `test()` con la bandera `g`"
    ```js
    const re = /abc/g;
    re.test('abc');   // true
    re.test('abc');   // false  ← ¡el mismo texto!
    re.test('abc');   // true
    ```

    Con `g`, la expresión guarda un `lastIndex` interno y **la siguiente llamada empieza a buscar desde ahí**. Al llegar al final devuelve `false` y reinicia el contador, así que va alternando.

    Muerde de verdad cuando la expresión está en una constante fuera de una función y se usa dentro de un bucle: valida bien una fila sí y otra no.

    **La solución:** no uses `g` con `test()`. Si la necesitas por otro motivo, crea la expresión dentro de la función o resetea `re.lastIndex = 0` antes de cada uso.

## Los símbolos que hay que reconocer {: .topic-title }

**Clases de caracteres**

| Patrón | Casa con |
|---|---|
| `.` | Cualquier carácter menos el salto de línea |
| `\d` / `\D` | Dígito / no dígito |
| `\w` / `\W` | Letra, dígito o `_` / lo contrario |
| `\s` / `\S` | Espacio en blanco / lo contrario |
| `[abc]` | Una de esas letras |
| `[^abc]` | Cualquiera **menos** esas |
| `[a-z0-9]` | Rangos |

**Cuantificadores**

| Patrón | Cuántas veces |
|---|---|
| `*` | 0 o más |
| `+` | 1 o más |
| `?` | 0 o 1 (opcional) |
| `{3}` | Exactamente 3 |
| `{2,5}` | Entre 2 y 5 |
| `{2,}` | 2 o más |

**Anclas y límites**

| Patrón | Significa |
|---|---|
| `^` | Principio del texto (o de línea con `m`) |
| `$` | Final |
| `\b` | Límite de palabra |

!!! danger "Sin `^` y `$`, validar no valida"
    ```js
    /\d{5}/.test('el código es 28001 y sobra texto');    // true
    /^\d{5}$/.test('el código es 28001 y sobra texto');  // false
    ```

    Sin anclas, la expresión busca el patrón **en cualquier parte**. Para validar que un valor **es** algo —y no que lo contiene—, las anclas no son opcionales.

## Grupos y captura {: .topic-title }

```js
const fecha = '2026-09-06';

const [, anio, mes, dia] = fecha.match(/(\d{4})-(\d{2})-(\d{2})/);
```

Los paréntesis **capturan**: cada grupo aparece en el array de resultado, a partir de la posición 1.

**Grupos con nombre**, mucho más legibles:

```js
const { groups } = fecha.match(/(?<anio>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/);
groups.anio;   // '2026'
```

Y en un reemplazo:

```js
fecha.replace(/(?<anio>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/, '$<dia>/$<mes>/$<anio>');
// '06/09/2026'
```

`(?:...)` agrupa **sin capturar**, cuando solo necesitas aplicar un cuantificador a un trozo.

## Codicioso frente a perezoso {: .topic-title }

```js
const html = '<b>hola</b> <i>adiós</i>';

html.match(/<.+>/)[0];    // '<b>hola</b> <i>adiós</i>'  ← se lo come todo
html.match(/<.+?>/)[0];   // '<b>'                        ← se para antes
```

Los cuantificadores son **codiciosos** por defecto: cogen todo lo que pueden. Añadiendo `?` se vuelven **perezosos** y paran en la primera coincidencia posible.

!!! danger "No parsees HTML con expresiones regulares"
    El ejemplo de arriba enseña por qué. El HTML puede anidarse, llevar atributos con `>` dentro de comillas y venir mal formado. Ninguna expresión regular cubre todos los casos.

    Para HTML: `DOMParser` o el propio DOM. Para JSON: `JSON.parse()`. Las expresiones regulares son para **texto plano con formato conocido**.

## Reemplazar con una función {: .topic-title }

```js
const texto = 'total: 1200 y 340';

texto.replace(/\d+/g, (n) => Number(n).toLocaleString('es-ES'));
// 'total: 1.200 y 340'
```

Cuando el reemplazo depende de lo encontrado, el segundo argumento puede ser una función que recibe la coincidencia y sus grupos.

## Casos que se repiten {: .topic-title }

```js
const espacios   = texto.replace(/\s+/g, ' ').trim();       // normalizar espacios
const soloDigitos = texto.replace(/\D/g, '');               // quedarse con números
const slug = titulo
    .normalize('NFD').replace(/[̀-ͯ]/g, '')       // quitar acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
```

!!! warning "El correo electrónico no se valida bien con una expresión regular"
    Las que circulan por internet o rechazan direcciones válidas o aceptan basura. La regla oficial es tan compleja que ninguna versión corta la cubre.

    En el navegador: `<input type="email">`. En el servidor: una comprobación laxa —que haya algo, una arroba y un punto— y **mandar un correo de verificación**. Eso es lo único que demuestra que la dirección existe de verdad.

## Depurar {: .topic-title }

**[regex101.com](https://regex101.com/)** con el sabor JavaScript seleccionado: explica cada parte del patrón, marca las coincidencias y avisa de problemas de rendimiento. Escribir una expresión no trivial sin esa herramienta es perder el tiempo.

---

## 📖 Recursos oficiales {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **MDN — Expresiones regulares** | [developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions) |
| 🔧 **regex101** | [regex101.com](https://regex101.com/) |
