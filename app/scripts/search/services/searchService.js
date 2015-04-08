'use strict';

var utils = require('../../common').utils;

searchService.$inject = [
  '$q',
  'PlatformService',
  'MapService',
  'LoggerService',
  '$http',
  'HeremapsCacheFactory'
];

/**
 * @class
 * @name SearchService
 * @description represent Map search service
 * @param {$q} $q
 * @param {PlatformService} PlatformService
 * @param {MapService} MapService
 * @param {LoggerService} Logger
 * @param {$http} $http
 * @param {CacheFactory} CacheFactory
 * @returns {{search: Function, place: Function, calculateRoute: Function, recentSearch: Function, addSearchResultToRecent: Function}}
 */
function searchService($q, PlatformService, MapService, Logger, $http, CacheFactory) {

  function getPlacesService() {
    if (!placesService) {
      placesService = PlatformService.getPlatform().getPlacesService();
    }
    return placesService;
  }
  function getRouter() {
    if (!router) {
      router = PlatformService.getPlatform().getRoutingService();
    }
    return router;
  }
  var
    maxRecentSearches = 5,
    /* jshint -W064 */
    cache = CacheFactory('search'),
    // reference to local places service
    placesService,
    router,
    searchServiceObject = {
      /**
       * @this SearchService
       * @name search
       * @description search for a location
       * @param {String} query
       * @returns {Object}
       */
      search: function search(query) {
        var deferred = $q.defer();
        getPlacesService().search({
          at: utils.getLocationString(MapService.getMap().getCenter()),
          q: query
        }, function success(resp) {
          deferred.resolve(resp.results.items);
        }, function error(err) {
          Logger.error('Error during search', err);
          deferred.reject([]);
        });

        return deferred.promise;
      },
      /**
       * @this SearchService
       * @name place
       * @description search for a place by id
       * @param {String} placeID
       * @returns {Object}
       */
      place: function place(placeID) {
        var url = getPlacesService().getUrl();
        /*jshint camelcase: false */
        return $http.get(url.ra + '://' + url.R + '/' + url.d + '/places/lookup', {
          params: {
            app_id: url.g.app_id,
            app_code: url.g.app_code,
            id: placeID,
            source: 'sharing'
          }
        }).then(function success(resp) {
          return resp.data;
        });
      },
      /**
       * @this SearchService
       * @name calculateRoute
       * @description calculateRoute for given array of waypoints
       * @param {Waypoint[]} waypoints
       * @param {String} mode
       * @returns {Object} route
       */
      calculateRoute: function calculateRoute(waypoints, mode) {
        var
          deferred = $q.defer(),
          params = {
            mode: 'fastest;' + mode,
            representation: 'display',
            language: 'en-gb'
          };

        waypoints.forEach(function (waypoint, i) {
          params['waypoint' + i] = waypoint.waypoint;
        });
        getRouter().calculateRoute(params, function success(result) {
          var route = result.response && result.response.route[0];
          if (route) {
            return deferred.resolve(route);
          }
          return deferred.reject();
        }, function error(err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      /**
       * @this SearchService
       * @name recentSearch
       * @description return 5 recent places searched by user excluding given places
       * @param {String[]} placeIDs
       * @returns {Object[]}
       */
      recentSearch: function recentSearch(placeIDs) {
        var
          deferred = $q.defer(),
          recent = (cache.get('recent') || []);
        placeIDs = placeIDs || [];
        //if places to exclude were passed
        if (placeIDs.length) {
          //exclude places from result
          recent = recent.filter(function (element) {
            return placeIDs.indexOf(element.id) === -1;
          });
        }
        //return last 5 recent search results
        deferred.resolve(recent.slice(0, maxRecentSearches));
        return deferred.promise;
      },
      /**
       * @this SearchService
       * @name addSearchResultToRecent
       * @description add place to recent search results
       * @param {Object} place
       */
      addSearchResultToRecent: function (place) {
        var
          recent = cache.get('recent') || [];
        //check if this place already exists in store
        if (recent.filter(function (element) {
            return element.id === place.id;
          }).length) {
          return;
        }
        recent.unshift(place);
        cache.putValue('recent', recent);
      }
    };

  return searchServiceObject;
}

module.exports = searchService;
