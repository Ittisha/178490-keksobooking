'use strict';

window.synchronizeFields = (function () {
  var synchronizeFields = function (firstField, secondField, callback, firstData, secondData) {
    var index = firstData.indexOf(firstField.value);
    var finalValue = secondData[index];
    callback(secondField, finalValue);
  };

  return {
    synchronizeFields: synchronizeFields
  };
})();
