'use strict';
var utils = require('../../common').utils;
searchDirectionsController.$inject = [
  'WaypointFactory',
  '$location',
  'Heremaps.Enums',
  'SearchService',
  'UtilService',
  'MarkersService',
  '$stateParams',
  '$scope'
];

function searchDirectionsController(WaypointFactory, $location, Enums, SearchService, UtilService, MarkersService,
                                    $stateParams, $scope) {

  console.log($stateParams);

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

  var
    modesLen = this.data.modes.length;
  this.mode = this.data.modes[0].value;
  while (modesLen--) {
    if (this.data.modes[modesLen].value === $stateParams.mode) {
      this.mode = $stateParams.mode;
      break;
    }
  }
  this.waypoints = [];

  this.waypoints.push(new WaypointFactory());
  this.waypoints.push(new WaypointFactory());


  function checkAndCalculateRouteFn() {
    if (!(this.waypoints && this.waypoints.length >= 2)) {
      return;
    }
    var
      waypointsLength = this.waypoints.length;
    while (waypointsLength--) {
      if (!this.waypoints[waypointsLength].waypoint) {
        return;
      }
    }
    SearchService.calculateRoute(this.waypoints, this.mode).then(function success(route) {
      MarkersService.showRoute(route);
      var urlParts = [];
      this.waypoints.forEach(function (waypoint) {
        urlParts.push(waypoint.url);
      });
      $location.path('/routes/' + this.mode + '/' + urlParts.join(';') + '/');
    }.bind(this), function error() {
      UtilService.showErrorMessage('Can not calculate a route for you');
    });
  }
  var checkAndCalculateRoute = checkAndCalculateRouteFn.bind(this);
  WaypointFactory.prototype.checkAndCalculateRoute = checkAndCalculateRoute;
  $scope.$watch(function () {
    return this.mode;
  }.bind(this), checkAndCalculateRoute);
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
      this.waypoints.splice(this.waypoints.length - 1, 0, new WaypointFactory());
    }
  };
  this.removeWaypoint = function removeWaypoint(index) {
    if (index > 0 && index < this.waypoints.length - 1) {
      this.waypoints[index] = null;
      this.waypoints.splice(index, 1);
    }
    checkAndCalculateRoute();
  };
  this.reverseDirection = function reverseDirection() {
    this.waypoints.reverse();
    checkAndCalculateRoute();
  };

}
module.exports = searchDirectionsController;
