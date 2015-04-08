'use strict';
var utils = require('../../common').utils;
waypointFactory.$inject = [
  'SearchService',
  '$filter',
  'MarkersService',
  'UtilService',
  '$location',
  'Heremaps.Enums',
  'UserService'
];

function waypointFactory(SearchService, $filter, MarkersService, UtilService, $location, Enums, UserService) {
  var waypointTitleFilter = $filter('waypointTitle');

  function Waypoint(placeID, waypoint) {
    this.searchText = undefined;
    this.selectedItem = null;
    this.waypoint = waypoint || null;
    this.isCurrentLocation = false;
    this.disabled = true;
    if (placeID) {
      SearchService.place(placeID).then(function success(place) {
        this.selectedItem = place;
      }.bind(this));
    }
  }

  Waypoint.prototype.waypoints = [];
  Waypoint.prototype.direction = {};
  Waypoint.prototype.mode = null;

  Waypoint.prototype.clickHandler = function clickHandler() {
    this.disabled = false;
    if (this.selectedItem === null && this.searchText === undefined) {
      this.searchText = Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER;
    }
  };
  Waypoint.prototype.isCurrentLocationAvailable = function () {
    if (!this.disabled &&
        (this.searchText === Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER || !this.searchText) &&
        !this.waypoints.filter(function (waypoint) {
          return waypoint.isCurrentLocation;
        }).length) {
      return true;
    }
    return false;
  };
  Waypoint.prototype.querySearch = function querySearch() {
    if (this.disabled) {
      return [];
    }
    if (this.searchText === Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER) {
      var
        excludeIds = [];
      this.waypoints.forEach(function (waypoint) {
        var item = waypoint.selectedItem;
        if (item) {
          excludeIds.push(item.id || item.placeId || item.placeID);
        }
      });
      return SearchService.recentSearch(excludeIds);
    }
    return SearchService.search(this.searchText.replace(Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER, ''));
  };
  Waypoint.prototype.selectedItemChange = function selectedItemChange() {
    this.waypoint = this.selectedItem.position && this.selectedItem.position.join(',') || this.waypoint;
    this.url = (this.selectedItem.id || this.selectedItem.placeId || this.placeID) + ':' + this.waypoint;
    if (!this.searchText) {
      this.searchText = waypointTitleFilter(this.selectedItem);
    }
    if (!this.disabled && !this.selectedItem.isCurrentLocation) {
      SearchService.addSearchResultToRecent(this.selectedItem);
    }
    this.checkAndCalculateRoute();
  };
  Waypoint.prototype.checkAndCalculateRoute = function checkAndCalculateRoute() {
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
  };

  Waypoint.prototype.useCurrentPosition = function useCurrentPosition() {
    UserService.getAnyLocation().then(function success(location) {
      return SearchService.search(location.lat + ',' + location.lng);
    }.bind(this), function error() {
      UtilService.showErrorMessage('Can not find your location');
    }).then(function success(items) {
      var item = items[0];
      if (item) {
        item.title = 'Current location';
        this.selectedItem = item;
        this.disabled = true;
        this.waypoint = item.position && item.position.join(',');
        this.url = item.id + ':' + this.waypoint;
        this.searchText = item.title;
        this.isCurrentLocation = true;
        this.checkAndCalculateRoute();
      }
    }.bind(this));
  };
  return Waypoint;
}

module.exports = waypointFactory;
