import { getRandomInteger, getRandomArrayElement } from './utils.js';

const PHOTO_COUNT = 25;

const Likes = { MIN: 15, MAX: 200 };
const CommentsCount = { MIN: 0, MAX: 30 };
const AvatarNumber = { MIN: 1, MAX: 6 };

const photoDescriptions = [
  'Вид из окна',
  'Улица ночью',
  'На берегу моря',
  'Старая архитектура',
  'Рассвет в горах'
];

const commentMessages = [
  'Всё отлично!',
  'Неплохо, но есть куда расти.',
  'Палец в кадре — классика жанра.',
  'Бабушка снимает лучше.',
  'Я уронил фотоаппарат на кота — вышло лучше.',
  'Лица перекошены, момент неудачный.'
];

const commentNames = [
  'Иван', 'Мария', 'Артём', 'Дмитрий', 'Анна', 'Сергей', 'Елена', 'Алексей'
];

let commentIdCounter = 1;

const generateComment = () => ({
  id: commentIdCounter++,
  avatar: `img/avatar-${getRandomInteger(AvatarNumber.MIN, AvatarNumber.MAX)}.svg`,
  message: getRandomArrayElement(commentMessages),
  name: getRandomArrayElement(commentNames),
});

const generateComments = () => {
  const comments = [];
  const count = getRandomInteger(CommentsCount.MIN, CommentsCount.MAX);
  for (let i = 0; i < count; i++) {
    comments.push(generateComment());
  }
  return comments;
};

const generatePhoto = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: getRandomArrayElement(photoDescriptions),
  likes: getRandomInteger(Likes.MIN, Likes.MAX),
  comments: generateComments(),
});

const generatePhotos = () => {
  const photos = [];
  for (let i = 0; i < PHOTO_COUNT; i++) {
    photos.push(generatePhoto(i));
  }
  return photos;
};

export { generatePhotos };
