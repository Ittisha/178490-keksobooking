'use strict';

window.synchronizeFields = (function () {
  return function (firstField, secondField, callback, firstData, secondData) {

    if (firstData && secondData) {
      var index = firstData.indexOf(firstField.value);
      var finalValue = secondData[index];
      callback(secondField, finalValue);
    } else {
      callback(firstField, secondField);
    }
  };
})();
