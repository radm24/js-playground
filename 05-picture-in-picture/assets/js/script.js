'use strict';

(function pictureInPicture() {
  const videoEl = document.querySelector('#video');
  const button = document.querySelector('#button');
  const buttonText = document.querySelector('#button--text');

  const selectMediaStream = async () => {
    try {
      // Prompt the user to select a display, window or tab to share
      const captureStream = await navigator.mediaDevices.getDisplayMedia();
      videoEl.srcObject = captureStream;
      videoEl.onloadedmetadata = () => {
        videoEl.play();
      };
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  const togglePictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement) {
        // Leave picture-in-picture mode
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        // Enter picture-in-picture mode
        await videoEl.requestPictureInPicture();
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  button.addEventListener('click', togglePictureInPicture);

  videoEl.addEventListener('enterpictureinpicture', () => {
    buttonText.textContent = 'Leave PIP';
  });
  videoEl.addEventListener('leavepictureinpicture', () => {
    buttonText.textContent = 'Enter PIP';
  });

  selectMediaStream();
})();
