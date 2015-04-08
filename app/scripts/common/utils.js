'use strict';

var utils = {
  /**
   * @doc method
   * @name isEmptyObject
   * @description checks if object is empty
   * @param {Object} obj
   * @return {boolean}
   */
  isEmptyObject: function isEmptyObject(obj) {
    if (Object.keys) {
      return !Object.keys(obj).length;
    }
    var key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  },
  emptyLinkFunction: function emptyLinkFunction(scope, element) {
    scope.$on('$destroy', function () {
      element.find('*').off();
      element.off().empty().remove();
      element = null;
    });
  },
  /**
   * @doc method
   * @name isInt
   * @description check if number is int
   * @param {number} number
   * @returns {boolean}
   */
  isInt: function isInt(number) {
    return number % 1 === 0;
  },
  /**
   * @doc method
   * @name addClassToElement
   * @description add new css class to the given element
   * @param {HTMLElement} element
   * @param {string} className
   */
  addClassToElement: function addClassToElement(element, className) {
    if (element) {
      if (element.classList) {
        element.classList.add(className);
      } else {
        element.className += ' ' + className;
      }
    }
  },
  /**
   * @doc method
   * @name removeClassFromElement
   * @description remove css class from the given element
   * @param {HTMLElement} element
   * @param {string} className
   */
  removeClassFromElement: function (element, className) {
    if (element) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        element.className = element.className.replace(className, '');
      }
    }
  },
  /**
   * @doc method
   * @name parseMapParams
   * @description parse map get parameter
   * @param {string} mapParam
   * @returns {MapParams}
   */
  parseMapParams: function parseMapParams(mapParam) {
    if (!mapParam) {
      return null;
    }
    var
      mapParamsArray = mapParam.split(','),
      map = {
        location: {
          lat: mapParamsArray[0],
          lng: mapParamsArray[1]
        },
        zoom: mapParamsArray[2],
        type: mapParamsArray[3]
      };
    return map;
  },
  getMapString: function getMapString(coords, mapType, zoom) {
    return coords.lat + ',' + coords.lng + ',' + zoom + ',' + mapType;
  },
  getLocationString: function getLocationString(coords) {
    return coords.lat + ',' + coords.lng;
  },
  getMapStringfromMap: function getMapStringfromMap(latLngArray, map) {
    var
      layerProvider = map.getBaseLayer().getProvider(),
      mapType = layerProvider.copyrightKey_ === 'hybrid' ? 'satellite' : layerProvider.copyrightKey_,
      searchMap = [].concat(latLngArray, map.getZoom(), mapType);
    return searchMap.join(',');
  },
  /**
   * @doc method
   * @name secondsRoundTime
   * @description rounds seconds to readable string, such as 4days 3hrs 5mins
   * @param {number} seconds
   * @returns {string}
   */
  secondsRoundTime: function secondsRoundTime(seconds) {
    if (!seconds || !utils.isInt(seconds)) {
      return '';
    }
      var
        days = Math.floor(seconds / (3600 * 24)),
        hrs = Math.floor((seconds - days * 3600 * 24) / 3600),
        mins = Math.ceil((seconds - hrs * 3600) / 60),
        roundTime = [];
    if (days > 0) {
      roundTime.push(days + ' days');
    }
    if (hrs > 0) {
      roundTime.push(hrs + ' hrs');
    }
    if (mins > 0) {
      roundTime.push(mins + ' mins');
    }
    return roundTime.join(', ');
  },
  /**
   * @doc method
   * @name metersRoundDistance
   * @description rounds meters to readable string, such as 4.2km
   * @param {number} meters
   * @returns {string}
   */
  metersRoundDistance: function metersRoundDistance(meters) {
    if (!meters || !utils.isInt(meters)) {
      return '';
    }
    var
      kms = Math.floor(meters / 1000);
    meters = Math.ceil((meters - kms * 1000) / 100);

    return kms + '.' + (meters + '')[0] + ' km';
  }
};
module.exports = utils;
