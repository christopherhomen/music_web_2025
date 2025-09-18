/* ==========================================
   SERVICES PREMIUM JAVASCRIPT - APPLE STYLE
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initServicesPremium();
});

function initServicesPremium() {
    // console.log('🚀 Initializing Services Premium...');
    
    // Initialize card animations
    initCardAnimations();
    
    // Initialize intersection observer for animations
    initIntersectionObserver();
    
    // Initialize hover effects
    initHoverEffects();
    
    // Initialize stats counter animation
    initStatsCounter();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // console.log('✅ Services Premium initialized successfully');
}

function initCardAnimations() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach((card, index) => {
        // Stagger animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover sound effect (visual feedback)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Animate features list
            const features = this.querySelectorAll('.service-features li');
            features.forEach((feature, featureIndex) => {
                setTimeout(() => {
                    feature.style.transform = 'translateX(4px)';
                    feature.style.color = 'var(--services-text-primary)';
                }, featureIndex * 50);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            // Reset features list
            const features = this.querySelectorAll('.service-features li');
            features.forEach(feature => {
                feature.style.transform = 'translateX(0)';
                feature.style.color = 'var(--services-text-secondary)';
            });
        });
    });
    
    // console.log('✅ Card animations initialized');
}

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate service features
                if (entry.target.classList.contains('service-card')) {
                    const features = entry.target.querySelectorAll('.service-features li');
                    features.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.style.opacity = '1';
                            feature.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                }
                
                // Animate stats
                if (entry.target.classList.contains('stat-item')) {
                    animateStatNumber(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        observer.observe(card);
        
        // Initialize feature items
        const features = card.querySelectorAll('.service-features li');
        features.forEach(feature => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateX(-20px)';
            feature.style.transition = 'all 0.4s ease-out';
        });
    });
    
    // Observe stats
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach(stat => {
        observer.observe(stat);
    });
    
    // console.log('✅ Intersection observer initialized');
}

function initHoverEffects() {
    const buttons = document.querySelectorAll('.service-btn, .cta-btn');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add loading state for service buttons
        if (button.classList.contains('service-btn')) {
            button.addEventListener('click', function() {
                const originalText = this.querySelector('span').textContent;
                const svg = this.querySelector('svg');
                
                // Show loading state
                this.querySelector('span').textContent = 'Procesando...';
                svg.style.display = 'none';
                this.style.pointerEvents = 'none';
                
                // Reset after 2 seconds (simulate loading)
                setTimeout(() => {
                    this.querySelector('span').textContent = originalText;
                    svg.style.display = 'block';
                    this.style.pointerEvents = 'auto';
                }, 2000);
            });
        }
    });
    
    // console.log('✅ Hover effects initialized');
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        const suffix = stat.textContent.replace(/[\d]/g, '');
        
        if (target) {
            animateCounter(stat, 0, target, 2000, suffix);
        }
    });
    
    // console.log('✅ Stats counter initialized');
}

function animateCounter(element, start, end, duration, suffix) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateStatNumber(statElement) {
    const numberElement = statElement.querySelector('.stat-number');
    if (numberElement && !numberElement.classList.contains('animated')) {
        numberElement.classList.add('animated');
        
        const target = parseInt(numberElement.textContent.replace(/[^\d]/g, ''));
        const suffix = numberElement.textContent.replace(/[\d]/g, '');
        
        if (target) {
            animateCounter(numberElement, 0, target, 1500, suffix);
        }
    }
}

function initSmoothScrolling() {
    // Add smooth scrolling for anchor links
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
    
    // console.log('✅ Smooth scrolling initialized');
}

// Add CSS for ripple effect and animations
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: slide-in-up 0.6s ease-out;
    }
    
    @keyframes slide-in-up {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .service-card:hover .service-icon {
        animation: icon-bounce 0.6s ease-in-out;
    }
    
    @keyframes icon-bounce {
        0%, 100% { 
            transform: scale(1) rotate(0deg); 
        }
        50% { 
            transform: scale(1.1) rotate(5deg); 
        }
    }
    
    .stat-number.animated {
        animation: number-glow 0.5s ease-out;
    }
    
    @keyframes number-glow {
        0% {
            text-shadow: 0 0 0 rgba(0, 122, 255, 0.5);
        }
        50% {
            text-shadow: 0 0 20px rgba(0, 122, 255, 0.8);
        }
        100% {
            text-shadow: 0 0 0 rgba(0, 122, 255, 0.5);
        }
    }
`;
document.head.appendChild(style);

// Add performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations here if needed
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// console.log('🎨 Services Premium styles and interactions loaded');



