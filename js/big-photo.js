import { isEscapeKey } from './utils.js';

const COMMENTS_PER_PAGE = 5;

const bigPicture = document.querySelector('.big-picture');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentLoaderButton = bigPicture.querySelector('.comments-loader');
const hidePictureButton = document.querySelector('.big-picture__cancel');

let comments = [];
let shownComments = 0;

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    onHidePictureButtonClick();
  }
};

const clearComments = () => {
  socialComments.innerHTML = '';
};

const updateCommentCounter = () => {
  const shownCountEl = bigPicture.querySelector('.social__comment-shown-count');
  const totalCountEl = bigPicture.querySelector('.social__comment-total-count');

  if (!shownCountEl) {
    const counterHtml = `<span class="social__comment-shown-count">${shownComments}</span> из <span class="social__comment-total-count">${comments.length}</span> комментариев`;
    commentCountBlock.innerHTML = counterHtml;
  } else {
    shownCountEl.textContent = shownComments;
    totalCountEl.textContent = comments.length;
  }

  commentLoaderButton.classList.toggle('hidden', shownComments >= comments.length);
};

const onCommentLoaderButtonClick = () => {
  const nextComments = comments.slice(shownComments, shownComments + COMMENTS_PER_PAGE);

  nextComments.forEach((comment) => {
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
    socialComments.appendChild(li);
  });

  shownComments += nextComments.length;
  updateCommentCounter();
};

function onHidePictureButtonClick() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

hidePictureButton.addEventListener('click', onHidePictureButtonClick);
commentLoaderButton.addEventListener('click', onCommentLoaderButtonClick );

const showBigPicture = (picture) => {
  const { url, description, likes } = picture;
  comments = picture.comments;
  shownComments = 0;

  const img = bigPicture.querySelector('.big-picture__img img');
  img.src = url;
  img.alt = description;

  bigPicture.querySelector('.likes-count').textContent = likes;
  bigPicture.querySelector('.social__caption').textContent = description;

  commentCountBlock.classList.remove('hidden');
  commentLoaderButton.classList.remove('hidden');

  clearComments();
  onCommentLoaderButtonClick();

  document.body.classList.add('modal-open');
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onDocumentKeydown);
};

export { showBigPicture };
