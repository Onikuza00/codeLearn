// ============================================================
// Día 11 — Callbacks + Closures · SOLUCIONES
// ============================================================
// ✏️ Escribí acá tus soluciones. Guardá el archivo y recargá
// la página para ver los resultados.

// 1) ejecutarSiPositivo(numero, callback)
// Si numero > 0, ejecutá callback(numero) y devolvé su resultado. Si no, devolvé null.
// ejecutarSiPositivo(5, n => n * 2) → 10
// ejecutarSiPositivo(-3, n => n * 2) → null
function ejecutarSiPositivo(numero, callback) {
   if(numero <= 0) return null;
   return callback(numero);
}

// 2) repetir(n, callback)
// Ejecutá callback(i) para cada i desde 0 hasta n - 1, y devolvé un array con los resultados.
// repetir(3, i => i * i) → [0, 1, 4]
// repetir(0, i => i) → []
function repetir(n, callback) {
    let array = [];
    for (let i = 0; i < n; i++) {
        array.push(callback(i));
    }
    return array;
}

// 3) crearContador()
// Devolvé una función que, cada vez que la llamás, incrementa un contador interno en 1
// y devuelve el valor actualizado. Arranca en 0.
// const contar = crearContador();
// contar() → 1
// contar() → 2
function crearContador() {
    let contador = 0;
    return function(){
        contador++;
        return contador;
    };
}

// 4) crearContadorDesde(inicio)
// Igual que crearContador(), pero arranca en "inicio" en vez de 0.
// const contar = crearContadorDesde(10);
// contar() → 11
// contar() → 12
function crearContadorDesde(inicio) {
    let contador = inicio;
    return function(){
        contador++;
        return contador;
    };
}

// 5) crearMultiplicador(factor)
// Devolvé una función que reciba un número y lo multiplique por factor.
// const porTres = crearMultiplicador(3);
// porTres(4) → 12
// porTres(5) → 15
function crearMultiplicador(factor) {
    return function(numero){
        return factor * numero;
    };
}

// 6) crearAcumulador()
// Devolvé una función que reciba un número, lo sume a un total interno (arranca en 0),
// y devuelva el total actualizado.
// const acumular = crearAcumulador();
// acumular(5) → 5
// acumular(3) → 8
function crearAcumulador() {
    let contador = 0;
    return function(numero){
        contador+= numero;
        return contador;
    };
}
