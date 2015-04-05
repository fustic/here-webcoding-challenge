'use strict';
userCurrentLocationController.$inject = [
  'MapService',
  'UserService'
];

function userCurrentLocationController(MapService, UserService) {

  this.disabled = true;
  this.location = null;
  UserService.getLocation().then(function success(location) {
    this.disabled = false;
    this.showTooltip = true;
    this.location = location;
  }.bind(this));
  UserService.getReverseIPLocation().then(function success(location) {
    this.disabled = false;
    this.showTooltip = true;
    if (!this.location) {
      this.location = location;
    }
  }.bind(this));
  this.centerLocation = function centerLocation() {
    MapService.updateMap({
      location: this.location,
      zoom: 17
    });
    this.showTooltip = false;
  };
}
module.exports = userCurrentLocationController;
