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
    'ngSanitize'
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
    .directive('hereMap', require('./directives/hereMap'))
    .directive('userCurrentLocation', require('./directives/userCurrentLocationDirective'))
    .controller('UserCurrentLocationController', require('./controllers/userCurrentLocationController'))
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
            //to keep search parameters
            if (fromParams) {
              Object.keys(fromParams).forEach(function (key) {
                if (!toParams[key]) {
                  toParams[key] = fromParams[key];
                }
              });
            }
            $location.search(toParams);
          }
        );
      }
    ]);

module.exports = webApp;
