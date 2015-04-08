'use strict';
searchDirectionsController.$inject = [
  'WaypointFactory',
  'Heremaps.Enums',
  'Heremaps.Config',
  'SearchService',
  'UserService',
  '$stateParams',
  '$rootScope',
  '$scope'
];
/**
 * @class
 * @name SearchDirectionsController
 * @description controller to handle search for route
 * @param {WaypointFactory} WaypointFactory
 * @param {HeremapsEnums} Enums
 * @param {HeremapsConfig} Config
 * @param {SearchService} SearchService
 * @param {UserService} UserService
 * @param {$stateParams} $stateParams
 * @param {$rootScope} $rootScope
 * @param {$scope} $scope
 */
function searchDirectionsController(WaypointFactory, Enums, Config, SearchService, UserService, $stateParams,
                                    $rootScope, $scope) {

  this.data = Config.directions;
  this.direction = {
    distance: 0,
    time: 0
  };
  this.sortOptions = {
    handle: '.draggable',//element class for draggable list element item
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

      //if start waypoint is empty - use user current locatoin
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
      //if number of waypoints is less than max - add this waypoint as final destination
      if (this.waypoints.length < this.data.maxWaypoints) {
        if (lastWaypoint.waypoint) {
          this.waypoints.push(new WaypointFactory(placeId, geo));
        } else {
          this.waypoints[this.waypoints.length - 1] = new WaypointFactory(placeId, geo);
        }
      } else {
        //otherwise - replace final destination
        lastWaypoint = null;
        this.waypoints[this.waypoints.length - 1] = new WaypointFactory(placeId, geo);
      }
    }.bind(this));

  this.mode = this.data.modes[0].value;
  //get mode from get param
  while (modesLen--) {
    if (this.data.modes[modesLen].value === $stateParams.mode) {
      this.mode = $stateParams.mode;
      break;
    }
  }
  this.waypoints = [];

  //fill waypoints from get param
  route.forEach(function (r) {
    var
      params = r.split(':');
    if (params && params.length >= 2) {
      this.waypoints.push(new WaypointFactory(params[0], params[1]));
    }
  }.bind(this));
  //if number of waypoints less then minimum - fill them with empty waypoints
  for (i = this.waypoints.length; i < this.data.minWaypoints; ++i) {
    this.waypoints.push(new WaypointFactory());
  }

  WaypointFactory.prototype.waypoints = this.waypoints;
  WaypointFactory.prototype.mode = this.mode;
  WaypointFactory.prototype.direction = this.direction;

  var checkAndCalculateRoute = WaypointFactory.prototype.checkAndCalculateRoute.bind(this);

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
