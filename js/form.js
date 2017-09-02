'use strict';

(function () {
  var TYPES_MIN_PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var HUNDRED_ROOMS_VALUE = '100';
  var NO_GUESTS = '0';
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

  var noticeForm = document.querySelector('.notice__form');
  var timeInField = noticeForm.querySelector('#timein');
  var timeOutField = noticeForm.querySelector('#timeout');
  var roomsNumberField = noticeForm.querySelector('#room_number');
  var guestsField = noticeForm.querySelector('#capacity');
  var titleField = noticeForm.querySelector('#title');
  var lodgeTypeField = noticeForm.querySelector('#type');
  var priceField = noticeForm.querySelector('#price');
  var submitButton = noticeForm.querySelector('.form__submit');

  /**
   *Set custom validity
   * @param {Node} inputNode
   * @param {boolean} booleanCondition
   * @param {string} message1
   * @param {string} quantity
   * @param {string} message2
   */
  var setNewValidationMessage = function (inputNode, booleanCondition, message1, quantity, message2) {
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
    var minLength = inputNode.getAttribute('minlength');
    var maxLength = inputNode.getAttribute('maxlength');

    inputNode.setCustomValidity('');

    setNewValidationMessage(inputNode, inputNode.validity.tooShort, TITLE_VALIDITY_MESSAGES.short.firstPart, minLength,
        TITLE_VALIDITY_MESSAGES.short.lastPart);
    setNewValidationMessage(inputNode, inputNode.validity.tooLong, TITLE_VALIDITY_MESSAGES.long.firstPart, maxLength,
        TITLE_VALIDITY_MESSAGES.long.lastPart);
    setNewValidationMessage(inputNode, inputNode.validity.valueMissing, TITLE_VALIDITY_MESSAGES.missing);
  };

  /**
   * Validate title min-length for Edge
   * @param {Object} evt
   */
  var onTitleFieldInput = function (evt) {
    var minLength = evt.target.getAttribute('minlength');
    var target = evt.target;

    if (target.value.length < minLength) {
      target.setCustomValidity(TITLE_VALIDITY_MESSAGES.short.firstPart + minLength + TITLE_VALIDITY_MESSAGES.short.lastPart);
    } else {
      target.setCustomValidity('');
    }
  };
  /**
   * Rewrite price validation messages in russian
   * @param {Node} inputNode
   */
  var rewritePriceValidationMessages = function (inputNode) {
    var minPrice = inputNode.getAttribute('min');
    var maxPrice = inputNode.getAttribute('max');

    inputNode.setCustomValidity('');
    setNewValidationMessage(inputNode, inputNode.validity.rangeUnderflow, PRICE_VALIDITY_MESSAGES.underFlow,
        (+minPrice).toLocaleString('ru'));
    setNewValidationMessage(inputNode, inputNode.validity.rangeOverflow, PRICE_VALIDITY_MESSAGES.overFlow,
        (+maxPrice).toLocaleString('ru'));
    setNewValidationMessage(inputNode, inputNode.validity.valueMissing, PRICE_VALIDITY_MESSAGES.missing);
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
  var onRoomsNumberChange = function (evt) {
    Array.prototype.forEach.call(guestsField.options, function (elem) {
      if (evt.target.value === HUNDRED_ROOMS_VALUE) {
        elem.disabled = elem.value !== NO_GUESTS;
        guestsField.value = NO_GUESTS;
      } else {
        elem.disabled = elem.value === NO_GUESTS || elem.value > evt.target.value;
        guestsField.value = evt.target.value;
      }
    });
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
   * Send form if validation passed, reset data after submit
   */
  var sendForm = function () {
    if (checkValidationSubmit()) {
      noticeForm.submit();
      noticeForm.reset();
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

})();
