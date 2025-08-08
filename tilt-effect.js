document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.post-card');
    
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    cards.forEach(card => {
        // Mouse events for desktop
        if (!isTouchDevice) {
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', resetCard);
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
        updateTilt(this, x, y);
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
        
        const rotateY = (x - centerX) / 20;
        const rotateX = (centerY - y) / 20;
        const scale = 1.02;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
        card.style.transition = 'transform 0.1s ease-out';
    }
    
    function resetCard() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        this.style.transition = 'transform 0.3s ease-out';
    }
});
