// Locutores: botón "Más info" accesible y robusto (hover + click)
(function () {
  function setupCard(card) {
    const btn = card.querySelector('.info-button');
    const popup = card.querySelector('.popup-locutor');
    if (!btn || !popup) return;

    // Ensure a close button exists for accessibility/mobile
    if (!popup.querySelector('.popup-close')) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'popup-close';
      closeBtn.setAttribute('aria-label', 'Cerrar');
      closeBtn.innerHTML = '&times;';
      popup.prepend(closeBtn);
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        popup.classList.remove('show');
      });
    }

    let hideTimer = null;
    const show = () => {
      clearTimeout(hideTimer);
      popup.classList.add('show');
    };
    const hide = (delay = 80) => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => popup.classList.remove('show'), delay);
    };

    // Hover (desktop)
    btn.addEventListener('mouseenter', show);
    btn.addEventListener('mouseleave', () => hide());
    btn.addEventListener('focus', show);
    btn.addEventListener('blur', () => hide());
    popup.addEventListener('mouseenter', show);
    popup.addEventListener('mouseleave', () => hide());

    // Click / touch toggle
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (popup.classList.contains('show')) {
        popup.classList.remove('show');
      } else {
        // Cerrar otros abiertos
        document.querySelectorAll('.popup-locutor.show').forEach(p => p !== popup && p.classList.remove('show'));
        popup.classList.add('show');
      }
    });
  }

  document.querySelectorAll('.member').forEach(setupCard);

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.member')) {
      document.querySelectorAll('.popup-locutor.show').forEach(p => p.classList.remove('show'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.popup-locutor.show').forEach(p => p.classList.remove('show'));
    }
  });
})();
