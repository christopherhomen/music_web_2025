// Legacy header shrink + aria-current for existing nav
(() => {
  const header = document.getElementById('header');
  const nav = document.getElementById('navbar');
  if (!header || !nav) return;
  const anchors = [...nav.querySelectorAll('a[href^="#"]')];

  const setActive = () => {
    let current = null;
    const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--player-h')) || 88) + 64;
    anchors.forEach(a => a.removeAttribute('aria-current'));
    anchors.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom > offset) current = a;
    });
    if (current) current.setAttribute('aria-current','page');
  };

  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('is-scrolled'); else header.classList.remove('is-scrolled');
    setActive();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();
})();

