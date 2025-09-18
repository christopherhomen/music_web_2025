// ==========================================
// FLOATING BUTTONS - APPLE PREMIUM INTERACTIONS
// ==========================================

// console.log('Floating Buttons script starting...');

// Función para inicializar los botones flotantes
function initFloatingButtons() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    
    // console.log('Initializing floating buttons...');
    
    // Inicializar botón de WhatsApp
    if (whatsappBtn) {
        initWhatsAppButton(whatsappBtn);
        // console.log('WhatsApp button initialized');
    }
    
    // Inicializar botón de Back to Top
    if (backToTopBtn) {
        initBackToTopButton(backToTopBtn);
        // console.log('Back to Top button initialized');
    }
    
    // console.log('All floating buttons initialized successfully');
}

// Función para inicializar el botón de WhatsApp
function initWhatsAppButton(button) {
    // Agregar efectos de hover
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 15px 35px rgba(37, 211, 102, 0.5), 0 0 0 8px rgba(37, 211, 102, 0.2)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4), 0 0 0 4px rgba(37, 211, 102, 0.1)';
    });
    
    // Efecto de click
    button.addEventListener('click', function(e) {
        createRippleEffect(this, e);
        addClickAnimation(this);
    });
    
    // Efecto de pulso más rápido al hover
    button.addEventListener('mouseenter', function() {
        const pulse = this.querySelector('.btn-pulse');
        if (pulse) {
            pulse.style.animationDuration = '1s';
        }
    });
    
    button.addEventListener('mouseleave', function() {
        const pulse = this.querySelector('.btn-pulse');
        if (pulse) {
            pulse.style.animationDuration = '2s';
        }
    });
}

// Función para inicializar el botón de Back to Top
function initBackToTopButton(button) {
    // Mostrar/ocultar botón basado en scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
    
    // Funcionalidad de scroll suave
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Agregar efecto de ripple
        createRippleEffect(this, e);
        
        // Scroll suave hacia arriba
        smoothScrollToTop();
        
        // Agregar animación de click
        addClickAnimation(this);
    });
    
    // Efectos de hover
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 15px 35px rgba(255, 127, 93, 0.5), 0 0 0 8px rgba(255, 127, 93, 0.2)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 8px 25px rgba(255, 127, 93, 0.4), 0 0 0 4px rgba(255, 127, 93, 0.1)';
    });
}

// Función para crear efecto de ripple
function createRippleEffect(button, event) {
    const ripple = button.querySelector('.btn-ripple');
    if (!ripple) return;
    
    // Resetear animación
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.opacity = '1';
    
    // Iniciar animación
    setTimeout(() => {
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.opacity = '0';
    }, 10);
}

// Función para agregar animación de click
function addClickAnimation(button) {
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1.1)';
    }, 100);
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// Función para pausar animaciones durante el scroll
function pauseAnimationsDuringScroll() {
    // console.log('⏸️ Pausando animaciones durante scroll...');
    
    // Pausar animaciones CSS
    const style = document.createElement('style');
    style.id = 'scroll-pause-styles';
    style.textContent = `
        * {
            animation-play-state: paused !important;
            transition: none !important;
        }
        .floating-btn {
            animation-play-state: running !important;
        }
    `;
    document.head.appendChild(style);
    
    return style;
}

// Función para reanudar animaciones después del scroll
function resumeAnimationsAfterScroll() {
    // console.log('▶️ Reanudando animaciones después del scroll...');
    
    const pauseStyle = document.getElementById('scroll-pause-styles');
    if (pauseStyle) {
        pauseStyle.remove();
    }
}

// Función para scroll suave hacia arriba
function smoothScrollToTop() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // console.log('🚀 Iniciando scroll suave desde:', scrollTop, 'px');
    
    const duration = 800; // Duración en ms
    const startTime = performance.now();
    let frameCount = 0;
    
    // Pausar animaciones durante el scroll
    const pauseStyle = pauseAnimationsDuringScroll();
    
    // Función de easing para suavizar el scroll
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function scrollStepFunction(currentTime) {
        frameCount++;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Usar easing para suavizar el movimiento
        const easedProgress = easeInOutCubic(progress);
        const currentScroll = scrollTop * (1 - easedProgress);
        
        // Debug cada 20 frames para no saturar la consola
        if (frameCount % 20 === 0) {
            // console.log(`📊 Frame ${frameCount}: Progress: ${(progress * 100).toFixed(1)}%, Scroll: ${currentScroll.toFixed(0)}px`);
        }
        
        // Scroll suave usando scrollTo en lugar de scrollBy
        window.scrollTo(0, currentScroll);
        
        if (progress < 1) {
            requestAnimationFrame(scrollStepFunction);
        } else {
            // console.log('✅ Scroll completado en', frameCount, 'frames');
            // Asegurar que llegamos exactamente al top
            window.scrollTo(0, 0);
            
            // Reanudar animaciones después de un pequeño delay
            setTimeout(() => {
                resumeAnimationsAfterScroll();
            }, 100);
        }
    }
    
    requestAnimationFrame(scrollStepFunction);
}

// Función para agregar efectos de entrada
function initEntryAnimations() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    
    // Animación de entrada para WhatsApp
    if (whatsappBtn) {
        whatsappBtn.style.opacity = '0';
        whatsappBtn.style.transform = 'scale(0.8) translateY(20px)';
        whatsappBtn.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            whatsappBtn.style.opacity = '1';
            whatsappBtn.style.transform = 'scale(1) translateY(0)';
        }, 500);
    }
    
    // Animación de entrada para Back to Top (cuando sea visible)
    if (backToTopBtn) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                }
            });
        });
        
        observer.observe(backToTopBtn);
    }
}

// Función para agregar efectos de sonido visual
function initVisualEffects() {
    const buttons = document.querySelectorAll('.floating-btn');
    
    buttons.forEach(button => {
        // Efecto de brillo al hover
        button.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1) saturate(1.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1) saturate(1)';
        });
        
        // Efecto de vibración sutil al click
        button.addEventListener('click', function() {
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
    `;
    document.head.appendChild(style);
}

// Función para agregar efectos de partículas
function initParticleEffects() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (!whatsappBtn) return;
    
    // Crear partículas flotantes alrededor del botón de WhatsApp
    function createFloatingParticles() {
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(37, 211, 102, 0.6);
                border-radius: 50%;
                pointer-events: none;
                animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            // Posicionar partícula alrededor del botón
            const angle = (i / particleCount) * 2 * Math.PI;
            const radius = 80 + Math.random() * 20;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            particle.style.left = `calc(50% + ${x}px)`;
            particle.style.top = `calc(50% + ${y}px)`;
            
            whatsappBtn.appendChild(particle);
        }
    }
    
    createFloatingParticles();
    
    // Agregar CSS para la animación de float
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
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

// Función para agregar efectos de tooltip mejorados
function initTooltipEffects() {
    const buttons = document.querySelectorAll('.floating-btn');
    
    buttons.forEach(button => {
        const tooltip = button.querySelector('.btn-tooltip');
        
        if (tooltip) {
            // Efecto de entrada del tooltip
            button.addEventListener('mouseenter', function() {
                tooltip.style.transform = 'translateY(-50%) translateX(-5px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', function() {
                tooltip.style.transform = 'translateY(-50%) translateX(0) scale(1)';
            });
        }
    });
}

// Función para agregar efectos de carga
function initLoadingEffects() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (!whatsappBtn) return;
    
    whatsappBtn.addEventListener('click', function() {
        // Agregar estado de carga
        this.classList.add('loading');
        
        // Simular carga (en caso de que el enlace tarde en abrir)
        setTimeout(() => {
            this.classList.remove('loading');
        }, 1000);
    });
}

// Función para agregar efectos de notificación
function initNotificationEffects() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (!whatsappBtn) return;
    
    // Crear notificación de "mensaje enviado"
    function showNotification() {
        const notification = document.createElement('div');
        notification.className = 'floating-notification';
        notification.textContent = '¡Redirigiendo a WhatsApp...';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(37, 211, 102, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 0.9em;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animar salida
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
    
    whatsappBtn.addEventListener('click', showNotification);
}

// Función para detectar scripts que pueden interferir con el scroll
function detectScrollInterference() {
    console.log('🔍 Detectando posibles interferencias de scroll...');
    
    // Detectar event listeners de scroll
    const scrollElements = [];
    
    // Buscar elementos con animaciones CSS que se activen con scroll
    const animatedElements = document.querySelectorAll('[class*="animate"], [class*="fade"], [class*="slide"]');
    console.log('📊 Elementos con animaciones CSS encontrados:', animatedElements.length);
    
    // Buscar scripts que puedan estar escuchando scroll
    const scripts = document.querySelectorAll('script[src]');
    console.log('📊 Scripts externos cargados:', scripts.length);
    
    scripts.forEach(script => {
        if (script.src.includes('main.js') || script.src.includes('scroll') || script.src.includes('animate')) {
            console.log('⚠️ Script potencialmente problemático:', script.src);
        }
    });
    
    // Detectar elementos con position: sticky o fixed
    const stickyElements = document.querySelectorAll('[style*="position: sticky"], [style*="position: fixed"]');
    console.log('📊 Elementos sticky/fixed encontrados:', stickyElements.length);
    
    // Detectar elementos con transform
    const transformElements = document.querySelectorAll('[style*="transform"]');
    console.log('📊 Elementos con transform encontrados:', transformElements.length);
    
    // Detectar elementos con Intersection Observer (pueden causar problemas)
    const observerElements = document.querySelectorAll('[data-aos], [data-animate], [class*="aos-"]');
    console.log('📊 Elementos con Intersection Observer encontrados:', observerElements.length);
    
    // Detectar elementos con scroll-triggered animations
    const scrollTriggeredElements = document.querySelectorAll('[class*="scroll"], [class*="parallax"]');
    console.log('📊 Elementos con scroll-triggered animations:', scrollTriggeredElements.length);
    
    // Detectar elementos con will-change (pueden causar problemas de performance)
    const willChangeElements = document.querySelectorAll('[style*="will-change"]');
    console.log('📊 Elementos con will-change encontrados:', willChangeElements.length);
    
    // Detectar elementos con transform3d o perspective
    const transform3dElements = document.querySelectorAll('[style*="transform3d"], [style*="perspective"]');
    console.log('📊 Elementos con transform3d/perspective encontrados:', transform3dElements.length);
}

// Función para monitorear el performance durante el scroll (DESACTIVADA PARA OPTIMIZACIÓN)
function monitorScrollPerformance() {
    console.log('Performance monitoring disabled for optimization');
    // Comentado para evitar frames lentos
    /*
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFrame() {
        frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        
        // Si el frame toma más de 16ms (60fps), hay problemas de performance
        if (deltaTime > 16) {
            console.warn(`⚠️ Frame ${frameCount} tardó ${deltaTime.toFixed(2)}ms (debería ser <16ms)`);
        }
        
        lastTime = currentTime;
        requestAnimationFrame(measureFrame);
    }
    
    requestAnimationFrame(measureFrame);
    */
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Floating Buttons...');
    
    // Detectar interferencias antes de inicializar
    detectScrollInterference();
    
    // Inicializar monitoreo de performance
    monitorScrollPerformance();
    
    // Inicializar todas las funcionalidades
    initFloatingButtons();
    initEntryAnimations();
    initVisualEffects();
    initParticleEffects();
    initTooltipEffects();
    initLoadingEffects();
    initNotificationEffects();
    
    console.log('Floating Buttons initialized successfully');
});

// Exportar funciones para uso externo
window.FloatingButtons = {
    init: initFloatingButtons,
    smoothScroll: smoothScrollToTop,
    createRipple: createRippleEffect
};
