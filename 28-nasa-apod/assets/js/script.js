'use strict';

(function () {
  // NASA API
  const apiKey = '4SMLzMgIoVuerI2lO05Wsl5JDkcnTdZ7cOBCgqJi';
  const count = 10;
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

  // Elements
  const loader = document.querySelector('.loader');
  const navEl = document.querySelector('nav');
  const cardsEl = document.querySelector('.cards');
  const btnFavorites = document.getElementById('btn-favorites');
  const btnLoad = document.getElementById('btn-load');
  const btnResults = document.getElementById('btn-results');

  // State
  let currentPage = 'results';
  const pictures = [];
  let lastLoadedPictures = [];
  let favoritePictures = [];

  function loadFavoritesFromStorage() {
    const data = JSON.parse(localStorage.getItem('favoritePictures'));
    if (data) favoritePictures = data;
  }

  function toggleLoader() {
    loader.classList.toggle('hidden');
  }

  async function getNasaPictures() {
    toggleLoader();
    try {
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw new Error(`Unable to fetch. Status code: ${response.status}.`);

      const data = await response.json();
      pictures.push(...data);
      lastLoadedPictures = data;
      renderPictures();
    } catch (err) {
      console.log(err.message);
      renderError(err.message);
    } finally {
      toggleLoader();
    }
  }

  function renderError(error) {
    cardsEl.insertAdjacentHTML('afterbegin', `<p class="error">${error}</p>`);
  }

  function renderPictures() {
    const isFavoritesPage = currentPage === 'favorites';
    const picturesToLoad = isFavoritesPage
      ? favoritePictures
      : cardsEl.childElementCount < lastLoadedPictures.length
      ? pictures
      : lastLoadedPictures;

    picturesToLoad.forEach(
      ({ url, title, explanation, date, copyright }, idx) => {
        const id = isFavoritesPage
          ? idx
          : pictures.length === count
          ? idx
          : pictures.length - count + idx;

        const isBookmarked = isFavoritesPage
          ? true
          : favoritePictures.some((picture) => picture.url === url);

        const html = `
          <div class="card" data-id="${id}">
            <a href="${url}" title="View Full Image" target="_blank">
              <img src="${url}" alt="${title}" />
            </a>
            <div class="description">
              <h2 class="description__title">${title}</h2>
              <p class="clickable" role="button"
                data-action="${isBookmarked ? 'remove' : 'save'}"
              >
                ${isBookmarked ? 'Remove Favorite' : 'Add to Favorites'}
              </p>
              <p class="description__text">${explanation}</p>
              <p>
                <span class="description__date">${date}</span>
                  ${
                    copyright
                      ? `<span class="description__copyright">${copyright}</span>`
                      : ''
                  }
              </p>
            </div>
          </div>
        `;

        cardsEl.insertAdjacentHTML('afterbegin', html);
        document
          .querySelector(`[data-id='${id}'] .clickable`)
          .addEventListener('click', (e) =>
            isFavoritesPage ? removeFavorite(idx) : saveRemoveFavorite(e, url)
          );
      }
    );
  }

  function saveRemoveFavorite(e, url) {
    const action = e.target.dataset.action;
    if (action === 'save') {
      saveFavoriteStorage(url);
      e.target.textContent = 'Remove Favorite';
      e.target.dataset.action = 'remove';
    }
    if (action === 'remove') {
      const idx = favoritePictures.findIndex((picture) => picture.url === url);
      removeFavoriteStorage(idx);
      e.target.textContent = 'Add to Favorites';
      e.target.dataset.action = 'save';
    }
  }

  function saveFavoriteStorage(url) {
    const picture = pictures.find((picture) => picture.url === url);
    favoritePictures.push(picture);
    localStorage.setItem('favoritePictures', JSON.stringify(favoritePictures));
  }

  function removeFavoriteStorage(idx) {
    favoritePictures.splice(idx, 1);
    localStorage.setItem('favoritePictures', JSON.stringify(favoritePictures));
  }

  function removeFavorite(idx) {
    removeFavoriteStorage(idx);
    document.querySelector(`[data-id='${idx}']`).remove();
  }

  function changePage(page) {
    currentPage = page;
    navEl.dataset.page = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Event listeners
  [btnFavorites, btnResults].forEach((btn) =>
    btn.addEventListener('click', () => {
      const page = btn.id.split('-')[1];
      changePage(page);
      cardsEl.replaceChildren();
      if (page === 'results') getNasaPictures();
      else renderPictures();
    })
  );
  btnLoad.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getNasaPictures();
  });

  // Initialize app
  loadFavoritesFromStorage();
  getNasaPictures();
})();
