const PROJECTS_PER_PAGE = 6;
let currentPage = 1;
let allProjects = [];

async function initProjects() {
  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allProjects = await res.json();
    goToPage(1);
  } catch (err) {
    console.error('Error al cargar proyectos:', err);
  }
}

function goToPage(page) {
  collapseExpanded();
  currentPage = page;
  const grid = document.getElementById('gridProjects');
  if (!grid) return;

  const nav = document.getElementById('pagination');
  const isInitialLoad = !nav || !nav.dataset.rendered;

  const start = (page - 1) * PROJECTS_PER_PAGE;
  const pageProjects = allProjects.slice(start, start + PROJECTS_PER_PAGE);

  grid.innerHTML = pageProjects.map(renderCard).join('');
  renderPagination();

  if (!isInitialLoad) {
    if (typeof window.animateProjectCards === 'function') {
      window.animateProjectCards();
    }
  }

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

function collapseExpanded() {
  document.querySelectorAll('.project-card.is-expanded').forEach(c => {
    c.classList.remove('is-expanded');
    c.style.flexBasis = '';
    c.style.order = '';
    c.style.display = '';
  });
}

function renderCard(p) {
  const uniqueImages = Array.from(new Set([p.img, ...(p.images || [])]));
  const images = uniqueImages.map(src =>
    `<img src="img/proyectos/${src}" alt="${p.name}" loading="lazy" />`
  ).join('');

  const dateStr = formatDate(p.date);

  return `
    <article class="project-card" data-project="${p.id}">
      <div class="project-card__preview">
        <img src="img/proyectos/${p.img}" alt="Captura de ${p.name}" loading="lazy" />
        <div class="project-card__info">
          <h3 class="project-card__name">${p.name}</h3>
          <time class="project-card__date">${dateStr}</time>
          <p class="project-card__desc">${p.desc}</p>
          <p class="expand__desc" data-raw-text="${p.expandDesc}">${p.expandDesc}</p>
          <ul class="project-card__tags">
            ${p.tags.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="project-card__expand">
        ${images ? `<a href="${p.url || '#'}" ${p.url ? 'target="_blank" rel="noopener noreferrer"' : ''} class="expand__carousel-link"><div class="expand__carousel"><div class="carousel__track">${images}${images}${images}${images}</div></div></a>` : ''}
      </div>
    </article>
  `;
}

function renderPagination() {
  const nav = document.getElementById('pagination');
  if (!nav) return;

  const total = Math.ceil(allProjects.length / PROJECTS_PER_PAGE);
  if (total <= 1) { nav.innerHTML = ''; return; }

  let html = `<button class="pagination__btn pagination__prev"${currentPage <= 1 ? ' disabled' : ''} aria-label="Anterior">‹</button>`;
  for (let i = 1; i <= total; i++) {
    html += `<button class="pagination__btn${i === currentPage ? ' is-active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += `<button class="pagination__btn pagination__next"${currentPage >= total ? ' disabled' : ''} aria-label="Siguiente">›</button>`;
  nav.innerHTML = html;

  if (nav.dataset.rendered) {
    requestAnimationFrame(() => {
      gsap.fromTo(nav.querySelectorAll('.pagination__btn'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.3, ease: 'power2.out' }
      );
    });
  } else {
    nav.dataset.rendered = 'true';
  }

  nav.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToPage(parseInt(btn.dataset.page));
    });
  });
  nav.querySelector('.pagination__prev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentPage > 1) goToPage(currentPage - 1);
  });
  nav.querySelector('.pagination__next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentPage < total) goToPage(currentPage + 1);
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

document.addEventListener('DOMContentLoaded', initProjects);
