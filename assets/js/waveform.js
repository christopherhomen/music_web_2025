// Natural-looking equalizer animation driven by JS
(function () {
  const wf = document.querySelector('.waveform');
  if (!wf) return;
  const radio = document.querySelector('.radio-player');
  const bars = Array.from(wf.querySelectorAll('span'));
  if (!bars.length) return;

  const n = bars.length;
  const TAU = Math.PI * 2;
  const nowSec = () => performance.now() / 1000;

  // Precompute per-bar params
  const params = bars.map((_, i) => {
    const center = (n - 1) / 2;
    const d = Math.abs(i - center) / center; // 0..1 (0 center)
    const centerWeight = 0.7 + 0.3 * Math.exp(-Math.pow(d * 2.2, 2)); // boost center bars
    return {
      f1: 0.6 + Math.random() * 0.9, // 0.6..1.5 Hz
      f2: 1.2 + Math.random() * 1.4, // 1.2..2.6 Hz
      p1: Math.random() * TAU,
      p2: Math.random() * TAU,
      cw: centerWeight,
      smooth: 1, // current scaleY
      noiseScale: 0.28 + Math.random() * 0.25, // duration for noise steps
    };
  });

  function hash(i, k) {
    // Lightweight integer hash -> [0,1)
    let x = (i * 374761393) ^ (k * 668265263);
    x = (x ^ (x >>> 13)) * 1274126177;
    x = (x ^ (x >>> 16)) >>> 0;
    return x / 4294967295;
  }

  function smoothNoise(i, t, seg) {
    const k = Math.floor(t / seg);
    const f = (t / seg) - k;
    const a = hash(i + 101, k);
    const b = hash(i + 101, k + 1);
    return a * (1 - f) + b * f; // 0..1
  }

  const minY = 0.7;
  const maxY = 3.6;
  const idleY = 0.85;
  const follow = 0.18; // smoothing factor

  function step(t) {
    const isPlaying = !!(radio && radio.classList.contains('playing')) || wf.classList.contains('playing');
    for (let i = 0; i < n; i++) {
      const p = params[i];
      let target;
      if (isPlaying) {
        // Base oscillation + layered sine + smooth noise
        const s1 = Math.sin(TAU * p.f1 * t + p.p1);
        const s2 = Math.sin(TAU * p.f2 * t + p.p2);
        const nz = smoothNoise(i, t, p.noiseScale) * 2 - 1; // -1..1
        let v = 0.5 + 0.28 * s1 + 0.18 * s2 + 0.16 * nz;
        // clamp 0..1 and shape
        v = Math.max(0, Math.min(1, v));
        const y = minY + (maxY - minY) * v * p.cw;
        target = y;
      } else {
        target = idleY; // gentle idle when paused
      }
      // smooth towards target
      p.smooth += (target - p.smooth) * follow;
      bars[i].style.transform = `scaleY(${p.smooth.toFixed(3)})`;
    }
  }

  function loop() {
    step(nowSec());
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

