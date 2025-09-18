// Shrink nav on scroll and set current link
(() => {
  const nav = document.querySelector('.c-nav');
  if (!nav) return;
  const links = [...nav.querySelectorAll('.c-nav__link')];
  const setActive = () => {
    let current = null;
    links.forEach(a => a.removeAttribute('aria-current'));
    for (const a of links) {
      const id = a.getAttribute('href')?.replace('#','');
      if (!id) continue;
      const sec = document.getElementById(id);
      if (sec) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= (nav.offsetHeight + 12) && rect.bottom > (nav.offsetHeight + 12)) {
          current = a; break;
        }
      }
    }
    if (current) current.setAttribute('aria-current','page');
  };
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('is-scrolled'); else nav.classList.remove('is-scrolled');
    setActive();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();
})();
