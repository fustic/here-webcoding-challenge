'use strict';

var _ = require('_');

userService.$inject = [
  '$http',
  '$q',
  'Heremaps.Config',
  '$location'
];

/**
 * @class UserService
 */
function userService($http, $q, Config, $location) {
  var
    defaultLocation = Config.location;

  return {
    getReverseIPLocation: function getReverseIPLocation() {
      return $http.get($location.protocol() + '://freegeoip.net/json/', {
        cache: true
      }).then(function success(response) {
        var
          data = response.data || {},
          l = {
            country: data['country_code'] || defaultLocation.country,
            lat: data.latitude || defaultLocation.lat,
            lng: data.longitude || defaultLocation.lng
          };
        return l;
      }, function error(e) {
        Logger.critical('freegeoip-service is unavailable!', e);
      });
    },
    getLocation: function getLocation() {
      var
        deferred = $q.defer();

      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function success(position) {
          deferred.resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }, function error() {
          deferred.resolve(defaultLocation);
          Logger.critical('Unable to retrieve your location');
        }, {
          enableHighAccuracy: true
        });
      }
      return deferred.promise;
    },
    shortUrl: function (url) {
      return $http.get(Config.shortener.url, {
        params: {
          access_token: Config.shortener.accessToken,
          longUrl: url
        }
      });
    }
  };
}

module.exports = userService;
