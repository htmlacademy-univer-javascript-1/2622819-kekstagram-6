import { loadPhotos } from './api.js';
import { initFilters } from './filters.js';
import './form.js';

const ERROR_DISPLAY_TIMEOUT = 5000;

const showDataError = () => {
  const template = document.querySelector('#data-error');

  if (template) {
    const fragment = template.content.cloneNode(true);
    const messageElement = fragment.querySelector('.data-error');

    document.body.appendChild(fragment);

    setTimeout(() => {
      if (messageElement && messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement);
      }
    }, ERROR_DISPLAY_TIMEOUT);

    return;
  }

  const error = document.createElement('div');
  error.className = 'data-error';
  error.textContent = 'Не удалось загрузить данных с сервера. Попробуйте обновить страницу';

  error.style.position = 'fixed';
  error.style.top = '20px';
  error.style.left = '50%';
  error.style.transform = 'translateX(-50%)';
  error.style.padding = '15px 25px';
  error.style.backgroundColor = '#ff4d4d';
  error.style.color = '#fff';
  error.style.borderRadius = '5px';
  error.style.zIndex = '10000';
  error.style.display = 'block';
  error.style.visibility = 'visible';

  document.body.appendChild(error);

  setTimeout(() => {
    error.remove();
  }, ERROR_DISPLAY_TIMEOUT);
};

window.addEventListener('load', () => {
  loadPhotos()
    .then(initFilters)
    .catch(showDataError);
});
