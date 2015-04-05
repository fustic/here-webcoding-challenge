'use strict';

locationLabelController.$inject = ['$scope'];

function locationLabelController($scope) {
  function updateLabelFn(location) {
    this.title = location.Location.Address.Label.split(',')[0];
    this.locationId = location.Location.LocationId;

  }
  var updateLabel = updateLabelFn.bind(this);
  this.setLocation = function setLocation(location) {
    updateLabel(location);
  };
}

module.exports = locationLabelController;
