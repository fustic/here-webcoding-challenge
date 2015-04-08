'use strict';

var H = require('H');

mapService.$inject = ['Heremaps.Config', 'PlatformService', 'MapEventsService', 'MarkersService'];

/**
 * @class
 * @name MapService
 * @description creates, init and provides map instance
 * @param {HeremapsConfig} Config
 * @param {PlatformService} PlatformService
 * @param {MapEventsService} MapEventsService
 * @param {MarkersService} MarkersService
 * @returns {{getMap: Function, initMap: Function, updateMap: Function}}
 */
function mapService(Config, PlatformService, MapEventsService, MarkersService) {

  var
    /** @type {Map} - hold a reference to map instance*/
    map,
    defaultLayers,
    mapServiceObject = {
      /**
       * @this MapService
       * @doc method
       * @name getMap
       * @description get map instance
       * @returns {Map}
       */
      getMap: function getMap() {
        if (!map) {
          throw new Error('Map is not initialised');
        }
        return map;
      },
      /**
       * @this MapService
       * @doc method
       * @name initMap
       * @description init map, default behaviour, bind events
       * @param {HTMLElement} element
       * @param {number} devicePixelRation
       */
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
          // Create the default UI:
          ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');
        // Instantiate the default behavior, providing the mapEvents object:
        new H.mapevents.Behavior(mapEvents);
        MapEventsService.bindEvents(map);
        MarkersService.setMap(map);
        MarkersService.setUI(ui);
      },
      /**
       * @this MapService
       * @doc method
       * @name updateMap
       * @descritpion update current map with passed params
       * @param {Object} mapUpdate
       */
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
