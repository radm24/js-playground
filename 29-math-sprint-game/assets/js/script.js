'use strict';

(function () {
  // Elements
  const startForm = document.querySelector('.start__form');
  const countdownPage = document.querySelector('.countdown');
  const gamePage = document.querySelector('.quiz');
  const scorePage = document.querySelector('.score-page');

  const startOptionsList = document.querySelector('.start__options');
  const startOptionsItems = [...document.querySelectorAll('.start__option')];
  const equationsList = document.querySelector('.quiz__list');

  const highscoreElements = {};
  ['10', '25', '50', '99'].forEach(
    (id) =>
      (highscoreElements[id] = document
        .getElementById(id)
        .closest('.start__option')
        .querySelector('.highscore__value'))
  );
  const countdownEl = document.querySelector('.countdown__text');
  const finalTimeValEl = document.getElementById('final-time-value');
  const baseTimeValEl = document.getElementById('base-time-value');
  const penaltyTimeValEl = document.getElementById('penalty-time-value');

  const btnWrong = document.querySelector('.btn--wrong');
  const btnRight = document.querySelector('.btn--right');
  const btnReset = document.querySelector('.btn--reset');

  // Constants
  const countdownInitialSeconds = 3;
  const operators = [
    { sign: '-', method: (a, b) => a - b },
    { sign: '+', method: (a, b) => a + b },
    { sign: '*', method: (a, b) => a * b },
    { sign: '/' },
  ];
  const minLimit = 0.33;
  const maxLimit = 0.66;
  const maxInt = 9;
  const maxWrongFormats = 3;
  const penaltySeconds = 2;

  // State
  let highscores = {
    10: null,
    25: null,
    50: null,
    99: null,
  };
  let numQuestions = null;
  let equations = [];
  let equationsDom = [];
  let currentEquation = null;
  let userAnswers = [];
  let startTime = null;

  function getHighscoresStorage() {
    const data = JSON.parse(localStorage.getItem('highscores'));
    if (!data) return;
    highscores = data;
    for (const [id, highscore] of Object.entries(highscores)) {
      highscoreElements[id].textContent =
        highscore !== null ? `${highscore}s` : '0.0s';
    }
  }

  function selectStartOption(e) {
    const option = e.target.closest('.start__option');
    if (!option || option.classList.contains('.start__option--selected'))
      return;

    startOptionsItems.forEach((item) =>
      item.classList.remove('start__option--selected')
    );
    option.classList.add('start__option--selected');

    numQuestions = Number(option.querySelector('input').value);
  }

  function switchPages(currentPage, newPage) {
    currentPage.classList.add('hidden');
    newPage.classList.remove('hidden');
  }

  function startGame(e) {
    e.preventDefault();
    const formData = new FormData(startForm);
    numQuestions = Number(formData.get('numQuestions'));
    generateEquations();
    renderEquations();
    switchPages(startForm, countdownPage);
    startCountdown();
  }

  function startCountdown() {
    let countdownSeconds = countdownInitialSeconds;
    const intervalId = setInterval(() => {
      if (countdownSeconds === 0) {
        clearInterval(intervalId);
        switchPages(countdownPage, gamePage);
        return;
      }
      countdownSeconds--;
      countdownEl.textContent =
        countdownSeconds === 0 ? 'GO!' : countdownSeconds;
    }, 1000);
  }

  function getRandomInt(max) {
    return Math.round(Math.random() * max);
  }

  function generateWrongEquation(operator, a, b, c, format) {
    let equation;
    if (operator === '/') {
      switch (format) {
        case 0:
          equation =
            a === 0 ? `${a + 1} / ${b} = ${c}` : `${a} / ${b + 1} = ${c}`;
          break;
        case 1:
          equation = `${a} / ${b} = ${c + 1}`;
          break;
        case 2:
          equation = `${a} / ${b} = ${c - 1}`;
          break;
        default:
          break;
      }
    }
    if (operator === '*') {
      const finalFormat = a === 0 ? 0 : b === 0 ? 1 : format;
      equation = [
        `${a + 1} * ${b} = ${c}`,
        `${a} * ${b + 1} = ${c}`,
        `${a} * ${b} = ${c - 1}`,
      ][finalFormat];
    }
    if (operator === '-' || operator === '+') {
      equation = [
        `${a + 1} ${operator} ${b} = ${c}`,
        `${a} ${operator} ${b + 1} = ${c}`,
        `${a} ${operator} ${b} = ${c - 1}`,
      ][format];
    }
    return equation;
  }

  function generateEquation(isCorrect = true) {
    const equation = { isCorrect };
    const operator = operators[getRandomInt(operators.length - 1)];
    if (operator.sign === '/') {
      const quotient = getRandomInt(maxInt);
      let divisor = getRandomInt(maxInt);
      if (divisor === 0) divisor = 1;
      const divident = quotient * divisor;

      // Checking if wrong equation should be generated
      if (!isCorrect) {
        const format = getRandomInt(maxWrongFormats - 1);
        equation.equation = generateWrongEquation(
          operator.sign,
          divident,
          divisor,
          quotient,
          format
        );
      } else {
        equation.equation = `${divident} / ${divisor} = ${quotient}`;
      }
    } else {
      const firstNum = getRandomInt(maxInt);
      const secondNum = getRandomInt(maxInt);
      const result = operator.method(firstNum, secondNum);

      // Checking if wrong equation should be generated
      if (!isCorrect) {
        const format = getRandomInt(maxWrongFormats - 1);
        equation.equation = generateWrongEquation(
          operator.sign,
          firstNum,
          secondNum,
          result,
          format
        );
      } else {
        equation.equation = `${firstNum} ${operator.sign} ${secondNum} = ${result}`;
      }
    }
    return equation;
  }

  function generateEquations() {
    const numCorrectEquations = Math.max(
      Math.floor(numQuestions * minLimit),
      getRandomInt(Math.floor(numQuestions * maxLimit))
    );
    const numWrongEquations = numQuestions - numCorrectEquations;

    for (let i = 0; i < numCorrectEquations; i++) {
      const equation = generateEquation();
      equations.push(equation);
    }

    for (let i = 0; i < numWrongEquations; i++) {
      const equation = generateEquation(false);
      equations.push(equation);
    }

    shuffleArray(equations);
    return equations;
  }

  // Shuffle an array in-place
  function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function renderEquations() {
    let html = '';
    equations.forEach(({ equation }, idx) => {
      html += `
        <li class="quiz__list-item 
          ${idx === 0 ? 'quiz__list-item--selected' : ''}
        ">
          <p>${equation}</p>
        </li>
      `;
    });
    equationsList.insertAdjacentHTML('afterbegin', html);
    equationsDom = [...equationsList.children];
    currentEquation = 0;
  }

  function select(answer) {
    if (currentEquation === 0) startTime = Date.now();
    userAnswers.push(answer);

    // If it's the last equation then calculate score and show the score page
    if (currentEquation === equationsDom.length - 1) {
      calculateScore(Date.now());
      switchPages(gamePage, scorePage);
      return;
    }

    equationsDom[currentEquation].classList.remove('quiz__list-item--selected');
    currentEquation++;
    equationsDom[currentEquation].classList.add('quiz__list-item--selected');

    // Show the next equation at the same spot
    const height = equationsDom[0].offsetHeight;
    const currentMarginTop = getComputedStyle(equationsDom[0])['margin-top'];
    equationsDom[0].style['margin-top'] =
      parseFloat(currentMarginTop) - height + 'px';
  }

  function calculateScore(finishTime) {
    // Calculate score
    const numWrongAnswers = userAnswers.reduce(
      (acc, answer, idx) => acc + Number(answer !== equations[idx].isCorrect),
      0
    );

    const baseTime = (finishTime - startTime) / 1000;
    const penaltyTime = penaltySeconds * numWrongAnswers;
    const finalTime = baseTime + penaltyTime;

    // Render score
    baseTimeValEl.textContent = `${baseTime.toFixed(1)}s`;
    penaltyTimeValEl.textContent = `${penaltyTime.toFixed(1)}s`;
    finalTimeValEl.textContent = `${finalTime.toFixed(1)}s`;

    // Checking highscores
    checkSaveHighscore(finalTime.toFixed(1));
  }

  function checkSaveHighscore(score) {
    const highscore = highscores[numQuestions];
    if (highscore !== null && Number(highscore) <= Number(score)) return;

    // Save new highscore to local storage and update the starting page
    highscores[numQuestions] = score;
    localStorage.setItem('highscores', JSON.stringify(highscores));
    highscoreElements[String(numQuestions)].textContent = `${score}s`;
  }

  function resetGame() {
    numQuestions = null;
    equations = [];
    equationsList.replaceChildren();
    equationsDom = [];
    currentEquation = null;
    userAnswers = [];
    startTime = null;
    countdownEl.textContent = countdownInitialSeconds;
    switchPages(scorePage, startForm);
  }

  // Event Listeners
  startOptionsList.addEventListener('click', selectStartOption);
  startForm.addEventListener('submit', startGame);
  btnWrong.addEventListener('click', () => select(false));
  btnRight.addEventListener('click', () => select(true));
  btnReset.addEventListener('click', resetGame);

  getHighscoresStorage();
})();
