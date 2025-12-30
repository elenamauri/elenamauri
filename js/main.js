gsap.registerPlugin(ScrollTrigger);

// 1. Stato iniziale
let allowScroll = false;

// 2. Prepara elementi
gsap.set('.hero', { opacity: 1 });
gsap.set('.white-panel', { 
  opacity: 0,
  y: 0,
});
gsap.set('.sticky-name', { opacity: 1 }); // Visibile fin dall'inizio
gsap.set('.ux-label', { 
  opacity: 0,
  bottom: '200px', 
  right: '2rem'
});
// 3. Blocco scroll 
function manageScroll() {
  if (!allowScroll) {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  } else {
    document.body.style.overflow = '';
  }
}

// Applica subito il blocco
manageScroll();

// 4. Timeline animazioni
const timeline = gsap.timeline({
  onComplete: () => {
    allowScroll = true;
    manageScroll();
    document.querySelector('.loader').remove();
    
    // Inizializza Lenis solo ora
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
});

// 5. Sequenza animazioni
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
  .to('.loader', { opacity: 0, duration: 1 }, "+=0.5")
  .to('.ux-label', { opacity: 1, y: 0, duration: 0.5 }, "-=0.5")
  .to('.white-panel', {
    opacity: 1,
    y: -200,
    duration: 1,
    ease: 'power3.out',
    onStart: () => {
      // Aggiunge un leggero effetto di sfocatura all'hero
      gsap.to('.hero', { 
        filter: 'blur(5px)',
        duration: 1,
        ease: 'power2.inOut'
      });
    }
  }, "-=0.5")

// 6. Effetti di scroll
function initScrollEffects() {
  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);


  // UX Label che segue il pannello
  ScrollTrigger.create({
    trigger: ".white-panel",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      const panelRect = document.querySelector(".white-panel").getBoundingClientRect();
      const uxLabel = document.querySelector(".ux-label");
      const offsetY = panelRect.top - window.innerHeight + 50; // -50px rispetto al pannello
      
      gsap.to(uxLabel, {
        y: Math.min(0, offsetY),
        ease: "none"
      });
    }
  });

}


// 6. Controllo scroll durante il loader
window.addEventListener('scroll', () => {
  if (!allowScroll) {
    window.scrollTo(0, 0);
  }
});

// 7. Cleanup
window.addEventListener('beforeunload', () => {
  document.body.style.overflow = '';
});


