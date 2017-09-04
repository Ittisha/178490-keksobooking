'use strict';

window.backend = (function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var DATA_URL_ENDING = '/data';

  /**
   *Set up new xhr options
   * @param {Function} onLoad
   * @param {Function}onError
   * @return {XMLHttpRequest}
   */
  var setupXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    return xhr;
  };
  /**
   * Get data from server
   * @param {Function} onLoad
   * @param {Function} onError
   */
  var load = function (onLoad, onError) {
    var xhr = setupXhr(onLoad, onError);
    xhr.open('GET', SERVER_URL + DATA_URL_ENDING);
    xhr.send();
  };
  /**
   * Post data to server
   * @param {Object} data
   * @param {Function} onLoad
   * @param {Function} onError
   */
  var save = function (data, onLoad, onError) {
    var xhr = setupXhr(onLoad, onError);
    xhr.open('POST', SERVER_URL);
    xhr.send(data);
  };
  /**
   * Show error in new div
   * @param {string} errorMessage
   */
  var showError = function (errorMessage) {
    var errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    errorContainer.textContent = errorMessage;

    var containerCloseButton = document.createElement('button');
    containerCloseButton.classList.add('error-message__close-button');

    errorContainer.appendChild(containerCloseButton);
    document.body.appendChild(errorContainer);

    var closeErrorContainer = function () {
      document.body.removeChild(errorContainer);

      containerCloseButton.removeEventListener('click', onContainerCloseButtonClick);
      containerCloseButton.removeEventListener('keydown', onContainerCloseButtonEnterPress);
    };

    var onContainerCloseButtonClick = function () {
      closeErrorContainer();
    };
    var onContainerCloseButtonEnterPress = function (evt) {
      window.util.isEnterEvent(evt, closeErrorContainer);
    };

    containerCloseButton.addEventListener('click', onContainerCloseButtonClick);
    containerCloseButton.addEventListener('keydown', onContainerCloseButtonEnterPress);
  };
  return {
    load: load,
    save: save,
    showError: showError
  };
})();
