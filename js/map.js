'use strict';
var LODGE_NUMBER = 8;
var USER_IDS = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08'
];
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var PRICE = {
  min: 1000,
  max: 1000000
};
var LODGE_TYPES = [
  'flat',
  'house',
  'bungalo'
];
var ROOMS = {
  min: 1,
  max: 5
};
var GUESTS = {
  min: 1,
  max: 5
};
var CHECKIN_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var CHECKOUT_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var MAP = {
  width: {
    min: 300,
    max: 900
  },
  height: {
    min: 100,
    max: 500
  }
};

var lodgeTypes = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  default: 'Не указан'
};
var tokyoPinMap = 'tokyo__pin-map';
var lodgeTemplate = document.querySelector('#lodge-template');
var lodgeTemplateContent = lodgeTemplate.content ? lodgeTemplate.content : lodgeTemplate;
var dialog = document.querySelector('.dialog');
var dialogPanel = dialog.querySelector('.dialog__panel');

/**
 * Returns random integer between min and max inclusive
 * @param {number} min
 * @param{number} max
 * @return {number}
 */
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};
/**
 * Returns random array item
 * @param {Array} array
 * @return {*}
 */
var getRandomArrayItem = function (array) {
  return array[getRandomInteger(0, array.length - 1)];
};
/**
 * Returns unique random array item
 * @param {Array} array
 * @return {*}
 */
var getUniqueArrayItem = function (array) {
  return array.splice(getRandomInteger(0, array.length - 1), 1)[0];
};
/**
 * Returns array of random length with unique elements from initial array
 * @param {Array} array
 * @return {Array}
 */
var getArrayOfRandomLength = function (array) {
  var arrayCopy = array.slice(0);
  var newArray = [];
  var newArrayLength = getRandomInteger(1, array.length);

  for (var i = 0; i < newArrayLength; i++) {
    newArray.push(getUniqueArrayItem(arrayCopy));
  }
  return newArray;
};

/**
 * Creates an object with data for particular lodge offer
 * @return {{Object}}}
 */
var createLodgeOffer = function () {
  var locationX = getRandomInteger(MAP.width.min, MAP.width.max);
  var locationY = getRandomInteger(MAP.height.min, MAP.height.max);
  return {
    author: {
      avatar: 'img/avatars/user' + getUniqueArrayItem(USER_IDS) + '.png'
    },

    offer: {
      title: getUniqueArrayItem(TITLES),
      address: locationX + ', ' + locationY,
      price: getRandomInteger(PRICE.min, PRICE.max),
      type: getRandomArrayItem(LODGE_TYPES),
      rooms: getRandomInteger(ROOMS.min, ROOMS.max),
      guests: getRandomInteger(GUESTS.min, GUESTS.max),
      checkin: getRandomArrayItem(CHECKIN_TIMES),
      checkout: getRandomArrayItem(CHECKOUT_TIMES),
      features: getArrayOfRandomLength(FEATURES),
      description: '',
      photos: []
    },

    location: {
      x: locationX,
      y: locationY
    }
  };
};
/**
 * Returns an array with all lodge offers data
 * @return {Array}
 */
var createOffersList = function () {
  var offersList = [];
  for (var i = 0; i < LODGE_NUMBER; i++) {
    offersList.push(createLodgeOffer());
  }
  return offersList;
};
/**
 * Return pin for particular offer
 * @param {Object} advert
 * @return {Element}
 */
var createPin = function (advert) {
  var IMG_WIDTH = 40;
  var IMG_HEIGHT = 40;
  var PIN_CLASS_NAME = 'pin';
  var IMG_CLASS_NAME = 'rounded';

  var pin = document.createElement('div');
  var img = document.createElement('img');

  pin.className = PIN_CLASS_NAME;
  pin.style.left = advert.location.x - pin.offsetWidth / 2 + 'px';
  pin.style.top = advert.location.y - pin.offsetHeight + 'px';
  pin.setAttribute('tabindex', '0');

  img.className = IMG_CLASS_NAME;
  img.src = advert.author.avatar;
  img.width = IMG_WIDTH;
  img.height = IMG_HEIGHT;

  pin.appendChild(img);
  return pin;
};
/**
 * Render pins in selected element
 * @param {Array} offers
 * @param {string} elementClass
 */
var renderPins = function (offers, elementClass) {
  var pinsMap = document.querySelector('.' + elementClass);
  var fragment = document.createDocumentFragment();

  offers.forEach(function (element) {
    fragment.appendChild(createPin(element));
  });
  pinsMap.appendChild(fragment);
};

/**
 * Fulfill node template with advert data
 * @param {Object} template
 * @param {Object} advert
 * @return {Node}
 */
var createLodgeCard = function (template, advert) {
  var lodgeCard = template.querySelector('.dialog__panel').cloneNode(true);
  lodgeCard.querySelector('.lodge__title').textContent = advert.offer.title;
  lodgeCard.querySelector('.lodge__title').textContent = advert.offer.address;
  lodgeCard.querySelector('.lodge__price').textContent = advert.offer.price + ' ' + '\u20BD/ночь';
  lodgeCard.querySelector('.lodge__type').textContent = lodgeTypes[advert.offer.type] || lodgeTypes.default;
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

// create offers' list and render all pins on the map
var offersList = createOffersList();
renderPins(offersList, tokyoPinMap);
// create and render lodge card
var filledDialogPanelTemplate = createLodgeCard(lodgeTemplateContent, offersList[0]);
renderLodgeCard(filledDialogPanelTemplate, dialogPanel);
// render owner avatar
renderDialogAvatar(offersList[0]);

// Module4-task1

var ENTER_CODE = 13;
var ESC_CODE = 27;

var tokyoMap = document.querySelector('.tokyo__pin-map');
var pins = tokyoMap.querySelectorAll('.pin');
var dialogClose = dialog.querySelector('.dialog__close');

// Focus on the first not main pin
pins[1].focus();

/**
 * Deactivate first found active pin
 */
var deactivatePin = function () {
  var pinActive = tokyoMap.querySelector('.pin--active');

  if (pinActive) {
    pinActive.classList.remove('pin--active');
  }
};
/**
 * Make active only selected pin
 * @param {Node} currentPin
 */
var makeOnePinActive = function (currentPin) {
  // forEach doesn't work with Nodes in Edge
  Array.prototype.forEach.call(pins, function () {
    deactivatePin();
  });
  currentPin.classList.add('pin--active');
};
/**
 * Returns index of searched lodge offer
 * @param {string} currentSrc
 * @return {number}
 */
var getOfferIndex = function (currentSrc) {
  var j;
  offersList.forEach(function (element, index) {
    if (element.author.avatar === currentSrc) {
      j = index;
    }
  });
  return j;
};
/**
 * Shows offer dialog
 * @param {Node} currentPinImage
 */
var showDialog = function (currentPinImage) {
  if ((currentPinImage.className === 'rounded') && (currentPinImage.parentNode.className !== 'pin  pin__main')) {
    var index = getOfferIndex(currentPinImage.getAttribute('src'));
    var offer = createLodgeCard(lodgeTemplateContent, offersList[index]);

    makeOnePinActive(currentPinImage.parentNode);
    renderLodgeCard(offer, dialog.querySelector('.dialog__panel'));
    renderDialogAvatar(offersList[index]);

    dialog.classList.remove('hidden');
    dialogClose.setAttribute('tabindex', '0');

    document.addEventListener('keydown', onDialogEscPress);
  }
};
/**
 * Close dialog
 */
var closeDialog = function () {
  deactivatePin();

  dialog.classList.add('hidden');
  document.removeEventListener('keydown', onDialogEscPress);
};

/**
 * Activate selected pin on click and render it's lodge card
 * @param {Object} evt
 */
var onPinClick = function (evt) {
  showDialog(evt.target);
};
/**
 * Activate selected pin on ENTER keydown and render it's lodge card
 * @param {Object} evt
 */
var onPinEnterPress = function (evt) {
  if (evt.keyCode === ENTER_CODE) {
    showDialog(evt.target.firstChild);
  }
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
  if (evt.keyCode === ESC_CODE) {
    closeDialog();
  }
};
/**
 * Close dialog and deactivate pin on ENTER keydown
 * @param {Object} evt
 */
var onDialogCloseEnterPress = function (evt) {
  if (evt.keyCode === ENTER_CODE) {
    closeDialog();
  }
};

// handlers for pins
tokyoMap.addEventListener('click', onPinClick);
tokyoMap.addEventListener('keydown', onPinEnterPress);

// handlers for dialog-close element
dialogClose.addEventListener('click', onDialogCloseClick);
dialogClose.addEventListener('keydown', onDialogCloseEnterPress);

// handler for ESC
document.addEventListener('keydown', onDialogEscPress);
