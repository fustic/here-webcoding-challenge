'use strict';
var utils = require('../../common').utils;
module.exports = ['$http', 'Heremaps.Config', '$window', function ($http, Config, $window) {
  return {
    restrict: 'EA',
    link: function (scope, element) {

      element.css({
        width: $window.innerWidth + 'px',
        height: $window.innerHeight + 'px'
      });

      var platform = new H.service.Platform({
        app_id: Config.api.keys.appId,
        app_code: Config.api.keys.appCode
      });

      // Obtain the default map types from the platform object
      var maptypes = platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      var map = new H.Map(
        element[0],
        maptypes.normal.map,
        {
          zoom: 10,
          center: { lng: 13.4, lat: 52.51 }
        });
    }
  };

}];
