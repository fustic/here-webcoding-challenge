'use strict';

userService.$inject = [
  '$http',
  '$q',
  'Heremaps.Config',
  '$location',
  'HeremapsCacheFactory',
  'LoggerService'
];

/**
 * @class
 * @name UserService
 * @param {$http} $http
 * @param {$q} $q
 * @param {HeremapsConfig} Config
 * @param {$location} $location
 * @param {CacheFactory} CacheFactory
 * @param {LoggerService} Logger
 * @returns {{getReverseIPLocation: Function, getLocation: Function, getAnyLocation: Function, shortUrl: Function}}
 */
function userService($http, $q, Config, $location, CacheFactory, Logger) {
  var
    defaultLocation = Config.location,
    /* jshint -W064 */
    cache = CacheFactory('currentUser'),
    location = cache.get('location'),
    userServiceObject = {
      /**
       * @this UserService
       * @doc method
       * @name getReverseIPLocation
       * @description get user location by reversing ip address
       * @returns {Location}
       */
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
      /**
       * @this UserService
       * @doc method
       * @name getReverseIPLocation
       * @description get user location by html5 geolocation
       * @returns {Location}
       */
      getLocation: function getLocation() {
        var
          deferred = $q.defer();

        if (location) {
          //if we have stored user location resolve it immediately
          deferred.resolve(location);
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function success(position) {
            location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            deferred.resolve(location);
            cache.putValue('location', location);
          }, function error() {
            deferred.resolve(defaultLocation);
            Logger.critical('Unable to retrieve your location');
          }, {
            enableHighAccuracy: true
          });
        }
        return deferred.promise;
      },
      /**
       * @this UserService
       * @doc method
       * @name getAnyLocation
       * @description get user location via faster way reverseip or geolocation
       * @returns {Location}
       */
      getAnyLocation: function getAnyLocation() {
        var
          deferred = $q.defer();

        userServiceObject.getLocation().then(function success(location) {
          deferred.resolve(location);
        });
        userServiceObject.getReverseIPLocation().then(function success(location) {
          deferred.resolve(location);
        });
        return deferred.promise;
      },
      /**
       * @this UserService
       * @doc method
       * @name shortUrl
       * @description short given url
       * @param {String} url
       * @returns {String}
       */
      shortUrl: function (url) {
        /*jshint camelcase: false */
        return $http.get(Config.shortener.url, {
          params: {
            access_token: Config.shortener.accessToken,
            longUrl: url
          }
        });
      }
    };
  return userServiceObject;
}

module.exports = userService;
