'use strict';

// utility functions

window.util = (function () {
  var KEY_CODES = {
    enter: 13,
    esc: 27
  };

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
   * Returns unique random array item
   * @param {Array} array
   * @return {*}
   */
  var getUniqueArrayItem = function (array) {
    return array.splice(getRandomInteger(0, array.length - 1), 1)[0];
  };

  /**
   * Do action if Esc pressed
   * @param {Object} evt
   * @param {Function} action
   */
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KEY_CODES.esc) {
      evt.preventDefault();
      action();
    }
  };

  /**
   * Do action if Enter pressed
   * @param {Object} evt
   * @param {Function} action
   * @param {*} param1 - callback param
   * @param {*} param2 - callback param
  */
  var isEnterEvent = function (evt, action, param1, param2) {
    if (evt.keyCode === KEY_CODES.enter) {
      evt.preventDefault();
      action(param1, param2);
    }
  };

  return {
    getUniqueArrayItem: getUniqueArrayItem,
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent
  };
})();
