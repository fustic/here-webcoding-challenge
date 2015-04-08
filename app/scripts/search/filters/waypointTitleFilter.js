'use strict';
waypointTitleFilter.$inject = ['$filter'];
function waypointTitleFilter($filter) {
  var
    placeAddressFilter = $filter('placeAddress'),
    placeTitleFilter = $filter('placeTitle');
  /**
   * @doc method
   * @description replace item title and vicinity br with comma
   * @params {Object} item
   * @return {string}
   */
  return function (item) {
    return placeTitleFilter(item) + ', ' + placeAddressFilter(item);
  };
}


module.exports = waypointTitleFilter;
