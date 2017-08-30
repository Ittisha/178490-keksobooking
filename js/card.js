'use strict';

// create and render lodge offer card and user avatar
window.card = (function () {
  var dialog = document.querySelector('.dialog');

  var lodgeTemplate = document.querySelector('#lodge-template');
  var lodgeTemplateContent = lodgeTemplate.content ? lodgeTemplate.content : lodgeTemplate;

  var LODGE_TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    default: 'Не указан'
  };

  /**
   * Fulfill node template with advert data
   * @param {Object} advert
   * @return {Node}
   */
  var createLodgeCard = function (advert) {
    var lodgeCard = lodgeTemplateContent.querySelector('.dialog__panel').cloneNode(true);

    lodgeCard.querySelector('.lodge__title').textContent = advert.offer.title;
    lodgeCard.querySelector('.lodge__address').textContent = advert.offer.address;
    lodgeCard.querySelector('.lodge__price').textContent = advert.offer.price.toLocaleString('ru') + ' ' + '\u20BD/ночь';
    lodgeCard.querySelector('.lodge__type').textContent = LODGE_TYPES[advert.offer.type] || LODGE_TYPES.default;
    lodgeCard.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + advert.offer.guests +
      ' гостей в ' + advert.offer.rooms + ' комнатах';
    lodgeCard.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + advert.offer.checkin +
      ', выезд до ' + advert.offer.checkout;

    advert.offer.features.forEach(function (element) {
      var span = document.createElement('span');
      span.className = 'feature__image feature__image--' + element;
      lodgeCard.querySelector('.lodge__features').appendChild(span);
    });

    lodgeCard.querySelector('.lodge__description').textContent = advert.offer.description;

    return lodgeCard;
  };
  /**
   * Render lodge card on dialog-panel
   * @param {Node} filledTemplate
   * @param {Node} oldChild
   */
  var renderLodgeCard = function (filledTemplate, oldChild) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(filledTemplate);
    dialog.replaceChild(fragment, oldChild);
  };
  /**
   * Render lodge owner avatar
   * @param {Object} advert
   */
  var renderDialogAvatar = function (advert) {
    dialog.querySelector('.dialog__title img').src = advert.author.avatar;
  };

  return {
    createLodgeCard: createLodgeCard,
    renderLodgeCard: renderLodgeCard,
    renderDialogAvatar: renderDialogAvatar
  };
})();
