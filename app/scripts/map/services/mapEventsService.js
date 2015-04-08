'use strict';

var
  utils = require('../../common').utils;

mapEventsService.$inject = ['$location', '$rootScope', 'GeocodingService'];

/**
 * @class
 * @name MapEventsService
 * @description bind events to the map
 * @param {$location} $location
 * @param {$rootScope} $rootScope
 * @param {GeocodingService} GeocodingService
 * @returns {{bindEvents: Function}}
 */
function mapEventsService($location, $rootScope, GeocodingService) {

  function mapChangesWatcher() {
    var
      layerProvider = this.getBaseLayer().getProvider(),
      mapType = layerProvider.copyrightKey_ === 'hybrid' ? 'satellite' : layerProvider.copyrightKey_;
    $location.search({
      map: utils.getMapString(this.getCenter(), mapType, this.getZoom())
    });
    $rootScope.$apply();
  }

  return {
    /**
     * @this MapEventsService
     * @doc method
     * @description binding events to the passed map
     * @param {Object} map
     */
    bindEvents: function bindEvents(map) {
      var
        mapChanges = mapChangesWatcher.bind(map);
      map.addEventListener('mapviewchangeend', mapChanges);
      map.addEventListener('baselayerchange', mapChanges);
      map.addEventListener('tap', function (event) {
        GeocodingService.showPointLabel(
          map.screenToGeo(event.currentPointer.viewportX, event.currentPointer.viewportY)
        );
      })
    }
  };
}

module.exports = mapEventsService;
