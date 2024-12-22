import { startConfetti, stopConfetti } from './confetti.js';

(function () {
  // Elements
  const playerScoreEl = document.getElementById('player-score');
  const playerChoiceEl = document.getElementById('player-choice');
  const playerSignElements = [
    ...document.querySelector('.player .signs').children,
  ];

  const computerScoreEl = document.getElementById('computer-score');
  const computerChoiceEl = document.getElementById('computer-choice');
  const computerSignElements = [
    ...document.querySelector('.computer .signs').children,
  ];

  const btnReset = document.getElementById('btn-reset');
  const resultTextEl = document.querySelector('.result-text');

  // State
  const initialState = {
    player: {
      score: 0,
      choice: null,
    },
    computer: {
      score: 0,
      choice: null,
    },
    confettiIntervalId: null,
  };

  let state = structuredClone(initialState);

  const winChoices = {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['paper', 'spock'],
    spock: ['rock', 'scissors'],
  };

  function renderScore() {
    playerScoreEl.textContent = state.player.score;
    computerScoreEl.textContent = state.computer.score;
  }

  function resetPreviousChoicesDom() {
    playerSignElements
      .find((el) => el.id === `player-${state.player.choice}`)
      .classList.remove('selected');
    computerSignElements
      .find((el) => el.id === `computer-${state.computer.choice}`)
      .classList.remove('selected');
  }

  function showHideChoices(toShow = false) {
    if (toShow) {
      playerChoiceEl.textContent = `--- ${
        state.player.choice[0].toUpperCase() + state.player.choice.slice(1)
      }`;
      computerChoiceEl.textContent = `--- ${
        state.computer.choice[0].toUpperCase() + state.computer.choice.slice(1)
      }`;

      playerChoiceEl.classList.remove('hidden');
      computerChoiceEl.classList.remove('hidden');
    } else {
      playerChoiceEl.classList.add('hidden');
      computerChoiceEl.classList.add('hidden');

      playerChoiceEl.textContent = '';
      computerChoiceEl.textContent = '';
    }
  }

  function move(e) {
    // Checking if confetti should be cleared
    if (state.confettiIntervalId && tsParticles.domItem(0))
      stopConfetti(state.confettiIntervalId);

    const { player, computer } = state;

    if (player.choice) resetPreviousChoicesDom();

    // Player choice
    const playerChoice = e.target.id.split('-')[1];
    player.choice = playerChoice;
    e.target.classList.add('selected');

    // Computer choice
    const index = Math.round(Math.random() * 4);
    const computerChoice = computerSignElements[index].id.split('-')[1];
    computer.choice = computerChoice;
    computerSignElements[index].classList.add('selected');

    // Checking result and calculating score
    const result =
      playerChoice === computerChoice
        ? 'tie'
        : winChoices[playerChoice].includes(computerChoice)
        ? 'win'
        : 'loss';

    if (result === 'win') player.score += 1;
    if (result === 'loss') computer.score += 1;

    // Rendering score and choices
    renderScore();
    showHideChoices(true);

    resultTextEl.textContent =
      result === 'tie'
        ? "It's a tie."
        : result === 'win'
        ? 'You Won!'
        : 'You Lost!';

    // Launch confetti if player wins
    if (result === 'win') state.confettiIntervalId = startConfetti();
  }

  function reset() {
    stopConfetti(state.confettiIntervalId);
    resetPreviousChoicesDom();

    state = structuredClone(initialState);
    renderScore();
    showHideChoices();
    resultTextEl.textContent = '';
  }

  // Event listeners
  playerSignElements.forEach((el) => el.addEventListener('click', move));
  btnReset.addEventListener('click', () => {
    if (!state.player.choice) return;
    reset();
  });
})();
