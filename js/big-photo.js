import { isEscapeKey } from './utils.js';

const bigPicture = document.querySelector('.big-picture');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentLoaderButton = bigPicture.querySelector('.comments-loader');
const hidePictureButton = bigPicture.querySelector('.big-picture__cancel');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideBigPicture();
  }
};

const clearComments = () => {
  socialComments.innerHTML = '';
};

function hideBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);

  commentCountBlock.classList.remove('hidden');
  commentLoaderButton.classList.remove('hidden');
}

hidePictureButton.addEventListener('click', hideBigPicture);

const showBigPicture = (picture) => {
  const { url, description, likes, comments } = picture;

  const img = bigPicture.querySelector('.big-picture__img img');
  img.src = url;
  img.alt = description;

  bigPicture.querySelector('.likes-count').textContent = likes;
  bigPicture.querySelector('.comments-count').textContent = comments.length;
  bigPicture.querySelector('.social__caption').textContent = description;

  clearComments();

  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const li = document.createElement('li');
    li.classList.add('social__comment');

    const avatar = document.createElement('img');
    avatar.classList.add('social__picture');
    avatar.src = comment.avatar;
    avatar.alt = comment.name;
    avatar.width = 35;
    avatar.height = 35;

    const text = document.createElement('p');
    text.classList.add('social__text');
    text.textContent = comment.message;

    li.appendChild(avatar);
    li.appendChild(text);
    fragment.appendChild(li);
  });

  socialComments.appendChild(fragment);

  commentCountBlock.classList.add('hidden');
  commentLoaderButton.classList.add('hidden');

  document.body.classList.add('modal-open');
  bigPicture.classList.remove('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
};

export { showBigPicture };
