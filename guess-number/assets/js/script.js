'use strict';

(function gameLogic() {
  // set game state
  const state = {};

  startGame('new');

  document.querySelector('.check').addEventListener('click', checkGuess);
  document
    .querySelector('.again')
    .addEventListener('click', () => startGame('reset'));

  function startGame(type, min = 1, max = 20) {
    state.secretNum = Math.floor(Math.random() * (max - min + 1) + min);
    state.score = 20;
    printScore();
    // reset html elements to initial state
    if (type !== 'new') {
      resetGame();
    }
  }

  function printScore() {
    document.querySelector('.score').textContent = state.score;
  }

  function resetGame() {
    document.querySelector('.guess').value = '';
    const status = getGameStatus();
    if (status !== 'Start guessing...') {
      setGameStatus('Start guessing...');
    }
    if (status === '🎉 You won!' || status === '💥 You lost the game!') {
      stopSound();
      document.body.style.backgroundColor = '#222';
      document.querySelector('.number').textContent = '?';
      document.querySelector('.number').style.width = '15rem';
      setEnabled('.guess');
      setEnabled('.check');
    }
  }

  function checkGuess() {
    const guess = document.querySelector('.guess').value;
    if (guess) {
      const secretNum = state.secretNum;
      if (guess == secretNum) {
        setGameStatus('🎉 You won!');
        document.body.style.backgroundColor = '#60b347';
        document.querySelector('.number').textContent = secretNum;
        document.querySelector('.number').style.width = '30rem';
        // disable number input and check button
        stopGame();
        checkHighscore();
        playSound('#win-sound');
      } else if (guess > secretNum) {
        setGameStatus('📈 Too high!');
        decreaseScore();
      } else {
        setGameStatus('📉 Too low!');
        decreaseScore();
      }
    } else {
      setGameStatus('⛔️ No number!');
    }
  }

  function getGameStatus() {
    return document.querySelector('.message').textContent;
  }

  function setGameStatus(text) {
    document.querySelector('.message').textContent = text;
  }

  function stopGame() {
    setDisabled('.guess');
    setDisabled('.check');
  }

  function setDisabled(elClass) {
    document.querySelector(elClass).setAttribute('disabled', true);
  }

  function setEnabled(elClass) {
    document.querySelector(elClass).removeAttribute('disabled');
  }

  function checkHighscore() {
    if (
      (state.highscore && state.score > state.highscore) ||
      !state.highscore
    ) {
      state.highscore = state.score;
      setHighscore(state.highscore);
    }
  }

  function setHighscore(highscore) {
    document.querySelector('.highscore').textContent = highscore;
  }

  function decreaseScore() {
    if (state.score > 0) {
      state.score--;
      printScore();
      if (!state.score) {
        setGameStatus('💥 You lost the game!');
        stopGame();
        playSound('#loss-sound');
      }
    }
  }

  function playSound(elId) {
    document.querySelector(elId).play();
  }

  function stopSound() {
    document.querySelector('#win-sound').pause();
    document.querySelector('#win-sound').currentTime = 0;
    document.querySelector('#loss-sound').pause();
    document.querySelector('#loss-sound').currentTime = 0;
  }
})();
