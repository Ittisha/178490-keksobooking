'use strict';
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
var MAIN_PIN = {
  width: 62,
  height: 83
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
  return array.splice(getRandomInteger(0, array.length - 1), 1);
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
    newArray.push(getUniqueArrayItem(arrayCopy)[0]);
  }
  return newArray;
};
/**
 * Creates an object with data for particular lodge advert
 * @return {{author: {avatar: string}, offer: {title: *, address: string, price: number, type: *, rooms: number, guests: number, checkin: *, checkout: *, features: Array, description: string, photos: Array}, location: {x: number, y: number}}}
 */
var createLodgeAdvert = function () {
  var locationX = getRandomInteger(MAP.width.min, MAP.width.max) - MAIN_PIN.width / 2;
  var locationY = getRandomInteger(MAP.height.min, MAP.height.max) - MAIN_PIN.height;
  return {
    'author': {
      'avatar': 'img/avatars/user' + getUniqueArrayItem(USER_IDS) + '.png'
    },

    'offer': {
      'title': getUniqueArrayItem(TITLES),
      'address': locationX + ', ' + locationY,
      'price': getRandomInteger(PRICE.min, PRICE.max),
      'type': getRandomArrayItem(LODGE_TYPES),
      'rooms': getRandomInteger(ROOMS.min, ROOMS.max),
      'guests': getRandomInteger(GUESTS.min, GUESTS.max),
      'checkin': getRandomArrayItem(CHECKIN_TIMES),
      'checkout': getRandomArrayItem(CHECKOUT_TIMES),
      'features': getArrayOfRandomLength(FEATURES),
      'description': '',
      'photos': []
    },

    'location': {
      'x': locationX,
      'y': locationY
    }
  };
};
/**
 * Returns an array with all lodge adverts data
 * @return {Array}
 */
var createAdvertsList = function () {
  var advertsList = [];
  for (var i = 0; i < LODGE_NUMBER; i++) {
    advertsList.push(createLodgeAdvert());
  }
  return advertsList;
};

createAdvertsList();
