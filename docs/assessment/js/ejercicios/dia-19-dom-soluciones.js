// ============================================================
// Día 19 — DOM · SOLUCIONES
// ============================================================
// ✏️ Escribí acá tus soluciones. Guardá el archivo y recargá
// la página para ver los resultados.

// ---------- 23/08 — Refuerzo 2 · Reincidencias ----------

// 1) validarPrecioEnRango(inputPrecio, spanError)
function validarPrecioEnRango(inputPrecio, spanError) {

}

// 2) validarTelefonoExacto(inputTelefono, spanError)
function validarTelefonoExacto(inputTelefono, spanError) {

}

// 3) activarContadorConTope(botonMas, botonMenos, spanCantidad, spanRestante, minimo, maximo)
function activarContadorConTope(botonMas, botonMenos, spanCantidad, spanRestante, minimo, maximo) {

}

// 4) alternarDetalleAccesible(boton, detalle, flecha)
function alternarDetalleAccesible(boton, detalle, flecha) {

}

// 5) activarFiltroEtiquetas(zona)
function activarFiltroEtiquetas(zona) {

}

// 6) filtrarUsuariosPorTexto(inputBusqueda, listaUsuarios, spanResultados)
function filtrarUsuariosPorTexto(inputBusqueda, listaUsuarios, spanResultados) {

}

// 7) sincronizarCheckMaestro(zona)
function sincronizarCheckMaestro(zona) {

}

// 8) marcarPestanaActiva(barraPestanas, contenedorPaneles)
function marcarPestanaActiva(barraPestanas, contenedorPaneles) {

}

// 9) activarPopoverConCierreFuera(boton, popover)
function activarPopoverConCierreFuera(boton, popover) {

}

// 10) cerrarNotificacionesYContar(zona)
function cerrarNotificacionesYContar(zona) {

}

// ---------- 23/08 — Refuerzo DOM ----------

// 1) resaltarFilaSeleccionada(tabla)
function resaltarFilaSeleccionada(tabla) {
  tabla.addEventListener("click", function(e){
    let fila = e.target.closest(".fila-tabla")
    if(!fila) return;
    tabla.querySelectorAll(".fila-tabla").forEach(x => {
      x.classList.toggle("fila--activa", x === fila)
    })
  })
}

// 2) sincronizarInterruptorTema(boton, panel)
function sincronizarInterruptorTema(boton, panel) {
  boton.addEventListener("click", function(e){
   const activo = panel.classList.toggle("tema-oscuro")
   boton.setAttribute("aria-pressed", activo)
  })

}

// 3) activarCierreAvisos(zona)
function activarCierreAvisos(zona) {
  zona.addEventListener("click", function(e){
    let btn = e.target.closest(".btn-cerrar")
    if(!btn) return;
    e.target.closest(".aviso").classList.add("hidden")
    let contador = 0
    zona.querySelectorAll(".aviso").forEach(x => {
      if(!x.classList.contains("hidden")){
      contador++
      zona.dataset.restantes = contador
      zona.querySelector("#contador-avisos-r3").textContent = contador
      }
    }) 
  })

}

// 4) ajustarTemperatura(botonSubir, botonBajar, spanValor, minimo, maximo)
function ajustarTemperatura(botonSubir, botonBajar, spanValor, minimo, maximo) {

botonSubir.addEventListener("click", function(){
  let contador = Number(spanValor.dataset.temperatura);
  contador = Math.min(maximo, contador + 1)
  spanValor.dataset.temperatura = contador
  spanValor.textContent = contador;
})

botonBajar.addEventListener("click", function(){
  let contador = Number(spanValor.dataset.temperatura);
  contador = Math.max(minimo, contador - 1)
  spanValor.dataset.temperatura = contador
  spanValor.textContent = contador;
})
}

// 5) validarCodigoPostal(inputCodigo, spanError)
function validarCodigoPostal(inputCodigo, spanError) {
  let codi = inputCodigo.value
  if((codi.length === 5) && !isNaN(codi)){
    inputCodigo.setCustomValidity(spanError.textContent ="")
  }
  else
    inputCodigo.setCustomValidity(spanError.textContent="El código postal debe tener 5 dígitos")
}

// 6) activarPanelLateral(botonAbrir, panel)
function activarPanelLateral(botonAbrir, panel) {
  document.addEventListener("click", function(e){
    let btn = botonAbrir.contains(e.target)
    if(btn) return panel.classList.toggle("hidden")

    const estaCerrado = panel.classList.contains("hidden")
    if(estaCerrado) return;

    if(panel.contains(e.target)) return;
    return panel.classList.add("hidden")
  })

}

// 7) filtrarTareasPorEstadoYTexto(inputBusqueda, selectEstado, contenedorTareas)
function filtrarTareasPorEstadoYTexto(inputBusqueda, selectEstado, contenedorTareas) {
const aplicarFiltros = () => {
  contenedorTareas.querySelectorAll(".tarea").forEach(e => {
  const titulo = e.dataset.titulo.toUpperCase().includes(inputBusqueda.value.toUpperCase())
  const estado = e.dataset.estado.toUpperCase() === selectEstado.value.toUpperCase()
  const todos = selectEstado.value.toUpperCase() === "TODOS"
  const entra = titulo && (estado || todos)
  e.classList.toggle("hidden", !entra)
  })
}
  inputBusqueda.addEventListener("input", aplicarFiltros)
  selectEstado.addEventListener("change", aplicarFiltros)
}

// 8) moverAbajo(lista)
function moverAbajo(lista) {
  lista.addEventListener("click", function(e){
    const btn = e.target.closest(".btn-bajar")
    if(!btn) return;
    const item = e.target.closest(".item-lista")
    const hermano = item.nextElementSibling
    if(!hermano) return
    lista.insertBefore(hermano, item) 
  })
}

// 9) activarValoracionEstrellas(contenedor)
function activarValoracionEstrellas(contenedor) {
  contenedor.addEventListener("click", function(e){
    const estrella = e.target.closest(".estrella")
    if(!estrella) return;
    const valor = Number(estrella.dataset.valor)

    contenedor.querySelectorAll(".estrella").forEach(x => {
      const esActivo = x.dataset.valor <= valor
      x.classList.toggle("estrella--activa", esActivo)
    })
      contenedor.dataset.valoracion = `${valor}`
      contenedor.querySelector("#texto-valoracion-r9").textContent = `${valor} de 5`
  })
}

// 10) resumirCarrito(contenedor)
function resumirCarrito(contenedor) {
  let total = 0;
  contenedor.querySelectorAll(".linea-carrito").forEach(x => { 
    let precio = Number(x.dataset.precio)
    let cantidad = Number(x.dataset.cantidad)
    total += precio * cantidad
  })
  contenedor.querySelector("#total-r10").textContent = `${total.toFixed(2)}€` 
}

// ---------- Bloque 2 — Repaso ----------

// 1) activarFiltroCategorias(contenedorBotones, contenedorProductos)
function activarFiltroCategorias(contenedorBotones, contenedorProductos) {
  contenedorBotones.addEventListener("click", function(e){
    let btn = e.target.closest(".filtro-btn")
    if(!btn) return;
    let categoria = btn.dataset.categoria
    
    contenedorBotones.querySelectorAll(".filtro-btn").forEach(x => {
      x.classList.toggle("filtro-btn--activo", x === btn)
    })

    contenedorProductos.querySelectorAll(".producto-card").forEach(n => {
      let coincide = n.dataset.categoria === categoria || categoria === "todos"
      n.classList.toggle("hidden", !coincide )
    })
  })
}

// 2) activarAcordeonExclusivo(panel)
function activarAcordeonExclusivo(panel) {
  panel.addEventListener("click", function(e){
    let faq = e.target.closest(".faq-pregunta")
    if(!faq) return;
    let expansion = faq.getAttribute("aria-expanded")
    panel.querySelectorAll(".faq-pregunta").forEach(x => {
      x.nextElementSibling.classList.add("hidden")
      x.setAttribute("aria-expanded", "false")
    })
    faq.setAttribute("aria-expanded", expansion === "false")
    faq.nextElementSibling.classList.toggle("hidden", expansion === "true")
  })
}

// 3) marcarTodosAgotados(contenedor)
function marcarTodosAgotados(contenedor) {
  contenedor.querySelectorAll(".stock-card").forEach(x => {
    if(Number(x.dataset.stock) === 0)
      x.classList.add("ring-2", "ring-amber-500")
  })
}

// 4) mostrarBarraProgresoScroll(barra, scrollY, alturaTotal)
function mostrarBarraProgresoScroll(barra, scrollY, alturaTotal) {
  let mida = Math.round((scrollY / alturaTotal) * 100)
  barra.style.width = `${mida}%` 
}

// 5) validarRangoNumerico(inputEdad, spanError)
function validarRangoNumerico(inputEdad, spanError) {
  if(Number(inputEdad.value) >= 18 && Number(inputEdad.value) <= 65){
    spanError.textContent = ""
    inputEdad.setCustomValidity(spanError.textContent)
  }else{
    spanError.textContent = "Error"
    inputEdad.setCustomValidity(spanError.textContent)
  }
}

// 6) activarDropdownConCierre(boton, menu)
function activarDropdownConCierre(boton, menu) {
boton.addEventListener("click", () =>
 menu.classList.toggle("hidden")
)
document.addEventListener("click", (e) => {
  if(menu.contains(e.target)) return;
  if(boton.contains(e.target)) return;
    menu.classList.add("hidden")
})
}

// 7) activarStepperConLimite(botonMas, botonMenos, spanCantidad, limite)
function activarStepperConLimite(botonMas, botonMenos, spanCantidad, limite) {
  botonMas.addEventListener("click", () => {
  let contador = Number(spanCantidad.dataset.cantidad)
  contador = Math.min(limite, contador + 1)
  spanCantidad.dataset.cantidad = contador
  spanCantidad.textContent = `${contador}`
  })

  botonMenos.addEventListener("click", () => {
    let contador = Number(spanCantidad.dataset.cantidad)
    contador = Math.max(0, contador - 1)
    spanCantidad.dataset.cantidad = contador
    spanCantidad.textContent = `${contador}`
  })
 
}

// 8) filtrarPorNombreOCategoria(inputBusqueda, contenedorItems)
function filtrarPorNombreOCategoria(inputBusqueda, contenedorItems) {
  inputBusqueda.addEventListener("input", function(e){
    let item = e.target.value.toLowerCase()
    contenedorItems.querySelectorAll(".item-producto").forEach(x => {
      let coincide = false;
      if(x.dataset.nombre.toLowerCase().includes(item) || x.dataset.categoria.toLowerCase().includes(item))
        coincide = true;
        x.classList.toggle("hidden", !coincide)
    })
  })

}

// 9) moverArriba(lista)
function moverArriba(lista) {
  lista.addEventListener("click", function(e){
    let btn = e.target.closest(".btn-subir")
    let item = e.target.closest(".item-lista")
    let brother = item.previousElementSibling;
    if(!btn || !brother) return;
    lista.insertBefore(item, brother)
  })
}

// 10) activarSeleccionGrid(contenedor)
function activarSeleccionGrid(contenedor) {
  let master = contenedor.querySelector("#check-maestro-repaso")

  contenedor.addEventListener("change", function(e){
      let todasMarcadas = true

      contenedor.querySelectorAll(".check-producto").forEach(x => {
        if(e.target === master)
          x.checked = master.checked
        else{
          if(!x.checked) todasMarcadas = false;
        }
      });
      if (e.target !== master) master.checked = todasMarcadas;
  })

}

// ---------- 22/08 — DOM + Tailwind ----------

// 1) renderizarProductos(contenedor, productos)
function renderizarProductos(contenedor, productos) {
  productos.forEach(box => {
  let card = document.createElement("article")
  contenedor.appendChild(card);
  card.className = "product-card"

  let titulo = document.createElement("h3")
  titulo.textContent = `${box.nombre}`
  titulo.className = "product-card-nombre"
  card.appendChild(titulo)

  let precio = document.createElement("span")
  precio.textContent = `${box.precio.toFixed(2)}€`
  precio.className = "product-card-precio"
  card.appendChild(precio)
  
  let esInferior = box.stock === 0
  let badge = document.createElement("span")
  badge.textContent = esInferior ? "Agotado" : "Disponible"
  badge.className = esInferior ? "stock-badge bg-red-100 text-red-700" : "stock-badge bg-green-100 text-green-700"
  card.appendChild(badge)
  }) 
}

// 2) activarSeleccionMasiva(contenedorTabla)
function activarSeleccionMasiva(contenedorTabla) {
  let inputs = contenedorTabla.querySelectorAll(".check-fila")
  let master = contenedorTabla.querySelector("#check-todos")
 
  contenedorTabla.addEventListener("change", function(e){
     let todos = true;
    if(e.target === master){
      inputs.forEach(box => box.checked = todos)
    }
    else{
      inputs.forEach(box => {
      if(!box.checked) todos = false;
  })
    master.checked = todos;
    }
  })
}

// 3) marcarPrimeraTarjetaAgotada(contenedor)
function marcarPrimeraTarjetaAgotada(contenedor) {
  let unica = true;
  contenedor.querySelectorAll(".stock-card").forEach(card => {
    if(card.dataset.stock == 0 && unica){
      card.classList.add("ring-2", "ring-red-500");
      unica = false;
    }
  })
}

// 4) mostrarTooltipEnCursor(tooltip, evento)
function mostrarTooltipEnCursor(tooltip, evento) {
tooltip.classList.remove("hidden")
tooltip.style.left = evento.clientX + "px";
tooltip.style.top = evento.clientY + "px";
}

// 5) validarLongitudUsuario(inputUsuario, spanAyuda)
function validarLongitudUsuario(inputUsuario, spanAyuda) {
  if(inputUsuario.value.length < 4 || inputUsuario.value.length > 12){
    inputUsuario.setCustomValidity("Campo invàlido");
    spanAyuda.textContent = "Campo invàlido"
  }
  else{
    inputUsuario.setCustomValidity("")
    spanAyuda.textContent = ""
  }
}

// 6) activarAcordeon(panel)
function activarAcordeon(panel) {
  panel.addEventListener("click", function(e){
    if(e.target.classList.contains("faq-pregunta")){
      e.target.ariaExpanded = !e.target.nextElementSibling.classList.toggle("hidden");   
    }
})
}

// 7) filtrarListaEnVivo(inputBusqueda, contenedorItems)
function filtrarListaEnVivo(inputBusqueda, contenedorItems) {
  inputBusqueda.addEventListener("input",function(e){
    let valor = e.target.value.toLowerCase();
      contenedorItems.querySelectorAll(".item-lista").forEach(x => {
        x.dataset.nombre.toLowerCase().includes(valor) ? x.classList.remove("hidden") : x.classList.add("hidden")
      })
  })

}

// 8) activarStepperCarrito(botonMas, botonMenos, spanCantidad)
function activarStepperCarrito(botonMas, botonMenos, spanCantidad) {
  let num = Number(spanCantidad.textContent)
  botonMas.addEventListener("click", function(e){ 
      num++;
      spanCantidad.textContent = num;
  })
  botonMenos.addEventListener("click", function(e){ 
    if(num > 0){
      num--;
      spanCantidad.textContent = num;
      }
  })
}

// 9) activarCierreModalFuera(modal)
function activarCierreModalFuera(modal) {
  modal.addEventListener("click", function(e){
    if(e.target == modal){
      e.target.classList.add("hidden")
    }
  })
}

// 10) activarDragReordenable(lista)
function activarDragReordenable(lista) {
  let item = null;
  lista.addEventListener("dragstart", function(e){
    item = e.target;
  })
  lista.addEventListener("drop", function(e){
    lista.insertBefore(item,e.target)
  })
  lista.addEventListener("dragover", (e) => e.preventDefault())


}

// ---------- Grupo 1 — Selección ----------

// 1) textoBadge(tarjeta, alternativo)
function textoBadge(tarjeta, alternativo) {
 let badge = tarjeta.querySelector(".badge")
 return badge ? badge.textContent : alternativo;
}

// 2) productosVisibles(lista)
function productosVisibles(lista) {
  let filtro = lista.querySelectorAll(".producto")
  let listaNueva = [...filtro].filter(e => !e.classList.contains("oculto"))
  return listaNueva.map(e => e.textContent)
}

// 3) siguienteItem(menu)
function siguienteItem(menu) {
  let opcion = menu.querySelector(".activo")
  if(menu.lastElementChild === opcion || !opcion) return null
  let hermano = opcion.nextElementSibling
    return hermano.textContent
}

// ---------- Grupo 2 — Manipulación ----------

// 4) mostrarNombreUsuario(parrafo, nombre)
function mostrarNombreUsuario(parrafo, nombre) {
  parrafo.textContent = nombre;
}

// 5) datosProductoCard(tarjeta)
function datosProductoCard(tarjeta) {
  let precio = parseFloat(tarjeta?.dataset?.precio)
  let categoria = tarjeta?.dataset?.categoria
  let stock = parseInt(tarjeta?.dataset?.stock)
  const producto = {precio: precio, categoria: categoria, stock: stock}
  return producto; 
}

// 6) alternarFavorito(boton)
function alternarFavorito(boton) {
  boton.classList.toggle("like")
  return boton.classList.contains("like");
}


// 7) agregarTarea(lista, texto)
function agregarTarea(lista, texto) {
  const item = document.createElement("li");
  item.textContent = texto;
  lista.appendChild(item)
  return lista.querySelectorAll("li").length;
  
}

// 8) eliminarTarea(lista, texto)
function eliminarTarea(lista, texto) {
  const items = lista.querySelectorAll("li")
  items.forEach(e => {
    if(e.textContent === texto){
       e.remove()
    }
  })
  return lista.children.length;
}

// ---------- Grupo 3 — Eventos ----------

// 9) evitarNavegacion(enlace)
function evitarNavegacion(enlace) {
  enlace.addEventListener("click", function(e){
    e.preventDefault();
  })
}

// 10) activarDelegacionTareas(lista)
function activarDelegacionTareas(lista) {
  lista.addEventListener("click", function(e){
    e.target.classList.toggle("done");
  })
}

// 11) activarEnvioConEnter(input, alEnviar)
function activarEnvioConEnter(input, alEnviar) {
  input.addEventListener("keydown", function(e){
   if(e.key === "Enter") alEnviar(input.value);
  })}

// 12) activarArrastre(tarjeta)
function activarArrastre(tarjeta) {
  let arrastrar = false;
  tarjeta.addEventListener("mousedown", () => { arrastrar = true })
  tarjeta.addEventListener("mousemove", function(e){
    if(!arrastrar) return;
      tarjeta.style.left = e.clientX + "px";
      tarjeta.style.top = e.clientY + "px";
  })
  tarjeta.addEventListener("mouseup", () => { arrastrar = false })
}

// 13) activarContadorCaracteres(input, contador)
function activarContadorCaracteres(input, contador) {
  input.addEventListener("input", function(e){
    return contador.textContent = input.value.length;
   })
}

// ---------- Grupo 4 — Formularios ----------

// 14) datosFormulario(formulario)
function datosFormulario(formulario) {
  const datos = new FormData(formulario);
  return Object.fromEntries(datos);
}

// 15) validarConfirmacionEmail(email, confirmarEmail)
function validarConfirmacionEmail(email, confirmarEmail) {
    if (email.value !== confirmarEmail.value) {
       confirmarEmail.setCustomValidity('Las contraseñas no coinciden');
    }
    else  confirmarEmail.setCustomValidity(''); 
}


