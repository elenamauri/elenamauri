document.addEventListener('DOMContentLoaded', (event) => {
  const button = document.querySelector('.cv');

// Variabile per tracciare la slide corrente
let currentSlide = 0;

// Seleziona gli elementi necessari
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Funzione per spostare lo slider
function moveSlide(direction) {
    // Aggiorna l'indice della slide corrente
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

    // Applica lo spostamento
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Event listeners per i bottoni
document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));
document.querySelector('.next').addEventListener('click', () => moveSlide(1));
  
  
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

  const images = imageContainer.getElementsByTagName("img");


  function getRandomImage() {
    return images[Math.floor(Math.random() * images.length)];
  }

  drawElement.addEventListener("mouseenter", function() {
    console.log("Mouse enter event triggered");

    // Nascondi tutte le immagini
    for (let img of images) {
      img.style.display = "none";
    }

    // Mostra un'immagine casuale
    const randomImage = getRandomImage();
    randomImage.style.display = "block";
    console.log("Random image mostrata:", randomImage.src);

    // Mostra #imageContainer
    imageContainer.style.display = "flex";
    containerElement.style.display = "flex";
  });

  drawElement.addEventListener("mouseleave", function() {
    // Nascondi #imageContainer
    imageContainer.style.display = "none";
  });

});
