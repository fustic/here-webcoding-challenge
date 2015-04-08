'use strict';
userCurrentLocationController.$inject = [
  'MapService',
  'UserService',
  'MarkersService'
];
/**
 * @class
 * @name UserCurrentLocationController
 * @param {MapService} MapService
 * @param {UserService} UserService
 * @param {MarkersService} MarkersService
 */
function userCurrentLocationController(MapService, UserService, MarkersService) {

  this.disabled = true;
  this.location = null;
  //get user location using html5
  UserService.getLocation().then(function success(location) {
    this.disabled = false;
    this.showTooltip = true;
    this.location = location;
    MarkersService.addCurrentPositionMarker(location);
  }.bind(this));
  //get user location by reversing ip address
  UserService.getReverseIPLocation().then(function success(location) {
    this.disabled = false;
    //if location was already set via html5 location - don't override
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
