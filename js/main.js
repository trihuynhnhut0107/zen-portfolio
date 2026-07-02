document.addEventListener('DOMContentLoaded', () => {
    // Initialize Intersection Observer for Scroll Animations
    initScrollAnimations();
});

function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.section-title, .about-intro, .service-card, .showcase-card, .hlv-tl-item, .stat-item, .big-stat-item, .toc-item'
    );

    // Initial state setup
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                
                // Optional: add slight stagger if multiple elements enter at once
                // This would require more complex logic, but basic CSS transition works beautifully.
                
                observer.unobserve(el); // Only animate once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}
