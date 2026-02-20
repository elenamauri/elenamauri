document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('colored-text');
    if (!textElement) return;

    // 1. Aggiungi "(about me)" all'inizio con stile predefinito
    const aboutMeSpan = document.createElement('span');
    aboutMeSpan.className = 'about-me';
    aboutMeSpan.textContent = '(About Me) ';
    textElement.insertBefore(aboutMeSpan, textElement.firstChild);

    // 2. Prepara il testo e gli highlight
    const originalHTML = textElement.innerHTML;
    const withHighlights = originalHTML.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');
    textElement.innerHTML = withHighlights;

    // 3. Dividi tutto in caratteri (escludendo .about-me)
    const walker = document.createTreeWalker(textElement, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while(walker.nextNode()) {
        if (!walker.currentNode.parentNode.classList.contains('about-me')) {
            textNodes.push(walker.currentNode);
        }
    }

    textNodes.forEach(node => {
        const parent = node.parentNode;
        if (parent.classList.contains('highlight')) return;
        
        const chars = node.textContent.split('');
        chars.forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            parent.insertBefore(span, node);
        });
        parent.removeChild(node);
    });

    // 4. Dividi gli highlight in caratteri
    document.querySelectorAll('.highlight').forEach(hl => {
        const chars = hl.textContent.split('');
        hl.innerHTML = chars.map(c => `<span class="char highlight-char">${c}</span>`).join('');
    });

    // 5. Animazione ottimizzata
    const allChars = document.querySelectorAll('#colored-text .char');
    const totalChars = allChars.length;
    let lastScroll = window.scrollY;
    let ticking = false;

    function updateColors() {
        const {top, height} = textElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Range personalizzabile (60% - 20%)
        const visibleStart = windowHeight * 0.4;
        const visibleEnd = windowHeight * 0.1;
        
        // Calcolo progresso ottimizzato
        const progress = Math.min(1, Math.max(0, 
            (visibleStart - top) / (visibleStart - visibleEnd)
        ));
        
        // Applica l'animazione con requestAnimationFrame
        const charsToColor = Math.floor(progress * totalChars);
        
        allChars.forEach((char, index) => {
            const shouldColor = index < charsToColor;
            if (char.classList.contains('highlight-char')) {
                char.classList.toggle('highlight-colored', shouldColor);
            } else {
                char.classList.toggle('colored', shouldColor);
            }
        });
        
        ticking = false;
    }

    function handleScroll() {
        lastScroll = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateColors);
            ticking = true;
        }
    }

    // 6. Configurazione eventi
    window.addEventListener('scroll', handleScroll, {passive: true});
    updateColors(); // Inizializza
});