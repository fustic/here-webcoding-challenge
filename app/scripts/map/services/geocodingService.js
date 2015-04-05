'use strict';

var H = require('H');

geocodingService.$inject = ['$q', 'Heremaps.Config', 'PlatformService', 'LoggerService', 'MarkersService'];

function geocodingService($q, Config, PlatformService, Logger, MarkersService) {

  function geocoder() {
    if (!geocoderInstance) {
      geocoderInstance = PlatformService.getGeocoder();
    }
    return geocoderInstance;
  }
  var
    geocoderInstance,
    geocodingServiceObject = {
      reverseGeocode: function reverseGeocode(point) {
        var deferred = $q.defer();
        geocoder().reverseGeocode(
          {
            prox: point.lat + ',' + point.lng+',500',
            language: 'en-gb',
            mode: 'retrieveAddresses',
            maxresults: 1
          },
          function success(result) {
            deferred.resolve(result.Response.View[0].Result[0]);
          },
          function error(err) {
            deferred.reject();
            Logger.error('Unable to reverse Geocode', err);
          }
        );

        return deferred.promise;
      },
      showPointLabel: function showPointLabel(point) {
        geocodingServiceObject.reverseGeocode(point).then(function success(location) {
          MarkersService.showPointLabel(location);
        });
      }
    };

  return geocodingServiceObject;
}

module.exports = geocodingService;
