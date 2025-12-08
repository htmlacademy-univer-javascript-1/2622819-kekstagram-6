import './vendor/pristine/pristine.min.js';
import './vendor/nouislider/nouislider.js';

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
  classTo: 'img-upload__text',
  errorTextParent: 'img-upload__text',
  errorTextClass: 'img-upload__text-error'
});

let currentScale = 100;

function onEscKeydown(evt) {
  if (evt.key === 'Escape') {
    if (document.activeElement !== hashtagsInput && document.activeElement !== commentInput) {
      evt.preventDefault();
      closeForm();
    }
  }
}

function openForm() {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onEscKeydown);
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
    return;
  }

  sliderContainer.classList.remove('hidden');

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

scaleValue.value = `${currentScale}%`;
previewImg.style.transform = `scale(${currentScale / 100})`;

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

function closeForm() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadInput.value = '';
  hashtagsInput.value = '';
  commentInput.value = '';
  previewImg.style.transform = 'scale(1)';
  previewImg.style.filter = '';
  currentScale = 100;
  scaleValue.value = '100%';
  pristine.reset();
  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }
  sliderContainer.classList.add('hidden');
  document.removeEventListener('keydown', onEscKeydown);
}

uploadInput.addEventListener('change', () => {
  if (uploadInput.files && uploadInput.files.length > 0) {
    openForm();
    initSlider('none');
  }
});

closeButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

effectsList.addEventListener('change', (e) => {
  const target = e.target;
  if (target && target.classList.contains('effects__radio')) {
    const effect = target.value;
    if (sliderElement.noUiSlider) {
      sliderElement.noUiSlider.destroy();
    }
    previewImg.style.filter = '';
    initSlider(effect);
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

const validateHashtags = (value) => {
  if (!value.trim()) {
    return true;
  }
  const tags = value.trim().toLowerCase().split(/\s+/);
  if (tags.length > 5) {
    return false;
  }
  const pattern = /^#[a-zа-яё0-9]{1,19}$/;
  const unique = new Set(tags);
  if (unique.size !== tags.length) {
    return false;
  }
  return tags.every((t) => pattern.test(t));
};

const validateComment = (value) => value.length <= 140;

pristine.addValidator(hashtagsInput, validateHashtags, 'Некорректные хэштеги');
pristine.addValidator(commentInput, validateComment, 'Не более 140 символов');

form.addEventListener('submit', (evt) => {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
});
