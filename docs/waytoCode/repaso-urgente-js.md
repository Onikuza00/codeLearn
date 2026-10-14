# Javascript { .section-urgente }

Esta página no es teoría genérica: cada punto sale de un fallo **real**, ordenado por nivel de gravedad. Lo primero que hay que mirar al empezar una sesión de JS, antes de escribir una sola línea.

<div class="info-card" markdown="1">
**Reinicio limpio el 27/09/2026** — DOM se da por consolidado (historial completo hasta ese día en `GOTCHAS.md`, Fallos 37-67, y en las sesiones de [21/09](2026/09/semana-3/2026-09-21.md) en adelante). Los cuatro niveles se quedan como estructura fija; se van rellenando de cero con las reincidencias reales del siguiente bloque (fetch/async).
</div>

---

## Reincidencias confirmadas {: .nivel-header .nivel-header--1 data-n="01" }

Fallado más de una vez, en días distintos (o en bloques distintos de una misma sesión larga). Corregirlo una vez no ha bastado.

### `Promise.all()` / `allSettled()` devuelven un array, no un objeto

!!! success "✅ Versión correcta"
    ```js
    Promise.all([pedirPerfil(), pedirPedidos()])
        .then(([perfil, pedidos]) => {
            return { nombre: perfil.nombre, pedidos: pedidos.length }
        })
    ```

!!! failure "❌ Fallo — acceder a propiedades del array como si fuera el objeto resuelto"
    ```js
    Promise.all([pedirPerfil(), pedirPedidos()])
        .then(x => x.nombre)   // ❌ "x" es el array [perfil, pedidos], no un objeto: x.nombre es undefined
    ```
    🧠 **Lección:** `Promise.all`/`Promise.allSettled` se cumplen siempre con un **array**, en el mismo orden que las promesas de entrada — hay que desestructurarlo antes de leer sus propiedades.

!!! warning "Reincidencia 27/09"
    Mismo patrón dos veces en el mismo bloque (Promesas avanzado, sesión larga): `cargarDashboard` y `cargarCarrito`.

## El clúster "todo lo que sale del DOM es texto" {: .nivel-header .nivel-header--2 data-n="02" }

La raíz: el DOM devuelve strings, no los tipos que parecen.

*Sin entradas todavía — vacío tras el reinicio del 27/09.*

## Estado: dónde vive cada variable {: .nivel-header .nivel-header--3 data-n="03" }

Leer o declarar el estado una sola vez, cuando debería refrescarse en cada vuelta.

*Sin entradas todavía — vacío tras el reinicio del 27/09.*

## Falsos amigos de la API {: .nivel-header .nivel-header--4 data-n="04" }

Mismo nombre o forma parecida, comportamiento distinto.

*Sin entradas todavía — vacío tras el reinicio del 27/09.*

---

## :material-format-list-checks: Checklist de 60 segundos

Antes de dar cualquier función por terminada.

*Sin entradas todavía — vacío tras el reinicio del 27/09. Se rellena con checks reales según reincidan en fetch/async y lo que venga.*

---

## :material-book-open-page-variant-outline: Dónde está la teoría completa

| Tema | Enlace |
|---|---|
| Selección y `closest()` | [Selección en el DOM](/js/04-dom/01-seleccion/) |
| `classList`, `dataset`, atributos | [Manipulación del DOM](/js/04-dom/02-manipulacion/) |
| Eventos y delegación | [Eventos](/js/04-dom/03-eventos/) |
| Validación de formularios | [Formularios](/js/04-dom/03-eventos/03-pagina-formularios/) |
| Operadores, precedencia, postfix | [Operadores](/js/01-basico/02-operadores/) |
| `Math.min` / `Math.max` | [Variables y tipos](/js/01-basico/01-variables-tipos/) |
| Registro completo de fallos (hasta el reinicio) | `GOTCHAS.md` (Fallos 37-67) |
