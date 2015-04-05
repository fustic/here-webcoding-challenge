'use strict';

var
  H = require('H'),
  utils = require('../../common').utils;

mapEventsService.$inject = ['$q', 'Heremaps.Config', '$location', '$rootScope'];

function mapEventsService($q, Config, $location, $rootScope) {

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
      //map.addEventListener('pointerup', mapChangesWatcher);
      //map.addEventListener('dragend', mapChangesWatcher);
      //map.addEventListener('dbltap', mapChangesWatcher);

      var
        mapChanges = mapChangesWatcher.bind(map),
        initEvents = function () {
          map.removeEventListener('mapviewchangeend', initEvents);
          map.addEventListener('mapviewchangeend', mapChanges);
        };
      map.addEventListener('mapviewchangeend', initEvents);
      map.addEventListener('baselayerchange', mapChanges);
    }
  };
}

module.exports = mapEventsService;
