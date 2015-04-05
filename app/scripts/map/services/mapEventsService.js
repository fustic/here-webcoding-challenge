'use strict';

var
  H = require('H'),
  utils = require('../../common').utils;

mapEventsService.$inject = ['$q', 'Heremaps.Config', '$location', '$rootScope', 'GeocodingService'];

function mapEventsService($q, Config, $location, $rootScope, GeocodingService) {

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
    bindEvents: function bindEvents(map) {
      var
        mapChanges = mapChangesWatcher.bind(map),
        initEvents = function () {
          map.removeEventListener('mapviewchangeend', initEvents);
          map.addEventListener('mapviewchangeend', mapChanges);
        };
      map.addEventListener('mapviewchangeend', initEvents);
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
