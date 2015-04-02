'use strict';

var
  angular = require('angular');
require('./heremaps');
module.exports = {
  /**
   * run the application
   * @param {Object} config
   */
  run: function appRun(config) {
    return angular.bootstrap(document, config.modules);
  }
};
