'use strict';
var utils = require('../../common').utils;
searchDirectionsController.$inject = [
  'WaypointFactory',
  '$location',
  'Heremaps.Enums',
  'Heremaps.Config',
  'SearchService',
  'UserService',
  'UtilService',
  'MarkersService',
  '$stateParams',
  '$rootScope',
  '$scope'
];

function searchDirectionsController(WaypointFactory, $location, Enums, Config, SearchService, UserService, UtilService,
                                    MarkersService, $stateParams, $rootScope, $scope) {

  this.data = Config.directions;
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
    modesLen = this.data.modes.length,
    route = $stateParams.route && $stateParams.route.split(';') || [],
    i,
    addDirectionEvent = $rootScope.$on(Enums.EVENTS.ADD_DIRECTION, function (event, geo, placeId) {
      var
        lastWaypoint = this.waypoints[this.waypoints.length - 1];

      if (!this.waypoints[0].waypoint) {
        UserService.getAnyLocation().then(function success(location) {
          SearchService.search(location.lat + ',' + location.lng).then(function success(items) {
            var item = items[0];
            if (item) {
              this.waypoints[0] = new WaypointFactory(item.id, item.position.join(','));
            }
          }.bind(this));
        }.bind(this));
      }

      if (this.waypoints.length < this.data.maxWaypoints) {
        if (lastWaypoint.waypoint) {
          this.waypoints.push(new WaypointFactory(placeId, geo));
        } else {
          this.waypoints[this.waypoints.length - 1] = new WaypointFactory(placeId, geo);
        }
      } else {
        lastWaypoint = null;
        this.waypoints[this.waypoints.length - 1] = new WaypointFactory(placeId, geo);
      }
    }.bind(this));

  this.mode = this.data.modes[0].value;
  while (modesLen--) {
    if (this.data.modes[modesLen].value === $stateParams.mode) {
      this.mode = $stateParams.mode;
      break;
    }
  }
  this.waypoints = [];

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

  this.changeDirectionModeType = function changeDirectionModeType(value) {
    this.mode = value;
    checkAndCalculateRoute();
  };

  $scope.$on('$destroy', function () {
    addDirectionEvent();
  });
}
module.exports = searchDirectionsController;
