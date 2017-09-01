'use strict';

(function () {
  var tokyoPinMap = 'tokyo__pin-map';
  var tokyoMap = document.querySelector('.tokyo__pin-map');

  var dialog = document.querySelector('.dialog');
  var dialogPanel = dialog.querySelector('.dialog__panel');

  var dialogClose = dialog.querySelector('.dialog__close');

  // create offers' list and render all pins on the map
  window.pin.renderPins(window.data, tokyoPinMap);

  // create and render lodge card
  var filledDialogPanelTemplate = window.card.createLodgeCard(window.data[0]);
  window.card.renderLodgeCard(filledDialogPanelTemplate, dialogPanel);

  // render owner avatar
  window.card.renderDialogAvatar(window.data[0]);

  var pins = tokyoMap.querySelectorAll('.pin');
  // Focus on the first not main pin
  pins[1].focus();

  /**
   * Returns index of searched lodge offer
   * @param {string} currentSrc
   * @return {number}
   */
  var getOfferData = function (currentSrc) {
    var j;
    window.data.some(function (element, index) {
      j = index;
      return element.author.avatar === currentSrc;
    });
    return window.data[j];
  };

  var showDialog = function (currentPinImage) {
    if (currentPinImage.className === 'rounded' && !currentPinImage.parentNode.classList.contains('pin__main')) {
      var offerData = getOfferData(currentPinImage.getAttribute('src'));
      var offer = window.card.createLodgeCard(offerData);

      window.pin.makeOnePinActive(currentPinImage.parentNode, pins);
      window.card.renderLodgeCard(offer, dialog.querySelector('.dialog__panel'));
      window.card.renderDialogAvatar(offerData);

      dialog.classList.remove('hidden');
      dialogClose.setAttribute('tabindex', '0');

      document.addEventListener('keydown', onDialogEscPress);
    }
  };
  /**
   * Close dialog
   */
  var closeDialog = function () {
    window.pin.deactivatePin();

    dialog.classList.add('hidden');
    document.removeEventListener('keydown', onDialogEscPress);
  };

  /**
   * Close dialog and deactivate pin on click
   */
  var onDialogCloseClick = function () {
    closeDialog();
  };
  /**
   * Close dialog and deactivate pin on Esc keydown
   * @param {Object} evt
   */
  var onDialogEscPress = function (evt) {
    window.util.isEscEvent(evt, closeDialog);
  };
  /**
   * Close dialog and deactivate pin on ENTER keydown
   * @param {Object} evt
   */
  var onDialogCloseEnterPress = function (evt) {
    window.util.isEnterEvent(evt, closeDialog);
  };

  /**
   * Activate selected pin on ENTER keydown and render it's lodge card
   * @param {Object} evt
   */
  var onPinEnterPress = function (evt) {
    window.util.isEnterEvent(evt, showDialog, evt.target.firstChild);
  };
  /**
   * Activate selected pin on click and render it's lodge card
   * @param {Object} evt
   */
  var onPinClick = function (evt) {
    showDialog(evt.target);
  };

  // handlers for pins
  tokyoMap.addEventListener('click', onPinClick);
  tokyoMap.addEventListener('keydown', onPinEnterPress);

  // handlers for dialog-close element
  dialogClose.addEventListener('click', onDialogCloseClick);
  dialogClose.addEventListener('keydown', onDialogCloseEnterPress);

  document.addEventListener('keydown', onDialogEscPress);

  var mainPin = tokyoMap.querySelector('.pin__main');
  var mapForPinDrag = document.querySelector('.tokyo');
  var halfMainPinWidth = mainPin.offsetWidth / 2;
  var mainPinHeight = mainPin.offsetHeight;
  var addressInput = document.getElementById('address');
  // fill address input value
  addressInput.value = 'x: ' + (mainPin.offsetLeft + halfMainPinWidth) + ', y: ' + (mainPin.offsetTop + mainPinHeight);
  /**
   * Set new pin position in consideration of limits
   * @param {number} startPosition
   * @param {Object} limits
   * @param {number} pinSize
   * @param {string} position
   */
  var setMainPinPosition = function (startPosition, limits, pinSize, position) {
    mainPin.style[position] = startPosition + 'px';

    if (startPosition < limits.min - pinSize) {
      mainPin.style[position] = limits.min - pinSize + 'px';
    }
    if (startPosition > limits.max - pinSize) {
      mainPin.style[position] = limits.max - pinSize + 'px';
    }
  };
  /**
   * Return location coordinates
   * @param {{x: number, y: number}} coords
   * @return {{x: number, y: number}}
   */
  var getLocationCoords = function (coords) {
    var MAP = {
      width: {
        min: 0,
        max: mapForPinDrag.offsetWidth
      },
      height: {
        min: 100,
        max: 660
      }
    };

    setMainPinPosition(coords.x, MAP.width, halfMainPinWidth, 'left');
    setMainPinPosition(coords.y, MAP.height, mainPinHeight, 'top');

    return {
      x: mainPin.offsetLeft + halfMainPinWidth,
      y: mainPin.offsetTop + mainPinHeight
    };
  };

  /**
   * @param {Object} evt
   */
  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();
    mainPin.style.zIndex = 1;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    /**
     * @param {Object}moveEvt
     */
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      var locationCoords = getLocationCoords(mainPinCoords);

      addressInput.value = 'x: ' + locationCoords.x + ', y: ' + locationCoords.y;
    };
    /**
     * @param {Object} upEvt
     */
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      mainPin.style.zIndex = 0;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mainPin.addEventListener('mousedown', onMainPinMouseDown);
})();
