## Integration Notes

- Player remains unchanged. All restyle happens around it.
- New styles are additive. Legacy classes (services, pricing, team, etc.) are restyled via `styles/pages/index.css`.
- Inline critical CSS is injected in `index_seo_perf.html` after `assets/css/reproductorStyle.css`.
- Preloaded CSS files are promoted onload; `noscript` fallbacks included.
- Removed custom nav and placeholder sections; legacy sections are used and restyled.
- Scripts added:
  - `assets/js/waveform.js` animates equalizer bars via JS.
  - Debounced metadata cleaner stays at the end of `index_seo_perf.html`. External enrichment (iTunes) is disabled.

### Build/Deploy

No build step required. Files are static. Ensure the `styles/` and `scripts/` folders are deployed.

