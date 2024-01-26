'use strict';

(function lightDarkMode() {
  const getElBySelector = (selector) => document.querySelector(selector);

  const htmlEl = getElBySelector('html');
  const headerEl = getElBySelector('.header');
  const themeText = getElBySelector('#theme-name');
  const toggleSwitchCheckbox = getElBySelector('#theme-switch input');
  const sunIcon = getElBySelector('#sun-icon');
  const moonIcon = getElBySelector('#moon-icon');
  const image1 = getElBySelector('#image1');
  const image2 = getElBySelector('#image2');
  const image3 = getElBySelector('#image3');
  const textBox = getElBySelector('#text-box');

  const switchTheme = (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    const headerBackgroundColor =
      theme === 'dark' ? 'rgb(0 0 0 / 50%)' : 'rgb(255 255 255 / 50%)';
    const textBoxBackgroundColor =
      theme === 'dark' ? 'rgb(255 255 255 / 50%)' : 'rgb(0 0 0 / 50%)';

    // Save theme value in localStorage
    localStorage.setItem('theme', theme);
    // Set theme colors
    htmlEl.setAttribute('data-theme', theme);
    // Change header background color
    headerEl.style.backgroundColor = headerBackgroundColor;
    // Change theme name (theme's first letter capitalization is made in css file)
    themeText.textContent = `${theme} Mode`;
    // Change theme icon
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
    // Change image sources of schedule section
    image1.src = `./assets/img/undraw_yacht_${theme}.svg`;
    image2.src = `./assets/img/undraw_map_${theme}.svg`;
    image3.src = `./assets/img/undraw_beer_${theme}.svg`;
    // Change background color of text-box in 'hall of fame' section
    textBox.style.backgroundColor = textBoxBackgroundColor;
  };

  const checkUserTheme = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      toggleSwitchCheckbox.checked = true;
      toggleSwitchCheckbox.dispatchEvent(new Event('change'));
    }
  };

  toggleSwitchCheckbox.addEventListener('change', switchTheme);
  // Check localStorage for theme item
  checkUserTheme();
})();
