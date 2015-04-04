'use strict';

searchController.$inject = [
  'Heremaps.Enums',
  'searchState'
];

function searchController(Enums, searchState) {
  var
    tabsList = [Enums.SEARCH_STATE.PLACES, Enums.SEARCH_STATE.ROUTES];
  this.tabs = {
    selectedIndex: tabsList.indexOf(searchState)
  };
}
module.exports = searchController;
