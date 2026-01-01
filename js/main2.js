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



// Label "scopri di più" cursor
const cursorLabel = document.querySelector('.work-cursor-label');
const workItems = document.querySelectorAll('.work-item');

workItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    // Estrae il nome del progetto dall'heading
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
    // Sposta la label un po' spostata rispetto al puntatore per non coprirlo
    const offsetX = 50;
    const offsetY = 25;
    cursorLabel.style.top = (e.clientY + offsetY) + 'px';
    cursorLabel.style.left = (e.clientX + offsetX) + 'px';
  });
});


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

// ============ Funzioni di (ri)inizializzazione per pagina ============
function initHome() {
  // Qui rimetti eventuali init della home: ScrollTrigger, animazioni testo, ecc.
  if (window.initTextAnimation) window.initTextAnimation();
}

function initWork() {
  // Inizializzazioni specifiche della pagina di dettaglio (gallerie, ecc.)
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
    name: 'circle-reveal',
    async leave(data) {
      // Espande il cerchio per coprire lo schermo
      const tl = gsap.timeline();
      tl.set(overlay, {
        clipPath: `circle(0 at ${clickX}px ${clickY}px)`,
        webkitClipPath: `circle(0 at ${clickX}px ${clickY}px)`
      });
      tl.to(overlay, {
        duration: 0.55,
        ease: 'power3.inOut',
        clipPath: `circle(150vmax at ${clickX}px ${clickY}px)`,
        webkitClipPath: `circle(150vmax at ${clickX}px ${clickY}px)`
      });
      await tl.then();
    },

    async enter(data) {
      // Torna a cerchio chiuso sulla nuova pagina
      const tl = gsap.timeline();
      tl.to(overlay, {
        duration: 0.6,
        ease: 'power3.inOut',
        clipPath: `circle(0 at ${clickX}px ${clickY}px)`,
        webkitClipPath: `circle(0 at ${clickX}px ${clickY}px)`
      });
      // Reset scroll all'inizio della nuova pagina
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      await tl.then();
    },

    // Chiamato al primissimo load
    once(data) {
      // Assicura overlay chiuso
      gsap.set(overlay, {
        clipPath: `circle(0 at 50% 50%)`,
        webkitClipPath: `circle(0 at 50% 50%)`
      });
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
    }
  ]
  });
} else {
  console.warn('Barba.js non trovato, le transizioni non saranno disponibili');
}

// Prima inizializzazione (se arrivi direttamente sulla home)
initHome();

// ============ Gestione z-index footer in base alla metà dello scroll ============
function updateFooterZIndex() {
  const footer = document.querySelector('.footer');
  if (!footer) {
    console.log('Footer non trovato - DOM potrebbe non essere ancora pronto');
    return;
  }

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Calcola la metà della pagina (in termini di scroll)
  const scrollableHeight = Math.max(0, documentHeight - windowHeight);
  const middlePoint = scrollableHeight / 2;
  
  console.log('Footer z-index update:', {
    scrollTop,
    middlePoint,
    scrollableHeight,
    documentHeight,
    windowHeight,
    condition: scrollTop >= middlePoint && scrollableHeight > 0
  });
  
  // Prima metà: footer sotto la hero (z-index: -1)
  // Seconda metà: footer sopra la hero ma sotto il content (z-index: 1)
  let newZIndex;
  if (scrollTop >= middlePoint && scrollableHeight > 0) {
    newZIndex = '1'; // Sopra la hero (z-index: 1, stesso livello ma viene dopo nel DOM) ma sotto il content (z-index: 2)
  } else {
    newZIndex = '-1'; // Sotto la hero (z-index: 1)
  }
  
  console.log('Calcolato newZIndex:', newZIndex, 'prima di impostare');
  
  // Rimuovi prima qualsiasi z-index esistente
  footer.style.removeProperty('z-index');
  
  // Usa setProperty con important per forzare l'applicazione
  footer.style.setProperty('z-index', newZIndex, 'important');
  
  // Forza un reflow per assicurarsi che lo stile venga applicato
  void footer.offsetHeight;
  
  // Verifica che sia stato applicato
  const inlineZIndex = footer.style.getPropertyValue('z-index');
  const inlineZIndexPriority = footer.style.getPropertyPriority('z-index');
  const computedZIndex = window.getComputedStyle(footer).zIndex;
  
  console.log('DOPO impostazione:');
  console.log('- Inline style (getPropertyValue):', inlineZIndex);
  console.log('- Inline style priority:', inlineZIndexPriority);
  console.log('- Computed:', computedZIndex);
  console.log('- newZIndex era:', newZIndex);
  
  // Se il computed è ancora 0, prova con un valore numerico diretto
  if (computedZIndex === '0' || computedZIndex === 'auto') {
    console.log('Tentativo con style.zIndex diretto...');
    footer.style.zIndex = parseInt(newZIndex);
    void footer.offsetHeight;
    const finalComputed = window.getComputedStyle(footer).zIndex;
    console.log('Dopo style.zIndex diretto - Computed:', finalComputed);
  }
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
  console.log('Inizializzazione footer z-index, DOM ready:', document.readyState);
  const footer = document.querySelector('.footer');
  console.log('Footer trovato:', !!footer);
  
  if (footer) {
    updateFooterZIndex();
    window.addEventListener('scroll', handleFooterZIndexUpdate, { passive: true });
    window.addEventListener('resize', handleFooterZIndexUpdate);
    console.log('Event listeners aggiunti per footer z-index');
  } else {
    console.log('Footer non trovato, riprovo tra 500ms...');
    setTimeout(initFooterZIndex, 500);
  }
}

if (document.readyState === 'loading') {
  console.log('DOM ancora in caricamento, aspetto DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', initFooterZIndex);
} else {
  console.log('DOM già pronto, inizializzo subito');
  initFooterZIndex();
}

// Reinizializza dopo le transizioni Barba
if (typeof barba !== 'undefined') {
  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      initFooterZIndex();
      loadFooter(); // Ricarica il footer dopo la transizione
    }, 200);
  });
}

// ============ Caricamento Footer Centralizzato ============
async function loadFooter() {
  // Cerca il placeholder del footer o un footer esistente
  const footerPlaceholder = document.querySelector('.footer-placeholder');
  const existingFooter = document.querySelector('.footer');
  
  // Se c'è già un footer caricato, non ricaricarlo
  if (existingFooter && existingFooter.dataset.loaded === 'true') {
    console.log('Footer già caricato, skip');
    return;
  }
  
  // Determina il path relativo al footer.html in base alla posizione della pagina
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/').filter(p => p && p !== 'index.html');
  const depth = pathParts.length;
  
  // Costruisci il path relativo
  let footerPath = 'footer.html';
  if (depth > 0) {
    footerPath = '../'.repeat(depth) + 'footer.html';
  }
  
  // Se siamo nella root o in index.html, usa path assoluto
  if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html') || pathParts.length === 0) {
    footerPath = '/footer.html';
  }
  
  console.log('Caricamento footer da:', footerPath, 'depth:', depth, 'pathParts:', pathParts);
  
  try {
    console.log('Tentativo di fetch footer da:', footerPath);
    const response = await fetch(footerPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const footerHTML = await response.text();
    console.log('Footer HTML ricevuto:', footerHTML.substring(0, 100));
    const parser = new DOMParser();
    const doc = parser.parseFromString(footerHTML, 'text/html');
    const footerElement = doc.querySelector('.footer');
    
    if (footerElement) {
      console.log('Footer element trovato, inserimento...');
      // Se c'è un placeholder, sostituiscilo
      if (footerPlaceholder) {
        footerPlaceholder.outerHTML = footerElement.outerHTML;
        console.log('Footer inserito tramite placeholder');
      } 
      // Altrimenti, se c'è un footer esistente, sostituiscilo
      else if (existingFooter) {
        existingFooter.outerHTML = footerElement.outerHTML;
        console.log('Footer sostituito');
      }
      // Altrimenti, aggiungi il footer dopo lo spacer
      else {
        const footerSpacer = document.querySelector('.footer-spacer');
        if (footerSpacer) {
          footerSpacer.insertAdjacentHTML('afterend', footerElement.outerHTML);
          console.log('Footer inserito dopo spacer');
        } else {
          document.body.insertAdjacentHTML('beforeend', footerElement.outerHTML);
          console.log('Footer inserito alla fine del body');
        }
      }
      
      // Marca il footer come caricato
      const newFooter = document.querySelector('.footer');
      if (newFooter) {
        newFooter.dataset.loaded = 'true';
        console.log('Footer marcato come caricato');
      }
      
      // Reinizializza il footer z-index dopo il caricamento
      setTimeout(() => {
        initFooterZIndex();
      }, 100);
    } else {
      console.warn('Footer element non trovato nel HTML caricato');
    }
  } catch (error) {
    // Se il fetch fallisce (es. file:// o CORS), inserisci il footer direttamente
    console.log('Footer non caricato dinamicamente, inserendo footer inline:', error);
    
    const footerHTML = `
      <footer class="footer">
        <div class="footer-content container">
          <div class="footer-contact">
            <a href="mailto:elenamauri32@gmail.com" class="footer-contact-item">elenamauri32@gmail.com</a>
            <a href="https://linkedin.com/in/elena-mauri1" class="footer-contact-item" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
      </footer>
    `;
    
    if (footerPlaceholder) {
      footerPlaceholder.outerHTML = footerHTML;
    } else if (existingFooter) {
      existingFooter.dataset.loaded = 'true';
    } else {
      const footerSpacer = document.querySelector('.footer-spacer');
      if (footerSpacer) {
        footerSpacer.insertAdjacentHTML('afterend', footerHTML);
      } else {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
      }
    }
    
    const newFooter = document.querySelector('.footer');
    if (newFooter) {
      newFooter.dataset.loaded = 'true';
      setTimeout(() => {
        initFooterZIndex();
      }, 100);
    }
  }
}

// Carica il footer quando la pagina è pronta
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFooter);
} else {
  loadFooter();
}
