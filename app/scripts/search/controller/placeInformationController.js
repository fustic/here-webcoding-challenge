'use strict';
var utils = require('../../common').utils;
placeInformationController.$inject = [
  'SearchService', '$rootScope', '$scope', 'MarkersService', 'UtilService', '$filter', 'Heremaps.Enums'
];

function placeInformationController(SearchService, $rootScope, $scope, MarkersService, UtilService, $filter, Enums) {
  var
    placeID = $scope.placeId,
    addressFilter = $filter('vicinity');
  this.place = null;
  this.showTooltip = true;

  SearchService.place(placeID).then(function success(place) {
    this.place = place;

    MarkersService.showPlaceBubble(place);

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

  this.addDirection = function addDirection() {
    this.showTooltip = false;
    $rootScope.$emit(Enums.EVENTS.ADD_DIRECTION, this.place.location.position.join(','), this.place.placeId);
  };

}
module.exports = placeInformationController;
