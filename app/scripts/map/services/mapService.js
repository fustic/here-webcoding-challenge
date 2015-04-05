'use strict';

var H = require('H');

mapService.$inject = ['$q', 'Heremaps.Config', 'PlatformService', 'MapEventsService', 'MarkersService'];

function mapService($q, Config, PlatformService, MapEventsService, MarkersService) {

  var
    map,
    defaultLayers,
    currentMapType = '',
    mapServiceObject = {
      getMap: function getMap() {
        if (!map) {
          throw new Error('Map is not initialised');
        }
        return map;
      },
      initMap: function initMap(element, devicePixelRation) {
        var
          platform = PlatformService.getPlatform();
        // Obtain the default map types from the platform object
        defaultLayers = platform.createDefaultLayers();

        map = new H.Map(
          element,
          defaultLayers.normal.map,
          {
            zoom: 14,
            center: Config.location,
            pixelRatio: devicePixelRation
          });

        map.setBaseLayer(defaultLayers.satellite.map);

        var
          // Enable the event system on the map instance:
          mapEvents = new H.mapevents.MapEvents(map),
          // Instantiate the default behavior, providing the mapEvents object:
          behavior = new H.mapevents.Behavior(mapEvents),
          // Create the default UI:
          ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');

        MapEventsService.bindEvents(map);
        MarkersService.setMap(map);
        MarkersService.setUI(ui);
      },
      updateMap: function updateMap(mapUpdate) {
        if (!mapUpdate) {
          return;
        }
        if (mapUpdate.location) {
          map.setCenter(mapUpdate.location);
        }
        if (mapUpdate.type && Config.map.types.indexOf(mapUpdate.type) !== -1) {
          map.setBaseLayer(defaultLayers[mapUpdate.type].map);
        }
        if (mapUpdate.zoom) {
          map.setZoom(mapUpdate.zoom, true);
        }
      }
    };

  return mapServiceObject;
}

module.exports = mapService;
