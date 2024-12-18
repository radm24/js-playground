'use strict';

(function () {
  // Check if video element is supported
  const isVideoSupported = !!document.createElement('video').canPlayType;
  if (!isVideoSupported) return;

  // Video
  const videoPlayer = document.querySelector('.video-player');
  const videoEl = document.getElementById('video');
  const videoControls = document.querySelector('.video-controls');

  // Play / pause
  const btnPlay = document.getElementById('play');
  const btnPause = document.getElementById('pause');

  // Time
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const progressEl = document.getElementById('progress');

  // Volume
  const btnMute = document.getElementById('mute');
  const btnUnmute = document.getElementById('unmute');
  const volumeEl = document.getElementById('volume');

  // Playback speed
  const speedEl = document.getElementById('speed');

  // Picture-In-Picture
  const pipControls = document.getElementById('pip-controls');
  const btnPipEnter = document.getElementById('pip-enter');
  const btnPipExit = document.getElementById('pip-exit');

  // Fullscreen
  const btnFullscreen = document.getElementById('fullscreen');

  // Disable default video controls and enable custom ones
  videoEl.controls = false;
  videoControls.classList.remove('hidden');

  // Set volume
  volumeEl.value = videoEl.volume;

  // Check if Picture-In-Picture is supported by browser
  if (!document.pictureInPictureEnabled) pipControls.classList.add('hidden');

  // Current time, duration, progress bar
  function convertSecondsToMinutesAndSeconds(time) {
    const minutes = `${Math.floor(time / 60)}`.padStart(2, '0');
    const seconds = `${Math.floor(time % 60)}`.padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function setDuration() {
    progressEl.max = videoEl.duration;
    const time = convertSecondsToMinutesAndSeconds(videoEl.duration);
    durationEl.textContent = time;
  }

  function updateProgress() {
    progressEl.value = videoEl.currentTime;
    const time = convertSecondsToMinutesAndSeconds(videoEl.currentTime);
    currentTimeEl.textContent = time;
  }

  function setProgress(e) {
    const { left } = progressEl.getBoundingClientRect();
    const pos = (e.pageX - left) / progressEl.offsetWidth;
    videoEl.currentTime = pos * videoEl.duration;
  }

  // Mute / unmute, volume bar
  function setVolume(e) {
    const volume = Number(e.target.value);
    const { muted } = videoEl;
    if (volume > 0 && muted) videoEl.muted = false;
    if (volume === 0 && !muted) videoEl.muted = true;
    videoEl.volume = volume;
  }

  function volumeChangeHandler() {
    const { muted, volume } = videoEl;
    const volumeBarValue = Number(volumeEl.value);

    // Check if mute and unmute buttons should be toggled
    if ((muted || volume === 0) && btnUnmute.classList.contains('hidden')) {
      btnMute.classList.add('hidden');
      btnUnmute.classList.remove('hidden');
    }
    if (!muted && volume > 0 && btnMute.classList.contains('hidden')) {
      btnUnmute.classList.add('hidden');
      btnMute.classList.remove('hidden');
    }
    // Check if muted
    if (muted && volumeBarValue !== 0) {
      volumeEl.value = 0;
      return;
    }
    // Check if volume has been changed by volume bar
    if (volumeBarValue === volume) return;

    volumeEl.value = volume;
  }

  // Picture-in-picture
  function togglePipButtons(state) {
    if (state === 'enter') {
      btnPipEnter.classList.add('hidden');
      btnPipExit.classList.remove('hidden');
    }
    if (state === 'exit') {
      btnPipExit.classList.add('hidden');
      btnPipEnter.classList.remove('hidden');
    }
  }

  // Fullscreen
  function toggleFullscreen() {
    const isFullscreen = videoPlayer.classList.contains('fullscreen');
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      // iOS
      if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else {
      if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
      }
      // iOS
      if (videoPlayer.webkitEnterFullscreen) {
        videoPlayer.webkitEnterFullscreen();
      }
    }
  }

  // Event listeners
  // Play / pause
  videoEl.addEventListener('play', () => {
    btnPlay.classList.add('hidden');
    btnPause.classList.remove('hidden');
  });
  videoEl.addEventListener('pause', () => {
    btnPause.classList.add('hidden');
    btnPlay.classList.remove('hidden');
  });

  videoEl.addEventListener('click', () => {
    videoEl[videoEl.paused ? 'play' : 'pause']();
  });
  btnPlay.addEventListener('click', () => videoEl.play());
  btnPause.addEventListener('click', () => videoEl.pause());

  // Time
  videoEl.addEventListener('durationchange', setDuration);
  videoEl.addEventListener('timeupdate', () => {
    if (!progressEl.max || progressEl.max === 1) setDuration();
    updateProgress();
  });
  progressEl.addEventListener('click', setProgress);

  // Volume
  [btnMute, btnUnmute].forEach((btn) =>
    btn.addEventListener('click', () => (videoEl.muted = !videoEl.muted))
  );
  volumeEl.addEventListener('change', setVolume);
  volumeEl.addEventListener('input', setVolume);
  videoEl.addEventListener('volumechange', volumeChangeHandler);

  // Playback speed
  speedEl.addEventListener(
    'change',
    (e) => (videoEl.playbackRate = Number(e.target.value))
  );

  // Picture-In-Picture
  btnPipEnter.addEventListener('click', () => {
    videoEl.requestPictureInPicture();
    togglePipButtons('enter');
  });
  btnPipExit.addEventListener('click', () => {
    document.exitPictureInPicture();
    togglePipButtons('exit');
  });
  videoEl.addEventListener('leavepictureinpicture', () =>
    togglePipButtons('exit')
  );

  // Fullscreen
  btnFullscreen.addEventListener('click', toggleFullscreen);
  videoPlayer.addEventListener('fullscreenchange', () => {
    videoPlayer.classList.toggle('fullscreen');
  });
})();
