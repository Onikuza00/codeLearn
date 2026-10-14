// ============================================================
// Día 20 — Asincronía · SOLUCIONES
// ============================================================
// ✏️ Escribe aquí tus soluciones. Guarda el archivo y recarga
// la página para ver los resultados.

function pedirUsuario(id) {
    const promise = new Promise ((resolve, reject) => {
        setTimeout(() => {
            if(id > 0)
                resolve({ id, nombre: 'Usuario ' + id })
            else
                reject(new Error('id inválido'))
        }, 300)
    })
    return promise;
}

function mostrarUsuario(id) {
   return pedirUsuario(id)
    .then(nombre => 'Bienvenido, ' + nombre.nombre)
    .catch(error => { throw new Error('No se pudo cargar el usuario')})
}

function procesarPedido(carrito) {
   return validarCarrito(carrito)
   .then(carro => calcularTotal(carro))
   .then(total => confirmarPedido(total))
}

function pedirConFallback(id) {
    return pedirUsuario(id)
    .catch(() => perfilInvitado())
}

function buscarProductos(termino) {
    buscando = true
    return buscarEnServidor(termino)
    .catch((x) => [])
    .finally(() => buscando = false)

}

// Bloque 2 — Promesas avanzado
function obtenerUsuarioConCache(id, cache) {
     if(id in cache)
        return Promise.resolve(cache[id])
    else
        return pedirUsuario(id)
}

function cargarDashboard() {
    const promesas = [pedirPerfil(), pedirPedidos()]
    return Promise.all(promesas)
    .then(([info, pedid]) => {
        return {    nombre: info.nombre,
                    pedidos: pedid.length,
                    totalGastado: pedid.reduce((n, pedido) => n + pedido.total, 0) }
    })
}

function cargarCarrito(ids) {
    const promesas =  ids.map(x => pedirProducto(x))
    return Promise.all(promesas)
}

function cargarWidgets() {
  const nombres = ['clima', 'noticias', 'bolsa'];
  return Promise.allSettled([cargarClima(), cargarNoticias(), cargarBolsa()])
    .then(resultados => resultados.map((resultado, i) => ({
      nombre: nombres[i],
      estado: resultado.status === 'fulfilled' ? 'ok' : 'error',
      datos: resultado.status === 'fulfilled' ? resultado.value : null
    })));
}

function cargarConLimite(promesa, ms) {
    const tempo = new Promise((resolve, reject) => {
        setTimeout(() => {
           reject(new Error("Tiempo agotado"))
        }, ms)
    })
    return Promise.race([promesa, tempo])
    .then((info) => {
        return {
            cargando: false,
            error: null,
            datos: info
        }
    })
    .catch((error) => {
        return {
            cargando: false,
            error: error.message,
            datos: null
        }
    })
}
