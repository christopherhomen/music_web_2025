// ==========================================
// FOOTER PREMIUM - APPLE STYLE INTERACTIONS
// ==========================================

// console.log('Footer Premium script starting...');

// Función para inicializar efectos del footer
function initFooterEffects() {
    const footer = document.querySelector('.footer-premium');
    
    if (!footer) {
        // console.log('Footer not found');
        return;
    }
    
    // console.log('Footer found, initializing effects...');
    
    // Inicializar efectos
    initScrollEffects();
    initHoverEffects();
    initParticleEffects();
    initSocialMediaEffects();
    initWhatsAppEffects();
    
    // console.log('Footer effects initialized successfully');
}

// Efectos de scroll
function initScrollEffects() {
    const footer = document.querySelector('.footer-premium');
    const footerContent = document.querySelector('.footer-content');
    
    if (!footer || !footerContent) return;
    
    // Crear intersection observer para animaciones de entrada
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateFooterElements();
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(footer);
}

// Animar elementos del footer
function animateFooterElements() {
    const sections = document.querySelectorAll('.footer-section');
    const header = document.querySelector('.footer-header');
    
    // Animar header
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(30px)';
        header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animar secciones con delay escalonado
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        section.style.transitionDelay = (index * 0.1) + 's';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

// Efectos de hover mejorados
function initHoverEffects() {
    const footerLinks = document.querySelectorAll('.footer-links a');
    const contactItems = document.querySelectorAll('.contact-item');
    
    // Efectos en enlaces del footer
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Efectos en elementos de contacto
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Efectos de partículas dinámicas
function initParticleEffects() {
    const footerParticles = document.querySelector('.footer-particles');
    
    if (!footerParticles) return;
    
    // Crear partículas adicionales dinámicas
    function createDynamicParticles() {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'dynamic-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 127, 93, 0.3);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${10 + Math.random() * 20}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            footerParticles.appendChild(particle);
        }
    }
    
    createDynamicParticles();
}

// Efectos en redes sociales
function initSocialMediaEffects() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        const icon = link.querySelector('i');
        
        if (icon) {
            link.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            });
            
            link.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    });
}

// Efectos del botón de WhatsApp
function initWhatsAppEffects() {
    const whatsappBtn = document.querySelector('.whatsapp-premium');
    
    if (!whatsappBtn) return;
    
    // Efecto de pulso adicional al hover
    whatsappBtn.addEventListener('mouseenter', function() {
        const pulse = this.querySelector('.whatsapp-pulse');
        if (pulse) {
            pulse.style.animationDuration = '1s';
        }
    });
    
    whatsappBtn.addEventListener('mouseleave', function() {
        const pulse = this.querySelector('.whatsapp-pulse');
        if (pulse) {
            pulse.style.animationDuration = '2s';
        }
    });
    
    // Efecto de click
    whatsappBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1.1)';
        }, 100);
    });
}

// Función para agregar efectos de parallax sutil
function initParallaxEffects() {
    const footer = document.querySelector('.footer-premium');
    const footerGradient = document.querySelector('.footer-gradient');
    
    if (!footer || !footerGradient) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        footerGradient.style.transform = `translateY(${rate}px)`;
    });
}

// Función para agregar efectos de typing en el título
function initTypingEffect() {
    const footerTitle = document.querySelector('.footer-title');
    
    if (!footerTitle) return;
    
    const text = footerTitle.textContent;
    footerTitle.textContent = '';
    footerTitle.style.borderRight = '2px solid #ff7f5d';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            footerTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                footerTitle.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    // Iniciar efecto cuando el footer sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeWriter, 500);
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(footerTitle);
}

// Función para agregar efectos de brillo en elementos
function initGlowEffects() {
    const footerTitle = document.querySelector('.footer-title');
    const footerSections = document.querySelectorAll('.footer-section-title');
    
    // Efecto de brillo en el título
    if (footerTitle) {
        footerTitle.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px rgba(255, 127, 93, 0.5)';
        });
        
        footerTitle.addEventListener('mouseleave', function() {
            this.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        });
    }
    
    // Efecto de brillo en títulos de sección
    footerSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 15px rgba(255, 127, 93, 0.4)';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
}

// Función para agregar efectos de sonido visual
function initVisualSoundEffects() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Crear efecto de ondas
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 127, 93, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Agregar CSS para la animación de ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM loaded, initializing Footer Premium...');
    
    // Inicializar todos los efectos
    initFooterEffects();
    initParallaxEffects();
    initTypingEffect();
    initGlowEffects();
    initVisualSoundEffects();
    
    // console.log('Footer Premium initialized successfully');
});

// Exportar funciones para uso externo
window.FooterPremium = {
    init: initFooterEffects,
    animate: animateFooterElements,
    parallax: initParallaxEffects
};
