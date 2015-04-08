'use strict';
shareUrlController.$inject = [
  '$location',
  'UserService',
  'UtilService'
];

/**
 * @class
 * @name ShareUrlController
 * @param {$location} $location
 * @param {UserService} UserService
 * @param {UtilService} UtilService
 */
function shareUrlController($location, UserService, UtilService) {

  /** @type {boolean} - is sharing disabled */
  this.disabled = true;
  /** @type {boolean} - is tooltip shown */
  this.showTooltip = false;
  /** @type {string} - shortened url */
  this.url = '';
  this.autoSelectOptions = {
    start: 0,
    end: 0
  };

  this.createUrl = function createUrl() {
    this.autoSelectOptions.end = 0;
    UserService.shortUrl($location.absUrl()).then(function success(response) {
      if (response.data && response.data.data && response.data.data.url) {
        this.url = response.data.data.url;
        //close tooltip
        this.showTooltip = true;
        //set user select
        this.autoSelectOptions.end = this.url.length;
      } else {
        UtilService.showErrorMessage('Can not short url');
      }
    }.bind(this), function error(err) {
      UtilService.showErrorMessage('Can not short url', err);
    });
  };
}
module.exports = shareUrlController;

