import { Overlay } from './overlay.js';

const overlayEl = document.querySelector('.overlay');
const overlay = new Overlay(overlayEl, {
    rows: 9,
    columns: 17
});

let isAnimating = false;

// Seleziona tutti i div work-item che triggerano l'overlay
const workItems = document.querySelectorAll('.work-item');

// Seleziona tutti i contenuti da mostrare
const contentElements = [...document.querySelectorAll('.content-wrap > .content')];

workItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        // Mostra overlay
        overlay.show({
            duration: 0.25,
            ease: 'power1.in',
            stagger: {
                grid: [overlay.options.rows, overlay.options.columns],
                from: 'edges',
                each: 0.025
            }
        })
        .then(() => {
            // Mostra il contenuto relativo
            contentElements[index].classList.add('content--open');

            // Nascondi overlay
            overlay.hide({
                duration: 0.25,
                ease: 'power1',
                stagger: {
                    grid: [overlay.options.rows, overlay.options.columns],
                    from: 'center',
                    each: 0.025
                }
            }).then(() => isAnimating = false);

            // Animazione dell'immagine all’interno del contenuto
            const img = contentElements[index].querySelector('.content__img');
            if (img) {
                gsap.fromTo(img, { scale: 0.5, opacity: 0 }, { duration: 0.8, scale: 1, opacity: 1, ease: 'power4' });
            }
        });
    });
});

// Bottoni per tornare indietro
contentElements.forEach((content, index) => {
    const backBtn = content.querySelector('.content__back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            // Animazione immagine contenuto
            const img = content.querySelector('.content__img');
            if (img) {
                gsap.to(img, { duration: 0.7, scale: 0.75, opacity: 0, ease: 'power2.in' });
            }

            // Mostra overlay
            overlay.show({
                duration: 0.25,
                ease: 'power1.in',
                stagger: {
                    grid: [overlay.options.rows, overlay.options.columns],
                    from: 'edges',
                    each: 0.025
                }
            })
            .then(() => {
                // Nascondi contenuto
                content.classList.remove('content--open');

                // Nascondi overlay
                overlay.hide({
                    duration: 0.25,
                    ease: 'power1',
                    stagger: {
                        grid: [overlay.options.rows, overlay.options.columns],
                        from: 'center',
                        each: 0.025
                    }
                }).then(() => isAnimating = false);
            });
        });
    }
});
