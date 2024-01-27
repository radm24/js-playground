'use strict';

(function () {
  const toggleNavbar = (collapseID) => {
    document.getElementById(collapseID).classList.toggle('hidden');
    document.getElementById(collapseID).classList.toggle('block');
  };

  document
    .getElementById('menu-button')
    .addEventListener('click', () => toggleNavbar('example-collapse-navbar'));
})();
