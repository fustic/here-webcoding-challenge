'use strict';

waypointFactory.$inject = ['SearchService'];

function waypointFactory(SearchService) {
  function Waypoint() {
    this.searchText = '';
    this.selectedItem = null;
  }

  Waypoint.prototype.querySearch = function querySearch() {
    return SearchService.search(this.searchText);
  };
  Waypoint.prototype.selectedItemChange = function selectedItemChange(item) {
    console.log(item);
    this.checkAndCalculateRoute();
  };
  Waypoint.prototype.checkAndCalculateRoute = function checkAndCalculateRoute() {
    throw new Error('not implemented');
  };

  return Waypoint;
}

module.exports = waypointFactory;
