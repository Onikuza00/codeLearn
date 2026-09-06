# Map y Set { .bloque-js }

> Un objeto sirve como diccionario, pero con limitaciones que se notan en cuanto las claves no son texto o hace falta saber cuántas hay. `Map` y `Set` son estructuras pensadas para eso, y resuelven en una línea cosas que con objetos y arrays cuestan cinco.

---

## `Map` frente a objeto {: .topic-title }

| | Objeto | `Map` |
|---|---|---|
| Tipo de clave | Solo `string` y `symbol` | **Cualquiera**: objetos, números, funciones |
| Saber cuántas hay | `Object.keys(o).length` | **`.size`** |
| Orden de las claves | Los enteros se ordenan primero | **Orden de inserción, siempre** |
| Recorrer | `Object.entries()` | Es iterable directamente |
| Claves heredadas | Hereda de `Object.prototype` | Ninguna |
| Rendimiento al añadir y borrar mucho | Peor | Mejor |

```js
const cache = new Map();

cache.set('usuario', { nombre: 'Pau' });
cache.set(42, 'la respuesta');
cache.set(document.body, 'un elemento como clave');

cache.get(42);          // 'la respuesta'
cache.has('usuario');   // true
cache.delete(42);
cache.size;             // 2
```

!!! danger "Un objeto convierte cualquier clave a texto"
    ```js
    const obj = {};
    obj[1] = 'número';
    obj['1'] = 'texto';
    console.log(obj);        // { '1': 'texto' } — se pisan

    const mapa = new Map();
    mapa.set(1, 'número');
    mapa.set('1', 'texto');
    mapa.size;               // 2 — son claves distintas
    ```

    Con objetos, `1` y `'1'` son la misma clave. Y usar un objeto como clave da directamente `[object Object]` para **todos** los objetos: se machacan entre sí.

!!! warning "El objeto trae claves heredadas de regalo"
    ```js
    const config = {};
    'toString' in config;        // true — sin haberlo puesto tú
    ```

    Con datos que vienen de fuera, una clave llamada `constructor` o `__proto__` puede provocar comportamientos raros. `Map` no hereda nada. Si necesitas un objeto plano de verdad: `Object.create(null)`.

## Recorrer un `Map` {: .topic-title }

```js
for (const [clave, valor] of cache) { ... }   // desestructurando el par

cache.forEach((valor, clave) => { ... });     // ojo: valor primero

[...cache.keys()];
[...cache.values()];
[...cache.entries()];
```

Convertir en las dos direcciones:

```js
const mapa = new Map(Object.entries(objeto));
const objeto = Object.fromEntries(mapa);
```

## `Set`: valores únicos {: .topic-title }

```js
const etiquetas = new Set(['php', 'js', 'php']);

etiquetas.size;            // 2 — el duplicado no entra
etiquetas.add('css');
etiquetas.has('js');       // true
etiquetas.delete('php');
[...etiquetas];            // ['js', 'css']
```

El uso más frecuente, eliminar duplicados de un array:

```js
const unicos = [...new Set(numeros)];
```

Y como test de pertenencia, sustituye a `includes()` con ventaja:

```js
const permitidos = new Set(['admin', 'editor']);
if (permitidos.has(rol)) { ... }
```

!!! tip "`Set.has()` frente a `array.includes()`"
    `includes()` recorre el array entero en el peor caso; `Set.has()` va directo. Con 10 elementos da igual, pero dentro de un bucle sobre miles de filas la diferencia es real.

    La regla práctica: si vas a comprobar pertenencia **muchas veces** contra la misma lista, conviértela una vez a `Set` fuera del bucle.

!!! warning "Los objetos se comparan por referencia, no por contenido"
    ```js
    const s = new Set();
    s.add({ id: 1 });
    s.add({ id: 1 });
    s.size;              // 2 — son dos objetos distintos
    ```

    `Set` no deduplica por contenido. Para eso hay que quedarse con una clave primitiva (`new Set(objetos.map(o => o.id))`) o usar un `Map` indexado por esa clave.

## Cómo compara: `SameValueZero` {: .topic-title }

Es casi `===`, con una excepción útil:

```js
new Set([NaN, NaN]).size;    // 1 — aunque NaN !== NaN
new Set([0, -0]).size;       // 1 — 0 y -0 cuentan como el mismo
```

`NaN` sí se puede encontrar en un `Set` o usar como clave de `Map`, cosa que con `indexOf()` no funciona.

## `WeakMap` y `WeakSet` {: .topic-title }

Igual que sus versiones normales, con tres diferencias:

- Las **claves solo pueden ser objetos**.
- **No son iterables** y no tienen `.size`.
- **No impiden que el recolector de basura libere la clave.**

```js
const datosPrivados = new WeakMap();

class Componente {
    constructor(elemento) {
        datosPrivados.set(elemento, { activo: false });
    }
}
```

!!! tip "Para qué sirve realmente lo «débil»"
    Si asocias datos a un elemento del DOM con un `Map` normal y ese elemento se elimina de la página, **el `Map` sigue guardando una referencia** y ni el elemento ni sus datos se liberan nunca. Eso es una fuga de memoria, y en una aplicación de larga duración se acumula.

    Con `WeakMap`, cuando el elemento desaparece, la entrada se libera sola. Es el caso de uso: **metadatos asociados a objetos con ciclo de vida propio** — nodos del DOM, instancias de componentes, cachés por objeto.

    Para todo lo demás, `Map` normal.

## Cuándo usar cada cosa {: .topic-title }

| Necesito | Uso |
|---|---|
| Estructura conocida y fija (un usuario, una configuración) | **Objeto** |
| Claves dinámicas, no textuales, o muchas altas y bajas | **`Map`** |
| Valores únicos, o comprobar pertenencia a menudo | **`Set`** |
| Datos asociados a objetos que van y vienen | **`WeakMap`** |
| Convertir a JSON | **Objeto** — `Map` y `Set` se serializan como `{}` |

!!! danger "`JSON.stringify()` ignora `Map` y `Set`"
    ```js
    JSON.stringify(new Map([['a', 1]]));   // '{}'
    JSON.stringify(new Set([1, 2, 3]));    // '{}'
    ```

    No lanza error: devuelve un objeto vacío y el dato desaparece en silencio. Antes de serializar hay que convertir: `Object.fromEntries(mapa)` o `[...conjunto]`.

---

## 📖 Recursos oficiales {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **MDN — `Map`** | [developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Map) |
| 📘 **MDN — `Set`** | [developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Set](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Set) |
| 📘 **MDN — `WeakMap`** | [developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/WeakMap](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) |
