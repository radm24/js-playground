'use strict';

(function () {
  const googleFaviconsApi = 'https://s2.googleusercontent.com/s2/favicons';

  // Elements
  const addTile = document.querySelector('.tile--add');

  // Modal
  const modal = document.querySelector('.modal');
  const overlayModal = document.querySelector('.overlay--modal');
  const btnClose = document.querySelector('.btn--close');
  const form = document.querySelector('.form');
  const websiteNameEl = document.getElementById('name');
  const websiteUrlEl = document.getElementById('url');

  // Context menu
  const menu = document.querySelector('.context-menu');
  const overlayMenu = document.querySelector('.overlay--menu');
  const btnEdit = document.querySelector('.btn--edit');
  const btnDelete = document.querySelector('.btn--delete');

  let bookmarks = [];
  let currentBookmarkId = null;

  function loadBookmarks() {
    const data = localStorage.getItem('bookmarks');
    bookmarks = JSON.parse(data) ?? [];

    if (bookmarks.length > 0) {
      bookmarks.forEach(renderBookmark);
    }
  }

  function toggleModal() {
    modal.classList.toggle('hidden');
    overlayModal.classList.toggle('hidden');

    const isHidden = modal.classList.contains('hidden');
    if (!isHidden) websiteNameEl.focus();
    if (isHidden) {
      if (currentBookmarkId) currentBookmarkId = null;
      clearInputs();
    }
  }

  function toggleMenu(e) {
    // Set position of menu before showing it
    if (menu.classList.contains('hidden')) {
      menu.style.top = e.pageY + 'px';
      menu.style.left = e.pageX + 'px';
    }
    menu.classList.toggle('hidden');
    overlayMenu.classList.toggle('hidden');
  }

  function isValidUrl(url) {
    const pattern =
      /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/\/=]*)/g;
    return pattern.test(url);
  }

  function saveBookmark(websiteName, websiteUrlRaw, bookmarkId) {
    const websiteUrl =
      !websiteUrlRaw.startsWith('https://') &&
      !websiteUrlRaw.startsWith('http://')
        ? `https://${websiteUrlRaw}`
        : websiteUrlRaw;

    const bookmark = { name: websiteName, url: websiteUrl };
    if (!bookmarkId) bookmarks.push(bookmark);
    else bookmarks[bookmarkId] = bookmark;

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    return bookmark;
  }

  // id is index of bookmark in bookmarks array
  function renderBookmark({ name, url }, id) {
    // Render bookmark element
    const bookmarkEl = document.createElement('div');
    bookmarkEl.classList.add('tile', 'tile--link');
    bookmarkEl.dataset.id = id;
    bookmarkEl.innerHTML = `
      <button class="btn btn--menu"></button>
      <a href="${url}" target="_blank">
        <div>
          <img
            class="favicon"
            src="${googleFaviconsApi}?domain_url=${url}&sz=256"
            alt="Website's favicon"
          />
          <p class="title">
            ${name}
          </p>
        </div>
      </a>
    `;

    addTile.before(bookmarkEl);

    // Add event listener
    bookmarkEl.querySelector('.btn--menu').addEventListener('click', (e) => {
      e.stopPropagation();
      currentBookmarkId = document
        .elementFromPoint(e.pageX, e.pageY)
        .closest('.tile').dataset.id;
      toggleMenu(e);
    });
  }

  function updateBookmarkDOM({ name, url }, bookmarkId) {
    const bookmarkEl = document.querySelector(`[data-id="${bookmarkId}"]`);

    bookmarkEl.querySelector('a').href = url;
    bookmarkEl.querySelector(
      'img'
    ).src = `${googleFaviconsApi}?domain_url=${url}&sz=256`;
    bookmarkEl.querySelector('p').textContent = name;
  }

  function clearInputs() {
    websiteNameEl.value = '';
    websiteUrlEl.value = '';
  }

  function addBookmarkHandler(e) {
    e.preventDefault();

    if (!isValidUrl(websiteUrlEl.value))
      return alert('Please provide valid web address');

    const bookmark = saveBookmark(
      websiteNameEl.value,
      websiteUrlEl.value,
      currentBookmarkId
    );

    if (currentBookmarkId) {
      updateBookmarkDOM(bookmark, currentBookmarkId);
      currentBookmarkId = null;
    } else {
      renderBookmark(bookmark, bookmarks.length - 1);
    }

    toggleModal();
    clearInputs();
  }

  function editBookmarkHandler(e) {
    const currentBookmark = bookmarks[currentBookmarkId];
    websiteNameEl.value = currentBookmark.name;
    websiteUrlEl.value = currentBookmark.url;

    toggleMenu();
    toggleModal();
  }

  function deleteBookmarkHandler(e) {
    // Remove bookmark from the array and DOM
    bookmarks.splice(currentBookmarkId, 1);
    document.querySelector(`[data-id="${currentBookmarkId}"]`).remove();

    // Update data-id attribute of remaining bookmark elements
    const wasLastBookmark = currentBookmarkId === bookmarks.length;
    if (!wasLastBookmark) {
      const bookmarkElements = [...document.querySelectorAll('.tile--link')];
      bookmarkElements.forEach((el, idx) => (el.dataset.id = idx));
    }

    currentBookmarkId = null;
    toggleMenu();
  }

  // Event listeners
  [addTile, overlayModal, btnClose].forEach((el) =>
    el.addEventListener('click', toggleModal)
  );
  overlayMenu.addEventListener('click', toggleMenu);
  form.addEventListener('submit', addBookmarkHandler);
  btnEdit.addEventListener('click', editBookmarkHandler);
  btnDelete.addEventListener('click', deleteBookmarkHandler);

  loadBookmarks();
})();
