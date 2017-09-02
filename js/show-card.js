'use strict';

window.showCard = (function () {
  var dialog = document.querySelector('.dialog');
  var dialogClose = dialog.querySelector('.dialog__close');

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

  /**
   *
   * @param {Node} currentPinImage
   */
  var showCard = function (currentPinImage) {
    if (currentPinImage.className === 'rounded' && !currentPinImage.parentNode.classList.contains('pin__main')) {
      var offerData = getOfferData(currentPinImage.getAttribute('src'));
      var offer = window.card.createLodgeCard(offerData);


      window.card.renderLodgeCard(offer, dialog.querySelector('.dialog__panel'));
      window.card.renderDialogAvatar(offerData);

      dialog.classList.remove('hidden');
      dialogClose.setAttribute('tabindex', '0');

      document.addEventListener('keydown', window.card.onDialogEscPress);
    }
  };

  return {
    showCard: showCard
  };
})();
