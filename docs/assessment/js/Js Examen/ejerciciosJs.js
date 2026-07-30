
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
    let resultado = "";
    for (let i = 0; i < string.length; i++) {
        if (string[i] === " " && string[i - 1] === " ") {
            // salto, no hago nada
        } else {
            resultado += string[i];
        }
    }
    return resultado;
}

// ════════════════════════════════════════
// SESIÓN 27/07 — Casos lògica
// ════════════════════════════════════════

//01. contarOcurrencias
function contarOcurrencias(string, char) {
    let array = string.toLowerCase().split("");
    let cont = 0;
    for (let i = 0; i < string.length; i++) {
        if (array[i] === char.toLowerCase()) cont++;
    }
    return cont;
}


//02. numerosPares
function numerosParesd(numeros) {
    let lista = [];
    numeros.forEach(numero => {
        if (numero % 2 === 0) lista.push(numero);
    })
    return lista;
}

//03.invertirPalabras
function invertirPalabras(string) {
    return string.split(" ").reverse().join(" ");
}

//04. masFrecuentes
function masFrecuente(array) {
    let cont = 0;
    let contNuevo = 0;
    let variable = 0;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < i; j++) {
            if (array[i] === array[j]) {
                cont++;
                if (cont > contNuevo) {
                    variable = array[i];
                    contNuevo = cont;
                }
            }
        }
        cont = 0;
    }
    return variable;
}

//05. primsoHasta
function primosHasta(numero) {
    let llista = [];
    let esPrimo = true;
    for (let i = 2; i <= numero; i++) {
        for (let j = 2; j < i; j++) {
            if (i % j === 0) {
                esPrimo = false;
                break;
            }
        }
        if (esPrimo) llista.push(i);
        esPrimo = true;
    }
    return llista;
}


//06. estaOrdenado
function estaOrdenado(array) {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) return false;
    }
    return true;
}

// ════════════════════════════════════════
// SESIÓN 27/07 — Casos prácticos web
// ════════════════════════════════════════

//01. validarEmail
function validarEmail(email) {
    let arroba = email.indexOf("@");
    if (arroba === -1) return false;
    let palabra = email.slice(arroba + 1);
    return palabra.indexOf(".") !== -1;
}

//02. generarSlug
function generarSlug(texto) {
    let frase = texto.toLowerCase().trim().split(" ");
    let lista = [];
    for (let i = 0; i < frase.length; i++) {
        if (frase[i] !== "") lista.push(frase[i]);
    }
    return lista.join("-");
}

//3. FiltrarProductos
function filtrarProductos(array, texto) {
    let lista = [];
    let busqueda = texto.toLowerCase();
    array.forEach(palabra => {
        if (palabra.toLowerCase().includes(busqueda)) lista.push(palabra);
    })
    return lista;
}

//4. calcularTotalConDescuento
function calcularTotalConDescuento(precios, porcentaje) {
    let suma = 0;
    let descuento = 0;
    precios.forEach(item => suma += item)
    descuento = suma * porcentaje / 100;
    return suma - descuento;
}

//5. extraerHashtags
function extraerHashtags(texto) {
    let lista = [];
    texto.split(" ").forEach(palabras => {
        if (palabras.trim().startsWith("#")) lista.push(palabras);
    })
    return lista;
}

//6. truncarTexto
function truncarTexto(string, max) {
    let resultado = "";
    if (string.length > max)
        resultado = string.slice(0, max) + "...";
    else resultado = string;
    return resultado;
}

//07. validarContraseña
function validarContraseña(pwd) {
    let pasword = pwd.split("");
    let maj = false;
    let numero = false;
    pasword.forEach(item => {
        if ((item >= "A" && item <= "Z")) maj = true;
        else if ((item >= "0" && item <= "9")) numero = true;
    })
    return maj && numero && pwd.length >= 8;
}

//08. ordenarPorPrecio
function ordenarPorPrecio(productos) {
    let temporal;
    for (let i = 0; i < productos.length; i++) {
        for (let j = 0; j < productos.length - 1; j++) {
            if (productos[j].precio > productos[j + 1].precio) {
                temporal = productos[j];
                productos[j] = productos[j + 1];
                productos[j + 1] = temporal;
            }
        }
    }
    return productos;
}

//09.formatearFecha
function formatearFecha(dia, mes, ano) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let mesActual = meses[mes - 1];
    return `${dia} de ${mesActual} del ${ano}`;
}

//10. cobtenerIniciales
function obtenerIniciales(nombre) {
    let iniciales = [];
    nombre.split(" ").forEach(palabra => {
        iniciales.push(palabra.trim().slice(0, 1).toUpperCase());
    });
    return iniciales.join(".") + ".";
}


// ════════════════════════════════════════
// SESIÓN 28/07 — Casos lògica
// ════════════════════════════════════════

//1. Extrear dominio
function extraerDominio(email) {
    if (typeof email !== "string" || email.length === 0) return null;
    let pos = email.indexOf("@");
    if (pos === -1) return null;
    return email.slice(pos + 1);
}

//2. SlugValido
function esSlugValido(slug) {
    if (slug.length === 0) return false;
    for (let i = 0; i < slug.length; i++) {
        let c = slug[i];
        if (c >= "a" && c <= "z") continue;
        if (c >= "0" && c <= "9") continue;
        if (c === "-") continue;
        return false;
    }
    return true;
}

//3. Formatearfecha
function formatearFecha(dateString) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let fecha = dateString.split("-");
    if (fecha.length < 3) return null;
    return `${fecha[2]} de ${meses[fecha[1] - 1]} de ${fecha[0]}`;
}

//4. prdocutoMasCaro
function productoMasCaro(productos) {
    let max = 0;
    let masCaro = "";
    productos.forEach(item => {
        if (item.precio > max) {
            max = item.precio;
            masCaro = item.nombre;
        }
    });
    if (masCaro === "") return null;
    return masCaro;
}

//5. esContraseñaSegura
function esContraseñaSegura(pwd) {
    let may = false;
    let min = false;
    let num = false;
    let especial = false;
    let caracter = "@!#$%^&*()_+";

    if (pwd.length === 0) return false;
    for (let i = 0; i < array.length; i++) {
        let c = pwd[i];
        if (c >= "A" && c <= "Z") may = true;
        if (c >= "a" && c <= "z") min = true;
        if (c >= "0" && c <= "9") num = true;
        if (caracter.includes(c)) especial = true;
    }
    return may && min && num && especial && pwd.length >= 8;
}


//6. agruparPorCategoria
function agruparPorCategoria(productos) {
    let objetos = {};
    productos.forEach(item => {
        if (!objetos[item.categoria]) {
            objetos[item.categoria] = [];
        }
        objetos[item.categoria].push(item.nombre);
    })
    return objetos;

}

//7. totalCarrito
function totalCarrito(items) {
    let suma = 0;
    if (items.length === 0) return 0;

    items.forEach(producto => {
        suma += producto.precio * producto.cantidad;
    })
    if (suma > 100) return 0.90 * suma;
    return suma;
}

//8. eliminarEspacio
function eliminarEspacios(texto) {
    let resultado = "";

    for (let i = 0; i < texto.length; i++) {
        if (texto[i] !== " ") {
            // no es espacio → siempre va
            resultado += texto[i];
        } else {
            // es espacio → solo si el último de resultado NO es espacio
            if (resultado[resultado.length - 1] !== " ") {
                resultado += texto[i];
            }
        }
    }

    return resultado;
}


// ════════════════════════════════════════
// SESIÓN 30/07 — Casos lògica
// ════════════════════════════════════════


//9.frecuenciaCaracteres
function frecuenciaCaracteres(text) {
    if (text.length === 0) return null;
    let frase = {};
    let palabra = text.split("");
    for (let i = 0; i < palabra.length; i++) {
        if (palabra[i] === " ") continue;
        frase[palabra[i]] ? frase[palabra[i]]++ : frase[palabra[i]] = 1;
    }
    return frase;
}

//10. ordenarPorPrecio
function ordenarPorPrecio(productos) {
    let temporal;
    for (let j = 0; j < productos.length; j++) {
        for (let i = 1; i < productos.length; i++) {
            if (productos[i].precio < productos[i - 1].precio) {
                temporal = productos[i];
                productos[i] = productos[i - 1];
                productos[i - 1] = temporal;
            }
        }
    }
    return productos;
}


//11. agruparPorLetra
function agruparPorLetra(lista) {
    if (lista.length === 0) return null;
    let listaOrdenada = {};
    for (let i = 0; i < lista.length; i++) {
        let primerCarc = lista[i][0];
        listaOrdenada[primerCarc] ? listaOrdenada[primerCarc].push(lista[i]) : listaOrdenada[primerCarc] = [lista[i]];
    }
    return listaOrdenada;
}

//12. mediaAprobados
function mediaAprobados(estudiantes) {
    if (estudiantes.length === 0) return null;
    let aprobados = 0;
    let suma = 0;
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].nota >= 5) {
            aprobados++;
            suma += estudiantes[i].nota;
        }
    }
    if (aprobados === 0) return null;
    return suma / aprobados;
}

//13. eliminarDuplicados
function eliminarDuplicados(array) {
    let temporal = [];
    for (let i = 0; i < array.length; i++) {
        if (temporal.includes(array[i])) continue;
        temporal.push(array[i]);
    }
    return temporal;
}

//14. sumarMatriz
function sumarMatriz(matriz) {
    let suma = 0;
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            suma += matriz[i][j];
        }
    }
    return suma;
}