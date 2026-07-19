// Fix sidebar section collapse/expand
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.md-nav__item--nested > .md-nav__link').forEach(label => {
    label.addEventListener('click', (e) => {
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
});
