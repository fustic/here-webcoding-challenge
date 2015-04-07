'use strict';

waypointFactory.$inject = ['SearchService'];

function waypointFactory(SearchService) {
  function Waypoint(placeID, waypoint) {
    this.searchText = '';
    this.selectedItem = null;
    this.waypoint = waypoint || null;
    if (placeID) {
      SearchService.place(placeID).then(function success(place) {
        this.selectedItem = place;
      }.bind(this));
    }
  }

  Waypoint.prototype.querySearch = function querySearch() {
    return SearchService.search(this.searchText);
  };
  Waypoint.prototype.selectedItemChange = function selectedItemChange() {
    this.waypoint = this.selectedItem.position.join(',');
    this.url = this.selectedItem.id + ':' + this.waypoint;
    this.checkAndCalculateRoute();
  };
  Waypoint.prototype.checkAndCalculateRoute = function checkAndCalculateRoute() {
    throw new Error('not implemented');
  };

  return Waypoint;
}

module.exports = waypointFactory;
