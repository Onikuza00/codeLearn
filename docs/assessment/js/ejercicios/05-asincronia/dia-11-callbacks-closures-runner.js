// ============================================================
// Día 11 — Callbacks + Closures · RUNNER
// Ejecuta las soluciones de dia-11-callbacks-closures-soluciones.js
// y actualiza la página (badges, estado y contadores del día).
//
// Dos tipos de test:
// - 'direct'   → fn(...args) se compara directo contra expected.
// - 'sequence' → fn(...args) devuelve un closure; ese closure se
//                llama varias veces en orden y cada resultado se
//                compara contra el expected de esa vuelta.
// ============================================================

const EJERCICIOS = [
  {
    fn: 'ejecutarSiPositivo',
    type: 'direct',
    tests: [
      { args: [5, n => n * 2], expected: 10 },
      { args: [-3, n => n * 2], expected: null }
    ]
  },
  {
    fn: 'repetir',
    type: 'direct',
    tests: [
      { args: [3, i => i * i], expected: [0, 1, 4] },
      { args: [0, i => i], expected: [] }
    ]
  },
  {
    fn: 'crearContador',
    type: 'sequence',
    tests: [
      { args: [], calls: [1, 2, 3] }
    ]
  },
  {
    fn: 'crearContadorDesde',
    type: 'sequence',
    tests: [
      { args: [10], calls: [11, 12] }
    ]
  },
  {
    fn: 'crearMultiplicador',
    type: 'sequence',
    tests: [
      { args: [3], calls: [{ callArgs: [4], expected: 12 }, { callArgs: [5], expected: 15 }] }
    ]
  },
  {
    fn: 'crearAcumulador',
    type: 'sequence',
    tests: [
      { args: [], calls: [{ callArgs: [5], expected: 5 }, { callArgs: [3], expected: 8 }, { callArgs: [10], expected: 18 }] }
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
// 'calls' acepta números sueltos (mismo callArgs=[] siempre) o { callArgs, expected }.
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
    const fn = window[ej.fn];

    // Función no escrita todavía
    if (typeof fn !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '()</code> en dia-11-callbacks-closures-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu función y recargá la página.</div>';
      return;
    }

    // Ejecutar cada test
    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      const resultado = ej.type === 'sequence' ? runSequence(ej, fn, test) : runDirect(ej, fn, test);
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
