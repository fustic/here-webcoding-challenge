'use strict';
var
  H = require('H'),
  utils = require('../../common').utils;
module.exports = ['$http', '$window', 'MapService', 'Heremaps.Config', 'UserService',
  function ($http, $window, MapService, Config, UserService) {
    return {
      restrict: 'EA',
      template: '<md-progress-circular md-mode="indeterminate"></md-progress-circular>',
      link: function (scope, element) {

        element.css({
          width: $window.innerWidth + 'px',
          height: $window.innerHeight + 'px'
        });

        UserService.getLocation().then(function success(location) {
          element.html('');
          var map = MapService.initMap(
            element[0],
            {
              lat: location.lat,
              lng: location.lng
            },
            $window.devicePixelRatio || 1
          );
        });
      }
    };
  }
];
