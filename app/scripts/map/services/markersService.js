'use strict';

var
  H = require('H'),
  angular = require('angular');

markersService.$inject = ['Heremaps.Config', 'Heremaps.Enums', '$compile', '$rootScope'];

/**
 * @class
 * @name MarkersService
 * @description Render markers, points, label, routes
 * @param {HeremapsConfig} Config
 * @param {HeremapsEnums} Enums
 * @param {$compile} $compile
 * @param {$rootScope} $rootScope
 * @returns {{setMap: Function, setUI: Function, addCurrentPositionMarker: Function, showPointLabel: Function, showPlaceBubble: Function, showRoute: Function}}
 */
function markersService(Config, Enums, $compile, $rootScope) {
  function closeRoute() {
    if (map) {
      if (polyline) {
        map.removeObject(polyline);
        polyline = null;
      }
      if (routeGroup) {
        map.removeObject(routeGroup);
        routeGroup = null;
      }
    }
  }
  var
    //reference to map instance
    map,
    //reference to ui instance
    ui,
    $pointLabelScope = $rootScope.$new(),
    $placeScope = $rootScope.$new(),
    $pointLabel = $compile(angular.element('<location-label></location-label>'))($pointLabelScope),
    $placeLabel = $compile(angular.element('<location-label></location-label>'))($placeScope),
    //reference to point label opened bubble
    pointLabelBubble,
    //reference to place label opened bubble
    placeLabelBubble,
    polyline,
    routeGroup,
    // Hold a reference to any infobubble opened
    bubble;

  /**
   * Opens/Closes a infobubble
   * @param  {H.geo.Point} position - The location on the map.
   * @param  {String} text - The contents of the infobubble.
   */
  function openBubble(position, text){
    if(!bubble){
      bubble =  new H.ui.InfoBubble(
        position,
        {
          content: text
        }
      );
      ui.addBubble(bubble);
    } else {
      bubble.setPosition(position);
      bubble.setContent(text);
      bubble.open();
    }
  }

  return {
    /**
     * @this MarkersService
     * @doc method
     * @name setMap
     * @description set a local instance of a map
     * @param {Map} mapInstance
     */
    setMap: function setMap(mapInstance) {
      map = mapInstance;
    },
    /**
     * @this MarkersService
     * @doc method
     * @name setUI
     * @description set a local instance of a ui
     * @param {Object} uiInstance
     */
    setUI: function setUI(uiInstance) {
      ui = uiInstance;
    },
    /**
     * @this MarkersService
     * @doc method
     * @name addCurrentPositionMarker
     * @description render a user current position marker
     * @param {Location} coordinates
     */
    addCurrentPositionMarker: function addCurrentPositionMarker(coordinates) {
      var
        //TODO: move svg to service. It's ugly to hardcode them
        icon = new H.map.DomIcon('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><path fill="' + Config.map.colors.currentPosition + '" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>'),
        marker = new H.map.DomMarker(coordinates, {icon: icon});

      map.addObject(marker);
    },
    /**
     * @this MarkersService
     * @doc method
     * @name showPointLabel
     * @description render a point label to the map
     * @param {Location} location
     */
    showPointLabel: function showPointLabel(location) {
      if (bubble) {
        bubble.close();
      }
      $pointLabelScope.locationLabel.setLocation(location);
      if (!pointLabelBubble) {
        pointLabelBubble = new H.ui.InfoBubble({
          lat: location.Location.DisplayPosition.Latitude,
          lng: location.Location.DisplayPosition.Longitude
        }, {
          content: ''
        });
        ui.addBubble(pointLabelBubble);
        var bubbleBody = pointLabelBubble.el.querySelector('.H_ib_body');
        bubbleBody.innerHTML = '';
        bubbleBody.appendChild($pointLabel[0]);
      } else {
        pointLabelBubble.setPosition({
          lat: location.Location.DisplayPosition.Latitude,
          lng: location.Location.DisplayPosition.Longitude
        });
        if (pointLabelBubble.getState() !== Enums.BUBBLE_STATES.OPEN) {
          pointLabelBubble.open();
        }
      }
    },
    /**
     * @this MarkersService
     * @doc method
     * @name showPlaceBubble
     * @description render a place bubble to the map
     * @param {Object} place
     */
    showPlaceBubble: function showPlaceBubble(place) {
      if (pointLabelBubble) {
        pointLabelBubble.close();
      }
      if (bubble) {
        bubble.close();
      }
      $placeScope.locationLabel.setPlace(place);
      if (!placeLabelBubble) {
        placeLabelBubble = new H.ui.InfoBubble({
          lat: place.location.position[0],
          lng: place.location.position[1]
        }, {
          content: ''
        });
        ui.addBubble(placeLabelBubble);
        var bubbleBody = placeLabelBubble.el.querySelector('.H_ib_body');
        bubbleBody.innerHTML = '';
        bubbleBody.appendChild($placeLabel[0]);
      } else {
        placeLabelBubble.setPosition({
          lat: place.location.position[0],
          lng: place.location.position[1]
        });
        if (placeLabelBubble.getState() !== Enums.BUBBLE_STATES.OPEN) {
          placeLabelBubble.open();
        }
      }
    },
    /**
     * @this MarkersService
     * @doc method
     * @name showRoute
     * @description render a route
     * @param {Object} route
     */
    showRoute: function showRoute(route) {
      closeRoute();
      var
        strip = new H.geo.Strip(),
        routeShape = route.shape;

      routeShape.forEach(function(point) {
        var parts = point.split(',');
        strip.pushLatLngAlt(parts[0], parts[1]);
      });

      polyline = new H.map.Polyline(strip, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      });
      // Add the polyline to the map
      map.addObject(polyline);
      // And zoom to its bounding rectangle
      map.setViewBounds(polyline.getBounds(), true);

      var
        //TODO: move svg to service. It's ugly to hardcode them
        svgMarkup = '<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#1b468d" stroke="white" stroke-width="1"  /></svg>',
        dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
        maneuver,
        marker,
        waypoint,
        i,
        j;
      routeGroup = new  H.map.Group();
      // Add a marker for each maneuver
      for (i = 0;  i < route.leg.length; i += 1) {
        for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
          // Get the next maneuver.
          maneuver = route.leg[i].maneuver[j];
          // Add a marker to the maneuvers group
          marker = new H.map.Marker({
              lat: maneuver.position.latitude,
              lng: maneuver.position.longitude
            }, {
            icon: dotIcon
          });
          marker.text = maneuver.instruction;
          routeGroup.addObject(marker);
        }
      }

      //TODO: move svg to service. It's ugly to hardcode them
      for (i = 0; i < route.waypoint.length; i += 1) {
        svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle fill="#fff" stroke="#bfbfbf" stroke-width="2.2" cx="29" cy="30" r="27.5"></circle></svg>';
        if (i === 0) {
          svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle fill="#389CD6" cx="30" cy="30" r="30"></circle></svg>';
        } else if (i === route.waypoint.length - 1) {
          svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 20 20"><circle fill="#fff" cx="10" cy="10" r="8.029"></circle><g><path fill="#111623" d="M14.316 16.764c.98-.63 1.816-1.464 2.445-2.445h-2.444v2.444zM14.316 5.684V3.236C13.068 2.438 11.59 1.97 10 1.97v3.714h4.316zM5.684 3.236c-.984.63-1.82 1.464-2.448 2.448h2.448V3.236zM5.685 14.316v2.447c1.247.8 2.725 1.267 4.315 1.267v-3.714H5.685zM14.316 10H10V5.683H5.684V10H1.97c0 1.59.47 3.068 1.267 4.316h2.447V10H10v4.316h4.316V10h3.713c0-1.59-.47-3.07-1.267-4.316h-2.447V10z"></path></g></svg>';
        }
        waypoint = route.waypoint[i];
        marker = new H.map.Marker({
          lat: waypoint.mappedPosition.latitude,
          lng: waypoint.mappedPosition.longitude
        }, {
          icon: new H.map.Icon(svgMarkup, {anchor: {x:29, y:30}})
        });
        marker.text = waypoint.label;
        routeGroup.addObject(marker);
      }

      routeGroup.addEventListener('tap', function (evt) {
        openBubble(evt.target.getPosition(), evt.target.text);
        evt.preventDefault();
        evt.stopPropagation();
      }, false);

      map.addObject(routeGroup);
    }
  };
}

module.exports = markersService;
