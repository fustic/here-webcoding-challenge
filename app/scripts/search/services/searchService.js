'use strict';

var
  H = require('H'),
  utils = require('../../common').utils;

searchService.$inject = [
  '$q',
  'PlatformService',
  'MapService',
  'LoggerService',
  '$http',
  'HeremapsCacheFactory'
];

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
    placesService,
    router,
    searchServiceObject = {
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
      place: function place(placeID) {
        var url = getPlacesService().getUrl();
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
          return result.reject();
        }, function error(err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      recentSearch: function recentSearch(placeIDs) {
        var
          deferred = $q.defer(),
          recent = (cache.get('recent') || []);
        placeIDs = placeIDs || [];
        if (placeIDs.length) {
          recent = recent.filter(function (element) {
            return placeIDs.indexOf(element.id) === -1;
          });
        }
        deferred.resolve(recent.slice(0, maxRecentSearches));
        return deferred.promise;
      },
      addSearchResultToRecent: function (place) {
        var
          recent = cache.get('recent') || [];
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
