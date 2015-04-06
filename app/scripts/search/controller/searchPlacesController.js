'use strict';
var utils = require('../../common').utils;
searchPlacesController.$inject = [
  'SearchService', '$location', 'MapService'
];

function searchPlacesController(SearchService, $location, MapService) {

  this.search = {
    searchText: '',
    selectedItem: null,
    querySearch: function querySearch(query) {
      return SearchService.search(query);
    },
    selectedItemChange: function selectedItemChange(item) {
      $location.path('/places/' + item.id + '/').search({
        map: utils.getMapStringfromMap(item.position, MapService.getMap())
      });
    }
  }
}
module.exports = searchPlacesController;
