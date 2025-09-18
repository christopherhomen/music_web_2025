/* ==========================================
   PRICING PREMIUM JAVASCRIPT - APPLE STYLE
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initPricingPremium();
});

function initPricingPremium() {
    // console.log('🚀 Initializing Pricing Premium...');
    
    // Initialize toggle functionality
    initPricingToggle();
    
    // Initialize card animations
    initCardAnimations();
    
    // Initialize intersection observer for animations
    initIntersectionObserver();
    
    // Initialize hover effects
    initHoverEffects();
    
    // console.log('✅ Pricing Premium initialized successfully');
}

function initPricingToggle() {
    const toggleInput = document.getElementById('pricing-toggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    const monthlyNotes = document.querySelectorAll('.monthly-note');
    const annualNotes = document.querySelectorAll('.annual-note');
    
    if (!toggleInput) {
        // console.log('⚠️ Pricing toggle not found');
        return;
    }
    
    // Toggle functionality
    toggleInput.addEventListener('change', function() {
        const isAnnual = this.checked;
        
        // Update labels
        toggleLabels.forEach(label => {
            if (label.textContent.includes('Mensual')) {
                label.classList.toggle('active', !isAnnual);
            } else if (label.textContent.includes('Anual')) {
                label.classList.toggle('active', isAnnual);
            }
        });
        
        // Update prices
        monthlyPrices.forEach(price => {
            price.style.display = isAnnual ? 'none' : 'inline';
        });
        
        annualPrices.forEach(price => {
            price.style.display = isAnnual ? 'inline' : 'none';
        });
        
        // Update notes
        monthlyNotes.forEach(note => {
            note.style.display = isAnnual ? 'none' : 'block';
        });
        
        annualNotes.forEach(note => {
            note.style.display = isAnnual ? 'block' : 'none';
        });
        
        // Add animation class
        const cards = document.querySelectorAll('.pricing-card');
        cards.forEach(card => {
            card.classList.add('price-changing');
            setTimeout(() => {
                card.classList.remove('price-changing');
            }, 300);
        });
        
        // console.log(`💰 Pricing switched to: ${isAnnual ? 'Annual' : 'Monthly'}`);
    });
    
    // Initialize with monthly view
    toggleLabels.forEach(label => {
        if (label.textContent.includes('Mensual')) {
            label.classList.add('active');
        }
    });
    
    // console.log('✅ Pricing toggle initialized');
}

function initCardAnimations() {
    const cards = document.querySelectorAll('.pricing-card');
    
    cards.forEach((card, index) => {
        // Stagger animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover sound effect (visual feedback)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
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
                
                // Animate features list
                const features = entry.target.querySelectorAll('.feature-item');
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.opacity = '1';
                        feature.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe pricing cards
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach(card => {
        observer.observe(card);
        
        // Initialize feature items
        const features = card.querySelectorAll('.feature-item');
        features.forEach(feature => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateX(-20px)';
            feature.style.transition = 'all 0.4s ease-out';
        });
    });
    
    // console.log('✅ Intersection observer initialized');
}

function initHoverEffects() {
    const buttons = document.querySelectorAll('.pricing-btn');
    
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
        
        // Add loading state
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
    });
    
    // console.log('✅ Hover effects initialized');
}

// Add CSS for ripple effect
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
    
    .price-changing {
        animation: price-change 0.3s ease-out;
    }
    
    @keyframes price-change {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
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
`;
document.head.appendChild(style);

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

// console.log('🎨 Pricing Premium styles and interactions loaded');



