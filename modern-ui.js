
// Enhanced Modern UI enhancements
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollAnimations();
    initializeParallaxEffect();
    initializeSmoothScrolling();
    addLoadingAnimation();
    addBackgroundPatterns();
    initializeCardAnimations();
    addMicroInteractions();
    initializeModernAnimations();
    addFloatingElements();
    initializeThemeEnhancements();
});

// Removed conflicting search functionality - search is handled by script.js

// Enhanced Micro-interactions and animations
function addMicroInteractions() {
    // Add ripple effect to clickable elements
    document.addEventListener('click', (e) => {
        if (e.target.closest('.post-card, .search-result-item, .share-btn, .back-button')) {
            createRippleEffect(e);
        }
    });
    
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.post-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            card.style.setProperty('--hover-intensity', '1');
            addGlowEffect(card);
            addFloatingParticles(card);
        });
        
        card.addEventListener('mouseleave', (e) => {
            card.style.setProperty('--hover-intensity', '0');
            removeGlowEffect(card);
        });
    });
    
    // Enhanced search interactions (temporarily disabled for debugging)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        console.log('Modern UI: Found search input, adding visual enhancements only');
        // Only add visual enhancements, don't interfere with search logic
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !searchInput.value.trim()) {
                searchInput.classList.add('pulse-error');
                setTimeout(() => {
                    searchInput.classList.remove('pulse-error');
                }, 600);
            }
        });
        
        // Add typing animation (visual only) - disabled to avoid conflicts
        // searchInput.addEventListener('input', (e) => {
        //     if (e.target.value.length > 0) {
        //         e.target.classList.add('typing');
        //     } else {
        //         e.target.classList.remove('typing');
        //     }
        // });
    }
    
    // Add smooth scroll to all internal links
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

// Add floating particles on hover
function addFloatingParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 3;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #6366f1, #10b981);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: floatAway 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
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

// Modern animation enhancements
function initializeModernAnimations() {
    // Add staggered animations to cards
    const cards = document.querySelectorAll('.post-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-in');
    });
    
    // Add typing effect to titles
    const titles = document.querySelectorAll('h1, h2');
    titles.forEach(title => {
        if (title.textContent.length > 0) {
            addTypingEffect(title);
        }
    });
}

// Floating elements for visual interest
function addFloatingElements() {
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    floatingContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    // Create floating particles
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: linear-gradient(45deg, #6366f1, #10b981);
            border-radius: 50%;
            opacity: 0.3;
            animation: float ${Math.random() * 20 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        floatingContainer.appendChild(particle);
    }
    
    document.body.appendChild(floatingContainer);
}

// Theme enhancements
function initializeThemeEnhancements() {
    // Add dynamic color shifting
    const root = document.documentElement;
    let hue = 0;
    
    setInterval(() => {
        hue = (hue + 0.5) % 360;
        root.style.setProperty('--dynamic-hue', hue);
    }, 100);
    
    // Add smooth transitions to all elements
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Typing effect for titles
function addTypingEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid #6366f1';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            element.style.borderRight = 'none';
        }
    };
    
    setTimeout(typeWriter, 500);
}

// Initialize optional features
document.addEventListener('DOMContentLoaded', () => {
    // Enable cursor trail on desktop only
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        initializeCursorTrail();
    }
});
