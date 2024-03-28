'use strict';

(function bankTransactions() {
  /////////////////////////////////////////////////
  // Data
  const account1 = {
    owner: 'Robert Green',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
      '2023-11-18T21:31:17.178Z',
      '2023-12-23T07:42:02.383Z',
      '2024-01-28T09:15:04.904Z',
      '2024-02-01T10:17:24.185Z',
      '2024-02-08T14:11:59.604Z',
      '2024-02-27T17:01:17.194Z',
      '2024-03-05T20:36:17.929Z',
      '2024-03-07T08:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'de-DE',
  };

  const account2 = {
    owner: 'Tisha Hurley',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
      '2023-10-15T13:15:33.035Z',
      '2023-11-14T09:48:16.867Z',
      '2023-12-23T06:04:23.907Z',
      '2024-01-05T14:18:46.235Z',
      '2024-01-11T16:33:06.386Z',
      '2024-02-14T14:43:26.374Z',
      '2024-02-16T15:42:59.371Z',
      '2024-03-07T08:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };

  const account3 = {
    owner: 'Theodore Rush',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,

    movementsDates: [
      '2023-11-12T13:15:33.035Z',
      '2023-11-30T09:48:16.867Z',
      '2023-12-25T06:04:23.907Z',
      '2024-01-10T14:18:46.235Z',
      '2024-01-11T16:33:06.386Z',
      '2024-02-02T14:43:26.374Z',
      '2024-03-27T15:42:59.371Z',
      '2024-03-28T08:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT',
  };

  const account4 = {
    owner: 'Karl Wood',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,

    movementsDates: [
      '2023-11-28T13:15:33.035Z',
      '2023-12-16T09:48:16.867Z',
      '2023-12-25T06:04:23.907Z',
      '2024-01-17T14:18:46.235Z',
      '2024-01-19T16:33:06.386Z',
      '2024-02-23T14:43:26.374Z',
      '2024-03-25T15:42:59.371Z',
      '2024-03-28T08:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };

  const accounts = [account1, account2, account3, account4];

  /////////////////////////////////////////////////
  // Elements
  const testDataContainer = document.querySelector('.test-data');

  const labelWelcome = document.querySelector('.welcome');
  const labelDate = document.querySelector('.date');
  const labelBalance = document.querySelector('.balance__value');
  const labelSumIn = document.querySelector('.summary__value--in');
  const labelSumOut = document.querySelector('.summary__value--out');
  const labelSumInterest = document.querySelector('.summary__value--interest');
  const labelTimer = document.querySelector('.timer');

  const containerApp = document.querySelector('.app');
  const containerMovements = document.querySelector('.movements');

  const btnLogin = document.querySelector('.login__btn');
  const btnTransfer = document.querySelector('.form__btn--transfer');
  const btnLoan = document.querySelector('.form__btn--loan');
  const btnClose = document.querySelector('.form__btn--close');
  const btnSort = document.querySelector('.btn--sort');

  const inputLoginUsername = document.querySelector('.login__input--user');
  const inputLoginPin = document.querySelector('.login__input--pin');
  const inputTransferTo = document.querySelector('.form__input--to');
  const inputTransferAmount = document.querySelector('.form__input--amount');
  const inputLoanAmount = document.querySelector('.form__input--loan-amount');
  const inputCloseUsername = document.querySelector('.form__input--user');
  const inputClosePin = document.querySelector('.form__input--pin');

  /////////////////////////////////////////////////
  // Logic

  let currentAccount;
  let sorted = false;
  let timer;

  const displayMovements = (
    { movements, movementsDates, currency, locale },
    sort = false
  ) => {
    // Clear content of the movements container
    containerMovements.innerHTML = '';

    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    movs.forEach((mov, i) => {
      const type = mov > 0 ? 'deposit' : 'withdrawal';

      const movDate = new Date(movementsDates[i]);
      const daysPassed = calcDaysPassed(new Date(), movDate);
      const displayDate =
        daysPassed === 0
          ? 'Today'
          : daysPassed === 1
          ? 'Yesterday'
          : daysPassed <= 7
          ? `${daysPassed} days ago`
          : formatDate(movDate, locale);

      const formattedMov = formatCur(mov, locale, currency);

      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  };

  const calcDisplayBalance = (acc) => {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    const { balance, locale, currency } = acc;
    labelBalance.textContent = `${formatCur(balance, locale, currency)}`;
  };

  const calcDisplaySummary = ({
    movements,
    interestRate,
    currency,
    locale,
  }) => {
    const incomes = movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${formatCur(incomes, locale, currency)}`;

    const out = movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${formatCur(Math.abs(out), locale, currency)}`;

    const interest = movements
      .filter((mov) => mov > 0)
      .map((deposit) => (deposit * interestRate) / 100)
      .filter((int) => int >= 1)
      .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${formatCur(interest, locale, currency)}`;
  };

  const createUsernames = (accs) => {
    accs.forEach((acc) => {
      acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map((name) => name[0])
        .join('');

      const html = `<p class="test-data__row">Username: ${acc.username},\tPIN: ${acc.pin}</p>`;
      document
        .querySelector('.test-data div')
        .insertAdjacentHTML('beforeend', html);
    });
  };

  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const formatDate = (date, locale, options = {}) =>
    new Intl.DateTimeFormat(locale, options).format(date);

  const formatCur = (value, locale, currency) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
      value
    );

  const updateCurrentTime = ({ locale }) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const now = formatDate(new Date(), locale, options);

    labelDate.textContent = now;
  };

  const updateUI = (acc) => {
    // Clear input fields
    inputTransferTo.value =
      inputTransferAmount.value =
      inputLoanAmount.value =
      inputCloseUsername.value =
      inputClosePin.value =
        '';
    // Update the current time
    updateCurrentTime(acc);
    // Display movements
    displayMovements(acc);
    // Display balance
    calcDisplayBalance(acc);
    // Display summary
    calcDisplaySummary(acc);
  };

  const startLogOutTimer = () => {
    // Clear previous timer if it was set
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    // Set timer to 10 minutes
    let time = 300;
    const tick = () => {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      // On each call, print the remaining time to UI
      labelTimer.textContent = `${min}:${sec}`;
      // When the timer expires, stop the timer and log out the user
      if (time === 0) {
        clearInterval(timer);
        logOut();
      } else {
        // Decrease 1s
        time--;
      }
    };
    // Call the timer every second
    tick();
    timer = setInterval(tick, 1000);
  };

  const logOut = () => {
    currentAccount = null;
    // Hide UI and change message
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  };

  // Event Listeners
  btnLogin.addEventListener('click', (e) => {
    // Prevent form from submitting
    e.preventDefault();

    currentAccount = accounts.find(
      ({ username, pin }) =>
        username === inputLoginUsername.value && pin === +inputLoginPin.value
    );

    if (currentAccount) {
      // Clear input fields
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginUsername.blur();
      inputLoginPin.blur();
      // Display UI and message
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;

      containerApp.style.opacity = 1;
      // Hide box with accounts data
      testDataContainer.style.display = 'none';
      startLogOutTimer();
      updateUI(currentAccount);
    }
  });

  btnTransfer.addEventListener('click', (e) => {
    e.preventDefault();

    const receiverAcc = accounts.find(
      ({ username }) => username === inputTransferTo.value
    );
    if (receiverAcc && receiverAcc !== currentAccount) {
      const amount = +inputTransferAmount.value;
      if (amount > 0 && currentAccount.balance >= amount) {
        // Make transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        // Add transfer date
        const nowIso = new Date().toISOString();
        currentAccount.movementsDates.push(nowIso);
        receiverAcc.movementsDates.push(nowIso);
        startLogOutTimer();
        updateUI(currentAccount);
      }
    }
  });

  btnLoan.addEventListener('click', (e) => {
    e.preventDefault();

    const amount = Math.floor(inputLoanAmount.value);
    if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov >= amount * 0.1)
    ) {
      setTimeout(() => {
        // Add movement
        const nowIso = new Date().toISOString();
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(nowIso);
        startLogOutTimer();
        updateUI(currentAccount);
      }, 2500);
    }
  });

  btnClose.addEventListener('click', (e) => {
    e.preventDefault();

    if (
      inputCloseUsername.value === currentAccount.username &&
      +inputClosePin.value === currentAccount.pin
    ) {
      const index = accounts.findIndex(
        ({ username }) => username === currentAccount.username
      );
      // Delete account
      accounts.splice(index, 1);
      // Reset the timer
      clearInterval(timer);
      timer = null;
      // Log out
      logOut();
    }
  });

  btnSort.addEventListener('click', () => {
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
  });

  createUsernames(accounts);
})();
