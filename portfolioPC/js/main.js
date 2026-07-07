document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTerminalTypewriter();
  initProjectExpand();
});

function initNavigation() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    const nextState = String(!isOpen);
    toggle.setAttribute('aria-expanded', nextState);
    links.setAttribute('aria-expanded', nextState);
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.setAttribute('aria-expanded', 'false');
    });
  });
}

function initProjectExpand() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  let activeInterval = null;

  function collapseCard(el, tags, info, cb) {
    if (tags && info) info.appendChild(tags);
    if (el) {
      gsap.to(el, {
        height: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          el.closest('.project-card').classList.remove('is-expanded');
          gsap.set(el, { clearProps: 'height' });
          if (cb) cb();
        }
      });
    } else {
      el?.closest('.project-card')?.classList.remove('is-expanded');
      if (cb) cb();
    }
  }

  function expandCard(el, card, tags) {
    card.classList.add('is-expanded');
    if (tags) card.appendChild(tags);

    if (el) {
      gsap.set(el, { height: 0 });
      el.offsetHeight; // force layout
      gsap.to(el, {
        height: el.scrollHeight,
        duration: 0.4,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(el, { height: 'auto' });
        }
      });
    }
  }

  cards.forEach(card => {
    const tagsEl = card.querySelector('.project-card__tags');
    const infoEl = card.querySelector('.project-card__info');
    const expandEl = card.querySelector('.project-card__expand');

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;

      const isExpanded = card.classList.contains('is-expanded');

      // Detener carrusel anterior
      if (activeInterval) {
        clearInterval(activeInterval);
        activeInterval = null;
      }

      if (isExpanded) {
        // Colapsar
        collapseCard(expandEl, tagsEl, infoEl);
        return;
      }

      // Cerrar otras cards expandidas
      cards.forEach(other => {
        if (other.classList.contains('is-expanded')) {
          collapseCard(
            other.querySelector('.project-card__expand'),
            other.querySelector('.project-card__tags'),
            other.querySelector('.project-card__info')
          );
        }
      });

      // Expandir la clickeada
      expandCard(expandEl, card, tagsEl);

      // Auto-scroll horizontal solo en mobile
      const track = card.querySelector('.carousel__track');
      if (track && track.children.length > 2 && window.innerWidth < 768) {
        let step = 0;
        const total = track.children.length / 2;

        activeInterval = setInterval(() => {
          const imgW = track.parentElement.offsetWidth;
          step++;
          if (step >= total) {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            step = 0;
            track.offsetHeight;
            track.style.transition = 'transform 0.10s ease';
          } else {
            track.style.transform = `translateX(-${step * imgW}px)`;
            track.style.transition = 'transform 0.10s ease';
          }
        }, 3000);
      }
    });
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    const expanded = document.querySelector('.project-card.is-expanded');
    if (!expanded) return;
    if (e.target.closest('.project-card')) return;

    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }

    cards.forEach(c => {
      if (c.classList.contains('is-expanded')) {
        collapseCard(
          c.querySelector('.project-card__expand'),
          c.querySelector('.project-card__tags'),
          c.querySelector('.project-card__info')
        );
      }
    });
  });
}

function initTerminalTypewriter() {
  const target = document.querySelector('.js-terminal-type');
  if (!target || typeof gsap === 'undefined') return;

  const messages = [
    'Junior Full-Stack Developer',
    'Building with Symfony, Vue, and GSAP',
    'Crafting interactive web experiences',
    'Modern UI & animation enthusiast',
    'DAW graduate — always learning',
    'Linux + Tmux + LazyVim daily driver',
  ];

  const tl = gsap.timeline({ repeat: -1 });

  messages.forEach((msg) => {
    tl.to(target, {
      text: msg,
      duration: 1.8,
      ease: 'none',
      delay: 0.8,
    })
      .to(target, {
        text: '',
        duration: 0.6,
        ease: 'none',
        delay: 2.5,
    });
  });
}
