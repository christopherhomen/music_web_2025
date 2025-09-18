// Minimal slider pagination using scroll-snap + IO
(() => {
  const scroller = document.getElementById('hero-slider');
  if (!scroller) return;
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { ticking = false; });
      ticking = true;
    }
  };
  scroller.addEventListener('scroll', onScroll, { passive: true });
})();
