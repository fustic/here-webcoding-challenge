'use strict';

module.exports = {
  /**
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
  isInt: function isInt(number) {
    return number % 1 === 0;
  },
  addClassToElement: function addClassToElement(element, className) {
    if (element) {
      if (element.classList) {
        element.classList.add(className);
      } else {
        element.className += ' ' + className;
      }
    }
  },
  removeClassFromElement: function (element, className) {
    if (element) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        element.className = element.className.replace(className, '');
      }
    }
  },
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
  secondsRoundTime: function secondsRoundTime(seconds) {
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
  metersRoundDistance: function metersRoundDistance(meters) {
    var
      kms = Math.floor(meters / 1000),
      meters = Math.ceil((meters - kms * 1000) / 100);

    return kms + '.' + (meters + '')[0] + ' km';
  }
};
