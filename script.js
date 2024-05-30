document.addEventListener('DOMContentLoaded', (event) => {
  const button = document.querySelector('.cv');

// Funzione per rilevare se il dispositivo è mobile
  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
  
 // Se è un dispositivo mobile, imposta il testo del pulsante
  if (isMobileDevice()) {
    button.textContent = 'Download my CV!';
    button.classList.add('mobile');
  } else {
    button.addEventListener('mouseenter', () => {
      button.textContent = 'Download my CV!';
    });

    button.addEventListener('mouseleave', () => {
      button.textContent = 'Do you want to know more?';
    });
  }

  // immagini casuali al passaggio del mouse
  document.addEventListener('DOMContentLoaded', (event) => {
  const hoverTarget = document.querySelector('.hover-target');
  const imageSources = document.querySelectorAll('#hidden-images img');

  if (hoverTarget && imageSources.length > 0) {
    hoverTarget.addEventListener('mouseover', function() {
      const randomIndex = Math.floor(Math.random() * imageSources.length);
      const randomImage = imageSources[randomIndex].src;
      this.style.setProperty('--hover-image', `url(${randomImage})`);
    });
  } else {
    console.error("Elementi non trovati o nessuna immagine disponibile");
  }
});

});
