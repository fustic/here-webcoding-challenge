'use strict';

var utils = require('../../common').utils;

module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: '/scripts/heremaps/views/locationLabel.html',
    controller: 'LocationLabelController',
    controllerAs: 'locationLabel',
    link: utils.emptyLinkFunction
  };
};
