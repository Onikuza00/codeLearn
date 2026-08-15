// ============================================================
// Día 13 — Métodos Avanzados · SOLUCIONES
// ============================================================
// ✏️ Escribí acá tus soluciones. Guardá el archivo y recargá
// la página para ver los resultados.

// ---------- Grupo 1 — Buscar en arrays (find / some / every) ----------

// 1) hayAlgunoCaro(productos, limite)
// Array de {nombre, precio}. true si ALGÚN precio supera limite. Usá some().
// hayAlgunoCaro([{nombre:"a",precio:10},{nombre:"b",precio:50}], 30) → true
function hayAlgunoCaro(productos, limite) {
  return productos.some(e => e.precio > limite);
}

// 2) todosDisponibles(productos)
// Array de {nombre, stock}. true si TODOS tienen stock > 0. Usá every().
// todosDisponibles([{nombre:"a",stock:5},{nombre:"b",stock:2}]) → true
function todosDisponibles(productos) {
  return productos.every(e => e.stock > 0);
}

// 3) buscarPorId(usuarios, id)
// Array de {id, nombre}. Devuelve el objeto cuyo id coincide, o undefined. Usá find().
// buscarPorId([{id:1,nombre:"Ana"},{id:2,nombre:"Bruno"}], 2) → {id:2,nombre:"Bruno"}
function buscarPorId(usuarios, id) {
  return usuarios.find(e => e.id === id);
}

// 4) posicionDe(usuarios, id)
// Igual que buscarPorId, pero devuelve el índice, o -1. Usá findIndex().
// posicionDe([{id:1,nombre:"Ana"},{id:2,nombre:"Bruno"}], 2) → 1
function posicionDe(usuarios, id) {
  return usuarios.findIndex(e => e.id === id);
}

// 5) hayHuecos(array)
// Array de números. true si hay algún null/undefined mezclado. Usá some().
// hayHuecos([1, 2, null, 4]) → true
function hayHuecos(array) {
  return array.some(e => e === null || e === undefined);
}

// ---------- Grupo 2 — Valor vs. referencia ----------

// 6) duplicarPuntuacion(jugador)
// Recibe {nombre, puntos}. Devuelve un objeto NUEVO con el doble de puntos.
// NO mutes jugador. Usá spread.
// duplicarPuntuacion({nombre:"Ana", puntos:10}) → {nombre:"Ana", puntos:20}
function duplicarPuntuacion(jugador) {
return {...jugador, puntos:jugador.puntos * 2};

}

// 7) agregarItem(carrito, item)
// Devuelve un array NUEVO con item agregado. NO uses push sobre el original. Usá spread.
// agregarItem(["manzana", "pan"], "leche") → ["manzana", "pan", "leche"]
function agregarItem(carrito, item) {
  return [...carrito, item];
}

// 8) predecirValorFinal()
// Mirá el snippet del ejercicio (mutarObjeto vs mutarPrimitivo) y devolvé
// el número que predecís que imprime el console.log final.
function predecirValorFinal() {
  return 15;
}

// ---------- Grupo 3 — this ----------

// 9) crearBoton(texto)
// Devuelve { texto, onClick } donde onClick devuelve "Click en: " + texto.
// ⚠️ ESTE CÓDIGO YA TIENE UN BUG: "this perdido". Funciona si llamás
// boton.onClick(), pero revienta si sacás el método suelto:
//   const click = boton.onClick; click()
// Arreglalo con una arrow function (closure sobre "texto") o con .bind().
function crearBoton(texto) {
  return {
    texto: texto,
    onClick: () => `Click en: ${texto}`
    }
  };

// 10) crearContadorConThis()
// Devuelve { valor, incrementar } donde "incrementar" usa una arrow function
// interna que suma 1 a this.valor y devuelve el valor actualizado.
// const c = crearContadorConThis();
// c.incrementar() → 1
// c.incrementar() → 2
function crearContadorConThis() {
  return {  
    valor: 0,
    incrementar: function() {
      return (() => ++this.valor)();
    }
  }
}

// ---------- Grupo 4 — Try/Catch/Finally ----------

// 11) dividirSeguro(a, b)
// Si b es 0, lanzá un Error descriptivo y capturalo devolviendo null.
// Si no, devolvé a / b.
// dividirSeguro(10, 2) → 5
// dividirSeguro(10, 0) → null
function dividirSeguro(a, b) {
  // tu código aquí
}

// 12) parsearJSON(texto)
// Intentá JSON.parse(texto). Si falla, devolvé null en vez de romper el programa.
// parsearJSON('{"a":1}') → {a: 1}
// parsearJSON('{invalido}') → null
function parsearJSON(texto) {
  // tu código aquí
}

// 13) procesarConLimpieza(fn)
// Ejecutá fn(). Si lanza error, capturalo (resultado = null). El finally
// SIEMPRE debe marcar procesoTerminado = true. Devolvé { resultado, procesoTerminado }.
// procesarConLimpieza(() => 42) → {resultado: 42, procesoTerminado: true}
function procesarConLimpieza(fn) {
  // tu código aquí
}

// ---------- Grupo 5 — Errores personalizados ----------

// 14) class ErrorEdadInvalida extends Error
// constructor(edad): armá un mensaje descriptivo con super(mensaje) y
// guardá this.edad = edad. IMPORTANTE: super() va antes de usar this.
//
// validarEdad(edad): lanzá new ErrorEdadInvalida(edad) si edad < 0 o
// edad > 120. Si es válida, devolvé la propia edad.
class ErrorEdadInvalida extends Error {
  constructor(edad) {
    // tu código aquí
    // pista: super(mensaje) primero, después this.edad = edad
  }
}

function validarEdad(edad) {
  // tu código aquí
}

// 15) manejarValidacion(edad)
// Llamá a validarEdad(edad) en un try. Usá instanceof ErrorEdadInvalida en
// el catch para distinguirlo de cualquier otro error.
// manejarValidacion(30) → "Edad válida: 30"
// manejarValidacion(150) → "Edad inválida: <mensaje>"
function manejarValidacion(edad) {
  // tu código aquí
}
