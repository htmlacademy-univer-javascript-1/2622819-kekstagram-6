import { generatePhotos } from './data.js';
import { renderPictures } from './pictures.js';

const photos = generatePhotos();
renderPictures(photos);
