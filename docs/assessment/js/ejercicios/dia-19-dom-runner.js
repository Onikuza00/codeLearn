// ============================================================
// Día 19 — DOM · RUNNER
// Ejecuta las soluciones de dia-19-dom-soluciones.js
// y actualiza la página (badges, estado y contadores por card).
//
// Cada ejercicio tiene su propio fixture (contenedor .ex-fixture
// dentro de la card), que se reconstruye antes de cada test para
// que ningún ejercicio contamine el DOM de otro.
//
// Tipos de test (por entrada, no por ejercicio — un mismo
// ejercicio puede mezclar los dos si hace falta):
// - { input, expected } → fn(...args) se compara con deepEqual
//   contra expected. 'input' puede ser un array fijo o una
//   función (fixtureEl) => array de argumentos.
// - { run }              → test.run(fn, fixtureEl) hace lo que
//   necesite (llamar fn, disparar eventos reales con
//   dispatchEvent, leer el DOM resultante) y devuelve
//   { pass, got, expected } ya resuelto.
// ============================================================

// Dispara un evento de ratón sobre el elemento (y su cadena de
// burbujeo hasta document) Y sobre window, para no asumir si la
// solución escuchó en el elemento, en document o en window.
function dispararEnTodosLados(tipo, el, opciones) {
  const base = Object.assign({ bubbles: true, cancelable: true }, opciones);
  el.dispatchEvent(new MouseEvent(tipo, base));
  window.dispatchEvent(new MouseEvent(tipo, base));
}

const EJERCICIOS = [
  // ---------- Grupo 1 — Selección ----------
  {
    fn: 'textoBadge',
    fixture: (c) => { c.innerHTML = '<div class="tarjeta"><span class="badge">Nuevo</span></div>'; },
    tests: [
      { input: f => [f.querySelector('.tarjeta'), 'Sin etiqueta'], expected: 'Nuevo' },
      {
        fixture: c => { c.innerHTML = '<div class="tarjeta"></div>'; },
        input: f => [f.querySelector('.tarjeta'), 'Sin etiqueta'],
        expected: 'Sin etiqueta'
      },
      {
        fixture: c => { c.innerHTML = '<div class="tarjeta"></div>'; },
        input: f => [f.querySelector('.tarjeta'), 'N/D'],
        expected: 'N/D'
      }
    ]
  },
  {
    fn: 'productosVisibles',
    fixture: (c) => {
      c.innerHTML = '<ul class="lista">' +
        '<li class="producto">Mouse</li>' +
        '<li class="producto oculto">Teclado</li>' +
        '<li class="producto">Monitor</li></ul>';
    },
    tests: [
      { input: f => [f.querySelector('.lista')], expected: ['Mouse', 'Monitor'] },
      {
        fixture: c => {
          c.innerHTML = '<ul class="lista">' +
            '<li class="producto oculto">Mouse</li>' +
            '<li class="producto oculto">Teclado</li></ul>';
        },
        input: f => [f.querySelector('.lista')],
        expected: []
      },
      {
        fixture: c => {
          c.innerHTML = '<ul class="lista">' +
            '<li class="producto">Mouse</li>' +
            '<li class="producto">Teclado</li></ul>';
        },
        input: f => [f.querySelector('.lista')],
        expected: ['Mouse', 'Teclado']
      }
    ]
  },
  {
    fn: 'siguienteItem',
    fixture: (c) => {
      c.innerHTML = '<ul class="menu"><li>Inicio</li><li class="activo">Productos</li><li>Contacto</li></ul>';
    },
    tests: [
      { input: f => [f.querySelector('.menu')], expected: 'Contacto' },
      {
        fixture: c => { c.innerHTML = '<ul class="menu"><li>Inicio</li><li>Productos</li><li class="activo">Contacto</li></ul>'; },
        input: f => [f.querySelector('.menu')],
        expected: null
      },
      {
        fixture: c => { c.innerHTML = '<ul class="menu"><li>Inicio</li><li>Productos</li><li>Contacto</li></ul>'; },
        input: f => [f.querySelector('.menu')],
        expected: null
      }
    ]
  },

  // ---------- Grupo 2 — Manipulación ----------
  {
    fn: 'mostrarNombreUsuario',
    fixture: (c) => { c.innerHTML = '<p class="usuario"></p>'; },
    tests: [
      {
        run: (fn, f) => {
          const p = f.querySelector('.usuario');
          fn(p, 'Ana <b>Test</b>');
          const got = { texto: p.textContent, tieneNegrita: !!p.querySelector('b') };
          const expected = { texto: 'Ana <b>Test</b>', tieneNegrita: false };
          return { pass: got.texto === expected.texto && got.tieneNegrita === expected.tieneNegrita, got, expected };
        }
      },
      {
        run: (fn, f) => {
          const p = f.querySelector('.usuario');
          window.__xssDisparado = false;
          fn(p, '<img src="x" onerror="window.__xssDisparado = true">');
          const got = { tieneImg: !!p.querySelector('img'), xssDisparado: window.__xssDisparado === true };
          const expected = { tieneImg: false, xssDisparado: false };
          return { pass: got.tieneImg === false && got.xssDisparado === false, got, expected };
        }
      }
    ]
  },
  {
    fn: 'datosProductoCard',
    fixture: (c) => { c.innerHTML = '<div class="producto-card" data-precio="19.99" data-categoria="electronica" data-stock="5"></div>'; },
    tests: [
      { input: f => [f.querySelector('.producto-card')], expected: { precio: 19.99, categoria: 'electronica', stock: 5 } },
      {
        fixture: c => { c.innerHTML = '<div class="producto-card" data-precio="5" data-categoria="hogar" data-stock="0"></div>'; },
        input: f => [f.querySelector('.producto-card')],
        expected: { precio: 5, categoria: 'hogar', stock: 0 }
      }
    ]
  },
  {
    fn: 'alternarFavorito',
    fixture: (c) => { c.innerHTML = '<button class="like"></button>'; },
    tests: [
      {
        run: (fn, f) => {
          const boton = f.querySelector('.like');
          const r1 = fn(boton);
          const r2 = fn(boton);
          const r3 = fn(boton);
          const got = [r1, r2, r3];
          const expected = [true, false, true];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ]
  },
  {
    fn: 'agregarTarea',
    fixture: (c) => { c.innerHTML = '<ul class="tareas"></ul>'; },
    tests: [
      {
        run: (fn, f) => {
          const ul = f.querySelector('.tareas');
          const c1 = fn(ul, 'Comprar pan');
          const c2 = fn(ul, 'Estudiar JS');
          const items = Array.from(ul.querySelectorAll('li')).map(li => li.textContent);
          const got = { conteos: [c1, c2], items };
          const expected = { conteos: [1, 2], items: ['Comprar pan', 'Estudiar JS'] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ]
  },
  {
    fn: 'eliminarTarea',
    fixture: (c) => { c.innerHTML = '<ul class="tareas"><li>Comprar pan</li><li>Estudiar JS</li><li>Pagar factura</li></ul>'; },
    tests: [
      {
        run: (fn, f) => {
          const ul = f.querySelector('.tareas');
          const restantes = fn(ul, 'Estudiar JS');
          const items = Array.from(ul.querySelectorAll('li')).map(li => li.textContent);
          const got = { restantes, items };
          const expected = { restantes: 2, items: ['Comprar pan', 'Pagar factura'] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const ul = f.querySelector('.tareas');
          const restantes = fn(ul, 'Bailar');
          const items = Array.from(ul.querySelectorAll('li')).map(li => li.textContent);
          const got = { restantes, items };
          const expected = { restantes: 3, items: ['Comprar pan', 'Estudiar JS', 'Pagar factura'] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ]
  },

  // ---------- Grupo 3 — Eventos ----------
  {
    fn: 'evitarNavegacion',
    fixture: (c) => { c.innerHTML = '<a href="#" class="enlace">Ver más</a>'; },
    tests: [
      {
        run: (fn, f) => {
          const a = f.querySelector('.enlace');
          fn(a);
          const evento = new MouseEvent('click', { bubbles: true, cancelable: true });
          a.dispatchEvent(evento);
          const got = evento.defaultPrevented;
          return { pass: got === true, got, expected: true };
        }
      }
    ]
  },
  {
    fn: 'activarDelegacionTareas',
    fixture: (c) => { c.innerHTML = '<ul class="tareas"><li>Tarea 1</li><li>Tarea 2</li></ul>'; },
    tests: [
      {
        run: (fn, f) => {
          const ul = f.querySelector('.tareas');
          fn(ul);
          const li1 = ul.children[0];
          const li2 = ul.children[1];
          li1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const tras1 = { li1: li1.classList.contains('done'), li2: li2.classList.contains('done') };

          const li3 = document.createElement('li');
          li3.textContent = 'Tarea 3';
          ul.appendChild(li3);
          li3.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const li3Marcada = li3.classList.contains('done');

          li1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const li1SeDesmarco = li1.classList.contains('done') === false;

          const got = { tras1, li3Marcada, li2SigueIgual: li2.classList.contains('done'), li1SeDesmarco };
          const expected = { tras1: { li1: true, li2: false }, li3Marcada: true, li2SigueIgual: false, li1SeDesmarco: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ]
  },
  {
    fn: 'activarEnvioConEnter',
    fixture: (c) => { c.innerHTML = '<input type="text" class="mensaje">'; },
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('.mensaje');
          let recibido = null;
          let llamadas = 0;
          fn(input, (valor) => { recibido = valor; llamadas++; });

          input.value = 'Hola';
          input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          const trasEnter = { recibido, llamadas };

          input.value = 'Hola mundo';
          input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
          const trasOtraTecla = { recibido, llamadas };

          const got = { trasEnter, trasOtraTecla };
          const expected = { trasEnter: { recibido: 'Hola', llamadas: 1 }, trasOtraTecla: { recibido: 'Hola', llamadas: 1 } };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ]
  },
  {
    fn: 'activarArrastre',
    fixture: (c) => { c.innerHTML = '<div class="tarjeta-arrastrable" style="position:absolute;left:0px;top:0px;"></div>'; },
    tests: [
      {
        run: (fn, f) => {
          const div = f.querySelector('.tarjeta-arrastrable');
          fn(div);

          div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
          dispararEnTodosLados('mousemove', div, { clientX: 60, clientY: 90 });
          const trasMover = { left: div.style.left, top: div.style.top };

          dispararEnTodosLados('mouseup', div, { clientX: 60, clientY: 90 });
          dispararEnTodosLados('mousemove', div, { clientX: 300, clientY: 300 });
          const trasSoltar = { left: div.style.left, top: div.style.top };

          const got = {
            seMovio: trasMover.left !== '0px' || trasMover.top !== '0px',
            quedoFijaTrasSoltar: trasSoltar.left === trasMover.left && trasSoltar.top === trasMover.top
          };
          const expected = { seMovio: true, quedoFijaTrasSoltar: true };
          return { pass: got.seMovio === true && got.quedoFijaTrasSoltar === true, got, expected };
        }
      }
    ]
  },
  {
    fn: 'activarContadorCaracteres',
    fixture: (c) => { c.innerHTML = '<input type="text" class="mensaje-texto"><span class="contador">0</span>'; },
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('.mensaje-texto');
          const contador = f.querySelector('.contador');
          fn(input, contador);

          input.value = 'Hola';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const trasInput = contador.textContent;

          input.value = 'Hola mundo que no dispara nada';
          const sinEvento = contador.textContent;

          const got = { trasInput, sigueIgualSinEvento: sinEvento === trasInput };
          const expected = { trasInput: '4', sigueIgualSinEvento: true };
          return { pass: got.trasInput === expected.trasInput && got.sigueIgualSinEvento === true, got, expected };
        }
      }
    ]
  },

  // ---------- Grupo 4 — Formularios ----------
  {
    fn: 'datosFormulario',
    fixture: (c) => { c.innerHTML = '<form class="registro"><input name="nombre" value="Pau"><input name="email" value="pau@mail.com"></form>'; },
    tests: [
      { input: f => [f.querySelector('.registro')], expected: { nombre: 'Pau', email: 'pau@mail.com' } },
      {
        fixture: c => { c.innerHTML = '<form class="registro"><input name="nombre" value="Ana"><input name="email" value="ana@mail.com"></form>'; },
        input: f => [f.querySelector('.registro')],
        expected: { nombre: 'Ana', email: 'ana@mail.com' }
      }
    ]
  },
  {
    fn: 'validarConfirmacionEmail',
    fixture: (c) => { c.innerHTML = '<input type="email" class="email" value="pau@mail.com"><input type="email" class="confirmar-email" value="">'; },
    tests: [
      {
        run: (fn, f) => {
          const email = f.querySelector('.email');
          const confirmar = f.querySelector('.confirmar-email');
          confirmar.value = 'otro@mail.com';
          fn(email, confirmar);
          const got = { valido: confirmar.validity.valid, tieneMensaje: confirmar.validationMessage.length > 0 };
          const expected = { valido: false, tieneMensaje: true };
          return { pass: got.valido === false && got.tieneMensaje === true, got, expected };
        }
      },
      {
        run: (fn, f) => {
          const email = f.querySelector('.email');
          const confirmar = f.querySelector('.confirmar-email');
          confirmar.value = email.value;
          fn(email, confirmar);
          const got = { valido: confirmar.validity.valid, tieneMensaje: confirmar.validationMessage.length > 0 };
          const expected = { valido: true, tieneMensaje: false };
          return { pass: got.valido === true && got.tieneMensaje === false, got, expected };
        }
      }
    ]
  }
];

// Comparación profunda basada en JSON.stringify.
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === undefined || b === undefined) return a === b;
  if (typeof a !== typeof b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

// Formatea un valor (incluye nodos del DOM) para mostrarlo legible.
function fmtValue(v) {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'function') return 'ƒ';
  if (typeof v === 'string') return '"' + v + '"';
  if (typeof Element !== 'undefined' && v instanceof Element) {
    const clases = v.className ? '.' + String(v.className).trim().split(/\s+/).join('.') : '';
    return '<' + v.tagName.toLowerCase() + clases + '>';
  }
  if (Array.isArray(v)) return '[' + v.map(fmtValue).join(', ') + ']';
  if (typeof v === 'object') {
    return '{' + Object.keys(v).map(k => k + ': ' + fmtValue(v[k])).join(', ') + '}';
  }
  return String(v);
}

// Reconstruye el fixture de un ejercicio (o de un test puntual que
// lo pisa) dentro de su contenedor .ex-fixture, y devuelve ese
// contenedor ya listo para usarse.
function reconstruirFixture(ej, test, container) {
  if (!container) return null;
  const build = test.fixture || ej.fixture;
  container.innerHTML = '';
  if (typeof build === 'function') build(container);
  return container;
}

// Test de tipo { input, expected } — comparación directa por valor.
function runDomValue(ej, fn, test, fixtureEl) {
  const args = typeof test.input === 'function' ? test.input(fixtureEl) : (test.input || []);
  const argsTxt = args.map(fmtValue).join(', ');
  try {
    const resultado = fn.apply(null, args);
    const expected = typeof test.expected === 'function' ? test.expected(fixtureEl) : test.expected;
    const ok = deepEqual(resultado, expected);
    return {
      ok,
      html: '<div class="line">' + ej.fn + '(' + argsTxt + ') → tu resultado: ' + fmtValue(resultado) +
        (ok ? ' <span class="ok">✅ Correcto</span>' : ' <span class="bad">❌ Esperado: ' + fmtValue(expected) + '</span>') +
        '</div>'
    };
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(' + argsTxt + ') → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' };
  }
}

// Test de tipo { run } — script autocontenido que dispara eventos
// reales y/o inspecciona el DOM, y ya devuelve { pass, got, expected }.
function runDomCustom(ej, fn, test, fixtureEl) {
  try {
    const resultado = test.run(fn, fixtureEl) || {};
    const pass = resultado.pass === true;
    return {
      ok: pass,
      html: '<div class="line">' + ej.fn + '(...) → ' +
        (pass
          ? '<span class="ok">✅ Correcto</span>'
          : '<span class="bad">❌ Esperado: ' + fmtValue(resultado.expected) + ' — obtenido: ' + fmtValue(resultado.got) + '</span>') +
        '</div>'
    };
  } catch (e) {
    return { ok: false, html: '<div class="line" style="color:#ef4444;">💥 ' + ej.fn + '(...) → 💥 Error: ' + (e.message || 'error desconocido') + '</div>' };
  }
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
    const container = exEl.querySelector('.ex-fixture');

    const target = window[ej.fn];
    if (typeof target !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '</code> en dia-19-dom-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu código y recargá la página.</div>';
      return;
    }

    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      const fixtureEl = reconstruirFixture(ej, test, container);
      const resultado = typeof test.run === 'function'
        ? runDomCustom(ej, target, test, fixtureEl)
        : runDomValue(ej, target, test, fixtureEl);
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
