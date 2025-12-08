import './vendor/pristine/pristine.min.js';

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const body = document.body;
const cancelButton = document.querySelector('#upload-cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'form__error'
});

function isTextFieldFocused() {
  return document.activeElement === hashtagInput || document.activeElement === commentInput;
}

function onEscKeydown(evt) {
  if (evt.key === 'Escape' && !isTextFieldFocused()) {
    evt.preventDefault();
    closeForm();
  }
}

function closeForm() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
  fileInput.value = '';
  document.removeEventListener('keydown', onEscKeydown);
}

function openForm() {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onEscKeydown);
}

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    openForm();
  }
});

cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

hashtagInput.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});

commentInput.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

const validateHashtagsCountAndLength = (value) => {
  if (!value.trim()) {
    return true;
  }
  const tags = value.trim().split(/\s+/);
  return tags.length <= MAX_HASHTAGS && tags.every((t) => t.length <= MAX_HASHTAG_LENGTH);
};

const validateHashtagSymbols = (value) => {
  if (!value.trim()) {
    return true;
  }
  const tags = value.trim().split(/\s+/);
  return tags.every((t) => hashtagRegex.test(t));
};

const validateHashtagUnique = (value) => {
  if (!value.trim()) {
    return true;
  }
  const tags = value.trim().toLowerCase().split(/\s+/);
  return new Set(tags).size === tags.length;
};

pristine.addValidator(
  hashtagInput,
  validateHashtagsCountAndLength,
  `Не больше ${MAX_HASHTAGS} тегов, длина — до ${MAX_HASHTAG_LENGTH} символов`
);

pristine.addValidator(
  hashtagInput,
  validateHashtagSymbols,
  'Тег должен начинаться с # и содержать только буквы и цифры'
);

pristine.addValidator(
  hashtagInput,
  validateHashtagUnique,
  'Хэштеги не должны повторяться'
);

pristine.addValidator(
  commentInput,
  (value) => value.length <= 140,
  'Комментарий не должен превышать 140 символов'
);

form.addEventListener('submit', (evt) => {
  const valid = pristine.validate();
  if (!valid) {
    evt.preventDefault();
  }
});
