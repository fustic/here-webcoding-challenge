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
/**
 * @class
 * @name WaypointFactory
 * @description returns waypoint class
 * @param {SearchService} SearchService
 * @param {$filter} $filter
 * @param {MarkersService} MarkersService
 * @param {UtilService} UtilService
 * @param {$location} $location
 * @param {HeremapsEnums} Enums
 * @param {UserService} UserService
 * @returns {Waypoint}
 */
function waypointFactory(SearchService, $filter, MarkersService, UtilService, $location, Enums, UserService) {
  var waypointTitleFilter = $filter('waypointTitle');

  /**
   * @class
   * @name Waypoint
   * @param {String} [placeID]
   * @param {String} [waypoint]
   * @constructor
   */
  function Waypoint(placeID, waypoint) {
    /** @type {string} */
    this.searchText = undefined;
    /** @type {Object} */
    this.selectedItem = null;
    /** @type {string} */
    this.waypoint = waypoint || null;
    /** @type {boolean} */
    this.isCurrentLocation = false;
    /** @type {boolean} */
    this.disabled = true;
    if (placeID) {
      // if place id was passed lets fetch it
      SearchService.place(placeID).then(function success(place) {
        this.selectedItem = place;
      }.bind(this));
    }
  }

  Waypoint.prototype.waypoints = [];
  Waypoint.prototype.direction = {};
  Waypoint.prototype.mode = null;
  /**
   * @this Waypoint
   * @doc method
   * @name clickHandler
   * @description handles click to autocomplete input
   * TODO: remove dirty hack. Currently it sets up inivsible symbol to make autocomplete show any results without typing
   */
  Waypoint.prototype.clickHandler = function clickHandler() {
    this.disabled = false;
    if (this.selectedItem === null && this.searchText === undefined) {
      //TODO: remove dirty hack
      this.searchText = Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER;
    }
  };
  /**
   * @this Waypoint
   * @name isCurrentLocationAvailable
   * @description check if using current location is available for this waypoint
   * @returns {boolean}
   */
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
  /**
   * @this Waypoint
   * @doc method
   * @name querySearch
   * @description return results for typed query
   * @returns {boolean}
   */
  Waypoint.prototype.querySearch = function querySearch() {
    if (this.disabled) {
      return [];
    }
    //TODO: remove dirty hack.
    //if search string equal to invisible symbol show last recent search results
    if (this.searchText === Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER) {
      var excludeIds = [];
      //prepare list of ids for places that should be excluded from result
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
  /**
   * @this Waypoint
   * @doc method
   * @name selectedItemChange
   * @description handler for selected item change
   */
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
  /**
   * @this Waypoint
   * @doc method
   * @name checkAndCalculateRoute
   * @description check for route complete and calculate it
   */
  Waypoint.prototype.checkAndCalculateRoute = function checkAndCalculateRoute() {
    //if there is less than 2 waypoints - break
    if (!(this.waypoints && this.waypoints.length >= 2)) {
      return;
    }
    var waypointsLength = this.waypoints.length;
    //if any of waypoints is incomplete - break
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
      //update url with new route
      $location.path('/routes/' + this.mode + '/' + urlParts.join(';') + '/');

      //calculate time spent and distance
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
  /**
   * @this Waypoint
   * @doc method
   * @name useCurrentPosition
   * @description use user current position as waypoint for the route
   */
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
