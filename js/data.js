'use strict';

// creates data for lodge offers

window.data = (function () {
  var LODGE_NUMBER = 8;
  var USER_IDS = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08'
  ];
  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var PRICE = {
    min: 1000,
    max: 1000000
  };
  var LODGE_TYPES = [
    'flat',
    'house',
    'bungalo'
  ];
  var ROOMS = {
    min: 1,
    max: 5
  };
  var GUESTS = {
    min: 1,
    max: 5
  };
  var CHECKIN_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var CHECKOUT_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var MAP = {
    width: {
      min: 300,
      max: 900
    },
    height: {
      min: 100,
      max: 500
    }
  };

  /**
   * Creates an object with data for particular lodge offer
   * @return {Object}
   */
  var createLodgeOffer = function () {
    var locationX = window.util.getRandomInteger(MAP.width.min, MAP.width.max);
    var locationY = window.util.getRandomInteger(MAP.height.min, MAP.height.max);
    return {
      author: {
        avatar: 'img/avatars/user' + window.util.getUniqueArrayItem(USER_IDS) + '.png'
      },

      offer: {
        title: window.util.getUniqueArrayItem(TITLES),
        address: locationX + ', ' + locationY,
        price: window.util.getRandomInteger(PRICE.min, PRICE.max),
        type: window.util.getRandomArrayItem(LODGE_TYPES),
        rooms: window.util.getRandomInteger(ROOMS.min, ROOMS.max),
        guests: window.util.getRandomInteger(GUESTS.min, GUESTS.max),
        checkin: window.util.getRandomArrayItem(CHECKIN_TIMES),
        checkout: window.util.getRandomArrayItem(CHECKOUT_TIMES),
        features: window.util.getArrayOfRandomLength(FEATURES),
        description: '',
        photos: []
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
  };
  /**
   * Returns an array with all lodge offers data
   * @return {Array}
   */
  var createOffersList = function () {
    var offersList = [];
    for (var i = 0; i < LODGE_NUMBER; i++) {
      offersList.push(createLodgeOffer());
    }
    return offersList;
  };

  return createOffersList();
})();
