// ============================================================
// LIVE RELOAD — re-ejecuta los tests al guardar el archivo de
// soluciones, sin recargar la página (conserva scroll y cards
// abiertas).
//
// Requisitos de la página:
// - un <script src="...-soluciones.js"> con las soluciones
// - una función global ejecutarTodo() que corre y pinta los tests
// ============================================================
(() => {
  const POLL_MS = 1000;
  const solutionsScript = document.querySelector('script[src$="-soluciones.js"]');
  if (!solutionsScript) return;

  // mkdocs serve inyecta su propio live reload, que hace location.reload()
  // al guardar CUALQUIER archivo de docs/ y cierra las cards. Se anulan sus
  // peticiones de sondeo (/livereload/...) en esta página. Coste: si editas
  // el HTML o el runner, hay que recargar a mano (F5).
  const originalSend = XMLHttpRequest.prototype.send;
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.isMkdocsPoll = String(url).startsWith('/livereload/');
    return originalOpen.call(this, method, url, ...rest);
  };
  XMLHttpRequest.prototype.send = function (...args) {
    if (this.isMkdocsPoll) return;
    return originalSend.apply(this, args);
  };

  const solutionsUrl = solutionsScript.src;
  const trackedListeners = [];

  // Las soluciones enganchan listeners en document/window al ejecutarse.
  // Sin limpiarlos, cada re-ejecución los duplica (dos clics = dos toggles).
  const trackListeners = (target) => {
    const originalAdd = target.addEventListener.bind(target);
    target.addEventListener = (type, listener, options) => {
      if (type !== 'DOMContentLoaded') trackedListeners.push({ target, type, listener, options });
      originalAdd(type, listener, options);
    };
  };
  trackListeners(document);
  trackListeners(window);

  const removeTrackedListeners = () => {
    trackedListeners.forEach(({ target, type, listener, options }) => {
      target.removeEventListener(type, listener, options);
    });
    trackedListeners.length = 0;
  };

  const statusEl = document.createElement('div');
  statusEl.className = 'live-status';
  statusEl.setAttribute('role', 'status');
  document.body.append(statusEl);

  const showStatus = (text, isError) => {
    statusEl.textContent = text;
    statusEl.classList.toggle('live-status--error', isError);
  };

  const fetchSolutions = async () => {
    const response = await fetch(solutionsUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.text();
  };

  let lastSource = '';

  const applySolutions = (source) => {
    // eval indirecto: las function quedan globales (window[ej.fn] las
    // encuentra) y los const/let quedan en su propio ámbito, sin chocar
    // con la carga anterior.
    (0, eval)(source);
    removeTrackedListeners();
    ejecutarTodo();
  };

  const checkForChanges = async () => {
    try {
      const source = await fetchSolutions();
      if (source === lastSource) return;
      const isFirstCheck = lastSource === '';
      lastSource = source;
      if (isFirstCheck) {
        showStatus('🟢 Live reload activo', false);
        return;
      }
      applySolutions(source);
      showStatus('🟢 Actualizado ' + new Date().toLocaleTimeString(), false);
    } catch (error) {
      showStatus('🔴 ' + error.message, true);
    }
  };

  checkForChanges();
  setInterval(checkForChanges, POLL_MS);
})();
