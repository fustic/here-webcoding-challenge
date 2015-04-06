'use strict';

var
  H = require('H'),
  utils = require('../../common').utils;

searchService.$inject = [
  '$q',
  'Heremaps.Config',
  'PlatformService',
  'MapService',
  'LoggerService',
  '$location',
  '$http'
];

function searchService($q, Config, PlatformService, MapService, Logger, $location, $http) {

  function getPlacesService() {
    if (!placesService) {
      placesService = PlatformService.getPlatform().getPlacesService();
    }
    return placesService;
  }
  var
    placesService,
    entryPoint = H.service.PlacesService.EntryPoint,
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

      }
    };

  return searchServiceObject;
}

module.exports = searchService;
