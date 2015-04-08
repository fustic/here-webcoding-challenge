'use strict';

/**
 * @module heremaps.search
 * @name HeremapsSearch
 * @description Search module - search for places, directions
 */

var
  angular = require('angular'),
  search = angular
    .module('heremapsSearch', ['ui.router'])
    .config(require('./router'))
    .filter('vicinity', require('./filters/vicinityFilter'))
    .filter('waypointTitle', require('./filters/waypointTitleFilter'))
    .filter('placeAddress', require('./filters/placeAddressFilter'))
    .filter('placeTitle', require('./filters/placeTitleFilter'))
    .controller('SearchController', require('./controller/searchController'))
    .controller('SearchPlacesController', require('./controller/searchPlacesController'))
    .controller('SearchDirectionsController', require('./controller/searchDirectionsController'))
    .controller('PlaceInformationController', require('./controller/placeInformationController'))
    .directive('searchTabs', require('./directives/searchTabsDirective'))
    .directive('searchPlaces', require('./directives/searchPlacesDirective'))
    .directive('searchDirections', require('./directives/searchDirectionDirective'))
    .directive('searchDirectionItemList', require('./directives/searchDirectionItemList'))
    .directive('placeInformation', require('./directives/placeInformationDirective'))
    .directive('directionInfo', require('./directives/directionInfoDirective'))
    .factory('WaypointFactory', require('./factories/waypointFactory'))
    .service('SearchService', require('./services/searchService'));

module.exports = search;
