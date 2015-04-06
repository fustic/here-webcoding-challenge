'use strict';

module.exports = function () {
  return {
    restrict: 'EA',
    templateUrl: '/scripts/search/views/placeInformation.html',
    scope: {
      placeId: '@'
    },
    controller: 'PlaceInformationController',
    controllerAs: 'placeInfo'
  };
};
