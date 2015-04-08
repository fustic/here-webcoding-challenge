'use strict';
function placeTitleFilter() {
  /**
   * @doc method
   * @description return place or location title
   * @params {Object} item
   * @return {string}
   */
  return function (item) {
    return item && (item.title || item.name) || '';
  };
}


module.exports = placeTitleFilter;
