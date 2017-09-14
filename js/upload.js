'use strict';

window.upload = (function () {
  var FILE_TYPES = [
    'gif',
    'jpg',
    'jpeg',
    'png'];
  var PHOTO_SIZE = {
    width: 70,
    height: 70
  };

  /**
   * Show preview image
   * @param {Object} imageFile
   * @param {Node} preview
   */
  var showPreviewImage = function (imageFile, preview) {
    var fileName = imageFile.name.toLowerCase();
    var matches = FILE_TYPES.some(function (element) {
      return fileName.endsWith(element);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(imageFile);
    }
  };

  /**
   * On change input files handler
   * @param {Object} evt
   * @param {Node} preview
   */
  var onChangeInputFiles = function (evt, preview) {
    showPreviewImage(evt.target.files[0], preview);
  };

  /**
   * Create photo image element
   * @return {Element}
   */
  var createPhotoImg = function () {
    var imgElement = document.createElement('img');
    imgElement.classList.add('form__photo-image');
    imgElement.width = PHOTO_SIZE.width;
    imgElement.height = PHOTO_SIZE.height;
    return imgElement;
  };

  return {
    onChangeInputFiles: onChangeInputFiles,
    createPhotoImg: createPhotoImg
  };
})();
