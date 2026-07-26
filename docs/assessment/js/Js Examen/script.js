
//1. sumarPares

function sumarPares(n) {
    let suma = 0;
    for (let i = 0; i <= n; i++) {
        if (i % 2 == 0) suma++;
    }
    return suma;
}

//2. Contar palabras

function contarPalabras(string) {
    let numero = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === " ") numero++;
    }
    return numero - 1;
}

//3. eliminarDuplicados

function eliminarDuplicados(array) {
    let lista = [];
    for (let i = 0; i < array.length; i++) {
        if (!lista.includes(array[i])) lista.push(array[i]);
    }
    return lista;
}

//4. stringMasLargo
function stringLargo(array) {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        if (array[i].length > string.length) string = array[i];
    }
    return string;
}


//5. esPalidormo
function esPalidormo(string) {
    if (string.split("").reverse().join("") === string) return true;
    else return false;
}

//6. filtrarMayores
function filtrarMayores(numeros, limite) {
    let array = [];
    numeros.forEach(item => {
        if (item > limite) array.push(item);
    });
    return array;
}

//7. contarLetra
function contarletra(string, letra) {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i].toLowerCase() === letra.toLowerCase()) count++;
    }
    return count;
}

//8. promedio

function promedio(numeros) {
    if (numeros.length === 0) return 0;
    let suma = 0;
    for (let i = 0; i < numeros.length; i++) {
        suma += numeros[i];
    }
    return suma / numeros.length;
};


//9. Invertir el Orden
function invertirElOrden(string) {
    return string.split("").reverse().join("");
}

//10. contarMayusculas
function contarMayusculas(string) {
    let contador = 0;
    string.split("").forEach(letra => {
        if (letra === letra.toUpperCase() && letra != " ") contador++;
    }
    );
    return contador;
};

//11. numerosImpares
function numerosImpares(n) {
    let array = [];
    for (let i = 1; i <= n; i++) {
        if (i % 2 !== 0) array.push(i);
    }
    return array;
}

//12. estaOrdenado
function estaOrdenado(array) {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) return false;
    }
    return true;
}

//13. sumarArray
function sumarArray(array) {
    let suma = 0;
    array.forEach(n => suma += n);
    return suma;
}

//14. esPrimo
function esPrimo(numero) {
    if (numero < 2) return false;
    for (let i = 2; i <= Math.sqrt(numero); i++) {
        if (numero % i == 0) return false;
    }
    return true;
}

//15. limpiarEspacios 
function limpiarEspacios(string) {
    let stringNuevo = [];
    let count = 0;
    string.split("").forEach(letra => {
        if (letra == " ") count++;
        if ((letra == " " && count < 1) || letra != " ") stringNuevo.push(letra);
    });
    return stringNuevo.join("");
}

