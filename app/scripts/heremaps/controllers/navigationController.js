'use strict';

navigationController.$inject = ['$mdSidenav'];

function navigationController($mdSidenav) {
  this.close = function () {
    $mdSidenav('left').close();
  };
}
module.exports = navigationController;
