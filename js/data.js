import { getRandomInteger, getRandomArrayElement } from './utils.js';

const PHOTO_COUNT = 25;

const Likes = {
  MIN: 15,
  MAX: 200
};

const CommentsCount = {
  MIN: 0,
  MAX: 30
};

const AvatarNumber = {
  MIN: 1,
  MAX: 6
};

const photoDescriptions = [
  'Вид из окна',
  'Улица ночью',
  'На берегу моря',
  'Старая архитектура',
  'Рассвет в горах'
];

const commentMessages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const commentNames = [
  'Иван', 'Мария', 'Артём', 'Дмитрий', 'Анна', 'Сергей', 'Елена', 'Алексей'
];

let commentIdCounter = 1;

const generateComment = () => ({
  id: commentIdCounter++,
  avatar: `img/avatar-${getRandomInteger(AvatarNumber.MIN, AvatarNumber.MAX)}.svg`,
  message: getRandomArrayElement(commentMessages),
  name: getRandomArrayElement(commentNames)
});

const generateComments = () => {
  const commentsCount = getRandomInteger(CommentsCount.MIN, CommentsCount.MAX);
  const comments = [];

  for (let i = 0; i < commentsCount; i++) {
    comments.push(generateComment());
  }

  return comments;
};

const generatePhoto = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: getRandomArrayElement(photoDescriptions),
  likes: getRandomInteger(Likes.MIN, Likes.MAX),
  comments: generateComments()
});

const generatePhotos = () => {
  const photos = [];
  for (let i = 0; i < PHOTO_COUNT; i++) {
    photos.push(generatePhoto(i));
  }
  return photos;
};

export { generatePhotos, PHOTO_COUNT };
