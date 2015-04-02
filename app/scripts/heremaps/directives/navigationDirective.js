'use strict';

module.exports = ['$mdSidenav', function ($mdSidenav) {
  return {
    restrict: 'A',
    templateUrl: '/scripts/heremaps/views/navigation.html',
    controller: 'navigationController',
    controllerAs: 'navigation',
    link: function (scope, element) {
      element.find('a').on('click', function () {
        $mdSidenav('left').close();
      });

      scope.$on('$destroy', function () {
        element.find('a').off('click');
        element.empty();
      });
    }
  };
}];
