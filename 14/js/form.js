import './vendor/pristine/pristine.min.js';
import './vendor/nouislider/nouislider.js';

import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

const body = document.body;
const uploadInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');

const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const previewImg = document.querySelector('.img-upload__preview img');

const effectsList = document.querySelector('.effects__list');
const sliderContainer = document.querySelector('.img-upload__effect-level');
const sliderElement = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value');

const form = document.querySelector('.img-upload__form');
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text'
});

let currentScale = 100;

function onEscKeydown(evt) {
  if (evt.key === 'Escape') {
    if (
      document.activeElement !== hashtagsInput &&
      document.activeElement !== commentInput
    ) {
      evt.preventDefault();
      closeForm();
    }
  }
}

function openForm() {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onEscKeydown);

  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  initSlider('none');
  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }
}

function closeForm() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadInput.value = '';
  hashtagsInput.value = '';
  commentInput.value = '';
  previewImg.style.transform = 'scale(1)';
  previewImg.style.filter = '';
  previewImg.className = '';
  previewImg.classList.add('effects__preview--none');
  currentScale = 100;
  scaleValue.value = '100%';
  pristine.reset();

  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }

  sliderContainer.classList.add('hidden');
  effectValue.value = '';

  const originalEffect = document.querySelector('#effect-none');
  if (originalEffect) {
    originalEffect.checked = true;
  }

  document.removeEventListener('keydown', onEscKeydown);
}

function initSlider(effect) {
  const EFFECTS = {
    chrome: { min: 0, max: 1, step: 0.1, filter: (v) => `grayscale(${v})` },
    sepia: { min: 0, max: 1, step: 0.1, filter: (v) => `sepia(${v})` },
    marvin: { min: 0, max: 100, step: 1, filter: (v) => `invert(${v}%)` },
    phobos: { min: 0, max: 3, step: 0.1, filter: (v) => `blur(${v}px)` },
    heat: { min: 1, max: 3, step: 0.1, filter: (v) => `brightness(${v})` },
    none: null
  };

  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }

  if (effect === 'none') {
    sliderContainer.classList.add('hidden');
    previewImg.style.filter = '';
    effectValue.value = '';
    previewImg.className = '';
    previewImg.classList.add('effects__preview--none');
    return;
  }

  sliderContainer.classList.remove('hidden');

  previewImg.className = '';
  previewImg.classList.add(`effects__preview--${effect}`);

  const cfg = EFFECTS[effect];

  noUiSlider.create(sliderElement, {
    range: { min: cfg.min, max: cfg.max },
    start: cfg.max,
    step: cfg.step,
    connect: 'lower'
  });

  sliderElement.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValue.value = value;
    previewImg.style.filter = cfg.filter(value);
  });
}

scaleValue.value = '100%';

scaleSmaller.addEventListener('click', () => {
  if (currentScale > 25) {
    currentScale -= 25;
    scaleValue.value = `${currentScale}%`;
    previewImg.style.transform = `scale(${currentScale / 100})`;
  }
});

scaleBigger.addEventListener('click', () => {
  if (currentScale < 100) {
    currentScale += 25;
    scaleValue.value = `${currentScale}%`;
    previewImg.style.transform = `scale(${currentScale / 100})`;
  }
});

uploadInput.addEventListener('change', () => {
  if (uploadInput.files.length > 0) {
    openForm();
  }
});

closeButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

effectsList.addEventListener('change', (evt) => {
  if (evt.target.classList.contains('effects__radio')) {
    initSlider(evt.target.value);
  }
});

hashtagsInput.addEventListener('keydown', (evt) => {
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
const HASHTAG_PATTERN = /^#[a-z0-9]{1,19}$/i;

const getHashtags = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }
  return trimmed.split(/\s+/).filter((tag) => tag.length > 0);
};

const validateHashtagNoSingleHash = (value) => {
  const tags = getHashtags(value);
  if (tags.length === 0) {
    return true;
  }
  return tags.every((tag) => tag !== '#');
};

const validateHashtagMaxLength = (value) => {
  const tags = getHashtags(value);
  if (tags.length === 0) {
    return true;
  }
  return tags.every((tag) => tag.length <= 20);
};

const validateHashtagFormat = (value) => {
  const tags = getHashtags(value);
  if (tags.length === 0) {
    return true;
  }
  return tags.every((tag) => HASHTAG_PATTERN.test(tag));
};

const validateHashtagCount = (value) => {
  const tags = getHashtags(value);
  return tags.length <= MAX_HASHTAGS;
};

const validateHashtagUniq = (value) => {
  const tags = getHashtags(value);
  const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
  return new Set(lowerCaseTags).size === tags.length;
};

const validateComment = (value) => value.length <= 140;

pristine.addValidator(
  hashtagsInput,
  validateHashtagNoSingleHash,
  'Хэштег не может состоять только из #'
);

pristine.addValidator(
  hashtagsInput,
  validateHashtagMaxLength,
  'Максимальная длина хэштега 20 символов'
);

pristine.addValidator(
  hashtagsInput,
  validateHashtagFormat,
  'Хэштег должен начинаться с # и содержать только буквы и цифры'
);

pristine.addValidator(
  hashtagsInput,
  validateHashtagCount,
  'Нельзя больше 5 хэш-тегов'
);

pristine.addValidator(
  hashtagsInput,
  validateHashtagUniq,
  'Хэш-теги не должны повторяться'
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Комментарий не более 140 символов'
);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  const submitButton = form.querySelector('.img-upload__submit');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';

  sendData(new FormData(form))
    .then(() => {
      closeForm();
      form.reset();
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage();
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    });
});
