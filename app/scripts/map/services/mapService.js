'use strict';

var H = require('H');

mapService.$inject = ['$q', 'Heremaps.Config', 'PlatformService'];

function mapService($q, Config, PlatformService) {

  var
    map,
    mapServiceObject = {
      getMap: function getMap() {
        if (!map) {
          throw new Error('Map is not initialised');
        }
        return map;
      },
      initMap: function initMap(element, location, devicePixelRation) {
        var
          platform = PlatformService.getPlatform(),
          // Obtain the default map types from the platform object
          defaultLayers = platform.createDefaultLayers();

        map = new H.Map(
          element,
          defaultLayers.normal.map,
          {
            zoom: 14,
            center: location,
            pixelRation: devicePixelRation
          });

        map.setBaseLayer(defaultLayers.satellite.map);
        // Enable the event system on the map instance:
        var mapEvents = new H.mapevents.MapEvents(map);
        // Instantiate the default behavior, providing the mapEvents object:
        var behavior = new H.mapevents.Behavior(mapEvents);
        // Create the default UI:
        var ui = H.ui.UI.createDefault(map, defaultLayers);

      }
    };

  return mapServiceObject;
}

module.exports = mapService;
