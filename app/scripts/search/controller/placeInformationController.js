'use strict';
var utils = require('../../common').utils;
placeInformationController.$inject = [
  'SearchService', '$scope', '$location', 'MapService', 'UtilService', '$filter'
];

function placeInformationController(SearchService, $scope, $location, MapService, UtilService, $filter) {
  var
    placeID = $scope.placeId,
    addressFilter = $filter('vicinity');
  this.place = null;

  SearchService.place(placeID).then(function success(place) {
    this.place = place;
    console.log(place);
    this.place.calculated = {};
    if (this.place.categories && this.place.categories.length) {
      this.place.calculated.categories = [];
      this.place.categories.forEach(function (category) {
        this.place.calculated.categories.push(category.title);
      }.bind(this));
      this.place.calculated.categories = this.place.calculated.categories.join(', ');
    }
    if (this.place.location.address) {
      this.place.calculated.address = addressFilter(this.place.location.address.text);
    }

  }.bind(this), function error(err) {
    UtilService.showErrorMessage(err.data.message);
  });
}
module.exports = placeInformationController;
