/* Neon Radio Player — injects a modern neon player UI around an existing <audio> or stream URL. */
(function(){
  const CONFIG = {
    // Optional: set window.RADIO_STREAM_URL or <script data-stream="..." src="...neon-player.js">
    stream: (function(){
      try {
        const me = document.currentScript; if (me && me.dataset.stream) return me.dataset.stream;
        if (window.RADIO_STREAM_URL) return window.RADIO_STREAM_URL;
      } catch(_){}
      return null;
    })(),
    // Try to read title/host/cover from the page if available
    selectors: {
      cover: [
        '[data-cover]', '.cover img', 'img[alt*="cover" i]', 'img[alt*="portada" i]',
        'img[class*="cover" i]', 'img[src*="cover" i]', 'img[src*="portada" i]', '#albumart img'
      ],
      title: [
        '[data-title]', '.title', '#title', '#titulo', '.np-track-title', '[itemprop="name"]'
      ],
      host: [
        '[data-host]', '[data-locutor]', '.host', '.locutor', '#host', '#locutor'
      ]
    }
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sels) => {
    for (const s of sels) { const el = $(s); if (el) return el; }
    return null;
  }

  function formatTime(s){
    if (!isFinite(s)) return '--:--';
    const m = Math.floor(s/60); const sec = Math.floor(s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  }

  function findAudio(){
    const candidates = [
      'audio', '#audio', '.audio', '[data-audio]', '[id*="audio" i]'
    ];
    for (const s of candidates){ const el = $(s); if (el instanceof HTMLAudioElement) return el; }
    return null;
  }

  function findText(selectors){
    const el = $$(selectors); if (!el) return null;
    const t = (el.getAttribute && el.getAttribute('content')) || el.textContent || '';
    return t.trim() || null;
  }

  function findCoverSrc(){
    const el = $$(CONFIG.selectors.cover); if (!el) return null;
    return el.getAttribute('data-cover') || el.currentSrc || el.src || null;
  }

  function buildUI(state){
    const wrap = document.createElement('section');
    wrap.className = 'neon-player';
    wrap.innerHTML = `
      <div class="np-grid">
        <figure class="np-art"><img alt="cover" src="${state.cover || ''}" /></figure>
        <header class="np-meta">
          <div class="np-title" id="np-title">${state.title || 'En vivo'}</div>
          <div class="np-sub" id="np-host">${state.host || 'Locutor en turno'}</div>
        </header>
        <aside class="np-live">
          <span class="np-badge"><span class="np-dot"></span> EN VIVO</span>
          <span class="np-eq" aria-hidden="true"><i></i><i></i><i></i></span>
        </aside>
        <div class="np-ctrls">
          <button class="np-btn" id="np-toggle" aria-label="Reproducir/Pausar">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <div class="np-track">
            <div class="np-bar" id="np-bar"><div class="np-fill" id="np-fill"></div></div>
            <div class="np-time"><span id="np-cur">00:00</span><span id="np-dur">--:--</span></div>
          </div>
          <div class="np-vol">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 10v4h4l5 5V5L7 10H3z"/></svg>
            <input id="np-vol" class="np-range" type="range" min="0" max="1" step="0.01" value="1" aria-label="Volumen" />
          </div>
        </div>
      </div>`;
    return wrap;
  }

  function mount(){
    const audio = findAudio();
    let elAudio = audio;
    if (!elAudio && CONFIG.stream){
      elAudio = new Audio(CONFIG.stream);
      elAudio.crossOrigin = 'anonymous';
      elAudio.preload = 'none';
    }
    if (!elAudio) return; // cannot proceed

    // Hide any existing controls, we provide a custom UI
    elAudio.controls = false;
    elAudio.classList.add('np-hidden');

    const state = {
      title: findText(CONFIG.selectors.title),
      host: findText(CONFIG.selectors.host),
      cover: findCoverSrc()
    };

    const ui = buildUI(state);
    // Prefer placing near the original audio element; else append to body
    if (elAudio.parentElement){ elAudio.parentElement.insertBefore(ui, elAudio); }
    else document.body.appendChild(ui);

    // If we created an audio element (no existing one), keep it in DOM hidden for policies
    if (!audio) ui.appendChild(elAudio);

    const $id = (id) => ui.querySelector(id);
    const btn = $id('#np-toggle');
    const bar = $id('#np-bar');
    const fill = $id('#np-fill');
    const cur = $id('#np-cur');
    const dur = $id('#np-dur');
    const vol = $id('#np-vol');
    const art = ui.querySelector('.np-art img');

    // Default cover placeholder if missing
    if (!state.cover) {
      art.style.background = 'linear-gradient(135deg, #01e3ff33, #ff00ff22)';
    }

    function setPlayIcon(isPlaying){
      btn.innerHTML = isPlaying
        ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 6h4v12H6zM14 6h4v12h-4z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    }

    // Wire controls
    btn.addEventListener('click', async () => {
      try {
        if (elAudio.paused) await elAudio.play(); else elAudio.pause();
      } catch (e) { console.warn('Playback error', e); }
    });

    vol.addEventListener('input', () => { elAudio.volume = Number(vol.value); });

    // Seek if media provides duration (streams usually do not)
    function seekFromClientX(clientX){
      const r = bar.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if (isFinite(elAudio.duration) && elAudio.duration > 0){
        elAudio.currentTime = pct * elAudio.duration;
      }
    }
    bar.addEventListener('click', (e) => seekFromClientX(e.clientX));

    // Media events
    elAudio.addEventListener('play', () => setPlayIcon(true));
    elAudio.addEventListener('pause', () => setPlayIcon(false));
    elAudio.addEventListener('timeupdate', () => {
      const d = elAudio.duration || 0; const c = elAudio.currentTime || 0;
      if (isFinite(d) && d > 0) {
        fill.style.width = `${(c / d) * 100}%`;
        dur.textContent = formatTime(d);
      } else {
        // streaming: animate fill subtly to show activity
        const t = (Date.now() / 50) % 100; fill.style.width = `${t}%`;
        dur.textContent = 'LIVE';
      }
      cur.textContent = formatTime(c);
    });
    elAudio.addEventListener('durationchange', () => { dur.textContent = formatTime(elAudio.duration); });
    elAudio.addEventListener('volumechange', () => { vol.value = String(elAudio.volume); });
    elAudio.addEventListener('ended', () => setPlayIcon(false));

    // Try Web Audio analyser for smoother live eq effect (optional)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const actx = new AudioCtx();
      const src = actx.createMediaElementSource(elAudio);
      const analyser = actx.createAnalyser(); analyser.fftSize = 64;
      src.connect(analyser); analyser.connect(actx.destination);
      const eq = ui.querySelectorAll('.np-eq i');
      const data = new Uint8Array(analyser.frequencyBinCount);
      function loop(){
        analyser.getByteFrequencyData(data);
        const a = data[2] / 255, b = data[5]/255, c = data[10]/255;
        eq[0].style.height = `${20 + a*80}%`;
        eq[1].style.height = `${20 + b*80}%`;
        eq[2].style.height = `${20 + c*80}%`;
        requestAnimationFrame(loop);
      }
      loop();
      // Resume context on first user gesture if needed
      const resume = () => { if (actx.state === 'suspended') actx.resume(); window.removeEventListener('click', resume); }
      window.addEventListener('click', resume);
    } catch(_) { /* ignore if not available */ }

    // Observe page changes to update cover/title/host if the site updates them
    try {
      const updateDynamic = () => {
        const t = findText(CONFIG.selectors.title); if (t) ui.querySelector('#np-title').textContent = t;
        const h = findText(CONFIG.selectors.host); if (h) ui.querySelector('#np-host').textContent = h;
        const c = findCoverSrc(); if (c) art.src = c;
      };
      const mo = new MutationObserver(() => updateDynamic());
      mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
      updateDynamic();
    } catch(_){}
  }

  function ensureStyles(){
    const id = 'neon-player-style';
    if (!document.getElementById(id)){
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.id = id; link.href = (function(){
        // Try to resolve relative to this script
        try {
          const me = document.currentScript; if (me && me.src){
            const url = new URL(me.src, window.location.href);
            url.pathname = url.pathname.replace(/\/[^/]*$/, '/neon-player.css');
            return url.toString();
          }
        } catch(_){}
        return 'assets/neon-player/neon-player.css';
      })();
      document.head.appendChild(link);
    }
  }

  document.addEventListener('DOMContentLoaded', () => { ensureStyles(); mount(); });
})();

