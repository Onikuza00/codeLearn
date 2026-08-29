// ============================================================
// 16/08/2026 — Repaso general · RUNNER
// Ejecuta las soluciones de conceptos-basicos-soluciones.js
// y actualiza la página (badges, estado y contadores por card).
//
// Tipos de test:
// - 'direct'    → fn(...args) se compara directo contra expected.
// - 'immutable' → fn(...args) devuelve algo nuevo Y args[0] no debe
//                 quedar modificado.
// - 'method'    → se llama un método de un objeto/instancia ya creado
//                 (carrito.calcularTotal(), instancia.descripcion()).
// - 'sequence'  → una función devuelve otra función; se llama varias
//                 veces en orden (closures).
// - 'throws'    → fn(...args) puede lanzar un error a propósito; se
//                 valida la clase del error, o el valor de retorno si
//                 no debía lanzar.
// ============================================================

const EJERCICIOS = [
  {
    fn: 'formularioValido',
    type: 'direct',
    tests: [
      { args: [{ nombre: 'Pau', email: 'pau@mail.com', password: '1234' }], expected: true },
      { args: [{ nombre: 'Pau', email: '', password: '1234' }], expected: false },
      { args: [{ nombre: 'Pau', email: 'pau@mail.com' }], expected: false }
    ]
  },
  {
    fn: 'productoPorId',
    type: 'direct',
    tests: [
      { args: [[{ id: 1, nombre: 'Mouse' }, { id: 2, nombre: 'Teclado' }], 2], expected: { id: 2, nombre: 'Teclado' } },
      { args: [[{ id: 1, nombre: 'Mouse' }], 9], expected: undefined }
    ]
  },
  {
    fn: 'posicionEnCarrito',
    type: 'direct',
    tests: [
      { args: [[{ id: 1 }, { id: 2 }], 2], expected: 1 },
      { args: [[{ id: 1 }], 9], expected: -1 }
    ]
  },
  {
    fn: 'crearContadorLikes',
    type: 'sequence',
    tests: [
      { args: [], calls: [1, 2, 3] }
    ]
  },
  {
    fn: 'carrito',
    type: 'method',
    method: 'calcularTotal',
    tests: [
      { args: [], expected: 35 }
    ]
  },
  {
    fn: 'agregarProducto',
    type: 'immutable',
    tests: [
      { args: [[{ id: 1 }], { id: 2 }], expected: [{ id: 1 }, { id: 2 }] }
    ]
  },
  {
    fn: 'ciudadDeEnvio',
    type: 'direct',
    tests: [
      { args: [{ envio: { direccion: { ciudad: 'Girona' } } }], expected: 'Girona' },
      { args: [{ envio: {} }], expected: 'Sin especificar' },
      { args: [{}], expected: 'Sin especificar' }
    ]
  },
  {
    fn: 'primerosPosts',
    type: 'direct',
    tests: [
      { args: [['a', 'b', 'c', 'd'], 2], expected: ['a', 'b'] },
      { args: [['a'], 5], expected: ['a'] }
    ]
  },
  {
    fn: 'generarIds',
    type: 'direct',
    tests: [
      { args: [4], expected: [1, 2, 3, 4] },
      { args: [0], expected: [] }
    ]
  },
  {
    fn: 'aplicaDescuento',
    type: 'direct',
    tests: [
      { args: [80, true, false], expected: true },
      { args: [80, false, false], expected: false },
      { args: [30, true, true], expected: false }
    ]
  },
  {
    fn: 'leerConfiguracion',
    type: 'throws',
    needsClass: 'ConfiguracionInvalidaError',
    tests: [
      { args: ['{"tema":"oscuro"}'], throws: false, expected: { tema: 'oscuro' } },
      { args: ['{tema:oscuro}'], throws: true, errorClass: 'ConfiguracionInvalidaError' }
    ]
  },
  {
    fn: 'ProductoDigital',
    type: 'instance-method',
    method: 'descripcion',
    tests: [
      { args: ['Curso JS', 20, '/descargas/curso-js'], expected: 'Curso JS — 20€ (descarga digital)' }
    ]
  }
];

// Comparación profunda basada en JSON.stringify con chequeo de tipo.
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

// 'sequence' — fn() devuelve otra función; se llama varias veces en orden.
function runSequence(ej, fn, test) {
  let inner;
  try {
    inner = fn.apply(null, test.args);
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '() → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' };
  }
  if (typeof inner !== 'function') {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '() no devolvió una función</div>' };
  }
  let ok = true;
  let html = '<div class="line">const f = ' + ej.fn + '()</div>';
  test.calls.forEach(expected => {
    let resultado, error = null;
    try {
      resultado = inner();
    } catch (e) {
      error = e.message || 'error desconocido';
    }
    if (error !== null) {
      ok = false;
      html += '<div class="line" style="color:#ef4444;">💥 f() → 💥 Error: ' + error + '</div>';
      return;
    }
    const callOk = deepEqual(resultado, expected);
    if (!callOk) ok = false;
    html += '<div class="line">f() → tu resultado: ' + fmtValue(resultado) +
      (callOk ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(expected) + '</span>') +
      '</div>';
  });
  return { ok, html };
}

// 'method' — llama a un método de un objeto ya creado en soluciones.js (ej: carrito.calcularTotal()).
function runMethod(ej, obj, test) {
  if (!obj || typeof obj[ej.method] !== 'function') {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '.' + ej.method + '() no está definido</div>' };
  }
  try {
    const resultado = obj[ej.method]();
    const ok = deepEqual(resultado, test.expected);
    return {
      ok,
      html: '<div class="line">' + ej.fn + '.' + ej.method + '() → tu resultado: ' + fmtValue(resultado) +
        (ok ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(test.expected) + '</span>') +
        '</div>'
    };
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '.' + ej.method + '() → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' };
  }
}

// 'instance-method' — instancia una clase con "new" y llama a un método suyo.
function runInstanceMethod(ej, Clase, test) {
  const argsTxt = test.args.map(fmtValue).join(', ');
  try {
    const instancia = new Clase(...test.args);
    if (typeof instancia[ej.method] !== 'function') {
      return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 la instancia no tiene ' + ej.method + '()</div>' };
    }
    const resultado = instancia[ej.method]();
    const ok = deepEqual(resultado, test.expected);
    return {
      ok,
      html: '<div class="line">new ' + ej.fn + '(' + argsTxt + ').' + ej.method + '() → tu resultado: ' + fmtValue(resultado) +
        (ok ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(test.expected) + '</span>') +
        '</div>'
    };
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 new ' + ej.fn + '(' + argsTxt + ') → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' };
  }
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
    const thrownName = thrown && thrown.constructor ? thrown.constructor.name : 'Error';
    return {
      ok: isInstance,
      html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: 💥 ' + thrownName + '(' + (thrown.message || '') + ')' +
        (isInstance ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: instancia de ' + test.errorClass + '</span>') +
        '</div>'
    };
  }

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

    if (ej.needsClass && typeof window[ej.needsClass] !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste la clase <code>' + ej.needsClass + '</code> en conceptos-basicos-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Definila primero, después completá <code>' + ej.fn + '()</code>.</div>';
      return;
    }

    const target = window[ej.fn];
    const isMissing = ej.type === 'method' ? !target : typeof target !== 'function';
    if (isMissing) {
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '</code> en conceptos-basicos-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu código y recargá la página.</div>';
      return;
    }

    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      let resultado;
      switch (ej.type) {
        case 'immutable':
          resultado = runImmutable(ej, target, test);
          break;
        case 'sequence':
          resultado = runSequence(ej, target, test);
          break;
        case 'method':
          resultado = runMethod(ej, target, test);
          break;
        case 'instance-method':
          resultado = runInstanceMethod(ej, target, test);
          break;
        case 'throws':
          resultado = runThrows(ej, target, test);
          break;
        default:
          resultado = runDirect(ej, target, test);
      }
      if (resultado.ok) aprobados++;
      html += resultado.html;
    });

    panel.innerHTML = html;

    const total = ej.tests.length;
    if (aprobados === total) {
      setStatus(exEl, badge, 'data-done', '✅ Completado');
    } else if (aprobados > 0) {
      setStatus(exEl, badge, 'data-review', '🔁 Repasar');
    } else {
      setStatus(exEl, badge, 'data-pending', '⏳ Pendiente');
    }
  });

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
