'use strict';

(function infiniteScroll() {
  let isInitialLoad = true;
  let photosArr, imagesLoaded, totalImages, loading;

  // HTML Elements
  const imageContainer = document.querySelector('#image-container');
  const loader = document.querySelector('#loader');

  // Unsplash API
  const initialCount = 5;
  const apiKey = 'APIKEY';
  let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

  // Update API URL with new images count
  const updateUrlCount = (imgCount) => {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imgCount}`;
  };

  const imageLoaded = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      loading = false;
      loader.hidden = true;
    }
  };

  const displayPhotos = () => {
    imagesLoaded = 0;
    totalImages = photosArr.length;
    photosArr.forEach((photo) => {
      // Create <a> element that wraps image
      const a = document.createElement('a');
      a.href = photo.links.html;
      a.target = '_blank';
      // Create <img> element
      const img = new Image();
      img.src = photo.urls.regular;
      img.alt = photo.alt_description;
      img.title = photo.alt_description;
      img.addEventListener('load', imageLoaded);
      // Put <a> and <img> inside imageContainer element
      a.appendChild(img);
      imageContainer.appendChild(a);
    });
  };

  const getPhotos = () => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        photosArr = data;
        displayPhotos();
        if (isInitialLoad) {
          isInitialLoad = false;
          updateUrlCount(30);
        }
      })
      .catch((error) => console.log(error));
  };

  // Check if scrolling appears near bottom of the page to load more photos
  window.addEventListener('scroll', () => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1000 &&
      !loading
    ) {
      loading = true;
      getPhotos();
    }
  });

  getPhotos();
})();
