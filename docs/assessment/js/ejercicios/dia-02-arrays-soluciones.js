// ============================================================
// Día 02 — Arrays + Métodos · SOLUCIONES
// ============================================================
// ✏️ Escribí acá tus soluciones. Guardá el archivo y recargá
// la página para ver los resultados.

// 1) dobles(numeros)
// Devuelve un array nuevo con cada número multiplicado por 2.
// dobles([1, 2, 3]) → [2, 4, 6]
// dobles([5, 0, -2]) → [10, 0, -4]
// dobles([]) → []
function dobles(numeros) {
  return numeros.map(n => n * 2)
}

// 2) preciosDe(productos)
// Array de { nombre, precio } → array nuevo solo con los precios.
// preciosDe([{nombre:"Teclado",precio:30},{nombre:"Mouse",precio:15}]) → [30, 15]
// preciosDe([]) → []
function preciosDe(productos) {
  return productos.map(n => n.precio);
}

// 3) soloPares(numeros)
// Devuelve solo los números pares, en el mismo orden.
// soloPares([1, 2, 3, 4, 5, 6]) → [2, 4, 6]
// soloPares([1, 3, 5]) → []
function soloPares(numeros) {
  return numeros.filter(n => n % 2 === 0);
}

// 4) disponibles(productos)
// Array de { nombre, stock } → solo los productos con stock mayor que 0 (objetos completos).
// disponibles([{nombre:"Mouse",stock:5},{nombre:"Teclado",stock:0}]) → [{nombre:"Mouse",stock:5}]
function disponibles(productos) {

  return productos.filter(n => n.stock > 0);
}

// 5) totalCarrito(items)
// Array de { nombre, precio, cantidad } → suma total de precio * cantidad. Si está vacío → 0.
// totalCarrito([{nombre:"Mouse",precio:25,cantidad:2},{nombre:"Teclado",precio:10,cantidad:1}]) → 60
// totalCarrito([]) → 0
function totalCarrito(items) {
  let suma = 0;
  items.forEach(n => {
    suma += n.precio * n.cantidad;
  })
  return suma;
}

// 6) promedioAprobados(estudiantes)
// Array de { nombre, nota } → promedio de notas de los que aprueban (nota >= 5). Si nadie aprueba (o array vacío) → null.
// promedioAprobados([{nombre:"Ana",nota:7},{nombre:"Luis",nota:4},{nombre:"Pau",nota:6}]) → 6.5
// promedioAprobados([{nombre:"Luis",nota:4}]) → null
function promedioAprobados(estudiantes) {
  let suma = 0;
  let cont = 0;
  estudiantes.forEach(estudi => {
    if (estudi.nota >= 5) {
      suma += estudi.nota;
      cont++;
    }
  });
  return cont === 0 ? null : suma / cont;
}

// 7) frecuenciaCaracteres(texto)
// Devuelve un objeto con la frecuencia de cada carácter del texto. Ignorá los espacios.
// frecuenciaCaracteres("hola") → {h:1,o:1,l:1,a:1}
// frecuenciaCaracteres("aab") → {a:2,b:1}
function frecuenciaCaracteres(texto) {
  let lista = {};
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === " ") continue;
    if (lista[texto[i]])
      lista[texto[i]]++;
    else
      lista[texto[i]] = 1;
  }
  return lista;
}

// 8) agruparPorLetra(palabras)
// Devuelve un objeto que agrupa las palabras por su primera letra. Cada clave es una letra, cada valor un array de palabras. Si el array está vacío → null.
// agruparPorLetra(["hola","mundo","hielo","moto"]) → {h:["hola","hielo"],m:["mundo","moto"]}
// agruparPorLetra([]) → null
function agruparPorLetra(palabras) {
  let lista = {};
  if (palabras.length === 0) return null;
  for (let i = 0; i < palabras.length; i++) {
    if (lista[palabras[i][0]])
      lista[palabras[i][0]].push(palabras[i]);
    else
      lista[palabras[i][0]] = [palabras[i]];
  }
  return lista;
}

// 9) ordenarPorPrecio(productos)
// Ordena el array de { nombre, precio } de menor a mayor precio. Modificás el mismo array y lo devolvés.
// ordenarPorPrecio([{nombre:"Mouse",precio:30},{nombre:"Teclado",precio:20}]) → [{nombre:"Teclado",precio:20},{nombre:"Mouse",precio:30}]
function ordenarPorPrecio(productos) {
  let valor = "";
  for (let i = 0; i < productos.length; i++) {
    for (let j = 0; j < productos.length - 1; j++) {
      if (productos[j].precio > productos[j + 1].precio) {
        valor = productos[j];
        productos[j] = productos[j + 1];
        productos[j + 1] = valor;
      }
    }
  }
  return productos;
}

// 10) tieneAlgo(lista)
// Devuelve true si el array tiene al menos un elemento, false si está vacío.
// tieneAlgo([1, 2]) → true
// tieneAlgo([]) → false
function tieneAlgo(lista) {
  return lista.length >= 1 ? true : false;
}

// 11) primeroSeguro(lista)
// Devuelve el primer elemento del array. Si está vacío → null.
// primeroSeguro([10, 20]) → 10
// primeroSeguro([]) → null
function primeroSeguro(lista) {
  if (lista.length === 0) return null;
  return lista[0];
}

// 12) sumarEdades(edades)
// Suma todos los números del array con reduce.
// sumarEdades([15, 22, 30]) → 67
// sumarEdades([]) → 0
function sumarEdades(edades) {
  let suma = edades.reduce((a, num) => a + num, 0);
  return suma;
}

// 13) precioTotalPerecederos(items)
// Array de { nombre, precio, tipo } → suma de precios SOLO de los de tipo "perecedero". Con reduce.
// precioTotalPerecederos([{nombre:"Manzana",precio:2,tipo:"perecedero"},{nombre:"Arroz",precio:5,tipo:"seco"}]) → 2
// precioTotalPerecederos([]) → 0
function precioTotalPerecederos(items) {
  let sumaTotal = items.reduce((acum, n) => {
    if (n.tipo === "perecedero")
      return acum + n.precio;
    return acum + 0;
  }, 0);
  return sumaTotal;
}

// 14) contarPorCategoria(productos)
// Array de { nombre, categoria } → objeto con el conteo de productos por categoría. Con reduce (acumulador = objeto, no número).
// contarPorCategoria([{nombre:"Manzana",categoria:"fruta"},{nombre:"Pan",categoria:"panaderia"},{nombre:"Banana",categoria:"fruta"}]) → {fruta:2,panaderia:1}
// contarPorCategoria([]) → {}
