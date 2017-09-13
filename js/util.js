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
   * Do action if Esc pressed
   * @param {Object} evt
   * @param {Function} action
   * @param {*} param - callback param
   */
  var isEscEvent = function (evt, action, param) {
    if (evt.keyCode === KEY_CODES.esc) {
      action(param);
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
      action(param1, param2);
    }
  };

  return {
    getRandomInteger: getRandomInteger,
    getRandomArrayItem: getRandomArrayItem,
    getUniqueArrayItem: getUniqueArrayItem,
    getArrayOfRandomLength: getArrayOfRandomLength,
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent
  };
})();
