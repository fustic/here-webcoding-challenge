'use strict';
var utils = require('../../common').utils;
searchController.$inject = [
  'Heremaps.Enums',
  'searchState',
  '$stateParams',
  'MapService'
];

function searchController(Enums, searchState, $stateParams, MapService) {
  var
    tabsList = [Enums.SEARCH_STATE.PLACES, Enums.SEARCH_STATE.ROUTES];
  this.tabs = {
    selectedIndex: tabsList.indexOf(searchState)
  };
  this.placeID = $stateParams.placeID;

  var mapConfig = utils.parseMapParams($stateParams.map);
  if (mapConfig) {
    MapService.updateMap(mapConfig);
  }
}
module.exports = searchController;
