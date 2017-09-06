'use strict';

// create and render lodge offer card and user avatar
window.card = (function () {
  var dialog = document.querySelector('.dialog');
  var dialogClose = dialog.querySelector('.dialog__close');

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

    if (advert.offer.photos.length) {
      advert.offer.photos.forEach(function (element) {
        var img = document.createElement('img');
        img.setAttribute('src', element);
        img.setAttribute('width', '52px');
        img.setAttribute('height', '42px');
        img.setAttribute('alt', 'Lodge photo');
        lodgeCard.querySelector('.lodge__photos').appendChild(img);
      });
    }

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

  // handlers for dialog-close element
  dialogClose.addEventListener('click', onDialogCloseClick);
  dialogClose.addEventListener('keydown', onDialogCloseEnterPress);

  document.addEventListener('keydown', onDialogEscPress);

  return {
    createLodgeCard: createLodgeCard,
    renderLodgeCard: renderLodgeCard,
    renderDialogAvatar: renderDialogAvatar,
    onDialogEscPress: onDialogEscPress
  };
})();
