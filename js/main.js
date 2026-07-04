document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHeroParallax();
    initSideNavigation();
});

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-title, .about-intro, .service-card, .showcase-card, .hlv-tl-item, .stat-item, .big-stat-item, .toc-item, .project-item'
    );

    animatedElements.forEach(el => {
        // We use CSS classes for the animation now
        el.classList.add('reveal-hidden');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        // Group entries that are intersecting to stagger them
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        
        intersectingEntries.forEach((entry, index) => {
            const el = entry.target;
            // Add a slight delay based on index for stagger effect
            setTimeout(() => {
                el.classList.add('reveal-visible');
            }, index * 100); // 100ms stagger between elements entering at the same time
            
            observer.unobserve(el);
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function initHeroParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length === 0) return;
    
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth) - 0.5;
        const yPos = (clientY / window.innerHeight) - 0.5;
        
        parallaxLayers.forEach((layer) => {
            const speed = layer.getAttribute('data-speed') || 20;
            const xOffset = xPos * speed;
            const yOffset = yPos * speed;
            layer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}

function initSideNavigation() {
    const sections = document.querySelectorAll('section[id], .service-card[id], .showcase-card[id]');
    const sideNavItems = document.querySelectorAll('.side-nav-item');
    const sideNav = document.querySelector('.side-nav');
    
    if (sections.length === 0 || sideNavItems.length === 0 || !sideNav) return;

    // Calculate primary RGB once for comparison
    const tempEl = document.createElement('div');
    tempEl.style.backgroundColor = 'var(--clr-primary)';
    document.body.appendChild(tempEl);
    const primaryRgb = window.getComputedStyle(tempEl).backgroundColor;
    document.body.removeChild(tempEl);

    const observerOptions = {
        root: null,
        // Trigger when section is around the middle of the viewport
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const id = section.getAttribute('id');
                const closestSection = section.closest('section');
                const bgColor = window.getComputedStyle(closestSection || section).backgroundColor;
                
                if (bgColor === primaryRgb) {
                    sideNav.classList.add('on-primary-bg');
                } else {
                    sideNav.classList.remove('on-primary-bg');
                }
                
                sideNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                        
                        document.querySelectorAll('.side-nav-group').forEach(group => {
                            if (group.contains(item)) {
                                group.classList.add('expanded');
                            } else {
                                group.classList.remove('expanded');
                            }
                        });
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Smooth scrolling for side nav
    sideNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
