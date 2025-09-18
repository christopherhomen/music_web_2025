// ==========================================
// FAQ PREMIUM - APPLE STYLE INTERACTIONS
// ==========================================

// console.log('FAQ Premium script starting...');

// Función para inicializar el FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        // console.log('No FAQ items found');
        return;
    }
    
    // console.log('Found', faqItems.length, 'FAQ items');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const arrow = item.querySelector('.faq-arrow');
        
        if (!question || !answer || !arrow) {
            // console.log('Missing elements in FAQ item', index);
            return;
        }
        
        // Agregar event listener al click
        question.addEventListener('click', function() {
            toggleFAQ(item, answer, arrow);
        });
        
        // Agregar event listener al teclado
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item, answer, arrow);
            }
        });
        
        // Hacer el elemento focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', 'faq-answer-' + (index + 1));
        
        // Agregar ID único a la respuesta
        answer.setAttribute('id', 'faq-answer-' + (index + 1));
    });
}

// Función para alternar el estado del FAQ
function toggleFAQ(item, answer, arrow) {
    const isActive = item.classList.contains('active');
    const question = item.querySelector('.faq-question');
    
    // Cerrar todos los otros FAQ items
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherArrow = otherItem.querySelector('.faq-arrow');
            const otherQuestion = otherItem.querySelector('.faq-question');
            
            if (otherAnswer && otherArrow && otherQuestion) {
                otherAnswer.style.maxHeight = '0';
                otherQuestion.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Alternar el estado actual
    if (isActive) {
        // Cerrar
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        question.setAttribute('aria-expanded', 'false');
    } else {
        // Abrir
        item.classList.add('active');
        
        // Calcular la altura necesaria
        const content = answer.querySelector('.faq-content');
        if (content) {
            const contentHeight = content.scrollHeight;
            answer.style.maxHeight = contentHeight + 'px';
        }
        
        question.setAttribute('aria-expanded', 'true');
    }
}

// Función para animar la entrada de los elementos
function animateFAQItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Crear intersection observer para animaciones
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar cada elemento
    faqItems.forEach((item, index) => {
        // Configurar estado inicial
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transitionDelay = (index * 0.1) + 's';
        
        // Observar el elemento
        observer.observe(item);
    });
}

// Función para agregar efectos de hover mejorados
function addHoverEffects() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon');
        
        if (question && icon) {
            // Efecto de hover en la pregunta
            question.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.05)';
            });
            
            question.addEventListener('mouseleave', function() {
                if (!item.classList.contains('active')) {
                    icon.style.transform = 'scale(1)';
                }
            });
        }
    });
}

// Función para manejar el responsive
function handleResponsive() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    function updateFAQForScreenSize() {
        const isMobile = window.innerWidth <= 479;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                if (isMobile) {
                    // En móvil, hacer que la pregunta sea más compacta
                    question.style.flexDirection = 'column';
                    question.style.alignItems = 'flex-start';
                } else {
                    // En desktop, mantener layout horizontal
                    question.style.flexDirection = 'row';
                    question.style.alignItems = 'center';
                }
            }
        });
    }
    
    // Ejecutar al cargar
    updateFAQForScreenSize();
    
    // Ejecutar al redimensionar
    window.addEventListener('resize', updateFAQForScreenSize);
}

// Función para agregar accesibilidad mejorada
function addAccessibility() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Agregar aria-label descriptivo
            const questionText = question.querySelector('h3');
            if (questionText) {
                question.setAttribute('aria-label', 'Pregunta: ' + questionText.textContent);
            }
            
            // Agregar role y aria-expanded
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', 'faq-answer-' + (index + 1));
            
            answer.setAttribute('id', 'faq-answer-' + (index + 1));
            answer.setAttribute('role', 'region');
            answer.setAttribute('aria-labelledby', 'faq-question-' + (index + 1));
            
            question.setAttribute('id', 'faq-question-' + (index + 1));
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM loaded, initializing FAQ...');
    
    // Inicializar funcionalidades
    initFAQ();
    animateFAQItems();
    addHoverEffects();
    handleResponsive();
    addAccessibility();
    
    // console.log('FAQ Premium initialized successfully');
});

// Exportar funciones para uso externo si es necesario
window.FAQPremium = {
    init: initFAQ,
    toggle: toggleFAQ,
    animate: animateFAQItems
};
