## Changelog

### 2025-09-12

- Dark-only redesign applied using existing sections and content in `index.html` (archivo principal).
- Kept radio player intact; no changes to its HTML/CSS/JS.
- Removed placeholder sections previously added (`home/locutores/programacion/galeria/contacto`) and custom nav.
- Restyled legacy header/navbar with glassmorphism and dark tokens.
- Added CSS design tokens and modular styles:
  - `styles/core.css`, `styles/components/*`, `styles/pages/index.css`.
- Improved accessibility: skip-link, focus styles; maintained landmarks.
- Performance: critical CSS inline; deferred modular CSS via preload; images continue with lazy/async.
- Equalizer animation made more natural (`assets/js/waveform.js`).
- Metadata cleaning script for stream text hardened (debounced; enrichment disabled by default).

