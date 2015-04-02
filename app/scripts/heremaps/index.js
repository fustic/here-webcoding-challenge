var
  appConfig = require('../config/app.json'),
  angular = require('angular'),
  /**
  * main module to require all dependencies and run the app
  * */
  webApp = angular.module('hereWebcodingChallenge', [
    require('../logger').name,
    require('../templates').name,
    'ct.ui.router.extras',
    'ngMessages',
    'ngMaterial',
    'ngSanitize'
  ])
    .constant('Heremaps.Config', appConfig)
    .config(require('./router'))
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('light-blue')
        .accentPalette('orange')
        .warnPalette('deep-orange');
      $mdThemingProvider.theme('error')
        .primaryPalette('pink');
      $mdThemingProvider.theme('success')
        .primaryPalette('green');
    }])
    .controller('navigationController', require('./controllers/navigationController'))
    .directive('navigation', require('./directives/navigationDirective'))
    .directive('menuButton', require('./directives/menuButtonDirective'))
    .directive('httpLoader', require('./directives/httpLoaderDirective'))
    .service('UtilService', require('./services/utilService'))
    .run(['LoggerService', function (LoggerService) {
      LoggerService.consolelog('the app started, ver.: ' + appConfig.version);
    }])
    .run(['$rootScope', '$state', '$stateParams', '$window',
      function ($rootScope, $state, $stateParams, $window) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function () {
          $window.scrollTo(0, 0);
        });
      }
    ]);

module.exports = webApp;
