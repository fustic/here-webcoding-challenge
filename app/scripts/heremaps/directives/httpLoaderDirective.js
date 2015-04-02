'use strict';
var utils = require('../../common').utils;
module.exports = ['$http' ,function ($http) {
  return {
    restrict: 'A',
    link: function (scope, elm) {

      scope.isLoading = function () {
        return $http.pendingRequests.length > 0;
      };

      scope.$watch(scope.isLoading, function (v) {
        if (v) {
          utils.removeClassFromElement(elm[0], 'hidden');
        } else {
          utils.addClassToElement(elm[0], 'hidden');
        }
      });
    }
  };

}];
