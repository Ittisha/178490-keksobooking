'use strict';

(function () {
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
