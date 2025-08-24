
// Modern UI enhancements
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollAnimations();
    initializeParallaxEffect();
    initializeSmoothScrolling();
    addLoadingAnimation();
    addBackgroundPatterns();
    initializeCardAnimations();
    // Removed initializeSearchEnhancements() to fix search functionality
    addMicroInteractions();
});

// Removed conflicting search functionality - search is handled by script.js

// Micro-interactions and enhanced animations
function addMicroInteractions() {
    // Add ripple effect to clickable elements
    document.addEventListener('click', (e) => {
        if (e.target.closest('.post-card, .search-result-item')) {
            createRippleEffect(e);
        }
    });
    
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.post-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            card.style.setProperty('--hover-intensity', '1');
            addGlowEffect(card);
        });
        
        card.addEventListener('mouseleave', (e) => {
            card.style.setProperty('--hover-intensity', '0');
            removeGlowEffect(card);
        });
    });
    
    // Add pulse effect to search when empty
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !searchInput.value.trim()) {
                searchInput.classList.add('pulse-error');
                setTimeout(() => {
                    searchInput.classList.remove('pulse-error');
                }, 600);
            }
        });
    }
}

function createRippleEffect(e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(77, 166, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
        z-index: 1;
    `;
    
    e.currentTarget.style.position = 'relative';
    e.currentTarget.style.overflow = 'hidden';
    e.currentTarget.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

function addGlowEffect(element) {
    element.style.boxShadow = '0 20px 40px rgba(77, 166, 255, 0.15), 0 0 0 1px rgba(77, 166, 255, 0.1)';
}

function removeGlowEffect(element) {
    element.style.boxShadow = '';
}

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.post-card, .post-info, .post-body');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Subtle parallax effect for header
function initializeParallaxEffect() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled > 0) {
            header.style.transform = `translateY(${rate}px)`;
            header.style.opacity = Math.max(0.8, 1 - scrolled / 400);
        } else {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
        }
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Page loading animation
function addLoadingAnimation() {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            body.style.opacity = '1';
        }, 100);
    });
}

// Add dynamic background patterns
function addBackgroundPatterns() {
    const patterns = document.createElement('div');
    patterns.className = 'bg-patterns';
    patterns.innerHTML = `
        <div class="pattern-circle pattern-1"></div>
        <div class="pattern-circle pattern-2"></div>
        <div class="pattern-circle pattern-3"></div>
    `;
    document.body.appendChild(patterns);
}

// Cursor trail effect (optional)
function initializeCursorTrail() {
    const trail = [];
    const trailLength = 5;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(77, 166, 255, ${0.8 - i * 0.15});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    document.addEventListener('mousemove', (e) => {
        trail.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.left = e.clientX + 'px';
                dot.style.top = e.clientY + 'px';
            }, index * 50);
        });
    });
}

// Text reveal animation
function addTextRevealAnimation() {
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    textElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = text.split('').map((char, index) => 
            `<span style="animation-delay: ${index * 0.05}s" class="char-reveal">${char}</span>`
        ).join('');
    });
}

// Initialize card animations
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach((card, index) => {
        // Card delay is now handled by tilt-effect.js
        // Removed conflicting mouse tracking code
    });
}

// Enhanced scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.post-card, .post-info, .post-body, h1, h2');
    elementsToAnimate.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Enhanced background patterns
function addBackgroundPatterns() {
    if (document.querySelector('.bg-patterns')) return;
    
    const patterns = document.createElement('div');
    patterns.className = 'bg-patterns';
    patterns.innerHTML = `
        <div class="pattern-circle pattern-1"></div>
        <div class="pattern-circle pattern-2"></div>
        <div class="pattern-circle pattern-3"></div>
    `;
    document.body.appendChild(patterns);
}

// Initialize optional features
document.addEventListener('DOMContentLoaded', () => {
    // Enable cursor trail on desktop only
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        initializeCursorTrail();
    }
});
