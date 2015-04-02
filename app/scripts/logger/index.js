'use strict';

/**
 * @module heremaps.logger
 * @name HeremapsLogger
 * @description Logger service
 */

var
  angular = require('angular'),
  logger = angular
    .module('heremapsLogger', [])
    .service('LoggerService', require('./services/loggerService'));

module.exports = logger;
