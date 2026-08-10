// ═══════════════════════════════════════════════════════
// PORTFOLIO — Main JS (Factory-inspired animations)
// ═══════════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ─── STATE ───
let currentLang = "ca";
let terminalTimeline;
let lastScrollY = 0;

// ─── SHARED HELPERS ───

const splitWords = (element, wordClass = "reveal-word") => {
  const originalHTML = element.innerHTML;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalHTML;
  const fragment = [];

  tempDiv.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      const words = node.textContent.split(/(\s+)/);
      words.forEach((w) => {
        if (w.trim()) {
          const span = document.createElement("span");
          span.className = wordClass;
          span.textContent = w;
          fragment.push(span);
        } else if (w.length > 0) {
          fragment.push(document.createTextNode(w));
        }
      });
    } else if (node.nodeType === 1) {
      const classes = node.className;
      const words = node.textContent.split(/(\s+)/);
      words.forEach((w) => {
        if (w.trim()) {
          const span = document.createElement("span");
          span.className = `${wordClass} ${classes}`;
          span.textContent = w;
          fragment.push(span);
        } else if (w.length > 0) {
          fragment.push(document.createTextNode(w));
        }
      });
    }
  });

  element.innerHTML = "";
  fragment.forEach((el) => element.appendChild(el));
};

// ─── I18N ───

const updateLanguageStrings = (lang) => {
  if (lang === currentLang) return;
  currentLang = lang;

  document.documentElement.lang = lang === "ca" ? "ca" : lang === "es" ? "es" : "en";

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (window.i18nData[lang] && window.i18nData[lang][key]) {
      el.innerHTML = window.i18nData[lang][key];
    }
  });

  // Kill and re-init
  ScrollTrigger.getAll().forEach((st) => st.kill());
  if (window.tlHero) window.tlHero.kill();
  if (terminalTimeline) terminalTimeline.kill();

  // Re-init text-dependent animations
  document.querySelectorAll(".reveal-type-manifesto").forEach((el) => splitWords(el));
  document.querySelectorAll(".txt-reveal").forEach((el) => splitWords(el));
  init3DCascade();
  initTerminalEffect();
  initStackBars();
  initProjectReveal();
  initStackReveal();

  // Force hero text visible
  gsap.set(".reveal-type-manifesto .reveal-word", { opacity: 1, y: 0 });

  ScrollTrigger.refresh();
};

// ─── INTRO CURTAIN ───

const initIntro = () => {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    gsap.set(".header", { y: 0, opacity: 1 });
    gsap.set(".hero-tagline, .hero-display, .hero-actions", { opacity: 1, y: 0 });
    gsap.set("#intro-overlay", { display: "none" });
    gsap.set("body", { overflow: "auto" });
    document.querySelectorAll(".reveal-type-manifesto").forEach((el) => splitWords(el));
    gsap.set(".reveal-type-manifesto .reveal-word", { opacity: 1, y: 0 });
    return;
  }

  gsap.set("body", { overflow: "hidden" });
  gsap.set(".header", { y: -80, opacity: 0 });
  gsap.set(".pc-left", { xPercent: -100, opacity: 0 });
  gsap.set(".pc-right", { xPercent: 100, opacity: 0 });
  gsap.set(".hero-tagline, .hero-display, .hero-labels, .hero-actions", { opacity: 0, y: 20 });

  document.querySelectorAll(".reveal-type-manifesto").forEach((el) => splitWords(el));

  window.tlHero = gsap.timeline({
    onComplete: () => {
      gsap.set("body", { overflow: "auto" });
      ScrollTrigger.refresh();
    },
  });

  // 1. Logo halves entrance
  window.tlHero
    .to(".pc-left", { xPercent: 0, opacity: 1, duration: 1.2, ease: "back.out(1.4)" })
    .to(".pc-right", { xPercent: 0, opacity: 1, duration: 1.2, ease: "back.out(1.4)" }, "<");

  // 2. Curtain open
  window.tlHero
    .to(".intro-panel.left", { xPercent: -100, duration: 1.6, ease: "expo.inOut", delay: 0.8 })
    .to(".intro-panel.right", { xPercent: 100, duration: 1.6, ease: "expo.inOut" }, "<")
    .set("#intro-overlay", { display: "none" });

  // 3. Header + hero elements
  window.tlHero
    .to(".header", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.8")
    .to(".hero-labels", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
    .to(".hero-tagline", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4")
    .to(".hero-display", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3");

  // 4. Manifesto word reveal
  const words = document.querySelectorAll(".reveal-type-manifesto .reveal-word");
  if (words.length > 0) {
    window.tlHero.to(words, { duration: 1.2, opacity: 1, y: 0, stagger: 0.06, ease: "power3.out" }, ">-0.2");
  }

  // 5. Actions
  window.tlHero.to(".hero-actions", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, ">-0.2");
};

// ─── TERMINAL EFFECT ───

const initTerminalEffect = () => {
  if (terminalTimeline) terminalTimeline.kill();

  const msgs = window.i18nData[currentLang]?.["terminal-messages"];
  const target = document.querySelector(".term-target");
  if (!target || !msgs) return;

  terminalTimeline = gsap.timeline({ repeat: -1 });

  msgs.forEach((msg) => {
    terminalTimeline
      .to(target, { text: msg, duration: 1.5, ease: "none", delay: 0.5 })
      .to(target, { text: "", duration: 0.5, ease: "none", delay: 2 });
  });
};

// ─── PROJECT CARD REVEAL ───

const initProjectReveal = () => {
  gsap.fromTo(
    ".project-card",
    {
      opacity: 0,
      rotateY: -90,
      transformOrigin: "left center",
      scale: 0.9,
      xPercent: -20,
    },
    {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      xPercent: 0,
      scrollTrigger: {
        trigger: "#projects",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      clearProps: "transform",
    }
  );
};

// ─── STACK BAR ANIMATION ───

const initStackBars = () => {
  const fills = document.querySelectorAll(".stack-bar-fill");

  fills.forEach((fill) => {
    const width = fill.getAttribute("data-width");
    if (!width) return;

    gsap.set(fill, { width: "0%" });

    gsap.to(fill, {
      width: `${width}%`,
      scrollTrigger: {
        trigger: fill.closest(".stack-item"),
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      duration: 1,
      ease: "power3.out",
      delay: 0.1,
    });
  });
};

// ─── STACK CARD REVEAL ───

const initStackReveal = () => {
  gsap.fromTo(
    ".stack-item",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: "#stack",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      duration: 0.6,
      stagger: 0.04,
      ease: "power3.out",
      clearProps: "opacity,transform",
    }
  );
};

// ─── 3D CASCADE TITLES ───

const init3DCascade = () => {
  document.querySelectorAll(".txt-cascade").forEach((title) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = title.innerHTML;
    let newHTML = "";

    tempDiv.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        newHTML += node.textContent
          .split("")
          .map((c) => `<span class="char">${c === " " ? "&nbsp;" : c}</span>`)
          .join("");
      } else if (node.nodeType === 1) {
        const isGradient = node.classList.contains("text-gradient");
        const cls = isGradient ? 'char text-gradient' : 'char';
        newHTML += node.textContent
          .split("")
          .map((c) => `<span class="${cls}">${c === " " ? "&nbsp;" : c}</span>`)
          .join("");
      }
    });

    title.innerHTML = newHTML;
    const chars = title.querySelectorAll(".char");

    gsap.from(chars, {
      scrollTrigger: {
        trigger: title,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      rotationX: -90,
      transformOrigin: "0% 50% -50",
      stagger: 0.03,
      duration: 1,
      ease: "back.out(1.4)",
    });
  });
};

// ─── ABOUT ANIMATIONS ───

const initAbout = () => {
  document.querySelectorAll(".txt-reveal").forEach((el) => splitWords(el));

  const tlAbout = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  tlAbout.from(".about-visual", {
    x: -200,
    rotationY: 360,
    opacity: 0,
    duration: 1.4,
    ease: "power3.out",
  });

  const words = document.querySelectorAll(".about-grid .reveal-word");
  if (words.length > 0) {
    tlAbout.to(words, { duration: 1, opacity: 1, y: 0, stagger: 0.06, ease: "power3.out" }, ">-0.6");
  }
};

// ─── BG PARALLAX ───

const initBgParallax = () => {
  gsap.to(".bg-grid", {
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
    },
    opacity: 0.6,
    ease: "none",
  });
};

// ─── SCROLL INDICATOR ───

const initScrollIndicator = () => {
  gsap.to(".card__footer", {
    scrollTrigger: {
      trigger: ".card-hero",
      start: "bottom bottom",
      end: "bottom top-=80",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    ease: "power2.out",
  });
};

// ─── NAV HIGHLIGHT ───

const initNavHighlight = () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active-nav", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
};

// ─── MOBILE MENU ───

const initMobileMenu = () => {
  const toggle = document.querySelector(".nav-toggle");
  const list = document.querySelector(".nav-list");

  if (!toggle || !list) return;

  toggle.addEventListener("click", () => {
    list.classList.toggle("active");
    toggle.classList.toggle("active");
  });

  list.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      list.classList.remove("active");
      toggle.classList.remove("active");
    });
  });
};

// ─── TOUCH STACK SUPPORT ───

const initStackTouch = () => {
  document.querySelectorAll(".stack-item").forEach((item) => {
    let touched = false;

    item.addEventListener("touchstart", () => {
      touched = true;
      item.style.borderColor = "var(--clr-accent-dim)";
      item.style.background = "var(--clr-surface-2)";
    }, { passive: true });

    item.addEventListener("touchend", () => {
      setTimeout(() => {
        touched = false;
        item.style.borderColor = "";
        item.style.background = "";
      }, 300);
    }, { passive: true });
  });
};

// ─── HEADER HIDE/SHOW ON SCROLL ───

const initHeaderScroll = () => {
  const header = document.querySelector(".header");
  if (!header) return;

  gsap.to(header, {
    scrollTrigger: {
      trigger: "body",
      start: "top -80",
      end: "max",
      onUpdate: (self) => {
        const scrollY = self.scroll();
        if (scrollY > lastScrollY && scrollY > 100) {
          gsap.to(header, { y: -80, duration: 0.3, ease: "power2.out" });
        } else if (scrollY < lastScrollY || scrollY < 100) {
          gsap.to(header, { y: 0, duration: 0.3, ease: "power2.out" });
        }
        lastScrollY = scrollY;
      },
    },
  });
};

// ─── INIT ───

document.addEventListener("DOMContentLoaded", () => {
  // Language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      updateLanguageStrings(btn.dataset.lang);
    });
  });

  // Init intro
  initIntro();

  // Init all effects
  initTerminalEffect();
  initProjectReveal();
  initStackReveal();
  initStackBars();
  init3DCascade();
  initAbout();
  initBgParallax();
  initScrollIndicator();
  initNavHighlight();
  initMobileMenu();
  initStackTouch();
  initHeaderScroll();
});
