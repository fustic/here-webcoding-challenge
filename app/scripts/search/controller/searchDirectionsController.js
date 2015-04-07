'use strict';
var utils = require('../../common').utils;
searchDirectionsController.$inject = [
  'WaypointFactory', '$location', 'MapService', 'Heremaps.Enums'
];

function searchDirectionsController(WaypointFactory, $location, MapService, Enums) {

  this.data = {
    maxWaypoints: 5,
    modes: [
      {
        title: 'Car',
        value: 'car'
      },
      {
        title: 'Public Transport',
        value: 'publicTransport'
      },
      {
        title: 'Walk',
        value: 'pedestrian'
      }
    ]
  };

  this.mode = this.data.modes[0].value;
  this.waypoints = [];

  this.waypoints.push(new WaypointFactory());
  this.waypoints.push(new WaypointFactory());


  function checkAndCalculateRouteFn() {
    console.log(this.waypoints);
  }
  var checkAndCalculateRoute = checkAndCalculateRouteFn.bind(this);
  WaypointFactory.prototype.checkAndCalculateRoute = checkAndCalculateRoute;

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
      this.waypoints.splice(this.waypoints.length - 1, 0, {});
    }
  };
  this.removeWaypoint = function removeWaypoint(index) {
    if (index > 0 && index < this.waypoints.length - 1) {
      this.waypoints.splice(index, 1);
    }
  };
  this.reverseDirection = function reverseDirection() {
    this.waypoints.reverse();
  };

  this.search = {

  };
}
module.exports = searchDirectionsController;
