'use strict';

var
  H = require('H'),
  utils = require('../../common').utils;

searchService.$inject = ['$q', 'Heremaps.Config', 'PlatformService', 'MapService', 'LoggerService'];

function searchService($q, Config, PlatformService, MapService, Logger) {

  function getPlacesService() {
    if (!placesService) {
      placesService = PlatformService.getPlatform().getPlacesService();
    }
    return placesService;
  }
  var
    placesService,
    searchServiceObject = {
      search: function search(query) {
        var deferred = $q.defer();
        getPlacesService().search({
          at: utils.getLocationString(MapService.getMap().getCenter()),
          q: query
        }, function success(resp) {
          console.log(resp.results.items);
          deferred.resolve(resp.results.items);
        }, function error(err) {
          Logger.error('Error during search', err);
          deferred.resolve([]);
        });

        return deferred.promise;
      }
    };

  return searchServiceObject;
}

module.exports = searchService;
