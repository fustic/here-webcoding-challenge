'use strict';

var
  H = require('H'),
  utils = require('../../common').utils,
  angular = require('angular');

markersService.$inject = ['Heremaps.Config', 'Heremaps.Enums', '$compile', '$rootScope'];

function markersService(Config, Enums, $compile, $rootScope) {
  //direction svg
  //background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTkuNjI3IDExLjYyMmwtNi41MS0zLjc2Yy0uNDQtLjI1Ni0uODAyLS4wNDctLjgwMi40NjN2MS45ODRjLTIuMDQ0LjA2Ni0zLjg2Mi44My01LjM4MiAxLjk5NnYtNC43NGgxLjg3MmMuNTEgMCAuNzItLjM2LjQ2NC0uODAzTDUuNTU3LjMzNWMtLjI1NC0uNDQyLS42NzItLjQ0LS45MjcgMEwuOTIgNi43NjNjLS4yNTYuNDQzLS4wNDcuODA0LjQ2My44MDRIMy4yNFYyMGgzLjY5NHYtLjE4NmMwLTMuMDcgMi4zNTItNS42MzMgNS4zODItNS43OTJ2MS43MjZjMCAuNTEuMzYuNzIuODAzLjQ2M2w2LjUwOC0zLjY2Yy40NC0uMjU2LjQ0LS42NzMgMC0uOTI4eiIvPjwvc3ZnPg==);

  var
    map,
    ui,
    $pointLabelScope = $rootScope.$new(),
    $placeScope = $rootScope.$new(),
    $pointLabel = $compile(angular.element('<location-label></location-label>'))($pointLabelScope),
    $placeLabel = $compile(angular.element('<location-label></location-label>'))($placeScope),
    pointLabelBubble,
    placeLabelBubble;

  return {
    setMap: function setMap(mapInstance) {
      map = mapInstance;
    },
    setUI: function setUI(uiInstance) {
      ui = uiInstance;
    },
    addCurrentPositionMarker: function addCurrentPositionMarker(coordinates) {
      var
        icon = new H.map.DomIcon('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><path fill="' + Config.map.colors.currentPosition + '" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>'),
        marker = new H.map.DomMarker(coordinates, {icon: icon});

      map.addObject(marker);
    },
    showPointLabel: function showPointLabel(location) {
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
    showPlaceBubble: function showPlaceBubble(place) {
      if (pointLabelBubble) {
        pointLabelBubble.close();
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
    }
  };
}

module.exports = markersService;
