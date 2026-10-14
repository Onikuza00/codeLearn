// ============================================================
// Día 10 — Objetos · RUNNER
// Ejecuta las soluciones de dia-10-objetos-soluciones.js y
// actualiza la página (badges, estado y contadores del día).
// ============================================================

const EJERCICIOS = [
  {
    fn: 'contarPropiedades',
    tests: [
      { args: [{ a: 1, b: 2, c: 3 }], expected: 3 },
      { args: [{}], expected: 0 }
    ]
  },
  {
    fn: 'tieneValor',
    tests: [
      { args: [{ a: 1, b: 2 }, 2], expected: true },
      { args: [{ a: 1, b: 2 }, 5], expected: false }
    ]
  },
  {
    fn: 'clavesConValor',
    tests: [
      { args: [{ a: true, b: false, c: true }, true], expected: ['a', 'c'] },
      { args: [{ a: 1, b: 2 }, 5], expected: [] }
    ]
  },
  {
    fn: 'datosPersona',
    tests: [
      { args: [{ nombre: 'Pau', edad: 24 }], expected: 'Pau tiene 24 años' },
      { args: [{ nombre: 'Ana' }], expected: 'Ana tiene 30 años' }
    ]
  },
  {
    fn: 'ciudadSegura',
    tests: [
      { args: [{ direccion: { ciudad: 'Girona' } }], expected: 'Girona' },
      { args: [{ nombre: 'Pau' }], expected: 'Desconocida' }
    ]
  },
  {
    fn: 'actualizarEdad',
    tests: [
      { args: [{ nombre: 'Pau', edad: 24 }, 25], expected: { nombre: 'Pau', edad: 25 } },
      { args: [{ nombre: 'Ana', edad: 30 }, 31], expected: { nombre: 'Ana', edad: 31 } }
    ]
  },
  {
    fn: 'sumarPuntos',
    tests: [
      { args: [{ ana: 15 }, 'ana', 5], expected: { ana: 20 } },
      { args: [{ ana: 15 }, 'bruno', 5], expected: { ana: 15, bruno: 5 } }
    ]
  },
  {
    fn: 'jugadorGanador',
    tests: [
      { args: [{ ana: 15, bruno: 22, carla: 8 }], expected: 'bruno' },
      { args: [{}], expected: null }
    ]
  },
  {
    fn: 'promedioPuntos',
    tests: [
      { args: [{ ana: 10, bruno: 20 }], expected: 15 },
      { args: [{}], expected: 0 }
    ]
  },
  {
    fn: 'perfilJugador',
    tests: [
      { args: [{ nombre: 'Ana', puntos: 15, equipo: 'Rojo' }], expected: 'Ana: 15 pts (Rojo)' },
      { args: [{ nombre: 'Bruno', puntos: 22 }], expected: 'Bruno: 22 pts (sin equipo)' }
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
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '()</code> en dia-10-objetos-soluciones.js' +
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
