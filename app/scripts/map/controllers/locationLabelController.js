'use strict';

var utils = require('../../common').utils;

locationLabelController.$inject = ['SearchService', 'UtilService', '$location', 'MapService', '$state'];

function locationLabelController(SearchService, UtilService, $location, MapService, $state) {
  this.geo = {
    lat: 0,
    lng: 0
  };
  function updateLabelFn(location, place) {
    if (location) {
      this.title = location.Location.Address.Label.split(',')[0];
      this.locationId = location.Location.LocationId;
      this.url = '/locations/' + this.locationId + '/';
      this.geo.lat = location.Location.DisplayPosition.Latitude;
      this.geo.lng = location.Location.DisplayPosition.Longitude;
    } else {
      this.title = place.name;
      this.placeId = place.placeId;
      this.url = '/places/' + this.placeId + '/';
      this.geo.lat = place.location.position[0];
      this.geo.lng = place.location.position[1];
    }
  }
  var updateLabel = updateLabelFn.bind(this);
  this.setLocation = function setLocation(location) {
    updateLabel(location);
  };
  this.setPlace = function setPlace(place) {
    updateLabel(null, place);
  };
  this.searchPlace = function searchPlace() {
    SearchService.search(this.geo.lat + ',' + this.geo.lng).then(function success(items) {
      var item = items[0];
      if (item && item.id) {
        $location.path('/places/' + item.id + '/').search({
          map: utils.getMapStringfromMap(item.position, MapService.getMap())
        });
      }
    }, function error(err) {
      UtilService.showErrorMessage('Can not find place for your location', err);
    });
  };
}

module.exports = locationLabelController;
