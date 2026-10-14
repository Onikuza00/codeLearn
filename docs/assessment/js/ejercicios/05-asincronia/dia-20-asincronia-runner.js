// ============================================================
// Día 20 — Asincronía · RUNNER
// Ejecuta las soluciones de dia-20-asincronia-soluciones.js
// y actualiza la página (badges, estado y contadores del día).
// ============================================================

// Añadir aquí cada ejercicio del bloque en curso (mismo formato que dia-11-callbacks-closures-runner.js)
const EJERCICIOS = [
  {
    fn: 'pedirUsuario',
    type: 'promise',
    tests: [
      { args: [3], expectRejected: false, expected: { id: 3, nombre: 'Usuario 3' } },
      { args: [0], expectRejected: true, expectedMessage: 'id inválido' }
    ]
  },
  {
    fn: 'mostrarUsuario',
    type: 'promise',
    tests: [
      { args: [3], expectRejected: false, expected: 'Bienvenido, Usuario 3' },
      { args: [-1], expectRejected: true, expectedMessage: 'No se pudo cargar el usuario' }
    ]
  },
  {
    fn: 'procesarPedido',
    type: 'promise',
    tests: [
      { args: [[{ precio: 10 }, { precio: 5 }]], expectRejected: false, expected: 'Pedido confirmado por 15€' },
      { args: [[]], expectRejected: true, expectedMessage: 'Carrito vacío' }
    ]
  },
  {
    fn: 'pedirConFallback',
    type: 'promise',
    tests: [
      { args: [3], expectRejected: false, expected: { id: 3, nombre: 'Usuario 3' } },
      { args: [-1], expectRejected: false, expected: { id: null, nombre: 'Invitado' } }
    ]
  },
  {
    fn: 'buscarProductos',
    type: 'promise',
    tests: [
      { args: ['taza'], expectRejected: false, expected: ['taza A', 'taza B'] },
      { args: [''], expectRejected: false, expected: [] }
    ]
  },
  {
    fn: 'obtenerUsuarioConCache',
    type: 'promise',
    tests: [
      { args: [7, { 7: { id: 7, nombre: 'Ana' } }], expectRejected: false, expected: { id: 7, nombre: 'Ana' } },
      { args: [3, {}], expectRejected: false, expected: { id: 3, nombre: 'Usuario 3' } }
    ]
  },
  {
    fn: 'cargarDashboard',
    type: 'promise',
    tests: [
      { args: [], expectRejected: false, expected: { nombre: 'Pau', pedidos: 2, totalGastado: 55 } }
    ]
  },
  {
    fn: 'cargarCarrito',
    type: 'promise',
    tests: [
      { args: [[1, 3]], expectRejected: false, expected: [{ id: 1, nombre: 'Producto 1', precio: 10 }, { id: 3, nombre: 'Producto 3', precio: 30 }] },
      { args: [[]], expectRejected: false, expected: [] }
    ]
  },
  {
    fn: 'cargarWidgets',
    type: 'promise',
    tests: [
      { args: [], expectRejected: false, expected: [
        { nombre: 'clima', estado: 'ok', datos: { temperatura: 22 } },
        { nombre: 'noticias', estado: 'error', datos: null },
        { nombre: 'bolsa', estado: 'ok', datos: { indice: 1050 } }
      ] }
    ]
  },
  {
    fn: 'cargarConLimite',
    type: 'promise',
    tests: [
      { label: 'peticionRapida(), 1000', args: () => [peticionRapida(), 1000], expectRejected: false, expected: { cargando: false, error: null, datos: 'Datos cargados' } },
      { label: 'peticionLenta(), 300', args: () => [peticionLenta(), 300], expectRejected: false, expected: { cargando: false, error: 'Tiempo agotado', datos: null } },
      { label: 'peticionFallida(), 1000', args: () => [peticionFallida(), 1000], expectRejected: false, expected: { cargando: false, error: 'Error 500', datos: null } }
    ]
  }
];

// Comparación profunda basada en JSON.stringify con chequeo de tipo.
// Maneja undefined de forma especial.
function ordenarClaves(v) {
  if (Array.isArray(v)) return v.map(ordenarClaves);
  if (v && typeof v === 'object') {
    return Object.keys(v).sort().reduce((acc, k) => {
      acc[k] = ordenarClaves(v[k]);
      return acc;
    }, {});
  }
  return v;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (a === undefined || b === undefined) return a === b;
  if (typeof a !== typeof b) return false;
  return JSON.stringify(ordenarClaves(a)) === JSON.stringify(ordenarClaves(b));
}

// Formatea un argumento para mostrarlo legible en el panel.
function fmtValue(v) {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'function') return 'ƒ';
  if (typeof v === 'string') return '"' + v + '"';
  if (Array.isArray(v)) return '[' + v.map(fmtValue).join(', ') + ']';
  if (typeof v === 'object') {
    return '{' + Object.keys(v).map(k => k + ': ' + fmtValue(v[k])).join(', ') + '}';
  }
  return String(v);
}

// Ejecuta un test 'direct': llama fn con los args y compara contra expected.
function runDirect(ej, fn, test) {
  const argsTxt = test.args.map(fmtValue).join(', ');
  try {
    const resultado = fn.apply(null, test.args);
    const ok = deepEqual(resultado, test.expected);
    return {
      ok,
      html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(resultado) +
        (ok ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(test.expected) + '</span>') +
        '</div>'
    };
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' };
  }
}

// Ejecuta un test 'sequence': crea el closure una vez, lo llama N veces en orden.
function runSequence(ej, fn, test) {
  const argsTxt = test.args.map(fmtValue).join(', ');
  let closure;
  try {
    closure = fn.apply(null, test.args);
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error al crear el closure: ' + (e.message || 'error desconocido') + '</div>' };
  }
  if (typeof closure !== 'function') {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') no devolvió una función</div>' };
  }

  let ok = true;
  let html = '<div class="line">const g = ' + ej.fn + '(' + argsTxt + ')</div>';
  test.calls.forEach(call => {
    const callArgs = typeof call === 'object' && call.callArgs ? call.callArgs : [];
    const expected = typeof call === 'object' && call.callArgs ? call.expected : call;
    const callTxt = callArgs.map(fmtValue).join(', ');
    let resultado, error = null;
    try {
      resultado = closure.apply(null, callArgs);
    } catch (e) {
      error = e.message || 'error desconocido';
    }
    if (error !== null) {
      ok = false;
      html += '<div class="line" style="color:#ef4444;">💥 g(' + callTxt + ') → 💥 Error: ' + error + '</div>';
      return;
    }
    const callOk = deepEqual(resultado, expected);
    if (!callOk) ok = false;
    html += '<div class="line">g(' + callTxt + ') → tu resultado: ' + fmtValue(resultado) +
      (callOk ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(expected) + '</span>') +
      '</div>';
  });
  return { ok, html };
}

// Ejecuta un test 'promise': llama fn con los args y espera a que la promesa se cumpla o rechace.
function runPromise(ej, fn, test) {
  const args = typeof test.args === 'function' ? test.args() : test.args;
  const argsTxt = test.label || args.map(fmtValue).join(', ');
  let resultado;
  try {
    resultado = fn.apply(null, args);
  } catch (e) {
    return Promise.resolve({ ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' });
  }
  if (!resultado || typeof resultado.then !== 'function') {
    return Promise.resolve({ ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') no devolvió una promesa</div>' });
  }
  return resultado.then(
    valor => {
      if (test.expectRejected) {
        return { ok: false, html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(valor) + ' <span class="bad">❌ Se esperaba que rechazara</span></div>' };
      }
      const ok = deepEqual(valor, test.expected);
      return { ok, html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(valor) +
        (ok ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(test.expected) + '</span>') + '</div>' };
    },
    error => {
      if (!test.expectRejected) {
        return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') rechazó cuando debía cumplirse: ' + (error && error.message) + '</div>' };
      }
      const msg = error && error.message;
      const ok = msg === test.expectedMessage;
      return { ok, html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → rechazó con: "' + msg + '"' +
        (ok ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado mensaje: "' + test.expectedMessage + '"</span>') + '</div>' };
    }
  );
}

function setStatus(exEl, badge, status, text) {
  exEl.removeAttribute('data-done');
  exEl.removeAttribute('data-review');
  exEl.removeAttribute('data-pending');
  if (status) exEl.setAttribute(status, '');
  badge.textContent = text;
  if (status === 'data-done') {
    badge.className = 'ex-status done';
  } else if (status === 'data-review') {
    badge.className = 'ex-status review';
  } else {
    badge.className = 'ex-status pending';
  }
}

async function ejecutarTodo() {
  for (const ej of EJERCICIOS) {
    const panel = document.querySelector('.ex-result[data-fn="' + ej.fn + '"]');
    if (!panel) continue;
    const exEl = panel.closest('.ex');
    const badge = exEl.querySelector('.ex-status');
    const fn = window[ej.fn];

    // Función no escrita todavía
    if (typeof fn !== 'function') {
      panel.innerHTML = '⚠️ Aún no has escrito <code>' + ej.fn + '()</code> en dia-20-asincronia-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abre ese archivo, escribe tu función y recarga la página.</div>';
      continue;
    }

    // Ejecutar cada test
    let aprobados = 0;
    let html = '';
    for (const test of ej.tests) {
      const resultado = ej.type === 'promise'
        ? await runPromise(ej, fn, test)
        : (ej.type === 'sequence' ? runSequence(ej, fn, test) : runDirect(ej, fn, test));
      if (resultado.ok) aprobados++;
      html += resultado.html;
    }

    panel.innerHTML = html;

    // Estado del ejercicio
    const total = ej.tests.length;
    if (aprobados === total) {
      setStatus(exEl, badge, 'data-done', '✅ Completado');
    } else if (aprobados > 0) {
      setStatus(exEl, badge, 'data-review', '🔁 Repasar');
    } else {
      setStatus(exEl, badge, 'data-pending', '⏳ Pendiente');
    }
  }

  // Contadores por card
  document.querySelectorAll('.exercise-card').forEach(card => {
    const done = card.querySelectorAll('.ex[data-done]').length;
    const review = card.querySelectorAll('.ex[data-review]').length;
    const pending = card.querySelectorAll('.ex:not([data-done]):not([data-review])').length;
    const set = (sel, val) => {
      const el = card.querySelector(sel);
      if (el) el.textContent = val;
    };
    set('[data-count-done]', done);
    set('[data-count-review]', review);
    set('[data-count-pending]', pending);
  });
}

document.addEventListener('DOMContentLoaded', ejecutarTodo);
