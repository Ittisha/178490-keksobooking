'use strict';

// create and render pins

window.pin = (function () {
  var IMG_WIDTH = 40;
  var IMG_HEIGHT = 40;
  var PIN_CLASS_NAME = 'pin';
  var IMG_CLASS_NAME = 'rounded';
  var PIN_SIZE = {
    width: 56,
    height: 75
  };

  var tokyoMap = document.querySelector('.tokyo__pin-map');

  /**
   * Return pin for particular offer
   * @param {Object} advert
   * @return {Element}
   */
  var createPin = function (advert) {
    var pin = document.createElement('div');
    var img = document.createElement('img');

    pin.className = PIN_CLASS_NAME;
    pin.style.left = advert.location.x - PIN_SIZE.width / 2 + 'px';
    pin.style.top = advert.location.y - PIN_SIZE.height + 'px';
    pin.tabIndex = 0;

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
   * @param {Array} pins
   */
  var makeOnePinActive = function (currentPin, pins) {
    // forEach doesn't work with Nodes in Edge
    Array.prototype.forEach.call(pins, function () {
      deactivatePin();
    });
    currentPin.classList.add('pin--active');
  };

  /**
   * Delete pins from tokyo map
   */
  var deletePins = function () {
    Array.prototype.forEach.call(tokyoMap.querySelectorAll('.pin'), function (element) {
      if (!element.classList.contains('pin__main')) {
        tokyoMap.removeChild(element);
      }
    });
  };

  return {
    renderPins: renderPins,
    deactivatePin: deactivatePin,
    makeOnePinActive: makeOnePinActive,
    deletePins: deletePins
  };
})();
