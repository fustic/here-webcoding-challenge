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
    .controller('SearchController', require('./controller/searchController'))
    .controller('SearchPlacesController', require('./controller/searchPlacesController'))
    .directive('searchTabs', require('./directives/searchTabsDirective'))
    .directive('searchPlaces', require('./directives/searchPlacesDirective'))
    .service('SearchService', require('./services/searchService'));

module.exports = search;
