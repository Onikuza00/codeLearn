// ============================================================
// Día 19 — DOM · SOLUCIONES
// ============================================================
// ✏️ Escribí acá tus soluciones. Guardá el archivo y recargá
// la página para ver los resultados.

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


