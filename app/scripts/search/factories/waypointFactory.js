'use strict';

waypointFactory.$inject = ['SearchService', '$filter'];

function waypointFactory(SearchService, $filter) {
  var vicinityFilter = $filter('vicinity');

  function Waypoint(placeID, waypoint) {
    this.searchText = '';
    this.selectedItem = null;
    this.waypoint = waypoint || null;
    if (placeID) {
      SearchService.place(placeID).then(function success(place) {
        this.selectedItem = place;
      }.bind(this));
      this.disabled = true;
    }
  }

  Waypoint.prototype.querySearch = function querySearch() {
    if (this.disabled) {
      return [];
    }
    return SearchService.search(this.searchText);
  };
  Waypoint.prototype.selectedItemChange = function selectedItemChange() {
    this.waypoint = this.selectedItem.position && this.selectedItem.position.join(',') || this.waypoint;
    this.url = (this.selectedItem.id || this.selectedItem.placeId || this.placeID) + ':' + this.waypoint;
    if (!this.searchText) {
      this.searchText = this.selectedItem.name + ', ' +
        vicinityFilter(this.selectedItem.location.address && this.selectedItem.location.address.text);
    }
    this.checkAndCalculateRoute();
  };
  Waypoint.prototype.checkAndCalculateRoute = function checkAndCalculateRoute() {
    throw new Error('not implemented');
  };

  return Waypoint;
}

module.exports = waypointFactory;
