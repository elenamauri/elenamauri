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
  var hoverTarget = document.querySelector('.hover-target');
  var imageSources = document.querySelectorAll('#hidden-images img');

  hoverTarget.addEventListener('mouseover', function() {
    // Estrai un'immagine casuale
    var randomIndex = Math.floor(Math.random() * imageSources.length);
    var randomImage = imageSources[randomIndex].src;

    // Imposta l'immagine come background del pseudo-elemento ::after
    this.style.setProperty('--hover-image', `url(${randomImage})`);
  });
});
