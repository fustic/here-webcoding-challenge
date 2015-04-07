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

  this.data = {
    minWaypoints: 2,
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
  this.direction = {
    distance: 0,
    time: 0
  };
  this.sortOptions = {
    handle: '.draggable',
    onSort: function onSort() {
      checkAndCalculateRoute();
    }
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

  var
    route = $stateParams.route && $stateParams.route.split(';') || [],
    i;

  route.forEach(function (r) {
    var
      params = r.split(':');
    if (params && params.length >= 2) {
      this.waypoints.push(new WaypointFactory(params[0], params[1]));
    }
  }.bind(this));

  for (i = this.waypoints.length; i < this.data.minWaypoints; ++i) {
    this.waypoints.push(new WaypointFactory());
  }

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
      var
        urlParts = [],
        distance = 0,
        travelTime = 0;
      this.waypoints.forEach(function (waypoint) {
        urlParts.push(waypoint.url);
      });
      $location.path('/routes/' + this.mode + '/' + urlParts.join(';') + '/');

      route.leg.forEach(function (leg) {
        leg.maneuver.forEach(function (maneuver) {
          distance += maneuver.length;
          travelTime += maneuver.travelTime;
        });
      });
      this.direction.distance = utils.metersRoundDistance(distance);
      this.direction.time = utils.secondsRoundTime(travelTime);
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
