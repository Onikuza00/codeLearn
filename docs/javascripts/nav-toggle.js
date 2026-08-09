// Fix sidebar section collapse/expand — pero sin romper el link cuando la
// sección tiene una página de índice real (navigation.indexes). Cuando hay
// índice, Material envuelve el <a> y el ícono de toggle en un
// <div class="md-nav__link md-nav__container">, así que hay que detectar el
// <a> real ANTES de decidir si el clic es un toggle.
document.addEventListener('DOMContentLoaded', () => {
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
