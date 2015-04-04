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
    .service('UtilService', require('./services/utilService'))
    .run(['LoggerService', function (LoggerService) {
      LoggerService.consolelog('the app started, ver.: ' + appConfig.version);
    }]);

module.exports = webApp;
