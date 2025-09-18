// Page glue code: year, filters, simple validation
(() => {
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  // Filters
  const container = document.getElementById('schedule');
  const filterBar = document.querySelector('#programacion .filters');
  if (container && filterBar) {
    const items = [...container.querySelectorAll('[data-day]')];
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-day]');
      if (!btn) return;
      const day = btn.getAttribute('data-day');
      [...filterBar.querySelectorAll('button')].forEach(b => b.setAttribute('aria-selected','false'));
      btn.setAttribute('aria-selected','true');
      items.forEach(it => {
        it.style.display = (day === 'all' || it.getAttribute('data-day') === day) ? '' : 'none';
      });
    });
  }
  // Contact validation (lightweight)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const data = new FormData(form);
      const name = (data.get('name')||'').toString().trim();
      const email = (data.get('email')||'').toString().trim();
      const message = (data.get('message')||'').toString().trim();
      let ok = true;
      if (!name) ok = false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ok = false;
      if (!message) ok = false;
      if (!ok) { e.preventDefault(); alert('Por favor completa nombre, email válido y mensaje.'); }
    });
  }
})();

// JSON-LD Person from Team section (dynamic, non-blocking)
(() => {
  try {
    const team = document.querySelectorAll('.team .member');
    if (!team || team.length === 0) return;
    const persons = [];
    team.forEach(m => {
      const name = m.querySelector('.member-info h4')?.textContent?.trim();
      if (!name) return;
      const role = m.querySelector('.member-info span')?.textContent?.trim();
      const sameAs = [...m.querySelectorAll('.social a[href]')].map(a => a.getAttribute('href')).filter(Boolean);
      persons.push({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        jobTitle: role || undefined,
        url: document.location.origin + document.location.pathname + '#team',
        sameAs: sameAs.length ? sameAs : undefined
      });
    });
    if (persons.length) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(persons, null, 2);
      document.head.appendChild(script);
    }
  } catch(e) { /* no-op */ }
})();
