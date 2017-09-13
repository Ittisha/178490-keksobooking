'use strict';

window.showCard = (function () {
  var dialog = document.querySelector('.dialog');
  var dialogClose = dialog.querySelector('.dialog__close');
  var PIN_SIZE = {
    width: 56,
    height: 75
  };

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
    if (currentPinImg.className === 'rounded' && !currentPinImg.parentNode.classList.contains('pin__main')) {
      var currentPinLocation = {
        x: currentPinImg.parentNode.offsetLeft + PIN_SIZE.width / 2,
        y: currentPinImg.parentNode.offsetTop + PIN_SIZE.height
      };

      var offerData = getOfferData(currentPinLocation, offersData);
      var offer = window.card.createLodgeCard(offerData);


      window.card.renderLodgeCard(offer, dialog.querySelector('.dialog__panel'));
      window.card.renderDialogAvatar(offerData);

      dialog.classList.remove('hidden');
      dialogClose.tabIndex = 0;

      document.addEventListener('keydown', window.card.onDialogEscPress);
    }
  };

  return {
    showCard: showCard
  };
})();
