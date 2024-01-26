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
    const mode = e.target.checked ? 'dark' : 'light';
    const headerBackgroundColor =
      mode === 'dark' ? 'rgb(0 0 0 / 50%)' : 'rgb(255 255 255 / 50%)';
    const textBoxBackgroundColor =
      mode === 'dark' ? 'rgb(255 255 255 / 50%)' : 'rgb(0 0 0 / 50%)';

    // Set theme colors
    htmlEl.setAttribute('data-theme', mode);
    // Change header background color
    headerEl.style.backgroundColor = headerBackgroundColor;
    // Change theme name (theme's first letter capitalization is made in css file)
    themeText.textContent = `${mode} Mode`;
    // Change theme icon
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
    // Change image sources of schedule section
    image1.src = `./assets/img/undraw_yacht_${mode}.svg`;
    image2.src = `./assets/img/undraw_map_${mode}.svg`;
    image3.src = `./assets/img/undraw_beer_${mode}.svg`;
    // Change background color of text-box in 'hall of fame' section
    textBox.style.backgroundColor = textBoxBackgroundColor;
  };

  toggleSwitchCheckbox.addEventListener('change', switchTheme);
})();
