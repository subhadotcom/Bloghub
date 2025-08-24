document.addEventListener('DOMContentLoaded', function() {
    console.log('Tilt effect initializing...');
    const cards = document.querySelectorAll('.post-card');
    console.log('Found post cards:', cards.length);
    
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    console.log('Touch device:', isTouchDevice);
    
    cards.forEach((card, index) => {
        // Set card delay for staggered animations
        card.style.setProperty('--card-delay', `${index * 0.15}s`);
        
        // Mouse events for desktop
        if (!isTouchDevice) {
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', resetCard);
            console.log(`Added mouse events to card ${index}`);
        }
        
        // Touch events for mobile/tablet
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
    });
    
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
        
        // Calculate tilt angles
        const rotateY = (x - centerX) / 20;
        const rotateX = (centerY - y) / 20;
        const scale = 1.02;
        
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
            console.log('Tilt applied:', { rotateX: rotateX.toFixed(2), rotateY: rotateY.toFixed(2), transform });
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
    
    console.log('Tilt effect initialization complete');
});
