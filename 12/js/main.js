import { generatePhotos } from './data.js';
import { renderPictures } from './pictures.js';
import './form.js';

const photos = generatePhotos();
renderPictures(photos);
