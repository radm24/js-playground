'use strict';

(function animatedNavigation() {
  const overlay = document.getElementById('overlay');
  const menuIcon = document.getElementById('menu-icon');
  const navListItems = document.querySelectorAll('.nav-list li');
  const navListLinks = document.querySelectorAll('.nav-link');

  const toggleNav = () => {
    // Toggle menu icon appearance
    menuIcon.classList.toggle('change');
    // Show/hide navigation menu overlay
    overlay.classList.toggle('overlay-active');
    // Toggle animation for navigation menu items
    navListItems.forEach((item, idx) => {
      item.classList.toggle(`slide-in-${idx + 1}`);
      item.classList.toggle(`slide-out-${idx + 1}`);
    })
  }

  menuIcon.addEventListener('click', toggleNav);
  navListLinks.forEach(link => {
    link.addEventListener('click', toggleNav);
  })
})();
