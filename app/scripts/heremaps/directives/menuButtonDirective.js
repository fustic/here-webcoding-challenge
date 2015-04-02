'use strict';

module.exports = function () {
  return {
    restrict: 'E',
    templateUrl: '/scripts/heremaps/views/menuButton.html',
    controller: ['$mdSidenav', function ($mdSidenav) {
      this.toggleMenu = function toggleMenu() {
        $mdSidenav('left').toggle();
      };
    }],
    controllerAs: 'menuButton'
  };
};
