'use strict';

var
  common = require('../common');

appRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
/**
 * main app router
 * @param {ui.router.state.$stateProvider} $stateProvider
 * @param {ui.router.router.$urlRouterProvider} $urlRouterProvider
 * @param {$locationProvider} $locationProvider
 */
function appRouter($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.rule(common.router.trailingSlash);
}

module.exports = appRouter;
