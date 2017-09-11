'use strict';

window.filters = (function () {
  /**
   * Enum for middle price range
   * @readonly
   * @enum {number}
   */
  var middlePriceRange = {
    MIN: 10000,
    MAX: 50000
  };

  var tokyoPinMap = 'tokyo__pin-map';
  var filters = document.querySelector('.tokyo__filters');
  var housingTypeFilter = filters.querySelector('#housing_type');
  var housingRoomsFilter = filters.querySelector('#housing_room-number');
  var housingGuestsFilter = filters.querySelector('#housing_guests-number');
  var housingPriceFilter = filters.querySelector('#housing_price');
  var housingFeaturesFilter = filters.querySelector('#housing_features');

  /**
   * Get selected features from housing features filter
   * @return {Array}
   */
  var getSelectedFeatures = function () {
    var allFeaturesElements = housingFeaturesFilter.querySelectorAll('input[type="checkbox"]:checked');
    return [].map.call(allFeaturesElements, function (elem) {
      return elem.value;
    });
  };

  /**
   * Check if selected features are equal to advert features
   * @param {Array} selectedFeatures
   * @param {Array} advertFeatures
   * @return {boolean}
   */
  var isFeatureInAdvert = function (selectedFeatures, advertFeatures) {
    return selectedFeatures.every(function (elem) {
      return advertFeatures.indexOf(elem) !== -1;
    });
  };

  /**
   * Get string value of price range
   * @param {number} priceValue
   * @return {string}
   */
  var getPriceRange = function (priceValue) {
    if (priceValue < middlePriceRange.MIN) {
      return 'low';
    }
    if (priceValue >= middlePriceRange.MAX) {
      return 'high';
    }
    return 'middle';
  };
  /**
   * Check if filter value is equal to advert value
   * @param {string} filterValue
   * @param {string} advertValue
   * @return {boolean}
   */
  var isRequiredAdvert = function (filterValue, advertValue) {
    return filterValue === 'any' ? true : filterValue === advertValue;
  };
  /**
   * Returns filtered adverts array
   * @param {Array} data
   * @return {Array}
   */
  var getFilteredAdverts = function (data) {
    return data.filter(function (element) {
      return isRequiredAdvert(housingTypeFilter.value, element.offer.type) &&
        isRequiredAdvert(housingRoomsFilter.value, element.offer.rooms.toString()) &&
        isRequiredAdvert(housingGuestsFilter.value, element.offer.guests.toString()) &&
        isRequiredAdvert(housingPriceFilter.value, getPriceRange(element.offer.price)) &&
        isFeatureInAdvert(getSelectedFeatures(), element.offer.features);
    });
  };

  /**
   * Activate filters' change observers and rerender required adverts
   * @param {Array} data
   */
  var activateFilters = function (data) {
    /**
     * Render required pins, delete others
     */
    var renderFilteredPins = function () {
      window.card.closeDialog();
      window.pin.deletePins();
      window.pin.renderPins(getFilteredAdverts(data), tokyoPinMap);
    };
    /**
     * On type filter change handler
     */
    var onTypeFilterChange = function () {
      window.debounce.debounce(renderFilteredPins);
    };
    /**
     * On rooms filter change handler
     */
    var onRoomsFilterChange = function () {
      window.debounce.debounce(renderFilteredPins);
    };
    /**
     * On guests filter change handler
     */
    var onGuestsFilterChange = function () {
      window.debounce.debounce(renderFilteredPins);
    };
    /**
     * On price filter change handler
     */
    var onPriceFilterChange = function () {
      window.debounce.debounce(renderFilteredPins);
    };
    /**
     * On features filter change handler
     * @param {Object} evt
     */
    var onFeaturesFilterChange = function (evt) {
      if (evt.target.type === 'checkbox') {
        window.debounce.debounce(renderFilteredPins);
      }
    };

    housingTypeFilter.addEventListener('change', onTypeFilterChange);
    housingRoomsFilter.addEventListener('change', onRoomsFilterChange);
    housingGuestsFilter.addEventListener('change', onGuestsFilterChange);
    housingPriceFilter.addEventListener('change', onPriceFilterChange);
    housingFeaturesFilter.addEventListener('change', onFeaturesFilterChange);
  };

  return {
    activateFilters: activateFilters
  };
})();
