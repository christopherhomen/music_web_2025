// ==========================================
// TESTIMONIALS PREMIUM - APPLE INTERACTIONS
// ==========================================

// console.log('🚀 Testimonials Premium script starting...');
// console.log('Script loaded at:', new Date().toISOString());

// Variables globales
let currentSlide = 0;
let testimonials = [];
let isAnimating = false;
let autoPlayInterval = null;

// Función para inicializar los testimonios
function initTestimonials() {
    // Obtener elementos
    testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dots = document.querySelectorAll('.dot');
    
    // Configurar navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTestimonials('prev');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTestimonials('next');
        });
    }
    
    // Configurar dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(index);
        });
    });
    
    // Configurar hover effects
    testimonials.forEach((testimonial, index) => {
        setupTestimonialHover(testimonial, index);
    });
    
    // Inicializar estado
    updateTestimonialDisplay();
    
    // Iniciar autoplay
    startAutoPlay();
}

// Función para navegar testimonios
function navigateTestimonials(direction) {
    // console.log(`Navigating ${direction} from slide ${currentSlide}`);
    if (isAnimating) {
        // console.log('Animation in progress, skipping navigation');
        return;
    }
    
    if (direction === 'next') {
        currentSlide = (currentSlide + 1) % testimonials.length;
    } else {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
    }
    
    // console.log(`New currentSlide: ${currentSlide}`);
    updateTestimonialDisplay();
}

// Función para ir a un slide específico
function goToSlide(slideIndex) {
    if (isAnimating || slideIndex === currentSlide) return;
    
    // console.log(`Going to slide ${slideIndex}`);
    
    currentSlide = slideIndex;
    updateTestimonialDisplay();
}

// Función para actualizar la visualización
function updateTestimonialDisplay() {
    // console.log(`Updating display to slide ${currentSlide}`);
    isAnimating = true;
    
    // Remover clase active de todos los testimonios
    testimonials.forEach((testimonial, index) => {
        testimonial.classList.remove('active');
        
        // HABILITAR transiciones suaves
        testimonial.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // LIMPIAR estilos inline completamente y aplicar nuevos
        testimonial.style.cssText = 'opacity: 0 !important; visibility: hidden !important; transform: scale(0.8) translateX(100px) !important; z-index: 1 !important; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;';
        
        // console.log(`Removed active from testimonial ${index}`);
    });
    
    // Determinar cuántos testimonios mostrar según el tamaño de pantalla
    const screenWidth = window.innerWidth;
    let cardsToShow = 1;
    
    if (screenWidth >= 1600) {
        cardsToShow = 3;
    } else if (screenWidth >= 1200) {
        cardsToShow = 2;
    } else if (screenWidth >= 768) {
        cardsToShow = 1;
    } else {
        cardsToShow = 1; // Mobile siempre muestra 1
    }
    
    // console.log(`Screen width: ${screenWidth}, Cards to show: ${cardsToShow}`);
    
    // Calcular el índice de inicio
    let startIndex = currentSlide;
    if (currentSlide + cardsToShow > testimonials.length) {
        startIndex = testimonials.length - cardsToShow;
    }
    
    // Mostrar los testimonios activos
    for (let i = 0; i < cardsToShow; i++) {
        const index = (startIndex + i) % testimonials.length;
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
            
            // HABILITAR transiciones suaves
            testimonials[index].style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // LIMPIAR estilos inline completamente y aplicar nuevos
            testimonials[index].style.cssText = 'opacity: 1 !important; visibility: visible !important; transform: scale(1) translateX(0) !important; z-index: 10 !important; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;';
            
            // console.log(`Added active to testimonial ${index}`);
            
            // Debug: verificar que la clase se aplicó
            setTimeout(() => {
                const hasActive = testimonials[index].classList.contains('active');
                const computedStyle = window.getComputedStyle(testimonials[index]);
                // console.log(`Testimonial ${index} - Has active class: ${hasActive}`);
                // console.log(`Testimonial ${index} - Opacity: ${computedStyle.opacity}`);
                // console.log(`Testimonial ${index} - Visibility: ${computedStyle.visibility}`);
                // console.log(`Testimonial ${index} - Transform: ${computedStyle.transform}`);
                
                // Re-aplicar estilos después de un delay para asegurar que se mantengan
                setTimeout(() => {
                    if (testimonials[index].classList.contains('active')) {
                        testimonials[index].style.cssText = 'opacity: 1 !important; visibility: visible !important; transform: scale(1) translateX(0) !important; z-index: 10 !important; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;';
                        // console.log(`Re-applied styles to testimonial ${index}`);
                    }
                }, 100);
            }, 50);
        }
    }
    
    // Actualizar dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        const isActive = index === currentSlide;
        dot.classList.toggle('active', isActive);
        // console.log(`Dot ${index} active: ${isActive}`);
    });
    
    // Efecto de entrada
    setTimeout(() => {
        // console.log('Animation completed');
        isAnimating = false;
    }, 300);
}

// Función para configurar efectos hover
function setupTestimonialHover(testimonial, index) {
    testimonial.addEventListener('mouseenter', () => {
        if (!isAnimating) {
            testimonial.style.transform = 'translateY(-12px) scale(1.02)';
            testimonial.style.zIndex = '10';
        }
    });
    
    testimonial.addEventListener('mouseleave', () => {
        if (!isAnimating && !testimonial.classList.contains('active')) {
            testimonial.style.transform = 'translateY(0) scale(1)';
            testimonial.style.zIndex = '1';
        }
    });
}

// Función para autoplay
function startAutoPlay() {
    // console.log('Starting autoplay...');
    autoPlayInterval = setInterval(() => {
        // console.log('Autoplay tick - isAnimating:', isAnimating);
        if (!isAnimating) {
            // console.log('Autoplay: navigating to next slide');
            navigateTestimonials('next');
        } else {
            // console.log('Autoplay: skipping due to animation');
        }
    }, 5000); // Cambiar cada 5 segundos
    // console.log('Autoplay interval set:', autoPlayInterval);
}

// Función para pausar autoplay
function pauseAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        // console.log('Autoplay paused');
    }
}

// Función para reanudar autoplay
function resumeAutoPlay() {
    if (!autoPlayInterval) {
        startAutoPlay();
        // console.log('Autoplay resumed');
    }
}

// Función para agregar efectos de entrada
function initEntryAnimations() {
    // console.log('Initializing entry animations...');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }, {
        threshold: 0.1
    });
    
    testimonials.forEach(testimonial => {
        observer.observe(testimonial);
    });
}

// Función para agregar efectos de click
function initClickEffects() {
    // console.log('Initializing click effects...');
    
    testimonials.forEach(testimonial => {
        testimonial.addEventListener('click', () => {
            const index = Array.from(testimonials).indexOf(testimonial);
            goToSlide(index);
            
            // Efecto de ripple
            createRippleEffect(testimonial);
        });
    });
}

// Función para crear efecto ripple
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 127, 93, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1000;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Función para agregar efectos de partículas
function initParticleEffects() {
    // console.log('Initializing particle effects...');
    
    testimonials.forEach(testimonial => {
        const particles = testimonial.querySelector('.card-particles');
        if (particles) {
            // Crear partículas adicionales
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: rgba(255, 127, 93, 0.6);
                    border-radius: 50%;
                    animation: particleFloat ${3 + Math.random() * 2}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                `;
                
                particle.style.top = Math.random() * 100 + '%';
                particle.style.left = Math.random() * 100 + '%';
                
                particles.appendChild(particle);
            }
        }
    });
}

// Función para agregar efectos de sonido visual
function initVisualEffects() {
    // console.log('Initializing visual effects...');
    
    testimonials.forEach(testimonial => {
        // Efecto de brillo al hover
        testimonial.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1) saturate(1.2)';
        });
        
        testimonial.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1) saturate(1)';
        });
        
        // Efecto de vibración sutil al click
        testimonial.addEventListener('click', function() {
            this.style.animation = 'shake 0.3s ease-in-out';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
    
    // Agregar CSS para la animación de shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes particleFloat {
            0%, 100% {
                transform: translateY(0px) scale(1);
                opacity: 0.6;
            }
            50% {
                transform: translateY(-20px) scale(1.2);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Función para agregar efectos de teclado
function initKeyboardNavigation() {
    // console.log('Initializing keyboard navigation...');
    
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.testimonials-premium')) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateTestimonials('prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    navigateTestimonials('next');
                    break;
                case ' ':
                    e.preventDefault();
                    pauseAutoPlay();
                    setTimeout(resumeAutoPlay, 3000);
                    break;
            }
        }
    });
}

// Función para agregar efectos de touch
function initTouchEffects() {
    // console.log('Initializing touch effects...');
    
    let startX = 0;
    let startY = 0;
    
    testimonials.forEach(testimonial => {
        testimonial.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        testimonial.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Solo procesar si es un swipe horizontal
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    navigateTestimonials('next');
                } else {
                    navigateTestimonials('prev');
                }
            }
        });
    });
}

// Función para agregar efectos de carga
function initLoadingEffects() {
    // console.log('Initializing loading effects...');
    
    testimonials.forEach((testimonial, index) => {
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            testimonial.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            testimonial.style.opacity = '1';
            testimonial.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Función para agregar efectos de notificación (DESACTIVADA)
function initNotificationEffects() {
    // console.log('Notification effects disabled');
    // Notificaciones desactivadas para evitar spam visual
}

// Función para pausar autoplay al hover (DESACTIVADA)
function initHoverPause() {
    // console.log('Hover pause disabled - autoplay will continue');
    // Pausa al hover desactivada para mantener autoplay constante
}

// Función para manejar el redimensionamiento de la ventana
function initResizeHandler() {
    // console.log('Initializing resize handler...');
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateTestimonialDisplay();
        }, 250);
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // console.log('🎯 DOM loaded, initializing Testimonials Premium...');
    // console.log('DOM ready at:', new Date().toISOString());
    
    // Verificar que los elementos existan
    const testimonialsSection = document.querySelector('.testimonials-premium');
    // console.log('Found testimonials section:', testimonialsSection);
    
    if (!testimonialsSection) {
        console.error('❌ Testimonials section not found!');
        return;
    }
    
    // Esperar un poco para asegurar que todos los elementos estén listos
    setTimeout(() => {
        // console.log('⏰ Starting delayed initialization...');
        
        // Inicializar todas las funcionalidades
        initTestimonials();
        initEntryAnimations();
        initClickEffects();
        initParticleEffects();
        initVisualEffects();
        initKeyboardNavigation();
        initTouchEffects();
        initLoadingEffects();
        initNotificationEffects();
        initHoverPause();
        initResizeHandler();
        
        // console.log('✅ Testimonials Premium initialized successfully');
    }, 100);
});

// Función para reiniciar autoplay
function restartAutoPlay() {
    // console.log('Restarting autoplay...');
    pauseAutoPlay();
    setTimeout(() => {
        startAutoPlay();
    }, 100);
}

// Función para deshabilitar todas las transiciones CSS temporalmente
function disableAllTransitions() {
    const style = document.createElement('style');
    style.id = 'disable-transitions';
    style.textContent = `
        .testimonial-card * {
            transition: none !important;
            animation: none !important;
        }
        .testimonial-card {
            transition: none !important;
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
    // console.log('Disabled all transitions temporarily');
}

// Función para habilitar las transiciones CSS nuevamente
function enableAllTransitions() {
    const style = document.getElementById('disable-transitions');
    if (style) {
        style.remove();
        // console.log('Re-enabled transitions');
    }
}

// Función para forzar actualización visual
function forceVisualUpdate() {
    // console.log('Forcing visual update...');
    
    // Remover todas las clases active
    testimonials.forEach((testimonial, index) => {
        testimonial.classList.remove('active');
        
        // LIMPIAR estilos inline completamente y aplicar nuevos
        testimonial.style.cssText = 'opacity: 0 !important; visibility: hidden !important; transform: scale(0.8) translateX(100px) !important; z-index: 1 !important; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;';
        
        // console.log(`Forced inactive: testimonial ${index}`);
    });
    
    // Aplicar clase active al testimonio actual
    if (testimonials[currentSlide]) {
        testimonials[currentSlide].classList.add('active');
        
        // LIMPIAR estilos inline completamente y aplicar nuevos
        testimonials[currentSlide].style.cssText = 'opacity: 1 !important; visibility: visible !important; transform: scale(1) translateX(0) !important; z-index: 10 !important; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;';
        
        // console.log(`Forced active: testimonio ${currentSlide}`);
    }
    
    // Actualizar dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        const isActive = index === currentSlide;
        dot.classList.toggle('active', isActive);
    });
}

// Exportar funciones para uso externo
window.TestimonialsPremium = {
    init: initTestimonials,
    navigate: navigateTestimonials,
    goToSlide: goToSlide,
    pauseAutoPlay: pauseAutoPlay,
    resumeAutoPlay: resumeAutoPlay,
    restartAutoPlay: restartAutoPlay,
    forceVisualUpdate: forceVisualUpdate,
    disableAllTransitions: disableAllTransitions,
    enableAllTransitions: enableAllTransitions
};
