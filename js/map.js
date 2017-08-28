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
  lodgeCard.querySelector('.lodge__address').textContent = advert.offer.address;
  lodgeCard.querySelector('.lodge__price').textContent = advert.offer.price.toLocaleString('ru') + ' ' + '\u20BD/ночь';
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

var KEY_CODES = {
  enter: 13,
  esc: 27
};

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
  offersList.some(function (element, index) {
    j = index;
    return element.author.avatar === currentSrc;
  });
  return j;
};
/**
 * Shows offer dialog
 * @param {Node} currentPinImage
 */
var showDialog = function (currentPinImage) {
  if (currentPinImage.className === 'rounded' && !currentPinImage.parentNode.classList.contains('pin__main')) {
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
  if (evt.keyCode === KEY_CODES.enter) {
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
  if (evt.keyCode === KEY_CODES.esc) {
    closeDialog();
  }
};
/**
 * Close dialog and deactivate pin on ENTER keydown
 * @param {Object} evt
 */
var onDialogCloseEnterPress = function (evt) {
  if (evt.keyCode === KEY_CODES.enter) {
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

// Module4-task2
var noticeForm = document.querySelector('.notice__form');
var timeInField = noticeForm.querySelector('#timein');
var timeOutField = noticeForm.querySelector('#timeout');
var roomsNumberField = noticeForm.querySelector('#room_number');
var guestsField = noticeForm.querySelector('#capacity');
var titleField = noticeForm.querySelector('#title');
var addressField = noticeForm.querySelector('#address');
var lodgeTypeField = noticeForm.querySelector('#type');
var priceField = noticeForm.querySelector('#price');
var submitButton = noticeForm.querySelector('.form__submit');

var TYPES_MIN_PRICES = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};
var HUNDRED_ROOMS_VALUE = '100';
var NO_GUESTS = '0';

/**
 * Rewrite title validation messages in russian
 * @param {Node} inputNode
 */
var rewriteTitleValidationMessages = function (inputNode) {
  var minLength = inputNode.getAttribute('minlength');
  var maxLength = inputNode.getAttribute('maxlength');

  if (inputNode.validity.tooShort) {
    inputNode.setCustomValidity('Заголовок должен состоять минимум из ' + minLength + ' символов');
  } else if (inputNode.validity.tooLong) {
    inputNode.setCustomValidity('Заголовок не должен превышать ' + maxLength + 'символов');
  } else if (inputNode.validity.valueMissing) {
    inputNode.setCustomValidity('Обязательное поле');
  } else {
    inputNode.setCustomValidity('');
  }
};
/**
 * Rewrite address validation messages in russian
 * @param {Node} inputNode
 */
var rewriteAddressValidationMessages = function (inputNode) {
  if (inputNode.validity.valueMissing) {
    inputNode.setCustomValidity('Обязательное поле');
  } else {
    inputNode.setCustomValidity('');
  }
};
/**
 * Validate title min-length for Edge
 * @param {Object} evt
 */
var onTitleFieldInput = function (evt) {
  var minLength = evt.target.getAttribute('minlength');
  var target = evt.target;
  if (target.value.length < minLength) {
    target.setCustomValidity('Заголовок должен состоять минимум из ' + minLength + ' символов');
  } else {
    target.setCustomValidity('');
  }
};
/**
 * Rewrite price validation messages in russian
 * @param {Node} inputNode
 */
var rewritePriceValidationMessage = function (inputNode) {
  var minPrice = inputNode.getAttribute('min');
  var maxPrice = inputNode.getAttribute('max');

  if (inputNode.validity.rangeUnderflow) {
    inputNode.setCustomValidity('Значение должно быть больше или равно ' + (+minPrice).toLocaleString('ru'));
  } else if (inputNode.validity.rangeOverflow) {
    inputNode.setCustomValidity('Значение должно быть меньше или равно ' + (+maxPrice).toLocaleString('ru'));
  } else if (inputNode.validity.valueMissing) {
    inputNode.setCustomValidity('Обязательное поле');
  } else {
    inputNode.setCustomValidity('');
  }
};
/**
 * Call callback-function if input invalid
 * @param {Node} inputNode
 * @param {Function} callback
 */
var setInputCustomValidity = function (inputNode, callback) {
  if (!inputNode.validity.valid) {
    callback(inputNode);
  }
};
/**
 * Call new validation messages if title field invalid
 */
var onTitleFieldInvalid = function () {
  setInputCustomValidity(titleField, rewriteTitleValidationMessages);
};
/**
 * Call new validation messages if address field invalid
 */
var onAddressFieldInvalid = function () {
  setInputCustomValidity(addressField, rewriteAddressValidationMessages);
};
/**
 * Call new validation messages on address field input
 */
var onAddressFieldInput = function () {
  setInputCustomValidity(addressField, rewriteAddressValidationMessages);
};
/**
 * Call new validation messages if price field invalid
 */
var onPriceFieldInvalid = function () {
  setInputCustomValidity(priceField, rewritePriceValidationMessage);
};
/**
 * Call new validation messages on price field input
 */
var onPriceFieldInput = function () {
  setInputCustomValidity(priceField, rewritePriceValidationMessage);
};

titleField.addEventListener('input', onTitleFieldInput);
titleField.addEventListener('invalid', onTitleFieldInvalid);

addressField.addEventListener('input', onAddressFieldInput);
addressField.addEventListener('invalid', onAddressFieldInvalid);

priceField.addEventListener('input', onPriceFieldInput);
priceField.addEventListener('invalid', onPriceFieldInvalid);

/**
 * Bind time in and time out changes
 * @param {Object} evt
 */
var onTimeInTimeOutChange = function (evt) {
  var anotherTimeField = evt.target === timeInField ? timeOutField : timeInField;
  anotherTimeField.value = evt.target.value;
};

timeInField.addEventListener('change', onTimeInTimeOutChange);
timeOutField.addEventListener('change', onTimeInTimeOutChange);

/**
 * Bind lodge type and min price
 * @param {Object} evt
 */
var onLodgeTypeFieldChange = function (evt) {
  var minPrice = TYPES_MIN_PRICES[evt.target.value];
  priceField.setAttribute('min', minPrice);
  priceField.value = minPrice;
};

lodgeTypeField.addEventListener('change', onLodgeTypeFieldChange);

/**
 * Bind rooms and guests quantities
 * @param {Object} evt
 */
var onRoomsGuestsChange = function (evt) {
  var anotherField = evt.target === roomsNumberField ? guestsField : roomsNumberField;
  var switchedValue = evt.target.value;

  if (anotherField === guestsField) {
    if (switchedValue === HUNDRED_ROOMS_VALUE) {
      anotherField.value = NO_GUESTS;
    } else if (+switchedValue > +anotherField.value) {
      anotherField.value = anotherField.value === '0' ? switchedValue : anotherField.value;
    } else {
      anotherField.value = switchedValue;
    }
  } else {
    if (switchedValue === '0') {
      anotherField.value = '100';
    } else if (+switchedValue > +anotherField.value || (+switchedValue < +anotherField.value && anotherField.value === '100')) {
      anotherField.value = switchedValue;
    } else {
      anotherField.value = anotherField.value;
    }
  }
};

roomsNumberField.addEventListener('change', onRoomsGuestsChange);
guestsField.addEventListener('change', onRoomsGuestsChange);

/**
 * Check form validation
 * @return {boolean}
 */
var checkValidationSubmit = function () {
  var result = true;
  Array.prototype.forEach.call(noticeForm.elements, function (elem) {
    if ('reportValidity' in elem) {
      elem.reportValidity();
    }
    if (elem.checkValidity()) {
      elem.style.border = '1px solid #d9d9d3';
    } else {
      elem.style.border = '2px solid red';
      elem.style.boxShadow = 'none';
      result = false;
    }
  });
  return result;
};

/**
 * Send form if validation passed, reset data after submit
 * @param {Node} form
 */
var sendForm = function (form) {
  if (checkValidationSubmit()) {
    form.submit();
    form.reset();
  }
};
/**
 * Send form on submit button click
 * @param {Object} evt
 */
var onSubmitButtonClick = function (evt) {
  evt.preventDefault();
  sendForm(noticeForm);
};
/**
 * Send form on submit button Enter press
 * @param {Object} evt
 */
var onSubmitButtonEnterPress = function (evt) {
  if (evt.keyCode === KEY_CODES.enter) {
    evt.preventDefault();
    sendForm(noticeForm);
  }
};

submitButton.addEventListener('click', onSubmitButtonClick);
submitButton.addEventListener('keydown', onSubmitButtonEnterPress);


