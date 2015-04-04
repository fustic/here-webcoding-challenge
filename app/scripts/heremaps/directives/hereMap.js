'use strict';

module.exports = ['$window', 'MapService', function ($window, MapService) {
  return {
    restrict: 'EA',
    template: '<md-progress-circular md-mode="indeterminate" class="md-accent"></md-progress-circular>',
    link: function (scope, element) {

      element.css({
        width: $window.innerWidth + 'px',
        height: $window.innerHeight + 'px'
      });
      element.html('');
      MapService.initMap(
        element[0],
        $window.devicePixelRatio || 1
      );
      //
      //var mapConfig =
      //if (mapConfig) {
      //  element.html('');
      //
      //} else {

      //}
    }
  };
}];
