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

// ============================================================
// 23/08 — Refuerzo 2 · Reincidencias (añadido — fusionado en
// dia-19-dom.html como primera card de la página).
// Cada ejercicio machaca un fallo reincidente del GOTCHAS.md.
// Misma mecánica que EJERCICIOS_REFUERZO: fixture Tailwind real
// por ejercicio (fixtureHTML) montado en su zona .ex-demo,
// tests de tipo { run } y demo en vivo (ej.demo) al terminar.
// ============================================================
const EJERCICIOS_REFUERZO_2 = [
  // ---------- E1 ----------
  {
    fn: 'validarPrecioEnRango',
    fixtureHTML: `<form id="form-precio-s1" class="p-4 max-w-sm space-y-2" novalidate>
  <label for="precio-s1" class="block text-sm font-medium text-slate-700">Precio de venta</label>
  <div class="flex items-center gap-2">
    <input id="precio-s1" type="text" inputmode="decimal" placeholder="Entre 10 y 500" class="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
    <span class="text-sm font-medium text-slate-500">EUR</span>
  </div>
  <span id="error-precio-s1" class="block text-xs text-red-600 min-h-[1rem]"></span>
</form>`,
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('#precio-s1');
          const error = f.querySelector('#error-precio-s1');
          input.value = '250';
          fn(input, error);
          const got = { valido: input.checkValidity(), mensajeVacio: error.textContent === '' };
          const expected = { valido: true, mensajeVacio: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#precio-s1');
          const error = f.querySelector('#error-precio-s1');
          input.value = '9.5';
          fn(input, error);
          const got = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          const expected = { valido: false, tieneMensaje: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#precio-s1');
          const error = f.querySelector('#error-precio-s1');
          input.value = '501';
          fn(input, error);
          const got = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          const expected = { valido: false, tieneMensaje: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#precio-s1');
          const error = f.querySelector('#error-precio-s1');
          input.value = '10';
          fn(input, error);
          const minimo = input.checkValidity();
          input.value = '500';
          fn(input, error);
          const maximo = input.checkValidity();
          const got = { minimo, maximo };
          const expected = { minimo: true, maximo: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#precio-s1');
          const error = f.querySelector('#error-precio-s1');
          input.value = '700';
          fn(input, error);
          const trasInvalido = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          input.value = '120';
          fn(input, error);
          const trasValido = { valido: input.checkValidity(), mensajeVacio: error.textContent === '' };
          const got = { trasInvalido, trasValido };
          const expected = { trasInvalido: { valido: false, tieneMensaje: true }, trasValido: { valido: true, mensajeVacio: true } };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => {
      const input = f.querySelector('#precio-s1');
      const error = f.querySelector('#error-precio-s1');
      input.addEventListener('input', () => fn(input, error));
    }
  },

  // ---------- E2 ----------
  {
    fn: 'validarTelefonoExacto',
    fixtureHTML: `<form id="form-tel-s2" class="p-4 max-w-sm space-y-2" novalidate>
  <label for="tel-s2" class="block text-sm font-medium text-slate-700">Telefono de contacto</label>
  <input id="tel-s2" type="text" placeholder="600123456" class="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
  <span id="error-tel-s2" class="block text-xs text-red-600 min-h-[1rem]"></span>
</form>`,
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('#tel-s2');
          const error = f.querySelector('#error-tel-s2');
          input.value = '600123456';
          fn(input, error);
          const got = { valido: input.checkValidity(), mensajeVacio: error.textContent === '' };
          const expected = { valido: true, mensajeVacio: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#tel-s2');
          const error = f.querySelector('#error-tel-s2');
          input.value = '60012345';
          fn(input, error);
          const got = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          const expected = { valido: false, tieneMensaje: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#tel-s2');
          const error = f.querySelector('#error-tel-s2');
          input.value = '6001234567';
          fn(input, error);
          const got = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          const expected = { valido: false, tieneMensaje: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#tel-s2');
          const error = f.querySelector('#error-tel-s2');
          input.value = '60012345X';
          fn(input, error);
          const got = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          const expected = { valido: false, tieneMensaje: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#tel-s2');
          const error = f.querySelector('#error-tel-s2');
          input.value = '12345678';
          fn(input, error);
          const trasInvalido = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          input.value = '911234567';
          fn(input, error);
          const trasValido = { valido: input.checkValidity(), mensajeVacio: error.textContent === '' };
          const got = { trasInvalido, trasValido };
          const expected = { trasInvalido: { valido: false, tieneMensaje: true }, trasValido: { valido: true, mensajeVacio: true } };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => {
      const input = f.querySelector('#tel-s2');
      const error = f.querySelector('#error-tel-s2');
      input.addEventListener('input', () => fn(input, error));
    }
  },

  // ---------- E3 ----------
  {
    fn: 'activarContadorConTope',
    fixtureHTML: `<div class="p-4 max-w-sm">
  <div class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p class="text-sm font-semibold text-slate-800">Camiseta tecnica</p>
      <p class="text-xs text-slate-500">Quedan <span id="restante-s3" class="font-semibold text-slate-700">7</span> antes del maximo</p>
    </div>
    <div class="flex items-center gap-2 self-start sm:self-auto">
      <button id="menos-s3" type="button" aria-label="Quitar una unidad" class="h-8 w-8 rounded-full bg-slate-100 text-base font-bold text-slate-700 hover:bg-slate-200">-</button>
      <span id="cantidad-s3" data-cantidad="1" class="w-8 text-center text-sm font-semibold text-slate-900">1</span>
      <button id="mas-s3" type="button" aria-label="Anadir una unidad" class="h-8 w-8 rounded-full bg-slate-100 text-base font-bold text-slate-700 hover:bg-slate-200">+</button>
    </div>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const mas = f.querySelector('#mas-s3');
          const menos = f.querySelector('#menos-s3');
          const cantidad = f.querySelector('#cantidad-s3');
          const restante = f.querySelector('#restante-s3');
          fn(mas, menos, cantidad, restante, 1, 8);
          mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: cantidad.textContent, dato: cantidad.dataset.cantidad, restante: restante.textContent };
          const expected = { texto: '4', dato: '4', restante: '4' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const mas = f.querySelector('#mas-s3');
          const menos = f.querySelector('#menos-s3');
          const cantidad = f.querySelector('#cantidad-s3');
          const restante = f.querySelector('#restante-s3');
          fn(mas, menos, cantidad, restante, 1, 8);
          for (let i = 0; i < 20; i++) mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: cantidad.textContent, dato: cantidad.dataset.cantidad, restante: restante.textContent };
          const expected = { texto: '8', dato: '8', restante: '0' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const mas = f.querySelector('#mas-s3');
          const menos = f.querySelector('#menos-s3');
          const cantidad = f.querySelector('#cantidad-s3');
          const restante = f.querySelector('#restante-s3');
          fn(mas, menos, cantidad, restante, 1, 8);
          for (let i = 0; i < 5; i++) menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: cantidad.textContent, dato: cantidad.dataset.cantidad, restante: restante.textContent };
          const expected = { texto: '1', dato: '1', restante: '7' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const mas = f.querySelector('#mas-s3');
          const menos = f.querySelector('#menos-s3');
          const cantidad = f.querySelector('#cantidad-s3');
          const restante = f.querySelector('#restante-s3');
          fn(mas, menos, cantidad, restante, 1, 8);
          for (let i = 0; i < 4; i++) mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: cantidad.textContent, dato: cantidad.dataset.cantidad, restante: restante.textContent };
          const expected = { texto: '3', dato: '3', restante: '5' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const mas = f.querySelector('#mas-s3');
          const menos = f.querySelector('#menos-s3');
          const cantidad = f.querySelector('#cantidad-s3');
          const restante = f.querySelector('#restante-s3');
          fn(mas, menos, cantidad, restante, 1, 8);
          mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          // Alguien de fuera cambia la cantidad: el siguiente clic tiene
          // que partir de ESE valor, no del que hubiera al enganchar.
          cantidad.dataset.cantidad = '6';
          cantidad.textContent = '6';
          mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: cantidad.textContent, dato: cantidad.dataset.cantidad, restante: restante.textContent };
          const expected = { texto: '7', dato: '7', restante: '1' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(
      f.querySelector('#mas-s3'),
      f.querySelector('#menos-s3'),
      f.querySelector('#cantidad-s3'),
      f.querySelector('#restante-s3'),
      1,
      8
    )
  },

  // ---------- E4 ----------
  {
    fn: 'alternarDetalleAccesible',
    fixtureHTML: `<div class="p-4 max-w-sm">
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <button id="boton-detalle-s4" type="button" aria-expanded="false" aria-controls="detalle-s4" class="flex w-full items-center justify-between gap-2 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100">
      <span>Detalles del envio</span>
      <span id="flecha-s4" class="text-xs text-slate-500">v</span>
    </button>
    <div id="detalle-s4" class="hidden border-t border-slate-200 px-3 py-2 text-sm text-slate-600">
      <p>Entrega estimada en 48 h laborables.</p>
    </div>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const boton = f.querySelector('#boton-detalle-s4');
          const detalle = f.querySelector('#detalle-s4');
          const flecha = f.querySelector('#flecha-s4');
          fn(boton, detalle, flecha);
          boton.querySelector('span').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { aria: boton.getAttribute('aria-expanded'), oculto: detalle.classList.contains('hidden'), flecha: flecha.textContent };
          const expected = { aria: 'true', oculto: false, flecha: '^' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#boton-detalle-s4');
          const detalle = f.querySelector('#detalle-s4');
          const flecha = f.querySelector('#flecha-s4');
          fn(boton, detalle, flecha);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { aria: boton.getAttribute('aria-expanded'), oculto: detalle.classList.contains('hidden'), flecha: flecha.textContent };
          const expected = { aria: 'false', oculto: true, flecha: 'v' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#boton-detalle-s4');
          const detalle = f.querySelector('#detalle-s4');
          const flecha = f.querySelector('#flecha-s4');
          fn(boton, detalle, flecha);
          for (let i = 0; i < 3; i++) boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { aria: boton.getAttribute('aria-expanded'), oculto: detalle.classList.contains('hidden'), flecha: flecha.textContent };
          const expected = { aria: 'true', oculto: false, flecha: '^' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#boton-detalle-s4');
          const detalle = f.querySelector('#detalle-s4');
          const flecha = f.querySelector('#flecha-s4');
          fn(boton, detalle, flecha);
          // El estado de partida lo marca el HTML, no el orden de los clics:
          // aqui el bloque ya viene abierto desde fuera.
          boton.setAttribute('aria-expanded', 'true');
          detalle.classList.remove('hidden');
          flecha.textContent = '^';
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { aria: boton.getAttribute('aria-expanded'), oculto: detalle.classList.contains('hidden'), flecha: flecha.textContent };
          const expected = { aria: 'false', oculto: true, flecha: 'v' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#boton-detalle-s4'), f.querySelector('#detalle-s4'), f.querySelector('#flecha-s4'))
  },

  // ---------- E5 ----------
  {
    fn: 'activarFiltroEtiquetas',
    fixtureHTML: `<div id="zona-filtros-s5" class="space-y-3 p-4">
  <div class="flex flex-wrap gap-2">
    <button type="button" class="filtro filtro--activo rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100" data-etiqueta="todos">Todos</button>
    <button type="button" class="filtro rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100" data-etiqueta="css">CSS</button>
    <button type="button" class="filtro rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100" data-etiqueta="js">JavaScript</button>
    <button type="button" class="filtro rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100" data-etiqueta="dom">DOM</button>
  </div>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
    <article class="articulo rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm" data-etiqueta="css">Container queries</article>
    <article class="articulo rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm" data-etiqueta="js">Closures</article>
    <article class="articulo rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm" data-etiqueta="dom">Delegacion de eventos</article>
    <article class="articulo rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm" data-etiqueta="js">Promesas</article>
    <article class="articulo rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm" data-etiqueta="css">Cascada y capas</article>
    <article class="articulo rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm" data-etiqueta="dom">dataset</article>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-filtros-s5');
          fn(zona);
          zona.querySelector('[data-etiqueta="js"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: [...zona.querySelectorAll('.articulo')].map(a => !a.classList.contains('hidden')),
            activos: [...zona.querySelectorAll('.filtro')].map(b => b.classList.contains('filtro--activo'))
          };
          const expected = { visibles: [false, true, false, true, false, false], activos: [false, false, true, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-filtros-s5');
          fn(zona);
          zona.querySelector('[data-etiqueta="js"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          zona.querySelector('[data-etiqueta="js"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: [...zona.querySelectorAll('.articulo')].map(a => !a.classList.contains('hidden')),
            activos: [...zona.querySelectorAll('.filtro')].map(b => b.classList.contains('filtro--activo'))
          };
          const expected = { visibles: [false, true, false, true, false, false], activos: [false, false, true, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-filtros-s5');
          fn(zona);
          zona.querySelector('[data-etiqueta="js"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          zona.querySelector('[data-etiqueta="css"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: [...zona.querySelectorAll('.articulo')].map(a => !a.classList.contains('hidden')),
            activos: [...zona.querySelectorAll('.filtro')].map(b => b.classList.contains('filtro--activo'))
          };
          const expected = { visibles: [true, false, false, false, true, false], activos: [false, true, false, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-filtros-s5');
          fn(zona);
          zona.querySelector('[data-etiqueta="dom"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          zona.querySelector('[data-etiqueta="todos"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: [...zona.querySelectorAll('.articulo')].map(a => !a.classList.contains('hidden')),
            activos: [...zona.querySelectorAll('.filtro')].map(b => b.classList.contains('filtro--activo'))
          };
          const expected = { visibles: [true, true, true, true, true, true], activos: [true, false, false, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-filtros-s5');
          fn(zona);
          zona.querySelector('[data-etiqueta="css"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          zona.querySelectorAll('.articulo')[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: [...zona.querySelectorAll('.articulo')].map(a => !a.classList.contains('hidden')),
            activos: [...zona.querySelectorAll('.filtro')].map(b => b.classList.contains('filtro--activo'))
          };
          const expected = { visibles: [true, false, false, false, true, false], activos: [false, true, false, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#zona-filtros-s5'))
  },

  // ---------- E6 ----------
  {
    fn: 'filtrarUsuariosPorTexto',
    fixtureHTML: `<div class="space-y-3 p-4">
  <input id="buscar-usuario-s6" type="search" placeholder="Buscar por nombre o correo" class="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
  <p class="text-xs text-slate-500"><span id="resultados-s6" class="font-semibold text-slate-700">5</span> usuarios visibles</p>
  <ul id="lista-usuarios-s6" class="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
    <li class="usuario flex flex-col gap-0 p-2 text-sm sm:flex-row sm:items-center sm:justify-between" data-nombre="Marta Ruiz" data-correo="marta@vora.cat"><span class="font-medium text-slate-800">Marta Ruiz</span><span class="text-xs text-slate-500">marta@vora.cat</span></li>
    <li class="usuario flex flex-col gap-0 p-2 text-sm sm:flex-row sm:items-center sm:justify-between" data-nombre="Andres Pena" data-correo="andres@lumen.io"><span class="font-medium text-slate-800">Andres Pena</span><span class="text-xs text-slate-500">andres@lumen.io</span></li>
    <li class="usuario flex flex-col gap-0 p-2 text-sm sm:flex-row sm:items-center sm:justify-between" data-nombre="Nuria Sanz" data-correo="nuria@vora.cat"><span class="font-medium text-slate-800">Nuria Sanz</span><span class="text-xs text-slate-500">nuria@vora.cat</span></li>
    <li class="usuario flex flex-col gap-0 p-2 text-sm sm:flex-row sm:items-center sm:justify-between" data-nombre="Bruno Gil" data-correo="bruno@lumen.io"><span class="font-medium text-slate-800">Bruno Gil</span><span class="text-xs text-slate-500">bruno@lumen.io</span></li>
    <li class="usuario flex flex-col gap-0 p-2 text-sm sm:flex-row sm:items-center sm:justify-between" data-nombre="Clara Prat" data-correo="clara@atlas.dev"><span class="font-medium text-slate-800">Clara Prat</span><span class="text-xs text-slate-500">clara@atlas.dev</span></li>
  </ul>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('#buscar-usuario-s6');
          const lista = f.querySelector('#lista-usuarios-s6');
          const resultados = f.querySelector('#resultados-s6');
          fn(input, lista, resultados);
          input.value = 'nur';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = {
            visibles: [...lista.querySelectorAll('.usuario')].map(u => !u.classList.contains('hidden')),
            contador: resultados.textContent
          };
          const expected = { visibles: [false, false, true, false, false], contador: '1' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#buscar-usuario-s6');
          const lista = f.querySelector('#lista-usuarios-s6');
          const resultados = f.querySelector('#resultados-s6');
          fn(input, lista, resultados);
          input.value = 'lumen';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = {
            visibles: [...lista.querySelectorAll('.usuario')].map(u => !u.classList.contains('hidden')),
            contador: resultados.textContent
          };
          const expected = { visibles: [false, true, false, true, false], contador: '2' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#buscar-usuario-s6');
          const lista = f.querySelector('#lista-usuarios-s6');
          const resultados = f.querySelector('#resultados-s6');
          fn(input, lista, resultados);
          input.value = 'MARTA';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = {
            visibles: [...lista.querySelectorAll('.usuario')].map(u => !u.classList.contains('hidden')),
            contador: resultados.textContent
          };
          const expected = { visibles: [true, false, false, false, false], contador: '1' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#buscar-usuario-s6');
          const lista = f.querySelector('#lista-usuarios-s6');
          const resultados = f.querySelector('#resultados-s6');
          fn(input, lista, resultados);
          input.value = 'nur';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.value = 'bru';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = {
            visibles: [...lista.querySelectorAll('.usuario')].map(u => !u.classList.contains('hidden')),
            contador: resultados.textContent
          };
          const expected = { visibles: [false, false, false, true, false], contador: '1' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#buscar-usuario-s6');
          const lista = f.querySelector('#lista-usuarios-s6');
          const resultados = f.querySelector('#resultados-s6');
          fn(input, lista, resultados);
          input.value = 'clara';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = {
            visibles: [...lista.querySelectorAll('.usuario')].map(u => !u.classList.contains('hidden')),
            contador: resultados.textContent
          };
          const expected = { visibles: [true, true, true, true, true], contador: '5' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#buscar-usuario-s6'), f.querySelector('#lista-usuarios-s6'), f.querySelector('#resultados-s6'))
  },

  // ---------- E7 ----------
  {
    fn: 'sincronizarCheckMaestro',
    fixtureHTML: `<div class="p-4 max-w-sm">
  <fieldset id="zona-permisos-s7" class="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
    <legend class="px-1 text-sm font-semibold text-slate-800">Permisos del rol</legend>
    <label class="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
      <input id="maestro-s7" type="checkbox" class="h-4 w-4 accent-sky-600"> Seleccionar todos
    </label>
    <label class="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" class="check-hijo h-4 w-4 accent-sky-600" value="leer"> Leer</label>
    <label class="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" class="check-hijo h-4 w-4 accent-sky-600" value="escribir"> Escribir</label>
    <label class="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" class="check-hijo h-4 w-4 accent-sky-600" value="borrar"> Borrar</label>
    <label class="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" class="check-hijo h-4 w-4 accent-sky-600" value="publicar"> Publicar</label>
    <p class="pt-1 text-xs text-slate-500"><span id="estado-s7" class="font-semibold text-slate-700">0</span> de 4 seleccionados</p>
  </fieldset>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-permisos-s7');
          const maestro = f.querySelector('#maestro-s7');
          fn(zona);
          maestro.click();
          const got = {
            hijos: [...zona.querySelectorAll('.check-hijo')].map(c => c.checked),
            maestro: maestro.checked,
            estado: f.querySelector('#estado-s7').textContent
          };
          const expected = { hijos: [true, true, true, true], maestro: true, estado: '4' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-permisos-s7');
          const maestro = f.querySelector('#maestro-s7');
          fn(zona);
          maestro.click();
          maestro.click();
          const got = {
            hijos: [...zona.querySelectorAll('.check-hijo')].map(c => c.checked),
            maestro: maestro.checked,
            estado: f.querySelector('#estado-s7').textContent
          };
          const expected = { hijos: [false, false, false, false], maestro: false, estado: '0' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-permisos-s7');
          const maestro = f.querySelector('#maestro-s7');
          fn(zona);
          const hijos = [...zona.querySelectorAll('.check-hijo')];
          hijos.forEach(hijo => hijo.click());
          const got = { maestro: maestro.checked, estado: f.querySelector('#estado-s7').textContent };
          const expected = { maestro: true, estado: '4' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-permisos-s7');
          const maestro = f.querySelector('#maestro-s7');
          fn(zona);
          maestro.click();
          const hijos = [...zona.querySelectorAll('.check-hijo')];
          hijos[2].click();
          const got = {
            hijos: hijos.map(c => c.checked),
            maestro: maestro.checked,
            estado: f.querySelector('#estado-s7').textContent
          };
          const expected = { hijos: [true, true, false, true], maestro: false, estado: '3' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-permisos-s7');
          const maestro = f.querySelector('#maestro-s7');
          fn(zona);
          const hijos = [...zona.querySelectorAll('.check-hijo')];
          maestro.click();
          hijos[0].click();
          hijos[0].click();
          const got = {
            hijos: hijos.map(c => c.checked),
            maestro: maestro.checked,
            estado: f.querySelector('#estado-s7').textContent
          };
          const expected = { hijos: [true, true, true, true], maestro: true, estado: '4' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#zona-permisos-s7'))
  },

  // ---------- E8 ----------
  {
    fn: 'marcarPestanaActiva',
    fixtureHTML: `<div class="space-y-3 p-4">
  <div id="barra-pestanas-s8" role="tablist" class="flex flex-wrap items-center gap-1 border-b border-slate-200">
    <button type="button" role="tab" aria-selected="true" data-panel="resumen" class="pestana pestana--activa flex items-center gap-1 px-3 py-2 text-sm text-slate-700 hover:text-slate-900"><span>#</span><span>Resumen</span></button>
    <button type="button" role="tab" aria-selected="false" data-panel="pagos" class="pestana flex items-center gap-1 px-3 py-2 text-sm text-slate-700 hover:text-slate-900"><span>#</span><span>Pagos</span></button>
    <button type="button" role="tab" aria-selected="false" data-panel="envios" class="pestana flex items-center gap-1 px-3 py-2 text-sm text-slate-700 hover:text-slate-900"><span>#</span><span>Envios</span></button>
    <span id="separador-s8" class="ml-auto pr-2 text-xs text-slate-400">3 secciones</span>
  </div>
  <div id="paneles-s8">
    <section class="panel-pestana rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700" data-panel="resumen">Pedido en preparacion.</section>
    <section class="panel-pestana hidden rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700" data-panel="pagos">Pagado con tarjeta.</section>
    <section class="panel-pestana hidden rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700" data-panel="envios">Sale manana por la tarde.</section>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-pestanas-s8');
          const paneles = f.querySelector('#paneles-s8');
          fn(barra, paneles);
          barra.querySelectorAll('.pestana')[1].querySelectorAll('span')[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            activas: [...barra.querySelectorAll('.pestana')].map(p => p.classList.contains('pestana--activa')),
            visibles: [...paneles.querySelectorAll('.panel-pestana')].map(p => !p.classList.contains('hidden'))
          };
          const expected = { activas: [false, true, false], visibles: [false, true, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-pestanas-s8');
          const paneles = f.querySelector('#paneles-s8');
          fn(barra, paneles);
          const pestanas = [...barra.querySelectorAll('.pestana')];
          pestanas[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          pestanas[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            activas: pestanas.map(p => p.classList.contains('pestana--activa')),
            visibles: [...paneles.querySelectorAll('.panel-pestana')].map(p => !p.classList.contains('hidden'))
          };
          const expected = { activas: [true, false, false], visibles: [true, false, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-pestanas-s8');
          const paneles = f.querySelector('#paneles-s8');
          fn(barra, paneles);
          const pestanas = [...barra.querySelectorAll('.pestana')];
          pestanas[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = pestanas.map(p => p.getAttribute('aria-selected'));
          const expected = ['false', 'false', 'true'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-pestanas-s8');
          const paneles = f.querySelector('#paneles-s8');
          fn(barra, paneles);
          const pestanas = [...barra.querySelectorAll('.pestana')];
          pestanas[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          barra.querySelector('#separador-s8').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            activas: pestanas.map(p => p.classList.contains('pestana--activa')),
            visibles: [...paneles.querySelectorAll('.panel-pestana')].map(p => !p.classList.contains('hidden'))
          };
          const expected = { activas: [false, true, false], visibles: [false, true, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-pestanas-s8');
          const paneles = f.querySelector('#paneles-s8');
          fn(barra, paneles);
          const pestanas = [...barra.querySelectorAll('.pestana')];
          pestanas[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          pestanas[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            activas: pestanas.map(p => p.classList.contains('pestana--activa')),
            visibles: [...paneles.querySelectorAll('.panel-pestana')].map(p => !p.classList.contains('hidden'))
          };
          const expected = { activas: [false, true, false], visibles: [false, true, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#barra-pestanas-s8'), f.querySelector('#paneles-s8'))
  },

  // ---------- E9 ----------
  {
    fn: 'activarPopoverConCierreFuera',
    fixtureHTML: `<div class="relative space-y-3 p-4">
  <button id="btn-popover-s9" type="button" aria-expanded="false" class="rounded bg-sky-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-sky-700">Opciones</button>
  <div id="popover-s9" class="hidden w-56 space-y-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
    <p class="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Acciones</p>
    <button id="accion-popover-s9" type="button" class="w-full rounded px-2 py-1 text-left text-sm text-slate-700 hover:bg-slate-100">Duplicar pedido</button>
  </div>
  <p id="fuera-s9" class="text-sm text-slate-500">Resto de la pagina <span id="fuera-anidado-s9" class="underline">con contenido anidado</span></p>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-popover-s9');
          const popover = f.querySelector('#popover-s9');
          fn(boton, popover);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { visible: !popover.classList.contains('hidden'), aria: boton.getAttribute('aria-expanded') };
          const expected = { visible: true, aria: 'true' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-popover-s9');
          const popover = f.querySelector('#popover-s9');
          fn(boton, popover);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          f.querySelector('#accion-popover-s9').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { visible: !popover.classList.contains('hidden'), aria: boton.getAttribute('aria-expanded') };
          const expected = { visible: true, aria: 'true' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-popover-s9');
          const popover = f.querySelector('#popover-s9');
          fn(boton, popover);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          dispararEnTodosLados('click', f.querySelector('#fuera-anidado-s9'));
          const got = { visible: !popover.classList.contains('hidden'), aria: boton.getAttribute('aria-expanded') };
          const expected = { visible: false, aria: 'false' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-popover-s9');
          const popover = f.querySelector('#popover-s9');
          fn(boton, popover);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          dispararEnTodosLados('click', f.querySelector('#fuera-s9'));
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { visible: !popover.classList.contains('hidden'), aria: boton.getAttribute('aria-expanded') };
          const expected = { visible: true, aria: 'true' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-popover-s9');
          const popover = f.querySelector('#popover-s9');
          fn(boton, popover);
          dispararEnTodosLados('click', f.querySelector('#fuera-s9'));
          const got = { visible: !popover.classList.contains('hidden'), aria: boton.getAttribute('aria-expanded') };
          const expected = { visible: false, aria: 'false' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#btn-popover-s9'), f.querySelector('#popover-s9'))
  },

  // ---------- E10 ----------
  {
    fn: 'cerrarNotificacionesYContar',
    fixtureHTML: `<section id="zona-notif-s10" class="space-y-2 p-4">
  <header class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm font-semibold text-slate-800">Facturas pendientes</p>
    <p class="text-xs text-slate-500"><span id="contador-notif-s10" class="font-semibold text-slate-700">4</span> abiertas · <span id="total-notif-s10" class="font-semibold text-slate-700">130</span> EUR</p>
  </header>
  <p id="aviso-limite-s10" class="hidden rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">Importe pendiente por debajo de 100 EUR</p>
  <article class="notificacion flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm" data-importe="60"><span class="text-slate-700">Factura F-101 · 60 EUR</span><button type="button" class="btn-descartar px-2 font-bold text-slate-400 hover:text-slate-700" aria-label="Descartar factura F-101">x</button></article>
  <article class="notificacion flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm" data-importe="30"><span class="text-slate-700">Factura F-102 · 30 EUR</span><button type="button" class="btn-descartar px-2 font-bold text-slate-400 hover:text-slate-700" aria-label="Descartar factura F-102">x</button></article>
  <article class="notificacion flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm" data-importe="25"><span class="text-slate-700">Factura F-103 · 25 EUR</span><button type="button" class="btn-descartar px-2 font-bold text-slate-400 hover:text-slate-700" aria-label="Descartar factura F-103">x</button></article>
  <article class="notificacion flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm" data-importe="15"><span class="text-slate-700">Factura F-104 · 15 EUR</span><button type="button" class="btn-descartar px-2 font-bold text-slate-400 hover:text-slate-700" aria-label="Descartar factura F-104">x</button></article>
</section>`,
    tests: [
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-notif-s10');
          fn(zona);
          const notificaciones = [...zona.querySelectorAll('.notificacion')];
          notificaciones[1].querySelector('.btn-descartar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: notificaciones.map(n => !n.classList.contains('hidden')),
            contador: zona.querySelector('#contador-notif-s10').textContent,
            total: zona.querySelector('#total-notif-s10').textContent,
            avisoVisible: !zona.querySelector('#aviso-limite-s10').classList.contains('hidden')
          };
          const expected = { visibles: [true, false, true, true], contador: '3', total: '100', avisoVisible: false };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-notif-s10');
          fn(zona);
          const notificaciones = [...zona.querySelectorAll('.notificacion')];
          notificaciones[0].querySelector('.btn-descartar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: notificaciones.map(n => !n.classList.contains('hidden')),
            contador: zona.querySelector('#contador-notif-s10').textContent,
            total: zona.querySelector('#total-notif-s10').textContent,
            avisoVisible: !zona.querySelector('#aviso-limite-s10').classList.contains('hidden')
          };
          const expected = { visibles: [false, true, true, true], contador: '3', total: '70', avisoVisible: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-notif-s10');
          fn(zona);
          const notificaciones = [...zona.querySelectorAll('.notificacion')];
          notificaciones[1].querySelector('.btn-descartar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          notificaciones[3].querySelector('.btn-descartar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: notificaciones.map(n => !n.classList.contains('hidden')),
            contador: zona.querySelector('#contador-notif-s10').textContent,
            total: zona.querySelector('#total-notif-s10').textContent,
            avisoVisible: !zona.querySelector('#aviso-limite-s10').classList.contains('hidden')
          };
          const expected = { visibles: [true, false, true, false], contador: '2', total: '85', avisoVisible: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-notif-s10');
          fn(zona);
          const notificaciones = [...zona.querySelectorAll('.notificacion')];
          notificaciones[0].querySelector('.btn-descartar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          notificaciones[0].querySelector('.btn-descartar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: notificaciones.map(n => !n.classList.contains('hidden')),
            contador: zona.querySelector('#contador-notif-s10').textContent,
            total: zona.querySelector('#total-notif-s10').textContent
          };
          const expected = { visibles: [false, true, true, true], contador: '3', total: '70' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-notif-s10');
          fn(zona);
          const notificaciones = [...zona.querySelectorAll('.notificacion')];
          notificaciones[2].querySelector('span').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            visibles: notificaciones.map(n => !n.classList.contains('hidden')),
            contador: zona.querySelector('#contador-notif-s10').textContent,
            total: zona.querySelector('#total-notif-s10').textContent,
            avisoVisible: !zona.querySelector('#aviso-limite-s10').classList.contains('hidden')
          };
          const expected = { visibles: [true, true, true, true], contador: '4', total: '130', avisoVisible: false };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#zona-notif-s10'))
  }
];


// ============================================================
// 23/08 — Refuerzo DOM (añadido — fusionado en dia-19-dom.html)
// Refuerzo dirigido de los gotchas reales del 22-23/08.
// Misma mecánica que EJERCICIOS_BLOQUE2: fixture Tailwind real
// por ejercicio (fixtureHTML) montado en su zona .ex-demo,
// tests de tipo { run } y demo en vivo (ej.demo) al terminar.
// ============================================================
const EJERCICIOS_REFUERZO = [
  // ---------- E1 ----------
  {
    fn: 'resaltarFilaSeleccionada',
    fixtureHTML: `<table id="tabla-filas-r1" class="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
  <thead class="bg-slate-100">
    <tr>
      <th id="cabecera-r1" class="p-2 text-left">Cliente</th>
      <th class="p-2 text-left">Estado</th>
      <th class="p-2 text-left">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr class="fila-tabla border-t" data-cliente="Ana"><td class="p-2">Ana Ruiz</td><td class="p-2"><span class="etiqueta-estado text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Pagado</span></td><td class="p-2">48.00€</td></tr>
    <tr class="fila-tabla border-t" data-cliente="Luis"><td class="p-2">Luis Mora</td><td class="p-2"><span class="etiqueta-estado text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Pendiente</span></td><td class="p-2">120.50€</td></tr>
    <tr class="fila-tabla border-t" data-cliente="Eva"><td class="p-2">Eva Gil</td><td class="p-2"><span class="etiqueta-estado text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Pagado</span></td><td class="p-2">9.90€</td></tr>
    <tr class="fila-tabla border-t" data-cliente="Marc"><td class="p-2">Marc Vidal</td><td class="p-2"><span class="etiqueta-estado text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Anulado</span></td><td class="p-2">33.00€</td></tr>
  </tbody>
</table>`,
    tests: [
      {
        run: (fn, f) => {
          const tabla = f.querySelector('#tabla-filas-r1');
          fn(tabla);
          const filas = [...tabla.querySelectorAll('.fila-tabla')];
          filas[0].querySelector('td').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = filas.map(fila => fila.classList.contains('fila--activa'));
          const expected = [true, false, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const tabla = f.querySelector('#tabla-filas-r1');
          fn(tabla);
          const filas = [...tabla.querySelectorAll('.fila-tabla')];
          filas[1].querySelector('.etiqueta-estado').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = filas.map(fila => fila.classList.contains('fila--activa'));
          const expected = [false, true, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const tabla = f.querySelector('#tabla-filas-r1');
          fn(tabla);
          const filas = [...tabla.querySelectorAll('.fila-tabla')];
          filas[0].querySelector('td').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          filas[2].querySelector('.etiqueta-estado').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = filas.map(fila => fila.classList.contains('fila--activa'));
          const expected = [false, false, true, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const tabla = f.querySelector('#tabla-filas-r1');
          fn(tabla);
          const filas = [...tabla.querySelectorAll('.fila-tabla')];
          filas[0].querySelector('td').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          tabla.querySelector('#cabecera-r1').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = filas.map(fila => fila.classList.contains('fila--activa'));
          const expected = [true, false, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#tabla-filas-r1'))
  },

  // ---------- E2 ----------
  {
    fn: 'sincronizarInterruptorTema',
    fixtureHTML: `<div class="p-4 space-y-3 max-w-xs">
  <button id="btn-tema-r2" aria-pressed="false" class="bg-slate-200 px-3 py-1 rounded text-sm font-medium">Modo oscuro</button>
  <div id="panel-tema-r2" class="p-4 rounded border bg-white text-slate-800 text-sm">Contenido del panel</div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-tema-r2');
          const panel = f.querySelector('#panel-tema-r2');
          fn(boton, panel);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { oscuro: panel.classList.contains('tema-oscuro'), aria: boton.getAttribute('aria-pressed') };
          const expected = { oscuro: true, aria: 'true' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-tema-r2');
          const panel = f.querySelector('#panel-tema-r2');
          fn(boton, panel);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { oscuro: panel.classList.contains('tema-oscuro'), aria: boton.getAttribute('aria-pressed') };
          const expected = { oscuro: false, aria: 'false' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-tema-r2');
          const panel = f.querySelector('#panel-tema-r2');
          fn(boton, panel);
          for (let i = 0; i < 3; i++) boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { oscuro: panel.classList.contains('tema-oscuro'), aria: boton.getAttribute('aria-pressed') };
          const expected = { oscuro: true, aria: 'true' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#btn-tema-r2'), f.querySelector('#panel-tema-r2'))
  },

  // ---------- E3 ----------
  {
    fn: 'activarCierreAvisos',
    fixtureHTML: `<div id="zona-avisos-r3" class="p-4 space-y-2" data-restantes="3">
  <p class="text-sm text-slate-600">Avisos activos: <span id="contador-avisos-r3" class="font-semibold">3</span></p>
  <div class="aviso flex justify-between items-center bg-amber-50 border border-amber-200 rounded p-2 text-sm">Servidor reiniciado <button class="btn-cerrar text-amber-700 font-bold px-2">✕</button></div>
  <div class="aviso flex justify-between items-center bg-amber-50 border border-amber-200 rounded p-2 text-sm">Copia de seguridad pendiente <button class="btn-cerrar text-amber-700 font-bold px-2">✕</button></div>
  <div class="aviso flex justify-between items-center bg-amber-50 border border-amber-200 rounded p-2 text-sm">Certificado a punto de caducar <button class="btn-cerrar text-amber-700 font-bold px-2">✕</button></div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-avisos-r3');
          fn(zona);
          const avisos = [...zona.querySelectorAll('.aviso')];
          avisos[0].querySelector('.btn-cerrar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            oculto: avisos[0].classList.contains('hidden'),
            texto: zona.querySelector('#contador-avisos-r3').textContent,
            data: zona.dataset.restantes
          };
          const expected = { oculto: true, texto: '2', data: '2' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-avisos-r3');
          fn(zona);
          const avisos = [...zona.querySelectorAll('.aviso')];
          avisos.forEach(aviso => aviso.querySelector('.btn-cerrar').dispatchEvent(new MouseEvent('click', { bubbles: true })));
          const got = {
            ocultos: avisos.every(aviso => aviso.classList.contains('hidden')),
            texto: zona.querySelector('#contador-avisos-r3').textContent,
            data: zona.dataset.restantes
          };
          const expected = { ocultos: true, texto: '0', data: '0' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-avisos-r3');
          fn(zona);
          const primero = zona.querySelector('.aviso .btn-cerrar');
          primero.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          primero.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            texto: zona.querySelector('#contador-avisos-r3').textContent,
            data: zona.dataset.restantes
          };
          const expected = { texto: '2', data: '2' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const zona = f.querySelector('#zona-avisos-r3');
          fn(zona);
          zona.querySelector('.aviso').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            texto: zona.querySelector('#contador-avisos-r3').textContent,
            data: zona.dataset.restantes
          };
          const expected = { texto: '3', data: '3' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#zona-avisos-r3'))
  },

  // ---------- E4 ----------
  {
    fn: 'ajustarTemperatura',
    fixtureHTML: `<div class="flex items-center gap-3 p-4 w-fit border rounded-lg">
  <button id="bajar-temp-r4" class="w-8 h-8 rounded bg-sky-100 text-sky-700 font-bold">−</button>
  <span id="temp-r4" class="w-12 text-center font-semibold text-lg" data-temperatura="20">20</span>
  <button id="subir-temp-r4" class="w-8 h-8 rounded bg-rose-100 text-rose-700 font-bold">+</button>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const subir = f.querySelector('#subir-temp-r4');
          const bajar = f.querySelector('#bajar-temp-r4');
          const valor = f.querySelector('#temp-r4');
          fn(subir, bajar, valor, 15, 25);
          for (let i = 0; i < 3; i++) subir.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: valor.textContent, data: valor.dataset.temperatura };
          const expected = { texto: '23', data: '23' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const subir = f.querySelector('#subir-temp-r4');
          const bajar = f.querySelector('#bajar-temp-r4');
          const valor = f.querySelector('#temp-r4');
          fn(subir, bajar, valor, 15, 25);
          for (let i = 0; i < 10; i++) subir.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: valor.textContent, data: valor.dataset.temperatura };
          const expected = { texto: '25', data: '25' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const subir = f.querySelector('#subir-temp-r4');
          const bajar = f.querySelector('#bajar-temp-r4');
          const valor = f.querySelector('#temp-r4');
          fn(subir, bajar, valor, 15, 25);
          for (let i = 0; i < 10; i++) bajar.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: valor.textContent, data: valor.dataset.temperatura };
          const expected = { texto: '15', data: '15' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const subir = f.querySelector('#subir-temp-r4');
          const bajar = f.querySelector('#bajar-temp-r4');
          const valor = f.querySelector('#temp-r4');
          fn(subir, bajar, valor, 15, 25);
          subir.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          subir.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          bajar.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          subir.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = { texto: valor.textContent, data: valor.dataset.temperatura };
          const expected = { texto: '22', data: '22' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#subir-temp-r4'), f.querySelector('#bajar-temp-r4'), f.querySelector('#temp-r4'), 15, 25)
  },

  // ---------- E5 ----------
  {
    fn: 'validarCodigoPostal',
    fixtureHTML: `<div class="flex flex-col gap-1 p-4 max-w-xs">
  <label for="cp-r5" class="text-sm font-medium">Código postal</label>
  <input id="cp-r5" type="text" class="border rounded px-2 py-1">
  <span id="error-cp-r5" class="text-xs text-red-500"></span>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('#cp-r5');
          const error = f.querySelector('#error-cp-r5');
          input.value = '28001';
          fn(input, error);
          const got = { valido: input.checkValidity(), mensajeVacio: error.textContent === '' };
          const expected = { valido: true, mensajeVacio: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#cp-r5');
          const error = f.querySelector('#error-cp-r5');
          input.value = '280';
          fn(input, error);
          const got = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          const expected = { valido: false, tieneMensaje: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#cp-r5');
          const error = f.querySelector('#error-cp-r5');
          input.value = '2800A';
          fn(input, error);
          const got = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          const expected = { valido: false, tieneMensaje: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#cp-r5');
          const error = f.querySelector('#error-cp-r5');
          input.value = '280';
          fn(input, error);
          const trasInvalido = { valido: input.checkValidity(), tieneMensaje: error.textContent.length > 0 };
          input.value = '08001';
          fn(input, error);
          const trasValido = { valido: input.checkValidity(), mensajeVacio: error.textContent === '' };
          const got = { trasInvalido, trasValido };
          const expected = { trasInvalido: { valido: false, tieneMensaje: true }, trasValido: { valido: true, mensajeVacio: true } };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => {
      const input = f.querySelector('#cp-r5');
      const error = f.querySelector('#error-cp-r5');
      input.addEventListener('input', () => fn(input, error));
    }
  },

  // ---------- E6 ----------
  {
    fn: 'activarPanelLateral',
    fixtureHTML: `<div class="relative p-4 max-w-sm space-y-3">
  <button id="btn-panel-r6" class="bg-slate-200 px-3 py-1 rounded text-sm">Abrir panel</button>
  <aside id="panel-r6" class="hidden border rounded bg-white shadow p-3 space-y-2">
    <h4 id="titulo-panel-r6" class="font-semibold text-sm">Ajustes</h4>
    <button id="guardar-panel-r6" class="bg-slate-100 px-2 py-1 rounded text-xs">Guardar</button>
  </aside>
  <div id="fuera-r6" class="p-2 bg-slate-50 rounded text-sm">Resto de la página <span>con contenido anidado</span></div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-panel-r6');
          const panel = f.querySelector('#panel-r6');
          fn(boton, panel);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = panel.classList.contains('hidden');
          return { pass: got === false, got, expected: false };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-panel-r6');
          const panel = f.querySelector('#panel-r6');
          const anidado = f.querySelector('#fuera-r6 span');
          fn(boton, panel);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          dispararEnTodosLados('click', anidado);
          const got = panel.classList.contains('hidden');
          return { pass: got === true, got, expected: true };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-panel-r6');
          const panel = f.querySelector('#panel-r6');
          fn(boton, panel);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          f.querySelector('#titulo-panel-r6').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = panel.classList.contains('hidden');
          return { pass: got === false, got, expected: false };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#btn-panel-r6');
          const panel = f.querySelector('#panel-r6');
          fn(boton, panel);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          f.querySelector('#guardar-panel-r6').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = panel.classList.contains('hidden');
          return { pass: got === false, got, expected: false };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#btn-panel-r6'), f.querySelector('#panel-r6'))
  },

  // ---------- E7 ----------
  {
    fn: 'filtrarTareasPorEstadoYTexto',
    fixtureHTML: `<div class="p-4 max-w-sm space-y-2">
  <input id="buscar-r7" type="text" placeholder="Buscar tarea..." class="border rounded px-2 py-1 w-full text-sm">
  <select id="estado-r7" class="border rounded px-2 py-1 w-full text-sm">
    <option value="todos">Todos los estados</option>
    <option value="pendiente">Pendientes</option>
    <option value="hecha">Hechas</option>
  </select>
  <ul id="lista-tareas-r7" class="divide-y border rounded bg-white">
    <li class="tarea p-2 text-sm" data-titulo="Revisar PR" data-estado="pendiente">Revisar PR</li>
    <li class="tarea p-2 text-sm" data-titulo="Actualizar docs" data-estado="hecha">Actualizar docs</li>
    <li class="tarea p-2 text-sm" data-titulo="Revisar diseño" data-estado="hecha">Revisar diseño</li>
    <li class="tarea p-2 text-sm" data-titulo="Desplegar staging" data-estado="pendiente">Desplegar staging</li>
    <li class="tarea p-2 text-sm" data-titulo="Escribir tests" data-estado="pendiente">Escribir tests</li>
  </ul>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const buscar = f.querySelector('#buscar-r7');
          const estado = f.querySelector('#estado-r7');
          const lista = f.querySelector('#lista-tareas-r7');
          fn(buscar, estado, lista);
          buscar.value = 'revisar';
          buscar.dispatchEvent(new Event('input', { bubbles: true }));
          const got = [...lista.querySelectorAll('.tarea')].map(t => !t.classList.contains('hidden'));
          const expected = [true, false, true, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const buscar = f.querySelector('#buscar-r7');
          const estado = f.querySelector('#estado-r7');
          const lista = f.querySelector('#lista-tareas-r7');
          fn(buscar, estado, lista);
          estado.value = 'hecha';
          estado.dispatchEvent(new Event('change', { bubbles: true }));
          const got = [...lista.querySelectorAll('.tarea')].map(t => !t.classList.contains('hidden'));
          const expected = [false, true, true, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const buscar = f.querySelector('#buscar-r7');
          const estado = f.querySelector('#estado-r7');
          const lista = f.querySelector('#lista-tareas-r7');
          fn(buscar, estado, lista);
          buscar.value = 'revisar';
          buscar.dispatchEvent(new Event('input', { bubbles: true }));
          estado.value = 'hecha';
          estado.dispatchEvent(new Event('change', { bubbles: true }));
          const got = [...lista.querySelectorAll('.tarea')].map(t => !t.classList.contains('hidden'));
          const expected = [false, false, true, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const buscar = f.querySelector('#buscar-r7');
          const estado = f.querySelector('#estado-r7');
          const lista = f.querySelector('#lista-tareas-r7');
          fn(buscar, estado, lista);
          buscar.value = 'REVISAR';
          buscar.dispatchEvent(new Event('input', { bubbles: true }));
          const got = [...lista.querySelectorAll('.tarea')].map(t => !t.classList.contains('hidden'));
          const expected = [true, false, true, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const buscar = f.querySelector('#buscar-r7');
          const estado = f.querySelector('#estado-r7');
          const lista = f.querySelector('#lista-tareas-r7');
          fn(buscar, estado, lista);
          buscar.value = '';
          buscar.dispatchEvent(new Event('input', { bubbles: true }));
          const got = [...lista.querySelectorAll('.tarea')].map(t => !t.classList.contains('hidden'));
          const expected = [true, true, true, true, true];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const buscar = f.querySelector('#buscar-r7');
          const estado = f.querySelector('#estado-r7');
          const lista = f.querySelector('#lista-tareas-r7');
          fn(buscar, estado, lista);
          buscar.value = 'tests';
          buscar.dispatchEvent(new Event('input', { bubbles: true }));
          buscar.value = '';
          buscar.dispatchEvent(new Event('input', { bubbles: true }));
          const got = [...lista.querySelectorAll('.tarea')].map(t => !t.classList.contains('hidden'));
          const expected = [true, true, true, true, true];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#buscar-r7'), f.querySelector('#estado-r7'), f.querySelector('#lista-tareas-r7'))
  },

  // ---------- E8 ----------
  {
    fn: 'moverAbajo',
    fixtureHTML: `<ul id="lista-bajar-r8" class="p-4 max-w-xs divide-y">
  <li class="item-lista flex justify-between items-center p-2" data-tarea="A">Tarea A <button class="btn-bajar">▼</button></li>
  <li class="item-lista flex justify-between items-center p-2" data-tarea="B">Tarea B <button class="btn-bajar">▼</button></li>
  <li class="item-lista flex justify-between items-center p-2" data-tarea="C">Tarea C <button class="btn-bajar">▼</button></li>
  <li class="item-lista flex justify-between items-center p-2" data-tarea="D">Tarea D <button class="btn-bajar">▼</button></li>
</ul>`,
    tests: [
      {
        run: (fn, f) => {
          const lista = f.querySelector('#lista-bajar-r8');
          fn(lista);
          lista.querySelector('[data-tarea="A"] .btn-bajar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-lista')].map(li => li.dataset.tarea);
          const expected = ['B', 'A', 'C', 'D'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const lista = f.querySelector('#lista-bajar-r8');
          fn(lista);
          lista.querySelector('[data-tarea="D"] .btn-bajar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-lista')].map(li => li.dataset.tarea);
          const expected = ['A', 'B', 'C', 'D'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const lista = f.querySelector('#lista-bajar-r8');
          fn(lista);
          lista.querySelector('[data-tarea="A"] .btn-bajar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          lista.querySelector('[data-tarea="A"] .btn-bajar').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-lista')].map(li => li.dataset.tarea);
          const expected = ['B', 'C', 'A', 'D'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const lista = f.querySelector('#lista-bajar-r8');
          fn(lista);
          lista.querySelector('[data-tarea="A"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-lista')].map(li => li.dataset.tarea);
          const expected = ['A', 'B', 'C', 'D'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#lista-bajar-r8'))
  },

  // ---------- E9 ----------
  {
    fn: 'activarValoracionEstrellas',
    fixtureHTML: `<div id="valoracion-r9" class="p-4 space-y-2 w-fit" data-valoracion="0">
  <div class="flex gap-1">
    <button class="estrella text-2xl leading-none" data-valor="1">★</button>
    <button class="estrella text-2xl leading-none" data-valor="2">★</button>
    <button class="estrella text-2xl leading-none" data-valor="3">★</button>
    <button class="estrella text-2xl leading-none" data-valor="4">★</button>
    <button class="estrella text-2xl leading-none" data-valor="5">★</button>
  </div>
  <span id="texto-valoracion-r9" class="text-sm text-slate-600">Sin valorar</span>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const contenedor = f.querySelector('#valoracion-r9');
          fn(contenedor);
          const estrellas = [...contenedor.querySelectorAll('.estrella')];
          estrellas[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            activas: estrellas.map(e => e.classList.contains('estrella--activa')),
            data: contenedor.dataset.valoracion,
            texto: contenedor.querySelector('#texto-valoracion-r9').textContent
          };
          const expected = { activas: [true, true, true, false, false], data: '3', texto: '3 de 5' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const contenedor = f.querySelector('#valoracion-r9');
          fn(contenedor);
          const estrellas = [...contenedor.querySelectorAll('.estrella')];
          estrellas[4].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            activas: estrellas.map(e => e.classList.contains('estrella--activa')),
            data: contenedor.dataset.valoracion,
            texto: contenedor.querySelector('#texto-valoracion-r9').textContent
          };
          const expected = { activas: [true, true, true, true, true], data: '5', texto: '5 de 5' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const contenedor = f.querySelector('#valoracion-r9');
          fn(contenedor);
          const estrellas = [...contenedor.querySelectorAll('.estrella')];
          estrellas[4].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          estrellas[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            activas: estrellas.map(e => e.classList.contains('estrella--activa')),
            data: contenedor.dataset.valoracion,
            texto: contenedor.querySelector('#texto-valoracion-r9').textContent
          };
          const expected = { activas: [true, false, false, false, false], data: '1', texto: '1 de 5' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const contenedor = f.querySelector('#valoracion-r9');
          fn(contenedor);
          const estrellas = [...contenedor.querySelectorAll('.estrella')];
          contenedor.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = {
            activas: estrellas.map(e => e.classList.contains('estrella--activa')),
            data: contenedor.dataset.valoracion,
            texto: contenedor.querySelector('#texto-valoracion-r9').textContent
          };
          const expected = { activas: [false, false, false, false, false], data: '0', texto: 'Sin valorar' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#valoracion-r9'))
  },

  // ---------- E10 ----------
  {
    fn: 'resumirCarrito',
    fixtureHTML: `<div id="carrito-r10" class="p-4 space-y-2 max-w-sm">
  <div class="linea-carrito flex justify-between text-sm" data-precio="19.99" data-cantidad="2"><span>Camiseta × 2</span><span>19.99€/ud</span></div>
  <div class="linea-carrito flex justify-between text-sm" data-precio="5.50" data-cantidad="3"><span>Calcetines × 3</span><span>5.50€/ud</span></div>
  <div class="linea-carrito flex justify-between text-sm" data-precio="12.25" data-cantidad="1"><span>Gorra × 1</span><span>12.25€/ud</span></div>
  <p class="flex justify-between font-semibold border-t pt-2 text-sm"><span>Total</span><span id="total-r10">0.00€</span></p>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const carrito = f.querySelector('#carrito-r10');
          fn(carrito);
          const got = carrito.querySelector('#total-r10').textContent;
          return { pass: got === '68.73€', got, expected: '68.73€' };
        }
      },
      {
        run: (fn, f) => {
          const carrito = f.querySelector('#carrito-r10');
          carrito.querySelectorAll('.linea-carrito').forEach(linea => linea.remove());
          fn(carrito);
          const got = carrito.querySelector('#total-r10').textContent;
          return { pass: got === '0.00€', got, expected: '0.00€' };
        }
      },
      {
        run: (fn, f) => {
          const carrito = f.querySelector('#carrito-r10');
          const lineas = [...carrito.querySelectorAll('.linea-carrito')];
          lineas[0].remove();
          lineas[1].remove();
          fn(carrito);
          const got = carrito.querySelector('#total-r10').textContent;
          return { pass: got === '12.25€', got, expected: '12.25€' };
        }
      },
      {
        run: (fn, f) => {
          const carrito = f.querySelector('#carrito-r10');
          carrito.querySelectorAll('.linea-carrito').forEach(linea => linea.remove());
          const linea = document.createElement('div');
          linea.className = 'linea-carrito';
          linea.dataset.precio = '3.333';
          linea.dataset.cantidad = '3';
          carrito.appendChild(linea);
          fn(carrito);
          const got = carrito.querySelector('#total-r10').textContent;
          return { pass: got === '10.00€', got, expected: '10.00€' };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#carrito-r10'))
  }
];

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

// ============================================================
// Bloque 2 — Repaso (añadido — fusionado en dia-19-dom.html)
// Repaso espaciado de los gotchas del 22/08 en escenarios nuevos.
// Misma mecánica que EJERCICIOS_TAILWIND: fixture Tailwind real
// por ejercicio, visible en su zona .ex-demo, tests { run }.
// ============================================================
const EJERCICIOS_BLOQUE2 = [
  // ---------- E1 ----------
  {
    fn: 'activarFiltroCategorias',
    fixtureHTML: `<div class="p-4 space-y-3 bg-slate-50 rounded-lg">
  <div id="botones-filtro-repaso" class="flex gap-2 flex-wrap">
    <button class="filtro-btn filtro-btn--activo bg-slate-700 text-white px-3 py-1 rounded-full text-sm" data-categoria="todos">Todos</button>
    <button class="filtro-btn bg-slate-200 px-3 py-1 rounded-full text-sm" data-categoria="ropa">👕<span class="icono-btn">Ropa</span></button>
    <button class="filtro-btn bg-slate-200 px-3 py-1 rounded-full text-sm" data-categoria="tech">💻<span class="icono-btn">Tech</span></button>
  </div>
  <div id="grid-filtro-repaso" class="grid grid-cols-2 gap-2">
    <div class="producto-card bg-white p-3 rounded shadow" data-categoria="ropa">Camiseta</div>
    <div class="producto-card bg-white p-3 rounded shadow" data-categoria="tech">Teclado</div>
    <div class="producto-card bg-white p-3 rounded shadow" data-categoria="ropa">Pantalón</div>
    <div class="producto-card bg-white p-3 rounded shadow" data-categoria="tech">Mouse</div>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const botones = f.querySelector('#botones-filtro-repaso');
          const grid = f.querySelector('#grid-filtro-repaso');
          fn(botones, grid);
          const iconoRopa = botones.querySelector('[data-categoria="ropa"] .icono-btn');
          iconoRopa.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const activos = [...botones.querySelectorAll('.filtro-btn')].map(b => b.classList.contains('filtro-btn--activo'));
          const visibles = [...grid.querySelectorAll('.producto-card')].map(p => !p.classList.contains('hidden'));
          const got = { activos, visibles };
          const expected = { activos: [false, true, false], visibles: [true, false, true, false] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const botones = f.querySelector('#botones-filtro-repaso');
          const grid = f.querySelector('#grid-filtro-repaso');
          fn(botones, grid);
          const botonTech = botones.querySelector('[data-categoria="tech"]');
          botonTech.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const activos = [...botones.querySelectorAll('.filtro-btn')].map(b => b.classList.contains('filtro-btn--activo'));
          const visibles = [...grid.querySelectorAll('.producto-card')].map(p => !p.classList.contains('hidden'));
          const got = { activos, visibles };
          const expected = { activos: [false, false, true], visibles: [false, true, false, true] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const botones = f.querySelector('#botones-filtro-repaso');
          const grid = f.querySelector('#grid-filtro-repaso');
          fn(botones, grid);
          botones.querySelector('[data-categoria="ropa"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          botones.querySelector('[data-categoria="todos"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const activos = [...botones.querySelectorAll('.filtro-btn')].map(b => b.classList.contains('filtro-btn--activo'));
          const visibles = [...grid.querySelectorAll('.producto-card')].map(p => !p.classList.contains('hidden'));
          const got = { activos, visibles };
          const expected = { activos: [true, false, false], visibles: [true, true, true, true] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#botones-filtro-repaso'), f.querySelector('#grid-filtro-repaso'))
  },

  // ---------- E2 ----------
  {
    fn: 'activarAcordeonExclusivo',
    fixtureHTML: `<div id="faq-repaso" class="divide-y divide-slate-200 rounded-lg border">
  <div class="faq-item">
    <button class="faq-pregunta w-full text-left p-3 font-medium" aria-expanded="false">¿Qué es un array?</button>
    <div class="faq-respuesta hidden p-3 text-sm text-slate-600">Una lista ordenada de valores.</div>
  </div>
  <div class="faq-item">
    <button class="faq-pregunta w-full text-left p-3 font-medium" aria-expanded="false">¿Qué es un objeto?</button>
    <div class="faq-respuesta hidden p-3 text-sm text-slate-600">Una colección de pares clave-valor.</div>
  </div>
  <div class="faq-item">
    <button class="faq-pregunta w-full text-left p-3 font-medium" aria-expanded="false">¿Qué es una función?</button>
    <div class="faq-respuesta hidden p-3 text-sm text-slate-600">Un bloque de código reutilizable.</div>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const panel = f.querySelector('#faq-repaso');
          fn(panel);
          const botones = panel.querySelectorAll('.faq-pregunta');
          botones[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...botones].map(b => ({ hidden: b.nextElementSibling.classList.contains('hidden'), aria: b.getAttribute('aria-expanded') }));
          const expected = [
            { hidden: false, aria: 'true' },
            { hidden: true, aria: 'false' },
            { hidden: true, aria: 'false' }
          ];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const panel = f.querySelector('#faq-repaso');
          fn(panel);
          const botones = panel.querySelectorAll('.faq-pregunta');
          botones[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          botones[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...botones].map(b => ({ hidden: b.nextElementSibling.classList.contains('hidden'), aria: b.getAttribute('aria-expanded') }));
          const expected = [
            { hidden: true, aria: 'false' },
            { hidden: false, aria: 'true' },
            { hidden: true, aria: 'false' }
          ];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const panel = f.querySelector('#faq-repaso');
          fn(panel);
          const botones = panel.querySelectorAll('.faq-pregunta');
          botones[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          botones[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...botones].map(b => ({ hidden: b.nextElementSibling.classList.contains('hidden'), aria: b.getAttribute('aria-expanded') }));
          const expected = [
            { hidden: true, aria: 'false' },
            { hidden: true, aria: 'false' },
            { hidden: true, aria: 'false' }
          ];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#faq-repaso'))
  },

  // ---------- E3 ----------
  {
    fn: 'marcarTodosAgotados',
    fixtureHTML: `<div id="grid-agotados-repaso" class="grid grid-cols-2 gap-3 p-4">
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="0">Cargador</div>
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="3">Funda</div>
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="0">Soporte</div>
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="0">Adaptador</div>
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="7">Cable</div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const grid = f.querySelector('#grid-agotados-repaso');
          fn(grid);
          const cards = [...grid.querySelectorAll('.stock-card')];
          const got = cards.map(c => c.classList.contains('ring-2') && c.classList.contains('ring-amber-500'));
          const expected = [true, false, true, true, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#grid-agotados-repaso'))
  },

  // ---------- E4 ----------
  {
    fn: 'mostrarBarraProgresoScroll',
    fixtureHTML: `<div class="p-4 space-y-2 max-w-sm">
  <input type="range" id="scroll-slider-repaso" min="0" max="1000" value="0" class="w-full">
  <div class="h-3 bg-slate-200 rounded-full overflow-hidden">
    <div id="barra-progreso-repaso" class="h-3 bg-sky-500" style="width:0%"></div>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-progreso-repaso');
          fn(barra, 250, 1000);
          const got = barra.style.width;
          return { pass: got === '25%', got, expected: '25%' };
        }
      },
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-progreso-repaso');
          fn(barra, 1000, 1000);
          const got = barra.style.width;
          return { pass: got === '100%', got, expected: '100%' };
        }
      },
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-progreso-repaso');
          fn(barra, 0, 800);
          const got = barra.style.width;
          return { pass: got === '0%', got, expected: '0%' };
        }
      },
      {
        run: (fn, f) => {
          const barra = f.querySelector('#barra-progreso-repaso');
          fn(barra, 800, 1600);
          const got = barra.style.width;
          return { pass: got === '50%', got, expected: '50%' };
        }
      }
    ],
    demo: (fn, f) => {
      const barra = f.querySelector('#barra-progreso-repaso');
      const slider = f.querySelector('#scroll-slider-repaso');
      slider.addEventListener('input', () => fn(barra, Number(slider.value), 1000));
    }
  },

  // ---------- E5 ----------
  {
    fn: 'validarRangoNumerico',
    fixtureHTML: `<div class="flex flex-col gap-1 p-4 max-w-xs">
  <label for="edad-repaso" class="text-sm font-medium">Edad</label>
  <input id="edad-repaso" type="number" class="border rounded px-2 py-1">
  <span id="error-edad-repaso" class="text-xs text-red-500"></span>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('#edad-repaso');
          const error = f.querySelector('#error-edad-repaso');
          input.value = '10';
          fn(input, error);
          const trasInvalido = { invalido: input.checkValidity() === false, mensaje: error.textContent.length > 0 };
          input.value = '30';
          fn(input, error);
          const trasValido = { valido: input.checkValidity() === true, mensajeVacio: error.textContent === '' };
          const got = { trasInvalido, trasValido };
          const expected = { trasInvalido: { invalido: true, mensaje: true }, trasValido: { valido: true, mensajeVacio: true } };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#edad-repaso');
          const error = f.querySelector('#error-edad-repaso');
          input.value = '17';
          fn(input, error);
          const con17 = input.checkValidity() === false;
          input.value = '18';
          fn(input, error);
          const con18 = input.checkValidity() === true;
          const got = { con17, con18 };
          const expected = { con17: true, con18: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#edad-repaso');
          const error = f.querySelector('#error-edad-repaso');
          input.value = '65';
          fn(input, error);
          const con65 = input.checkValidity() === true;
          input.value = '66';
          fn(input, error);
          const con66 = input.checkValidity() === false;
          const got = { con65, con66 };
          const expected = { con65: true, con66: true };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => {
      const input = f.querySelector('#edad-repaso');
      const error = f.querySelector('#error-edad-repaso');
      input.addEventListener('input', () => fn(input, error));
    }
  },

  // ---------- E6 ----------
  {
    fn: 'activarDropdownConCierre',
    fixtureHTML: `<div class="relative p-4 max-w-xs">
  <button id="boton-dropdown-repaso" class="bg-slate-200 px-3 py-1 rounded">Opciones ▾</button>
  <ul id="menu-dropdown-repaso" class="hidden absolute bg-white border rounded shadow mt-1 w-40 z-10">
    <li class="px-3 py-2">Editar</li>
    <li class="px-3 py-2">Eliminar</li>
  </ul>
  <div id="fuera-dropdown-repaso" class="mt-16 p-2 bg-slate-50 rounded">Resto de la página <span>con contenido anidado</span></div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const boton = f.querySelector('#boton-dropdown-repaso');
          const menu = f.querySelector('#menu-dropdown-repaso');
          fn(boton, menu);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = menu.classList.contains('hidden');
          return { pass: got === false, got, expected: false };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#boton-dropdown-repaso');
          const menu = f.querySelector('#menu-dropdown-repaso');
          const anidado = f.querySelector('#fuera-dropdown-repaso span');
          fn(boton, menu);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          anidado.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = menu.classList.contains('hidden');
          return { pass: got === true, got, expected: true };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#boton-dropdown-repaso');
          const menu = f.querySelector('#menu-dropdown-repaso');
          fn(boton, menu);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          menu.querySelector('li').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = menu.classList.contains('hidden');
          return { pass: got === false, got, expected: false };
        }
      },
      {
        run: (fn, f) => {
          const boton = f.querySelector('#boton-dropdown-repaso');
          const menu = f.querySelector('#menu-dropdown-repaso');
          fn(boton, menu);
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = menu.classList.contains('hidden');
          return { pass: got === true, got, expected: true };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#boton-dropdown-repaso'), f.querySelector('#menu-dropdown-repaso'))
  },

  // ---------- E7 ----------
  {
    fn: 'activarStepperConLimite',
    fixtureHTML: `<div class="flex items-center gap-2 p-4 w-fit border rounded-lg">
  <button id="menos-limite-repaso" class="w-8 h-8 rounded bg-slate-200 font-bold">−</button>
  <span id="cantidad-limite-repaso" class="w-8 text-center font-semibold" data-cantidad="0">0</span>
  <button id="mas-limite-repaso" class="w-8 h-8 rounded bg-slate-200 font-bold">+</button>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const menos = f.querySelector('#menos-limite-repaso');
          const mas = f.querySelector('#mas-limite-repaso');
          const cantidad = f.querySelector('#cantidad-limite-repaso');
          fn(mas, menos, cantidad, 3);
          menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = cantidad.textContent;
          return { pass: got === '0', got, expected: '0' };
        }
      },
      {
        run: (fn, f) => {
          const menos = f.querySelector('#menos-limite-repaso');
          const mas = f.querySelector('#mas-limite-repaso');
          const cantidad = f.querySelector('#cantidad-limite-repaso');
          fn(mas, menos, cantidad, 3);
          for (let i = 0; i < 5; i++) mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = cantidad.textContent;
          return { pass: got === '3', got, expected: '3' };
        }
      },
      {
        run: (fn, f) => {
          const menos = f.querySelector('#menos-limite-repaso');
          const mas = f.querySelector('#mas-limite-repaso');
          const cantidad = f.querySelector('#cantidad-limite-repaso');
          fn(mas, menos, cantidad, 3);
          for (let i = 0; i < 5; i++) mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          for (let i = 0; i < 6; i++) menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = cantidad.textContent;
          return { pass: got === '0', got, expected: '0' };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#mas-limite-repaso'), f.querySelector('#menos-limite-repaso'), f.querySelector('#cantidad-limite-repaso'), 5)
  },

  // ---------- E8 ----------
  {
    fn: 'filtrarPorNombreOCategoria',
    fixtureHTML: `<div class="p-4 max-w-sm">
  <input id="busqueda-repaso" type="text" placeholder="Buscar..." class="border rounded px-2 py-1 w-full mb-2">
  <ul id="lista-busqueda-repaso" class="divide-y">
    <li class="item-producto p-2" data-nombre="Camiseta roja" data-categoria="ropa">Camiseta roja</li>
    <li class="item-producto p-2" data-nombre="Teclado mecánico" data-categoria="tecnologia">Teclado mecánico</li>
    <li class="item-producto p-2" data-nombre="Pantalón negro" data-categoria="ropa">Pantalón negro</li>
    <li class="item-producto p-2" data-nombre="Ratón inalámbrico" data-categoria="tecnologia">Ratón inalámbrico</li>
  </ul>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('#busqueda-repaso');
          const lista = f.querySelector('#lista-busqueda-repaso');
          fn(input, lista);
          input.value = 'ropa';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-producto')].map(i => !i.classList.contains('hidden'));
          const expected = [true, false, true, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#busqueda-repaso');
          const lista = f.querySelector('#lista-busqueda-repaso');
          fn(input, lista);
          input.value = 'teclado';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-producto')].map(i => !i.classList.contains('hidden'));
          const expected = [false, true, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#busqueda-repaso');
          const lista = f.querySelector('#lista-busqueda-repaso');
          fn(input, lista);
          input.value = 'ropa';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-producto')].map(i => !i.classList.contains('hidden'));
          const expected = [true, true, true, true];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const input = f.querySelector('#busqueda-repaso');
          const lista = f.querySelector('#lista-busqueda-repaso');
          fn(input, lista);
          input.value = 'xyz';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-producto')].map(i => !i.classList.contains('hidden'));
          const expected = [false, false, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#busqueda-repaso'), f.querySelector('#lista-busqueda-repaso'))
  },

  // ---------- E9 ----------
  {
    fn: 'moverArriba',
    fixtureHTML: `<ul id="lista-subir-repaso" class="p-4 max-w-xs divide-y">
  <li class="item-lista flex justify-between items-center p-2" data-tarea="A">Tarea A <button class="btn-subir">▲</button></li>
  <li class="item-lista flex justify-between items-center p-2" data-tarea="B">Tarea B <button class="btn-subir">▲</button></li>
  <li class="item-lista flex justify-between items-center p-2" data-tarea="C">Tarea C <button class="btn-subir">▲</button></li>
  <li class="item-lista flex justify-between items-center p-2" data-tarea="D">Tarea D <button class="btn-subir">▲</button></li>
</ul>`,
    tests: [
      {
        run: (fn, f) => {
          const lista = f.querySelector('#lista-subir-repaso');
          fn(lista);
          const items = [...lista.querySelectorAll('.item-lista')];
          items[2].querySelector('.btn-subir').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-lista')].map(li => li.dataset.tarea);
          const expected = ['A', 'C', 'B', 'D'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const lista = f.querySelector('#lista-subir-repaso');
          fn(lista);
          const items = [...lista.querySelectorAll('.item-lista')];
          items[0].querySelector('.btn-subir').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-lista')].map(li => li.dataset.tarea);
          const expected = ['A', 'B', 'C', 'D'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const lista = f.querySelector('#lista-subir-repaso');
          fn(lista);
          let items = [...lista.querySelectorAll('.item-lista')];
          items[3].querySelector('.btn-subir').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          items = [...lista.querySelectorAll('.item-lista')];
          items[2].querySelector('.btn-subir').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = [...lista.querySelectorAll('.item-lista')].map(li => li.dataset.tarea);
          const expected = ['A', 'D', 'B', 'C'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#lista-subir-repaso'))
  },

  // ---------- E10 ----------
  {
    fn: 'activarSeleccionGrid',
    fixtureHTML: `<div id="contenedor-seleccion-repaso" class="p-4 space-y-3">
  <label class="flex items-center gap-2 text-sm font-medium"><input type="checkbox" id="check-maestro-repaso"> Seleccionar todo</label>
  <div id="grid-seleccion-repaso" class="grid grid-cols-2 gap-2">
    <div class="producto-card bg-white p-3 rounded shadow flex justify-between items-center">Auriculares <input type="checkbox" class="check-producto"></div>
    <div class="producto-card bg-white p-3 rounded shadow flex justify-between items-center">Webcam <input type="checkbox" class="check-producto"></div>
    <div class="producto-card bg-white p-3 rounded shadow flex justify-between items-center">Monitor <input type="checkbox" class="check-producto"></div>
    <div class="producto-card bg-white p-3 rounded shadow flex justify-between items-center">Teclado <input type="checkbox" class="check-producto"></div>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const contenedor = f.querySelector('#contenedor-seleccion-repaso');
          fn(contenedor);
          const maestro = contenedor.querySelector('#check-maestro-repaso');
          maestro.checked = true;
          maestro.dispatchEvent(new Event('change', { bubbles: true }));
          const got = [...contenedor.querySelectorAll('.check-producto')].every(c => c.checked === true);
          return { pass: got === true, got, expected: true };
        }
      },
      {
        run: (fn, f) => {
          const contenedor = f.querySelector('#contenedor-seleccion-repaso');
          fn(contenedor);
          const maestro = contenedor.querySelector('#check-maestro-repaso');
          const productos = [...contenedor.querySelectorAll('.check-producto')];
          maestro.checked = true;
          maestro.dispatchEvent(new Event('change', { bubbles: true }));
          productos[0].checked = false;
          productos[0].dispatchEvent(new Event('change', { bubbles: true }));
          const got = maestro.checked;
          return { pass: got === false, got, expected: false };
        }
      },
      {
        run: (fn, f) => {
          const contenedor = f.querySelector('#contenedor-seleccion-repaso');
          fn(contenedor);
          const maestro = contenedor.querySelector('#check-maestro-repaso');
          const productos = [...contenedor.querySelectorAll('.check-producto')];
          productos.forEach(p => {
            p.checked = true;
            p.dispatchEvent(new Event('change', { bubbles: true }));
          });
          const got = maestro.checked;
          return { pass: got === true, got, expected: true };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#contenedor-seleccion-repaso'))
  }
];

// ============================================================
// 22/08 — DOM + Tailwind (añadido — fusionado en dia-19-dom.html)
// Cada ejercicio tiene su propio fixture Tailwind real, que se
// reconstruye dentro de su zona ".ex-demo" antes de cada test
// (para que ningún ejercicio contamine el DOM de otro) y que
// además queda VISIBLE en la card como demo — a diferencia de un
// fixture oculto, acá el test corre contra el DOM real que el
// alumno también puede ver renderizado con las clases Tailwind.
// Todos los tests son de tipo { run }, igual que los de Grupo 3
// de arriba — reutilizan runDomCustom.
// ============================================================
const EJERCICIOS_TAILWIND = [
  // ---------- E1 ----------
  {
    fn: 'renderizarProductos',
    fixtureHTML: '<div id="grid-productos-e1" class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg"></div>',
    tests: [
      {
        run: (fn, f) => {
          const grid = f.querySelector('#grid-productos-e1');
          fn(grid, [
            { nombre: 'Mouse', precio: 29.99, stock: 0 },
            { nombre: 'Teclado', precio: 49.5, stock: 5 }
          ]);
          const cards = grid.querySelectorAll('.product-card');
          const got = {
            cantidad: cards.length,
            primeraRoja: cards[0] ? cards[0].querySelector('.stock-badge').classList.contains('bg-red-100') : false,
            segundaVerde: cards[1] ? cards[1].querySelector('.stock-badge').classList.contains('bg-green-100') : false,
            nombre0: cards[0] ? cards[0].querySelector('.product-card-nombre').textContent : null,
            precio0: cards[0] ? cards[0].querySelector('.product-card-precio').textContent : null,
            precio1: cards[1] ? cards[1].querySelector('.product-card-precio').textContent : null
          };
          const expected = { cantidad: 2, primeraRoja: true, segundaVerde: true, nombre0: 'Mouse', precio0: '29.99€', precio1: '49.50€' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const grid = f.querySelector('#grid-productos-e1');
          fn(grid, []);
          const got = grid.querySelectorAll('.product-card').length;
          return { pass: got === 0, got, expected: 0 };
        }
      }
    ],
    demo: (fn, f) => {
      const grid = f.querySelector('#grid-productos-e1');
      fn(grid, [
        { nombre: 'Auriculares', precio: 39.9, stock: 3 },
        { nombre: 'Webcam', precio: 24.5, stock: 0 },
        { nombre: 'Monitor', precio: 189, stock: 8 }
      ]);
    }
  },

  // ---------- E2 ----------
  {
    fn: 'activarSeleccionMasiva',
    fixtureHTML: `<table id="tabla-e2" class="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
  <thead class="bg-slate-100">
    <tr>
      <th class="p-2 text-left"><input type="checkbox" id="check-todos"></th>
      <th class="p-2 text-left">Tarea</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-t"><td class="p-2"><input type="checkbox" class="check-fila"></td><td class="p-2">Revisar PR</td></tr>
    <tr class="border-t"><td class="p-2"><input type="checkbox" class="check-fila"></td><td class="p-2">Actualizar docs</td></tr>
    <tr class="border-t"><td class="p-2"><input type="checkbox" class="check-fila"></td><td class="p-2">Deploy staging</td></tr>
  </tbody>
</table>`,
    tests: [
      {
        run: (fn, f) => {
          const tabla = f.querySelector('#tabla-e2');
          fn(tabla);
          const master = tabla.querySelector('#check-todos');
          master.checked = true;
          master.dispatchEvent(new Event('change', { bubbles: true }));
          const filas = [...tabla.querySelectorAll('.check-fila')];
          const got = filas.every(c => c.checked === true);
          return { pass: got === true, got, expected: true };
        }
      },
      {
        run: (fn, f) => {
          const tabla = f.querySelector('#tabla-e2');
          fn(tabla);
          const master = tabla.querySelector('#check-todos');
          const filas = [...tabla.querySelectorAll('.check-fila')];
          master.checked = true;
          master.dispatchEvent(new Event('change', { bubbles: true }));
          filas[0].checked = false;
          filas[0].dispatchEvent(new Event('change', { bubbles: true }));
          const got = master.checked;
          return { pass: got === false, got, expected: false };
        }
      },
      {
        run: (fn, f) => {
          const tabla = f.querySelector('#tabla-e2');
          fn(tabla);
          const master = tabla.querySelector('#check-todos');
          const filas = [...tabla.querySelectorAll('.check-fila')];
          filas.forEach(fila => {
            fila.checked = true;
            fila.dispatchEvent(new Event('change', { bubbles: true }));
          });
          const got = master.checked;
          return { pass: got === true, got, expected: true };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#tabla-e2'))
  },

  // ---------- E3 ----------
  {
    fn: 'marcarPrimeraTarjetaAgotada',
    fixtureHTML: `<div id="grid-e3" class="grid grid-cols-2 gap-3 p-4">
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="4">Auriculares</div>
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="0">Webcam</div>
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="0">Micrófono</div>
  <div class="stock-card bg-white p-3 rounded shadow" data-stock="2">Monitor</div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const grid = f.querySelector('#grid-e3');
          fn(grid);
          const cards = [...grid.querySelectorAll('.stock-card')];
          const got = cards.map(c => c.classList.contains('ring-2') && c.classList.contains('ring-red-500'));
          const expected = [false, true, false, false];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#grid-e3'))
  },

  // ---------- E4 ----------
  {
    fn: 'mostrarTooltipEnCursor',
    fixtureHTML: `<div id="zona-e4" class="relative h-40 bg-slate-100 rounded-lg overflow-hidden">
  <div id="tooltip-e4" class="absolute hidden bg-black text-white text-xs px-2 py-1 rounded pointer-events-none">👆</div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const tooltip = f.querySelector('#tooltip-e4');
          fn(tooltip, { clientX: 120, clientY: 80 });
          const got = { left: tooltip.style.left, top: tooltip.style.top, hidden: tooltip.classList.contains('hidden') };
          const expected = { left: '120px', top: '80px', hidden: false };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      },
      {
        run: (fn, f) => {
          const tooltip = f.querySelector('#tooltip-e4');
          fn(tooltip, { clientX: 5, clientY: 200 });
          const got = { left: tooltip.style.left, top: tooltip.style.top };
          const expected = { left: '5px', top: '200px' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => {
      const zona = f.querySelector('#zona-e4');
      const tooltip = f.querySelector('#tooltip-e4');
      zona.addEventListener('mousemove', (evento) => fn(tooltip, evento));
    }
  },

  // ---------- E5 ----------
  {
    fn: 'validarLongitudUsuario',
    fixtureHTML: `<div class="flex flex-col gap-1 p-4 max-w-xs">
  <label for="usuario-e5" class="text-sm font-medium">Usuario</label>
  <input id="usuario-e5" type="text" class="border rounded px-2 py-1">
  <span id="ayuda-usuario-e5" class="text-xs text-red-500"></span>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('#usuario-e5');
          const ayuda = f.querySelector('#ayuda-usuario-e5');

          input.value = 'ab';
          fn(input, ayuda);
          const trasInvalido = { invalido: input.checkValidity() === false, ayuda: ayuda.textContent.length > 0 };

          input.value = 'valido123';
          fn(input, ayuda);
          const trasValido = { valido: input.checkValidity() === true, ayudaVacia: ayuda.textContent === '' };

          const got = { trasInvalido, trasValido };
          const expected = { trasInvalido: { invalido: true, ayuda: true }, trasValido: { valido: true, ayudaVacia: true } };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => {
      const input = f.querySelector('#usuario-e5');
      const ayuda = f.querySelector('#ayuda-usuario-e5');
      input.addEventListener('input', () => fn(input, ayuda));
    }
  },

  // ---------- E6 ----------
  {
    fn: 'activarAcordeon',
    fixtureHTML: `<div id="faq-e6" class="divide-y divide-slate-200 rounded-lg border">
  <div class="faq-item">
    <button class="faq-pregunta w-full text-left p-3 font-medium" aria-expanded="false">¿Qué es Tailwind?</button>
    <div class="faq-respuesta hidden p-3 text-sm text-slate-600">Un framework de utilidades CSS.</div>
  </div>
  <div class="faq-item">
    <button class="faq-pregunta w-full text-left p-3 font-medium" aria-expanded="false">¿Qué es el DOM?</button>
    <div class="faq-respuesta hidden p-3 text-sm text-slate-600">La representación en árbol del HTML.</div>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const panel = f.querySelector('#faq-e6');
          fn(panel);
          const botones = panel.querySelectorAll('.faq-pregunta');
          const boton1 = botones[0];
          const boton2 = botones[1];
          const respuesta1 = boton1.nextElementSibling;

          boton1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const trasAbrir = { hidden: respuesta1.classList.contains('hidden'), aria: boton1.getAttribute('aria-expanded') };

          boton1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const trasCerrar = { hidden: respuesta1.classList.contains('hidden'), aria: boton1.getAttribute('aria-expanded') };

          boton1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          boton2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const primeraSigueAbierta = respuesta1.classList.contains('hidden') === false;

          const got = { trasAbrir, trasCerrar, primeraSigueAbierta };
          const expected = {
            trasAbrir: { hidden: false, aria: 'true' },
            trasCerrar: { hidden: true, aria: 'false' },
            primeraSigueAbierta: true
          };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#faq-e6'))
  },

  // ---------- E7 ----------
  {
    fn: 'filtrarListaEnVivo',
    fixtureHTML: `<div class="p-4 max-w-sm">
  <input id="busqueda-e7" type="text" placeholder="Buscar fruta..." class="border rounded px-2 py-1 w-full mb-2">
  <ul id="lista-e7" class="divide-y">
    <li class="item-lista p-2" data-nombre="Manzana">Manzana</li>
    <li class="item-lista p-2" data-nombre="Pera">Pera</li>
    <li class="item-lista p-2" data-nombre="Mango">Mango</li>
  </ul>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const input = f.querySelector('#busqueda-e7');
          const lista = f.querySelector('#lista-e7');
          fn(input, lista);
          const items = [...lista.querySelectorAll('.item-lista')];

          input.value = 'ma';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const visibleConMa = items.map(i => !i.classList.contains('hidden'));

          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const visibleVacio = items.map(i => !i.classList.contains('hidden'));

          const got = { visibleConMa, visibleVacio };
          const expected = { visibleConMa: [true, false, true], visibleVacio: [true, true, true] };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#busqueda-e7'), f.querySelector('#lista-e7'))
  },

  // ---------- E8 ----------
  {
    fn: 'activarStepperCarrito',
    fixtureHTML: `<div class="flex items-center gap-2 p-4 w-fit border rounded-lg">
  <button id="menos-e8" class="w-8 h-8 rounded bg-slate-200 font-bold">−</button>
  <span id="cantidad-e8" class="w-8 text-center font-semibold" data-cantidad="0">0</span>
  <button id="mas-e8" class="w-8 h-8 rounded bg-slate-200 font-bold">+</button>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const menos = f.querySelector('#menos-e8');
          const mas = f.querySelector('#mas-e8');
          const cantidad = f.querySelector('#cantidad-e8');
          fn(mas, menos, cantidad);

          menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          menos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const trasMenos = cantidad.textContent;

          mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          mas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const trasMas = cantidad.textContent;

          const got = { trasMenos, trasMas };
          const expected = { trasMenos: '0', trasMas: '2' };
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#mas-e8'), f.querySelector('#menos-e8'), f.querySelector('#cantidad-e8'))
  },

  // ---------- E9 ----------
  {
    fn: 'activarCierreModalFuera',
    fixtureHTML: `<div id="modal-e9" class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div id="modal-contenido-e9" class="bg-white rounded-lg p-6 max-w-sm">
    <p>Contenido del modal</p>
    <button>Aceptar</button>
  </div>
</div>`,
    tests: [
      {
        run: (fn, f) => {
          const modal = f.querySelector('#modal-e9');
          fn(modal);
          modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = modal.classList.contains('hidden');
          return { pass: got === true, got, expected: true };
        }
      },
      {
        run: (fn, f) => {
          const modal = f.querySelector('#modal-e9');
          fn(modal);
          const contenido = f.querySelector('#modal-contenido-e9');
          contenido.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const got = modal.classList.contains('hidden');
          return { pass: got === false, got, expected: false };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#modal-e9'))
  },

  // ---------- E10 ----------
  {
    fn: 'activarDragReordenable',
    fixtureHTML: `<ul id="lista-e10" class="p-4 max-w-xs">
  <li draggable="true" class="drag-item cursor-move bg-white p-2 rounded shadow mb-1">Tarea A</li>
  <li draggable="true" class="drag-item cursor-move bg-white p-2 rounded shadow mb-1">Tarea B</li>
  <li draggable="true" class="drag-item cursor-move bg-white p-2 rounded shadow mb-1">Tarea C</li>
</ul>`,
    tests: [
      {
        run: (fn, f) => {
          const lista = f.querySelector('#lista-e10');
          fn(lista);
          const items = [...lista.querySelectorAll('.drag-item')];
          items[0].dispatchEvent(new Event('dragstart', { bubbles: true }));
          items[2].dispatchEvent(new Event('drop', { bubbles: true }));
          const got = [...lista.querySelectorAll('.drag-item')].map(li => li.textContent);
          const expected = ['Tarea B', 'Tarea A', 'Tarea C'];
          return { pass: JSON.stringify(got) === JSON.stringify(expected), got, expected };
        }
      }
    ],
    demo: (fn, f) => fn(f.querySelector('#lista-e10'))
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

// Reconstruye el fixture de un ejercicio de la card 22/08 (DOM +
// Tailwind) dentro de su zona .ex-demo (visible, con clases
// Tailwind reales). A diferencia de reconstruirFixture, el fixture
// acá es un string HTML fijo por ejercicio (ej.fixtureHTML), no una
// función que puede variar por test.
function reconstruirFixtureDemo(ej, container) {
  if (!container) return null;
  container.innerHTML = ej.fixtureHTML;
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

  // ---------- 23/08 — Refuerzo 2 · Reincidencias ----------
  // Misma mecánica que EJERCICIOS_REFUERZO: fixture visible en
  // .ex-demo, tests { run }, demo en vivo tras correr los tests.
  EJERCICIOS_REFUERZO_2.forEach(ej => {
    const panel = document.querySelector('.ex-result[data-fn="' + ej.fn + '"]');
    if (!panel) return;
    const exEl = panel.closest('.ex');
    const badge = exEl.querySelector('.ex-status');
    const demo = exEl.querySelector('.ex-demo');

    const target = window[ej.fn];
    if (typeof target !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '</code> en dia-19-dom-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu código y recargá la página.</div>';
      if (demo) reconstruirFixtureDemo(ej, demo);
      return;
    }

    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      const fixtureEl = reconstruirFixtureDemo(ej, demo);
      const resultado = runDomCustom(ej, target, test, fixtureEl);
      if (resultado.ok) aprobados++;
      html += resultado.html;
    });

    panel.innerHTML = html;

    const demoEl = reconstruirFixtureDemo(ej, demo);
    if (demoEl && typeof ej.demo === 'function') {
      try { ej.demo(target, demoEl); } catch (e) { /* la demo en vivo es un extra, no bloquea el resultado */ }
    }

    const total = ej.tests.length;
    if (aprobados === total) {
      setStatus(exEl, badge, 'data-done', '✅ Completado');
    } else if (aprobados > 0) {
      setStatus(exEl, badge, 'data-review', '🔁 Repasar');
    } else {
      setStatus(exEl, badge, 'data-pending', '⏳ Pendiente');
    }
  });

  // ---------- 23/08 — Refuerzo DOM ----------
  // Misma mecánica que EJERCICIOS_BLOQUE2: fixture visible en
  // .ex-demo, tests { run }, demo en vivo tras correr los tests.
  EJERCICIOS_REFUERZO.forEach(ej => {
    const panel = document.querySelector('.ex-result[data-fn="' + ej.fn + '"]');
    if (!panel) return;
    const exEl = panel.closest('.ex');
    const badge = exEl.querySelector('.ex-status');
    const demo = exEl.querySelector('.ex-demo');

    const target = window[ej.fn];
    if (typeof target !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '</code> en dia-19-dom-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu código y recargá la página.</div>';
      if (demo) reconstruirFixtureDemo(ej, demo);
      return;
    }

    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      const fixtureEl = reconstruirFixtureDemo(ej, demo);
      const resultado = runDomCustom(ej, target, test, fixtureEl);
      if (resultado.ok) aprobados++;
      html += resultado.html;
    });

    panel.innerHTML = html;

    const demoEl = reconstruirFixtureDemo(ej, demo);
    if (demoEl && typeof ej.demo === 'function') {
      try { ej.demo(target, demoEl); } catch (e) { /* la demo en vivo es un extra, no bloquea el resultado */ }
    }

    const total = ej.tests.length;
    if (aprobados === total) {
      setStatus(exEl, badge, 'data-done', '✅ Completado');
    } else if (aprobados > 0) {
      setStatus(exEl, badge, 'data-review', '🔁 Repasar');
    } else {
      setStatus(exEl, badge, 'data-pending', '⏳ Pendiente');
    }
  });

  // ---------- Bloque 2 — Repaso ----------
  // Misma mecánica que EJERCICIOS_TAILWIND: fixture visible en
  // .ex-demo, tests { run }, demo en vivo tras correr los tests.
  EJERCICIOS_BLOQUE2.forEach(ej => {
    const panel = document.querySelector('.ex-result[data-fn="' + ej.fn + '"]');
    if (!panel) return;
    const exEl = panel.closest('.ex');
    const badge = exEl.querySelector('.ex-status');
    const demo = exEl.querySelector('.ex-demo');

    const target = window[ej.fn];
    if (typeof target !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '</code> en dia-19-dom-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu código y recargá la página.</div>';
      if (demo) reconstruirFixtureDemo(ej, demo);
      return;
    }

    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      const fixtureEl = reconstruirFixtureDemo(ej, demo);
      const resultado = runDomCustom(ej, target, test, fixtureEl);
      if (resultado.ok) aprobados++;
      html += resultado.html;
    });

    panel.innerHTML = html;

    const demoEl = reconstruirFixtureDemo(ej, demo);
    if (demoEl && typeof ej.demo === 'function') {
      try { ej.demo(target, demoEl); } catch (e) { /* la demo en vivo es un extra, no bloquea el resultado */ }
    }

    const total = ej.tests.length;
    if (aprobados === total) {
      setStatus(exEl, badge, 'data-done', '✅ Completado');
    } else if (aprobados > 0) {
      setStatus(exEl, badge, 'data-review', '🔁 Repasar');
    } else {
      setStatus(exEl, badge, 'data-pending', '⏳ Pendiente');
    }
  });

  // ---------- 22/08 — DOM + Tailwind ----------
  // Misma mecánica que arriba, pero el fixture de cada ejercicio
  // vive en su zona .ex-demo (visible) en vez de .ex-fixture
  // (oculta), y además queda funcionando en vivo tras los tests
  // (ej.demo) para poder interactuar con ella a mano.
  EJERCICIOS_TAILWIND.forEach(ej => {
    const panel = document.querySelector('.ex-result[data-fn="' + ej.fn + '"]');
    if (!panel) return;
    const exEl = panel.closest('.ex');
    const badge = exEl.querySelector('.ex-status');
    const demo = exEl.querySelector('.ex-demo');

    const target = window[ej.fn];
    if (typeof target !== 'function') {
      panel.innerHTML = '⚠️ Aún no escribiste <code>' + ej.fn + '</code> en dia-19-dom-soluciones.js' +
        '<div style="color:var(--text-muted);margin-top:.25rem;">💡 Abrí ese archivo, escribí tu código y recargá la página.</div>';
      if (demo) reconstruirFixtureDemo(ej, demo);
      return;
    }

    let aprobados = 0;
    let html = '';
    ej.tests.forEach(test => {
      const fixtureEl = reconstruirFixtureDemo(ej, demo);
      const resultado = runDomCustom(ej, target, test, fixtureEl);
      if (resultado.ok) aprobados++;
      html += resultado.html;
    });

    panel.innerHTML = html;

    // Deja la zona demo en un estado limpio y, si el ejercicio lo
    // permite, ya funcionando en vivo para poder interactuar con
    // ella manualmente (clicks, drag, escritura...).
    const demoEl = reconstruirFixtureDemo(ej, demo);
    if (demoEl && typeof ej.demo === 'function') {
      try { ej.demo(target, demoEl); } catch (e) { /* la demo en vivo es un extra, no bloquea el resultado */ }
    }

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
