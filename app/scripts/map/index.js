'use strict';

/**
 * @module heremaps.map
 * @name HeremapsMap
 * @description Map module - wrapper for H.map
 */

var
  angular = require('angular'),
  map = angular
    .module('heremapsMap', [])
    .service('PlatformService', require('./services/platformService'))
    .service('MapEventsService', require('./services/mapEventsService'))
    .service('MapService', require('./services/mapService'));

module.exports = map;
