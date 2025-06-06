document.addEventListener('DOMContentLoaded', function() {
    const isMobile = () => window.innerWidth <= 768;

    // 1. Animate footer logo on scroll (mobile only)
    const footerLogo = document.querySelector('.footer .logo-flip-animation');
    if (footerLogo) {
        const logoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (isMobile() && entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        logoObserver.observe(footerLogo);
    }

    // 2. Animate footer widget titles on scroll (mobile only)
    const widgetTitles = document.querySelectorAll('.footer-widget-title');
    if (widgetTitles.length > 0) {
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (isMobile() && entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        widgetTitles.forEach(title => {
            titleObserver.observe(title);
        });
    }
}); 