
const rangeInput = document.getElementById('range');
const audioPlayerS = document.getElementById('audio');
const volumeUpIcon = document.querySelector('.fa-volume-up');

rangeInput.addEventListener('input', function() {
  const volume = parseFloat(this.value) / 100;
  audioPlayerS.volume = volume;

  const fillPercentage = volume * 100;
  rangeInput.style.background = `linear-gradient(to right, #b6ff00 ${fillPercentage}%, #d7dbdd ${fillPercentage}%)`;

  if (volume === 0) {
    volumeUpIcon.classList.add('fa-volume-mute');
    volumeUpIcon.classList.remove('fa-volume-up');
  } else if (volume < 0.5) {
    volumeUpIcon.classList.add('fa-volume-down');
    volumeUpIcon.classList.remove('fa-volume-up');
  } else {
    volumeUpIcon.classList.remove('fa-volume-down', 'fa-volume-mute');
    volumeUpIcon.classList.add('fa-volume-up');
  }
});

volumeUpIcon.classList.add('fa-volume-up');
