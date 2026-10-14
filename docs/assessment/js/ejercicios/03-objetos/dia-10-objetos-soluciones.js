// ============================================================
// Día 10 — Objetos · SOLUCIONES
// ============================================================
// ✏️ Escribí acá tus soluciones. Guardá el archivo y recargá
// la página para ver los resultados.

// 1) contarPropiedades(objeto)
// Devuelve cuántas propiedades tiene el objeto. Usá Object.keys.
// contarPropiedades({a:1, b:2, c:3}) → 3
// contarPropiedades({}) → 0
function contarPropiedades(objeto) {
    let propiedades = Object.keys(objeto);
    return propiedades.length !== 0 ? propiedades.length : 0;
}

// 2) tieneValor(objeto, valorBuscado)
// Devuelve true si algún valor del objeto es igual a valorBuscado. Usá Object.values.
// tieneValor({a:1, b:2}, 2) → true
// tieneValor({a:1, b:2}, 5) → false
function tieneValor(objeto, valorBuscado) {
    return Object.values(objeto).includes(valorBuscado);

}

// 3) clavesConValor(objeto, valorBuscado)
// Devuelve un array con las claves cuyo valor sea exactamente valorBuscado. Usá Object.entries.
// clavesConValor({a:true, b:false, c:true}, true) → ["a", "c"]
// clavesConValor({a:1, b:2}, 5) → []
function clavesConValor(objeto, valorBuscado) {
    let lista = Object.entries(objeto);
    let buscados = lista.filter(([clavesConValor, valor]) => valor === valorBuscado )
    return buscados.map(([clave, valor]) => clave);
}

// 4) datosPersona(persona)
// Recibe { nombre, edad }. Si no tiene edad, usá 30 por defecto.
// Devuelve `${nombre} tiene ${edad} años`. Usá destructuring con valor por defecto.
// datosPersona({nombre:"Pau", edad:24}) → "Pau tiene 24 años"
// datosPersona({nombre:"Ana"}) → "Ana tiene 30 años"
function datosPersona(persona) {
    const { nombre, edad = 30} = persona;
    return `${nombre} tiene ${edad} años`;
}

// 5) ciudadSegura(persona)
// Devuelve persona.direccion.ciudad. Si no tiene direccion, devolvé "Desconocida".
// Usá optional chaining ?.
// ciudadSegura({direccion:{ciudad:"Girona"}}) → "Girona"
// ciudadSegura({nombre:"Pau"}) → "Desconocida"
function ciudadSegura(persona) {
    return  persona?.direccion?.ciudad ?? "Desconocida";

}

// 6) actualizarEdad(persona, nuevaEdad)
// Devuelve un objeto NUEVO igual a persona pero con edad actualizada. NO mutes persona.
// Usá spread.
// actualizarEdad({nombre:"Pau", edad:24}, 25) → {nombre:"Pau", edad:25}
// actualizarEdad({nombre:"Ana", edad:30}, 31) → {nombre:"Ana", edad:31}
function actualizarEdad(persona, nuevaEdad) {
    return {...persona, edad: nuevaEdad};

}

// ============================================================
// PROYECTO — Sistema de puntuación con objetos
// ============================================================

// P1) sumarPuntos(sistema, jugador, puntos)
// Devuelve un sistema NUEVO con los puntos de jugador incrementados.
// Si el jugador no existe todavía, se crea arrancando en 0. NO mutes sistema.
// sumarPuntos({ana:15}, "ana", 5) → {ana:20}
// sumarPuntos({ana:15}, "bruno", 5) → {ana:15, bruno:5}
function sumarPuntos(sistema, jugador, puntos) {
    let player = (sistema[jugador] ?? 0) + puntos;
    return {...sistema, [jugador] : player};
}

// P2) jugadorGanador(sistema)
// Devuelve el nombre del jugador con más puntos. Si el sistema está vacío, null.
// jugadorGanador({ana:15, bruno:22, carla:8}) → "bruno"
// jugadorGanador({}) → null
function jugadorGanador(sistema) {
    let players = Object.entries(sistema);
    if(players.length === 0) return null;
    let ganador = players.reduce((mejor, i) => i[1] > mejor[1] ? i : mejor );
    return ganador[0];

}

// P3) promedioPuntos(sistema)
// Devuelve el promedio de puntos de todos los jugadores. Si está vacío, 0.
// promedioPuntos({ana:10, bruno:20}) → 15
// promedioPuntos({}) → 0
function promedioPuntos(sistema) {
    let puntos = Object.values(sistema);
    if(puntos.length === 0) return 0;
    
    let puntuacion = puntos.reduce((acum, i) => acum+= i,0);
    return puntuacion / puntos.length;
}
   

// P4) perfilJugador(jugador)
// Recibe { nombre, puntos, equipo } (equipo es opcional).
// Devuelve "nombre: puntos pts (equipo)", o "(sin equipo)" si no tiene equipo.
// perfilJugador({nombre:"Ana", puntos:15, equipo:"Rojo"}) → "Ana: 15 pts (Rojo)"
// perfilJugador({nombre:"Bruno", puntos:22}) → "Bruno: 22 pts (sin equipo)"
function perfilJugador(jugador) {
    let {nombre, puntos, equipo = "sin equipo"} = jugador;
    return `${nombre}: ${puntos} pts (${equipo})`;

}
