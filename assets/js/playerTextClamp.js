// Ajusta dinámicamente el ancho del título del reproductor
// para que no se meta bajo el botón/onda y muestre ellipsis.
(function () {
  'use strict';

  function getSafeGap() {
    // Desktop más aire, móvil un poco menos
    return (window.innerWidth <= 768) ? 16 : 22;
  }

  function clampOnce() {
    var player = document.querySelector('.radio-player');
    if (!player) return;
    var textBox = player.querySelector('.radio-text');
    var center = player.querySelector('.center-controls');
    if (!textBox || !center) return;

    // Asegurar estilos de truncamiento por si el CSS cambia
    textBox.style.minWidth = '0px';
    textBox.style.overflow = 'hidden';
    textBox.style.whiteSpace = 'nowrap';
    textBox.style.textOverflow = 'ellipsis';

    // Medir posiciones actuales
    var textRect = textBox.getBoundingClientRect();
    var centerRect = center.getBoundingClientRect();
    if (!textRect.width || !centerRect.width) return;

    // Ancho disponible: desde el inicio del texto hasta antes del centro
    var available = Math.floor(centerRect.left - getSafeGap() - textRect.left);
    // Evitar negativos
    if (isNaN(available) || available < 0) available = 0;

    // Aplicar como ancho máximo (forzamos width para que elipsis se muestre siempre)
    textBox.style.maxWidth = available + 'px';
    textBox.style.width = available + 'px';

    // Tooltip con el texto completo cuando está truncado
    var titleEl = textBox.querySelector('h2');
    if (titleEl) {
      // si el contenido real excede el ancho visible del contenedor
      var truncated = titleEl.scrollWidth > titleEl.clientWidth + 1;
      if (truncated) {
        titleEl.setAttribute('title', (titleEl.textContent || '').trim());
      } else {
        titleEl.removeAttribute('title');
      }
    }
  }

  function rafClamp() {
    // esperar a que el layout se estabilice
    requestAnimationFrame(clampOnce);
  }

  function init() {
    rafClamp();
    window.addEventListener('resize', rafClamp);

    // Reaccionar si cambian tamaños internos (ecualizador/play/title)
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(rafClamp);
      var player = document.querySelector('.radio-player');
      if (player) ro.observe(player);
      var center = player && player.querySelector('.center-controls');
      var textBox = player && player.querySelector('.radio-text');
      if (center) ro.observe(center);
      if (textBox) ro.observe(textBox);
    }

    // Reaccionar cuando el título cambie por el stream
    var titleEl = document.querySelector('.radio-player .radio-text h2');
    if (titleEl && window.MutationObserver) {
      var mo = new MutationObserver(rafClamp);
      mo.observe(titleEl, { characterData: true, childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
