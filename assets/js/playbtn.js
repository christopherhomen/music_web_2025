const playPause = document.getElementById("play-radio");
const playIcon = playPause.querySelector(".play-btn");
const pauseIcon = playPause.querySelector(".pause-btn");
const radioPlayerEl = document.querySelector('.radio-player');
const waveformEl = document.querySelector('.waveform');

class AudioPlayer {
  constructor() {
    this.audio = document.getElementById("audio");
    this.playPause = playPause;
    this.playBtn = playIcon;
    this.pauseBtn = pauseIcon;
    this.isToggling = false; // evita doble tap que alterna play/pause
    this.currentSrcType = 'none'; // 'intro' | 'stream' | 'none'
    this.userInitiatedPause = false;

    // Evita auto-play por estado previo en móviles: requiere gesto del usuario
    const wasPlayingStored = localStorage.getItem("radioIsPlaying") === "true";
    const allowAutoplay = !this.shouldSkipIntro();
    const wasPlaying = wasPlayingStored && allowAutoplay;
    if (wasPlaying) {
      this.startLiveStream();
      this.updatePlayPauseIcons(true);
    } else {
      this.updatePlayPauseIcons(false);
    }

    this.audio.addEventListener("ended", () => {
      if (this.currentSrcType === 'intro' && !this.userInitiatedPause) {
        this.startLiveStream();
      }
    });

    this.audio.addEventListener("play", () => this.updatePlayPauseIcons(true));
    this.audio.addEventListener("pause", () => {
      // si el usuario no pidió pausar y estamos en transición, ignora
      if (this.transitioning || !this.userInitiatedPause) return;
      this.updatePlayPauseIcons(false);
    });
    this.audio.addEventListener("error", this.handleError.bind(this));

    // Evitar reanudaciones autom�ticas que confunden el estado en m�vil
    // (si las quieres, podemos reactivarlas con una preferencia)
  }

  updatePlayPauseIcons(isPlaying) {
    if (isPlaying) {
      this.pauseBtn.classList.remove("hide");
      this.playBtn.classList.add("hide");
      if (radioPlayerEl) radioPlayerEl.classList.add('playing');
      if (waveformEl) waveformEl.classList.add('playing');
    } else {
      this.pauseBtn.classList.add("hide");
      this.playBtn.classList.remove("hide");
      if (radioPlayerEl) radioPlayerEl.classList.remove('playing');
      if (waveformEl) waveformEl.classList.remove('playing');
    }
  }

  playSrc(src) {
    this.transitioning = true;
    this.audio.src = src;
    this.audio.load();
    return this.audio.play().finally(() => {
      // liberar transición (aunque falle, el manejador de error ajusta iconos)
      this.transitioning = false;
      this.userInitiatedPause = false;
    });
  }

  startLiveStream() {
    const url = "https://cp9.serverse.com/proxy/perfor?mp=/stream;";
    if (this.currentSrcType === 'stream' && !this.audio.paused) {
      return Promise.resolve();
    }
    this.currentSrcType = 'stream';
    return this.playSrc(url)
      .then(() => localStorage.setItem("radioIsPlaying", "true"))
      .catch(this.handleError.bind(this));
  }

  playIntro() {
    this.currentSrcType = 'intro';
    return this.playSrc("assets/audio/intromod.mp3").catch(this.handleError.bind(this));
  }

  shouldSkipIntro() { return false; }

  async playAudio() {
    if (this.isToggling) return; // guard para doble tap
    this.isToggling = true;
    try {
      if (this.audio.paused || this.audio.ended) {
        if (this.shouldSkipIntro()) {
          await this.startLiveStream();
        } else {
          await this.playIntro();
        }
      } else {
        this.userInitiatedPause = true;
        this.audio.pause();
        this.currentSrcType = 'none';
        localStorage.setItem("radioIsPlaying", "false");
      }
    } catch (e) {
      this.handleError(e);
    } finally {
      // libera tras un pequeño debounce para prevenir alternancia inmediata
      setTimeout(() => { this.isToggling = false; }, 200);
    }
  }

  handleError(event) {
    console.error("Audio playback error: ", event);
    localStorage.setItem("radioIsPlaying", "false");
    this.updatePlayPauseIcons(false);
  }
}

const audioPlayer = new AudioPlayer();

playPause.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  audioPlayer.playAudio();
  const spanEl = playPause.querySelector('span');
  if (spanEl) spanEl.textContent = 'Al aire';
});
