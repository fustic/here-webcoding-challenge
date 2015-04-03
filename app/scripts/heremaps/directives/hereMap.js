'use strict';
var
  H = require('H'),
  utils = require('../../common').utils;
module.exports = ['$http', '$window', 'PlatformService', 'Heremaps.Config', 'UserService',
  function ($http, $window, PlatformService, Config, UserService) {
    return {
      restrict: 'EA',
      link: function (scope, element) {

        element.css({
          width: $window.innerWidth + 'px',
          height: $window.innerHeight + 'px'
        });

        var
          platform = PlatformService.getPlatform(),
          // Obtain the default map types from the platform object
          defaultLayers = platform.createDefaultLayers(),
          map = new H.Map(
            element[0],
            defaultLayers.normal.map,
            {
              zoom: 10,
              center: Config.location,
              pixelRation: $window.devicePixelRatio || 1
            });

        // Enable the event system on the map instance:
        var mapEvents = new H.mapevents.MapEvents(map);
        // Instantiate the default behavior, providing the mapEvents object:
        var behavior = new H.mapevents.Behavior(mapEvents);
        // Create the default UI:
        var ui = H.ui.UI.createDefault(map, defaultLayers);

        UserService.getLocation().then(function success(location) {
          map.setCenter({
            lat: location.lat,
            lng: location.lng
          }, true);
        });
      }
    };
  }
];
