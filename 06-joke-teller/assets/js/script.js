'use strict';

(function jokeTeller() {
  const proxy = 'http://localhost:8080/'; // local proxy

  const settings = {
    lang: 'en',
    voice: 'male',
    filter: 'safe',
  };

  const languagePack = {
    en: {
      'lang-label': 'Language',
      'voice-label': 'Voice',
      'filter-label': 'Filter',
      'joke-button': 'Tell Me A Joke',
      'filter-icon': './assets/img/filter-en.png',
    },
    ru: {
      'lang-label': 'Язык',
      'voice-label': 'Голос',
      'filter-label': 'Фильтр',
      'joke-button': 'Расскажи Шутку',
      'filter-icon': './assets/img/filter-ru.png',
    },
  };

  const jokeSources = {
    en: {
      safe: {
        url: [
          'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit',
        ],
      },
      any: {
        url: ['https://v2.jokeapi.dev/joke/Any'],
      },
    },
    ru: {
      safe: {
        url: [
          proxy + 'https://anekdoty.ru/',
          proxy + 'https://www.anekdot.ru/random/anekdot/',
        ],
        parseSelector: ['.holder-body p', '.content .text'],
        safeJokesInCycle: '4',
      },
      any: {
        url: [proxy + 'https://baneks.ru/random'],
        parseSelector: ['.anek-view p'],
      },
    },
  };

  const speechVoices = {
    en: {
      'lang-code': 'en-us',
      male: { name: 'Mike', speed: 0 },
      female: { name: 'Mary', speed: 0 },
    },
    ru: {
      'lang-code': 'ru-ru',
      male: { name: 'Peter', speed: 1 },
      female: { name: 'Marina', speed: 1 },
    },
  };

  // Keep track of received jokes if safeJokesInCycle or anyJokesInCycle key exists inside jokeSources object
  let gotSafeJokes = 0;

  const getElBySelector = (selector) => document.querySelector(selector);

  const btnSettings = getElBySelector('#settings-button');
  const settingsEn = getElBySelector('#settings-en');
  const btnJoke = getElBySelector('#joke-button');
  const audioEl = getElBySelector('#audio');

  const toggleSettingsMenu = () => {
    btnSettings.classList.toggle('settings-active');
    settingsEn.classList.toggle('settings--open');
  };

  const toggleJokeButton = () => {
    btnJoke.disabled = !btnJoke.disabled;
  };

  const settingsHandler = (e) => {
    let { name: option, value: optVal, checked: filterVal } = e.target;

    switch (option) {
      case 'lang':
        // Check if language option is changed
        if (settings[option] !== optVal) {
          settings[option] = optVal;
          // Change UI language
          for (let prop in languagePack[optVal]) {
            let id = `#${prop}`;
            if (prop === 'filter-icon') {
              // Change icon of filter option
              getElBySelector(id).src = languagePack[optVal][prop];
            } else {
              getElBySelector(id).textContent = languagePack[optVal][prop];
            }
          }
        }
        break;
      case 'voice':
        // Check if voice option is changed
        if (settings[option] !== optVal) settings[option] = optVal;
        break;
      case 'filter':
        // Check if filter option is changed
        filterVal = filterVal ? 'safe' : 'any';
        if (settings[option] !== filterVal) settings[option] = filterVal;
        break;
      default:
        break;
    }
  };

  // Determine server url where to get jokes from
  const getJokesSrc = ({ lang, filter }) => {
    let url;
    // Если в настройках стоит русский язык и фильтр без мата,
    // то запрашивать шутки по первой и второй ссылкам в соотношении 3:1
    if (lang === 'ru' && filter === 'safe' && gotSafeJokes === 3) {
      url = jokeSources[lang][filter]['url'][1];
    } else {
      url = jokeSources[lang][filter]['url'][0];
    }

    return url;
  };

  // Determine how to handle response depending on settings
  const handleResponse = async (res, { lang, filter }) => {
    let joke;
    try {
      if (lang === 'en') {
        const json = await res.json();
        // Resolve single and twopart joke types (JokeAPI)
        joke = json.setup ? `${json.setup} ... ${json.delivery}` : json.joke;
      } else if (lang === 'ru') {
        const html = await res.text();
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(html, 'text/html');

        // Если в настройках стоит русский язык и фильтр без мата,
        // то запрашивать шутки по первой и второй ссылкам в соотношении 3:1
        let selector;
        if (filter === 'safe' && gotSafeJokes === 3) {
          selector = jokeSources[lang][filter]['parseSelector'][1];
        } else {
          selector = jokeSources[lang][filter]['parseSelector'][0];
        }
        joke = parsedDoc.querySelector(selector).textContent;
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }

    return joke;
  };

  // Currently just check if gotSafeJokes should be changed
  const checkJokesCycle = (key, { lang, filter }) => {
    // Если в настройках стоит русский язык и фильтр без мата,
    // то запрашивать шутки по первой и второй ссылкам в соотношении 3:1
    if (lang === 'ru' && filter === 'safe') {
      gotSafeJokes = gotSafeJokes === 3 ? 0 : gotSafeJokes + 1;
    }
  };

  // Get verbal representation of joke text by using Voice RSS API
  const tellJoke = (joke, { lang, voice }) => {
    const voiceProps = { ...speechVoices[lang] };
    const options = {
      key: 'APIKEY',
      src: joke,
      hl: voiceProps['lang-code'],
      v: voiceProps[voice]['name'],
      r: voiceProps[voice]['speed'],
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false,
      target: audioEl,
    };

    VoiceRSS.speech(options);
  };

  // Get jokes from JokeAPI
  const getJokes = async () => {
    const url = getJokesSrc(settings);
    // Disable button
    toggleJokeButton();
    try {
      const response = await fetch(url);
      const joke = await handleResponse(response, settings);
      // Pass joke string to Voice RSS API
      tellJoke(joke, settings);
      // Currently just check if gotSafeJokes should be changed
      checkJokesCycle('safeJokesInCycle', settings);
    } catch (err) {
      console.log(`Error: ${err}`);
      // Enable button
      toggleJokeButton();
    }
  };

  btnSettings.addEventListener('click', toggleSettingsMenu);

  // Attach event listeners to radio buttons and checkbox in the settings menu
  // Language option
  const langRadioBtns = document.querySelectorAll('[name=lang]');
  // Voice option
  const voiceRadioBtns = document.querySelectorAll('[name=voice]');
  // Filter option
  const filterCheckbox = getElBySelector('#filter');

  [...langRadioBtns, ...voiceRadioBtns, filterCheckbox].forEach((optionEl) => {
    optionEl.addEventListener('click', settingsHandler);
  });

  btnJoke.addEventListener('click', getJokes);
  audioEl.addEventListener('ended', toggleJokeButton);

  // Send a request to wake up the proxy server
  fetch(proxy);
})();
