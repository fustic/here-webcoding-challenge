'use strict';

module.exports = ['$window', 'MapService', 'UserService',
  function ($window, MapService, UserService) {
    return {
      restrict: 'EA',
      template: '<md-progress-circular md-mode="indeterminate" class="md-accent"></md-progress-circular>',
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
