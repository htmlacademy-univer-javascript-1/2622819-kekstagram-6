import { isEscapeKey } from './utils.js';
const showMessage = (templateId) => {
  const template = document.querySelector(`#${templateId}`);
  if (!template) {
    return;
  }

  const fragment = template.content.cloneNode(true);
  const messageElement = fragment.querySelector('.success') || fragment.querySelector('.error');

  if (messageElement) {
    messageElement.style.zIndex = '10000';
  }

  document.body.appendChild(fragment);

  const node = messageElement;

  function onDocumentEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
      onCloseMessageButtonClick();
    }
  }

  function onCloseMessageButtonClick() {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
    document.removeEventListener('keydown', onDocumentEscKeydown);
  }
  const onMessageClick = (evt) => {
    const target = evt.target;
    const button = target.closest('button');

    if (button && (button.classList.contains('success__button') || button.classList.contains('error__button'))) {
      onCloseMessageButtonClick();
      return;
    }

    if (target === node) {
      onCloseMessageButtonClick();
    }
  };

  document.addEventListener('keydown', onDocumentEscKeydown);

  if (node) {
    node.addEventListener('click', onMessageClick);
  }
};

const showSuccessMessage = () => showMessage('success');
const showErrorMessage = () => showMessage('error');

export { showSuccessMessage, showErrorMessage };
