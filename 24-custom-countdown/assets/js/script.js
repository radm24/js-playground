'use strict';

(function () {
  // Timer windows
  const startWindow = document.querySelector('.start');
  const countdownWindow = document.querySelector('.countdown');
  const completionWindow = document.querySelector('.completion');
  const windowsArr = [startWindow, countdownWindow, completionWindow];

  // Timer form controls
  const titleInput = document.getElementById('timer-title');
  const timeInput = document.getElementById('timer-time');
  const btnSubmit = document.getElementById('btn-submit');
  const btnReset = document.getElementById('btn-reset');
  const btnNewCountdown = document.getElementById('btn-new-countdown');

  // Countdown elements
  const timerTitleEl = document.querySelector('.countdown h1');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // Timer completion elements
  const completionInfoEl = document.getElementById('completion-info');
  const timerAlarm = document.getElementById('completion-sound');

  // Time constants
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  let timerTitle, timerTime, intervalId;

  function initialLoad() {
    const timer = JSON.parse(localStorage.getItem('countdown'));
    if (!timer) return;

    timerTitle = timer.title;
    timerTime = new Date(timer.date);
    startCountdown();
  }

  function showWindow(windotToShow) {
    windowsArr.forEach((window) => {
      if (window === windotToShow) {
        window.classList.remove('hidden');
      } else {
        window.classList.add('hidden');
      }
    });
  }

  function executeTimerStep(distance) {
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;

    return distance - 1000;
  }

  function startCountdown() {
    let distance = timerTime - new Date();
    if (distance < 1000) return completeCountdown();

    if (timerTitle) timerTitleEl.textContent = timerTitle;
    distance = executeTimerStep(distance);

    intervalId = setInterval(() => {
      if (distance < 1000) return completeCountdown();

      distance = executeTimerStep(distance);
    }, 1000);

    showWindow(countdownWindow);
  }

  function resetCountdown() {
    timerAlarm.pause();
    timerAlarm.currentTime = 0;

    clearInterval(intervalId);
    localStorage.clear();

    timerTime = '';
    timerTitle = '';

    showWindow(startWindow);
  }

  function completeCountdown() {
    if (intervalId) clearInterval(intervalId);

    completionInfoEl.textContent = `${
      timerTitle ? timerTitle : 'Timer'
    } finished on ${timerTime.toLocaleString()}`;

    showWindow(completionWindow);
    timerAlarm.play();
  }

  // Event listeners
  timeInput.addEventListener(
    'click',
    (e) => {
      // Set min time to the current time
      const now = new Date();
      const nowPlusMinute = now.setMinutes(now.getMinutes() + 1);
      timeInput.min = new Date(nowPlusMinute).toISOString().slice(0, -8);

      e.target.showPicker();
    },
    true
  );

  btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    if (!timeInput.value) return alert('Please set time for the countdown.');

    timerTime = new Date(timeInput.value);
    if (timerTime - new Date() <= 0)
      return alert('The selected time has passed.');

    if (titleInput.value) timerTitle = titleInput.value;

    // Save countdown to local storage
    localStorage.setItem(
      'countdown',
      JSON.stringify({ title: timerTitle, date: timerTime })
    );

    startCountdown();
  });

  [btnReset, btnNewCountdown].forEach((btn) =>
    btn.addEventListener('click', resetCountdown)
  );

  initialLoad();
})();
