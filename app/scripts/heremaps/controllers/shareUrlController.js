'use strict';
shareUrlController.$inject = [
  '$location',
  'UserService',
  'UtilService'
];

function shareUrlController($location, UserService, UtilService) {

  this.disabled = true;
  this.showTooltip = false;
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
        this.showTooltip = true;
        this.autoSelectOptions.end = this.url.length;
      }
      console.log(response);
    }.bind(this), function error(err) {
      UtilService.showErrorMessage('Can not short url', err);
    });
  };
}
module.exports = shareUrlController;

