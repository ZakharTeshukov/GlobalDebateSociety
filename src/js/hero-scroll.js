document.addEventListener('DOMContentLoaded', () => {
    // For homepage hero
    const homeLearnMoreButton = document.getElementById('hero-learn-more-btn');
    const homeTargetSection = document.getElementById('features-section');

    if (homeLearnMoreButton && homeTargetSection) {
        homeLearnMoreButton.addEventListener('click', () => {
            homeTargetSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // For About page hero
    const aboutLearnMoreButton = document.getElementById('about-learn-more-btn');
    const aboutTargetSection = document.getElementById('about-page-content');

    if (aboutLearnMoreButton && aboutTargetSection) {
        aboutLearnMoreButton.addEventListener('click', () => {
            aboutTargetSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}); 