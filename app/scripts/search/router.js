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
      reloadOnSearch: false,
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
    .state('place', angular.extend({}, placesState, {
      url: '/places/:placeID/?map',
      reloadOnSearch: true
    }));
  $urlRouterProvider.when('/routes/', '/routes/car//');
  $stateProvider
    .state('routes', {
      url: '/routes/:mode/:route/?map',
      templateUrl: '/scripts/search/views/search.html',
      controller: 'SearchController',
      controllerAs: 'search',
      reloadOnSearch: false,
      resolve: {
        searchState: ['Heremaps.Enums', function (Enums) {
          return Enums.SEARCH_STATE.ROUTES;
        }]
      }
    });
}

module.exports = searchRouter;
