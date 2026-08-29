// ============================================================
// 16/08/2026 — Repaso general · SOLUCIONES
// ============================================================
// ✏️ Escribí acá tus soluciones. Guardá el archivo y recargá
// la página para ver los resultados.

// 1) formularioValido(datos)
function formularioValido(datos) {
 if(datos.nombre && datos.email && datos.password){
 let info = Object.values(datos);
 return info.every(e => e.length > 0);
 }
 else
  return false;
}

// 2) productoPorId(productos, id)
function productoPorId(productos, id) {
  return productos.find(e=> e.id === id);
}

// 3) posicionEnCarrito(carrito, id)
function posicionEnCarrito(carrito, id) {
  return carrito.findIndex(e => e.id == id) ?? -1;
}

// 4) crearContadorLikes()
function crearContadorLikes() {
  let count = 0;
  return () => ++count;
}

// 5) carrito — objeto con items y el método calcularTotal()
const carrito = {
  items: [
    { precio: 10, cantidad: 2 },
    { precio: 5, cantidad: 3 }
  ],
  calcularTotal() {
    let total = 0;
    this.items.forEach(e => {
      total+= e.precio * e.cantidad;
    })
     return total;
  }
};
window.carrito = carrito; // infraestructura del runner — no hace falta tocar esto

// 6) agregarProducto(carrito, producto)
function agregarProducto(carrito, producto) {
  return [...carrito, producto];
}

// 7) ciudadDeEnvio(pedido)
function ciudadDeEnvio(pedido) {
return pedido?.envio?.direccion?.ciudad ?? "Sin especificar";
  
}

// 8) primerosPosts(posts, n)
function primerosPosts(posts, n) {
  let array = [];
  for (let i = 0; i < n; i++) {
    if(posts[i])
    array.push(posts[i]); 
  }
  return array;
}

// 9) generarIds(cantidad)
function generarIds(cantidad) {
  let array = [];
  let suma = 0;
  for (let i = 0; i < cantidad; i++) {
    array.push(++suma);
  }
  return array;
}

// 10) aplicaDescuento(precio, esVIP, tieneCupon)
function aplicaDescuento(precio, esVIP, tieneCupon) {
  return precio > 50 && (esVIP || tieneCupon);
}

// 11) ConfiguracionInvalidaError + leerConfiguracion(json)
class ConfiguracionInvalidaError extends Error {
  constructor(mensaje) {
   super(mensaje)
   this.mensaje = mensaje;
  }
}
window.ConfiguracionInvalidaError = ConfiguracionInvalidaError; // infraestructura del runner — no hace falta tocar esto

function leerConfiguracion(json) {
  try {
      return JSON.parse(json);
    }catch(error){
      throw new ConfiguracionInvalidaError(error);
    }
}

// 12) class Producto / class ProductoDigital extends Producto
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }
  descripcion() {
    return `${this.nombre} — ${this.precio}€`;
  }
}

class ProductoDigital extends Producto {
  constructor(nombre, precio, urlDescarga) {
   super(nombre, precio);
   this.urlDescarga = urlDescarga;

  }
  descripcion() {
    return `${this.nombre} — ${this.precio}€ (descarga digital)`;
  }
}
window.ProductoDigital = ProductoDigital; // infraestructura del runner — no hace falta tocar esto
