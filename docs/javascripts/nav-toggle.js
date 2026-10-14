// Fix sidebar section collapse/expand — pero sin romper el link cuando la
// sección tiene una página de índice real (navigation.indexes). Cuando hay
// índice, Material envuelve el <a> y el ícono de toggle en un
// <div class="md-nav__link md-nav__container">, así que hay que detectar el
// <a> real ANTES de decidir si el clic es un toggle.
document.addEventListener('DOMContentLoaded', () => {
  // Iconos SVG por temática en el menú "Way to Code" — mkdocs.yml no permite
  // adjuntar una clase a una entrada de nav:, así que se marca por texto una
  // vez al cargar la página. Solo estilo (ver .nav-icon--* en extra.css).
  // Se excluye el label[for="__toc"] (toggle móvil duplicado con el mismo
  // texto que el link activo real).
  const NAV_ICONS = {
    'Plan de aprendizaje': 'nav-icon--plan',
    'Próxima sesión': 'nav-icon--sesion',
    'Repaso urgente': 'nav-icon--urgente',
    'Daily Log: 2026': 'nav-icon--log',
    'React': 'nav-icon--react',
  };
  document.querySelectorAll('.md-nav__link, .md-tabs__link').forEach((link) => {
    if (link.matches('label[for="__toc"]')) return;
    const text = link.querySelector(':scope > .md-ellipsis')?.textContent.trim();
    const cls = NAV_ICONS[text];
    if (cls) link.classList.add('nav-icon', cls);
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.md-nav__container > a.md-nav__link[href]')) return;

    const label = e.target.closest('.md-nav__item--nested > .md-nav__link');
    if (!label) return;

    e.preventDefault();
    const input = label.parentElement.querySelector(':scope > .md-nav__toggle');
    if (input) {
      if (input.checked) {
        input.checked = false;
        input.classList.remove('md-toggle--indeterminate');
      } else {
        input.checked = true;
        input.classList.add('md-toggle--indeterminate');
      }
    }
  });
});
