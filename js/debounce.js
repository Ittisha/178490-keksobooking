'use strict';

window.debounce = (function () {
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;

  /**
   *  Limits the rate at which a func can fire
   * @param {Function} func
   */
  var debounce = function (func) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
  };

  return {
    debounce: debounce
  };
})();
