'use strict';

(function gameLogic() {
  let scores, currentScore, activePlayer, playing;

  const getElBySelector = (selector) => {
    return document.querySelector(selector);
  };

  // Player 1 is 0, player 2 is 1
  const playerOneEl = getElBySelector('.player--0');
  const playerTwoEl = getElBySelector('.player--1');
  const scoreOneEl = getElBySelector('#score--0');
  const scoreTwoEl = getElBySelector('#score--1');
  const currentScoreOneEl = getElBySelector('#current--0');
  const currentScoreTwoEl = getElBySelector('#current--1');

  const diceEl = getElBySelector('.dice');
  const btnNewGame = getElBySelector('.btn--new');
  const btnRollDice = getElBySelector('.btn--roll');
  const btnHold = getElBySelector('.btn--hold');

  const winSound = getElBySelector('#win-sound');

  const setGameBtnsDisabled = (disabled) => {
    btnRollDice.toggleAttribute('disabled', disabled);
    btnHold.toggleAttribute('disabled', disabled);
  };

  const hideDice = (hide) => {
    diceEl.classList.toggle('hidden', hide);
  };

  const init = () => {
    // Start a new game
    if (winSound.currentTime > 0) {
      winSound.pause();
      winSound.currentTime = 0;
    }
    setGameBtnsDisabled(false);

    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    [scoreOneEl, scoreTwoEl, currentScoreOneEl, currentScoreTwoEl].forEach((el) => {
      el.textContent = 0;
    });
    hideDice(true);
    playerOneEl.classList.remove('player--winner');
    playerTwoEl.classList.remove('player--winner');
    playerOneEl.classList.add('player--active');
    playerTwoEl.classList.remove('player--active');
  };

  const resetCurrentScore = () => {
    currentScore = 0;
    getElBySelector(`#current--${activePlayer}`).textContent = 0;
  };

  const switchPlayers = () => {
    playerOneEl.classList.toggle('player--active');
    playerTwoEl.classList.toggle('player--active');
    // Player 1 is 0, player 2 is 1
    activePlayer = activePlayer ? 0 : 1;
  };

  const rollDice = () => {
    if (playing) {
      // Show dice img if it's hidden
      if (diceEl.classList.contains('hidden')) {
        diceEl.classList.remove('hidden');
      }
      // Generate dice
      const dice = Math.floor(Math.random() * 6 + 1);
      // Change dice img
      diceEl.src = `./assets/img/dice-${dice}.png`;
      if (dice === 1) {
        // Reset the current score of an active player
        resetCurrentScore();
        // Switch to the next player
        switchPlayers();
      } else {
        currentScore += dice;
        getElBySelector(`#current--${activePlayer}`).textContent = currentScore;
      }
    }
  };

  const hold = () => {
    if (playing) {
      // Save the current score of an active player
      scores[activePlayer] += currentScore;
      getElBySelector(`#score--${activePlayer}`).textContent = scores[activePlayer];
      resetCurrentScore();
      // Check if an active player won
      if (scores[activePlayer] >= 100) {
        // Finish the game
        playing = false;
        diceEl.classList.add('hidden');
        getElBySelector(`.player--${activePlayer}`).classList.add('player--winner');
        getElBySelector(`.player--${activePlayer}`).classList.remove('player--active');
        winSound.play();
      } else {
        // Switch to the next player
        switchPlayers();
      }
    }
  };

  btnNewGame.addEventListener('click', init);
  btnRollDice.addEventListener('click', rollDice);
  btnHold.addEventListener('click', hold);
})();
