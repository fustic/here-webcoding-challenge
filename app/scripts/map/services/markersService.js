'use strict';

var
  H = require('H'),
  utils = require('../../common').utils;

markersService.$inject = ['$q', 'Heremaps.Config', 'MapService'];

function markersService($q, Config, MapService) {

  return {
    addCurrentPositionMarker: function addCurrentPositionMarker(coordinates) {
      var
        map = MapService.getMap(),
        icon = new H.map.DomIcon('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><path fill="rgb(64,196,255)" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>'),
        marker = new H.map.DomMarker(coordinates, {icon: icon});

      map.addObject(marker);
    }
  };
}

module.exports = markersService;
