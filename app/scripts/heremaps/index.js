var
  appConfig = require('../config/app.json'),
  angular = require('angular'),
  /**
  * main module to require all dependencies and run the app
  * */
  webApp = angular.module('hereWebcodingChallenge', [
    require('../logger').name,
    require('../templates').name,
    require('../map').name,
    require('../user').name,
    require('../search').name,
    'ui.router',
    'ngMessages',
    'ngMaterial',
    'ngSanitize',
    'badwing.autoselect',
    'ng-sortable',
    'angular-cache'
  ])
    .constant('Heremaps.Enums', require('../config/enums'))
    .constant('Heremaps.Config', appConfig)
    .config(require('./router'))
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('light-blue')
        .warnPalette('cyan');
      $mdThemingProvider.theme('error')
        .primaryPalette('pink');
      $mdThemingProvider.theme('success')
        .primaryPalette('green');
    }])
    .config(['CacheFactoryProvider', function (CacheFactoryProvider) {
      angular.extend(CacheFactoryProvider.defaults, {
        maxAge: 604800000, // = 1000 * 60 * 60 * 24 * 7 (1 week)
        storageMode: 'localStorage',
        deleteOnExpire: 'aggressive',
        storagePrefix: 'Heremaps.',
        capacity: 200
      });
    }])
    .directive('hereMap', require('./directives/hereMap'))
    .directive('userCurrentLocation', require('./directives/userCurrentLocationDirective'))
    .directive('shareUrl', require('./directives/shareUrlDirective'))
    .controller('UserCurrentLocationController', require('./controllers/userCurrentLocationController'))
    .controller('ShareUrlController', require('./controllers/shareUrlController'))
    .factory('HeremapsCacheFactory', require('./factories/cacheFactory'))
    .service('UtilService', require('./services/utilService'))
    .run(['LoggerService', function (LoggerService) {
      LoggerService.consolelog('the app started, ver.: ' + appConfig.version);
    }])
    .run(['$rootScope', '$state', '$stateParams', '$location',
      function ($rootScope, $state, $stateParams, $location) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeStart',
          function (event, toState, toParams, fromState, fromParams) {
            //to keep search map parameter
            if (fromParams && fromParams.map && !toParams.map) {
              toParams.map = fromParams.map;
            }
            $location.search(toParams);
            if (fromState.name === toState.name && toState.name === 'place' && toParams.placeID === fromParams.placeID) {
              event.preventDefault();
            }
          }
        );
      }
    ]);

module.exports = webApp;
