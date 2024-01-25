'use strict';

(function lightDarkMode() {
  const themeProps = {
    light: {
      html: ['data-theme', 'light'],
      'header-background-color': 'rgb(255 255 255 / 50%)',
      'theme-name': 'Light Mode',
      'schedule-section-img-sources': [
        './assets/img/undraw_yacht_light.svg',
        './assets/img/undraw_map_light.svg',
        './assets/img/undraw_beer_light.svg',
      ],
      'text-box-background-color': 'rgb(0 0 0 / 50%)',
    },
    dark: {
      html: ['data-theme', 'dark'],
      'header-background-color': 'rgb(0 0 0 / 50%)',
      'theme-name': 'Dark Mode',
      'schedule-section-img-sources': [
        './assets/img/undraw_yacht_dark.svg',
        './assets/img/undraw_map_dark.svg',
        './assets/img/undraw_beer_dark.svg',
      ],
      'text-box-background-color': 'rgb(255 255 255 / 50%)',
    },
  };

  const getElBySelector = (selector) => document.querySelector(selector);

  const htmlEl = getElBySelector('html');
  const headerEl = getElBySelector('.header');
  const toggleSwitchCheckbox = getElBySelector('#theme-switch input');
  const toggleText = getElBySelector('#theme-name');
  const sunIcon = getElBySelector('#sun-icon');
  const moonIcon = getElBySelector('#moon-icon');
  const image1 = getElBySelector('#image1');
  const image2 = getElBySelector('#image2');
  const image3 = getElBySelector('#image3');
  const textBox = getElBySelector('#text-box');

  const switchTheme = (e) => {
    const props = e.target.checked ? themeProps['dark'] : themeProps['light'];
    // Set theme colors
    htmlEl.setAttribute(...props.html);
    // Change header background color
    headerEl.style.backgroundColor = props['header-background-color'];
    // Change theme name
    toggleText.textContent = props['theme-name'];
    // Change theme icon
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
    // Change image sources of schedule section
    [image1, image2, image3].forEach((img, idx) => {
      img.src = props['schedule-section-img-sources'][idx];
    });
    // Change background color of text-box in 'hall of fame' section
    textBox.style.backgroundColor = props['text-box-background-color'];
  };

  toggleSwitchCheckbox.addEventListener('change', switchTheme);
})();
