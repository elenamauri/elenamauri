gsap.registerPlugin(ScrollTrigger);

// 1. Stato iniziale
let allowScroll = false;

// 2. Controlla se loader già mostrato in questa sessione
const loaderShown = sessionStorage.getItem('loaderShown');

// 3. Funzione per gestire scroll
function manageScroll() {
  if (!allowScroll) {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  } else {
    document.body.style.overflow = '';
  }
}

// 4. Se loader già visto, skip animazione e rimuovi loader subito
if (loaderShown) {
  allowScroll = true;
  manageScroll();
  const loader = document.querySelector('.loader');
  if (loader) loader.remove();
} else {
  // 5. Prepara elementi e blocco scroll
  gsap.set('.loader-content', { opacity: 1 });
  manageScroll();

  // 6. Timeline animazioni
  const timeline = gsap.timeline({
    onComplete: () => {
      allowScroll = true;
      manageScroll();
      document.querySelector('.loader').remove();

      // Segna che loader è stato mostrato
      sessionStorage.setItem('loaderShown', 'true');
    }
  });

  // 7. Sequenza animazioni
  timeline
    .to('.letter-e', { opacity: 1, x: -20, duration: 1 })
    .to('.letter-m', { opacity: 1, x: 20, duration: 1 }, "-=0.8")
    .to('.loader-image', {
      width: '100vw',
      height: '100vh',
      borderRadius: '0%',
      duration: 2,
      ease: 'power3.inOut',
      onUpdate: function() {
        gsap.set('.loader-content', { gap: `${this.progress() * 80}vw` });
      }
    })
    .to('.loader', {
      y: '-100%',
      duration: 1.5,
      ease: 'power3.inOut'
    }, "+=0.3");
  
  // 8. Controllo scroll durante il loader
  window.addEventListener('scroll', () => {
    if (!allowScroll) {
      window.scrollTo(0, 0);
    }
  });
}

// 9. Cleanup scroll su unload
window.addEventListener('beforeunload', () => {
  document.body.style.overflow = '';
});



// Label CTA che segue il mouse sulle card progetto (re-inizializzata in initHome per Barba)
function initWorkCursorLabel() {
  const cursorLabel = document.querySelector('.work-cursor-label');
  const workItems = document.querySelectorAll('.work-item');
  if (!cursorLabel || !workItems.length) return;

  workItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const projectHeading = item.querySelector('.work-heading');
      if (projectHeading) {
        cursorLabel.textContent = projectHeading.textContent.trim();
      }
      cursorLabel.style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      cursorLabel.style.opacity = '0';
    });
    item.addEventListener('mousemove', (e) => {
      const offsetX = 50;
      const offsetY = 25;
      cursorLabel.style.top = (e.clientY + offsetY) + 'px';
      cursorLabel.style.left = (e.clientX + offsetX) + 'px';
    });
  });
}

// Cursore custom: segue il mouse e diventa crema sul blu (footer, nome, CTA)
function initSiteCursor() {
  if (window.__siteCursorReady) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  window.__siteCursorReady = true;
  document.documentElement.classList.add('has-custom-cursor');

  var el = document.createElement('div');
  el.className = 'site-cursor';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);

  var x = 0;
  var y = 0;
  var visible = false;
  var ticking = false;
  var lightSelectors = [
    '.sticky-name',
    '.footer',
    '.footer-spacer',
    '.hero',
    '.more-drawer-close',
    '.image-lightbox-close',
    '.image-lightbox-zoom-btn',
    '.next-project-cta'
  ].join(',');
  var pointerSelectors = 'a[href], button:not(:disabled), [role="button"], .work-item, .work-link, .clickable-image';

  function creamCover() {
    return document.querySelector('.works')
      || document.querySelector('.project-content-wrapper')
      || document.querySelector('.disegnetti-page');
  }

  function shouldBeLight(px, py, node) {
    var cover = creamCover();
    if (cover && py > cover.getBoundingClientRect().bottom) return true;
    node = node || document.elementFromPoint(px, py);
    return !!(node && node.closest(lightSelectors));
  }

  function applyCursorState() {
    var node = document.elementFromPoint(x, y);
    var overLink = !!(node && node.closest(pointerSelectors));
    document.documentElement.classList.toggle('is-over-link', overLink);
    el.classList.toggle('is-light', !overLink && shouldBeLight(x, y, node));
    el.classList.toggle('is-on-link', overLink);
    el.classList.toggle('is-visible', visible);
  }

  function render() {
    ticking = false;
    el.style.transform = 'translate3d(' + (x - 16) + 'px,' + (y - 16) + 'px,0)';
    applyCursorState();
  }

  function schedule() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    visible = true;
    el.style.transform = 'translate3d(' + (x - 16) + 'px,' + (y - 16) + 'px,0)';
    applyCursorState();
  }, { passive: true });

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget) {
      visible = false;
      schedule();
    }
  });

  if (window.__lenis && typeof window.__lenis.on === 'function') {
    window.__lenis.on('scroll', schedule);
  }
}


// Lenis
/* const lenis = new Lenis({
  duration: 0.2,     // durata dell'animazione scroll (più alto = più lento)
  easing: t => t * (2 - t),  // easeOutQuad
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
*/
// ============ Lenis base (se già l'hai, lascialo una volta sola) ============
try {
  const lenis = new Lenis({ smooth: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  // Rendi disponibile globalmente se serve riusare:
  window.__lenis = lenis;
} catch (e) { /* silenzio se Lenis non è disponibile */ }

initSiteCursor();

// ============ Overlay persistente ============
let overlay = document.getElementById('transition-overlay');
if (!overlay) {
  overlay = document.createElement('div');
  overlay.id = 'transition-overlay';
  document.body.appendChild(overlay);
}

// Ultimo punto di click (default centro)
let clickX = window.innerWidth / 2;
let clickY = window.innerHeight / 2;

// Cattura le coordinate del click su link interni (prima che Barba navighi)
document.addEventListener('click', (e) => {
  const link = e.target.closest('a.work-link, a[data-transition="circle"]');
  if (!link) return;
  clickX = e.clientX;
  clickY = e.clientY;
  overlay.style.setProperty('--tx', `${clickX}px`);
  overlay.style.setProperty('--ty', `${clickY}px`);
}, true);

// ============ Tipo di transizione Barba (cambia per provare) ============
// Opzioni: 'circle' | 'fade' | 'slide' | 'wipe' | 'scale'
var BARBA_TRANSITION = 'wipe';

// ============ Caricamento automatico card da pagina progetto ============
function applyCardData(card, title, description, heroSrc, isVideo, baseUrl) {
  if (title) {
    const h = card.querySelector('.work-heading');
    if (h) h.textContent = title;
  }
  if (description) {
    const p = card.querySelector('.work-desc');
    if (p) p.textContent = description;
  }
  if (heroSrc) {
    const fullSrc = heroSrc.indexOf('http') === 0 ? heroSrc : (baseUrl + heroSrc);
    const wrap = card.querySelector('.work-image');
    if (wrap) {
      if (isVideo) {
        const video = document.createElement('video');
        video.src = fullSrc;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.autoplay = true;
        video.preload = 'auto';
        video.alt = title || 'Project preview';
        wrap.innerHTML = '';
        wrap.appendChild(video);
      } else {
        var img = wrap.querySelector('img');
        if (img) {
          img.src = fullSrc;
          img.alt = title || 'Project preview';
        } else {
          wrap.innerHTML = '<img src="' + fullSrc + '" alt="' + (title || 'Project preview').replace(/"/g, '&quot;') + '">';
        }
      }
    }
  }
}

function loadProjectCardsFromPages() {
  const cards = document.querySelectorAll('.work-item[data-fetch-from-project="true"]');
  cards.forEach(function (card) {
    const projectUrl = card.getAttribute('data-project-url') || card.getAttribute('href');
    if (!projectUrl || projectUrl.startsWith('#') || projectUrl.startsWith('mailto:')) return;
    var absoluteProjectUrl = new URL(projectUrl, window.location.href).href;
    var projectBase = projectUrl.replace(/\/[^/]*$/, '/') || '';
    var projectBaseUrl = absoluteProjectUrl.replace(/\/[^/]*$/, '/');

    function tryHtmlPage() {
      fetch(absoluteProjectUrl)
        .then(function (res) {
          if (!res.ok) throw new Error('Not ok');
          return res.text();
        })
        .then(function (html) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const titleEl = doc.querySelector('h1.project-hero-title');
          const introEl = doc.querySelector('.project-intro-text');
          const heroVideo = doc.querySelector('.project-hero-image video');
          const heroImg = doc.querySelector('.project-hero-image img');
          const title = titleEl ? titleEl.textContent.trim() : '';
          const description = introEl ? introEl.textContent.trim() : '';
          var heroSrc = '';
          var isVideo = false;
          if (heroVideo && heroVideo.getAttribute('src')) {
            heroSrc = heroVideo.getAttribute('src');
            isVideo = true;
          } else if (heroImg && heroImg.getAttribute('src')) {
            heroSrc = heroImg.getAttribute('src');
          }
          applyCardData(card, title, description, heroSrc, isVideo, projectBase);
        })
        .catch(function () {
          var p = card.querySelector('.work-desc');
          if (p) p.textContent = 'Progetto non disponibile.';
        });
    }

    fetch(projectBaseUrl + 'meta.json')
      .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
      .then(function (data) {
        var hero = data.hero || '';
        var isVideo = (data.heroType === 'video') || (hero && /\.(mp4|webm|ogg)/i.test(hero));
        applyCardData(card, data.title, data.description, hero, isVideo, projectBaseUrl);
      })
      .catch(tryHtmlPage);
  });
}

// ============ Funzioni di (ri)inizializzazione per pagina ============
function initHome() {
  loadProjectCardsFromPages();
  initWorkCursorLabel();
  initMoreWorksDrawer();
  if (window.initTextAnimation) window.initTextAnimation();
}

var MORE_WORKS = {
  marketplace: {
    kicker: 'Experience marketplace',
    title: 'Multivendor Experience Marketplace',
    text: 'A multivendor marketplace for booking experiences across Italy, built on WordPress/Dokan. I led the project end-to-end — from a discovery workshop through architecture, flows, wireframes, and visual design.'
  },
  certification: {
    kicker: 'Certification platform',
    title: 'Certification Management Platform',
    text: 'A custom platform where operators request certification for their experience: a self-assessment unlocks Level 1, a mystery-client audit unlocks Level 2, then the listing goes live in the public catalog. I mapped every flow, state, and user role, then designed wireframes and visual for both the operator platform and the public catalog.'
  },
  cro: {
    kicker: 'Fintech CRO',
    title: 'Ongoing CRO — Fintech Platform',
    text: 'A year-long, ongoing conversion optimization engagement: heuristic analysis, behavioral data (Clarity), and UX/UI proposals across the key conversion pages — homepage, plan comparison, and service explainers.'
  },
  audit: {
    kicker: 'Retail UX audit',
    title: 'UX Audit — Retail Platform',
    text: 'A full UX audit for a large retail platform: heuristic evaluation, information architecture review, and communication/visual assessment, delivered as a presentation with documented guidelines for the internal team.'
  }
};

function initMoreWorksDrawer() {
  if (window.__moreWorksBound) return;
  window.__moreWorksBound = true;

  var lastTrigger = null;

  function getDrawer() {
    return document.getElementById('moreDrawer');
  }

  function setLenis(paused) {
    if (!window.__lenis) return;
    if (paused && typeof window.__lenis.stop === 'function') window.__lenis.stop();
    if (!paused && typeof window.__lenis.start === 'function') window.__lenis.start();
  }

  function closeDrawer() {
    var drawer = getDrawer();
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    setLenis(false);
    document.querySelectorAll('.more-works-link[aria-expanded="true"]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
    });
    if (lastTrigger) lastTrigger.focus();
  }

  function openDrawer(id, trigger) {
    var data = MORE_WORKS[id];
    var drawer = getDrawer();
    if (!data || !drawer) return;
    lastTrigger = trigger || null;
    document.getElementById('moreDrawerKicker').textContent = data.kicker;
    document.getElementById('moreDrawerTitle').textContent = data.title;
    document.getElementById('moreDrawerText').textContent = data.text;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    setLenis(true);
    document.querySelectorAll('.more-works-link').forEach(function (btn) {
      btn.setAttribute('aria-expanded', btn === trigger ? 'true' : 'false');
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        drawer.classList.add('is-open');
      });
    });
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-more-project]');
    if (trigger) {
      e.preventDefault();
      openDrawer(trigger.getAttribute('data-more-project'), trigger);
      return;
    }
    if (e.target.closest('[data-more-close]')) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  if (typeof barba !== 'undefined') {
    barba.hooks.leave(function () {
      closeDrawer();
    });
  }
}

function initWork() {
  initProjectLightbox();
}

function ensureLightboxEl() {
  var el = document.getElementById('imageLightbox');
  if (el) return el;
  el = document.createElement('div');
  el.className = 'image-lightbox';
  el.id = 'imageLightbox';
  el.innerHTML =
    '<div class="image-lightbox-content" id="lightboxContent">' +
      '<img id="lightboxImage" src="" alt="">' +
    '</div>' +
    '<button type="button" class="image-lightbox-close" id="lightboxClose">×</button>' +
    '<div class="image-lightbox-zoom-controls">' +
      '<button type="button" class="image-lightbox-zoom-btn" id="zoomIn">+</button>' +
      '<button type="button" class="image-lightbox-zoom-btn" id="zoomOut">−</button>' +
      '<button type="button" class="image-lightbox-zoom-btn" id="resetZoom">↺</button>' +
    '</div>';
  document.body.appendChild(el);
  return el;
}

function initProjectLightbox() {
  var lightbox = ensureLightboxEl();
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxClose = document.getElementById('lightboxClose');
  var zoomIn = document.getElementById('zoomIn');
  var zoomOut = document.getElementById('zoomOut');
  var resetZoom = document.getElementById('resetZoom');
  if (!lightbox || !lightboxImage) return;

  if (window.__lightboxBound) return;
  window.__lightboxBound = true;

  var currentZoom = 1;
  var isDragging = false;
  var startX, startY, imageX = 0, imageY = 0;

  function setLenis(paused) {
    if (!window.__lenis) return;
    if (paused && typeof window.__lenis.stop === 'function') window.__lenis.stop();
    if (!paused && typeof window.__lenis.start === 'function') window.__lenis.start();
  }

  function updateImageTransform() {
    lightboxImage.style.transform = 'scale(' + currentZoom + ') translate(' + (imageX / currentZoom) + 'px, ' + (imageY / currentZoom) + 'px)';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setLenis(false);
    currentZoom = 1;
    imageX = 0;
    imageY = 0;
  }

  function openLightbox(src) {
    var imageSrc = src;
    try {
      if (imageSrc && imageSrc.indexOf('http') !== 0 && imageSrc.indexOf('data:') !== 0) {
        imageSrc = new URL(imageSrc, window.location.href).href;
      }
    } catch (err) {}
    currentZoom = 1;
    imageX = 0;
    imageY = 0;
    lightboxImage.style.transform = 'scale(1) translate(0, 0)';
    lightboxImage.style.transformOrigin = 'center center';
    lightboxImage.style.width = '90vw';
    lightboxImage.style.maxWidth = 'none';
    lightboxImage.style.height = 'auto';
    lightboxImage.style.opacity = '1';
    lightboxImage.style.visibility = 'visible';
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    setLenis(true);
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest('.clickable-image');
    if (!img) return;
    e.preventDefault();
    e.stopPropagation();
    openLightbox(img.getAttribute('data-image-src') || img.getAttribute('src'));
  }, true);

  if (lightboxClose) {
    lightboxClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });

  if (zoomIn) {
    zoomIn.addEventListener('click', function (e) {
      e.stopPropagation();
      currentZoom = Math.min(currentZoom * 1.25, 10);
      updateImageTransform();
    });
  }
  if (zoomOut) {
    zoomOut.addEventListener('click', function (e) {
      e.stopPropagation();
      currentZoom = Math.max(currentZoom * 0.8, 0.5);
      updateImageTransform();
    });
  }
  if (resetZoom) {
    resetZoom.addEventListener('click', function (e) {
      e.stopPropagation();
      currentZoom = 1;
      imageX = 0;
      imageY = 0;
      updateImageTransform();
    });
  }

  lightboxImage.addEventListener('wheel', function (e) {
    if (!lightbox.classList.contains('active')) return;
    e.preventDefault();
    var zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    currentZoom = Math.max(0.5, Math.min(currentZoom * zoomFactor, 10));
    updateImageTransform();
  }, { passive: false });

  lightboxImage.addEventListener('mousedown', function (e) {
    if (currentZoom <= 1) return;
    isDragging = true;
    startX = e.clientX - imageX;
    startY = e.clientY - imageY;
    lightboxImage.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    e.preventDefault();
    imageX = e.clientX - startX;
    imageY = e.clientY - startY;
    updateImageTransform();
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    lightboxImage.style.cursor = 'grab';
  });
}

function initDisegnetti() {
  var grid = document.querySelector('.disegnetti-grid');
  var buttons = document.querySelectorAll('.disegnetti-col-btn');
  if (!grid || !buttons.length) return;
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var cols = this.getAttribute('data-cols');
      grid.setAttribute('data-cols', cols);
      buttons.forEach(function(b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  });
}

// ============ Barba.js ============
if (typeof barba !== 'undefined') {
  barba.init({
  // Evita Barba su link esterni o con target blank
  prevent: ({ el }) => {
    const link = el.closest('a');
    if (!link) return false;
    const isExternal = link.host && link.host !== window.location.host;
    return isExternal || link.hasAttribute('data-barba-prevent') || link.target === '_blank';
  },

  transitions: [{
    name: 'custom',
    async leave(data) {
      const container = data.current.container;
      const d = 0.25;
      const ease = 'power2.inOut';

      if (BARBA_TRANSITION === 'circle') {
        gsap.set(overlay, { opacity: 1 });
        const tl = gsap.timeline();
        tl.set(overlay, {
          clipPath: `circle(0 at ${clickX}px ${clickY}px)`,
          webkitClipPath: `circle(0 at ${clickX}px ${clickY}px)`
        });
        tl.to(overlay, {
          duration: 0.28,
          ease: 'power2.out',
          clipPath: `circle(150vmax at ${clickX}px ${clickY}px)`,
          webkitClipPath: `circle(150vmax at ${clickX}px ${clickY}px)`
        });
        await tl.then();
        return;
      }

      if (BARBA_TRANSITION === 'fade') {
        gsap.set(overlay, { opacity: 0 });
        await gsap.to(overlay, { duration: d, opacity: 1, ease }).then();
        return;
      }

      if (BARBA_TRANSITION === 'slide') {
        await gsap.to(container, { duration: d, xPercent: -100, ease }).then();
        return;
      }

      if (BARBA_TRANSITION === 'wipe') {
        gsap.set(overlay, { opacity: 1, clipPath: 'inset(0 100% 0 0)', webkitClipPath: 'inset(0 100% 0 0)' });
        await gsap.to(overlay, {
          duration: d,
          clipPath: 'inset(0 0 0 0)',
          webkitClipPath: 'inset(0 0 0 0)',
          ease
        }).then();
        return;
      }

      if (BARBA_TRANSITION === 'scale') {
        await gsap.to(container, { duration: d, scale: 0.97, opacity: 0, ease }).then();
        return;
      }
    },

    async enter(data) {
      const container = data.next.container;
      const d = 0.28;
      const ease = 'power2.inOut';

      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);

      if (BARBA_TRANSITION === 'circle') {
        const tl = gsap.timeline();
        tl.to(overlay, {
          duration: 0.32,
          ease: 'power2.out',
          clipPath: `circle(0 at ${clickX}px ${clickY}px)`,
          webkitClipPath: `circle(0 at ${clickX}px ${clickY}px)`
        });
        await tl.then();
        return;
      }

      if (BARBA_TRANSITION === 'fade') {
        gsap.set(overlay, { opacity: 1 });
        await gsap.to(overlay, { duration: d, opacity: 0, ease }).then();
        return;
      }

      if (BARBA_TRANSITION === 'slide') {
        gsap.set(container, { xPercent: 100 });
        await gsap.to(container, { duration: d, xPercent: 0, ease }).then();
        gsap.set(container, { xPercent: 0 });
        return;
      }

      if (BARBA_TRANSITION === 'wipe') {
        gsap.set(overlay, { clipPath: 'inset(0 0 0 0)', webkitClipPath: 'inset(0 0 0 0)' });
        await gsap.to(overlay, {
          duration: d,
          clipPath: 'inset(0 100% 0 0)',
          webkitClipPath: 'inset(0 100% 0 0)',
          ease
        }).then();
        return;
      }

      if (BARBA_TRANSITION === 'scale') {
        gsap.set(container, { scale: 0.98, opacity: 0 });
        await gsap.to(container, { duration: d, scale: 1, opacity: 1, ease }).then();
        gsap.set(container, { scale: 1, opacity: 1 });
        return;
      }
    },

    once(data) {
      gsap.set(overlay, { opacity: 0 });
      if (BARBA_TRANSITION === 'circle') {
        gsap.set(overlay, {
          clipPath: 'circle(0 at 50% 50%)',
          webkitClipPath: 'circle(0 at 50% 50%)'
        });
      }
      if (BARBA_TRANSITION === 'wipe') {
        gsap.set(overlay, { clipPath: 'none', webkitClipPath: 'none' });
      }
    }
  }],

  views: [
    {
      namespace: 'home',
      afterEnter() { initHome(); }
    },
    {
      namespace: 'work',
      afterEnter() { initWork(); }
    },
    {
      namespace: 'disegnetti',
      afterEnter() { initDisegnetti(); }
    }
  ]
  });
} else {
  console.warn('Barba.js non trovato, le transizioni non saranno disponibili');
}

// Prima inizializzazione (se arrivi direttamente sulla home o su disegnetti)
initHome();
initProjectLightbox();
if (document.querySelector('.disegnetti-grid')) initDisegnetti();

// ============ Gestione z-index footer in base alla metà dello scroll ============
function updateFooterZIndex() {
  const footer = document.querySelector('.footer');
  if (!footer) {
    return;
  }

  // Verifica se siamo in una pagina progetto (ha project-content-wrapper)
  const isProjectPage = document.querySelector('.project-content-wrapper') !== null;
  
  if (!isProjectPage) {
    // Nella homepage, footer sempre sotto il contenuto (z-index 1) ma visibile
    // Rimuovi qualsiasi z-index inline per usare quello del CSS (0)
    footer.style.removeProperty('z-index');
    return;
  }
  
  // Solo per pagine progetto: gestisci z-index in base allo scroll
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Calcola la metà della pagina (in termini di scroll)
  const scrollableHeight = Math.max(0, documentHeight - windowHeight);
  const middlePoint = scrollableHeight / 2;
  
  // Prima metà: footer sotto la hero (z-index: -1)
  // Seconda metà: footer sopra la hero ma sotto il content (z-index: 1)
  // Solo cambia se c'è abbastanza contenuto scrollabile (almeno 2 viewport)
  let newZIndex;
  if (scrollTop >= middlePoint && scrollableHeight > windowHeight * 1.5) {
    newZIndex = '1'; // Sopra la hero (z-index: 1) ma sotto il content (z-index: 2)
  } else {
    newZIndex = '-1'; // Sotto la hero (z-index: 1) e sotto tutto
  }
  
  // Solo aggiorna se è cambiato per evitare reflow inutili
  const currentZIndex = footer.style.zIndex || window.getComputedStyle(footer).zIndex;
  if (currentZIndex === newZIndex || currentZIndex === String(newZIndex)) {
    return;
  }
  
  // Imposta il nuovo z-index
  footer.style.zIndex = newZIndex;
}

// Funzione wrapper per evitare troppe chiamate
let footerZIndexTicking = false;
function handleFooterZIndexUpdate() {
  if (!footerZIndexTicking) {
    window.requestAnimationFrame(() => {
      updateFooterZIndex();
      footerZIndexTicking = false;
    });
    footerZIndexTicking = true;
  }
}

// Inizializza quando il DOM è pronto
function initFooterZIndex() {
  const footer = document.querySelector('.footer');
  
  if (footer) {
    updateFooterZIndex();
    window.addEventListener('scroll', handleFooterZIndexUpdate, { passive: true });
    window.addEventListener('resize', handleFooterZIndexUpdate);
    if (window.__lenis && typeof window.__lenis.on === 'function') {
      window.__lenis.on('scroll', handleFooterZIndexUpdate);
    }
  } else {
    // Riprova dopo un breve delay se il footer non è ancora nel DOM
    setTimeout(initFooterZIndex, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooterZIndex);
} else {
  initFooterZIndex();
}

// Reinizializza dopo le transizioni Barba
if (typeof barba !== 'undefined') {
  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      initFooterZIndex();
    }, 200);
  });
}

