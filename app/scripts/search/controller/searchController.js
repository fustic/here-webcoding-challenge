'use strict';
var utils = require('../../common').utils;
searchController.$inject = [
  'Heremaps.Enums',
  'searchState',
  '$stateParams',
  'MapService',
  '$rootScope',
  '$scope'
];
/**
 * @class
 * @name SearchController
 * @param {HeremapsEnums} Enums
 * @param {Object} searchState
 * @param {$stateParams} $stateParams
 * @param {MapService} MapService
 * @param {$rootScope} $rootScope
 * @param {$scope} $scope
 */
function searchController(Enums, searchState, $stateParams, MapService, $rootScope, $scope) {
  var
    tabsList = [Enums.SEARCH_STATE.PLACES, Enums.SEARCH_STATE.ROUTES],
    mapConfig = utils.parseMapParams($stateParams.map),
    addDirectionEvent = $rootScope.$on(Enums.EVENTS.ADD_DIRECTION, function () {
      this.tabs.selectedIndex = tabsList.indexOf(Enums.SEARCH_STATE.ROUTES);
    }.bind(this));
  this.tabs = {
    selectedIndex: tabsList.indexOf(searchState)
  };
  this.placeID = $stateParams.placeID;

  if (mapConfig) {
    MapService.updateMap(mapConfig);
  }

  $scope.$on('$destroy', function () {
    addDirectionEvent();
  });
}
module.exports = searchController;
