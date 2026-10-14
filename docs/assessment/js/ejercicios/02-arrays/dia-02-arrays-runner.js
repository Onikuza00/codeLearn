// ============================================================
// Día 02 — Arrays + Métodos · RUNNER
// Ejecuta las soluciones de dia-02-arrays-soluciones.js y
// actualiza la página (badges, estado y contadores del día).
// ============================================================

const EJERCICIOS = [
  {
    fn: 'dobles',
    tests: [
      { args: [[1, 2, 3]], expected: [2, 4, 6] },
      { args: [[5, 0, -2]], expected: [10, 0, -4] },
      { args: [[]], expected: [] }
    ]
  },
  {
    fn: 'preciosDe',
    tests: [
      { args: [[{ nombre: 'Teclado', precio: 30 }, { nombre: 'Mouse', precio: 15 }]], expected: [30, 15] },
      { args: [[]], expected: [] }
    ]
  },
  {
    fn: 'soloPares',
    tests: [
      { args: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6] },
      { args: [[1, 3, 5]], expected: [] },
      { args: [[]], expected: [] }
    ]
  },
  {
    fn: 'disponibles',
    tests: [
      { args: [[{ nombre: 'Mouse', stock: 5 }, { nombre: 'Teclado', stock: 0 }]], expected: [{ nombre: 'Mouse', stock: 5 }] },
      { args: [[{ nombre: 'A', stock: 0 }]], expected: [] }
    ]
  },
  {
    fn: 'totalCarrito',
    tests: [
      { args: [[{ nombre: 'Mouse', precio: 25, cantidad: 2 }, { nombre: 'Teclado', precio: 10, cantidad: 1 }]], expected: 60 },
      { args: [[]], expected: 0 }
    ]
  },
  {
    fn: 'promedioAprobados',
    tests: [
      { args: [[{ nombre: 'Ana', nota: 7 }, { nombre: 'Luis', nota: 4 }, { nombre: 'Pau', nota: 6 }]], expected: 6.5 },
      { args: [[{ nombre: 'Luis', nota: 4 }]], expected: null },
      { args: [[]], expected: null }
    ]
  },
  {
    fn: 'frecuenciaCaracteres',
    tests: [
      { args: ['hola'], expected: { h: 1, o: 1, l: 1, a: 1 } },
      { args: ['aab'], expected: { a: 2, b: 1 } },
      { args: ['hola mundo'], expected: { h: 1, o: 2, l: 1, a: 1, m: 1, u: 1, n: 1, d: 1 } }
    ]
  },
  {
    fn: 'agruparPorLetra',
    tests: [
      { args: [['hola', 'mundo', 'hielo', 'moto']], expected: { h: ['hola', 'hielo'], m: ['mundo', 'moto'] } },
      { args: [['a', 'b']], expected: { a: ['a'], b: ['b'] } },
      { args: [[]], expected: null }
    ]
  },
  {
    fn: 'ordenarPorPrecio',
    tests: [
      { args: [[{ nombre: 'Mouse', precio: 30 }, { nombre: 'Teclado', precio: 20 }, { nombre: 'Monitor', precio: 50 }]], expected: [{ nombre: 'Teclado', precio: 20 }, { nombre: 'Mouse', precio: 30 }, { nombre: 'Monitor', precio: 50 }] },
      { args: [[{ nombre: 'A', precio: 5 }, { nombre: 'B', precio: 3 }]], expected: [{ nombre: 'B', precio: 3 }, { nombre: 'A', precio: 5 }] }
    ]
  },
  {
    fn: 'tieneAlgo',
    tests: [
      { args: [[1, 2]], expected: true },
      { args: [[]], expected: false }
    ]
  },
  {
    fn: 'primeroSeguro',
    tests: [
      { args: [[10, 20]], expected: 10 },
      { args: [[]], expected: null }
    ]
  },
  {
    fn: 'sumarEdades',
    tests: [
      { args: [[15, 22, 30]], expected: 67 },
      { args: [[]], expected: 0 }
    ]
  },
  {
    fn: 'precioTotalPerecederos',
    tests: [
      { args: [[{ nombre: 'Manzana', precio: 2, tipo: 'perecedero' }, { nombre: 'Arroz', precio: 5, tipo: 'seco' }]], expected: 2 },
      { args: [[{ nombre: 'Pan', precio: 4, tipo: 'perecedero' }, { nombre: 'Pasta', precio: 6, tipo: 'seco' }, { nombre: 'Leche', precio: 3, tipo: 'perecedero' }]], expected: 7 },
      { args: [[]], expected: 0 }
    ]
  },
  {
    fn: 'contarPorCategoria',
    tests: [
      { args: [[{ nombre: 'Manzana', categoria: 'fruta' }, { nombre: 'Pan', categoria: 'panaderia' }, { nombre: 'Banana', categoria: 'fruta' }]], expected: { fruta: 2, panaderia: 1 } },
      { args: [[{ nombre: 'A', categoria: 'x' }]], expected: { x: 1 } },
      { args: [[]], expected: {} }
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
  if (typeof v === 'string') return '"' + v + '"';
  if (Array.isArray(v)) return '[' + v.map(fmtValue).join(', ') + ']';
  if (typeof v === 'object') {
    return '{' + Object.keys(v).map(k => k + ': ' + fmtValue(v[k])).join(', ') + '}';
  }
  return String(v);
}

// Construye el HTML de una línea de resultado.
function renderLine(ej, test, resultado, error) {
  const argsTxt = test.args.map(fmtValue).join(', ');
  if (error) {
    return '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error: ' + error + '</div>';
  }
  const ok = deepEqual(resultado, test.expected);
  if (ok) {
    return '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(resultado) +
      ' <span class="ok">✅ Correcto</span></div>';
  }
  return '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(resultado) +
    ' <span class="bad">❌ Esperado: ' + fmtValue(test.expected) + '</span></div>';
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
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '()</code> en dia-02-arrays-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu función y recargá la página.</div>';
      return;
    }

    // Ejecutar cada test
    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      let resultado;
      let error = null;
      try {
        resultado = fn.apply(null, test.args);
      } catch (e) {
        error = e.message || 'error desconocido';
      }
      if (error === null && deepEqual(resultado, test.expected)) aprobados++;
      html += renderLine(ej, test, resultado, error);
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
