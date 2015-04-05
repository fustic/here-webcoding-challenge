'use strict';

var H = require('H');

platformService.$inject = ['$q', 'Heremaps.Config'];

function platformService($q, Config) {

  var
    platform,
    geocoder,
    platformServiceObject = {
      getPlatform: function getPlatform() {
        if (!platform) {
          platform = new H.service.Platform({
            app_id: Config.api.keys.appId,
            app_code: Config.api.keys.appCode
          });
        }
        return platform;
      },
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
