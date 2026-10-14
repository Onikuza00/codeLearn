// Funciones ya dadas para el Bloque 1 — Promesas. No hace falta reescribirlas, solo usarlas.

function validarCarrito(carrito) {
  return new Promise((resolve, reject) => {
    if (carrito.length > 0) {
      resolve(carrito);
    } else {
      reject(new Error('Carrito vacío'));
    }
  });
}

function calcularTotal(carrito) {
  return new Promise(resolve => {
    const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
    resolve(total);
  });
}

function confirmarPedido(total) {
  return new Promise(resolve => {
    resolve('Pedido confirmado por ' + total + '€');
  });
}

function perfilInvitado() {
  return new Promise(resolve => {
    resolve({ id: null, nombre: 'Invitado' });
  });
}

function buscarEnServidor(termino) {
  return new Promise((resolve, reject) => {
    if (termino.length > 0) {
      resolve([termino + ' A', termino + ' B']);
    } else {
      reject(new Error('Término vacío'));
    }
  });
}

let buscando = false;

// Funciones ya dadas para el Bloque 2 — Promesas avanzado.

function pedirPerfil() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ nombre: 'Pau', email: 'pau@ejemplo.com' }), 200);
  });
}

function pedirPedidos() {
  return new Promise(resolve => {
    setTimeout(() => resolve([{ id: 1, total: 20 }, { id: 2, total: 35 }]), 300);
  });
}

function pedirProducto(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, nombre: 'Producto ' + id, precio: id * 10 }), 100);
  });
}

function cargarClima() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ temperatura: 22 }), 100);
  });
}

function cargarNoticias() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Servicio caído')), 150);
  });
}

function cargarBolsa() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ indice: 1050 }), 200);
  });
}

function peticionRapida() {
  return new Promise(resolve => {
    setTimeout(() => resolve('Datos cargados'), 100);
  });
}

function peticionLenta() {
  return new Promise(resolve => {
    setTimeout(() => resolve('Datos cargados'), 2000);
  });
}

function peticionFallida() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Error 500')), 100);
  });
}
