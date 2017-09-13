'use strict';

window.showCard = (function () {
  var PIN_SIZE = {
    width: 56,
    height: 75
  };
  var dialog = document.querySelector('.dialog');
  var dialogCloseButton = dialog.querySelector('.dialog__close');

  /**
   * Returns index of searched lodge offer
   * @param {Object} location
   * @param {Array} offersData
   * @return {number}
   */
  var getOfferData = function (location, offersData) {
    var j;
    offersData.some(function (element, index) {
      j = index;
      return element.location.x === location.x && element.location.y === location.y;
    });
    return offersData[j];
  };

  /**
   * Show particular lodge offer
   * @param {Node} currentPinImg
   * @param {Array} offersData
   */
  var showCard = function (currentPinImg, offersData) {
    if (currentPinImg.classList.contains('rounded') && !currentPinImg.parentNode.classList.contains('pin__main')) {
      var currentPinLocation = {
        x: currentPinImg.parentNode.offsetLeft + PIN_SIZE.width / 2,
        y: currentPinImg.parentNode.offsetTop + PIN_SIZE.height
      };

      var offerData = getOfferData(currentPinLocation, offersData);
      var offer = window.card.createLodgeCard(offerData);

      window.card.renderLodgeCard(offer, dialog.querySelector('.dialog__panel'));
      window.card.renderDialogAvatar(offerData);

      dialog.classList.remove('hidden');
      dialogCloseButton.tabIndex = 0;

      // handlers for dialog-close element
      dialogCloseButton.addEventListener('click', window.card.onDialogCloseButtonClick);
      dialogCloseButton.addEventListener('keydown', window.card.onDialogCloseButtonEnterPress);

      document.addEventListener('keydown', window.card.onDialogEscPress);
    }
  };

  return {
    showCard: showCard
  };
})();
