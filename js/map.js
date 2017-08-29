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
  var getOfferIndex = function (currentSrc) {
    var j;
    window.data.some(function (element, index) {
      j = index;
      return element.author.avatar === currentSrc;
    });
    return j;
  };

  var showDialog = function (currentPinImage) {
    if (currentPinImage.className === 'rounded' && !currentPinImage.parentNode.classList.contains('pin__main')) {
      var index = getOfferIndex(currentPinImage.getAttribute('src'));
      var offer = window.card.createLodgeCard(window.data[index]);

      window.pin.makeOnePinActive(currentPinImage.parentNode, pins);
      window.card.renderLodgeCard(offer, dialog.querySelector('.dialog__panel'));
      window.card.renderDialogAvatar(window.data[index]);

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
})();
