(function () {
  const base = document.currentScript.src.replace(/[^/]*$/, '');

  const icon = (paths) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    paths +
    '</svg>';

  const SVGS = {
    code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
    list: '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>',
    send: '<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
    dashboard: '<rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect>',
    grid: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
    palette: '<path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle>',
    mountain: '<path d="M8 3l4 8 5-5 5 15H2L8 3z"></path>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>'
  };

  const link = (href, iconName, title, sub, tone) =>
    '<a href="' + href + '" class="megamenu__link">' +
      '<span class="icon icon--' + tone + '">' + icon(SVGS[iconName]) + '</span>' +
      '<span class="link-text">' + title + '<span class="sub">' + sub + '</span></span>' +
    '</a>';

  const group = (title) => '<span class="megamenu__group-title">' + title + '</span>';
  const sep = (title) => '<span class="megamenu__sep">' + title + '</span>';

  const dropdownJs =
    '<div class="megamenu__title">JS · Temarios</div>' +
    group('Conceptos básicos') +
    link(base + 'js/ejercicios/conceptos-basicos.html', 'code', 'Lógica web', '10 ejercicios', 'js') +
    group('Arrays + Métodos') +
    link(base + 'js/ejercicios/dia-02-arrays.html', 'list', 'map · filter · forEach · reduce', 'Card Día 05', 'js') +
    group('Objetos') +
    link(base + 'js/ejercicios/dia-10-objetos.html', 'list', 'keys · values · entries · spread', 'Card Día 10', 'js') +
    group('Ruta JS') +
    link(base + 'progreso.html#track-js', 'send', 'Progreso de Agosto', 'Arrays → Objetos → DOM → Proyecto', 'js') +
    sep('Exámenes') +
    link(base + 'js-basico.html', 'zap', 'JS Básico — Fundamentos', 'Variables, funciones, arrays', 'js') +
    link(base + 'js-vanilla.html', 'dashboard', 'Task Dashboard', 'DOM, Arrays, Async', 'js');

  const dropdownCss =
    '<div class="megamenu__title">CSS · Temarios</div>' +
    group('Nuevos conceptos') +
    link(base + 'css/ejercicios/nuevos-conceptos.html', 'grid', ':has() · Grid · Flex · CQ', 'Bloque de práctica', 'css') +
    group('Progreso CSS') +
    link(base + 'progreso.html#track-css', 'send', 'Tailwind desde 0 → Landing', 'Progreso de Agosto', 'css') +
    sep('Exámenes') +
    link(base + 'css-final.html', 'zap', 'SaaSPro — Final CSS', 'Todo CSS en un solo examen', 'css') +
    link(base + 'css-fundamentos.html', 'palette', 'Nexus Agency', 'Flex, Grid, RWD, Moderno', 'css') +
    link(base + '../CSS/assessment/examen-final-objetivos.html', 'mountain', 'NomadStay — Landing', '18/07/2026 · Examen final', 'done') +
    link(base + '../CSS/assessment/dashboard.html', 'chat', 'Challenges cortos', 'Dashboard · Pricing · Features', 'css');

  const dropdownRuta =
    '<div class="megamenu__title">Ruta · Semanas + Library</div>' +
    link(base + 'progreso.html#track-js', 'code', 'JS Progression', 'Arrays → Objetos → DOM → Proyecto', 'js') +
    link(base + 'progreso.html#track-css', 'grid', 'CSS + Tailwind', 'Tailwind desde 0 → Landing', 'css') +
    link(base + 'progreso.html#track-library', 'chat', 'Assessment Library', 'Todos los exámenes', 'done');

  const siteNav = document.getElementById('site-nav');
  if (!siteNav) return;

  siteNav.innerHTML =
    '<nav class="nav">' +
      '<a href="' + base + 'index.html" class="nav__logo">Code<span>Learn</span></a>' +
      '<ul class="nav__list">' +
        '<li class="nav__item">' +
          '<button class="nav__btn nav__btn--active-js" data-dropdown="js" aria-haspopup="true">JavaScript <span class="arrow">▼</span></button>' +
          '<div class="megamenu" id="dropdown-js">' + dropdownJs + '</div>' +
        '</li>' +
        '<li class="nav__item">' +
          '<button class="nav__btn nav__btn--active" data-dropdown="css" aria-haspopup="true">CSS <span class="arrow">▼</span></button>' +
          '<div class="megamenu" id="dropdown-css">' + dropdownCss + '</div>' +
        '</li>' +
        '<li class="nav__item">' +
          '<button class="nav__btn" data-dropdown="ruta" aria-haspopup="true">Ruta de Agosto <span class="arrow">▼</span></button>' +
          '<div class="megamenu" id="dropdown-ruta">' + dropdownRuta + '</div>' +
        '</li>' +
      '</ul>' +
      '<a href="/" class="nav__back">← Docs</a>' +
    '</nav>';

  let overlay = document.getElementById('megamenu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'megamenu-overlay';
    overlay.id = 'megamenu-overlay';
    document.body.appendChild(overlay);
  }

  const path = window.location.pathname;
  const isJS = path.endsWith('js-basico.html') || path.endsWith('js-vanilla.html') || path.endsWith('.html') && /\/js\/ejercicios\//.test(path);
  const isCSS = path.endsWith('css-final.html') || path.endsWith('css-fundamentos.html') || /\/css\/ejercicios\//.test(path);
  const isRuta = path.endsWith('progreso.html');

  const btnJs = siteNav.querySelector('[data-dropdown="js"]');
  const btnCss = siteNav.querySelector('[data-dropdown="css"]');
  const btnRuta = siteNav.querySelector('[data-dropdown="ruta"]');

  btnJs.classList.toggle('nav__btn--active-js', isJS);
  btnCss.classList.toggle('nav__btn--active', isCSS);
  btnRuta.classList.toggle('nav__btn--active-ruta', isRuta);

  let openDropdown = null;
  siteNav.querySelectorAll('[data-dropdown]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-dropdown');
      const menu = document.getElementById('dropdown-' + id);

      if (openDropdown && openDropdown !== menu) {
        openDropdown.classList.remove('megamenu--open');
        siteNav.querySelector('[data-dropdown].nav__btn--open')?.classList.remove('nav__btn--open');
      }

      const isOpen = menu.classList.toggle('megamenu--open');
      btn.classList.toggle('nav__btn--open', isOpen);
      overlay.classList.toggle('megamenu-overlay--visible', isOpen);
      openDropdown = isOpen ? menu : null;
    });
  });

  overlay.addEventListener('click', () => {
    siteNav.querySelectorAll('.megamenu--open').forEach((m) => m.classList.remove('megamenu--open'));
    siteNav.querySelectorAll('.nav__btn--open').forEach((b) => b.classList.remove('nav__btn--open'));
    overlay.classList.remove('megamenu-overlay--visible');
    openDropdown = null;
  });
})();