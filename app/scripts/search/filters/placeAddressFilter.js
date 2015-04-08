'use strict';
placeAddressFilter.$inject = ['$filter'];
function placeAddressFilter($filter) {
  var vicinityFilter = $filter('vicinity');
  /**
   * @doc method
   * @description return place or location address
   * @params {Object} item
   * @return {string}
   */
  return function (item) {
    return item && (vicinityFilter(item.vicinity || item.location.address && item.location.address.text)) || '';
  };
}


module.exports = placeAddressFilter;
