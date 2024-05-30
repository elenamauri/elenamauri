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
  const imageContainer = document.getElementById("imageContainer");
  const drawElement = document.getElementById("hover-target");
  const containerElement = document.getElementById("container"); // Seleziona il nuovo contenitore

  const images = [
    "pablo.png",
    "ruby.jpg",
    "bacio.png",
    "amanda.png"
  ];

  function getRandomImage() {
    return images[Math.floor(Math.random() * images.length)];
  }

  // Aggiungi un gestore di eventi per l'entrata del mouse su #draw
  drawElement.addEventListener("mouseenter", function() {
    console.log("Mouse enter event triggered");
    const randomImage = getRandomImage();
    console.log("Random image selected:", randomImage);

    // Inserisci l'immagine all'interno di #imageContainer
    imageContainer.innerHTML = `<img src="${randomImage}" alt="Random Image">`;
    console.log("Random image mostrata:", randomImage);

    // Mostra #imageContainer
    imageContainer.style.display = "flex";
    containerElement.style.display = "flex";
  });

  // Aggiungi un gestore di eventi per l'uscita del mouse da #draw
  drawElement.addEventListener("mouseleave", function() {
    // Nascondi #imageContainer
    imageContainer.style.display = "none";
  });
});
