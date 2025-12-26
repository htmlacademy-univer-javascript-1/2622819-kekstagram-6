import { loadPhotos } from './api.js';
import { initFilters } from './filters.js';
import './form.js';

const showDataError = () => {
  const error = document.createElement('div');
  error.style.position = 'fixed';
  error.style.top = '20px';
  error.style.left = '50%';
  error.style.transform = 'translateX(-50%)';
  error.style.padding = '15px 25px';
  error.style.backgroundColor = '#ff4d4d';
  error.style.color = '#fff';
  error.style.borderRadius = '5px';
  error.style.zIndex = '1000';
  error.textContent = 'Не удалось загрузить данные. Попробуйте обновить страницу';

  document.body.appendChild(error);

  setTimeout(() => {
    error.remove();
  }, 5000);
};

loadPhotos()
  .then((photos) => {
    initFilters(photos);
  })
  .catch(showDataError);
