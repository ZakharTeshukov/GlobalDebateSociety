document.addEventListener('DOMContentLoaded', () => {
    const animatedLogos = document.querySelectorAll('.logo-flip-animation');

    animatedLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            if (!logo.classList.contains('play-animation')) {
                logo.classList.add('play-animation');
            }
        });

        const spans = logo.querySelectorAll('span');
        const lastSpan = spans[spans.length - 1];

        if (lastSpan) {
            lastSpan.addEventListener('animationend', () => {
                logo.classList.remove('play-animation');
            });
        }
    });
}); 