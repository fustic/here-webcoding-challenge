'use strict';
function vicinityFilter() {
  /**
   * @doc method
   * @description replace search item result vicinity br with comma
   * @params {string} vicinity
   * @return {string}
   */
  return function (vicinity) {
    return vicinity && vicinity.replace('<br/>', ', ') || '';
  };
}


module.exports = vicinityFilter;
