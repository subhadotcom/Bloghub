document.addEventListener('DOMContentLoaded', function() {
    console.log('Tilt effect initializing...');
    const cards = document.querySelectorAll('.post-card');
    console.log('Found post cards:', cards.length);
    
    // Enhanced device detection - only enable tilt on desktop/tablet, not mobile phones
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (navigator.maxTouchPoints > 0 && window.innerWidth <= 768);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const shouldEnableTilt = !isMobile && (window.innerWidth > 768);
    
    console.log('Device detection:', {
        userAgent: navigator.userAgent,
        maxTouchPoints: navigator.maxTouchPoints,
        innerWidth: window.innerWidth,
        isMobile: isMobile,
        isTouchDevice: isTouchDevice,
        shouldEnableTilt: shouldEnableTilt
    });
    
    cards.forEach((card, index) => {
        // Set card delay for staggered animations
        card.style.setProperty('--card-delay', `${index * 0.15}s`);
        
        // Only enable tilt effect on desktop/tablet (not mobile phones)
        if (shouldEnableTilt) {
            // Mouse events for desktop/tablet
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', resetCard);
            console.log(`Added tilt effect to card ${index} (desktop/tablet)`);
        } else {
            // For mobile devices, just add basic touch feedback without tilt
            card.addEventListener('touchstart', handleMobileTouch);
            card.addEventListener('touchend', handleMobileTouchEnd);
            console.log(`Added mobile touch feedback to card ${index} (no tilt)`);
        }
        
        // Touch events for mobile/tablet (but only basic functionality on mobile)
        if (isTouchDevice && !isMobile) {
            // Enhanced touch support for tablets (with tilt)
            card.addEventListener('touchmove', handleTouchMove, { passive: true });
            card.addEventListener('touchend', resetCard);
            card.addEventListener('touchcancel', resetCard);
            
            // Prevent card click when touch ends after tilting
            let touchMoved = false;
            card.addEventListener('touchstart', () => {
                touchMoved = false;
            });
            
            card.addEventListener('touchmove', () => {
                touchMoved = true;
            });
            
            card.addEventListener('touchend', (e) => {
                if (touchMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, { passive: false });
        }
    });
    
    // Mobile-specific touch handlers (no tilt, just feedback)
    function handleMobileTouch(e) {
        // Simple scale effect for mobile
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'transform 0.2s ease';
    }
    
    function handleMobileTouchEnd(e) {
        // Reset scale effect for mobile
        this.style.transform = 'scale(1)';
        this.style.transition = 'transform 0.2s ease';
    }
    
    function handleMouseMove(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update tilt effect
        updateTilt(this, x, y);
        
        // Update CSS custom properties for enhanced hover effects
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
        
        this.style.setProperty('--mouse-x', `${xPercent}%`);
        this.style.setProperty('--mouse-y', `${yPercent}%`);
        this.style.setProperty('--after-opacity', '1');
    }
    
    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = this.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            updateTilt(this, x, y);
        }
    }
    
    function updateTilt(card, x, y) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt angles with different intensities based on screen size
        const screenWidth = window.innerWidth;
        let tiltIntensity, scale;
        
        if (screenWidth <= 1024) {
            // Tablet - reduced intensity for better performance
            tiltIntensity = 30; // Less sensitive
            scale = 1.01; // Smaller scale
        } else {
            // Desktop - full intensity
            tiltIntensity = 20; // More sensitive
            scale = 1.02; // Larger scale
        }
        
        const rotateY = (x - centerX) / tiltIntensity;
        const rotateX = (centerY - y) / tiltIntensity;
        
        // Apply tilt effect with enhanced transform
        const transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
        
        // Use CSS custom properties for better control
        card.style.setProperty('--tilt-rotate-x', `${rotateX}deg`);
        card.style.setProperty('--tilt-rotate-y', `${rotateY}deg`);
        card.style.setProperty('--tilt-scale', scale);
        card.style.setProperty('--tilt-transform', transform);
        
        // Apply transform directly
        card.style.transform = transform;
        card.style.transition = 'transform 0.1s ease-out';
        
        // Add tilt-active class
        card.classList.add('tilt-active');
        
        // Debug log for first card only
        if (card === cards[0]) {
            console.log('Tilt applied:', { 
                rotateX: rotateX.toFixed(2), 
                rotateY: rotateY.toFixed(2), 
                transform,
                screenWidth,
                tiltIntensity,
                scale
            });
        }
    }
    
    function resetCard() {
        // Reset tilt effect
        const resetTransform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        
        // Reset CSS custom properties
        this.style.setProperty('--tilt-rotate-x', '0deg');
        this.style.setProperty('--tilt-rotate-y', '0deg');
        this.style.setProperty('--tilt-scale', '1');
        this.style.setProperty('--tilt-transform', resetTransform);
        
        // Apply reset transform
        this.style.transform = resetTransform;
        this.style.transition = 'transform 0.3s ease-out';
        
        // Remove tilt-active class
        this.classList.remove('tilt-active');
        
        // Reset CSS custom properties for enhanced hover effects
        this.style.setProperty('--after-opacity', '0');
    }
    
    console.log('Tilt effect initialization complete. Tilt enabled:', shouldEnableTilt);
    
    // Handle window resize to dynamically enable/disable tilt
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newWidth = window.innerWidth;
            const newShouldEnableTilt = !isMobile && (newWidth > 768);
            
            if (newShouldEnableTilt !== shouldEnableTilt) {
                console.log('Screen size changed, updating tilt effect. New width:', newWidth, 'Tilt enabled:', newShouldEnableTilt);
                // You could add logic here to reinitialize if needed
            }
        }, 250); // Debounce resize events
    });
});
