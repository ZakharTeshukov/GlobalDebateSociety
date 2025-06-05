document.addEventListener('DOMContentLoaded', function() {
    // Animate hero content on page load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('animate');
        }, 100);
    }

    // Handle "Learn More" button click
    const learnMoreBtn = document.getElementById('about-learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            const aboutContent = document.getElementById('about-page-content');
            if (aboutContent) {
                aboutContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}); 