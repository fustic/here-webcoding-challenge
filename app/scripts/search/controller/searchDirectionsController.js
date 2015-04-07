'use strict';
var utils = require('../../common').utils;
searchDirectionsController.$inject = [
  'SearchService', '$location', 'MapService', 'Heremaps.Enums'
];

function searchDirectionsController(SearchService, $location, MapService, Enums) {

  this.data = {
    maxWaypoints: 5
  };

  this.waypoints = [];

  this.waypoints.push({});
  this.waypoints.push({});
  this.waypoints.push({});
  this.waypoints.push({});

  this.getPlaceHolder = function getPlaceHolder(index) {
    if (index === 0) {
      return Enums.DIRECTION_TYPES.FROM;
    }
    if (index === this.waypoints.length - 1) {
      return Enums.DIRECTION_TYPES.TO;
    }
    return Enums.DIRECTION_TYPES.VIA;
  };

  this.addWaypoint = function addWaypoint() {
    if (this.waypoints.length < this.data.maxWaypoints) {
      this.waypoints.splice(this.waypoints.length - 2, 1, {});
    }
  };
}
module.exports = searchDirectionsController;
