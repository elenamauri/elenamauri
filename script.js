document.addEventListener('DOMContentLoaded', (event) => {
  const button = document.querySelector('.cv');

  button.addEventListener('mouseenter', () => {
    button.textContent = 'Download my CV!';
  });

  button.addEventListener('mouseleave', () => {
    button.textContent = 'Do you want to know more?';
  });
});
