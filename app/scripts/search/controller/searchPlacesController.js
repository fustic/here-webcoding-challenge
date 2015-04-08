'use strict';
var utils = require('../../common').utils;
searchPlacesController.$inject = [
  'SearchService', '$location', 'MapService', 'Heremaps.Enums'
];

function searchPlacesController(SearchService, $location, MapService, Enums) {

  this.search = {
    searchText: undefined,
    selectedItem: null,
    querySearch: function querySearch(search) {
      if (search.searchText === Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER) {
        return SearchService.recentSearch();
      }
      return SearchService.search(search.searchText.replace(Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER, ''));
    },
    selectedItemChange: function selectedItemChange(item) {
      SearchService.addSearchResultToRecent(item);
      $location.path('/places/' + (item.id || item.placeId) + '/').search({
        map: utils.getMapStringfromMap(item.position || item.location.position, MapService.getMap())
      });
    },
    clickHandler: function clickHandler(search) {
      if (search.selectedItem === null && search.searchText === undefined) {
        search.searchText = Enums.INVISIBLE_SYMBOLS.ZERO_WIDTH_NON_JOINER;
      }
    }
  }
}
module.exports = searchPlacesController;
