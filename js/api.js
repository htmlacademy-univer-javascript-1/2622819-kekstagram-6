const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
};

const loadPhotos = () =>
  fetch(`${BASE_URL}/data`)
    .then(checkResponse);

const sendData = (formData) =>
  fetch(`${BASE_URL}/`, {
    method: 'POST',
    body: formData,
  })
    .then(checkResponse);

export { loadPhotos, sendData };
