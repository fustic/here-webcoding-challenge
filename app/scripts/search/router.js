'use strict';

var angular = require('angular');
searchRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

/**
 * @name search module router
 * @param {ui.router.state.$stateProvider} $stateProvider
 * @param {ui.router.state.$urlRouterProvider} $urlRouterProvider
 */
function searchRouter($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  var
    placesState = {
      url: '/places?map',
      templateUrl: '/scripts/search/views/search.html',
      controller: 'SearchController',
      controllerAs: 'search',
      resolve: {
        searchState: ['Heremaps.Enums', function (Enums) {
          return Enums.SEARCH_STATE.PLACES;
        }]
      }
    };
  $stateProvider
    .state('index', angular.extend({}, placesState, {url: '/?map'}));
  $stateProvider
    .state('places', placesState);

  $stateProvider
    .state('routes', {
      url: '/routes/?map',
      templateUrl: '/scripts/search/views/search.html',
      controller: 'SearchController',
      controllerAs: 'search',
      resolve: {
        searchState: ['Heremaps.Enums', function (Enums) {
          return Enums.SEARCH_STATE.ROUTES;
        }]
      }
    });
}

module.exports = searchRouter;
