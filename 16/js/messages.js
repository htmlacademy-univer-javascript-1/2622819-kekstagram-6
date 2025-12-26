const showTemplateMessage = (templateId, buttonClass) => {
  const template = document.querySelector(templateId);
  const messageContent = template.content.querySelector('section').cloneNode(true);
  document.body.append(messageContent);

  const button = messageContent.querySelector(buttonClass);

  const closeMessage = () => {
    messageContent.remove();
    document.removeEventListener('keydown', onEsc);
    document.removeEventListener('click', onOutsideClick);
  };

  function onEsc(evt) {
    if (evt.key === 'Escape') {
      closeMessage();
    }
  }

  function onOutsideClick(evt) {
    if (!evt.target.closest('section')) {
      closeMessage();
    }
  }

  button.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onOutsideClick);
};

const showSuccessMessage = () => {
  showTemplateMessage('#success', '.success__button');
};

const showErrorMessage = () => {
  showTemplateMessage('#error', '.error__button');
};

export { showSuccessMessage, showErrorMessage };
