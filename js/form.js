'use strict';

(function () {
  var TYPES_MIN_PRICES = {
    types: ['bungalo', 'flat', 'house', 'palace'],
    minPrice: [0, 1000, 5000, 10000]
  };
  var HUNDRED_ROOMS_VALUE = 100;
  var NO_GUESTS = 0;
  var TITLE_VALIDITY_MESSAGES = {
    short: {
      firstPart: 'Заголовок должен состоять минимум из ',
      lastPart: ' символов'
    },
    long: {
      firstPart: 'Заголовок не должен превышать ',
      lastPart: ' символов'
    },
    missing: 'Обязательное поле'
  };
  var PRICE_VALIDITY_MESSAGES = {
    underFlow: 'Значение должно быть больше или равно ',
    overFlow: 'Значение должно быть меньше или равно ',
    missing: 'Обязательное поле'
  };
  var BORDER_STYLE_USUAL = {
    border: '1px solid #d9d9d3'
  };
  var BORDER_STYLE_WRONG = {
    border: '2px solid red',
    boxShadow: 'none'
  };
  var AVATAR_DEFAULT_SRC = 'img/muffin.png';

  var noticeForm = document.querySelector('.notice__form');
  var timeInField = noticeForm.querySelector('#timein');
  var timeOutField = noticeForm.querySelector('#timeout');
  var roomsNumberField = noticeForm.querySelector('#room_number');
  var guestsField = noticeForm.querySelector('#capacity');
  var titleField = noticeForm.querySelector('#title');
  var lodgeTypeField = noticeForm.querySelector('#type');
  var priceField = noticeForm.querySelector('#price');
  var submitButton = noticeForm.querySelector('.form__submit');

  // user avatar
  var formHeader = document.querySelector('.notice__header');
  var avatarChooser = formHeader.querySelector('.upload input[type="file"]');
  var avatarPreview = formHeader.querySelector('.notice__preview img');

  // user photos
  var formPhotoContainer = document.querySelector('.form__photo-container');
  var photoChooser = formPhotoContainer.querySelector('.upload input[type="file"]');

  /**
   *Set custom validity
   * @param {Node} inputNode
   * @param {boolean} booleanCondition
   * @param {string} message1
   * @param {string} quantity
   * @param {string} message2
   */
  var setNewValidationMessage = function (inputNode, booleanCondition, message1,
      quantity, message2) {
    if (booleanCondition) {
      var messageEnd = typeof message2 !== 'undefined' ? message2 : '';
      var number = typeof quantity !== 'undefined' ? quantity : '';
      inputNode.setCustomValidity(message1 + number + messageEnd);
    }
  };

  /**
   * Rewrite title validation messages in russian
   * @param {Node} inputNode
   */
  var rewriteTitleValidationMessages = function (inputNode) {
    var minLength = inputNode.minLength;
    var maxLength = inputNode.maxLength;

    inputNode.setCustomValidity('');

    setNewValidationMessage(inputNode, inputNode.validity.tooShort,
        TITLE_VALIDITY_MESSAGES.short.firstPart, minLength,
        TITLE_VALIDITY_MESSAGES.short.lastPart);
    setNewValidationMessage(inputNode, inputNode.validity.tooLong,
        TITLE_VALIDITY_MESSAGES.long.firstPart, maxLength,
        TITLE_VALIDITY_MESSAGES.long.lastPart);
    setNewValidationMessage(inputNode, inputNode.validity.valueMissing,
        TITLE_VALIDITY_MESSAGES.missing);
  };

  /**
   * Validate title min-length for Edge
   * @param {Object} evt
   */
  var onTitleFieldInput = function (evt) {
    // Edge doesn't support minlength, we can't get it with object notation
    var minLength = evt.target.getAttribute('minlength');
    var target = evt.target;

    target.setCustomValidity('');

    if (target.value.length < minLength) {
      target.setCustomValidity(TITLE_VALIDITY_MESSAGES.short.firstPart + minLength
        + TITLE_VALIDITY_MESSAGES.short.lastPart);
    }
  };

  /**
   * Rewrite price validation messages in russian
   * @param {Node} inputNode
   */
  var rewritePriceValidationMessages = function (inputNode) {
    var minPrice = inputNode.min;
    var maxPrice = inputNode.max;

    inputNode.setCustomValidity('');
    setNewValidationMessage(inputNode, inputNode.validity.rangeUnderflow,
        PRICE_VALIDITY_MESSAGES.underFlow,
        (+minPrice).toLocaleString('ru'));
    setNewValidationMessage(inputNode, inputNode.validity.rangeOverflow,
        PRICE_VALIDITY_MESSAGES.overFlow,
        (+maxPrice).toLocaleString('ru'));
    setNewValidationMessage(inputNode, inputNode.validity.valueMissing,
        PRICE_VALIDITY_MESSAGES.missing);
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
   * Call new validation messages if price field invalid
   */
  var onPriceFieldInvalid = function () {
    setInputCustomValidity(priceField, rewritePriceValidationMessages);
  };

  /**
   * Call new validation messages on price field input
   */
  var onPriceFieldInput = function () {
    setInputCustomValidity(priceField, rewritePriceValidationMessages);
  };

  titleField.addEventListener('input', onTitleFieldInput);
  titleField.addEventListener('invalid', onTitleFieldInvalid);

  priceField.addEventListener('input', onPriceFieldInput);
  priceField.addEventListener('invalid', onPriceFieldInvalid);

  /**
   * @param {Node} element
   * @param {*} value
   */
  var syncValues = function (element, value) {
    element.value = value;
  };

  /**
   * Get real array of options values from HTMLOptionsCollection
   * @param {Node} selectNode
   * @return {Array}
   */
  var getOptionsArray = function (selectNode) {
    var optionsArray = [];
    Array.prototype.forEach.call(selectNode.options, function (element, index) {
      optionsArray[index] = element.value;
    });
    return optionsArray;
  };

  /**
   * Bind time in and time out changes
   * @param {Object} evt
   */
  var onTimeInTimeOutChange = function (evt) {
    var anotherTimeField = evt.target === timeInField ? timeOutField : timeInField;
    var targetFieldData = getOptionsArray(evt.target);
    var anotherFieldData = getOptionsArray(anotherTimeField);

    window.synchronizeFields.synchronizeFields(evt.target, anotherTimeField,
        syncValues, targetFieldData, anotherFieldData);
  };

  timeInField.addEventListener('change', onTimeInTimeOutChange);
  timeOutField.addEventListener('change', onTimeInTimeOutChange);

  /**
   * @param {Node} element
   * @param {*} value
   */
  var syncValueWithMin = function (element, value) {
    element.min = value;
    element.value = value;
  };

  /**
   * Bind lodge type and min price
   * @param {Object} evt
   */
  var onLodgeTypeFieldChange = function (evt) {
    window.synchronizeFields.synchronizeFields(evt.target, priceField,
        syncValueWithMin, TYPES_MIN_PRICES.types, TYPES_MIN_PRICES.minPrice);
  };

  lodgeTypeField.addEventListener('change', onLodgeTypeFieldChange);

  /**
   * Bind rooms and guests quantities
   */
  var syncRoomsOptions = function () {
    if (+roomsNumberField.value === HUNDRED_ROOMS_VALUE) {
      // set guests field value
      guestsField.value = NO_GUESTS;
      // set guests field options disabled property
      Array.prototype.forEach.call(guestsField.options, function (elem) {
        elem.disabled = +elem.value !== NO_GUESTS;
      });
    } else {
      // set guests field value
      guestsField.value = roomsNumberField.value;
      // set guests field options disabled property
      Array.prototype.forEach.call(guestsField.options, function (elem) {
        elem.disabled = +elem.value === NO_GUESTS ||
          +elem.value > +roomsNumberField.value;
      });
    }
  };

  /**
   * Synchronize rooms and guests quantities on change
   */
  var onRoomsNumberChange = function () {
    syncRoomsOptions();
  };

  roomsNumberField.addEventListener('change', onRoomsNumberChange);

  /**
   * Change border and box shadow styles
   * @param {Node} node
   * @param {Object} styles
   */
  var changeBorderStyle = function (node, styles) {
    node.style.border = styles.border;
    node.style.boxShadow = 'boxShadow' in styles ? styles.boxShadow : 'none';
  };

  /**
   * Check form validation
   * @return {boolean}
   */
  var checkValidationSubmit = function () {
    var result = true;

    Array.prototype.forEach.call(noticeForm.elements, function (elem) {
      // Edge doesn't have reportValidity method
      if ('reportValidity' in elem) {
        elem.reportValidity();
      }

      if (elem.checkValidity()) {
        changeBorderStyle(elem, BORDER_STYLE_USUAL);
      } else {
        changeBorderStyle(elem, BORDER_STYLE_WRONG);
        result = false;
      }
    });
    return result;
  };

  /**
   * Set default avatar src
   */
  var setDefaultAvatar = function () {
    avatarPreview.src = AVATAR_DEFAULT_SRC;
  };
  /**
   * Reset user photos
   */
  var resetPhotos = function () {
    var imageContainers = formPhotoContainer.querySelectorAll('.form__photo');
    Array.prototype.forEach.call(imageContainers, function (element) {
      element.innerHTML = '';
    });
  };

  /**
   * Reset form and set address pin value
   */
  var resetForm = function () {
    noticeForm.reset();
    window.map.setAddressValue();
    setDefaultAvatar();
    resetPhotos();
  };

  /**
   * Send form if validation passed, reset data after submit
   */
  var sendForm = function () {
    if (checkValidationSubmit()) {
      window.backend.save(new FormData(noticeForm), resetForm, window.backend.showError);
    }
  };

  /**
   * Send form on submit button click
   * @param {Object} evt
   */
  var onSubmitButtonClick = function (evt) {
    evt.preventDefault();
    sendForm();
  };

  /**
   * Send form on submit button Enter press
   * @param {Object} evt
   */
  var onSubmitButtonEnterPress = function (evt) {
    evt.preventDefault();
    window.util.isEnterEvent(evt, sendForm);
  };

  submitButton.addEventListener('click', onSubmitButtonClick);
  submitButton.addEventListener('keydown', onSubmitButtonEnterPress);

  /**
   * On avatar chooser change handler
   * @param {Object} evt
   */
  var onAvatarChooserChange = function (evt) {
    window.upload.onChangeInputFiles(evt, avatarPreview);
  };

  avatarChooser.addEventListener('change', onAvatarChooserChange);

  /**
   * Return photo image container
   * @return {Node}
   */
  var getImageContainer = function () {
    var imageContainers = formPhotoContainer.querySelectorAll('.form__photo');
    var container = Array.prototype.find.call(imageContainers, function (element) {
      return element.innerHTML === '';
    });

    if (typeof container === 'undefined') {
      imageContainers[imageContainers.length - 1].innerHTML = '';
      container = imageContainers[imageContainers.length - 1];
    }

    return container.insertAdjacentElement('afterbegin', window.upload.createPhotoImg());
  };

  /**
   * On photo chooser change handler
   * @param {Object} evt
   */
  var onPhotoChooserChange = function (evt) {
    window.upload.onChangeInputFiles(evt, getImageContainer());
  };

  photoChooser.addEventListener('change', onPhotoChooserChange);
})();
