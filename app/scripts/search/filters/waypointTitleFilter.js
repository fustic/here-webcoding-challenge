'use strict';
waypointTitleFilter.$inject = ['$filter'];
function waypointTitleFilter($filter) {
  var vicinityFilter = $filter('vicinity');
  /**
   * @doc method
   * @description replace item title and vicinity br with comma
   * @params {Object} item
   * @return {string}
   */
  return function (item) {
    return item.title + ', ' + vicinityFilter(item.vicinity);
  };
}


module.exports = waypointTitleFilter;
