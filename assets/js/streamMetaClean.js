/**
 * Limpieza y (opcional) enriquecimiento de metadatos del stream
 * - Elimina variantes de “Desconocido/Unknown” (incluye “Intérprete desconocido”).
 * - Recompone a “Artista - Título” cuando es posible.
 * - Observa cambios en .cc_streaminfo y reaplica.
 */
(function () {
  'use strict';

  // Desactivar enriquecimiento externo por defecto (mantener rápido)
  var ENABLE_ENRICH = false;

  function normalize(s) {
    return (s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // Variantes a filtrar (se normalizan, así que acentos no afectan)
  var BAD = [
    'intérprete desconocido',
    'interprete desconocido',
    'artista desconocido',
    'desconocido',
    'unknown artist',
    'unknown',
    'n/a'
  ].map(normalize);

  // Separadores comunes: -, –, —, :, |
  var SEP = /\s*[-–—:|]\s*/;

  function isBad(segment) {
    return BAD.includes(normalize(segment));
  }

  function cleanMeta(text) {
    var t = text || '';
    var parts = t.split(SEP).filter(function (p) { return p && !isBad(p); });
    var out = parts.join(' - ').trim();
    return out || 'Performance Radio';
  }

  // Heurística simple para extraer artista/título si viene “Desconocido - Título - Artista”
  function guessArtistTitle(rawText) {
    var parts = (rawText || '').split(SEP).filter(Boolean).filter(function (p) { return !isBad(p); });
    if (parts.length >= 3) {
      var title = parts.slice(-2, -1)[0].trim();
      var artist = parts.slice(-1)[0].trim();
      return { artist: artist, title: title };
    }
    if (parts.length === 2) {
      return { artist: parts[0].trim(), title: parts[1].trim() };
    }
    return null;
  }

  // Cache simple en localStorage por 1 día
  function getCache() {
    try { return JSON.parse(localStorage.getItem('metaEnrichCache') || '{}'); } catch (_) { return {}; }
  }
  function setCache(cache) {
    try { localStorage.setItem('metaEnrichCache', JSON.stringify(cache)); } catch (_) {}
  }

  async function enrichWithItunes(guess) {
    if (!guess) return null;
    var key = (guess.artist + ' - ' + guess.title).toLowerCase();
    var cache = getCache();
    var entry = cache[key];
    var now = Date.now();
    if (entry && (now - (entry.ts || 0) < 86400000)) {
      return entry.data;
    }
    try {
      var term = encodeURIComponent(guess.artist + ' ' + guess.title);
      var url = 'https://itunes.apple.com/search?entity=song&limit=1&term=' + term;
      var res = await fetch(url, { mode: 'cors' });
      if (!res.ok) return null;
      var json = await res.json();
      if (json && json.results && json.results.length) {
        var r = json.results[0];
        var data = { artist: r.artistName, title: r.trackName, artwork: r.artworkUrl100 || r.artworkUrl60 || null };
        cache[key] = { ts: now, data: data };
        setCache(cache);
        return data;
      }
    } catch (_) {}
    return null;
  }

  var busy = new WeakSet();
  var lastApplied = new WeakMap();
  var timers = new WeakMap();

  function schedule(el) {
    var t = timers.get(el);
    if (t) clearTimeout(t);
    timers.set(el, setTimeout(function () { processEl(el); }, 120));
  }

  async function processEl(el) {
    if (busy.has(el)) return;
    busy.add(el);
    try {
      var current = el.textContent || '';
      var cleaned = cleanMeta(current);
      var guess = guessArtistTitle(current);

      var targetText = cleaned;
      if (guess && guess.artist && guess.title) {
        targetText = (guess.artist + ' - ' + guess.title).trim();
        if (ENABLE_ENRICH) {
          try {
            var enriched = await enrichWithItunes(guess);
            if (enriched && enriched.artist && enriched.title) {
              targetText = (enriched.artist + ' - ' + enriched.title).trim();
            }
          } catch (_) {}
        }
      }

      var last = lastApplied.get(el) || '';
      if (targetText && targetText !== current && targetText !== last) {
        el.textContent = targetText;
        lastApplied.set(el, targetText);
      }
    } finally {
      busy.delete(el);
    }
  }

  function observe(el) {
    schedule(el);
    var mo = new MutationObserver(function () { schedule(el); });
    mo.observe(el, { childList: true, characterData: true, subtree: true });
  }

  function init() {
    document.querySelectorAll('.cc_streaminfo').forEach(observe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

