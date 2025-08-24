
// Modern UI enhancements
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollAnimations();
    initializeParallaxEffect();
    initializeSmoothScrolling();
    addLoadingAnimation();
    addBackgroundPatterns();
    initializeCardAnimations();
    initializeSearchEnhancements();
    addMicroInteractions();
});

// Enhanced search interactions with advanced features
function initializeSearchEnhancements() {
    const searchInput = document.getElementById('searchInput');
    let searchContainer = document.querySelector('.search-container');
    
    // Create search container if it doesn't exist
    if (!searchContainer && searchInput) {
        searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchInput.parentNode.insertBefore(searchContainer, searchInput);
        searchContainer.appendChild(searchInput);
        
        // Add search results container
        const searchResults = document.createElement('div');
        searchResults.id = 'searchResults';
        searchResults.style.display = 'none';
        searchContainer.appendChild(searchResults);
    }
    
    if (!searchInput || !searchContainer) return;
    
    // Enhanced search states with performance tracking
    searchInput.addEventListener('focus', () => {
        window.searchStartTime = performance.now();
        searchContainer.classList.add('search-focused');
        document.body.classList.add('search-active');
        
        // Add focus glow effect
        searchContainer.style.setProperty('--glow-intensity', '1');
    });
    
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            searchContainer.classList.remove('search-focused');
            document.body.classList.remove('search-active');
            searchContainer.style.setProperty('--glow-intensity', '0');
        }, 200);
    });
    
    // Enhanced typing animation with debouncing
    let typingTimeout;
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        searchContainer.classList.add('search-typing');
        clearTimeout(typingTimeout);
        clearTimeout(searchTimeout);
        
        // Visual feedback for typing
        const value = e.target.value;
        if (value.length > 0) {
            searchContainer.classList.add('has-content');
        } else {
            searchContainer.classList.remove('has-content');
        }
        
        // Debounced search with progressive disclosure
        searchTimeout = setTimeout(() => {
            if (value.length >= 2) {
                window.searchStartTime = performance.now();
            }
        }, 100);
        
        typingTimeout = setTimeout(() => {
            searchContainer.classList.remove('search-typing');
        }, 1000);
    });
    
    // Advanced keyboard shortcuts and navigation
    document.addEventListener('keydown', (e) => {
        // Global search shortcut
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
            return;
        }
        
        // Search results navigation
        if (document.activeElement === searchInput) {
            const results = document.querySelectorAll('.search-result-item[onclick]');
            const currentIndex = Array.from(results).findIndex(item => 
                item.classList.contains('keyboard-selected')
            );
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    navigateResults(results, currentIndex, 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    navigateResults(results, currentIndex, -1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    const selected = document.querySelector('.search-result-item.keyboard-selected');
                    if (selected && selected.onclick) {
                        selected.onclick();
                    } else if (results.length > 0) {
                        results[0].onclick();
                    }
                    break;
            }
        }
    });
    
    // Voice search support (if available)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        addVoiceSearchSupport(searchInput, searchContainer);
    }
}

function navigateResults(results, currentIndex, direction) {
    // Remove current selection
    results.forEach(item => item.classList.remove('keyboard-selected'));
    
    // Calculate new index
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = results.length - 1;
    if (newIndex >= results.length) newIndex = 0;
    
    // Add new selection
    if (results[newIndex]) {
        results[newIndex].classList.add('keyboard-selected');
        results[newIndex].scrollIntoView({ block: 'nearest' });
    }
}

function addVoiceSearchSupport(searchInput, searchContainer) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    // Add voice search button
    const voiceButton = document.createElement('button');
    voiceButton.innerHTML = '🎤';
    voiceButton.style.cssText = `
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s ease;
        z-index: 3;
    `;
    
    voiceButton.addEventListener('click', () => {
        recognition.start();
        voiceButton.style.color = '#4da6ff';
        searchContainer.classList.add('voice-active');
    });
    
    recognition.addEventListener('result', (e) => {
        const transcript = e.results[0][0].transcript;
        searchInput.value = transcript;
        searchInput.dispatchEvent(new Event('input'));
    });
    
    recognition.addEventListener('end', () => {
        voiceButton.style.color = '#888';
        searchContainer.classList.remove('voice-active');
    });
    
    searchContainer.appendChild(voiceButton);
}

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
        card.style.setProperty('--card-delay', `${index * 0.15}s`);
        
        // Add mouse tracking for enhanced hover effects
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
            card.style.setProperty('--after-opacity', '1');
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--after-opacity', '0');
        });
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
