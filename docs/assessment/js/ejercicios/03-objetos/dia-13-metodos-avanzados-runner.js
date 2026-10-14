// ============================================================
// Día 13 — Métodos Avanzados · RUNNER
// Ejecuta las soluciones de dia-13-metodos-avanzados-soluciones.js
// y actualiza la página (badges, estado y contadores por card).
//
// Tipos de test:
// - 'direct'          → fn(...args) se compara directo contra expected.
// - 'immutable'        → fn(...args) devuelve algo nuevo Y args[0] no
//                         debe quedar modificado (spread vs mutación).
// - 'detach-this'       → fn(...args) devuelve un objeto con onClick; se
//                         extrae el método suelto y se llama detached()
//                         para comprobar que "this" no se perdió.
// - 'method-sequence'   → fn(...args) devuelve un objeto; se llama un
//                         método suyo varias veces en orden.
// - 'throws'            → fn(...args) puede lanzar un error a propósito;
//                         se valida la clase del error y sus props, o
//                         el valor de retorno si no debía lanzar.
// ============================================================

const EJERCICIOS = [
  {
    fn: 'hayAlgunoCaro',
    type: 'direct',
    tests: [
      { args: [[{ nombre: 'a', precio: 10 }, { nombre: 'b', precio: 50 }], 30], expected: true },
      { args: [[{ nombre: 'a', precio: 10 }, { nombre: 'b', precio: 20 }], 30], expected: false }
    ]
  },
  {
    fn: 'todosDisponibles',
    type: 'direct',
    tests: [
      { args: [[{ nombre: 'a', stock: 5 }, { nombre: 'b', stock: 2 }]], expected: true },
      { args: [[{ nombre: 'a', stock: 5 }, { nombre: 'b', stock: 0 }]], expected: false }
    ]
  },
  {
    fn: 'buscarPorId',
    type: 'direct',
    tests: [
      { args: [[{ id: 1, nombre: 'Ana' }, { id: 2, nombre: 'Bruno' }], 2], expected: { id: 2, nombre: 'Bruno' } },
      { args: [[{ id: 1, nombre: 'Ana' }], 5], expected: undefined }
    ]
  },
  {
    fn: 'posicionDe',
    type: 'direct',
    tests: [
      { args: [[{ id: 1, nombre: 'Ana' }, { id: 2, nombre: 'Bruno' }], 2], expected: 1 },
      { args: [[{ id: 1, nombre: 'Ana' }], 5], expected: -1 }
    ]
  },
  {
    fn: 'hayHuecos',
    type: 'direct',
    tests: [
      { args: [[1, 2, null, 4]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false }
    ]
  },
  {
    fn: 'duplicarPuntuacion',
    type: 'immutable',
    tests: [
      { args: [{ nombre: 'Ana', puntos: 10 }], expected: { nombre: 'Ana', puntos: 20 } }
    ]
  },
  {
    fn: 'agregarItem',
    type: 'immutable',
    tests: [
      { args: [['manzana', 'pan'], 'leche'], expected: ['manzana', 'pan', 'leche'] }
    ]
  },
  {
    fn: 'predecirValorFinal',
    type: 'direct',
    tests: [
      { args: [], expected: 15 }
    ]
  },
  {
    fn: 'crearBoton',
    type: 'detach-this',
    tests: [
      { args: ['Guardar'], expected: 'Click en: Guardar' }
    ]
  },
  {
    fn: 'crearContadorConThis',
    type: 'method-sequence',
    tests: [
      { args: [], method: 'incrementar', calls: [1, 2, 3] }
    ]
  },
  {
    fn: 'dividirSeguro',
    type: 'direct',
    tests: [
      { args: [10, 2], expected: 5 },
      { args: [10, 0], expected: null }
    ]
  },
  {
    fn: 'parsearJSON',
    type: 'direct',
    tests: [
      { args: ['{"a":1}'], expected: { a: 1 } },
      { args: ['{invalido}'], expected: null }
    ]
  },
  {
    fn: 'procesarConLimpieza',
    type: 'direct',
    tests: [
      { args: [() => 42], expected: { resultado: 42, procesoTerminado: true } },
      { args: [() => { throw new Error('fail'); }], expected: { resultado: null, procesoTerminado: true } }
    ]
  },
  {
    fn: 'validarEdad',
    type: 'throws',
    needsClass: 'ErrorEdadInvalida',
    tests: [
      { args: [30], throws: false, expected: 30 },
      { args: [150], throws: true, errorClass: 'ErrorEdadInvalida', errorProps: { edad: 150 } }
    ]
  },
  {
    fn: 'manejarValidacion',
    type: 'direct',
    needsClass: 'ErrorEdadInvalida',
    tests: [
      { args: [30], expected: 'Edad válida: 30' },
      { args: [150], expected: 'Edad inválida: La edad 150 no es válida (debe estar entre 0 y 120)' }
    ]
  }
];

// Comparación profunda basada en JSON.stringify con chequeo de tipo.
// Maneja undefined de forma especial.
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === undefined || b === undefined) return a === b;
  if (typeof a !== typeof b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
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

// 'direct' — llama fn con los args y compara contra expected.
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

// 'immutable' — comprueba el resultado Y que args[0] no haya sido mutado.
function runImmutable(ej, fn, test) {
  const argsTxt = test.args.map(fmtValue).join(', ');
  const original = JSON.parse(JSON.stringify(test.args[0]));
  try {
    const resultado = fn.apply(null, test.args);
    const resultOk = deepEqual(resultado, test.expected);
    const noMutoOk = deepEqual(test.args[0], original);
    const ok = resultOk && noMutoOk;
    let html = '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(resultado) +
      (resultOk ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(test.expected) + '</span>') +
      '</div>';
    html += '<div class="line">¿mutó el original? → ' +
      (noMutoOk ? '<span class="ok">✅ No, sigue igual</span>' : '<span class="bad">❌ Sí, lo modificaste: ahora es ' + fmtValue(test.args[0]) + '</span>') +
      '</div>';
    return { ok, html };
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' };
  }
}

// 'detach-this' — extrae el método suelto de un objeto devuelto y lo llama detached.
function runDetachThis(ej, fn, test) {
  const argsTxt = test.args.map(fmtValue).join(', ');
  try {
    const obj = fn.apply(null, test.args);
    if (!obj || typeof obj.onClick !== 'function') {
      return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') no devolvió un objeto con onClick</div>' };
    }
    const detached = obj.onClick;
    const resultado = detached();
    const ok = resultado === test.expected;
    return {
      ok,
      html: '<div class="line">const click = boton.onClick; click() → tu resultado: ' + fmtValue(resultado) +
        (ok ? ' <span class="ok">✅ Correcto (this no se perdió)</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(test.expected) + ' — revisá el bug de "this perdido"</span>') +
        '</div>'
    };
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error (probablemente "this perdido"): ' + (e.message || 'error desconocido') + '</div>' };
  }
}

// 'method-sequence' — crea el objeto una vez, llama un método suyo N veces en orden.
function runMethodSequence(ej, fn, test) {
  const argsTxt = test.args.map(fmtValue).join(', ');
  let obj;
  try {
    obj = fn.apply(null, test.args);
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' };
  }
  if (!obj || typeof obj[test.method] !== 'function') {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') no devolvió un objeto con ' + test.method + '()</div>' };
  }
  let ok = true;
  let html = '<div class="line">const c = ' + ej.fn + '(' + argsTxt + ')</div>';
  test.calls.forEach(expected => {
    let resultado, error = null;
    try {
      resultado = obj[test.method]();
    } catch (e) {
      error = e.message || 'error desconocido';
    }
    if (error !== null) {
      ok = false;
      html += '<div class="line" style="color:#ef4444;">💥 c.' + test.method + '() → 💥 Error: ' + error + '</div>';
      return;
    }
    const callOk = deepEqual(resultado, expected);
    if (!callOk) ok = false;
    html += '<div class="line">c.' + test.method + '() → tu resultado: ' + fmtValue(resultado) +
      (callOk ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(expected) + '</span>') +
      '</div>';
  });
  return { ok, html };
}

// 'throws' — valida que lance (o no) el error esperado.
function runThrows(ej, fn, test) {
  const argsTxt = test.args.map(fmtValue).join(', ');
  let resultado, thrown = null;
  try {
    resultado = fn.apply(null, test.args);
  } catch (e) {
    thrown = e;
  }

  if (test.throws) {
    if (!thrown) {
      return {
        ok: false,
        html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(resultado) +
          ' <span class="bad">❌ Se esperaba que lanzara un error y no lanzó nada</span></div>'
      };
    }
    const ErrorClass = window[test.errorClass];
    const isInstance = typeof ErrorClass === 'function' && thrown instanceof ErrorClass;
    let propsOk = true;
    if (test.errorProps) {
      propsOk = Object.keys(test.errorProps).every(k => deepEqual(thrown[k], test.errorProps[k]));
    }
    const ok = isInstance && propsOk;
    const thrownName = thrown && thrown.constructor ? thrown.constructor.name : 'Error';
    return {
      ok,
      html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: 💥 ' + thrownName + '(' + (thrown.message || '') + ')' +
        (ok ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: instancia de ' + test.errorClass + (test.errorProps ? ' con ' + fmtValue(test.errorProps) : '') + '</span>') +
        '</div>'
    };
  }

  // No debía lanzar
  if (thrown) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error: ' + (thrown.message || 'error desconocido') + '</div>' };
  }
  const ok = deepEqual(resultado, test.expected);
  return {
    ok,
    html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(resultado) +
      (ok ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(test.expected) + '</span>') +
      '</div>'
  };
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

document.addEventListener('DOMContentLoaded', () => {
  EJERCICIOS.forEach(ej => {
    const panel = document.querySelector('.ex-result[data-fn="' + ej.fn + '"]');
    if (!panel) return;
    const exEl = panel.closest('.ex');
    const badge = exEl.querySelector('.ex-status');

    // Dependencia de clase no escrita todavía (Grupo 5)
    if (ej.needsClass && typeof window[ej.needsClass] !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste la clase <code>' + ej.needsClass + '</code> en dia-13-metodos-avanzados-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Definila primero (con su <code>constructor</code>), después completá <code>' + ej.fn + '()</code>.</div>';
      return;
    }

    const fn = window[ej.fn];

    // Función no escrita todavía
    if (typeof fn !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '()</code> en dia-13-metodos-avanzados-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu función y recargá la página.</div>';
      return;
    }

    // Ejecutar cada test según el tipo
    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      let resultado;
      switch (ej.type) {
        case 'immutable':
          resultado = runImmutable(ej, fn, test);
          break;
        case 'detach-this':
          resultado = runDetachThis(ej, fn, test);
          break;
        case 'method-sequence':
          resultado = runMethodSequence(ej, fn, test);
          break;
        case 'throws':
          resultado = runThrows(ej, fn, test);
          break;
        default:
          resultado = runDirect(ej, fn, test);
      }
      if (resultado.ok) aprobados++;
      html += resultado.html;
    });

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
  });

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
});
