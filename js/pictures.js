import { showBigPicture } from './big-photo.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document
  .querySelector('#picture')
  .content
  .querySelector('.picture');

const renderPhoto = (photo) => {
  const { url, description, likes, comments } = photo;

  const element = pictureTemplate.cloneNode(true);

  const img = element.querySelector('.picture__img');
  img.src = url;
  img.alt = description;

  element.querySelector('.picture__likes').textContent = likes;
  element.querySelector('.picture__comments').textContent = comments.length;

  // Открытие полноразмерного фото
  element.addEventListener('click', (evt) => {
    evt.preventDefault();
    showBigPicture(photo);
  });

  return element;
};

const renderPictures = (photos) => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(renderPhoto(photo));
  });

  picturesContainer.appendChild(fragment);
};

export { renderPictures };
