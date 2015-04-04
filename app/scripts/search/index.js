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
    .controller('SearchController', require('./controller/searchController'))
    .directive('searchTabs', require('./directives/searchTabsDirective'));

module.exports = search;
