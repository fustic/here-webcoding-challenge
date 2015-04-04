'use strict';

searchRouter.$inject = ['$stateProvider'];

/**
 * @name search module router
 * @param {ui.router.state.$stateProvider} $stateProvider
 */
function searchRouter($stateProvider) {

  $stateProvider
    .state('places', {
      url: '/{path:places}/?map',
      templateUrl: '/scripts/search/views/search.html',
      controller: 'SearchController',
      controllerAs: 'search',
      resolve: {
        searchState: ['Heremaps.Enums', function (Enums) {
          return Enums.SEARCH_STATE.PLACES;
        }]
      }
    });

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
