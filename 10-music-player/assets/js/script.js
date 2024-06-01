'use strict';

(function musicPlayer() {
  let isPlaying = false;
  let currentTrack = 0;
  let isDurationSet = true;

  const tracks = [
    {
      filename: 'track1',
      trackName: 'Forlorn Craving',
      artist: 'Ron Gelinas Chill Beats',
    },
    {
      filename: 'track2',
      trackName: 'Brazilian Phonk',
      artist: 'Alex-Productions',
    },
    {
      filename: 'track3',
      trackName: 'Believe It',
      artist: 'Alex-Productions',
    },
    {
      filename: 'track4',
      trackName: 'Cherry Metal',
      artist: 'Arthur Vyncke',
    },
  ];

  const getElById = (id) => document.getElementById(id);

  const audioEl = getElById('audio');
  // Track data
  const coverArt = getElById('cover-art');
  const trackTitle = getElById('title');
  const artistName = getElById('artist');
  // Progress
  const progressContainer = getElById('progress-container');
  const progressEl = getElById('progress');
  const currentTimeEl = getElById('current-time');
  const durationEl = getElById('duration');
  // Controls
  const btnPrev = getElById('prev');
  const btnPlay = getElById('play');
  const btnNext = getElById('next');

  const playTrack = () => audioEl.play();

  // Toggle playing state of the app
  const togglePlayPause = () => {
    isPlaying ? audioEl.pause() : playTrack();
    isPlaying = !isPlaying;
    // Toggle play button appearance (play / pause)
    btnPlay.classList.toggle('fa-play');
    btnPlay.classList.toggle('fa-pause');
    btnPlay.setAttribute('title', isPlaying ? 'Pause' : 'Play');
  };

  const loadAndPlayTrack = ({ filename, trackName, artist }) => {
    // Reset duration set flag
    isDurationSet = false;
    // Load new track data
    coverArt.src = `./assets/img/${filename}.jpg`;
    audioEl.src = `./assets/music/${filename}.mp3`;
    trackTitle.textContent = trackName;
    artistName.textContent = artist;
    // If music is not playing then toggle playing state
    !isPlaying && togglePlayPause();
    playTrack();
  };

  // Play the previous track
  const prevTrack = () => {
    currentTrack = currentTrack ? currentTrack - 1 : tracks.length - 1;
    loadAndPlayTrack(tracks[currentTrack]);
  };

  // Play the next track
  const nextTrack = () => {
    currentTrack = currentTrack === tracks.length - 1 ? 0 : currentTrack + 1;
    loadAndPlayTrack(tracks[currentTrack]);
  };

  const convertTimeToMinutesAndSeconds = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    const convertedTime = `${minutes}:${seconds}`;
    return [convertedTime, seconds];
  };

  const updateProgressBar = (e) => {
    if (isPlaying) {
      // Calculate track progress percentage and update the progress bar
      const { currentTime, duration } = e.srcElement;
      const progressPercent = (currentTime / duration) * 100;
      progressEl.style.width = `${progressPercent}%`;
      if (!isDurationSet) {
        // Calculate track duration and set it to duration element
        const [convertedTime, durationSeconds] =
          convertTimeToMinutesAndSeconds(duration);
        // Add delay to tracks switching to avoid NaN
        if (durationSeconds) {
          durationEl.textContent = convertedTime;
          isDurationSet = true;
        }
      }
      // Calculate track progress time and set it to current-time element
      const [convertedTime] = convertTimeToMinutesAndSeconds(currentTime);
      currentTimeEl.textContent = convertedTime;
    }
  };

  // Fast-forward or rewind the track
  const setProgressBar = (e) => {
    const progressContainerWidth = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audioEl.currentTime = audioEl.duration * (clickX / progressContainerWidth);
  };

  btnPrev.addEventListener('click', prevTrack);
  btnPlay.addEventListener('click', togglePlayPause);
  btnNext.addEventListener('click', nextTrack);
  audioEl.addEventListener('timeupdate', updateProgressBar);
  audioEl.addEventListener('ended', nextTrack);
  progressContainer.addEventListener('click', setProgressBar);
})();
