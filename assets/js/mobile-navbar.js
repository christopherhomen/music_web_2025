/**
 * ==========================================
 * MOBILE NAVBAR FUNCTIONALITY
 * JavaScript para el navbar móvil del index.html
 * ==========================================
 */

class MobileNavbar {
    constructor() {
        this.navbar = null;
        this.overlay = null;
        this.toggle = null;
        this.closeBtn = null;
        this.dropdowns = [];
        this.isOpen = false;
        this.currentSection = 'hero';
        
        this.init();
    }

    /**
     * Inicializar el navbar móvil
     */
    init() {
        console.log('🚀 Inicializando Mobile Navbar...');
        this.createNavbar();
        this.createOverlay();
        this.bindEvents();
        this.setupScrollSpy();
        this.setupKeyboardNavigation();
        console.log('✅ Mobile Navbar inicializado correctamente');
    }

    /**
     * Crear la estructura del navbar móvil
     */
    createNavbar() {
        // Crear overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-navbar__overlay';
        document.body.appendChild(this.overlay);

        // Crear navbar
        this.navbar = document.createElement('div');
        this.navbar.className = 'mobile-navbar';
        this.navbar.innerHTML = `
            <div class="mobile-navbar__header">
                <a href="#hero" class="mobile-navbar__logo">
                    <img src="assets/img/logo/logo3.png" alt="Performance Radio">
                    <span>Performance Radio</span>
                </a>
                <button class="mobile-navbar__close" aria-label="Cerrar menú">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            
            <ul class="mobile-navbar__menu">
                <li class="mobile-navbar__item">
                    <a href="#hero" class="mobile-navbar__link active" data-section="hero">
                        <span>Inicio</span>
                        <i class="bi bi-house"></i>
                    </a>
                </li>
                <li class="mobile-navbar__item">
                    <a href="#about" class="mobile-navbar__link" data-section="about">
                        <span>Acerca de</span>
                        <i class="bi bi-info-circle"></i>
                    </a>
                </li>
                <li class="mobile-navbar__item">
                    <a href="#services" class="mobile-navbar__link" data-section="services">
                        <span>Servicios</span>
                        <i class="bi bi-gear"></i>
                    </a>
                </li>
                <li class="mobile-navbar__item">
                    <a href="#locutores" class="mobile-navbar__link" data-section="locutores">
                        <span>Locutores</span>
                        <i class="bi bi-people"></i>
                    </a>
                </li>
                <li class="mobile-navbar__item">
                    <a href="#testimonials" class="mobile-navbar__link" data-section="testimonials">
                        <span>Testimonios</span>
                        <i class="bi bi-chat-quote"></i>
                    </a>
                </li>
                <li class="mobile-navbar__item">
                    <a href="#contact" class="mobile-navbar__link" data-section="contact">
                        <span>Contacto</span>
                        <i class="bi bi-envelope"></i>
                    </a>
                </li>
                <li class="mobile-navbar__item mobile-navbar__dropdown">
                    <button class="mobile-navbar__dropdown-toggle" aria-expanded="false">
                        <span>Usuario</span>
                        <i class="bi bi-chevron-down"></i>
                    </button>
                    <ul class="mobile-navbar__dropdown-menu">
                        <li class="mobile-navbar__dropdown-item">
                            <a href="iniciosesionLS.html" class="mobile-navbar__dropdown-link">
                                <i class="bi bi-box-arrow-in-right"></i>
                                <span>Iniciar Sesión</span>
                            </a>
                        </li>
                        <li class="mobile-navbar__dropdown-item">
                            <a href="registrosesionLS.html" class="mobile-navbar__dropdown-link">
                                <i class="bi bi-person-plus"></i>
                                <span>Registro</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            
            <div class="mobile-navbar__social">
                <a href="https://www.facebook.com/performanceradio" class="mobile-navbar__social-link facebook" target="_blank" aria-label="Facebook">
                    <i class="bi bi-facebook"></i>
                </a>
                <a href="https://www.instagram.com/performanceradio/" class="mobile-navbar__social-link instagram" target="_blank" aria-label="Instagram">
                    <i class="bi bi-instagram"></i>
                </a>
                <a href="https://twitter.com/performanceradi" class="mobile-navbar__social-link twitter" target="_blank" aria-label="Twitter">
                    <i class="bi bi-twitter"></i>
                </a>
                <a href="https://www.youtube.com/channel/UC_ir-CuCJm7gMEeXdegjq2Q" class="mobile-navbar__social-link youtube" target="_blank" aria-label="YouTube">
                    <i class="bi bi-youtube"></i>
                </a>
            </div>
        `;

        document.body.appendChild(this.navbar);
        console.log('📱 Navbar móvil creado y agregado al DOM');

        // Obtener referencias a elementos
        this.closeBtn = this.navbar.querySelector('.mobile-navbar__close');
        this.dropdowns = this.navbar.querySelectorAll('.mobile-navbar__dropdown');
        
        // Verificar enlaces creados
        const navLinks = this.navbar.querySelectorAll('.mobile-navbar__link[href^="#"]');
        console.log('🔗 Enlaces de navegación encontrados:', navLinks.length);
        navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            const text = link.querySelector('span')?.textContent;
            console.log(`  ${index + 1}. ${text} -> ${href}`);
        });
    }

    /**
     * Crear overlay de fondo
     */
    createOverlay() {
        // El overlay ya se crea en createNavbar()
    }

    /**
     * Vincular eventos
     */
    bindEvents() {
        // Toggle del navbar
        this.toggle = document.querySelector('.mobile-nav-toggle');
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleNavbar();
            });
        }

        // Cerrar navbar
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeNavbar();
            });
        }

        // Cerrar con overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeNavbar();
            });
        }

        // Enlaces de navegación
        const navLinks = this.navbar.querySelectorAll('.mobile-navbar__link[href^="#"]');
        console.log('🔗 Configurando event listeners para', navLinks.length, 'enlaces');
        
        navLinks.forEach((link, index) => {
            // Remover cualquier event listener previo
            link.removeEventListener('click', this.handleNavLinkClick);
            
            // Agregar nuevo event listener
            link.addEventListener('click', (e) => {
                console.log('🎯 Event listener ejecutado para enlace', index + 1);
                e.preventDefault();
                e.stopPropagation(); // Prevenir que main.js interfiera
                
                const targetId = link.getAttribute('href').substring(1);
                console.log('🔍 Mobile Navbar - Click detectado:', {
                    linkText: link.querySelector('span')?.textContent || 'Sin texto',
                    targetId: targetId,
                    href: link.getAttribute('href'),
                    sectionExists: !!document.getElementById(targetId)
                });
                this.scrollToSection(targetId);
                this.closeNavbar();
            });
            
            console.log(`  ✅ Event listener agregado para: ${link.querySelector('span')?.textContent} -> ${link.getAttribute('href')}`);
        });

        // Dropdowns
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-navbar__dropdown-toggle');
            const menu = dropdown.querySelector('.mobile-navbar__dropdown-menu');
            
            if (toggle && menu) {
                toggle.addEventListener('click', () => {
                    this.toggleDropdown(toggle, menu);
                });
            }
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeNavbar();
            }
        });

        // Prevenir scroll del body cuando el navbar está abierto
        this.navbar.addEventListener('touchmove', (e) => {
            if (this.isOpen) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    /**
     * Configurar scroll spy para detectar sección actual
     */
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = this.navbar.querySelectorAll('.mobile-navbar__link[data-section]');

        // Solo usar IntersectionObserver para evitar conflictos
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    console.log('👁️ Scroll spy detectó sección:', sectionId);
                    this.updateActiveLink(sectionId);
                }
            });
        }, {
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.5
        });

        sections.forEach(section => {
            observer.observe(section);
        });

        console.log('👁️ Scroll spy configurado para', sections.length, 'secciones');
    }


    /**
     * Configurar navegación por teclado
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            const focusableElements = this.navbar.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    /**
     * Abrir/cerrar navbar
     */
    toggleNavbar() {
        if (this.isOpen) {
            this.closeNavbar();
        } else {
            this.openNavbar();
        }
    }

    /**
     * Abrir navbar
     */
    openNavbar() {
        // Verificar que estamos en móvil
        if (window.innerWidth >= 768) {
            console.log('💻 Pantalla desktop detectada, navbar móvil no se abrirá');
            return;
        }
        
        this.isOpen = true;
        this.navbar.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Actualizar toggle button
        if (this.toggle) {
            this.toggle.classList.add('active');
        }

        // Enfocar primer elemento
        const firstLink = this.navbar.querySelector('.mobile-navbar__link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }

        // Emitir evento personalizado
        this.emitEvent('navbar:open');
        console.log('📱 Navbar abierto');
    }

    /**
     * Cerrar navbar
     */
    closeNavbar() {
        this.isOpen = false;
        this.navbar.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Actualizar toggle button
        if (this.toggle) {
            this.toggle.classList.remove('active');
        }

        // Cerrar todos los dropdowns
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-navbar__dropdown-toggle');
            const menu = dropdown.querySelector('.mobile-navbar__dropdown-menu');
            if (toggle && menu) {
                this.closeDropdown(toggle, menu);
            }
        });

        // Emitir evento personalizado
        this.emitEvent('navbar:close');
    }

    /**
     * Alternar dropdown
     */
    toggleDropdown(toggle, menu) {
        const isOpen = menu.classList.contains('active');
        
        // Cerrar todos los otros dropdowns
        this.dropdowns.forEach(otherDropdown => {
            const otherToggle = otherDropdown.querySelector('.mobile-navbar__dropdown-toggle');
            const otherMenu = otherDropdown.querySelector('.mobile-navbar__dropdown-menu');
            if (otherToggle !== toggle && otherMenu !== menu) {
                this.closeDropdown(otherToggle, otherMenu);
            }
        });

        if (isOpen) {
            this.closeDropdown(toggle, menu);
        } else {
            this.openDropdown(toggle, menu);
        }
    }

    /**
     * Abrir dropdown
     */
    openDropdown(toggle, menu) {
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('active');
    }

    /**
     * Cerrar dropdown
     */
    closeDropdown(toggle, menu) {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
    }

    /**
     * Actualizar enlace activo
     */
    updateActiveLink(sectionId) {
        const navLinks = this.navbar.querySelectorAll('.mobile-navbar__link[data-section]');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        this.currentSection = sectionId;
    }

    /**
     * Scroll suave a sección
     */
    scrollToSection(sectionId) {
        console.log('🎯 scrollToSection llamado con:', sectionId);
        
        try {
            const section = document.getElementById(sectionId);
            console.log('📍 Sección encontrada:', section);
            
            if (!section) {
                console.error(`❌ Sección con ID "${sectionId}" no encontrada`);
                console.log('🔍 Secciones disponibles:', Array.from(document.querySelectorAll('section[id]')).map(s => s.id));
                return;
            }

            // Calcular offset de forma más simple y segura
            let offset = 100; // Offset base
            
            // Agregar altura del reproductor fijo si existe
            const player = document.querySelector('.fixed-player');
            if (player) {
                offset += player.offsetHeight;
                console.log('📻 Reproductor fijo detectado, altura:', player.offsetHeight);
            }
            
            // Agregar altura del header si existe
            const header = document.querySelector('#header');
            if (header) {
                offset += header.offsetHeight;
                console.log('📋 Header detectado, altura:', header.offsetHeight);
            }
            
            console.log('📏 Offset total calculado:', offset);
            
            // Obtener posición de la sección
            const sectionTop = section.offsetTop;
            const targetPosition = Math.max(0, sectionTop - offset);
            
            console.log('📐 Posiciones:', {
                sectionTop: sectionTop,
                targetPosition: targetPosition,
                currentScrollTop: window.pageYOffset
            });
            
            // Actualizar enlace activo inmediatamente
            this.updateActiveLink(sectionId);
            
            // Scroll suave con timeout para evitar conflictos
            setTimeout(() => {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                console.log('✅ Scroll completado hacia:', targetPosition);
            }, 100);
            
        } catch (error) {
            console.error('❌ Error en scrollToSection:', error);
        }
    }

    /**
     * Emitir evento personalizado
     */
    emitEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: { ...detail, navbar: this }
        });
        document.dispatchEvent(event);
    }

    /**
     * Destruir instancia
     */
    destroy() {
        if (this.navbar) {
            this.navbar.remove();
        }
        if (this.overlay) {
            this.overlay.remove();
        }
        document.body.style.overflow = '';
    }
}

/**
 * ==========================================
 * INICIALIZACIÓN
 * ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM cargado, verificando tamaño de pantalla:', window.innerWidth);
    // Solo inicializar en dispositivos móviles
    if (window.innerWidth <= 768) {
        console.log('✅ Pantalla móvil detectada, inicializando navbar...');
        window.mobileNavbar = new MobileNavbar();
    } else {
        console.log('💻 Pantalla desktop detectada, navbar móvil no se inicializará');
    }
});

// Reinicializar en cambio de tamaño de ventana
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !window.mobileNavbar) {
        window.mobileNavbar = new MobileNavbar();
    } else if (window.innerWidth > 768 && window.mobileNavbar) {
        window.mobileNavbar.destroy();
        window.mobileNavbar = null;
    }
});

/**
 * ==========================================
 * UTILIDADES
 * ========================================== */

// Función para cerrar navbar desde otros scripts
window.closeMobileNavbar = () => {
    if (window.mobileNavbar) {
        window.mobileNavbar.closeNavbar();
    }
};

// Función para abrir navbar desde otros scripts
window.openMobileNavbar = () => {
    if (window.mobileNavbar) {
        window.mobileNavbar.openNavbar();
    }
};

// Función para verificar si el navbar está abierto
window.isMobileNavbarOpen = () => {
    return window.mobileNavbar ? window.mobileNavbar.isOpen : false;
};

/**
 * ==========================================
 * EXPORTAR PARA USO EN MÓDULOS
 * ========================================== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavbar;
}
