import { renderPictures } from './pictures.js';

const RERENDER_DELAY = 500;
const RANDOM_PHOTOS_COUNT = 10;

const filtersContainer = document.querySelector('.img-filters');
const filterForm = filtersContainer.querySelector('.img-filters__form');
const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');

let currentFilter = 'filter-default';
let photos = [];

const showFilters = () => {
  filtersContainer.classList.remove('img-filters--inactive');
};

const clearPictures = () => {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
};

const getRandomPhotos = () => {
  const copiedPhotos = [...photos];
  const randomPhotos = [];
  while (randomPhotos.length < RANDOM_PHOTOS_COUNT  && copiedPhotos.length > 0) {
    const randomIndex = Math.floor(Math.random() * copiedPhotos.length);
    randomPhotos.push(copiedPhotos[randomIndex]);
    copiedPhotos.splice(randomIndex, 1);
  }
  return randomPhotos;
};

const getDiscussedPhotos = () =>
  [...photos].sort((a, b) => b.comments.length - a.comments.length);

const renderFilteredPhotos = () => {
  clearPictures();
  let filteredPhotos;
  switch (currentFilter) {
    case 'filter-random':
      filteredPhotos = getRandomPhotos();
      break;
    case 'filter-discussed':
      filteredPhotos = getDiscussedPhotos();
      break;
    default:
      filteredPhotos = [...photos];
  }
  renderPictures(filteredPhotos);
};

const debounce = (callback, timeoutDelay = RERENDER_DELAY) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const initFilters = (loadedPhotos) => {
  photos = loadedPhotos;
  showFilters();

  const debouncedRender = debounce(renderFilteredPhotos, RERENDER_DELAY);

  filterForm.addEventListener('click', (evt) => {
    evt.preventDefault();

    if (!evt.target.classList.contains('img-filters__button')) {
      return;
    }

    const clickedButton = evt.target;

    if (clickedButton.id === currentFilter) {
      return;
    }

    filterButtons.forEach((button) => {
      button.classList.remove('img-filters__button--active');
    });

    clickedButton.classList.add('img-filters__button--active');
    currentFilter = clickedButton.id;

    debouncedRender();
  });

  renderPictures(photos);
};

export { initFilters };
