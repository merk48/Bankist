'use strict';

// BANKIST APP

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-03-01T23:36:17.929Z',
    '2023-03-05T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-03-22T23:36:17.929Z',
    '2023-03-05T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2017-11-01T13:15:33.035Z',
    '2018-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2023-02-28T23:36:17.929Z',
    '2023-03-05T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2023-02-27T23:36:17.929Z',
    '2023-03-05T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2, account3, account4];

// Elements
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

console.log(accounts);
//^ ------- START PROJECT --------

//^ [*1*] Create Users Names .. add username (first letter from each name) to each account
accounts.forEach(
  account =>
    (account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join(''))
);
console.log(accounts);

//^ [*2*] Login

let currentAccount, balance, timer;

btnLogin.addEventListener('click', function (event) {
  //  {1} Prevent form from submitting
  event.preventDefault();

  //  {2} Check from the username
  //   If the currentAccount has been found will continue
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  //  {3} Check if the pin is true
  //      Call the accountDisplay fn with the login account
  if (currentAccount?.pin === +inputLoginPin.value)
    accountDisplay(currentAccount, false);
});

//^ [*3*] Format Local Currency fn

const formatCur = (value, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

//^ [*4*] Display the account

// let balance , timer;

const accountDisplay = (account, sort) => {
  //& Correct: [1] Display UI and message ✔

  //   {1} Preview App ✔
  containerApp.style.opacity = 1;

  //   {2} Welcome Label ✔
  labelWelcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}`;

  //   {3} Clear the input fields ✔
  inputLoginPin.value = inputLoginUsername.value = '';

  //   {4} Remove the focus stat
  inputLoginPin.blur();

  //   {5} Clear the timer from previous logIN with someOne else
  if (timer) clearInterval(timer);

  //   {6} Create the current date and time
  const currentDate = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    account.locale,
    options
  ).format(currentDate);

  //& [2] Display Movements ✔

  //   {1} Check the sorting ...using slice to take a copy of movements array not the original
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  //   {2} Empty the entire container ✔
  containerMovements.innerHTML = '';

  //   {3} Adding the new movements ✔
  movs.forEach((movement, index) => {
    //      {*} Defined the mov type
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    //      {*} Create Movements date and time
    const movDate = new Date(new Date(account.movementsDates[index]));

    const calcDaysPasses = (date1, date2) => {
      const days = Math.round(Math.abs(+date2 - +date1) / 1000 / 60 / 60 / 24);
      return days === 0
        ? 'Today'
        : days === 1
        ? 'Yesterday'
        : days <= 7
        ? days + ' days ago'
        : new Intl.DateTimeFormat(account.locale).format(date2);
    };
    const displayDate = calcDaysPasses(new Date(), movDate);

    //    {*}
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatCur(
      movement,
      account.locale,
      account.currency
    )}</div>
    </div>`;

    //    {*}
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

  //& [2] Calc and Display Balance (the sum of movements) for the account ✔
  balance = account.movements.reduce((acc, curr) => acc + curr);
  labelBalance.textContent = `${balance.toFixed(2)}€`;
  labelBalance.textContent = formatCur(
    balance,
    account.locale,
    account.currency
  );

  //& [3] Calc and Display Summary (in,out and interest) ✔
  //   {1} In (Deposits) ✔
  const summaryIn = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = formatCur(
    summaryIn,
    account.locale,
    account.currency
  );

  //   {2} out (Withdrews) ✔
  const summaryOut = Math.abs(
    account.movements
      .filter(mov => mov < 0)
      .reduce((acc, curr) => acc + curr, 0)
  );
  labelSumOut.textContent = formatCur(
    summaryOut,
    account.locale,
    account.currency
  );
  //  {3} interest (tax) ... Deposits * interestRate / 100, and any mov < 1 will not added ✔
  const summaryInterest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = formatCur(
    summaryInterest,
    account.locale,
    account.currency
  );

  //& [4] Implementing a countdown timer ✔
  let time = 600;

  //  {*} Tick (timer fn)
  const tick = () => {
    //  {1} Format the timer
    let min = `${Math.trunc(time / 60)}`.padStart(2, '0');
    let sec = `${time % 60}`.padStart(2, '0');

    //  {2} Set the timer to labelTimer
    labelTimer.textContent = `${min}:${sec}`;

    //  {3} When 0 seconds, stop and log out user
    if (time === 0) {
      //  {1} stop the timer
      clearInterval(timer);

      //  {2} Log the user out (Hide Ui) ✔
      //    1. Hide App ✔
      containerApp.style.opacity = 0;

      //    2. Return the Log in label ✔
      labelWelcome.textContent = 'Log in to get started';
    }

    //  {4} Decrese 1s
    time--;
  };

  //  {*} Call the timer immediatly
  tick();

  //  {*} Call the timer every second ..Start/Restar.. the timer
  timer = setInterval(tick, 1000);
};

//^ [*5*] Transfer money operation ✔

btnTransfer.addEventListener('click', event => {
  //  {1} Prevent form from submitting
  event.preventDefault();

  //  {2} Find the accountTo ✔
  const accountTo = accounts.find(
    account => account.username === inputTransferTo.value
  );

  /*  {3} Check if accountTO does found ✔
      + check if the accountTO isn't the same currentAccount ✔
      + if there is enough money in the balance ✔
      + if the transfer ammount in an able value (pos) ✔ */
  if (
    accountTo !== undefined &&
    accountTo?.username !== currentAccount.username &&
    balance >= +inputTransferAmount.value &&
    +inputTransferAmount.value > 0
  ) {
    //  {4} If the accountTo dose found Increase the transferme amount to the accountTo movements ✔
    accountTo?.movements.push(+inputTransferAmount.value);

    //  {5} Decrease the transferme amount from the currentAccount movements ✔
    currentAccount?.movements.push(-inputTransferAmount.value);

    //  {5} Add this transfer mov it's date
    const movDate = new Date().toISOString();
    currentAccount?.movementsDates.push(movDate);
    accountTo?.movementsDates.push(movDate);

    //  {6} Update UI: Call the accountDisplay fn for apply the changes ✔
    accountDisplay(currentAccount);
  }

  //  {7} Clear the input fields ✔
  inputTransferAmount.value = inputTransferTo.value = '';
});

//^ [*6*] Request loan  ✔

btnLoan.addEventListener('click', event => {
  //  {1} Prevent form from submitting
  event.preventDefault();

  //  {2} Round the leon amount down and its directly dose type courtion
  const amount = Math.floor(inputLoanAmount.value);

  //  {3} Check if any deposit is >= 10% of the leonAmount
  const anyDeposits = currentAccount.movements.some(mov => mov >= amount * 0.1);

  if (amount > 0 && anyDeposits) {
    setTimeout(function () {
      //  {4} Increase the currentAccount movements ✔
      currentAccount.movements.push(amount);

      //  {5} Add this transfer mov it's date
      const movDate = new Date().toISOString();
      currentAccount?.movementsDates.push(movDate);

      //  {6} Update UI: Call the accountDisplay fn for apply the changes ✔
      accountDisplay(currentAccount);
    }, 2500);
  }

  //  {7} Clear the input fields ✔
  inputLoanAmount.value = '';
});

//^ [*7*] Close an account operation ✔

btnClose.addEventListener('click', event => {
  //  {1} Prevent form from submitting ✔
  event.preventDefault();

  //  {2} Check of credentials (username & pin) ✔
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    //  {3} Find the Index of the currentAccount ✔
    const currentAccountIndex = accounts.findIndex(
      account => account.username === inputCloseUsername
    );
    //  {4} Delete the account from accounts array ✔
    accounts.splice(currentAccountIndex, 1);

    //  {5} Log the user out (Hide Ui) ✔
    //    1. Hide App ✔
    containerApp.style.opacity = 0;

    //    2. Return the Log in label ✔
    labelWelcome.textContent = 'Log in to get started';
  }
  //  {6} Clear the input fields ✔
  inputCloseUsername.value = inputClosePin.value = '';
});

//^ [*8*] Sorting btn ✔

let sorted = false;

btnSort.addEventListener('click', event => {
  //  {1} Prevent form from submitting ✔
  event.preventDefault();

  //  {2} Update UI: Call the accountDisplay for flaping the sort ✔
  accountDisplay(currentAccount, !sorted);

  //  {3} Flapping the sort argument
  sorted = !sorted;
});
