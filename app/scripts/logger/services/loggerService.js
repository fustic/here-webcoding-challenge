'use strict';

var
  angular = require('angular'),
  rollbar = {
    critical: angular.noop,
    debug: angular.noop,
    error: angular.noop,
    info: angular.noop,
    warn: angular.noop,
    init: angular.noop,
    configure: angular.noop
  },
  isProduction = false;

var logger = {
  /**
   * @doc method
   * @name log
   * @param {string} msg
   * @param {Object} [obj]
   */
  log: function log(msg, obj) {
    if (!isProduction && console.log) {
      console.log(msg, obj);
    }
    rollbar.debug(msg, obj);
  },
  /**
   * @doc method
   * @name critical
   * @param {string} msg
   * @param {Object} [obj]
   */
  critical: function critical(msg, obj) {
    if (!isProduction && console.error) {
      console.error(msg, obj);
    }
    rollbar.critical(msg, obj);
  },
  /**
   * @doc method
   * @name error
   * @param {string} msg
   * @param {Object} [obj]
   */
  error: function error(msg, obj) {
    if (!isProduction && console.error) {
      console.error(msg, obj);
    }
    rollbar.error(msg, obj);
  },
  /**
   * @doc method
   * @name info
   * @param {string} msg
   * @param {Object} [obj]
   */
  info: function info(msg, obj) {
    if (!isProduction && console.info) {
      console.info(msg, obj);
    }
    rollbar.info(msg, obj);
  },
  /**
   * @doc method
   * @name warn
   * @param {string} msg
   * @param {Object} [obj]
   */
  warn: function warn(msg, obj) {
    if (!isProduction && console.warn) {
      console.warn(msg, obj);
    }
    rollbar.warn(msg, obj);
  },
  /**
   * @doc method
   * @name consolelog
   * @param {string} msg
   */
  consolelog: function consolelog(msg) {
    if (console.log) {
      console.log(msg);
    }
  }
};


loggerService.$inject = [];

function loggerService() {//Config

  isProduction = false; //Config.debug

  return logger;
}

module.exports = loggerService;
