'use strict';

window.map = (function () {
  var tokyoPinMap = 'tokyo__pin-map';
  var tokyoMap = document.querySelector('.tokyo__pin-map');
  var mainPin = tokyoMap.querySelector('.pin__main');
  var mapForPinDrag = document.querySelector('.tokyo');

  var halfMainPinWidth = mainPin.offsetWidth / 2;
  var mainPinHeight = mainPin.offsetHeight;

  var addressInput = document.getElementById('address');

  var setAddressValue = function () {
    addressInput.value = 'x: ' + Math.floor(mainPin.offsetLeft + halfMainPinWidth) + ', y: ' + (mainPin.offsetTop + mainPinHeight);
  };

  setAddressValue();

  /**
   * Get three unique adverts
   * @param {Array} offersData
   * @return {Array}
   */
  var getTreeUniqueAdverts = function (offersData) {
    var threeUniqueAdverts = [];
    var offersDataCopy = offersData.slice();

    for (var i = 0; i < 3; i++) {
      threeUniqueAdverts.push(window.util.getUniqueArrayItem(offersDataCopy));
    }

    return threeUniqueAdverts;
  };
  /**
   * Render server data
   * @param {Array} offersData
   */
  var renderServerData = function (offersData) {
    // render all pins on the map
    window.pin.renderPins(getTreeUniqueAdverts(offersData), tokyoPinMap);
    var pins = tokyoMap.querySelectorAll('.pin');
    // Focus on the first not main pin
    pins[1].focus();

    /**
     * Activate selected pin on ENTER keydown and render it's lodge card
     * @param {Object} evt
     */
    var onPinEnterPress = function (evt) {
      window.util.isEnterEvent(evt, window.showCard.showCard, evt.target.firstChild, offersData);
      window.pin.makeOnePinActive(evt.target, pins);
    };
    /**
     * Activate selected pin on click and render it's lodge card
     * @param {Object} evt
     */
    var onPinClick = function (evt) {
      window.showCard.showCard(evt.target, offersData);
      window.pin.makeOnePinActive(evt.target.parentNode, pins);
    };

    // handlers for pins
    tokyoMap.addEventListener('click', onPinClick);
    tokyoMap.addEventListener('keydown', onPinEnterPress);

  };

  /**
   * On success data load handler
   * @param {Array} offersData
   */
  var onSuccess = function (offersData) {
    renderServerData(offersData);
    window.filters.activateFilters(offersData);
  };

  window.backend.load(onSuccess, window.backend.showError);

  /**
   * Set new pin position in consideration of limits
   * @param {number} startPosition
   * @param {Object} limits
   * @param {number} pinSize
   * @param {string} position
   */
  var setMainPinPosition = function (startPosition, limits, pinSize, position) {
    mainPin.style[position] = startPosition + 'px';

    if (startPosition < limits.min - pinSize) {
      mainPin.style[position] = limits.min - pinSize + 'px';
    }
    if (startPosition > limits.max - pinSize) {
      mainPin.style[position] = limits.max - pinSize + 'px';
    }
  };
  /**
   * Set new location coordinates
   * @param {{x: number, y: number}} coords
   */
  var setLocationCoords = function (coords) {
    var MAP = {
      width: {
        min: 0,
        max: mapForPinDrag.offsetWidth
      },
      height: {
        min: 100,
        max: 660
      }
    };

    setMainPinPosition(coords.x, MAP.width, halfMainPinWidth, 'left');
    setMainPinPosition(coords.y, MAP.height, mainPinHeight, 'top');

  };

  /**
   * @param {Object} evt
   */
  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();
    mainPin.style.zIndex = 1;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    /**
     * @param {Object}moveEvt
     */
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      setLocationCoords(mainPinCoords);

      setAddressValue();
    };
    /**
     * @param {Object} upEvt
     */
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      mainPin.style.zIndex = 0;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  return {
    setAddressValue: setAddressValue
  };
})();
