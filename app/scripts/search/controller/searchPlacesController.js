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
      var
        map = MapService.getMap(),
        layerProvider = map.getBaseLayer().getProvider(),
        mapType = layerProvider.copyrightKey_ === 'hybrid' ? 'satellite' : layerProvider.copyrightKey_,
        searchMap = [].concat(item.position, mapType, map.getZoom());

      $location.path('/places/' + item.id + '/').search({
        map: searchMap.join(',')
      });
      console.info('Item changed to ' + item);
    }
  }
}
module.exports = searchPlacesController;
