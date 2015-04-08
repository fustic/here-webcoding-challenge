'use strict';

geocodingService.$inject = ['$q', 'PlatformService', 'LoggerService', 'MarkersService'];

/**
 * @class
 * @name GeocodingService
 * @param {$q} $q
 * @param {PlatformService} PlatformService
 * @param {LoggerService} Logger
 * @param {MarkersService} MarkersService
 * @returns {{reverseGeocode: Function, showPointLabel: Function}}
 */
function geocodingService($q, PlatformService, Logger, MarkersService) {

  function geocoder() {
    if (!geocoderInstance) {
      geocoderInstance = PlatformService.getGeocoder();
    }
    return geocoderInstance;
  }
  var
    geocoderInstance,
    geocodingServiceObject = {
      /**
       * @this GeocodingService
       * @doc method
       * @name reverseGeocode
       * @description get location for given Point
       * @param {Object} point
       * @returns {Object}
       */
      reverseGeocode: function reverseGeocode(point) {
        var deferred = $q.defer();
        geocoder().reverseGeocode(
          {
            prox: point.lat + ',' + point.lng + ',500',
            language: 'en-gb',
            mode: 'retrieveAddresses',
            maxresults: 1
          },
          function success(result) {
            if (result.Response && result.Response.View[0]) {
              return deferred.resolve(result.Response.View[0].Result[0]);
            }
            return deferred.reject();
          },
          function error(err) {
            deferred.reject();
            Logger.error('Unable to reverse Geocode', err);
          }
        );

        return deferred.promise;
      },
      /**
       * @this GeocodingService
       * @doc method
       * @name showPointLabel
       * @description get location for given Point and renders it on the map
       * @param {Object} point
       */
      showPointLabel: function showPointLabel(point) {
        geocodingServiceObject.reverseGeocode(point).then(function success(location) {
          MarkersService.showPointLabel(location);
        });
      }
    };

  return geocodingServiceObject;
}

module.exports = geocodingService;
