'use strict';

(function pictureInPicture() {
  const button = document.querySelector('#button');
  const audioEl = document.querySelector('#audio');

  const toggleButton = () => {
    button.disabled = !button.disabled;
  };

  // Get verbal representation of joke text by using Voice RSS API
  const tellJoke = (joke) => {
    VoiceRSS.speech({
      key: 'APIKEY',
      src: joke,
      hl: 'en-us',
      v: 'Linda',
      r: 0,
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false,
      target: audioEl,
    });
  };

  // Get jokes from JokeAPI
  const getJokes = async () => {
    const apiUrl =
      'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      // Resolve single and twopart joke types
      const joke = data.setup
        ? `${data.setup} ... ${data.delivery}`
        : data.joke;
      // Pass joke string to Voice RSS API
      tellJoke(joke);
      // Disable button
      toggleButton();
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  button.addEventListener('click', getJokes);
  audioEl.addEventListener('ended', toggleButton);
})();
