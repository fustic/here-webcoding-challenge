'use strict';

var H = require('H');

platformService.$inject = ['$location', 'Heremaps.Config'];

/**
 * @class
 * @name PlatformService
 * @param {$location} $location
 * @param {HeremapsConfig} Config
 * @returns {{getPlatform: Function, getGeocoder: Function}}
 */
function platformService($location, Config) {

  var
    //reference to platform instance
    platform,
    //reference to geocoder instance
    geocoder,
    platformServiceObject = {
      /**
       * @this PlatformService
       * @doc method
       * @name getPlatform
       * @description get platform instance
       * @returns {Object}
       */
      getPlatform: function getPlatform() {
        if (!platform) {
          /*jshint camelcase: false */
          platform = new H.service.Platform({
            app_id: Config.api.keys.appId,
            app_code: Config.api.keys.appCode,
            useHTTPS: $location.protocol() === 'https'
          });
        }
        return platform;
      },
      /**
       * @this PlatformService
       * @doc method
       * @name getGeocoder
       * @description get geocoder instance
       * @returns {Object}
       */
      getGeocoder: function getGeocoder() {
        if (!geocoder) {
          geocoder = platform.getGeocodingService();
        }
        return geocoder;
      }
    };

  return platformServiceObject;
}

module.exports = platformService;
