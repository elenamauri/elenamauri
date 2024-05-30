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
    const hoverTarget = document.querySelector('.hover-target');
    const imageSources = document.querySelectorAll('#hidden-images img');

    // Verifica se l'elemento .hover-target esiste nel DOM
    if (hoverTarget && imageSources.length > 0) {
        // Aggiungi l'evento mouseover all'elemento .hover-target
        hoverTarget.addEventListener('mouseover', function() {
          console.log("Mouseover event triggered on .hover-target");
          const randomIndex = Math.floor(Math.random() * imageSources.length);
          const randomImage = imageSources[randomIndex].src;
          console.log(randomImage); // Controlla se l'immagine selezionata è corretta
    
          // Modifica direttamente il colore del testo dell'elemento .hover-target
          this.style.color = 'white'; // Cambia il colore del testo a rosso
        });
    
        // Ripristina il colore del testo quando il mouse esce dall'elemento .hover-target
        hoverTarget.addEventListener('mouseout', function() {
          this.style.color = ''; // Ripristina il colore del testo predefinito
        });
      } else {
        console.error("Elemento .hover-target non trovato nel DOM");
      }
    });
