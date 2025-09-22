/**
 * JavaScript para el diseño moderno de locutores
 * Efectos interactivos y animaciones
 */

class LocutorModern {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupHoverEffects();
    this.setupScrollAnimations();
    this.setupButtonEffects();
    this.setupParticleEffect();
  }
  
  // Efectos de hover para la imagen
  setupHoverEffects() {
    const locutorCards = document.querySelectorAll('.locutor-modern');
    
    locutorCards.forEach(card => {
      const locutorImage = card.querySelector('.locutor-image');
      
      if (locutorImage) {
        card.addEventListener('mouseenter', () => {
          locutorImage.style.transform = 'scale(1.05) rotate(2deg)';
          locutorImage.style.boxShadow = '0 0 50px rgba(0, 212, 255, 0.8)';
        });
        
        card.addEventListener('mouseleave', () => {
          locutorImage.style.transform = 'scale(1) rotate(0deg)';
          locutorImage.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.4)';
        });
      }
    });
  }
  
  // Animaciones al hacer scroll
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Animar elementos internos con delay
          const title = entry.target.querySelector('.program-title');
          const name = entry.target.querySelector('.locutor-name');
          const buttons = entry.target.querySelector('.locutor-buttons');
          
          if (title) {
            setTimeout(() => {
              title.style.opacity = '1';
              title.style.transform = 'translateX(0)';
            }, 200);
          }
          
          if (name) {
            setTimeout(() => {
              name.style.opacity = '1';
              name.style.transform = 'translateX(0)';
            }, 400);
          }
          
          if (buttons) {
            setTimeout(() => {
              buttons.style.opacity = '1';
              buttons.style.transform = 'translateY(0)';
            }, 600);
          }
        }
      });
    }, { threshold: 0.3 });
    
    const locutorCards = document.querySelectorAll('.locutor-modern');
    
    locutorCards.forEach((card, index) => {
      // Establecer estado inicial con delay escalonado
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      card.style.transition = `all 0.8s ease-out ${index * 0.2}s`;
      
      // Preparar elementos internos
      const title = card.querySelector('.program-title');
      const name = card.querySelector('.locutor-name');
      const buttons = card.querySelector('.locutor-buttons');
      
      if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateX(-30px)';
        title.style.transition = 'all 0.6s ease-out';
      }
      
      if (name) {
        name.style.opacity = '0';
        name.style.transform = 'translateX(-30px)';
        name.style.transition = 'all 0.6s ease-out';
      }
      
      if (buttons) {
        buttons.style.opacity = '0';
        buttons.style.transform = 'translateY(30px)';
        buttons.style.transition = 'all 0.6s ease-out';
      }
      
      observer.observe(card);
    });
  }
  
  // Efectos para botones
  setupButtonEffects() {
    const buttons = document.querySelectorAll('.locutor-btn');
    
    buttons.forEach(button => {
      // Efecto de ripple al hacer click
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
      
      // Efecto de pulso en hover
      button.addEventListener('mouseenter', () => {
        button.style.animation = 'pulse 0.6s ease-in-out';
      });
      
      button.addEventListener('animationend', () => {
        button.style.animation = '';
      });
    });
  }
  
  // Efecto de partículas flotantes
  setupParticleEffect() {
    const locutorCards = document.querySelectorAll('.locutor-modern');
    
    locutorCards.forEach(card => {
      // Crear partículas flotantes para cada card
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(0, 212, 255, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
        `;
        
        card.appendChild(particle);
      }
    });
  }
}

// CSS adicional para animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg);
      opacity: 0.6;
    }
    50% { 
      transform: translateY(-20px) rotate(180deg);
      opacity: 1;
    }
  }
  
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
  
  .floating-particle {
    animation: float 4s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new LocutorModern();
});

console.log('🎨 Sistema moderno de locutores inicializado');
